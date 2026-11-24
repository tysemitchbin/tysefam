/* ════════════════════════════════════════════════════════════════
   BABY TOR: little helpers both tabs (Food and Movement) use.
   Dates are kept as 'YYYY-MM-DD' text everywhere, in local time.
═════════════════════════════════════════════════════════════════ */
window.BabyKit = (function () {
  'use strict';
  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseDay = s => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
  const todayKey = () => dayKey(today());
  const addDays = (key, n) => { const d = parseDay(key); d.setDate(d.getDate() + n); return dayKey(d); };
  const daysBetween = (a, b) => Math.round((parseDay(b) - parseDay(a)) / 864e5);
  const niceDate = s => { const d = parseDay(s); return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; };
  const shortDate = s => { const d = parseDay(s); return d ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : ''; };

  // Age from a date: whole months, the days left over, and a decimal for charts.
  function age(fromStr) {
    const b = parseDay(fromStr); if (!b) return null;
    const t = today();
    if (t < b) return { m: 0, days: 0, exact: (t - b) / 864e5 / 30.44, before: true };
    let m = (t.getFullYear() - b.getFullYear()) * 12 + t.getMonth() - b.getMonth();
    if (t.getDate() < b.getDate()) m--;
    const anchor = new Date(b.getFullYear(), b.getMonth() + m, b.getDate());
    const days = Math.max(0, Math.round((t - anchor) / 864e5));
    return { m, days, exact: m + days / 30.44 };
  }
  function ageText(a) {
    if (!a) return '';
    if (a.before) return 'not here yet';
    const w = Math.floor(a.days / 7);
    const mo = a.m === 1 ? '1 month' : a.m + ' months';
    if (a.m === 0) return w === 1 ? '1 week' : w + ' weeks';
    return w ? mo + ', ' + w + (w === 1 ? ' week' : ' weeks') : mo;
  }
  /* The age to go by. Born 3+ weeks before the due date → "corrected age"
     (counted from the due date) until about 2 years. */
  function babyAges(baby) {
    baby = baby || {};
    const actual = age(baby.born);
    if (!actual) return null;
    const early = baby.due && baby.born ? (parseDay(baby.due) - parseDay(baby.born)) / 864e5 : 0;
    const corrected = early >= 21 ? age(baby.due) : null;
    const useCorrected = corrected && actual.exact < 24;
    return { actual, corrected: useCorrected ? corrected : null, work: useCorrected ? corrected : actual };
  }
  const babyName = baby => ((baby && baby.name) || '').trim() || 'Baby';

  return { pad, dayKey, parseDay, today, todayKey, addDays, daysBetween, niceDate, shortDate, age, ageText, babyAges, babyName };
})();
