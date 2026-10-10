# Tyse Fam: notes for Claude

Family website: a hub page plus one folder per tool. Static files only, with no build step,
bundler or npm. The owner isn't a programmer: never ask them to run terminal commands, and keep
code readable and commented for a non-expert.

## Layout
- `site.js`: `window.SITE`: site name, `people`, `supabase {url,key}`, and the `tools` registry.
  The home page and the ☰ menu are generated from `tools`.
- `shared/family.js`: `window.Family`: `store(toolId)`, `me()`, `entries()`, `esc()`, `url()`, `signOut()`,
  `client()`, `peek()` (client only if already signed in, never shows the sign-in card) and
  `call(fn, route, body)` (call an edge function as the signed-in person).
  It injects the menu bar on pages with `<body data-tool="…">`, shows the sign-in card when Supabase is
  configured, and adds the tab icon + app manifest links to every page that loads it.
- `icons/` + `manifest.webmanifest`: the "Tyse" logo (letters are paths, no font needed) and the
  installable-app (PWA) details. No service worker, on purpose: nothing gets stuck in a cache.
- `shared/family.css`: design tokens (`--meadow`, `--forest`, `--cream`…) and components
  (`.wrap .card .addrow .btn .list .item .check .del .who-pill .empty .badge`).
- `tools/<id>/index.html`: each tool is self-contained. Start from `tools/new-tool-template/`.
- `supabase/setup.sql`: idempotent schema: the guest list `allowed_emails(email, display_name)`
  (sign-ups are blocked for emails not on it), `family_items(tool, collection, data jsonb)` with RLS
  via `public.is_family()`, `family_whoami()` for the display name, plus realtime.
- `tools/wanderlings/`: the walking game. It has its own Supabase code (`backend.js`) and tables
  (`game_state`, `garden_shares`, `rwgps_*`) and the `rwgps` edge function in
  `supabase/functions/rwgps/`. It shares the sign-in session with the rest of the site (same
  project, same origin).
- `index.html` (home): borrows `SPECIES`/`creatureSVG` from `tools/wanderlings/creatures.js` so a few
  creatures stroll on the header hills, and shows a "Coming up" box from the calendar via `Family.peek()`.
- `tools/calendar/`: view-only shared Google Calendar. The `calendar` edge function
  (`supabase/functions/calendar/`, verify_jwt ON, checks the guest list) reads each calendar's secret
  iCal link from `calendar_feeds` (`supabase/calendar.sql`; RLS on, no policies) and expands repeats
  with ical.js in `calendar/ics.ts`. The links must never reach the browser.
- `tools/packing/`: shared packing checklists in `family_items` (tool `packing`: `lists`, `items`, `trip`).
- `tools/energy/`: Tibber prices + usage per house, plus a Bills list. The page calls the `energy`
  edge function (`supabase/functions/energy/`), which reads Tibber/Elvia tokens from
  `energy_accounts` (`supabase/energy.sql`; RLS on, no policies, so the browser can't read it).
  Grid bills (BKK/Elvia) are worked out in `energy/grid.ts`: **update its price lists when BKK or
  Elvia change prices** (usually 1 Jan / 1 Jul) and the strømstøtte threshold each year.
  Real invoices live in `family_items` (tool `energy`, collection `invoices`). The main source is
  the bank: Enable Banking (`energy/bank.ts`, restricted mode = own accounts only) is read daily
  by a pg_cron job (`energy-bank-sync`, 06:15 UTC) that calls `energy/bank/sync` with the secret in
  `energy_accounts` (provider `cron`). Payments to Tibber/BKK/Elvia fill in or create bills. The
  `energy` function has verify_jwt OFF (bank callback + cron); every other route checks the family
  guest list itself. Houses ticked "Tenant" get a card with a monthly message of what the tenant owes
  (status in collection `tenant`). Older bills came from Gmail and a BKK export (`source` field).
  The old `tibber` edge function is a retired stub (delete it in the Supabase dashboard).

## Hosting
- GitHub Pages serves `main` from the repo root at https://tysemitchbin.github.io/tysefam/ and
  republishes on every push to `main`. The repo is public, so every file in it is public too.
- Local preview: `node dev-server.js` → http://localhost:3000 (`.claude/launch.json` runs it).
- Supabase project ref `bhjyybdztvmpyzynkvje` also holds the Zip Phrasers to Krill leaderboard in its
  own `zip` schema. Leave that schema alone.

## Adding a tool
1. Copy the template folder; set `TOOL_ID` and `data-tool` to the folder name.
2. Register it in `SITE.tools` in `site.js`.
3. Use `Family.store(TOOL_ID)` for data: `watch/add/update/set/remove/get(collection, …)`.
   Items are plain JSON objects; `add` stamps `ts` and `by`. Always `Family.esc()` user text
   before putting it in `innerHTML`.
4. Link shared files relatively (`../../site.js`, `../../shared/…`). The site may be served from a
   sub-path (e.g. GitHub Pages' `/tysefam/`), so never use root-absolute `/…` URLs.

## Conventions
- Match the existing look: Fredoka headings, Nunito body, soft cards, emoji icons, works at phone width.
- External scripts must be pinned to an exact version (e.g. `@supabase/supabase-js@2.45.4`).
- Only add a dedicated Supabase table when `family_items` really doesn't fit. Put its SQL in
  `supabase/` with RLS using `public.is_family()`.
- Never commit secrets. The Supabase publishable/anon key is public by design; a service-role key is not.
- Don't name a folder starting with `_`: GitHub Pages' Jekyll would skip it (`.nojekyll` is present, but stay safe anyway).
