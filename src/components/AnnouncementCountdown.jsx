import { useSiteCopy } from '../content/SiteCopy';
import { useEffect, useRef, useState } from 'react';
import { countdownParts } from '../data/celebrationTime';

export default function AnnouncementCountdown({ onCelebrate }) {
  const copy = useSiteCopy();
  const [clock, setClock] = useState(() => countdownParts());
  const celebrated = useRef(false);

  useEffect(() => {
    const tick = () => {
      const next = countdownParts();
      setClock(next);
      if (next.reached && !celebrated.current && document.visibilityState !== 'hidden') {
        celebrated.current = true;
        onCelebrate?.();
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [onCelebrate]);

  return (
    <section className="announcement-countdown" aria-labelledby="announcement-title">
      <div className="announcement-copy">
        <span className="announcement-eyebrow">{copy("AnnouncementCountdown.037af094da", "THE NEXT CHAPTER · GENERAL ELECTION")}</span>
        <h2 id="announcement-title">{clock.reached ? copy("AnnouncementCountdown.6beb892017", "ถึงเวลาร่วมฉลองให้โรสแล้ว!") : copy("AnnouncementCountdown.c4f2e63440", "นับถอยหลังสู่วันประกาศผล")}</h2>
        <p><time dateTime="2026-11-14T18:00:00+07:00">{copy("AnnouncementCountdown.058f84eafc", "14 พฤศจิกายน 2569 · 18:00 น.")}</time>{copy("AnnouncementCountdown.ff55d87904", " (เวลาไทย)")}</p>
      </div>
      {clock.reached ? (
        <div className="announcement-arrived" role="status">{copy("AnnouncementCountdown.d025131da2", "CONGRATULATIONS, ROSE!")}<span>{copy("AnnouncementCountdown.ee2f0d1899", "ร่วมส่งความยินดีให้ก้าวสำคัญของโรสไปด้วยกัน")}</span></div>
      ) : (
        <div className="countdown-digits" role="timer" aria-label={copy("AnnouncementCountdown.4eb58ea4c6", "เวลาที่เหลือถึงวันประกาศผล")}>
          {clock.values.map((value, i) => <div className="countdown-unit" key={i}><strong>{String(value).padStart(2, '0')}</strong><span>{[copy("AnnouncementCountdown.3a8f33ed5a", "วัน"), copy("AnnouncementCountdown.0e28376363", "ชั่วโมง"), copy("AnnouncementCountdown.b1ac4c44be", "นาที"), copy("AnnouncementCountdown.7ef44d2d41", "วินาที")][i]}</span></div>)}
        </div>
      )}
    </section>
  );
}
