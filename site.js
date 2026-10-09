/* ════════════════════════════════════════════════════════════════
   SITE SETTINGS — the one file you edit to add a new tool.

   To add a tool:
     1. Copy  tools/new-tool-template/  to  tools/<your-tool-id>/
     2. Add an entry to `tools` below (same id as the folder name).
     3. Commit & push. It shows up on the home page automatically.
═════════════════════════════════════════════════════════════════ */
window.SITE = {
  name: 'Tyse Fam',
  tagline: 'our little corner of the internet',

  // Used for the greeting on the home page.
  people: ['Mitch', 'Ellie'],

  /* Where family data is saved. Leave blank to save in each browser only.
     To connect: see "Connecting Supabase" in README.md. Both values come from
     Supabase → Project Settings → API. The publishable (anon) key is meant to be
     public; the family sign-in + database rules are what keep data private. */
  supabase: {
    url: '',   // e.g. 'https://abcdefgh.supabase.co'
    key: ''    // e.g. 'sb_publishable_…'
  },

  /* Every tool on the site, in the order they appear on the home page.
       id          folder name under tools/ (also keeps its saved data separate)
       name        shown on the card and in the menu
       emoji       card icon
       description one short line
       color       meadow | sky | peach | blossom | sun
       hidden      true = keep it off the home page (e.g. while building it) */
  tools: [
    {
      id: 'new-tool-template',
      name: 'New Tool Template',
      emoji: '🧪',
      description: 'Starter page to copy when building a new tool.',
      color: 'sky',
      hidden: true
    }
  ]
};
