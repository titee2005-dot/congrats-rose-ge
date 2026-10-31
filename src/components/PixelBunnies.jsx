import { useState, useEffect, useRef } from 'react';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

const BUNNY_QUOTES = [
  'HBD พี่โรส 19 ขวบ! 🎂',
  'รักโรสที่สุดเลยน้า~ 🌹',
  'ปิ้วๆ เขียนการ์ดให้โรสกัน! 💌',
  'จะยังไงก็รักโรส ♡',
  '19 ปีขอให้สดใสทุกวันเลย ✨',
  'กระต่ายน้อยของโรสเองคับ 🐰',
  'แค่เพียงมีโรสก็มีความสุขแล้ว 🩷',
  'กินของอร่อยเยอะๆ นะพี่โรส 🍰',
];

const VARIANTS = [
  'white-ribbon',
  'pink-rose',
  'party-19',
  'lavender-gen6',
  'lop-cream',
];

function createBunny(id, variantIndex, startX) {
  return {
    id,
    variant: VARIANTS[variantIndex % VARIANTS.length],
    x: startX ?? 10 + ((id * 21) % 78), // % of viewport width
    dir: id % 2 === 0 ? 1 : -1, // 1 = right, -1 = left
    state: 'run', // 'run' | 'idle' | 'jump'
    frame: 'idle', // 'idle' | 'hop' | 'blink'
    timer: 8 + (id % 7) * 3,
    speech: id === 1 ? 'HBD พี่โรส 19 ขวบ! 🎂' : null,
    speechTicks: id === 1 ? 32 : 0,
    jumpOffset: 0,
  };
}

export default function PixelBunnies({ visible = true, onToggleVisible }) {
  const [bunnies, setBunnies] = useState(() => [
    createBunny(1, 0, 14),
    createBunny(2, 1, 38),
    createBunny(3, 2, 64),
    createBunny(4, 3, 84),
  ]);
  const [carrot, setCarrot] = useState(null); // { x: number, ticks: number }
  const [bursts, setBursts] = useState([]);
  const nextIdRef = useRef(5);
  const carrotRef = useRef(null);

  useEffect(() => {
    carrotRef.current = carrot;
  }, [carrot]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      const activeCarrot = carrotRef.current;

      setBunnies((prev) =>
        prev.map((b) => {
          let {
            x,
            dir,
            state,
            frame,
            timer,
            speech,
            speechTicks,
            jumpOffset,
          } = b;

          if (speechTicks > 0) {
            speechTicks -= 1;
            if (speechTicks <= 0) speech = null;
          }

          // ถ้ามีแครอทวางอยู่ ให้กระต่ายวิ่งไปหาแครอท!
          if (activeCarrot && state !== 'jump') {
            const diff = activeCarrot.x - x;
            if (Math.abs(diff) > 2.2) {
              dir = diff > 0 ? 1 : -1;
              x += dir * 1.35;
              frame = frame === 'hop' ? 'idle' : 'hop';
              state = 'run';
            } else {
              frame = frame === 'blink' ? 'idle' : 'blink';
              state = 'idle';
              if (!speech) {
                speech = 'ง่ำๆ อร่อยจัง 🥕♥';
                speechTicks = 18;
              }
            }
            x = Math.max(3, Math.min(93, x));
            return {
              ...b,
              x,
              dir,
              state,
              frame,
              timer,
              speech,
              speechTicks,
              jumpOffset: 0,
            };
          }

          if (state === 'jump') {
            timer -= 1;
            jumpOffset = timer > 3 ? 22 : timer > 1 ? 10 : 0;
            frame = 'hop';
            if (timer <= 0) {
              state = 'run';
              jumpOffset = 0;
              timer = 14 + Math.floor(Math.random() * 18);
            }
            return {
              ...b,
              state,
              frame,
              timer,
              speech,
              speechTicks,
              jumpOffset,
            };
          }

          timer -= 1;
          if (timer <= 0) {
            if (state === 'run') {
              state = 'idle';
              timer = 8 + Math.floor(Math.random() * 12);
              if (Math.random() < 0.32) dir = -dir;
            } else {
              state = 'run';
              timer = 14 + Math.floor(Math.random() * 24);
              if (Math.random() < 0.25) dir = -dir;
            }
          }

          if (state === 'run') {
            x += dir * 0.78;
            if (x <= 3) {
              x = 3;
              dir = 1;
            } else if (x >= 93) {
              x = 93;
              dir = -1;
            }
            frame = frame === 'hop' ? 'idle' : 'hop';
          } else {
            frame = timer % 4 === 0 ? 'blink' : 'idle';
          }

          return {
            ...b,
            x,
            dir,
            state,
            frame,
            timer,
            speech,
            speechTicks,
            jumpOffset: 0,
          };
        })
      );

      setCarrot((prevCarrot) => {
        if (!prevCarrot) return null;
        if (prevCarrot.ticks <= 1) return null;
        return { ...prevCarrot, ticks: prevCarrot.ticks - 1 };
      });
    }, 130);

    return () => clearInterval(interval);
  }, [visible]);

  const spawnBurst = (xPercent) => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev.slice(-8), { id, x: xPercent }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((item) => item.id !== id));
    }, 950);
  };

  const handleClickBunny = (bunnyId) => {
    setBunnies((prev) =>
      prev.map((b) => {
        if (b.id !== bunnyId) return b;
        spawnBurst(b.x);
        const quote =
          BUNNY_QUOTES[Math.floor(Math.random() * BUNNY_QUOTES.length)];
        return {
          ...b,
          state: 'jump',
          frame: 'hop',
          timer: 6,
          jumpOffset: 22,
          speech: quote,
          speechTicks: 26,
        };
      })
    );
  };

  const handleDropCarrot = () => {
    const randomX = 18 + Math.floor(Math.random() * 64);
    setCarrot({ x: randomX, ticks: 42 });
    spawnBurst(randomX);
  };

  const handleAddBunny = () => {
    setBunnies((prev) => {
      if (prev.length >= 9) {
        // รีเซ็ตกลับเป็น 4 ตัวถ้าเยอะเกินไป
        return [
          createBunny(1, 0, 14),
          createBunny(2, 1, 38),
          createBunny(3, 2, 64),
          createBunny(4, 3, 84),
        ];
      }
      const id = nextIdRef.current++;
      const x = 12 + Math.floor(Math.random() * 75);
      spawnBurst(x);
      return [
        ...prev,
        {
          ...createBunny(id, id, x),
          state: 'jump',
          timer: 6,
          jumpOffset: 20,
          speech: 'ปิ้วๆ มาฉลองวันเกิดโรสด้วยคน! 🐰🌹',
          speechTicks: 26,
        },
      ];
    });
  };

  return (
    <>
      {/* สนามหญ้าพิกเซลด้านล่างจอที่น้องกระต่ายวิ่งเล่น */}
      {visible && (
        <div className="bunny-playground" aria-hidden="false">
          {/* แครอทที่แฟนคลับโยนให้ */}
          {carrot && (
            <div
              className="bunny-carrot-drop"
              style={{ left: `${carrot.x}%` }}
              aria-hidden="true"
            >
              <PixelIcon name="carrot" size={30} />
            </div>
          )}

          {/* เอฟเฟกต์หัวใจและดอกกุหลาบเวลากดน้องกระต่าย */}
          {bursts.map((burst) => (
            <div
              key={burst.id}
              className="bunny-heart-burst"
              style={{ left: `${burst.x}%` }}
              aria-hidden="true"
            >
              <span>♥</span>
              <span>🌹</span>
              <span>✦</span>
            </div>
          ))}

          {/* น้องกระต่ายแต่ละตัว */}
          {bunnies.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`running-bunny ${b.state === 'jump' ? 'is-jumping' : ''}`}
              style={{
                left: `${b.x}%`,
                transform: `translate(-50%, -${b.jumpOffset}px)`,
              }}
              onClick={() => handleClickBunny(b.id)}
              title="จิ้มน้องกระต่ายเพื่อทักทาย!"
              aria-label="น้องกระต่ายอวยพรวันเกิดโรส"
            >
              {b.speech && (
                <span className="bunny-bubble">{b.speech}</span>
              )}
              <PixelBunnySprite
                variant={b.variant}
                frame={b.frame}
                size={52}
                flip={b.dir < 0}
              />
            </button>
          ))}
        </div>
      )}

      {/* แผงควบคุมลูกเล่นกระต่ายมุมขวาล่าง */}
      <div className="bunny-dock">
        {visible && (
          <>
            <button
              type="button"
              className="bunny-dock-btn"
              onClick={handleDropCarrot}
              title="โยนแครอทเรียกน้องกระต่ายมารุมกิน"
            >
              🥕 แครอท
            </button>
            <button
              type="button"
              className="bunny-dock-btn"
              onClick={handleAddBunny}
              title="เรียกน้องกระต่ายเพิ่มในหน้าจอ"
            >
              {bunnies.length >= 9 ? '↺ รีเซ็ต' : `🐰 +1 (${bunnies.length})`}
            </button>
          </>
        )}
        <button
          type="button"
          className="bunny-dock-toggle"
          onClick={onToggleVisible}
          title={visible ? 'พักน้องกระต่ายชั่วคราว' : 'เรียกน้องกระต่ายออกมาวิ่งเล่น'}
        >
          <PixelIcon name="bunny" size={22} />
          <span>{visible ? 'ซ่อนกระต่าย' : 'เรียกกระต่าย'}</span>
        </button>
      </div>
    </>
  );
}
