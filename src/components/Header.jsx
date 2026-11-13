import { useSiteCopy } from '../content/SiteCopy';
import { useState, useEffect, useRef } from 'react';
import { PixelIcon } from './PixelSprites';

const NAV_ITEMS = [
  { id: 'home', label: 'หน้าแรก' },
  { id: 'milestone', label: 'เกียรติยศ GE' },
  { id: 'activities', label: 'RoseIsOn5ire' },
  { id: 'cheer', label: 'ฟาร์มกระต่าย' },
  { id: 'journey', label: 'เส้นทางของโรส' },
  { id: 'wish', label: 'เขียนการ์ด' },
  { id: 'wall', label: 'หอเกียรติยศ' },
  { id: 'follow', label: 'ติดตามโรส' },
  { id: 'supporters', label: 'Supporters' },
];

export default function Header({
  wishCount = 0,
  bunnyCount = 0,
  bunniesVisible = true,
  onToggleBunnies,
  onDropCarrot,
  onLaunchConfetti,
}) {
  const copy = useSiteCopy();
  const [isShrunk, setIsShrunk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 36);

      let current = 'home';
      NAV_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY >= top - 180) current = id;
        }
      });

      if (
        window.scrollY > 60 &&
        window.innerHeight + Math.round(window.scrollY) >=
          document.documentElement.scrollHeight - 24
      ) {
        current = 'supporters';
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`px-header-wrap ${isShrunk ? 'is-scrolled' : ''}`}>
      <header ref={headerRef} className={`px-header ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <a
          href="#home"
          className="px-brand"
          onClick={(e) => scrollToSection(e, 'home')}
        >
          <span className="px-brand-icon">
            <PixelIcon name="crown" size={24} />
          </span>
          <span className="px-brand-text">
            <strong>{copy("Header.ac831c0275", "CONGRATS ROSE BNK48")}</strong>
          </span>
        </a>

        <a
          href="#wall"
          className="px-count px-count-mobile"
          onClick={(e) => scrollToSection(e, 'wall')}
          title={copy("Header.8f9d571bdf", "จำนวนการ์ดแสดงความยินดีบนกำแพง")}
          aria-label={copy("Header.7bc6879298", "การ์ดแสดงความยินดี {value1} ใบ", {value1: wishCount})}
        >
          <PixelIcon name="envelope" size={17} />
          <span>{wishCount}</span>
        </a>

        <button ref={menuRef} type="button" className="mobile-nav-toggle" aria-label={menuOpen ? copy("Header.5d4d3c91f7", "ปิดเมนู") : copy("Header.8e50834afb", "เปิดเมนู")} aria-expanded={menuOpen} aria-controls="main-navigation mobile-header-tools" onClick={() => setMenuOpen((previous) => !previous)}>
          <PixelIcon name={menuOpen ? 'close' : 'menu'} size={19} /><span>{copy("Header.62d123cbab", "เมนู")}</span>
        </button>
        <nav id="main-navigation" aria-label={copy("Header.f025d687d6", "เมนูหลัก")} className={`px-nav ${menuOpen ? 'show' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              aria-current={activeSection === item.id ? 'location' : undefined}
              onClick={(e) => scrollToSection(e, item.id)}
            >
              {copy(`nav.${item.id}`, item.label)}
            </a>
          ))}
          <div className="px-mobile-nav-actions" aria-label={copy("Header.693eb91312", "เครื่องมือฉลอง")}>
            <button
              type="button"
              className="px-tool-btn is-confetti"
              onClick={onLaunchConfetti}
              title={copy("Header.c87509cdae", "จุดพลุฉลองแสดงความยินดี")}
              aria-label={copy("Header.c87509cdae", "จุดพลุฉลองแสดงความยินดี")}
            >
              <PixelIcon name="firework" size={16} />
            </button>

            {bunnyCount > 0 && bunniesVisible && (
              <button
                type="button"
                className="px-tool-btn is-carrot"
                onClick={onDropCarrot}
                title={copy("Header.bad8f31c88", "โยนแครอทให้น้องกระต่าย")}
                aria-label={copy("Header.bad8f31c88", "โยนแครอทให้น้องกระต่าย")}
              >
                <PixelIcon name="carrot" size={16} />
              </button>
            )}
          </div>
        </nav>

        <div id="mobile-header-tools" className="px-head-tools">
          <button
            type="button"
            className="px-tool-btn is-confetti"
            onClick={onLaunchConfetti}
            title={copy("Header.c87509cdae", "จุดพลุฉลองแสดงความยินดี")}
            aria-label={copy("Header.c87509cdae", "จุดพลุฉลองแสดงความยินดี")}
          >
            <PixelIcon name="firework" size={16} />
          </button>

          {bunnyCount > 0 && bunniesVisible && (
            <button
              type="button"
              className="px-tool-btn is-carrot"
              onClick={onDropCarrot}
              title={copy("Header.bad8f31c88", "โยนแครอทให้น้องกระต่าย")}
              aria-label={copy("Header.bad8f31c88", "โยนแครอทให้น้องกระต่าย")}
            >
              <PixelIcon name="carrot" size={16} />
            </button>
          )}

          <a
            href="#wall"
            className="px-count"
            onClick={(e) => scrollToSection(e, 'wall')}
            title={copy("Header.8f9d571bdf", "จำนวนการ์ดแสดงความยินดีบนกำแพง")}
          >
            <PixelIcon name="envelope" size={17} />
            <span>{wishCount}</span>
          </a>

          <button
            type="button"
            className="px-menu-btn"
            aria-label={copy("Header.8e50834afb", "เปิดเมนู")}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <PixelIcon name={menuOpen ? 'close' : 'menu'} size={19} />
          </button>
        </div>
      </header>
    </div>
  );
}
