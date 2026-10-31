import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from './ScrollReveal';
import WishCardView from './WishCardView';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

export default function WishWall({ wishes, isLoading }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const approvedWishes = wishes.filter((w) => w.status === 'approved');
  const displayedWishes = showAll ? approvedWishes : approvedWishes.slice(0, 6);

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  const activeWish = selectedIndex !== null ? approvedWishes[selectedIndex] : null;

  return (
    <>
      <section className="px-section" id="wall">
        <ScrollReveal>
          <SectionHeading
            chip={`WISH WALL · ${approvedWishes.length}`}
            icon="heart"
            title="กำแพงคำอวยพรจากแฟนคลับ"
            desc="ทุกการ์ดบนกำแพงนี้คือความรักและกำลังใจที่ทุกคนตั้งใจส่งให้โรสในวัย 19 ปี"
          />
        </ScrollReveal>

        {approvedWishes.length === 0 ? (
          <ScrollReveal delay={70}>
            <PixelFrame tone="cream" bodyClassName="empty-body">
              <PixelBunnySprite variant="white-ribbon" frame="idle" size={60} />
              <h3>
                {isLoading ? 'กำลังโหลดการ์ด...' : 'ยังไม่มีการ์ดบนกำแพงตอนนี้'}
              </h3>
              {!isLoading && (
                <p className="empty-sub">
                  <span>มาเป็นคนแรกที่เขียนการ์ดอวยพรให้โรสกันนะ</span>
                  <PixelIcon name="heart" size={14} />
                </p>
              )}
            </PixelFrame>
          </ScrollReveal>
        ) : (
          <>
            <div className="wall-grid">
              {displayedWishes.map((w, i) => {
                const fullIdx = approvedWishes.indexOf(w);
                const cardNo = approvedWishes.length - fullIdx;
                return (
                  <ScrollReveal
                    key={w.id || i}
                    delay={(i % 3) * 70}
                    className="wall-cell"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className="wall-trigger"
                      onClick={() => setSelectedIndex(fullIdx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedIndex(fullIdx);
                        }
                      }}
                    >
                      <WishCardView
                        bg={w.bg}
                        name={w.name}
                        message={w.message}
                        img={w.img}
                        letterNumber={`การ์ดใบที่ ${cardNo}`}
                        compact
                        showFooterHint
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {approvedWishes.length > 6 && (
              <div className="wall-more">
                <button
                  type="button"
                  className="px-btn"
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  <span>
                    {showAll
                      ? 'ย่อกลับ'
                      : `ดูการ์ดทั้งหมด (${approvedWishes.length} ใบ)`}
                  </span>
                  <PixelIcon
                    name={showAll ? 'chevron-up' : 'chevron-down'}
                    size={15}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {activeWish &&
        createPortal(
          <div
            className="px-modal-backdrop"
            onClick={() => setSelectedIndex(null)}
          >
            <div className="px-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="px-modal-close"
                onClick={() => setSelectedIndex(null)}
                aria-label="ปิด"
              >
                <PixelIcon name="close" size={16} />
              </button>
              <WishCardView
                bg={activeWish.bg}
                name={activeWish.name}
                message={activeWish.message}
                img={activeWish.img}
                letterNumber={`การ์ดใบที่ ${approvedWishes.length - selectedIndex}`}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
