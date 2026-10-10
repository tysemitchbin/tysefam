// Reading power-bill payments from the family's bank account, through Enable Banking
// (https://enablebanking.com/docs/api/reference/). Their free "restricted" mode only
// reads accounts the owner has linked to the app themselves.
//
// Setup (done once on the Energy page): an Enable Banking app ID and its private key
// (.pem). Then "Connect bank" → BankID → Enable Banking sends the person back to
// /energy/bank/callback with a code, which becomes a session that can read transactions
// until the bank's consent runs out (often 180 days).
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.45.4';

const API = 'https://api.enablebanking.com';
export type BankApp = { appId: string; pem: string };

/* ───────── signing requests: a short-lived JWT made with the app's private key ───────── */
const b64url = (data: Uint8Array | string) => {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const derLength = (n: number) => {
  if (n < 128) return [n];
  const out: number[] = [];
  while (n > 0) { out.unshift(n & 255); n >>= 8; }
  return [0x80 | out.length, ...out];
};
// Keys can come as PKCS#8 ("BEGIN PRIVATE KEY") or PKCS#1 ("BEGIN RSA PRIVATE KEY").
// The browser's crypto only reads PKCS#8, so PKCS#1 keys get wrapped first.
function pemToPkcs8(pem: string) {
  const body = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), c => c.charCodeAt(0));
  if (!/BEGIN RSA PRIVATE KEY/.test(pem)) return der;
  const rsaAlgorithm = [0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00];
  const inner = [0x02, 0x01, 0x00, ...rsaAlgorithm, 0x04, ...derLength(der.length), ...der];
  return new Uint8Array([0x30, ...derLength(inner.length), ...inner]);
}
async function jwt(app: BankApp) {
  const key = await crypto.subtle.importKey('pkcs8', pemToPkcs8(app.pem), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ typ: 'JWT', alg: 'RS256', kid: app.appId }));
  const claims = b64url(JSON.stringify({ iss: 'enablebanking.com', aud: 'api.enablebanking.com', iat: now, exp: now + 3600 }));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${head}.${claims}`));
  return `${head}.${claims}.${b64url(new Uint8Array(sig))}`;
}

export async function eb(app: BankApp, method: string, path: string, body?: unknown) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${await jwt(app)}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = out.detail ? ` (${typeof out.detail === 'string' ? out.detail : JSON.stringify(out.detail)})` : '';
    throw new Error(`Enable Banking: ${out.message || out.error || 'error ' + res.status}${detail}`);
  }
  return out;
}

/** Norwegian banks Enable Banking can connect to: [{ name, maxDays }]. Also proves the key works. */
export async function norwegianBanks(app: BankApp) {
  const out = await eb(app, 'GET', '/aspsps?country=NO&psu_type=personal');
  return (out.aspsps || []).map((a: any) => ({
    name: a.name as string,
    maxDays: Math.floor((a.maximum_consent_validity || 90 * 86400) / 86400),
  })).sort((a: any, b: any) => a.name.localeCompare(b.name, 'nb'));
}

/** Start a BankID login at the bank. Returns the address to send the person to. */
export async function startAuth(app: BankApp, bank: string, maxDays: number, state: string, redirectUrl: string) {
  const days = Math.max(1, Math.min(maxDays, 180) - 1);
  const out = await eb(app, 'POST', '/auth', {
    access: { valid_until: new Date(Date.now() + days * 86400e3).toISOString() },
    aspsp: { name: bank, country: 'NO' },
    state, redirect_url: redirectUrl, psu_type: 'personal',
  });
  return out.url as string;
}

/** Swap the code from the callback for a session that can read the accounts. */
export async function createSession(app: BankApp, code: string) {
  const s = await eb(app, 'POST', '/sessions', { code });
  return {
    sessionId: s.session_id as string,
    bank: s.aspsp?.name as string,
    validUntil: s.access?.valid_until as string,
    accounts: (s.accounts || []).map((a: any) => ({
      uid: a.uid as string,
      name: a.name || a.product || 'Account',
      // Only the last 4 digits are kept, to recognise the account.
      ending: String(a.account_id?.iban || a.account_id?.other?.identification || a.all_account_ids?.[0]?.identification || '').slice(-4),
    })),
  };
}

/**
 * Some banks only list the accounts after the login is finished, so a session that came
 * back with none is asked again (GET /sessions/{id}), with each account's details.
 */
export async function sessionAccounts(app: BankApp, sessionId: string) {
  const s = await eb(app, 'GET', `/sessions/${encodeURIComponent(sessionId)}`);
  const uids: string[] = s.accounts || [];
  return Promise.all(uids.map(async uid => {
    const a = await eb(app, 'GET', `/accounts/${encodeURIComponent(uid)}/details`).catch(() => ({}));
    return {
      uid,
      name: a.name || a.product || 'Account',
      ending: String(a.account_id?.iban || a.account_id?.other?.identification || '').slice(-4),
    };
  }));
}

export async function transactions(app: BankApp, uid: string, dateFrom: string) {
  const out: any[] = [];
  let key: string | undefined;
  for (let page = 0; page < 30; page++) {
    const q = new URLSearchParams({ date_from: dateFrom });
    if (key) q.set('continuation_key', key);
    const r = await eb(app, 'GET', `/accounts/${encodeURIComponent(uid)}/transactions?${q}`);
    out.push(...(r.transactions || []));
    key = r.continuation_key;
    if (!key) break;
  }
  return out;
}

/* ───────── turning bank transactions into bills ───────── */
// Who a payment went to (or a refund came from), recognised by name or message.
const PAYEES = [
  { company: 'Tibber', re: /tibber/i },
  { company: 'BKK', re: /\bbkk\b/i },
  { company: 'Elvia', re: /elvia/i },
];
const prevMonth = (day: string) => {
  const d = new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 2, 1));
  return d.toISOString().slice(0, 7);
};

export type Payment = { ref: string; company: string; day: string; period: string; amount: number; text: string };

export function billPayments(txs: any[], accountUid: string): Payment[] {
  const out: Payment[] = [];
  for (const t of txs) {
    if (t.status && t.status !== 'BOOK') continue;                 // only payments that have gone through
    const text = [t.creditor?.name, t.debtor?.name, ...(t.remittance_information || []), t.note]
      .filter(Boolean).join(' · ');
    const payee = PAYEES.find(p => p.re.test(text));
    if (!payee) continue;
    const day = String(t.booking_date || t.value_date || t.transaction_date || '').slice(0, 10);
    if (!day) continue;
    const value = Math.abs(Number(t.transaction_amount?.amount) || 0);
    const amount = t.credit_debit_indicator === 'CRDT' ? -value : value;   // money back = negative bill
    const ref = `${accountUid}:${t.entry_reference || t.transaction_id || `${day}:${amount}:${text}`}`;
    // A bill is paid the month after it's for (September's bill is paid in October).
    out.push({ ref, company: payee.company, day, period: prevMonth(day), amount, text: text.slice(0, 200) });
  }
  return out;
}

/**
 * Which house a Tibber payment was for: the one whose Tibber bill it matches (within 15 kr
 * or 1%), 'both' if it matches the two together, or null if it's unclear.
 * `costs` is each house's bill that month as Tibber's own data has it, monthly fee included.
 */
export function tibberHouseFor(amount: number, costs: Record<string, number> | undefined) {
  if (!costs) return null;
  const close = (a: number, b: number) => Math.abs(a - b) <= Math.max(15, Math.abs(b) * 0.01);
  const [best] = Object.entries(costs).sort((a, b) => Math.abs(a[1] - amount) - Math.abs(b[1] - amount));
  if (best && close(amount, best[1])) return best[0];
  const total = Object.values(costs).reduce((t, c) => t + c, 0);
  return Object.keys(costs).length > 1 && close(amount, total) ? 'both' : null;
}

/**
 * Save payments as bills in family_items (tool 'energy', collection 'invoices'), without
 * doubling up: a payment fills in the matching bill that's already there (from Gmail or a
 * BKK/Elvia export) and marks it paid; otherwise it becomes a new bill.
 * `gridHouse` maps 'BKK' / 'Elvia' to that house's meter number; `tibberCost` is
 * { '2026-08': { <meter>: 1697.03 } } (see tibberHouseFor); `houseNames` is each house's
 * names ({ <meter>: ['Home', 'Storgata 1'] }), to read Gmail labels that name a house.
 */
export async function saveBankPayments(db: SupabaseClient, payments: Payment[], gridHouse: Record<string, string>,
  tibberCost: Record<string, Record<string, number>> = {}, houseNames: Record<string, string[]> = {}) {
  const { data: rows, error } = await db.from('family_items').select('id, data')
    .eq('tool', 'energy').eq('collection', 'invoices');
  if (error) throw error;
  const bills = (rows || []) as { id: string; data: any }[];
  // Which house a saved bill is for: set directly, or from its Gmail label.
  const norm = (s: unknown) => String(s || '').toLowerCase().trim();
  const houseOf = (d: any) => d.house || (d.houseHint
    ? Object.keys(houseNames).find(ean => houseNames[ean].some(n => norm(n) === norm(d.houseHint))) || null : null);
  let added = 0, matched = 0;
  for (const p of payments) {
    if (bills.some(b => b.data.bankRef === p.ref)) continue;     // already saved
    const house = p.company === 'Tibber' ? tibberHouseFor(p.amount, tibberCost[p.period]) : gridHouse[p.company] || null;
    const part = p.company === 'Tibber' ? 'power' : 'grid';
    const fits = (d: any) => !house || !houseOf(d) || houseOf(d) === house;
    const candidates = bills.filter(b => b.data.company === p.company && b.data.period === p.period && !b.data.bankRef
      && fits(b.data) && (p.company === 'Tibber' || (b.data.part || 'grid') === 'grid'))
      // Best first: the bill already known to be this house's, then one still waiting for its amount.
      .sort((a, b) => Number(Boolean(house) && houseOf(b.data) === house) - Number(Boolean(house) && houseOf(a.data) === house)
        || Number(b.data.amount == null) - Number(a.data.amount == null));
    const match = candidates[0];
    const paidBits = { paid: true, paidOn: p.day, paidAmount: p.amount, bankRef: p.ref };
    if (match) {
      // The payment also settles which house the bill is for (a Gmail label can be wrong).
      const data = { ...match.data, ...paidBits, amount: match.data.amount ?? p.amount, ...(house ? { house } : {}) };
      const { error: e } = await db.from('family_items').update({ data }).eq('id', match.id);
      if (e) throw e;
      match.data = data;
      matched++;
    } else {
      const data = {
        company: p.company, part, period: p.period, house,
        amount: p.amount, ...paidBits, source: 'bank', note: p.text, by: 'Bank', ts: Date.now(),
      };
      const { data: ins, error: e } = await db.from('family_items')
        .insert({ tool: 'energy', collection: 'invoices', data }).select('id').single();
      if (e) throw e;
      bills.push({ id: ins.id, data });
      added++;
    }
  }
  return { added, matched };
}
