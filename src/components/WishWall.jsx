import { useSiteCopy } from '../content/SiteCopy';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import { CARD_STAMPS } from '../data/roseData';
import ScrollReveal from './ScrollReveal';
import WishCardView from './WishCardView';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

const LIKED_STORAGE_KEY = 'rose_ge_liked_cards_v1';

function loadLikedIds() {
  try {
    const raw = localStorage.getItem(LIKED_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch {
    // ignore
  }
  return [];
}

export default function WishWall({ wishes, isLoading, onLikeWish }) {
  const copy = useSiteCopy();
  const [selectedWishId, setSelectedWishId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'hof' | 'polaroid'
  const [stampFilter, setStampFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState(loadLikedIds);
  const [isDownloading, setIsDownloading] = useState(false);

  const approvedWishes = wishes.filter((w) => w.status === 'approved');

  // คัดกรองตามโหมด (ทั้งหมด / หอเกียรติยศ / โพลาลอยด์) + ตราประทับ + คำค้นหา
  const filteredWishes = approvedWishes
    .filter((w) => {
      if (viewMode === 'hof') {
        return Boolean(w.is_featured) || (Number(w.likes) || 0) >= 10;
      }
      if (viewMode === 'polaroid') {
        return Boolean(w.img);
      }
      return true;
    })
    .filter((w) => {
      if (stampFilter === 'all') return true;
      return (w.stamp || 'crown-gold') === stampFilter;
    })
    .filter((w) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        (w.name || '').toLowerCase().includes(q) ||
        (w.message || '').toLowerCase().includes(q)
      );
    });

  // ถ้าอยู่ในโหมด Hall of Fame ให้เรียงการ์ดติดดาวและยอดหัวใจขึ้นก่อน
  const sortedFiltered =
    viewMode === 'hof'
      ? [...filteredWishes].sort((a, b) => {
          if (Boolean(b.is_featured) !== Boolean(a.is_featured)) {
            return b.is_featured ? 1 : -1;
          }
          return (Number(b.likes) || 0) - (Number(a.likes) || 0);
        })
      : filteredWishes;

  const displayedWishes = showAll ? sortedFiltered : sortedFiltered.slice(0, 6);

  const hofCount = approvedWishes.filter(
    (w) => Boolean(w.is_featured) || (Number(w.likes) || 0) >= 10
  ).length;
  const polaroidCount = approvedWishes.filter((w) => Boolean(w.img)).length;

  useEffect(() => {
    document.body.style.overflow = selectedWishId !== null ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedWishId]);

  const activeWish =
    selectedWishId !== null
      ? approvedWishes.find((w) => w.id === selectedWishId) || null
      : null;

  const handleToggleLike = (wish) => {
    if (!wish?.id) return;
    const alreadyLiked = likedIds.includes(wish.id);
    const delta = alreadyLiked ? -1 : 1;

    const nextLiked = alreadyLiked
      ? likedIds.filter((id) => id !== wish.id)
      : [...likedIds, wish.id];

    setLikedIds(nextLiked);
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(nextLiked));
    } catch {
      // ignore
    }

    onLikeWish?.(wish.id, delta);
  };

  const handleDownloadWallCard = async () => {
    const el = document.getElementById('wall-modal-card-capture');
    if (!el || !activeWish) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#fff4f8',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `rose_ge_card_${activeWish.name || activeWish.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert(copy("WishWall.cdc5174827", "เกิดข้อผิดพลาดในการบันทึกรูปการ์ด"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <section className="px-section" id="wall">
        <ScrollReveal>
          <SectionHeading
            chip={copy("WishWall.69af1654ab", "CONGRATS WALL · {value1}", {value1: approvedWishes.length})}
            icon="crown"
            title={copy("WishWall.f2e3d5c4bd", "กำแพงการ์ดแสดงความยินดี")}
            desc={copy("WishWall.0a087506b3", "รวมทุกความภาคภูมิใจและคำยินดีจากแฟนคลับที่ส่งให้น้องโรส กดหัวใจให้การ์ดที่ชอบ หรือดาวน์โหลดการ์ดที่ระลึกได้เลย")}
          />
        </ScrollReveal>

        {/* แถบเลือกโหมดจัดแสดง (Hall of Fame / Polaroid / ค้นหา / กรองตราประทับ) */}
        <ScrollReveal delay={50}>
          <div className="wall-toolbar">
            <div className="wall-mode-tabs" role="group" aria-label={copy("WishWall.71edbf5f27", "หมวดการ์ด")}>
              <button
                type="button"
                className={`px-tab ${viewMode === 'all' ? 'is-active' : ''}`}
                onClick={() => setViewMode('all')}
                aria-pressed={viewMode === 'all'}
              >
                <PixelIcon name="envelope" size={15} />
                <em>{copy("WishWall.56effdba63", "ทั้งหมด")}</em><span>{approvedWishes.length}</span>
              </button>
              <button
                type="button"
                className={`px-tab ${viewMode === 'hof' ? 'is-active' : ''}`}
                onClick={() => setViewMode('hof')}
                aria-pressed={viewMode === 'hof'}
              >
                <PixelIcon name="crown" size={15} />
                <em>{copy("WishWall.48c7e04323", "หอเกียรติยศ")}</em><span>{hofCount}</span>
              </button>
              <button
                type="button"
                className={`px-tab ${viewMode === 'polaroid' ? 'is-active' : ''}`}
                onClick={() => setViewMode('polaroid')}
                aria-pressed={viewMode === 'polaroid'}
              >
                <PixelIcon name="camera" size={15} />
                <em>{copy("WishWall.cb1e5af0a2", "โพลาลอยด์")}</em><span>{polaroidCount}</span>
              </button>
            </div>

            <div className="wall-filter-row">
              <label className="wall-stamp-select">{copy("WishWall.fd5f2b0d96", "ตราประทับ")}<select aria-label={copy("WishWall.fd5f2b0d96", "ตราประทับ")} value={stampFilter} onChange={(e) => setStampFilter(e.target.value)}>
                  <option value="all">{copy("WishWall.c7dc5d4af2", "ทุกตราประทับ")}</option>
                  {CARD_STAMPS.map((st) => <option key={st.id} value={st.id}>{copy(`stamp.${st.id}.titleTh`, st.titleTh)}</option>)}
                </select>
              </label>
              <div className="wall-stamp-pills" role="group" aria-label={copy("WishWall.6abc5afbb6", "กรองตามตราประทับ")}>
                <button
                  type="button"
                  className={`stamp-filter-chip ${stampFilter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setStampFilter('all')}
                  aria-pressed={stampFilter === 'all'}
                >
                  <span>{copy("WishWall.c7dc5d4af2", "ทุกตราประทับ")}</span>
                </button>
                {CARD_STAMPS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`stamp-filter-chip ${stampFilter === st.id ? 'active' : ''}`}
                    onClick={() => setStampFilter(st.id)}
                    aria-pressed={stampFilter === st.id}
                  >
                    <PixelIcon name={st.icon} size={13} />
                    <span>{copy(`stamp.${st.id}.titleTh`, st.titleTh)}</span>
                  </button>
                ))}
              </div>

              <div className="wall-search-box">
                <PixelIcon name="search" size={15} />
                <input
                  type="search"
                  aria-label={copy("WishWall.fc6d2a4566", "ค้นหาการ์ดจากชื่อหรือข้อความ")}
                  placeholder={copy("WishWall.99979bdc51", "ค้นหาชื่อหรือข้อความ...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="wall-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label={copy("WishWall.18ef8d921e", "ล้างคำค้นหา")}
                  >
                    <PixelIcon name="close" size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {sortedFiltered.length === 0 ? (
          <ScrollReveal delay={70}>
            <PixelFrame tone="cream" bodyClassName="empty-body">
              <PixelBunnySprite variant="crown-ge" frame="idle" size={60} />
              <h3>
                {isLoading
                  ? copy("WishWall.b9ed832873", "กำลังโหลดการ์ดแสดงความยินดี...")
                  : viewMode === 'polaroid'
                    ? copy("WishWall.bf64a86dc9", "ยังไม่มีการ์ดที่แนบรูปโพลาลอยด์ในหมวดนี้")
                    : copy("WishWall.c7ecb3b0ee", "ไม่พบการ์ดที่ตรงกับตัวกรองในขณะนี้")}
              </h3>
              {!isLoading && (
                <p className="empty-sub">
                  <span>{copy("WishWall.aff90a7a01", "มาร่วมเขียนการ์ดแสดงความยินดีและแนบรูปที่ระลึกให้โรสกันนะ!")}</span>
                  <PixelIcon name="bouquet" size={15} />
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
                const isLiked = likedIds.includes(w.id);

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
                      onClick={() => setSelectedWishId(w.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedWishId(w.id);
                        }
                      }}
                    >
                      <WishCardView
                        bg={w.bg}
                        stamp={w.stamp}
                        name={w.name}
                        message={w.message}
                        img={w.img}
                        likes={w.likes || 0}
                        isFeatured={Boolean(w.is_featured)}
                        isLiked={isLiked}
                        onLikeClick={() => handleToggleLike(w)}
                        letterNumber={copy("WishWall.bd986d22ab", "การ์ดใบที่ {value1}", {value1: cardNo})}
                        compact
                        showFooterHint
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {sortedFiltered.length > 6 && (
              <div className="wall-more">
                <button
                  type="button"
                  className="px-btn"
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  <span>
                    {showAll
                      ? copy("WishWall.748de45dc9", "ย่อกลับ")
                      : copy("WishWall.ed0c4c3a62", "ดูการ์ดทั้งหมด ({value1} ใบ)", {value1: sortedFiltered.length})}
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
            onClick={() => setSelectedWishId(null)}
          >
            <div className="px-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="px-modal-close"
                onClick={() => setSelectedWishId(null)}
                aria-label={copy("WishWall.96d79d763f", "ปิด")}
              >
                <PixelIcon name="close" size={16} />
              </button>

              <div id="wall-modal-card-capture" className="wall-capture-area">
                <WishCardView
                  bg={activeWish.bg}
                  stamp={activeWish.stamp}
                  name={activeWish.name}
                  message={activeWish.message}
                  img={activeWish.img}
                  likes={activeWish.likes || 0}
                  isFeatured={Boolean(activeWish.is_featured)}
                  letterNumber={copy("WishWall.bd986d22ab", "การ์ดใบที่ {value1}", {value1: approvedWishes.length - approvedWishes.indexOf(activeWish)})}
                />
              </div>

              <div className="wall-modal-actions">
                <button
                  type="button"
                  className={`px-btn ${likedIds.includes(activeWish.id) ? 'primary' : ''}`}
                  onClick={() => handleToggleLike(activeWish)}
                >
                  <PixelIcon name="heart" size={15} />
                  <span>{copy("WishWall.a0d4c74ba1", "ส่งหัวใจ (")}{Number(activeWish.likes) || 0})
                  </span>
                </button>

                <button
                  type="button"
                  className="px-btn gold-btn"
                  disabled={isDownloading}
                  onClick={handleDownloadWallCard}
                >
                  <PixelIcon name="download" size={15} />
                  <span>
                    {isDownloading
                      ? copy("WishWall.c348b89a89", "กำลังบันทึก...")
                      : copy("WishWall.aa3218f9c2", "ดาวน์โหลดการ์ดที่ระลึก (PNG)")}
                  </span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
