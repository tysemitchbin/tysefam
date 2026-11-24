/* ════════════════════════════════════════════════════════════════
   COOKBOOK: what a dish costs, in Norwegian kroner.

   Each ingredient line is matched to a typical Norwegian supermarket price (below) and the
   amount in the line ("600 g", "2 dl", "3 onions", "1 can"…). The cost is for what goes
   INTO the dish as the recipe is written (half a tub of cream counts as half a tub), so it
   can come out a bit lower than the shopping bill when you have to buy whole packs.

   Cook.price(recipe) → { total, perServing, lines: [{ line, kr, known }], unknown }
   The page uses the total to put the recipe in a cost group (under 100 kr, 100–200 kr…).
   If you know what it really costs, type it in the edit box and that's used instead.

   PRICES: update these now and then. Rough 2026 prices at Rema/Kiwi/Meny.
     kg / l / each   price in kr per kilo, per litre, or per piece (or pack/can)
     w               grams in one piece (for "3 onions" when the price is per kg)
     d               kilos per litre (for "2 cups flour" when the price is per kg; default 1)
     def             kr when the line has no amount at all ("salt and pepper", "oil for frying")
   The first line that matches wins, so specific things come before general ones.
═════════════════════════════════════════════════════════════════ */
(function () {
  const words = (...list) => new RegExp('(?:^|[^a-zæøåäöüéèáàíóúñç])(?:' + list.join('|') + ')', 'i');

  const PRICES = [
    // ── things whose names contain a meat or fish word (so "chicken stock" isn't priced as chicken) ──
    [words('stock cube', 'buljongterning', 'bouillon cube', 'buljong', 'stock', 'broth', 'kraft\\b', 'fond'), { l: 20, each: 3 }],
    [words('fish sauce', 'fiskesaus'), { l: 100, def: 2 }],
    [words('oyster sauce', 'østerssaus', 'hoisin', 'teriyaki'), { l: 130, def: 4 }],
    // ── chicken & other birds ──
    [words('chicken breast', 'kyllingfilet', 'kyllingbryst'), { kg: 150, w: 180 }],
    [words('chicken thigh', 'lårfilet', 'kyllinglår', 'kyllinglårfilet', 'drumstick'), { kg: 130, w: 110 }],
    [words('whole chicken', 'hel kylling'), { kg: 75, each: 110 }],
    [words('chicken wing', 'kyllingving'), { kg: 90 }],
    [words('chicken', 'kylling'), { kg: 140, w: 180, def: 60 }],
    [words('duck', 'andebryst', 'andelår'), { kg: 350, w: 250 }],
    [words('turkey', 'kalkun'), { kg: 150 }],
    // ── pork (before beef, so "pork tenderloin" isn't priced as beef fillet) ──
    [words('pork mince', 'ground pork', 'svinekjøttdeig', 'svinedeig'), { kg: 100 }],
    [words('pork tenderloin', 'pork fillet', 'svinefilet', 'svinemørbrad', 'indrefilet av svin'), { kg: 220, w: 450 }],
    [words('bacon'), { kg: 160, w: 20, def: 30 }],
    [words('prosciutto', 'parma', 'serrano', 'spekeskinke'), { kg: 500, w: 15 }],
    [words('ham\\b', 'skinke'), { kg: 200, w: 30 }],
    [words('chorizo', 'salami', 'pepperoni'), { kg: 220, w: 60 }],
    [words('sausage', 'pølse', 'medister', 'bratwurst', 'wiener'), { kg: 150, w: 80 }],
    [words('pork chop', 'kotelett', 'nakkekotelett'), { kg: 130, w: 200 }],
    [words('pork belly', 'ribbe', 'sideflesk', 'pork shoulder', 'nakke', 'pulled pork', 'svinenakke', 'spareribs'), { kg: 110 }],
    [words('pork', 'svin'), { kg: 150, w: 200 }],
    // ── beef ──
    [words('mince\\b', 'ground beef', 'kjøttdeig', 'karbonadedeig', 'hamburger meat', 'kjøttboller', 'meatball'), { kg: 140 }],
    [words('tenderloin', 'fillet steak', 'filet mignon', 'indrefilet'), { kg: 600, w: 200 }],
    [words('entrecote', 'ribeye', 'rib-eye', 'sirloin', 'ytrefilet', 'striploin', 'steak', 'biff\\b', 'biffer'), { kg: 400, w: 250 }],
    [words('chuck', 'stewing', 'gryteskåret', 'brisket', 'short rib', 'oxtail', 'grytekjøtt', 'høyrygg', 'bog\\b'), { kg: 230 }],
    [words('veal', 'kalv'), { kg: 350 }],
    [words('beef', 'storfe', 'okse'), { kg: 250, w: 200 }],
    // ── lamb & game ──
    [words('pinnekjøtt'), { kg: 300 }],
    [words('lamb mince', 'lammekjøttdeig'), { kg: 200 }],
    [words('lamb chop', 'lammekotelett', 'lammeracks?', 'rack of lamb'), { kg: 350, w: 100 }],
    [words('lamb', 'lamme', 'fårikål', 'fårekjøtt', 'mutton'), { kg: 250 }],
    [words('finnbiff', 'reinskav'), { kg: 400 }],
    [words('reindeer', 'reinsdyr'), { kg: 600 }],
    [words('elk', 'moose', 'elg'), { kg: 400 }],
    [words('venison', 'hjort'), { kg: 450 }],
    // ── fish & shellfish ──
    [words('smoked salmon', 'røkt laks', 'røkelaks', 'gravlaks'), { kg: 450, w: 30 }],
    [words('salmon', 'laks'), { kg: 250, w: 130 }],
    [words('tuna steak', 'fresh tuna'), { kg: 400, w: 150 }],
    [words('tuna', 'tunfisk'), { each: 25, w: 120 }],
    [words('cod', 'torsk', 'skrei', 'klippfisk', 'bacalao'), { kg: 230, w: 150 }],
    [words('haddock', 'hyse', 'pollock', 'sei\\b', 'coley', 'whitefish', 'white fish'), { kg: 170, w: 150 }],
    [words('halibut', 'kveite'), { kg: 350, w: 150 }],
    [words('monkfish', 'breiflabb'), { kg: 400 }],
    [words('trout', 'ørret', 'røye'), { kg: 250, w: 130 }],
    [words('mackerel', 'makrell'), { kg: 100, each: 25 }],
    [words('herring', 'sild'), { each: 40 }],
    [words('fish cake', 'fiskekake', 'fiskebolle', 'fiskepudding'), { kg: 120, w: 60 }],
    [words('peeled prawn', 'peeled shrimp', 'king prawn', 'tiger prawn', 'scampi', 'pillede reker', 'reker i lake'), { kg: 300, w: 15 }],
    [words('prawn', 'shrimp', 'reke'), { kg: 180, w: 15 }],
    [words('scallop', 'kamskjell'), { kg: 700, w: 30 }],
    [words('mussel', 'blåskjell'), { kg: 90 }],
    [words('crab', 'krabbe'), { kg: 200, each: 80 }],
    [words('lobster', 'hummer'), { kg: 600, each: 250 }],
    [words('squid', 'calamari', 'blekksprut'), { kg: 200 }],
    [words('fish', 'fisk'), { kg: 200, w: 150 }],
    // ── eggs & dairy ──
    [words('egg yolk', 'eggeplomme', 'egg white', 'eggehvite'), { each: 4 }],
    [words('eggs?\\b', 'egg(?:e|ene)?\\b'), { each: 4 }],
    [words('buttermilk', 'kulturmelk', 'kefir'), { l: 30 }],
    [words('coconut milk', 'kokosmelk', 'coconut cream', 'kokoskrem'), { l: 50, each: 20, w: 400 }],
    [words('oat milk', 'havremelk', 'soy milk', 'soyamelk', 'almond milk', 'mandelmelk'), { l: 35 }],
    [words('crème fraîche', 'creme fraiche', 'crème fraiche'), { l: 90 }],
    [words('sour cream', 'rømme', 'lettrømme', 'seterrømme'), { l: 60 }],
    [words('cream cheese', 'philadelphia', 'kremost', 'smøreost'), { kg: 110, d: 1 }],
    [words('cream', 'fløte', 'kremfløte', 'matfløte'), { l: 65 }],
    [words('milk', 'melk'), { l: 23 }],
    [words('greek yogurt', 'yogurt', 'yoghurt', 'skyr'), { l: 45 }],
    [words('butter\\b', 'smør\\b', 'meierismør'), { kg: 120, d: 0.95, def: 3 }],
    [words('parmesan', 'parmigiano', 'grana padano', 'pecorino'), { kg: 380, d: 0.4, def: 15 }],
    [words('mozzarella', 'burrata'), { kg: 150, each: 22, w: 125 }],
    [words('feta'), { kg: 170, d: 0.5 }],
    [words('halloumi'), { kg: 220, each: 45, w: 200 }],
    [words('gruy', 'comté', 'emmental'), { kg: 350, d: 0.4 }],
    [words('brie', 'camembert'), { kg: 200, each: 40 }],
    [words('ricotta', 'cottage cheese', 'kesam'), { kg: 110 }],
    [words('mascarpone'), { kg: 150 }],
    [words('paneer'), { kg: 200 }],
    [words('brunost', 'geitost', 'gjetost'), { kg: 150 }],
    [words('cheddar', 'cheese', 'ost\\b', 'norvegia', 'jarlsberg', 'revet ost', 'pizzaost'), { kg: 130, d: 0.4, def: 10 }],
    // ── tins, jars & sauces ──
    [words('chopped tomatoes', 'tinned tomatoes', 'canned tomatoes', 'plum tomatoes', 'hakkede tomater', 'hermetiske tomater', 'tomater på boks', 'passata', 'knuste tomater'), { each: 13, w: 400, l: 33 }],
    [words('tomato paste', 'tomato purée', 'tomato puree', 'tomatpuré', 'tomatpure'), { kg: 100, each: 15, w: 130 }],
    [words('kidney bean', 'black bean', 'chickpea', 'kikert', 'cannellini', 'butter bean', 'baked bean', 'bønner', 'beans'), { each: 15, w: 400, kg: 38 }],
    [words('lentil', 'linse'), { kg: 45, d: 0.8 }],
    [words('soy sauce', 'soyasaus', 'tamari'), { l: 80, def: 2 }],
    [words('mirin', 'rice vinegar', 'risvineddik', 'sake\\b'), { l: 150, def: 3 }],
    [words('curry paste', 'karripasta', 'gochujang', 'miso', 'harissa'), { kg: 300, each: 30, def: 6 }],
    [words('pesto'), { kg: 200, each: 35 }],
    [words('mustard', 'sennep', 'dijon'), { kg: 80, def: 2 }],
    [words('ketchup', 'mayonnaise', 'mayo\\b', 'majones', 'aioli'), { kg: 60, def: 3 }],
    [words('sriracha', 'worcester', 'tabasco', 'hot sauce', 'chilisaus', 'sweet chili'), { l: 150, def: 2 }],
    [words('balsamic', 'balsamico'), { l: 150, def: 2 }],
    [words('vinegar', 'eddik'), { l: 40, def: 1 }],
    [words('olive oil', 'olivenolje'), { l: 130, def: 2 }],
    [words('sesame oil', 'sesamolje'), { l: 200, def: 2 }],
    [words('oil', 'olje', 'rapsolje'), { l: 60, def: 1 }],
    [words('coconut oil', 'kokosolje'), { kg: 150, def: 2 }],
    [words('honey', 'honning'), { kg: 120, d: 1.4, def: 3 }],
    [words('maple syrup', 'lønnesirup'), { l: 400, def: 5 }],
    [words('syrup', 'sirup'), { l: 60 }],
    [words('jam', 'syltetøy'), { kg: 60 }],
    [words('peanut butter', 'peanøttsmør', 'tahini', 'nut butter'), { kg: 120, d: 1 }],
    [words('olive', 'oliven'), { kg: 150, each: 30 }],
    [words('caper', 'kapers'), { each: 30, def: 5 }],
    [words('sun-dried', 'soltørkede'), { kg: 250 }],
    [words('kimchi'), { kg: 150 }],
    // ── dry goods ──
    [words('icing sugar', 'powdered sugar', 'melis'), { kg: 30, d: 0.55 }],
    [words('brown sugar', 'brunt sukker', 'muscovado'), { kg: 40, d: 0.85 }],
    [words('sugar', 'sukker'), { kg: 25, d: 0.85 }],
    [words('flour', 'mel\\b', 'hvetemel', 'sammalt', 'maizena', 'cornstarch', 'cornflour', 'potetmel'), { kg: 15, d: 0.55 }],
    [words('oats', 'havregryn', 'havre'), { kg: 25, d: 0.4 }],
    [words('rice noodle', 'risnudler', 'egg noodle', 'noodle', 'nudler', 'ramen', 'udon', 'soba'), { kg: 70, w: 100 }],
    [words('basmati', 'jasmine rice', 'jasminris', 'rice\\b', 'ris\\b', 'risotto rice', 'arborio'), { kg: 40, d: 0.8, def: 8 }],
    [words('couscous', 'bulgur'), { kg: 50, d: 0.7 }],
    [words('quinoa'), { kg: 90, d: 0.75 }],
    [words('pasta', 'spaghetti', 'penne', 'macaroni', 'makaroni', 'fusilli', 'tagliatelle', 'linguine', 'fettuccine', 'rigatoni', 'orzo', 'lasagne', 'lasagna', 'tortellini', 'ravioli', 'gnocchi'), { kg: 35, d: 0.5, def: 10 }],
    [words('tortilla', 'wrap\\b', 'wraps', 'lompe', 'pita', 'naan', 'flatbread', 'flatbrød'), { each: 5 }],
    [words('breadcrumb', 'panko', 'griljermel', 'brødsmuler'), { kg: 60, d: 0.4 }],
    [words('burger bun', 'hamburgerbrød', 'bun\\b', 'buns\\b', 'roll\\b', 'rolls\\b', 'rundstykke'), { each: 7 }],
    [words('baguette', 'ciabatta', 'bread', 'brød', 'sourdough', 'loaf'), { each: 35, slice: 3 }],
    [words('yeast', 'gjær'), { each: 4, def: 4 }],
    [words('baking powder', 'bakepulver', 'baking soda', 'bicarbonate', 'natron', 'vanilla sugar', 'vaniljesukker', 'cream of tartar'), { l: 100, def: 1 }],
    [words('vanilla pod', 'vanilla bean', 'vaniljestang'), { each: 25 }],
    [words('vanilla', 'vanilje'), { l: 1500, def: 5 }],
    [words('chocolate chip', 'sjokoladebiter', 'chocolate', 'sjokolade'), { kg: 160, d: 0.6 }],
    [words('cocoa', 'kakao'), { kg: 120, d: 0.45 }],
    [words('pine nut', 'pinjekjerne'), { kg: 500, d: 0.55 }],
    [words('almond', 'mandel', 'mandler', 'cashew', 'walnut', 'valnøtt', 'pecan', 'hazelnut', 'hasselnøtt', 'peanut', 'peanøtt', 'pistach', 'nuts\\b', 'nøtter'), { kg: 160, d: 0.55 }],
    [words('sesame seed', 'sesamfrø', 'chia', 'linfrø', 'flaxseed', 'seeds', 'frø'), { kg: 120, d: 0.6 }],
    [words('raisin', 'rosin', 'dried fruit', 'tørket frukt', 'dates', 'dadler', 'apricot'), { kg: 80 }],
    [words('gelatin', 'gelatine', 'husblas'), { each: 2 }],
    [words('tofu'), { kg: 100, each: 30, w: 300 }],
    [words('tempeh', 'seitan'), { kg: 150 }],
    // ── drinks ──
    [words('red wine', 'white wine', 'rødvin', 'hvitvin', 'wine', 'vin\\b'), { l: 180 }],
    [words('beer', 'øl\\b', 'pilsner', 'ale\\b', 'stout'), { l: 60, each: 30 }],
    [words('brandy', 'cognac', 'rum\\b', 'whisky', 'vodka', 'port\\b', 'sherry'), { l: 500, def: 15 }],
    // ── vegetables ──
    [words('sweet potato', 'søtpotet'), { kg: 40, w: 300 }],
    [words('potato', 'potet'), { kg: 20, w: 150 }],
    [words('spring onion', 'scallion', 'green onion', 'vårløk'), { each: 3 }],
    [words('shallot', 'sjalott'), { kg: 60, w: 40 }],
    [words('red onion', 'rødløk'), { kg: 30, w: 150 }],
    [words('onion', 'løk\\b', 'gul løk'), { kg: 20, w: 150 }],
    [words('garlic', 'hvitløk', 'fedd'), { each: 1.5, def: 2 }],
    [words('ginger', 'ingefær'), { kg: 70, w: 30, d: 0.6 }],
    [words('carrot', 'gulrot', 'gulrøtter'), { kg: 20, w: 80 }],
    [words('parsnip', 'pastinakk', 'kålrot', 'swede', 'turnip', 'beetroot', 'rødbet', 'celeriac', 'sellerirot'), { kg: 30, w: 250 }],
    [words('celery', 'stangselleri', 'selleri'), { each: 4 }],
    [words('leek', 'purre'), { each: 15 }],
    [words('bell pepper', 'red pepper', 'green pepper', 'yellow pepper', 'capsicum', 'paprika\\b(?! ?powder)', 'paprikaer'), { each: 13 }],
    [words('chilli', 'chili', 'jalape'), { each: 4 }],
    [words('cherry tomato', 'cherrytomat', 'grape tomato'), { kg: 80, w: 15 }],
    [words('tomato', 'tomat'), { kg: 50, w: 100 }],
    [words('cucumber', 'agurk'), { each: 15 }],
    [words('lettuce', 'romaine', 'isberg', 'heart of', 'salathode', 'hjertesalat'), { each: 25 }],
    [words('spinach', 'spinat', 'rocket', 'arugula', 'ruccola', 'salad leaves', 'salatblad', 'kale', 'grønnkål'), { kg: 150, d: 0.1, each: 30, def: 15 }],
    [words('red cabbage', 'rødkål'), { kg: 25, each: 30 }],
    [words('cabbage', 'hodekål', 'kål\\b', 'savoy'), { kg: 20, each: 30 }],
    [words('broccoli', 'brokkoli'), { each: 25, kg: 60 }],
    [words('cauliflower', 'blomkål'), { each: 30 }],
    [words('courgette', 'zucchini', 'squash\\b'), { each: 15 }],
    [words('aubergine', 'eggplant'), { each: 20 }],
    [words('pumpkin', 'butternut', 'gresskar'), { kg: 30, each: 40 }],
    [words('mushroom', 'sopp', 'champignon', 'portobello', 'shiitake'), { kg: 90, w: 20, d: 0.3 }],
    [words('avocado'), { each: 15 }],
    [words('sweetcorn', 'sweet corn', 'corn\\b', 'mais\\b'), { each: 15, w: 300, kg: 50 }],
    [words('frozen peas', 'peas\\b', 'erter', 'grønne erter', 'edamame'), { kg: 40, d: 0.6 }],
    [words('green bean', 'aspargesbønne', 'sugar snap', 'sukkererter', 'mangetout'), { kg: 90 }],
    [words('asparagus', 'asparges'), { kg: 150, each: 50 }],
    [words('bean sprout', 'bønnespirer'), { kg: 80 }],
    // ── fruit ──
    [words('lemon', 'sitron'), { each: 7 }],
    [words('lime'), { each: 6 }],
    [words('orange', 'appelsin'), { each: 5 }],
    [words('apple', 'eple'), { each: 5, w: 150 }],
    [words('banana', 'banan'), { each: 3 }],
    [words('pear', 'pære'), { each: 6 }],
    [words('mango'), { each: 20 }],
    [words('pineapple', 'ananas'), { each: 30 }],
    [words('berries', 'blueberr', 'blåbær', 'strawberr', 'jordbær', 'raspberr', 'bringebær', 'bær\\b'), { kg: 120, d: 0.6 }],
    // ── herbs & spices ──
    [words('parsley', 'persille', 'coriander leaves', 'fresh coriander', 'cilantro', 'basil', 'basilikum', 'dill', 'mint', 'chives', 'gressløk', 'fresh thyme', 'fresh rosemary', 'frisk'), { each: 25, def: 12 }],
    [words('salt', 'pepper\\b', 'black pepper', 'sort pepper', 'pepper,', 'kvernet pepper'), { l: 40, def: 0.5 }],
    [words('cumin', 'spisskummen', 'paprika powder', 'smoked paprika', 'paprikapulver', 'chili flakes', 'chiliflak', 'cayenne', 'cinnamon', 'kanel',
      'turmeric', 'gurkemeie', 'garam masala', 'curry powder', 'karri', 'oregano', 'thyme', 'timian', 'rosemary', 'rosmarin', 'cardamom', 'kardemomme',
      'nutmeg', 'muskat', 'clove', 'nellik', 'coriander', 'koriander', 'five spice', 'fem krydder', 'bay lea', 'laurbær', 'allspice', 'allehånde',
      'ginger powder', 'spice', 'krydder', 'seasoning', 'italian herbs', 'dried herbs', 'herbs', 'urter', 'star anise', 'stjerneanis', 'fennel seed', 'saffron', 'safran'),
      { l: 400, def: 2 }],
    [words('water', 'vann\\b', 'ice cube', 'isbit'), { l: 0, def: 0 }],
  ];
  const UNKNOWN = { kg: 60, def: 8 };

  /* ───────── reading the amount ───────── */
  // unit → [what it measures, how much of that]
  const UNIT = {
    g: ['kg', 0.001], gr: ['kg', 0.001], gram: ['kg', 0.001], grams: ['kg', 0.001], kg: ['kg', 1], kilo: ['kg', 1],
    lb: ['kg', 0.454], lbs: ['kg', 0.454], pound: ['kg', 0.454], pounds: ['kg', 0.454], oz: ['kg', 0.0283], ounce: ['kg', 0.0283], ounces: ['kg', 0.0283],
    ml: ['l', 0.001], cl: ['l', 0.01], dl: ['l', 0.1], l: ['l', 1], liter: ['l', 1], litre: ['l', 1], liters: ['l', 1], litres: ['l', 1],
    cup: ['l', 0.24], cups: ['l', 0.24], tbsp: ['l', 0.015], tbs: ['l', 0.015], tablespoon: ['l', 0.015], tablespoons: ['l', 0.015], ss: ['l', 0.015], spiseskje: ['l', 0.015],
    tsp: ['l', 0.005], teaspoon: ['l', 0.005], teaspoons: ['l', 0.005], ts: ['l', 0.005], teskje: ['l', 0.005], krm: ['l', 0.001],
    pinch: ['l', 0.0005], klype: ['l', 0.0005], dash: ['l', 0.0005], splash: ['l', 0.01], skvett: ['l', 0.01],
    can: ['pack', 1], cans: ['pack', 1], tin: ['pack', 1], tins: ['pack', 1], boks: ['pack', 1], bokser: ['pack', 1], jar: ['pack', 1], jars: ['pack', 1],
    glass: ['pack', 1], pack: ['pack', 1], packs: ['pack', 1], packet: ['pack', 1], packets: ['pack', 1], pakke: ['pack', 1], pakker: ['pack', 1], pk: ['pack', 1],
    pose: ['pack', 1], poser: ['pack', 1], bag: ['pack', 1], bunch: ['pack', 1], bunches: ['pack', 1], bunt: ['pack', 1], neve: ['pack', 0.5], handful: ['pack', 0.5],
    head: ['pack', 1], heads: ['pack', 1], hode: ['pack', 1], pot: ['pack', 1], potte: ['pack', 1], beger: ['pack', 1], tub: ['pack', 1], carton: ['pack', 1], kartong: ['pack', 1],
    slice: ['slice', 1], slices: ['slice', 1], skive: ['slice', 1], skiver: ['slice', 1],
  };
  const FRAC = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 };
  function num(s) {
    s = String(s || '').trim();
    let m;
    if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3];
    if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
    if ((m = s.match(/^(\d*)\s*([¼½¾⅓⅔⅛])$/))) return (+m[1] || 0) + FRAC[m[2]];
    if (/^(a|an|one|en|ett|ei)$/i.test(s)) return 1;
    return parseFloat(s.replace(',', '.'));
  }
  const AMOUNT = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\s*[¼½¾⅓⅔⅛]|\d+(?:[.,]\d+)?|an?|one|en|ett|ei)(?:\s*(?:-|–|to|til)\s*(\d+(?:[.,]\d+)?))?\s*(?:x\s*(\d+(?:[.,]\d+)?)\s*)?([a-zæøå]+)?\.?/i;
  // "2 x 400 g cans" → { kg: 0.8 },  "3 dl cream" → { l: 0.3 },  "2 onions" → { n: 2 },  "1 can" → { pack: 1 }
  function amountOf(line) {
    const l = line.toLowerCase().replace(/^[^\w¼½¾⅓⅔⅛]+/, '');
    let m = l.match(AMOUNT);
    if (m) {
      let n = num(m[1]);
      if (m[2]) n = (n + num(m[2])) / 2;                       // "2-3" → 2.5
      if (m[3]) {                                              // "2 x 400 g"
        const u = UNIT[m[4]];
        const each = num(m[3]);
        return u ? { [u[0]]: n * each * u[1] } : { n: n * each };
      }
      const u = m[4] && UNIT[m[4]];
      if (u) {
        // "1 can (400 g)": a can, but the grams say how big it is
        const inner = l.match(/\((?:about |ca\.? )?(\d+(?:[.,]\d+)?)\s*(g|kg|ml|dl|l)\)/);
        if (u[0] === 'pack' && inner) { const iu = UNIT[inner[2]]; return { [iu[0]]: n * num(inner[1]) * iu[1], pack: n }; }
        return { [u[0]]: n * u[1] };
      }
      if (isFinite(n)) return { n };
    }
    // An amount somewhere else in the line: "Chicken thighs (about 600 g)", "juice of 1 lemon".
    m = l.match(/(\d+(?:[.,]\d+)?)\s*(g|kg|ml|cl|dl|l|lb|oz)\b/);
    if (m) { const u = UNIT[m[2]]; return { [u[0]]: num(m[1]) * u[1] }; }
    m = l.match(/\bof\s+(\d+\/\d+|\d+|an?|one|½)\s/);
    if (m) return { n: num(m[1]) };
    return {};
  }

  // What one ingredient line costs.
  function lineCost(line) {
    const l = line.toLowerCase();
    // "1 roasted pepper from the pan", "the reserved sauce": already counted earlier in the recipe.
    if (/from the (pan|tray|pot|sheet|oven)|from above|reserved|fra (pannen|langpannen|over)|fra kjelen/.test(l)) return { line, kr: 0, known: true };
    const hit = PRICES.find(([re]) => re.test(l));
    const p = hit ? hit[1] : UNKNOWN;
    const a = amountOf(line);
    let kr;
    if (a.kg != null) kr = p.kg ? a.kg * p.kg : p.l != null ? a.kg * p.l : p.each ? a.kg * 1000 / (p.w || 400) * p.each : a.kg * UNKNOWN.kg;
    else if (a.l != null) kr = p.l != null ? a.l * p.l : p.kg ? a.l * (p.d || 1) * p.kg : p.each ? a.l * 1000 / (p.w || 400) * p.each : a.l * UNKNOWN.kg;
    else if (a.slice != null) kr = a.slice * (p.slice || (p.kg ? (p.w || 30) / 1000 * p.kg : 3));
    else if (a.pack != null) kr = a.pack * (p.each || (p.kg ? 0.4 * p.kg : p.l ? 0.5 * p.l : p.def || 15));
    else if (a.n != null) kr = p.each ? a.n * p.each : p.kg ? a.n * (p.w || 100) / 1000 * p.kg : a.n * (p.def || 8);
    else kr = p.def != null ? p.def : p.each || 8;
    kr = Math.min(Math.max(kr, 0), 2000);
    return { line, kr: Math.round(kr * 2) / 2, known: !!hit };
  }

  function price(r) {
    const lines = (r.ingredients || []).filter(l => !window.Cook.isHeading(l)).map(lineCost);
    if (!lines.length) return null;
    const total = Math.round(lines.reduce((s, x) => s + x.kr, 0));
    const serves = window.Cook.servingsNumber(r.servings);
    return { total, perServing: serves ? Math.round(total / serves) : null, lines, unknown: lines.filter(x => !x.known).length };
  }

  window.Cook.price = price;
})();
