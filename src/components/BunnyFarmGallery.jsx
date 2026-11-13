import { useState } from 'react';
import { useSiteCopy } from '../content/SiteCopy';

export default function BunnyFarmGallery() {
  const copy = useSiteCopy();
  const [page, setPage] = useState(1);
  return (
    <div className="bunny-farm-gallery">
      <div className="bunny-farm-heading">
        <div>
          <span className="announcement-eyebrow">{copy('farm.eyebrow', 'OUR LITTLE BUNNY FAMILY')}</span>
          <h3>{copy('farm.title', 'ฟาร์มกระต่ายของพวกเรา')}</h3>
          <p>{copy('farm.description', 'ทุกตัวคือหนึ่งกำลังใจที่อยู่ข้างโรส')}</p>
        </div>
      </div>
      <div className="bunny-farm-pages" role="group" aria-label={copy("farm.pages", "เลือกหน้าฟาร์มกระต่าย")}>
        {[1, 2, 3].map(number => <button type="button" key={number} aria-pressed={page === number} onClick={() => setPage(number)}>{copy("farm.page", "หน้า {page}", { page: number })}</button>)}
      </div>
      <div className="bunny-farm-artwork">
        {<img key={page} src={`/assets/bunny-farm/rose-gun-page-${page}.webp`} alt={copy('farm.imageAlt', 'ฟาร์มกระต่าย Rose & GuN หน้า {page}', { page })} loading="lazy" width="2200" height="1529" draggable={false} />}
      </div>
    </div>
  );
}
