import { ROSE_PROFILE } from '../data/roseData';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="px-footer-wrap">
      <div className="px-footer-card">
        <div className="px-footer-main">
          <div className="footer-emblem" aria-hidden="true">
            <span className="footer-mini-dot">
              <PixelIcon name="crown" size={16} />
            </span>
            <span className="footer-mini-dot">
              <PixelIcon name="bouquet" size={19} />
            </span>
            <span className="footer-bunny-badge">
              <PixelBunnySprite variant="crown-ge" frame="idle" size={38} />
            </span>
            <span className="footer-mini-dot">
              <PixelIcon name="trophy" size={19} />
            </span>
            <span className="footer-mini-dot">
              <PixelIcon name="rose" size={16} />
            </span>
          </div>

          <p className="footer-quote">
            ทุกก้าวที่โรสเดินมา มีสวนกุหลาบเดินเคียงข้างเสมอ
          </p>

          <div className="footer-tags">
            {ROSE_PROFILE.hashtags.map((tag, idx) => (
              <span key={tag} className={`footer-tag ft-${idx % 3}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="px-footer-bar">
          <span className="footer-dates">
            <PixelIcon name="trophy" size={13} />
            <span>CONGRATULATIONS ROSE BNK48 · GENERAL ELECTION</span>
          </span>

          <p className="footer-credit">
            Made by ROLLZYBUNNY · Rose BNK48 General Election Celebration
          </p>

          <button
            type="button"
            className="footer-top-btn"
            onClick={scrollToTop}
            title="กลับขึ้นด้านบนสุด"
          >
            <PixelIcon name="chevron-up" size={14} />
            <span>ขึ้นบนสุด</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
