// Tyse Fam: the Energy page's server side (tools/energy/).
// Tokens for Tibber and Elvia never reach the browser: they live in `energy_accounts`
// (see supabase/energy.sql), which only this function can read.
//
// Routes (all under /functions/v1/energy/), signed-in family members only:
//   GET  homes             every Tibber home: prices now, usage, meter number, grid company
//   GET  bills?months=6    the grid bill (BKK/Elvia) worked out for each house and month
//                          (&fresh=1 skips the saved copy, &cabins=<meter>,<meter> marks cabins)
//   POST tibber/connect    { token }  check it with Tibber, then save it
//   POST elvia/connect     { token }  check it with Elvia, then save it
//   POST disconnect        { account } forget a saved login
//   Bank (Enable Banking), so bills fill themselves in from the payments:
//   POST bank/app          { appId, pem }  save the Enable Banking app's ID and private key
//   GET  bank/banks        Norwegian banks to choose from
//   POST bank/connect      { bank, returnTo }  start BankID; returns the address to go to
//   GET  bank/callback     (no sign-in: the bank sends the person back here)
//   POST bank/sync         read new payments now (also run daily by the database, with x-cron-secret)
//
// Files: tibber.ts / elvia.ts / bank.ts talk to those services, spot.ts fetches spot prices,
// grid.ts holds the grid price lists and does the bill maths.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { tibber, HOMES_QUERY, HOMES_BRIEF, tidyHome, tibberHours } from './tibber.ts';
import { elviaMeters, elviaHours } from './elvia.ts';
import { spotPrices } from './spot.ts';
import { companyKey, monthBill, osloHour, type Hour } from './grid.ts';
import { eb, norwegianBanks, startAuth, createSession, sessionAccounts, transactions, billPayments, saveBankPayments, type BankApp, type Payment } from './bank.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const db = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});
const BANK_CALLBACK = `${SUPABASE_URL}/functions/v1/energy/bank/callback`;
// Where the bank may send people back to: the live site, or a local preview.
const SITE = 'https://tysemitchbin.github.io/tysefam/tools/energy/';
const safeReturn = (url: unknown) =>
  typeof url === 'string' && /^(https:\/\/tysemitchbin\.github\.io\/|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/)/.test(url) ? url : SITE;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

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

// provider: 'tibber' / 'elvia' (tokens), 'enablebanking' (the bank app's key),
// 'bank' (a bank connection), 'cron' (the secret the daily database job sends).
type Account = { id: string; provider: string; external_id: string; name: string | null; token: string; meta: any };
async function accounts(provider?: string): Promise<Account[]> {
  let q = db.from('energy_accounts').select('id, provider, external_id, name, token, meta').order('added_at');
  if (provider) q = q.eq('provider', provider);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as Account[];
}
// What the page may see about the logins: never the token or key.
const publicAccount = (a: Account) => ({
  id: a.id, provider: a.provider, name: a.name, meters: a.meta?.meters || [],
  ...(a.provider === 'enablebanking' ? { appId: a.external_id } : {}),
  ...(a.provider === 'bank' ? { validUntil: a.meta?.validUntil, accounts: a.meta?.accounts || [], lastSync: a.meta?.lastSync,
    lastResult: a.meta?.lastResult } : {}),
});

/* ───────── GET homes ───────── */
async function homes() {
  const all = await accounts();
  const list: unknown[] = [];
  const problems: { account: string; name: string | null; error: string }[] = [];
  await Promise.all(all.filter(a => a.provider === 'tibber').map(async a => {
    try {
      const data = await tibber(a.token, HOMES_QUERY);
      list.push(...(data.viewer?.homes || []).map((h: any) => tidyHome(h, a)));
    } catch (e) {
      problems.push({ account: a.id, name: a.name, error: (e as Error).message });
    }
  }));
  return { accounts: all.filter(a => a.provider !== 'cron').map(publicAccount), homes: list, problems };
}

/* ───────── GET bills ───────── */
// The last `n` months in Norwegian time, oldest first: ['2026-05', …, '2026-10'].
function lastMonths(n: number) {
  const [y, m] = osloHour(new Date().toISOString()).slice(0, 7).split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (n - 1 - i), 1));
    return d.toISOString().slice(0, 7);
  });
}

async function bills(n: number, cabins: Set<string>) {
  const months = lastMonths(n);
  const since = months[0] + '-01';
  const problems: string[] = [];

  // Elvia meter readings, if an Elvia token is connected: the most exact source.
  const elviaData = new Map<string, Hour[]>();
  for (const a of await accounts('elvia')) {
    try { (await elviaHours(a.token, since)).forEach((hours, meter) => elviaData.set(meter, hours)); }
    catch (e) { problems.push(`Elvia (${a.name}): ${(e as Error).message}`); }
  }

  type House = { ean: string | null; homeId?: string; name: string; company: string | null; gridCompany: string | null;
    area: string | null; source: 'elvia' | 'tibber'; hours: Hour[] };
  const houses: House[] = [];
  for (const a of await accounts('tibber')) {
    try {
      const list = (await tibber(a.token, HOMES_BRIEF)).viewer?.homes || [];
      for (const h of list) {
        const ean = h.meteringPointData?.consumptionEan || null;
        const fromElvia = ean ? elviaData.get(ean) : undefined;
        houses.push({
          ean, homeId: h.id,
          name: h.appNickname || h.address?.address1 || 'House',
          company: companyKey(h.meteringPointData?.gridCompany),
          gridCompany: h.meteringPointData?.gridCompany || null,
          area: h.meteringPointData?.priceAreaCode || null,
          source: fromElvia ? 'elvia' : 'tibber',
          hours: fromElvia || await tibberHours(a.token, h.id, since),
        });
        if (ean) elviaData.delete(ean);
      }
    } catch (e) { problems.push(`Tibber (${a.name}): ${(e as Error).message}`); }
  }
  // Elvia meters that aren't on Tibber still get a house of their own.
  elviaData.forEach((hours, meter) => houses.push({
    ean: meter, name: `Elvia meter …${meter.slice(-4)}`, company: 'Elvia', gridCompany: 'Elvia AS',
    area: 'NO1', source: 'elvia', hours,
  }));

  const out = [];
  for (const h of houses) {
    const days = [...new Set(h.hours.map(x => x.local.slice(0, 10)))];
    let spot = new Map<string, number>();
    if (h.area && days.length) {
      try { spot = await spotPrices(db, h.area, days); }
      catch (e) { problems.push(`Spot prices: ${(e as Error).message}`); }
    }
    const cabin = Boolean(h.ean && cabins.has(h.ean));
    out.push({
      ean: h.ean, homeId: h.homeId, name: h.name, company: h.company, gridCompany: h.gridCompany,
      area: h.area, source: h.source, cabin,
      months: h.company ? months.map(m => monthBill(m, h.hours, h.company!, spot, cabin)).filter(Boolean) : [],
    });
  }
  return { months, houses: out, problems, updated: new Date().toISOString() };
}

// Bills need months of hourly data, so a copy is kept for an hour.
async function cached<T>(key: string, fresh: boolean, make: () => Promise<T>): Promise<T> {
  if (!fresh) {
    const { data } = await db.from('energy_cache').select('data, updated_at').eq('key', key).maybeSingle();
    if (data && Date.now() - new Date(data.updated_at).getTime() < 3600e3) return data.data as T;
  }
  const value = await make();
  await db.from('energy_cache').upsert({ key, data: value, updated_at: new Date().toISOString() });
  return value;
}
const forgetCache = () => db.from('energy_cache').delete().like('key', 'bills:%');

/* ───────── connecting logins ───────── */
async function connectTibber(token: string, userId: string) {
  let viewer;
  try { viewer = (await tibber(token, '{ viewer { userId name homes { id } } }')).viewer; }
  catch { return json({ error: 'Tibber didn’t accept that token. Copy it again from developer.tibber.com.' }, 400); }
  const { error } = await db.from('energy_accounts').upsert({
    provider: 'tibber', external_id: viewer.userId, name: viewer.name, token, added_by: userId,
  }, { onConflict: 'provider,external_id' });
  if (error) throw error;
  await forgetCache();
  return json({ ok: true, name: viewer.name, homes: viewer.homes.length });
}

async function connectElvia(token: string, userId: string) {
  let meters: string[];
  try { meters = await elviaMeters(token); }
  catch { return json({ error: 'Elvia didn’t accept that token. Make a new one on Elvia’s Min side (Tilganger).' }, 400); }
  if (!meters.length) return json({ error: 'That token works, but it can’t see any meters.' }, 400);
  const { error } = await db.from('energy_accounts').upsert({
    provider: 'elvia', external_id: [...meters].sort().join(','), token, added_by: userId,
    name: `Elvia (${meters.length === 1 ? 'meter …' + meters[0].slice(-4) : meters.length + ' meters'})`,
    meta: { meters },
  }, { onConflict: 'provider,external_id' });
  if (error) throw error;
  await forgetCache();
  return json({ ok: true, meters: meters.length });
}

/* ───────── the bank ───────── */
async function bankApp(): Promise<BankApp | null> {
  const [a] = await accounts('enablebanking');
  return a ? { appId: a.external_id, pem: a.token } : null;
}

// What the bank sync needs to know about the houses (from Tibber):
//   grid:   which house each grid company serves, by meter number
//   tibber: each house's Tibber bill per month ({ '2026-08': { <meter>: 1697.03 } }),
//           so a Tibber payment can be matched to the house it was for.
//   names:  each house's nickname and street address, to read Gmail labels on old bills.
const HOUSES_FOR_BANK = `{ viewer { homes { appNickname address { address1 } meteringPointData { consumptionEan gridCompany }
  monthly: consumption(resolution: MONTHLY, last: 14) { nodes { from cost } } } } }`;
async function housesForBank() {
  const grid: Record<string, string> = {};
  const tibberCost: Record<string, Record<string, number>> = {};
  const names: Record<string, string[]> = {};
  // Tibber's monthly fee, as set on the page (⚙️ Settings), else 49 kr.
  const { data: settings } = await db.from('family_items').select('data')
    .eq('tool', 'energy').eq('collection', 'settings');
  const fee = Number((settings || []).map(r => r.data).find(d => d.kind === 'tibber')?.fee ?? 49);
  for (const a of await accounts('tibber')) {
    const list = (await tibber(a.token, HOUSES_FOR_BANK)).viewer?.homes || [];
    for (const h of list) {
      const ean = h.meteringPointData?.consumptionEan;
      if (!ean) continue;
      names[ean] = [h.appNickname, h.address?.address1].filter(Boolean);
      const company = companyKey(h.meteringPointData?.gridCompany);
      if (company) grid[company] = ean;
      for (const n of h.monthly?.nodes || []) {
        if (n.cost == null) continue;
        const month = osloHour(n.from).slice(0, 7);
        (tibberCost[month] ||= {})[ean] = Number(n.cost) + fee;
      }
    }
  }
  return { grid, tibberCost, names };
}

/** Read new payments from every connected bank account and save them as bills. */
async function syncBank() {
  const app = await bankApp();
  if (!app) return { ok: false, error: 'Enable Banking isn’t set up yet.' };
  const sessions = await accounts('bank');
  const houses = await housesForBank();
  const today = new Date().toISOString().slice(0, 10);
  const results = [];
  for (const s of sessions) {
    const meta = { ...s.meta };
    try {
      if (meta.validUntil && meta.validUntil < new Date().toISOString()) throw new Error('The bank’s permission has run out. Connect the bank again.');
      if (!meta.accounts?.length) meta.accounts = await sessionAccounts(app, s.external_id);
      if (!meta.accounts.length) throw new Error('The bank didn’t share any accounts. In Enable Banking’s control panel, link this bank’s account to the app too (“Link accounts”), then press Connect bank again.');
      const payments: Payment[] = [];
      for (const acc of meta.accounts || []) {
        // First time: as far back as the bank allows (try 13 months, then 89 days). After that: the last 10 days.
        const tries = meta.lastSync
          ? [new Date(Date.parse(meta.lastSync) - 10 * 864e5).toISOString().slice(0, 10)]
          : [new Date(Date.now() - 395 * 864e5).toISOString().slice(0, 10), new Date(Date.now() - 89 * 864e5).toISOString().slice(0, 10)];
        let lastError: unknown = null;
        for (const from of tries) {
          try { payments.push(...billPayments(await transactions(app, acc.uid, from), acc.uid)); lastError = null; break; }
          catch (e) { lastError = e; }
        }
        if (lastError) throw lastError;
      }
      const saved = await saveBankPayments(db, payments, houses.grid, houses.tibberCost, houses.names);
      meta.lastSync = today;
      meta.lastResult = { ok: true, found: payments.length, ...saved, at: new Date().toISOString() };
    } catch (e) {
      meta.lastResult = { ok: false, error: (e as Error).message, at: new Date().toISOString() };
    }
    await db.from('energy_accounts').update({ meta }).eq('id', s.id);
    results.push({ bank: s.name, ...meta.lastResult });
  }
  return { ok: true, results };
}

async function bankCallback(url: URL) {
  const state = url.searchParams.get('state') || '';
  const { data: saved } = await db.from('energy_cache').delete().eq('key', `bankstate:${state}`).select().maybeSingle();
  const back = (to: string, result: string) => new Response(null, {
    status: 302, headers: { Location: `${to}${to.includes('?') ? '&' : '?'}bank=${result}` },
  });
  if (!saved || Date.now() - new Date(saved.updated_at).getTime() > 30 * 60e3) {
    return new Response('This bank link has expired. Go back to the Energy page and press Connect bank again.', { status: 400 });
  }
  const returnTo = safeReturn(saved.data.returnTo);
  const code = url.searchParams.get('code');
  if (!code || url.searchParams.get('error')) return back(returnTo, 'cancelled');
  const app = await bankApp();
  if (!app) return back(returnTo, 'error');
  try {
    const s = await createSession(app, code);
    await db.from('energy_accounts').upsert({
      provider: 'bank', external_id: s.sessionId, name: s.bank, token: s.sessionId, added_by: saved.data.user,
      meta: { validUntil: s.validUntil, accounts: s.accounts },
    }, { onConflict: 'provider,external_id' });
    await syncBank();
    return back(returnTo, 'connected');
  } catch (e) {
    console.error(e);
    return back(returnTo, 'error');
  }
}

async function cronSecretOk(req: Request) {
  const given = req.headers.get('x-cron-secret');
  if (!given) return false;
  const [c] = await accounts('cron');
  return Boolean(c && c.token === given);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const route = parts.slice(parts.indexOf('energy') + 1).join('/');

  try {
    // These two don't come from a signed-in person: the bank's redirect, and the daily database job.
    if (route === 'bank/callback') return await bankCallback(url);
    if (route === 'bank/sync' && await cronSecretOk(req)) return json(await syncBank());

    const user = await familyMember(req);
    if (!user) return json({ error: 'not_family' }, 401);

    if (route === 'bank/banks') {
      const app = await bankApp();
      if (!app) return json({ error: 'Set up Enable Banking first.' }, 400);
      return json({ banks: await norwegianBanks(app) });
    }

    if (route === 'homes') return json(await homes());

    if (route === 'bills') {
      const n = Math.min(12, Math.max(1, Number(url.searchParams.get('months')) || 6));
      const cabins = new Set((url.searchParams.get('cabins') || '').split(',').filter(Boolean));
      const key = `bills:${n}:${[...cabins].sort().join(',')}`;
      return json(await cached(key, url.searchParams.get('fresh') === '1', () => bills(n, cabins)));
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const token = String(body?.token || '').trim();
      if (route === 'tibber/connect' || route === 'elvia/connect') {
        if (!token) return json({ error: 'Paste the token first.' }, 400);
        return route === 'tibber/connect' ? connectTibber(token, user.id) : connectElvia(token, user.id);
      }
      if (route === 'bank/app') {
        const appId = String(body?.appId || '').trim();
        const pem = String(body?.pem || '').trim();
        if (!/^[0-9a-f-]{36}$/i.test(appId)) return json({ error: 'That doesn’t look like an application ID (it’s the long code with dashes).' }, 400);
        if (!/BEGIN (RSA )?PRIVATE KEY/.test(pem)) return json({ error: 'That file isn’t the private key. Pick the .pem file Enable Banking downloaded.' }, 400);
        let banks;
        try { banks = await norwegianBanks({ appId, pem }); }
        catch (e) { return json({ error: `Enable Banking didn’t accept the key: ${(e as Error).message}` }, 400); }
        await db.from('energy_accounts').delete().eq('provider', 'enablebanking');
        const { error } = await db.from('energy_accounts').insert({
          provider: 'enablebanking', external_id: appId, name: 'Enable Banking app', token: pem, added_by: user.id,
        });
        if (error) throw error;
        return json({ ok: true, banks });
      }
      if (route === 'bank/connect') {
        const app = await bankApp();
        if (!app) return json({ error: 'Set up Enable Banking first.' }, 400);
        const bank = (await norwegianBanks(app)).find((b: any) => b.name === body?.bank);
        if (!bank) return json({ error: 'Pick your bank from the list.' }, 400);
        const state = crypto.randomUUID();
        await db.from('energy_cache').delete().like('key', 'bankstate:%').lt('updated_at', new Date(Date.now() - 3600e3).toISOString());
        await db.from('energy_cache').upsert({ key: `bankstate:${state}`, data: { user: user.id, returnTo: safeReturn(body?.returnTo) } });
        return json({ url: await startAuth(app, bank.name, bank.maxDays, state, BANK_CALLBACK) });
      }
      if (route === 'bank/sync') return json(await syncBank());
      if (route === 'disconnect') {
        if (!body?.account) return json({ error: 'Which login?' }, 400);
        // A bank connection is also closed at the bank, as far as it allows.
        const { data: acc } = await db.from('energy_accounts').select('provider, external_id').eq('id', body.account).maybeSingle();
        const app = acc?.provider === 'bank' ? await bankApp() : null;
        if (app) await eb(app, 'DELETE', `/sessions/${acc!.external_id}`).catch(() => null);
        const { error } = await db.from('energy_accounts').delete().eq('id', body.account);
        if (error) throw error;
        await forgetCache();
        return json({ ok: true });
      }
    }

    return json({ error: 'not_found' }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});
