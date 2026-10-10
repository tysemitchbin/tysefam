// Talking to Elvia's customer API (meter readings). The token comes from Elvia's
// "Min side" → Tilganger → create a token for meter values (målerverdier).
import { hourKey, osloHour, type Hour } from './grid.ts';

const ELVIA = 'https://elvia.azure-api.net/customer/metervalues/api/v1';

async function elvia(token: string, path: string, params: Record<string, string> = {}) {
  const res = await fetch(`${ELVIA}/${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) throw new Error('Elvia didn’t accept the token (it may have expired).');
  if (!res.ok) throw new Error(`Elvia error ${res.status}`);
  return res.json();
}

/** The meters (målepunkt ids, same as the EAN Tibber shows) this token can read. */
export async function elviaMeters(token: string): Promise<string[]> {
  const data = await elvia(token, 'maxhours');
  return (data.meteringpoints || []).map((m: any) => String(m.meteringPointId));
}

/** Hourly use per meter since `since` (YYYY-MM-DD, at most a year back). */
export async function elviaHours(token: string, since: string): Promise<Map<string, Hour[]>> {
  const data = await elvia(token, 'metervalues', {
    startTime: `${since}T00:00:00+01:00`,
    endTime: new Date().toISOString().slice(0, 19) + 'Z',
  });
  const out = new Map<string, Hour[]>();
  for (const m of data.meteringpoints || []) {
    const series = m.metervalue?.timeSeries || [];
    out.set(String(m.meteringPointId), series
      .filter((t: any) => t.value != null)
      .map((t: any) => ({ key: hourKey(t.startTime), local: osloHour(t.startTime), kwh: Number(t.value) })));
  }
  return out;
}
