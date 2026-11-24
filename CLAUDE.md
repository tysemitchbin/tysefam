# Tyse Fam: notes for Claude

Family website: a hub page plus one folder per tool. Static files only, with no build step,
bundler or npm. The owner isn't a programmer: never ask them to run terminal commands, and keep
code readable and commented for a non-expert.

## Layout
- `site.js`: `window.SITE`: site name, `people`, `supabase {url,key}`, and the `tools` registry.
  The home page and the ☰ menu are generated from `tools`.
- `shared/family.js`: `window.Family`: `store(toolId)`, `me()`, `forMe(tool)`, `entries()`, `esc()`, `url()`, `signOut()`,
  `client()`, `peek()` (client only if already signed in, never shows the sign-in card),
  `call(fn, route, body)` (call an edge function as the signed-in person) and
  `archived()/archivedNow()/setArchived(ids)` (tools each person has archived: hidden from their home
  page and ☰ menu, brought back from the "Archived tools" box on the home page; saved in `family_items`
  tool `home`, collection `archived`, id = their name, with a copy in localStorage).
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
- `tools/norskprove/`: study tool for HK-dir's Norskprøven at B1–B2 (same pattern as `teoriprove`).
  `data.js` = grammar notes/questions, word cards, phrases; `oppgaver.js` = reading texts, listening
  clips, writing and speaking tasks (all written for the tool). Listening uses the browser's own
  speech synthesis (needs a Norwegian voice on the device). Progress per person in collection
  `progress`; written texts + feedback shared in collection `texts`. Recordings never leave the browser.
- `tools/health/`: Mitch's Garmin recovery/training dashboard (`only: ['Mitch']` in `site.js`, so
  it's hidden from others' home page and menu). NOT family-shared: data is in `health_data`
  (`supabase/health.sql`), one row per person, RLS = `owner = family_whoami()`. It's uploaded by
  the sync script on Mitch's PC (`D:\Documents\Claude projects\garmin-ai\sync_garmin.py`) via the
  `health_upload(upload_key, payload)` RPC; only a hash of the key is stored. The page drops the
  data into `dashboard-template.html` (a copy of garmin-ai's `dashboard_template.html`, no data in
  it) and shows it in a frame. Never commit health data to this public repo.
- `tools/baseball/`: Mitch's career baseball stats (college, London Mets, Bergen Wet Sox incl. NM i
  Baseball). View-only: the numbers are in `data.js` (one line per season; add new seasons there),
  the page works out AVG/OBP/ERA etc., totals and Chart.js charts. Brought over from
  `D:\Documents\Claude projects\Baseball Stat` (its SQLite DB/build scripts are no longer needed).
- `tools/baby-moves/`: floor play and motor milestones, 5–18 months, from Mitch's doc "Baby Acrobatics".
  `data.js` = the guide's words (stages, exercises, clinics, safety, equipment, tracker, red flags);
  tracker keys in it are what ticks are saved under, so don't rename them. `illus.js` = simple SVG
  diagrams (one per exercise `s1-0`…, game `g-0`…, crawl pattern `c-0`…), built from shared poses/props. Shared in `family_items`
  (tool `baby-moves`: `baby` (name, birthday, due date, stage), `skills`, `log` per day, `setup`).
- `tools/trx/`: TRX (suspension strap) exercise database, workouts and a workout timer.
  `data.js` = exercises (strap length, position, steps, cues, easier/harder) + ready-made workouts;
  exercise ids are used by saved workouts and the diagrams, so don't rename them. `illus.js` = start → finish
  diagrams drawn from joint angles: side view for most, a front/above view (`v: 'front'`/`'top'`) for
  sideways and twisting moves (how a pose is written is explained in the file).
  Shared in `family_items` (tool `trx`: `workouts` the family built, `log` of finished workouts). The
  timer beeps, can speak (browser speech), and keeps the screen awake; the draft being built is per device.
- `tools/cookbook/`: the family recipe collection, drawn as a bookshelf (pages by `#`: shelf, `#b=cat:val`
  one book of recipe spines between bookends, `#r=id` a recipe, `#cal=YYYY-MM` cooking calendar).
  Paste a link or a whole recipe. Links go to the `recipes` edge function (`supabase/functions/recipes/`,
  verify_jwt ON, checks the guest list): it tries the site, then the r.jina.ai reader, then the Wayback
  Machine (many sites block cloud servers), reads schema.org Recipe JSON-LD, or sends back the page text.
  `guess.js` (`window.Cook`) reads pasted text and guesses meal, main protein, cuisine, time, difficulty,
  cost and labels by keyword spotting (English + Norwegian); the edit box shows the guesses before saving.
  Category ids in `Cook.CATS` are what's saved, so don't rename them. Parts of a dish (the meat, the
  sauce, the rice) are heading lines ending in ":" inside `ingredients`/`steps`; `Cook.parts()` pairs them
  up, the recipe page has a button per part and the edit box a box per part (steps keep cooking order);
  the edge function reads ingredient groups from WP Recipe Maker / Tasty Recipes pages. `prices.js`
  (`Cook.price`) costs a dish in kr from typical Norwegian prices; the Cost group is the kr band (under 100,
  100–200 … over 500), or `priceNok` if someone typed the real cost. **Update its PRICES table now and then.**
  `timing.js` (`Cook.estimate`) works
  out a realistic time from the ingredients and steps (knife work, batches, water boiling, oven heating,
  caramelising…); the page shows the family's own logged times first, else that estimate × a "kitchen
  speed" learned from logged cooks vs estimates; the recipe's own times are only shown for comparison.
  Shared in `family_items` (tool `cookbook`, collection `recipes`: also `favs` per person and
  `cooked: [{by, date, ts, min}]`, which feeds the calendar, the stats and the time learning).
  Shelf arrangement, search, ticks and the cooking timer are per device.
  `tools/cookbook/claude-skill/cookbook-recipes/SKILL.md` is a claude.ai skill that makes Claude write
  recipes in the layout `parseText` reads best; update it if the paste format changes.
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
