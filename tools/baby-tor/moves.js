/* ════════════════════════════════════════════════════════════════
   BABY TOR → MOVEMENT tab: floor play and motor milestones, 5–18 months.
   Built from Mitch's doc "Baby Acrobatics: A Parent's Blueprint for
   Motor Development". The words live in moves-data.js, the little
   diagrams in moves-illus.js; this file is the app. (It used to be the
   separate "Baby Moves" page; its saved data is still under 'baby-moves'.)

   Seven tabs: Today · Stages · Clinics · Safety · Tracker · Kit & day · Red flags

   Saved in Family.store('baby-moves'), shared by everyone in the family:
     baby  → 'main':        { name, born, due, stage }
               born / due   'YYYY-MM-DD'. due is only used if the baby came early
                            (it gives the "corrected age" the guide asks for).
               stage        'auto' (worked out from the tracker) or 1–5
               The Food tab reads this too, for the name and age.
     skills → <tracker key>: { date, by }   a milestone seen, and when (keys in moves-data.js)
     log    → 'YYYY-MM-DD':  { 's2-4': 'Mitch', 'g-1': 'Ellie', … }   exercises / games done that day
               (a value of null means it was unticked)
     setup  → 'home':        { sp0: 'Mitch', … }   the "set the space up once" checklist
   Which tab is open is remembered on this device only.

   The page (index.html) starts it with
     MovesApp.start(store, { tabs: <nav for the sub-tabs>, view: <main to draw in> })
═════════════════════════════════════════════════════════════════ */
window.MovesApp = { start: function (store, els) {
'use strict';
const G = window.GUIDE;
const K = window.BabyKit;
const $ = s => document.querySelector(s);
const esc = Family.esc;
// md(): our own guide text → safe HTML. Escapes everything, then turns **this** into bold.
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
// pic(): the little diagram for this key from illus.js, or nothing if there isn't one.
const pic = key => (window.ILLUS && ILLUS[key]) ? `<div class="pic">${ILLUS[key]}</div>` : '';

/* ───────── saved data ───────── */
let BABY = {}, SKILLS = {}, LOG = {}, SETUP = {};

// What's open on this device (tab, which stage you're reading…). Never synced.
const UI_KEY = 'baby-moves-ui';
const S = { tab: 'today', stage: null, clinic: 'crawl', kit: 'All', editing: false, open: [] };
try { Object.assign(S, JSON.parse(localStorage.getItem(UI_KEY)) || {}); } catch (e) { /* private window: fine */ }
S.editing = false;
function saveUI() { try { localStorage.setItem(UI_KEY, JSON.stringify({ tab: S.tab, stage: S.stage, clinic: S.clinic, kit: S.kit, open: S.open })); } catch (e) {} }

store.watch('baby', items => { BABY = items.main || {}; softRender(); });
store.watch('skills', items => { SKILLS = items; softRender(); });
store.watch('log', items => { LOG = items; softRender(); });
store.watch('setup', items => { SETUP = items.home || {}; softRender(); });

/* ───────── dates and ages (helpers in common.js) ───────── */
const { dayKey, parseDay, today, todayKey, niceDate, ageText } = K;
const babyAges = () => K.babyAges(BABY);
const babyName = () => K.babyName(BABY);

/* ───────── stages ───────── */
// The stage the tracker points to: what the baby can already do, not their birthday.
function trackedStage() {
  let s = 1;
  G.stageGates.forEach(g => { if (g.need.every(k => SKILLS[k])) s = Math.max(s, g.stage); });
  return s;
}
const myStage = () => (BABY.stage && BABY.stage !== 'auto') ? Number(BABY.stage) : trackedStage();
const ageStage = m => m == null ? null : m < 7 ? 1 : m < 9 ? 2 : m < 12 ? 3 : m < 15 ? 4 : 5;
const skillText = k => { for (const g of G.tracker) for (const [key, txt] of g.items) if (key === k) return txt; return k; };

/* ───────── the day's log ───────── */
const doneToday = () => LOG[todayKey()] || {};
const countDone = entry => Object.values(entry || {}).filter(v => typeof v === 'string').length;
function toggleDone(key) {
  const k = todayKey();
  const was = doneToday()[key];
  // set (not update): the day's record may not exist yet, and update only changes existing records.
  store.set('log', k, Object.assign({}, LOG[k], { [key]: was ? null : Family.me() }));
}
// Today's three exercises: they rotate through the stage's list, a new three each day.
function todaysExercises(stage) {
  const ex = G.stages[stage - 1].exercises;
  const dayNum = Math.floor(today().getTime() / 864e5);
  const out = [];
  for (let i = 0; out.length < Math.min(3, ex.length); i++) {
    const idx = (dayNum * 3 + i) % ex.length;
    if (!out.includes(idx)) out.push(idx);
  }
  return out;
}

/* ───────── drawing ───────── */
const TABS = [
  ['today', '🌞 Today'], ['stages', '🪜 Stages'], ['clinics', '🩺 Clinics'], ['safety', '🛡️ Safety'],
  ['tracker', '✅ Tracker'], ['kit', '🧰 Kit & day'], ['flags', '🚩 Red flags']
];
const view = els.view;

function render() {
  els.tabs.innerHTML = TABS.map(([id, label]) =>
    `<button class="tab" role="tab" data-act="tab" data-v="${id}" aria-selected="${S.tab === id}">${label}</button>`).join('');
  const draw = { today: drawToday, stages: drawStages, clinics: drawClinics, safety: drawSafety, tracker: drawTracker, kit: drawKit, flags: drawFlags }[S.tab] || drawToday;
  view.innerHTML = draw() + `<p class="disclaimer">${md(G.disclaimer)}</p>`;
  // Re-open any fold-outs that were open before the redraw.
  view.querySelectorAll('details[data-k]').forEach(d => { if (S.open.includes(d.dataset.k)) d.open = true; });
}
// Data changed on another device: redraw, but not while someone is typing in a box.
let pending = false;
function softRender() {
  const a = document.activeElement;
  if (a && view.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { pending = true; return; }
  render();
}
view.addEventListener('focusout', () => { if (pending) { pending = false; setTimeout(softRender, 50); } });
view.addEventListener('toggle', e => {
  const k = e.target.dataset && e.target.dataset.k; if (!k) return;
  S.open = S.open.filter(x => x !== k); if (e.target.open) S.open.push(k); saveUI();
}, true);

// One exercise card with its "done today" tick.
function exCard(stageN, idx, showNum) {
  const [title, how] = G.stages[stageN - 1].exercises[idx];
  const key = 's' + stageN + '-' + idx;
  const who = doneToday()[key];
  return `<div class="ex${who ? ' done' : ''}">
    <button class="tick" data-act="done" data-k="${key}" aria-pressed="${!!who}" aria-label="Done today: ${esc(title)}"></button>
    <div class="body">
      ${pic(key)}
      <div class="t">${showNum ? `<span class="num">${idx + 1}</span>` : ''}${esc(title)}</div>
      <p class="d">${md(how)}</p>
      ${who ? `<div class="who">✓ done today by ${esc(who)}</div>` : ''}
    </div></div>`;
}

/* ── Today ── */
function drawToday() {
  const ages = babyAges();
  let html = '';

  // 1. Who the baby is (or the form to say so)
  if (S.editing || !BABY.born) {
    html += `<section class="box">
      <h3>👶 ${BABY.born ? 'Edit baby details' : 'First, tell it about the baby'}</h3>
      <p class="muted small">The birthday puts a “today” line on the chart and picks movement games that suit their age. Only fill in the due date if they came 3+ weeks early, for the corrected age.</p>
      <div class="form" style="margin-top:10px">
        <label>Name<input id="fName" maxlength="40" value="${esc(BABY.name || '')}" placeholder="Baby"></label>
        <label>Birthday<input id="fBorn" type="date" value="${esc(BABY.born || '')}"></label>
        <label>Due date (if early)<input id="fDue" type="date" value="${esc(BABY.due || '')}"></label>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn" data-act="saveBaby">Save</button>
        ${BABY.born ? '<button class="btn ghost" data-act="cancelEdit">Cancel</button>' : ''}
      </div>
    </section>`;
  } else {
    const a = ages;
    html += `<section class="box hello">
      <div class="face" aria-hidden="true">👶</div>
      <div>
        <div class="eyebrow">Today, ${today().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h2>${esc(babyName())} is ${esc(ageText(a.actual))}</h2>
        ${a.corrected ? `<div class="muted">Corrected age <b>${esc(ageText(a.corrected))}</b>. The guide uses this one until about 2 years.</div>` : ''}
        ${a.work.exact < 5 && !a.work.before ? '<div class="muted small">The guide starts at 5 months; Stage 1 is still a good place to look.</div>' : ''}
        ${a.work.exact > 18 ? '<div class="muted small">Past the guide’s 18 months. Stage 5 and the obstacle course still apply.</div>' : ''}
        <button class="btn ghost sm" data-act="edit" style="margin-top:8px">✏️ Edit</button>
      </div>
    </section>`;
  }

  // 2. Which stage to work in
  const st = myStage(), stage = G.stages[st - 1];
  const auto = !BABY.stage || BABY.stage === 'auto';
  const nextGate = G.stageGates.find(g => g.stage === st + 1);
  const aStage = ages ? ageStage(ages.work.exact) : null;
  html += `<section class="box">
    <h3>${stage.emoji} Working in Stage ${st}: ${esc(stage.title)} <span class="aside">${stage.months} months</span></h3>
    <p>${md(stage.lead)}</p>
    <p class="muted small">${auto
      ? 'Picked from what the tracker says ' + esc(babyName()) + ' can already do, not from their birthday.'
      : 'You chose this stage. Switch back to “Auto” to let the tracker pick.'}
      ${aStage && aStage !== st ? ' By age alone it would be Stage ' + aStage + '; that’s fine, the guide says to work from what they can do.' : ''}</p>
    ${auto && nextGate ? `<div class="note" style="margin-top:10px">
      <b>Ready for Stage ${nextGate.stage}?</b> Tick these when you see them:
      <div class="checklist" style="margin-top:6px">${nextGate.need.map(k => trackerLine(k, true)).join('')}</div></div>` : ''}
    <div class="row" style="margin-top:12px">
      <span class="small muted" style="font-weight:800">Stage:</span>
      <div class="seg">${['auto', 1, 2, 3, 4, 5].map(v =>
        `<button data-act="setStage" data-v="${v}" aria-pressed="${String(BABY.stage || 'auto') === String(v)}">${v === 'auto' ? 'Auto' : v}</button>`).join('')}</div>
    </div>
  </section>`;

  // 3. Today's three exercises + one movement game
  const picks = todaysExercises(st);
  const m = ages ? ages.work.exact : 5;
  const games = G.play.menu.map((g, i) => [g, i]).filter(([g]) => g[1] <= Math.max(5, m));
  const dayNum = Math.floor(today().getTime() / 864e5);
  const [game, gi] = games[dayNum % games.length];
  const gKey = 'g-' + gi, gWho = doneToday()[gKey];
  html += `<section class="box">
    <h3>🎯 Today’s floor play <span class="aside">${countDone(doneToday())} done today</span></h3>
    <p class="muted small">Ten to fifteen minutes in two or three short bursts. A fresh three each day, rotating through Stage ${st}. Stop at the first “enough” sign.</p>
    <div class="exs" style="margin-top:10px">
      ${picks.map(i => exCard(st, i, true)).join('')}
      <div class="ex${gWho ? ' done' : ''}">
        <button class="tick" data-act="done" data-k="${gKey}" aria-pressed="${!!gWho}" aria-label="Done today: ${esc(game[0])}"></button>
        <div class="body">
          ${pic(gKey)}
          <div class="t">🎠 Movement game: ${esc(game[0])} <span class="pill">from ${game[1]} mo${game[3] ? ', ' + esc(game[3]) : ''}</span></div>
          <p class="d">${md(game[2])}</p>
          ${gWho ? `<div class="who">✓ done today by ${esc(gWho)}</div>` : ''}
        </div></div>
    </div>
    <div class="row" style="margin-top:12px">
      <button class="btn ghost sm" data-act="goStage" data-v="${st}">See all ${stage.exercises.length} Stage ${st} exercises →</button>
      <button class="btn ghost sm" data-act="goTab" data-v="safety">🛡️ Safety rules</button>
    </div>
  </section>`;

  // 4. The last seven days
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = today(); d.setDate(d.getDate() - i); days.push(d); }
  html += `<section class="box">
    <h3>📅 The last seven days</h3>
    <div class="week">${days.map(d => {
      const n = countDone(LOG[dayKey(d)]);
      return `<div class="d${n >= 3 ? ' lots' : n ? ' some' : ''}${dayKey(d) === todayKey() ? ' today' : ''}" title="${n} done">
        ${d.toLocaleDateString('en-GB', { weekday: 'short' })}<b>${n || '·'}</b></div>`;
    }).join('')}</div>
    <p class="muted small" style="margin-top:8px">${md(G.skip ? '**Skipping is fine:** ' + G.skip : '')}</p>
  </section>`;

  // 5. The skill windows chart
  html += `<section class="box">
    <h3>🗺️ The windows overlap</h3>
    <p class="muted small">The typical range for each skill, by age in months. First steps alone spread across eight months. Tap a row to open its stage.</p>
    ${windowsChart(ages)}
  </section>`;

  // 6. Stop signs
  html += `<section class="box">
    <h3>✋ Stop when you see “enough”</h3>
    <p>Turning the head away, going floppy or stiff, fussing, yawning, hiccups, glazed staring, or sudden stillness. Wait 20–30 minutes after a feed for tummy and tilting games.</p>
    <p class="muted small"><b>The quiet rule:</b> ${md(G.quietRule)}</p>
  </section>`;
  return html;
}

function windowsChart(ages) {
  const X = m => ((m - 5) / 13 * 100).toFixed(2) + '%';
  const now = ages && !ages.work.before && ages.work.exact >= 5 && ages.work.exact <= 18 ? ages.work.exact : null;
  const ticks = Array.from({ length: 14 }, (_, i) => 5 + i)
    .map(m => `<span class="${m % 2 ? 'odd' : ''}" style="left:${X(m)}">${m}</span>`).join('');
  return `<div class="win" role="img" aria-label="Typical age range for each motor skill, 5 to 18 months">
    <div class="win-axis"><span></span><div class="win-ticks">${ticks}</div><span class="win-rng">${now != null ? 'today ⇣' : ''}</span></div>
    ${G.windows.map(([label, a, b, stage]) => `
      <button class="win-row${label === 'First steps' ? ' key' : ''}" data-act="goStage" data-v="${stage}">
        <span class="win-lbl">${esc(label)}</span>
        <span class="win-track"><i style="left:${X(a)};width:${((b - a) / 13 * 100).toFixed(2)}%"></i>
          ${now != null ? `<span class="now" style="left:${X(now)}"></span>` : ''}</span>
        <span class="win-rng">${a}–${b} mo</span>
      </button>`).join('')}
    ${now != null ? `<p class="muted small" style="margin:6px 0 0">Dashed line: ${esc(babyName())} today (${ages.corrected ? 'corrected ' : ''}${now.toFixed(1)} months).</p>` : ''}
  </div>`;
}

/* ── Stages ── */
function drawStages() {
  const mine = myStage();
  const n = S.stage || mine, st = G.stages[n - 1];
  return `<section class="box">
    <p class="muted small" style="margin-top:0">Work in the stage that matches what the baby can already do, not their birthday. The green underline is ${esc(babyName())}’s stage right now.</p>
    <div class="stagebar">${G.stages.map(s => `
      <button class="stagebtn${s.n === mine ? ' mine' : ''}" data-act="stage" data-v="${s.n}" aria-pressed="${s.n === n}">
        <span class="e">${s.emoji}</span>${s.n}<small>${s.months} mo</small></button>`).join('')}</div>
  </section>
  <section class="box">
    <div class="eyebrow">Stage ${st.n} · ${st.months} months</div>
    <h2 style="font-size:1.6rem;margin:2px 0 8px">${st.emoji} ${esc(st.title)}</h2>
    <p>${md(st.lead)}</p>
    <div class="fact" style="margin-top:10px"><span class="eyebrow">What is developing</span>${md(st.developing)}</div>
  </section>
  <section class="box">
    <h3>🎯 Exercises and games <span class="aside">tick = done today</span></h3>
    <div class="exs">${st.exercises.map((_, i) => exCard(st.n, i, true)).join('')}</div>
  </section>
  <div class="facts">
    <div class="fact"><span class="eyebrow">🏠 Set-up</span>${md(st.setup)}</div>
    <div class="fact good"><span class="eyebrow">🌟 Good progress by the end</span>${md(st.progress)}</div>
  </div>
  <div class="row" style="justify-content:space-between">
    ${n > 1 ? `<button class="btn ghost sm" data-act="stage" data-v="${n - 1}">← Stage ${n - 1}</button>` : '<span></span>'}
    ${n < 5 ? `<button class="btn ghost sm" data-act="stage" data-v="${n + 1}">Stage ${n + 1} →</button>` : ''}
  </div>`;
}

/* ── Clinics ── */
function drawClinics() {
  const seg = `<div class="seg" role="group" aria-label="Clinic">${[['crawl', '🐛 Crawling'], ['walk', '🚶 Walking'], ['play', '🎠 Movement play']].map(([id, l]) =>
    `<button data-act="clinic" data-v="${id}" aria-pressed="${S.clinic === id}">${l}</button>`).join('')}</div>`;
  let body = '';
  if (S.clinic === 'walk') {
    const W = G.walking;
    const done = W.readiness.map((_, i) => ['m12-pull', 'm12-cruise', 'm12-lower', 'm12-stand', null, 'm15-squat'][i]);
    body = `<section class="box"><h3>🚶 Walking clinic</h3><p>${md(W.lead)}</p></section>
    <section class="box"><h3>🪜 Readiness signs, in order</h3>
      <ol class="clean">${W.readiness.map((r, i) => `<li>${esc(r)} ${done[i] && SKILLS[done[i]] ? '<span class="pill ok">✓ seen</span>' : ''}</li>`).join('')}</ol>
      <p class="muted small" style="margin-top:8px">“✓ seen” comes from the Tracker tab.</p></section>
    <section class="box"><h3>🤝 How to help without getting in the way</h3><ul class="clean">${W.help.map(h => `<li>${md(h)}</li>`).join('')}</ul></section>
    <section class="box"><h3>👟 Footwear</h3><p>${md(W.footwear)}</p></section>
    <section class="box"><h3>😌 Things that look wrong and usually are not</h3><ul class="clean">${W.looksWrong.map(h => `<li>${md(h)}</li>`).join('')}</ul></section>
    <section class="box"><h3>⏳ If walking is late</h3><p>${md(W.late)}</p></section>`;
  } else if (S.clinic === 'play') {
    const P = G.play, ages = babyAges(), m = ages ? ages.work.exact : null;
    body = `<section class="box"><h3>🎠 Safe “acrobatics”</h3><p>${md(P.lead)}</p></section>
    <section class="box"><h3>📏 Four rules for any movement game</h3><ol class="clean">${P.rules.map(r => `<li>${md(r)}</li>`).join('')}</ol></section>
    <section class="box"><h3>✅ The safe menu ${m != null ? `<span class="aside">for ${esc(babyName())} at ${m.toFixed(1)} months</span>` : ''}</h3>
      <div class="cards">${P.menu.map(([name, from, how, extra], i) => {
        const ready = m == null || m >= from;
        return `<div class="mini${ready ? ' ok' : ' later'}">${pic('g-' + i)}<h4>${esc(name)} <span class="pill${ready ? ' ok' : ''}">${ready && m != null ? 'ready now' : 'from ' + from + ' mo'}${extra ? ', ' + esc(extra) : ''}</span></h4>${md(how)}</div>`;
      }).join('')}</div></section>
    <section class="box" style="background:var(--bad-soft)"><h3>⛔ Still off the menu at 18 months</h3><p>${md(P.offMenu)}</p></section>`;
  } else {
    const C = G.crawling;
    body = `<section class="box"><h3>🐛 Crawling clinic</h3>${C.lead.map(p => `<p>${md(p)}</p>`).join('')}</section>
    <section class="box"><h3>👀 Patterns you may see</h3>
      <div class="cards">${C.patterns.map(([name, looks, todo, tone], i) =>
        `<div class="mini ${tone === 'check' ? 'flag' : tone}">${pic('c-' + i)}<h4>${esc(name)} <span class="pill ${tone === 'ok' ? 'ok' : tone === 'watch' ? 'warn' : 'bad'}">${tone === 'ok' ? 'fine' : tone === 'watch' ? 'mention it' : 'get it checked'}</span></h4>
          <div class="muted small">${esc(looks)}</div><p style="margin:.4em 0 0">${md(todo)}</p></div>`).join('')}</div></section>
    <section class="box"><h3>🧩 If crawling has not started</h3><ol class="clean">${C.notStarted.map(s => `<li>${md(s)}</li>`).join('')}</ol>
      <div class="note warn" style="margin-top:12px">${md(C.escalate)}</div></section>`;
  }
  return `<div>${seg}</div>${body}`;
}

/* ── Safety ── */
function drawSafety() {
  const doneN = G.space.filter((_, i) => SETUP['sp' + i]).length;
  return `<section class="box"><h3>🛡️ The non-negotiables</h3>
    <p class="muted small">The baby moves under their own power while you provide support, never force or momentum. These apply at every age.</p>
    <div class="never" style="margin-top:10px">${G.never.map(([a, b]) => `<div class="n"><span class="x">🚫</span><div><b>${esc(a)}</b> ${md(b)}</div></div>`).join('')}</div>
  </section>
  <section class="box"><h3>🏠 Set the space up once <span class="aside">${doneN} of ${G.space.length} done</span></h3>
    <p class="muted small">A shared checklist: tick things off as you sort them.</p>
    <div class="checklist">${G.space.map((s, i) => {
      const who = SETUP['sp' + i];
      return `<div class="it${who ? ' done' : ''}"><button class="tick" data-act="setup" data-k="sp${i}" aria-pressed="${!!who}" aria-label="Done"></button>
        <div class="txt">${md(s)}${who ? ` <span class="who-pill">${esc(who)}</span>` : ''}</div></div>`;
    }).join('')}</div>
  </section>
  <section class="box"><h3>⏱️ During a session</h3><ul class="clean">${G.session.map(s => `<li>${md(s)}</li>`).join('')}</ul></section>
  <section class="box" style="background:var(--warn-soft)"><h3>🤕 After a fall</h3><p>${md(G.afterFall)}</p></section>
  <section class="box"><h3>💡 Nine principles that do the real work</h3>
    <p class="muted small">Tap one to read it. The exercises are all applications of these.</p>
    <div class="principles" style="margin-top:10px">${G.principles.map(([a, b], i) =>
      `<details data-k="pr${i}"><summary>${esc(a)}</summary><p>${md(b)}</p></details>`).join('')}</div>
    <p style="margin-top:12px"><b>The quiet rule behind all nine:</b> ${md(G.quietRule)}</p>
  </section>
  <section class="box"><h3>📖 About this guide</h3>${G.intro.map(p => `<p>${md(p)}</p>`).join('')}</section>`;
}

/* ── Tracker ── */
// One tracker line: tick, the skill, and the date it was first seen (editable).
function trackerLine(key, compact) {
  const s = SKILLS[key];
  return `<div class="${compact ? 'it' : 'titem'}${s ? ' done' : ''}">
    <button class="tick" data-act="skill" data-k="${key}" aria-pressed="${!!s}" aria-label="Seen: ${esc(skillText(key))}"></button>
    <div class="txt">${esc(skillText(key))}${compact && s ? ` <span class="pill ok">✓ ${esc(niceDate(s.date))}</span>` : ''}</div>
    ${!compact && s ? `<label class="when">📅 <input type="date" data-act="skillDate" data-k="${key}" value="${esc(s.date || '')}" aria-label="Date first seen"><span class="who-pill">${esc(s.by || '')}</span></label>` : ''}
  </div>`;
}
function drawTracker() {
  const ages = babyAges(), m = ages ? ages.work.exact : null;
  const nextBy = m == null ? null : (G.tracker.find(g => g.by >= m) || {}).by;
  const total = G.tracker.reduce((n, g) => n + g.items.length, 0);
  const seen = G.tracker.reduce((n, g) => n + g.items.filter(([k]) => SKILLS[k]).length, 0);
  return `<section class="box"><h3>✅ Progress tracker <span class="aside">${seen} of ${total} seen</span></h3>
    <p>${md(G.trackerLead)}</p>
    <p class="muted small">Tap a box when you see a skill; today’s date goes in, and you can change it. Ticks are shared, and they move the stage on the Today tab.</p>
  </section>
  ${G.tracker.map(g => {
    const n = g.items.filter(([k]) => SKILLS[k]).length;
    return `<section class="box${g.by === nextBy ? ' here' : ''}">
      <h3>By ${g.by} months ${g.by === nextBy ? '<span class="pill hot">coming up</span>' : ''}
        <span class="aside row" style="gap:8px"><span class="bar" style="width:90px"><i style="width:${n / g.items.length * 100}%"></i></span>${n}/${g.items.length}</span></h3>
      <div class="tgroup">${g.items.map(([k]) => trackerLine(k)).join('')}</div>
    </section>`;
  }).join('')}
  <section class="box"><h3>🎥 Worth noting down</h3><p>${md(G.trackerNote)}</p></section>`;
}

/* ── Kit & day ── */
function drawKit() {
  const tone = v => v === 'Use' ? 'use' : v === 'Limit' ? 'limit' : 'skip';
  const filters = ['All', 'Use', 'Limit', 'Skip'];
  const list = G.equipment.filter(e => S.kit === 'All' || tone(e[1]) === S.kit.toLowerCase());
  return `<section class="box"><h3>🧰 Equipment: use, limit, skip</h3>
    <p>${md(G.equipmentLead)}</p>
    <div class="chips" style="margin:10px 0 12px">${filters.map(f => `<button class="chip" data-act="kit" data-v="${f}" aria-pressed="${S.kit === f}">${f}</button>`).join('')}</div>
    <div class="cards">${list.map(([item, verdict, why]) => {
      const t = tone(verdict), big = verdict === 'Skip entirely';
      return `<div class="mini ${t}${big ? ' big' : ''}"><h4>${esc(item)} <span class="pill ${t === 'use' ? 'ok' : t === 'limit' ? 'warn' : 'bad'}">${esc(verdict)}</span></h4>${md(why)}</div>`;
    }).join('')}</div>
  </section>
  <section class="box"><h3>⚓ Anchor points that work</h3>
    <p class="muted small">${md(G.rhythmLead)}</p>
    <ul class="clean" style="margin-top:8px">${G.anchors.map(a => `<li>${md(a)}</li>`).join('')}</ul></section>
  <section class="box"><h3>🗓️ A workable day</h3>
    <table class="t stack"><thead><tr><th>When</th><th>What</th><th>Minutes</th></tr></thead>
      <tbody>${G.day.map(([w, what, min]) => `<tr><td class="n">${esc(w)}</td><td>${esc(what)}</td><td><span class="pill ok">${esc(min)} min</span></td></tr>`).join('')}</tbody></table>
    <p class="muted small" style="margin-top:10px">${md(G.dayNote)}</p></section>
  <section class="box"><h3>🔁 Across the week</h3><ul class="clean">${G.week.map(a => `<li>${md(a)}</li>`).join('')}</ul>
    <div class="note" style="margin-top:12px"><b>When to skip it:</b> ${md(G.skip)}</div></section>`;
}

/* ── Red flags ── */
function drawFlags() {
  const ages = babyAges(), m = ages ? ages.work.exact : null;
  const nextBy = m == null ? null : (G.byAge.find(([a]) => a >= m) || [])[0];
  const groupCount = by => { const g = G.tracker.find(x => x.by === by); return g ? g.items.filter(([k]) => SKILLS[k]).length + '/' + g.items.length : ''; };
  return `<section class="box"><h3>🚩 Red flags and when to ask for help</h3><p>${md(G.redLead)}</p></section>
  <section class="box" style="background:var(--bad-soft)"><h3>Ask at any age, without waiting for the next check-up</h3>
    <ul class="clean">${G.anyAge.map(([a, b]) => `<li><b>${esc(a)}</b> ${md(b)}</li>`).join('')}</ul></section>
  <section class="box"><h3>📆 By age</h3>
    <table class="t stack"><thead><tr><th>Age</th><th>Raise it if</th><th>Tracker</th></tr></thead>
    <tbody>${G.byAge.map(([a, txt]) => `<tr class="${a === nextBy ? 'here' : ''}"><td class="n">${a} months${a === nextBy ? ' <span class="pill hot">next</span>' : ''}</td><td>${md(txt)}</td>
      <td><span class="pill">${groupCount(a)} seen</span></td></tr>`).join('')}</tbody></table>
    <p class="muted small" style="margin-top:10px">“Seen” counts the skills ticked for that age in the Tracker. A few gaps are common; the list above the table is what to act on.</p></section>
  <section class="box"><h3>👂 Alongside motor skills</h3><p>${md(G.alsoFlag)}</p></section>
  <section class="box"><h3>☎️ Who to contact</h3><p>${md(G.whoToContact)}</p></section>
  <section class="box" style="background:var(--accent-soft)"><h3>💚 One last thing</h3><p>${md(G.closing)}</p></section>`;
}

/* ───────── what taps do ───────── */
function onTap(e) {
  const b = e.target.closest('[data-act]');
  if (!b || b.tagName === 'INPUT') return;
  const v = b.dataset.v, k = b.dataset.k;
  switch (b.dataset.act) {
    case 'tab': case 'goTab':
      S.tab = v; saveUI(); render(); window.scrollTo(0, 0); return;
    case 'goStage':
      S.tab = 'stages'; S.stage = Number(v); saveUI(); render(); window.scrollTo(0, 0); return;
    case 'stage':
      S.stage = Number(v); saveUI(); render(); return;
    case 'clinic':
      S.clinic = v; saveUI(); render(); return;
    case 'kit':
      S.kit = v; saveUI(); render(); return;
    case 'edit':
      S.editing = true; render(); $('#fName') && $('#fName').focus(); return;
    case 'cancelEdit':
      S.editing = false; render(); return;
    case 'saveBaby': {
      const born = $('#fBorn').value, due = $('#fDue').value;
      if (!born) { alert('Please add the birthday.'); return; }
      S.editing = false;
      store.set('baby', 'main', Object.assign({}, BABY, { name: $('#fName').value.trim(), born, due }));
      return;
    }
    case 'setStage':
      store.set('baby', 'main', Object.assign({}, BABY, { stage: v }));
      return;
    case 'done':
      toggleDone(k); return;
    case 'setup':
      store.set('setup', 'home', Object.assign({}, SETUP, { [k]: SETUP[k] ? null : Family.me() })); return;
    case 'skill':
      if (SKILLS[k]) {
        if (confirm('Untick “' + skillText(k) + '”? Its date will be cleared.')) store.remove('skills', k);
      } else {
        store.set('skills', k, { date: todayKey(), by: Family.me() });
      }
      return;
  }
}
els.tabs.addEventListener('click', onTap);
view.addEventListener('click', onTap);
// Changing the "first seen" date on a tracker item.
view.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.act === 'skillDate' && t.value) store.update('skills', t.dataset.k, { date: t.value });
});

render();

// The Food tab's "edit baby details" button opens the form here.
window.MovesApp.editBaby = () => { S.tab = 'today'; S.editing = true; render(); $('#fName') && $('#fName').focus(); };
} };
