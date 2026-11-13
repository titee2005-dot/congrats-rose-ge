import { useSiteCopy } from '../content/SiteCopy';
import { useState, useEffect, useRef } from 'react';
import { ROSE_PROFILE, ROSE_PARTY_MEDIA, DEFAULT_GE_MILESTONE } from '../data/roseData';
import PixelFrame from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

function computeDebutDays() {
  const now = Date.now();
  const debut = new Date(ROSE_PROFILE.debutDateISO || '2025-05-31T00:00:00+07:00').getTime();
  return Math.max(1, Math.floor((now - debut) / 86400000));
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

export default function Hero({
  siteConfig,
  geMilestone,
  wishCount = 0,
  totalCheers = 0,
  onHeroScrolledPast,
  onHeroVideoPlaying,
  onLaunchConfetti,
}) {
  const copy = useSiteCopy();
  const [daysSinceDebut] = useState(computeDebutDays);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const milestone = {
    ...DEFAULT_GE_MILESTONE,
    ...(geMilestone || {}),
  };

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
    const heroEl = document.getElementById('home');
    if (!heroEl) return;

    const handleScroll = () => {
      const rect = heroEl.getBoundingClientRect();
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

  useEffect(() => {
    const isActuallyPlayingWithSound = !isPaused && !isMuted;
    onHeroVideoPlaying?.(isActuallyPlayingWithSound);
  }, [isPaused, isMuted, onHeroVideoPlaying]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const togglePlay = (e) => {
    e?.stopPropagation?.();
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

  const toggleSound = (e) => {
    e?.stopPropagation?.();
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
      <div className="hero-heading" data-edition={copy("hero.edition", "GE  /  2026")}>
        <span className="px-chip hero-congrats-chip">
          <PixelIcon name="crown" size={14} />{copy("Hero.fa2a236a83", "CONGRATULATIONS · GENERAL ELECTION")}<PixelIcon name="trophy" size={14} />
        </span>
        <h1 className="hero-title">
          <span className="hero-title-sm">{copy("Hero.1f1d2d906a", "THE GE EDITION · 2026")}</span>
          <span className="hero-title-lg">{copy("Hero.df147d43ab", "Rose ")}<b>{milestone.rankNumber || copy("Hero.7841417529", "GE")}</b>
          </span>
        </h1>
        <p className="hero-sub">{copy("Hero.6c98440e55", "บันทึกช่วงเวลาที่ความพยายามผลิบาน และส่งคำยินดีให้")}{' '}
          <strong>{copy("Hero.d7515b0353", "โรส BNK48")}</strong>{copy("Hero.7fe6560ddd", " — ปาณิสรา บูรณาภา")}</p>
      </div>

      <div className="hero-grid">
        {/* ช่องหลัก: Rose Victory Stage */}
        <PixelFrame
          label={copy("Hero.52816545f6", "Rose Victory Stage")}
          icon="crown"
          tone="pink"
          className="hero-photo-frame"
          bodyClassName="hero-photo-body"
        >
          <div
            className="hero-media-wrap"
            onClick={togglePlay}
            role="button"
            tabIndex={0}
            aria-label={isPaused ? copy("Hero.ac70995822", "แตะเพื่อเล่นวิดีโอต่อ") : copy("Hero.70a89011f2", "แตะเพื่อหยุดวิดีโอ")}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                togglePlay(e);
              }
            }}
          >
            {youtubeId ? (
              <iframe
                className="hero-video-embed"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&playsinline=1&rel=0`}
                title={copy("Hero.ec27c1a055", "Rose Victory Stage Video")}
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
                  webkit-playsinline="true"
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  preload="auto"
                  onPlay={() => setIsPaused(false)}
                  onPause={() => setIsPaused(true)}
                  onError={() => setVideoError(true)}
                />

                {isPaused && (
                  <div className="hero-pause-overlay" aria-hidden="true">
                    <span className="hero-pause-badge">
                      <PixelIcon name="play" size={26} />
                    </span>
                  </div>
                )}

                <div
                  className="hero-video-controls"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="hero-sound-btn hero-play-btn"
                    onClick={togglePlay}
                    title={isPaused ? copy("Hero.18a0c3d973", "เล่นวิดีโอต่อ") : copy("Hero.eef5b14838", "หยุดวิดีโอชั่วคราว")}
                    aria-label={isPaused ? copy("Hero.18a0c3d973", "เล่นวิดีโอต่อ") : copy("Hero.eef5b14838", "หยุดวิดีโอชั่วคราว")}
                  >
                    <PixelIcon name={isPaused ? 'play' : 'pause'} size={14} />
                    <span>{isPaused ? copy("Hero.7e361eaab9", "เล่น") : copy("Hero.2cff5207a8", "หยุด")}</span>
                  </button>

                  <button
                    type="button"
                    className="hero-sound-btn"
                    onClick={toggleSound}
                    title={isMuted ? copy("Hero.029a6f6bb8", "เปิดเสียงวิดีโอ") : copy("Hero.b6e9391cfc", "ปิดเสียงวิดีโอ")}
                    aria-label={isMuted ? copy("Hero.029a6f6bb8", "เปิดเสียงวิดีโอ") : copy("Hero.b6e9391cfc", "ปิดเสียงวิดีโอ")}
                  >
                    <PixelIcon
                      name={isMuted ? 'volume-off' : 'volume-on'}
                      size={15}
                    />
                    <span>{isMuted ? copy("Hero.fb9ee0f79d", "เปิดเสียง") : copy("Hero.fb638e1998", "ปิดเสียง")}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="hero-video-empty">
                <PixelBunnySprite variant="crown-ge" frame="hop" size={56} />
                <span>{copy("Hero.52816545f6", "Rose Victory Stage")}</span>
              </div>
            )}
          </div>
        </PixelFrame>

        {/* การ์ดข้อมูลฉลองความสำเร็จ */}
        <PixelFrame
          label={copy("Hero.72f3f29b2c", "Victory Ticket")}
          icon="trophy"
          tone="butter"
          className="hero-info-frame"
          bodyClassName="hero-info-body"
        >
          <div className="hero-today hero-victory-banner">
            <PixelIcon name="trophy" size={40} />
            <div>
              <strong>{milestone.rankBadge}</strong>
              <span>{milestone.eventTitle}</span>
            </div>
          </div>

          <ul className="hero-facts">
            <li>
              <span>{copy("Hero.b3a065039b", "โอกาสฉลอง")}</span>
              <b>{copy("Hero.64050544bd", "General Election")}</b>
            </li>
            <li>
              <span>{copy("Hero.7732070e77", "การ์ดแสดงความยินดี")}</span>
              <b>{wishCount.toLocaleString()}{copy("Hero.64a45cdb40", " ใบ")}</b>
            </li>
            <li>
              <span>{copy("Hero.6b1dd4bbc4", "เติบโตบนเส้นทางไอดอล")}</span>
              <b>{daysSinceDebut.toLocaleString()}{copy("Hero.52d7e26d5b", " วัน")}</b>
            </li>
          </ul>

          <div className="hero-actions">
            <button
              type="button"
              className="px-btn primary"
              onClick={() => scrollTo('wish')}
            >
              <PixelIcon name="envelope" size={18} />
              <span>{copy("Hero.51254f0441", "เขียนการ์ดแสดงความยินดี")}</span>
            </button>

            <div className="hero-sub-actions">
              <button
                type="button"
                className="px-btn gold-btn"
                onClick={() => scrollTo('cheer')}
              >
                <PixelIcon name="bunny" size={16} />
                <span>{copy("Hero.56d29de232", "ฟาร์มกระต่าย")}</span>
              </button>
              <button
                type="button"
                className="px-btn"
                onClick={onLaunchConfetti}
              >
                <PixelIcon name="firework" size={16} />
                <span>{copy("Hero.a613c234dc", "จุดพลุฉลอง!")}</span>
              </button>
            </div>
          </div>
        </PixelFrame>
      </div>
    </section>
  );
}
