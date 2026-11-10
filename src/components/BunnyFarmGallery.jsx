import { useState } from 'react';

export default function BunnyFarmGallery() {
  const [page, setPage] = useState(1);
  return (
    <div className="bunny-farm-gallery">
      <div className="bunny-farm-heading">
        <div><span className="announcement-eyebrow">OUR LITTLE BUNNY FAMILY</span><h3>ฟาร์มกระต่ายของพวกเรา 🐰</h3><p>ทุกตัวคือหนึ่งกำลังใจที่อยู่ข้างโรส · แตะภาพเพื่อเปิดดูขนาดใหญ่</p></div>
        <div className="bunny-farm-pages" role="group" aria-label="เลือกหน้าฟาร์มกระต่าย">
          {[1, 2, 3].map((number) => <button type="button" key={number} aria-pressed={page === number} onClick={() => setPage(number)}>หน้า {number}</button>)}
        </div>
      </div>
      <a className="bunny-farm-image" href={`/assets/bunny-farm/page-${page}.png`} target="_blank" rel="noreferrer" aria-label={`เปิดภาพฟาร์มกระต่ายหน้า ${page} ขนาดใหญ่ในแท็บใหม่`}>
        <img src={`/assets/bunny-farm/page-${page}.webp`} alt={`ภาพวาดฟาร์มกระต่ายจากผู้สนับสนุนโรส หน้า ${page} จาก 3`} loading="lazy" width="1400" height="974" />
      </a>
      <p className="bunny-farm-caption">[RZB] ฟาร์มกระต่าย · {page} / 3</p>
    </div>
  );
}
