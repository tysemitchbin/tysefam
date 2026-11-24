/* ════════════════════════════════════════════════════════════════
   BABY TOR → FOOD tab: starting solids. Tracking, planning and learning.
   The words and the food list live in food-data.js; this file is the app.

   Five tabs: Today · Plan · Foods · Allergens · Learn

   Saved in Family.store('baby-food'), shared by everyone in the family:
     meals    → <auto id>:   { date: 'YYYY-MM-DD', slot: 'breakfast'|'lunch'|'dinner'|'snack',
                               foods: [{ id: 'broccoli', r: 'love'|'ok'|'no'|'' }],   r = how it went
                               amount: 'taste'|'some'|'lots', reaction: 'text or empty', note, by, ts }
     plan     → 'YYYY-MM-DD': { breakfast: ['ironporridge', 'pear'], dinner: [...], … }
     daily    → 'YYYY-MM-DD': { vitd: 'Mitch', water: 'Ellie' }   the hand-ticked daily boxes
     allergy  → <allergen id>: { state: 'already'|'reaction', note, date, by }   set by hand
     custom   → <auto id>:   { name, e, g, iron, alg: [] }   foods we added that aren't on the list
     settings → 'main':      { meals: 1–4 or null (= go by stage), ready: { sit: 'Ellie', … } }
   Food ids come from food-data.js (or a custom food's id). The baby's name and birthday
   are read from the Movement tab's data ('baby-moves' → baby → main).
   Which tab is open, the food filter and the plan week are remembered on this device only.

   The page (index.html) starts it with
     FoodApp.start(foodStore, movesStore, { tabs, view, editBaby })
═════════════════════════════════════════════════════════════════ */
window.FoodApp = { start: function (store, babyStore, els) {
'use strict';
const D = window.FOOD;
const K = window.BabyKit;
const esc = Family.esc;
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const view = els.view;

/* ───────── saved data ───────── */
let BABY = {}, MEALS = {}, PLAN = {}, DAILY = {}, ALLERGY = {}, CUSTOM = {}, SET = {};
babyStore.watch('baby', items => { BABY = items.main || {}; softRender(); });
store.watch('meals', items => { MEALS = items; softRender(); });
store.watch('plan', items => { PLAN = items; softRender(); });
store.watch('daily', items => { DAILY = items; softRender(); });
store.watch('allergy', items => { ALLERGY = items; softRender(); });
store.watch('custom', items => { CUSTOM = items; softRender(); });
store.watch('settings', items => { SET = items.main || {}; softRender(); });

// What's open on this device. Never synced.
const UI_KEY = 'baby-food-ui';
const S = { tab: 'today', filter: 'all', week: 0, open: [] };
try { Object.assign(S, JSON.parse(localStorage.getItem(UI_KEY)) || {}); } catch (e) { /* private window: fine */ }
S.week = 0;   // always open the plan on this week
function saveUI() { try { localStorage.setItem(UI_KEY, JSON.stringify({ tab: S.tab, filter: S.filter, open: S.open })); } catch (e) {} }

/* ───────── small helpers ───────── */
const { todayKey, addDays, daysBetween, parseDay, dayKey, shortDate, niceDate } = K;
const name = () => K.babyName(BABY);
const SLOT_ORDER = D.slots.map(s => s.id);
const slotInfo = id => D.slots.find(s => s.id === id) || { id, e: '🍽️', name: id };
const MOOD = { love: '😋', ok: '🙂', no: '😖', '': '·' };
const MOOD_TEXT = { love: 'loved it', ok: 'it was OK', no: 'not keen yet', '': 'not noted' };
const AMOUNT = { taste: 'Just a taste', some: 'A few spoons', lots: 'A good meal' };
const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

// Every food: the list in food-data.js plus our own.
function foods() {
  const out = D.foods.slice();
  Object.entries(CUSTOM).forEach(([id, c]) => out.push({
    id, e: c.e || '🍽️', name: c.name || 'Food', no: '', g: c.g || 'extra', from: 6,
    serve: 'One of our own foods.', choke: '', iron: !!c.iron, vitc: false, fish: (c.alg || []).includes('fish'),
    alg: c.alg || [], custom: true }));
  return out;
}
function food(id) {
  return foods().find(f => f.id === id) || { id, e: '❓', name: id, no: '', g: 'extra', from: 6, serve: '', alg: [], gone: true };
}

/* ───────── ages and stages ───────── */
// Age in months (decimal) on a given day. Uses corrected age if the baby came 3+ weeks early.
function monthsAt(key) {
  const ages = K.babyAges(BABY);
  if (!ages) return null;
  const from = ages.corrected ? BABY.due : BABY.born;
  return (parseDay(key) - parseDay(from)) / 864e5 / 30.44;
}
// Meals, oldest first.
function mealList() {
  return Object.entries(MEALS).map(([id, m]) => Object.assign({ id }, m))
    .filter(m => m.date)
    .sort((a, b) => a.date.localeCompare(b.date) || SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot) || (a.ts || 0) - (b.ts || 0));
}
const firstMealDay = () => { const m = mealList()[0]; return m ? m.date : null; };
/* The day eating started, for working out stages in the plan: the first logged meal, or if
   nothing is logged yet, the first planned day from today on (or today). */
function startDay() {
  const first = firstMealDay(); if (first) return first;
  const t = todayKey();
  const planned = Object.keys(PLAN).filter(d => d >= t && Object.values(PLAN[d] || {}).some(x => x && x.length)).sort()[0];
  return planned || t;
}
/* Which of the five stages (food-data.js) fits a day. The first two weeks of eating are
   "first tastes"; after that the age decides. */
function stageAt(key, firstDay) {
  const m = monthsAt(key);
  const eatingDays = firstDay ? daysBetween(firstDay, key) : 0;
  if (m != null && m >= 12) return 5;
  if (m != null && m >= 9) return 4;
  if (m != null && m >= 8) return 3;
  return eatingDays < 14 ? 1 : 2;
}
const stageNow = () => stageAt(todayKey(), firstMealDay());
// The meal slots for a stage, or the family's own choice of how many meals a day.
function slotsFor(stageN) {
  const n = Number(SET.meals);
  if (n === 1) return ['lunch'];
  if (n === 2) return ['breakfast', 'dinner'];
  if (n === 3) return ['breakfast', 'lunch', 'dinner'];
  if (n === 4) return ['breakfast', 'lunch', 'dinner', 'snack'];
  return D.stages[stageN - 1].slots;
}
const okAge = (f, key) => { const m = monthsAt(key || todayKey()); return f.from <= Math.max(6, m == null ? 6 : m); };

/* ───────── what's been eaten ───────── */
// For each food: how many times, first and last day, and the latest "how it went".
function foodStats() {
  const st = {};
  mealList().forEach(m => (m.foods || []).forEach(x => {
    const s = st[x.id] = st[x.id] || { n: 0, first: m.date, last: m.date, r: '', hist: [] };
    s.n++; s.last = m.date; if (x.r) s.r = x.r;
    s.hist.push({ date: m.date, slot: m.slot, r: x.r || '', reaction: m.reaction || '' });
  }));
  return st;
}
// For each allergen: introduced when, last given, how many times, reactions, and any hand-set state.
function allergenStats() {
  const st = {};
  D.allergens.forEach(a => { st[a.id] = { n: 0, first: null, last: null, reactions: [], manual: ALLERGY[a.id] || null }; });
  mealList().forEach(m => {
    const seen = new Set();
    (m.foods || []).forEach(x => food(x.id).alg.forEach(a => seen.add(a)));
    seen.forEach(a => {
      const s = st[a]; if (!s) return;
      s.n++; s.first = s.first || m.date; s.last = m.date;
      if (m.reaction) s.reactions.push({ date: m.date, text: m.reaction });
    });
  });
  Object.values(st).forEach(s => {
    s.state = s.manual && s.manual.state === 'reaction' ? 'reaction'
      : s.first ? 'in' : s.manual && s.manual.state === 'already' ? 'already' : 'not';
    s.gap = s.last ? daysBetween(s.last, todayKey()) : null;
  });
  return st;
}
const introduced = (s) => s.state === 'in' || s.state === 'already';

/* ───────── drawing ───────── */
const TABS = [['today', '🌞 Today'], ['plan', '📅 Plan'], ['foods', '🥕 Foods'], ['allergens', '🥜 Allergens'], ['learn', '📖 Learn']];

function render() {
  els.tabs.innerHTML = TABS.map(([id, label]) =>
    `<button class="tab" role="tab" data-act="tab" data-v="${id}" aria-selected="${S.tab === id}">${label}</button>`).join('');
  const draw = { today: drawToday, plan: drawPlan, foods: drawFoods, allergens: drawAllergens, learn: drawLearn }[S.tab] || drawToday;
  view.innerHTML = draw() + `<p class="disclaimer">${md(D.disclaimer)}</p>`;
  view.querySelectorAll('details[data-k]').forEach(d => { if (S.open.includes(d.dataset.k)) d.open = true; });
}
let pending = false;
function softRender() {
  const a = document.activeElement;
  if (a && view.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { pending = true; return; }
  render();
  if (sheet.k === 'food') drawSheet();   // keep an open food card up to date
}
view.addEventListener('focusout', () => { if (pending) { pending = false; setTimeout(softRender, 50); } });
view.addEventListener('toggle', e => {
  const k = e.target.dataset && e.target.dataset.k; if (!k) return;
  S.open = S.open.filter(x => x !== k); if (e.target.open) S.open.push(k); saveUI();
}, true);

// A food as a small chip: emoji + name (+ how it went).
const fchip = (id, r, extra) => {
  const f = food(id);
  return `<span class="fchip${f.alg.length ? ' alg' : ''}" title="${esc(f.name)}">${esc(f.e)} ${esc(f.name)}${r != null && r !== '' ? ' ' + MOOD[r] : ''}${extra || ''}</span>`;
};

/* ── Today ── */
function drawToday() {
  const t = todayKey(), ages = K.babyAges(BABY), first = firstMealDay(), stN = stageNow(), st = D.stages[stN - 1];
  let html = '';

  // 1. Hello
  if (!BABY.born) {
    html += `<section class="box"><h3>👶 First, the birthday</h3>
      <p>The food tab uses the baby details from the Movement tab to pick foods that suit the age.</p>
      <button class="btn" data-act="editBaby">Add name and birthday</button></section>`;
  } else {
    html += `<section class="box hello">
      <div class="face" aria-hidden="true">${st.e}</div>
      <div>
        <div class="eyebrow">Today, ${K.today().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h2>${esc(name())} is ${esc(K.ageText(ages.actual))}</h2>
        <div class="muted">${first ? `Eating for <b>${daysBetween(first, t) + 1} days</b> · ` : ''}Stage ${stN}: <b>${esc(st.title)}</b> (${esc(st.months)})</div>
        <p class="small" style="margin-top:6px">${md(st.meals)} ${md(st.texture)}</p>
      </div></section>`;
  }

  // 2. Ready to start? (until the first meal is logged)
  if (!first) {
    const ready = SET.ready || {};
    const m = monthsAt(t);
    html += `<section class="box"><h3>🚦 Ready to start?</h3>
      <p>${m != null && m < 6 ? `${esc(name())} turns 6 months on <b>${esc(niceDate(sixMonths()))}</b>. ` : ''}Norway’s advice is to start around 6 months, with tiny tastes. These three signs usually turn up together:</p>
      <div class="checklist">${D.readiness.map(([k, txt]) => `<div class="it${ready[k] ? ' done' : ''}">
        <button class="tick" data-act="ready" data-k="${k}" aria-pressed="${!!ready[k]}" aria-label="Seen"></button>
        <div class="txt">${esc(txt)}${ready[k] ? ` <span class="who-pill">${esc(ready[k])}</span>` : ''}</div></div>`).join('')}</div>
      <p class="muted small" style="margin-top:8px">${esc(D.notReady)}</p>
      <div class="note good" style="margin-top:10px"><b>The first two weeks:</b> one small taste a day (a teaspoon is a meal) of thin porridge, potato or a vegetable, at a calm time of day. Milk stays the main food. The <b>Plan</b> tab can fill in a starter fortnight for you.</div>
    </section>`;
  }

  // 3. Today's meals: planned vs eaten
  const todays = mealList().filter(m => m.date === t);
  const slots = slotsFor(stN);
  const extra = todays.filter(m => !slots.includes(m.slot));
  html += `<section class="box"><h3>🍽️ Today’s meals <span class="aside">${todays.length} logged</span></h3>
    <div class="meals">${slots.map(sl => slotRow(t, sl, todays)).join('')}
    ${extra.map(m => mealRow(m)).join('')}</div>
    <div class="row" style="margin-top:12px"><button class="btn" data-act="log">＋ Log a meal</button>
      <button class="btn ghost sm" data-act="goTab" data-v="plan">📅 Plan the week</button></div>
  </section>`;

  // 4. Today's boxes
  html += `<section class="box"><h3>✅ Every day</h3><div class="checklist">${dailyChecks(t).join('')}</div></section>`;

  // 5. This week: fish + allergens to keep in
  const ast = allergenStats();
  const keepIn = D.allergens.filter(a => ast[a.id].state === 'in' && ast[a.id].gap >= 7);
  const fishDays = new Set(mealList().filter(m => daysBetween(m.date, t) < 7 && daysBetween(m.date, t) >= 0 && (m.foods || []).some(x => food(x.id).fish)).map(m => m.date)).size;
  if (first && stN >= 2) {
    html += `<section class="box"><h3>🗓️ This week</h3><div class="checklist">
      <div class="it${fishDays >= 2 ? ' done' : ''}"><span class="tick auto" aria-pressed="${fishDays >= 2}"></span>
        <div class="txt"><b>Fish 2–3 times a week</b>: ${fishDays} in the last 7 days. ${fishDays >= 2 ? '' : '<span class="muted">Mix fatty (salmon, mackerel) and white fish (cod, saithe).</span>'}</div></div>
      <div class="it${keepIn.length ? '' : ' done'}"><span class="tick auto" aria-pressed="${!keepIn.length}"></span>
        <div class="txt"><b>Keep allergens in</b>: ${keepIn.length ? 'time to give ' + keepIn.map(a => esc(a.e + ' ' + a.name)).join(', ') + ' again.' : 'everything introduced has been given this week.'}</div></div>
    </div></section>`;
  }

  // 6. Next to try
  const fs = foodStats();
  const next = foods().filter(f => !f.custom && !fs[f.id] && okAge(f) && !f.alg.length).slice(0, 6);
  if (next.length) html += `<section class="box"><h3>🌱 Next new foods to try</h3>
    <p class="muted small">In the guide’s order: iron foods and vegetables early, one new food at a time. Tap for how to serve it.</p>
    <div class="chips" style="margin-top:8px">${next.map(f => `<button class="chip" data-act="food" data-k="${esc(f.id)}">${esc(f.e)} ${esc(f.name)}${f.iron ? ' 🩸' : ''}</button>`).join('')}</div></section>`;

  // 7. The last seven days
  const days = []; for (let i = 6; i >= 0; i--) days.push(addDays(t, -i));
  const firstSeen = {}; mealList().forEach(m => (m.foods || []).forEach(x => { if (!firstSeen[x.id]) firstSeen[x.id] = m.date; }));
  html += `<section class="box"><h3>📈 The last seven days</h3>
    <div class="week">${days.map(d => {
      const n = mealList().filter(m => m.date === d).length;
      const nw = Object.values(firstSeen).filter(x => x === d).length;
      return `<div class="d${n >= 2 ? ' lots' : n ? ' some' : ''}${d === t ? ' today' : ''}" title="${n} meals, ${nw} new foods">
        ${parseDay(d).toLocaleDateString('en-GB', { weekday: 'short' })}<b>${n || '·'}</b>${nw ? `<small>+${nw} new</small>` : ''}</div>`;
    }).join('')}</div>
    <p class="muted small" style="margin-top:8px">Number = meals logged; “new” = foods tasted for the first time.</p></section>`;

  // 8. Recent meals
  const recent = mealList().filter(m => m.date !== t).slice(-8).reverse();
  if (recent.length) html += `<section class="box"><h3>🕘 Earlier meals</h3><div class="meals">${recent.map(m => mealRow(m, true)).join('')}</div></section>`;
  return html;
}

// The day the baby turns 6 months.
function sixMonths() {
  const b = parseDay(BABY.born);
  return dayKey(new Date(b.getFullYear(), b.getMonth() + 6, b.getDate()));
}
// One slot on the Today tab: what was eaten, or what's planned with an "Eaten" button.
function slotRow(day, sl, todays) {
  const s = slotInfo(sl);
  const eaten = todays.filter(m => m.slot === sl);
  if (eaten.length) return eaten.map(m => mealRow(m)).join('');
  const planned = (PLAN[day] || {})[sl] || [];
  return `<div class="meal planned">
    <div class="slot">${s.e} ${esc(s.name)}</div>
    <div class="what">${planned.length ? planned.map(id => fchip(id)).join('') : '<span class="muted small">Nothing planned</span>'}</div>
    <div class="acts">${planned.length
      ? `<button class="btn sm" data-act="eat" data-d="${day}" data-v="${sl}">✓ Eaten</button>`
      : `<button class="btn ghost sm" data-act="planSlot" data-d="${day}" data-v="${sl}">Plan</button><button class="btn sm" data-act="eat" data-d="${day}" data-v="${sl}">Log</button>`}</div>
  </div>`;
}
// One logged meal.
function mealRow(m, showDate) {
  const s = slotInfo(m.slot);
  return `<div class="meal eaten${m.reaction ? ' bad' : ''}">
    <div class="slot">${showDate ? `<span class="muted">${esc(shortDate(m.date))}</span><br>` : ''}${s.e} ${esc(s.name)}</div>
    <div class="what">${(m.foods || []).map(x => fchip(x.id, x.r || '')).join('')}
      <div class="muted small">${esc(AMOUNT[m.amount] || '')}${m.by ? ' · ' + esc(m.by) : ''}${m.note ? ' · ' + esc(m.note) : ''}</div>
      ${m.reaction ? `<div class="small" style="color:var(--bad);font-weight:800">⚠️ ${esc(m.reaction)}</div>` : ''}</div>
    <div class="acts"><button class="btn ghost sm" data-act="editMeal" data-k="${esc(m.id)}" aria-label="Edit">✏️</button></div>
  </div>`;
}
// The daily boxes: three worked out from the meals, two ticked by hand.
function dailyChecks(t) {
  const todays = mealList().filter(m => m.date === t);
  const ids = todays.flatMap(m => (m.foods || []).map(x => x.id));
  const iron = ids.some(id => food(id).iron);
  const ironC = todays.some(m => (m.foods || []).some(x => food(x.id).iron) && (m.foods || []).some(x => food(x.id).vitc));
  const veg = ids.some(id => ['veg', 'fruit'].includes(food(id).g));
  const d = DAILY[t] || {};
  const auto = (ok, title, hint) => `<div class="it${ok ? ' done' : ''}"><span class="tick auto" aria-pressed="${ok}" title="Ticks itself from the meals"></span>
    <div class="txt"><b>${title}</b> <span class="muted small">${hint}</span></div></div>`;
  const hand = (k, title, hint) => `<div class="it${d[k] ? ' done' : ''}"><button class="tick" data-act="daily" data-k="${k}" aria-pressed="${!!d[k]}" aria-label="${esc(title)}"></button>
    <div class="txt"><b>${title}</b>${d[k] ? ` <span class="who-pill">${esc(d[k])}</span>` : ''} <span class="muted small">${hint}</span></div></div>`;
  return [
    auto(iron, '🩸 An iron-rich food', iron ? '' : 'meat, fish, egg, beans/lentils, iron porridge'),
    auto(ironC, '🍊 Iron + vitamin C in one meal', 'helps the iron get absorbed'),
    auto(veg, '🥦 Vegetables or fruit', ''),
    hand('vitd', '☀️ Vitamin D', 'drops or tran, as the helsestasjon advised'),
    hand('water', '🥤 Sips of water from a cup', 'with meals')
  ];
}

/* ── Plan ── */
function weekDays() {
  const t = K.today();
  const monday = new Date(t); monday.setDate(t.getDate() - ((t.getDay() + 6) % 7) + S.week * 7);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return dayKey(d); });
}
function drawPlan() {
  const days = weekDays(), t = todayKey(), first = startDay();
  const fs = foodStats();
  // Foods that would be new on each day (not eaten before, and not planned on an earlier day).
  const seenBefore = new Set(Object.keys(fs));
  const label = S.week === 0 ? 'This week' : S.week === 1 ? 'Next week' : S.week === -1 ? 'Last week'
    : S.week > 0 ? 'In ' + S.week + ' weeks' : Math.abs(S.week) + ' weeks ago';
  const mealsBy = {}; mealList().forEach(m => { (mealsBy[m.date + m.slot] = mealsBy[m.date + m.slot] || []).push(m); });
  Object.keys(PLAN).filter(d => d < days[0] && d >= t).forEach(d => Object.values(PLAN[d] || {}).forEach(ids => (ids || []).forEach(id => seenBefore.add(id))));

  let html = `<section class="box">
    <div class="weeknav">
      <button class="btn ghost sm" data-act="week" data-v="-1" aria-label="Previous week">←</button>
      <div><h3>${esc(label)}</h3><small>${esc(shortDate(days[0]))} – ${esc(shortDate(days[6]))}</small></div>
      <button class="btn ghost sm" data-act="week" data-v="1" aria-label="Next week">→</button>
    </div>
    <p class="muted small">Tap a meal to choose foods. <b>Fill empty meals</b> suggests a plan from what’s been eaten so far: one new food a day at most, an iron food in every meal, vitamin C alongside, fish 2–3 times a week, one new allergen every few days (earlier in the day), and the allergens already in kept in each week. Change anything you like.</p>
    <div class="row" style="margin-top:8px">
      <button class="btn" data-act="suggest">✨ Fill empty meals</button>
      <button class="btn ghost sm" data-act="clearWeek">🧹 Clear the plan from today</button>
      <label class="small muted" style="font-weight:800">Meals a day
        <select id="foodMeals" class="field" style="padding:6px 8px;margin-left:4px">
          <option value="">by stage</option>${[1, 2, 3, 4].map(n => `<option value="${n}"${Number(SET.meals) === n ? ' selected' : ''}>${n === 4 ? '3 + snack' : n}</option>`).join('')}
        </select></label>
    </div>
  </section>`;

  html += days.map(d => {
    const stN = stageAt(d, first);
    const slots = slotsFor(stN);
    const p = PLAN[d] || {};
    const allSlots = SLOT_ORDER.filter(sl => slots.includes(sl) || (p[sl] && p[sl].length) || mealsBy[d + sl]);
    const rows = allSlots.map(sl => {
      const s = slotInfo(sl);
      const eaten = mealsBy[d + sl];
      const ids = eaten ? eaten.flatMap(m => (m.foods || []).map(x => x.id)) : (p[sl] || []);
      const chips = ids.map(id => {
        const isNew = !eaten && !seenBefore.has(id);
        const f = food(id);
        let tag = '';
        if (isNew) tag = f.alg.length ? ' <span class="pill bad">first ' + esc(f.alg.join(', ')) + '</span>' : ' <span class="pill hot">new</span>';
        return fchip(id, null, tag);
      }).join('');
      if (!eaten) (p[sl] || []).forEach(id => seenBefore.add(id));
      return `<button class="prow${eaten ? ' eaten' : ''}" data-act="${eaten ? 'editMeal' : 'planSlot'}" data-d="${d}" data-v="${sl}" ${eaten ? `data-k="${esc(eaten[0].id)}"` : ''}>
        <span class="slot">${s.e} ${esc(s.name)}</span>
        <span class="what">${chips || '<span class="muted small">＋ add foods</span>'}</span>
        ${eaten ? '<span class="pill ok">✓ eaten</span>' : ''}</button>`;
    }).join('');
    return `<section class="box day${d === t ? ' here' : ''}${d < t ? ' past' : ''}">
      <h3>${esc(shortDate(d))} ${d === t ? '<span class="pill hot">today</span>' : ''}<span class="aside">Stage ${stN}</span></h3>
      <div class="prows">${rows}</div></section>`;
  }).join('');

  // Shopping list: everything planned from today to the end of the week, not yet eaten.
  const shop = {};
  days.filter(d => d >= t).forEach(d => Object.entries(PLAN[d] || {}).forEach(([sl, ids]) => {
    if (mealsBy[d + sl]) return;
    (ids || []).forEach(id => { shop[id] = (shop[id] || 0) + 1; });
  }));
  const shopIds = Object.keys(shop);
  if (shopIds.length) {
    html += `<section class="box"><h3>🛒 Shopping for the rest of this plan</h3>
      ${D.groups.map(g => {
        const inG = shopIds.filter(id => food(id).g === g.id);
        return inG.length ? `<p><b>${esc(g.e + ' ' + g.name)}:</b> ${inG.map(id => esc(food(id).name) + (food(id).no ? ` <span class="muted">(${esc(food(id).no)})</span>` : '') + (shop[id] > 1 ? ' ×' + shop[id] : '')).join(', ')}</p>` : '';
      }).join('')}</section>`;
  }
  return html;
}

/* The suggestion engine. Fills the empty meals of the shown week (today onwards) using the
   rules in the Plan tab's text. It's a simple, readable recipe, not anything clever:
   it pretends to eat its way through the week so later days know what earlier days introduced. */
function suggestWeek() {
  const t = todayKey();
  const days = weekDays().filter(d => d >= t);
  if (!days.length) { alert('That week is over. Pick this week or a later one.'); return; }

  // Start from what's really been eaten, plus anything already planned between today and the shown week.
  const tries = {};          // food id → times eaten or planned
  const algLast = {};        // allergen → last day eaten or planned
  const ast = allergenStats();
  const already = new Set();   // "already in" by hand (e.g. milk through formula): allowed, never nudged
  D.allergens.forEach(a => {
    if (ast[a.id].last) algLast[a.id] = ast[a.id].last;
    else if (ast[a.id].state === 'already') { algLast[a.id] = t; already.add(a.id); }
  });
  let lastNewAllergen = null;
  D.allergens.forEach(a => { const f = ast[a.id].first; if (f && (!lastNewAllergen || f > lastNewAllergen)) lastNewAllergen = f; });
  const recent = {};         // day → food ids used that day (to avoid repeats)
  const note = (d, ids) => {
    ids.forEach(id => { tries[id] = (tries[id] || 0) + 1; food(id).alg.forEach(a => { algLast[a] = d; }); });
    recent[d] = (recent[d] || []).concat(ids);
  };
  mealList().forEach(m => note(m.date, (m.foods || []).map(x => x.id)));
  Object.keys(PLAN).sort().filter(d => d >= t && d < days[0]).forEach(d => Object.values(PLAN[d] || {}).forEach(ids => note(d, ids || [])));
  let firstDay = startDay();

  const out = {};
  const all = foods().filter(f => !f.custom);
  days.forEach(d => {
    // a steady "random" for each day, so the same week gives the same suggestions
    let seed = 0; for (const ch of d) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

    const existing = PLAN[d] || {};
    Object.values(existing).forEach(ids => note(d, ids || []));
    const stN = stageAt(d, firstDay);
    const eatingDays = daysBetween(firstDay, d);
    const slots = slotsFor(stN);
    const used = new Set([].concat(recent[addDays(d, -1)] || [], recent[d] || []));
    const can = f => okAge(f, d) && f.alg.every(a => algLast[a]);           // allowed: right age, allergens already in
    let newToday = Object.values(existing).some(ids => (ids || []).some(id => (tries[id] || 0) === 1));
    const dayPlan = Object.assign({}, existing);
    // Choose one food from a list of ids: a familiar one not used yesterday/today if possible,
    // or a new one if we still may introduce something today.
    const choose = (ids, allowNew) => {
      const ok = ids.map(food).filter(f => !f.gone && can(f));
      const known = ok.filter(f => tries[f.id] && !used.has(f.id));
      const fresh = ok.filter(f => !tries[f.id]);
      let f = null;
      if (allowNew && !newToday && fresh.length && (rnd() < 0.5 || !known.length)) { f = fresh[0]; newToday = true; }
      else if (known.length) f = pick(known, rnd);
      else if (ok.filter(x => tries[x.id]).length) f = pick(ok.filter(x => tries[x.id]), rnd);
      else if (fresh.length && !newToday) { f = fresh[0]; newToday = true; }
      if (f) used.add(f.id);
      return f ? f.id : null;
    };
    const ids = g => all.filter(f => f.g === g).map(f => f.id);
    const IRON_PORRIDGE = ['ironporridge', 'oats', 'millet', 'wholewheat'];
    const IRON_MAIN = ['beef', 'chicken', 'lentils', 'lamb', 'salmon', 'cod', 'egg', 'beans', 'chickpeas', 'pork', 'saithe', 'mackerel', 'tofu', 'reindeer', 'trout'];
    const FISH = ['salmon', 'cod', 'saithe', 'mackerel', 'trout'];
    const BASE = ['potato', 'sweetpotato', 'pasta', 'rice', 'quinoa', 'couscous', 'barley'];
    const VITC = all.filter(f => f.vitc && (f.g === 'veg' || f.g === 'fruit')).map(f => f.id);
    const SPREAD = ['peanut', 'hummus', 'leverpostei', 'egg', 'nutbutter', 'tahini'];
    // The first fortnight, in order (iron-rich protein within the first weeks, as the guide says).
    const FIRST_TASTES = ['ironporridge', 'potato', 'carrot', 'broccoli', 'beef', 'swede', 'lentils', 'pear', 'cauliflower', 'chicken', 'peas', 'oats', 'sweetpotato', 'apple', 'courgette', 'banana'];

    // Today's new allergen, if it's time for one: after a week of eating, 3+ days since the last new one.
    // It goes in the first meal of the day (fish and shellfish in the first lunch or dinner).
    let newAlg = null, algSlot = null;
    if (stN >= 2 && eatingDays >= 7 && (!lastNewAllergen || daysBetween(lastNewAllergen, d) >= 3)) {
      newAlg = D.allergens.find(a => !algLast[a.id] && okAge(food(a.starter), d));
      if (newAlg) {
        algSlot = ['fish', 'shellfish'].includes(newAlg.id) ? slots.find(sl => sl === 'lunch' || sl === 'dinner') : slots[0];
        if (!algSlot || (dayPlan[algSlot] && dayPlan[algSlot].length)) newAlg = null;
      }
    }
    slots.forEach(sl => {
      if (dayPlan[sl] && dayPlan[sl].length) return;
      let meal = [];
      if (stN === 1) {
        // First tastes: one food. A new one every other day, otherwise repeat a recent one.
        const fresh = FIRST_TASTES.map(food).find(f => !tries[f.id] && can(f));
        const lastNew = FIRST_TASTES.filter(id => tries[id]).slice(-2);
        if (fresh && (eatingDays % 2 === 0 || !lastNew.length)) meal = [fresh.id];
        else meal = [lastNew.length ? pick(lastNew, rnd) : 'ironporridge'];
        newToday = true;
      } else {
        if (newAlg && sl === algSlot) {
          // the new allergen, with something familiar and gentle
          meal.push(newAlg.starter); used.add(newAlg.starter); algLast[newAlg.id] = d; lastNewAllergen = d; newToday = true;
          const porridge = food(newAlg.starter).g === 'grain';
          meal.push(choose(sl === 'breakfast' && !porridge ? IRON_PORRIDGE : porridge ? ['pear', 'banana', 'apple', 'blueberries'] : ['potato', 'sweetpotato', 'carrot', 'broccoli'], false));
        } else if (sl === 'breakfast') {
          meal.push(choose(IRON_PORRIDGE, true));
          meal.push(choose(VITC.filter(id => food(id).g === 'fruit'), true) || choose(ids('fruit'), true));
        } else if (sl === 'snack') {
          meal.push(choose(ids('fruit'), true));
          if (monthsAt(d) >= 10 && rnd() < 0.5) meal.push(choose(['yoghurt'], false));
        } else if (sl === 'lunch' && stN >= 3) {
          meal.push(choose(['bread'], true) || choose(IRON_PORRIDGE, false));
          meal.push(choose(SPREAD, false) || choose(IRON_MAIN, false));
          meal.push(choose(VITC, true));
        } else {
          // dinner (or lunch before bread): iron food + vegetable + a base
          const weekDaysSoFar = Object.keys(recent).filter(x => daysBetween(x, d) >= 0 && daysBetween(x, d) < 7);
          const fishCount = new Set(weekDaysSoFar.filter(x => (recent[x] || []).some(id => food(id).fish))).size;
          const wantFish = sl === 'dinner' && algLast.fish && fishCount < 3 && (fishCount < 2 || rnd() < 0.4) && !(recent[addDays(d, -1)] || []).some(id => food(id).fish);
          meal.push(choose(wantFish ? FISH : IRON_MAIN, true));
          meal.push(choose(ids('veg').filter(id => food(id).g === 'veg'), true));
          if (rnd() < 0.7) meal.push(choose(BASE, false));
          if (stN >= 2 && rnd() < 0.3) meal.push('oil');
        }
        // Keep allergens in: anything not given for 6+ days goes into this meal if it fits.
        const due = D.allergens.find(a => !already.has(a.id) && algLast[a.id] && algLast[a.id] !== d && daysBetween(algLast[a.id], d) >= 6 && can(food(a.starter)));
        if (due && !meal.some(id => id && food(id).alg.includes(due.id))) {
          const options = all.filter(f => f.alg.includes(due.id) && can(f) && tries[f.id]).map(f => f.id);
          const id = options.length ? pick(options, rnd) : due.starter;
          meal.push(id);
        }
      }
      meal = meal.filter((id, j, arr) => id && arr.indexOf(id) === j);
      if (meal.length) { dayPlan[sl] = meal; note(d, meal); }
    });
    out[d] = dayPlan;
  });
  days.forEach(d => { if (JSON.stringify(out[d]) !== JSON.stringify(PLAN[d] || {})) store.set('plan', d, out[d]); });
}

/* ── Foods ── */
const FILTERS = [['all', 'All'], ['new', 'Not tried yet'], ['tried', 'Tried'], ['no', 'Not keen yet'], ['iron', '🩸 Iron-rich'], ['alg', '🥜 Allergens'], ['later', '⏳ Later']];
function drawFoods() {
  const fs = foodStats(), ast = allergenStats();
  const list = foods();
  const triedN = list.filter(f => fs[f.id]).length;
  const algIn = D.allergens.filter(a => introduced(ast[a.id])).length;
  const keep = f => {
    const s = fs[f.id];
    switch (S.filter) {
      case 'new': return !s && okAge(f);
      case 'tried': return !!s;
      case 'no': return s && s.r === 'no';
      case 'iron': return f.iron;
      case 'alg': return f.alg.length;
      case 'later': return !okAge(f);
      default: return true;
    }
  };
  return `<section class="box"><h3>🥕 Foods <span class="aside">${triedN} tried</span></h3>
    <div class="stats">
      <div><b>${triedN}</b><span>foods tried</span></div>
      <div><b>${algIn}/9</b><span>allergens in</span></div>
      <div><b>${list.filter(f => f.iron && fs[f.id]).length}</b><span>iron foods tried</span></div>
    </div>
    <p class="muted small" style="margin-top:10px">Tap a food for how to serve it and its history. Numbers are times tried; the face is the latest “how it went”. A “not keen” food usually needs 8–10 tries.</p>
    <div class="chips" style="margin-top:8px">${FILTERS.map(([id, l]) => `<button class="chip" data-act="filter" data-v="${id}" aria-pressed="${S.filter === id}">${l}</button>`).join('')}</div>
  </section>
  ${D.groups.map(g => {
    const inG = list.filter(f => f.g === g.id && keep(f));
    if (!inG.length) return '';
    return `<section class="box"><h3>${esc(g.e)} ${esc(g.name)} <span class="aside">${inG.filter(f => fs[f.id]).length}/${inG.length}</span></h3>
      <div class="tiles">${inG.map(f => tile(f, fs[f.id])).join('')}</div></section>`;
  }).join('') || '<section class="box"><p class="empty">Nothing here yet.</p></section>'}
  <div class="foot-actions"><button class="btn ghost" data-act="addFood">＋ Add a food that isn’t on the list</button></div>`;
}
function tile(f, s) {
  const later = !okAge(f);
  return `<button class="tile${s ? ' tried' : ''}${later ? ' later' : ''}${s && s.r === 'no' ? ' nope' : ''}" data-act="food" data-k="${esc(f.id)}">
    <span class="e">${esc(f.e)}</span>
    <span class="n">${esc(f.name)}</span>
    <span class="b">${s ? `<span class="pill ok">${s.n}×</span> ${MOOD[s.r]}` : later ? `<span class="pill">from ${f.from} mo</span>` : '<span class="pill">not yet</span>'}
      ${f.iron ? '<span title="Iron-rich">🩸</span>' : ''}${f.alg.length ? '<span title="Allergen">⚠️</span>' : ''}</span>
  </button>`;
}

/* ── Allergens ── */
function drawAllergens() {
  const ast = allergenStats();
  const algIn = D.allergens.filter(a => introduced(ast[a.id])).length;
  return `<section class="box"><h3>🥜 The nine allergens <span class="aside">${algIn} of 9 in</span></h3>
    <p>${md(D.allergenLead)}</p>
    <ol class="clean" style="margin-top:8px">${D.allergenHow.map(x => `<li>${md(x)}</li>`).join('')}</ol>
  </section>
  <div class="cards">${D.allergens.map(a => {
    const s = ast[a.id];
    const pill = s.state === 'reaction' ? '<span class="pill bad">⚠️ reaction</span>'
      : s.state === 'in' ? (s.gap >= 7 ? `<span class="pill warn">give again (${s.gap} days)</span>` : '<span class="pill ok">✓ in</span>')
      : s.state === 'already' ? '<span class="pill ok">✓ already in</span>' : '<span class="pill">not yet</span>';
    const tone = s.state === 'reaction' ? 'flag' : introduced(s) ? (s.gap >= 7 ? 'watch' : 'ok') : '';
    const starter = food(a.starter);
    return `<div class="mini ${tone}">
      <h4>${esc(a.e)} ${esc(a.name)} ${pill}</h4>
      ${s.first ? `<p class="small">First: <b>${esc(niceDate(s.first))}</b> · last: ${esc(niceDate(s.last))} · ${s.n}×</p>` : ''}
      <p class="small"><b>How:</b> ${md(a.how)}</p>
      <p class="small muted">${md(a.note)}</p>
      ${s.reactions.map(r => `<p class="small" style="color:var(--bad)">⚠️ ${esc(niceDate(r.date))}: ${esc(r.text)}</p>`).join('')}
      ${s.manual && s.manual.note ? `<p class="small" style="color:var(--bad)">📝 ${esc(s.manual.note)} <span class="who-pill">${esc(s.manual.by || '')}</span></p>` : ''}
      <div class="row" style="margin-top:8px">
        ${!introduced(s) && s.state !== 'reaction' ? (okAge(starter, addDays(todayKey(), 1))
          ? `<button class="btn sm" data-act="planAllergen" data-k="${a.id}">📅 Plan ${esc(starter.name.toLowerCase())} tomorrow</button>`
          : `<span class="pill warn">${esc(starter.name)} from ${starter.from} months</span>`) : ''}
        ${!s.first ? `<button class="btn ghost sm" data-act="already" data-k="${a.id}">${s.state === 'already' ? '↩️ Not yet after all' : '✓ Already in'}</button>` : ''}
        <button class="btn ghost sm" data-act="reaction" data-k="${a.id}">${s.state === 'reaction' ? '↩️ Clear reaction' : '⚠️ Had a reaction'}</button>
      </div></div>`;
  }).join('')}</div>
  <section class="box" style="background:var(--warn-soft)"><h3>👀 Watching for a reaction</h3>
    <p>${md(D.reactionMild)}</p>
    <div class="note bad" style="margin:8px 0">${md(D.reactionSevere)}</div>
    <p class="muted small">${md(D.reactionNote)}</p></section>`;
}

/* ── Learn ── */
function drawLearn() {
  const stN = stageNow();
  return `<section class="box"><h3>🗺️ At a glance: what, when, how</h3>
    <p class="muted small">No fixed first food in Norway’s advice: start with tiny tastes of porridge, potato or vegetables, add iron-rich protein within weeks, include every common allergen during the first year, and move from smooth to lumpy to family food by 12 months.</p>
    <table class="t stack"><thead><tr><th>Age</th><th>Foods to add</th><th>Texture</th><th>Meals</th></tr></thead>
    <tbody>${D.stages.map(s => `<tr class="${s.n === stN ? 'here' : ''}"><td class="n">${esc(s.e)} ${esc(s.months)}${s.n === stN ? ' <span class="pill hot">now</span>' : ''}</td>
      <td>${md(s.foods)}</td><td>${md(s.texture)}</td><td>${md(s.meals)}</td></tr>`).join('')}</tbody></table>
  </section>
  ${D.learn.map(l => `<details class="box learn" data-k="l-${l.id}"><summary><h3>${esc(l.e)} ${esc(l.title)}</h3></summary>
    ${l.body.map(p => `<p>${md(p)}</p>`).join('')}</details>`).join('')}
  <details class="box learn" data-k="l-drinks"><summary><h3>🥤 Drinks</h3></summary>
    <p class="muted small">In the first year: breast milk, formula and water. Everything else waits until 12 months or later.</p>
    <table class="t stack"><thead><tr><th>Drink</th><th>When</th><th>Notes</th></tr></thead>
    <tbody>${D.drinks.map(([a, b, c]) => `<tr><td class="n">${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table></details>
  <details class="box learn" data-k="l-avoid"><summary><h3>🚫 Foods to avoid or limit</h3></summary>
    <table class="t stack"><thead><tr><th>Food</th><th>Until</th><th>Why</th></tr></thead>
    <tbody>${D.avoid.map(([a, b, c]) => `<tr><td class="n" style="white-space:normal">${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table>
    <p class="muted small" style="margin-top:8px">${esc(D.avoidNote)}</p></details>
  <details class="box learn" data-k="l-diff"><summary><h3>🇳🇴 Where Norway and the UK differ</h3></summary>
    <p class="muted small">Living in Norway: follow the Norwegian advice, and ask the helsestasjon when sources disagree.</p>
    <table class="t stack"><thead><tr><th>Topic</th><th>Norway</th><th>UK (NHS)</th></tr></thead>
    <tbody>${D.differences.map(([a, b, c]) => `<tr><td class="n" style="white-space:normal">${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table></details>
  <details class="box learn" data-k="l-one"><summary><h3>🎂 What changes at one</h3></summary>
    <ul class="clean">${D.atOne.map(x => `<li>${md(x)}</li>`).join('')}</ul></details>
  <section class="box"><h3>📚 Sources</h3><p class="small muted">${esc(D.sources)}</p></section>`;
}

/* ───────── the pop-up sheet (log a meal, plan a meal, a food's card, add a food) ───────── */
const sheetEl = document.createElement('div');
sheetEl.className = 'sheet-wrap'; sheetEl.hidden = true;
document.body.appendChild(sheetEl);
let sheet = {};   // { k: 'meal'|'plan'|'food'|'custom', … }
function openSheet(s) { sheet = s; sheetEl.hidden = false; document.body.classList.add('sheet-open'); drawSheet(); }
function closeSheet() { sheet = {}; sheetEl.hidden = true; sheetEl.innerHTML = ''; document.body.classList.remove('sheet-open'); }

function drawSheet() {
  let body = '';
  if (sheet.k === 'meal') body = mealSheet();
  else if (sheet.k === 'plan') body = planSheet();
  else if (sheet.k === 'food') body = foodSheet();
  else if (sheet.k === 'custom') body = customSheet();
  sheetEl.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${body}</div>`;
  const q = sheetEl.querySelector('#foodQ'); if (q && sheet.q) { q.value = sheet.q; }
  drawPicker();
}
// The food picker inside the meal and plan sheets: search + group chips + food buttons.
function pickerHtml() {
  return `<div class="picker">
    <input id="foodQ" class="field" placeholder="🔍 Search foods (English or Norwegian)" autocomplete="off">
    <div class="chips" style="margin:8px 0">${[['', 'All']].concat(D.groups.map(g => [g.id, g.e])).map(([id, l]) =>
      `<button class="chip sm" data-act="pgroup" data-v="${id}" aria-pressed="${(sheet.g || '') === id}">${esc(l)}</button>`).join('')}
      <button class="chip sm" data-act="pgroup" data-v="tried" aria-pressed="${sheet.g === 'tried'}">Tried</button></div>
    <div class="plist" id="foodPick"></div></div>`;
}
function drawPicker() {
  const box = sheetEl.querySelector('#foodPick'); if (!box) return;
  const q = (sheet.q || '').toLowerCase().trim();
  const fs = foodStats();
  const chosen = new Set(sheet.k === 'meal' ? sheet.picked.map(x => x.id) : sheet.picked);
  const day = sheet.date || todayKey();
  const list = foods().filter(f => {
    if (sheet.g === 'tried') { if (!fs[f.id]) return false; } else if (sheet.g && f.g !== sheet.g) return false;
    return !q || (f.name + ' ' + f.no).toLowerCase().includes(q);
  });
  box.innerHTML = list.map(f => `<button class="pf${chosen.has(f.id) ? ' on' : ''}${okAge(f, day) ? '' : ' later'}" data-act="ptoggle" data-k="${esc(f.id)}">
      ${esc(f.e)} ${esc(f.name)}${fs[f.id] ? '' : ' <small>new</small>'}${okAge(f, day) ? '' : ` <small>from ${f.from} mo</small>`}${f.alg.length ? ' <small>⚠️</small>' : ''}</button>`).join('')
    || '<p class="muted small">No food by that name. Add it from the Foods tab (“Add a food”).</p>';
}
// The foods chosen so far, at the top of the meal and plan sheets.
function pickedHtml() {
  if (!sheet.picked.length) return '<span class="muted small">Pick foods below.</span>';
  if (sheet.k === 'meal') return sheet.picked.map((x, i) => `<span class="pk">
      <button class="pkm" data-act="mood" data-k="${i}" title="How it went: ${MOOD_TEXT[x.r || '']}">${esc(food(x.id).e)} ${esc(food(x.id).name)} ${x.r ? `<b>${MOOD[x.r]}</b>` : '<small class="muted">rate</small>'}</button>
      <button class="pkx" data-act="unpick" data-k="${i}" aria-label="Remove">×</button></span>`).join('');
  return sheet.picked.map((id, i) => `<span class="pk"><span class="pkm">${esc(food(id).e)} ${esc(food(id).name)}</span>
      <button class="pkx" data-act="unpick" data-k="${i}" aria-label="Remove">×</button></span>`).join('');
}
// Redraw only the chosen foods and the list (so the sheet doesn't jump back to the top).
function drawPicked() {
  const box = sheetEl.querySelector('#foodPicked'); if (box) box.innerHTML = pickedHtml();
  drawPicker();
}
function mealSheet() {
  const sl = sheet.slot;
  return `<h3>${sheet.id ? '✏️ Edit meal' : '🍽️ Log a meal'}</h3>
    <div class="form">
      <label>Day<input type="date" id="mDate" value="${esc(sheet.date)}" max="${todayKey()}"></label>
      <label>Meal<select id="mSlot">${D.slots.map(s => `<option value="${s.id}"${s.id === sl ? ' selected' : ''}>${s.e} ${esc(s.name)}</option>`).join('')}</select></label>
    </div>
    <div class="eyebrow" style="margin-top:12px">What was in it <span class="muted" style="text-transform:none;letter-spacing:0">(tap a food to say how it went)</span></div>
    <div class="picked" id="foodPicked">${pickedHtml()}</div>
    <p class="muted small">${MOOD.love} loved it · ${MOOD.ok} OK · ${MOOD.no} not keen yet</p>
    ${pickerHtml()}
    <div class="eyebrow" style="margin-top:12px">How much</div>
    <div class="seg">${Object.entries(AMOUNT).map(([k, l]) => `<button data-act="amount" data-v="${k}" aria-pressed="${sheet.amount === k}">${l}</button>`).join('')}</div>
    <div class="form" style="margin-top:12px">
      <label>Note (optional)<input id="mNote" maxlength="200" value="${esc(sheet.note || '')}" placeholder="e.g. lots of gagging but happy"></label>
      <label>Any reaction? (rash, swelling, vomiting)<input id="mReact" maxlength="200" value="${esc(sheet.reaction || '')}" placeholder="leave empty if none"></label>
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn" data-act="saveMeal">Save</button>
      <button class="btn ghost" data-act="close">Cancel</button>
      ${sheet.id ? '<button class="btn ghost" data-act="deleteMeal" style="margin-left:auto">🗑️ Delete</button>' : ''}
    </div>`;
}
function planSheet() {
  const s = slotInfo(sheet.slot);
  return `<h3>📅 ${esc(shortDate(sheet.date))} · ${s.e} ${esc(s.name)}</h3>
    <div class="picked" id="foodPicked">${pickedHtml()}</div>
    ${pickerHtml()}
    <div class="row" style="margin-top:14px">
      <button class="btn" data-act="savePlan">Save</button>
      <button class="btn ghost" data-act="close">Cancel</button>
      ${sheet.date <= todayKey() ? '<button class="btn ghost" data-act="planToLog" style="margin-left:auto">✓ Eaten: log it</button>' : ''}
    </div>`;
}
function foodSheet() {
  const f = food(sheet.id), s = foodStats()[f.id];
  const tries = s ? s.n : 0;
  const algNames = f.alg.map(a => (D.allergens.find(x => x.id === a) || { name: a }).name);
  return `<h3>${esc(f.e)} ${esc(f.name)} ${f.no ? `<span class="aside">${esc(f.no)}</span>` : ''}</h3>
    <div class="row">
      ${okAge(f) ? '<span class="pill ok">fine now</span>' : `<span class="pill warn">from ${f.from} months</span>`}
      ${f.iron ? '<span class="pill hot">🩸 iron-rich</span>' : ''}${f.vitc ? '<span class="pill ok">🍊 vitamin C</span>' : ''}
      ${algNames.length ? `<span class="pill bad">⚠️ ${esc(algNames.join(', '))}</span>` : ''}
    </div>
    <p style="margin-top:10px">${md(f.serve)}</p>
    ${f.choke ? `<div class="note warn">🫁 ${md(f.choke)}</div>` : ''}
    <div class="eyebrow" style="margin-top:12px">Tries ${tries ? `(${tries})` : ''}</div>
    <div class="dots">${Array.from({ length: 10 }, (_, i) => `<i class="${i < tries ? 'on' : ''}"></i>`).join('')}</div>
    ${s && s.r === 'no' ? `<p class="small">Not keen yet. That’s normal: keep offering it in small amounts, without pressure. Liking often comes after 8–10 tries.</p>` : ''}
    ${s ? `<ul class="clean small" style="margin-top:6px">${s.hist.slice(-8).reverse().map(h => `<li>${esc(shortDate(h.date))} · ${esc(slotInfo(h.slot).name)} · ${MOOD[h.r]} ${esc(MOOD_TEXT[h.r])}${h.reaction ? ` · <span style="color:var(--bad)">⚠️ ${esc(h.reaction)}</span>` : ''}</li>`).join('')}</ul>` : '<p class="muted small">Not tried yet.</p>'}
    <div class="row" style="margin-top:14px">
      <button class="btn" data-act="logFood" data-k="${esc(f.id)}">🍽️ Log it today</button>
      <button class="btn ghost" data-act="planFood" data-k="${esc(f.id)}">📅 Plan it tomorrow</button>
      ${f.custom ? `<button class="btn ghost" data-act="deleteFood" data-k="${esc(f.id)}">🗑️ Remove</button>` : ''}
      <button class="btn ghost" data-act="close" style="margin-left:auto">Close</button>
    </div>`;
}
function customSheet() {
  return `<h3>＋ Add a food</h3>
    <div class="form">
      <label>Name<input id="cName" maxlength="40" placeholder="e.g. Fiskekaker"></label>
      <label>Emoji<input id="cEmoji" maxlength="4" placeholder="🍽️"></label>
      <label>Group<select id="cGroup">${D.groups.map(g => `<option value="${g.id}">${g.e} ${esc(g.name)}</option>`).join('')}</select></label>
    </div>
    <label class="row small" style="margin-top:10px;font-weight:800"><input type="checkbox" id="cIron"> 🩸 Iron-rich (meat, fish, egg, beans…)</label>
    <div class="eyebrow" style="margin-top:10px">Contains (allergens)</div>
    <div class="chips">${D.allergens.map(a => `<label class="chip sm"><input type="checkbox" class="cAlg" value="${a.id}"> ${a.e} ${esc(a.name)}</label>`).join('')}</div>
    <div class="row" style="margin-top:14px"><button class="btn" data-act="saveFood">Save</button><button class="btn ghost" data-act="close">Cancel</button></div>`;
}

// Open the meal sheet: a new meal (optionally from the plan) or an existing one.
function logMeal(opts) {
  opts = opts || {};
  if (opts.id) {
    const m = MEALS[opts.id]; if (!m) return;
    openSheet({ k: 'meal', id: opts.id, date: m.date, slot: m.slot, picked: (m.foods || []).map(x => ({ id: x.id, r: x.r || '' })),
      amount: m.amount || 'some', note: m.note || '', reaction: m.reaction || '' });
    return;
  }
  const h = new Date().getHours();
  const slot = opts.slot || (h < 10 ? 'breakfast' : h < 14 ? 'lunch' : h < 19 ? 'dinner' : 'snack');
  const date = opts.date || todayKey();
  const planned = opts.foods || ((PLAN[date] || {})[slot] || []);
  openSheet({ k: 'meal', date, slot, picked: planned.map(id => ({ id, r: '' })), amount: stageNow() === 1 ? 'taste' : 'some', note: '', reaction: '' });
}
// Put a food into tomorrow's first meal (used by "Plan it tomorrow" and the allergen cards).
function planTomorrow(id) {
  const d = addDays(todayKey(), 1);
  const slot = slotsFor(stageAt(d, startDay()))[0];
  const p = Object.assign({}, PLAN[d] || {});
  p[slot] = (p[slot] || []).filter(x => x !== id).concat(id);
  store.set('plan', d, p);
  alert(food(id).name + ' is planned for tomorrow’s ' + slotInfo(slot).name.toLowerCase() + '.');
}

/* ───────── what taps do ───────── */
function onTap(e) {
  const b = e.target.closest('[data-act]');
  if (!b || (b.tagName === 'INPUT' && b.type !== 'checkbox') || b.tagName === 'SELECT') return;
  const v = b.dataset.v, k = b.dataset.k, d = b.dataset.d;
  switch (b.dataset.act) {
    case 'tab': case 'goTab': S.tab = v; saveUI(); render(); window.scrollTo(0, 0); return;
    case 'editBaby': els.editBaby(); return;
    case 'ready': {
      const ready = Object.assign({}, SET.ready || {}); ready[k] = ready[k] ? null : Family.me();
      store.set('settings', 'main', Object.assign({}, SET, { ready })); return;
    }
    case 'daily': {
      const t = todayKey(), cur = DAILY[t] || {};
      store.set('daily', t, Object.assign({}, cur, { [k]: cur[k] ? null : Family.me() })); return;
    }
    case 'log': logMeal(); return;
    case 'eat': logMeal({ date: d, slot: v }); return;
    case 'editMeal': logMeal({ id: k }); return;
    case 'planSlot': openSheet({ k: 'plan', date: d, slot: v, picked: ((PLAN[d] || {})[v] || []).slice() }); return;
    case 'food': openSheet({ k: 'food', id: k }); return;
    case 'filter': S.filter = v; saveUI(); render(); return;
    case 'week': S.week += Number(v); render(); return;
    case 'suggest': suggestWeek(); return;
    case 'clearWeek': {
      const t = todayKey(), days = weekDays().filter(x => x >= t && PLAN[x]);
      if (!days.length) return;
      if (confirm('Clear the planned meals from ' + shortDate(days[0]) + ' to ' + shortDate(days[days.length - 1]) + '? Logged meals stay.')) days.forEach(x => store.remove('plan', x));
      return;
    }
    case 'planAllergen': planTomorrow(D.allergens.find(a => a.id === k).starter); return;
    case 'already': {
      const cur = ALLERGY[k];
      if (cur && cur.state === 'already') store.remove('allergy', k);
      else store.set('allergy', k, { state: 'already', date: todayKey(), by: Family.me() });
      return;
    }
    case 'reaction': {
      const cur = ALLERGY[k];
      if (cur && cur.state === 'reaction') { if (confirm('Clear the reaction note for this allergen?')) store.remove('allergy', k); return; }
      const note = prompt('What happened? (date, food, what you saw, what the doctor said)');
      if (note != null) store.set('allergy', k, { state: 'reaction', note: note.trim(), date: todayKey(), by: Family.me() });
      return;
    }
    case 'addFood': openSheet({ k: 'custom' }); return;
  }
}
// Taps inside the pop-up sheet.
function onSheetTap(e) {
  if (e.target === sheetEl) { closeSheet(); return; }   // tapped the dim background
  const b = e.target.closest('[data-act]'); if (!b) return;
  const v = b.dataset.v, k = b.dataset.k;
  const keepFields = () => {   // read what's typed in the meal sheet's boxes
    const g = id => sheetEl.querySelector(id);
    if (g('#mDate')) { sheet.date = g('#mDate').value || sheet.date; sheet.slot = g('#mSlot').value; sheet.note = g('#mNote').value; sheet.reaction = g('#mReact').value; }
  };
  switch (b.dataset.act) {
    case 'close': closeSheet(); return;
    case 'pgroup':
      sheet.g = v;
      sheetEl.querySelectorAll('[data-act="pgroup"]').forEach(c => c.setAttribute('aria-pressed', c.dataset.v === (v || '')));
      drawPicker(); return;
    case 'ptoggle': {
      if (sheet.k === 'meal') {
        const i = sheet.picked.findIndex(x => x.id === k);
        if (i >= 0) sheet.picked.splice(i, 1); else sheet.picked.push({ id: k, r: '' });
      } else {
        const i = sheet.picked.indexOf(k);
        if (i >= 0) sheet.picked.splice(i, 1); else sheet.picked.push(k);
      }
      drawPicked(); return;
    }
    case 'unpick': sheet.picked.splice(Number(k), 1); drawPicked(); return;
    case 'mood': {
      const order = ['', 'love', 'ok', 'no'], x = sheet.picked[Number(k)];
      x.r = order[(order.indexOf(x.r || '') + 1) % order.length]; drawPicked(); return;
    }
    case 'amount':
      sheet.amount = v;
      sheetEl.querySelectorAll('[data-act="amount"]').forEach(c => c.setAttribute('aria-pressed', c.dataset.v === v));
      return;
    case 'saveMeal': {
      keepFields();
      if (!sheet.picked.length) { alert('Pick at least one food.'); return; }
      if (sheet.date > todayKey()) { alert('That day hasn’t happened yet. Use the Plan tab for future meals.'); return; }
      const m = { date: sheet.date, slot: sheet.slot, foods: sheet.picked, amount: sheet.amount || 'some',
        note: (sheet.note || '').trim(), reaction: (sheet.reaction || '').trim() };
      if (sheet.id) store.update('meals', sheet.id, m); else store.add('meals', m);
      closeSheet(); return;
    }
    case 'deleteMeal':
      if (confirm('Delete this meal?')) { store.remove('meals', sheet.id); closeSheet(); }
      return;
    case 'savePlan': {
      const p = Object.assign({}, PLAN[sheet.date] || {});
      if (sheet.picked.length) p[sheet.slot] = sheet.picked; else delete p[sheet.slot];
      if (Object.keys(p).length) store.set('plan', sheet.date, p); else if (PLAN[sheet.date]) store.remove('plan', sheet.date);
      closeSheet(); return;
    }
    case 'planToLog': { const s = sheet; logMeal({ date: s.date, slot: s.slot, foods: s.picked }); return; }
    case 'logFood': logMeal({ foods: [k] }); return;
    case 'planFood': planTomorrow(k); return;
    case 'deleteFood':
      if (confirm('Remove this food from the list? Meals that had it keep a “?” in its place.')) { store.remove('custom', k); closeSheet(); }
      return;
    case 'saveFood': {
      const nm = sheetEl.querySelector('#cName').value.trim();
      if (!nm) { alert('Please give it a name.'); return; }
      store.add('custom', { name: nm, e: sheetEl.querySelector('#cEmoji').value.trim() || '🍽️', g: sheetEl.querySelector('#cGroup').value,
        iron: sheetEl.querySelector('#cIron').checked, alg: [...sheetEl.querySelectorAll('.cAlg:checked')].map(x => x.value) });
      closeSheet(); return;
    }
  }
}
els.tabs.addEventListener('click', onTap);
view.addEventListener('click', onTap);
view.addEventListener('change', e => {
  if (e.target.id === 'foodMeals') store.set('settings', 'main', Object.assign({}, SET, { meals: e.target.value ? Number(e.target.value) : null }));
});
sheetEl.addEventListener('click', onSheetTap);
sheetEl.addEventListener('change', e => { if (e.target.id === 'mDate' && e.target.value) { sheet.date = e.target.value; drawPicker(); } });
sheetEl.addEventListener('input', e => { if (e.target.id === 'foodQ') { sheet.q = e.target.value; drawPicker(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheetEl.hidden) closeSheet(); });

render();
} };
