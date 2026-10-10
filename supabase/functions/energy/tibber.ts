// Talking to Tibber's API (https://developer.tibber.com).
import { hourKey, osloHour, type Hour } from './grid.ts';

const TIBBER = 'https://api.tibber.com/v1-beta/gql';

export async function tibber(token: string, query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(TIBBER, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'tysefam/1.0' },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json().catch(() => ({}));
  if (body.errors?.length) throw new Error(body.errors[0].message || 'Tibber error');
  if (!res.ok) throw new Error(`Tibber error ${res.status}`);
  return body.data;
}

// Everything the page's house cards show, in one request per Tibber login.
// Prices: hourly for the today/tomorrow charts, 15-minute for "right now"
// (Nordic power has been priced per quarter-hour since October 2025).
export const HOMES_QUERY = `{
  viewer {
    homes {
      id appNickname type size numberOfResidents mainFuseSize primaryHeatingSource timeZone
      address { address1 postalCode city }
      meteringPointData { consumptionEan gridCompany priceAreaCode }
      features { realTimeConsumptionEnabled }
      currentSubscription {
        status
        now: priceInfo(resolution: QUARTER_HOURLY) { current { total energy tax startsAt level currency } }
        priceInfo(resolution: HOURLY) {
          today { total startsAt level }
          tomorrow { total startsAt level }
        }
      }
      hourly: consumption(resolution: HOURLY, last: 48) { nodes { from consumption cost unitPrice currency } }
      daily: consumption(resolution: DAILY, last: 31) { nodes { from consumption cost unitPrice currency } }
      monthly: consumption(resolution: MONTHLY, last: 13) { nodes { from consumption cost unitPrice currency } }
    }
  }
}`;

// Turn Tibber's nested answer into the flat shape the page wants.
export function tidyHome(h: any, account: { id: string; name: string | null }) {
  const sub = h.currentSubscription || {};
  const nodes = (c: any) => (c?.nodes || []).filter((n: any) => n.consumption != null);
  return {
    id: h.id,
    account: account.id,
    accountName: account.name,
    nickname: h.appNickname,
    address: h.address,
    ean: h.meteringPointData?.consumptionEan || null,
    gridCompany: h.meteringPointData?.gridCompany || null,
    area: h.meteringPointData?.priceAreaCode || null,
    type: h.type,
    size: h.size,
    residents: h.numberOfResidents,
    fuse: h.mainFuseSize,
    heating: h.primaryHeatingSource,
    timeZone: h.timeZone,
    realtime: Boolean(h.features?.realTimeConsumptionEnabled),
    subscription: sub.status || null,
    price: sub.now?.current || null,
    today: sub.priceInfo?.today || [],
    tomorrow: sub.priceInfo?.tomorrow || [],
    hourly: nodes(h.hourly),
    daily: nodes(h.daily),
    monthly: nodes(h.monthly),
  };
}

// Just what the bill calculator needs to know about each home.
export const HOMES_BRIEF = `{ viewer { homes { id appNickname address { address1 city }
  meteringPointData { consumptionEan gridCompany priceAreaCode } } } }`;

const HOURLY_PAGE = `query ($id: ID!, $before: String) { viewer { home(id: $id) {
  consumption(resolution: HOURLY, last: 744, before: $before) {
    pageInfo { startCursor hasPreviousPage } nodes { from consumption } } } } }`;

/** Hourly use for one home since `since` (YYYY-MM-DD), a month's worth per request. */
export async function tibberHours(token: string, homeId: string, since: string): Promise<Hour[]> {
  const out: Hour[] = [];
  let before: string | null = null;
  for (let page = 0; page < 14; page++) {
    const data = await tibber(token, HOURLY_PAGE, { id: homeId, before });
    const c = data.viewer?.home?.consumption;
    const nodes = (c?.nodes || []).filter((n: any) => n.consumption != null);
    out.push(...nodes.map((n: any) => ({ key: hourKey(n.from), local: osloHour(n.from), kwh: n.consumption })));
    if (!c?.pageInfo?.hasPreviousPage || !nodes.length || nodes[0].from.slice(0, 10) < since) break;
    before = c.pageInfo.startCursor;
  }
  return out.filter(h => h.local.slice(0, 10) >= since);
}
