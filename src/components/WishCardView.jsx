import { resolveCardTheme, resolveCardStamp } from '../data/roseData';
import { PixelIcon } from './PixelSprites';

// ==========================================
// การ์ดแสดงความยินดี 6 ดีไซน์ + ตราประทับเกียรติยศ (Honor Stamp) + ปุ่มหัวใจ
// ==========================================
export default function WishCardView({
  bg,
  stamp = 'crown-gold',
  name,
  message,
  img,
  letterNumber,
  likes = 0,
  isFeatured = false,
  isLiked = false,
  onLikeClick,
  compact = false,
  showFooterHint = false,
}) {
  const theme = resolveCardTheme(bg);
  const stampInfo = resolveCardStamp(stamp);
  const v = theme.variant;

  const handleHeartClick = (e) => {
    e.stopPropagation();
    onLikeClick?.();
  };

  return (
    <article
      className={`wc wc-${v} ${compact ? 'is-compact' : 'is-full'} ${isFeatured ? 'is-hall-of-fame' : ''}`}
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
          <PixelIcon name={theme.iconName || 'bouquet'} size={20} />
        </span>
        <div className="wc-titles">
          <strong>
            {letterNumber || 'Congrats Rose BNK48'}
            {isFeatured && (
              <span className="wc-hof-pill" title="การ์ดหอเกียรติยศ (Hall of Fame)">
                <PixelIcon name="crown" size={12} />
                <span>STAR</span>
              </span>
            )}
          </strong>
          <small>{theme.sub || theme.name}</small>
        </div>

        {/* ตราประทับเกียรติยศที่ผู้ส่งเลือก */}
        <div
          className="wc-honor-stamp"
          style={{
            '--st-bg': stampInfo.bg,
            '--st-border': stampInfo.border,
            '--st-color': stampInfo.color,
          }}
          title={`ตราประทับ: ${stampInfo.titleTh}`}
        >
          <PixelIcon name={stampInfo.icon} size={15} />
          <span>{stampInfo.code}</span>
        </div>
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
              'เขียนคำแสดงความยินดีและกำลังใจถึงน้องโรสตรงนี้ได้เลย...'}
          </p>
          {compact && img && (
            <div className="wc-thumb">
              <img src={img} alt="รูปแนบ" />
            </div>
          )}
        </div>

        <div className="wc-sign">
          <span className="wc-to">
            <PixelIcon name={stampInfo.icon} size={14} />
            <span>{stampInfo.titleTh}</span>
          </span>
          <span className="wc-from">จาก {name || 'แฟนคลับของโรส'}</span>
        </div>

        {showFooterHint && (
          <div className="wc-hint">
            <div className="wc-hint-left">
              {onLikeClick && (
                <button
                  type="button"
                  className={`wc-like-btn ${isLiked ? 'is-liked' : ''}`}
                  onClick={handleHeartClick}
                  title="กดส่งหัวใจให้การ์ดใบนี้"
                >
                  <PixelIcon name="heart" size={13} />
                  <span>{Number(likes) || 0}</span>
                </button>
              )}
              {img && (
                <span className="wc-has-photo">
                  <PixelIcon name="camera" size={13} />
                  <span>โพลาลอยด์</span>
                </span>
              )}
            </div>
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
