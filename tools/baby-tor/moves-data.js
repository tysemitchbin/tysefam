/* ════════════════════════════════════════════════════════════════
   BABY MOVES: the guide's words, kept apart from the page code.

   Taken from Mitch's doc "Baby Acrobatics: A Parent's Blueprint for Motor
   Development, 5–18 Months" (31 Oct 2026). To change a word, change it here.
   **double stars** make text bold on the page. Nothing else is special.

   GUIDE.stages[i].exercises  →  each one is [title, how to do it]
   GUIDE.tracker[i].items     →  each one is [key, text]. The key is what saved
                                  ticks are stored under, so don't change a key
                                  once people have ticked it (the text is fine).
═════════════════════════════════════════════════════════════════ */
window.GUIDE = {

  intro: [
    'Ten to fifteen minutes of focused floor play a day, split into two or three short bursts, is enough at this age. The larger effect comes from how the day is set up: time on the floor, room to move, and fewer hours in seats and carriers.',
    '“Acrobatics” here means controlled, progressive movement play on or near the floor: rolling, tilting, weight-shifting, climbing, balancing. It does **not** mean tossing a baby in the air, spinning them, or lifting them by the limbs. Those practices circulate widely online and carry real injury risk; the Safety tab sets the hard limits.',
    'Age bands are approximate by design. Healthy babies walk anywhere between about 9 and 17 months, and the order of skills varies too. For a baby born preterm, use **corrected age** (age from the due date) until around 2 years.'
  ],
  disclaimer: 'General guidance based on standard pediatric developmental principles. It is not medical advice and does not replace your pediatrician, physiotherapist or helsestasjon nurse. Anything in the red-flag list, or anything that simply worries you, goes to them.',

  /* ───────── Safety ───────── */
  never: [
    ['Never shake, jolt or bounce a baby’s head.', 'Rapid head movement can cause bleeding and brain injury. This includes “playful” vigorous shaking and any game where the head whips or lags.'],
    ['Never throw a baby into the air and catch them.', 'There is no safe version, including a small toss.'],
    ['Never lift, swing or suspend a baby by the hands, wrists, forearms, ankles or feet.', 'Pulling on an arm can dislocate the elbow (nursemaid’s elbow); hanging by the legs loads the hips and spine. Lift under the trunk and ribcage, or scoop the whole body.'],
    ['Never spin a baby, or hold them upside down.', 'Brief, slow tilting with full trunk support is covered in the movement-play clinic; inversion and spinning are not.'],
    ['Never force a position or stretch.', 'If the baby cannot get into or out of a position themselves, and cannot hold it comfortably, they are not ready for it. Stretching a tight neck or hip is done only on instruction from a physiotherapist.'],
    ['Never push through resistance, pain or crying.', 'Arching, stiffening, twisting away and crying are a stop signal, not a hurdle.']
  ],
  space: [
    'Firm, flat floor with a thin mat or rug. Thick soft foam, beds and sofas make balance work harder and falls less predictable.',
    'Anchor bookcases, drawers and the TV to the wall before pulling-to-stand begins, usually around 7 months.',
    'Gate the top and bottom of stairs; supervise all stair practice from below and behind.',
    'Clear the floor zone of anything that fits through a toilet-roll tube, plus cords, blind loops, plastic bags and hot drinks.',
    'Pad the corners of low tables used for cruising, and check they do not tip when leaned on.',
    'Bare feet indoors. Socks on hard floors remove the grip the baby needs.'
  ],
  session: [
    'Stay within arm’s reach. Never step away from a baby on any raised surface, even for a moment.',
    'Wait 20–30 minutes after a feed for anything involving the tummy, tilting or pressure on the belly.',
    'Keep sessions short and stop on the first signs of “enough”: turning the head away, going floppy or stiff, fussing, yawning, hiccups, glazed staring, or sudden stillness.',
    'Work on both sides equally. Alternate which side you set toys on, which arm you carry on, and which direction you encourage rolling.',
    'One adult, both hands free, no phone in hand.'
  ],
  afterFall: 'Minor tumbles are part of learning to move and are expected. **Seek medical care the same day** for a fall from a height above the baby’s own standing height, a fall onto a hard edge, or any head knock followed by vomiting, unusual drowsiness, a bulging soft spot, a seizure, or inconsolable crying that will not settle.',

  /* ───────── The nine principles ───────── */
  principles: [
    ['The floor is the gym.', 'Unrestricted time on a firm floor is the single biggest driver of motor progress. Babies who get more floor time roll, crawl and walk with better quality of movement, because every position change there is a repetition they chose.'],
    ['Containers cost movement hours.', 'Car seats, bouncers, swings, slings and high chairs each hold the trunk still. Use them for transport, safety and meals, and keep the total low. A rough working target is no more than an hour at a stretch and not much over two to three hours a day in total, excluding sleep.'],
    ['Stability comes before mobility.', 'A baby needs a stable trunk before the limbs can move freely. That is why tummy time, side-lying and sitting balance keep appearing long after they look “mastered”: they are the base that crawling and walking are built on.'],
    ['Motivate, don’t manipulate.', 'Move the toy, not the baby. A reach that the baby initiates teaches the nervous system something; a limb you move for them does not. Your hands are there for support and safety, not to perform the movement.'],
    ['Place only in positions they can already get into.', 'Propping a baby who cannot yet sit, or standing one who cannot yet pull up, teaches a posture without the strength underneath it. Put them in positions they can achieve, enter and leave on their own.'],
    ['Let them struggle.', 'Count to ten before you help. The effort of almost-getting-there is the training stimulus. Step in before frustration turns into distress, and then help the least amount that unsticks them.'],
    ['Vary everything.', 'Different positions, different surfaces, different directions, both sides. Set the toy to the left as often as to the right, carry on alternating hips, and let them meet grass, wooden floor, a slope and a cushion. Variety builds adaptable movement; repetition of one pattern builds one pattern.'],
    ['Barefoot, and lightly dressed.', 'Bare feet give grip and sensory feedback that shoes block. Bulky clothing and heavy nappies limit hip and trunk movement. Indoors, shoes have no developmental benefit at all before walking outdoors begins.'],
    ['Keep it play.', 'Short, frequent, cheerful sessions beat long ones. If either of you is frustrated, the session is over. Faces, voices, mirrors and the family dog are better motivators than any toy.']
  ],
  quietRule: 'Your job is to arrange the environment and then get out of the way.',

  /* ───────── Skill windows (the "At a glance" chart), in months ───────── */
  windows: [
    ['Floor and tummy play', 5, 18, 1],
    ['Rolling both ways', 5, 8, 1],
    ['Sitting unsupported', 5, 9, 1],
    ['Hands and knees', 6, 10, 2],
    ['Crawling or shuffling', 7, 11, 2],
    ['Pulling to stand', 7, 11, 2],
    ['Cruising at furniture', 9, 13, 3],
    ['First steps', 9, 17, 3],
    ['Confident walking', 12, 18, 4],
    ['Running and climbing', 15, 18, 5]
  ],

  /* ───────── The five stages ───────── */
  stages: [
    {
      n: 1, emoji: '🐢', months: '5–7', from: 5, title: 'The base',
      lead: 'The work of this stage is a strong trunk, rolling in both directions, and sitting without hands. Everything later depends on it, so do not rush past it.',
      developing: 'Neck and back extension, rolling both ways, weight-shifting onto one arm in tummy position, sitting balance with protective arm reactions, hands meeting at the midline, feet discovered and brought to the mouth.',
      exercises: [
        ['Tummy time, built up in bouts', 'Aim to accumulate roughly an hour a day by 6 months, in bouts of a few minutes. Put yourself on the floor at the baby’s eye level, or lie on your back with the baby on your chest. A mirror or a sibling’s face will buy you another minute every time.'],
        ['Arc reaching', 'With the baby on their tummy, hold a toy just beyond arm’s reach, then slowly arc it to one side at shoulder height. The baby shifts weight onto one forearm to follow it. This weight shift is the single most important precursor to crawling. Four or five passes each side.'],
        ['Rolling, back to tummy', 'Lay the baby on their back and hold a toy above and behind one shoulder. If they stall halfway, bend the opposite knee and guide it gently across the body to start the rotation, then let them finish it. Both directions, every day.'],
        ['Rolling, tummy to back', 'Place the toy out to the side, past where they can turn their head. Let the roll happen on its own; do not push the shoulder over.'],
        ['Side-lying play', 'Lay the baby on one side with a rolled towel behind the back and their knees softly bent. Hold toys in front at chest height so both hands meet to grasp. Two or three minutes a side. This is the easiest position for building two-handed midline play.'],
        ['Feet to hands', 'On their back, touch their feet together, bring their hands to their knees, or put a rattling sock on one foot. Curling up to reach their own feet is core strength the baby does willingly.'],
        ['Sit-and-tilt', 'Sit the baby on the floor facing away from you, with your hands supporting at the hips, never under the armpits. Tilt them a few centimetres to one side and pause. They will put a hand down to catch themselves. Those protective reactions are what make independent sitting safe.'],
        ['Tripod to free sitting', 'Once they can sit leaning on both hands, place a toy just high enough that they lift one hand to take it, then both. Sit behind them, close, with cushions to the sides but not propping them upright.'],
        ['Pull-to-sit', 'On their back, offer your two index fingers to grip and pull them slowly up to sitting. By 5 months the head should come up with the body rather than lagging behind. Use it as a weekly check as much as an exercise.']
      ],
      setup: 'A two-metre clear floor zone, a thin firm mat, a low mirror, and three or four toys placed in an arc rather than directly in front. Retire the baby seat and the sit-me-up ring from daytime use.',
      progress: 'Rolls both directions, sits unsupported for a minute or more, props up on straight arms in tummy position, and pivots in a circle on their tummy to get to a toy.'
    },
    {
      n: 2, emoji: '🐛', months: '7–9', from: 7, title: 'Transitions and crawling',
      lead: 'This stage is about getting from one position to another without help. A baby who can move between lying, sitting and all fours will find their own way to crawling.',
      developing: 'Sitting to hands-and-knees and back, rocking and crawling, hands bearing weight with open palms, kneeling, pulling up to stand, and the first understanding that they can choose where to go.',
      exercises: [
        ['The sideways toy', 'With the baby sitting, place a favourite toy on the floor to one side and slightly behind, just out of reach. Reaching for it rotates the trunk and drops them onto a hand and hip, which is the doorway to all fours. Alternate sides.'],
        ['Belly bridge', 'If they can get onto hands and knees but collapse, slide a flat hand or a rolled towel under the belly as a light hammock. Support about a fifth of their weight, no more, and remove it as soon as they hold the position.'],
        ['Rocking games', 'When they are up on all fours, sing or bounce lightly in rhythm in front of them. Rocking forwards and back loads the shoulders and hips and usually precedes crawling by a week or two.'],
        ['Crawl over an obstacle', 'Lie on the floor and let them climb over your leg, or use a firm cushion or rolled duvet. Having to lift one limb at a time breaks a flat belly-drag into a proper alternating pattern.'],
        ['Downhill crawl', 'A sofa cushion laid as a gentle slope, crawling down it, makes the first forward reps easier. Never set the slope on a slippery floor.'],
        ['Chase and tunnels', 'Crawl beside them, play peekaboo through a cardboard box or play tunnel, and put the destination toy two metres away rather than one.'],
        ['Kneeling at the sofa', 'Sit them facing a sofa seat or low table with toys on top, so they come up to tall kneeling. Kneeling builds the hip strength that standing needs, and most people skip it.'],
        ['Pull to stand, at their invitation', 'Set toys on a stable surface at chest height when they kneel. Let them pull themselves up; do not lift them. Check the furniture does not slide or tip first.'],
        ['Teaching the way down', 'Most babies learn to stand up a fortnight before they learn to sit back down, then get stuck and cry. Kneel beside them, put a hand on the back of one knee and bend it gently so they lower onto their bottom. A few reps a day solves it.'],
        ['Mixed surfaces', 'Let them crawl on wood, carpet, grass and a yoga mat in the same week. Different friction and texture sharpen balance and build tolerance for new sensations.']
      ],
      setup: 'Furniture anchored to the wall, a stable low table with padded corners, a clear two-to-three-metre crawling run, and the floor cleared of small objects: anything that passes through a toilet-roll tube is a choking hazard.',
      progress: 'Gets in and out of sitting without help, moves across the room somehow (crawling, commando-crawling or bottom-shuffling all count), pulls to standing at furniture, and bears weight through open hands rather than fists.'
    },
    {
      n: 3, emoji: '🦒', months: '9–12', from: 9, title: 'Upright and cruising',
      lead: 'The goal here is standing balance, not steps. Steps arrive on their own once the baby can stand, squat and shift weight from one leg to the other.',
      developing: 'Cruising sideways along furniture, standing alone for a few seconds, squatting down and coming back up, climbing, and the first independent steps somewhere around the end of this window or well after it.',
      exercises: [
        ['Build a cruising circuit', 'Arrange the sofa, a coffee table and a sturdy box into a loop with small gaps. Put a different toy at each station. Widen the gaps by a few centimetres every week until the baby has to reach across open space to get from one to the next.'],
        ['Round the corner', 'Place a toy just around the end of the sofa, out of sight. Turning a corner while cruising forces the baby to rotate and shift weight fully onto the outside leg.'],
        ['Squat pick-ups', 'While they are standing at a surface, drop a toy by their feet. Squatting down to collect it and standing back up is the strongest leg exercise available at this age, and it happens dozens of times a day if you let it.'],
        ['Hands-busy standing', 'Stick toys to the window or the side of the bath, or put a shallow tray of water or dry pasta on a low table. Playing with both hands while standing forces the legs and trunk to do the balancing.'],
        ['Let go and count', 'When they are standing holding your fingers, let go and count out loud. One second this week, three the next. Make the release a game rather than a test, and keep a cushion behind them.'],
        ['Climbing, on purpose', 'A firm cushion pile, a low step, or two stairs. Climbing up teaches strength and planning; always practise coming down feet-first and backwards, and always stand below them.'],
        ['Half-kneel to stand', 'Set the toy on a surface so they must bring one foot up flat, into a half-kneel, then push up. This is the exact pattern used to stand up from the floor without furniture.'],
        ['Push, don’t ride', 'A weighted toy pram, or a sturdy laundry basket with books in it, that moves slowly when pushed. The resistance is the point. A wheeled baby walker that the child sits in is a different device and is not recommended at all (see Kit & day).'],
        ['One hand, held low', 'If you walk with them, hold one hand at their own shoulder height or lower, or support at the trunk. Two hands held up above their head tips them forward, teaches an unnatural gait, and strains the shoulders.'],
        ['Terrain practice', 'Cruise and crawl on grass, sand, gravel and a slope. Uneven ground recruits ankle and foot muscles that a flat floor never asks for.']
      ],
      setup: 'Everything climbable checked for tipping, stair gates fitted, a soft landing zone behind the main standing spot, and bare feet whenever indoors.',
      progress: 'Pulls to stand easily, cruises along furniture in both directions, squats to collect a toy and stands back up, stands alone for a few seconds, and may or may not have taken first steps. Not walking at 12 months is entirely normal.'
    },
    {
      n: 4, emoji: '🐧', months: '12–15', from: 12, title: 'Making walking useful',
      lead: 'Early walking is wide-legged, arms up, short-stepped and frequently abandoned for crawling. That is normal. This stage turns a wobbly new skill into transport the child can trust.',
      developing: 'Longer walking bouts, standing up from the floor in the middle of the room, stopping and turning, carrying things while walking, stairs with help, and the first throws and kicks.',
      exercises: [
        ['Distance, built gradually', 'Walk from one parent to the other and step back half a metre each round. Outdoors, let them walk the last stretch to the door rather than carrying them.'],
        ['Free stand-ups', 'Put toys in the middle of an empty floor so there is nothing to pull up on. Standing from a squat with no support is a different skill from pulling up, and it needs its own practice.'],
        ['Carry a load', 'Hand them one object to walk with, then two, then something bulky like a cushion or a light ball that partly blocks the view. Each one changes the balance problem.'],
        ['Stop, start, turn', 'Music on, music off. Chase games with direction changes. Walking backwards a few steps to a toy held behind them. Turning while walking is harder than walking straight and improves fastest with games.'],
        ['Step over', 'Lay a broom handle, a rope or a line of tape on the floor and walk over it together. Raise it to ankle height on two books once that is easy.'],
        ['Stairs, properly taught', 'Up on hands and knees first, then upright with one hand on the rail and your hand on their trunk. Down is always backwards on hands and knees until well past this stage. Stand below them, every time.'],
        ['Ramps and kerbs', 'A sloped driveway, a low kerb or a garden path teaches the ankle to adapt. Hold a hand low the first few times.'],
        ['Push and pull heavy things', 'A pull-along toy, a toy pram loaded with books, a dustpan and brush. Resistance work builds the trunk strength that a smoother gait depends on.'],
        ['First ball skills', 'Roll a ball back and forth sitting, then throw underhand while standing. Kicking usually begins as walking into a stationary ball. That counts, and it is worth cheering.'],
        ['Climb on and off', 'A low sofa, a small step stool, a sturdy box. Teach the climb-down: turn around, feet first, slide down on the belly.']
      ],
      setup: 'Keep socks off indoors; use flexible, thin-soled shoes with a wide toe box outdoors only, sized with a thumb’s width of room. A clear circuit between rooms is more useful now than a single play zone.',
      progress: 'Walks confidently alone, stands up from the floor without holding anything, squats to pick things up, climbs onto low furniture, and manages stairs with a hand held.'
    },
    {
      n: 5, emoji: '🐒', months: '15–18', from: 15, title: 'Speed, climbing and ball skills',
      lead: 'Now the work is variety and challenge rather than new basic skills. A toddler who walks well needs harder problems: uneven ground, loads, speed, height and direction changes.',
      developing: 'Stiff-legged running, climbing with intent, walking up stairs with a hand held, throwing and kicking, squatting deeply to play and rising without hands, and the preparation for jumping.',
      exercises: [
        ['A five-station obstacle course', 'Crawl under a chair, step over a cushion, walk along a tape line, climb onto a low step and jump down holding your hands, then push a loaded box back to the start. Rearrange it weekly. This is the single most efficient activity at this age.'],
        ['Line walking', 'A strip of tape on the floor, then a kerb or a plank laid flat on grass, with one hand held. Heel-to-toe comes much later; just staying on the line is the goal.'],
        ['Running games', 'Chase, running to a target, running and stopping on a word. Early running is flat-footed and stiff, with little flight time, and smooths out over the following year.'],
        ['Jump preparation', 'Squat-and-bounce games, bouncing on a mattress holding both your hands, and stepping down from a low step with hands held, aiming to land on two feet. Most children land their first true two-foot jump nearer 2 years. Trampolines are not appropriate at this age.'],
        ['Kick and throw', 'Walk into a stationary ball to kick it, then try a standing kick. Throw a small ball overhand at a big target, and catch a large light ball against the chest.'],
        ['Animal walks', 'Stomping like an elephant, walking on tiptoes, big slow bear steps, walking backwards and sideways along a line. Silly works better than instruction.'],
        ['Carry and deliver', 'Give them a real job: carry a small bag of potatoes to the kitchen, push a loaded toy wheelbarrow, bring a book to another room. Carrying weight while walking is excellent trunk training.'],
        ['Playground climbing', 'Low ladders, steps and small slides, with you spotting rather than lifting. Let them find their own route up; intervene only for safety.'],
        ['Stairs with a rail', 'Both feet onto each step, one hand on the rail, your hand ready at their back. Alternating feet is a skill for around age 3.'],
        ['Scoot and ride', 'A low ride-on toy pushed along with the feet, or a small balance bike with the saddle low enough that both feet sit flat. Helmet on from the first session.']
      ],
      setup: 'Outdoor time most days, varied ground under the feet, flexible thin-soled shoes outdoors, and a tolerance for small falls onto safe surfaces.',
      progress: 'Walks fast or runs, squats to play and rises without using hands, climbs onto furniture, walks up stairs with help, throws a ball, and carries objects while walking.'
    }
  ],

  /* ───────── Crawling clinic ───────── */
  crawling: {
    lead: [
      'Crawling is valuable, but it is not a required stage. Plenty of healthy children shuffle, roll or simply stand up and walk, and the evidence that skipping crawling causes later problems is weak. What matters is that the baby finds some way to move themselves across the room, and gets plenty of time bearing weight through open hands.',
      'What crawling does give you is hard to get elsewhere: shoulder and hand strength that later feeds handwriting, arch development in the palms, coordinated use of both sides of the body, and the chance to judge distance while moving.'
    ],
    // [pattern, what it looks like, what to do, tone: ok | watch | check]
    patterns: [
      ['Reciprocal crawl', 'Opposite hand and knee move together, belly off the floor', 'Nothing. This is the classic pattern.', 'ok'],
      ['Commando crawl', 'Pulls forward on forearms with the belly down', 'Fine as transport. Add obstacle and slope work to encourage lifting onto hands and knees.', 'ok'],
      ['Backwards first', 'Pushes away from the toy and gets frustrated', 'Normal for a week or two. Arms are stronger than legs at first. Place toys to the side rather than straight ahead.', 'ok'],
      ['Bottom shuffle', 'Sits and scoots on the bottom, often skipping crawling', 'Common and often runs in families. These children tend to walk a little later. Add tummy and all-fours play, and mention it at the next check-up.', 'watch'],
      ['Bear crawl', 'On hands and feet with straight legs', 'Fine, usually a phase. Strong and efficient.', 'ok'],
      ['One-sided crawl', 'Always drags the same leg, or only ever pushes with one arm', 'Worth getting checked. Consistent asymmetry is the one pattern that should not be left alone.', 'check']
    ],
    notStarted: [
      'Audit container time first. Three hours a day in a seat, a bouncer and a carrier is three hours not spent on the floor.',
      'Put them on their tummy on the floor, not on a bed or a sofa. Soft surfaces absorb the push.',
      'Check the clothing. Long trousers on a slippery wooden floor, or a thick snowsuit indoors, stops most beginners.',
      'Use a gentle slope so gravity helps the first forward reps.',
      'Place the target two metres away and go there yourself. Babies follow people more reliably than toys.',
      'Put your palm flat against the soles of their feet while they lie on their tummy. Many babies push off a firm surface and discover propulsion that way.',
      'Build tummy tolerance if that is the blocker: start chest-to-chest on your reclined body, then across your lap, then on the floor, adding half a minute at a time.'
    ],
    escalate: 'If a baby cannot get themselves from A to B by any means at all by 9 to 10 months, raise it with your health professional rather than waiting.'
  },

  /* ───────── Walking clinic ───────── */
  walking: {
    lead: 'First steps fall anywhere between about 9 and 17 months, and walking late within that range says nothing about later coordination or ability. You cannot usefully make walking happen earlier; you can make it happen well.',
    readiness: ['Pulls to stand', 'Cruises along furniture', 'Lowers to the floor under control', 'Stands alone for a few seconds', 'Lets go of the furniture to reach for something', 'Squats and recovers'],
    help: [
      'Hold one hand low, at the child’s own shoulder height or below, or support at the trunk. Two hands held up overhead changes the whole posture and teaches a gait they then have to unlearn. It also puts the elbows and shoulders at risk.',
      'Keep the floor time. Crawling does not stop when walking starts, and should not be discouraged.',
      'Carry less. Walking the last 50 metres is better practice than any exercise in this guide.',
      'Let them fall. New walkers fall many times an hour, and learning to fall and get up is part of the skill. Your job is the surface, not the catch.',
      'Cheer the attempt rather than the result, and resist propping them up every time they land on their bottom.'
    ],
    footwear: 'Barefoot indoors is best for grip, balance and foot muscle development. Outdoors, choose shoes that are flexible enough to bend easily at the toes, thin-soled, light, wide at the toe, and fastened so they stay on. Stiff “supportive” ankle boots are not needed for typically developing feet. Check the fit every six to eight weeks; there should be about a thumb’s width beyond the longest toe.',
    looksWrong: [
      'A wide stance, arms held up and out, short quick steps, and frequent sitting down. All normal for the first months of walking.',
      'Flat-looking feet. The arch is hidden by a fat pad and develops gradually up to around school age.',
      'Slightly bowed legs up to about 2 years, and knock knees after that.',
      'Occasional toe walking in the first months of walking, as long as the child can also put their heels down and walk flat.',
      'W-sitting now and then. Encourage variety by handing toys to the side, but it is not an emergency.'
    ],
    late: 'At 15 months, with cruising and standing in place, keep going as normal: this is still within the typical range. Check that container time is low, nappies and clothing are not bulky, and that there is daily barefoot floor and standing practice. Confidence often stalls after a fall or an illness; a week of low-key practice usually restores it. **If there are no independent steps at all by 18 months, or the child cannot pull to stand by 12 months, ask for a referral to a pediatric physiotherapist** rather than waiting longer.'
  },

  /* ───────── Movement-play clinic ───────── */
  play: {
    lead: 'Babies need movement through space: tilting, rocking, rolling, being carried at different angles. That input trains the balance organs of the inner ear and the postural reactions that catch a fall. The useful version is slow, supported and gradual, and it looks nothing like the airborne baby-gymnastics videos that circulate online.',
    rules: [
      'The baby’s head and trunk move as one unit, supported by your hands or your body. No part of the body is ever the handle.',
      'Slow and predictable first, livelier only after they have shown they enjoy the slow version. New games start at a quarter of the speed you think is fine.',
      'Both feet of the adult on the ground, over a soft surface, with nothing to hit within a metre.',
      'The baby’s face is the control panel. Bright eyes and reaching means go on; a frozen stare, a turned-away head, stiffening or crying means stop immediately, and that game is over for today.'
    ],
    // [game, from about (months), how to do it, extra condition shown with the age]
    menu: [
      ['Lap rocking', 5, 'Baby seated or lying across your lap; rock slowly forwards and back, then side to side. Changing plane matters more than speed.'],
      ['Shin aeroplane', 5, 'Lie on your back, knees bent, shins horizontal. Lay the baby chest-down on your shins, hold their trunk with both hands throughout, and tip slowly. Never let go, never bounce.'],
      ['Log rolling', 5, 'On a mat, guide a slow roll from back to tummy to back along the floor. Start it, let them finish it.'],
      ['Slow lifts', 6, 'Supported under the ribs and trunk, lift and lower in a straight vertical line, slowly. No tossing at the top.'],
      ['Exercise ball tilts', 7, 'Baby sitting or lying on a large ball, your hands firmly on their hips, rolling the ball a few centimetres in each direction. Excellent balance training; keep the movement small.'],
      ['Lap horse rides', 8, 'Seated, holding their trunk, bounce gently on your knee with a rhythm and a song.'],
      ['Dancing', 8, 'Held against your chest with one hand behind the head and shoulders, slow turns, no spinning.'],
      ['Soft slope rolls', 9, 'Rolling down a cushioned slope or a grassy bank with your hand guiding the pace.'],
      ['Playground bucket swing', 10, 'The enclosed bucket type only, low amplitude, facing you, short sessions.', 'once sitting is solid'],
      ['Slides', 14, 'The child goes alone, with you at the bottom. **Never go down a slide holding a child on your lap**: a foot catching the side is a common cause of leg fractures in toddlers.']
    ],
    offMenu: 'Throwing and catching in the air, any swing held by the hands or ankles, spinning the child round, hanging them upside down, forward rolls or somersaults, trampolines, and any game where the head is free to whip. Forward rolls load the neck and are not appropriate until well into the preschool years, taught by someone who coaches them.'
  },

  /* ───────── Equipment: [item, verdict, why] ───────── */
  equipmentLead: 'Almost nothing on this list is necessary. A clear floor, a few household objects and an adult willing to lie down beat any product. The one genuinely important entry is the last one.',
  equipment: [
    ['Firm thin floor mat', 'Use', 'Defines the play zone and makes hard floors comfortable without absorbing the push.'],
    ['Low mirror', 'Use', 'The best tummy-time motivator there is.'],
    ['Large exercise ball', 'Use', 'Balance, tilting and sitting work, with your hands on their hips.'],
    ['Weighted push cart or loaded laundry basket', 'Use', 'Resistance makes it move slowly, which is what a new walker needs.'],
    ['Play tunnel or cardboard boxes', 'Use', 'Crawling motivation and spatial problem-solving.'],
    ['Balls of several sizes', 'Use', 'Rolling, throwing, kicking, chasing, from 6 months onwards.'],
    ['Low stable step or sturdy box', 'Use', 'Climbing up and backing down, from around 10 months.'],
    ['Baby carrier or sling', 'Limit', 'Good for transport and closeness, with the hips supported knee-to-knee. Every hour carried is an hour not spent moving on the floor.'],
    ['Bouncer, rocker, swing chair', 'Limit', 'Fine for short safe parking. Keep each stint under an hour and the daily total low.'],
    ['Activity centre or stationary saucer', 'Limit', 'Holds the trunk upright before it is ready and encourages pushing onto the toes. 15 to 20 minutes a day at most.'],
    ['Floor seat with a moulded leg opening', 'Limit', 'Props a baby into a posture they cannot achieve or leave alone. Short use only, never on a raised surface.'],
    ['Door-frame jumper', 'Limit or skip', 'Bouncing on the toes against a bungee cord trains a pattern you do not want, and the injury reports are not trivial.'],
    ['Walking harness, reins held overhead, “walking wings”', 'Skip', 'Holding a child up from above produces a forward-leaning, toe-first gait.'],
    ['Stiff supportive shoes indoors', 'Skip', 'Bare feet develop foot muscles and balance better than any shoe.'],
    ['Wheeled baby walker (the kind a baby sits inside)', 'Skip entirely', 'Associated with thousands of injuries a year, mostly from falling down stairs; banned from sale in Canada. It also delays rather than helps independent walking, because the child’s weight is taken by the frame.']
  ],

  /* ───────── Daily and weekly rhythm ───────── */
  rhythmLead: 'Do not schedule a workout. Attach short bursts of movement to things that already happen every day, and the total takes care of itself.',
  anchors: [
    'Every nappy change ends with two or three minutes on the floor before they get dressed.',
    'The first ten minutes after each nap, while they are freshest.',
    'Before the bath, undressed, on a towel: the best tummy time of the day for many babies.',
    'The last stretch home from the car, the shop or the nursery, walked rather than carried, once they walk.'
  ],
  // [when, what, minutes]
  day: [
    ['Morning, after the first nap', 'The main session: current stage exercises, two or three of them', '10'],
    ['Mid-morning', 'Free floor play while you get on with something nearby', '20–40'],
    ['After lunch', 'Outdoors: different terrain, carrying, cruising or walking', '15–30'],
    ['Afternoon', 'A movement game from the safe menu, or an obstacle course', '5–10'],
    ['Before the bath', 'Tummy and rolling play, undressed', '5'],
    ['Throughout', 'Short bursts after nappy changes', '3 × 2']
  ],
  dayNote: 'That is roughly 15 to 25 minutes of focused work and an hour or more of free movement, which is plenty. Half of it on a bad day is still fine.',
  week: [
    'Outdoors most days, whatever the weather, with time on ground that is not flat.',
    'Rebuild the obstacle course or rearrange the cruising circuit once a week so the problem stays new.',
    'Deliberately alternate sides: which hip you carry on, which side toys are placed, which direction you encourage rolling or turning.',
    'One session a week where you do nothing but watch for five minutes. It is the fastest way to notice what has changed and what to work on next.'
  ],
  skip: 'Illness, teething, a bad night, or a week where they are busy learning to talk instead. Motor progress is not linear, and plateaus of a few weeks are normal, including small regressions during growth spurts or after an illness.',

  /* ───────── Progress tracker ───────── */
  trackerLead: 'These are the motor skills most babies have by the age given, not a pass mark. Missing one or two is common; the red-flag list is the one that matters.',
  tracker: [
    { by: 6, items: [
      ['m6-roll', 'Rolls from tummy to back and back to tummy'],
      ['m6-push', 'Pushes up on straight or nearly straight arms when on the tummy'],
      ['m6-head', 'Holds the head steady and level when pulled to sitting'],
      ['m6-prop', 'Sits with hands propped in front'],
      ['m6-hands', 'Brings both hands together and to the mouth']
    ]},
    { by: 9, items: [
      ['m9-sit', 'Sits without support for several minutes'],
      ['m9-transit', 'Gets into sitting from lying, or out of it, without help'],
      ['m9-move', 'Moves across the floor somehow: crawling, commando-crawling, rolling or shuffling'],
      ['m9-palms', 'Takes weight through open hands on all fours'],
      ['m9-pass', 'Passes a toy from one hand to the other']
    ]},
    { by: 12, items: [
      ['m12-pull', 'Pulls to standing at furniture'],
      ['m12-lower', 'Lowers from standing to sitting under control'],
      ['m12-cruise', 'Cruises sideways along furniture'],
      ['m12-stand', 'Stands alone for a few seconds'],
      ['m12-both', 'Uses both hands equally well']
    ]},
    { by: 15, items: [
      ['m15-walk', 'Walks independently'],
      ['m15-up', 'Stands up from the floor without holding anything'],
      ['m15-squat', 'Squats to pick up a toy and stands back up'],
      ['m15-climb', 'Climbs onto a low sofa or step'],
      ['m15-ball', 'Rolls or throws a ball']
    ]},
    { by: 18, items: [
      ['m18-run', 'Walks fast or runs stiffly'],
      ['m18-stairs', 'Walks up stairs with a hand held'],
      ['m18-carry', 'Carries an object while walking'],
      ['m18-kick', 'Kicks or walks into a ball on purpose'],
      ['m18-chair', 'Seats themselves in a small chair']
    ]}
  ],
  trackerNote: 'The date a skill first appeared, whether it looks the same on both sides, and a short video once a month. A thirty-second clip from the floor is far more useful to a physiotherapist than any description you can write, and it makes slow progress visible when it does not feel like progress.',

  /* Which tracker ticks unlock which stage (used to suggest a stage).
     Stage 2 once they roll and sit alone, stage 3 once they get around and pull up, and so on. */
  stageGates: [
    { stage: 2, need: ['m6-roll', 'm9-sit'] },
    { stage: 3, need: ['m9-move', 'm12-pull'] },
    { stage: 4, need: ['m15-walk'] },
    { stage: 5, need: ['m15-walk', 'm15-up'] }
  ],

  /* ───────── Red flags ───────── */
  redLead: 'Most delays in this guide’s range turn out to be normal variation. These are the ones not to sit on. Asking early costs an appointment; waiting can cost months of easy intervention.',
  anyAge: [
    ['Loss of a skill the child previously had.', 'Regression is always worth same-week attention.'],
    ['Consistent asymmetry:', 'one arm or leg moves less, one side is always dragged, the head always turns the same way, or a clear hand preference before 18 months. Strong handedness this early is not precocity.'],
    ['Persistent stiffness:', 'legs that cross or scissor, strong arching, hands held fisted most of the time after 6 months.'],
    ['Persistent floppiness:', 'slipping through your hands when lifted, or a body that feels heavy and limp.'],
    ['Toe walking the child cannot come out of,', 'or heels that will not reach the floor.'],
    ['Your own sustained instinct that something is off,', 'even when you cannot name it. Parental concern is a well-validated screening signal in its own right.']
  ],
  byAge: [
    [6, 'No rolling in either direction, head still lags when pulled to sitting, cannot push up on forearms during tummy time, or will not tolerate the tummy position at all.'],
    [9, 'Cannot sit without support, has no way of moving across the floor, or will not take any weight on the legs when held standing.'],
    [12, 'Does not pull to stand, cannot get into or out of sitting, or does not move around independently by any means.'],
    [15, 'Does not stand alone, or has made no progress towards walking in the previous three months.'],
    [18, 'Not walking independently, still toe walking constantly, or falling far more than other children of the same age.']
  ],
  alsoFlag: 'Alongside motor skills, flag any worry about hearing or vision, no response to their own name, no babbling, or little interest in interacting. Motor and communication development inform each other, and the same appointment covers both.',
  whoToContact: 'Your health visitor or helsestasjon nurse at the scheduled check, or an appointment in between: you do not have to wait for the next one. Your GP or pediatrician can refer to a pediatric physiotherapist, which is the specialist for everything in this guide. For a baby born preterm, use corrected age for all of the above until around 2 years.',
  closing: 'The ordinary version of this works. Floor time, a bit of space, varied play and an adult who gets down there too will carry almost every healthy baby through 5 to 18 months on their own timeline.'
};
