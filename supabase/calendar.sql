-- ════════════════════════════════════════════════════════════════
-- CALENDAR PAGE (tools/calendar/): the private calendar links for the `calendar` edge function.
-- Safe to run more than once.
--
-- RLS on and NO policies: the website can't read this table at all, only the edge function
-- (service role) can. Anyone with a calendar's secret link can see that whole calendar, so
-- the links must never reach the browser (the website's code is public).
-- ════════════════════════════════════════════════════════════════

create table if not exists public.calendar_feeds (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,                     -- shown on the page, e.g. "Tyse Fam"
  color     text not null default 'meadow',    -- meadow | sky | peach | blossom | sun
  url       text not null unique,              -- the secret .ics address
  added_by  uuid references auth.users(id) on delete set null,
  added_at  timestamptz not null default now()
);
alter table public.calendar_feeds enable row level security;
revoke all on public.calendar_feeds from anon, authenticated;
