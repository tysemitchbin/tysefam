// Supabase settings come from the family site's /site.js (loaded by index.html),
// so every tool talks to the same project with the same sign-in.
// Both values are safe to ship to the browser: the database is protected by
// row-level security, and the Ride with GPS secret lives only in the edge function.
export const SUPABASE_URL = window.SITE.supabase.url;
export const SUPABASE_ANON_KEY = window.SITE.supabase.key;
