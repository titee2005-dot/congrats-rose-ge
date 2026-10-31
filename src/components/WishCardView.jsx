import { resolveCardTheme } from '../data/roseData';

// ==========================================
// การ์ดคำอวยพร 6 ดีไซน์ (กรอบพิกเซลมุมหยัก + ลวดลายเฉพาะของแต่ละแบบ)
// ==========================================
export default function WishCardView({
  bg,
  name,
  message,
  img,
  letterNumber,
  compact = false,
  showFooterHint = false,
}) {
  const theme = resolveCardTheme(bg);
  const v = theme.variant;

  return (
    <article
      className={`wc wc-${v} ${compact ? 'is-compact' : 'is-full'}`}
      style={{
        '--wc-accent': theme.accent,
        '--wc-bg': theme.softBg,
        '--wc-head': theme.headerTone,
        '--wc-border': theme.borderTone,
      }}
    >
      {v === 'airmail' && <div className="wc-airmail-edge" aria-hidden="true" />}

      <header className="wc-head">
        <span className="wc-icon" aria-hidden="true">
          {theme.iconEmoji}
        </span>
        <div className="wc-titles">
          <strong>{letterNumber || 'Happy 19th Rose'}</strong>
          <small>{theme.name}</small>
        </div>
        {v === 'airmail' ? (
          <div className="wc-stamp" aria-hidden="true">
            <span>ROSE</span>
            <b>19</b>
          </div>
        ) : (
          <span className="wc-badge">{theme.sealText}</span>
        )}
      </header>

      {v === 'grid-diary' && (
        <div className="wc-rings" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>
      )}

      <div className="wc-body">
        {!compact && img && (
          <div className="wc-photo">
            <img src={img} alt="รูปที่แนบมากับการ์ด" />
          </div>
        )}

        <div className="wc-msg-row">
          <p className={`wc-msg ${compact ? 'is-clamped' : ''}`}>
            {message ||
              'เขียนคำอวยพรวันเกิดวัย 19 ปีถึงโรสตรงนี้ได้เลย... 🌹'}
          </p>
          {compact && img && (
            <div className="wc-thumb">
              <img src={img} alt="รูปแนบ" />
            </div>
          )}
        </div>

        <div className="wc-sign">
          <span className="wc-to">To. Rose ♥</span>
          <span className="wc-from">จาก {name || 'แฟนคลับของโรส'}</span>
        </div>

        {showFooterHint && (
          <div className="wc-hint">
            {img && <span className="wc-has-photo">📷 มีรูปแนบ</span>}
            <span className="wc-open">กดเพื่ออ่าน ▸</span>
          </div>
        )}
      </div>

      {v === 'airmail' && (
        <div className="wc-airmail-edge bottom" aria-hidden="true" />
      )}
    </article>
  );
}
