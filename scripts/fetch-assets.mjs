import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const BASE_URL =
  'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-birthday-assets';

const SOURCE_BUNDLE = {
  remote: 'source-bundle-v10.json',
  sha256: '09c8787a817e844bc92559ea3a419247b482cc59fc9d59c79dcf4ac82c4570d9',
};

const ASSETS = [
  {
    remote: 'og_cover.jpg',
    local: 'public/assets/og_cover.jpg',
    sha256: '0879904bd24a7a7a3010f40ceec14ad6208e9e2305609d57c07b0d2dea881952',
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

async function fetchVerifiedBuffer(remoteName, expectedSha256) {
  const res = await fetch(`${BASE_URL}/${remoteName}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${remoteName}: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const digest = createHash('sha256').update(buf).digest('hex');
  if (digest !== expectedSha256) {
    throw new Error(`SHA-256 mismatch for ${remoteName}`);
  }
  return buf;
}

if (!existsSync(resolve(process.cwd(), 'src/App.jsx'))) {
  const bundleBuf = await fetchVerifiedBuffer(
    SOURCE_BUNDLE.remote,
    SOURCE_BUNDLE.sha256
  );
  const filesMap = JSON.parse(bundleBuf.toString('utf8'));
  for (const [relPath, content] of Object.entries(filesMap)) {
    const outPath = resolve(process.cwd(), relPath);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content, 'utf8');
  }
  console.log(`Restored ${Object.keys(filesMap).length} source files.`);
}

for (const asset of ASSETS) {
  const target = resolve(process.cwd(), asset.local);
  if (existsSync(target)) continue;
  const buf = await fetchVerifiedBuffer(asset.remote, asset.sha256);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, buf);
  console.log(`Fetched ${asset.local} (${buf.length} bytes)`);
}
