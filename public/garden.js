// The garden: a little living scene where her creatures wander and play.
// Decorations ("garden gifts") unlock with total distance walked.

import { creatureSVG } from './creatures.js';

export const GIFTS = [
  { id: 'flowers',   name: 'Wildflowers',     km: 0,   x: 12, y: 86, art: '🌼', size: 26, act: { emoji: '🌸', verb: 'sniffs the flowers' } },
  { id: 'mushrooms', name: 'Mushroom ring',   km: 2,   x: 84, y: 88, art: '🍄', size: 26, act: { emoji: '🎶', verb: 'dances in the mushroom ring' } },
  { id: 'pond',      name: 'Little pond',     km: 5,   x: 70, y: 66, art: 'pond',           act: { emoji: '💦', verb: 'splashes in the pond' } },
  { id: 'tree',      name: 'Apple tree',      km: 10,  x: 18, y: 58, art: '🌳', size: 70, act: { emoji: '🍎', verb: 'finds an apple' } },
  { id: 'bench',     name: 'Garden bench',    km: 18,  x: 42, y: 60, art: 'bench',          act: { emoji: '☁️', verb: 'watches the clouds' } },
  { id: 'lanterns',  name: 'Fairy lanterns',  km: 28,  x: 56, y: 52, art: 'lanterns',       act: { emoji: '✨', verb: 'chases the fairy lights' } },
  { id: 'stones',    name: 'Stepping stones', km: 40,  x: 50, y: 80, art: 'stones',         act: { emoji: '🐾', verb: 'hops across the stones' } },
  { id: 'cottage',   name: 'Tiny cottage',    km: 55,  x: 86, y: 50, art: '🏡', size: 56, act: { emoji: '🍵', verb: 'has a cup of tea' } },
  { id: 'rainbow',   name: 'Rainbow',         km: 75,  x: 50, y: 10, art: 'rainbow' },
  { id: 'balloon',   name: 'Hot air balloon', km: 100, x: 80, y: 14, art: '🎈', size: 34 },
];

export const ACTIONS = [
  { id: 'pet',   label: 'Pet',   icon: '💗' },
  { id: 'play',  label: 'Play',  icon: '⚽' },
  { id: 'snack', label: 'Snack', icon: '🍓' },
  { id: 'dance', label: 'Dance', icon: '🎵' },
  { id: 'nap',   label: 'Nap',   icon: '💤' },
];

const SNACKS = ['🍓', '🫐', '🍎', '🥕', '🍪', '🌰'];
const CHATTER = ['♪', '!', '♥', '?', '…', 'hehe', '✿'];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function giftArt(g) {
  if (g.art === 'pond') return `<svg viewBox="0 0 120 50" width="130"><ellipse cx="60" cy="27" rx="58" ry="21" fill="#7cc4e8"/><ellipse cx="60" cy="25" rx="50" ry="16" fill="#a8dcf5"/><ellipse cx="38" cy="22" rx="10" ry="3" fill="#fff" opacity=".6"/><text x="84" y="34" font-size="13">🪷</text></svg>`;
  if (g.art === 'bench') return `<svg viewBox="0 0 70 40" width="74"><rect x="4" y="8" width="62" height="6" rx="2" fill="#b07a4f"/><rect x="4" y="18" width="62" height="6" rx="2" fill="#c48a5c"/><rect x="10" y="24" width="5" height="14" fill="#8a5a38"/><rect x="55" y="24" width="5" height="14" fill="#8a5a38"/></svg>`;
  if (g.art === 'lanterns') return `<svg viewBox="0 0 140 30" width="150"><path d="M2 4 Q70 30 138 4" stroke="#6b5a4a" stroke-width="1.5" fill="none"/>${[20, 45, 70, 95, 120].map((x, i) => `<circle class="lantern" style="animation-delay:${i * .3}s" cx="${x}" cy="${4 + 26 * (1 - Math.pow((x - 70) / 68, 2)) * .5 + 3}" r="4.5" fill="${['#ffd84d', '#ff9fb2', '#9fd4f5', '#b8f0a0', '#ffd84d'][i]}"/>`).join('')}</svg>`;
  if (g.art === 'stones') return `<svg viewBox="0 0 120 24" width="120">${[10, 38, 66, 94].map((x, i) => `<ellipse cx="${x + 8}" cy="${i % 2 ? 8 : 16}" rx="11" ry="5" fill="#cfc8d8"/>`).join('')}</svg>`;
  if (g.art === 'rainbow') return `<svg viewBox="0 0 200 100" width="260">${['#ff9a9a', '#ffc98a', '#fff08a', '#a8eea0', '#9fd4f5', '#c3a6ff'].map((c, i) => `<path d="M${10 + i * 7} 100 A ${90 - i * 7} ${90 - i * 7} 0 0 1 ${190 - i * 7} 100" stroke="${c}" stroke-width="7" fill="none" opacity=".55"/>`).join('')}</svg>`;
  return `<span style="font-size:${g.size}px;line-height:1">${g.art}</span>`;
}

function skyClass() {
  const h = new Date().getHours();
  if (h >= 5 && h < 8) return 'sky-dawn';
  if (h >= 8 && h < 17) return 'sky-day';
  if (h >= 17 && h < 20) return 'sky-dusk';
  return 'sky-night';
}

export class Garden {
  constructor(el, { onTap }) {
    this.el = el;
    this.onTap = onTap;
    this.actors = new Map();
    this.timer = null;
    el.addEventListener('click', e => {
      const node = e.target.closest('.gc');
      if (node) this.onTap(node.dataset.id);
    });
  }

  render({ creatures, totalKm, companionId }) {
    this.stop();
    const unlocked = GIFTS.filter(g => totalKm >= g.km);
    this.spots = unlocked.filter(g => g.act);
    const sky = skyClass();
    this.el.className = `garden ${sky}`;
    this.el.innerHTML = `
      <div class="g-sky">${sky === 'sky-night' ? '<div class="g-moon"></div><div class="g-stars"></div>' : '<div class="g-sun"></div>'}
        <div class="g-cloud" style="top:14%;animation-duration:70s"></div><div class="g-cloud small" style="top:28%;animation-duration:95s;animation-delay:-40s"></div></div>
      <div class="g-hill back"></div><div class="g-hill front"></div>
      ${unlocked.map(g => `<div class="g-gift" style="left:${g.x}%;top:${g.y}%;z-index:${Math.round(g.y)}" title="${g.name}">${giftArt(g)}</div>`).join('')}
      <div class="g-actors"></div>`;
    const layer = this.el.querySelector('.g-actors');
    this.actors.clear();
    for (const c of creatures) {
      const node = document.createElement('div');
      node.className = 'gc';
      node.dataset.id = c.id;
      node.innerHTML = `<div class="gc-bubble"></div><div class="gc-body">${creatureSVG(c.species)}</div><div class="gc-name">${c.id === companionId ? '★ ' : ''}${escapeHtml(c.name)}</div>`;
      layer.appendChild(node);
      const a = { c, node, x: rand(10, 90), y: rand(56, 92), busyUntil: 0, nextAt: performance.now() + rand(300, 4000) };
      this.actors.set(c.id, a);
      this.place(a, 0);
    }
    this.timer = setInterval(() => this.tick(), 400);
  }

  stop() { clearInterval(this.timer); this.timer = null; }

  place(a, ms) {
    const depth = (a.y - 50) / 45; // 0 back → 1 front
    const px = Math.round((50 + depth * 26) * a.c.stage.scale);
    a.node.style.transition = ms ? `left ${ms}ms linear, top ${ms}ms linear, width ${ms}ms` : 'none';
    a.node.style.left = `${a.x}%`;
    a.node.style.top = `${a.y}%`;
    a.node.style.width = `${px}px`;
    a.node.style.zIndex = Math.round(a.y) + 1;
  }

  bubble(a, text, ms = 1800) {
    const b = a.node.querySelector('.gc-bubble');
    b.textContent = text;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(a.bubbleT);
    a.bubbleT = setTimeout(() => b.classList.remove('show'), ms);
  }

  pose(a, cls, ms) {
    const body = a.node.querySelector('.gc-body');
    body.className = 'gc-body ' + cls;
    clearTimeout(a.poseT);
    a.poseT = setTimeout(() => { body.className = 'gc-body'; }, ms);
  }

  walkTo(a, x, y, then) {
    const dist = Math.hypot(x - a.x, (y - a.y) * 1.5);
    const ms = Math.max(600, dist * 90);
    a.node.querySelector('.gc-body').style.setProperty('--flip', x < a.x ? -1 : 1);
    a.x = x; a.y = y;
    this.place(a, ms);
    this.pose(a, 'walking', ms);
    a.busyUntil = performance.now() + ms + 200;
    if (then) setTimeout(then, ms);
  }

  tick() {
    const now = performance.now();
    for (const a of this.actors.values()) {
      if (now < a.nextAt || now < a.busyUntil) continue;
      a.nextAt = now + rand(3000, 9000);
      const r = Math.random();
      if (r < 0.38) this.walkTo(a, rand(8, 92), rand(56, 92));
      else if (r < 0.52 && this.spots.length) {
        const s = pick(this.spots);
        this.walkTo(a, s.x + rand(-6, 6), Math.max(54, Math.min(94, s.y + rand(2, 8))), () => { this.bubble(a, s.act.emoji, 2200); this.pose(a, 'hop', 900); });
      } else if (r < 0.64) this.chat(a);
      else if (r < 0.72) { this.pose(a, 'hop', 900); }
      else if (r < 0.78) { this.pose(a, 'wiggle', 1600); this.bubble(a, '♪', 1600); }
      else if (r < 0.84) { this.nap(a, 6000); }
      else if (r < 0.88) { this.bubble(a, pick(['🦋', '🐞', '🍃', '🌼']), 2000); this.pose(a, 'look', 2000); }
    }
  }

  chat(a) {
    const others = [...this.actors.values()].filter(o => o !== a && performance.now() > o.busyUntil);
    if (!others.length) return;
    const o = pick(others);
    const side = o.x > 50 ? -7 : 7;
    this.walkTo(a, o.x + side, o.y, () => {
      a.node.querySelector('.gc-body').style.setProperty('--flip', side > 0 ? -1 : 1);
      o.node.querySelector('.gc-body').style.setProperty('--flip', side > 0 ? 1 : -1);
      o.busyUntil = performance.now() + 2600;
      this.bubble(a, pick(CHATTER), 1300);
      setTimeout(() => this.bubble(o, pick(CHATTER), 1300), 1100);
      setTimeout(() => { this.pose(a, 'hop', 800); this.pose(o, 'hop', 800); }, 2200);
    });
  }

  nap(a, ms) {
    this.pose(a, 'nap', ms);
    this.bubble(a, '💤', ms);
    a.busyUntil = performance.now() + ms;
  }

  // Called when she picks an action for a creature.
  act(id, action) {
    const a = this.actors.get(id);
    if (!a) return;
    a.nextAt = performance.now() + 5000;
    if (action === 'pet') { this.pose(a, 'hop', 900); this.hearts(a); this.bubble(a, '♥', 1500); }
    if (action === 'play') { this.walkTo(a, Math.max(8, Math.min(92, a.x + rand(-25, 25))), a.y, () => { this.pose(a, 'spin', 900); this.bubble(a, '⚽', 1200); }); }
    if (action === 'snack') { this.bubble(a, pick(SNACKS), 2000); this.pose(a, 'munch', 2000); setTimeout(() => this.bubble(a, 'yum!', 1200), 2000); }
    if (action === 'dance') { this.pose(a, 'wiggle', 2600); this.bubble(a, '🎵', 2600); }
    if (action === 'nap') this.nap(a, 8000);
  }

  hearts(a) {
    for (let i = 0; i < 5; i++) {
      const h = document.createElement('span');
      h.className = 'g-heart';
      h.textContent = '♥';
      h.style.left = `${rand(10, 90)}%`;
      h.style.animationDelay = `${i * 0.12}s`;
      a.node.appendChild(h);
      setTimeout(() => h.remove(), 1600);
    }
  }
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
