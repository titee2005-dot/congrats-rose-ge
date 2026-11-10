import { useEffect, useRef, useState } from 'react';
import { countdownParts } from '../data/celebrationTime';

export default function AnnouncementCountdown({ onCelebrate }) {
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
        <span className="announcement-eyebrow">THE NEXT CHAPTER · GENERAL ELECTION</span>
        <h2 id="announcement-title">{clock.reached ? 'ถึงเวลาร่วมฉลองให้โรสแล้ว!' : 'นับถอยหลังสู่วันประกาศผล'}</h2>
        <p><time dateTime="2026-11-14T18:00:00+07:00">14 พฤศจิกายน 2569 · 18:00 น.</time> (เวลาไทย)</p>
      </div>
      {clock.reached ? (
        <div className="announcement-arrived" role="status">CONGRATULATIONS, ROSE!<span>ร่วมส่งความยินดีให้ก้าวสำคัญของโรสไปด้วยกัน</span></div>
      ) : (
        <div className="countdown-digits" role="timer" aria-label="เวลาที่เหลือถึงวันประกาศผล">
          {clock.values.map((value, i) => <div className="countdown-unit" key={i}><strong>{String(value).padStart(2, '0')}</strong><span>{['วัน', 'ชั่วโมง', 'นาที', 'วินาที'][i]}</span></div>)}
        </div>
      )}
    </section>
  );
}
