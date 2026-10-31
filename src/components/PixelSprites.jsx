// ==========================================
// คลังภาพ Vector & Pixel Art SVG คมกริบสำหรับทั้งเว็บไซต์ (ปลอดอิโมจิระบบ 100%)
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

        {/* พร็อพถือดอกกุหลาบ หรือหัวใจ */}
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

// ไอคอน UI Vector แบบเส้นมน/คมกริบสำหรับปุ่มและสัญลักษณ์ทั่วไป
const VECTOR_ICON_NAMES = new Set([
  'check',
  'close',
  'menu',
  'download',
  'upload',
  'search',
  'eye',
  'eye-off',
  'clock',
  'video',
  'image',
  'wand',
  'status-dot',
  'play',
  'pause',
  'volume-on',
  'volume-off',
  'camera',
  'chevron-right',
  'chevron-down',
  'chevron-up',
  'arrow-down',
  'arrow-left',
]);

export function PixelIcon({ name = 'rose', size = 24, className = '' }) {
  if (VECTOR_ICON_NAMES.has(name)) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        className={`ui-svg ${className}`}
        style={{ flexShrink: 0, verticalAlign: 'middle' }}
        aria-hidden="true"
      >
        {name === 'check' && (
          <path
            d="M4 10.5L8.2 14.5L16 6"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {name === 'close' && (
          <path
            d="M5 5L15 15M15 5L5 15"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {name === 'menu' && (
          <path
            d="M3.5 5.5H16.5M3.5 10H16.5M3.5 14.5H16.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}

        {name === 'download' && (
          <>
            <path
              d="M10 3.5V12.5M10 12.5L6.5 9M10 12.5L13.5 9"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 15.5H16"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </>
        )}

        {name === 'upload' && (
          <>
            <path
              d="M10 12.5V4M10 4L6.5 7.5M10 4L13.5 7.5"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 15.5H16"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </>
        )}

        {name === 'search' && (
          <>
            <circle
              cx="9"
              cy="9"
              r="5.2"
              stroke="currentColor"
              strokeWidth="2.2"
            />
            <path
              d="M13 13L16.5 16.5"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </>
        )}

        {name === 'eye' && (
          <>
            <path
              d="M2.2 10C3.8 6.4 6.6 4.6 10 4.6C13.4 4.6 16.2 6.4 17.8 10C16.2 13.6 13.4 15.4 10 15.4C6.6 15.4 3.8 13.6 2.2 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="10" r="2.4" fill="currentColor" />
          </>
        )}

        {name === 'eye-off' && (
          <>
            <path
              d="M3 10C4.5 6.8 7.1 5 10 5C12.9 5 15.5 6.8 17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3.5 4L16.5 16"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        )}

        {name === 'clock' && (
          <>
            <circle
              cx="10"
              cy="10"
              r="6.8"
              stroke="currentColor"
              strokeWidth="2.1"
            />
            <path
              d="M10 6.2V10.2L12.8 11.8"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {name === 'video' && (
          <>
            <rect
              x="2.5"
              y="5"
              width="10.5"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M13 8.5L17.5 6V14L13 11.5V8.5Z"
              fill="currentColor"
            />
          </>
        )}

        {name === 'image' && (
          <>
            <rect
              x="3"
              y="4"
              width="14"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="7.5" cy="8" r="1.5" fill="currentColor" />
            <path
              d="M4 14.5L8.5 10.5L12 13.5L14.5 11.5L16.5 14.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {name === 'wand' && (
          <>
            <path
              d="M4 16L13.5 6.5"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            <path
              d="M14.5 2.5V5.5M13 4H16M6.5 3.5V5.5M5.5 4.5H7.5M15.5 10.5V12.5M14.5 11.5H16.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </>
        )}

        {name === 'status-dot' && (
          <>
            <circle cx="10" cy="10" r="6" fill="#4bc47d" opacity="0.28" />
            <circle cx="10" cy="10" r="3.8" fill="#2ea862" />
          </>
        )}

        {name === 'play' && (
          <path
            d="M6 4.2L15.8 10L6 15.8V4.2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        )}

        {name === 'pause' && (
          <>
            <rect x="5.2" y="4.2" width="3.4" height="11.6" rx="1" fill="currentColor" />
            <rect x="11.4" y="4.2" width="3.4" height="11.6" rx="1" fill="currentColor" />
          </>
        )}

        {name === 'volume-on' && (
          <>
            <path
              d="M3.5 8H6.8L11 4.5V15.5L6.8 12H3.5V8Z"
              fill="currentColor"
            />
            <path
              d="M13.8 7.2C14.8 8.2 15.3 9.1 15.3 10C15.3 10.9 14.8 11.8 13.8 12.8M15.8 5.2C17.4 6.7 18.1 8.3 18.1 10C18.1 11.7 17.4 13.3 15.8 14.8"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </>
        )}

        {name === 'volume-off' && (
          <>
            <path
              d="M3.5 8H6.8L11 4.5V15.5L6.8 12H3.5V8Z"
              fill="currentColor"
            />
            <path
              d="M13.5 7.5L17.5 12.5M17.5 7.5L13.5 12.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </>
        )}

        {name === 'camera' && (
          <>
            <rect
              x="2.5"
              y="6"
              width="15"
              height="10.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.9"
            />
            <path
              d="M6.8 6L8 4H12L13.2 6"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <circle
              cx="10"
              cy="11.2"
              r="2.6"
              stroke="currentColor"
              strokeWidth="1.9"
            />
          </>
        )}

        {name === 'chevron-right' && (
          <path
            d="M7.5 4.5L13 10L7.5 15.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {name === 'chevron-down' && (
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {name === 'chevron-up' && (
          <path
            d="M5 12.5L10 7.5L15 12.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {name === 'arrow-down' && (
          <path
            d="M10 4V15.5M10 15.5L5.5 11M10 15.5L14.5 11"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {name === 'arrow-left' && (
          <path
            d="M16 10H4.5M4.5 10L9 5.5M4.5 10L9 14.5"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`pixel-svg ${className}`}
      style={{ flexShrink: 0, verticalAlign: 'middle' }}
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

      {name === 'heart-purple' && (
        <>
          <rect x="3" y="3" width="4" height="2" fill="#522b5e" />
          <rect x="9" y="3" width="4" height="2" fill="#522b5e" />
          <rect x="2" y="5" width="12" height="4" fill="#522b5e" />
          <rect x="3" y="9" width="10" height="2" fill="#522b5e" />
          <rect x="5" y="11" width="6" height="2" fill="#522b5e" />
          <rect x="7" y="13" width="2" height="1" fill="#522b5e" />
          <rect x="3" y="4" width="4" height="4" fill="#9f67ff" />
          <rect x="9" y="4" width="4" height="4" fill="#9f67ff" />
          <rect x="4" y="6" width="8" height="4" fill="#9f67ff" />
          <rect x="6" y="10" width="4" height="2" fill="#9f67ff" />
          <rect x="7" y="12" width="2" height="1" fill="#9f67ff" />
          <rect x="4" y="5" width="2" height="2" fill="#eadbff" />
        </>
      )}

      {name === 'leaf' && (
        <>
          <rect x="9" y="2" width="4" height="2" fill="#3a7d56" />
          <rect x="6" y="3" width="7" height="3" fill="#3a7d56" />
          <rect x="4" y="5" width="8" height="4" fill="#3a7d56" />
          <rect x="4" y="8" width="6" height="3" fill="#3a7d56" />
          <rect x="7" y="3" width="5" height="2" fill="#6fd496" />
          <rect x="5" y="5" width="6" height="3" fill="#6fd496" />
          <rect x="5" y="8" width="4" height="2" fill="#52b87a" />
          <rect x="6" y="6" width="2" height="2" fill="#b8f2cd" />
          <rect x="3" y="11" width="2" height="2" fill="#3a7d56" />
          <rect x="2" y="12" width="2" height="2" fill="#3a7d56" />
        </>
      )}

      {name === 'book' && (
        <>
          <rect x="2" y="3" width="12" height="10" fill="#5e2b47" />
          <rect x="3" y="4" width="4" height="8" fill="#fff5fa" />
          <rect x="9" y="4" width="4" height="8" fill="#ffe3ef" />
          <rect x="7" y="4" width="2" height="9" fill="#f44380" />
          <rect x="4" y="6" width="2" height="1" fill="#c98aa8" />
          <rect x="4" y="8" width="2" height="1" fill="#c98aa8" />
          <rect x="10" y="6" width="2" height="1" fill="#c98aa8" />
          <rect x="10" y="8" width="2" height="1" fill="#c98aa8" />
        </>
      )}

      {name === 'food' && (
        <>
          {/* ซูชิแซลมอน/ข้าวปั้นสไตล์พิกเซล */}
          <rect x="3" y="4" width="10" height="3" fill="#5e2b47" />
          <rect x="2" y="6" width="12" height="6" fill="#5e2b47" />
          <rect x="3" y="5" width="10" height="3" fill="#ff7d59" />
          <rect x="5" y="5" width="2" height="2" fill="#ffd2c2" />
          <rect x="9" y="5" width="2" height="2" fill="#ffd2c2" />
          <rect x="3" y="8" width="10" height="3" fill="#ffffff" />
          <rect x="7" y="4" width="2" height="8" fill="#375c47" />
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

// ภาพประกอบ Pixel Storybook สำหรับแต่ละ Chapter ในกรณีที่ยังไม่ได้วางรูปถ่ายจริง
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
      caption: '19TH BLOOMING ROSE',
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
        <span>
          <PixelIcon name="sparkle" size={14} />
        </span>
        <span>
          <PixelIcon name="heart" size={13} />
        </span>
        <span>
          <PixelIcon name="star" size={14} />
        </span>
        <span>
          <PixelIcon name="sparkle" size={14} />
        </span>
      </div>
      <div className="tl-scene-badge">
        CH.{chapter} · {c.badge}
      </div>
      <div className="tl-scene-center">
        <PixelIcon name={c.mainIcon} size={46} />
        <PixelBunnySprite variant={c.bunnyVariant} frame="hop" size={68} />
        <PixelIcon name={c.subIcon} size={42} />
      </div>
      <div className="tl-scene-caption">{c.caption}</div>
    </div>
  );
}
