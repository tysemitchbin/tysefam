/* ════════════════════════════════════════════════════════════════
   COOKBOOK: reading recipes and sorting them into categories.

   window.Cook gives the Cookbook page:
     Cook.CATS              every category and its choices (labels + emoji)
     Cook.parseText(text)   pasted recipe text → { title, ingredients, steps, … }
     Cook.fromSchema(r)     a recipe read from a web page (by the `recipes` edge function) → same shape
     Cook.guess(recipe)     fills in cost, difficulty, protein, cuisine, meal and tags
     (Cook.estimate, our realistic cooking time, lives in timing.js)
     Cook.timeBucket(min)   45 → 'medium'  (which "time to make" group a recipe is in)
     Cook.scale(line, x)    "2 cups flour", 1.5 → "3 cups flour"  (for changing the servings)

   The guessing is just keyword spotting (English and Norwegian), so it's sometimes wrong:
   the page always shows the guesses for checking before saving, and they can be edited later.
   Saved recipes keep the choice ids below (e.g. protein: 'chicken'), so don't rename the ids;
   changing a label or emoji is fine.
═════════════════════════════════════════════════════════════════ */
(function () {

  /* ───────── the categories ───────── */
  const CATS = {
    meal: { label: 'Meal', items: [
      ['breakfast', '🥞', 'Breakfast'], ['lunch', '🥪', 'Lunch'], ['dinner', '🍽️', 'Dinner'],
      ['soup', '🍲', 'Soup'], ['salad', '🥗', 'Salad'], ['side', '🥔', 'Side dish'],
      ['snack', '🥨', 'Snack & starter'], ['dessert', '🍰', 'Dessert'], ['baking', '🥖', 'Baking & bread'],
      ['drink', '🍹', 'Drink'] ] },
    protein: { label: 'Main protein', items: [
      ['chicken', '🐔', 'Chicken & poultry'], ['beef', '🐄', 'Beef'], ['pork', '🐖', 'Pork'],
      ['lamb', '🐑', 'Lamb'], ['game', '🦌', 'Game (reindeer, elk…)'], ['fish', '🐟', 'Fish'],
      ['seafood', '🦐', 'Shellfish'], ['eggs', '🥚', 'Eggs'], ['beans', '🫘', 'Beans & lentils'],
      ['tofu', '🌱', 'Tofu & soy'], ['cheese', '🧀', 'Cheese & dairy'], ['veg', '🥦', 'Veggies (no meat)'],
      ['none', '🍬', 'None (sweets, drinks)'] ] },
    cuisine: { label: 'Cuisine', items: [
      ['nordic', '🇳🇴', 'Norwegian & Nordic'], ['italian', '🇮🇹', 'Italian'], ['mexican', '🇲🇽', 'Mexican'],
      ['american', '🇺🇸', 'American'], ['british', '🇬🇧', 'British'], ['french', '🇫🇷', 'French'],
      ['spanish', '🇪🇸', 'Spanish'], ['greek', '🇬🇷', 'Greek'], ['middle-eastern', '🧆', 'Middle Eastern'],
      ['indian', '🇮🇳', 'Indian'], ['chinese', '🇨🇳', 'Chinese'], ['japanese', '🇯🇵', 'Japanese'],
      ['korean', '🇰🇷', 'Korean'], ['thai', '🇹🇭', 'Thai'], ['vietnamese', '🇻🇳', 'Vietnamese'],
      ['other', '🌍', 'Other / mixed'] ] },
    time: { label: 'Time to make', items: [
      ['quick', '⚡', 'Under 20 min'], ['short', '⏱️', '20–45 min'], ['medium', '⏳', '45–90 min'],
      ['long', '🕰️', 'Over 1½ hours'] ] },
    difficulty: { label: 'Difficulty', items: [
      ['easy', '🟢', 'Easy'], ['medium', '🟡', 'Some effort'], ['hard', '🔴', 'A project'] ] },
    // What the whole dish costs (as the recipe is written), worked out in prices.js or typed in.
    cost: { label: 'Cost', items: [
      ['n100', '🪙', 'Under 100 kr'], ['n200', '💰', '100–200 kr'], ['n300', '💰', '200–300 kr'],
      ['n400', '💰', '300–400 kr'], ['n500', '💰', '400–500 kr'], ['n500+', '💎', 'Over 500 kr'] ] },
  };
  // Little extra labels that can be ticked on any recipe (people can add their own too).
  const TAGS = ['Vegetarian', 'Vegan', 'Kid-friendly', 'One-pot', 'Instant Pot', 'Slow cooker', 'Air fryer',
    'Grill', 'Make ahead', 'Freezes well', 'Weeknight', 'Party', 'Christmas'];

  // Look up one choice: Cook.find('protein', 'beef') → { id, emoji, label }
  function find(cat, id) {
    const it = (CATS[cat]?.items || []).find(i => i[0] === id);
    return it ? { id: it[0], emoji: it[1], label: it[2] } : null;
  }

  // 180 (kr) → 'n200'  (which cost group a dish is in)
  function priceBand(kr) {
    if (!kr) return '';
    return kr < 100 ? 'n100' : kr < 200 ? 'n200' : kr < 300 ? 'n300' : kr < 400 ? 'n400' : kr < 500 ? 'n500' : 'n500+';
  }

  function timeBucket(min) {
    if (!min) return '';
    return min < 20 ? 'quick' : min <= 45 ? 'short' : min <= 90 ? 'medium' : 'long';
  }

  /* ───────── keyword spotting ─────────
     words('chicken', 'kylling') matches "chicken thighs" and "kyllingfilet" (Norwegian glues
     words together), because a word only has to START with one of them. Add \\b to a word
     when it must end there too (so 'ham\\b' doesn't match "hamburger"). */
  const words = (...list) => new RegExp('(?:^|[^a-zæøåäöüéèáàíóúñç])(?:' + list.join('|') + ')', 'i');

  const MEAT = {
    chicken: words('chicken', 'kylling', 'turkey', 'kalkun', 'duck', 'andebryst', 'andelår', 'poussin', 'hønse'),
    beef: words('beef', 'steak', 'sirloin', 'ribeye', 'rib-eye', 'brisket', 'oxtail', 'storfe', 'okse', 'biff\\b',
      'biffer', 'entrecote', 'mørbrad', 'kjøttdeig', 'karbonadedeig', 'kjøttkake', 'meatball', 'kjøttbolle',
      'veal', 'kalv', 'short rib', 'chuck\\b', 'flank', 'burger patt', 'roast beef'),
    pork: words('pork', 'bacon', 'ham\\b', 'hams\\b', 'gammon', 'prosciutto', 'pancetta', 'guanciale', 'chorizo',
      'sausage', 'salami', 'pepperoni', 'lardon', 'svin', 'flesk', 'skinke', 'ribbe\\b', 'pølse', 'medister',
      'pulled pork', 'spareribs', 'nakkekotelett', 'koteletter', 'serrano'),
    lamb: words('lamb', 'lamme', 'mutton', 'fårikål', 'fårekjøtt', 'pinnekjøtt'),
    game: words('reindeer', 'reinsdyr', 'reinskav', 'finnbiff', 'venison', 'elk\\b', 'moose', 'elg\\b', 'elgkjøtt',
      'elgstek', 'hjort', 'vilt', 'rabbit', 'hare\\b', 'kanin', 'grouse', 'rype'),
    fish: words('fish', 'fisk', 'salmon', 'laks', 'cod\\b', 'torsk', 'skrei', 'haddock', 'hyse', 'pollock', 'sei\\b',
      'tuna', 'tunfisk', 'trout', 'ørret', 'røye', 'mackerel', 'makrell', 'halibut', 'kveite', 'herring', 'sild',
      'sardine', 'anchov', 'ansjos', 'monkfish', 'breiflabb', 'steinbit', 'sea bass', 'tilapia', 'lutefisk', 'klippfisk'),
    seafood: words('shrimp', 'prawn', 'reke', 'scampi', 'scallop', 'kamskjell', 'mussel', 'blåskjell', 'skjell',
      'crab', 'krabbe', 'lobster', 'hummer', 'squid', 'calamari', 'blekksprut', 'octopus', 'clam', 'oyster\\b', 'østers\\b'),
  };
  const OTHER_PROTEIN = {
    eggs: words('eggs?\\b', 'egg(?:e|ene)?\\b', 'omelet', 'frittata', 'shakshuka', 'quiche', 'eggerøre'),
    beans: words('bean', 'bønne', 'lentil', 'linse', 'chickpea', 'kikert', 'dal\\b', 'dhal', 'daal', 'split pea',
      'hummus', 'falafel', 'black-eyed', 'kidney'),
    tofu: words('tofu', 'tempeh', 'seitan', 'edamame', 'soy mince', 'soyadeig'),
    cheese: words('halloumi', 'paneer', 'ricotta', 'cottage cheese', 'cheese', 'ost\\b', 'oste', 'feta', 'mozzarella',
      'grilled cheese', 'mac and cheese', 'mac ’n’ cheese', 'mac n cheese'),
  };
  // A line like "chicken stock" or "fish sauce" doesn't make the dish a chicken or fish dish.
  const MINOR = /stock|broth|buljong|kraft\b|bouillon|\bfond\b|sauce|saus\b|\bfat\b|dripping|gelatin|paste\b|powder|pulver/i;

  const CUISINE_WORDS = [
    ['korean', words('korean', 'korea', 'gochujang', 'gochugaru', 'kimchi', 'bulgogi', 'bibimbap', 'doenjang', 'japchae', 'tteok')],
    ['vietnamese', words('vietnam', 'pho\\b', 'phở', 'banh', 'bánh', 'rice paper', 'rispapir', 'nuoc', 'nước', 'bun cha', 'bún')],
    ['thai', words('thai', 'fish sauce', 'fiskesaus', 'lemongrass', 'sitrongress', 'galangal', 'kaffir', 'makrut', 'pad thai',
      'tom yum', 'tom kha', 'larb', 'satay', 'palm sugar', 'red curry paste', 'green curry', 'massaman', 'panang', 'thai basil')],
    ['japanese', words('japan', 'miso', 'mirin', 'sake\\b', 'dashi', 'teriyaki', 'ramen', 'sushi', 'nori', 'panko', 'katsu',
      'udon', 'soba', 'tempura', 'wasabi', 'furikake', 'gyoza', 'tonkatsu', 'yakitori', 'okonomiyaki', 'matcha', 'donburi', 'onigiri')],
    ['chinese', words('chinese', 'kinesisk', 'hoisin', 'five-spice', 'five spice', 'fem krydder', 'shaoxing', 'sichuan', 'szechuan',
      'bok choy', 'pak choi', 'oyster sauce', 'østerssaus', 'chow mein', 'fried rice', 'kung pao', 'sweet and sour', 'sur-søt',
      'sursøt', 'char siu', 'star anise', 'stjerneanis', 'black bean sauce', 'lo mein', 'mapo', 'wonton', 'dim sum', 'wok', 'soy sauce', 'soyasaus')],
    ['indian', words('india', 'garam masala', 'masala', 'curry', 'karri', 'turmeric', 'gurkemeie', 'paneer', 'naan', 'dal\\b', 'dhal', 'daal',
      'tikka', 'korma', 'vindaloo', 'biryani', 'tandoori', 'ghee', 'fenugreek', 'bukkehornkløver', 'mustard seed', 'sennepsfrø', 'curry leaves',
      'chapati', 'samosa', 'raita', 'chana', 'aloo', 'saag', 'palak', 'asafoetida', 'basmati', 'jalfrezi', 'rogan josh', 'bhaji', 'pakora')],
    ['middle-eastern', words('middle east', 'midtøst', 'tahini', 'za\'?atar', 'sumac', 'sumak', 'hummus', 'falafel', 'harissa', 'shawarma',
      'shakshuka', 'baba ganoush', 'tabbouleh', 'pomegranate molasses', 'ras el hanout', 'tagine', 'couscous', 'preserved lemon',
      'labneh', 'freekeh', 'bulgur', 'kofta', 'kofte', 'baharat', 'dukkah', 'moroccan', 'marokkansk', 'turkish', 'tyrkisk',
      'lebanese', 'libanesisk', 'persian', 'persisk', 'israeli', 'kebab', 'pita')],
    ['greek', words('greek', 'gresk', 'feta', 'tzatziki', 'souvlaki', 'gyro', 'moussaka', 'kalamata', 'spanakopita', 'halloumi', 'orzo', 'mediterranean', 'middelhav')],
    ['spanish', words('spanish', 'spansk', 'chorizo', 'paella', 'smoked paprika', 'røkt paprika', 'pimentón', 'pimenton', 'tapas',
      'gazpacho', 'manchego', 'serrano', 'patatas bravas', 'sofrito', 'romesco', 'churros', 'saffron', 'safran')],
    ['french', words('french', 'fransk', 'gruy', 'béchamel', 'bechamel', 'coq au vin', 'ratatouille', 'bourguignon', 'quiche', 'crêpe',
      'crepe', 'croissant', 'dijon', 'tarragon', 'estragon', 'provençal', 'provencal', 'cassoulet', 'gratin', 'confit', 'beurre',
      'soufflé', 'souffle', 'niçoise', 'nicoise', 'brûlée', 'brulee', 'herbes de provence', 'brie\\b', 'camembert', 'baguette', 'tarte', 'madeleine')],
    ['italian', words('italian', 'italiensk', 'tuscan', 'toscansk', 'sun-dried', 'soltørk', 'pasta', 'risotto', 'lasagn', 'carbonara', 'bolognese', 'pesto', 'gnocchi', 'parmigiano',
      'parmesan', 'mozzarella', 'ricotta', 'prosciutto', 'pancetta', 'guanciale', 'basil', 'basilikum', 'balsamic', 'balsamico', 'focaccia',
      'pizza', 'tiramisu', 'spaghetti', 'penne', 'tagliatelle', 'linguine', 'fettuccine', 'ravioli', 'polenta', 'arborio', 'marinara',
      'caprese', 'bruschetta', 'panna cotta', 'osso buco', 'minestrone', 'cacio', 'aglio', 'calzone', 'arancini', 'orecchiette', 'rigatoni')],
    ['mexican', words('mexican', 'meksikansk', 'tortilla', 'taco', 'burrito', 'enchilada', 'quesadilla', 'salsa', 'guacamole', 'jalape',
      'chipotle', 'fajita', 'nacho', 'pico de gallo', 'mole\\b', 'queso', 'ancho', 'poblano', 'tex-mex', 'refried', 'black beans',
      'svarte bønner', 'tomatillo', 'carnitas', 'chilaquiles', 'elote', 'cotija')],
    ['american', words('american', 'amerikansk', 'burger', 'bbq', 'barbecue', 'mac and cheese', 'mac ’n’ cheese', 'mac n cheese', 'cornbread',
      'pulled pork', 'buffalo', 'ranch\\b', 'brownie', 'cheesecake', 'meatloaf', 'sloppy joe', 'coleslaw', 'jambalaya', 'gumbo', 'cajun',
      's\'mores', 'chocolate chip', 'maple syrup', 'lønnesirup', 'grits', 'hot dog', 'chili con carne', 'pancake', 'biscuits and gravy',
      'cobbler', 'pecan pie', 'pumpkin pie', 'thanksgiving', 'ranch dressing', 'tater tot', 'clam chowder')],
    ['british', words('british', 'britisk', 'english', 'engelsk', 'shepherd', 'cottage pie', 'yorkshire', 'scone', 'crumble', 'bangers',
      'toad in the hole', 'fish and chips', 'trifle', 'sticky toffee', 'worcestershire', 'sunday roast', 'pasty', 'kedgeree',
      'mushy peas', 'sausage roll', 'bubble and squeak', 'flapjack', 'scotch egg', 'crumpet', 'victoria sponge', 'eton mess')],
    ['nordic', words('norwegian', 'norsk', 'scandinavian', 'skandinavisk', 'nordic', 'nordisk', 'swedish', 'svensk', 'danish', 'dansk',
      'fårikål', 'lapskaus', 'kjøttkake', 'brunost', 'geitost', 'gjetost', 'lefse', 'rømme', 'lutefisk', 'pinnekjøtt', 'raspebal',
      'komle', 'kumle', 'fiskekake', 'fiskebolle', 'fiskegrateng', 'kanelbolle', 'skillingsbolle', 'boller\\b', 'vafler', 'vaffel', 'rømmegrøt',
      'risengrynsgrøt', 'riskrem', 'krumkake', 'kransekake', 'sodd\\b', 'smørbrød', 'gravlaks', 'gravlax', 'lingonberr', 'tyttebær',
      'multe', 'kardemomme', 'cardamom bun', 'reinsdyr', 'finnbiff', 'bidos', 'kålrabi', 'tilslørte', 'svele', 'lompe', 'skolebolle',
      'julekake', 'pepperkake', 'karbonade', 'medisterkake', 'ribbe\\b', 'sursild', 'flatbrød', 'knekkebrød', 'kumla', 'smørrebrød',
      'köttbullar', 'kanelbulle', 'fiskesuppe', 'bergensk', 'brun saus', 'kålrot', 'kjøttkaker', 'sei\\b', 'skrei', 'klippfisk', 'bacalao', 'plukkfisk', 'kjøttsuppe', 'betasuppe', 'rakfisk', 'pølse')],
  ];
  // What recipe sites call their cuisine → our ids.
  const CUISINE_NAMES = [
    ['nordic', /norw|norsk|scandi|nordic|nordisk|swed|svensk|danish|dansk|finnish|finsk|iceland/i],
    ['italian', /ital/i], ['mexican', /mexic|meksik|tex-?mex|latin/i], ['american', /americ|amerik|southern|cajun|creole|usa/i],
    ['british', /brit|english|engelsk|scot|irish|welsh|uk\b/i], ['french', /fren|fransk|france/i],
    ['spanish', /spani|spansk|spain|portug/i], ['greek', /greek|gresk|mediterr|middelhav|cypri/i],
    ['middle-eastern', /middle|midt|moroc|marok|turk|tyrk|leban|liban|persia|israel|arab|north african/i],
    ['indian', /india|pakist|sri lank|bangla|nepal/i], ['chinese', /chin|kines|cantones|sichuan|taiwan/i],
    ['japanese', /japan/i], ['korean', /korea/i], ['thai', /thai/i], ['vietnamese', /vietnam/i],
  ];

  const MEAL_WORDS = [
    ['drink', words('drink', 'drikke', 'cocktail', 'mocktail', 'smoothie\\b', 'smoothien', 'juice', 'lemonade', 'saft\\b', 'coffee', 'kaffe',
      'latte', 'punch\\b', 'gløgg', 'glogg', 'sangria', 'milkshake', 'kakao', 'hot chocolate', 'iced tea', 'iste', 'beverage')],
    ['breakfast', words('breakfast', 'frokost', 'brunch', 'pancake', 'pannekake', 'waffle', 'vaffel', 'vafler', 'porridge', 'grøt',
      'oatmeal', 'overnight oats', 'granola', 'muesli', 'omelet', 'scrambled', 'eggerøre', 'french toast', 'arme riddere', 'eggs benedict', 'smoothie bowl')],
    ['dessert', words('dessert', 'cake', 'kake', 'cookie', 'kjeks', 'småkake', 'brownie', 'pudding', 'ice cream', 'iskrem', 'mousse',
      'cheesecake', 'tiramisu', 'crumble', 'sorbet', 'panna cotta', 'fudge', 'trifle', 'pavlova', 'cupcake', 'tart\\b', 'tarte', 'pie\\b',
      'riskrem', 'karamell', 'caramel', 'sweet', 'søt', 'sjokolade', 'chocolate', 'cobbler', 'parfait', 'semifreddo', 'blondie', 'fruit salad', 'fruktsalat')],
    ['baking', words('bread', 'brød', 'loaf', 'bun\\b', 'buns\\b', 'bolle', 'roll\\b', 'rolls\\b', 'rundstykke', 'baguette', 'focaccia',
      'sourdough', 'surdeig', 'scone', 'muffin', 'croissant', 'bagel', 'pizza dough', 'pizzadeig', 'baking', 'bakst', 'flatbread', 'naan', 'lefse')],
    ['soup', words('soup', 'suppe', 'chowder', 'bisque', 'ramen', 'pho\\b', 'gazpacho', 'minestrone', 'broth', 'laksa', 'tom yum', 'tom kha')],
    ['salad', words('salad', 'salat', 'slaw', 'poke bowl', 'buddha bowl', 'grain bowl')],
    ['side', words('side', 'tilbehør', 'mash', 'potetmos', 'fries', 'pommes', 'roasted potato', 'ovnsbakte poteter', 'garlic bread',
      'hvitløksbrød', 'coleslaw', 'rice pilaf', 'gratin', 'stuffing', 'dressing', 'pickle')],
    ['snack', words('snack', 'dip\\b', 'dipp', 'nacho', 'appetizer', 'appetiser', 'starter', 'forrett', 'tapas', 'bites', 'chips\\b',
      'popcorn', 'energy ball', 'bruschetta', 'spring roll', 'vårrull', 'canapé', 'finger food', 'snacks', 'småretter')],
    ['lunch', words('lunch', 'lunsj', 'sandwich', 'smørbrød', 'wrap\\b', 'wraps\\b', 'toastie', 'panini', 'quesadilla', 'baguette sandwich', 'matpakke')],
    ['dinner', words('dinner', 'middag', 'main course', 'main dish', 'hovedrett', 'supper', 'entrée', 'entree', 'stew', 'gryte', 'casserole',
      'curry', 'roast', 'stek\\b', 'traybake', 'langpanne')],
  ];

  const MEAL_ENDINGS = [
    ['soup', /suppe\b/i], ['salad', /salat\b/i], ['lunch', /smørbrød\b/i], ['breakfast', /grøt\b/i],
    ['baking', /brød\b|boller?\b|rundstykker?\b|muffins?\b/i],
    // "-kake" is cake, except fiskekaker, kjøttkaker, potetkaker…
    ['dessert', /^(?!.*(?:fiske|fisk|kjøtt|potet|lom|rå)kake).*kake(?:r|n)?\b|is\b|krem\b|pudding\b/i],
  ];

  const TAG_WORDS = {
    'One-pot': words('one-pot', 'one pot', 'one-pan', 'one pan', 'sheet pan', 'sheet-pan', 'traybake', 'tray bake', 'langpanne', 'alt i en'),
    'Instant Pot': words('instant pot', 'instant-pot', 'instantpot', 'pressure cook', 'pressure-cook', 'trykkoker', 'multicooker', 'multikoker', 'high pressure', 'natural release', 'quick release'),
    'Slow cooker': words('slow cooker', 'slow-cooker', 'crockpot', 'crock-pot', 'crock pot', 'saktekoker', 'slowcooker'),
    'Air fryer': words('air fryer', 'air-fryer', 'airfryer'),
    'Grill': words('grill', 'bbq', 'barbecue', 'braai'),
    'Make ahead': words('make ahead', 'make-ahead', 'overnight', 'over natten', 'dagen før', 'the night before', 'day before'),
    'Freezes well': words('freeze', 'freezer', 'fryse', 'frys\\b'),
    'Christmas': words('christmas', 'jul\\b', 'jule', 'xmas', 'pinnekjøtt', 'pepperkake', 'ribbe\\b'),
  };

  const DAIRY_EGG = words('milk', 'melk', 'butter\\b', 'smør\\b', 'smøre', 'cream', 'fløte', 'krem', 'cheese', 'ost\\b', 'oste', 'yogurt',
    'yoghurt', 'rømme', 'crème', 'creme', 'ghee', 'eggs?\\b', 'egg(?:e|ene)?\\b', 'honey', 'honning', 'mayo', 'majones', 'parmesan',
    'mozzarella', 'feta', 'ricotta', 'buttermilk', 'kefir', 'kesam', 'cottage', 'mascarpone', 'halloumi', 'paneer', 'gelatin', 'gelatin');
  const VEGAN_OK = /vegan|plant|oat milk|havremelk|soy milk|soyamelk|almond milk|mandelmelk|coconut|kokos|dairy-free|laktosefri vegan|nut butter|peanut butter|peanøttsmør/i;

  // Count how many of the lines match a pattern.
  const countLines = (lines, re) => lines.filter(l => re.test(l)).length;

  /* ───────── the guessing ───────── */
  function guess(r) {
    const title = r.title || '';
    const meta = [...(r.keywords || []), ...(r.category || []), ...(r.cuisineNames || [])].join(' · ');
    const ings = (r.ingredients || []).filter(l => !isHeading(l));
    const steps = (r.steps || []).filter(l => !isHeading(l));
    const body = ings.join('\n') + '\n' + steps.join('\n') + '\n' + (r.notes || '');
    const all = title + '\n' + meta + '\n' + body;
    const out = {};

    // MEAL: what the recipe site says, then the title, then the keywords.
    out.meal = pickMeal(title, meta) || '';

    // PROTEIN: the title counts most, then each ingredient (stock and sauces barely count).
    const score = {};
    const add = (k, n) => { score[k] = (score[k] || 0) + n; };
    for (const [k, re] of Object.entries(MEAT)) {
      if (re.test(title)) add(k, 6);
      ings.forEach(l => { if (re.test(l)) add(k, MINOR.test(l) ? 0.2 : 1); });
    }
    let protein = best(score, 0.9);
    const meaty = !!protein;
    if (!protein) {
      const s2 = {};
      for (const [k, re] of Object.entries(OTHER_PROTEIN)) {
        if (re.test(title)) s2[k] = 6;
        ings.forEach(l => { if (re.test(l) && !MINOR.test(l)) s2[k] = (s2[k] || 0) + (k === 'eggs' ? eggWeight(l) : k === 'cheese' ? 0.5 : 1); });
      }
      protein = best(s2, 1.5);
    }
    const sweet = /sugar|sukker|honey|honning|syrup|sirup|chocolate|sjokolade/i.test(body) && /flour|hvetemel|\bmel\b|oats|havre|cocoa|kakao/i.test(body);
    if (!out.meal && !meaty && sweet) out.meal = 'baking';
    if (!out.meal) out.meal = 'dinner';
    if (['dessert', 'baking', 'drink'].includes(out.meal) && !meaty) protein = 'none';
    out.protein = protein || 'veg';

    // CUISINE: what the recipe site says first, otherwise count give-away words.
    out.cuisine = pickCuisineName(r.cuisineNames || []) || pickCuisine(title, meta, body);

    // TIME: what the recipe says is kept as it is; our own realistic estimate (timing.js)
    // is worked out fresh whenever it's needed, so it's not stored here.
    const est = window.Cook.estimate ? window.Cook.estimate(r) : null;
    const total = (est && est.total) || r.totalMin || ((r.prepMin || 0) + (r.cookMin || 0)) || 30;

    // DIFFICULTY: more ingredients, more steps, longer time and tricky techniques = harder.
    if (r.difficultyWord) out.difficulty = r.difficultyWord;
    else {
      const tricky = countLines(steps, words('knead', 'elt', 'prove', 'proof', 'let rise', 'la heve', 'heve', 'laminat', 'temper',
        'sous vide', 'deep-fry', 'deep fry', 'frityr', 'candy thermometer', 'termometer', 'water bath', 'vannbad', 'flambé', 'flambe',
        'pipe\\b', 'piping', 'spritpose', 'roll out', 'kjevle', 'fold in the butter', 'caramel', 'karamell', 'emulsi', 'from scratch',
        'butterfly', 'debone', 'fillet the', 'filetere', 'blind bake', 'blindbake', 'souffl', 'puff pastry from', 'choux'));
      // Spices, salt and oil measured with a spoon hardly add to the difficulty.
      const real = ings.filter(l => !/\b(tsp|tbsp|teaspoons?|tablespoons?|ts|ss|krm|pinch|klype)\b|^(salt|pepper|black pepper|oil|olive oil)\b/i.test(l)).length;
      const points = real + (ings.length - real) * 0.3 + steps.length * 1.5 + tricky * 4 + (total > 120 ? 8 : total > 60 ? 4 : total > 40 ? 2 : 0);
      out.difficulty = points < 19 ? 'easy' : points < 33 ? 'medium' : 'hard';
    }

    // COST: worked out from real prices in prices.js (Cook.price), so nothing to guess here.

    // TAGS: vegetarian/vegan from the ingredients, plus give-away words (slow cooker, grill…).
    const tags = new Set();
    const anyMeat = Object.values(MEAT).some(re => re.test(all.replace(/vegetarian|vegan|vegetar/gi, '')))
      || /gelatin|anchov|ansjos|fish sauce|fiskesaus|lard\b|smult/i.test(body);
    if (!anyMeat && ings.length) {
      tags.add('Vegetarian');
      const veganTitle = /\bvegan/i.test(title + ' ' + meta);
      if (veganTitle || !ings.some(l => DAIRY_EGG.test(l) && !VEGAN_OK.test(l))) tags.add('Vegan');
    }
    for (const [tag, re] of Object.entries(TAG_WORDS)) if (re.test(title + '\n' + meta) || (tag !== 'Grill' && tag !== 'Christmas' && re.test(body))) tags.add(tag);
    if (total <= 35 && out.difficulty === 'easy' && ['dinner', 'soup', 'salad'].includes(out.meal)) tags.add('Weeknight');
    (r.diet || []).forEach(d => { if (/vegan/i.test(d)) { tags.add('Vegan'); tags.add('Vegetarian'); } else if (/vegetarian/i.test(d)) tags.add('Vegetarian'); });
    out.tags = [...tags];
    return out;
  }

  // "4 eggs" in an omelette counts; "1 egg" to brush on pastry hardly does.
  function eggWeight(line) {
    const n = parseFloat(line);
    return n >= 4 ? 2 : n >= 3 ? 1.2 : 0.3;
  }
  function best(score, min) {
    let top = '', val = min;
    for (const [k, v] of Object.entries(score)) if (v >= val && v > (score[top] || 0)) { top = k; val = v; }
    return top;
  }
  function pickMeal(title, meta) {
    const named = (meta || '').toLowerCase();
    // "Teriyaki chicken bowls with pickled cucumber": the dish is what comes before "with".
    const dish = title.split(/\s+(?:with|med|and|og|served with|&)\s+/i)[0];
    if (dish !== title) for (const [id, re] of MEAL_WORDS) if (re.test(dish)) return id;
    if (dish !== title && Object.values(MEAT).some(re => re.test(dish))) return 'dinner';
    for (const [id, re] of MEAL_WORDS) if (re.test(title)) return id;
    // Norwegian puts the kind of dish at the END of a word: fiskesuppe, potetsalat, sjokoladekake.
    for (const [id, re] of MEAL_ENDINGS) if (re.test(title)) return id;
    if (named) for (const [id, re] of MEAL_WORDS) if (re.test(named)) return id;
    return '';
  }
  function pickCuisineName(names) {
    for (const n of names) for (const [id, re] of CUISINE_NAMES) if (re.test(n)) return id;
    return '';
  }
  function pickCuisine(title, meta, body) {
    let top = 'other', topScore = 1.9;
    for (const [id, re] of CUISINE_WORDS) {
      const g = new RegExp(re.source, 'gi');
      const hits = s => new Set((s.match(g) || []).map(m => m.trim().toLowerCase())).size;
      const s = hits(title) * 4 + hits(meta) * 2 + hits(body);
      if (s > topScore) { top = id; topScore = s; }
    }
    return top;
  }

  /* ───────── times written in words ─────────
     "1 hr 15 mins" → 75,  "1 time 30 min" → 90 (Norwegian "time" = hour),  "20-25 minutes" → 25 */
  const DURATION = /(\d+(?:[.,]\d+)?|[½¼¾])(?:\s*(?:-|–|to|til)\s*(\d+(?:[.,]\d+)?))?\s*(hours?|hrs?|h\b|timer|time\b|t\b|minutes?|minutter|minutt|mins?|m\b)/gi;
  const num = s => s === '½' ? 0.5 : s === '¼' ? 0.25 : s === '¾' ? 0.75 : parseFloat(String(s).replace(',', '.'));
  function parseDuration(text) {
    let min = 0;
    for (const m of String(text || '').matchAll(DURATION)) {
      const n = num(m[2] || m[1]);
      min += /^(h|t)/i.test(m[3]) ? n * 60 : n;
    }
    // "1½ hours"
    if (/1½\s*(hours?|timer|time)/i.test(text)) min += 30;
    return Math.round(min) || null;
  }


  /* ───────── reading pasted text ───────── */
  const H_INGREDIENTS = /^(?:ingredients?|ingredienser|ingrediensar|you(?:'|’)?ll need|you will need|what you need|du trenger|det(?: du)? trenger|handleliste|shopping list)\b/i;
  const H_STEPS = /^(?:instructions?|method|directions?|steps?|preparation|how to make(?: it)?|how to cook|to make|fremgangsmåte|framgangsmåte|slik gjør du|sånn gjør du|tilberedning|oppskrift|gjør slik|instruksjoner|metode)\b/i;
  const H_NOTES = /^(?:notes?|tips?|cook'?s notes?|recipe notes?|tips og triks|merknad|nutrition|næringsinnhold|storage|oppbevaring)\b/i;
  const BULLET = /^[\s•·●○◦▪▫‣⁃∙\-–—*▢□☐✓✔➤>]+/;
  const STEP_NUMBER = /^(?:(?:step|steg|trinn)\s*\d+\s*[:.)-]?|\d+\s*[.):]|\d+\s+(?=[A-ZÆØÅ]))\s*/i;

  // "For the sauce:" style lines split a list into parts.
  function isHeading(line) {
    line = String(line || '').trim();
    if (/:$/.test(line)) return line.length < 60 && !/\d+\s*(g|ml|dl|cups?|tbsp|tsp|ss|ts)\b/i.test(line);
    // "SAUCE", "For the sauce", "Til sausen": short, no amounts, no full stop, no colon in the middle.
    if (line.length > 40 || /\d|:|[.!?,;]$/.test(line)) return false;
    return /^[A-ZÆØÅ][A-ZÆØÅ &'-]{3,}$/.test(line) || /^(for|to make|til)\s+\S/i.test(line);
  }

  /* ───────── parts of a dish (the meat, the sauce, the rice…) ─────────
     A recipe keeps one list of ingredients and one of steps; a heading line ending in ":"
     ("The sauce:") starts a part. Cook.parts(recipe) pairs each part's ingredients with its steps
     (ingredient "For the sauce:" goes with step "Make the sauce:"). */
  // "For the sauce:" → "The sauce"
  const partName = h => {
    let n = String(h).replace(/:$/, '').replace(/^(for|to make|til)\s+/i, '').trim();
    if (n === n.toUpperCase()) n = n.toLowerCase();          // "SAUCE" → "sauce"
    return n.replace(/^./, c => c.toUpperCase());
  };
  // What two headings must share to be the same part: "Make the meatballs" ≈ "The meatballs" ≈ "Meatball".
  const partKey = name => String(name).toLowerCase().replace(/:$/, '')
    .replace(/^(for|to make|til|make|making|prepare|preparing|cook|cooking|assemble|lag|lage|tilbered|kok|stek)\s+/, '')
    .replace(/^(the|a|an|your|den|det|de)\s+/, '').replace(/(es|s|en|er|ene)$/, '').trim();
  function splitGroups(lines) {
    const groups = [{ name: '', items: [] }];
    (lines || []).forEach((l, i) => {
      if (isHeading(l)) groups.push({ name: partName(l), items: [] });
      else groups[groups.length - 1].items.push({ line: l, i });
    });
    return groups.filter((g, k) => k > 0 || g.items.length);
  }
  // → [{ name: 'The sauce', ings: [{ line, i }], steps: [{ line, i }] }, …]   (i = position in the full list)
  function parts(r, opts = {}) {
    const out = splitGroups(r.ingredients).map(g => ({ name: g.name, ings: g.items, steps: [] }));
    const named = name => {
      const k = partKey(name);
      return out.find(p => p.name && partKey(p.name) === k) ||
        out.find(p => p.name && k && partKey(p.name) && (partKey(p.name).includes(k) || k.includes(partKey(p.name))));
    };
    for (const g of splitGroups(r.steps)) {
      // A step that starts "Make the sauce: …" belongs to the sauce, wherever it is.
      const own = [], loose = [];
      g.items.forEach(it => {
        const m = it.line.match(/^([^:.]{3,30}):\s+\S/);
        const p = m && named(m[1]);
        if (p) own.push([p, it]); else loose.push(it);
      });
      own.forEach(([p, it]) => p.steps.push(it));
      if (!loose.length) continue;
      const p = g.name ? named(g.name) : out.find(p => !p.name);
      if (p) p.steps = p.steps.concat(loose);
      else out.push({ name: g.name, ings: [], steps: loose });
    }
    out.forEach(p => p.steps.sort((a, b) => a.i - b.i));
    if (!opts.noGuess) guessStepParts(out);
    return out;
  }

  /* Many recipes split the INGREDIENTS into parts but give one plain list of steps. Then we work
     out which part each step belongs to from what it mentions: "Put the couscous, salt and butter
     in a bowl…" uses couscous-part ingredients, so it's a couscous step. A step that brings several
     parts together goes under "Putting it together"; a step that mentions nothing ("Heat the
     oven") goes with the step after it. The steps keep their numbers, and on the recipe page
     "All parts" still lists them in the original order (out.guessed is set). */
  const STOP = new Set(('and or the with for into from about then cut cuts small large big fresh finely roughly thinly chopped '
    + 'sliced diced minced grated crushed peeled optional keeps them tender will goes go some more extra each plus '
    + 'taste serve serving whole half piece pieces inch cm thick thin strips wedges chunks medium ground '
    + 'pan pans pot tray sheet bowl plate oven dish lid heat side sides top over under').split(' '));
  const stem = w => w.toLowerCase().replace(/ies$/, 'y').replace(/(?<=.{3})(es|s)$/, '');
  const wordsOf = text => String(text).toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-zæøåäöüéèáàíóúñç]+/)
    .filter(w => w.length > 2 && !STOP.has(w) && !UNIT_WORDS.test(w)).map(stem);
  const UNIT_WORDS = /^(tsp|tbsp|teaspoons?|tablespoons?|cups?|grams?|kg|ml|dl|cl|litres?|liters?|pinch|klype|ss|ts|can|cans|tin|tins|cloves?|fedd|boks|pakke|stk)$/;
  function guessStepParts(out) {
    const named = out.filter(p => p.name && p.ings.length);
    const loose = out.find(p => !p.name && !p.ings.length && p.steps.length);
    if (named.length < 2 || !loose || out.some(p => p.name && p.steps.length)) return;
    // The words that point to just one part ("couscous", "breadcrumbs", "cottage"), not shared ones like "salt".
    const count = {};
    const partWords = named.map(p => {
      const set = new Set(p.ings.flatMap(it => wordsOf(it.line)));
      set.forEach(w => { count[w] = (count[w] || 0) + 1; });
      return set;
    });
    const nameWords = named.map(p => new Set(wordsOf(p.name)));
    const together = { name: 'Putting it together', ings: [], steps: [] };
    const pick = loose.steps.map(st => {
      const ws = new Set(wordsOf(st.line));
      const scores = named.map((p, k) => [...partWords[k]].filter(w => count[w] === 1 && ws.has(w)).length);
      const said = named.map((p, k) => [...nameWords[k]].some(w => ws.has(w)));
      const mentioned = named.filter((p, k) => scores[k] > 0 || said[k]).length;
      if (mentioned >= 3) return together;
      const top = Math.max(...scores);
      if (top > 0 && scores.filter(x => x === top).length === 1) return named[scores.indexOf(top)];
      if (said.filter(Boolean).length === 1) return named[said.indexOf(true)];
      return mentioned >= 2 ? together : null;
    });
    // Steps that mention nothing go with the next step that does (or the one before, at the end).
    for (let k = pick.length - 1; k >= 0; k--) if (!pick[k]) pick[k] = pick.slice(k + 1).find(Boolean) || null;
    for (let k = 0; k < pick.length; k++) if (!pick[k]) pick[k] = pick.slice(0, k).reverse().find(Boolean) || together;
    // Only worth it if the steps really spread over the parts.
    if (new Set(pick.filter(p => p !== together)).size < 2) return;
    loose.steps.forEach((st, k) => pick[k].steps.push(st));
    out.splice(out.indexOf(loose), 1);
    if (together.steps.length) out.push(together);
    out.guessed = true;
  }
  // A little picture for a part, from its name.
  const PART_EMOJI = [[/chicken|kylling/i, '🍗'], [/meat|kjøtt|beef|biff|steak|pork|svin|lamb|lam\b|mince|kjøttdeig|bolle|ball|patt|burger|k[öo]fte|kebab/i, '🥩'],
    [/fish|fisk|salmon|laks|torsk|cod|prawn|shrimp|reke/i, '🐟'], [/sauce|saus|gravy|jus|curry/i, '🥫'], [/rice|ris\b|couscous|bulgur|quinoa/i, '🍚'],
    [/noodle|nudler|pasta|spaghetti/i, '🍝'], [/potato|potet|mash|mos\b/i, '🥔'], [/marinade|mariner|rub\b|krydder/i, '🧂'],
    [/dressing|salad|salat|slaw/i, '🥗'], [/dough|deig|bread|brød|crust|bunn|pastry|base/i, '🥖'], [/topping|garnish|pynt|serve|servering/i, '🌿'],
    [/filling|fyll/i, '🥟'], [/frosting|icing|glaze|glasur|syrup|sirup|cream|krem/i, '🍯'], [/veg|grønnsak/i, '🥦'],
    [/egg/i, '🥚'], [/together|assembl|montering|finish|sammen/i, '🍽️']];
  const partEmoji = name => (PART_EMOJI.find(([re]) => re.test(name)) || [0, '🍳'])[1];
  const looksLikeHeading = (line, re) => line.length < 50 && re.test(line.replace(/^[#*\s]+|[:*\s]+$/g, ''));

  // Pasted text → a recipe (title, ingredients, steps, notes, servings and times when written down).
  function parseText(text) {
    text = String(text || '').replace(/\r\n?/g, '\n').replace(/\t/g, ' ').replace(/ /g, ' ');
    const raw = text.split('\n').map(l => l.replace(/\s+/g, ' ').trim());
    const lines = [], afterBlank = new Set();
    raw.forEach((l, i) => { if (!l) return; if (i > 0 && !raw[i - 1]) afterBlank.add(lines.length); lines.push(l); });
    // Copied from a chat, the bullets are often gone. A short line on its own after an empty line,
    // followed by a line with an amount ("Couscous" then "200 g couscous"), is the name of a part.
    lines.forEach((l, k) => {
      const prev = lines[k - 1] || '';
      const afterTop = k === 1 || /serves|servings|porsjon|yield|prep|cook|total|time|minutes|°/i.test(prev);
      if (!(afterBlank.has(k) || afterTop) || k === 0 || /:$/.test(l)) return;
      if (l.length > 35 || /\d|[.!?,;]$/.test(l) || BULLET.test(l)) return;
      if ([H_INGREDIENTS, H_STEPS, H_NOTES].some(re => looksLikeHeading(l, re))) return;
      const next = (lines[k + 1] || '').replace(BULLET, '');
      if (/^[\d¼½¾⅓⅔⅛]/.test(next)) lines[k] = l + ':';
    });
    const r = { title: '', description: '', ingredients: [], steps: [], notes: '', servings: '',
      prepMin: null, cookMin: null, totalMin: null, image: '', source: '' };

    // A link anywhere in the text becomes the source.
    const link = text.match(/https?:\/\/[^\s<>"')]+/i);
    if (link) r.source = link[0];

    // Labelled facts ("Serves 4", "Prep time: 15 min", "Tid: 30 min", "Vanskelighetsgrad: Enkel").
    const facts = [];
    lines.forEach((l, i) => {
      if (l.length > 70) return;
      let m;
      if ((m = l.match(/(?:serves|servings|portions?|yield|makes|porsjoner|personer|antall)\s*:?\s*(\d+(?:\s*[-–]\s*\d+)?[^,;|]*)/i))
        || (m = l.match(/^(\d+(?:\s*[-–]\s*\d+)?\s*(?:servings|portions|porsjoner|personer|pers\.?|people)\b)/i))) {
        if (!r.servings) r.servings = m[1].trim().slice(0, 40); facts.push(i);
        // "Serves 2-3, about 30 minutes, 220 °C": the minutes are the recipe's own total time.
        if (!r.totalMin && !/prep|cook|bake|forbered|steketid|koketid/i.test(l) && /min|hour|hr|time|timer/i.test(l)) {
          const d = parseDuration(l.replace(/\d+\s*°\s*[CF]?/g, ''));
          if (d) r.totalMin = d;
        }
      }
      if ((m = l.match(/(?:prep(?:aration)?(?:\s*time)?|forberedelse(?:stid)?|forb\.?\s*tid)\s*:\s*([^|·;,]+)/i))) { r.prepMin = parseDuration(m[1]); facts.push(i); }
      if ((m = l.match(/(?:cook(?:ing)?\s*time|bake\s*time|baking\s*time|steketid|koketid|cook|bake)\s*:\s*([^|·;,]+)/i))) { r.cookMin = parseDuration(m[1]); facts.push(i); }
      if ((m = l.match(/(?:^|[|·,;]\s*)(?:total(?:\s*time)?|total tid|tid|tidsbruk|ready in|klar på|time)\s*:\s*([^|·;,]+)/i)) && parseDuration(m[1])) { r.totalMin = parseDuration(m[1]); facts.push(i); }
      if ((m = l.match(/(?:difficulty|vanskelighetsgrad|nivå|level)\s*:?\s*(\w+)/i))) {
        const w = m[1].toLowerCase();
        r.difficultyWord = /easy|enkel|lett|simple/.test(w) ? 'easy' : /medium|middels|moderate|intermediate/.test(w) ? 'medium'
          : /hard|avansert|krevende|difficult|advanced|vanskelig/.test(w) ? 'hard' : undefined;
        facts.push(i);
      }
    });

    // Find the section headings.
    let iIng = -1, iSteps = -1, iNotes = -1;
    lines.forEach((l, i) => {
      if (iIng < 0 && looksLikeHeading(l, H_INGREDIENTS)) iIng = i;
      else if (iSteps < 0 && looksLikeHeading(l, H_STEPS)) iSteps = i;
      else if (iNotes < 0 && i > Math.max(iIng, iSteps) && Math.max(iIng, iSteps) >= 0 && looksLikeHeading(l, H_NOTES)) iNotes = i;
    });
    const firstSection = [iIng, iSteps].filter(i => i >= 0).sort((a, b) => a - b)[0] ?? lines.length;

    // The title: the first short line before the sections that isn't a link or a fact.
    const intro = [];
    for (let i = 0; i < firstSection; i++) {
      const l = lines[i];
      if (facts.includes(i) || /^https?:\/\//i.test(l)) continue;
      if (!r.title && l.length <= 120 && !/^(recipe|oppskrift)$/i.test(l)) { r.title = l.replace(/^#+\s*/, ''); continue; }
      intro.push(l);
    }

    const section = (start, ...ends) => {
      if (start < 0) return [];
      const end = Math.min(...ends.filter(e => e > start), lines.length);
      return lines.slice(start + 1, end).filter((_, k) => !facts.includes(start + 1 + k));
    };

    if (iIng >= 0 || iSteps >= 0) {
      r.steps = section(iSteps, iIng, iNotes);
      if (iNotes >= 0) r.notes = section(iNotes, iIng > iNotes ? iIng : -1, iSteps > iNotes ? iSteps : -1)
        .map(l => l.replace(BULLET, '').trim()).join('\n');
      if (iIng >= 0) {
        r.ingredients = section(iIng, iSteps, iNotes);
        // Short intro lines that look like ingredients but come before the headings stay as the description.
        r.description = intro.filter(l => l.length > 30).slice(0, 3).join(' ');
      } else {
        // A "Steps" heading but no "Ingredients" one (it may start straight with "For the meat"):
        // everything between the title and the steps is ingredients, after any opening sentences.
        let k = 0;
        while (k < intro.length && intro[k].length > 60 && /[.!?]$/.test(intro[k]) && !BULLET.test(intro[k])) k++;
        r.description = intro.slice(0, k).join(' ');
        r.ingredients = intro.slice(k);
      }
    } else {
      // No headings: short lines starting with an amount are ingredients, sentences are steps.
      intro.forEach(l => {
        const amountFirst = /^[\d¼½¾⅓⅔⅛]|^[•\-*]/.test(l) && !/^\d+\s*[.)]\s+\S/.test(l);
        if (amountFirst && l.length < 90) r.ingredients.push(l);
        else if (l.length > 40 || /^\d+\s*[.)]/.test(l) || /^(step|steg)\s*\d/i.test(l)) r.steps.push(l);
        else if (!r.steps.length && !r.ingredients.length) r.description += (r.description ? ' ' : '') + l;
        else r.ingredients.push(l);
      });
    }

    r.ingredients = tidyIngredients(r.ingredients);
    r.steps = tidySteps(r.steps);
    if (!r.title) r.title = 'Untitled recipe';
    return r;
  }

  // Bullets off, and an amount on its own line ("200 g" / "flour") joined to the next line.
  // In a bulleted list, a line WITHOUT a bullet ("Couscous", "Sauce") is the name of a part.
  function partLine(list, raw) {
    const bullets = list.filter(l => BULLET.test(l)).length;
    if (bullets < 3 || bullets < list.length * 0.6 || BULLET.test(raw)) return '';
    const l = raw.trim();
    return l.length <= 40 && !/[.!?]$/.test(l) && !/^[\d¼½¾⅓⅔⅛]/.test(l) ? l.replace(/:?$/, ':') : '';
  }

  function tidyIngredients(list) {
    const out = [];
    for (let i = 0; i < list.length; i++) {
      const part = partLine(list, list[i]);
      if (part) { out.push(part); continue; }
      let l = list[i].replace(BULLET, '').trim();
      if (!l) continue;
      if (/^[\d¼½¾⅓⅔⅛.,/\s-]+(?:(?:g|kg|ml|cl|dl|l|ss|ts|tbsp|tsp|cups?|stk|oz|lb|pk|boks)\.?)?$/i.test(l) && l.length <= 10 && list[i + 1]) {
        l = l + ' ' + list[++i].replace(BULLET, '').trim();
      }
      if (/^(?:ingredients?|ingredienser)$/i.test(l)) continue;
      out.push(isHeading(l) && !/:$/.test(l) ? l + ':' : l);   // part headings always end in a colon
    }
    return out.slice(0, 120);
  }
  // Bullets and "Step 1" / "1." off; a line starting in lowercase carries on the step before it.
  function tidySteps(list) {
    const out = [];
    for (const raw of list) {
      const part = partLine(list, raw);
      if (part) { out.push(part); continue; }
      const l = raw.replace(BULLET, '').replace(STEP_NUMBER, '').trim();
      if (!l || /^\d+$/.test(l)) continue;
      if (isHeading(l)) { out.push(/:$/.test(l) ? l : l + ':'); continue; }
      if (out.length && /^[a-zæøå(]/.test(l) && !/[.!:]$/.test(out[out.length - 1])) out[out.length - 1] += ' ' + l;
      else out.push(l);
    }
    return out.slice(0, 80);
  }

  /* ───────── a recipe read from a web page ───────── */
  function fromSchema(s) {
    return {
      title: s.title || 'Untitled recipe',
      description: s.description || '',
      image: s.image || '',
      servings: s.servings || '',
      prepMin: s.prepMin || null,
      cookMin: s.cookMin || null,
      totalMin: s.totalMin || null,
      ingredients: tidyIngredients(s.ingredients || []),
      steps: tidySteps(s.steps || []),
      notes: '',
      cuisineNames: s.cuisine || [],
      category: s.category || [],
      keywords: s.keywords || [],
      diet: s.diet || [],
      author: s.author || '',
    };
  }

  /* ───────── changing the servings ─────────
     Only the amount at the start of a line changes: "1 ½ cups milk" × 2 → "3 cups milk". */
  const FRACTIONS = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 };
  const AMOUNT = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\s*[¼½¾⅓⅔⅛]|[¼½¾⅓⅔⅛]|\d+(?:[.,]\d+)?)(\s*[-–]\s*(\d+(?:[.,]\d+)?))?/;
  function readAmount(s) {
    s = s.trim();
    let m;
    if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3];
    if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
    if ((m = s.match(/^(\d*)\s*([¼½¾⅓⅔⅛])$/))) return (+m[1] || 0) + FRACTIONS[m[2]];
    return parseFloat(s.replace(',', '.'));
  }
  function showAmount(n) {
    if (n >= 10) return String(Math.round(n));
    const whole = Math.floor(n), rest = n - whole;
    for (const [ch, v] of Object.entries(FRACTIONS)) if (Math.abs(rest - v) < 0.04) return (whole || '') + ch;
    if (rest < 0.04) return String(whole);
    if (rest > 0.96) return String(whole + 1);
    return String(Math.round(n * 10) / 10);
  }
  function scale(line, factor) {
    if (!factor || factor === 1) return line;
    const m = line.match(AMOUNT);
    if (!m) return line;
    const a = readAmount(m[1]);
    if (!isFinite(a)) return line;
    let txt = showAmount(a * factor);
    if (m[3]) txt += '–' + showAmount(readAmount(m[3]) * factor);
    return txt + line.slice(m[0].length);
  }
  // "4 servings" → 4,  "6-8 personer" → 6
  const servingsNumber = s => { const m = String(s || '').match(/\d+/); return m ? +m[0] : 0; };

  window.Cook = { CATS, TAGS, find, timeBucket, priceBand, parts, partName, partEmoji, parseText, fromSchema, guess, scale, isHeading, servingsNumber, parseDuration };
})();
