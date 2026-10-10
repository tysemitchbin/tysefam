// Grid rent (nettleie) calculator: works out what BKK or Elvia will bill for a month,
// from hourly meter readings.
//
// ⚠️ UPDATE THESE PRICES when the grid companies change them (usually 1 January, sometimes 1 July).
// All prices include taxes (elavgift, Enova) and 25% VAT, in kroner, as printed on the price lists:
//   Elvia: https://www.elvia.no/nettleie/alt-om-nettleiepriser/   (tariffblad 1.0, privat)
//   BKK:   https://bkk.no/en/grid-tariffs-for-private-customers

export type Tariff = {
  from: string;        // first day these prices apply (YYYY-MM-DD)
  day: number;         // energy part, weekdays 06–22, kr per kWh
  night: number;       // energy part, nights 22–06, weekends and public holidays, kr per kWh
  steps: number[];     // capacity part, kr per month, for each step in STEP_KW
};

// Capacity steps: the average of the month's three highest "daily peak hours" decides the step.
export const STEP_KW = [2, 5, 10, 15, 20, 25, 50, 75, 100, Infinity];

export const TARIFFS: Record<string, Tariff[]> = {
  Elvia: [
    { from: '2026-01-01', day: 0.3640, night: 0.2640, steps: [125, 190, 300, 410, 520, 630, 1175, 1720, 2270, 4570] },
    { from: '2026-07-01', day: 0.4640, night: 0.3140, steps: [150, 250, 420, 585, 755, 925, 1760, 2600, 3440, 6800] },
  ],
  BKK: [
    { from: '2026-01-01', day: 0.4613, night: 0.2329, steps: [155, 250, 415, 600, 770, 940, 1800, 2650, 3500, 6900] },
  ],
};

// Government schemes, settled on the grid bill. Prices without VAT, per kWh.
//   Strømstøtte: the state pays 90% of the hourly spot price above the threshold.
//   Norgespris:  you pay a fixed 40 øre; the grid company settles the difference to spot.
// Both stop at 5,000 kWh a month for a home (1,000 kWh for a cabin).
export const SUPPORT = {
  stromstotteThreshold: { 2025: 0.75, 2026: 0.77 } as Record<number, number>,
  stromstotteShare: 0.9,
  norgespris: 0.40,
  vat: 1.25,
  capHome: 5000,
  capCabin: 1000,
};

export function companyKey(name: string | null | undefined) {
  if (/elvia/i.test(name || '')) return 'Elvia';
  if (/bkk/i.test(name || '')) return 'BKK';
  return null;
}

// Each service writes times its own way ("…T14:00:00.000+02:00", "…T12:00:00Z").
// hourKey: the hour in UTC, so the same moment always matches (even across summer-time changes).
// osloHour: the Norwegian clock hour "YYYY-MM-DDTHH", which decides day/night prices.
export const hourKey = (s: string) => new Date(s).toISOString().slice(0, 13);
const OSLO = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
});
export function osloHour(s: string) {
  const p = Object.fromEntries(OSLO.formatToParts(new Date(s)).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}`;
}

/* ───────── Norwegian public holidays (helligdager), which count as night/weekend ───────── */
function easter(year: number) {   // Anonymous Gregorian algorithm
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(Date.UTC(year, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1));
}
const holidayCache = new Map<number, Set<string>>();
function holidays(year: number) {
  if (!holidayCache.has(year)) {
    const e = easter(year).getTime();
    const shift = (days: number) => new Date(e + days * 864e5).toISOString().slice(0, 10);
    holidayCache.set(year, new Set([
      `${year}-01-01`, shift(-3), shift(-2), shift(0), shift(1),      // New Year, Maundy Thu, Good Fri, Easter Sun/Mon
      `${year}-05-01`, `${year}-05-17`, shift(39), shift(49), shift(50), // May Day, Constitution Day, Ascension, Whitsun
      `${year}-12-25`, `${year}-12-26`,
    ]));
  }
  return holidayCache.get(year)!;
}
// Is this local hour on the cheaper night/weekend rate?
export function isNightRate(local: string) {   // local = "YYYY-MM-DDTHH"
  const day = local.slice(0, 10), hour = Number(local.slice(11, 13));
  const weekday = new Date(day + 'T12:00:00Z').getUTCDay();   // 0 = Sunday
  return weekday === 0 || weekday === 6 || holidays(Number(day.slice(0, 4))).has(day) || hour < 6 || hour >= 22;
}

export type Hour = { key: string; local: string; kwh: number };   // local = "YYYY-MM-DDTHH"

const round = (n: number) => Math.round(n * 100) / 100;

/** The grid bill for one month, worked out from that month's hourly readings. */
export function monthBill(month: string, hours: Hour[], company: string, spot: Map<string, number>, cabin = false) {
  const tariff = (TARIFFS[company] || []).filter(t => t.from <= month + '-31').pop();
  const inMonth = hours.filter(h => h.local.startsWith(month));
  if (!tariff || !inMonth.length) return null;
  // A price change mid-month (e.g. 1 July) applies from that day.
  const tariffOn = (day: string) => (TARIFFS[company] || []).filter(t => t.from <= day).pop() || tariff;

  let dayKwh = 0, nightKwh = 0, energy = 0;
  const peaks = new Map<string, number>();       // day → highest hour that day
  for (const h of inMonth) {
    const t = tariffOn(h.local.slice(0, 10));
    if (isNightRate(h.local)) { nightKwh += h.kwh; energy += h.kwh * t.night; }
    else { dayKwh += h.kwh; energy += h.kwh * t.day; }
    const d = h.local.slice(0, 10);
    peaks.set(d, Math.max(peaks.get(d) || 0, h.kwh));
  }

  // Capacity step: average of the three highest daily peaks (on three different days).
  const top3 = [...peaks.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const avgTop3 = top3.length ? top3.reduce((t, [, kw]) => t + kw, 0) / top3.length : 0;
  const step = STEP_KW.findIndex(limit => avgTop3 < limit);
  const fixed = tariff.steps[step];

  // Strømstøtte and Norgespris, hour by hour against the area's spot price, up to the monthly cap.
  const threshold = SUPPORT.stromstotteThreshold[Number(month.slice(0, 4))] ?? SUPPORT.stromstotteThreshold[2026];
  let left = cabin ? SUPPORT.capCabin : SUPPORT.capHome;
  let stromstotte = 0, norgespris = 0, priced = 0;
  for (const h of [...inMonth].sort((a, b) => a.key < b.key ? -1 : 1)) {
    const p = spot.get(h.key);
    if (p == null || left <= 0) continue;
    const kwh = Math.min(h.kwh, left);
    left -= kwh; priced++;
    stromstotte += SUPPORT.stromstotteShare * Math.max(0, p - threshold) * SUPPORT.vat * kwh;
    norgespris += (p - SUPPORT.norgespris) * SUPPORT.vat * kwh;   // positive = money back, negative = you pay extra
  }

  return {
    month, company, tariffFrom: tariff.from,
    hours: inMonth.length,
    kwh: round(dayKwh + nightKwh), dayKwh: round(dayKwh), nightKwh: round(nightKwh),
    energy: round(energy),
    step: step + 1, stepKw: [step ? STEP_KW[step - 1] : 0, STEP_KW[step]], avgTop3: round(avgTop3),
    nextStepKw: STEP_KW[step],
    peakDays: top3.map(([day, kw]) => ({ day, kw: round(kw) })),
    fixed,
    stromstotte: round(stromstotte),
    norgespris: round(norgespris),
    spotHours: priced,                      // hours we had a spot price for (should match `hours`)
  };
}
