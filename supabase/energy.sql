-- ════════════════════════════════════════════════════════════════
-- ENERGY PAGE (tools/energy/): private tables for the `energy` edge function.
-- Safe to run more than once.
--
-- All three have RLS on and NO policies: the website can't read them at all,
-- only the edge function (service role) can. That's what keeps the tokens secret
-- even though the website's code is public.
-- ════════════════════════════════════════════════════════════════

-- Logins for outside services: one row per Tibber login, Elvia token, the Enable Banking
-- app's private key ('enablebanking'), each bank connection ('bank'), and the secret the
-- daily bank check sends ('cron').
create table if not exists public.energy_accounts (
  id           uuid primary key default gen_random_uuid(),
  provider     text not null,
  external_id  text not null,           -- the provider's id for the login (stops duplicates)
  name         text,                    -- friendly name shown on the page
  token        text not null,
  meta         jsonb not null default '{}'::jsonb,   -- e.g. Elvia meter numbers
  added_by     uuid references auth.users(id) on delete set null,
  added_at     timestamptz not null default now(),
  unique (provider, external_id)
);
alter table public.energy_accounts enable row level security;
revoke all on public.energy_accounts from anon, authenticated;
alter table public.energy_accounts drop constraint if exists energy_accounts_provider_check;
alter table public.energy_accounts add constraint energy_accounts_provider_check
  check (provider in ('tibber', 'elvia', 'enablebanking', 'bank', 'cron'));

-- The first version kept Tibber logins in their own table. Move them over.
do $$ begin
  if to_regclass('public.tibber_accounts') is not null then
    insert into public.energy_accounts (provider, external_id, name, token, added_by, added_at)
      select 'tibber', tibber_user_id, name, token, added_by, added_at from public.tibber_accounts
      on conflict (provider, external_id) do nothing;
    drop table public.tibber_accounts;
  end if;
end $$;

-- Nord Pool spot prices per price area and day (NOK/kWh without VAT), copied from
-- hvakosterstrommen.no so each day is only fetched once. Needed for strømstøtte/Norgespris.
create table if not exists public.spot_prices (
  area    text not null,                -- NO1 … NO5
  day     date not null,
  prices  jsonb not null,               -- [{ "t": "2026-10-09T00:00:00+02:00", "p": 1.2587 }, …]
  primary key (area, day)
);
alter table public.spot_prices enable row level security;
revoke all on public.spot_prices from anon, authenticated;

-- Saved answers, so the page doesn't ask Tibber/Elvia for months of hourly data on every visit.
create table if not exists public.energy_cache (
  key         text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);
alter table public.energy_cache enable row level security;
revoke all on public.energy_cache from anon, authenticated;

-- ════════════════════════════════════════════════════════════════
-- Daily bank check: every morning at 06:15 UTC (08:15 in summer, 07:15 in winter)
-- the database asks the `energy` function to read new bill payments from the bank.
-- It proves who it is with a random secret kept in energy_accounts (provider 'cron').
-- ════════════════════════════════════════════════════════════════
create extension if not exists pg_cron;
create extension if not exists pg_net;

insert into public.energy_accounts (provider, external_id, name, token)
select 'cron', 'daily-bank-check', 'Daily bank check',
       replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
where not exists (select 1 from public.energy_accounts where provider = 'cron');

select cron.unschedule('energy-bank-sync') where exists (select 1 from cron.job where jobname = 'energy-bank-sync');
select cron.schedule('energy-bank-sync', '15 6 * * *', $$
  select net.http_post(
    url := 'https://bhjyybdztvmpyzynkvje.supabase.co/functions/v1/energy/bank/sync',
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-cron-secret', (select token from public.energy_accounts where provider = 'cron' limit 1)),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000)
$$);
