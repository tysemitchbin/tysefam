-- ════════════════════════════════════════════════════════════════
--  TYSE FAM — Supabase setup. Run once in Supabase → SQL Editor.
--  Safe to run again: everything is "if not exists" / "or replace".
--
--  • family_members  who's allowed in (one row per family account)
--  • family_items    every tool's data: tool → collection → item (JSON)
--  Only signed-in family members can read or change anything.
-- ════════════════════════════════════════════════════════════════

-- Who's in the family. Rows point at real accounts (not just an email
-- string), so nobody can get in by signing up with someone else's address.
create table if not exists public.family_members (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  name     text not null,
  added_at timestamptz not null default now()
);
alter table public.family_members enable row level security;

-- "Is the person making this request in the family?"  Used by every rule below.
-- security definer so it can read family_members without tripping its own rules.
create or replace function public.is_family()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (select 1 from public.family_members where user_id = (select auth.uid()));
$$;
revoke all on function public.is_family() from public, anon;
grant execute on function public.is_family() to authenticated;

drop policy if exists "family sees family" on public.family_members;
create policy "family sees family" on public.family_members
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_family()));
-- No insert/update/delete policies: members are added by you in the SQL Editor (see bottom).

-- Every tool's saved data.
create table if not exists public.family_items (
  id          uuid primary key default gen_random_uuid(),
  tool        text not null,             -- folder name under tools/
  collection  text not null,             -- e.g. 'items', 'chores', 'settings'
  data        jsonb not null default '{}'::jsonb,
  created_by  uuid default auth.uid() references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists family_items_tool_idx on public.family_items (tool, collection);
create index if not exists family_items_created_by_idx on public.family_items (created_by);
alter table public.family_items enable row level security;

drop policy if exists "family reads"   on public.family_items;
drop policy if exists "family adds"    on public.family_items;
drop policy if exists "family edits"   on public.family_items;
drop policy if exists "family deletes" on public.family_items;
create policy "family reads"   on public.family_items for select to authenticated using ((select public.is_family()));
create policy "family adds"    on public.family_items for insert to authenticated with check ((select public.is_family()));
create policy "family edits"   on public.family_items for update to authenticated using ((select public.is_family())) with check ((select public.is_family()));
create policy "family deletes" on public.family_items for delete to authenticated using ((select public.is_family()));

create or replace function public.family_touch()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end; $$;
drop trigger if exists family_items_touch on public.family_items;
create trigger family_items_touch before update on public.family_items
  for each row execute function public.family_touch();

-- Live updates: changes show up on everyone's screen without refreshing.
do $$ begin
  alter publication supabase_realtime add table public.family_items;
exception when duplicate_object then null; end $$;


-- ════════════════════════════════════════════════════════════════
--  ADDING A FAMILY MEMBER  (run this part separately, any time)
--  1. They open any tool on the site → "First time? Create account".
--  2. You run this, with their email and the name to show on the site:
--
--  insert into public.family_members (user_id, name)
--  select id, 'Mitch' from auth.users where email = 'their@email.com'
--  on conflict (user_id) do update set name = excluded.name;
--
--  3. They tap "I've been added". Done.
-- ════════════════════════════════════════════════════════════════
