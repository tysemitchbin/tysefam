/* ════════════════════════════════════════════════════════════════
   BABY TOR → FOOD tab: the words and the food list.

   Built from Mitch's doc "What Foods to Introduce, and When (6–24 months)"
   (31 Oct 2026). Norwegian advice (Helsedirektoratet's brochure "Mat og
   måltider for spedbarn", Mattilsynet, VKM) comes first; the NHS (UK) and
   AAP (US) are only mentioned where they add something.
   To change a word, change it here. **double stars** make text bold.

   IMPORTANT: food ids (the first thing on each F(...) line) and allergen ids
   are what saved meals and plans are stored under. Don't rename an id once
   it has been used; the name, emoji and words are fine to change.
═════════════════════════════════════════════════════════════════ */
(function () {

/* One food:
   F(id, emoji, English name, Norwegian name, group, from age in months, tags, how to serve, choking note)
   tags (space-separated): iron = a good iron source · vitc = rich in vitamin C (helps the body take
   up iron from plant foods at the same meal) · fish · and any allergen ids it contains
   (peanut nuts egg fish shellfish milk wheat soy sesame). */
const F = (id, e, name, no, g, from, tags, serve, choke) => {
  const t = tags ? tags.split(' ') : [];
  return { id, e, name, no, g, from, serve, choke: choke || '',
    iron: t.includes('iron'), vitc: t.includes('vitc'), fish: t.includes('fish'),
    alg: t.filter(x => ALG_IDS.includes(x)) };
};
const ALG_IDS = ['peanut', 'nuts', 'egg', 'fish', 'shellfish', 'milk', 'wheat', 'soy', 'sesame'];

window.FOOD = {

  disclaimer: 'Based on Norwegian health advice (Helsedirektoratet, Mattilsynet) as gathered in our doc “What Foods to Introduce, and When”. It is not medical advice: the helsestasjon and the fastlege come first, especially for allergies, eczema, weight or anything that worries you.',

  /* ───────── the food groups (order = order on the page) ───────── */
  groups: [
    { id: 'veg', e: '🥦', name: 'Vegetables' },
    { id: 'fruit', e: '🍐', name: 'Fruit and berries' },
    { id: 'grain', e: '🥣', name: 'Porridge, grains and bread' },
    { id: 'protein', e: '🍗', name: 'Meat, fish, egg, beans' },
    { id: 'dairy', e: '🥛', name: 'Dairy' },
    { id: 'extra', e: '🫒', name: 'Fats, herbs and later' }
  ],

  /* ───────── the food list ───────── */
  foods: [
    // Vegetables. Norway suggests carrot, swede, cauliflower, broccoli and peas, mashed with potato at first.
    F('potato', '🥔', 'Potato', 'potet', 'veg', 6, '', 'Boiled and mashed smooth with a little breast milk or formula. The usual first base for vegetables in Norway. Later: soft wedges.'),
    F('carrot', '🥕', 'Carrot', 'gulrot', 'veg', 6, '', 'Boiled very soft and mashed into potato. As finger food: soft-cooked sticks about the length of a finger.', 'Never raw carrot sticks or round slices.'),
    F('swede', '🟠', 'Swede', 'kålrot', 'veg', 6, 'vitc', 'Boiled and mashed (kålrotstappe, no salt). Mild and sweet, and helps iron get absorbed.'),
    F('cauliflower', '🤍', 'Cauliflower', 'blomkål', 'veg', 6, 'vitc', 'Steamed soft and mashed, or soft florets with the stalk as a handle.'),
    F('broccoli', '🥦', 'Broccoli', 'brokkoli', 'veg', 6, 'vitc', 'Steamed soft florets with the stalk as a handle, or mashed into potato.'),
    F('peas', '🟢', 'Peas', 'erter', 'veg', 6, 'iron', 'Cooked and mashed or blended into potato. Later, squash them flat to practise the pincer grip.'),
    F('sweetpotato', '🍠', 'Sweet potato', 'søtpotet', 'veg', 6, '', 'Baked or steamed, mashed, or soft wedges.'),
    F('parsnip', '🥕', 'Parsnip', 'pastinakk', 'veg', 6, '', 'Roasted or boiled soft, mashed or as soft sticks.'),
    F('courgette', '🥒', 'Courgette', 'squash', 'veg', 6, '', 'Steamed sticks with the skin on (easier to grip), or mashed.'),
    F('butternut', '🎃', 'Butternut squash', 'butternut / gresskar', 'veg', 6, '', 'Roasted soft and mashed, or soft wedges.'),
    F('greenbeans', '🫛', 'Green beans', 'aspargesbønner', 'veg', 6, '', 'Cooked until soft; whole beans make an easy early finger food.'),
    F('pepper', '🫑', 'Red pepper', 'paprika', 'veg', 6, 'vitc', 'Roasted or steamed strips with the skin slipped off. One of the best vitamin C partners for iron.', 'Raw only once chewing is good.'),
    F('tomato', '🍅', 'Tomato', 'tomat', 'veg', 6, 'vitc', 'Peeled and chopped into sauces and stews.', 'Cherry tomatoes always quartered lengthwise.'),
    F('cabbage', '🥬', 'Cabbage', 'kål', 'veg', 6, 'vitc', 'Cooked soft and chopped into mashes and stews.'),
    F('kale', '🥬', 'Kale', 'grønnkål', 'veg', 6, 'vitc', 'Cooked soft and finely chopped into mash. A bitter green: worth offering again and again.'),
    F('leek', '🧅', 'Leek and onion', 'purre og løk', 'veg', 6, '', 'Cooked soft in stews, sauces and mash for flavour.'),
    F('cucumber', '🥒', 'Cucumber', 'agurk', 'veg', 7, '', 'Peeled spears to gnaw; cool and soothing on gums.', 'Take it away if pieces break off; small hard chunks are a risk.'),
    F('corn', '🌽', 'Sweetcorn', 'mais', 'veg', 7, '', 'Blended or mashed into food; whole kernels once chewing is good.'),
    F('mushroom', '🍄', 'Mushrooms', 'sopp', 'veg', 7, '', 'Cooked and finely chopped into sauces.'),
    F('spinach', '🥬', 'Spinach', 'spinat', 'veg', 12, '', '**Norway: not in the first year** (nitrate). After 1, a little in family food is fine; EFSA’s concern is large portions.'),
    F('beetroot', '🟣', 'Beetroot', 'rødbete', 'veg', 12, '', '**Norway: not in the first year** (nitrate), like spinach, rocket and nettle.'),

    // Fruit and berries
    F('apple', '🍎', 'Apple', 'eple', 'fruit', 6, '', 'Stewed or baked and mashed, or finely grated.', 'No raw apple chunks or slices until chewing is reliable.'),
    F('pear', '🍐', 'Pear', 'pære', 'fruit', 6, '', 'Very ripe and peeled, mashed or as soft slices; firm pears steamed first. Good when the tummy is hard.'),
    F('banana', '🍌', 'Banana', 'banan', 'fruit', 6, '', 'Mashed, or half a banana with some peel left on as a handle.'),
    F('avocado', '🥑', 'Avocado', 'avokado', 'fruit', 6, '', 'Mashed, or ripe strips (roll in ground oats for grip). Good fat.'),
    F('blueberries', '🫐', 'Blueberries', 'blåbær', 'fruit', 6, 'vitc', 'Mashed into porridge, or squashed flat.', 'Squash or halve them; never whole and round at first.'),
    F('strawberries', '🍓', 'Strawberries', 'jordbær', 'fruit', 6, 'vitc', 'Mashed, or a big whole one to gnaw; quartered later. Red skin round the mouth is often just juice, not allergy.'),
    F('raspberries', '🍓', 'Raspberries', 'bringebær', 'fruit', 6, 'vitc', 'Flattened between your fingers, or mashed into porridge.'),
    F('blackcurrant', '🫐', 'Blackcurrants', 'solbær', 'fruit', 6, 'vitc', 'Mashed into porridge (sour!). Top vitamin C.'),
    F('kiwi', '🥝', 'Kiwi', 'kiwi', 'fruit', 6, 'vitc', 'Peeled ripe slices or mashed. Very rich in vitamin C.'),
    F('orange', '🍊', 'Orange', 'appelsin', 'fruit', 6, 'vitc', 'Segments with the skin and membrane removed, cut small.'),
    F('mango', '🥭', 'Mango', 'mango', 'fruit', 6, 'vitc', 'Ripe strips or mashed.'),
    F('plum', '🍑', 'Plum', 'plomme', 'fruit', 6, '', 'Ripe, stone out, peeled and mashed; stewed plums help a hard tummy.'),
    F('peach', '🍑', 'Peach', 'fersken', 'fruit', 6, 'vitc', 'Ripe and peeled, mashed or as soft slices.'),
    F('melon', '🍈', 'Melon', 'melon', 'fruit', 6, 'vitc', 'Ripe, seeds out, strips with the rind cut off.'),
    F('prunes', '🟤', 'Prunes', 'svisker', 'fruit', 6, '', 'Soaked or stewed and blended: a help for a hard tummy. Choose them without sulphite.'),
    F('grapes', '🍇', 'Grapes', 'druer', 'fruit', 7, 'vitc', 'Seedless, always quartered lengthwise.', 'Never whole: a whole grape is the right size to block a small airway.'),
    F('cherries', '🍒', 'Cherries', 'kirsebær', 'fruit', 7, '', 'Stone removed, quartered.'),

    // Porridge, grains, bread. Gluten can start any time from 4 to 12 months; small amounts in the first weeks.
    F('ironporridge', '🥣', 'Iron-fortified baby porridge', 'barnegrøt med jern', 'grain', 6, 'iron', 'Made thin, almost liquid at first, as the packet says. If the packet says “mix with water”, use water only (no breast milk or formula). Keep to 2–3 portions a day.'),
    F('oats', '🌾', 'Oat porridge', 'havregrøt', 'grain', 6, 'iron', 'Home-made with fine oats and water, cooked thin. Iron-rich flour. Most oats carry gluten unless marked gluten-free.'),
    F('wholewheat', '🌾', 'Wholemeal wheat porridge', 'grøt av sammalt hvete', 'grain', 6, 'iron wheat', 'Fine wholemeal flour cooked thin with water. Wheat brings gluten: small amounts in the first weeks.'),
    F('millet', '🌾', 'Millet porridge', 'hirsegrøt', 'grain', 6, 'iron', 'Gluten-free and iron-rich. Cook thin.'),
    F('barley', '🌾', 'Barley', 'bygg', 'grain', 6, '', 'Barley porridge, or soft-cooked grains in stews. Contains gluten.'),
    F('rice', '🍚', 'Rice', 'ris', 'grain', 6, '', 'Now and then, not every day. Cook in plenty of water and pour it off (arsenic). No rice cakes or rice drink.'),
    F('quinoa', '🌾', 'Quinoa', 'quinoa', 'grain', 6, '', 'Rinsed, cooked soft and stirred into mash.'),
    F('pasta', '🍝', 'Pasta', 'pasta', 'grain', 7, 'wheat', 'Well-cooked shapes (fusilli, penne) are easy to grip, or small pasta in sauce.'),
    F('couscous', '🌾', 'Couscous', 'couscous', 'grain', 7, 'wheat', 'Stirred into sauces or mash.'),
    F('bread', '🍞', 'Coarse bread', 'grovbrød', 'grain', 8, 'iron wheat', 'From about 8–9 months, once the baby can chew. Thin fingers with soft margarine and an iron-rich spread. Most babies master bread between 8 and 15 months.'),
    F('pancakes', '🥞', 'Pancakes', 'pannekaker', 'grain', 10, 'wheat egg milk', 'Thin strips, no sugar. Has milk in it, so from about 10 months in Norway.'),

    // Meat, fish, egg, beans: the iron foods. Add within weeks of starting.
    F('beef', '🥩', 'Beef', 'storfekjøtt', 'protein', 6, 'iron', 'Mince cooked through and blended into vegetables, or soft meatballs (no salt). Slow-cooked strips to suck and gnaw.'),
    F('lamb', '🐑', 'Lamb', 'lam', 'protein', 6, 'iron', 'Slow-cooked until it falls apart; mashed or shredded.'),
    F('pork', '🐖', 'Pork', 'svinekjøtt', 'protein', 6, 'iron', 'Lean and cooked through, shredded. Not bacon, ham or sausages (too salty).'),
    F('chicken', '🍗', 'Chicken', 'kylling', 'protein', 6, 'iron', 'Cooked through, blended or finely chopped. Thigh meat has more iron and stays moist.'),
    F('reindeer', '🦌', 'Reindeer or elk', 'reinsdyr / elg', 'protein', 6, 'iron', 'Very iron-rich. Mince or stew, cooked through, no salt. (Liver as a dinner waits until 10 years.)'),
    F('salmon', '🐟', 'Salmon', 'laks', 'protein', 6, 'fish iron', 'Baked, every bone removed, flaked into mash. Fatty fish: omega-3 and vitamin D.'),
    F('trout', '🐟', 'Trout', 'ørret', 'protein', 6, 'fish', 'Farmed or small fish, boned and flaked. Large wild trout and char from lakes have local warnings.'),
    F('mackerel', '🐟', 'Mackerel', 'makrell', 'protein', 6, 'fish iron', 'Fresh, cooked, boned and flaked. Makrell i tomat is salty: later and only a little.'),
    F('cod', '🐟', 'Cod', 'torsk', 'protein', 6, 'fish', 'Poached, bones out, flaked into potato. Lean white fish: iodine. (Not cod from the inner Oslofjord.)'),
    F('saithe', '🐟', 'Saithe or haddock', 'sei / hyse', 'protein', 6, 'fish', 'Poached, bones out, flaked into mash. Cheap, mild white fish.'),
    F('prawns', '🦐', 'Prawns', 'reker', 'protein', 7, 'shellfish', 'Thoroughly cooked, finely chopped or blended into food. Never raw.'),
    F('egg', '🥚', 'Egg', 'egg', 'protein', 6, 'egg iron', 'Well-cooked only: hard-boiled and mashed, or strips of omelette. Not runny.'),
    F('lentils', '🫘', 'Lentils', 'linser', 'protein', 6, 'iron', 'Red lentils cook down to a soft dal (no salt); mash with vegetables.'),
    F('beans', '🫘', 'Beans', 'bønner', 'protein', 6, 'iron', 'Kidney, black or white beans, cooked (or tinned, no salt, rinsed), mashed or squashed.'),
    F('chickpeas', '🧆', 'Chickpeas', 'kikerter', 'protein', 6, 'iron', 'Mashed, or squashed flat once the pincer grip comes.'),
    F('tofu', '⬜', 'Tofu', 'tofu', 'protein', 6, 'iron soy', 'Soft tofu mashed, or firm tofu baked into fingers.'),
    F('peanut', '🥜', 'Peanut butter', 'peanøttsmør', 'protein', 6, 'peanut iron', 'Smooth, no added salt or sugar. Start with about ¼–½ teaspoon thinned into warm porridge or purée.', 'Never whole or chunky peanuts, and never a lump of peanut butter on its own.'),
    F('nutbutter', '🌰', 'Ground nuts or nut butter', 'malte nøtter / nøttesmør', 'protein', 6, 'nuts', 'Almond, cashew or hazelnut butter, thinned; or finely ground nuts stirred into porridge.', 'No whole nuts until 3 years.'),
    F('tahini', '🫙', 'Tahini (sesame)', 'tahini', 'protein', 6, 'sesame', 'A little thinned into porridge, mash or yoghurt.'),
    F('hummus', '🧆', 'Hummus', 'hummus', 'protein', 7, 'iron sesame', 'Home-made without salt (or a low-salt one) as a dip, or a spread on bread from about 8 months.'),
    F('leverpostei', '🍞', 'Leverpostei', 'leverpostei', 'protein', 8, 'iron', 'An iron-rich bread spread, but very high in vitamin A: vary spreads rather than every slice every day.'),

    // Dairy. Norway is more careful than the UK here.
    F('yoghurt', '🥛', 'Plain yoghurt or sour milk', 'yoghurt naturell / kulturmelk', 'dairy', 10, 'milk', 'Plain, unsweetened. **Norway: from 10 months, about 0.5 dl a day.** (The NHS says full-fat yoghurt from 6 months.)'),
    F('cheese', '🧀', 'Mild cheese', 'mild ost', 'dairy', 10, 'milk', 'Pasteurised and mild, grated into food. Not mould-ripened, blue or unpasteurised cheese. (NHS: from 6 months.)'),
    F('milkcooking', '🥛', 'Milk in cooking', 'melk i matlaging', 'dairy', 10, 'milk', 'Small amounts in sauces and baking from about 10 months. Not in porridge and not as a drink until 12 months.'),
    F('cowsmilk', '🥛', 'Cow’s milk to drink', 'lettmelk', 'dairy', 12, 'milk', 'From 12 months, as the mealtime drink: lettmelk or skummet if growing normally. At most 5–6 dl of milk and milk foods a day, so it doesn’t crowd out iron.'),

    // Fats, herbs and the later things
    F('oil', '🫒', 'Plant oil', 'rapsolje / olivenolje', 'extra', 6, '', 'About a teaspoon stirred into dinners and porridge. Babies need the fat.'),
    F('margarine', '🧈', 'Soft plant margarine', 'myk margarin', 'extra', 6, '', 'Stirred into food and porridge; later thinly on bread.'),
    F('herbs', '🌿', 'Herbs and mild spices', 'urter og krydder', 'extra', 6, '', 'Dill, parsley, cumin, a little garlic: flavour without salt. Go easy on cinnamon (coumarin).'),
    F('honey', '🍯', 'Honey', 'honning', 'extra', 12, '', '**Not before 12 months**: its spores can cause infant botulism.')
  ],

  /* ───────── the nine allergens Norway says to include in the first year ─────────
     starter = the food the planner uses to bring it in. How + notes from the doc's table. */
  allergens: [
    { id: 'wheat', e: '🌾', name: 'Wheat (gluten)', starter: 'wholewheat',
      how: 'Porridge, then pasta and bread.', note: 'Gluten any time from 4–12 months; avoid large amounts in the first weeks (ESPGHAN).' },
    { id: 'egg', e: '🥚', name: 'Egg', starter: 'egg',
      how: 'Well-cooked: hard-boiled and mashed, or in an omelette or baking.', note: 'Trials found earlier egg cut egg allergy by about 40%.' },
    { id: 'fish', e: '🐟', name: 'Fish', starter: 'cod',
      how: 'Boneless, cooked, flaked into mash.', note: 'Also a key iron, iodine and omega-3 source. Aim for 2–3 fish dinners a week.' },
    { id: 'peanut', e: '🥜', name: 'Peanut', starter: 'peanut',
      how: 'Smooth peanut butter thinned into porridge or purée, or finely ground; on bread later.', note: 'Never whole or chunky. With severe eczema or an egg allergy, try peanut together with a doctor.' },
    { id: 'soy', e: '🫘', name: 'Soy', starter: 'tofu',
      how: 'Tofu, soy yoghurt.', note: 'Soy drinks not before 12 months.' },
    { id: 'sesame', e: '🫙', name: 'Sesame', starter: 'tahini',
      how: 'Tahini thinned into food, hummus.', note: 'The NHS lists it as a seed to bring in, ground.' },
    { id: 'nuts', e: '🌰', name: 'Tree nuts', starter: 'nutbutter',
      how: 'Smooth nut butters or finely ground nuts.', note: 'No whole nuts until 3 in Norway (5 in the UK).' },
    { id: 'shellfish', e: '🦐', name: 'Shellfish', starter: 'prawns',
      how: 'Thoroughly cooked, finely chopped.', note: 'Never raw.' },
    { id: 'milk', e: '🥛', name: 'Cow’s milk', starter: 'milkcooking',
      how: 'Through formula, then in cooking (Norway from about 10 months) and yoghurt.', note: 'Not as a drink before 12 months. If the baby has formula, it’s already in: tick “already in”.' }
  ],
  allergenLead: 'Norway’s advice is that **every** baby, including those at high allergy risk, should eat egg, fish, milk, nuts, peanuts, shellfish, soy and wheat during the first year. The NHS adds seeds such as sesame.',
  allergenHow: [
    'Bring in **one new allergen at a time**, in a **very small amount**, so a reaction is easy to spot.',
    'Do it **at home, earlier in the day**, not right before bed, when the baby is well, so you can watch for a couple of hours.',
    'If it goes fine, **give a bit more** the next times and leave a couple of days before the next new allergen.',
    '**Keep it in**: once tolerated, serve it regularly (this page nudges you after a week without it).'
  ],
  reactionMild: 'Hives (raised itchy blotches), swelling of lips, eyes or face, or vomiting → stop the food, take photos, and **call the fastlege or legevakt (116 117)**.',
  reactionSevere: 'Trouble breathing, wheezing or a hoarse cry, swelling of the tongue, or a pale, floppy, limp baby → **call 113 now**.',
  reactionNote: 'Redness just around the mouth where acidic food touched (tomato, berries, citrus) is usually skin irritation, not allergy. Note it here anyway.',

  /* ───────── stages: the doc's “at a glance” table ─────────
     meals = how many meals a day the planner fills (snack counts as a meal slot). */
  stages: [
    { n: 1, e: '🥄', title: 'First tastes', months: '6 months, first weeks', from: 6,
      foods: 'Thin porridge (iron-fortified, or home-made from oat, wholemeal wheat or millet), mashed potato, vegetables such as carrot, swede, cauliflower, broccoli and peas, fruit and berries.',
      texture: 'Finely mashed, almost liquid; **a teaspoon is a meal**.',
      meals: 'Start with **one small taste a day**. Milk stays the main food. Water from a cup.', slots: ['lunch'] },
    { n: 2, e: '🍲', title: 'More foods, soft lumps', months: '6–8 months', from: 6,
      foods: 'Beans, lentils, peas, tofu, chicken, meat, boneless fish, well-cooked egg; a little plant oil or margarine in food; **allergens one at a time**.',
      texture: 'Mashed with soft lumps from about 6–7 months; soft finger foods.',
      meals: '**2–3 meals a day.**', slots: ['breakfast', 'dinner'] },
    { n: 3, e: '🍞', title: 'Chewing and bread', months: '8–9 months', from: 8,
      foods: 'Coarse bread once the baby can chew it, with soft margarine and iron-rich spreads (peanut or other nut butter, bean or lentil pâté, hummus, lean meat or fish spreads).',
      texture: 'Lumpy and chopped; the pincer grip for small soft pieces comes around 8 months.',
      meals: '**Lumps should be in by about 9 months.** 3 meals a day.', slots: ['breakfast', 'lunch', 'dinner'] },
    { n: 4, e: '🍽️', title: 'Family-style meals', months: '9–12 months', from: 9,
      foods: 'Wider family-style meals, unsalted. From 10 months: small amounts of cow’s milk in cooking; yoghurt or sour milk, about 0.5 dl a day.',
      texture: 'Chopped, bigger soft chunks; most family textures, cut safely.',
      meals: '**3–4 meals, plus 1–2 snacks if needed.** About 1 dl or a little more is a normal meal size.', slots: ['breakfast', 'lunch', 'dinner', 'snack'] },
    { n: 5, e: '🎂', title: 'Family food', months: '12 months +', from: 12,
      foods: 'Family food (take the baby’s portion before salting), honey, cow’s milk as a drink.',
      texture: 'Family food.',
      meals: 'Lettmelk or skummet milk if growing normally; water between meals.', slots: ['breakfast', 'lunch', 'dinner', 'snack'] }
  ],
  slots: [
    { id: 'breakfast', e: '🌅', name: 'Breakfast', no: 'frokost' },
    { id: 'lunch', e: '☀️', name: 'Lunch', no: 'lunsj' },
    { id: 'dinner', e: '🌆', name: 'Dinner', no: 'middag' },
    { id: 'snack', e: '🍎', name: 'Snack', no: 'mellommåltid' }
  ],

  /* ───────── “Ready to start?” (general guidance, not from the doc) ───────── */
  readiness: [
    ['sit', 'Sits upright with a little support and holds the head steady.'],
    ['grab', 'Looks at food, picks it up and gets it to the mouth.'],
    ['swallow', 'Swallows food instead of pushing it straight back out with the tongue.']
  ],
  notReady: 'Not signs of readiness on their own: waking more at night, chewing fists, or wanting extra milk feeds. Those are normal at this age.',

  /* ───────── the Learn tab ───────── */
  learn: [
    { id: 'iron', e: '🩸', title: 'Iron comes first', body: [
      'A baby’s iron stores run low around 6 months and breast milk has little iron, so Norway advises that **the first foods contain enough of it**. Once solids start, more than 90% of a breastfed baby’s iron has to come from food. The Nordic target is 8 mg a day from 6 months.',
      '**Best sources:** meat and chicken, fish, egg, beans, lentils and peas, iron-fortified baby porridge, coarse grains.',
      '**Boost absorption** with vitamin C at the same meal: orange, kiwi, strawberries, rosehip, blackcurrants, pepper, swede, cauliflower, broccoli. The Today tab ticks “iron + vitamin C” when a meal has both.',
      '**Porridge:** shop-bought baby porridge is usually iron-fortified; home-made should use iron-rich flour (oat, wholemeal wheat, millet). Keep to 2–3 portions a day so the diet stays varied.'] },
    { id: 'veg', e: '🥦', title: 'Vegetables: varied, and again and again', body: [
      'There’s no fixed first food in Norway’s advice. Carrot, swede, cauliflower, broccoli and green peas, mashed with potato, are the suggested start. The NHS adds: don’t only use sweet ones; include bitter greens.',
      '**Repetition works.** Offering a vegetable daily for 8–10 days or more raises acceptance; in one trial a vegetable babies first refused was eaten as readily as a liked one after eight tries, and most still liked it nine months later.',
      'If it’s refused, wait a few days and try again. Never force. The Foods tab counts tries, so you can see when a “no” has only had two goes.'] },
    { id: 'protein', e: '🍗', title: 'Meat, fish, egg and beans', body: [
      '**Meat and chicken:** cooked through, mashed or finely chopped.',
      '**Fish:** Norway’s 2–3 fish dinners a week applies to children too. Mix fatty fish (salmon, trout, mackerel: omega-3, vitamin D) with lean white fish (cod, saithe, haddock: iodine). Remove all bones.',
      '**Egg:** well-cooked, not raw.',
      '**Beans, lentils, peas, tofu:** good iron and protein; mash or blend.'] },
    { id: 'grain', e: '🌾', title: 'Grains and gluten', body: [
      'Gluten (wheat, barley, rye, many oat porridges) can go in any time between 4 and 12 months; the timing doesn’t change coeliac risk. Avoid **large** amounts in the first weeks after it starts.',
      'Coarse bread comes once the baby can chew it; most children master bread between 8 and 15 months.'] },
    { id: 'fat', e: '🫒', title: 'Fats and dairy', body: [
      'Mix a little plant oil or soft plant margarine into dinners and porridge.',
      '**Norway: yoghurt or sour milk from 10 months, about 0.5 dl a day**, and small amounts of cow’s milk in cooking from 10 months. The NHS allows pasteurised full-fat yoghurt and cheese from about 6 months. Choose plain, unsweetened.'] },
    { id: 'texture', e: '🥄', title: 'Textures and finger foods', body: [
      '**Smooth, almost liquid** (first days to weeks): thin porridge, vegetable or potato mash loosened with breast milk or formula.',
      '**Mashed with soft lumps** (from about 6–7 months): fork-mashed dinners; soft finger foods to hold, like steamed vegetable sticks, ripe banana or avocado strips.',
      '**Lumpy, chopped, small pieces** (about 8–9 months): the pincer grip comes around 8 months; coarse bread while learning to chew.',
      '**Chopped family food** (10–12 months): bigger chunks of soft food and lots of finger foods; drinking from a cup by 12 months.',
      '**Why lumps by 9 months:** in a large UK study, babies first given lumps at 10 months or later were more often picky at 15 months and ate less fruit and veg at 7. It’s observational, but it’s the basis of the advice.',
      '**Squeeze pouches** are fine for travel, but not as everyday food: sucking from the spout doesn’t train chewing, it’s easy to take in a lot fast, and sweet contents harm teeth. Squeeze onto a spoon instead.'] },
    { id: 'choke', e: '🫁', title: 'Gagging, choking and safe shapes', body: [
      '**Gagging is normal and noisy:** coughing, spluttering, red face, tongue pushed forward, eyes watering. It’s the safety reflex doing its job and is common in the first weeks. Stay calm, let the baby work it out, don’t put your fingers in their mouth.',
      '**Choking is quiet:** the baby can’t cry or cough properly, may make a high-pitched sound or none, and goes red then blue or grey. Act at once: **5 back blows** (face down along your forearm, head lower than the body), then **5 chest thrusts** (two fingers, centre of the chest). Repeat, and **call 113** if it doesn’t clear. A baby first-aid course (Røde Kors, Norsk Folkehjelp) is well worth it.',
      '**Safe shapes:** cook hard vegetables and fruit until soft; quarter grapes and cherry tomatoes lengthwise; cut sausage-shaped foods into strips, not rounds; no whole nuts, popcorn, or hard raw carrot or apple.',
      '**Seating:** always upright in the high chair, hips and knees bent, **feet resting on a footrest**, and an adult watching. A stable base frees the hands and mouth for eating (the Movement tab is all about that base). Never feed reclined, in a car seat, or on the move.'] },
    { id: 'responsive', e: '🤲', title: 'Let the baby lead (responsive feeding)', body: [
      'You decide **what, when and where**; the baby decides **whether and how much**.',
      '**Hungry / interested:** leans forward, opens mouth, reaches, gets excited.',
      '**Had enough:** turns the head away, closes the mouth, pushes the spoon away, slows down, starts playing or throwing.',
      'Messy is good: touching, squishing and smearing are how babies learn about food. Eat together when you can; babies learn by copying.',
      'Offer food when the baby is alert and not starving or tired; often an hour or so after a milk feed works well at the start.'] }
  ],

  drinks: [
    ['Breast milk or formula', 'Main drink all first year', 'Formula-fed babies stay on infant formula until 1.'],
    ['Water', 'From the start of solids', 'Sips from an open or free-flow cup with meals. Tap water: let it run cold first.'],
    ['Cow’s milk', 'Cooking from ~10 months; drink from 12 months', 'Too little iron before 1 year.'],
    ['Juice, smoothies', 'Not before 12 months', 'Give fresh fruit instead.'],
    ['Oat, soy, almond drinks', 'Not before 12 months', 'Then unsweetened, calcium-fortified.'],
    ['Rice drink', 'Avoid in early childhood', 'Arsenic (Mattilsynet).'],
    ['Follow-on, growing-up, “goodnight” milks', 'Not needed', 'No benefit over ordinary milk.'],
    ['Squash, soft drinks, tea, coffee, herbal or “baby” drinks', 'Avoid', 'Sugar, sweeteners, caffeine; hot drinks scald.'],
    ['Raw (unpasteurised) milk', 'Avoid', 'Bacteria.']
  ],

  avoid: [
    ['Honey', '12 months', 'Spores can cause infant botulism.'],
    ['Cow’s milk as a drink or in porridge', '12 months', 'Low in iron.'],
    ['Spinach, rocket, beetroot, nettle', '12 months (Norway)', 'Nitrate.'],
    ['Added salt and salty foods (bacon, sausages, stock cubes, crisps, ready meals)', '12 months, then keep low', 'Immature kidneys; about 1 g salt a day max at 7–12 months.'],
    ['Added sugar, sweet spreads, biscuits, sweets', 'Year one; limit after', 'Teeth; crowds out good food.'],
    ['Soft mould-ripened, blue or unpasteurised cheese; fresh pâté; raw shellfish', 'Early childhood', 'Listeria, food poisoning.'],
    ['Raisins', 'Limit under 3', 'Mould toxin (ochratoxin A).'],
    ['Dried apricots, peaches and golden raisins with sulphite', 'Under 3', 'High sulphite.'],
    ['Rice cakes, rice drinks, rice every day', 'Small children', 'Arsenic: vary grains; cook rice in lots of water and pour it off.'],
    ['Cinnamon on porridge often', 'Small children', 'Coumarin can harm the liver.'],
    ['Whole nuts, whole grapes, popcorn, hard raw vegetables or fruit', 'Nuts under 3; others until chewing is reliable', 'Choking.'],
    ['Pike, perch over 25 cm, large trout and char; cod from inner Oslofjord', 'Under 5', 'Mercury and PFOS in some lakes and fjords.'],
    ['Shark, swordfish, marlin', 'Childhood', 'Mercury.'],
    ['Brown crab meat (brunmat)', 'Childhood', 'Cadmium, dioxins, PCB.'],
    ['Fish liver and rognleverpostei', 'Childhood', 'Dioxins and PCB.'],
    ['Liver as a dinner', 'Under 10', 'Cadmium (ordinary leverpostei is fine, in moderation).']
  ],
  avoidNote: 'Tinned tuna is fine (Mattilsynet). Leverpostei is a useful iron source but very high in vitamin A, so vary spreads.',

  differences: [
    ['Spinach, beetroot, rocket', 'Not in the first year', 'Spinach is a good first vegetable'],
    ['Cow’s milk in cooking', 'From ~10 months', 'From 6 months'],
    ['Yoghurt and cheese', 'Yoghurt ~0.5 dl/day from 10 months', 'Full-fat yoghurt and cheese from ~6 months'],
    ['Snacks under 12 months', '1–2 snacks from 9 months if needed', 'No snacks; extra milk instead'],
    ['Whole nuts', 'Not under 3', 'Not under 5'],
    ['Milk drink at 1', 'Lettmelk or skummet', 'Whole milk (US)']
  ],

  atOne: [
    'Same meals as the family, cut safely; take the baby’s portion out **before** salting and go easy on spice mixes.',
    'Cow’s milk becomes the mealtime drink: lettmelk or skummet if growing normally, and no more than 5–6 dl of milk and milk foods a day, so it doesn’t crowd out iron.',
    'Water between meals; fruit and vegetables at every meal, building toward five a day.',
    'Still limited: whole nuts (under 3), raisins and sulphited dried fruit (under 3), rice drinks and rice cakes, liver as a dinner (under 10), brown crab meat and fish-liver products, local freshwater fish warnings (under 5).',
    'Vitamin D stays important after 1: ask the helsestasjon which supplement suits.'
  ],

  sources: 'Helsedirektoratet: Mat og måltider for spedbarn (2016, rev. 2022) and Råd om introduksjon av annen mat og drikke · Mattilsynet consumer warnings · VKM fish Q&A (2022) · NHS · AAP · CDC · ESPGHAN (2016) · EFSA nitrate statement · Spill et al. 2019 · Maier et al. 2007 · ALSPAC (Coulthard, Northstone) · Scarpone et al. 2023.'
};
})();
