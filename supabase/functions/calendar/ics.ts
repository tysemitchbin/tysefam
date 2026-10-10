// Reads a calendar file (.ics, the format behind Google Calendar's "secret address")
// and lists the events between two moments, with repeating events spread out into
// each time they happen.
//
// The hard parts (repeat rules, skipped and moved repeats) are done by ical.js,
// Mozilla's calendar library. Times are turned into exact moments with the
// browser-style time zone database, so "10:00 Europe/Oslo" is right in summer and winter.

import ICAL from 'npm:ical.js@2.1.0';
type Time = InstanceType<typeof ICAL.Time>;
type Component = InstanceType<typeof ICAL.Component>;

export type CalEvent = {
  title: string;
  start: string;        // all-day: '2026-10-10'; timed: an exact moment, '2026-10-10T08:00:00.000Z'
  end: string;          // all-day: the day AFTER the last day (how calendars store it)
  allDay: boolean;
  location?: string;
};

// Most repeats to spread out for one repeating event (stops runaway "every minute" rules).
const MAX_REPEATS = 20000;

/* ── time zones ── */

// How far ahead of UTC a time zone is at a given moment, in milliseconds.
const formatters = new Map<string, Intl.DateTimeFormat>();
function zoneOffset(ms: number, tz: string) {
  if (!formatters.has(tz)) formatters.set(tz, new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }));
  const parts = formatters.get(tz)!.formatToParts(new Date(ms));
  const n = (type: string) => Number(parts.find(p => p.type === type)!.value);
  return Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute'), n('second')) - ms;
}
// Does the time zone database know this name? (Outlook invites sometimes use Windows names.)
const knownZones = new Map<string, boolean>();
function isKnownZone(tz: string) {
  if (!knownZones.has(tz)) {
    try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); knownZones.set(tz, true); }
    catch { knownZones.set(tz, false); }
  }
  return knownZones.get(tz)!;
}

// A clock time (what the calendar shows) in a time zone → the exact moment.
function exactMoment(t: Time, tzid: string | null, fallbackZone: string): string {
  if (t.zone === ICAL.Timezone.utcTimezone) return t.toJSDate().toISOString();
  const tz = tzid && isKnownZone(tzid) ? tzid : null;
  if (!tz && tzid && t.zone && t.zone !== ICAL.Timezone.localTimezone) {
    return t.toJSDate().toISOString();   // an unknown name, but the file explains the zone itself
  }
  const zone = tz || fallbackZone;
  const wall = Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute, t.second);
  let ms = wall - zoneOffset(wall, zone);
  ms = wall - zoneOffset(ms, zone);      // second pass gets the days clocks change right
  return new Date(ms).toISOString();
}

// Roughly when a clock time happens (pretending it's UTC: at most a day out). Good enough
// for "is this anywhere near the dates we want?" before working it out exactly.
const roughly = (t: Time) => Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute, t.second);

const dayString = (t: Time) =>
  `${t.year}-${String(t.month).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`;
const tzidOf = (comp: Component) =>
  (comp.getFirstProperty('dtstart')?.getParameter('tzid') as string | undefined) || null;

/* ── quick tidy before parsing ──
   A Google calendar file holds every event ever, often megabytes of them. One-off events
   that finished well before `from` can't show up, so they're dropped as plain text first:
   much faster than parsing them all. */
function dropOldEvents(text: string, from: Date) {
  const cutoff = new Date(from.getTime() - 3 * 864e5).toISOString().slice(0, 10).replace(/-/g, '');
  return text.replace(/BEGIN:VEVENT[\s\S]*?END:VEVENT\r?\n?/g, block => {
    if (/\nRRULE[:;]|\nRDATE[:;]/.test(block)) return block;              // repeats: always keep
    const dates = [...block.matchAll(/\n(?:DTSTART|DTEND|RECURRENCE-ID)[^:\n]*:(\d{8})/g)].map(m => m[1]);
    return dates.length && dates.every(d => d < cutoff) ? '' : block;
  });
}

/* ── the events between `from` and `to` ── */
export function eventsBetween(text: string, from: Date, to: Date, fallbackZone = 'Europe/Oslo'): CalEvent[] {
  const cal = new ICAL.Component(ICAL.parse(dropOldEvents(text.replace(/\r\n/g, '\n'), from)));
  const calZone = (cal.getFirstPropertyValue('x-wr-timezone') as string | null) || '';
  const zoneForFloating = isKnownZone(calZone) ? calZone : fallbackZone;
  const vevents = cal.getAllSubcomponents('vevent');

  // Moved or changed single repeats ("just this one") are separate entries with a RECURRENCE-ID.
  const changed = new Map<string, Component[]>();
  for (const v of vevents) {
    if (!v.hasProperty('recurrence-id')) continue;
    const uid = String(v.getFirstPropertyValue('uid'));
    changed.set(uid, [...(changed.get(uid) || []), v]);
  }

  const out: CalEvent[] = [];
  const fromMs = from.getTime(), toMs = to.getTime();
  const add = (comp: Component, start: Time, end: Time | null) => {
    if (String(comp.getFirstPropertyValue('status') || '').toUpperCase() === 'CANCELLED') return;
    const allDay = start.isDate;
    let s: string, e: string;
    if (allDay) {
      s = dayString(start);
      if (end) e = dayString(end);
      else { const next = start.clone(); next.adjust(1, 0, 0, 0); e = dayString(next); }
      // keep if it touches the window (compare whole days)
      if (e <= from.toISOString().slice(0, 10) && s < from.toISOString().slice(0, 10)) return;
      if (s > to.toISOString().slice(0, 10)) return;
    } else {
      const tzid = tzidOf(comp);
      s = exactMoment(start, tzid, zoneForFloating);
      e = end ? exactMoment(end, (comp.getFirstProperty('dtend')?.getParameter('tzid') as string) || tzid, zoneForFloating) : s;
      if (Date.parse(e) <= fromMs && Date.parse(s) < fromMs) return;
      if (Date.parse(s) > toMs) return;
    }
    const location = String(comp.getFirstPropertyValue('location') || '').trim();
    out.push({
      title: String(comp.getFirstPropertyValue('summary') || '(no title)').trim(),
      start: s, end: e, allDay,
      ...(location ? { location } : {}),
    });
  };

  const repeating = new Set<string>();
  for (const v of vevents) {
    if (v.hasProperty('recurrence-id')) continue;     // handled with their repeating event
    const uid = String(v.getFirstPropertyValue('uid'));
    repeating.add(uid);
    const ev = new ICAL.Event(v, { exceptions: changed.get(uid) || [] });
    if (!ev.startDate) continue;

    if (!ev.isRecurring()) { add(v, ev.startDate, ev.endDate); continue; }

    // Step through each repeat until we're past the window. (A single repeat moved more
    // than 40 days, from long ago into the window, would be missed. That's very rare.)
    const it = ev.iterator();
    let next: Time | null;
    for (let i = 0; (next = it.next()) && i < MAX_REPEATS; i++) {
      if (roughly(next) < fromMs - 40 * 864e5) continue;        // long before the window: skip quickly
      const d = ev.getOccurrenceDetails(next);
      if (Math.min(roughly(d.startDate), roughly(next)) > toMs + 864e5) break;
      add(d.item.component, d.startDate, d.endDate);
    }
  }
  // An invite to just one time of someone else's repeating event comes without the event itself.
  changed.forEach((list, uid) => {
    if (repeating.has(uid)) return;
    for (const v of list) { const ev = new ICAL.Event(v); if (ev.startDate) add(v, ev.startDate, ev.endDate); }
  });

  out.sort((a, b) => (a.allDay ? a.start + 'T00' : a.start).localeCompare(b.allDay ? b.start + 'T00' : b.start)
    || Number(b.allDay) - Number(a.allDay));
  return out;
}
