# Tyse Fam: notes for Claude

Family website: a hub page plus one folder per tool. Static files only, with no build step or
bundler (npm is only for the local preview server and `wrangler deploy` to Cloudflare). The owner
edits files directly, so keep code readable and commented for a non-expert.

## Layout
- `site.js`: `window.SITE`: site name, `people`, `supabase {url,key}`, and the `tools` registry.
  The home page and the ☰ menu are generated from `tools`.
- `shared/family.js`: `window.Family`: `store(toolId)`, `me()`, `entries()`, `esc()`, `url()`, `signOut()`.
  It injects the menu bar on pages with `<body data-tool="…">`, and shows the sign-in card when Supabase is configured.
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

## Hosting
- Cloudflare: `npm run deploy` publishes the repo root; `.assetsignore` lists what must NOT be
  published. Add new non-website files (scripts, notes, SQL) there.
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
