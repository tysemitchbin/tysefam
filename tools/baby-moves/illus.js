/* ════════════════════════════════════════════════════════════════
   BABY MOVES: little diagrams for the exercises.

   On purpose these are NOT realistic: a circle head, a bean body and
   rounded-line arms and legs, plus simple props (mat, toy, sofa…) and
   arrows for the movement. Just enough to help the words make sense.

   Every picture is drawn in a 160 × 100 box; the floor is at y = 88.
   ILLUS['s1-0'] is the picture for stage 1, exercise 1 (counting from 0),
   the same keys the page uses for its "done today" ticks.
═════════════════════════════════════════════════════════════════ */
(function () {
  // Colours (the site's palette)
  const C = {
    skin: '#f6d6bf', body: '#f2b6c6', limb: '#e592ac', line: '#3f5e44',
    toy: '#f7d877', toy2: '#8ec6d4', mat: '#dcebd5', wood: '#e9cfae', soft: '#cfe6ec',
    hand: '#e89b6f', arrow: '#3f5e44'
  };

  /* ───── the building blocks ───── */
  const head = (x, y, r = 9) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.skin}" stroke="${C.line}" stroke-width="1.5"/>` +
    `<circle cx="${x + r * 0.35}" cy="${y - r * 0.1}" r="1.2" fill="${C.line}"/>`;          // one dot of an eye
  // body: a bean (ellipse) centred at x,y, turned by `rot` degrees
  const body = (x, y, rx, ry, rot = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${C.body}" stroke="${C.line}" stroke-width="1.5"/>`;
  // limb: a thick rounded line through some points [[x,y],[x,y]…]
  const limb = pts =>
    `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${C.limb}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const floor = () => `<line x1="6" y1="88" x2="154" y2="88" stroke="${C.line}" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>`;
  const mat = (x = 20, w = 120) => `<rect x="${x}" y="86" width="${w}" height="4" rx="2" fill="${C.mat}"/>`;
  const toy = (x, y, r = 5, fill = C.toy) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${C.line}" stroke-width="1.2"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .3}" fill="#fff" opacity=".7"/>`;
  const box = (x, y, w, h, fill = C.wood) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${C.line}" stroke-width="1.5"/>`;
  // a grown-up's hand: a soft blob, turned by `rot`
  const hand = (x, y, rot = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" transform="rotate(${rot} ${x} ${y})" fill="${C.hand}" stroke="${C.line}" stroke-width="1.2"/>`;
  // arrow along an SVG path (d), dashed, with an arrowhead at the end
  const arrow = d => `<path d="${d}" fill="none" stroke="${C.arrow}" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round" marker-end="url(#bm-head)"/>`;
  // the same, with an arrowhead at both ends (for "back and forth")
  const arrow2 = d => `<path d="${d}" fill="none" stroke="${C.arrow}" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round" marker-start="url(#bm-head)" marker-end="url(#bm-head)"/>`;
  const label = (x, y, t) => `<text x="${x}" y="${y}" font-size="8" font-family="Nunito, sans-serif" font-weight="700" fill="${C.line}" text-anchor="middle">${t}</text>`;

  const svg = (inner, title) =>
    `<svg viewBox="0 0 160 100" class="illus" role="img" aria-label="${title}">` +
    `<defs><marker id="bm-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">` +
    `<path d="M1 1 L9 5 L1 9 z" fill="${C.arrow}"/></marker></defs>${inner}</svg>`;

  /* ───── the poses (re-used by many pictures) ───── */
  // On the tummy, facing right, head up, propped on forearms. x,y = middle of the body.
  const tummy = (x, y = 79) =>
    limb([[x - 18, y + 3], [x - 34, y + 7]]) +                       // legs out behind
    limb([[x - 16, y + 5], [x - 30, y + 9]]) +
    body(x, y, 22, 8) +
    limb([[x + 12, y + 2], [x + 16, y + 9], [x + 26, y + 9]]) +      // forearm on the floor
    head(x + 26, y - 9);
  // Sitting, facing right. x = hips, legs stretched forward.
  const sitting = (x, lean = 0) =>
    limb([[x + 2, 84], [x + 26, 85]]) +                              // legs forward
    body(x, 68, 10, 16, lean) +
    head(x + 2 + lean * .4, 45);
  // On hands and knees, facing right. x = middle, y = top of the back.
  const allFours = (x, y = 66, ground = 88) =>
    limb([[x - 12, y + 6], [x - 14, ground - 2], [x - 26, ground - 2]]) +   // knee + shin on the floor
    limb([[x + 14, y + 5], [x + 16, ground - 2]]) +                        // arm straight down
    body(x, y + 4, 18, 8) +
    head(x + 25, y - 2);
  // Standing, facing right, one arm up to a surface at height `reach`.
  const standing = (x, reach = 56) =>
    limb([[x - 3, 70], [x - 5, 87]]) + limb([[x + 4, 70], [x + 6, 87]]) +
    body(x, 58, 10, 15) +
    limb([[x + 5, 52], [x + 16, reach]]) +
    head(x + 1, 36);

  /* ───── the pictures ───── */
  window.ILLUS = {
    // Stage 1 · Tummy time: on the tummy, a mirror to look at
    's1-0': svg(mat() + floor() +
      `<rect x="118" y="50" width="16" height="36" rx="4" fill="${C.soft}" stroke="${C.line}" stroke-width="1.5"/>` +
      `<line x1="122" y1="56" x2="128" y2="62" stroke="#fff" stroke-width="2" stroke-linecap="round"/>` +
      tummy(66) + label(126, 46, 'mirror'), 'Baby on the tummy looking at a mirror'),

    // Stage 1 · Arc reaching: the toy moves in an arc to one side, baby shifts weight
    's1-1': svg(mat() + floor() + tummy(62) +
      toy(118, 44) + arrow('M118 52 Q 138 64 128 82') + label(140, 40, 'slowly'),
      'Toy moved in an arc to one side while baby is on the tummy'),

    // Stage 1 · Sit-and-tilt: hands at the hips, tilt a little, baby puts a hand down
    's1-6': svg(mat() + floor() +
      sitting(76, -12) +
      limb([[70, 66], [60, 76], [58, 86]]) +                          // the catching hand
      hand(90, 80, -30) + hand(62, 74, 30) +                          // your hands at the hips
      arrow('M96 40 Q 82 28 68 34') + label(74, 22, 'tilt'),
      'Sitting baby tilted gently, adult hands at the hips, baby puts a hand down'),

    // Stage 2 · Crawl over an obstacle: up and over a cushion
    's2-3': svg(floor() +
      `<rect x="76" y="70" width="24" height="18" rx="9" fill="${C.soft}" stroke="${C.line}" stroke-width="1.5"/>` +
      allFours(88, 54, 88) + toy(140, 82) + arrow('M120 40 Q 134 40 140 70'),
      'Baby crawling over a cushion towards a toy'),

    // Stage 3 · Cruising circuit: sofa and table with a gap, toy on the far side
    's3-0': svg(floor() +
      box(10, 58, 58, 30) + box(96, 60, 52, 6) + `<line x1="102" y1="66" x2="102" y2="88" stroke="${C.line}" stroke-width="3"/><line x1="142" y1="66" x2="142" y2="88" stroke="${C.line}" stroke-width="3"/>` +
      standing(70, 58) + toy(126, 54) + arrow('M80 26 L 112 26') + label(86, 98, 'gap'),
      'Baby standing at the sofa, stepping sideways to a table across a small gap'),

    // Stage 3 · Squat pick-ups: standing at a table, squat down for the toy, stand back up
    's3-2': svg(floor() + box(96, 52, 52, 6) + `<line x1="140" y1="58" x2="140" y2="88" stroke="${C.line}" stroke-width="3"/>` +
      limb([[64, 74], [72, 82], [66, 87]]) + limb([[70, 75], [80, 82], [76, 87]]) +   // bent knees
      body(68, 66, 10, 13, 15) + head(74, 47) +
      limb([[74, 66], [86, 82]]) + limb([[72, 58], [100, 54]]) +
      toy(90, 84, 4) + arrow('M40 52 L 40 80') + arrow('M30 80 L 30 52'),
      'Baby squatting to pick up a toy while holding a table, then standing up'),

    // Movement game · Shin aeroplane: baby lies on the grown-up's shins, hands on the trunk
    'g-1': svg(floor() +
      `<rect x="40" y="64" width="80" height="12" rx="6" fill="${C.wood}" stroke="${C.line}" stroke-width="1.5"/>` + label(80, 86, 'your shins') +
      limb([[64, 54], [52, 60]]) + body(80, 54, 20, 7) + limb([[94, 56], [104, 62]]) + head(104, 46) +
      hand(72, 48, 10) + hand(90, 48, -10) +
      arrow2('M42 52 Q 34 62 42 72') + arrow2('M118 52 Q 126 62 118 72') + label(80, 24, 'tip slowly'),
      'Baby lying on the adult’s shins, held at the trunk, tipped slowly'),

    // Crawling pattern · Bottom shuffle: sitting and scooting along
    'c-3': svg(mat() + floor() + sitting(84) +
      limb([[86, 60], [100, 72]]) +
      `<path d="M58 70 h-14 M60 78 h-18 M58 86 h-12" stroke="${C.line}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>` +
      arrow('M100 30 L 130 30'),
      'Baby sitting and scooting forward on the bottom')
  };
})();
