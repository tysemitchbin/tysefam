# 🏔️ Tyse Fam

Our family website: a home page with a growing collection of little web tools.
Plain HTML/CSS/JS with no build step.

**Tools so far:** 🥚 [Wanderlings](tools/wanderlings/README.md), a walking game where every walk hatches a creature.

```
index.html                 home page: lists every tool from site.js
site.js                    ← site name, Supabase settings, list of tools
shared/family.css          shared look (colours, cards, buttons, lists…)
shared/family.js           shared helpers: saving data, sign-in, menu bar
tools/<tool-id>/           one folder per tool
tools/wanderlings/         the walking game
tools/new-tool-template/   starter tool to copy
supabase/setup.sql         database setup for shared family data
supabase/functions/rwgps/  Wanderlings' Ride with GPS bridge (server code)
```

## How it's hosted

| Piece | Where |
|---|---|
| Website | **GitHub Pages** → https://tysemitchbin.github.io/tysefam/. Updates by itself a minute or two after anything lands on `main`. |
| Sign-in, data | **Supabase** project `bhjyybdztvmpyzynkvje` (Tyse Fam). One email + password works in every tool. |
| Who's allowed in | The guest list, table `allowed_emails`. Only those emails can create an account. |
| Shared tool data | Table `family_items` (via `Family.store`). Wanderlings keeps its own tables. |

Everything uses relative links, so the site works at any address (a domain root or a sub-path like `/tysefam/`).

## Adding a new tool

1. Copy `tools/new-tool-template/` to `tools/<your-tool-id>/` (lowercase, dashes, e.g. `chore-chart`).
2. In the new `index.html`, set `TOOL_ID` and `<body data-tool="…">` to that id.
3. Add it to the `tools` list in `site.js`:
   ```js
   { id: 'chore-chart', name: 'Chore Chart', emoji: '🧹',
     description: 'Who does what this week.', color: 'peach' },
   ```
4. Get it onto `main`. A minute or two later it's live on the home page and in every tool's ☰ menu.

Tip: add `hidden: true` while you're still building a tool. It works at its URL but stays off the home page.

### Saving data in a tool

```js
const store = Family.store('chore-chart');           // this tool's own data

store.watch('chores', chores => draw(chores));        // { id: item, … }, updates live
const id = await store.add('chores', { text: 'Bins', done: false });  // adds ts + by
store.update('chores', id, { done: true });           // change some fields
store.remove('chores', id);
store.set('settings', 'main', { theme: 'dark' });     // fixed id, handy for settings
Family.entries(chores)                                // [id, item] pairs, oldest first
Family.me()                                           // "Mitch"
```

The first time someone opens a tool on a device, they sign in (same email and password as
Wanderlings). After that, changes sync live between everyone's devices.

Tools that outgrow this (big data, files, heavy queries) can have their own Supabase
tables, like Wanderlings does. Add their SQL to `supabase/`.

## Adding a family member

In Supabase → **SQL Editor**:

```sql
insert into public.allowed_emails (email, display_name)
values ('their@email.com', 'Their name');
```

Then they open the site, pick any tool, and tap **First time? Create a password**.
("Confirm email" must stay switched off in Supabase → Authentication → Sign In / Providers → Email.
No emails are ever sent; the guest list decides who can join.)

## Running it on your computer

You don't need to: GitHub Pages publishes the site for you. For a private preview before
merging, run `node dev-server.js` in this folder and visit http://localhost:3000 (it talks to the
real Supabase project).
