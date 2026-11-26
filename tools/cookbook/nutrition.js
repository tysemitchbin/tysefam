/* ════════════════════════════════════════════════════════════════
   COOKBOOK: protein and fibre, our two priorities.

   Cook.nutrition(recipe) → { protein, fiber, perServing: { protein, fiber }, serves, assumed,
                              lines: [{ line, protein, fiber }] }
     Each ingredient line is matched to the table below (grams of protein and fibre in 100 g)
     and its amount ("600 g", "2 dl", "1 can", "3 eggs", read the same way as prices.js).
     Per serving = the whole dish ÷ servings (4 if the recipe doesn't say).
   Cook.QUICK  ready-made numbers for quick, non-recipe dinners (hot dogs, frozen pizza…),
               per person, plus a rough price.
   Cook.quickMatch('frozen pizza') → that preset, or null.
   Cook.BREAKFAST / Cook.LUNCH  the same for breakfasts and lunches (brødskiver, matpakke, grøt…),
               and Cook.OUT_DAY for eating out at breakfast/lunch (canteen, café).
   Cook.quickMatch('matpakke', false, 'lunch') looks in the lunch list first, then the dinner one.

   The numbers are typical values (Matvaretabellen / USDA), good enough to compare dinners, not
   lab-exact. If you know a recipe's real numbers, type them in its edit box.

   TABLE columns:
     p, f   grams of protein and fibre in 100 g (as bought: dry pasta, raw meat)
     w      grams in one piece ("3 eggs", "2 chicken breasts"); default 100
     d      kilos per litre, for "2 dl oats" (default 1)
     pack   grams in one can/pack/bunch ("1 can chickpeas" = drained weight); default 400
     serve  grams per serving when no amount is given ("Basmati rice, to serve")
     cooked how much of the dry weight a "cooked" amount is ("2 cups cooked rice")
═════════════════════════════════════════════════════════════════ */
(function () {
  const words = (...list) => new RegExp('(?:^|[^a-zæøåäöüéèáàíóúñç])(?:' + list.join('|') + ')', 'i');

  const TABLE = [
    // ── names that contain another food's name come first ──
    [words('olive oil', 'olivenolje', 'oil\\b', 'olje'), { p: 0, f: 0 }],
    [words('stock', 'broth', 'buljong', 'kraft\\b', 'fond', 'bouillon'), { p: 0.5, f: 0 }],
    [words('fish sauce', 'fiskesaus', 'oyster sauce', 'østerssaus', 'soy sauce', 'soyasaus', 'hoisin', 'teriyaki', 'worcester'), { p: 5, f: 0.5 }],
    [words('coconut milk', 'kokosmelk', 'coconut cream', 'kokoskrem'), { p: 2, f: 0, pack: 400 }],
    [words('peanut butter', 'peanøttsmør'), { p: 25, f: 6 }],
    [words('cottage cheese', 'kesam', 'skyr', 'kvarg', 'quark'), { p: 11, f: 0 }],
    [words('cream cheese', 'kremost', 'philadelphia', 'smøreost'), { p: 6, f: 0 }],
    [words('green bean', 'aspargesbønne', 'french bean'), { p: 1.8, f: 3.4 }],
    [words('baked bean'), { p: 5, f: 4, pack: 415 }],
    [words('garlic powder', 'onion powder', 'hvitløkspulver'), { p: 0, f: 0 }],
    [words('egg noodle', 'eggnudler'), { p: 12, f: 3, serve: 80, cooked: 0.4 }],
    // ── meat & poultry (raw) ──
    [words('chicken breast', 'kyllingfilet', 'kyllingbryst'), { p: 23, f: 0, w: 180 }],
    [words('chicken thigh', 'lårfilet', 'kyllinglår', 'drumstick'), { p: 19, f: 0, w: 110 }],
    [words('whole chicken', 'hel kylling'), { p: 18, f: 0, w: 1400 }],
    [words('chicken', 'kylling', 'turkey', 'kalkun'), { p: 21, f: 0, w: 180 }],
    [words('duck', 'andebryst'), { p: 19, f: 0, w: 250 }],
    [words('bacon'), { p: 13, f: 0, w: 20 }],
    [words('prosciutto', 'parma', 'serrano', 'spekeskinke'), { p: 26, f: 0, w: 15 }],
    [words('ham\\b', 'skinke'), { p: 18, f: 0, w: 30 }],
    [words('chorizo', 'salami', 'pepperoni'), { p: 22, f: 0, w: 60 }],
    [words('sausage', 'pølse', 'medister', 'wiener', 'hot dog'), { p: 12, f: 0, w: 80 }],
    [words('mince\\b', 'ground beef', 'ground pork', 'kjøttdeig', 'karbonadedeig', 'svinedeig', 'meatball', 'kjøttboller', 'kjøttkake'), { p: 18, f: 0, w: 30 }],
    [words('pork', 'svin', 'kotelett', 'ribbe', 'nakke', 'flesk'), { p: 20, f: 0, w: 200 }],
    [words('beef', 'storfe', 'okse', 'steak', 'biff\\b', 'entrecote', 'ytrefilet', 'indrefilet', 'sirloin', 'ribeye', 'chuck', 'brisket', 'gryteskåret', 'veal', 'kalv'), { p: 22, f: 0, w: 200 }],
    [words('lamb', 'lamme', 'fårikål', 'fårekjøtt', 'pinnekjøtt', 'mutton'), { p: 19, f: 0 }],
    [words('reindeer', 'reinsdyr', 'finnbiff', 'reinskav', 'elk', 'elg', 'venison', 'hjort', 'vilt'), { p: 22, f: 0 }],
    // ── fish & shellfish ──
    [words('smoked salmon', 'røkt laks', 'røkelaks', 'gravlaks'), { p: 20, f: 0, w: 30 }],
    [words('salmon', 'laks', 'trout', 'ørret', 'røye'), { p: 20, f: 0, w: 130 }],
    [words('tuna', 'tunfisk'), { p: 25, f: 0, pack: 120 }],
    [words('mackerel', 'makrell', 'herring', 'sild'), { p: 15, f: 0, pack: 170 }],
    [words('fish cake', 'fiskekake', 'fiskebolle', 'fiskepudding', 'fish finger', 'fiskepinne'), { p: 10, f: 0.5, w: 60 }],
    [words('prawn', 'shrimp', 'reke', 'scampi', 'scallop', 'kamskjell', 'mussel', 'blåskjell', 'crab', 'krabbe', 'squid', 'blekksprut', 'lobster', 'hummer'), { p: 19, f: 0, w: 15 }],
    [words('cod', 'torsk', 'skrei', 'haddock', 'hyse', 'sei\\b', 'pollock', 'halibut', 'kveite', 'monkfish', 'breiflabb', 'klippfisk', 'fish', 'fisk'), { p: 18, f: 0, w: 150 }],
    // ── eggs & dairy ──
    [words('egg white', 'eggehvite'), { p: 11, f: 0, w: 33 }],
    [words('egg yolk', 'eggeplomme'), { p: 16, f: 0, w: 17 }],
    [words('eggs?\\b', 'egg(?:e|ene)?\\b'), { p: 13, f: 0, w: 55 }],
    [words('greek yogurt', 'gresk yoghurt', 'protein yogurt'), { p: 9, f: 0 }],
    [words('yogurt', 'yoghurt', 'kefir', 'kulturmelk', 'buttermilk'), { p: 4, f: 0 }],
    [words('sour cream', 'rømme', 'crème fraîche', 'creme fraiche', 'crème fraiche'), { p: 2.5, f: 0 }],
    [words('cream', 'fløte'), { p: 2.2, f: 0 }],
    [words('oat milk', 'havremelk'), { p: 1, f: 0.8 }],
    [words('soy milk', 'soyamelk'), { p: 3.3, f: 0.5 }],
    [words('milk', 'melk'), { p: 3.4, f: 0 }],
    [words('parmesan', 'parmigiano', 'grana', 'pecorino'), { p: 33, f: 0, d: 0.4, serve: 10 }],
    [words('halloumi'), { p: 21, f: 0, pack: 200 }],
    [words('feta'), { p: 15, f: 0, d: 0.5 }],
    [words('mozzarella', 'burrata'), { p: 18, f: 0, pack: 125, w: 125 }],
    [words('paneer'), { p: 18, f: 0 }],
    [words('ricotta', 'mascarpone'), { p: 9, f: 0 }],
    [words('cheddar', 'cheese', 'ost\\b', 'norvegia', 'jarlsberg', 'gruy', 'brie', 'camembert', 'pizzaost', 'revet ost', 'brunost', 'geitost'), { p: 25, f: 0, d: 0.4, serve: 15 }],
    [words('butter\\b', 'smør\\b'), { p: 0.6, f: 0, d: 0.95 }],
    // ── beans, lentils, soy ──
    [words('chickpea', 'kikert'), { p: 7, f: 7, pack: 240, d: 0.65 }],
    [words('kidney bean', 'black bean', 'cannellini', 'butter bean', 'pinto', 'borlotti', 'navy bean', 'white bean', 'bønner', 'beans'), { p: 7.5, f: 6.5, pack: 240, d: 0.65 }],
    [words('dried lentil', 'red lentil', 'green lentil', 'puy lentil', 'lentil', 'linse'), { p: 24, f: 11, d: 0.8, cooked: 0.4 }],
    [words('split pea', 'gule erter', 'erterstuing'), { p: 24, f: 15, d: 0.8 }],
    [words('edamame', 'soybean', 'soyabønne'), { p: 11, f: 5, d: 0.6 }],
    [words('tofu'), { p: 13, f: 1, pack: 300 }],
    [words('tempeh'), { p: 19, f: 5, pack: 200 }],
    [words('seitan'), { p: 25, f: 1 }],
    [words('hummus'), { p: 8, f: 6 }],
    [words('peas\\b', 'erter', 'frozen peas', 'green peas', 'petit pois'), { p: 5, f: 5, d: 0.6 }],
    // ── grains, bread, potatoes (dry / as bought) ──
    [words('brown rice', 'fullkornsris', 'wild rice'), { p: 7.5, f: 3.5, d: 0.8, serve: 75, cooked: 0.4 }],
    [words('basmati', 'jasmine', 'jasminris', 'rice\\b', 'ris\\b', 'arborio', 'risotto rice'), { p: 7, f: 1, d: 0.8, serve: 75, cooked: 0.35 }],
    [words('whole ?wheat pasta', 'wholemeal pasta', 'fullkornspasta', 'fullkorn pasta'), { p: 13, f: 8, serve: 90, cooked: 0.4 }],
    [words('pasta', 'spaghetti', 'penne', 'macaroni', 'makaroni', 'fusilli', 'tagliatelle', 'linguine', 'fettuccine', 'rigatoni', 'orzo', 'lasagne', 'lasagna'), { p: 12, f: 3, serve: 90, cooked: 0.4 }],
    [words('gnocchi'), { p: 4, f: 2, serve: 150 }],
    [words('tortellini', 'ravioli'), { p: 11, f: 2, serve: 125 }],
    [words('noodle', 'nudler', 'ramen', 'udon', 'soba'), { p: 10, f: 3, serve: 80, cooked: 0.4 }],
    [words('couscous'), { p: 13, f: 5, d: 0.7, serve: 70, cooked: 0.4 }],
    [words('bulgur'), { p: 12, f: 12, d: 0.7, serve: 70, cooked: 0.4 }],
    [words('quinoa'), { p: 14, f: 7, d: 0.75, serve: 70, cooked: 0.4 }],
    [words('oats', 'havregryn', 'havre'), { p: 13, f: 10, d: 0.4 }],
    [words('whole ?wheat flour', 'wholemeal flour', 'sammalt', 'grovt mel', 'fullkornsmel', 'rug'), { p: 13, f: 11, d: 0.55 }],
    [words('flour', 'mel\\b', 'hvetemel', 'cornflour', 'cornstarch', 'maizena', 'potetmel'), { p: 10, f: 3, d: 0.55 }],
    [words('breadcrumb', 'panko', 'griljermel'), { p: 12, f: 4, d: 0.4 }],
    [words('tortilla', 'wrap\\b', 'wraps', 'lompe', 'pita', 'naan', 'flatbread'), { p: 8, f: 3, w: 45, serve: 90 }],
    [words('wholegrain bread', 'whole grain bread', 'grovbrød', 'rugbrød', 'knekkebrød', 'crispbread'), { p: 11, f: 8, w: 35, serve: 70 }],
    [words('baguette', 'ciabatta', 'bread', 'brød', 'bun\\b', 'buns\\b', 'roll\\b', 'rolls\\b', 'rundstykke', 'loaf'), { p: 9, f: 3, w: 60, serve: 60 }],
    [words('sweet potato', 'søtpotet'), { p: 1.6, f: 3, w: 300, serve: 200 }],
    [words('potato', 'potet'), { p: 2, f: 1.8, w: 150, serve: 200 }],
    // ── vegetables ──
    [words('kale', 'grønnkål'), { p: 4, f: 4, d: 0.1 }],
    [words('spinach', 'spinat', 'rocket', 'arugula', 'ruccola', 'salad leaves', 'salatblad', 'lettuce', 'salat\\b'), { p: 2.5, f: 2, d: 0.1, pack: 100, w: 300 }],
    [words('broccoli', 'brokkoli'), { p: 2.8, f: 2.6, w: 350 }],
    [words('cauliflower', 'blomkål'), { p: 1.9, f: 2, w: 600 }],
    [words('brussels sprout', 'rosenkål'), { p: 3.4, f: 3.8, w: 15 }],
    [words('cabbage', 'kål\\b', 'rødkål', 'hodekål', 'savoy'), { p: 1.3, f: 2.5, w: 800 }],
    [words('carrot', 'gulrot', 'gulrøtter'), { p: 0.9, f: 2.8, w: 80 }],
    [words('parsnip', 'pastinakk', 'kålrot', 'swede', 'turnip', 'beet', 'rødbet', 'celeriac', 'sellerirot'), { p: 1.4, f: 3, w: 250 }],
    [words('sweetcorn', 'sweet corn', 'corn\\b', 'mais\\b'), { p: 3, f: 2.4, pack: 280 }],
    [words('mushroom', 'sopp', 'champignon', 'portobello', 'shiitake'), { p: 3, f: 1, w: 20, d: 0.3 }],
    [words('bell pepper', 'red pepper', 'green pepper', 'yellow pepper', 'capsicum', 'paprika\\b(?! ?powder)', 'paprikaer'), { p: 1, f: 2, w: 150 }],
    [words('courgette', 'zucchini', 'squash\\b', 'aubergine', 'eggplant'), { p: 1.2, f: 1.5, w: 250 }],
    [words('pumpkin', 'butternut', 'gresskar'), { p: 1, f: 2, w: 1000 }],
    [words('chopped tomatoes', 'canned tomatoes', 'tinned tomatoes', 'hakkede tomater', 'hermetiske tomater', 'passata', 'knuste tomater'), { p: 1.2, f: 1.5, pack: 400, w: 400 }],
    [words('tomato paste', 'tomato purée', 'tomato puree', 'tomatpuré'), { p: 4, f: 4, pack: 130 }],
    [words('cherry tomato', 'cherrytomat'), { p: 0.9, f: 1.2, w: 15 }],
    [words('tomato', 'tomat'), { p: 0.9, f: 1.2, w: 100 }],
    [words('avocado'), { p: 2, f: 7, w: 150 }],
    [words('asparagus', 'asparges'), { p: 2.2, f: 2.1, w: 20 }],
    [words('leek', 'purre'), { p: 1.5, f: 1.8, w: 200 }],
    [words('celery', 'stangselleri', 'selleri'), { p: 0.7, f: 1.6, w: 40 }],
    [words('cucumber', 'agurk'), { p: 0.6, f: 0.5, w: 350 }],
    [words('spring onion', 'scallion', 'vårløk'), { p: 1.8, f: 2.6, w: 15 }],
    [words('shallot', 'sjalott'), { p: 2.5, f: 3.2, w: 40 }],
    [words('onion', 'løk\\b', 'rødløk', 'gul løk'), { p: 1.1, f: 1.7, w: 150 }],
    [words('garlic', 'hvitløk', 'fedd'), { p: 6, f: 2, w: 5 }],
    [words('ginger', 'ingefær'), { p: 1.8, f: 2, w: 20 }],
    [words('chilli', 'chili', 'jalape'), { p: 2, f: 1.5, w: 15 }],
    [words('olive', 'oliven'), { p: 1, f: 3 }],
    [words('kimchi', 'sauerkraut', 'surkål'), { p: 1.5, f: 2.5 }],
    // ── nuts, seeds ──
    [words('chia'), { p: 17, f: 34, d: 0.6 }],
    [words('linseed', 'flaxseed', 'linfrø'), { p: 18, f: 27, d: 0.6 }],
    [words('pumpkin seed', 'gresskarkjerne', 'sunflower seed', 'solsikkekjerne', 'sesame', 'sesam', 'seeds', 'frø'), { p: 20, f: 8, d: 0.6 }],
    [words('tahini'), { p: 17, f: 9 }],
    [words('almond', 'mandel', 'mandler', 'cashew', 'walnut', 'valnøtt', 'pecan', 'hazelnut', 'hasselnøtt', 'peanut', 'peanøtt', 'pistach', 'pine nut', 'pinjekjerne', 'nuts\\b', 'nøtter'), { p: 20, f: 8, d: 0.55 }],
    // ── fruit ──
    [words('raspberr', 'bringebær', 'blackberr', 'bjørnebær'), { p: 1.2, f: 6.5, d: 0.6 }],
    [words('berries', 'blueberr', 'blåbær', 'strawberr', 'jordbær', 'bær\\b'), { p: 0.7, f: 2.5, d: 0.6 }],
    [words('apple', 'eple', 'pear', 'pære'), { p: 0.3, f: 2.4, w: 150 }],
    [words('banana', 'banan'), { p: 1.1, f: 2.6, w: 120 }],
    [words('dates', 'dadler', 'prune', 'sviske', 'dried apricot', 'raisin', 'rosin'), { p: 2.5, f: 7 }],
    [words('mango', 'pineapple', 'ananas', 'orange', 'appelsin'), { p: 0.8, f: 1.8, w: 200 }],
    [words('cocoa', 'kakao'), { p: 20, f: 33, d: 0.45 }],
    [words('dark chocolate', 'mørk sjokolade', 'chocolate', 'sjokolade'), { p: 7, f: 8, d: 0.6 }],
  ];
  // Things with (practically) no protein or fibre: oil, sugar, salt, spices, water, juice, wine…
  const NOTHING = { p: 0, f: 0 };

  function grams(line, e, serves) {
    const a = window.Cook.amountOf(line);
    const l = line.toLowerCase();
    let g;
    if (a.kg != null) g = a.kg * 1000;
    else if (a.l != null) g = a.l * 1000 * (e.d || 1);
    else if (a.slice != null) g = a.slice * 30;
    else if (a.pack != null) g = a.pack * (e.pack || 400);
    else if (a.n != null) g = a.n * (e.w || 100);
    else g = (e.serve || 0) * serves;                            // "Basmati rice, to serve"
    if (e.cooked && /cooked|kokt|leftover/.test(l)) g *= e.cooked;  // "2 cups cooked rice" = less dry rice
    if (/drained|avrent/.test(l) && a.kg != null && e.pack) g *= 0.6; // a 400 g can is ~240 g drained
    return Math.min(g, 5000);
  }

  function nutrition(r) {
    const C = window.Cook;
    // "Serves 2-3" → 2.5 servings
    const range = String(r.servings || '').match(/(\d+)\s*(?:-|–|to|til)\s*(\d+)/);
    const serves = range ? (+range[1] + +range[2]) / 2 : C.servingsNumber(r.servings) || 4;
    const lines = (r.ingredients || []).filter(l => !C.isHeading(l)).map(line => {
      const l = line.toLowerCase();
      if (/from the (pan|tray|pot|sheet|oven)|from above|reserved|fra (pannen|langpannen|over)/.test(l)) return { line, protein: 0, fiber: 0 };
      // "1 tsp pul biber (or chili flakes)": only the first ingredient counts.
      const main = l.replace(/\([^)]*\)/g, ' ').split(/\s+or\s+|\s+eller\s+/)[0];
      const hit = TABLE.find(([re]) => re.test(main));
      const e = hit ? hit[1] : NOTHING;
      const g = hit ? grams(main, e, serves) : 0;
      return { line, protein: Math.round(g * e.p) / 100, fiber: Math.round(g * e.f) / 100 };
    });
    if (!lines.length) return null;
    const protein = Math.round(lines.reduce((s, x) => s + x.protein, 0));
    const fiber = Math.round(lines.reduce((s, x) => s + x.fiber, 0));
    return {
      protein, fiber, serves, assumed: !C.servingsNumber(r.servings),
      perServing: { protein: Math.round(protein / serves), fiber: Math.round(fiber / serves) },
      lines,
    };
  }

  /* Quick dinners: [name, emoji, protein g, fibre g, kr — all per person]. Typical values. */
  const QUICK = [
    ['Taco', '🌮', 30, 7, 60, /taco/i],
    ['Frozen pizza', '🍕', 32, 6, 45, /pizza|grandiosa/i],
    ['Hot dogs', '🌭', 16, 2, 25, /hot ?dog|pølse(r)?( i (brød|lompe))?|wiener/i],
    ['Fish fingers and potatoes', '🐟', 20, 5, 35, /fish ?finger|fiskepinne/i],
    ['Fiskekaker with potatoes', '🐟', 20, 5, 40, /fiskekake|fish ?cake/i],
    ['Pasta with pesto', '🍝', 15, 4, 20, /pesto/i],
    ['Chicken nuggets', '🍗', 25, 2, 40, /nugget/i],
    ['Sandwiches / toast', '🥪', 18, 5, 20, /sandwich|toast|smørbrød|brødskive/i],
    ['Omelette', '🍳', 22, 1, 15, /omelet|eggerøre|scrambled|eggs?\b/i],
    ['Instant noodles', '🍜', 9, 2, 10, /instant|nudler|noodle|mr\.? ?lee/i],
    ['Frozen lasagne', '🧀', 25, 4, 45, /lasagn/i],
    ['Soup from a packet', '🥣', 6, 3, 15, /soup|suppe/i],
    ['Pancakes', '🥞', 15, 2, 20, /pancake|pannekake|lapper|sveler/i],
    ['Burgers at home', '🍔', 30, 3, 50, /burger/i],
    ['Wraps', '🌯', 25, 5, 40, /wrap/i],
    ['Rice porridge (grøt)', '🍚', 10, 1, 12, /grøt|porridge/i],
    ['Yoghurt and muesli', '🥣', 15, 6, 15, /yog|muesli|granola|frokostblanding/i],
  ];
  const OUT = [
    ['Kebab', '🥙', 35, 5, 150, /kebab|shawarma|döner/i],
    ['Sushi', '🍣', 25, 3, 250, /sushi/i],
    ['Pizza (restaurant)', '🍕', 35, 6, 200, /pizza/i],
    ['Burger (restaurant)', '🍔', 35, 4, 200, /burger/i],
    ['Thai / Indian takeaway', '🍛', 30, 6, 200, /thai|indian|curry|indisk/i],
    ['Chinese takeaway', '🥡', 28, 4, 180, /chinese|kinesisk|wok/i],
  ];
  /* Breakfasts and lunches, the same columns (per person). */
  const BREAKFAST = [
    ['Brødskiver with pålegg', '🍞', 18, 6, 15, /brødskive|skiver|pålegg|open sandwich|grovbrød/i],
    ['Havregrøt (oatmeal)', '🥣', 12, 6, 8, /havregrøt|oat|porridge|grøt/i],
    ['Yoghurt and muesli', '🥣', 15, 6, 15, /yog|muesli|granola/i],
    ['Skyr with berries', '🫐', 20, 3, 20, /skyr|kvarg|cottage/i],
    ['Eggs and toast', '🍳', 20, 3, 15, /eggs?\b|omelet|scrambled|eggerøre|speilegg/i],
    ['Cereal and milk', '🥛', 10, 3, 10, /cereal|corn ?flakes|cheerios|frokostblanding/i],
    ['Knekkebrød with pålegg', '🧀', 14, 7, 12, /knekkebrød|crispbread|wasa|ryvita/i],
    ['Smoothie', '🥤', 8, 5, 20, /smoothie/i],
    ['Pancakes', '🥞', 15, 2, 20, /pancake|pannekake|lapper|sveler/i],
  ];
  const LUNCH = [
    ['Matpakke (packed sandwiches)', '🥪', 18, 6, 20, /matpakke|packed/i],
    ['Sandwiches / toast', '🥪', 18, 5, 20, /sandwich|toast|smørbrød|brødskive/i],
    ['Knekkebrød with pålegg', '🧀', 14, 7, 12, /knekkebrød|crispbread|wasa|ryvita/i],
    ['Soup', '🥣', 10, 4, 25, /soup|suppe/i],
    ['Salad', '🥗', 15, 5, 40, /salad|salat/i],
    ['Wraps', '🌯', 25, 5, 40, /wrap/i],
    ['Omelette', '🍳', 22, 1, 15, /omelet|eggerøre|scrambled|eggs?\b/i],
    ['Yoghurt and muesli', '🥣', 15, 6, 15, /yog|muesli|granola/i],
    ['Instant noodles', '🍜', 9, 2, 10, /instant|nudler|noodle|mr\.? ?lee/i],
  ];
  // Eating out at breakfast or lunch (the dinner list above is offered after these).
  const OUT_DAY = [
    ['Canteen (kantine)', '🍽️', 25, 5, 80, /kantine|canteen|cafeteria/i],
    ['Café / bakery', '☕', 15, 3, 120, /caf[eé]|bakery|bakeri|baguette|bolle|kanelsnurr/i],
  ];
  const toObj = ([name, emoji, protein, fiber, kr]) => ({ name, emoji, protein, fiber, kr });
  // slot: 'breakfast' | 'lunch' | 'dinner' (or nothing = dinner). That meal's own list is searched first.
  const quickMatch = (text, out, slot) => {
    const t = String(text || '').trim();
    if (!t) return null;
    const day = slot === 'breakfast' || slot === 'lunch';
    const lists = out ? (day ? [OUT_DAY, OUT] : [OUT])
      : slot === 'breakfast' ? [BREAKFAST, QUICK] : slot === 'lunch' ? [LUNCH, QUICK] : [QUICK];
    for (const list of lists) {
      const hit = list.find(q => q[0].toLowerCase() === t.toLowerCase()) || list.find(q => q[5].test(t));
      if (hit) return toObj(hit);
    }
    return null;
  };

  window.Cook.nutrition = nutrition;
  window.Cook.QUICK = QUICK.map(toObj);
  window.Cook.OUT = OUT.map(toObj);
  window.Cook.BREAKFAST = BREAKFAST.map(toObj);
  window.Cook.LUNCH = LUNCH.map(toObj);
  window.Cook.OUT_DAY = OUT_DAY.map(toObj);
  window.Cook.quickMatch = quickMatch;
})();
