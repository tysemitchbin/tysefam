// The Wanderlings bestiary.
// Each species has a `test(walk, ctx)` deciding whether it can appear on a walk.
// Nothing here rewards speed — only showing up, time outside, and variety.
//
// walk: { km, min, elev, hour, dow (0=Sun), month (1-12), name }
// ctx:  { walkInWeek (1-based), walkNumber (1-based, all time) }

export const RARITY = {
  common:    { label: 'Common',    weight: 1, color: '#7bb36b' },
  uncommon:  { label: 'Uncommon',  weight: 2, color: '#4f9bd9' },
  rare:      { label: 'Rare',      weight: 3, color: '#a070e0' },
  legendary: { label: 'Legendary', weight: 5, color: '#e0a020' },
};

const any = () => true;

export const SPECIES = [
  // --- commons: any walk at all, even five minutes -------------------------
  { id: 'puddlepip', name: 'Puddlepip', rarity: 'common', test: any,
    hint: () => 'Go on any walk.',
    flavor: 'Splashes along beside anyone who steps outside. Extremely easy to impress.',
    look: { shape: 'round', body: '#8ec5ff', belly: '#e3f2ff', accent: '#5a9be0', ears: 'none', eyes: 'big', extras: ['drop'] } },
  { id: 'mossling', name: 'Mossling', rarity: 'common', test: any,
    hint: () => 'Go on any walk.',
    flavor: 'Grows a tiny bit taller every time someone goes outside. Nobody knows how tall it can get.',
    look: { shape: 'tall', body: '#9ed98a', belly: '#e6f7dc', accent: '#5aa848', ears: 'leaf', eyes: 'dot', extras: [] } },
  { id: 'pebblet', name: 'Pebblet', rarity: 'common', test: any,
    hint: () => 'Go on any walk.',
    flavor: 'Sits very still on the path, then follows you home. Collects nice rocks.',
    look: { shape: 'wide', body: '#b8b0cc', belly: '#e8e4f0', accent: '#8f86a8', ears: 'none', eyes: 'happy', extras: ['spots'] } },
  { id: 'fluffwick', name: 'Fluffwick', rarity: 'common', test: any,
    hint: () => 'Go on any walk.',
    flavor: 'Small, warm, and roughly 90% fluff. Purrs when the sun comes out.',
    look: { shape: 'round', body: '#ffe3b8', belly: '#fff6e8', accent: '#f0b878', ears: 'round', eyes: 'dot', extras: ['fluff'] } },

  // --- time of day -------------------------------------------------------------
  { id: 'dawnfinch', name: 'Dawnfinch', rarity: 'uncommon', test: w => w.hour >= 4 && w.hour < 8,
    hint: () => 'Start a walk before 8am.',
    flavor: 'Sings exactly one song, only at sunrise. It is a very good song.',
    look: { shape: 'round', body: '#ffc49b', belly: '#fff1e0', accent: '#ff8f6b', ears: 'none', eyes: 'dot', extras: ['wings', 'beak'] } },
  { id: 'sunbun', name: 'Sunbun', rarity: 'uncommon', test: w => w.hour >= 11 && w.hour < 14,
    hint: () => 'Walk around midday (11am–2pm).',
    flavor: 'Soaks up sunshine and slowly glows brighter all afternoon.',
    look: { shape: 'tall', body: '#ffe066', belly: '#fff7cc', accent: '#ffb627', ears: 'bunny', eyes: 'happy', extras: ['sun'] } },
  { id: 'duskmoth', name: 'Duskmoth', rarity: 'uncommon', test: w => w.hour >= 17 && w.hour < 20,
    hint: () => 'Walk in the evening (5–8pm).',
    flavor: 'Flutters out at golden hour to see who else is enjoying the light.',
    look: { shape: 'tall', body: '#c3a6ff', belly: '#efe6ff', accent: '#8f6be0', ears: 'antenna', eyes: 'dot', extras: ['wings'] } },
  { id: 'glowwisp', name: 'Glowwisp', rarity: 'rare', test: w => w.hour >= 20 || w.hour < 4,
    hint: () => 'Take a walk after 8pm.',
    flavor: 'A sleepy little lantern that keeps night walkers company.',
    look: { shape: 'round', body: '#6f7bd9', belly: '#b9c2ff', accent: '#ffe680', ears: 'none', eyes: 'sleepy', extras: ['glow', 'moon'] } },

  // --- distance ----------------------------------------------------------------
  { id: 'strollkit', name: 'Strollkit', rarity: 'uncommon', test: w => w.km >= 1.6,
    hint: f => `Walk ${f(1.6)} or more.`,
    flavor: 'A curious fox kit who only appears once you’ve gone far enough to be interesting.',
    look: { shape: 'round', body: '#ffad7a', belly: '#fff0e3', accent: '#e07840', ears: 'pointy', eyes: 'dot', extras: ['tail'] } },
  { id: 'wanderwool', name: 'Wanderwool', rarity: 'rare', test: w => w.km >= 3.2,
    hint: f => `Walk ${f(3.2)} or more.`,
    flavor: 'Gets fluffier with every step. Has never once been in a hurry.',
    look: { shape: 'wide', body: '#f4f1ff', belly: '#ffffff', accent: '#5c5470', ears: 'round', eyes: 'happy', extras: ['fluff', 'horns'] } },
  { id: 'trailtusk', name: 'Trailtusk', rarity: 'rare', test: w => w.km >= 4.8,
    hint: f => `Walk ${f(4.8)} or more.`,
    flavor: 'Gentle, sturdy, and absolutely sure of the way home.',
    look: { shape: 'wide', body: '#c79b7a', belly: '#f0dccb', accent: '#fff4e0', ears: 'round', eyes: 'dot', extras: ['tusks'] } },
  { id: 'lumenlong', name: 'Lumenlong', rarity: 'legendary', test: w => w.km >= 8,
    hint: f => `Walk ${f(8)} or more. (Someday. No rush.)`,
    flavor: 'Said to appear only at the end of a very long, very good day.',
    look: { shape: 'tall', body: '#7fe0d0', belly: '#e0fff9', accent: '#3fb8a8', ears: 'pointy', eyes: 'big', extras: ['glow', 'sparkle', 'tail'] } },

  // --- hills & time outside ----------------------------------------------------
  { id: 'hillhop', name: 'Hillhop', rarity: 'uncommon', test: w => w.elev >= 25,
    hint: () => 'Take a walk with a hill in it.',
    flavor: 'Bounces up every slope it finds, then rolls back down giggling.',
    look: { shape: 'round', body: '#a7e3a0', belly: '#ecfae8', accent: '#6cbf62', ears: 'bunny', eyes: 'happy', extras: [] } },
  { id: 'peakpuff', name: 'Peakpuff', rarity: 'rare', test: w => w.elev >= 80,
    hint: () => 'Climb a big hill on a walk.',
    flavor: 'Lives where the air is crisp. Wears a little snowcap all year round.',
    look: { shape: 'round', body: '#cfe0ff', belly: '#f2f7ff', accent: '#ffffff', ears: 'pointy', eyes: 'dot', extras: ['snowcap'] } },
  { id: 'slowpaw', name: 'Slowpaw', rarity: 'rare', test: w => w.min >= 45,
    hint: () => 'Spend 45+ minutes out walking (any pace).',
    flavor: 'Believes the best walks are long, slow, and full of stopping to look at things.',
    look: { shape: 'wide', body: '#d9b8a0', belly: '#f7ebe1', accent: '#a07858', ears: 'round', eyes: 'sleepy', extras: [] } },

  // --- calendar ----------------------------------------------------------------
  { id: 'sundaisy', name: 'Sundaisy', rarity: 'uncommon', test: w => w.dow === 0,
    hint: () => 'Go for a Sunday walk.',
    flavor: 'Only comes out on lazy Sundays, with a fresh flower every week.',
    look: { shape: 'round', body: '#ffb3c7', belly: '#fff0f4', accent: '#ffffff', ears: 'round', eyes: 'happy', extras: ['flower'] } },
  { id: 'frostbun', name: 'Frostbun', rarity: 'uncommon', test: w => [12, 1, 2].includes(w.month),
    hint: () => 'Walk in winter (Dec–Feb).',
    flavor: 'Leaves tiny snowflake footprints. Loves a warm drink afterwards.',
    look: { shape: 'tall', body: '#e0f4ff', belly: '#ffffff', accent: '#9fd4f5', ears: 'bunny', eyes: 'dot', extras: ['sparkle'] } },
  { id: 'blossomb', name: 'Blossomb', rarity: 'uncommon', test: w => [3, 4, 5].includes(w.month),
    hint: () => 'Walk in spring (Mar–May).',
    flavor: 'Blooms a little more every time it sees someone outside in the sunshine.',
    look: { shape: 'round', body: '#ffd1e8', belly: '#fff3f9', accent: '#ff8fc0', ears: 'none', eyes: 'happy', extras: ['flower', 'leafhat'] } },
  { id: 'buzzlet', name: 'Buzzlet', rarity: 'uncommon', test: w => [6, 7, 8].includes(w.month),
    hint: () => 'Walk in summer (Jun–Aug).',
    flavor: 'Hums happily from flower to flower. Very bad at flying in a straight line.',
    look: { shape: 'round', body: '#ffd84d', belly: '#fff3b0', accent: '#4a3b2a', ears: 'antenna', eyes: 'big', extras: ['stripes', 'wings'] } },
  { id: 'acornet', name: 'Acornet', rarity: 'uncommon', test: w => [9, 10, 11].includes(w.month),
    hint: () => 'Walk in autumn (Sep–Nov).',
    flavor: 'Wears its favourite leaf as a hat. Crunches every leaf pile on purpose.',
    look: { shape: 'round', body: '#d99a5b', belly: '#f7e1c8', accent: '#e8632c', ears: 'none', eyes: 'dot', extras: ['leafhat'] } },

  // --- secrets & steadiness ----------------------------------------------------
  { id: 'pramble', name: 'Pramble', rarity: 'rare', test: w => /stroller|pram|buggy|baby|bub\b|carrier/i.test(w.name),
    hint: () => 'A secret… try naming a walk after a special little passenger.',
    flavor: 'Loves rolling along beside strollers. Hums lullabies, slightly off-key.',
    look: { shape: 'round', body: '#b8e6ff', belly: '#ffffff', accent: '#ffc2d6', ears: 'round', eyes: 'sleepy', extras: ['bonnet'] } },
  { id: 'kinbloom', name: 'Kinbloom', rarity: 'rare', test: (w, c) => c.walkInWeek >= 3,
    hint: () => 'Take a third walk in the same week.',
    flavor: 'Blooms when walks start to become a little rhythm. Very proud of you.',
    look: { shape: 'tall', body: '#ff9fb2', belly: '#ffe8ee', accent: '#ffe066', ears: 'none', eyes: 'happy', extras: ['flower', 'sparkle'] } },
  { id: 'hearthling', name: 'Hearthling', rarity: 'legendary', test: (w, c) => c.walkNumber >= 20,
    hint: () => 'Keep walking — this one has been quietly following you since your first walk.',
    flavor: 'Has been walking a few steps behind you since the very beginning. Finally brave enough to say hi.',
    look: { shape: 'round', body: '#ffcf70', belly: '#fff3d6', accent: '#ff9f43', ears: 'pointy', eyes: 'big', extras: ['glow', 'sparkle', 'crown'] } },

  // --- explorers: only found in eggs hidden on the map -------------------------
  { id: 'compip', name: 'Compip', rarity: 'uncommon', mapTier: 'near', test: () => false,
    hint: () => 'Hidden in a nearby egg on the map.',
    flavor: 'Always knows which way is north. Usually points at snacks instead.',
    look: { shape: 'round', body: '#9fd4f5', belly: '#eef8ff', accent: '#ff7a7a', ears: 'pointy', eyes: 'big', extras: ['compass'] } },
  { id: 'waymoth', name: 'Waymoth', rarity: 'rare', mapTier: 'stretch', test: () => false,
    hint: () => 'Hidden in a stretch egg on the map.',
    flavor: 'Leaves a faint trail of glitter so you can always find your way back.',
    look: { shape: 'tall', body: '#d6b8ff', belly: '#f6efff', accent: '#ffcf70', ears: 'antenna', eyes: 'dot', extras: ['wings', 'sparkle'] } },
  { id: 'farfawn', name: 'Farfawn', rarity: 'legendary', mapTier: 'far', test: () => false,
    hint: () => 'Hidden in a golden egg, a little further out on the map.',
    flavor: 'Lives just past the edge of where you usually go. Delighted you came to visit.',
    look: { shape: 'tall', body: '#f5c99b', belly: '#fff4e6', accent: '#ffffff', ears: 'pointy', eyes: 'big', extras: ['spots', 'glow', 'flower'] } },
];

export const MAP_TIERS = {
  near:    { label: 'Nearby egg',  radius: 0.6,  color: '#4f9bd9', species: 'compip' },
  stretch: { label: 'Stretch egg', radius: 1.0,  color: '#a070e0', species: 'waymoth' },
  far:     { label: 'Golden egg',  radius: 1.35, color: '#e0a020', species: 'farfawn' },
};

export const BY_ID = Object.fromEntries(SPECIES.map(s => [s.id, s]));

// ---------------------------------------------------------------------------
// Encounters: deterministic per walk, so re-syncing never changes history.

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickSpecies(walk, ctx, caughtCounts) {
  const eligible = SPECIES.filter(s => s.test(walk, ctx));
  // Brand-new species are much more likely, so the collection keeps growing.
  const weights = eligible.map(s => RARITY[s.rarity].weight * (caughtCounts[s.id] ? 1 : 5));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = mulberry32(hashString(walk.id))() * total;
  for (let i = 0; i < eligible.length; i++) { r -= weights[i]; if (r <= 0) return eligible[i]; }
  return eligible[eligible.length - 1];
}

// Golden eggs (earned by beating the stretch goal) skip the commons when they
// can and strongly favour species she hasn't met yet.
export function pickGoldenSpecies(walk, ctx, caughtCounts, seed = walk.id + ':gold') {
  let eligible = SPECIES.filter(s => s.test(walk, ctx) && s.rarity !== 'common');
  if (!eligible.length) eligible = SPECIES.filter(s => s.test(walk, ctx));
  const weights = eligible.map(s => RARITY[s.rarity].weight * (caughtCounts[s.id] ? 1 : 12));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = mulberry32(hashString(seed))() * total;
  for (let i = 0; i < eligible.length; i++) { r -= weights[i]; if (r <= 0) return eligible[i]; }
  return eligible[eligible.length - 1];
}

// ---------------------------------------------------------------------------
// Progression: a stretch goal that rises gently with her own recent walks,
// and companion growth stages earned by distance walked together.

export function stretchTarget(recentKms) {
  if (!recentKms.length) return 1.0;
  const recent = recentKms.slice(-5);
  const baseline = recent.reduce((a, b) => a + b, 0) / recent.length;
  // ~15% past her recent average, but never more than +1 km at a time.
  const step = Math.min(1.0, Math.max(0.3, baseline * 0.15));
  return Math.round((baseline + step) * 20) / 20;
}

export const STAGES = [
  { name: 'Hatchling', km: 0,  scale: 0.72 },
  { name: 'Sprout',    km: 4,  scale: 0.86 },
  { name: 'Grown',     km: 12, scale: 1.0 },
  { name: 'Radiant',   km: 30, scale: 1.08 },
];
export function stageFor(bondKm) {
  let i = 0;
  while (i + 1 < STAGES.length && bondKm >= STAGES[i + 1].km) i++;
  return { ...STAGES[i], index: i, next: STAGES[i + 1] || null };
}

// ---------------------------------------------------------------------------
// SVG art. Every creature is drawn from its `look`, so adding species is cheap.

const INK = '#3a3050';

// If a PNG exists at art/<id>.png (listed in ART below), it replaces the
// drawn placeholder. Transparent-background PNGs, roughly square.
export const ART = new Set([/* e.g. 'puddlepip', 'mossling' */]);

export function creatureSVG(sp, { silhouette = false } = {}) {
  if (ART.has(sp.id)) {
    return `<svg viewBox="0 0 120 120" class="creature-svg${silhouette ? ' is-sil' : ''}" role="img" aria-label="${silhouette ? 'Undiscovered creature' : sp.name}"><image href="art/${sp.id}.png" x="4" y="4" width="112" height="112" preserveAspectRatio="xMidYMax meet"/></svg>`;
  }
  const L = sp.look;
  const S = silhouette ? 'var(--sil)' : null;
  const body = S || L.body, belly = S || L.belly, accent = S || L.accent, ink = S || INK;
  const dims = { round: [38, 34, 70], tall: [32, 40, 68], wide: [44, 30, 74] }[L.shape];
  const [rx, ry, cy] = dims, cx = 60, top = cy - ry;
  const x = L.extras;
  const back = [], front = [];

  // behind the body
  if (x.includes('glow') && !S) back.push(`<circle cx="${cx}" cy="${cy}" r="${rx + 22}" fill="${L.accent}" opacity=".22"/><circle cx="${cx}" cy="${cy}" r="${rx + 12}" fill="${L.accent}" opacity=".25"/>`);
  if (x.includes('sun') && !S) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      back.push(`<line x1="${cx + Math.cos(a) * (rx + 6)}" y1="${cy + Math.sin(a) * (ry + 6)}" x2="${cx + Math.cos(a) * (rx + 16)}" y2="${cy + Math.sin(a) * (ry + 16)}" stroke="${L.accent}" stroke-width="4" stroke-linecap="round"/>`);
    }
  }
  if (x.includes('wings')) back.push(
    `<ellipse cx="${cx - rx - 4}" cy="${cy - 6}" rx="16" ry="22" transform="rotate(-25 ${cx - rx - 4} ${cy - 6})" fill="${accent}" opacity="${S ? 1 : .75}"/>`,
    `<ellipse cx="${cx + rx + 4}" cy="${cy - 6}" rx="16" ry="22" transform="rotate(25 ${cx + rx + 4} ${cy - 6})" fill="${accent}" opacity="${S ? 1 : .75}"/>`);
  if (x.includes('tail')) back.push(`<path d="M${cx + rx - 6} ${cy + 14} q 30 6 26 -22 q -2 -10 -10 -8 q 6 14 -16 20z" fill="${accent}"/>`);

  // ears
  const e = L.ears, ex = rx * 0.6;
  if (e === 'round') back.push(
    `<circle cx="${cx - ex}" cy="${top + 8}" r="12" fill="${body}"/><circle cx="${cx + ex}" cy="${top + 8}" r="12" fill="${body}"/>`,
    S ? '' : `<circle cx="${cx - ex}" cy="${top + 8}" r="6" fill="${accent}" opacity=".7"/><circle cx="${cx + ex}" cy="${top + 8}" r="6" fill="${accent}" opacity=".7"/>`);
  if (e === 'pointy') back.push(
    `<path d="M${cx - rx * .85} ${top + 18} L${cx - rx * .6} ${top - 16} L${cx - rx * .15} ${top + 6}z" fill="${body}" stroke="${body}" stroke-width="4" stroke-linejoin="round"/>`,
    `<path d="M${cx + rx * .85} ${top + 18} L${cx + rx * .6} ${top - 16} L${cx + rx * .15} ${top + 6}z" fill="${body}" stroke="${body}" stroke-width="4" stroke-linejoin="round"/>`,
    S ? '' : `<path d="M${cx - rx * .7} ${top + 12} L${cx - rx * .6} ${top - 6} L${cx - rx * .35} ${top + 6}z" fill="${accent}"/><path d="M${cx + rx * .7} ${top + 12} L${cx + rx * .6} ${top - 6} L${cx + rx * .35} ${top + 6}z" fill="${accent}"/>`);
  if (e === 'bunny') back.push(
    `<ellipse cx="${cx - 13}" cy="${top - 12}" rx="8" ry="22" transform="rotate(-12 ${cx - 13} ${top - 12})" fill="${body}"/>`,
    `<ellipse cx="${cx + 13}" cy="${top - 12}" rx="8" ry="22" transform="rotate(12 ${cx + 13} ${top - 12})" fill="${body}"/>`,
    S ? '' : `<ellipse cx="${cx - 13}" cy="${top - 10}" rx="4" ry="15" transform="rotate(-12 ${cx - 13} ${top - 10})" fill="${accent}" opacity=".6"/><ellipse cx="${cx + 13}" cy="${top - 10}" rx="4" ry="15" transform="rotate(12 ${cx + 13} ${top - 10})" fill="${accent}" opacity=".6"/>`);
  if (e === 'antenna') back.push(
    `<path d="M${cx - 8} ${top + 4} q -4 -16 -14 -22" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="${cx - 22}" cy="${top - 18}" r="5" fill="${accent}"/>`,
    `<path d="M${cx + 8} ${top + 4} q 4 -16 14 -22" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="${cx + 22}" cy="${top - 18}" r="5" fill="${accent}"/>`);

  // feet + body + belly
  const parts = [
    `<ellipse cx="${cx - 16}" cy="${cy + ry - 3}" rx="10" ry="6" fill="${accent}"/>`,
    `<ellipse cx="${cx + 16}" cy="${cy + ry - 3}" rx="10" ry="6" fill="${accent}"/>`,
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${body}"/>`,
    `<ellipse cx="${cx}" cy="${cy + ry * .32}" rx="${rx * .6}" ry="${ry * .52}" fill="${belly}"/>`,
  ];

  if (!S) {
    if (x.includes('fluff')) for (let i = -2; i <= 2; i++) front.push(`<circle cx="${cx + i * 9}" cy="${top + 4 + Math.abs(i) * 3}" r="7" fill="${L.belly}"/>`);
    if (x.includes('spots')) front.push(`<circle cx="${cx - rx * .55}" cy="${cy + 6}" r="4" fill="${accent}" opacity=".6"/><circle cx="${cx + rx * .6}" cy="${cy - 10}" r="5" fill="${accent}" opacity=".6"/><circle cx="${cx + rx * .45}" cy="${cy + 14}" r="3" fill="${accent}" opacity=".6"/>`);
    if (x.includes('stripes')) front.push(`<path d="M${cx - rx * .8} ${cy + 8} h ${rx * 1.6}" stroke="${accent}" stroke-width="5" opacity=".75" stroke-linecap="round"/><path d="M${cx - rx * .65} ${cy + 20} h ${rx * 1.3}" stroke="${accent}" stroke-width="5" opacity=".75" stroke-linecap="round"/>`);
    if (x.includes('snowcap')) front.push(`<path d="M${cx - rx * .7} ${top + 12} q ${rx * .7} -22 ${rx * 1.4} 0 q -8 6 -14 0 q -8 8 -16 0 q -8 7 -16 0 q -6 6 -12 0z" fill="#fff"/>`);
    if (x.includes('tusks')) front.push(`<path d="M${cx - 9} ${cy + 8} q -4 10 2 14" stroke="${accent}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${cx + 9} ${cy + 8} q 4 10 -2 14" stroke="${accent}" stroke-width="4" fill="none" stroke-linecap="round"/>`);

    // face
    const eyeY = cy - 6, eX = 12;
    if (L.eyes === 'sleepy' || L.eyes === 'happy') {
      const d = L.eyes === 'sleepy' ? 'q 5 5 10 0' : 'q 5 -6 10 0';
      front.push(`<path d="M${cx - eX - 5} ${eyeY} ${d}" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${cx + eX - 5} ${eyeY} ${d}" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    } else {
      const r = L.eyes === 'big' ? 6.5 : 4.8;
      for (const s of [-1, 1]) front.push(`<circle cx="${cx + s * eX}" cy="${eyeY}" r="${r}" fill="${ink}"/><circle cx="${cx + s * eX - r * .3}" cy="${eyeY - r * .4}" r="${r * .38}" fill="#fff"/>`);
    }
    front.push(`<ellipse cx="${cx - 22}" cy="${eyeY + 9}" rx="5.5" ry="3.2" fill="#ff8fa3" opacity=".55"/><ellipse cx="${cx + 22}" cy="${eyeY + 9}" rx="5.5" ry="3.2" fill="#ff8fa3" opacity=".55"/>`);
    if (x.includes('beak')) front.push(`<path d="M${cx - 5} ${eyeY + 7} L${cx + 5} ${eyeY + 7} L${cx} ${eyeY + 14}z" fill="${accent}"/>`);
    else front.push(`<path d="M${cx - 4} ${eyeY + 9} q 4 4 8 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);

    // hats & trinkets
    if (x.includes('leafhat')) front.push(`<path d="M${cx + 2} ${top + 2} q 16 -22 30 -10 q -12 16 -30 10z" fill="${x.includes('flower') ? '#7cc46a' : accent}"/><path d="M${cx + 2} ${top + 2} q 12 -8 24 -8" stroke="#0002" stroke-width="1.5" fill="none"/>`);
    if (x.includes('flower')) {
      const fx = cx - rx * .55, fy = top + 6;
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; front.push(`<circle cx="${fx + Math.cos(a) * 6}" cy="${fy + Math.sin(a) * 6}" r="5" fill="${accent === '#ffffff' ? '#fff' : accent}" stroke="#0001"/>`); }
      front.push(`<circle cx="${fx}" cy="${fy}" r="4" fill="#ffcf40"/>`);
    }
    if (x.includes('compass')) front.push(`<circle cx="${cx}" cy="${cy + ry * .38}" r="9" fill="#fff" stroke="${INK}" stroke-width="1.5"/><path d="M${cx} ${cy + ry * .38 - 7} l 3 7 l -6 0z" fill="${accent}"/><path d="M${cx} ${cy + ry * .38 + 7} l 3 -7 l -6 0z" fill="#9aa"/>`);
    if (x.includes('moon')) front.push(`<path d="M${cx + 4} ${top + 8} a 7 7 0 1 0 6 11 a 6 6 0 1 1 -6 -11z" fill="${accent}"/>`);
    if (x.includes('drop')) front.push(`<path d="M${cx} ${top - 14} q 7 10 0 14 q -7 -4 0 -14z" fill="${accent}"/>`);
    if (x.includes('crown')) front.push(`<path d="M${cx - 12} ${top + 2} l 0 -12 l 6 6 l 6 -10 l 6 10 l 6 -6 l 0 12z" fill="#ffd84d" stroke="#e0a020" stroke-width="1.5" stroke-linejoin="round"/>`);
    if (x.includes('bonnet')) front.push(`<path d="M${cx - rx * .8} ${top + 16} q ${rx * .8} -34 ${rx * 1.6} 0 q -${rx * .8} -12 -${rx * 1.6} 0z" fill="${accent}"/><circle cx="${cx}" cy="${top - 4}" r="4" fill="#fff"/>`);
    if (x.includes('sparkle')) for (const [sx, sy, s] of [[16, 26, 6], [104, 40, 5], [100, 100, 4], [20, 96, 4]])
      front.push(`<path d="M${sx} ${sy - s} Q${sx} ${sy} ${sx + s} ${sy} Q${sx} ${sy} ${sx} ${sy + s} Q${sx} ${sy} ${sx - s} ${sy} Q${sx} ${sy} ${sx} ${sy - s}z" fill="#ffd84d"/>`);
  }

  return `<svg viewBox="0 0 120 120" class="creature-svg" role="img" aria-label="${silhouette ? 'Undiscovered creature' : sp.name}">${back.join('')}${parts.join('')}${front.join('')}</svg>`;
}

// A speckled egg, tinted by rarity so there's a hint of what's inside.
export function eggSVG(rarity) {
  const tint = RARITY[rarity].color;
  return `<svg viewBox="0 0 120 120" class="egg-svg" role="img" aria-label="Egg">
    <ellipse cx="60" cy="108" rx="30" ry="5" fill="#0001"/>
    <path d="M60 14 C 86 14 98 58 98 76 C 98 98 82 108 60 108 C 38 108 22 98 22 76 C 22 58 34 14 60 14z" fill="#fffaf0" stroke="${tint}" stroke-width="3"/>
    <circle cx="44" cy="54" r="6" fill="${tint}" opacity=".45"/><circle cx="72" cy="40" r="4" fill="${tint}" opacity=".45"/>
    <circle cx="76" cy="78" r="7" fill="${tint}" opacity=".45"/><circle cx="48" cy="88" r="4" fill="${tint}" opacity=".45"/>
    <path class="crack" d="M30 66 l 10 -6 l 8 8 l 10 -8 l 8 8 l 10 -8 l 8 6 l 8 -4" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
  </svg>`;
}
