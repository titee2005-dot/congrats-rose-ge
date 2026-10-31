import { PixelIcon } from './PixelSprites';

// ==========================================
// กรอบพิกเซลมุมหยัก + แท็บป้ายชื่อแบบแฟ้มสมุด (Pixel Folder Frame)
// tone: 'pink' | 'lavender' | 'mint' | 'butter' | 'cream'
// ==========================================
export default function PixelFrame({
  label,
  icon = 'heart',
  tone = 'pink',
  sticker,
  className = '',
  bodyClassName = '',
  id,
  children,
}) {
  return (
    <div
      id={id}
      className={`pf tone-${tone} ${label ? 'has-tab' : ''} ${className}`}
    >
      {label && (
        <div className="pf-tab">
          {icon && <PixelIcon name={icon} size={16} />}
          <span>{label}</span>
        </div>
      )}
      {sticker && <div className="pf-sticker">{sticker}</div>}
      <div className={`pf-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}

// ป้ายหัวข้อ Section แบบชิปพิกเซล + หัวข้อไทย
export function SectionHeading({ chip, title, desc, icon = 'heart' }) {
  return (
    <div className="sec-head">
      <span className="px-chip">
        <PixelIcon name={icon} size={14} />
        {chip}
        <PixelIcon name={icon} size={14} />
      </span>
      <h2 className="sec-title">{title}</h2>
      {desc && <p className="sec-desc">{desc}</p>}
    </div>
  );
}
