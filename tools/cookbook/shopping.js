/* ════════════════════════════════════════════════════════════════
   COOKBOOK: the shopping list, worked out from the planned dinners.

   Cook.shoppingList(items) → [{ id, emoji, label, items: [{ key, name, amount, from: ['Köfte', …] }] }]
     items = [{ recipe, factor }   a planned recipe and how much to scale it (planned ÷ recipe servings)
              { name, emoji }]     a planned quick dinner ("Frozen pizza"): bought as it is
   Each ingredient line is split into its amount ("3", "600 g", "2 tbsp", "1 can") and its name
   ("onion"). Lines with the same name are added up: "1 onion" + "2 onions" = "3 onions";
   600 g + 500 g = "1.1 kg". Different kinds of amounts are listed side by side ("2 tbsp + 1 can").
   Then each thing goes into the part of the shop where you'd find it (AISLES below). Salt, oil,
   spices and other cupboard things go in "Probably at home".
═════════════════════════════════════════════════════════════════ */
(function () {
  const C = window.Cook;
  const words = (...list) => new RegExp('(?:^|[^a-zæøåäöüéèáàíóúñç])(?:' + list.join('|') + ')', 'i');

  // The parts of the shop, in the order you'd usually walk through them.
  const AISLES = [
    ['veg', '🥦', 'Fruit & veg'], ['bakery', '🥖', 'Bread'], ['meat', '🥩', 'Meat & fish'], ['dairy', '🧀', 'Dairy & eggs'],
    ['dry', '🍝', 'Pasta, rice & dry goods'], ['tins', '🥫', 'Tins, jars & sauces'], ['frozen', '🧊', 'Frozen'],
    ['ready', '🍕', 'Quick dinners'], ['other', '🛒', 'Other'], ['pantry', '🧂', 'Probably at home'],
  ];
  // Which part of the shop: the first match wins.
  const WHERE = [
    ['veg', words('garlic(?! ?powder)', 'hvitløk(?!s?pulver)', 'fresh ginger', 'lemon', 'sitron', 'lime')],
    ['dry', words('breadcrumb', 'panko', 'griljermel')],
    ['veg', words('bell pepper', 'red pepper', 'green pepper', 'yellow pepper', 'capsicum', 'paprikaer', 'fresh (parsley|coriander|basil|dill|mint|thyme|rosemary|chives)')],
    ['frozen', words('frozen', 'frossen', 'frosne', 'fish finger', 'fiskepinne', 'ice cream', 'iskrem')],
    ['pantry', words('salt', 'pepper\\b', 'black pepper', 'peppercorn', 'olive oil', 'oil\\b', 'olje', 'sugar', 'sukker', 'flour', 'mel\\b', 'hvetemel',
      'baking powder', 'bakepulver', 'baking soda', 'bicarbonate', 'natron', 'vanilla', 'vanilje', 'vinegar', 'eddik', 'soy sauce', 'soyasaus',
      'honey', 'honning', 'mustard', 'sennep', 'ketchup', 'stock cube', 'buljongterning', 'bouillon cube', 'garlic powder', 'onion powder',
      'cornstarch', 'cornflour', 'maizena', 'potetmel', 'cumin', 'spisskummen', 'paprika', 'chili flake', 'chiliflak', 'cayenne', 'cinnamon', 'kanel',
      'turmeric', 'gurkemeie', 'garam masala', 'curry powder', 'karri', 'oregano', 'dried', 'tørket', 'thyme', 'timian', 'rosemary', 'rosmarin',
      'cardamom', 'kardemomme', 'nutmeg', 'muskat', 'clove', 'nellik', 'ground coriander', 'coriander seed', 'five spice', 'bay lea', 'laurbær',
      'allspice', 'allehånde', 'spice', 'krydder', 'seasoning', 'sumac', 'sumak', 'za.?atar', 'smoked paprika', 'pul biber', 'water', 'vann\\b')],
    ['tins', words('can\\b', 'cans\\b', 'tin\\b', 'tinned', 'canned', 'boks', 'hermetisk', 'jar\\b', 'glass\\b', 'chopped tomatoes', 'hakkede tomater', 'passata',
      'tomato paste', 'tomato purée', 'tomatpuré', 'coconut milk', 'kokosmelk', 'chickpea', 'kikert', 'beans', 'bønner', 'stock', 'broth', 'buljong', 'kraft\\b',
      'fond', 'sauce', 'saus\\b', 'pesto', 'paste\\b', 'pasta\\b(?= sauce)', 'olive', 'oliven', 'caper', 'kapers', 'sun-dried', 'soltørk', 'mirin', 'fish sauce',
      'tahini', 'peanut butter', 'peanøttsmør', 'jam', 'syltetøy', 'pickle', 'syltet', 'sriracha', 'mayo', 'majones', 'salsa', 'taco sauce', 'tacosaus', 'kimchi')],
    ['meat', words('chicken', 'kylling', 'turkey', 'kalkun', 'duck', 'beef', 'storfe', 'okse', 'mince', 'kjøttdeig', 'steak', 'biff', 'entrecote', 'filet',
      'pork', 'svin', 'bacon', 'ham\\b', 'skinke', 'sausage', 'pølse', 'chorizo', 'salami', 'lamb', 'lamme', 'veal', 'kalv', 'reinsdyr', 'reindeer', 'elg',
      'fish', 'fisk', 'salmon', 'laks', 'cod', 'torsk', 'sei\\b', 'hyse', 'prawn', 'shrimp', 'reke', 'scampi', 'mussel', 'skjell', 'tuna', 'tunfisk',
      'mackerel', 'makrell', 'trout', 'ørret', 'pinnekjøtt', 'ribbe', 'kotelett', 'meatball', 'kjøttboller', 'fiskekake', 'fiskeboller')],
    ['dairy', words('milk', 'melk', 'cream', 'fløte', 'rømme', 'crème', 'creme', 'yogurt', 'yoghurt', 'skyr', 'kefir', 'butter', 'smør', 'cheese', 'ost\\b',
      'oste', 'parmesan', 'mozzarella', 'feta', 'halloumi', 'cheddar', 'ricotta', 'mascarpone', 'cottage', 'kesam', 'egg', 'eggs', 'paneer', 'brunost', 'tofu')],
    ['bakery', words('bread', 'brød', 'baguette', 'ciabatta', 'bun\\b', 'buns\\b', 'roll\\b', 'rolls\\b', 'rundstykke', 'tortilla', 'wrap', 'lompe', 'pita',
      'naan', 'flatbread', 'flatbrød', 'knekkebrød', 'crispbread', 'taco shell', 'tacoskjell')],
    ['dry', words('rice', 'ris\\b', 'basmati', 'jasmine', 'pasta', 'spaghetti', 'penne', 'macaroni', 'makaroni', 'fusilli', 'tagliatelle', 'linguine',
      'lasagne', 'lasagna', 'noodle', 'nudler', 'couscous', 'bulgur', 'quinoa', 'oats', 'havre', 'lentil', 'linse', 'breadcrumb', 'panko', 'griljermel',
      'nut', 'nøtt', 'almond', 'mandel', 'seed', 'frø', 'raisin', 'rosin', 'chocolate', 'sjokolade', 'cocoa', 'kakao', 'yeast', 'gjær', 'polenta', 'gnocchi')],
    ['veg', words('onion', 'løk', 'garlic', 'hvitløk', 'ginger', 'ingefær', 'carrot', 'gulrot', 'gulrøtter', 'potato', 'potet', 'tomato', 'tomat', 'cucumber',
      'agurk', 'lettuce', 'salat', 'spinach', 'spinat', 'kale', 'grønnkål', 'cabbage', 'kål', 'broccoli', 'brokkoli', 'cauliflower', 'blomkål', 'leek',
      'purre', 'celery', 'selleri', 'courgette', 'zucchini', 'squash', 'aubergine', 'eggplant', 'mushroom', 'sopp', 'champignon', 'avocado', 'lemon',
      'sitron', 'lime', 'orange', 'appelsin', 'apple', 'eple', 'banana', 'banan', 'berr', 'bær', 'pear', 'pære', 'mango', 'pineapple', 'ananas',
      'chilli', 'chili', 'jalape', 'herb', 'parsley', 'persille', 'coriander', 'koriander', 'basil', 'basilikum', 'dill', 'mint', 'chives', 'gressløk',
      'spring onion', 'vårløk', 'shallot', 'sjalott', 'beet', 'rødbet', 'parsnip', 'pastinakk', 'kålrot', 'swede', 'sweet potato', 'søtpotet',
      'pumpkin', 'gresskar', 'asparagus', 'asparges', 'pea\\b', 'peas\\b', 'erter', 'corn\\b', 'mais\\b', 'rocket', 'ruccola', 'bean sprout', 'radish', 'reddik', 'fennel')],
  ];
  // Where to find it, from its name ("butter" even if the line says "butter or olive oil"),
  // but a "frozen …" or "canned …" line goes to the freezer or the tins.
  function aisleOf(name, line) {
    if (/frozen|frossen|frosne/i.test(line)) return 'frozen';
    return (WHERE.find(([, re]) => re.test(name)) || WHERE.find(([, re]) => re.test(line)) || ['other'])[0];
  }
  // Different names for the same thing.
  const SAME = [[/^(ground|minced) beef$|^beef mince$|^mince$/, 'beef mince'], [/^tomato (puree|purée|paste)$|^tomatpur[ée]$/, 'tomato paste'],
    [/^(chopped|canned|tinned|crushed|diced) tomatoes?$|^hakkede tomater$/, 'chopped tomatoes'], [/^(spring|green) onions?$|^scallions?$/, 'spring onions']];

  /* ───────── reading "2 x 400 g cans chopped tomatoes" ───────── */
  const NUM = '(\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d*\\s*[¼½¾⅓⅔⅛]|\\d+(?:[.,]\\d+)?|(?:an?|one|en|ett|ei)(?=\\s))';
  const LEAD = new RegExp(`^\\s*${NUM}(?:\\s*(?:-|–|to|til)\\s*(\\d+(?:[.,]\\d+)?))?\\s*(?:x\\s*(\\d+(?:[.,]\\d+)?)\\s*)?`, 'i');
  // unit as written → [the unit we show, what it measures, how many of the base unit (g, ml, tbsp)]
  const UNITS = {
    g: ['g', 'g', 1], gr: ['g', 'g', 1], gram: ['g', 'g', 1], grams: ['g', 'g', 1], kg: ['g', 'g', 1000], kilo: ['g', 'g', 1000],
    oz: ['g', 'g', 28], lb: ['g', 'g', 454], lbs: ['g', 'g', 454], pound: ['g', 'g', 454], pounds: ['g', 'g', 454],
    ml: ['ml', 'ml', 1], cl: ['ml', 'ml', 10], dl: ['ml', 'ml', 100], l: ['ml', 'ml', 1000], liter: ['ml', 'ml', 1000], litre: ['ml', 'ml', 1000],
    cup: ['cup', 'cup', 1], cups: ['cup', 'cup', 1],   // kept as cups ("2 cups spinach"), unless added to ml
    tbsp: ['tbsp', 'tbsp', 1], tbs: ['tbsp', 'tbsp', 1], tablespoon: ['tbsp', 'tbsp', 1], tablespoons: ['tbsp', 'tbsp', 1], ss: ['tbsp', 'tbsp', 1],
    tsp: ['tbsp', 'tbsp', 1 / 3], teaspoon: ['tbsp', 'tbsp', 1 / 3], teaspoons: ['tbsp', 'tbsp', 1 / 3], ts: ['tbsp', 'tbsp', 1 / 3],
    can: ['can', 'can', 1], cans: ['can', 'can', 1], tin: ['can', 'can', 1], tins: ['can', 'can', 1], boks: ['can', 'can', 1], bokser: ['can', 'can', 1],
    jar: ['jar', 'jar', 1], jars: ['jar', 'jar', 1], glass: ['jar', 'jar', 1],
    pack: ['pack', 'pack', 1], packs: ['pack', 'pack', 1], packet: ['pack', 'pack', 1], packets: ['pack', 'pack', 1], pakke: ['pack', 'pack', 1],
    pakker: ['pack', 'pack', 1], pk: ['pack', 'pack', 1], pose: ['bag', 'bag', 1], bag: ['bag', 'bag', 1], bags: ['bag', 'bag', 1],
    bunch: ['bunch', 'bunch', 1], bunches: ['bunch', 'bunch', 1], bunt: ['bunch', 'bunch', 1],
    clove: ['clove', 'clove', 1], cloves: ['clove', 'clove', 1], fedd: ['clove', 'clove', 1],
    slice: ['slice', 'slice', 1], slices: ['slice', 'slice', 1], skive: ['slice', 'slice', 1], skiver: ['slice', 'slice', 1],
    stick: ['stick', 'stick', 1], sticks: ['stick', 'stick', 1], stalk: ['stick', 'stick', 1], stalks: ['stick', 'stick', 1],
    head: ['head', 'head', 1], heads: ['head', 'head', 1], hode: ['head', 'head', 1],
    pinch: ['pinch', 'pinch', 1], klype: ['pinch', 'pinch', 1], handful: ['handful', 'handful', 1], neve: ['handful', 'handful', 1],
  };
  const SIZE = /^(large|small|medium|big|thick|thin|stor|store|liten|små|middels)\s+/i;
  const FRAC = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 };
  function num(s) {
    s = String(s || '').trim(); let m;
    if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3];
    if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
    if ((m = s.match(/^(\d*)\s*([¼½¾⅓⅔⅛])$/))) return (+m[1] || 0) + FRAC[m[2]];
    if (/^(a|an|one|en|ett|ei)$/i.test(s)) return 1;
    return parseFloat(s.replace(',', '.'));
  }

  // "3 garlic cloves, crushed" → { qty: 3, unit: 'clove', name: 'garlic' }
  function readLine(line) {
    let l = String(line).replace(/^[\s•·\-–*▢□☐]+/, '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
    l = l.replace(/^[a-zæøå ]{2,20}:\s+/i, '');                              // "To finish: olive oil" → "olive oil"
    const juice = l.match(/^(?:the\s+)?(?:juice|zest|saft|skall|skallet)\s+(?:of|av|fra)\s+(.+)$/i);   // "Juice of ½ lemon" → ½ lemon
    if (juice) l = juice[1];
    let qty = null, unit = '';
    const m = l.match(LEAD);
    if (m && m[1] && m[0].trim()) {
      qty = num(m[1]);
      if (m[2]) qty = Math.max(qty, num(m[2]));          // "2-3" → buy 3
      if (m[3]) qty *= num(m[3]);                        // "2 x 400 g" → 800 g
      l = l.slice(m[0].length);
      const u = l.match(/^([a-zæøå]+)\.?\s+/i);
      if (u && UNITS[u[1].toLowerCase()]) { unit = u[1].toLowerCase(); l = l.slice(u[0].length); }
      l = l.replace(/^(cans?|tins?|jars?|packs?|boks(?:er)?)\s+(?:of\s+)?/i, '');   // "400 g cans chopped tomatoes"
    }
    l = l.replace(SIZE, '').replace(/^(of|av)\s+/i, '');
    // The name: before any comma ("onion, chopped") or "or" ("butter or oil").
    let name = l.split(/,|;|\s+(?:or|eller)\s+|\s+to serve|\s+til servering/i)[0].trim();
    if (/garlic|hvitløk/i.test(name)) name = name.replace(/\s*\b(cloves?|fedd)\b/i, '').trim();
    if (!unit && /garlic|hvitløk/i.test(name) && qty) unit = 'clove';
    return { qty, unit, name: name || l };
  }
  // The same thing written a bit differently counts as one: "Onions" = "onion", "tomatoes" = "tomato".
  const keyOf = name => name.toLowerCase().replace(/[^a-zæøåäöüé ]+/g, ' ').trim().split(/\s+/)
    .map(w => w.length > 3 ? w.replace(/(oes|ies)$/, m => (m === 'ies' ? 'y' : 'o')).replace(/(?<=[^s])s$/, '') : w).join(' ');

  const nice = n => {
    if (n >= 10) return String(Math.round(n));
    const whole = Math.floor(n), rest = n - whole;
    for (const [ch, v] of Object.entries(FRAC)) if (Math.abs(rest - v) < 0.05) return (whole || '') + ch;
    if (rest < 0.05) return String(whole);
    if (rest > 0.95) return String(whole + 1);
    return String(Math.round(n * 10) / 10);
  };
  // 1100 g → "1.1 kg", 300 ml → "3 dl", 2 tbsp → "2 tbsp", 3 (pieces) → "3"
  function showAmount(base, unit) {
    if (unit === 'g') return base >= 1000 ? `${nice(base / 1000)} kg` : `${Math.round(base / 10) * 10 || Math.round(base)} g`;
    if (unit === 'ml') return base >= 1000 ? `${nice(base / 1000)} l` : base >= 100 ? `${nice(base / 100)} dl` : `${Math.round(base)} ml`;
    if (unit === 'tbsp') return base < 1 ? `${nice(base * 3)} tsp` : `${nice(base)} tbsp`;
    if (!unit) return nice(base);
    return `${nice(base)} ${unit}${base > 1 && !/s$/.test(unit) && unit !== 'pinch' ? (unit === 'bunch' ? 'es' : 's') : ''}`;
  }

  function shoppingList(items) {
    const byKey = {};
    for (const it of items) {
      if (it.recipe) {
        const title = it.recipe.title;
        for (const line of it.recipe.ingredients || []) {
          if (C.isHeading(line)) continue;
          const low = line.toLowerCase();
          if (/from the (pan|tray|pot|sheet|oven)|from above|reserved|fra (pannen|langpannen)/.test(low)) continue;   // already made
          if (/^(water|vann|boiling water|cold water|warm water|ice)\b/i.test(readLine(line).name)) continue;
          const r = readLine(line);
          let key = keyOf(r.name);
          if (!key) continue;
          let name = r.name;
          const same = SAME.find(([re]) => re.test(key));
          if (same) key = name = same[1];
          const e = byKey[key] = byKey[key] || { key, name, aisle: aisleOf(name, line), parts: {}, loose: false, from: [] };
          if (!e.from.includes(title)) e.from.push(title);
          if (r.qty == null) { e.loose = true; continue; }
          const u = UNITS[r.unit] || ['', '', 1];
          e.parts[u[1]] = (e.parts[u[1]] || 0) + r.qty * u[2] * (it.factor || 1);
        }
      } else if (it.name) {
        // A planned quick dinner: buy it as it is.
        const key = 'ready:' + keyOf(it.name);
        const e = byKey[key] = byKey[key] || { key, name: it.name, emoji: it.emoji, aisle: 'ready', parts: {}, loose: false, from: [], count: 0 };
        e.count++;
      }
    }
    const aisles = AISLES.map(([id, emoji, label]) => ({ id, emoji, label, items: [] }));
    for (const e of Object.values(byKey)) {
      // Cans and grams of the same thing: shops sell cans (about 400 g each).
      if (e.parts.can && e.parts.g) { e.parts.can += e.parts.g / 400; delete e.parts.g; }
      if (e.parts.cup && e.parts.ml) { e.parts.ml += e.parts.cup * 240; delete e.parts.cup; }
      const amount = e.aisle === 'ready' ? (e.count > 1 ? `×${e.count}` : '')
        : Object.entries(e.parts).map(([u, v]) => showAmount(v, u)).join(' + ');
      aisles.find(a => a.id === e.aisle).items.push({ key: e.key, name: e.name, emoji: e.emoji, amount, from: e.from });
    }
    aisles.forEach(a => a.items.sort((x, y) => x.name.localeCompare(y.name)));
    return aisles.filter(a => a.items.length);
  }

  C.shoppingList = shoppingList;
  C.readLine = readLine;
})();
