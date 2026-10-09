# Wanderlings — Scenario prompts

## How to get a consistent set

1. **Lock the style first.** Generate the four commons (Puddlepip, Mossling, Pebblet, Fluffwick) using the style block below. Generate plenty of each and keep only the ones that feel like they belong to the same world.
2. **Train a custom style model** in Scenario on your 10–20 favourite results. After that, every new creature comes out in the same style, and you only need the short per-creature line.
3. Use **square 1024×1024**, one creature per image, centred, with the full body visible.
4. **Remove the background**, export as PNG, and save it as `public/art/<id>.png` (for example `public/art/mossling.png`).
5. Add the id to the `ART` set at the top of the renderer in `public/creatures.js`. That creature switches from the placeholder drawing to your art everywhere: garden, creature book, hatching and silhouettes.

---

## Style block (paste at the start of every prompt)

```
cute collectible creature mascot, chubby round body, tiny stubby feet, big glossy friendly eyes, soft rosy cheeks, gentle smile, soft pastel colour palette, smooth soft-shaded 3D clay / vinyl toy look, subtle rim light, cosy storybook feel, full body, front three-quarter view, centred, single character, plain white background, game asset, high detail, clean silhouette
```

## Negative prompt

```
scary, creepy, sharp teeth, angry, realistic animal, photorealistic, gore, dark, gritty, horror, multiple characters, text, watermark, logo, cropped, cut off, busy background, extra limbs, deformed, human
```

---

## The 26 creatures in the app

Each line goes after the style block. The id is the filename to save it under.

### Everyday friends (any walk)
| id | prompt |
|---|---|
| `puddlepip` | small sky-blue water-drop creature, pale blue belly, a little water droplet bobbing above its head, splashy and delighted, darker blue speckles |
| `mossling` | tall soft green moss sprite, pale green belly, a single fresh leaf sprouting from the top of its head, gentle and shy |
| `pebblet` | wide round lavender-grey pebble creature, smooth stone texture, a few darker spots, eyes squeezed shut in a happy smile, sitting contentedly |
| `fluffwick` | tiny cream-coloured puffball creature, extremely fluffy, round little ears with peach insides, warm and sleepy-cosy |

### Time & season
| id | prompt |
|---|---|
| `dawnfinch` | round peach-orange baby bird creature, cream belly, small coral beak, little stubby wings spread wide, morning sunrise glow behind it |
| `sunbun` | tall sunny-yellow bunny creature, long ears with golden insides, happy closed eyes, soft sunbeam rays radiating behind it |
| `duskmoth` | tall lilac moth creature, fuzzy body, two curly antennae with purple bobbles, soft translucent purple wings, golden-hour lighting |
| `glowwisp` | round sleepy deep-blue creature with periwinkle belly, softly glowing like a lantern, tiny yellow crescent moon mark on its forehead, sleepy half-closed eyes, night-time glow |
| `sundaisy` | round pastel-pink creature, white belly, a white daisy tucked behind one ear, round ears, happy closed eyes, lazy Sunday morning mood |
| `frostbun` | tall icy pale-blue bunny creature, white belly, frosty sparkles around it, tiny snowflakes, rosy cold cheeks, wrapped-up winter cosiness |
| `blossomb` | round blush-pink blossom creature, cherry-blossom flower on its head with a leaf, petals drifting around it, spring meadow mood |
| `buzzlet` | round chubby honey-yellow bumblebee creature, two soft brown stripes, tiny translucent wings, two little antennae, huge sparkly eyes |
| `acornet` | round warm-brown acorn creature, cream belly, wearing a bright orange autumn leaf as a hat, a couple of falling leaves around it |

### Distance & hills (reward longer walks)
| id | prompt |
|---|---|
| `strollkit` | round baby fox creature, soft orange with cream belly, pointy ears, big fluffy curled tail, curious and adventurous |
| `wanderwool` | wide fluffy white baby sheep creature, cloud-like wool, little curly dark horns, happy closed eyes, cosy and unhurried |
| `trailtusk` | wide sturdy baby boar / tapir creature, warm tan-brown, two tiny cream tusks, round ears, kind and dependable, a small walking-stick-shaped twig nearby |
| `lumenlong` | legendary tall glowing mint-teal fox spirit creature, pointy ears, long luminous tail, soft aura of light, sparkles drifting around it, magical and serene |
| `hillhop` | round mint-green bunny creature, long ears, happy closed eyes, mid-hop on a tiny grassy hill |
| `peakpuff` | round pale-blue-white mountain creature, pointy ears, a little snowcap on its head like a mountain peak, crisp alpine air |
| `slowpaw` | wide round sleepy sloth / bear creature, warm tan, relaxed half-closed eyes, round ears, ambling slowly and peacefully |

### Map explorers (only from map eggs)
| id | prompt |
|---|---|
| `compip` | round light-blue explorer creature, pointy ears, a little compass on its belly with a red needle, big curious eyes, tiny satchel |
| `waymoth` | tall lavender moth explorer creature, golden antennae, soft wings leaving a faint trail of glittering sparkles, a tiny lantern |
| `farfawn` | legendary baby fawn creature, warm caramel with white dapples, big gentle eyes, a flower behind one ear, soft golden glow, standing at the edge of a misty meadow |

### Special
| id | prompt |
|---|---|
| `pramble` | round baby-blue creature wearing a soft pink baby bonnet tied under its chin, sleepy content eyes, humming a lullaby, tiny musical notes around it |
| `kinbloom` | tall rose-pink flower creature, white belly, a yellow flower crown, happy closed eyes, surrounded by gentle sparkles, warm and proud |
| `hearthling` | legendary round golden-amber creature, pointy ears, a tiny golden crown, warm hearth-like glow, sparkles, big loving eyes, feels like home |

### Eggs (optional)
```
cute speckled collectible egg, cream shell with soft [blue / purple / golden] speckles, slight wobble pose, soft 3D clay look, plain white background, game asset
```
Make one egg per rarity tint: green (common), blue (uncommon), purple (rare) and gold (legendary/golden).

---

## Ideas for expanding the roster

These give a broad range. In the app each one needs a `test` rule (ideas included), but here's the art side:

| idea | prompt | could unlock when… |
|---|---|---|
| Drizzlewick | round grey-blue cloud creature with a tiny yellow raincoat hood, raindrops | a walk on a rainy day (needs weather data) |
| Puddlejump | frog-like green creature in red wellies, splashing | a rainy-day walk |
| Brambleberry | round purple creature covered in tiny berries, leafy collar | walk ≥ 30 min in summer |
| Toadstool | chubby red-capped mushroom creature with white spots | autumn walk with hills |
| Snugglebat | tiny fuzzy charcoal bat creature, wrapped in its own wings like a blanket | walk after 9pm |
| Dewdrop | translucent pastel slime creature with a tiny leaf | walk before 7am |
| Picnic Pup | round beige puppy creature carrying a tiny checkered picnic basket | weekend walk ≥ 45 min |
| Lilypaddle | pastel-green turtle creature with a lily pad on its shell | walk that passes water |
| Cocoa | round chocolate-brown bear cub creature holding a tiny mug of cocoa | winter walk |
| Pumpling | round orange pumpkin creature with a curly vine tail | October walk |
| Sprinkle | round pastel creature with rainbow sprinkles, like a cupcake | 10th walk milestone |
| Owlet | round fluffy brown baby owl creature with huge eyes | evening walk |
| Pinecone Pip | small brown pinecone hedgehog creature | walk with a lot of elevation |
| Breezle | white wispy wind spirit creature with a pinwheel | longest walk so far |
| Marshmallow | squishy white marshmallow seal creature | walk while it's cold |
| Clovey | round green four-leaf-clover creature | rare random chance on any walk |
| Nappuff | round sleepy lilac creature with a nightcap and pillow | a walk after a 4+ day break ("welcome back") |
| Tidepip | small pastel crab creature with a seashell | walk near the coast |
| Starling | round midnight-blue creature with constellation freckles | walk after dark in winter |
| Bloomkin | round creature that's half bud half bunny, sprouting more flowers each evolution | 4 walks in one week |
