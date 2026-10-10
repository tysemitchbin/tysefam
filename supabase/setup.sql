-- ════════════════════════════════════════════════════════════════
--  TYSE FAM — Supabase setup for the family site's shared data.
--  Run in Supabase → SQL Editor. Safe to run again.
--
--  • allowed_emails  the family guest list (shared with Wanderlings).
--                    Only these emails can create an account.
--  • family_items    every tool's data: tool → collection → item (JSON)
--  Only signed-in people on the guest list can read or change anything.
--  Wanderlings' own tables (game_state, garden_shares, rwgps_*) are separate.
-- ════════════════════════════════════════════════════════════════

-- The guest list. (Wanderlings created it first; this only fills in what's missing.)
create table if not exists public.allowed_emails (
  email text primary key check (email = lower(email))
);
alter table public.allowed_emails add column if not exists display_name text;
alter table public.allowed_emails enable row level security;
-- no policies: only the SQL Editor / server code can read or change it

-- Block sign-ups from anyone not on the guest list (skipped if it already exists).
do $$ begin
  if not exists (select 1 from pg_proc where proname = 'enforce_email_allowlist' and pronamespace = 'public'::regnamespace) then
    create function public.enforce_email_allowlist()
    returns trigger language plpgsql security definer set search_path = '' as $f$
    begin
      if not exists (select 1 from public.allowed_emails a where a.email = lower(new.email)) then
        raise exception 'This email is not invited';
      end if;
      return new;
    end; $f$;
    revoke execute on function public.enforce_email_allowlist() from public, anon, authenticated;
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'enforce_email_allowlist' and tgrelid = 'auth.users'::regclass) then
    create trigger enforce_email_allowlist before insert on auth.users
      for each row execute function public.enforce_email_allowlist();
  end if;
end $$;

-- "Is the person making this request on the guest list?"  Used by every rule below.
-- security definer so it can read allowed_emails, which signed-in users can't.
create or replace function public.is_family()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.allowed_emails
    where email = lower((select auth.jwt() ->> 'email'))
  );
$$;
revoke all on function public.is_family() from public, anon;
grant execute on function public.is_family() to authenticated;

-- The signed-in person's name on the site (null if they're not on the guest list).
create or replace function public.family_whoami()
returns text
language sql stable security definer
set search_path = ''
as $$
  select coalesce(display_name, split_part(email, '@', 1))
  from public.allowed_emails
  where email = lower((select auth.jwt() ->> 'email'));
$$;
revoke all on function public.family_whoami() from public, anon;
grant execute on function public.family_whoami() to authenticated;

-- Every tool's saved data.
-- An item's id is text and only has to be unique inside its tool + collection, so a tool can
-- use a friendly id such as a person's name: store.set('progress', 'Mitch', {...}).
create table if not exists public.family_items (
  id          text not null default gen_random_uuid()::text,
  tool        text not null,             -- folder name under tools/
  collection  text not null,             -- e.g. 'items', 'chores', 'settings'
  data        jsonb not null default '{}'::jsonb,
  created_by  uuid default auth.uid() references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (tool, collection, id)
);
-- Older setups made id a uuid (the only key), which rejected friendly ids. Upgrade them.
do $$ begin
  if (select data_type from information_schema.columns
      where table_schema = 'public' and table_name = 'family_items' and column_name = 'id') = 'uuid' then
    alter table public.family_items drop constraint family_items_pkey;
    alter table public.family_items alter column id drop default;
    alter table public.family_items alter column id type text using id::text;
    alter table public.family_items alter column id set default gen_random_uuid()::text;
    alter table public.family_items add primary key (tool, collection, id);
  end if;
end $$;
drop index if exists public.family_items_tool_idx;   -- the primary key now covers (tool, collection)
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
--  ADDING A FAMILY MEMBER  (run this part on its own, any time)
--
--  insert into public.allowed_emails (email, display_name)
--  values ('their@email.com', 'Their name')
--  on conflict (email) do update set display_name = excluded.display_name;
--
--  Then they open any tool → "First time? Create a password".
-- ════════════════════════════════════════════════════════════════
