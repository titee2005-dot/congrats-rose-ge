import { useEffect, useState } from 'react';
import { SITE_COPY } from '../content/siteCopyCatalog';
import PixelFrame from './PixelFrame';
import '../content/editor.css';

export default function SiteTextEditor({ siteConfig, updateSiteConfig }) {
  const saved = siteConfig?.text_overrides || {};
  const [draft, setDraft] = useState(saved);
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => { if (!dirty) setDraft(siteConfig?.text_overrides || {}); }, [siteConfig?.text_overrides, dirty]);
  const sections = [...new Set(SITE_COPY.map(item => item.section))];
  const filtered = SITE_COPY.filter(item => (!section || item.section === section) &&
    `${item.text} ${draft[item.key] || ''} ${item.section}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const change = (key, value) => { setDraft(previous => ({ ...previous, [key]: value })); setDirty(true); setStatus(''); };
  const reset = (key) => { setDraft(previous => { const next = { ...previous }; delete next[key]; return next; }); setDirty(true); setStatus(''); };
  const save = async () => {
    setBusy(true);
    setStatus('');
    try {
      const ok = await updateSiteConfig({ text_overrides: draft });
      if (ok) { setDirty(false); setStatus('บันทึกข้อความแล้ว'); }
      else setStatus('ยังบันทึกไปเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองอีกครั้ง');
    } catch { setStatus('บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง'); }
    finally { setBusy(false); }
  };
  return <PixelFrame label="ข้อความทั่วหน้าเว็บ" icon="book" className="site-copy-editor">
    <details>
      <summary>แก้ไขข้อความ เมนู ปุ่ม และกิจกรรม ({SITE_COPY.length} รายการ)</summary>
      <p>ข้อความเกียรติยศและเส้นทางของโรสแก้ได้ในแผงเดิมด้านล่าง รายชื่อและยอด Supporters มาจากชีต ส่วนข้อความการ์ดมาจากผู้ส่ง</p>
      <p>ข้อความในวงเล็บปีกกา เช่น {'{count}'} เป็นค่าที่ระบบเติมให้อัตโนมัติ กรุณาคงไว้เมื่อแก้ข้อความ</p>
      <div className="copy-editor-filters">
        <label>ค้นหาข้อความ<input className="px-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาคำบนหน้าเว็บ…" /></label>
        <label>ส่วนของหน้าเว็บ<select className="px-input" value={section} onChange={e => setSection(e.target.value)}><option value="">ทุกส่วน</option>{sections.map(name => <option key={name}>{name}</option>)}</select></label>
      </div>
      <div className="copy-editor-list">
        {filtered.map(item => <div className="copy-editor-item" key={item.key}>
          <label htmlFor={`copy-${item.key}`}><small>{item.section}</small><span>{item.text}</span></label>
          <textarea id={`copy-${item.key}`} className="px-input" rows={item.text.length > 85 ? 3 : 2} value={draft[item.key] ?? item.text} onChange={e => change(item.key, e.target.value)} disabled={busy} />
          <button type="button" className="px-btn sm" disabled={busy || !Object.prototype.hasOwnProperty.call(draft, item.key)} onClick={() => reset(item.key)}>คืนค่าเดิม</button>
        </div>)}
        {!filtered.length && <p>ไม่พบข้อความที่ค้นหา</p>}
      </div>
      <div className="copy-editor-save"><button type="button" className="px-btn primary" disabled={busy || !dirty} onClick={save}>{busy ? 'กำลังบันทึก…' : 'บันทึกข้อความทั้งหมด'}</button><span role="status">{status || (dirty ? 'มีข้อความที่ยังไม่ได้บันทึก' : '')}</span></div>
    </details>
  </PixelFrame>;
}
