/* ════════════════════════════════════════════════════════════════
   BABY MOVES: little diagrams for the exercises.

   On purpose these are NOT realistic: a circle head, a bean body and
   rounded-line arms and legs, plus simple props (mat, toy, sofa…) and
   arrows for the movement. Just enough to help the words make sense.

   Every picture is drawn in a 160 × 100 box; the floor is at y = 88.
   Keys match the page's "done today" ticks:
     's1-0'  stage 1, exercise 1 (exercises count from 0, as in data.js)
     'g-0'   the first game in the movement-play "safe menu"
     'c-0'   the first crawling pattern
   A key with no picture just shows no picture, so it's safe to leave gaps.
═════════════════════════════════════════════════════════════════ */
(function () {
  // Colours (the site's palette)
  const C = {
    skin: '#f6d6bf', body: '#f2b6c6', limb: '#e592ac', line: '#3f5e44',
    toy: '#f7d877', toy2: '#8ec6d4', mat: '#dcebd5', wood: '#e9cfae', soft: '#cfe6ec',
    hand: '#e89b6f', adult: '#a9cfd9', grass: '#7fa874', arrow: '#3f5e44', hot: '#e89b6f'
  };
  const LW = 'stroke="' + C.line + '" stroke-width="1.5"';

  /* ───── the building blocks ───── */
  const head = (x, y, r = 9) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.skin}" ${LW}/>` +
    `<circle cx="${x + r * 0.35}" cy="${y - r * 0.1}" r="1.2" fill="${C.line}"/>`;          // one dot of an eye
  // body: a bean (ellipse) centred at x,y, turned by `rot` degrees
  const body = (x, y, rx, ry, rot = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${C.body}" ${LW}/>`;
  // limb: a thick rounded line through some points [[x,y],[x,y]…]
  const limb = (pts, colour = C.limb) =>
    `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${colour}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const floor = () => `<line x1="6" y1="88" x2="154" y2="88" stroke="${C.line}" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>`;
  const mat = (x = 20, w = 120) => `<rect x="${x}" y="86" width="${w}" height="4" rx="2" fill="${C.mat}"/>`;
  const toy = (x, y, r = 5, fill = C.toy) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${C.line}" stroke-width="1.2"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .3}" fill="#fff" opacity=".7"/>`;
  const box = (x, y, w, h, fill = C.wood) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" ${LW}/>`;
  const cushion = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h, w) / 2}" fill="${C.soft}" ${LW}/>`;
  // a low table: a top and two legs
  const table = (x, w, top = 60) => box(x, top, w, 6) +
    `<line x1="${x + 6}" y1="${top + 6}" x2="${x + 6}" y2="88" ${LW.replace('1.5', '3')}/><line x1="${x + w - 6}" y1="${top + 6}" x2="${x + w - 6}" y2="88" ${LW.replace('1.5', '3')}/>`;
  // a slope (wedge) from (x1, high) down to (x2, the floor)
  const slope = (x1, x2, high, fill = C.soft) => `<path d="M${x1} 88 L${x1} ${high} L${x2} 88 Z" fill="${fill}" ${LW} stroke-linejoin="round"/>`;
  // stairs going up to the right: n steps of size s, starting at x
  const stairs = (x, n = 3, s = 14) => {
    let d = `M${x} 88`;
    for (let i = 0; i < n; i++) d += ` V${88 - s * (i + 1)} H${x + s * 1.6 * (i + 1)}`;
    return `<path d="${d} V88 Z" fill="${C.wood}" ${LW} stroke-linejoin="round"/>`;
  };
  // a grown-up's hand: a soft blob, turned by `rot`
  const hand = (x, y, rot = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" transform="rotate(${rot} ${x} ${y})" fill="${C.hand}" stroke="${C.line}" stroke-width="1.2"/>`;
  // a grown-up's arm coming in from the edge, ending in a hand
  const arm = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.adult}" stroke-width="8" stroke-linecap="round"/>` + hand(x2, y2, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
  // a grown-up's legs (all you see of them), standing at x
  const legs = x =>
    `<rect x="${x - 11}" y="2" width="9" height="84" rx="4.5" fill="${C.adult}" ${LW}/><rect x="${x + 2}" y="2" width="9" height="84" rx="4.5" fill="${C.adult}" ${LW}/>` +
    `<rect x="${x - 13}" y="83" width="12" height="5" rx="2.5" fill="${C.line}"/><rect x="${x + 1}" y="83" width="12" height="5" rx="2.5" fill="${C.line}"/>`;
  // arrows along an SVG path (d), dashed: one head, or a head at both ends ("back and forth")
  const arrow = d => `<path d="${d}" fill="none" stroke="${C.arrow}" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round" marker-end="url(#bm-head)"/>`;
  const arrow2 = d => `<path d="${d}" fill="none" stroke="${C.arrow}" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round" marker-start="url(#bm-head)" marker-end="url(#bm-head)"/>`;
  const label = (x, y, t, anchor = 'middle') =>
    `<text x="${x}" y="${y}" font-size="8" font-family="Nunito, sans-serif" font-weight="700" fill="${C.line}" text-anchor="${anchor}">${t}</text>`;
  const note = (x, y) => `<text x="${x}" y="${y}" font-size="12" fill="${C.line}">♪</text>`;
  const lines = (x, y) => `<path d="M${x} ${y} h-12 M${x + 2} ${y + 8} h-16 M${x} ${y + 16} h-10" stroke="${C.line}" stroke-width="1.5" stroke-linecap="round" opacity=".55"/>`;
  const grass = (x1, x2) => { let s = ''; for (let x = x1; x < x2; x += 7) s += `<path d="M${x} 88 l2 -5 l2 5" fill="none" stroke="${C.grass}" stroke-width="1.4" stroke-linejoin="round"/>`; return s; };
  // move, turn or mirror a group of drawing
  const at = (dx, dy, inner) => `<g transform="translate(${dx} ${dy})">${inner}</g>`;
  const turn = (deg, cx, cy, inner) => `<g transform="rotate(${deg} ${cx} ${cy})">${inner}</g>`;
  const flip = (cx, inner) => `<g transform="translate(${2 * cx} 0) scale(-1 1)">${inner}</g>`;

  const svg = (inner, title) =>
    `<svg viewBox="0 0 160 100" class="illus" role="img" aria-label="${title}">` +
    `<defs><marker id="bm-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">` +
    `<path d="M1 1 L9 5 L1 9 z" fill="${C.arrow}"/></marker></defs>${inner}</svg>`;

  /* ───── the poses (all facing right; flip() to face left) ───── */
  // On the tummy, head up, propped on forearms. x,y = middle of the body.
  const tummy = (x, y = 79) =>
    limb([[x - 18, y + 3], [x - 34, y + 7]]) + limb([[x - 16, y + 5], [x - 30, y + 9]]) +
    body(x, y, 22, 8) +
    limb([[x + 12, y + 2], [x + 16, y + 9], [x + 26, y + 9]]) +
    head(x + 26, y - 9);
  // On the back, knees and hands up. x = middle of the body.
  const onBack = x =>
    limb([[x - 14, 78], [x - 22, 64], [x - 32, 68]]) +
    body(x, 80, 20, 7) +
    limb([[x + 10, 76], [x + 16, 62]]) +
    head(x + 28, 79);
  // Lying on one side, knees bent, hands in front. x = middle of the body.
  const onSide = x =>
    limb([[x - 14, 82], [x - 6, 86], [x + 4, 86]]) +
    body(x, 76, 16, 11) +
    limb([[x + 8, 72], [x + 22, 70]]) +
    head(x + 24, 78);
  // Sitting, legs stretched forward. x = hips. lean > 0 leans forward.
  const sitting = (x, lean = 0) =>
    limb([[x + 2, 84], [x + 26, 85]]) +
    body(x, 68, 10, 16, lean) +
    head(x + 2 + lean * .4, 45);
  // On hands and knees. x = middle, y = top of the back.
  const allFours = (x, y = 66, ground = 88) =>
    limb([[x - 12, y + 6], [x - 14, ground - 2], [x - 26, ground - 2]]) +
    limb([[x + 14, y + 5], [x + 16, ground - 2]]) +
    body(x, y + 4, 18, 8) +
    head(x + 25, y - 2);
  // Tall kneeling, hands forward to (hx, hy).
  const kneel = (x, hx, hy) =>
    limb([[x - 2, 72], [x - 4, 86], [x - 18, 86]]) +
    body(x, 60, 10, 14) +
    limb([[x + 5, 54], [hx, hy]]) +
    head(x + 2, 38);
  // Standing still, one arm out to (hx, hy).
  const standing = (x, hx = x + 16, hy = 56) =>
    limb([[x - 3, 70], [x - 5, 87]]) + limb([[x + 4, 70], [x + 6, 87]]) +
    body(x, 58, 10, 15) +
    limb([[x + 5, 52], [hx, hy]]) +
    head(x + 1, 36);
  // Walking, wide steps, arms up and out like a new walker (arms: false = draw your own arms).
  const walking = (x, arms = true) =>
    limb([[x - 3, 70], [x - 11, 87]]) + limb([[x + 3, 70], [x + 11, 87]]) +
    body(x, 58, 10, 15, 4) +
    (arms ? limb([[x - 4, 52], [x - 15, 44]]) + limb([[x + 6, 52], [x + 17, 44]]) : '') +
    head(x + 3, 36);
  // Running: leaning forward, big stride.
  const running = x =>
    limb([[x - 4, 70], [x - 16, 80], [x - 22, 86]]) + limb([[x + 2, 70], [x + 14, 86]]) +
    body(x, 58, 10, 15, 18) +
    limb([[x - 2, 52], [x - 14, 60]]) + limb([[x + 8, 52], [x + 18, 46]]) +
    head(x + 9, 37);
  // Squatting down low.
  const squat = x =>
    limb([[x - 4, 74], [x + 4, 82], [x - 2, 87]]) + limb([[x + 2, 75], [x + 12, 82], [x + 8, 87]]) +
    body(x, 66, 10, 13, 15) +
    head(x + 6, 47);

  /* ───── the pictures ───── */
  const P = {};

  /* Stage 1: the base */
  P['s1-0'] = svg(mat() + floor() +
    `<rect x="118" y="50" width="16" height="36" rx="4" fill="${C.soft}" ${LW}/><line x1="122" y1="56" x2="128" y2="62" stroke="#fff" stroke-width="2" stroke-linecap="round"/>` +
    tummy(66) + label(126, 46, 'mirror'), 'Baby on the tummy looking at a mirror');
  P['s1-1'] = svg(mat() + floor() + tummy(62) + toy(118, 44) + arrow('M118 52 Q 138 64 128 82') + label(140, 40, 'slowly'),
    'Toy moved in an arc to one side while baby is on the tummy');
  P['s1-2'] = svg(mat() + floor() + onBack(70) + toy(118, 50) + arrow('M54 52 Q 74 30 100 44') + label(78, 26, 'roll over'),
    'Baby on the back reaching for a toy above one shoulder, rolling onto the tummy');
  P['s1-3'] = svg(mat() + floor() + tummy(60) + toy(132, 80) + arrow('M70 56 Q 96 36 110 60') + label(92, 30, 'roll on their own'),
    'Baby on the tummy with a toy out to the side, rolling onto the back');
  P['s1-4'] = svg(mat() + floor() + `<circle cx="52" cy="78" r="8" fill="${C.soft}" ${LW}/>` + label(46, 64, 'towel') +
    onSide(74) + toy(102, 64) + label(114, 54, 'both hands'),
    'Baby lying on one side with a rolled towel behind, both hands meeting at a toy');
  P['s1-5'] = svg(mat() + floor() +
    limb([[70, 76], [66, 58], [72, 52]]) + body(82, 80, 18, 8) + limb([[92, 75], [76, 54]]) + head(108, 79) + toy(72, 50, 4),
    'Baby on the back holding their own feet, with a rattle on one foot');
  P['s1-6'] = svg(mat() + floor() + sitting(76, -12) + limb([[70, 66], [60, 76], [58, 86]]) +
    hand(90, 80, -30) + hand(62, 74, 30) + arrow('M96 40 Q 82 28 68 34') + label(74, 22, 'tilt'),
    'Sitting baby tilted gently, adult hands at the hips, baby puts a hand down');
  P['s1-7'] = svg(mat() + floor() + cushion(42, 74, 18, 14) + cushion(98, 74, 18, 14) +
    sitting(68, 14) + limb([[74, 62], [88, 86]]) + limb([[72, 56], [92, 54], [104, 46]]) + toy(108, 42),
    'Baby sitting propped on one hand, lifting the other hand to a toy held up high');
  P['s1-8'] = svg(mat() + floor() +
    limb([[52, 84], [30, 85]]) + body(60, 72, 9, 16, 50) + head(76, 60) +
    limb([[66, 70], [90, 66], [96, 64]]) + arm(140, 40, 100, 62) + arrow('M60 46 Q 64 30 84 30') + label(40, 30, 'slowly'),
    'Baby gripping two adult fingers and being pulled slowly up to sitting');

  /* Stage 2: transitions and crawling */
  P['s2-0'] = svg(mat() + floor() + sitting(86, -18) + limb([[80, 64], [64, 76], [56, 84]]) + toy(44, 82) +
    arrow('M90 32 Q 66 22 50 40') + label(130, 62, 'twist and reach'),
    'Sitting baby twisting to reach a toy placed to the side and behind');
  P['s2-1'] = svg(mat() + floor() + `<circle cx="78" cy="80" r="8" fill="${C.soft}" ${LW}/>` + allFours(78, 60) + label(78, 98, 'light support under the belly'),
    'Baby on hands and knees with a rolled towel under the belly');
  P['s2-2'] = svg(mat() + floor() + allFours(70, 62) + arrow2('M48 44 L 104 44') + note(116, 40) + note(128, 30),
    'Baby on hands and knees rocking forwards and back to a song');
  P['s2-3'] = svg(floor() + cushion(76, 70, 24, 18) + allFours(88, 54, 88) + toy(140, 82) + arrow('M120 40 Q 134 40 140 70'),
    'Baby crawling over a cushion towards a toy');
  P['s2-4'] = svg(floor() + slope(14, 140, 60) + turn(12, 70, 64, allFours(66, 48, 72)) + arrow('M104 58 L 132 76') + label(40, 98, 'gentle slope'),
    'Baby crawling down a gentle cushion slope');
  P['s2-5'] = svg(floor() +
    `<path d="M70 88 V64 A16 16 0 0 1 102 64 V88" fill="${C.soft}" ${LW}/><path d="M78 88 V66 A8 8 0 0 1 94 66 V88" fill="#fff" ${LW}/>` +
    allFours(44, 66) + toy(140, 82) + arrow2('M110 96 L 150 96') + label(130, 78, '2 m'),
    'Baby crawling towards a play tunnel with a toy two metres away');
  P['s2-6'] = svg(floor() + box(96, 56, 56, 32) + toy(124, 50) + kneel(80, 100, 56) + label(40, 60, 'tall kneeling'),
    'Baby kneeling up at a sofa seat to play with a toy on top');
  P['s2-7'] = svg(floor() + table(92, 56, 56) + toy(124, 50) +
    limb([[70, 74], [76, 86], [62, 86]]) + limb([[74, 72], [86, 76], [86, 86]]) + body(74, 60, 10, 14, 10) + limb([[80, 54], [98, 56]]) + head(78, 38) +
    arrow('M50 74 L 50 40') + label(50, 98, 'they pull'),
    'Baby pulling up to stand at a low table');
  P['s2-8'] = svg(floor() + table(92, 56, 52) + standing(76, 96, 52) + hand(70, 76, 90) + arrow('M54 44 Q 44 64 58 84') + label(36, 30, 'bend the knee'),
    'Adult hand at the back of a standing baby’s knee to help them sit down');
  P['s2-9'] = svg(
    `<rect x="6" y="86" width="37" height="4" fill="${C.wood}"/><rect x="43" y="86" width="37" height="4" fill="#d9c7e8"/><rect x="80" y="86" width="37" height="4" fill="${C.grass}"/><rect x="117" y="86" width="37" height="4" fill="${C.mat}"/>` +
    grass(84, 116) + allFours(74, 64) + label(24, 98, 'wood') + label(62, 98, 'carpet') + label(98, 98, 'grass') + label(136, 98, 'mat'),
    'Baby crawling across wood, carpet, grass and a mat');

  /* Stage 3: upright and cruising */
  P['s3-0'] = svg(floor() + box(10, 58, 58, 30) + table(96, 52, 60) + standing(70, 86, 58) + toy(126, 54) + arrow('M80 26 L 112 26') + label(86, 98, 'gap'),
    'Baby standing at the sofa, stepping sideways to a table across a small gap');
  P['s3-1'] = svg(floor() + box(20, 58, 96, 30) + `<rect x="108" y="44" width="12" height="44" rx="4" fill="${C.wood}" ${LW}/>` +
    standing(84, 100, 58) + toy(134, 82) + arrow('M92 30 Q 128 22 136 70') + label(132, 98, 'out of sight'),
    'Baby cruising along a sofa to a toy just around the end');
  P['s3-2'] = svg(floor() + box(96, 52, 52, 6) + `<line x1="140" y1="58" x2="140" y2="88" ${LW.replace('1.5', '3')}/>` +
    limb([[64, 74], [72, 82], [66, 87]]) + limb([[70, 75], [80, 82], [76, 87]]) + body(68, 66, 10, 13, 15) + head(74, 47) +
    limb([[74, 66], [86, 82]]) + limb([[72, 58], [100, 54]]) + toy(90, 84, 4) + arrow('M40 52 L 40 80') + arrow('M30 80 L 30 52'),
    'Baby squatting to pick up a toy while holding a table, then standing up');
  P['s3-3'] = svg(floor() + table(86, 64, 58) + `<rect x="94" y="50" width="48" height="8" rx="3" fill="${C.soft}" ${LW}/>` +
    standing(70, 98, 52) + limb([[76, 50], [104, 48]]) + label(118, 44, 'both hands busy'),
    'Baby standing at a low table playing in a tray with both hands');
  P['s3-4'] = svg(floor() + cushion(28, 74, 34, 14) + standing(80, 88, 60) + hand(102, 50, -30) + hand(60, 50, 30) +
    label(118, 30, '1… 2… 3!'),
    'Adult lets go of a standing baby and counts, with a cushion behind');
  P['s3-5'] = svg(floor() + stairs(60, 2, 16) + turn(-18, 84, 60, allFours(80, 48, 70)) + arm(10, 60, 54, 70) +
    arrow('M112 38 L 128 26') + label(152, 98, 'down: feet first', 'end'),
    'Baby climbing two low steps on hands and knees, adult hand behind');
  P['s3-6'] = svg(floor() + table(96, 52, 56) + limb([[66, 72], [64, 86], [52, 86]]) + limb([[72, 72], [84, 72], [84, 86]]) +
    body(68, 60, 10, 14, 6) + limb([[74, 54], [100, 56]]) + head(71, 38) + arrow('M40 76 L 40 42') + label(40, 98, 'one foot up'),
    'Baby in a half-kneel, one foot flat, pushing up to stand');
  P['s3-7'] = svg(floor() + `<rect x="96" y="58" width="40" height="28" rx="5" fill="${C.wood}" ${LW}/><path d="M104 58 V86 M114 58 V86 M124 58 V86" stroke="${C.line}" stroke-width="1" opacity=".5"/>` +
    box(102, 50, 26, 8, C.soft) + walking(72, false) + limb([[76, 52], [96, 60]]) + arrow('M100 40 L 132 40') + label(116, 98, 'heavy = slow'),
    'Baby pushing a laundry basket weighed down with books');
  P['s3-8'] = svg(floor() + legs(120) + walking(72, false) + limb([[76, 52], [92, 50]]) + arm(116, 26, 96, 50) +
    label(52, 20, 'one hand, held low') + `<text x="98" y="68" font-size="12" font-weight="800" fill="${C.grass}">✓</text>`,
    'Adult holding one of the baby’s hands at the baby’s own shoulder height');
  P['s3-9'] = svg(`<path d="M6 88 Q 50 70 90 84 T 154 80 V90 H6 Z" fill="${C.mat}"/>` + grass(10, 150) +
    `<circle cx="120" cy="86" r="1.5" fill="${C.line}"/><circle cx="128" cy="85" r="1.5" fill="${C.line}"/><circle cx="136" cy="84" r="1.5" fill="${C.line}"/>` +
    at(0, -4, allFours(62, 60)) + label(124, 70, 'bumpy ground'),
    'Baby crawling over bumpy grass and gravel');

  /* Stage 4: making walking useful */
  P['s4-0'] = svg(floor() + legs(18) + arm(26, 40, 40, 56) + legs(142) + arm(134, 40, 120, 56) + walking(80) +
    arrow('M56 22 L 104 22') + label(80, 14, 'step back ½ m each time'),
    'Baby walking from one parent to the other');
  P['s4-1'] = svg(floor() + squat(76) + limb([[82, 64], [90, 84]]) + toy(94, 84, 4) + arrow('M48 80 L 48 44') + label(110, 34, 'nothing to hold on to'),
    'Baby squatting in the middle of the floor and standing up without support');
  P['s4-2'] = svg(floor() + walking(76, false) + cushion(76, 46, 26, 18) + limb([[78, 52], [92, 56]]) + arrow('M108 80 L 140 80'),
    'Baby walking while carrying a big cushion');
  P['s4-3'] = svg(floor() + walking(64) + note(110, 30) + note(124, 22) + arrow('M92 66 Q 128 66 124 44 Q 118 28 96 34') + label(126, 82, 'stop · start · turn'),
    'Baby walking, stopping and turning to music');
  P['s4-4'] = svg(floor() + box(96, 78, 14, 10) + box(130, 78, 14, 10) + `<rect x="92" y="74" width="56" height="4" rx="2" fill="${C.line}"/>` +
    limb([[70, 70], [66, 87]]) + limb([[76, 70], [90, 64], [98, 70]]) + body(72, 56, 10, 15, 4) + limb([[68, 50], [58, 42]]) + limb([[78, 50], [90, 42]]) + head(75, 34),
    'Baby lifting a foot over a stick resting on two books');
  P['s4-5'] = svg(floor() + stairs(54, 3, 16) + turn(-30, 92, 50, allFours(92, 40, 62)) + arm(16, 70, 60, 60) + label(32, 98, 'you: below them'),
    'Baby crawling up the stairs on hands and knees with an adult hand below');
  P['s4-6'] = svg(`<path d="M6 60 L 70 60 L 140 86 L 154 86 L 154 90 L 6 90 Z" fill="${C.mat}" ${LW}/>` +
    at(0, -15, walking(100, false) + limb([[106, 52], [120, 54]])) + arm(154, 8, 124, 38) + label(30, 52, 'ramp'),
    'Baby walking down a gentle ramp with one hand held low');
  P['s4-7'] = svg(floor() + walking(104, false) + limb([[98, 52], [86, 60]]) + `<path d="M86 60 Q 66 70 52 72" fill="none" stroke="${C.line}" stroke-width="1.4"/>` +
    box(30, 66, 26, 16) + `<circle cx="36" cy="84" r="4" fill="#fff" ${LW}/><circle cx="50" cy="84" r="4" fill="#fff" ${LW}/>` + arrow('M112 22 L 144 22'),
    'Baby walking along pulling a pull-along toy');
  P['s4-8'] = svg(mat() + floor() + sitting(40, 8) + limb([[44, 62], [56, 70]]) + toy(84, 82, 6, C.toy2) + arm(150, 66, 120, 80) + arrow2('M58 74 Q 84 64 114 74'),
    'Baby and adult rolling a ball back and forth while sitting');
  P['s4-9'] = svg(floor() + box(78, 60, 74, 28) + body(94, 56, 18, 7, -10) + head(116, 50) + limb([[80, 60], [70, 72], [70, 86]]) + limb([[106, 58], [116, 60]]) +
    arrow('M56 50 L 56 80') + label(40, 30, 'turn round, feet first'),
    'Baby sliding feet-first off a low sofa on the tummy');

  /* Stage 5: speed, climbing and ball skills */
  P['s5-0'] = svg(floor() + `<path d="M10 88 V68 H34 V88" fill="none" stroke="${C.line}" stroke-width="3"/>` + cushion(44, 80, 20, 8) +
    `<rect x="72" y="86" width="26" height="3" fill="${C.hot}"/>` + box(106, 76, 18, 12) + box(132, 72, 20, 16, C.soft) +
    at(-10, 0, walking(96)) + arrow('M18 60 Q 50 50 76 58 T 140 60') + label(80, 98, 'under · over · along · up · push'),
    'A small obstacle course: under a chair, over a cushion, along a line, up a step, push a box');
  P['s5-1'] = svg(`<rect x="6" y="86" width="148" height="4" fill="${C.mat}"/>` + grass(8, 150) + box(20, 82, 124, 6) + walking(76, false) +
    limb([[80, 52], [94, 48]]) + arm(130, 22, 98, 46) + label(30, 74, 'plank'),
    'Baby walking along a plank on the grass with one hand held');
  P['s5-2'] = svg(floor() + running(76) + lines(52, 50) + `<line x1="140" y1="40" x2="140" y2="88" ${LW}/><path d="M140 40 L156 46 L140 52 Z" fill="${C.hot}"/>`,
    'Toddler running to a flag');
  P['s5-3'] = svg(floor() + box(30, 74, 30, 14) + at(-30, -14, walking(76, false)) + arm(10, 8, 34, 30) + arm(84, 8, 60, 30) +
    arrow('M64 64 Q 82 60 92 78') + `<path d="M90 87 h8 M102 87 h8" stroke="${C.hot}" stroke-width="3" stroke-linecap="round"/>` + label(110, 76, 'two feet', 'start'),
    'Toddler stepping down from a low step holding both adult hands, landing on two feet');
  P['s5-4'] = svg(floor() + limb([[64, 70], [62, 87]]) + limb([[70, 70], [84, 80]]) + body(66, 58, 10, 15, -6) +
    limb([[60, 52], [50, 44]]) + limb([[72, 52], [82, 46]]) + head(67, 36) + toy(96, 80, 7, C.toy2) + lines(118, 70) + arrow('M108 66 L 146 66'),
    'Toddler kicking a ball');
  P['s5-5'] = svg(floor() + walking(46) + `<path d="M80 86 h6 M96 86 h6 M112 86 h6 M128 86 h6" stroke="${C.line}" stroke-width="3" stroke-linecap="round" opacity=".5"/>` +
    label(110, 50, 'stomp, tiptoe,') + label(110, 61, 'big slow steps'),
    'Toddler doing silly animal walks, footprints behind');
  P['s5-6'] = svg(floor() + walking(64, false) + limb([[70, 54], [82, 62]]) +
    `<path d="M78 62 h18 l-2 18 h-14 z" fill="${C.wood}" ${LW} stroke-linejoin="round"/><path d="M82 62 q5 -8 10 0" fill="none" ${LW}/>` +
    `<rect x="128" y="20" width="24" height="68" rx="2" fill="${C.soft}" ${LW}/><circle cx="133" cy="56" r="2" fill="${C.line}"/>` + arrow('M100 40 L 122 40'),
    'Toddler carrying a small bag through to another room');
  P['s5-7'] = svg(floor() + `<path d="M90 88 L 100 20 M120 88 L 130 20" ${LW.replace('1.5', '3')}/>` +
    `<path d="M92 76 h26 M94 62 h26 M96 48 h26 M98 34 h26" ${LW.replace('1.5', '3')}/>` +
    at(4, -25, standing(104, 120, 73)) + arm(40, 60, 94, 40) + label(8, 98, 'you: spot, don’t lift', 'start'),
    'Toddler climbing a low playground ladder with an adult hand spotting');
  P['s5-8'] = svg(floor() + stairs(50, 3, 16) + `<line x1="40" y1="54" x2="140" y2="16" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/>` +
    at(26, -16, standing(60, 82, 34)) + arm(30, 60, 76, 52) + label(154, 98, 'both feet on each step', 'end'),
    'Toddler walking up stairs holding the rail, adult hand at the back');
  P['s5-9'] = svg(floor() + `<circle cx="52" cy="78" r="10" fill="#fff" ${LW}/><circle cx="108" cy="78" r="10" fill="#fff" ${LW}/>` +
    `<path d="M52 78 L 74 62 L 98 62 L 108 78 M74 62 L 80 54 M98 62 L 102 52 h8" fill="none" stroke="${C.hot}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
    limb([[78, 56], [70, 74], [68, 87]]) + body(80, 44, 9, 13, 10) + limb([[86, 40], [104, 52]]) + head(84, 24) +
    `<path d="M74 22 A10 10 0 0 1 94 22 Z" fill="${C.toy2}" ${LW}/>` + label(34, 30, 'helmet on'),
    'Toddler on a low balance bike with feet flat on the ground and a helmet on');

  /* Movement-play games (the "safe menu") */
  // A grown-up's lap from the side: thigh and shin, as one bent shape
  const lap = (x, y = 66) => `<path d="M${x - 40} ${y} H${x + 22} V88" fill="none" stroke="${C.adult}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`;
  P['g-0'] = svg(floor() + lap(90) + at(6, -22, sitting(76)) + hand(70, 52, 70) + hand(96, 54, -70) + arrow2('M58 18 Q 84 6 110 18'),
    'Baby sitting on an adult’s lap being rocked slowly forwards, back and side to side');
  P['g-1'] = svg(floor() + `<rect x="40" y="64" width="80" height="12" rx="6" fill="${C.wood}" ${LW}/>` + label(80, 86, 'your shins') +
    limb([[64, 54], [52, 60]]) + body(80, 54, 20, 7) + limb([[94, 56], [104, 62]]) + head(104, 46) +
    hand(72, 48, 10) + hand(90, 48, -10) + arrow2('M42 52 Q 34 62 42 72') + arrow2('M118 52 Q 126 62 118 72') + label(80, 24, 'tip slowly'),
    'Baby lying on the adult’s shins, held at the trunk, tipped slowly');
  P['g-2'] = svg(mat() + floor() + onBack(76) + hand(82, 66, 0) + arrow('M50 56 A 30 22 0 1 1 110 58') + label(80, 24, 'start it, they finish it'),
    'Guiding a slow roll along the floor');
  P['g-3'] = svg(floor() + body(80, 50, 10, 15) + limb([[76, 64], [74, 80]]) + limb([[84, 64], [86, 80]]) + head(81, 28) +
    hand(68, 50, 90) + hand(92, 50, 90) + arrow2('M120 30 L 120 76') + label(34, 50, 'under the ribs') + label(120, 92, 'straight up'),
    'Baby lifted slowly straight up and down, held under the ribs');
  P['g-4'] = svg(floor() + `<circle cx="80" cy="66" r="22" fill="${C.soft}" ${LW}/>` + body(80, 30, 9, 13) + limb([[82, 40], [96, 46]]) + head(81, 12, 8) +
    hand(70, 40, 70) + hand(90, 40, -70) + arrow2('M46 80 Q 80 96 114 80') + label(130, 40, 'tiny tilts'),
    'Baby sitting on a big exercise ball, adult hands on the hips, ball rolled a little each way');
  P['g-5'] = svg(floor() + lap(90) + at(6, -22, sitting(76)) + hand(70, 52, 70) + hand(96, 54, -70) + arrow2('M126 22 L 126 50') + note(30, 30) + note(42, 20),
    'Baby sitting on an adult’s knee being bounced gently to a song');
  P['g-6'] = svg(floor() + `<rect x="50" y="10" width="44" height="78" rx="20" fill="${C.adult}" ${LW}/>` +
    hand(97, 20, 80) + hand(100, 60, 0) + body(100, 46, 9, 14) + head(106, 25) +   // hands drawn first, so they sit behind
    arrow('M126 70 A 22 10 0 1 1 132 52') + label(30, 30, 'slow turns'),
    'Baby held against an adult’s chest with a hand behind the head, turning slowly');
  P['g-7'] = svg(floor() + slope(14, 150, 46, C.mat) + turn(17, 70, 63, at(0, -18, onBack(70))) + arm(146, 14, 104, 50) +
    arrow('M36 30 L 66 40') + label(46, 98, 'your hand sets the pace'),
    'Baby rolling slowly down a soft slope with an adult hand guiding');
  P['g-8'] = svg(floor() + `<path d="M40 10 H120" ${LW.replace('1.5', '4')}/><path d="M66 10 L 70 50 M94 10 L 90 50" ${LW}/>` +
    `<path d="M62 50 H98 L 92 72 H68 Z" fill="${C.toy}" ${LW} stroke-linejoin="round"/>` + body(80, 48, 8, 9) + head(80, 34, 8) +
    arrow2('M52 70 Q 80 82 108 70') + label(80, 96, 'bucket seat, low and slow'),
    'Baby in an enclosed bucket swing, swinging gently');
  P['g-9'] = svg(floor() + `<path d="M20 30 H40 Q 70 30 100 80 H124" fill="none" stroke="${C.hot}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M24 30 V88 M36 30 V88" ${LW}/>` + turn(40, 70, 46, sitting(66)) + legs(140) + arm(132, 50, 120, 66) + label(56, 98, 'they go alone'),
    'Toddler going down a small slide alone with an adult waiting at the bottom');

  /* Crawling patterns (crawling clinic) */
  P['c-0'] = svg(floor() + limb([[58, 70], [56, 86], [44, 86]]) + limb([[86, 68], [94, 86]], C.hot) + body(72, 66, 18, 8) +
    limb([[60, 72], [66, 86], [54, 86]], C.hot) + limb([[84, 70], [86, 86]]) + head(97, 60) + label(80, 30, 'opposite hand + knee together'),
    'Reciprocal crawl: opposite hand and knee move together');
  P['c-1'] = svg(mat() + floor() + tummy(72) + arrow('M100 50 L 132 50') + label(80, 34, 'pulls on forearms'),
    'Commando crawl: pulling forward on the forearms, belly down');
  P['c-2'] = svg(mat() + floor() + allFours(80, 62) + toy(136, 82) + arrow('M60 46 L 26 46') + label(44, 38, 'oops'),
    'Crawling backwards away from the toy');
  P['c-3'] = svg(mat() + floor() + sitting(84) + limb([[86, 60], [100, 72]]) + lines(58, 70) + arrow('M100 30 L 130 30'),
    'Baby sitting and scooting forward on the bottom');
  P['c-4'] = svg(floor() + limb([[66, 58], [56, 86]]) + limb([[86, 56], [100, 86]]) + body(76, 54, 16, 8, 10) + head(102, 66) + arrow('M110 32 L 140 32') + label(64, 30, 'hands and feet'),
    'Bear crawl: on hands and feet with straight legs');
  P['c-5'] = svg(floor() + limb([[60, 70], [58, 86], [44, 86]]) + limb([[62, 72], [40, 84], [24, 86]], C.hot) + body(74, 66, 18, 8) + limb([[88, 70], [90, 86]]) + head(99, 60) +
    label(40, 48, 'always this leg'),
    'One-sided crawl: always dragging the same leg');

  window.ILLUS = P;
})();
