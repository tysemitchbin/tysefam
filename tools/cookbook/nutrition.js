/* ════════════════════════════════════════════════════════════════
   COOKBOOK: protein and fibre (our two priorities), and calories.

   Cook.nutrition(recipe) → { protein, fiber, kcal, perServing: { protein, fiber, kcal }, serves, assumed,
                              lines: [{ line, protein, fiber, kcal }] }
     Each ingredient line is matched to the table below (protein, fibre and calories in 100 g)
     and its amount ("600 g", "2 dl", "1 can", "3 eggs", read the same way as prices.js).
     Per serving = the whole dish ÷ servings (4 if the recipe doesn't say).
     A line with no amount: meat and fish count as a normal portion each ("Salmon" = 150 g × servings),
     rice/pasta/bread "to serve" too; "Bacon (optional)" with no amount isn't counted.
   Cook.QUICK  ready-made numbers for quick, non-recipe dinners (hot dogs, frozen pizza…),
               per person, plus a rough price.
   Cook.quickMatch('frozen pizza') → that preset, or null.
   Cook.BREAKFAST / Cook.LUNCH  the same for breakfasts and lunches (brødskiver, matpakke, grøt…),
               and Cook.OUT_DAY for eating out at breakfast/lunch (canteen, café).
   Cook.quickMatch('matpakke', false, 'lunch') looks in the lunch list first, then the dinner one.

   The numbers are typical values (Matvaretabellen / USDA), good enough to compare dinners, not
   lab-exact. If you know a recipe's real numbers, type them in its edit box.

   TABLE columns:
     p, f, k  grams of protein and fibre, and kcal, in 100 g (as bought: dry pasta, raw meat)
     w      grams in one piece ("3 eggs", "2 chicken breasts"); default 100
     d      kilos per litre, for "2 dl oats" (default 1)
     pack   grams in one can/pack/bunch ("1 can chickpeas" = drained weight); default 400
     serve  grams per serving when no amount is given ("Basmati rice, to serve", "Salmon")
     cooked how much of the dry weight a "cooked" amount is ("2 cups cooked rice")
     bone   share you can eat when it's bought on the bone (a whole turkey)
═════════════════════════════════════════════════════════════════ */
(function () {
  const words = (...list) => new RegExp('(?:^|[^a-zæøåäöüéèáàíóúñç])(?:' + list.join('|') + ')', 'i');

  const TABLE = [
    // ── names that contain another food's name come first ──
    [words('olive oil', 'olivenolje', 'sesame oil', 'coconut oil', 'oil\\b', 'olje'), { p: 0, f: 0, k: 884, d: 0.92 }],
    [words('stock', 'broth', 'buljong', 'kraft\\b', 'fond', 'bouillon'), { p: 0.5, f: 0, k: 5 }],
    [words('fish sauce', 'fiskesaus', 'oyster sauce', 'østerssaus', 'soy sauce', 'soyasaus', 'tamari', 'worcester'), { p: 5, f: 0.5, k: 60 }],
    [words('hoisin', 'teriyaki', 'sweet chili', 'bbq sauce', 'barbecue sauce', 'ketchup'), { p: 1.5, f: 0.5, k: 180 }],
    [words('coconut milk', 'kokosmelk', 'coconut cream', 'kokoskrem'), { p: 2, f: 0, k: 190, pack: 400 }],
    [words('peanut butter', 'peanøttsmør', 'nut butter'), { p: 25, f: 6, k: 590 }],
    [words('cottage cheese', 'kesam', 'skyr', 'kvarg', 'quark'), { p: 11, f: 0, k: 85 }],
    [words('cream cheese', 'kremost', 'philadelphia', 'smøreost'), { p: 6, f: 0, k: 250 }],
    [words('green bean', 'aspargesbønne', 'french bean'), { p: 1.8, f: 3.4, k: 31, d: 0.5 }],
    [words('baked bean'), { p: 5, f: 4, k: 95, pack: 415 }],
    [words('garlic powder', 'onion powder', 'hvitløkspulver'), { p: 0, f: 0, k: 0 }],
    [words('egg noodle', 'eggnudler'), { p: 12, f: 3, k: 380, serve: 80, cooked: 0.4 }],
    [words('mayonnaise', 'mayo\\b', 'majones', 'aioli'), { p: 1, f: 0, k: 680, d: 0.95 }],
    [words('pesto'), { p: 5, f: 2, k: 450 }],
    [words('dark chocolate', 'mørk sjokolade', '70 ?%'), { p: 8, f: 11, k: 580, d: 0.6 }],
    [words('chocolate', 'sjokolade'), { p: 6, f: 4, k: 530, d: 0.6 }],     // before "milk": "dark or milk chocolate"
    [words('cocoa', 'kakao'), { p: 20, f: 33, k: 230, d: 0.45 }],
    // ── meat & poultry (raw) ──
    [words('chicken breast', 'kyllingfilet', 'kyllingbryst'), { p: 23, f: 0, k: 110, w: 180, serve: 150 }],
    [words('chicken thigh', 'thighs?\\b', 'lårfilet', 'kyllinglår', 'drumstick'), { p: 19, f: 0, k: 150, w: 110, serve: 150 }],
    [words('whole chicken', 'hel kylling'), { p: 18, f: 0, k: 215, w: 1400, bone: 0.65 }],
    [words('chicken wing', 'kyllingving'), { p: 18, f: 0, k: 200, bone: 0.6, serve: 250 }],
    [words('turkey breast', 'turkey fillet', 'kalkunfilet', 'kalkunbryst', 'ground turkey', 'turkey mince', 'kalkundeig'), { p: 23, f: 0, k: 115, w: 700, serve: 175 }],
    [words('turkey', 'kalkun'), { p: 20, f: 0, k: 160, w: 5000, bone: 0.65, serve: 400 }],
    [words('chicken', 'kylling'), { p: 21, f: 0, k: 140, w: 180, serve: 150 }],
    [words('duck', 'andebryst'), { p: 19, f: 0, k: 200, w: 250, serve: 200 }],
    [words('bacon'), { p: 13, f: 0, k: 410, w: 20, serve: 40 }],
    [words('prosciutto', 'parma', 'serrano', 'spekeskinke'), { p: 26, f: 0, k: 250, w: 15 }],
    [words('ham\\b', 'skinke'), { p: 18, f: 0, k: 120, w: 30 }],
    [words('chorizo', 'salami', 'pepperoni'), { p: 22, f: 0, k: 420, w: 60 }],
    [words('sausage', 'pølse', 'medister', 'wiener', 'hot dog'), { p: 12, f: 0, k: 260, w: 80, serve: 150 }],
    [words('mince\\b', 'ground beef', 'ground pork', 'kjøttdeig', 'karbonadedeig', 'svinedeig', 'meatball', 'kjøttboller', 'kjøttkake'), { p: 18, f: 0, k: 215, w: 30, serve: 125 }],
    [words('pork', 'svin', 'kotelett', 'ribbe', 'nakke', 'flesk'), { p: 20, f: 0, k: 200, w: 200, serve: 150 }],
    [words('beef', 'storfe', 'okse', 'steak', 'biff\\b', 'entrecote', 'ytrefilet', 'indrefilet', 'sirloin', 'ribeye', 'chuck', 'brisket', 'gryteskåret', 'veal', 'kalv'), { p: 22, f: 0, k: 190, w: 200, serve: 175 }],
    [words('lamb', 'lamme', 'fårikål', 'fårekjøtt', 'pinnekjøtt', 'mutton'), { p: 19, f: 0, k: 250, serve: 250 }],
    [words('reindeer', 'reinsdyr', 'finnbiff', 'reinskav', 'elk', 'elg', 'venison', 'hjort', 'vilt'), { p: 22, f: 0, k: 120, serve: 175 }],
    // ── fish & shellfish ──
    [words('smoked salmon', 'røkt laks', 'røkelaks', 'gravlaks'), { p: 20, f: 0, k: 180, w: 30, serve: 75 }],
    [words('salmon', 'laks', 'trout', 'ørret', 'røye'), { p: 20, f: 0, k: 200, w: 130, serve: 150 }],
    [words('tuna', 'tunfisk'), { p: 25, f: 0, k: 110, pack: 120 }],
    [words('mackerel', 'makrell', 'herring', 'sild'), { p: 15, f: 0, k: 220, pack: 170 }],
    [words('fish cake', 'fiskekake', 'fiskebolle', 'fiskepudding', 'fish finger', 'fiskepinne'), { p: 10, f: 0.5, k: 150, w: 60, serve: 180 }],
    [words('prawn', 'shrimp', 'reke', 'scampi', 'scallop', 'kamskjell', 'mussel', 'blåskjell', 'crab', 'krabbe', 'squid', 'blekksprut', 'lobster', 'hummer'), { p: 19, f: 0, k: 85, w: 15, serve: 150 }],
    [words('cod', 'torsk', 'skrei', 'haddock', 'hyse', 'sei\\b', 'pollock', 'halibut', 'kveite', 'monkfish', 'breiflabb', 'klippfisk', 'fish', 'fisk'), { p: 18, f: 0, k: 80, w: 150, serve: 175 }],
    // ── eggs & dairy ──
    [words('egg white', 'eggehvite'), { p: 11, f: 0, k: 50, w: 33 }],
    [words('egg yolk', 'eggeplomme'), { p: 16, f: 0, k: 320, w: 17 }],
    [words('eggs?\\b', 'egg(?:e|ene)?\\b'), { p: 13, f: 0, k: 145, w: 55 }],
    [words('greek yogurt', 'gresk yoghurt', 'protein yogurt'), { p: 9, f: 0, k: 120 }],
    [words('yogurt', 'yoghurt', 'kefir', 'kulturmelk', 'buttermilk'), { p: 4, f: 0, k: 60 }],
    [words('crème fraîche', 'creme fraiche', 'crème fraiche'), { p: 2.4, f: 0, k: 300 }],
    [words('light sour cream', 'lettrømme'), { p: 3, f: 0, k: 120 }],
    [words('sour cream', 'rømme'), { p: 2.5, f: 0, k: 190 }],
    [words('heavy cream', 'whipping cream', 'double cream', 'kremfløte'), { p: 2.1, f: 0, k: 340 }],
    [words('light cream', 'single cream', 'cooking cream', 'matfløte', 'half and half', 'evaporated milk'), { p: 2.8, f: 0, k: 150 }],
    [words('cream\\b', 'fløte'), { p: 2.2, f: 0, k: 300 }],
    [words('oat milk', 'havremelk'), { p: 1, f: 0.8, k: 45 }],
    [words('soy milk', 'soyamelk'), { p: 3.3, f: 0.5, k: 40 }],
    [words('almond milk', 'mandelmelk'), { p: 0.5, f: 0.3, k: 15 }],
    [words('milk', 'melk'), { p: 3.4, f: 0, k: 55 }],
    [words('parmesan', 'parmigiano', 'grana', 'pecorino'), { p: 33, f: 0, k: 400, d: 0.4, serve: 10 }],
    [words('halloumi'), { p: 21, f: 0, k: 320, pack: 200 }],
    [words('feta'), { p: 15, f: 0, k: 260, d: 0.5 }],
    [words('mozzarella', 'burrata'), { p: 18, f: 0, k: 250, pack: 125, w: 125 }],
    [words('paneer'), { p: 18, f: 0, k: 300 }],
    [words('ricotta'), { p: 9, f: 0, k: 150 }],
    [words('mascarpone'), { p: 5, f: 0, k: 430 }],
    [words('brunost', 'geitost'), { p: 10, f: 0, k: 440 }],
    [words('cheddar', 'cheese', 'ost\\b', 'norvegia', 'jarlsberg', 'gouda', 'gruy', 'brie', 'camembert', 'pizzaost', 'revet ost', 'monterey', 'colby'), { p: 25, f: 0, k: 370, d: 0.4, serve: 15 }],
    [words('butter\\b', 'smør\\b'), { p: 0.6, f: 0, k: 717, d: 0.95 }],
    // ── beans, lentils, soy ──
    [words('chickpea', 'kikert'), { p: 7, f: 7, k: 140, pack: 240, d: 0.65 }],
    [words('kidney bean', 'black bean', 'cannellini', 'butter bean', 'pinto', 'borlotti', 'navy bean', 'white bean', 'bønner', 'beans'), { p: 7.5, f: 6.5, k: 120, pack: 240, d: 0.65 }],
    [words('dried lentil', 'red lentil', 'green lentil', 'puy lentil', 'lentil', 'linse'), { p: 24, f: 11, k: 350, d: 0.8, cooked: 0.4 }],
    [words('split pea', 'gule erter', 'erterstuing'), { p: 24, f: 15, k: 340, d: 0.8 }],
    [words('edamame', 'soybean', 'soyabønne'), { p: 11, f: 5, k: 120, d: 0.6 }],
    [words('tofu'), { p: 13, f: 1, k: 125, pack: 300, serve: 125 }],
    [words('tempeh'), { p: 19, f: 5, k: 190, pack: 200, serve: 125 }],
    [words('seitan'), { p: 25, f: 1, k: 140, serve: 125 }],
    [words('hummus'), { p: 8, f: 6, k: 250 }],
    [words('peas\\b', 'erter', 'frozen peas', 'green peas', 'petit pois'), { p: 5, f: 5, k: 80, d: 0.6 }],
    // ── grains, bread, potatoes (dry / as bought) ──
    [words('brown rice', 'fullkornsris', 'wild rice'), { p: 7.5, f: 3.5, k: 350, d: 0.8, serve: 75, cooked: 0.4 }],
    [words('basmati', 'jasmine', 'jasminris', 'rice\\b', 'ris\\b', 'arborio', 'risotto rice'), { p: 7, f: 1, k: 355, d: 0.8, serve: 75, cooked: 0.35 }],
    [words('whole ?wheat pasta', 'wholemeal pasta', 'fullkornspasta', 'fullkorn pasta'), { p: 13, f: 8, k: 340, serve: 90, cooked: 0.4 }],
    [words('pasta', 'spaghetti', 'penne', 'macaroni', 'makaroni', 'fusilli', 'rotini', 'cavatappi', 'tagliatelle', 'linguine', 'fettuccine', 'rigatoni', 'orzo', 'lasagne', 'lasagna'), { p: 12, f: 3, k: 355, serve: 90, cooked: 0.4 }],
    [words('gnocchi'), { p: 4, f: 2, k: 160, serve: 150 }],
    [words('tortellini', 'ravioli'), { p: 11, f: 2, k: 280, serve: 125 }],
    [words('noodle', 'nudler', 'ramen', 'udon', 'soba'), { p: 7, f: 2, k: 360, serve: 80, cooked: 0.4 }],
    [words('couscous'), { p: 13, f: 5, k: 360, d: 0.7, serve: 70, cooked: 0.4 }],
    [words('bulgur'), { p: 12, f: 12, k: 340, d: 0.7, serve: 70, cooked: 0.4 }],
    [words('quinoa'), { p: 14, f: 7, k: 370, d: 0.75, serve: 70, cooked: 0.4 }],
    [words('farro', 'spelt', 'perlespelt', 'barley', 'byggryn', 'perlebygg'), { p: 13, f: 10, k: 340, d: 0.8, serve: 70, cooked: 0.4 }],
    [words('oats', 'havregryn', 'havre'), { p: 13, f: 10, k: 370, d: 0.4 }],
    [words('whole ?wheat flour', 'wholemeal flour', 'sammalt', 'grovt mel', 'fullkornsmel', 'rug'), { p: 13, f: 11, k: 330, d: 0.55 }],
    [words('flour', 'mel\\b', 'hvetemel'), { p: 10, f: 3, k: 350, d: 0.55 }],
    [words('cornflour', 'cornstarch', 'maizena', 'potetmel'), { p: 0.3, f: 1, k: 360, d: 0.55 }],
    [words('breadcrumb', 'panko', 'griljermel'), { p: 12, f: 4, k: 390, d: 0.4 }],
    [words('tortilla chip', 'nacho'), { p: 7, f: 5, k: 490 }],
    [words('tortilla', 'wrap\\b', 'wraps', 'lompe', 'pita', 'naan', 'flatbread'), { p: 8, f: 3, k: 300, w: 45, serve: 90 }],
    [words('wholegrain bread', 'whole grain bread', 'grovbrød', 'rugbrød', 'knekkebrød', 'crispbread'), { p: 11, f: 8, k: 240, w: 35, serve: 70 }],
    [words('baguette', 'ciabatta', 'bread', 'brød', 'bun\\b', 'buns\\b', 'roll\\b', 'rolls\\b', 'rundstykke', 'loaf'), { p: 9, f: 3, k: 265, w: 60, serve: 60 }],
    [words('sweet potato', 'søtpotet'), { p: 1.6, f: 3, k: 86, w: 300, serve: 200 }],
    [words('potato', 'potet'), { p: 2, f: 1.8, k: 77, w: 150, serve: 200 }],
    // ── vegetables ──
    [words('kale', 'grønnkål'), { p: 4, f: 4, k: 45, d: 0.1 }],
    [words('spinach', 'spinat', 'rocket', 'arugula', 'ruccola', 'salad leaves', 'salatblad', 'lettuce', 'salat\\b'), { p: 2.5, f: 2, k: 23, d: 0.1, pack: 100, w: 300 }],
    [words('broccoli', 'brokkoli'), { p: 2.8, f: 2.6, k: 34, w: 400, d: 0.35 }],
    [words('cauliflower', 'blomkål'), { p: 1.9, f: 2, k: 25, w: 600, d: 0.35 }],
    [words('brussels sprout', 'rosenkål'), { p: 3.4, f: 3.8, k: 43, w: 15, d: 0.4 }],
    [words('cabbage', 'kål\\b', 'rødkål', 'hodekål', 'savoy', 'coleslaw'), { p: 1.3, f: 2.5, k: 25, w: 800, d: 0.3 }],
    [words('carrot', 'gulrot', 'gulrøtter'), { p: 0.9, f: 2.8, k: 41, w: 80, d: 0.5 }],
    [words('parsnip', 'pastinakk', 'kålrot', 'swede', 'turnip', 'beet', 'rødbet', 'celeriac', 'sellerirot'), { p: 1.4, f: 3, k: 50, w: 250 }],
    [words('sweetcorn', 'sweet corn', 'corn\\b', 'mais\\b'), { p: 3, f: 2.4, k: 85, pack: 280, d: 0.6 }],
    [words('mushroom', 'sopp', 'champignon', 'portobello', 'shiitake'), { p: 3, f: 1, k: 22, w: 20, d: 0.3 }],
    [/\b(tsp|tbsp|ts|ss|teaspoons?|tablespoons?|teskje|spiseskje|pinch|klype|dash)\b.*paprika/i, { p: 0, f: 0, k: 0 }],   // paprika by the spoon is the spice
    [words('bell pepper', 'red pepper(?! flake)', 'green pepper', 'yellow pepper', 'capsicum', 'paprika\\b(?! ?powder)', 'paprikaer'), { p: 1, f: 2, k: 30, w: 180 }],
    [words('courgette', 'zucchini', 'squash\\b', 'aubergine', 'eggplant'), { p: 1.2, f: 1.5, k: 20, w: 250 }],
    [words('pumpkin', 'butternut', 'gresskar'), { p: 1, f: 2, k: 40, w: 1000, d: 0.6 }],
    [words('chopped tomatoes', 'diced tomatoes', 'crushed tomatoes', 'canned tomatoes', 'tinned tomatoes', 'hakkede tomater', 'hermetiske tomater', 'passata', 'knuste tomater'), { p: 1.2, f: 1.5, k: 25, pack: 400, w: 400 }],
    [words('tomato paste', 'tomato purée', 'tomato puree', 'tomatpuré'), { p: 4, f: 4, k: 85, pack: 130 }],
    [words('cherry tomato', 'cherrytomat'), { p: 0.9, f: 1.2, k: 20, w: 15, d: 0.6 }],
    [words('tomato', 'tomat'), { p: 0.9, f: 1.2, k: 20, w: 100 }],
    [words('avocado'), { p: 2, f: 7, k: 160, w: 150 }],
    [words('asparagus', 'asparges'), { p: 2.2, f: 2.1, k: 20, w: 20 }],
    [words('leek', 'purre'), { p: 1.5, f: 1.8, k: 30, w: 200 }],
    [words('celery', 'stangselleri', 'selleri'), { p: 0.7, f: 1.6, k: 15, w: 40, pack: 400 }],
    [words('persian cucumber', 'lebanese cucumber', 'mini cucumber', 'snack cucumber', 'snackagurk', 'miniagurk'), { p: 0.6, f: 0.5, k: 12, w: 120 }],
    [words('cucumber', 'agurk'), { p: 0.6, f: 0.5, k: 12, w: 350 }],
    [words('spring onion', 'scallion', 'green onion', 'vårløk'), { p: 1.8, f: 2.6, k: 32, w: 15, pack: 100 }],
    [words('shallot', 'sjalott'), { p: 2.5, f: 3.2, k: 72, w: 40 }],
    [words('onion', 'løk\\b', 'rødløk', 'gul løk'), { p: 1.1, f: 1.7, k: 40, w: 150, d: 0.6 }],
    [words('garlic', 'hvitløk', 'fedd'), { p: 6, f: 2, k: 150, w: 5, pack: 50 }],
    [words('ginger', 'ingefær'), { p: 1.8, f: 2, k: 80, w: 20 }],
    [words('chilli', 'chili', 'jalape'), { p: 2, f: 1.5, k: 40, w: 15 }],
    [words('olive', 'oliven'), { p: 1, f: 3, k: 150 }],
    [words('kimchi', 'sauerkraut', 'surkål'), { p: 1.5, f: 2.5, k: 20 }],
    // ── nuts, seeds ──
    [words('chia'), { p: 17, f: 34, k: 490, d: 0.6 }],
    [words('linseed', 'flaxseed', 'linfrø'), { p: 18, f: 27, k: 530, d: 0.6 }],
    [words('pumpkin seed', 'gresskarkjerne', 'sunflower seed', 'solsikkekjerne', 'sesame', 'sesam', 'seeds', 'frø'), { p: 20, f: 8, k: 570, d: 0.6 }],
    [words('tahini'), { p: 17, f: 9, k: 600 }],
    [words('almond', 'mandel', 'mandler', 'cashew', 'walnut', 'valnøtt', 'pecan', 'hazelnut', 'hasselnøtt', 'peanut', 'peanøtt', 'pistach', 'pine nut', 'pinjekjerne', 'nuts\\b', 'nøtter'), { p: 20, f: 8, k: 600, d: 0.55 }],
    // ── fruit ──
    [words('raspberr', 'bringebær', 'blackberr', 'bjørnebær'), { p: 1.2, f: 6.5, k: 50, d: 0.6 }],
    [words('berries', 'blueberr', 'blåbær', 'strawberr', 'jordbær', 'bær\\b'), { p: 0.7, f: 2.5, k: 50, d: 0.6 }],
    [words('apple', 'eple', 'pear', 'pære'), { p: 0.3, f: 2.4, k: 52, w: 150 }],
    [words('banana', 'banan'), { p: 1.1, f: 2.6, k: 90, w: 120 }],
    [words('dates', 'dadler', 'prune', 'sviske', 'dried apricot', 'raisin', 'rosin', 'dried fruit'), { p: 2.5, f: 7, k: 280 }],
    [words('mango', 'pineapple', 'ananas', 'orange', 'appelsin'), { p: 0.8, f: 1.8, k: 60, w: 200 }],
    [words('lemon juice', 'lime juice', 'sitronsaft', 'limesaft'), { p: 0.4, f: 0.3, k: 22 }],
    [words('orange juice', 'apple juice', 'juice', 'appelsinjuice', 'eplejuice'), { p: 0.6, f: 0.2, k: 45 }],
    // ── sweet things, sauces & drinks: calories but no protein or fibre to speak of ──
    [words('icing sugar', 'powdered sugar', 'melis'), { p: 0, f: 0, k: 400, d: 0.55 }],
    [words('brown sugar', 'brunt sukker', 'muscovado', 'sugar', 'sukker'), { p: 0, f: 0, k: 390, d: 0.85 }],
    [words('honey', 'honning'), { p: 0.3, f: 0, k: 304, d: 1.4 }],
    [words('maple syrup', 'lønnesirup', 'syrup', 'sirup', 'agave'), { p: 0, f: 0, k: 270, d: 1.35 }],
    [words('jam', 'syltetøy', 'marmalade'), { p: 0.4, f: 1, k: 250 }],
    [words('mustard', 'sennep', 'dijon'), { p: 5, f: 3, k: 90 }],
    [words('curry paste', 'karripasta', 'gochujang', 'miso', 'harissa'), { p: 4, f: 3, k: 180 }],
    [words('salsa', 'enchilada sauce', 'tacosaus'), { p: 1.5, f: 1.5, k: 35 }],
    [words('balsamic', 'balsamico'), { p: 0.5, f: 0, k: 90 }],
    [words('red wine', 'white wine', 'rødvin', 'hvitvin', 'wine', 'vin\\b'), { p: 0, f: 0, k: 80 }],
    [words('beer', 'øl\\b', 'pilsner', 'ale\\b', 'stout'), { p: 0.5, f: 0, k: 43 }],
    [words('brandy', 'cognac', 'rum\\b', 'whisky', 'vodka', 'port\\b', 'sherry'), { p: 0, f: 0, k: 230 }],
  ];
  // Things with (practically) nothing: salt, spices, vinegar, water, herbs…
  const NOTHING = { p: 0, f: 0, k: 0 };

  function grams(line, e, serves) {
    const a = window.Cook.amountOf(line);
    const l = line.toLowerCase();
    let g;
    if (a.pack != null && e.pack) g = a.pack * e.pack;          // "1 can (425 g) beans": the drained weight
    else if (a.kg != null) g = a.kg * 1000;
    else if (a.l != null) g = a.l * 1000 * (e.d || 1);
    else if (a.slice != null) g = a.slice * 30;
    else if (a.pack != null) g = a.pack * (e.pack || 400);
    else if (a.n != null) g = a.n * (e.w || 100);
    else g = (e.serve || 0) * serves;                            // "Basmati rice, to serve", "Salmon"
    if (e.cooked && /\bcooked\b|kokt|leftover|rester/.test(l)) g *= e.cooked;  // "2 cups cooked rice" = less dry rice
    if (/drained|avrent/.test(l) && a.kg != null && e.pack) g *= 0.6; // a 400 g can is ~240 g drained
    if (e.bone || /bone-in|bone in|with bones?|på bein|med bein|skin-on/.test(l)) g *= e.bone || 0.75;  // the bones aren't eaten
    return Math.min(g, 12000);
  }

  function nutrition(r) {
    const C = window.Cook;
    // "Serves 2-3" → 2.5 servings
    const range = String(r.servings || '').match(/(\d+)\s*(?:-|–|to|til)\s*(\d+)/);
    const serves = range ? (+range[1] + +range[2]) / 2 : C.servingsNumber(r.servings) || 4;
    const lines = (r.ingredients || []).filter(l => !C.isHeading(l)).map(line => {
      const l = line.toLowerCase();
      const none = { line, protein: 0, fiber: 0, kcal: 0 };
      if (/from the (pan|tray|pot|sheet|oven)|from above|reserved|fra (pannen|langpannen|over)/.test(l)) return none;
      // "1 tsp pul biber (or chili flakes)": only the first ingredient counts (if we know it; else the whole line).
      const main = C.mainPart(line);
      const hit = TABLE.find(([re]) => re.test(main)) || TABLE.find(([re]) => re.test(l));
      if (!hit || C.isOptional(line, C.amountOf(line))) return none;
      const e = hit[1];
      const g = grams(line, e, serves);
      return { line, protein: Math.round(g * e.p) / 100, fiber: Math.round(g * e.f) / 100, kcal: Math.round(g * (e.k || 0) / 100) };
    });
    if (!lines.length) return null;
    const sum = key => lines.reduce((s, x) => s + x[key], 0);
    const protein = Math.round(sum('protein')), fiber = Math.round(sum('fiber')), kcal = Math.round(sum('kcal'));
    return {
      protein, fiber, kcal, serves, assumed: !C.servingsNumber(r.servings),
      perServing: { protein: Math.round(protein / serves), fiber: Math.round(fiber / serves), kcal: Math.round(kcal / serves / 10) * 10 },
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
