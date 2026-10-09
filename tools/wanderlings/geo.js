// Geography helpers: route polylines, distances, and placing map eggs on
// real walkable paths (via OpenStreetMap's Overpass API).

import { MAP_TIERS } from './creatures.js';

export function decodePolyline(str) {
  if (!str) return [];
  const pts = [];
  let i = 0, lat = 0, lng = 0;
  while (i < str.length) {
    for (const which of [0, 1]) {
      let shift = 0, result = 0, b;
      do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      const d = result & 1 ? ~(result >> 1) : result >> 1;
      if (which === 0) lat += d; else lng += d;
    }
    pts.push([lat / 1e5, lng / 1e5]);
  }
  return pts;
}

const R = 6371000;
const rad = d => d * Math.PI / 180;

export function distM(a, b) {
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function offset([lat, lng], km, bearing) {
  const d = km * 1000 / R, br = bearing;
  const φ1 = rad(lat), λ1 = rad(lng);
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(d) + Math.cos(φ1) * Math.sin(d) * Math.cos(br));
  const λ2 = λ1 + Math.atan2(Math.sin(br) * Math.sin(d) * Math.cos(φ1), Math.cos(d) - Math.sin(φ1) * Math.sin(φ2));
  return [φ2 * 180 / Math.PI, λ2 * 180 / Math.PI];
}

// Did a route pass within `meters` of a point? Checks segments, not just
// vertices, because simplified route polylines are fairly sparse.
export function routeNear(points, target, meters) {
  if (!points.length) return false;
  const k = Math.cos(rad(target[0]));
  const xy = p => [(p[1] - target[1]) * k * 111320, (p[0] - target[0]) * 110540];
  let prev = xy(points[0]);
  if (Math.hypot(...prev) <= meters) return true;
  for (let i = 1; i < points.length; i++) {
    const cur = xy(points[i]);
    const dx = cur[0] - prev[0], dy = cur[1] - prev[1];
    const len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, -(prev[0] * dx + prev[1] * dy) / len2)) : 0;
    if (Math.hypot(prev[0] + t * dx, prev[1] + t * dy) <= meters) return true;
    prev = cur;
  }
  return false;
}

// Home = the spot most walks start near.
export function inferHome(walks) {
  const starts = walks.map(w => w.points[0]).filter(Boolean);
  if (!starts.length) return null;
  let best = starts[0], bestN = 0;
  for (const s of starts) {
    const n = starts.filter(o => distM(s, o) < 300).length;
    if (n > bestN) { best = s; bestN = n; }
  }
  const near = starts.filter(o => distM(best, o) < 300);
  return [near.reduce((a, p) => a + p[0], 0) / near.length, near.reduce((a, p) => a + p[1], 0) / near.length];
}

async function snapToPath([lat, lng]) {
  const q = `[out:json][timeout:8];
    way(around:220,${lat.toFixed(5)},${lng.toFixed(5)})["highway"~"^(footway|path|pedestrian|living_street|residential|track|cycleway|unclassified|tertiary|service)$"]["access"!~"^(private|no)$"];
    node(w);out skel;`;
  for (const endpoint of ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(endpoint, { method: 'POST', body: 'data=' + encodeURIComponent(q), signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) continue;
      const { elements } = await res.json();
      let best = null, bestD = Infinity;
      for (const n of elements) {
        const d = distM([lat, lng], [n.lat, n.lon]);
        if (d < bestD) { bestD = d; best = [n.lat, n.lon]; }
      }
      return best || [lat, lng];
    } catch { /* try the next mirror */ }
  }
  return [lat, lng]; // offline / rate limited: unsnapped is still fine
}

// Three eggs per batch: nearby, stretch distance, and a golden one a bit
// further. Radius is half her stretch walk (out and back), with slack for
// paths not being straight lines.
export async function generateEggs({ home, stretchKm, batchId, createdAt, expiresAt }) {
  let seed = [...batchId].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const base = rnd() * Math.PI * 2;
  const tiers = Object.entries(MAP_TIERS);
  return Promise.all(tiers.map(async ([tier, info], i) => {
    const radiusKm = Math.max(0.25, (stretchKm / 2) * 0.8 * info.radius);
    const bearing = base + i * (Math.PI * 2 / 3) + (rnd() - 0.5) * 0.8;
    const pos = await snapToPath(offset(home, radiusKm, bearing));
    return { id: `${batchId}-${tier}`, tier, lat: pos[0], lng: pos[1], createdAt, expiresAt };
  }));
}
