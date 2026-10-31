import { Link } from 'react-router-dom';
import { ROSE_PROFILE } from '../data/roseData';
import { PixelIcon } from './PixelSprites';

export default function Footer() {
  return (
    <footer className="px-footer">
      <div className="px-footer-inner">
        <div className="footer-icons" aria-hidden="true">
          <PixelIcon name="heart" size={20} />
          <PixelIcon name="rose" size={24} />
          <PixelIcon name="bunny" size={28} />
          <PixelIcon name="rose" size={24} />
          <PixelIcon name="heart" size={20} />
        </div>
        <p className="footer-quote">
          ขอให้วัย 19 ของโรสเต็มไปด้วยความสุขและรอยยิ้มในทุก ๆ วันนะ
        </p>
        <p className="footer-dates">ROSE BNK48 · 01.11.2007 — 01.11.2026</p>
        <div className="footer-tags">
          {ROSE_PROFILE.hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className="footer-credit">
          Made with ♥ by fans · Unofficial fan project ·{' '}
          <Link to="/admin" className="footer-admin">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
