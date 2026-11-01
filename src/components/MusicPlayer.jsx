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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ytApiReady, setYtApiReady] = useState(false);

  const currentTrack = playlist[currentIndex] || playlist[0];

  const wrapRef = useRef(null);
  const ytHostRef = useRef(null);
  const playerRef = useRef(null);
  const playerReadyRef = useRef(false);
  const audioRef = useRef(null);
  const wantPlayRef = useRef(false);
  const userPausedRef = useRef(false);
  const hasAutoStartedRef = useRef(false);
  const pendingGesturePlayRef = useRef(false);
  const loadedIndexRef = useRef(0);
  const errorCountRef = useRef(0);
  const errorTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const lastAdvanceAtRef = useRef(0);
  const playlistLenRef = useRef(playlist.length);

  useEffect(() => {
    playlistLenRef.current = playlist.length;
  }, [playlist.length]);

  // โหลด YouTube IFrame API ครั้งเดียว
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setYtApiReady(true);
      return;
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      setYtApiReady(true);
    };

    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  // ปิดเมนู/พับแผ่นเสียงเมื่อคลิกข้างนอกหรือกด Esc
  useEffect(() => {
    if (!isMenuOpen && !isExpanded) return;
    const closeAll = () => {
      setIsMenuOpen(false);
      setIsExpanded(false);
    };
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) closeAll();
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isMenuOpen, isExpanded]);

  // ค่อย ๆ เพิ่มระดับเสียงให้นุ่มนวลเวลาเพลงเว็บเริ่มขึ้น
  const fadeInVolume = useCallback(() => {
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    const p = playerRef.current;
    if (!p || typeof p.setVolume !== 'function') return;
    let vol = 15;
    try {
      p.unMute?.();
      p.setVolume(vol);
    } catch {
      return;
    }
    fadeTimerRef.current = setInterval(() => {
      vol = Math.min(75, vol + 12);
      try {
        p.setVolume(vol);
      } catch {
        clearInterval(fadeTimerRef.current);
      }
      if (vol >= 75) clearInterval(fadeTimerRef.current);
    }, 160);
  }, []);

  const advanceNext = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceAtRef.current < 800) return;
    lastAdvanceAtRef.current = now;
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, playlistLenRef.current));
  }, []);

  // สร้าง YouTube Player ครั้งเดียว (ขนาด 200x200 ตามข้อกำหนดของ YouTube API)
  useEffect(() => {
    if (!ytApiReady || !ytHostRef.current) return;

    let cancelled = false;
    const host = ytHostRef.current;
    host.innerHTML = '';
    const mountEl = document.createElement('div');
    host.appendChild(mountEl);

    const firstVideoId = playlist[0]?.youtubeId || '';
    loadedIndexRef.current = 0;
    playerReadyRef.current = false;

    const instance = new window.YT.Player(mountEl, {
      width: '200',
      height: '200',
      videoId: firstVideoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (e) => {
          if (cancelled) return;
          playerReadyRef.current = true;
          try {
            e.target.setVolume(75);
          } catch {
            // ignore
          }
          if (wantPlayRef.current) {
            try {
              e.target.playVideo();
              fadeInVolume();
            } catch {
              pendingGesturePlayRef.current = true;
            }
          }
        },
        onStateChange: (e) => {
          if (cancelled) return;
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
          if (e.data === 1) {
            errorCountRef.current = 0;
            pendingGesturePlayRef.current = false;
            setIsPlaying(true);
          } else if (e.data === 2) {
            setIsPlaying(false);
          } else if (e.data === 0) {
            wantPlayRef.current = true;
            advanceNext();
          }
        },
        onError: () => {
          if (cancelled) return;
          // ป้องกันการเลื่อนเพลงรัว ๆ: ถ้าทุกเพลงติดข้อจำกัดเบราว์เซอร์/เน็ต ให้หยุดทันที
          errorCountRef.current += 1;
          if (errorCountRef.current >= playlistLenRef.current) {
            wantPlayRef.current = false;
            setIsPlaying(false);
            return;
          }
          if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
          errorTimerRef.current = setTimeout(() => {
            if (!cancelled) advanceNext();
          }, 1200);
        },
      },
    });

    playerRef.current = instance;

    return () => {
      cancelled = true;
      playerReadyRef.current = false;
      playerRef.current = null;
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      try {
        instance.destroy?.();
      } catch {
        // ignore
      }
    };
  }, [ytApiReady, playlist, advanceNext, fadeInVolume]);

  // สลับเพลงเมื่อ currentIndex เปลี่ยน
  useEffect(() => {
    if (currentTrack?.audioUrl) return;
    if (!playerReadyRef.current || !playerRef.current) return;
    if (loadedIndexRef.current === currentIndex) return;

    loadedIndexRef.current = currentIndex;
    try {
      if (wantPlayRef.current) {
        playerRef.current.loadVideoById(currentTrack.youtubeId);
      } else {
        playerRef.current.cueVideoById(currentTrack.youtubeId);
      }
    } catch {
      // ignore
    }
  }, [currentIndex, currentTrack]);

  const startPlayback = useCallback(
    (withFade = false) => {
      wantPlayRef.current = true;

      if (currentTrack?.audioUrl && audioRef.current) {
        audioRef.current.volume = 0.75;
        audioRef.current
          .play()
          .then(() => {
            pendingGesturePlayRef.current = false;
            setIsPlaying(true);
          })
          .catch(() => {
            pendingGesturePlayRef.current = true;
          });
        return;
      }

      if (playerReadyRef.current && playerRef.current?.playVideo) {
        try {
          if (loadedIndexRef.current !== currentIndex) {
            loadedIndexRef.current = currentIndex;
            playerRef.current.loadVideoById(currentTrack.youtubeId);
          } else {
            playerRef.current.playVideo();
          }
          if (withFade) fadeInVolume();
          // หากเบราว์เซอร์บล็อก Autoplay ก่อนแตะจอ จะรอเล่นทันทีที่ผู้ใช้แตะจอครั้งแรก
          setTimeout(() => {
            try {
              const st = playerRef.current?.getPlayerState?.();
              if (wantPlayRef.current && st !== 1 && st !== 3) {
                pendingGesturePlayRef.current = true;
              }
            } catch {
              // ignore
            }
          }, 900);
        } catch {
          pendingGesturePlayRef.current = true;
        }
      } else {
        pendingGesturePlayRef.current = true;
      }
    },
    [currentIndex, currentTrack, fadeInVolume]
  );

  const stopPlayback = useCallback(() => {
    wantPlayRef.current = false;
    pendingGesturePlayRef.current = false;
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playerReadyRef.current && playerRef.current?.pauseVideo) {
      try {
        playerRef.current.pauseVideo();
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
  }, []);

  // เมื่อเลื่อนผ่านส่วนแรก (Hero) ให้เพลงเว็บค่อย ๆ ขึ้นอัตโนมัติ
  useEffect(() => {
    if (
      isScrolledPastHero &&
      !hasAutoStartedRef.current &&
      !userPausedRef.current
    ) {
      hasAutoStartedRef.current = true;
      errorCountRef.current = 0;
      startPlayback(true);
    }
  }, [isScrolledPastHero, startPlayback]);

  // หากผู้ใช้แตะจอหลังเบราว์เซอร์บล็อก Autoplay ให้เริ่มเล่นทันที
  useEffect(() => {
    const onGesture = () => {
      if (pendingGesturePlayRef.current && !userPausedRef.current) {
        pendingGesturePlayRef.current = false;
        errorCountRef.current = 0;
        startPlayback(true);
      }
    };
    window.addEventListener('pointerdown', onGesture, { passive: true });
    return () => window.removeEventListener('pointerdown', onGesture);
  }, [startPlayback]);

  // ถ้าเปิดเสียงวิดีโอในส่วนแรก ให้พักเพลงเว็บชั่วคราวไม่ให้เสียงชนกัน
  useEffect(() => {
    if (heroVideoActive && isPlaying) {
      stopPlayback();
    }
  }, [heroVideoActive, isPlaying, stopPlayback]);

  const handleTogglePlay = () => {
    errorCountRef.current = 0;
    if (isPlaying) {
      userPausedRef.current = true;
      stopPlayback();
    } else {
      userPausedRef.current = false;
      hasAutoStartedRef.current = true;
      startPlayback(false);
    }
  };

  const handleNextClick = () => {
    errorCountRef.current = 0;
    userPausedRef.current = false;
    hasAutoStartedRef.current = true;
    wantPlayRef.current = true;
    lastAdvanceAtRef.current = Date.now();
    const nextIdx = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIdx);
    if (playerReadyRef.current && playerRef.current?.loadVideoById) {
      loadedIndexRef.current = nextIdx;
      try {
        playerRef.current.loadVideoById(playlist[nextIdx].youtubeId);
      } catch {
        // ignore
      }
    }
  };

  const handleSelectSong = (idx) => {
    errorCountRef.current = 0;
    userPausedRef.current = false;
    hasAutoStartedRef.current = true;
    wantPlayRef.current = true;
    lastAdvanceAtRef.current = Date.now();
    setCurrentIndex(idx);
    setIsMenuOpen(false);

    if (playerReadyRef.current && playerRef.current?.loadVideoById) {
      loadedIndexRef.current = idx;
      try {
        playerRef.current.loadVideoById(playlist[idx].youtubeId);
      } catch {
        // ignore
      }
    }
  };

  return (
    <>
      {/* ตัวเล่นเสียง YouTube ซ่อนโปร่งใสขนาดมาตรฐาน API (ห้ามใช้ visibility: hidden) */}
      <div ref={ytHostRef} className="px-bgm-yt-host" aria-hidden="true" />

      {currentTrack?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onEnded={() => {
            wantPlayRef.current = true;
            advanceNext();
          }}
          playsInline
        />
      )}

      {/* แผ่นเสียงพิกเซลจิ๋วแบบพับได้: ปกติเห็นแค่แผ่นเสียง แตะแล้วสไลด์ชื่อเพลง+ปุ่มควบคุมออกมา */}
      <div
        ref={wrapRef}
        className={`px-bgm-mini ${isPlaying ? 'is-playing' : ''} ${isExpanded ? 'is-expanded' : ''}`}
      >
        <button
          type="button"
          className="px-bgm-vinyl"
          onClick={() => {
            setIsExpanded((v) => !v);
            setIsMenuOpen(false);
          }}
          title={isExpanded ? 'พับเครื่องเล่นเพลง' : 'เปิดเครื่องเล่นเพลง'}
          aria-label={isExpanded ? 'พับเครื่องเล่นเพลง' : 'เปิดเครื่องเล่นเพลง'}
          aria-expanded={isExpanded}
        >
          <span className={`px-bgm-disc-ico ${isPlaying ? 'spin' : ''}`}>
            <PixelIcon name="disc" size={20} />
          </span>
          {isPlaying && !isExpanded && (
            <span className="px-bgm-vinyl-note" aria-hidden="true">
              <PixelIcon name="music" size={10} />
            </span>
          )}
        </button>

        <div className="px-bgm-panel" aria-hidden={!isExpanded}>
        {isMenuOpen && (
          <div
            className="px-bgm-menu"
            role="listbox"
            aria-label="เลือกเพลง"
          >
            {playlist.map((track, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={track.id || idx}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`px-bgm-item ${active ? 'is-active' : ''}`}
                  onClick={() => handleSelectSong(idx)}
                >
                  <span className="px-bgm-item-mark" aria-hidden="true">
                    {active && isPlaying ? (
                      <span className="px-bgm-bars">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : (
                      <span>{idx + 1}.</span>
                    )}
                  </span>
                  <span className="px-bgm-item-name">{track.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="px-bgm-song-btn"
          onClick={() => setIsMenuOpen((v) => !v)}
          title="เลือกเพลง"
          aria-expanded={isMenuOpen}
          tabIndex={isExpanded ? 0 : -1}
        >
          <span className="px-bgm-song-name">{currentTrack.title}</span>
          <PixelIcon
            name={isMenuOpen ? 'chevron-down' : 'chevron-up'}
            size={11}
          />
        </button>

        <button
          type="button"
          className="px-bgm-icon-btn is-play"
          onClick={handleTogglePlay}
          title={isPlaying ? 'หยุดเพลง' : 'เล่นเพลง'}
          aria-label={isPlaying ? 'หยุดเพลง' : 'เล่นเพลง'}
          tabIndex={isExpanded ? 0 : -1}
        >
          <PixelIcon name={isPlaying ? 'pause' : 'play'} size={11} />
        </button>

        <button
          type="button"
          className="px-bgm-icon-btn is-next"
          onClick={handleNextClick}
          title="เพลงถัดไป"
          aria-label="เพลงถัดไป"
          tabIndex={isExpanded ? 0 : -1}
        >
          <PixelIcon name="next" size={11} />
        </button>
        </div>
      </div>
    </>
  );
}
