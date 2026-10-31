import { useState, useEffect, useRef, useCallback } from 'react';
import { ROSE_PLAYLIST } from '../data/roseData';
import { PixelIcon } from './PixelSprites';

export default function MusicPlayer({
  isScrolledPastHero = false,
  heroVideoActive = false,
  customPlaylist = null,
}) {
  const playlist =
    Array.isArray(customPlaylist) && customPlaylist.length > 0
      ? customPlaylist
      : ROSE_PLAYLIST;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [userManuallyPaused, setUserManuallyPaused] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [ytReady, setYtReady] = useState(false);

  const currentTrack = playlist[currentIndex] || playlist[0];
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const hasTriggeredInitialPlay = useRef(false);

  // =========================
  // โหลด YouTube IFrame API
  // =========================
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setYtReady(true);
      return;
    }

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady();
      setYtReady(true);
    };

    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // ฟังก์ชันเปลี่ยนไปเพลงถัดไป (วนลูปเมื่อครบ)
  const handleNextTrack = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  const handlePrevTrack = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  // =========================
  // กำหนดการทำงานของ YouTube Player
  // =========================
  useEffect(() => {
    if (!ytReady || currentTrack.audioUrl) return;

    const containerId = 'rose-bgm-yt-player';
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player(containerId, {
        height: '1',
        width: '1',
        videoId: currentTrack.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (isMuted) event.target.mute();
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState.ENDED = 0
            if (event.data === 0) {
              handleNextTrack();
            } else if (event.data === 1) {
              // PLAYING
              setIsPlaying(true);
              setAutoplayBlocked(false);
            } else if (event.data === 2) {
              // PAUSED
              setIsPlaying(false);
            }
          },
          onError: (err) => {
            console.warn('BGM YouTube Player error:', err);
            // ข้ามไปเพลงถัดไปหากคลิปมีปัญหา
            handleNextTrack();
          },
        },
      });
    } else {
      // โหลดเพลงใหม่เมื่อ currentIndex เปลี่ยน
      try {
        if (playerRef.current.loadVideoById) {
          playerRef.current.loadVideoById(currentTrack.youtubeId);
          if (isPlaying) {
            playerRef.current.playVideo();
          }
        }
      } catch (e) {
        console.warn('Failed to switch video:', e);
      }
    }
  }, [ytReady, currentIndex, currentTrack.youtubeId, currentTrack.audioUrl, handleNextTrack]);

  // =========================
  // ควบคุมการเล่น / หยุด
  // =========================
  const playTrack = useCallback(() => {
    setUserManuallyPaused(false);
    setAutoplayBlocked(false);

    if (currentTrack.audioUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setAutoplayBlocked(true));
      return;
    }

    if (playerRef.current && playerRef.current.playVideo) {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch {
        setAutoplayBlocked(true);
      }
    } else {
      setIsPlaying(true);
    }
  }, [currentTrack.audioUrl]);

  const pauseTrack = useCallback(() => {
    if (currentTrack.audioUrl && audioRef.current) {
      audioRef.current.pause();
    }
    if (playerRef.current && playerRef.current.pauseVideo) {
      try {
        playerRef.current.pauseVideo();
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
  }, [currentTrack.audioUrl]);

  const togglePlay = () => {
    setUserHasInteracted(true);
    if (isPlaying) {
      setUserManuallyPaused(true);
      pauseTrack();
    } else {
      playTrack();
    }
  };

  const selectTrack = (index) => {
    setUserHasInteracted(true);
    setUserManuallyPaused(false);
    setCurrentIndex(index);
    setTimeout(() => {
      playTrack();
    }, 60);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (playerRef.current) {
        if (next && playerRef.current.mute) playerRef.current.mute();
        else if (!next && playerRef.current.unMute) playerRef.current.unMute();
      }
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  };

  // =========================
  // เงื่อนไข: วิดีโอหยุดหลังจากเลื่อนผ่านส่วนแรก แล้วเพลงเว็บค่อยขึ้น
  // =========================
  useEffect(() => {
    if (isScrolledPastHero && !hasTriggeredInitialPlay.current && !userManuallyPaused) {
      hasTriggeredInitialPlay.current = true;
      // เริ่มเล่นเพลงเว็บอัตโนมัติ
      playTrack();
    }
  }, [isScrolledPastHero, userManuallyPaused, playTrack]);

  // หากวิดีโอส่วนบนเปิดเสียงเล่น ให้หยุดเพลงเว็บชั่วคราวเพื่อไม่ให้เสียงตีกัน
  useEffect(() => {
    if (heroVideoActive && isPlaying) {
      pauseTrack();
    }
  }, [heroVideoActive, isPlaying, pauseTrack]);

  // ตรวจจับการคลิกครั้งแรกของผู้ใช้เพื่อปลดล็อก Autoplay Audio Policy
  useEffect(() => {
    const handleFirstGesture = () => {
      setUserHasInteracted(true);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  return (
    <>
      {/* ภาชนะสำหรับซ่อน YouTube Player Iframe (เล่นเฉพาะเสียง) */}
      <div
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0.001,
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
        aria-hidden="true"
      >
        <div id="rose-bgm-yt-player" />
      </div>

      {/* HTML5 Audio Fallback */}
      {currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onEnded={handleNextTrack}
          muted={isMuted}
          playsInline
        />
      )}

      {/* แถบเครื่องเล่นเพลงพิกเซล ลอยที่มุมซ้ายล่าง */}
      <div className={`px-bgm-bar ${isPlaying ? 'is-playing' : ''}`}>
        <button
          type="button"
          className="px-bgm-disc-btn"
          onClick={() => setIsDrawerOpen((v) => !v)}
          title="เปิดเพลย์ลิสต์เพลง"
          aria-label="เปิดเพลย์ลิสต์เพลง"
        >
          <span className={`px-bgm-disc ${isPlaying ? 'spin' : ''}`}>
            <PixelIcon name="disc" size={24} />
          </span>
          {isPlaying && (
            <span className="px-bgm-eq" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </button>

        <div
          className="px-bgm-info"
          onClick={() => setIsDrawerOpen(true)}
          title="คลิกเพื่อเลือกเพลง"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsDrawerOpen(true)}
        >
          <span className="px-bgm-tag">{currentTrack.tag || 'BGM'}</span>
          <span className="px-bgm-title">{currentTrack.title}</span>
        </div>

        <div className="px-bgm-controls">
          <button
            type="button"
            className="px-bgm-btn"
            onClick={handlePrevTrack}
            title="เพลงก่อนหน้า"
            aria-label="เพลงก่อนหน้า"
          >
            <PixelIcon name="prev" size={14} />
          </button>

          <button
            type="button"
            className="px-bgm-btn is-main"
            onClick={togglePlay}
            title={isPlaying ? 'หยุดเพลงชั่วคราว' : 'เล่นเพลง'}
            aria-label={isPlaying ? 'หยุดเพลงชั่วคราว' : 'เล่นเพลง'}
          >
            <PixelIcon name={isPlaying ? 'pause' : 'play'} size={15} />
          </button>

          <button
            type="button"
            className="px-bgm-btn"
            onClick={handleNextTrack}
            title="เพลงถัดไป"
            aria-label="เพลงถัดไป"
          >
            <PixelIcon name="next" size={14} />
          </button>

          <button
            type="button"
            className={`px-bgm-btn ${isDrawerOpen ? 'is-active' : ''}`}
            onClick={() => setIsDrawerOpen((v) => !v)}
            title="รายการเพลงทั้งหมด"
            aria-label="รายการเพลงทั้งหมด"
          >
            <PixelIcon name="playlist" size={15} />
            <span className="px-bgm-badge">{currentIndex + 1}/{playlist.length}</span>
          </button>
        </div>

        {/* ป้ายแจ้งเตือนเมื่อเบราว์เซอร์บล็อก Autoplay */}
        {autoplayBlocked && !isPlaying && (
          <button
            type="button"
            className="px-bgm-prompt"
            onClick={togglePlay}
          >
            <PixelIcon name="music" size={14} />
            <span>คลิกเพื่อฟังเพลง Happy Birthday</span>
          </button>
        )}
      </div>

      {/* หน้าต่างเลือกเพลงแบบพิกเซล (Playlist Drawer / Modal) */}
      {isDrawerOpen && (
        <div
          className="px-bgm-overlay"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="px-bgm-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="เพลย์ลิสต์เพลงของโรส"
          >
            <div className="px-bgm-head">
              <div className="px-bgm-head-title">
                <PixelIcon name="disc" size={20} />
                <strong>ROSE 19th PLAYLIST</strong>
              </div>
              <button
                type="button"
                className="px-modal-close"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="ปิดเพลย์ลิสต์"
              >
                <PixelIcon name="close" size={16} />
              </button>
            </div>

            <p className="px-bgm-sub">
              เพลง Happy Birthday เป็นเพลงหลัก และเพลงอื่น ๆ ที่น้องโรสร่วมร้อง/เต้น (วนลูปอัตโนมัติ)
            </p>

            {/* การ์ดเพลงที่กำลังเล่นอยู่ */}
            <div className="px-bgm-now-playing">
              <div className={`px-bgm-now-art ${isPlaying ? 'spin' : ''}`}>
                <PixelIcon name="disc" size={32} />
              </div>
              <div className="px-bgm-now-meta">
                <span className="px-bgm-now-label">
                  {isPlaying ? 'กำลังเล่น' : 'หยุดชั่วคราว'} • Track {currentIndex + 1}
                </span>
                <strong className="px-bgm-now-title">{currentTrack.title}</strong>
                <span className="px-bgm-now-artist">{currentTrack.artist}</span>
              </div>
              <div className="px-bgm-now-actions">
                <button
                  type="button"
                  className="px-btn primary sm"
                  onClick={togglePlay}
                >
                  <PixelIcon name={isPlaying ? 'pause' : 'play'} size={15} />
                  <span>{isPlaying ? 'หยุด' : 'เล่น'}</span>
                </button>
                <button
                  type="button"
                  className="px-btn sm"
                  onClick={toggleMute}
                  title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
                >
                  <PixelIcon name={isMuted ? 'volume-off' : 'volume-on'} size={15} />
                </button>
              </div>
            </div>

            {/* รายชื่อเพลงทั้งหมดในเพลย์ลิสต์ */}
            <div className="px-bgm-tracklist">
              {playlist.map((track, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={track.id || idx}
                    type="button"
                    className={`px-bgm-track-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => selectTrack(idx)}
                  >
                    <span className="px-bgm-track-idx">
                      {isActive && isPlaying ? (
                        <span className="px-bgm-mini-eq">
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        String(idx + 1).padStart(2, '0')
                      )}
                    </span>

                    <div className="px-bgm-track-details">
                      <div className="px-bgm-track-row1">
                        <strong className="px-bgm-track-name">{track.title}</strong>
                        {track.tag && (
                          <span className={`px-bgm-track-tag tag-${track.tagTone || 'pink'}`}>
                            {track.tag}
                          </span>
                        )}
                      </div>
                      <span className="px-bgm-track-desc">
                        {track.artist} — {track.sub}
                      </span>
                    </div>

                    <span className="px-bgm-track-dur">
                      {isActive && isPlaying ? 'PLAYING' : track.duration || ''}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-bgm-footer-note">
              <PixelIcon name="check" size={13} />
              <span>เล่นครบทุกเพลงแล้วจะวนกลับมารันเพลงแรกใหม่อัตโนมัติ (Looping)</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
