-- ════════════════════════════════════════════════════════════════
-- HEALTH PAGE (tools/health/): one person's own Garmin data.
-- Safe to run more than once.
--
-- Unlike family_items, this is NOT shared with the family: each row can only be
-- read by the person it belongs to (matched on their name from family_whoami()).
--
-- The data is uploaded by the Garmin sync script on Mitch's computer
-- (D:\Documents\Claude projects\garmin-ai\sync_garmin.py), which calls
-- health_upload() with a secret upload key. Only a hash of that key is stored here;
-- the key itself lives in a file on that computer and never in this (public) repo.
-- ════════════════════════════════════════════════════════════════

-- The data: one row per person, the whole garmin/data.json as it is after each sync.
create table if not exists public.health_data (
  owner       text primary key,          -- display name, e.g. 'Mitch' (as family_whoami() returns it)
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);
alter table public.health_data enable row level security;
revoke all on public.health_data from anon, authenticated;
grant select on public.health_data to authenticated;

drop policy if exists "owner reads own health" on public.health_data;
create policy "owner reads own health" on public.health_data for select to authenticated
  using (owner = (select public.family_whoami()));

-- Upload keys: a hash of each person's secret key. RLS on, no policies: nobody can read it
-- from the website; only health_upload() below looks at it.
create table if not exists public.health_upload_keys (
  owner     text primary key,
  key_hash  text not null              -- sha256 of the key, hex
);
alter table public.health_upload_keys enable row level security;
revoke all on public.health_upload_keys from anon, authenticated;

-- Called by the sync script (no sign-in, just the key). Replaces that person's data.
create or replace function public.health_upload(upload_key text, payload jsonb)
returns text
language plpgsql security definer
set search_path = ''
as $$
declare
  who text;
begin
  select k.owner into who from public.health_upload_keys k
  where k.key_hash = encode(extensions.digest(upload_key, 'sha256'), 'hex');
  if who is null then
    raise exception 'Unknown upload key' using errcode = '28000';
  end if;
  insert into public.health_data (owner, data, updated_at) values (who, payload, now())
  on conflict (owner) do update set data = excluded.data, updated_at = now();
  return who;
end;
$$;
revoke all on function public.health_upload(text, jsonb) from public;
grant execute on function public.health_upload(text, jsonb) to anon, authenticated;

-- To add (or replace) someone's upload key, run with the sha256 hex of the new key:
--   insert into public.health_upload_keys (owner, key_hash) values ('Mitch', '<hash>')
--   on conflict (owner) do update set key_hash = excluded.key_hash;
