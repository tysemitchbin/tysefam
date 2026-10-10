// Tyse Fam: the Calendar page's server side (tools/calendar/ and the home page's "Coming up" box).
// Each calendar's private link (Google Calendar's "secret address in iCal format") is
// saved in `calendar_feeds` (see supabase/calendar.sql), which only this function can read.
// Anyone with that link can see the whole calendar, so it never goes to the browser.
//
// Routes (all under /functions/v1/calendar/), signed-in family members only:
//   GET  events?days=60    upcoming events from every saved calendar (&fresh=1 skips the 5-minute copy)
//   POST connect           { url, name, color }  check the link works, then save it
//   POST update            { feed, name, color } rename or recolour a calendar
//   POST disconnect        { feed }              forget a calendar
//
// ics.ts reads the calendar files.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { eventsBetween } from './ics.ts';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const COLORS = ['meadow', 'sky', 'peach', 'blossom', 'sun'];
const MAX_FILE = 15_000_000;   // bytes: a calendar file bigger than this is surely a mistake

// The signed-in person, but only if they're on the family guest list.
async function familyMember(req: Request) {
  const jwt = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!jwt) return null;
  const { data, error } = await db.auth.getUser(jwt);
  if (error || !data.user?.email) return null;
  const { data: row } = await db.from('allowed_emails').select('email')
    .eq('email', data.user.email.toLowerCase()).maybeSingle();
  return row ? data.user : null;
}

type Feed = { id: string; name: string; color: string; url: string };
async function feeds(): Promise<Feed[]> {
  const { data, error } = await db.from('calendar_feeds').select('id, name, color, url').order('added_at');
  if (error) throw error;
  return (data || []) as Feed[];
}
// What the page may see about a calendar: never the link itself.
const publicFeed = (f: Feed) => ({ id: f.id, name: f.name, color: f.color });

/* ───────── fetching calendar files (kept 5 minutes, so page loads stay quick) ───────── */
const saved = new Map<string, { at: number; text: string }>();
async function calendarFile(url: string, fresh = false) {
  const hit = saved.get(url);
  if (hit && !fresh && Date.now() - hit.at < 5 * 60e3) return hit.text;
  const res = await fetch(url, { headers: { Accept: 'text/calendar' }, redirect: 'follow' });
  if (res.status === 404) throw new Error('Google says this link doesn’t exist any more (was the secret address reset?).');
  if (!res.ok) throw new Error(`The calendar link answered with an error (${res.status}).`);
  const text = await res.text();
  if (text.length > MAX_FILE) throw new Error('That calendar file is too big to read.');
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error('That link isn’t a calendar file. Use the address ending in .ics.');
  saved.set(url, { at: Date.now(), text });
  return text;
}

// Google shows the link as https://…/basic.ics; other apps sometimes give webcal://…
function tidyUrl(raw: unknown) {
  let url = String(raw || '').trim().replace(/^webcals?:\/\//i, 'https://');
  try { const u = new URL(url); if (u.protocol !== 'https:') return null; url = u.href; }
  catch { return null; }
  return url;
}

/* ───────── GET events ───────── */
async function events(days: number, fresh: boolean) {
  const from = new Date(Date.now() - 864e5);           // from yesterday, so "today" is complete everywhere
  const to = new Date(Date.now() + days * 864e5);
  const list = await feeds();
  const problems: { feed: string; name: string; error: string }[] = [];
  const out: unknown[] = [];
  await Promise.all(list.map(async f => {
    try {
      const text = await calendarFile(f.url, fresh);
      out.push(...eventsBetween(text, from, to).map(e => ({ ...e, feed: f.id })));
    } catch (e) {
      problems.push({ feed: f.id, name: f.name, error: (e as Error).message });
    }
  }));
  return { feeds: list.map(publicFeed), events: out, problems };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const route = parts.slice(parts.indexOf('calendar') + 1).join('/');

  try {
    const user = await familyMember(req);
    if (!user) return json({ error: 'not_family' }, 401);

    if (route === 'events') {
      const days = Math.min(400, Math.max(1, Number(url.searchParams.get('days')) || 60));
      return json(await events(days, url.searchParams.get('fresh') === '1'));
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const name = String(body?.name || '').trim().slice(0, 60);
      const color = COLORS.includes(body?.color) ? body.color : 'meadow';

      if (route === 'connect') {
        const link = tidyUrl(body?.url);
        if (!link) return json({ error: 'Paste the whole link: it starts with https:// and ends with .ics.' }, 400);
        try { eventsBetween(await calendarFile(link, true), new Date(), new Date(Date.now() + 864e5)); }
        catch (e) { return json({ error: `That link didn’t work: ${(e as Error).message}` }, 400); }
        const { data, error } = await db.from('calendar_feeds')
          .insert({ name: name || 'Our calendar', color, url: link, added_by: user.id })
          .select('id, name, color, url').single();
        if (error) {
          if (error.code === '23505') return json({ error: 'That calendar is already added.' }, 400);
          throw error;
        }
        return json({ ok: true, feed: publicFeed(data as Feed) });
      }
      if (route === 'update') {
        if (!body?.feed) return json({ error: 'Which calendar?' }, 400);
        const { error } = await db.from('calendar_feeds')
          .update({ ...(name ? { name } : {}), color }).eq('id', body.feed);
        if (error) throw error;
        return json({ ok: true });
      }
      if (route === 'disconnect') {
        if (!body?.feed) return json({ error: 'Which calendar?' }, 400);
        const { error } = await db.from('calendar_feeds').delete().eq('id', body.feed);
        if (error) throw error;
        return json({ ok: true });
      }
    }

    return json({ error: 'not_found' }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});
