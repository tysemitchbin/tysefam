/* ════════════════════════════════════════════════════════════════
   COOKBOOK: our own, realistic cooking-time estimate.

   Recipe sites like to say "30 minutes". They usually leave out the chopping, the water
   coming to the boil, the oven heating up, browning the meat in batches, and onions that
   "caramelise in 5 minutes" (they take 30+). So we work it out ourselves from what the
   recipe actually asks you to do:

     PREP     each ingredient: getting it out and measuring, plus knife work
              (an onion ≈ 2½ min to peel and dice, a garlic clove ≈ ½ min, 250 g to cube ≈ 4 min…)
     ACTIVE   each step you're busy with: frying, stirring, kneading, plus ~1½ min per step
              for reading, moving things and tasting
     WAITING  simmering, baking, resting, rising, marinating: you can do some prep meanwhile,
              so a bit of the prep overlaps with the waiting
     + 5 min to get started (pans out, hob on) and 3 min to dish up

   Then the page (index.html) learns from you: when you log "We made this" with how long it
   took, it compares your real times to these estimates and adjusts all of them to match
   your kitchen.

   Cook.estimate(recipe) → { total, prep, active, waiting, overnight, why: ['…'] }  (or null)
   All the numbers below are minutes and can be tuned.
═════════════════════════════════════════════════════════════════ */
(function () {
  const C = window.Cook;
  // Same word matcher as guess.js: a word only has to START with one of these.
  const words = (...list) => new RegExp('(?:^|[^a-zæøåäöüéèáàíóúñç])(?:' + list.join('|') + ')', 'i');

  /* ───────── PREP: the ingredient list ───────── */
  // Knife work mentioned in the ingredient line.
  const KNIFE = words('chop', 'dice', 'diced', 'mince', 'slice', 'cube', 'julienne', 'shred', 'quarter', 'halve', 'cut ', 'cut into',
    'trim', 'deseed', 'de-seed', 'core', 'crush', 'smash', 'hakk', 'finhakk', 'grovhakk', 'skiv', 'terning', 'strimler', 'kutt', 'del i', 'båter', 'knus');
  // Things that nearly always need peeling/chopping, even when the line doesn't say so.
  // [pattern, minutes for ONE of them]
  const PER_ITEM = [
    [words('red onion', 'onion', 'rødløk', 'løk\\b', 'gul løk'), 2.5],
    [words('shallot', 'sjalott'), 1.5],
    [words('spring onion', 'scallion', 'green onion', 'vårløk'), 0.7],
    [words('garlic', 'hvitløk', 'fedd'), 0.6],
    [words('ginger', 'ingefær'), 2],
    [words('sweet potato', 'søtpotet'), 3],
    [words('potato', 'potet'), 2],
    [words('carrot', 'gulrot', 'gulrøtter'), 1.5],
    [words('parsnip', 'pastinakk', 'beet', 'rødbet', 'kålrot', 'swede', 'turnip'), 2.5],
    [words('leek', 'purre'), 2],
    [words('celery', 'stangselleri', 'selleri'), 1],
    [words('bell pepper', 'red pepper', 'green pepper', 'yellow pepper', 'capsicum', 'paprika'), 2],
    [words('courgette', 'zucchini', 'squash', 'gresskar', 'pumpkin'), 2.5],
    [words('aubergine', 'eggplant'), 2.5],
    [words('cauliflower', 'blomkål'), 5],
    [words('broccoli', 'brokkoli'), 3],
    [words('cabbage', 'hodekål', 'rødkål', 'kål\\b'), 6],
    [words('mushroom', 'sopp', 'champignon'), 0.4],
    [words('tomato', 'tomat'), 1],
    [words('chilli', 'chili', 'jalape'), 1.5],
    [words('avocado'), 1.5],
    [words('apple', 'eple', 'pear', 'pære', 'mango', 'pineapple', 'ananas'), 2],
    [words('cucumber', 'agurk'), 1.5],
    [words('chicken breast', 'kyllingfilet', 'kyllingbryst', 'chicken thigh', 'kyllinglår'), 1.5],
    [words('parsley', 'persille', 'coriander', 'cilantro', 'koriander', 'basil', 'basilikum', 'dill', 'mint', 'chives', 'gressløk'), 2],
  ];
  // Lines that are only fetched and measured (no knife), or almost nothing at all.
  const PANTRY = words('salt', 'pepper\\b', 'black pepper', 'sort pepper', 'pepper,', 'oil', 'olje', 'sugar', 'sukker', 'flour', 'mel\\b',
    'baking powder', 'bakepulver', 'baking soda', 'natron', 'stock', 'buljong', 'kraft', 'vinegar', 'eddik', 'soy sauce', 'soyasaus',
    'honey', 'honning', 'water', 'vann\\b', 'milk', 'melk', 'cream', 'fløte', 'butter', 'smør', 'spice', 'krydder', 'powder', 'pulver',
    'cumin', 'spisskummen', 'cinnamon', 'kanel', 'paprika powder', 'oregano', 'thyme', 'timian', 'bay lea', 'laurbær', 'stock cube');
  const READY = words('can\\b', 'cans\\b', 'tin\\b', 'tins\\b', 'canned', 'tinned', 'boks', 'hermetisk', 'jar\\b', 'glass\\b', 'frozen', 'frossen',
    'frosne', 'store-bought', 'ready', 'ferdig', 'pre-', 'bag of', 'pose', 'pakke', 'package', 'packet', 'dried', 'tørket', 'ground', 'malt\\b');
  const SPOONS = /\b(tsp|tbsp|teaspoons?|tablespoons?|ts|ss|krm|pinch|klype|dash)\b/i;
  const WEIGHT = /(\d+(?:[.,]\d+)?)\s*(kg|g|gram|grams|lb|lbs|pounds?|oz)\b/i;
  const UNITS = /^(g|kg|gram|grams|ml|cl|dl|l|liter|litre|cups?|tbsp|tsp|ts|ss|teaspoons?|tablespoons?|oz|lb|lbs|pounds?|cans?|tins?|boks|pk|pakke|packs?|packets?|jars?|glass|bunch|bunches|neve|handful|stalks?|sprigs?|pinch|klype|dash|slices?|skiver?)\b/i;
  const TO_SERVE = /to serve|for serving|til servering|optional|valgfritt|to garnish|garnish|til pynt|pynt\b/i;

  // How many of the thing: "3 onions" → 3, "2 cloves garlic" → 2, "200 g mince" → null (that's a weight).
  function countOf(line) {
    const m = line.match(/^\s*(\d+\s+\d\/\d|\d+\/\d|\d*\s*[¼½¾⅓⅔]|\d+(?:[.,]\d+)?)(?:\s*[-–]\s*(\d+(?:[.,]\d+)?))?\s*(.*)$/);
    if (!m) return /^(an?|one|en|ett|ei)\s/i.test(line) ? 1 : null;
    if (UNITS.test(m[3]) && !/^(cloves?|fedd|stk|heads?|hode)\b/i.test(m[3])) return null;
    const read = s => { s = s.trim(); const f = { '¼': .25, '½': .5, '¾': .75, '⅓': 1 / 3, '⅔': 2 / 3 };
      const mm = s.match(/^(\d*)\s*([¼½¾⅓⅔])$/); if (mm) return (+mm[1] || 0) + f[mm[2]];
      const fr = s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (fr) return (+fr[1] || 0) + fr[2] / fr[3];
      return parseFloat(s.replace(',', '.')); };
    const n = read(m[2] || m[1]);
    if (/^(heads?|hode)\b/i.test(m[3]) && /garlic|hvitløk/i.test(m[3])) return n * 10;   // a whole head of garlic ≈ 10 cloves
    return isFinite(n) ? n : null;
  }
  function grams(line) {
    const m = line.match(WEIGHT);
    if (!m) return null;
    const n = parseFloat(m[1].replace(',', '.'));
    return /kg/i.test(m[2]) ? n * 1000 : /lb|pound/i.test(m[2]) ? n * 454 : /oz/i.test(m[2]) ? n * 28 : n;
  }

  function prepFor(line, why) {
    const l = line.toLowerCase();
    if (TO_SERVE.test(l) && !KNIFE.test(l)) return 0.3;
    let t = PANTRY.test(l) && !KNIFE.test(l) ? 0.5 : 1;          // get it out and measure it
    const ready = READY.test(l), spoon = SPOONS.test(l);
    if (ready) t += 0.5;                                          // open the tin / bag
    const item = PER_ITEM.find(([re]) => re.test(l));
    const knife = !ready && !spoon && (KNIFE.test(l) || item);
    if (knife) {
      const n = countOf(l), g = grams(l);
      const per = item ? item[1] : 1.5;
      if (n && !g) t += per * Math.min(n, 15);
      else if (g) t += Math.min(g / 250 * 4, 20);                // ~4 min per 250 g to chop/cube/slice
      else t += Math.max(per, 2.5);
    }
    if (/peel|skrell|skall av|skrelt/.test(l) && !item) t += 1.5;
    if (/grate|grated|revet|rive/.test(l)) t += 2;
    if (/zest|sitronskall|limeskall|skall av/.test(l)) t += 1.5;
    if (/juice of|juiced|saft av|squeezed|presset/.test(l)) t += 1;
    if (/toasted|ristet|ristede/.test(l)) t += 4;
    if (/devein|rensede reker|renset/.test(l)) t += 6;
    if (/melted|smeltet/.test(l)) t += 2;
    if (/beaten|whisked|lightly beaten|pisket/.test(l)) t += 1;
    if (/sifted|siktet/.test(l)) t += 1;
    if (/pitted|stoned|steinfri/.test(l) && !ready) t += 2;
    // "2 cups cooked rice" means cooking rice first.
    if (/cooked (rice|quinoa|lentils|pasta|chicken|potato)|kokt(e)? (ris|quinoa|linser|pasta|kylling|poteter)|leftover/.test(l)) {
      why.push('Cooking the rice/pasta/etc. the ingredient list says is “cooked”: about 20 min');
      t += 20;
    }
    return t;
  }

  /* ───────── the steps ───────── */
  const PASSIVE = words('simmer', 'småkok', 'bake', 'bak\\b', 'roast', 'stek i ovn', 'i ovnen', 'in the oven', 'oven', 'ovn', 'boil', 'kok\\b',
    'koke', 'rest', 'hvile', 'marinate', 'mariner', 'chill', 'kjøl', 'refrigerat', 'cool', 'avkjøl', 'rise', 'prove', 'proof', 'heve', 'steam',
    'damp', 'braise', 'slow cook', 'saktekok', 'pressure', 'trykk', 'set aside', 'leave', 'la stå', 'la det stå', 'trekke', 'soak', 'bløtlegg',
    'stand', 'release', 'cover and cook', 'lokk på', 'in the fridge', 'kjøleskap');
  // A number of minutes that ISN'T time spent: "stir every 5 minutes", "check after 20 minutes".
  const NOT_TIME = /(every|each|after|within|hvert|hvert\s+\d|etter)\s+(\d+(?:[.,]\d+)?)\s*(?:-|–|to)?\s*(\d+)?\s*(min|minutes?|minutter|hours?|timer?)/gi;

  function statedMinutes(l) {
    const clean = l.replace(NOT_TIME, ' ');
    let m = C.parseDuration(clean) || 0;
    // "3-4 minutes per side" → both sides.
    if (/per side|each side|på hver side|på begge sider|on both sides/.test(l)) m *= 2;
    return m;
  }

  function stepTime(s, why, flags) {
    const l = s.toLowerCase();
    let active = 1.5, waiting = 0;                       // ~1½ min to read it, move things, taste
    // Overnight / many hours: plan ahead, but don't count it in the minutes.
    if (/overnight|over natten|natten over|dagen før|day before|the night before|(\b([6-9]|1\d|2\d)\s*(hours|hrs|timer)\b)/.test(l) &&
        /marinat|mariner|chill|kjøl|fridge|refrigerat|soak|bløtlegg|rest|hvile|set|stivne|rise|heve/.test(l)) {
      flags.overnight = true;
      return { active, waiting };
    }
    // "Meanwhile, cook the pasta": happens alongside the step before, so it adds only a little.
    if (/^(meanwhile|in the meantime|while (that|this|it|the)|imens|i mellomtiden|samtidig|mens)\b/.test(l)) {
      if (/oven|ovn|bake|roast/.test(l)) flags.oven = true;
      return { active: active + 2, waiting };
    }
    let stated = statedMinutes(l);
    const isPassive = PASSIVE.test(l);
    if (/preheat|pre-heat|forvarm|heat the oven|varm opp ovnen/.test(l)) flags.oven = true;
    if (/oven|ovn|bake|roast/.test(l)) flags.oven = true;

    // ── Things recipes famously underestimate ──
    if (/carameli[sz]|karamellis/.test(l) && /onion|løk/.test(l)) {
      if (stated < 35) why.push(`Caramelising onions properly takes about 35 min${stated ? `, not ${stated}` : ''}`);
      stated = Math.max(stated, 35);
    } else if (/onion|løk/.test(l) && /soft|translucent|tender|myk|blank|golden|gyllen/.test(l)) {
      if (stated && stated < 8) why.push(`Softening onions takes 8–10 min, not ${stated}`);
      stated = Math.max(stated, 8);
    }
    if (/\b(brown|sear|brun|brune|stek.*kjøtt)/.test(l)) stated = Math.max(stated, 6);
    if (/in batches|i omganger|porsjonsvis|in two batches|a few at a time|litt om gangen/.test(l)) {
      why.push('Browning/frying in batches: each batch takes the full time again');
      stated = stated * 1.8;
    }
    if (/reduce|reduser|thicken|tykne|koke inn|until syrupy/.test(l)) stated = Math.max(stated, 10) * 1.3;
    if (/until golden|until crisp|gyllen|sprø/.test(l) && stated) stated *= 1.15;
    if (/bring .{0,40}(to a|to the) boil|kok opp|koke opp|boiling water|kokende vann/.test(l)) {
      const bigPot = /pot|large|pasta|water|vann|kjele/.test(l);
      waiting += bigPot ? 10 : 4;
      if (bigPot) flags.water = true;
    }
    if (/pressure|trykkok|instant pot/.test(l) && /high|cook|kok/.test(l)) { waiting += 12; flags.pressure = true; }
    if (/natural(ly)? release|naturlig/.test(l) && !/\d/.test(l)) waiting += 15;

    if (stated) {
      if (isPassive && !/stir|rør|whisk|visp|flip|snu|fry|stek\b|sauté|fres/.test(l)) waiting += stated;
      else if (isPassive) { active += stated * 0.4; waiting += stated * 0.6; }   // simmer while stirring now and then
      else active += stated;
      return { active, waiting };
    }

    // ── No time written: what does a step like this usually take? ──
    if (/rise|prove|proof|heve|hev\b/.test(l)) waiting += 60;
    else if (/chill|kjøl|refrigerat|set in the fridge|stivne/.test(l)) waiting += 60;
    else if (/cool completely|avkjøl helt/.test(l)) waiting += 45;
    else if (/cool|avkjøl/.test(l)) waiting += 15;
    else if (/marinat|mariner/.test(l)) waiting += 30;
    else if (/rest|hvile|stand|la stå/.test(l)) waiting += 10;
    else if (/(cook|boil|kok).{0,30}(rice|ris)\b|\b(rice|ris)\b.{0,30}(cook|boil|kok)/.test(l)) waiting += 20;
    else if (/(cook|boil|kok).{0,30}(pasta|spaghetti|noodle|nudler)|\b(pasta|spaghetti|noodles?)\b.{0,30}(cook|boil|kok)/.test(l)) waiting += 10;
    else if (/(boil|kok).{0,30}(potato|potet)|(potato|potet).{0,30}(boil|kok)/.test(l)) waiting += 20;
    else if (/bake|roast|stek i ovn|i ovnen|in the oven|gratiner/.test(l)) waiting += 25;
    else if (/simmer|småkok|braise|stew|gryte/.test(l)) { active += 4; waiting += 15; }
    else if (/knead|elt/.test(l)) active += 10;
    else if (/roll out|kjevle|shape|form\b|forme/.test(l)) active += 8;
    else if (/fry|sauté|saute|stir-fry|wok|stek|fres|brown|brun|sear|cook/.test(l)) active += 6;
    else if (/blend|purée|puree|mix|whisk|stir|combine|bland|visp|rør|toss|vend/.test(l)) active += 2;
    else active += 2;
    return { active, waiting };
  }

  /* ───────── putting it together ───────── */
  function estimate(r) {
    const ings = (r.ingredients || []).filter(l => !C.isHeading(l));
    const steps = (r.steps || []).filter(l => !C.isHeading(l));
    if (ings.length < 2 && steps.length < 2) return null;
    const why = [], flags = {};

    let prep = 0;
    for (const line of ings) prep += prepFor(line, why);

    let active = 5 + 3;                                   // getting started + dishing up
    let waiting = 0;
    for (const s of steps) { const t = stepTime(s, why, flags); active += t.active; waiting += t.waiting; }

    // The oven heats while you prep: only the part that's left over counts.
    if (flags.oven) {
      const heat = Math.max(0, 15 - prep);
      if (heat) why.push(`Waiting for the oven to heat up: ${Math.round(heat)} min`);
      waiting += heat;
    }
    if (flags.water) why.push('Waiting for a big pot of water to boil: about 10 min');
    if (flags.pressure) why.push('An Instant Pot takes ~12 min to come up to pressure before the timer starts');

    // While things simmer or bake you can get on with some of the prep (but rarely all of it).
    const overlap = Math.min(waiting, prep) * 0.4;
    const total = prep + active + waiting - overlap;
    return {
      total: Math.max(5, Math.round(total / 5) * 5),
      prep: Math.round(prep),
      active: Math.round(active),
      waiting: Math.round(waiting),
      overnight: !!flags.overnight,
      why: [...new Set(why)].slice(0, 5),
    };
  }

  C.estimate = estimate;
})();
