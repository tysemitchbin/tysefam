# 🏔️ Tyse Fam

Our family website: a home page with a growing collection of little web tools.
Plain HTML/CSS/JS with no build step, hosted on GitHub Pages.

```
index.html                 home page: lists every tool from site.js
site.js                    ← site name, Supabase settings, list of tools
shared/family.css          shared look (colours, cards, buttons, lists…)
shared/family.js           shared helpers: saving data, sign-in, menu bar
tools/<tool-id>/index.html one folder per tool
tools/new-tool-template/   starter tool to copy
supabase/setup.sql         database setup (run once in Supabase)
```

## Adding a new tool

1. Copy `tools/new-tool-template/` to `tools/<your-tool-id>/` (lowercase, dashes, e.g. `chore-chart`).
2. In the new `index.html`, set `TOOL_ID` and `<body data-tool="…">` to that id.
3. Add it to the `tools` list in `site.js`:
   ```js
   { id: 'chore-chart', name: 'Chore Chart', emoji: '🧹',
     description: 'Who does what this week.', color: 'peach' },
   ```
4. Commit and push. It appears on the home page and in every tool's ☰ menu.

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

Until Supabase is connected, everything saves in each browser only (the badge says
"📴 This device only"). Once it's connected, the same code syncs between everyone's
devices with no changes needed.

Tools that outgrow this (big data, files, heavy queries) can have their own Supabase
tables; add them to `supabase/` as another `.sql` file.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com) (the free plan allows 2 active projects).
2. **SQL Editor** → paste all of `supabase/setup.sql` → **Run**.
3. **Authentication → Sign In / Providers → Email**: turn **off** "Confirm email".
   That lets family members sign up without email setup. It's still safe: a new account
   can't see anything until you add it to the family list.
4. **Project Settings → API**: copy the **Project URL** and the **publishable** (or `anon`) key
   into `supabase: { url, key }` in `site.js`. Commit and push.
5. Open any tool → **First time? Create account**. Then add yourself in the **SQL Editor**:
   ```sql
   insert into public.family_members (user_id, name)
   select id, 'Mitch' from auth.users where email = 'you@example.com';
   ```
   Tap **I've been added**. Repeat for each family member.

## Running it on your computer

Open a terminal in this folder and run `python3 -m http.server`, then visit
<http://localhost:8000>. Opening `index.html` directly mostly works too.
