# Wanderlings 🥚

A gentle walking game. Every walk recorded in Ride with GPS hatches an egg with a creature inside. Creatures live in a little garden where you can name them and play with them, and they grow the more you walk together.

**Design rules:** any walk counts, the app never mentions pace or calories, the weekly goal is gentle, and nothing is lost by missing a day.

## How it's hosted

| Piece | Where | What it does |
|---|---|---|
| Web app (`public/`) | **Cloudflare** (Pages on Workers, project `wanderlings`) → https://wanderlings.tysemitchbin.workers.dev | The whole UI, a static site (`wrangler.jsonc` serves only `public/`) |
| Sign-in | **Supabase Auth** (project `Wanderlings`, ref `bhjyybdztvmpyzynkvje`) | Email + password (no emails sent). Only emails in `allowed_emails` can sign up. |
| Saved game | Supabase table `game_state` | Names, companion, hatched eggs, map eggs. Row-level security: each user sees only their own row. |
| Walk source | Supabase Edge Function `rwgps` | OAuth with Ride with GPS (the client secret lives only here), fetching walking trips + route shapes |
| Tokens & route cache | Supabase tables `rwgps_tokens`, `rwgps_polylines`, `oauth_states` | Server-only (RLS on, no policies) |

## One-time setup

1. **Invite people.** Run this in the Supabase SQL editor:
   ```sql
   insert into public.allowed_emails (email) values ('her@email.com');
   ```
2. **Turn off email confirmation.** Supabase → Authentication → Sign In / Providers → Email → switch off **Confirm email**.
   Sign-in is email + password and no emails are ever sent, so no SMTP is needed. The guest list still decides who can create an account.
3. Each person opens the site, taps **First time here? Create a password**, and picks a password.
4. **Ride with GPS API client** (free; any account can create it, e.g. Mitch's). Log in at ridewithgps.com, open https://ridewithgps.com/api/api_clients, create a client, and add this OAuth redirect URI:
   `https://bhjyybdztvmpyzynkvje.supabase.co/functions/v1/rwgps/callback`
5. **Secrets.** Supabase → Edge Functions → Secrets. Add:
   - `RWGPS_CLIENT_ID`
   - `RWGPS_CLIENT_SECRET`
   - optional `RWGPS_API_KEY` (the client's API key; only needed if Ride with GPS asks for it)
   - optional `START_DATE` (e.g. `2026-09-01`). By default, walks from the last 90 days count.
6. Ellie installs the free **Ride with GPS** app and records walks with it (activity: Walking — slow trips count anyway). In Wanderlings: ⚙ Settings → **Connect Ride with GPS**. Then add Wanderlings to her home screen.

## Develop & deploy

```
npm run dev       # http://localhost:3000 (talks to the real Supabase project)
npm run deploy    # pushes public/ to Cloudflare (wrangler deploy)
```

The edge function source is in `supabase/functions/rwgps/index.ts`. (Strava was dropped: since June 2026 its API needs a paid subscription.)

## How progression works

| Mechanic | What it rewards |
|---|---|
| Egg per walk | Showing up at all. A 5-minute walk counts. |
| Creature conditions | Variety: dawn, evening, Sundays, seasons, hills, 45+ min outside |
| ✨ Stretch walk → golden egg | Walking ~15% past her recent average (5-walk rolling, +0.3 to +1 km). The target rises as she does. |
| 🗺️ Map eggs | 3 eggs a week placed on real paths around home: nearby, stretch distance and a bit further. Each holds a creature you can only get this way. They last 2 weeks. |
| Companion growth | The chosen companion grows (Hatchling → Sprout → Grown → Radiant) with every km walked while it's the companion |
| Garden gifts | Total distance unlocks a pond, tree, bench, lanterns, cottage, rainbow… |

## Files

- `public/creatures.js` — the 26 species, encounter rules, progression maths, placeholder art
- `public/garden.js` — the living garden scene and creature actions
- `public/geo.js` — polylines, egg placement (snapped to OpenStreetMap paths), route matching
- `public/backend.js` / `config.js` — Supabase sign-in, saving, edge-function calls
- `public/app.js` — UI
- `CREATURE_PROMPTS.md` — Scenario prompts for real creature art (drop PNGs in `public/art/`)
