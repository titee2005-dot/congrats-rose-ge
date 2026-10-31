import { useState, useEffect, useRef } from 'react';
import { ROSE_PROFILE, ROSE_PARTY_MEDIA } from '../data/roseData';
import PixelFrame from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

function computeTimeInfo() {
  const now = Date.now();
  const target = new Date(ROSE_PROFILE.celebrationISO).getTime();
  const birth = new Date('2007-11-01T00:00:00+07:00').getTime();
  const daysAlive = Math.max(0, Math.floor((now - birth) / 86400000));
  const diff = target - now;

  if (diff <= 0) {
    return { reached: true, daysAlive, days: 0, hours: 0, mins: 0, secs: 0 };
  }
  return {
    reached: false,
    daysAlive,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

function extractYouTubeId(url) {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

const pad = (n) => String(n).padStart(2, '0');

export default function Hero({
  siteConfig,
  onHeroScrolledPast,
  onHeroVideoPlaying,
}) {
  const [t, setT] = useState(computeTimeInfo);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const rawVideoUrl = (
    siteConfig?.party_video_url ||
    ROSE_PARTY_MEDIA.defaultVideoUrl ||
    ''
  ).trim();
  const youtubeId = extractYouTubeId(rawVideoUrl);

  useEffect(() => {
    setVideoError(false);
    setIsMuted(true);
    setIsPaused(false);
  }, [rawVideoUrl]);

  useEffect(() => {
    const timer = setInterval(() => setT(computeTimeInfo()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ตรวจจับเมื่อเลื่อนจอผ่านส่วนแรก (Hero) เพื่อหยุดวิดีโออัตโนมัติ และแจ้งเริ่มเพลงเว็บ
  useEffect(() => {
    const heroEl = document.getElementById('home');
    if (!heroEl) return;

    const handleScroll = () => {
      const rect = heroEl.getBoundingClientRect();
      // เมื่อส่วนแรกเลื่อนพ้นจอขึ้นไป (bottom พ้นด้านบนของจอ)
      const isPast = rect.bottom <= 100;
      if (isPast) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPaused(true);
        }
        onHeroScrolledPast?.(true);
      } else {
        onHeroScrolledPast?.(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onHeroScrolledPast]);

  // แจ้งสถานะเสียงวิดีโอ เพื่อหยุด BGM ชั่วคราวเมื่อเปิดเสียงวิดีโอ
  useEffect(() => {
    const isActuallyPlayingWithSound = !isPaused && !isMuted;
    onHeroVideoPlaying?.(isActuallyPlayingWithSound);
  }, [isPaused, isMuted, onHeroVideoPlaying]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPaused(false);
    } else {
      v.pause();
      setIsPaused(true);
    }
  };

  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
        if (!next && videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
          setIsPaused(false);
        }
      }
      return next;
    });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-heading">
        <span className="px-chip">
          <PixelIcon name="sparkle" size={14} />
          01.11.2007 — 01.11.2026
          <PixelIcon name="sparkle" size={14} />
        </span>
        <h1 className="hero-title">
          <span className="hero-title-sm">Happy Birthday</span>
          <span className="hero-title-lg">
            Rose <b>19</b>
          </span>
        </h1>
        <p className="hero-sub">
          สุขสันต์วันเกิดครบ 19 ปี <strong>โรส BNK48</strong> — ปาณิสรา บูรณาภา
        </p>
      </div>

      <div className="hero-grid">
        {/* ช่องหลัก: Rose Birthday Party (วิดีโอพร้อมปุ่มหยุด/เล่น และเปิด/ปิดเสียง โดยไม่ใช้ภาพเก่าเป็นพื้นหลัง) */}
        <PixelFrame
          label="Rose Birthday Party"
          icon="cake"
          tone="pink"
          className="hero-photo-frame"
          bodyClassName="hero-photo-body"
        >
          <div className="hero-media-wrap">
            {youtubeId ? (
              <iframe
                className="hero-video-embed"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&playsinline=1&rel=0`}
                title="Rose Birthday Party Video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : rawVideoUrl && !videoError ? (
              <>
                <video
                  ref={videoRef}
                  key={rawVideoUrl}
                  src={rawVideoUrl}
                  className="hero-video"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  onClick={togglePlay}
                  onPlay={() => setIsPaused(false)}
                  onPause={() => setIsPaused(true)}
                  onError={() => setVideoError(true)}
                />

                {isPaused && (
                  <button
                    type="button"
                    className="hero-pause-overlay"
                    onClick={togglePlay}
                    aria-label="เล่นวิดีโอต่อ"
                    title="คลิกเพื่อเล่นวิดีโอต่อ"
                  >
                    <span className="hero-pause-badge">
                      <PixelIcon name="play" size={24} />
                    </span>
                  </button>
                )}

                <div className="hero-video-controls">
                  <button
                    type="button"
                    className="hero-sound-btn"
                    onClick={togglePlay}
                    title={isPaused ? 'เล่นวิดีโอต่อ' : 'หยุดวิดีโอชั่วคราว'}
                  >
                    <PixelIcon name={isPaused ? 'play' : 'pause'} size={14} />
                    <span>{isPaused ? 'เล่น' : 'หยุด'}</span>
                  </button>

                  <button
                    type="button"
                    className="hero-sound-btn"
                    onClick={toggleSound}
                    title={isMuted ? 'เปิดเสียงวิดีโอ' : 'ปิดเสียงวิดีโอ'}
                  >
                    <PixelIcon
                      name={isMuted ? 'volume-off' : 'volume-on'}
                      size={15}
                    />
                    <span>{isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="hero-video-empty">
                <PixelBunnySprite variant="party-19" frame="hop" size={56} />
                <span>Rose Birthday Party</span>
              </div>
            )}
          </div>
        </PixelFrame>

        {/* การ์ดข้อมูลวันเกิด */}
        <PixelFrame
          label="Birthday Ticket"
          icon="gift"
          tone="lavender"
          className="hero-info-frame"
          bodyClassName="hero-info-body"
        >
          {t.reached ? (
            <div className="hero-today">
              <PixelIcon name="cake" size={40} />
              <div>
                <strong>วันนี้วันเกิดโรส!</strong>
                <span>HAPPY ROSE DAY · 01.11.2026</span>
              </div>
            </div>
          ) : (
            <div className="hero-countdown">
              <span className="hero-mini-label">นับถอยหลังสู่วันเกิด</span>
              <div className="cd-row">
                {[
                  [t.days, 'วัน'],
                  [pad(t.hours), 'ชม.'],
                  [pad(t.mins), 'นาที'],
                  [pad(t.secs), 'วิ'],
                ].map(([v, l]) => (
                  <div key={l} className="cd-cell">
                    <b>{v}</b>
                    <small>{l}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ul className="hero-facts">
            <li>
              <span>วันเกิด</span>
              <b>1 พ.ย. 2007</b>
            </li>
            <li>
              <span>อายุครบ</span>
              <b>19 ปี</b>
            </li>
            <li>
              <span>รุ่น</span>
              <b>BNK48 Gen 6</b>
            </li>
            <li>
              <span>เติบโตมาแล้ว</span>
              <b>{t.daysAlive.toLocaleString()} วัน</b>
            </li>
          </ul>

          <div className="hero-actions">
            <button
              type="button"
              className="px-btn primary"
              onClick={() => scrollTo('wish')}
            >
              <PixelIcon name="envelope" size={18} /> เขียนการ์ดอวยพร
            </button>
            <button
              type="button"
              className="px-btn"
              onClick={() => scrollTo('journey')}
            >
              <span>ดูเส้นทางของโรส</span>
              <PixelIcon name="arrow-down" size={16} />
            </button>
          </div>
        </PixelFrame>
      </div>
    </section>
  );
}
