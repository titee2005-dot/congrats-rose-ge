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

const SPAWN_SLOTS = [24, 68, 46, 84, 12];

function createBunny(id, variantIndex, startX, withGreeting = false) {
  return {
    id,
    variant: VARIANTS[variantIndex % VARIANTS.length],
    x: startX ?? SPAWN_SLOTS[(id - 1) % SPAWN_SLOTS.length],
    dir: id % 2 === 0 ? -1 : 1,
    state: 'run',
    frame: 'idle',
    timer: 10 + (id % 7) * 3,
    speech: withGreeting ? 'HBD พี่โรส 19 ขวบ! 🎂' : null,
    speechTicks: withGreeting ? 28 : 0,
    jumpOffset: 0,
  };
}

function buildInitialBunnies(count) {
  const n = Math.max(0, Math.min(5, Number(count) || 0));
  return Array.from({ length: n }, (_, i) =>
    createBunny(i + 1, i, SPAWN_SLOTS[i % SPAWN_SLOTS.length], i === 0)
  );
}

export default function PixelBunnies({
  targetCount = 1,
  visible = true,
  onToggleVisible,
}) {
  const safeTarget = Math.max(0, Math.min(5, Math.round(Number(targetCount) || 0)));

  const [bunnies, setBunnies] = useState(() => buildInitialBunnies(safeTarget));
  const [carrot, setCarrot] = useState(null);
  const [bursts, setBursts] = useState([]);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 600
  );
  const [isTyping, setIsTyping] = useState(false);

  const nextIdRef = useRef(10);
  const carrotRef = useRef(null);

  useEffect(() => {
    carrotRef.current = carrot;
  }, [carrot]);

  // ปรับขนาดกระต่ายตามความกว้างหน้าจอ (มือถือ vs คอม)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ซ่อนกระต่ายชั่วคราวอัตโนมัติบนมือถือเวลาแตะพิมพ์ในช่องฟอร์ม เพื่อไม่ให้บังแป้นพิมพ์หรือปุ่มส่ง
  useEffect(() => {
    let blurTimer = null;

    const isFormField = (el) =>
      el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');

    const handleFocusIn = (e) => {
      if (window.innerWidth <= 820 && isFormField(e.target)) {
        if (blurTimer) clearTimeout(blurTimer);
        setIsTyping(true);
      }
    };

    const handleFocusOut = (e) => {
      if (isFormField(e.target)) {
        blurTimer = setTimeout(() => {
          const active = document.activeElement;
          if (!isFormField(active)) {
            setIsTyping(false);
          }
        }, 150);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      if (blurTimer) clearTimeout(blurTimer);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // ซิงก์จำนวนกระต่ายตามจำนวนคำอวยพร หรือค่าจากหน้า Admin (0..5 ตัว)
  useEffect(() => {
    setBunnies((prev) => {
      if (prev.length === safeTarget) return prev;
      if (prev.length > safeTarget) return prev.slice(0, safeTarget);

      const added = [];
      for (let i = prev.length; i < safeTarget; i += 1) {
        const id = nextIdRef.current++;
        const startX = SPAWN_SLOTS[i % SPAWN_SLOTS.length];
        added.push({
          ...createBunny(id, i, startX, prev.length === 0 && i === 0),
          state: 'jump',
          frame: 'hop',
          timer: 5,
          jumpOffset: 16,
        });
      }
      return [...prev, ...added];
    });
  }, [safeTarget]);

  useEffect(() => {
    if (!visible || safeTarget <= 0 || isTyping) return;

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

          // ถ้ามีแครอทวางอยู่ ให้กระต่ายวิ่งไปหาแครอท
          if (activeCarrot && state !== 'jump') {
            const diff = activeCarrot.x - x;
            if (Math.abs(diff) > 2.4) {
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
            x = Math.max(6, Math.min(94, x));
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
            jumpOffset = timer > 3 ? 20 : timer > 1 ? 9 : 0;
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
            if (x <= 6) {
              x = 6;
              dir = 1;
            } else if (x >= 94) {
              x = 94;
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
  }, [visible, safeTarget, isTyping]);

  // หากแอดมินตั้งเป็น 0 ตัว ไม่ต้องแสดงแถบกระต่าย
  if (safeTarget <= 0) return null;

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
          jumpOffset: 20,
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

  const spriteSize = isMobile ? 38 : 50;

  return (
    <>
      {/* สนามหญ้าพิกเซลด้านล่างจอ — ไม่มีปุ่มวางขวางทางวิ่งแล้ว */}
      {visible && (
        <div
          className={`bunny-playground ${isTyping ? 'is-typing-hidden' : ''}`}
          aria-hidden="false"
        >
          {carrot && (
            <div
              className="bunny-carrot-drop"
              style={{ left: `${carrot.x}%` }}
              aria-hidden="true"
            >
              <PixelIcon name="carrot" size={isMobile ? 24 : 30} />
            </div>
          )}

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

          {bunnies.map((b) => {
            const bubbleEdgeClass =
              b.x < 24 ? 'bubble-left' : b.x > 76 ? 'bubble-right' : '';
            return (
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
                  <span className={`bunny-bubble ${bubbleEdgeClass}`}>
                    {b.speech}
                  </span>
                )}
                <PixelBunnySprite
                  variant={b.variant}
                  frame={b.frame}
                  size={spriteSize}
                  flip={b.dir < 0}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ปุ่มมินิลอยอยู่เหนือเลนวิ่งของกระต่าย (ไม่บังตัวกระต่ายเวลากระต่ายวิ่งผ่าน) */}
      <div className={`bunny-dock ${isTyping ? 'is-typing-hidden' : ''}`}>
        {visible && (
          <button
            type="button"
            className="bunny-dock-btn"
            onClick={handleDropCarrot}
            title="โยนแครอทเรียกน้องกระต่าย"
            aria-label="โยนแครอทเรียกน้องกระต่าย"
          >
            <span aria-hidden="true">🥕</span>
            <span className="dock-label">แครอท</span>
          </button>
        )}
        <button
          type="button"
          className={`bunny-dock-toggle ${!visible ? 'is-muted' : ''}`}
          onClick={onToggleVisible}
          title={visible ? 'ซ่อนน้องกระต่ายชั่วคราว' : 'เรียกน้องกระต่ายออกมาวิ่งเล่น'}
          aria-label={visible ? 'ซ่อนกระต่าย' : 'แสดงกระต่าย'}
        >
          <PixelIcon name="bunny" size={18} />
          <span className="dock-count">×{safeTarget}</span>
          <span className="dock-label">{visible ? 'ซ่อน' : 'แสดง'}</span>
        </button>
      </div>
    </>
  );
}
