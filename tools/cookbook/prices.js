/* ════════════════════════════════════════════════════════════════
   COOKBOOK: what a dish costs, in Norwegian kroner.

   Each ingredient line is matched to a typical Norwegian supermarket price (below) and the
   amount in the line ("600 g", "2 dl", "3 onions", "1 can", "1 turkey (6 kg)"…).
   The cost is what you'd pay: fresh things that don't keep (mince, cream, cottage cheese,
   a pot of herbs, a lemon) count as whole packs; cupboard things (oil, spices, rice, flour)
   count only what goes in. A line with no amount ("Salmon") counts a normal portion each;
   "Bacon (optional)" with no amount isn't counted.

   Cook.price(recipe) → { total, perServing, lines: [{ line, kr, known, wholePack }], unknown }
   The page uses the total to put the recipe in a cost group (under 100 kr, 100–200 kr…).
   If you know what it really costs, type it in the edit box and that's used instead.

   PRICES: update these now and then. Rough late-2026 prices at Rema/Kiwi/Meny.
     kg / l / each   price in kr per kilo, per litre, or per piece (or pack/can)
     w               grams in one piece (for "3 onions" when the price is per kg)
     d               kilos per litre (for "2 cups flour" when the price is per kg; default 1)
     def             kr when the line has no amount at all ("salt and pepper", "oil for frying")
     serve           grams per person when a meat, fish or side has no amount ("Salmon", "Rice, to serve")
     pack            kr for "1 pack/can/bunch/head" when that differs from one piece (a head of garlic)
     leaf            kr per leaf or sprig ("6 sage leaves")
     cooked          how much of a "cooked" amount is dry ("3 cups cooked rice" ≈ 1 cup dry)
     buy             kr for the smallest pack you can buy, for fresh things you have to buy whole
   The first line that matches wins, so specific things come before general ones.
═════════════════════════════════════════════════════════════════ */
(function () {
  const words = (...list) => new RegExp('(?:^|[^a-zæøåäöüéèáàíóúñç])(?:' + list.join('|') + ')', 'i');

  const PRICES = [
    // ── things whose names contain a meat or fish word (so "chicken stock" isn't priced as chicken) ──
    [words('stock cube', 'buljongterning', 'bouillon cube', 'broth base', 'buljong', 'stock', 'broth', 'kraft\\b', 'fond'), { l: 25, each: 3 }],
    [words('fish sauce', 'fiskesaus'), { l: 110, def: 2 }],
    [words('oyster sauce', 'østerssaus', 'hoisin', 'teriyaki'), { l: 140, def: 4 }],
    [words('egg noodle', 'eggnudler'), { kg: 90, w: 100, serve: 80, cooked: 0.4 }],   // before "egg"
    [words('chocolate chip', 'sjokoladebiter', 'sjokoladeknapper'), { kg: 220, d: 0.6 }],
    [words('chocolate', 'sjokolade'), { kg: 200, d: 0.6 }],                            // before "milk": "dark or milk chocolate"
    [words('chipotle'), { each: 6, pack: 35, def: 10 }],   // a can holds about 7
    [words('taco seasoning', 'taco spice', 'tacokrydder', 'fajita seasoning', 'ranch seasoning'), { each: 15, l: 400, def: 8 }],
    [words('tortilla chip', 'nacho', 'tortillachips'), { kg: 130, each: 30 }],
    // ── chicken & other birds ──
    [words('chicken breast', 'kyllingfilet', 'kyllingbryst'), { kg: 180, w: 180, serve: 150, buy: 72 }],
    [words('chicken thigh', 'thighs?\\b', 'lårfilet', 'kyllinglår', 'kyllinglårfilet', 'drumstick'), { kg: 160, w: 110, serve: 150, buy: 64 }],
    [words('whole chicken', 'hel kylling'), { kg: 85, each: 120, w: 1400 }],
    [words('chicken wing', 'kyllingving'), { kg: 100, serve: 250 }],
    [words('chicken', 'kylling'), { kg: 170, w: 180, serve: 150, buy: 68 }],
    [words('duck', 'andebryst', 'andelår'), { kg: 350, w: 250, serve: 200 }],
    [words('turkey breast', 'turkey fillet', 'kalkunfilet', 'kalkunbryst'), { kg: 260, w: 700, serve: 175 }],
    [words('ground turkey', 'turkey mince', 'kalkundeig', 'kalkunkjøttdeig'), { kg: 150 }],
    [words('turkey', 'kalkun'), { kg: 110, w: 5000, serve: 400 }],                   // a whole bird, bones and all
    // ── pork (before beef, so "pork tenderloin" isn't priced as beef fillet) ──
    [words('pork mince', 'ground pork', 'svinekjøttdeig', 'svinedeig'), { kg: 120, serve: 125, buy: 48 }],
    [words('pork tenderloin', 'pork fillet', 'svinefilet', 'svinemørbrad', 'indrefilet av svin'), { kg: 240, w: 450, serve: 150, buy: 108 }],
    [words('bacon'), { kg: 250, w: 20, serve: 40, buy: 35 }],
    [words('prosciutto', 'parma', 'serrano', 'spekeskinke'), { kg: 600, w: 15 }],
    [words('ham\\b', 'skinke'), { kg: 220, w: 30, buy: 25 }],
    [words('chorizo', 'salami', 'pepperoni'), { kg: 250, w: 60, buy: 50 }],
    [words('sausage', 'pølse', 'medister', 'bratwurst', 'wiener'), { kg: 160, w: 80, serve: 150, buy: 64 }],
    [words('pork chop', 'kotelett', 'nakkekotelett'), { kg: 150, w: 200, serve: 200 }],
    [words('pork belly', 'ribbe', 'sideflesk', 'pork shoulder', 'nakke', 'pulled pork', 'svinenakke', 'spareribs'), { kg: 120, serve: 250 }],
    [words('pork', 'svin'), { kg: 160, w: 200, serve: 150 }],
    // ── beef ──
    [words('mince\\b', 'ground beef', 'kjøttdeig', 'karbonadedeig', 'hamburger meat', 'kjøttboller', 'meatball'), { kg: 150, serve: 125, buy: 60 }],
    [words('tenderloin', 'fillet steak', 'filet mignon', 'indrefilet'), { kg: 650, w: 200, serve: 175 }],
    [words('entrecote', 'ribeye', 'rib-eye', 'sirloin', 'ytrefilet', 'striploin', 'steak', 'biff\\b', 'biffer'), { kg: 450, w: 250, serve: 200 }],
    [words('chuck', 'stewing', 'gryteskåret', 'brisket', 'short rib', 'oxtail', 'grytekjøtt', 'høyrygg', 'bog\\b'), { kg: 250, serve: 200 }],
    [words('veal', 'kalv'), { kg: 380, serve: 175 }],
    [words('beef', 'storfe', 'okse'), { kg: 280, w: 200, serve: 175 }],
    // ── lamb & game ──
    [words('pinnekjøtt'), { kg: 320, serve: 400 }],
    [words('lamb mince', 'lammekjøttdeig'), { kg: 220, serve: 125 }],
    [words('lamb chop', 'lammekotelett', 'lammeracks?', 'rack of lamb'), { kg: 380, w: 100, serve: 250 }],
    [words('lamb', 'lamme', 'fårikål', 'fårekjøtt', 'mutton'), { kg: 280, serve: 250 }],
    [words('finnbiff', 'reinskav'), { kg: 450, serve: 150 }],
    [words('reindeer', 'reinsdyr'), { kg: 650, serve: 175 }],
    [words('elk', 'moose', 'elg'), { kg: 420, serve: 175 }],
    [words('venison', 'hjort'), { kg: 480, serve: 175 }],
    // ── fish & shellfish ──
    [words('smoked salmon', 'røkt laks', 'røkelaks', 'gravlaks'), { kg: 450, w: 30, serve: 75 }],
    [words('salmon', 'laks'), { kg: 260, w: 130, serve: 150, buy: 65 }],
    [words('tuna steak', 'fresh tuna'), { kg: 420, w: 150, serve: 150 }],
    [words('tuna', 'tunfisk'), { each: 25, w: 120 }],
    [words('cod', 'torsk', 'skrei', 'klippfisk', 'bacalao'), { kg: 250, w: 150, serve: 175, buy: 100 }],
    [words('haddock', 'hyse', 'pollock', 'sei\\b', 'coley', 'whitefish', 'white fish'), { kg: 180, w: 150, serve: 175, buy: 72 }],
    [words('halibut', 'kveite'), { kg: 380, w: 150, serve: 175 }],
    [words('monkfish', 'breiflabb'), { kg: 420, serve: 175 }],
    [words('trout', 'ørret', 'røye'), { kg: 260, w: 130, serve: 150 }],
    [words('mackerel', 'makrell'), { kg: 110, each: 28 }],
    [words('herring', 'sild'), { each: 40 }],
    [words('fish cake', 'fiskekake', 'fiskebolle', 'fiskepudding'), { kg: 130, w: 60, serve: 180 }],
    [words('peeled prawn', 'peeled shrimp', 'king prawn', 'tiger prawn', 'scampi', 'pillede reker', 'reker i lake'), { kg: 320, w: 15, serve: 125, buy: 64 }],
    [words('prawn', 'shrimp', 'reke'), { kg: 200, w: 15, serve: 200 }],
    [words('scallop', 'kamskjell'), { kg: 750, w: 30 }],
    [words('mussel', 'blåskjell'), { kg: 100, serve: 400 }],
    [words('crab', 'krabbe'), { kg: 220, each: 90 }],
    [words('lobster', 'hummer'), { kg: 650, each: 280 }],
    [words('squid', 'calamari', 'blekksprut'), { kg: 220, serve: 150 }],
    [words('fish', 'fisk'), { kg: 220, w: 150, serve: 175 }],
    // ── eggs & dairy ──
    [words('egg yolk', 'eggeplomme', 'egg white', 'eggehvite'), { each: 5 }],
    [words('eggs?\\b', 'egg(?:e|ene)?\\b'), { each: 5 }],
    [words('buttermilk', 'kulturmelk', 'kefir'), { l: 32, buy: 32 }],
    [words('coconut milk', 'kokosmelk', 'coconut cream', 'kokoskrem'), { l: 55, each: 22, w: 400, buy: 22 }],
    [words('oat milk', 'havremelk', 'soy milk', 'soyamelk', 'almond milk', 'mandelmelk'), { l: 38 }],
    [words('crème fraîche', 'creme fraiche', 'crème fraiche'), { l: 110, buy: 33 }],
    [words('sour cream', 'rømme', 'lettrømme', 'seterrømme'), { l: 85, buy: 26 }],
    [words('cream cheese', 'philadelphia', 'kremost', 'smøreost'), { kg: 150, d: 1, buy: 30 }],
    [words('cream\\b', 'fløte', 'kremfløte', 'matfløte'), { l: 95, buy: 28.5 }],
    [words('milk', 'melk'), { l: 25 }],
    [words('greek yogurt', 'gresk yoghurt', 'yogurt', 'yoghurt', 'skyr'), { l: 55, buy: 27.5 }],
    [words('butter\\b', 'smør\\b', 'meierismør'), { kg: 130, d: 0.95, def: 3 }],
    [words('parmesan', 'parmigiano', 'grana padano', 'pecorino'), { kg: 450, d: 0.4, def: 15 }],
    [words('mozzarella', 'burrata'), { kg: 180, each: 25, w: 125, buy: 25 }],
    [words('feta'), { kg: 180, d: 0.5, buy: 36 }],
    [words('halloumi'), { kg: 230, each: 45, w: 200, buy: 46 }],
    [words('gruy', 'comté', 'emmental', 'manchego'), { kg: 380, d: 0.4 }],
    [words('blue cheese', 'gorgonzola', 'roquefort', 'blåmuggost', 'stilton'), { kg: 280, d: 0.5 }],
    [words('brie', 'camembert'), { kg: 220, each: 45 }],
    [words('ricotta', 'cottage cheese', 'kesam'), { kg: 105, buy: 42 }],
    [words('mascarpone'), { kg: 170, buy: 42 }],
    [words('paneer'), { kg: 220, buy: 44 }],
    [words('brunost', 'geitost', 'gjetost'), { kg: 160 }],
    [words('cheddar', 'gouda', 'monterey', 'colby', 'pepper jack'), { kg: 220, d: 0.4, def: 12 }],
    [words('cheese', 'ost\\b', 'norvegia', 'jarlsberg', 'revet ost', 'pizzaost'), { kg: 150, d: 0.4, def: 12 }],
    // ── tins, jars & sauces ──
    [words('chopped tomatoes', 'diced tomatoes', 'crushed tomatoes', 'tinned tomatoes', 'canned tomatoes', 'plum tomatoes', 'hakkede tomater', 'hermetiske tomater', 'tomater på boks', 'passata', 'knuste tomater'), { each: 14, w: 400, l: 35, buy: 14 }],
    [words('tomato paste', 'tomato purée', 'tomato puree', 'tomatpuré', 'tomatpure'), { kg: 115, each: 15, w: 130 }],
    [words('kidney bean', 'black bean', 'chickpea', 'kikert', 'cannellini', 'butter bean', 'baked bean', 'pinto', 'bønner', 'beans'), { each: 18, w: 400, kg: 45, buy: 18 }],
    [words('lentil', 'linse'), { kg: 50, d: 0.8, cooked: 0.4 }],
    [words('soy sauce', 'soyasaus', 'tamari'), { l: 90, def: 2 }],
    [words('mirin', 'rice vinegar', 'risvineddik', 'sake\\b'), { l: 150, def: 3 }],
    [words('curry paste', 'karripasta', 'gochujang', 'miso', 'harissa'), { kg: 300, each: 32, def: 6 }],
    [words('pesto'), { kg: 220, each: 40, buy: 40 }],
    [words('salsa', 'enchilada sauce', 'tacosaus'), { kg: 90, each: 30, def: 10 }],
    [words('green chiles', 'green chilies'), { each: 25, w: 120, def: 10 }],
    [words('mustard', 'sennep', 'dijon'), { kg: 90, def: 2 }],
    [words('ketchup', 'mayonnaise', 'mayo\\b', 'majones', 'aioli'), { kg: 70, def: 3 }],
    [words('sriracha', 'worcester', 'tabasco', 'hot sauce', 'redhot', 'chilisaus', 'sweet chili'), { l: 160, def: 2 }],
    [words('balsamic', 'balsamico'), { l: 160, def: 2 }],
    [words('vinegar', 'eddik'), { l: 40, def: 1 }],
    [words('olive oil', 'olivenolje'), { l: 160, def: 2 }],
    [words('sesame oil', 'sesamolje'), { l: 250, def: 2 }],
    [words('coconut oil', 'kokosolje'), { kg: 180, def: 2 }],                           // before plain "oil"
    [words('oil', 'olje', 'rapsolje'), { l: 50, def: 1 }],
    [words('honey', 'honning'), { kg: 150, d: 1.4, def: 3 }],
    [words('maple syrup', 'lønnesirup'), { l: 400, def: 5 }],
    [words('syrup', 'sirup', 'agave'), { l: 70 }],
    [words('jam', 'syltetøy'), { kg: 70 }],
    [words('tahini'), { kg: 165, d: 1 }],
    [words('peanut butter', 'peanøttsmør', 'nut butter'), { kg: 130, d: 1 }],
    [words('olive', 'oliven'), { kg: 160, each: 32 }],
    [words('caper', 'kapers'), { each: 32, def: 5 }],
    [words('sun-dried', 'soltørkede'), { kg: 260 }],
    [words('kimchi'), { kg: 160 }],
    // ── dry goods ──
    [words('icing sugar', 'powdered sugar', 'melis'), { kg: 35, d: 0.55 }],
    [words('brown sugar', 'brunt sukker', 'muscovado'), { kg: 50, d: 0.85 }],
    [words('sugar', 'sukker'), { kg: 25, d: 0.85 }],
    [words('00 flour', 'tipo 00', 'pizzamel', '00-mel', 'durum'), { kg: 40, d: 0.55 }],
    [words('flour', 'mel\\b', 'hvetemel', 'sammalt', 'maizena', 'cornstarch', 'cornflour', 'potetmel'), { kg: 18, d: 0.55 }],
    [words('oats', 'havregryn', 'havre'), { kg: 28, d: 0.4 }],
    [words('rice noodle', 'risnudler', 'noodle', 'nudler', 'ramen', 'udon', 'soba'), { kg: 110, w: 100, serve: 80, cooked: 0.4 }],
    [words('basmati', 'jasmine rice', 'jasminris', 'rice\\b', 'ris\\b', 'risotto rice', 'arborio'), { kg: 45, d: 0.8, serve: 75, cooked: 0.35 }],
    [words('couscous', 'bulgur'), { kg: 55, d: 0.7, serve: 70, cooked: 0.4 }],
    [words('quinoa'), { kg: 100, d: 0.75, serve: 70, cooked: 0.4 }],
    [words('farro', 'spelt', 'perlespelt', 'barley', 'byggryn', 'perlebygg'), { kg: 55, d: 0.8, serve: 70, cooked: 0.4 }],
    [words('pasta', 'spaghetti', 'penne', 'macaroni', 'makaroni', 'fusilli', 'rotini', 'cavatappi', 'tagliatelle', 'linguine', 'fettuccine', 'rigatoni', 'orzo', 'lasagne', 'lasagna'), { kg: 50, d: 0.5, serve: 100, cooked: 0.4 }],
    [words('tortellini', 'ravioli', 'gnocchi'), { kg: 100, serve: 150 }],
    [words('tortilla', 'wrap\\b', 'wraps', 'lompe', 'pita', 'naan', 'flatbread', 'flatbrød'), { each: 6, def: 30, buy: 35 }],
    [words('breadcrumb', 'panko', 'griljermel', 'brødsmuler'), { kg: 65, d: 0.4 }],
    [words('burger bun', 'hamburgerbrød', 'bun\\b', 'buns\\b', 'roll\\b', 'rolls\\b', 'rundstykke'), { each: 8 }],
    [words('baguette', 'ciabatta', 'bread', 'brød', 'sourdough', 'loaf'), { each: 40, slice: 3 }],
    [words('yeast', 'gjær'), { each: 5, kg: 400, def: 4 }],
    [words('baking powder', 'bakepulver', 'baking soda', 'bicarbonate', 'natron', 'vanilla sugar', 'vaniljesukker', 'cream of tartar'), { l: 100, def: 1 }],
    [words('vanilla pod', 'vanilla bean', 'vaniljestang'), { each: 28 }],
    [words('vanilla', 'vanilje'), { l: 1400, def: 5 }],
    [words('cocoa', 'kakao'), { kg: 180, d: 0.45 }],
    [words('pine nut', 'pinjekjerne'), { kg: 600, d: 0.55 }],
    [words('almond', 'mandel', 'mandler', 'cashew', 'walnut', 'valnøtt', 'pecan', 'hazelnut', 'hasselnøtt', 'peanut', 'peanøtt', 'pistach', 'nuts\\b', 'nøtter'), { kg: 200, d: 0.55 }],
    [words('sesame seed', 'sesamfrø', 'chia', 'linfrø', 'flaxseed', 'seeds', 'frø'), { kg: 130, d: 0.6 }],
    [words('raisin', 'rosin', 'dried fruit', 'tørket frukt', 'dates', 'dadler', 'apricot'), { kg: 90 }],
    [words('gelatin', 'gelatine', 'husblas'), { each: 2 }],
    [words('tofu'), { kg: 110, each: 33, w: 300, serve: 125, buy: 33 }],
    [words('tempeh', 'seitan'), { kg: 160, serve: 125 }],
    [words('food colo', 'konditorfarge', 'karamellfarge'), { each: 30, def: 5 }],
    // ── drinks ──
    [words('red wine', 'white wine', 'rødvin', 'hvitvin', 'wine', 'vin\\b'), { l: 200 }],
    [words('beer', 'øl\\b', 'pilsner', 'ale\\b', 'stout'), { l: 70, each: 35 }],
    [words('brandy', 'cognac', 'rum\\b', 'whisky', 'vodka', 'port\\b', 'sherry'), { l: 550, def: 15 }],
    // ── vegetables ──
    [words('sweet potato', 'søtpotet'), { kg: 45, w: 300 }],
    [words('potato', 'potet'), { kg: 25, w: 150, serve: 200 }],
    [words('spring onion', 'scallion', 'green onion', 'vårløk'), { each: 3, pack: 20, buy: 20 }],
    [words('shallot', 'sjalott'), { kg: 65, w: 40 }],
    [words('red onion', 'rødløk'), { kg: 32, w: 150 }],
    [words('onion', 'løk\\b', 'gul løk'), { kg: 22, w: 150 }],
    [words('garlic', 'hvitløk', 'fedd'), { each: 1.5, w: 5, pack: 8, def: 2 }],
    [words('ginger', 'ingefær'), { kg: 80, w: 30, d: 0.6 }],
    [words('carrot', 'gulrot', 'gulrøtter'), { kg: 22, w: 80, d: 0.5 }],
    [words('parsnip', 'pastinakk', 'kålrot', 'swede', 'turnip', 'beetroot', 'rødbet', 'celeriac', 'sellerirot'), { kg: 32, w: 250 }],
    [words('celery', 'stangselleri', 'selleri'), { each: 3, pack: 25, buy: 25 }],
    [words('leek', 'purre'), { each: 15, buy: 15 }],
    [/\b(tsp|tbsp|ts|ss|teaspoons?|tablespoons?|teskje|spiseskje|pinch|klype|dash)\b.*paprika/i, { l: 400, def: 2 }],   // paprika by the spoon is the spice
    [words('bell pepper', 'red pepper(?! flake)', 'green pepper', 'yellow pepper', 'capsicum', 'paprika\\b(?! ?powder)', 'paprikaer'), { each: 15, kg: 80, w: 180, buy: 15 }],
    [words('chilli', 'chili', 'jalape'), { each: 4 }],
    [words('cherry tomato', 'cherrytomat', 'grape tomato'), { kg: 90, w: 15, d: 0.6, buy: 22 }],
    [words('tomato', 'tomat'), { kg: 55, w: 100 }],
    [words('persian cucumber', 'lebanese cucumber', 'mini cucumber', 'snack cucumber', 'minicucumber', 'snackagurk', 'miniagurk'), { each: 7, buy: 7 }],
    [words('cucumber', 'agurk'), { each: 17, buy: 17 }],
    [words('lettuce', 'romaine', 'isberg', 'heart of', 'salathode', 'hjertesalat'), { each: 25, buy: 25 }],
    [words('spinach', 'spinat', 'rocket', 'arugula', 'ruccola', 'salad leaves', 'salatblad', 'kale', 'grønnkål'), { kg: 250, d: 0.1, each: 30, def: 15, buy: 30 }],
    [words('red cabbage', 'rødkål'), { kg: 28, each: 30 }],
    [words('cabbage', 'hodekål', 'kål\\b', 'savoy'), { kg: 22, each: 30, d: 0.3 }],
    [words('broccoli', 'brokkoli'), { each: 28, kg: 65, w: 400, d: 0.35, buy: 28 }],
    [words('cauliflower', 'blomkål'), { each: 32, kg: 50, w: 600, d: 0.35, buy: 32 }],
    [words('courgette', 'zucchini', 'squash\\b'), { each: 16, kg: 55, w: 300, buy: 16 }],
    [words('aubergine', 'eggplant'), { each: 22, buy: 22 }],
    [words('pumpkin', 'butternut', 'gresskar'), { kg: 40, each: 45, d: 0.6 }],
    [words('mushroom', 'sopp', 'champignon', 'portobello', 'shiitake'), { kg: 120, w: 20, d: 0.3, buy: 30 }],
    [words('avocado'), { each: 17, buy: 17 }],
    [words('sweetcorn', 'sweet corn', 'corn\\b', 'mais\\b'), { each: 15, w: 300, kg: 50, d: 0.6 }],
    [words('frozen peas', 'peas\\b', 'erter', 'grønne erter', 'edamame'), { kg: 45, d: 0.6 }],
    [words('green bean', 'aspargesbønne', 'sugar snap', 'sukkererter', 'mangetout'), { kg: 100, d: 0.5, buy: 25 }],
    [words('asparagus', 'asparges'), { kg: 200, each: 55, buy: 55 }],
    [words('bean sprout', 'bønnespirer'), { kg: 90, d: 0.4, buy: 22 }],
    // ── fruit ──
    [words('lemon', 'sitron'), { each: 8, buy: 8 }],
    [words('lime'), { each: 7, buy: 7 }],
    [words('orange', 'appelsin'), { each: 6 }],
    [words('apple', 'eple'), { each: 6, w: 150 }],
    [words('banana', 'banan'), { each: 3.5 }],
    [words('pear', 'pære'), { each: 7 }],
    [words('mango'), { each: 22, buy: 22 }],
    [words('pineapple', 'ananas'), { each: 35, buy: 35 }],
    [words('berries', 'blueberr', 'blåbær', 'strawberr', 'jordbær', 'raspberr', 'bringebær', 'bær\\b'), { kg: 130, d: 0.6, buy: 35 }],
    // ── herbs & spices ──
    // fresh herbs: a pot or bunch; "6 sage leaves" / "3 sprigs" cost a little each
    [/\b(dried|tørket|tørkede)\b/i, { l: 400, def: 2, pack: 30 }],     // dried herbs are spices, not a fresh pot
    [words('parsley', 'persille', 'coriander leaves', 'fresh coriander', 'cilantro', 'basil', 'basilikum', 'dill', 'mint', 'chives', 'gressløk',
      'sage', 'salvie', 'tarragon', 'estragon', 'fresh thyme', 'fresh rosemary', 'fresh oregano', 'frisk'), { each: 30, def: 15, leaf: 1, buy: 30 }],
    [words('saffron', 'safran'), { each: 45, def: 20, l: 400 }],
    [words('black pepper', 'white pepper', 'peppercorn', 'sort pepper', 'kvernet pepper', 'pepperkorn'), { l: 500, def: 1 }],
    [words('cumin', 'spisskummen', 'paprika powder', 'smoked paprika', 'paprikapulver', 'chili flakes', 'chiliflak', 'pepper flake', 'cayenne', 'cinnamon', 'kanel',
      'turmeric', 'gurkemeie', 'garam masala', 'curry powder', 'karri', 'oregano', 'thyme', 'timian', 'rosemary', 'rosmarin', 'cardamom', 'kardemomme',
      'nutmeg', 'muskat', 'clove', 'nellik', 'coriander', 'koriander', 'five spice', 'fem krydder', 'bay lea', 'laurbær', 'allspice', 'allehånde',
      'ginger powder', 'garlic powder', 'onion powder', 'chili powder', 'chilli powder', 'sumac', 'za.atar',
      'spice', 'krydder', 'seasoning', 'italian herbs', 'dried herbs', 'herbs', 'urter', 'star anise', 'stjerneanis', 'fennel seed'),
      { l: 400, def: 2, pack: 30 }],
    [words('salt', 'pepper\\b', 'pepper,'), { l: 40, def: 0.5 }],
    [words('water', 'vann\\b', 'ice cube', 'isbit', 'ice\\b'), { l: 0, def: 0 }],
  ];
  const UNKNOWN = { kg: 80, def: 10 };

  /* ───────── reading the amount ───────── */
  // unit → [what it measures, how much of that]
  const UNIT = {
    g: ['kg', 0.001], gr: ['kg', 0.001], gram: ['kg', 0.001], grams: ['kg', 0.001], kg: ['kg', 1], kilo: ['kg', 1],
    lb: ['kg', 0.454], lbs: ['kg', 0.454], pound: ['kg', 0.454], pounds: ['kg', 0.454], oz: ['kg', 0.0283], ounce: ['kg', 0.0283], ounces: ['kg', 0.0283],
    ml: ['l', 0.001], cl: ['l', 0.01], dl: ['l', 0.1], l: ['l', 1], liter: ['l', 1], litre: ['l', 1], liters: ['l', 1], litres: ['l', 1],
    cup: ['l', 0.24], cups: ['l', 0.24], tbsp: ['l', 0.015], tbs: ['l', 0.015], tablespoon: ['l', 0.015], tablespoons: ['l', 0.015], ss: ['l', 0.015], spiseskje: ['l', 0.015], spiseskjeer: ['l', 0.015],
    tsp: ['l', 0.005], teaspoon: ['l', 0.005], teaspoons: ['l', 0.005], ts: ['l', 0.005], teskje: ['l', 0.005], teskjeer: ['l', 0.005], krm: ['l', 0.001],
    pinch: ['l', 0.0005], pinches: ['l', 0.0005], klype: ['l', 0.0005], dash: ['l', 0.0005], splash: ['l', 0.01], skvett: ['l', 0.01],
    can: ['pack', 1], cans: ['pack', 1], tin: ['pack', 1], tins: ['pack', 1], boks: ['pack', 1], bokser: ['pack', 1], jar: ['pack', 1], jars: ['pack', 1],
    glass: ['pack', 1], pack: ['pack', 1], packs: ['pack', 1], packet: ['pack', 1], packets: ['pack', 1], pakke: ['pack', 1], pakker: ['pack', 1], pk: ['pack', 1],
    pose: ['pack', 1], poser: ['pack', 1], bag: ['pack', 1], bunch: ['pack', 1], bunches: ['pack', 1], bunt: ['pack', 1], neve: ['pack', 0.5], handful: ['pack', 0.5], handfuls: ['pack', 0.5],
    head: ['pack', 1], heads: ['pack', 1], hode: ['pack', 1], pot: ['pack', 1], potte: ['pack', 1], beger: ['pack', 1], tub: ['pack', 1], carton: ['pack', 1], kartong: ['pack', 1],
    slice: ['slice', 1], slices: ['slice', 1], skive: ['slice', 1], skiver: ['slice', 1],
  };
  const FRAC = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 };
  const NUM_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, en: 1, ett: 1, ei: 1, tre: 3, fire: 4, fem: 5, seks: 6, halv: 0.5, halvt: 0.5 };
  function num(s) {
    s = String(s || '').trim().toLowerCase();
    let m;
    if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3];
    if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
    if ((m = s.match(/^(\d*)\s*([¼½¾⅓⅔⅛])$/))) return (+m[1] || 0) + FRAC[m[2]];
    if (s in NUM_WORDS) return NUM_WORDS[s];
    return parseFloat(s.replace(',', '.'));
  }
  const N = String.raw`\d+\s+\d+\/\d+|\d+\/\d+|\d*\s*[¼½¾⅓⅔⅛]|\d+(?:[.,]\d+)?`;
  // Words between the number and the unit that don't change the amount: "2 heaped tbsp", "1 large can".
  const SIZE = String.raw`(?:heaped|heaping|level|rounded|scant|generous|good|large|small|medium|big|extra[- ]large|liten|lite|stor|store|små|toppet|struket|gode?)\s+`;
  const AMOUNT = new RegExp(String.raw`^(${N}|(?:an?|one|two|three|four|five|six|half|en|ett|ei|tre|fire|fem|seks|halvt?)(?=\s))` +
    String.raw`(?:\s*(?:-|–|to|til|or|eller)\s*(${N}))?\s*(?:x\s*(${N})\s*)?(?:${SIZE})*([a-zæøå]+)?\.?`, 'i');
  // "about 2 cups", "ca. 400 g": the "about" doesn't matter.
  const ABOUT = /^(?:about|approx\.?|approximately|around|roughly|up to|ca\.?|circa|cirka|omtrent|rundt|opptil)\s+/i;
  // A weight or volume anywhere in the text: "(5.5-6.5 kg)", "about 3/4 lb", "1.5 to 1.75 lbs", "15-oz" → { kg } / { l }
  const QTY = new RegExp(String.raw`(${N})(?:\s*(?:-|–|to|til)\s*(${N}))?\s*-?\s*(kg|kilo|g|gr|grams?|lbs?|pounds?|oz|ounces?|ml|cl|dl|l|liters?|litres?)(?![a-zæøå])`, 'i');
  function qty(text) {
    const m = String(text).match(QTY);
    if (!m) return null;
    let n = num(m[1]);
    if (m[2]) n = (n + num(m[2])) / 2;
    const u = UNIT[m[3].toLowerCase()] || UNIT[m[3].toLowerCase().replace(/s$/, '')];
    return u && isFinite(n) ? { [u[0]]: n * u[1] } : null;
  }
  // "2 x 400 g cans" → { kg: 0.8 },  "3 dl cream" → { l: 0.3 },  "2 onions" → { n: 2 },  "1 can" → { pack: 1 }
  function amountOf(line) {
    const l = line.toLowerCase().replace(/^[^\w¼½¾⅓⅔⅛]+/, '').replace(ABOUT, '');
    let m = l.match(AMOUNT);
    if (m) {
      let n = num(m[1]);
      if (m[2]) n = (n + num(m[2])) / 2;                       // "2-3" → 2.5
      if (m[3]) {                                              // "2 x 400 g"
        const u = UNIT[m[4]];
        const each = num(m[3]);
        return u ? { [u[0]]: n * each * u[1] } : { n: n * each };
      }
      if (m[4] === 'few' || m[4] === 'couple') n = m[4] === 'few' ? 3 : 2;   // "a few sprigs"
      const u = m[4] && UNIT[m[4]];
      if (u) {
        // "1 can (400 g)": a can, but the grams say how big it is
        const inner = l.match(/\(([^)]*)\)/);
        const q = u[0] === 'pack' && inner && qty(inner[1]);
        if (q) return Object.assign({ pack: n }, q.kg != null ? { kg: q.kg * n } : { l: q.l * n });
        return { [u[0]]: n * u[1] };
      }
      if (isFinite(n)) {
        // "1 whole turkey (5.5-6.5 kg)", "6 chicken thighs (1.5 lbs total)", "4 salmon fillets (4-6 oz each)":
        // a count, but the weight says how much it really is.
        const q = qty(l.slice(m[0].length));
        if (q) {
          const each = /\beach\b|apiece|\bhver\b|per (piece|stk|stykk)/.test(l);
          return q.kg != null ? { kg: q.kg * (each ? n : 1), n } : { l: q.l * (each ? n : 1), n };
        }
        return { n };
      }
    }
    // An amount somewhere else in the line: "Chicken thighs (about 600 g)", "juice of 1 lemon".
    const q = qty(l);
    if (q) return q;
    m = l.match(/\bof\s+(\d+\/\d+|\d+|an?|one|½)\s/);
    if (m) return { n: num(m[1]) };
    return {};
  }

  // The words that matter for matching: brackets out, and only the first of "A or B".
  const mainPart = line => line.toLowerCase().replace(/\([^)]*\)/g, ' ').split(/\s+or\s+|\s+eller\s+|\s*\/\s*(?=[a-zæøå])/)[0];
  const isOptional = (line, a) => !Object.keys(a).length && /optional|valgfri|if you like|om du vil/i.test(line);
  const LEAVES = /\b(leaves|leaf|sprigs?|kvister?|blad(?:er)?|stilker?|stalks?|stems?)\b/;
  const COOKED = /\bcooked\b|\bkokt|leftover|rester/;

  // What one ingredient line costs. serves = how many the recipe is for (for "Salmon" with no amount).
  function lineCost(line, serves = 4) {
    const l = line.toLowerCase();
    // "1 roasted pepper from the pan", "the reserved sauce": already counted earlier in the recipe.
    if (/from the (pan|tray|pot|sheet|oven)|from above|reserved|fra (pannen|langpannen|over)|fra kjelen/.test(l)) return { line, kr: 0, known: true };
    const main = mainPart(line);
    const hit = PRICES.find(([re]) => re.test(main)) || PRICES.find(([re]) => re.test(l));
    // Which thing it is ("cilantro" and "basil" are different pots, even though they share a price row).
    const key = hit ? PRICES.indexOf(hit) + ':' + (hit[0].exec(main) || hit[0].exec(l))[0].replace(/^[^a-zæøå]+/i, '') : '';
    const p = hit ? hit[1] : UNKNOWN;
    const a = amountOf(line);
    if (isOptional(line, a)) return { line, kr: 0, known: !!hit, optional: true };   // "Bacon (optional)": not counted
    let kr;
    if (a.kg != null) kr = p.kg ? a.kg * p.kg : p.l != null ? a.kg * p.l : p.each ? a.kg * 1000 / (p.w || 400) * p.each : a.kg * UNKNOWN.kg;
    else if (a.l != null) kr = p.l != null ? a.l * p.l : p.kg ? a.l * (p.d || 1) * p.kg : p.each ? a.l * 1000 / (p.w || 400) * p.each : a.l * UNKNOWN.kg;
    else if (a.slice != null) kr = a.slice * (p.slice || (p.kg ? (p.w || 30) / 1000 * p.kg : 3));
    else if (a.pack != null) kr = a.pack * (p.pack ?? p.each ?? (p.kg ? 0.4 * p.kg : p.l ? 0.5 * p.l : p.def || 15));
    else if (a.n != null && p.leaf && LEAVES.test(l)) kr = Math.min(a.n * p.leaf, p.each || 30);   // "6 sage leaves"
    else if (a.n != null) kr = p.each ? a.n * p.each : p.kg ? a.n * (p.w || 100) / 1000 * p.kg : a.n * (p.def ?? 8);
    else if (p.serve && p.kg) kr = serves * p.serve / 1000 * p.kg;     // "Salmon", "Rice, to serve": a normal portion each
    else kr = p.def ?? p.each ?? 8;
    if (p.cooked && COOKED.test(l) && (a.kg != null || a.l != null)) kr *= p.cooked;   // "3 cups cooked rice" = 1 cup dry
    kr = Math.min(Math.max(kr, 0), 3000);
    return { line, kr: Math.round(kr * 2) / 2, known: !!hit, key, buy: p.buy };
  }

  function price(r) {
    const C = window.Cook;
    const serves = C.servingsNumber(r.servings);
    const lines = (r.ingredients || []).filter(l => !C.isHeading(l)).map(l => lineCost(l, serves || 4));
    if (!lines.length) return null;
    // Fresh things only come in whole packs, and what's left over seldom gets used: 500 g of mince
    // means two 400 g packs, half a lemon means a lemon, a spoonful of coriander means a pot.
    // (Lines for the same thing are added up first: "juice of ½ lemon" twice is still one lemon.)
    // Cupboard things (oil, spices, rice, flour…) have no `buy`, so only what's used counts.
    const groups = {};
    lines.forEach(x => { if (x.buy && x.kr > 0) (groups[x.key] = groups[x.key] || []).push(x); });
    Object.values(groups).forEach(g => {
      const used = g.reduce((s, x) => s + x.kr, 0), buy = g[0].buy;
      const paid = Math.max(1, Math.ceil(used / buy - 0.15)) * buy;    // up to 15% over a pack: you'd make do with one
      if (paid <= used) return;
      g.forEach(x => { x.kr = Math.round(x.kr * paid / used * 2) / 2; x.wholePack = true; });
    });
    const total = Math.round(lines.reduce((s, x) => s + x.kr, 0));
    return { total, perServing: serves ? Math.round(total / serves) : null, lines, unknown: lines.filter(x => !x.known).length };
  }

  window.Cook.price = price;
  window.Cook.amountOf = amountOf;   // nutrition.js reads amounts the same way
  window.Cook.mainPart = mainPart;
  window.Cook.isOptional = isOptional;
})();
