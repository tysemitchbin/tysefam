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

  /* Where family data is saved (Supabase project "Tyse Fam"). Shared by every tool.
     Both values are meant to be public: the guest list + database rules are what
     keep data private. Blank them out to save in each browser only. */
  supabase: {
    url: 'https://bhjyybdztvmpyzynkvje.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoanl5YmR6dHZtcHl6eW5rdmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MzQ3MTcsImV4cCI6MjEwNzExMDcxN30.qjm845xs5RRwTN_wYzSVp4WOsyMBns0F20oxT64-1oc'
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
      id: 'wanderlings',
      name: 'Wanderlings',
      emoji: '🥚',
      description: 'Every walk hatches an egg. Collect creatures, grow a garden, and wander a little further.',
      color: 'blossom'
    },
    {
      id: 'statsborger',
      name: 'Statsborgerprøven',
      emoji: '📚',
      description: 'Study for the Norwegian citizenship test: notes, practice questions, timed mock exams and flashcards.',
      color: 'sky'
    },
    {
      id: 'teoriprove',
      name: 'Teoriprøven',
      emoji: '🚗',
      description: 'Study for the class B driving theory test: notes, road signs, practice questions, timed mock exams and flashcards.',
      color: 'peach'
    },
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
