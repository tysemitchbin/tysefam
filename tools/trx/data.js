/* ════════════════════════════════════════════════════════════════
   TRX: the exercise database and the ready-made workouts.

   Exercises
     id        a short name. The diagram in illus.js and saved workouts
               use it, so don't rename one once it's in use.
     cat       push | pull | legs | core | arms | power | stretch
     level     1 beginner · 2 intermediate · 3 advanced
     len       strap length: FS fully shortened · ML mid-length ·
               MC mid-calf · FL fully lengthened
     pos       how you stand or lie (a key of POSITIONS below)
     sides     true = one side at a time (the timer says when to switch)
     hold      true = a hold or a stretch, not reps
     muscles   what it works, in plain words
     setup     how to get into the start position
     steps     the movement
     cues      what to think about while you do it
     easier / harder   how to change it (usually: your feet or your angle)

   Workouts
     rounds    how many times through the list
     work      seconds of work per exercise
     rest      seconds of rest after each exercise
     roundRest seconds of rest between rounds
     list      exercise ids, in order (grouped by strap length on
               purpose, so you change the straps as little as possible)
═════════════════════════════════════════════════════════════════ */
window.TRX_DATA = {

  CATS: {
    push:    { name: 'Push',       emoji: '🫸' },
    pull:    { name: 'Pull',       emoji: '🚣' },
    legs:    { name: 'Legs',       emoji: '🦵' },
    core:    { name: 'Core',       emoji: '🧱' },
    arms:    { name: 'Arms',       emoji: '💪' },
    power:   { name: 'Power',      emoji: '⚡' },
    stretch: { name: 'Stretch',    emoji: '🧘' }
  },
  LEVELS: { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' },

  LENGTHS: {
    FS: { name: 'Fully shortened',  how: 'Both adjusters pulled all the way up. The handles hang highest, at about waist height.' },
    ML: { name: 'Mid-length',       how: 'Adjusters about halfway. The handles hang at about knee height.' },
    MC: { name: 'Mid-calf',         how: 'The foot cradles hang at the middle of your calf, roughly a hand or two off the floor. Used for feet-in-the-cradles moves.' },
    FL: { name: 'Fully lengthened', how: 'Both adjusters pulled all the way down. The handles hang lowest, a little way off the floor.' }
  },
  LENGTH_NOTE: 'These are a guide for an anchor at the usual height (about 2–2.5 m). Higher or lower anchors shift everything, so adjust until the start position feels right.',

  POSITIONS: {
    toward: 'Stand facing the anchor',
    away:   'Stand facing away from the anchor',
    down:   'On the floor, face down, feet in the cradles',
    up:     'On the floor, face up, heels in the cradles',
    under:  'Lie under the anchor, holding the handles'
  },

  BASICS: [
    ['Your feet set the difficulty.', 'Facing the anchor: walk your feet closer to it to make a move harder, further away to make it easier. Facing away it works the other way round. One small step makes a big difference.'],
    ['Keep the straps tight.', 'A strap that goes slack at any point in the move means you\'re dropping the tension. Keep them taut from start to finish.'],
    ['Don\'t let the straps rub.', 'Straps should not saw across your arms or shoulders. For chest presses, slide them under your armpits, not over your arms.'],
    ['Body like a plank.', 'Most moves want a straight line from head to heels: squeeze your bum, brace your belly, don\'t let your hips sag or pike.'],
    ['Set the anchor safely.', 'Use a proper door anchor on the hinge side of a closed door that opens away from you, or a rated beam or bracket. Tug hard on it before every session.'],
    ['Start easy, then progress.', 'Get every rep of a beginner version right before you step your feet in. Stop if anything hurts (rather than just burns).']
  ],

  EXERCISES: [
    /* ───────── Pull ───────── */
    {
      id: 'low-row', name: 'Low Row', cat: 'pull', level: 1, len: 'FS', pos: 'toward',
      muscles: 'Upper back, lats, biceps',
      setup: 'Hold a handle in each hand, palms facing each other, arms straight. Walk your feet forward and lean back until the straps are tight.',
      steps: ['Start leaning back with straight arms and a straight body.', 'Pull your chest up to your hands, driving the elbows back past your ribs.', 'Lower back down slowly until your arms are straight again.'],
      cues: ['Squeeze your shoulder blades together at the top.', 'Keep hips up: your body moves as one plank.', 'Wrists straight, thumbs pointing up.'],
      easier: 'Step back so you are more upright.', harder: 'Walk your feet closer to the anchor, or try it on one leg.'
    },
    {
      id: 'high-row', name: 'High Row', cat: 'pull', level: 1, len: 'FS', pos: 'toward',
      muscles: 'Upper back, rear shoulders',
      setup: 'Hold the handles with palms facing down, arms straight in front at chest height. Lean back until the straps are tight.',
      steps: ['Start leaning back, arms straight.', 'Pull with your elbows wide and high, at shoulder height, until your hands are beside your chest.', 'Straighten your arms slowly to lower back.'],
      cues: ['Elbows stay up and out, like a wide "W".', 'Don\'t shrug: shoulders stay down away from your ears.'],
      easier: 'Stand more upright.', harder: 'Feet closer to the anchor.'
    },
    {
      id: 'y-fly', name: 'Y Fly', cat: 'pull', level: 2, len: 'FS', pos: 'toward',
      muscles: 'Shoulders, upper back',
      setup: 'Hold the handles with palms down, arms straight in front. Lean back until the straps are tight.',
      steps: ['Start leaning back, arms straight.', 'Keeping your arms straight, sweep them up and out into a "Y" above your head.', 'Your body rises to stand more upright. Lower slowly back down.'],
      cues: ['Arms stay straight the whole time.', 'Lead with your thumbs.', 'Ribs down: don\'t arch your lower back.'],
      easier: 'Stand more upright and use a smaller range.', harder: 'Feet closer to the anchor.'
    },
    {
      id: 't-fly', name: 'T Fly', cat: 'pull', level: 2, len: 'FS', pos: 'toward',
      muscles: 'Rear shoulders, upper back',
      setup: 'Hold the handles with palms facing each other, arms straight in front. Lean back until the straps are tight.',
      steps: ['Start leaning back, arms straight in front of your chest.', 'Open your arms wide out to the sides, like a "T", pulling yourself up.', 'Bring your hands back together slowly to lower down.'],
      cues: ['A soft bend in the elbows, but don\'t row it.', 'Squeeze your shoulder blades at the top.'],
      easier: 'Stand more upright.', harder: 'Feet closer to the anchor.'
    },
    {
      id: 'single-arm-row', name: 'Single-Arm Row', cat: 'pull', level: 2, len: 'FS', pos: 'toward', sides: true,
      muscles: 'Back, biceps, core (anti-twist)',
      setup: 'Lock both handles together (thread one through the other) and hold them in one hand. Lean back with that arm straight, other arm by your side.',
      steps: ['Start leaning back on one straight arm.', 'Row your hand to the side of your ribs, keeping your chest facing the anchor.', 'Lower slowly. Switch sides halfway.'],
      cues: ['Don\'t let your body twist open.', 'Feet hip-width or wider to help balance.'],
      easier: 'Stand more upright, feet wider.', harder: 'Feet closer to the anchor.'
    },
    {
      id: 'power-pull', name: 'Power Pull', cat: 'pull', level: 3, len: 'FS', pos: 'toward', sides: true,
      muscles: 'Back, shoulders, core rotation',
      setup: 'Lock the handles together and hold them in one hand. Lean back with that arm straight.',
      steps: ['Start leaning back, the free arm reaching down and behind you, chest turned open.', 'Row hard while turning back to face the anchor, and reach the free arm towards the anchor.', 'Lower slowly, turning open again. Switch sides halfway.'],
      cues: ['The turn comes from your middle, not just the arm.', 'Keep the strap tight through the whole move.'],
      easier: 'Stand more upright and turn less.', harder: 'Feet closer to the anchor, move faster on the way up.'
    },
    {
      id: 'inverted-row', name: 'Inverted Row', cat: 'pull', level: 3, len: 'FL', pos: 'under',
      muscles: 'Back, biceps, grip, core',
      setup: 'Lie under the anchor with the handles above your chest. Hold them, arms straight, heels on the floor, and lift your hips so your body is straight.',
      steps: ['Hang from straight arms with a straight body, heels on the floor.', 'Pull your chest up to your hands.', 'Lower slowly until your arms are straight.'],
      cues: ['Hips up: no sagging.', 'Elbows close to your sides.'],
      easier: 'Bend your knees and put your feet flat on the floor.', harder: 'Lift one leg, or shorten the straps a bit and walk further under.'
    },

    /* ───────── Push ───────── */
    {
      id: 'chest-press', name: 'Chest Press', cat: 'push', level: 1, len: 'FL', pos: 'away',
      muscles: 'Chest, shoulders, triceps, core',
      setup: 'Face away from the anchor, straps under your armpits. Hold the handles in front of your chest with straight arms and lean forward until the straps are tight. Stagger your feet.',
      steps: ['Start leaning forward with straight arms at chest height.', 'Bend your elbows and lower your chest between your hands, like a standing push-up.', 'Press back up to straight arms.'],
      cues: ['Body stays straight: hips don\'t drop.', 'Elbows at about 45° from your body, not flared out.', 'Keep the straps off your arms.'],
      easier: 'Step forward so you are more upright.', harder: 'Walk your feet back towards the anchor, or bring your feet together.'
    },
    {
      id: 'chest-fly', name: 'Chest Fly', cat: 'push', level: 2, len: 'FL', pos: 'away',
      muscles: 'Chest, front shoulders, core',
      setup: 'Same start as the Chest Press: facing away, straight arms in front of your chest, leaning forward.',
      steps: ['Start with straight arms in front of your chest.', 'With a soft bend in the elbows, open your arms wide like a hug, letting your chest move forward.', 'Squeeze your arms back together to rise up.'],
      cues: ['Go only as wide as you can control.', 'Keep your belly braced: don\'t let your lower back sag.'],
      easier: 'More upright, smaller range.', harder: 'Feet further back.'
    },
    {
      id: 'push-up', name: 'Suspended Push-up', cat: 'push', level: 3, len: 'MC', pos: 'down',
      muscles: 'Chest, triceps, shoulders, core',
      setup: 'Lie face down with your feet in the cradles (toes down), hands under your shoulders. Push up into a high plank.',
      steps: ['Start in a straight-arm plank, feet in the cradles.', 'Lower your chest towards the floor, elbows back at about 45°.', 'Push back up without letting your feet swing.'],
      cues: ['Squeeze bum and belly so the hips stay level.', 'Keep your feet still in the straps.'],
      easier: 'Do it on your knees with the cradles under your shins, or do a regular push-up.', harder: 'Pause at the bottom, or add a knee tuck (Atomic Push-up).'
    },
    {
      id: 'triceps-press', name: 'Triceps Press', cat: 'arms', level: 2, len: 'FL', pos: 'away',
      muscles: 'Triceps, core',
      setup: 'Face away from the anchor. Hold the handles with arms straight out in front of your forehead, palms down, and lean forward.',
      steps: ['Start with straight arms in front of your forehead.', 'Bend only at the elbows, bringing your hands to just above your head, so your body moves forward.', 'Straighten your arms to press back.'],
      cues: ['Elbows point forward and stay at the same height.', 'Body stays one straight line.'],
      easier: 'Step forward so you are more upright.', harder: 'Walk your feet back towards the anchor.'
    },

    /* ───────── Legs ───────── */
    {
      id: 'squat', name: 'Squat', cat: 'legs', level: 1, len: 'ML', pos: 'toward',
      muscles: 'Thighs, glutes',
      setup: 'Face the anchor, holding the handles with your arms out in front, straps tight. Feet hip-width apart.',
      steps: ['Stand tall with arms out in front.', 'Sit your hips back and down as if onto a low chair, keeping your chest up.', 'Push through your heels to stand up.'],
      cues: ['Use the straps for balance, not to pull yourself up.', 'Knees follow your toes.', 'Heels stay down.'],
      easier: 'Lean back a little more and let the straps help.', harder: 'Use the straps less, add a jump, or try it on one leg.'
    },
    {
      id: 'jump-squat', name: 'Jump Squat', cat: 'power', level: 2, len: 'ML', pos: 'toward',
      muscles: 'Legs, glutes, heart and lungs',
      setup: 'Same as the Squat: face the anchor, handles held out in front.',
      steps: ['Sit down into a squat.', 'Drive up and jump, straightening everything.', 'Land softly, going straight into the next squat.'],
      cues: ['Land quietly, on the balls of your feet, then heels.', 'Keep the straps tight in the air.'],
      easier: 'Rise onto your toes instead of jumping.', harder: 'Jump higher, or squat deeper.'
    },
    {
      id: 'pistol-squat', name: 'Single-Leg Squat', cat: 'legs', level: 3, len: 'ML', pos: 'toward', sides: true,
      muscles: 'Thighs, glutes, balance',
      setup: 'Face the anchor holding the handles, arms out in front. Stand on one leg with the other foot just off the floor in front.',
      steps: ['Balance on one leg, the other leg forward.', 'Sit down slowly on the standing leg, reaching the free leg forward.', 'Push back up. Switch legs halfway.'],
      cues: ['Standing knee in line with your toes.', 'Use your arms only as much as you need.'],
      easier: 'Go only halfway down, or tap the free heel on the floor.', harder: 'Go all the way down and use the straps less.'
    },
    {
      id: 'reverse-lunge', name: 'Reverse Lunge', cat: 'legs', level: 1, len: 'ML', pos: 'toward', sides: true,
      muscles: 'Thighs, glutes',
      setup: 'Face the anchor holding the handles, arms out in front, straps tight.',
      steps: ['Stand tall.', 'Step one foot back and lower until both knees are bent at about 90°, back knee just off the floor.', 'Push through the front heel to stand back up. Swap legs each rep, or switch halfway.'],
      cues: ['Chest up, body upright.', 'Front knee over the ankle, not past the toes.'],
      easier: 'A smaller, shallower step.', harder: 'Drive the back knee up to hip height as you stand (balance lunge).'
    },
    {
      id: 'suspended-lunge', name: 'Suspended Lunge', cat: 'legs', level: 2, len: 'MC', pos: 'away', sides: true,
      muscles: 'Thighs, glutes, hip flexors, balance',
      setup: 'Face away from the anchor and put one foot in both cradles behind you (lock them together). Hop forward on the other foot until you\'re about a stride away.',
      steps: ['Stand tall on the front leg, back foot in the cradle.', 'Bend the front knee and let the back knee drop towards the floor as the strap swings back.', 'Push through the front heel to stand. Switch legs halfway.'],
      cues: ['Front knee stays over the ankle.', 'Most of your weight on the front leg.'],
      easier: 'Go only halfway down, hold a wall or chair for balance.', harder: 'Go lower, or add a hop at the top.'
    },
    {
      id: 'hamstring-curl', name: 'Hamstring Curl', cat: 'legs', level: 2, len: 'MC', pos: 'up',
      muscles: 'Hamstrings, glutes, core',
      setup: 'Lie on your back with your heels in the cradles, legs straight, arms on the floor by your sides. Lift your hips so your body is a straight line.',
      steps: ['Start with hips lifted and legs straight.', 'Pull your heels towards your bum, lifting your hips even higher.', 'Straighten your legs slowly, keeping the hips up.'],
      cues: ['Don\'t let the hips drop between reps.', 'Press your arms into the floor for balance.'],
      easier: 'Lower your hips to the floor between reps.', harder: 'One leg at a time, or slow down the straightening part.'
    },
    {
      id: 'hip-press', name: 'Hip Press', cat: 'legs', level: 1, len: 'MC', pos: 'up',
      muscles: 'Glutes, hamstrings, lower back',
      setup: 'Lie on your back with your heels in the cradles and knees bent at about 90°, arms on the floor.',
      steps: ['Start with your bum just off the floor.', 'Press your heels down into the cradles and lift your hips high.', 'Lower slowly.'],
      cues: ['Squeeze your bum at the top.', 'Don\'t over-arch your lower back: ribs down.'],
      easier: 'Do it with your feet flat on the floor (a glute bridge).', harder: 'One leg at a time, or hold at the top.'
    },
    {
      id: 'calf-raise', name: 'Calf Raise', cat: 'legs', level: 1, len: 'ML', pos: 'toward',
      muscles: 'Calves, ankles',
      setup: 'Face the anchor holding the handles, arms out in front, leaning back very slightly.',
      steps: ['Stand tall, feet hip-width.', 'Rise up onto the balls of your feet as high as you can.', 'Lower slowly.'],
      cues: ['Straight up, not forward.', 'Pause at the top.'],
      easier: 'Lean back on the straps more.', harder: 'One leg at a time.'
    },
    {
      id: 'hip-hinge', name: 'Hip Hinge', cat: 'legs', level: 1, len: 'FS', pos: 'toward',
      muscles: 'Hamstrings, glutes, lower back',
      setup: 'Face the anchor holding the handles, arms straight, straps tight. Soft knees.',
      steps: ['Stand tall with straight arms.', 'Push your hips back and let your chest come forward, back flat, arms reaching to the anchor.', 'Drive your hips forward to stand tall again.'],
      cues: ['The movement is at the hips: knees bend only a little.', 'Flat back: no rounding.'],
      easier: 'A smaller range.', harder: 'Do it on one leg.'
    },

    /* ───────── Core ───────── */
    {
      id: 'plank', name: 'Suspended Plank', cat: 'core', level: 2, len: 'MC', pos: 'down', hold: true,
      muscles: 'Abs, shoulders, glutes',
      setup: 'Lie face down with your feet in the cradles, toes down. Come up onto your forearms, elbows under your shoulders.',
      steps: ['Lift your hips so your body is straight from head to heels.', 'Hold, breathing steadily.'],
      cues: ['Squeeze your bum and pull your belly button in.', 'Don\'t let the hips sag or poke up.', 'Look at the floor just in front of your hands.'],
      easier: 'Rest your knees on the floor, or do a floor plank.', harder: 'Hold on your hands, or add a Body Saw.'
    },
    {
      id: 'knee-tuck', name: 'Knee Tuck', cat: 'core', level: 2, len: 'MC', pos: 'down',
      muscles: 'Abs, hip flexors, shoulders',
      setup: 'Feet in the cradles, face down, and push up into a high plank on your hands.',
      steps: ['Start in a straight-arm plank.', 'Pull both knees in under your chest, lifting the hips a little.', 'Push the legs back out to a straight plank.'],
      cues: ['Shoulders stay over the hands.', 'Move slowly: no swinging.'],
      easier: 'One knee at a time.', harder: 'Add a push-up between tucks (Atomic Push-up).'
    },
    {
      id: 'pike', name: 'Pike', cat: 'core', level: 3, len: 'MC', pos: 'down',
      muscles: 'Abs, shoulders',
      setup: 'Feet in the cradles, face down, in a high plank on your hands.',
      steps: ['Start in a straight-arm plank.', 'Keeping your legs straight, lift your hips up high into an upside-down "V".', 'Lower slowly back to the plank.'],
      cues: ['Push the floor away: shoulders over the hands.', 'Legs stay straight.'],
      easier: 'Do Knee Tucks instead.', harder: 'Add a push-up at the bottom.'
    },
    {
      id: 'mountain-climber', name: 'Mountain Climber', cat: 'core', level: 2, len: 'MC', pos: 'down',
      muscles: 'Abs, hip flexors, heart and lungs',
      setup: 'One foot in each cradle, face down, and push up into a high plank on your hands.',
      steps: ['Start in a straight-arm plank.', 'Drive one knee in towards your chest, then push it back.', 'Swap legs, steady to start and faster as you get the hang of it.'],
      cues: ['Hips stay level, low and still.', 'The straps will want to swing: stay in control.'],
      easier: 'Slow, one knee at a time with a pause.', harder: 'Faster, for longer.'
    },
    {
      id: 'body-saw', name: 'Body Saw', cat: 'core', level: 3, len: 'MC', pos: 'down',
      muscles: 'Deep abs, shoulders',
      setup: 'Feet in the cradles, face down, in a forearm plank.',
      steps: ['Start in a straight forearm plank.', 'Push your body back so your shoulders move behind your elbows.', 'Pull forward again to the start. Keep it small and slow.'],
      cues: ['The plank stays perfect: no sag as you move back.', 'Only go as far as you can control.'],
      easier: 'Just hold the plank.', harder: 'Move further back.'
    },
    {
      id: 'rollout', name: 'Standing Roll-out', cat: 'core', level: 2, len: 'FL', pos: 'away',
      muscles: 'Abs, shoulders, lats',
      setup: 'Face away from the anchor, holding the handles with straight arms down in front of your hips. Lean forward a little until the straps are tight.',
      steps: ['Start with straight arms in front of your hips.', 'Raise your straight arms overhead as your body falls forward into a long line.', 'Pull your arms back down to bring yourself back up.'],
      cues: ['Arms stay straight.', 'Belly tight: no arching in the lower back.'],
      easier: 'Stand more upright, smaller range.', harder: 'Walk your feet back towards the anchor.'
    },

    /* ───────── Arms ───────── */
    {
      id: 'biceps-curl', name: 'Biceps Curl', cat: 'arms', level: 1, len: 'FS', pos: 'toward',
      muscles: 'Biceps, upper back',
      setup: 'Face the anchor, palms up, arms straight out in front at shoulder height. Lean back until the straps are tight.',
      steps: ['Start leaning back, arms straight.', 'Bend only at the elbows, curling your hands towards your forehead.', 'Straighten your arms slowly.'],
      cues: ['Elbows stay up at shoulder height.', 'Body stays straight.'],
      easier: 'Stand more upright.', harder: 'Feet closer to the anchor.'
    },

    /* ───────── Full body and power ───────── */
    {
      id: 'squat-row', name: 'Squat to Row', cat: 'power', level: 2, len: 'FS', pos: 'toward',
      muscles: 'Legs, back, arms',
      setup: 'Face the anchor holding the handles, arms straight, a small lean back.',
      steps: ['Sit down into a squat with straight arms.', 'Stand up, and as you do, row your hands to your ribs.', 'Straighten your arms as you sit back down.'],
      cues: ['One smooth movement: legs, then arms.', 'Elbows finish by your sides.'],
      easier: 'A shallower squat.', harder: 'Add a jump at the top.'
    },
    {
      id: 'sprinter-start', name: 'Sprinter Start', cat: 'power', level: 2, len: 'FL', pos: 'away', sides: true,
      muscles: 'Legs, glutes, core, heart and lungs',
      setup: 'Face away, handles at your chest with the straps under your arms. Lean forward with one foot forward and the other back, like a runner on the blocks.',
      steps: ['Start leaning forward with the back leg straight.', 'Drive the back knee forward and up to hip height, rising onto the toes of the front foot.', 'Step the leg back down. Switch legs halfway.'],
      cues: ['Lean into the straps: they hold you up.', 'Explode up, step back with control.'],
      easier: 'Stand more upright, no rise onto the toes.', harder: 'Lean further, add a hop.'
    },
    {
      id: 'atomic-push-up', name: 'Atomic Push-up', cat: 'power', level: 3, len: 'MC', pos: 'down',
      muscles: 'Chest, arms, abs, everything',
      setup: 'Feet in the cradles, face down, in a high plank on your hands.',
      steps: ['Do one push-up.', 'At the top, pull both knees in to your chest (a knee tuck).', 'Push the legs back out. That\'s one rep.'],
      cues: ['Plank stays straight in the push-up.', 'Slow and controlled beats fast and wobbly.'],
      easier: 'Do the push-up on your knees, or just do Knee Tucks.', harder: 'Swap the knee tuck for a Pike.'
    },

    /* ───────── Warm-up and stretches ───────── */
    {
      id: 'overhead-squat', name: 'Overhead Squat', cat: 'stretch', level: 1, len: 'ML', pos: 'toward',
      muscles: 'Hips, ankles, shoulders, upper back (mobility)',
      setup: 'Face the anchor holding the handles with your arms up high.',
      steps: ['Stand tall, arms up.', 'Squat down as deep as is comfortable, keeping the arms up and chest tall.', 'Stand back up. Move slowly, this is a warm-up.'],
      cues: ['Let the straps take some of your weight.', 'Breathe out on the way down.'],
      easier: 'Arms forward instead of up.', harder: 'Pause at the bottom.'
    },
    {
      id: 'chest-stretch', name: 'Chest Stretch', cat: 'stretch', level: 1, len: 'FS', pos: 'away', hold: true,
      muscles: 'Chest, front shoulders',
      setup: 'Face away from the anchor holding the handles with your arms out wide and a little behind you. Step one foot forward.',
      steps: ['Let your body lean gently forward until you feel the stretch across your chest.', 'Breathe and hold.'],
      cues: ['Gentle: never force it.', 'Shoulders down away from your ears.'],
      easier: 'Lean less.', harder: 'Lean a little further forward.'
    },
    {
      id: 'lat-stretch', name: 'Lat Stretch', cat: 'stretch', level: 1, len: 'FS', pos: 'toward', hold: true,
      muscles: 'Lats, upper back, hips',
      setup: 'Face the anchor holding the handles, arms straight.',
      steps: ['Sit your hips back and down, reaching your arms long towards the anchor.', 'Let your chest drop between your arms. Breathe and hold.'],
      cues: ['Shift your hips to one side to stretch that side more.'],
      easier: 'Less deep.', harder: 'Sit deeper.'
    },
    {
      id: 'hip-flexor-stretch', name: 'Hip Flexor Stretch', cat: 'stretch', level: 1, len: 'MC', pos: 'away', hold: true, sides: true,
      muscles: 'Front of the hips and thighs',
      setup: 'Face away from the anchor with one foot in the cradles behind you, like the Suspended Lunge.',
      steps: ['Sink into a lunge and reach both arms up overhead.', 'Squeeze the bum of the back leg and hold. Switch legs halfway.'],
      cues: ['Stand tall: don\'t lean forward.', 'You should feel it at the front of the back hip.'],
      easier: 'A shallower lunge.', harder: 'Lean gently to the side, away from the back leg.'
    },
    {
      id: 'hamstring-stretch', name: 'Hamstring Stretch', cat: 'stretch', level: 1, len: 'MC', pos: 'toward', hold: true, sides: true,
      muscles: 'Hamstrings, calves',
      setup: 'Face the anchor and put one heel in the cradle in front of you, that leg straight.',
      steps: ['With a flat back, lean forward from your hips towards the raised foot.', 'Reach for your shin and hold. Switch legs halfway.'],
      cues: ['Flat back beats reaching further.', 'Standing knee soft.'],
      easier: 'Lower the cradle.', harder: 'Lean further forward.'
    }
  ],

  /* ───────── Ready-made workouts ───────── */
  WORKOUTS: [
    {
      id: 'first-steps', name: 'First Steps', emoji: '🌱', level: 1,
      about: 'A gentle full-body session to learn the basics. Two rounds, plenty of rest.',
      rounds: 2, work: 30, rest: 30, roundRest: 60,
      list: ['low-row', 'biceps-curl', 'squat', 'reverse-lunge', 'calf-raise', 'chest-press', 'hip-press']
    },
    {
      id: 'full-body-20', name: 'Full Body 20', emoji: '🔥', level: 2,
      about: 'The everyday workout: push, pull, legs and core. About 20 minutes.',
      rounds: 3, work: 40, rest: 20, roundRest: 60,
      list: ['low-row', 'squat-row', 'squat', 'reverse-lunge', 'chest-press', 'rollout', 'hamstring-curl']
    },
    {
      id: 'upper-body', name: 'Upper Body', emoji: '💪', level: 2,
      about: 'Back, chest, shoulders and arms, pull and push in turn.',
      rounds: 3, work: 40, rest: 20, roundRest: 60,
      list: ['low-row', 'y-fly', 't-fly', 'biceps-curl', 'chest-press', 'chest-fly', 'triceps-press']
    },
    {
      id: 'leg-day', name: 'Leg Day', emoji: '🦵', level: 2,
      about: 'Squats, lunges and hamstrings, finishing with glutes on the floor.',
      rounds: 3, work: 40, rest: 20, roundRest: 60,
      list: ['squat', 'reverse-lunge', 'jump-squat', 'calf-raise', 'suspended-lunge', 'hamstring-curl', 'hip-press']
    },
    {
      id: 'core-crusher', name: 'Core Crusher', emoji: '🧱', level: 2,
      about: 'All on the floor with your feet in the cradles, so no strap changes. Ends with a standing roll-out.',
      rounds: 3, work: 30, rest: 20, roundRest: 45,
      list: ['plank', 'knee-tuck', 'mountain-climber', 'pike', 'body-saw', 'rollout']
    },
    {
      id: 'quick-10', name: 'Quick 10', emoji: '⏱️', level: 1,
      about: 'Short on time? Four moves, no fuss, about 10 minutes.',
      rounds: 3, work: 40, rest: 15, roundRest: 30,
      list: ['low-row', 'squat', 'chest-press', 'hip-press']
    },
    {
      id: 'power-hiit', name: 'Power HIIT', emoji: '⚡', level: 3,
      about: 'Hard and fast intervals. Warm up first!',
      rounds: 4, work: 30, rest: 15, roundRest: 60,
      list: ['power-pull', 'squat-row', 'jump-squat', 'sprinter-start', 'atomic-push-up', 'mountain-climber']
    },
    {
      id: 'warm-up', name: 'Warm-up', emoji: '🌅', level: 1,
      about: 'Five minutes to get moving before any workout.',
      rounds: 1, work: 40, rest: 10, roundRest: 0,
      list: ['hip-hinge', 'low-row', 'overhead-squat', 'reverse-lunge', 'chest-press', 'rollout']
    },
    {
      id: 'stretch', name: 'Stretch & Unwind', emoji: '🧘', level: 1,
      about: 'Slow holds to finish a session or loosen up on a rest day.',
      rounds: 1, work: 45, rest: 10, roundRest: 0,
      list: ['lat-stretch', 'chest-stretch', 'hip-flexor-stretch', 'hamstring-stretch', 'overhead-squat']
    }
  ]
};
