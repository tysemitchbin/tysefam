import { SPECIES, BY_ID, RARITY, MAP_TIERS, pickSpecies, pickGoldenSpecies, stretchTarget, stageFor, STAGES, creatureSVG, eggSVG } from './creatures.js';
import { Garden, GIFTS, ACTIONS, escapeHtml as esc } from './garden.js';
import { decodePolyline, distM, offset, routeNear, inferHome, generateEggs } from './geo.js';
import { requireSession, api, loadState, saveState, signOut, userEmail, sharedGardens, loadStateFor, myShares, addShare, removeShare } from './backend.js';

const $ = sel => document.querySelector(sel);
const EGG_REACH_M = 80;
const EGG_LIFETIME_DAYS = 14;

// ---------------------------------------------------------------------------
// Dates (walk start times are local wall-clock time, so treat them as local)

const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const localISO = d => `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
function mondayOf(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return ymd(d);
}
const parseLocal = s => { const [d, t = '00:00:00'] = s.replace('Z', '').split('T'); const [y, m, dd] = d.split('-').map(Number); const [h, mi] = t.split(':').map(Number); return new Date(y, m - 1, dd, h, mi); };
const niceDate = s => parseLocal(s).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

// ---------------------------------------------------------------------------
// Persistence: everything she does (names, companion, hatched eggs) is saved
// to Supabase, with a localStorage copy as an offline fallback.

let saved = { settings: { unit: 'mi', weeklyGoal: 2 }, buckets: {} };
let saveTimer;
async function loadSaved() {
  try { const s = await loadState(); if (s?.settings) return saved = s; } catch {}
  try { const s = JSON.parse(localStorage.getItem('wanderlings') || 'null'); if (s?.settings) saved = s; } catch {}
}
function persist() {
  if (app.viewing) return; // someone else's garden: look, don't touch
  try { localStorage.setItem('wanderlings', JSON.stringify(saved)); } catch {}
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveState(saved).catch(err => console.warn('save failed', err)), 400);
}
function prog() {
  return saved.buckets[app.mode] ||= { names: {}, love: {}, seen: [], companions: [], mapEggs: [], home: null, extraWalks: [], initialized: false };
}

// ---------------------------------------------------------------------------
// Units

function fmtDist(km, unit = saved.settings.unit) {
  const v = unit === 'mi' ? km * 0.621371 : km;
  return `${v < 10 ? v.toFixed(1).replace(/\.0$/, '') : Math.round(v)} ${unit}`;
}
const fmtMin = m => m < 60 ? `${Math.round(m)} min` : `${Math.floor(m / 60)}h ${pad(Math.round(m % 60))}m`;

// ---------------------------------------------------------------------------
// Demo data so the app is explorable before Ride with GPS is connected.

const DEMO_HOME = [45.5212, -122.6268];
function demoWalks() {
  const spec = [
    [40, 9, 0.8, 18, 5, 'First walk with the stroller'], [37, 13, 1.0, 22, 8], [34, 18, 1.1, 25, 12], [30, 7, 1.3, 28, 10],
    [27, 12, 1.2, 26, 30], [24, 10, 1.6, 34, 14], [22, 19, 1.5, 32, 6], [20, 11, 1.8, 38, 20], [16, 8, 2.0, 42, 18, 'Stroller loop round the park'],
    [13, 12, 2.2, 47, 35], [10, 17, 2.1, 44, 12], [6, 9, 2.6, 52, 28], [3, 12, 2.4, 50, 15], [1, 18, 2.9, 58, 40],
  ];
  const label = h => h < 12 ? 'Morning Walk' : h < 17 ? 'Afternoon Walk' : h < 20 ? 'Evening Walk' : 'Night Walk';
  return spec.map(([ago, hour, km, min, elev, name], i) => {
    const d = new Date(); d.setDate(d.getDate() - ago); d.setHours(hour, (i * 17) % 60, 0, 0);
    // a wobbly loop that starts and ends at home
    const r = km / (2 * Math.PI), dir = i * 2.1, centre = offset(DEMO_HOME, r, dir);
    const points = Array.from({ length: 25 }, (_, k) => offset(centre, r * (1 + 0.15 * Math.sin(k * 1.7 + i)), dir + Math.PI + (k / 24) * Math.PI * 2));
    return { id: `demo-${i}`, name: name || label(hour), start: localISO(d), distance: km * 1000, movingTime: min * 60, elevation: elev, points };
  });
}

// ---------------------------------------------------------------------------
// The game is *derived* from her walk history every time, so it's always
// consistent with her recorded walks. Only her choices (names, companion…) are stored.

function normalize(w) {
  const d = parseLocal(w.start);
  return {
    id: w.id, name: w.name, start: w.start.replace('Z', ''),
    km: w.distance / 1000, min: w.movingTime / 60, elev: w.elevation || 0,
    hour: d.getHours(), dow: d.getDay(), month: d.getMonth() + 1,
    date: ymd(d), week: mondayOf(d),
    points: w.points || decodePolyline(w.polyline),
  };
}

function buildGame(rawWalks, p) {
  const walks = rawWalks.map(normalize).sort((a, b) => a.start.localeCompare(b.start));
  const caught = {}, creatures = [], weekCount = {}, kms = [];
  const eggs = p.mapEggs.map(e => ({ ...e, collectedBy: null }));

  const add = (species, walk, extra) => {
    caught[species.id] = (caught[species.id] || 0) + 1;
    const c = { species, walk, nth: caught[species.id], golden: false, fromMap: null, ...extra };
    creatures.push(c); walk.found.push(c);
    return c;
  };

  walks.forEach((w, i) => {
    w.found = [];
    weekCount[w.week] = (weekCount[w.week] || 0) + 1;
    const ctx = { walkInWeek: weekCount[w.week], walkNumber: i + 1 };
    w.stretch = stretchTarget(kms);
    add(pickSpecies(w, ctx, caught), w, { id: w.id });
    w.beatStretch = w.km >= w.stretch;
    if (w.beatStretch) add(pickGoldenSpecies(w, ctx, caught), w, { id: `${w.id}:gold`, golden: true });
    for (const egg of eggs) {
      if (egg.collectedBy || w.start < egg.createdAt || w.start > egg.expiresAt) continue;
      if (!routeNear(w.points, [egg.lat, egg.lng], EGG_REACH_M)) continue;
      egg.collectedBy = w.id;
      const tierSpecies = BY_ID[MAP_TIERS[egg.tier].species];
      add(caught[tierSpecies.id] ? pickGoldenSpecies(w, ctx, caught, egg.id) : tierSpecies, w, { id: `map:${egg.id}`, fromMap: egg.tier });
    }
    kms.push(w.km);
  });

  // Companion timeline: whoever was companion when a walk happened gets that
  // walk's distance as "bond", so longer walks together = faster growth.
  const byId = Object.fromEntries(creatures.map(c => [c.id, c]));
  const timeline = p.companions.filter(t => byId[t.id]);
  if (creatures.length && !timeline.length) timeline.push({ id: creatures[0].id, since: '' });
  for (const c of creatures) { c.bond = c.walk.km; c.name = p.names[c.id] || c.species.name; c.love = p.love[c.id] || 0; }
  for (const w of walks) {
    const t = [...timeline].reverse().find(t => t.since <= w.start) || timeline[0];
    const comp = t && byId[t.id];
    if (comp && comp.walk.start < w.start) comp.bond += w.km;
  }
  for (const c of creatures) c.stage = stageFor(c.bond);

  const seen = new Set(p.seen);
  const now = localISO(new Date());
  return {
    walks, creatures, byId, caught, eggs,
    activeEggs: eggs.filter(e => !e.collectedBy && e.expiresAt >= now),
    companion: byId[timeline[timeline.length - 1]?.id] || null,
    unseen: creatures.filter(c => !seen.has(c.id)),
    totalKm: walks.reduce((a, w) => a + w.km, 0),
    totalMin: walks.reduce((a, w) => a + w.min, 0),
    nextStretch: stretchTarget(kms),
    recentAvg: kms.length ? kms.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, kms.length) : 0,
    home: p.home || inferHome(walks) || (app.mode === 'demo' ? DEMO_HOME : null),
  };
}

// ---------------------------------------------------------------------------
// App

const app = { mode: 'demo', athlete: null, configured: false, raw: [], game: null, tab: 'home', map: null, shared: [], viewing: null, mySaved: null };
let garden;

async function init() {
  await requireSession();
  await loadSaved();
  garden = new Garden($('#garden'), { onTap: id => openCreature(id) });
  wireEvents();
  const params = new URLSearchParams(location.search);
  if (params.has('rwgps')) history.replaceState(null, '', location.pathname);
  if (params.get('rwgps') === 'connected') toast('Ride with GPS connected! Fetching walks…');
  app.shared = await sharedGardens().catch(() => []);
  const last = (() => { try { return localStorage.getItem('wanderlings-view'); } catch { return null; } })();
  const lastShared = app.shared.find(g => g.owner_id === last);
  if (lastShared) await viewGarden(lastShared.owner_id);
  else await sync();
}

// Switch between my own garden and one that's been shared with me.
async function viewGarden(ownerId) {
  const target = ownerId && app.shared.find(g => g.owner_id === ownerId);
  if (!app.viewing) app.mySaved = saved;
  if (target) {
    let theirs = null;
    try { theirs = await loadStateFor(ownerId); } catch {}
    saved = theirs?.settings ? theirs : { settings: { ...app.mySaved.settings }, buckets: {} };
    app.viewing = target;
  } else {
    saved = app.mySaved;
    app.viewing = null;
  }
  try { localStorage.setItem('wanderlings-view', app.viewing ? ownerId : ''); } catch {}
  app.mapFitted = false;
  closeSheet();
  await sync();
}

async function sync() {
  $('#sync').classList.add('spinning');
  if (app.viewing) {
    app.mode = 'live';
    try { app.raw = (await api(`walks?owner=${app.viewing.owner_id}`)).walks; }
    catch (err) {
      app.raw = [];
      toast(err.message === 'not_connected' ? `${app.viewing.display_name} hasn’t connected Ride with GPS yet.` : `Couldn’t load walks: ${err.message}`);
    }
    $('#sync').classList.remove('spinning');
    return refresh();
  }
  try {
    const status = await api('status');
    app.configured = status.configured;
    app.athlete = status.displayName;
    if (status.connected) {
      app.raw = (await api('walks')).walks;
      app.mode = 'live';
      try { localStorage.setItem('wanderlings-walks', JSON.stringify(app.raw)); } catch {}
    } else {
      app.mode = 'demo';
    }
  } catch (err) {
    const cached = (() => { try { return JSON.parse(localStorage.getItem('wanderlings-walks')); } catch { return null; } })();
    if (cached) { app.raw = cached; app.mode = 'live'; toast('Couldn’t reach Ride with GPS — showing your last sync.'); }
    else app.mode = 'demo';
  }
  if (app.mode === 'demo') {
    const p = prog();
    app.raw = [...demoWalks(), ...p.extraWalks];
  }
  $('#sync').classList.remove('spinning');
  refresh();
  if (await ensureEggs()) refresh();
}

function refresh() {
  const p = prog();
  app.game = buildGame(app.raw, p);
  if (!p.initialized && !app.viewing) {
    // Demo starts with a couple of eggs waiting; a real account starts with
    // every past walk as an egg to hatch.
    if (app.mode === 'demo') p.seen = app.game.creatures.slice(0, -2).map(c => c.id);
    p.initialized = true;
    persist();
    app.game = buildGame(app.raw, p);
  }
  render();
}

// Keep a fresh batch of map eggs out there: one batch per week, each lasting
// two weeks, so missing a week is never a big deal.
async function ensureEggs(force = false) {
  if (app.viewing) return false;
  const p = prog();
  const g = buildGame(app.raw, p);
  if (!g.home) return;
  const week = mondayOf(new Date());
  const now = new Date();
  p.mapEggs = p.mapEggs.filter(e => e.expiresAt >= localISO(new Date(now - 30 * 864e5)) || g.eggs.find(x => x.id === e.id)?.collectedBy);
  const hasBatch = p.mapEggs.some(e => e.id.startsWith(week));
  if (hasBatch && !force) return false;
  if (force) { // "move my eggs": replace this week's uncollected ones
    const collected = new Set(g.eggs.filter(e => e.collectedBy).map(e => e.id));
    p.mapEggs = p.mapEggs.filter(e => !e.id.startsWith(week) || collected.has(e.id));
  }
  const exp = new Date(now); exp.setDate(exp.getDate() + EGG_LIFETIME_DAYS);
  const fresh = await generateEggs({
    home: g.home, stretchKm: g.nextStretch, batchId: `${week}#${Date.now().toString(36)}`,
    createdAt: localISO(now), expiresAt: localISO(exp),
  });
  p.mapEggs.push(...fresh);
  persist();
  return true;
}

// ---------------------------------------------------------------------------
// Rendering

function render() {
  const g = app.game;
  $('#demo-banner').hidden = app.mode !== 'demo' || Boolean(app.viewing);
  renderSwitcher();
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === app.tab));
  document.querySelectorAll('.view').forEach(v => v.hidden = v.id !== `view-${app.tab}`);
  const eggBadge = $('#egg-count');
  eggBadge.textContent = g.unseen.length;
  eggBadge.hidden = !g.unseen.length;

  if (app.tab === 'home') renderHome(g);
  if (app.tab === 'garden') renderGarden(g); else garden.stop();
  if (app.tab === 'map') renderMap(g);
  if (app.tab === 'dex') renderDex(g);
  if (app.tab === 'walks') renderWalks(g);
}

// A little "whose garden" switcher, shown only when a garden is shared with me.
function renderSwitcher() {
  const el = $('#switcher');
  el.hidden = !app.shared.length;
  if (!app.shared.length) return;
  const cur = app.viewing?.owner_id || '';
  el.innerHTML = [{ owner_id: '', display_name: 'Mine' }, ...app.shared].map(g =>
    `<button class="${g.owner_id === cur ? 'on' : ''}" data-view="${g.owner_id}">🌷 ${g.owner_id ? `${esc(g.display_name)}’s` : 'Mine'}</button>`).join('');
}

const GREETINGS = ['Every walk counts — even the tiny ones.', 'Fresh air is a win all by itself.', 'Slow walks are still walks. 🌿', 'Your creatures missed you!', 'No rush. The garden will wait.'];

function renderHome(g) {
  const who = app.viewing ? esc(app.viewing.display_name) : null;
  const name = who ? `${who}’s garden.` : app.athlete ? `Hi ${esc(app.athlete)}!` : 'Hi there!';
  const c = g.companion;
  const week = mondayOf(new Date());
  const weekWalks = g.walks.filter(w => w.week === week);
  const goal = saved.settings.weeklyGoal;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const monday = parseLocal(week);
  const dayDone = days.map((_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return weekWalks.some(w => w.date === ymd(d)); });
  const todayIdx = (new Date().getDay() + 6) % 7;
  const weekMsg = weekWalks.length >= goal ? `Goal met — ${weekWalks.length} walk${weekWalks.length > 1 ? 's' : ''} this week. Lovely. 💛`
    : weekWalks.length ? `${weekWalks.length} of ${goal} walks this week. Nice going.` : `A fresh week. Any walk, any length, counts.`;

  const recent = g.walks.slice(-10);
  const maxKm = Math.max(g.nextStretch, ...recent.map(w => w.km), 0.5) * 1.1;
  const bars = recent.map((w, i) => {
    const h = (w.km / maxKm) * 80;
    return `<rect x="${i * 28 + 4}" y="${90 - h}" width="20" height="${h}" rx="5" fill="${w.beatStretch ? 'var(--gold)' : 'var(--leaf)'}"><title>${niceDate(w.start)} · ${fmtDist(w.km)}</title></rect>`;
  }).join('');
  const lineY = 90 - (g.nextStretch / maxKm) * 80;
  const nearestEgg = g.home && g.activeEggs.length ? Math.min(...g.activeEggs.map(e => distM(g.home, [e.lat, e.lng]))) / 1000 : null;

  $('#view-home').innerHTML = `
    <p class="greeting"><strong>${name}</strong> ${who ? 'You’re visiting, so have a look around. 💛' : GREETINGS[new Date().getDate() % GREETINGS.length]}</p>

    ${who && g.unseen.length ? `<div class="card egg-banner">
        <div class="egg-mini wobble">${eggSVG('rare')}</div>
        <div><strong>${who} has ${g.unseen.length} egg${g.unseen.length > 1 ? 's' : ''} waiting</strong><br><span class="muted">Only she can hatch them. Maybe give her a nudge?</span></div>
      </div>` : ''}
    ${!who && g.unseen.length ? `<button class="card egg-banner" data-action="hatch">
        <div class="egg-mini wobble">${eggSVG(g.unseen[0].golden || g.unseen[0].fromMap ? 'legendary' : g.unseen[0].species.rarity)}</div>
        <div><strong>${g.unseen.length} egg${g.unseen.length > 1 ? 's' : ''} ready to hatch!</strong><br><span class="muted">From your walks. Tap to hatch.</span></div>
      </button>` : ''}

    ${c ? `<button class="card companion" data-creature="${c.id}">
        <div class="companion-art bob" style="--s:${c.stage.scale}">${creatureSVG(c.species)}</div>
        <div class="companion-info">
          <div class="eyebrow">${who ? `${who}’s companion` : 'Your companion'}</div>
          <h2>${esc(c.name)}</h2>
          <div class="muted">${c.stage.name} ${c.name !== c.species.name ? `· ${c.species.name}` : ''}</div>
          ${progressBar(c)}
        </div>
      </button>` : ''}

    <section class="card">
      <div class="card-head"><h3>✨ Stretch walk</h3><span class="pill gold">${fmtDist(g.nextStretch)}</span></div>
      <p>Walk <strong>${fmtDist(g.nextStretch)}</strong> or more to find a <strong>golden egg</strong>. It grows a little as you do. Your recent walks average ${fmtDist(g.recentAvg || 0)}.</p>
      ${recent.length ? `<svg viewBox="0 0 ${Math.max(recent.length, 1) * 28 + 8} 96" class="bars" preserveAspectRatio="none">${bars}
        <line x1="0" x2="100%" y1="${lineY}" y2="${lineY}" stroke="var(--gold)" stroke-dasharray="4 4" stroke-width="2"/></svg>
        <div class="muted small">Your last ${recent.length} walks · golden bars beat the stretch · dashed line is your next one</div>` : ''}
    </section>

    ${nearestEgg != null ? `<button class="card map-teaser" data-tab="map">
        <div class="map-teaser-icon">🗺️</div>
        <div><strong>${g.activeEggs.length} egg${g.activeEggs.length > 1 ? 's' : ''} hidden near home</strong><br>
        <span class="muted">The closest is about ${fmtDist(nearestEgg)} away. Walk past it to collect it.</span></div>
      </button>` : ''}

    <section class="card">
      <div class="card-head"><h3>This week</h3><span class="muted small">goal: ${goal} walk${goal > 1 ? 's' : ''}</span></div>
      <div class="week-dots">${days.map((d, i) => `<div class="dot ${dayDone[i] ? 'done' : ''} ${i === todayIdx ? 'today' : ''}"><span>${dayDone[i] ? '🐾' : ''}</span><small>${d}</small></div>`).join('')}</div>
      <p class="muted">${weekMsg}</p>
    </section>

    <section class="stats">
      <div><strong>${g.walks.length}</strong><small>walks</small></div>
      <div><strong>${fmtDist(g.totalKm)}</strong><small>walked</small></div>
      <div><strong>${fmtMin(g.totalMin)}</strong><small>outside</small></div>
      <div><strong>${Object.keys(g.caught).length}/${SPECIES.length}</strong><small>species</small></div>
    </section>`;
}

function progressBar(c) {
  const { stage } = c;
  if (!stage.next) return `<div class="muted small">Fully grown! ✨ ${fmtDist(c.bond)} walked together</div>`;
  const pct = Math.min(100, ((c.bond - stage.km) / (stage.next.km - stage.km)) * 100);
  return `<div class="progress"><div style="width:${pct}%"></div></div>
    <div class="muted small">${fmtDist(stage.next.km - c.bond)} more together to grow into a ${stage.next.name}</div>`;
}

function renderGarden(g) {
  // Companion, named friends and the newest arrivals get to be in the garden.
  const hatched = g.creatures.filter(c => prog().seen.includes(c.id));
  const chosen = [...new Set([g.companion, ...hatched.filter(c => c.name !== c.species.name), ...hatched.slice().reverse()].filter(Boolean))].slice(0, 18);
  garden.render({ creatures: chosen, totalKm: g.totalKm, companionId: g.companion?.id });
  const next = GIFTS.find(x => x.km > g.totalKm);
  $('#garden-info').innerHTML = `
    <p class="muted small center">Tap a creature to name it, pet it, or play. ${hatched.length > chosen.length ? `${chosen.length} of ${hatched.length} friends are out right now.` : ''}</p>
    ${next ? `<div class="card gift-next"><div class="gift-icon">🎁</div><div><strong>Next garden gift: ${next.name}</strong>
      <div class="progress"><div style="width:${(g.totalKm / next.km) * 100}%"></div></div>
      <span class="muted small">${fmtDist(next.km - g.totalKm)} more walking in total</span></div></div>` : '<p class="center">Your garden is complete! 🌈</p>'}`;
}

function renderMap(g) {
  const el = $('#map');
  if (!g.home) {
    $('#map-info').innerHTML = `<p class="card">Go on a walk with GPS turned on and your eggs will appear here.</p>`;
    return;
  }
  if (!app.map) {
    app.map = L.map(el, { zoomControl: false, attributionControl: true }).setView(g.home, 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(app.map);
    L.control.zoom({ position: 'bottomright' }).addTo(app.map);
    app.mapLayer = L.layerGroup().addTo(app.map);
  }
  setTimeout(() => app.map.invalidateSize(), 50);
  const layer = app.mapLayer; layer.clearLayers();
  L.circle(g.home, { radius: g.nextStretch / 2 * 0.8 * 1000, color: '#e0a020', weight: 1.5, dashArray: '5 6', fill: false }).addTo(layer);
  for (const w of g.walks.slice(-12)) if (w.points.length > 1) L.polyline(w.points, { color: '#7bb36b', weight: 3, opacity: .35 }).addTo(layer);
  L.marker(g.home, { icon: L.divIcon({ className: 'pin', html: '<div class="pin-home">🏡</div>', iconSize: [34, 34], iconAnchor: [17, 17] }) }).addTo(layer);

  const now = localISO(new Date());
  const shown = g.eggs.filter(e => e.collectedBy || e.expiresAt >= now);
  for (const e of shown) {
    const t = MAP_TIERS[e.tier];
    const done = Boolean(e.collectedBy);
    const icon = L.divIcon({ className: 'pin', html: `<div class="pin-egg ${done ? 'done' : 'wobble'}" style="--tint:${t.color}">${done ? '🐣' : eggSVG(e.tier === 'far' ? 'legendary' : e.tier === 'stretch' ? 'rare' : 'uncommon')}</div>`, iconSize: [40, 40], iconAnchor: [20, 34] });
    const km = distM(g.home, [e.lat, e.lng]) / 1000;
    const daysLeft = Math.max(0, Math.ceil((parseLocal(e.expiresAt) - new Date()) / 864e5));
    const popup = done ? `<strong>${t.label}</strong><br>Collected! 🎉`
      : `<strong>${t.label}</strong><br>About ${fmtDist(km)} from home (${fmtDist(km * 2)} there and back)<br><span class="muted">Here for ${daysLeft} more day${daysLeft === 1 ? '' : 's'}</span>
         ${app.mode === 'demo' && !app.viewing ? `<br><button class="btn small" data-action="demo-walk" data-egg="${e.id}">Pretend I walked here</button>` : ''}`;
    L.marker([e.lat, e.lng], { icon }).bindPopup(popup).addTo(layer);
    if (!done) L.circle([e.lat, e.lng], { radius: EGG_REACH_M, color: t.color, weight: 1, fillOpacity: .08 }).addTo(layer);
  }
  const bounds = L.latLngBounds([g.home, ...shown.map(e => [e.lat, e.lng])]);
  if (!app.mapFitted) { app.map.fitBounds(bounds.pad(0.25)); app.mapFitted = true; }

  $('#map-info').innerHTML = `
    <div class="card">
      <p><strong>Eggs are hidden around home.</strong> Walk within about ${EGG_REACH_M} m of one and it's yours next time you sync. The dashed ring is your stretch distance.</p>
      <div class="legend">${Object.values(MAP_TIERS).map(t => `<span><i style="background:${t.color}"></i>${t.label}</span>`).join('')}</div>
      ${app.viewing ? '' : `<div class="row">
        <button class="btn ghost small" data-action="reroll">↻ Move this week’s eggs</button>
        <button class="btn ghost small" data-action="set-home">🏡 Set home to map centre</button>
      </div>`}
    </div>`;
}

function renderDex(g) {
  const groups = [['Everyday friends', s => s.rarity === 'common'], ['Time & season', s => /dawnfinch|sunbun|duskmoth|glowwisp|sundaisy|frostbun|blossomb|buzzlet|acornet/.test(s.id)],
    ['Distance & hills', s => /strollkit|wanderwool|trailtusk|lumenlong|hillhop|peakpuff|slowpaw/.test(s.id)], ['Explorers (map eggs)', s => s.mapTier], ['Special', s => /pramble|kinbloom|hearthling/.test(s.id)]];
  const hatched = new Set(prog().seen);
  $('#view-dex').innerHTML = `<p class="muted center">${Object.keys(g.caught).length} of ${SPECIES.length} species met</p>` + groups.map(([title, f]) => `
    <h3 class="section-title">${title}</h3>
    <div class="dex">${SPECIES.filter(f).map(s => {
      const n = g.creatures.filter(c => c.species.id === s.id && hatched.has(c.id)).length;
      return `<button class="dex-card ${n ? '' : 'unknown'}" data-species="${s.id}">
        <div class="dex-art">${creatureSVG(s, { silhouette: !n })}</div>
        <div class="dex-name">${n ? s.name : '???'}</div>
        ${n ? `<div class="dex-count">×${n}</div>` : `<div class="dex-hint">${s.hint(fmtDist)}</div>`}
      </button>`;
    }).join('')}</div>`).join('');
}

function routeSVG(points) {
  if (points.length < 2) return '<div class="route none">🚶‍♀️</div>';
  const lats = points.map(p => p[0]), lngs = points.map(p => p[1]);
  const k = Math.cos(lats[0] * Math.PI / 180);
  const minX = Math.min(...lngs) * k, maxX = Math.max(...lngs) * k, minY = Math.min(...lats), maxY = Math.max(...lats);
  const span = Math.max(maxX - minX, maxY - minY) || 1e-6;
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${(4 + (p[1] * k - minX) / span * 40).toFixed(1)} ${(4 + (maxY - p[0]) / span * 40).toFixed(1)}`).join('');
  return `<svg viewBox="0 0 48 48" class="route"><path d="${d}" fill="none" stroke="var(--leaf-dark)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderWalks(g) {
  const hatched = new Set(prog().seen);
  $('#view-walks').innerHTML = g.walks.length ? g.walks.slice().reverse().map(w => `
    <div class="card walk">
      ${routeSVG(w.points)}
      <div class="walk-info">
        <strong>${esc(w.name)}</strong>
        <div class="muted small">${niceDate(w.start)} · ${fmtDist(w.km)} · ${fmtMin(w.min)}</div>
        ${w.beatStretch ? `<span class="pill gold">✨ beat stretch (${fmtDist(w.stretch)})</span>` : ''}
      </div>
      <div class="walk-found">${w.found.map(c => hatched.has(c.id)
        ? `<button class="mini-creature" data-creature="${c.id}" title="${esc(c.name)}">${creatureSVG(c.species)}</button>`
        : `<button class="mini-creature" ${app.viewing ? 'disabled' : 'data-action="hatch"'} title="Unhatched egg">${eggSVG(c.golden || c.fromMap ? 'legendary' : c.species.rarity)}</button>`).join('')}</div>
    </div>`).join('') : (app.viewing ? `<p class="card">No walks from ${esc(app.viewing.display_name)} yet.</p>` : '<p class="card">No walks yet. Your first one is waiting! 🌼</p>');
}

// ---------------------------------------------------------------------------
// Sheets (modals)

function openSheet(html) {
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  requestAnimationFrame(() => $('#sheet').classList.add('open'));
}
function closeSheet() {
  $('#sheet').classList.remove('open');
  setTimeout(() => { $('#sheet').hidden = true; }, 200);
}

function openCreature(id) {
  const c = app.game.byId[id];
  if (!c) return;
  const r = RARITY[c.species.rarity];
  const isComp = app.game.companion?.id === c.id;
  const origin = c.fromMap ? `found in a ${MAP_TIERS[c.fromMap].label.toLowerCase()}` : c.golden ? 'hatched from a golden egg' : 'met';
  openSheet(`
    <div class="sheet-art bob" style="--s:${c.stage.scale}">${creatureSVG(c.species)}</div>
    ${app.viewing ? `<h2 class="center">${esc(c.name)}</h2><div class="center muted small">${c.species.name} #${c.nth}</div>`
      : `<input class="name-input" id="name-input" value="${esc(c.name)}" maxlength="24" aria-label="Name" data-id="${c.id}">
    <div class="center muted small">tap the name to rename · ${c.species.name} #${c.nth}</div>`}
    <div class="chips center"><span class="pill" style="background:${r.color}22;color:${r.color}">${r.label}</span><span class="pill">${c.stage.name}</span><span class="pill">♥ ${c.love}</span>${isComp ? '<span class="pill gold">★ Companion</span>' : ''}</div>
    <div class="actions">${ACTIONS.map(a => `<button class="action" data-act="${a.id}" data-id="${c.id}"><span>${a.icon}</span>${a.label}</button>`).join('')}</div>
    <div class="card inset">${progressBar(c)}</div>
    <p class="flavor">“${c.species.flavor}”</p>
    <p class="muted small center">${origin[0].toUpperCase() + origin.slice(1)} on ${niceDate(c.walk.start)} · ${esc(c.walk.name)}</p>
    ${isComp || app.viewing ? '' : `<button class="btn" data-action="companion" data-id="${c.id}">★ Make ${esc(c.name)} my companion</button>
      <p class="muted small center">Your companion grows with every ${saved.settings.unit} you walk together.</p>`}
  `);
}

function openSpecies(sid) {
  const s = BY_ID[sid];
  const hatched = new Set(prog().seen);
  const mine = app.game.creatures.filter(c => c.species.id === sid && hatched.has(c.id));
  const r = RARITY[s.rarity];
  if (!mine.length) return openSheet(`
    <div class="sheet-art">${creatureSVG(s, { silhouette: true })}</div>
    <h2 class="center">???</h2><div class="chips center"><span class="pill" style="background:${r.color}22;color:${r.color}">${r.label}</span></div>
    <p class="center"><strong>How to meet:</strong> ${s.hint(fmtDist)}</p>`);
  openSheet(`
    <div class="sheet-art">${creatureSVG(s)}</div>
    <h2 class="center">${s.name}</h2>
    <div class="chips center"><span class="pill" style="background:${r.color}22;color:${r.color}">${r.label}</span></div>
    <p class="flavor">“${s.flavor}”</p>
    <h3>${app.viewing ? `${esc(app.viewing.display_name)}’s` : 'Your'} ${s.name}s</h3>
    <div class="friends">${mine.map(c => `<button class="friend" data-creature="${c.id}"><div class="mini">${creatureSVG(s)}</div>${esc(c.name)}<small>${c.stage.name}</small></button>`).join('')}</div>`);
}

// Hatching, one egg at a time, with a chance to name each newcomer.
function openHatch() {
  if (app.viewing) return;
  const next = app.game.unseen[0];
  if (!next) return closeSheet();
  const isNew = !app.game.creatures.some(c => c.species.id === next.species.id && prog().seen.includes(c.id));
  const rarity = next.golden || next.fromMap ? 'legendary' : next.species.rarity;
  const why = next.fromMap ? `🗺️ You found a ${MAP_TIERS[next.fromMap].label.toLowerCase()} on the map!` : next.golden ? `✨ Golden egg: you walked past your stretch of ${fmtDist(next.walk.stretch)}!` : `From your ${fmtDist(next.walk.km)} walk on ${niceDate(next.walk.start)}`;
  openSheet(`
    <div class="hatch" data-id="${next.id}">
      <p class="center muted">${why}</p>
      <button class="hatch-egg wobble" data-action="crack" aria-label="Hatch egg">${eggSVG(rarity)}</button>
      <p class="center hatch-tip">Tap the egg!</p>
      <div class="hatch-reveal" hidden>
        <div class="sheet-art pop">${creatureSVG(next.species)}</div>
        <h2 class="center">${isNew ? 'New friend! ' : ''}A ${next.species.name}!</h2>
        <p class="flavor">“${next.species.flavor}”</p>
        <label class="center muted small" for="hatch-name">Give them a name?</label>
        <input class="name-input" id="hatch-name" placeholder="${next.species.name}" maxlength="24">
        <button class="btn" data-action="hatch-next" data-id="${next.id}">${app.game.unseen.length > 1 ? `Next egg (${app.game.unseen.length - 1} left) →` : 'Welcome to the garden! 🌷'}</button>
        ${app.game.unseen.length > 5 ? `<button class="btn ghost small" data-action="hatch-all">Hatch the rest all at once</button>` : ''}
      </div>
    </div>`);
}

async function openSettings() {
  const s = saved.settings;
  const shares = await myShares().catch(() => []);
  openSheet(`
    <h2>Settings</h2>
    ${app.viewing ? `<p class="card inset">You’re visiting ${esc(app.viewing.display_name)}’s garden. <button class="link" data-view="">Back to mine</button></p>` : ''}
    <label class="field">Distance units
      <div class="seg">${['mi', 'km'].map(u => `<button class="${s.unit === u ? 'on' : ''}" data-unit="${u}">${u === 'mi' ? 'Miles' : 'Kilometres'}</button>`).join('')}</div></label>
    <label class="field">Weekly walk goal
      <div class="seg">${[1, 2, 3, 4, 5].map(n => `<button class="${s.weeklyGoal === n ? 'on' : ''}" data-goal="${n}">${n}</button>`).join('')}</div>
      <span class="muted small">Keep it gentle. Missing it doesn't break anything.</span></label>
    ${app.viewing ? '' : `<div class="field">Ride with GPS
      ${app.mode === 'live' ? `<p>Connected. Walks you record in the Ride with GPS app show up here when you sync (↻).</p><button class="btn ghost" data-action="disconnect">Disconnect Ride with GPS</button>`
        : app.configured ? `<p>You're exploring demo walks. Record walks with the free Ride with GPS app, then connect it here.</p><button class="btn rwgps" data-action="connect-rwgps">Connect Ride with GPS</button>`
        : `<p class="muted">Ride with GPS isn't set up on the server yet (see README.md). Until then, demo walks are shown.</p>`}
    </div>`}
    <div class="field">Sharing
      <p class="muted">${shares.length ? 'These people can see your walks and garden (they can’t change anything):' : 'Nobody else can see your walks or garden.'}</p>
      ${shares.map(v => `<div class="share-row"><span>${esc(v)}</span><button class="btn ghost small" data-action="share-remove" data-email="${esc(v)}">Stop sharing</button></div>`).join('')}
      <form class="share-add" data-form="share">
        <input name="email" type="email" placeholder="Share with (email)" required>
        <button class="btn small" type="submit">Share</button>
      </form>
    </div>
    <div class="field">Account
      <p class="muted">Signed in as ${esc(userEmail() || '')}</p>
      <button class="btn ghost" data-action="sign-out">Sign out</button>
    </div>
    ${app.mode === 'demo' && !app.viewing ? `<button class="btn ghost small" data-action="reset-demo">Reset demo</button>` : ''}`);
}

// ---------------------------------------------------------------------------
// Events

function wireEvents() {
  document.addEventListener('click', async e => {
    const t = e.target.closest('button, a, [data-tab]');
    if (!t) { if (e.target.id === 'sheet') closeSheet(); return; }
    const d = t.dataset;
    const p = prog();

    if (d.tab) { app.tab = d.tab; closeSheet(); render(); window.scrollTo(0, 0); return; }
    if ('view' in d) return viewGarden(d.view || null);
    if (d.creature) return openCreature(d.creature);
    if (d.species) return openSpecies(d.species);
    if (d.unit) { saved.settings.unit = d.unit; persist(); render(); return openSettings(); }
    if (d.goal) { saved.settings.weeklyGoal = Number(d.goal); persist(); render(); return openSettings(); }
    if (d.act) {
      if (!app.viewing) {
        p.love[d.id] = (p.love[d.id] || 0) + 1;
        persist();
        app.game.byId[d.id].love = p.love[d.id];
      }
      if (app.tab !== 'garden') { app.tab = 'garden'; render(); }
      closeSheet();
      setTimeout(() => garden.act(d.id, d.act), 250);
      return;
    }

    switch (d.action) {
      case 'close': return closeSheet();
      case 'settings': return openSettings();
      case 'sync': return sync();
      case 'hatch': return openHatch();
      case 'crack': {
        t.classList.remove('wobble'); t.classList.add('cracking');
        $('.hatch-tip').hidden = true;
        setTimeout(() => { t.hidden = true; $('.hatch-reveal').hidden = false; confetti(); }, 900);
        return;
      }
      case 'hatch-next': {
        const nm = $('#hatch-name').value.trim();
        if (nm) p.names[d.id] = nm;
        p.seen.push(d.id); persist(); refresh();
        return app.game.unseen.length ? openHatch() : closeSheet();
      }
      case 'hatch-all': {
        const nm = $('#hatch-name').value.trim();
        if (nm) p.names[$('.hatch').dataset.id] = nm;
        p.seen.push(...app.game.unseen.map(c => c.id)); persist(); refresh(); closeSheet();
        return toast('All hatched! Check your creature book. 📖');
      }
      case 'companion': {
        p.companions.push({ id: d.id, since: localISO(new Date()) });
        persist(); refresh(); openCreature(d.id);
        return toast(`${app.game.byId[d.id].name} is your companion now! ★`);
      }
      case 'reroll': { toast('Hiding new eggs…'); await ensureEggs(true); app.mapFitted = false; return refresh(); }
      case 'set-home': {
        const c = app.map.getCenter(); p.home = [c.lat, c.lng];
        await ensureEggs(true); app.mapFitted = false; refresh();
        return toast('Home moved, and fresh eggs are hidden around it.');
      }
      case 'demo-walk': {
        // Demo only: fake an out-and-back walk to an egg so the flow can be tried.
        const egg = app.game.eggs.find(x => x.id === d.egg);
        const home = app.game.home;
        const km = distM(home, [egg.lat, egg.lng]) / 1000 * 2.2;
        p.extraWalks.push({ id: `demo-x${Date.now()}`, name: 'Egg hunt walk', start: localISO(new Date()), distance: km * 1000, movingTime: km * 1200, elevation: 10, points: [home, [egg.lat, egg.lng], home] });
        persist(); app.map.closePopup(); await sync();
        return toast('Walk synced! You have new eggs to hatch. 🥚');
      }
      case 'disconnect': await api('disconnect', { method: 'POST' }); closeSheet(); return sync();
      case 'connect-rwgps': {
        t.disabled = true;
        try { location.href = (await api('authorize', { method: 'POST' })).url; }
        catch (err) { t.disabled = false; toast(`Couldn’t start Ride with GPS sign-in: ${err.message}`); }
        return;
      }
      case 'sign-out': return signOut();
      case 'share-remove': {
        try { await removeShare(d.email); toast(`Stopped sharing with ${d.email}.`); }
        catch (err) { toast(`Couldn’t stop sharing: ${err.message}`); }
        return openSettings();
      }
      case 'reset-demo': delete saved.buckets.demo; persist(); closeSheet(); app.mapFitted = false; return sync();
    }
  });

  document.addEventListener('submit', async e => {
    if (e.target.dataset.form !== 'share') return;
    e.preventDefault();
    const email = e.target.email.value.trim();
    try { await addShare(email); toast(`${email} can now see your garden.`); }
    catch (err) { toast(`Couldn’t share: ${err.message}`); }
    openSettings();
  });

  // Renaming from the creature sheet saves on change/enter.
  document.addEventListener('change', e => {
    if (e.target.id !== 'name-input') return;
    const p = prog(), id = e.target.dataset.id, nm = e.target.value.trim();
    if (nm && nm !== app.game.byId[id].species.name) p.names[id] = nm; else delete p.names[id];
    persist(); refresh();
    toast(nm ? `Say hi to ${nm}! 💛` : 'Name cleared.');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('name-input')) e.target.blur();
    if (e.key === 'Escape') closeSheet();
  });
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2800);
}

function confetti() {
  const box = $('#sheet-body');
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = ['✿', '♥', '✦', '•', '❀'][i % 5];
    s.style.left = `${50 + (Math.random() - 0.5) * 70}%`;
    s.style.color = ['#ff9fb2', '#ffd84d', '#9fd4f5', '#a8eea0', '#c3a6ff'][i % 5];
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 220}px`);
    s.style.animationDelay = `${Math.random() * 0.2}s`;
    box.appendChild(s);
    setTimeout(() => s.remove(), 1600);
  }
}

init();
