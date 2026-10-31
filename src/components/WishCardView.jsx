import { resolveCardTheme } from '../data/roseData';
import { PixelIcon } from './PixelSprites';

// ==========================================
// การ์ดคำอวยพร 6 ดีไซน์ (กรอบพิกเซลมุมหยัก + ไอคอน SVG คมกริบ)
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
          <PixelIcon name={theme.iconName || 'rose'} size={20} />
        </span>
        <div className="wc-titles">
          <strong>{letterNumber || 'Happy 19th Rose'}</strong>
          <small>{theme.sub || theme.name}</small>
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
        {v === 'botanical' && (
          <span className="wc-botanical-mark" aria-hidden="true">
            <PixelIcon name="leaf" size={32} />
          </span>
        )}

        {!compact && img && (
          <div className="wc-photo">
            <img src={img} alt="รูปที่แนบมากับการ์ด" />
          </div>
        )}

        <div className="wc-msg-row">
          <p className={`wc-msg ${compact ? 'is-clamped' : ''}`}>
            {message ||
              'เขียนคำอวยพรวันเกิดวัย 19 ปีถึงโรสตรงนี้ได้เลย...'}
          </p>
          {compact && img && (
            <div className="wc-thumb">
              <img src={img} alt="รูปแนบ" />
            </div>
          )}
        </div>

        <div className="wc-sign">
          <span className="wc-to">
            <span>To. Rose</span>
            <PixelIcon name="heart" size={13} />
          </span>
          <span className="wc-from">จาก {name || 'แฟนคลับของโรส'}</span>
        </div>

        {showFooterHint && (
          <div className="wc-hint">
            {img && (
              <span className="wc-has-photo">
                <PixelIcon name="camera" size={13} />
                <span>มีรูปแนบ</span>
              </span>
            )}
            <span className="wc-open">
              <span>กดเพื่ออ่าน</span>
              <PixelIcon name="chevron-right" size={13} />
            </span>
          </div>
        )}
      </div>

      {v === 'airmail' && (
        <div className="wc-airmail-edge bottom" aria-hidden="true" />
      )}
    </article>
  );
}
