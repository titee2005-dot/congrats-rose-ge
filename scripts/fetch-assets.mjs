import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const BASE_URL =
  'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-birthday-assets';

const ASSETS = [
  {
    remote: 'hero_garden_party.jpg',
    local: 'public/assets/hero_garden_party.jpg',
    sha256: '091418bb35d301ae9c972cbf34e419e1445021400d9b349cfc84908261b0fe85',
  },
  {
    remote: 'fonts/LINESeedSansTH_W_Rg.woff2',
    local: 'public/assets/fonts/LINESeedSansTH_W_Rg.woff2',
    sha256: 'caf74c95ba957707253e40747d8364c937970df80551ab0766afc073d1fd90d6',
  },
  {
    remote: 'fonts/LINESeedSansTH_W_Bd.woff2',
    local: 'public/assets/fonts/LINESeedSansTH_W_Bd.woff2',
    sha256: '63a428a7989a73de4e908092717de3a70a2c128b7b01b35a3821f39db22a2003',
  },
  {
    remote: 'fonts/LINESeedSansTH_W_XBd.woff2',
    local: 'public/assets/fonts/LINESeedSansTH_W_XBd.woff2',
    sha256: 'd3650b99c0ba298365c7a8a95fcc628421d5a8e23fc99484a23a52f3c855c99b',
  },
];

for (const asset of ASSETS) {
  const target = resolve(process.cwd(), asset.local);
  if (existsSync(target)) continue;

  const res = await fetch(`${BASE_URL}/${asset.remote}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${asset.remote}: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const digest = createHash('sha256').update(buf).digest('hex');
  if (digest !== asset.sha256) {
    throw new Error(`SHA-256 mismatch for ${asset.remote}`);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, buf);
  console.log(`Fetched ${asset.local} (${buf.length} bytes)`);
}
