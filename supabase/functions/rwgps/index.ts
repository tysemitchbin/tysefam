// Wanderlings — Ride with GPS bridge.
// Routes (all under /functions/v1/rwgps/):
//   GET  status      → is Ride with GPS configured / connected for this user?
//   POST authorize   → returns the Ride with GPS consent URL
//   GET  callback    → Ride with GPS redirects here; stores the token, bounces back to the app
//   GET  walks       → walking trips, trimmed to what the game needs
//                      (?owner=<uuid> for a garden someone shared with you)
//   POST disconnect  → forget the token
// Every route except `callback` requires a signed-in Supabase user.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CLIENT_ID = Deno.env.get('RWGPS_CLIENT_ID');
const CLIENT_SECRET = Deno.env.get('RWGPS_CLIENT_SECRET');
const API_KEY = Deno.env.get('RWGPS_API_KEY'); // optional; sent along if set
const START_DATE = Deno.env.get('START_DATE');
const RWGPS = 'https://ridewithgps.com';
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/rwgps/callback`;
const WALKING_KMH = 8; // anything slower than this counts as a walk, whatever its activity type

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const redirect = (to: string) => new Response(null, { status: 302, headers: { Location: to } });

async function currentUser(req: Request) {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await db.auth.getUser(token);
  return error ? null : data.user;
}

async function tokenRequest(params: Record<string, string>) {
  const res = await fetch(`${RWGPS}/oauth/token.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, ...params }),
  });
  if (!res.ok) throw new Error(`Ride with GPS token error ${res.status}: ${await res.text()}`);
  return res.json();
}

const expiresAt = (t: { created_at?: number; expires_in?: number }) =>
  t.expires_in ? (t.created_at || Math.floor(Date.now() / 1000)) + t.expires_in : null;

async function accessToken(userId: string) {
  const { data: t } = await db.from('rwgps_tokens').select('*').eq('user_id', userId).maybeSingle();
  if (!t) return null;
  // Ride with GPS tokens normally don't expire; refresh only if told they do.
  if (!t.expires_at || !t.refresh_token || t.expires_at - 60 > Date.now() / 1000) return t.access_token as string;
  const fresh = await tokenRequest({ grant_type: 'refresh_token', refresh_token: t.refresh_token });
  await db.from('rwgps_tokens').update({
    access_token: fresh.access_token, refresh_token: fresh.refresh_token ?? t.refresh_token,
    expires_at: expiresAt(fresh), updated_at: new Date().toISOString(),
  }).eq('user_id', userId);
  return fresh.access_token as string;
}

async function rwgps(path: string, token: string) {
  const headers: Record<string, string> = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  if (API_KEY) headers['x-rwgps-api-key'] = API_KEY;
  const res = await fetch(`${RWGPS}${path}`, { headers });
  if (!res.ok) throw new Error(`Ride with GPS API error ${res.status}: ${await res.text()}`);
  return res.json();
}

// The game wants local wall-clock time ("YYYY-MM-DDTHH:MM:SS") for time-of-day creatures.
function localStart(departedAt: string, timeZone: string | null) {
  if (timeZone) {
    try {
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
        timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
      }).formatToParts(new Date(departedAt)).map(p => [p.type, p.value]));
      return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
    } catch { /* not an IANA zone name; fall through */ }
  }
  // An explicit offset ("…-07:00") already is local wall-clock time.
  return departedAt.slice(0, 19);
}

function isWalk(trip: any) {
  const type = String(trip.activity_type || '');
  if (type.startsWith('walking')) return true;
  if (/^(driving|motorcycling|swimming|snow)/.test(type)) return false;
  const hours = (trip.moving_time || trip.duration || 0) / 3600;
  const kmh = hours ? trip.distance / 1000 / hours : 0;
  return kmh > 0 && kmh < WALKING_KMH;
}

async function fetchWalks(userId: string, token: string) {
  const since = START_DATE ? new Date(START_DATE) : new Date(Date.now() - 90 * 864e5);
  const trips: any[] = [];
  for (let page = 1; page <= 10; page++) {
    const body = await rwgps(`/api/v1/trips.json?page=${page}&page_size=200&stationary=false`, token);
    trips.push(...(body.trips || []));
    if (!body.meta?.pagination?.next_page_url) break;
  }
  const walks = trips.filter(t => t.departed_at && new Date(t.departed_at) >= since && isWalk(t));

  // Route shapes: cached, so only new walks cost an extra request.
  const ids = walks.map(t => t.id);
  const { data: cached } = ids.length
    ? await db.from('rwgps_polylines').select('trip_id, polyline').in('trip_id', ids)
    : { data: [] };
  const lines = new Map((cached || []).map(r => [Number(r.trip_id), r.polyline as string]));
  const missing = ids.filter(id => !lines.has(id));
  for (let i = 0; i < missing.length; i += 5) {
    const batch = missing.slice(i, i + 5);
    const got = await Promise.all(batch.map(async id => {
      try { return [id, (await rwgps(`/api/v1/trips/${id}/polyline.json`, token)).polyline?.data || ''] as const; }
      catch { return [id, ''] as const; }
    }));
    for (const [id, line] of got) lines.set(id, line);
    await db.from('rwgps_polylines').upsert(got.map(([id, line]) => ({ trip_id: id, user_id: userId, polyline: line })));
  }

  return walks.map(t => ({
    id: `rw-${t.id}`,
    name: t.name || 'Walk',
    start: localStart(t.departed_at, t.time_zone),
    distance: t.distance,
    movingTime: t.moving_time || t.duration || 0,
    elevation: t.elevation_gain || 0,
    polyline: lines.get(t.id) || '',
  }));
}

// Has `owner` shared their garden with the signed-in `viewer`?
async function canView(viewer: { email?: string }, owner: string) {
  const { data } = await db.auth.admin.getUserById(owner);
  const ownerEmail = data?.user?.email?.toLowerCase();
  if (!ownerEmail || !viewer.email) return false;
  const { data: share } = await db.from('garden_shares').select('owner_email')
    .eq('owner_email', ownerEmail).eq('viewer_email', viewer.email.toLowerCase()).maybeSingle();
  return Boolean(share);
}

function allowedReturn(origin: string | null) {
  if (!origin) return null;
  try {
    const u = new URL(origin);
    if (u.protocol === 'https:' || u.hostname === 'localhost' || u.hostname === '127.0.0.1') return u.origin;
  } catch { /* fall through */ }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = new URL(req.url);
  const route = url.pathname.split('/').filter(Boolean).pop();
  const configured = Boolean(CLIENT_ID && CLIENT_SECRET);

  try {
    if (route === 'callback') {
      const state = url.searchParams.get('state') || '';
      const { data: s } = await db.from('oauth_states').delete().eq('state', state).select().maybeSingle();
      if (!s || Date.now() - new Date(s.created_at).getTime() > 15 * 60e3) {
        return new Response('This sign-in link has expired. Please go back to Wanderlings and connect again.', { status: 400 });
      }
      if (url.searchParams.get('error') || !url.searchParams.get('code')) return redirect(`${s.return_to}/?rwgps=denied`);
      const t = await tokenRequest({ grant_type: 'authorization_code', code: url.searchParams.get('code')!, redirect_uri: REDIRECT_URI });
      await db.from('rwgps_tokens').upsert({
        user_id: s.user_id, access_token: t.access_token, refresh_token: t.refresh_token ?? null,
        expires_at: expiresAt(t), rwgps_user_id: t.user_id ?? null, updated_at: new Date().toISOString(),
      });
      return redirect(`${s.return_to}/?rwgps=connected`);
    }

    const user = await currentUser(req);
    if (!user) return json({ error: 'not_signed_in' }, 401);

    if (route === 'status') {
      const { data: t } = await db.from('rwgps_tokens').select('user_id').eq('user_id', user.id).maybeSingle();
      const { data: a } = await db.from('allowed_emails').select('display_name').eq('email', (user.email || '').toLowerCase()).maybeSingle();
      return json({ configured, connected: Boolean(t), displayName: a?.display_name ?? null });
    }

    if (route === 'authorize' && req.method === 'POST') {
      if (!configured) return json({ error: 'not_configured' }, 500);
      const returnTo = allowedReturn(req.headers.get('Origin'));
      if (!returnTo) return json({ error: 'bad_origin' }, 400);
      const state = crypto.randomUUID();
      await db.from('oauth_states').delete().lt('created_at', new Date(Date.now() - 3600e3).toISOString());
      await db.from('oauth_states').insert({ state, user_id: user.id, return_to: returnTo });
      const q = new URLSearchParams({ client_id: CLIENT_ID!, redirect_uri: REDIRECT_URI, response_type: 'code', state });
      return json({ url: `${RWGPS}/oauth/authorize?${q}` });
    }

    if (route === 'walks') {
      const owner = url.searchParams.get('owner');
      if (owner && owner !== user.id && !(await canView(user, owner))) return json({ error: 'not_shared' }, 403);
      const uid = owner || user.id;
      const token = await accessToken(uid);
      if (!token) return json({ error: 'not_connected' }, 401);
      return json({ walks: await fetchWalks(uid, token) });
    }

    if (route === 'disconnect' && req.method === 'POST') {
      await db.from('rwgps_tokens').delete().eq('user_id', user.id);
      await db.from('rwgps_polylines').delete().eq('user_id', user.id);
      return json({ ok: true });
    }

    return json({ error: 'not_found' }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});
