// Tyse Fam: the Cookbook page's server side (tools/cookbook/).
// A web page can't read another website itself (browsers block it), so when someone pastes a
// recipe link the page asks this function to fetch it.
//
// Route (under /functions/v1/recipes/), signed-in family members only:
//   POST import   { url }   →   { recipe: { title, image, ingredients, steps, … } }
//
// How it reads a recipe page:
//   1. Almost every recipe site hides a tidy copy of the recipe in the page for Google
//      (a <script type="application/ld+json"> block with "@type": "Recipe"). We use that.
//   2. If there isn't one, we send back the page's plain text instead, and the Cookbook page
//      picks out the ingredients and steps the same way it does for pasted text.
// Sorting into cost / difficulty / protein / cuisine happens on the page (tools/cookbook/guess.js),
// so pasted recipes and links are sorted the same way.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const MAX_PAGE = 3_000_000;   // bytes: we stop reading a page after this much
const MAX_TEXT = 40_000;      // characters of plain text sent back when there's no tidy copy

// The signed-in person, but only if they're on the family guest list.
async function familyMember(req: Request) {
  const jwt = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!jwt) return null;
  const { data, error } = await db.auth.getUser(jwt);
  if (error || !data.user?.email) return null;
  const { data: row } = await db.from('allowed_emails').select('email')
    .eq('email', data.user.email.toLowerCase()).maybeSingle();
  return row ? data.user : null;
}

/* ───────── checking the link ───────── */
// Only ordinary public web addresses: no computer-internal addresses.
function tidyUrl(raw: unknown) {
  const text = String(raw || '').trim();
  let u: URL;
  try { u = new URL(/^https?:\/\//i.test(text) ? text : 'https://' + text); } catch { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  const host = u.hostname.toLowerCase();
  if (!host.includes('.') || host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith('[')) return null;   // bare IP addresses
  u.hash = '';
  return u.href;
}

/* ───────── fetching the page ───────── */
async function fetchPage(url: string) {
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
    headers: {
      // Some sites refuse anything that doesn't look like a normal browser.
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en,nb;q=0.8,no;q=0.7',
    },
  });
  if (res.status === 404) throw new Error('That page doesn’t exist (the site said 404).');
  if (res.status === 401 || res.status === 403) throw new Error('That site won’t let us read its page. Copy the recipe text and paste it in instead.');
  if (!res.ok) throw new Error(`The site answered with an error (${res.status}).`);
  const type = res.headers.get('content-type') || '';
  if (type && !/html|xml|text/i.test(type)) throw new Error('That link isn’t a web page (maybe a picture or PDF?).');
  // Read at most MAX_PAGE bytes.
  const reader = res.body!.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < MAX_PAGE) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); size += value.length;
  }
  reader.cancel().catch(() => {});
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) { bytes.set(c.subarray(0, size - at), at); at += c.length; }
  return { html: new TextDecoder('utf-8').decode(bytes), finalUrl: res.url || url };
}

/* ───────── small text helpers ───────── */
const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', frac12: '½', frac14: '¼', frac34: '¾',
  deg: '°', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  aring: 'å', Aring: 'Å', oslash: 'ø', Oslash: 'Ø', aelig: 'æ', AElig: 'Æ', eacute: 'é', egrave: 'è',
  uuml: 'ü', ouml: 'ö', auml: 'ä', ntilde: 'ñ', ccedil: 'ç', times: '×', frasl: '⁄',
};
function decode(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try { return String.fromCodePoint(n); } catch { return m; }
    }
    return ENTITIES[e] ?? m;
  });
}
// Plain text from a bit of HTML: tags out, entities decoded, spaces tidied.
const clean = (v: unknown) =>
  decode(decode(String(v ?? '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ')))
    .replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n').trim();
const asList = (v: unknown): unknown[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const firstText = (v: unknown) => {
  for (const x of asList(v)) {
    const s = typeof x === 'string' ? x : (x as Record<string, unknown>)?.name ?? (x as Record<string, unknown>)?.text;
    if (s) return clean(s);
  }
  return '';
};

/* ───────── 1. the tidy copy (schema.org Recipe) ───────── */
function findRecipe(node: unknown, depth = 0): Record<string, unknown> | null {
  if (!node || typeof node !== 'object' || depth > 8) return null;
  if (Array.isArray(node)) {
    for (const n of node) { const r = findRecipe(n, depth + 1); if (r) return r; }
    return null;
  }
  const o = node as Record<string, unknown>;
  const types = asList(o['@type']).map(t => String(t).toLowerCase());
  if (types.some(t => t === 'recipe' || t.endsWith('/recipe'))) return o;
  for (const key of ['@graph', 'mainEntity', 'mainEntityOfPage', 'itemListElement', 'item']) {
    const r = findRecipe(o[key], depth + 1); if (r) return r;
  }
  return null;
}
function jsonLdRecipe(html: string) {
  const blocks = html.matchAll(/<script[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi);
  for (const [, raw] of blocks) {
    let data: unknown;
    try { data = JSON.parse(raw.trim()); }
    catch {
      // Some sites leave stray control characters or HTML comments in it.
      try { data = JSON.parse(raw.replace(/<!--|-->/g, '').replace(/[\u0000-\u001f]+/g, ' ').trim()); } catch { continue; }
    }
    const r = findRecipe(data);
    if (r) return r;
  }
  return null;
}

// "recipeInstructions" comes in many shapes: one long string, a list of strings, a list of
// steps ({ text }), or sections ({ name, itemListElement: [steps] }). Sections become "Name:" lines.
function steps(v: unknown, out: string[] = [], depth = 0): string[] {
  if (depth > 5) return out;
  for (const x of asList(v)) {
    if (typeof x === 'string') {
      const text = clean(x);
      // One big string: split it into lines (or numbered sentences).
      text.split(/\n+|(?:^|\s)(?=\d+[.)]\s)/).map(s => s.trim()).filter(Boolean).forEach(s => out.push(s));
    } else if (x && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const kids = o.itemListElement ?? o.steps;
      if (kids) {
        if (o.name) out.push(clean(o.name).replace(/:?$/, ':'));
        steps(kids, out, depth + 1);
      } else {
        const text = clean(o.text ?? o.description ?? o.name ?? '');
        if (text) out.push(text);
      }
    }
  }
  return out;
}

function image(v: unknown): string {
  for (const x of asList(v)) {
    const s = typeof x === 'string' ? x : (x as Record<string, unknown>)?.url ?? (x as Record<string, unknown>)?.contentUrl;
    if (typeof s === 'string' && /^https?:\/\//i.test(s)) return s;
  }
  return '';
}

// "PT1H15M" → 75 (minutes). null when it isn't a duration.
function minutes(v: unknown): number | null {
  const m = String(v ?? '').match(/^P(?:(\d+(?:\.\d+)?)D)?T?(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+)S)?$/i);
  if (!m || !m[0] || m[0].toUpperCase() === 'P' || m[0].toUpperCase() === 'PT') return null;
  const total = (+(m[1] || 0)) * 1440 + (+(m[2] || 0)) * 60 + (+(m[3] || 0)) + Math.round((+(m[4] || 0)) / 60);
  return total > 0 ? Math.round(total) : null;
}

function fromSchema(r: Record<string, unknown>) {
  const ingredients = asList(r.recipeIngredient ?? r.ingredients).map(clean).filter(Boolean);
  const keywords = asList(r.keywords).flatMap(k => String(k).split(',')).map(clean).filter(Boolean);
  return {
    title: firstText(r.name) || firstText(r.headline),
    description: clean(r.description).slice(0, 600),
    image: image(r.image),
    servings: clean(asList(r.recipeYield).find(y => /\d/.test(String(y))) ?? asList(r.recipeYield)[0] ?? ''),
    prepMin: minutes(r.prepTime),
    cookMin: minutes(r.cookTime),
    totalMin: minutes(r.totalTime),
    ingredients,
    steps: steps(r.recipeInstructions),
    cuisine: asList(r.recipeCuisine).flatMap(c => clean(c).split(',')).map(s => s.trim()).filter(Boolean),
    category: asList(r.recipeCategory).flatMap(c => clean(c).split(',')).map(s => s.trim()).filter(Boolean),
    keywords: keywords.slice(0, 30),
    diet: asList(r.suitableForDiet).map(d => String(d).replace(/^.*\//, '').replace(/Diet$/, '')),
    author: firstText(r.author),
  };
}

/* ───────── 2. no tidy copy: the page's title, picture and plain text ───────── */
function meta(html: string, name: string) {
  const re = new RegExp(`<meta[^>]+(?:property|name)\\s*=\\s*["']${name}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  return tag ? clean(tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1] ?? '') : '';
}
function pageText(html: string) {
  return clean(html
    .replace(/<(script|style|noscript|svg|nav|header|footer|form|iframe|aside)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/(p|div|li|h[1-6]|tr|section|article|ul|ol)>/gi, '\n')
    .replace(/<(h[1-6])[^>]*>/gi, '\n'))
    .split('\n').map(s => s.trim()).filter(Boolean).join('\n')
    .slice(0, MAX_TEXT);
}

/* ───────── the route ───────── */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const parts = new URL(req.url).pathname.split('/').filter(Boolean);
  const route = parts.slice(parts.indexOf('recipes') + 1).join('/');

  try {
    const user = await familyMember(req);
    if (!user) return json({ error: 'not_family' }, 401);

    if (route === 'import' && req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const link = tidyUrl(body?.url);
      if (!link) return json({ error: 'That doesn’t look like a web link. It should start with https://' }, 400);
      let page;
      try { page = await fetchPage(link); }
      catch (e) {
        const msg = (e as Error).name === 'TimeoutError' ? 'The site took too long to answer.' : (e as Error).message;
        return json({ error: msg }, 400);
      }
      const schema = jsonLdRecipe(page.html);
      const source = page.finalUrl;
      if (schema) {
        const recipe = fromSchema(schema);
        if (recipe.ingredients.length || recipe.steps.length) {
          if (!recipe.image) recipe.image = meta(page.html, 'og:image');
          return json({ found: 'schema', source, recipe });
        }
      }
      // No tidy copy: send the page text for the Cookbook page to read.
      return json({
        found: 'text', source,
        recipe: {
          title: meta(page.html, 'og:title') || clean(page.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
          description: meta(page.html, 'og:description') || meta(page.html, 'description'),
          image: meta(page.html, 'og:image'),
        },
        text: pageText(page.html),
      });
    }

    return json({ error: 'not_found' }, 404);
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message || 'Something went wrong' }, 500);
  }
});
