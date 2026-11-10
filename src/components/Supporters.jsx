import { useState } from 'react';
import { SectionHeading } from './PixelFrame';
import useSupporters from './useSupporters';

const money = new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Supporters() {
  const [query, setQuery] = useState('');
  const { supporters, unavailable } = useSupporters();
  const filtered = supporters.filter(({ name }) => name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return (
    <section id="supporters" className="px-section supporters-section">
      <SectionHeading chip="WITH LOVE, FROM ALL OF US" icon="heart" title="ขอบคุณ Supporters ทุกคน" desc="ทุกกำลังใจเป็นส่วนหนึ่งของก้าวสำคัญนี้ ขอบคุณที่ร่วมเดินทางและเติบโตไปกับโรส" />
      <div className="supporters-panel">
        <div className="supporters-toolbar">
          <p><strong>{supporters.length.toLocaleString()}</strong> รายชื่อ · หนึ่งหัวใจที่ส่งถึงโรส</p>
          <label className="supporters-search">ค้นหารายชื่อ<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="พิมพ์ชื่อของคุณ…" /></label>
        </div>
        {unavailable && <p className="supporters-result" role="status">ยังอัปเดตข้อมูลไม่ได้ กำลังแสดงข้อมูลล่าสุดที่โหลดได้ และจะลองใหม่อัตโนมัติ</p>}
        {query.trim() && <p className="supporters-result" role="status">{`พบ ${filtered.length} รายชื่อ`}</p>}
        {filtered.length ? <ul className="supporters-list">{filtered.map(({ name, amount }) => <li key={name}><span aria-hidden="true">♡</span><div className="supporter-details"><span>{name}</span><strong className="supporter-amount">{money.format(amount)} <small>บาท</small></strong></div></li>)}</ul> : <p className="supporters-empty">ยังไม่พบชื่อนี้ ลองค้นหาด้วยคำอื่นนะ</p>}
      </div>
    </section>
  );
}
