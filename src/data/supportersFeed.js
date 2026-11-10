export const SUPPORTERS_FEED_URL = `https://docs.google.com/spreadsheets/d/1UPM1vEUMriWyQvQ_GVj8lr__JpgT67lYsrH05I-di4Y/gviz/tq?${new URLSearchParams({ sheet: 'จัดอันดับโดเนท', tq: 'select B,C', tqx: 'out:json', headers: '1' })}`;

export function parseSupportersFeed(text) {
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
  if (!match) throw new Error('Invalid sheet response');
  const payload = JSON.parse(match[1]);
  if (payload.status !== 'ok' || !Array.isArray(payload.table?.rows)) throw new Error('Sheet unavailable');
  const totals = new Map();
  for (const row of payload.table.rows) {
    const name = typeof row.c?.[0]?.v === 'string' ? row.c[0].v.trim() : '';
    const raw = row.c?.[1]?.v;
    const amount = typeof raw === 'number' ? raw : Number(String(raw ?? '').replace(/,/g, ''));
    if (!name || raw == null || !Number.isFinite(amount) || amount < 0) continue;
    totals.set(name, (totals.get(name) || 0) + Math.round(amount * 100));
  }
  if (!totals.size) throw new Error('No supporter data');
  return [...totals].map(([name, cents]) => ({ name, amount: cents / 100 }))
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name, 'th'));
}
