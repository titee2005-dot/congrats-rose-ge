// ==========================================
// คลังภาพ Pixel Art คมกริบ (Crisp SVG Pixel Matrix)
// ทั้งน้องกระต่ายหลายท่าทาง ไอคอน 8-bit และภาพประกอบ Timeline พาสเทล
// ==========================================

export function PixelBunnySprite({
  variant = 'white-ribbon',
  frame = 'idle', // 'idle' | 'hop' | 'blink'
  size = 52,
  flip = false,
  className = '',
}) {
  const palettes = {
    'white-ribbon': {
      fur: '#ffffff',
      furShade: '#fce4ef',
      earInner: '#ffa6c9',
      bow: '#ff5c9e',
      bowCenter: '#fff0f6',
      outline: '#5e2b47',
      cheek: '#ff8cb8',
      prop: 'none',
    },
    'pink-rose': {
      fur: '#fff2f7',
      furShade: '#ffd6e7',
      earInner: '#ff8fb8',
      bow: '#e84585',
      bowCenter: '#ffffff',
      outline: '#5e2b47',
      cheek: '#ff70a6',
      prop: 'rose',
    },
    'lop-cream': {
      fur: '#fffaf0',
      furShade: '#f7e5cf',
      earInner: '#ffb3c6',
      bow: '#ff85b3',
      bowCenter: '#fffdf9',
      outline: '#5e2b47',
      cheek: '#ff9ebb',
      prop: 'heart',
    },
    'lavender-gen6': {
      fur: '#ffffff',
      furShade: '#efe3ff',
      earInner: '#d4b3ff',
      bow: '#a970ff',
      bowCenter: '#fff5fb',
      outline: '#522b5e',
      cheek: '#ff94c2',
      prop: 'none',
    },
    'party-19': {
      fur: '#ffffff',
      furShade: '#ffe3ee',
      earInner: '#ffa6c9',
      bow: '#ff5c9e',
      bowCenter: '#ffe066',
      outline: '#5e2b47',
      cheek: '#ff85b3',
      prop: 'hat',
    },
  };

  const p = palettes[variant] || palettes['white-ribbon'];
  const isHop = frame === 'hop';
  const isBlink = frame === 'blink';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      shapeRendering="crispEdges"
      className={`pixel-svg ${className}`}
      style={{
        transform: flip ? 'scaleX(-1)' : undefined,
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      {/* เงาพื้นเวลาวิ่ง/ยืน */}
      <rect
        x={isHop ? 6 : 4}
        y="18"
        width={isHop ? 8 : 11}
        height="1"
        fill="rgba(94, 43, 71, 0.22)"
      />

      <g transform={isHop ? 'translate(0, -2)' : 'translate(0, 0)'}>
        {/* หมวกปาร์ตี้วันเกิด (เฉพาะ party-19) */}
        {p.prop === 'hat' && (
          <g>
            <rect x="8" y="0" width="2" height="1" fill="#ffe066" />
            <rect x="8" y="1" width="2" height="1" fill="#ff5c9e" />
            <rect x="7" y="2" width="4" height="2" fill="#ff85b3" />
            <rect x="8" y="2" width="1" height="1" fill="#ffffff" />
          </g>
        )}

        {/* หูซ้าย-ขวา (ขยับตามจังหวะกระโดด) */}
        <rect x="5" y={isHop ? 2 : 1} width="3" height="5" fill={p.outline} />
        <rect x="11" y={isHop ? 1 : 2} width="3" height="5" fill={p.outline} />
        <rect x="6" y={isHop ? 3 : 2} width="1" height="4" fill={p.fur} />
        <rect x="12" y={isHop ? 2 : 3} width="1" height="4" fill={p.fur} />
        <rect x="6" y={isHop ? 4 : 3} width="1" height="2" fill={p.earInner} />
        <rect x="12" y={isHop ? 3 : 4} width="1" height="2" fill={p.earInner} />

        {/* โบว์ติดหูน่ารักๆ */}
        <rect x="11" y="5" width="4" height="2" fill={p.bow} />
        <rect x="12" y="5" width="1" height="1" fill={p.bowCenter} />

        {/* หางปุกปุย */}
        <rect x="2" y="13" width="2" height="3" fill={p.outline} />
        <rect x="2" y="14" width="2" height="1" fill={p.fur} />
        <rect x="1" y="14" width="1" height="1" fill={p.fur} />

        {/* ลำตัว + หัว (Outline) */}
        <rect x="4" y="6" width="11" height="6" fill={p.outline} />
        <rect x="3" y="7" width="13" height="5" fill={p.outline} />
        <rect x="4" y="12" width="10" height="5" fill={p.outline} />
        <rect x="3" y="13" width="11" height="3" fill={p.outline} />

        {/* สีขนด้านในหัวและตัว */}
        <rect x="5" y="7" width="9" height="5" fill={p.fur} />
        <rect x="4" y="8" width="11" height="3" fill={p.fur} />
        <rect x="5" y="12" width="8" height="4" fill={p.fur} />
        <rect x="4" y="13" width="9" height="2" fill={p.fur} />
        <rect x="4" y="15" width="8" height="1" fill={p.furShade} />

        {/* ตา (กะพริบตา/ยิ้มตาหยีได้) */}
        {isBlink ? (
          <>
            <rect x="6" y="9" width="2" height="1" fill={p.outline} />
            <rect x="12" y="9" width="2" height="1" fill={p.outline} />
          </>
        ) : (
          <>
            <rect x="7" y="9" width="1" height="2" fill={p.outline} />
            <rect x="12" y="9" width="1" height="2" fill={p.outline} />
            <rect x="7" y="9" width="1" height="1" fill="#ffffff" opacity="0.45" />
          </>
        )}

        {/* แก้มชมพู + จมูกปุ๊กปิ๊ก */}
        <rect x="5" y="10" width="2" height="1" fill={p.cheek} />
        <rect x="13" y="10" width="2" height="1" fill={p.cheek} />
        <rect x="9" y={isBlink ? 9 : 10} width="2" height="1" fill="#ff5c9e" />

        {/* ขาหน้า-ขาหลัง ขยับตอนวิ่ง */}
        {isHop ? (
          <>
            <rect x="3" y="16" width="3" height="2" fill={p.outline} />
            <rect x="4" y="16" width="2" height="1" fill={p.fur} />
            <rect x="12" y="16" width="4" height="2" fill={p.outline} />
            <rect x="13" y="16" width="2" height="1" fill={p.fur} />
          </>
        ) : (
          <>
            <rect x="5" y="16" width="3" height="2" fill={p.outline} />
            <rect x="6" y="16" width="2" height="1" fill={p.fur} />
            <rect x="10" y="16" width="3" height="2" fill={p.outline} />
            <rect x="11" y="16" width="2" height="1" fill={p.fur} />
          </>
        )}

        {/* พร็อพถือดอกกุหลาบ 🌹 หรือหัวใจ ♥ */}
        {p.prop === 'rose' && (
          <g>
            <rect x="15" y="12" width="1" height="4" fill="#43a86b" />
            <rect x="16" y="14" width="1" height="1" fill="#43a86b" />
            <rect x="14" y="10" width="3" height="2" fill="#f43f7a" />
            <rect x="15" y="9" width="2" height="1" fill="#ff85b3" />
          </g>
        )}
        {p.prop === 'heart' && (
          <g>
            <rect x="15" y="10" width="1" height="1" fill="#ff5c9e" />
            <rect x="17" y="10" width="1" height="1" fill="#ff5c9e" />
            <rect x="15" y="11" width="3" height="1" fill="#ff5c9e" />
            <rect x="16" y="12" width="1" height="1" fill="#ff5c9e" />
          </g>
        )}
      </g>
    </svg>
  );
}

export function PixelIcon({ name = 'rose', size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`pixel-svg ${className}`}
      aria-hidden="true"
    >
      {name === 'rose' && (
        <>
          <rect x="7" y="9" width="2" height="6" fill="#3fa368" />
          <rect x="5" y="11" width="2" height="2" fill="#52c47f" />
          <rect x="9" y="10" width="2" height="2" fill="#52c47f" />
          <rect x="4" y="3" width="8" height="6" fill="#5e2b47" />
          <rect x="5" y="2" width="6" height="7" fill="#5e2b47" />
          <rect x="5" y="3" width="6" height="5" fill="#f44380" />
          <rect x="6" y="3" width="4" height="2" fill="#ff8db8" />
          <rect x="7" y="4" width="2" height="2" fill="#ffd1e3" />
          <rect x="6" y="6" width="4" height="2" fill="#d92b6b" />
        </>
      )}

      {name === 'bunny' && (
        <>
          <rect x="4" y="1" width="2" height="5" fill="#5e2b47" />
          <rect x="10" y="1" width="2" height="5" fill="#5e2b47" />
          <rect x="4" y="2" width="2" height="4" fill="#ffffff" />
          <rect x="10" y="2" width="2" height="4" fill="#ffffff" />
          <rect x="5" y="3" width="1" height="2" fill="#ff9ebb" />
          <rect x="10" y="3" width="1" height="2" fill="#ff9ebb" />
          <rect x="9" y="5" width="3" height="2" fill="#ff5c9e" />
          <rect x="3" y="6" width="10" height="8" fill="#5e2b47" />
          <rect x="2" y="7" width="12" height="6" fill="#5e2b47" />
          <rect x="4" y="7" width="8" height="6" fill="#ffffff" />
          <rect x="3" y="8" width="10" height="4" fill="#ffffff" />
          <rect x="5" y="9" width="1" height="2" fill="#5e2b47" />
          <rect x="10" y="9" width="1" height="2" fill="#5e2b47" />
          <rect x="4" y="11" width="2" height="1" fill="#ff9ebb" />
          <rect x="10" y="11" width="2" height="1" fill="#ff9ebb" />
          <rect x="7" y="10" width="2" height="1" fill="#ff5c9e" />
        </>
      )}

      {name === 'envelope' && (
        <>
          <rect x="1" y="3" width="14" height="10" fill="#5e2b47" />
          <rect x="2" y="4" width="12" height="8" fill="#fff5fa" />
          <rect x="2" y="4" width="2" height="2" fill="#ffc2db" />
          <rect x="12" y="4" width="2" height="2" fill="#ffc2db" />
          <rect x="4" y="6" width="2" height="1" fill="#ff85b3" />
          <rect x="10" y="6" width="2" height="1" fill="#ff85b3" />
          <rect x="6" y="6" width="1" height="1" fill="#f43f7a" />
          <rect x="9" y="6" width="1" height="1" fill="#f43f7a" />
          <rect x="5" y="7" width="6" height="2" fill="#f43f7a" />
          <rect x="6" y="9" width="4" height="1" fill="#f43f7a" />
          <rect x="7" y="10" width="2" height="1" fill="#f43f7a" />
        </>
      )}

      {name === 'cake' && (
        <>
          <rect x="7" y="1" width="2" height="2" fill="#ffd166" />
          <rect x="7" y="3" width="2" height="3" fill="#ff5c9e" />
          <rect x="3" y="6" width="10" height="8" fill="#5e2b47" />
          <rect x="2" y="13" width="12" height="2" fill="#5e2b47" />
          <rect x="4" y="7" width="8" height="2" fill="#ffffff" />
          <rect x="4" y="9" width="8" height="2" fill="#ffb3d1" />
          <rect x="4" y="11" width="8" height="2" fill="#fff0d9" />
          <rect x="5" y="6" width="2" height="1" fill="#f43f7a" />
          <rect x="9" y="6" width="2" height="1" fill="#f43f7a" />
        </>
      )}

      {name === 'heart' && (
        <>
          <rect x="3" y="3" width="4" height="2" fill="#5e2b47" />
          <rect x="9" y="3" width="4" height="2" fill="#5e2b47" />
          <rect x="2" y="5" width="12" height="4" fill="#5e2b47" />
          <rect x="3" y="9" width="10" height="2" fill="#5e2b47" />
          <rect x="5" y="11" width="6" height="2" fill="#5e2b47" />
          <rect x="7" y="13" width="2" height="1" fill="#5e2b47" />
          <rect x="3" y="4" width="4" height="4" fill="#ff5c9e" />
          <rect x="9" y="4" width="4" height="4" fill="#ff5c9e" />
          <rect x="4" y="6" width="8" height="4" fill="#ff5c9e" />
          <rect x="6" y="10" width="4" height="2" fill="#ff5c9e" />
          <rect x="7" y="12" width="2" height="1" fill="#ff5c9e" />
          <rect x="4" y="5" width="2" height="2" fill="#ffd6e7" />
        </>
      )}

      {name === 'ribbon' && (
        <>
          <rect x="2" y="4" width="5" height="6" fill="#5e2b47" />
          <rect x="9" y="4" width="5" height="6" fill="#5e2b47" />
          <rect x="6" y="6" width="4" height="4" fill="#5e2b47" />
          <rect x="3" y="5" width="4" height="4" fill="#c792ff" />
          <rect x="9" y="5" width="4" height="4" fill="#c792ff" />
          <rect x="7" y="6" width="2" height="3" fill="#ff7eb3" />
          <rect x="4" y="10" width="2" height="3" fill="#c792ff" />
          <rect x="10" y="10" width="2" height="3" fill="#c792ff" />
        </>
      )}

      {name === 'cloud' && (
        <>
          <rect x="5" y="4" width="6" height="2" fill="#8bc6f7" />
          <rect x="3" y="6" width="10" height="5" fill="#8bc6f7" />
          <rect x="2" y="7" width="12" height="3" fill="#8bc6f7" />
          <rect x="5" y="5" width="6" height="5" fill="#ffffff" />
          <rect x="3" y="7" width="10" height="3" fill="#ffffff" />
          <rect x="11" y="2" width="2" height="2" fill="#ffd166" />
        </>
      )}

      {name === 'carrot' && (
        <>
          <rect x="10" y="2" width="2" height="3" fill="#4eb879" />
          <rect x="12" y="3" width="2" height="2" fill="#4eb879" />
          <rect x="8" y="4" width="4" height="4" fill="#ff8c42" />
          <rect x="6" y="6" width="4" height="4" fill="#ff8c42" />
          <rect x="4" y="8" width="4" height="4" fill="#ff7024" />
          <rect x="3" y="11" width="2" height="2" fill="#ff7024" />
        </>
      )}

      {name === 'star' && (
        <>
          <rect x="7" y="1" width="2" height="3" fill="#ffc94d" />
          <rect x="6" y="4" width="4" height="2" fill="#ffc94d" />
          <rect x="1" y="6" width="14" height="2" fill="#ffc94d" />
          <rect x="3" y="8" width="10" height="2" fill="#ffc94d" />
          <rect x="4" y="10" width="8" height="1" fill="#ffc94d" />
          <rect x="3" y="11" width="4" height="2" fill="#ffc94d" />
          <rect x="9" y="11" width="4" height="2" fill="#ffc94d" />
          <rect x="2" y="13" width="3" height="1" fill="#ffc94d" />
          <rect x="11" y="13" width="3" height="1" fill="#ffc94d" />
          <rect x="7" y="5" width="2" height="2" fill="#fff3c4" />
        </>
      )}

      {name === 'sparkle' && (
        <>
          <rect x="7" y="1" width="2" height="14" fill="#ffffff" />
          <rect x="1" y="7" width="14" height="2" fill="#ffffff" />
          <rect x="6" y="5" width="4" height="6" fill="#ffffff" />
          <rect x="5" y="6" width="6" height="4" fill="#ffffff" />
          <rect x="7" y="7" width="2" height="2" fill="#ffc2da" />
        </>
      )}

      {name === 'note' && (
        <>
          <rect x="9" y="2" width="2" height="9" fill="#5e2b47" />
          <rect x="11" y="2" width="3" height="2" fill="#5e2b47" />
          <rect x="12" y="4" width="2" height="2" fill="#5e2b47" />
          <rect x="5" y="10" width="5" height="4" fill="#5e2b47" />
          <rect x="6" y="11" width="3" height="2" fill="#b98cff" />
        </>
      )}

      {name === 'gift' && (
        <>
          <rect x="5" y="1" width="2" height="3" fill="#ff5c9e" />
          <rect x="9" y="1" width="2" height="3" fill="#ff5c9e" />
          <rect x="1" y="4" width="14" height="3" fill="#5e2b47" />
          <rect x="2" y="5" width="12" height="1" fill="#ff85b3" />
          <rect x="2" y="7" width="12" height="8" fill="#5e2b47" />
          <rect x="3" y="7" width="10" height="7" fill="#ffd6e7" />
          <rect x="7" y="4" width="2" height="11" fill="#ff5c9e" />
        </>
      )}

      {name === 'facebook' && (
        <>
          <rect x="2" y="2" width="12" height="12" fill="#5e2b47" />
          <rect x="3" y="3" width="10" height="10" fill="#6aa9ff" />
          <rect x="8" y="5" width="3" height="2" fill="#ffffff" />
          <rect x="7" y="6" width="2" height="7" fill="#ffffff" />
          <rect x="6" y="8" width="4" height="2" fill="#ffffff" />
        </>
      )}

      {name === 'instagram' && (
        <>
          <rect x="2" y="2" width="12" height="12" fill="#5e2b47" />
          <rect x="3" y="3" width="10" height="10" fill="#ff7eb3" />
          <rect x="3" y="9" width="10" height="4" fill="#ffb38a" />
          <rect x="5" y="5" width="6" height="6" fill="#ffffff" />
          <rect x="6" y="6" width="4" height="4" fill="#ff5c9e" />
          <rect x="10" y="4" width="1" height="1" fill="#ffffff" />
        </>
      )}

      {name === 'tiktok' && (
        <>
          <rect x="2" y="2" width="12" height="12" fill="#5e2b47" />
          <rect x="3" y="3" width="10" height="10" fill="#4a2545" />
          <rect x="8" y="4" width="2" height="7" fill="#ffffff" />
          <rect x="10" y="5" width="2" height="2" fill="#ff5c9e" />
          <rect x="5" y="8" width="3" height="4" fill="#6ee7f5" />
          <rect x="6" y="9" width="3" height="3" fill="#ffffff" />
        </>
      )}
    </svg>
  );
}

// ภาพประกอบ Pixel Storybook สุดคิวท์สำหรับแต่ละ Chapter ในกรณีที่ผู้ใช้ยังไม่ได้วางรูปถ่ายจริง
export function TimelineChapterArt({ scene = 'birth', chapter = 1 }) {
  const configs = {
    birth: {
      bgTop: '#ffe3ef',
      bgBottom: '#fff7fb',
      badge: '01.11.2007',
      mainIcon: 'rose',
      subIcon: 'bunny',
      bunnyVariant: 'white-ribbon',
      caption: 'A LITTLE ROSE IS BORN',
    },
    audition: {
      bgTop: '#f3e5ff',
      bgBottom: '#fff4fa',
      badge: 'NEVER GIVE UP',
      mainIcon: 'heart',
      subIcon: 'rose',
      bunnyVariant: 'pink-rose',
      caption: 'CHASING THE DREAM',
    },
    gen6: {
      bgTop: '#eadbff',
      bgBottom: '#ffe6f2',
      badge: 'BNK48 6TH GEN',
      mainIcon: 'ribbon',
      subIcon: 'bunny',
      bunnyVariant: 'lavender-gen6',
      caption: 'WELCOME ROSE BNK48',
    },
    concert: {
      bgTop: '#ffd6e8',
      bgBottom: '#fff0d9',
      badge: 'CHAPTER: NEXT',
      mainIcon: 'heart',
      subIcon: 'cloud',
      bunnyVariant: 'lop-cream',
      caption: 'FIRST BIG STAGE',
    },
    debut: {
      bgTop: '#e5d4ff',
      bgBottom: '#ffd9eb',
      badge: 'DEBUT STAGE',
      mainIcon: 'rose',
      subIcon: 'ribbon',
      bunnyVariant: 'lavender-gen6',
      caption: 'DOUSHITEMO KIMI GA SUKI DA',
    },
    story: {
      bgTop: '#dceeff',
      bgBottom: '#fff0f7',
      badge: '(N)EXTENSION',
      mainIcon: 'envelope',
      subIcon: 'bunny',
      bunnyVariant: 'white-ribbon',
      caption: 'GROWING EVERY DAY',
    },
    center: {
      bgTop: '#ffd1e3',
      bgBottom: '#fff6e8',
      badge: 'FIRST CENTER',
      mainIcon: 'rose',
      subIcon: 'heart',
      bunnyVariant: 'pink-rose',
      caption: 'KIMI GA IRU DAKE DE',
    },
    ge2026: {
      bgTop: '#ffc4dd',
      bgBottom: '#efe3ff',
      badge: 'ROSE GARDEN POWER',
      mainIcon: 'heart',
      subIcon: 'rose',
      bunnyVariant: 'party-19',
      caption: 'WALKING TOGETHER',
    },
    birthday19: {
      bgTop: '#ffb8d6',
      bgBottom: '#fff3f8',
      badge: 'HAPPY 19TH HBD!',
      mainIcon: 'cake',
      subIcon: 'rose',
      bunnyVariant: 'party-19',
      caption: '19 YEARS OF ROSE ♥',
    },
  };

  const c = configs[scene] || configs.birth;

  return (
    <div
      className="tl-fallback-scene"
      style={{
        background: `linear-gradient(180deg, ${c.bgTop} 0%, ${c.bgBottom} 100%)`,
      }}
    >
      <div className="tl-scene-stars" aria-hidden="true">
        <span>✦</span>
        <span>♡</span>
        <span>✿</span>
        <span>✧</span>
      </div>
      <div className="tl-scene-badge">CH.{chapter} • {c.badge}</div>
      <div className="tl-scene-center">
        <PixelIcon name={c.mainIcon} size={46} />
        <PixelBunnySprite variant={c.bunnyVariant} frame="hop" size={68} />
        <PixelIcon name={c.subIcon} size={42} />
      </div>
      <div className="tl-scene-caption">{c.caption}</div>
    </div>
  );
}
