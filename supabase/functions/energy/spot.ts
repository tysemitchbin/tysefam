// Nord Pool spot prices (NOK/kWh, without VAT) per price area, from the free
// hvakosterstrommen.no API. Each finished day is saved in `spot_prices` so it's only fetched once.
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.45.4';
import { hourKey } from './grid.ts';

const API = 'https://www.hvakosterstrommen.no/api/v1/prices';

async function fetchDay(area: string, day: string) {
  const [y, m, d] = day.split('-');
  const res = await fetch(`${API}/${y}/${m}-${d}_${area}.json`);
  if (!res.ok) return null;                       // not published yet, or the service is down
  const rows = await res.json();
  return rows.map((r: any) => ({ t: r.time_start as string, p: r.NOK_per_kWh as number }));
}

/** Spot price for every hour of the given days, keyed like grid.ts's hourKey(). */
export async function spotPrices(db: SupabaseClient, area: string, days: string[]) {
  const { data: saved } = await db.from('spot_prices').select('day, prices').eq('area', area).in('day', days);
  const byDay = new Map((saved || []).map(r => [r.day as string, r.prices as { t: string; p: number }[]]));
  const today = new Date().toISOString().slice(0, 10);
  const missing = days.filter(d => !byDay.has(d) && d <= today);

  for (let i = 0; i < missing.length; i += 8) {   // 8 at a time, to be polite
    const got = await Promise.all(missing.slice(i, i + 8).map(async day => [day, await fetchDay(area, day).catch(() => null)] as const));
    const rows = got.filter(([, p]) => p?.length).map(([day, prices]) => ({ area, day, prices }));
    rows.forEach(r => byDay.set(r.day, r.prices!));
    // Only keep days that are over, so a half-published day is fetched again later.
    const done = rows.filter(r => r.day < today);
    if (done.length) await db.from('spot_prices').upsert(done);
  }

  // Since October 2025 prices can come per quarter-hour: average them into clock hours.
  const sums = new Map<string, [number, number]>();
  for (const prices of byDay.values()) {
    for (const { t, p } of prices) {
      const k = hourKey(t);
      const s = sums.get(k) || [0, 0];
      sums.set(k, [s[0] + p, s[1] + 1]);
    }
  }
  return new Map([...sums].map(([k, [total, n]]) => [k, total / n]));
}
