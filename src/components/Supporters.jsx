import { useSiteCopy } from '../content/SiteCopy';
import { useState } from 'react';
import { SectionHeading } from './PixelFrame';
import useSupporters from './useSupporters';

const money = new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Supporters() {
  const copy = useSiteCopy();
  const [query, setQuery] = useState('');
  const { supporters, unavailable } = useSupporters();
  const filtered = supporters.filter(({ name }) => name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return (
    <section id="supporters" className="px-section supporters-section">
      <SectionHeading chip={copy("Supporters.b07773ccb7", "WITH LOVE, FROM ALL OF US")} icon="heart" title={copy("Supporters.435153f96d", "ขอบคุณ Supporters ทุกคน")} desc={copy("Supporters.90c30b6169", "ทุกกำลังใจเป็นส่วนหนึ่งของก้าวสำคัญนี้ ขอบคุณที่ร่วมเดินทางและเติบโตไปกับโรส")} />
      <div className="supporters-panel">
        <div className="supporters-toolbar">
          <p><strong>{supporters.length.toLocaleString()}</strong>{copy("Supporters.0395e290ea", " รายชื่อ · หนึ่งหัวใจที่ส่งถึงโรส")}</p>
          <label className="supporters-search">{copy("Supporters.ab769b63d1", "ค้นหารายชื่อ")}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy("Supporters.0692125728", "พิมพ์ชื่อของคุณ…")} /></label>
        </div>
        {unavailable && <p className="supporters-result" role="status">{copy("Supporters.46f26df1b3", "ยังอัปเดตข้อมูลไม่ได้ กำลังแสดงข้อมูลล่าสุดที่โหลดได้ และจะลองใหม่อัตโนมัติ")}</p>}
        {query.trim() && <p className="supporters-result" role="status">{copy("Supporters.7c9f3bc590", "พบ {value1} รายชื่อ", {value1: filtered.length})}</p>}
        {filtered.length ? <ul className="supporters-list">{filtered.map(({ name, amount }) => <li key={name}><span aria-hidden="true">♡</span><div className="supporter-details"><span>{name}</span><strong className="supporter-amount">{money.format(amount)} <small>{copy("Supporters.36346b7102", "บาท")}</small></strong></div></li>)}</ul> : <p className="supporters-empty">{copy("Supporters.067798ac55", "ยังไม่พบชื่อนี้ ลองค้นหาด้วยคำอื่นนะ")}</p>}
      </div>
    </section>
  );
}
