---
name: cookbook-recipes
description: Write every recipe in the exact plain-text layout that pastes cleanly into the family Cookbook website (Tyse Fam), inside one copyable code block. Use this whenever you write, suggest, adapt, scale, translate or fix a recipe for this user — a dinner idea with ingredients, "what can I make with…", a meal plan with recipes, a baking recipe, a drink, a sauce, an Instant Pot or slow-cooker dish, or a recipe copied from somewhere and tidied up — even if they don't mention the cookbook. Not for food chat with no actual recipe (restaurant tips, nutrition questions, shopping lists on their own).
---

# Recipes for the family Cookbook

The user keeps their recipes on a family Cookbook website. They add a recipe by copying it from
this chat and pasting it into the site, which reads the text line by line and works out the
ingredients, steps, servings, parts of the dish (the meat, the sauce, the rice), how long it
really takes, roughly what it costs in Norwegian kroner, and which shelves it belongs on
(meal, main protein, cuisine, time, difficulty, cost). The reader is simple and literal, so a
recipe in the layout below goes in perfectly, while fancy formatting can lose ingredients.

## How to answer

1. A sentence or two before the recipe is fine (what it is, why it suits them).
2. Then the whole recipe in **one** code block marked `text`, so the user can tap Copy and get
   exactly these characters. Rendered markdown loses the list markers and headings when copied,
   which is why the code block matters.
3. Anything that isn't part of the recipe (variations you're offering, wine pairing, questions)
   goes after the code block, not inside it.

## The layout

```text
Teriyaki chicken bowls with pickled cucumber
Serves: 4
Prep time: 15 min
Cook time: 25 min
Sticky soy-glazed chicken thighs on jasmine rice, with a quick cucumber pickle for crunch.

Ingredients
For the chicken:
- 600 g boneless chicken thighs, cut into bite-size pieces
- 1 tbsp neutral oil
For the sauce:
- 4 tbsp soy sauce
- 2 tbsp mirin
- 1 tbsp honey
- 1 garlic clove, grated
- 1 tsp grated fresh ginger
For the rice:
- 300 g jasmine rice
- 450 ml water
For the pickled cucumber:
- 1 cucumber, thinly sliced
- 2 tbsp rice vinegar
- 1 tsp sugar
- 1 pinch salt

Steps
For the pickled cucumber:
1. Toss the cucumber with the vinegar, sugar and salt and set aside for 10 minutes.
For the rice:
2. Rinse the rice, bring it to the boil with the water, then cover and simmer on low for 12 minutes. Rest 10 minutes off the heat.
For the sauce:
3. Whisk the soy sauce, mirin, honey, garlic and ginger together.
For the chicken:
4. Fry the chicken in the oil over high heat for 6–8 minutes until browned and cooked through.
5. Pour in the sauce and simmer for 3 minutes until sticky.
Putting it together:
6. Spoon rice into bowls, top with the chicken and the pickled cucumber.

Notes
- Swap the chicken for firm tofu to make it vegetarian.
- Leftovers keep 2 days in the fridge.
```

## The rules, and why

**Top of the recipe**
- First line: the recipe's name, on its own. It becomes the book's title.
- Then `Serves: 4`, `Prep time: 15 min`, `Cook time: 25 min` (optionally `Total time: 40 min`),
  each on its own line with a colon. The site reads these exact labels; servings must be a number
  so it can scale amounts.
- Be honest with times. The site makes its own realistic estimate and shows yours next to it;
  "30 minutes" for something that takes an hour just looks wrong there.
- Optional: one description sentence (over ~60 characters, ending with a full stop).

**Section headings**: write `Ingredients`, `Steps` and (if needed) `Notes` exactly like that,
each alone on a line, no colon, no `#` or `**`. These words are how the site finds each section.

**Ingredients**
- One ingredient per line, starting with `- `.
- Put the amount first, then the unit, then the ingredient: `- 500 g beef mince`,
  `- 2 dl cream`, `- 3 garlic cloves, crushed`, `- 1 can (400 g) chopped tomatoes`.
  The site scales the leading number when servings change and prices each line from its
  amount, so "a good handful of" or amounts at the end of the line break both.
- Prefer metric (g, kg, ml, dl, l) and tbsp/tsp; the family is in Norway. Cups are understood but
  grams are better.
- Name ingredients plainly and specifically (`chicken thighs`, not `protein of choice`;
  `kjøttdeig` or `beef mince` both work). Words like `cut into strips` or `finely chopped` after a
  comma are useful: the site counts knife work in its time estimate.
- Salt, pepper and "to serve" items still get their own lines (`- Salt and black pepper`).
- No bold, italics, links, tables or emoji inside the code block.

**Parts of a dish**: when a recipe has distinct components (the meat, the sauce, the rice, a
dressing, a topping), give each one a heading line that ends with a colon, both in Ingredients
and in Steps, using the same name in both (`For the sauce:` above its ingredients and above its
steps). The site pairs them by name and shows a button per part, so the cook can look at just
the sauce, and it works out that parts can cook at the same time (the chicken fries while the
rice simmers), which makes its time estimate realistic.
- Only make a part when it has its own steps. Something used only at the end (an egg wash,
  herbs to garnish) goes under `Putting it together:` in Ingredients, next to the steps that use it.
- Use `Putting it together:` for the final assembly steps; the site knows those come last.
- A simple one-pot recipe doesn't need parts at all.

**Steps**
- Number the steps (`1.`, `2.`…), one action-sized step per line, each a full sentence starting
  with a capital letter. A line starting in lowercase is glued onto the step before it.
- Keep numbering running across parts (as in the example).
- Write the real time each step takes, in minutes: `Simmer for 20 minutes`,
  `Roast 15–18 minutes, turning halfway`, `Let rise for 45 minutes`. The time estimate is built
  from these. Write onions honestly (`8–10 minutes until soft`, `30 minutes to caramelise`).
- If something happens at the same time as the step before, start the step with `Meanwhile,`
  so the site doesn't add its time on top.
- Say `Preheat the oven to 200 °C` as its own short step when an oven is used.
- Equipment words are picked up as labels, so name them when they apply: `Instant Pot`
  (with `high pressure` and `natural release`), `slow cooker`, `air fryer`, `grill`, `one-pot`,
  `sheet pan`.

**Notes**: tips, swaps and storage go under `Notes`, one per line starting with `- `.

## Before you send it, check

- The whole recipe is inside one ```text code block, and nothing else is.
- Title on line 1; `Serves:` with a number; `Ingredients` and `Steps` headings present.
- Every ingredient line starts with `- ` and an amount (except salt/pepper/to-serve lines).
- Part headings end with `:` and match between Ingredients and Steps.
- Steps are numbered, each starts with a capital letter, and timed steps say how many minutes.

When the user asks for several recipes (a week of dinners), give each its own code block so each
can be copied and pasted separately.
