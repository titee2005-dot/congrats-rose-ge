import { useState, useEffect } from 'react';
import { PixelIcon } from './PixelSprites';

const NAV_ITEMS = [
  { id: 'home', label: 'หน้าแรก' },
  { id: 'journey', label: 'เส้นทางของโรส' },
  { id: 'wish', label: 'เขียนการ์ด' },
  { id: 'wall', label: 'กำแพงคำอวยพร' },
  { id: 'follow', label: 'ติดตามโรส' },
];

export default function Header({
  wishCount = 0,
  bunnyCount = 0,
  bunniesVisible = true,
  onToggleBunnies,
  onDropCarrot,
}) {
  const [isShrunk, setIsShrunk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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
        current = 'follow';
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
      <header className="px-header">
        <a
          href="#home"
          className="px-brand"
          onClick={(e) => scrollToSection(e, 'home')}
        >
          <span className="px-brand-icon">
            <PixelIcon name="rose" size={24} />
          </span>
          <span className="px-brand-text">
            <strong>ROSE</strong>
            <em>Sweet 19th</em>
          </span>
        </a>

        <nav className={`px-nav ${menuOpen ? 'show' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => scrollToSection(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="px-head-tools">
          {bunnyCount > 0 && (
            <>
              {bunniesVisible && (
                <button
                  type="button"
                  className="px-tool-btn is-carrot"
                  onClick={onDropCarrot}
                  title="โยนแครอทให้น้องกระต่าย"
                  aria-label="โยนแครอทให้น้องกระต่าย"
                >
                  <PixelIcon name="carrot" size={16} />
                </button>
              )}
              <button
                type="button"
                className={`px-tool-btn is-bunny ${!bunniesVisible ? 'is-off' : ''}`}
                onClick={onToggleBunnies}
                title={
                  bunniesVisible
                    ? 'ซ่อนน้องกระต่ายชั่วคราว'
                    : 'เรียกน้องกระต่ายออกมาวิ่งเล่น'
                }
                aria-label={bunniesVisible ? 'ซ่อนกระต่าย' : 'แสดงกระต่าย'}
              >
                <PixelIcon name="bunny" size={17} />
                <span>×{bunnyCount}</span>
              </button>
            </>
          )}

          <a
            href="#wall"
            className="px-count"
            onClick={(e) => scrollToSection(e, 'wall')}
            title="จำนวนการ์ดบนกำแพง"
          >
            <PixelIcon name="envelope" size={17} />
            <span>{wishCount}</span>
          </a>

          <button
            type="button"
            className="px-menu-btn"
            aria-label="เปิดเมนู"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <PixelIcon name={menuOpen ? 'close' : 'menu'} size={19} />
          </button>
        </div>
      </header>
    </div>
  );
}
