import { useState, useEffect, useRef } from 'react';
import { ROSE_PROFILE, ROSE_PARTY_MEDIA } from '../data/roseData';
import PixelFrame from './PixelFrame';
import { PixelIcon } from './PixelSprites';

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

export default function Hero({ siteConfig }) {
  const [t, setT] = useState(computeTimeInfo);
  const [isMuted, setIsMuted] = useState(true);
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
  }, [rawVideoUrl]);

  useEffect(() => {
    const timer = setInterval(() => setT(computeTimeInfo()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
        if (!next) {
          videoRef.current.play().catch(() => {});
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
        {/* ช่องหลัก: Rose Birthday Party (รองรับวิดีโอ MP4 / WebM / YouTube หรือรูปปก) */}
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
                  poster={ROSE_PARTY_MEDIA.posterUrl}
                  className="hero-video"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onError={() => setVideoError(true)}
                />
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
              </>
            ) : (
              <img
                src={ROSE_PARTY_MEDIA.posterUrl}
                alt="Rose Birthday Party — ปาร์ตี้วันเกิด 19 ปีของโรสในสวนกุหลาบกับน้องกระต่าย"
                className="hero-photo"
              />
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
