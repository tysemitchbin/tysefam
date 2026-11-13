/* ════════════════════════════════════════════════════════════════
   TRX: simple start → finish diagrams for every exercise.

   On purpose these are NOT realistic: a round head, a thick line for
   the body and rounded lines for arms and legs, seen from the side.
   The strap hangs from the anchor (top) to the yellow handles or the
   foot cradles. Just enough to show the body angle and the movement.

   HOW A POSE IS WRITTEN
   Each body part is an angle in degrees, like a clock hand that
   goes anticlockwise:  0 = pointing right · 90 = up · 180 = left · -90 = down.
     a: [shin, thigh, body, upper arm, forearm]
        shin       ankle → knee      thigh   knee → hip
        body       hip → shoulder    upper arm shoulder → elbow
        forearm    elbow → hand
     b: [shin, thigh, upper arm, forearm] for the far-side leg and arm
        (leave out, or use null, to copy the near side)
     g: which joint touches the ground ('foot', 'foot2', 'hand', 'elbow', 'shoulder'…)
     x / y: where that joint sits (y defaults to the floor)
     f:  1 = the front of the body is on the "clockwise" side of the limbs:
            standing, that means facing right (towards the anchor);
            lying down head-right, it means facing the floor.
        -1 = the other way: standing facing left (away from the anchor),
            or lying on the back.
     s: where the strap goes: 'h' both hands · 'h1' near hand only ·
        'f' both feet · 'f1' near foot · 'f2' far foot · none
     ax: where the anchor is (left–right). Hand straps default to the
         top right; foot straps default to straight above the feet.
     ak: shorten the arms (0–1), for arms pointing out to the side
     ft / ft2: point the feet a set way (e.g. on tiptoe)
   Every picture panel is 160 × 120 with the floor at y = 112.
═════════════════════════════════════════════════════════════════ */
(function () {
  const C = {
    head: '#f6d6bf', line: '#3f5e44',
    shirt: '#e89b6f', arm: '#c46f45', armFar: '#f1c6aa',
    leg: '#5d8a5f', legFar: '#b3cfab',
    strap: '#3c4138', handle: '#f7d877', floor: '#cfc6b0'
  };
  const FLOOR = 112;
  const LEN = { shin: 22, thigh: 23, body: 28, uarm: 15, farm: 14 };
  // How high each joint sits when it is the one touching the ground.
  const GROUND = { foot: 109, foot2: 109, hand: 109, hand2: 109, knee: 108, knee2: 108, elbow: 108, hip: 106, shoulder: 106 };

  /* ───── a little maths ───── */
  const rad = d => d * Math.PI / 180;
  const step = (p, deg, len) => [p[0] + Math.cos(rad(deg)) * len, p[1] - Math.sin(rad(deg)) * len];
  const back = (p, deg, len) => step(p, deg, -len);
  const r1 = n => Math.round(n * 10) / 10;
  const pt = p => r1(p[0]) + ',' + r1(p[1]);

  /* Work out where every joint is for a pose. */
  function solve(p) {
    const [sh, th, bo, ua, fa] = p.a;
    const b = p.b || [];
    const sh2 = b[0] ?? sh, th2 = b[1] ?? th, ua2 = b[2] ?? ua, fa2 = b[3] ?? fa;
    const ak = p.ak || 1, ak2 = p.ak2 || ak;
    const J = {};
    J.foot = [0, 0];
    J.knee = step(J.foot, sh, LEN.shin);
    J.hip = step(J.knee, th, LEN.thigh);
    J.shoulder = step(J.hip, bo, LEN.body);
    J.elbow = step(J.shoulder, ua, LEN.uarm * ak);
    J.hand = step(J.elbow, fa, LEN.farm * ak);
    J.knee2 = back(J.hip, th2, LEN.thigh);
    J.foot2 = back(J.knee2, sh2, LEN.shin);
    J.elbow2 = step(J.shoulder, ua2, LEN.uarm * ak2);
    J.hand2 = step(J.elbow2, fa2, LEN.farm * ak2);
    J.head = step(J.shoulder, bo + (p.n || 0), 10);
    // slide the whole body so the ground joint lands where it should
    const g = p.g || 'foot';
    const want = [p.x ?? 80, p.y ?? GROUND[g] ?? 109];
    const dx = want[0] - J[g][0], dy = want[1] - J[g][1];
    Object.keys(J).forEach(k => { J[k] = [J[k][0] + dx, J[k][1] + dy]; });
    // which way the toes and the face point
    const f = p.f || 1;
    J.toe = step(J.foot, p.ft ?? (sh - 90 * f), 7);
    J.toe2 = step(J.foot2, p.ft2 ?? (sh2 - 90 * f), 7);
    J.eye = step(J.head, bo + (p.n || 0) - 90 * f, 3.5);
    return J;
  }

  /* ───── drawing pieces ───── */
  const seg = (pts, colour, w) =>
    `<polyline points="${pts.map(pt).join(' ')}" fill="none" stroke="${colour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const strapTo = (ax, end, kind) => {
    const a = [ax, 6];
    const ang = Math.atan2(end[1] - a[1], end[0] - a[0]) * 180 / Math.PI;
    const grip = kind === 'foot'
      ? `<ellipse cx="${r1(end[0])}" cy="${r1(end[1])}" rx="5" ry="3.2" transform="rotate(${r1(ang + 90)} ${pt(end)})" fill="${C.handle}" stroke="${C.line}" stroke-width="1"/>`
      : `<rect x="${r1(end[0] - 5)}" y="${r1(end[1] - 2)}" width="10" height="4" rx="2" transform="rotate(${r1(ang + 90)} ${pt(end)})" fill="${C.handle}" stroke="${C.line}" stroke-width="1"/>`;
    return `<line x1="${ax}" y1="6" x2="${r1(end[0])}" y2="${r1(end[1])}" stroke="${C.strap}" stroke-width="1.8" stroke-linecap="round"/>` + grip;
  };
  const anchor = ax =>
    `<rect x="${ax - 8}" y="0" width="16" height="3.5" rx="1.5" fill="${C.strap}"/>` +
    `<circle cx="${ax}" cy="5.5" r="2.6" fill="none" stroke="${C.strap}" stroke-width="1.6"/>`;
  const floor = () => `<line x1="4" y1="${FLOOR}" x2="156" y2="${FLOOR}" stroke="${C.floor}" stroke-width="2" stroke-linecap="round"/>`;
  const label = (x, t) => `<text x="${x}" y="11" font-size="8.5" font-family="Nunito, sans-serif" font-weight="800" fill="${C.line}" opacity=".55">${t}</text>`;

  /* One picture panel for one pose. */
  function panel(p, tag) {
    const J = solve(p);
    const s = p.s || '';
    const footStrap = s[0] === 'f';
    const ax = p.ax ?? (footStrap ? J[s === 'f2' ? 'foot2' : 'foot'][0] : 140);
    let out = floor();
    if (s) out += anchor(ax);
    // far side first (it's behind), then the strap to it
    out += seg([J.foot2, J.knee2, J.hip], C.legFar, 6) + seg([J.foot2, J.toe2], C.legFar, 4);
    out += seg([J.shoulder, J.elbow2, J.hand2], C.armFar, 5);
    if (s === 'h') out += strapTo(ax, J.hand2, 'hand');
    if (s === 'f' || s === 'f2') out += strapTo(ax, J.foot2, 'foot');
    // the body, near leg and head
    out += seg([J.hip, J.shoulder], C.shirt, 10);
    out += seg([J.foot, J.knee, J.hip], C.leg, 6) + seg([J.foot, J.toe], C.line, 4);
    out += `<circle cx="${r1(J.head[0])}" cy="${r1(J.head[1])}" r="7" fill="${C.head}" stroke="${C.line}" stroke-width="1.5"/>` +
      `<circle cx="${r1(J.eye[0])}" cy="${r1(J.eye[1])}" r="1.2" fill="${C.line}"/>`;
    if (s === 'f' || s === 'f1') out += strapTo(ax, J.foot, 'foot');
    // near arm on top, then its strap
    out += seg([J.shoulder, J.elbow, J.hand], C.arm, 5) +
      `<circle cx="${r1(J.hand[0])}" cy="${r1(J.hand[1])}" r="2.4" fill="${C.head}" stroke="${C.line}" stroke-width="1"/>`;
    if (s === 'h' || s === 'h1') out += strapTo(ax, J.hand, 'hand');
    return out + (tag ? label(6, tag) : '');
  }

  /* The pictures: [start, finish], or [one pose] for holds and stretches. */
  const S = 'h';       // most moves hold the handles
  const up = (lean, arm = -90, fore = arm) => [lean, lean, lean, arm, fore];   // a straight body

  const P = {
    /* ── Pull ── */
    'low-row': [
      { x: 88, a: up(122, 25), s: S },
      { x: 88, a: up(108, 200, 22), s: S }],
    'high-row': [
      { x: 88, a: up(122, 27), s: S },
      { x: 88, a: up(108, 182, 48), s: S }],
    'y-fly': [
      { x: 88, a: up(120, 27), s: S },
      { x: 88, a: up(104, 62), s: S }],
    't-fly': [
      { x: 88, a: up(120, 27), s: S },
      { x: 88, a: up(104, 22), ak: .45, s: S }],
    'single-arm-row': [
      { x: 88, a: up(122, 25), b: [null, null, -100, -95], s: 'h1' },
      { x: 88, a: up(108, 200, 22), b: [null, null, -100, -95], s: 'h1' }],
    'power-pull': [
      { x: 88, a: up(126, 24), b: [null, null, 235, 245], s: 'h1' },
      { x: 88, a: up(106, 200, 22), b: [null, null, 28, 28], s: 'h1' }],
    'inverted-row': [
      { x: 26, a: up(12, 88), f: -1, ax: 100, s: S },
      { x: 26, a: up(30, -112, 78), f: -1, ax: 100, s: S }],

    /* ── Push ── */
    'chest-press': [
      { x: 74, a: up(112, 198), f: -1, s: S },
      { x: 74, a: up(128, 40, 172), f: -1, s: S }],
    'chest-fly': [
      { x: 74, a: up(112, 198), f: -1, s: S },
      { x: 74, a: up(126, 185), ak: .4, f: -1, s: S }],
    'push-up': [
      { g: 'hand', x: 118, a: up(5), s: 'f' },
      { g: 'hand', x: 118, y: 109, a: [-12, -12, -12, 160, -90], s: 'f' }],
    'triceps-press': [
      { x: 80, a: up(116, 162), f: -1, s: S },
      { x: 80, a: up(126, 150, 335), f: -1, s: S }],

    /* ── Legs ── */
    'squat': [
      { x: 86, a: up(95, 22), s: S },
      { x: 86, a: [60, 170, 76, 40, 40], s: S }],
    'jump-squat': [
      { x: 86, a: [60, 170, 76, 40, 40], s: S },
      { x: 86, y: 96, a: up(96, 36), ft: -60, s: S }],
    'pistol-squat': [
      { x: 86, a: up(95, 24), b: [118, 118], s: S },
      { x: 86, a: [52, 176, 72, 38, 38], b: [178, 182], s: S }],
    'reverse-lunge': [
      { x: 88, a: up(95, 22), s: S },
      { x: 88, a: [90, 180, 92, 26, 26], b: [8, 76], s: S }],
    'suspended-lunge': [
      { x: 60, a: [90, 90, 96, 250, 225], b: [205, 116], f: -1, ax: 140, s: 'f2' },
      { x: 60, a: [84, 6, 96, 250, 225], b: [192, 100], f: -1, ax: 140, s: 'f2' }],
    'hamstring-curl': [
      { g: 'shoulder', x: 116, a: [-14, -14, -14, 186, 180], f: -1, ax: 44, s: 'f' },
      { g: 'shoulder', x: 116, a: [100, -50, -30, 186, 180], f: -1, ax: 44, s: 'f' }],
    'hip-press': [
      { g: 'shoulder', x: 116, a: [32, -38, -4, 186, 180], f: -1, ax: 56, s: 'f' },
      { g: 'shoulder', x: 116, a: [56, -34, -34, 186, 180], f: -1, ax: 56, s: 'f' }],
    'calf-raise': [
      { x: 88, a: up(96, 24), s: S },
      { x: 88, y: 103, a: up(96, 22), ft: -55, ft2: -55, s: S }],
    'sprinter-start': [
      { g: 'foot2', x: 98, a: [80, 46, 136, 300, 160], b: [136, 136], f: -1, s: S },
      { x: 62, y: 106, a: [108, 108, 108, 300, 160], b: [80, -8], ft: 230, f: -1, s: S }],
    'hip-hinge': [
      { x: 86, a: up(95, 28), s: S },
      { x: 86, a: [96, 112, 42, 30, 30], s: S }],

    /* ── Core (feet in the cradles, head on the right) ── */
    'plank': [
      { g: 'elbow', x: 112, a: [1, 1, 1, -90, 0], s: 'f' }],
    'knee-tuck': [
      { g: 'hand', x: 118, a: up(6), s: 'f' },
      { g: 'hand', x: 118, a: [-10, 122, -24, -90, -90], s: 'f' }],
    'pike': [
      { g: 'hand', x: 118, a: up(6), s: 'f' },
      { g: 'hand', x: 118, a: [42, 42, -52, -90, -90], s: 'f' }],
    'mountain-climber': [
      { g: 'hand', x: 118, a: up(6), ax: 46, s: 'f' },
      { g: 'hand', x: 118, a: [-10, 124, 4, -90, -90], b: [6, 6], ax: 46, s: 'f' }],
    'body-saw': [
      { g: 'elbow', x: 112, a: [1, 1, 1, -90, 0], s: 'f' },
      { g: 'elbow', x: 112, a: [-3, -3, -3, -42, 0], s: 'f' }],
    'rollout': [
      { x: 92, a: up(100, 250), f: -1, s: S },
      { x: 92, a: up(134, 146), f: -1, s: S }],

    /* ── Arms ── */
    'biceps-curl': [
      { x: 88, a: up(124, 28), s: S },
      { x: 88, a: up(112, 32, 162), s: S }],

    /* ── Full body and power ── */
    'squat-row': [
      { x: 86, a: [60, 170, 76, 40, 40], s: S },
      { x: 86, a: up(102, 200, 24), s: S }],
    'atomic-push-up': [
      { g: 'hand', x: 118, y: 109, a: [-12, -12, -12, 160, -90], s: 'f' },
      { g: 'hand', x: 118, a: [-10, 122, -24, -90, -90], s: 'f' }],

    /* ── Warm-up and stretches ── */
    'overhead-squat': [
      { x: 86, a: up(94, 60), s: S },
      { x: 86, a: [60, 170, 80, 62, 62], s: S }],
    'chest-stretch': [
      { x: 66, a: [96, 96, 108, 20, 15], b: [62, 62], ak: .55, f: -1, s: S }],
    'lat-stretch': [
      { x: 88, a: [100, 140, 28, 24, 24], s: S }],
    'hip-flexor-stretch': [
      { x: 60, a: [84, 6, 100, 100, 100], b: [190, 98], f: -1, ax: 140, s: 'f2' }],
    'hamstring-stretch': [
      { g: 'foot2', x: 62, a: [172, 172, 52, -42, -42], b: [90, 90], s: 'f1' }]
  };

  /* Draw the diagram for an exercise id. Returns '' if there isn't one.
     small = true draws just one pose (the finish, or the hold), for lists. */
  function draw(id, title, small) {
    const poses = P[id];
    if (!poses) return '';
    const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    let inner;
    if (poses.length === 1) {
      inner = `<g transform="translate(80 0)">${panel(poses[0], 'hold')}</g>`;
    } else {
      inner = panel(poses[0], 'start') +
        `<g transform="translate(160 0)">${panel(poses[1], 'finish')}</g>` +
        `<line x1="160" y1="22" x2="160" y2="104" stroke="${C.floor}" stroke-width="1" stroke-dasharray="3 3"/>`;
    }
    const box = !small ? '0 0 320 120' : poses.length === 1 ? '80 0 160 120' : '160 0 160 120';
    return `<svg viewBox="${box}" class="illus" role="img" aria-label="${esc(title || id)}">${inner}</svg>`;
  }

  /* A little picture of the four strap lengths, for the "Strap lengths" note. */
  function lengths() {
    const L = [['FS', 'Fully shortened', 58], ['ML', 'Mid-length', 76], ['MC', 'Mid-calf', 92], ['FL', 'Fully lengthened', 104]];
    let s = `<line x1="10" y1="${FLOOR}" x2="310" y2="${FLOOR}" stroke="${C.floor}" stroke-width="2" stroke-linecap="round"/>` +
      `<line x1="10" y1="30" x2="310" y2="30" stroke="${C.strap}" stroke-width="3" stroke-linecap="round"/>`;
    L.forEach(([k, name, y], i) => {
      const x = 40 + i * 80;
      s += `<text x="${x}" y="12" text-anchor="middle" font-size="11" font-family="Fredoka, sans-serif" font-weight="600" fill="${C.line}">${k}</text>` +
        `<text x="${x}" y="23" text-anchor="middle" font-size="8" font-family="Nunito, sans-serif" font-weight="700" fill="${C.line}" opacity=".7">${name}</text>` +
        `<line x1="${x}" y1="31" x2="${x}" y2="${y}" stroke="${C.strap}" stroke-width="2"/>` +
        `<rect x="${x - 6}" y="${y}" width="12" height="5" rx="2.5" fill="${C.handle}" stroke="${C.line}" stroke-width="1"/>`;
    });
    return `<svg viewBox="0 0 320 120" class="illus" role="img" aria-label="The four strap lengths, from fully shortened to fully lengthened">${s}</svg>`;
  }

  window.TRX_ILLUS = { draw, lengths, has: id => !!P[id] };
})();
