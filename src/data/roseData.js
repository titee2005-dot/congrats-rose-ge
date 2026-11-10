// ==========================================
// ข้อมูลหลักของเว็บแสดงความยินดี Rose BNK48 — General Election Celebration
// ธีม: Royal Rose & Pixel Bunny Victory Garden (#CongratsRoseBNK48)
// ข้อมูลแยกขาดจากเว็บวันเกิด 100%
// ==========================================

export const ROSE_PROFILE = {
  nicknameEn: 'Rose',
  nicknameTh: 'โรส',
  fullNameTh: 'ปาณิสรา บูรณาภา',
  fullNameEn: 'Panisara Buranapha',
  group: 'BNK48 6th Generation',
  status: 'BNK48 Shining Idol',
  birthDateISO: '2007-11-01',
  birthDateDisplay: '01.11.2007',
  birthDateThai: '1 พฤศจิกายน 2550',
  debutDateISO: '2025-05-31T00:00:00+07:00',
  debutDateDisplay: '31.05.2025',
  celebrationTitle: 'BNK48 & CGM48 General Election',
  hometown: 'นครปฐม',
  height: '167 cm',
  bloodGroup: 'B',
  favorites: [
    { text: 'กระต่าย น้องแมว และน้องหมา', icon: 'bunny' },
    { text: 'แต่งนิยาย & อ่านเรื่องราวสนุก ๆ', icon: 'book' },
    { text: 'อาหารญี่ปุ่น ปิ้งย่าง และส้มตำ', icon: 'food' },
    { text: 'ดูซีรีส์ เล่นเกม และช็อปปิ้ง', icon: 'ribbon' },
  ],
  hashtags: ['#CongratsRoseBNK48', '#RoseBNK48', '#BNK486thGen'],
};

// ==========================================
// ตั้งค่ามีเดียช่อง Rose Victory Stage (วางไฟล์วิดีโอในโค้ด หรือตั้งค่าผ่านหน้า /admin ได้)
// ==========================================
export const ROSE_PARTY_MEDIA = {
  defaultVideoUrl:
    'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/rose_party_19th.mp4',
  posterUrl: '',
};

// ==========================================
// ข้อมูลป้ายประกาศรางวัล & ความสำเร็จ General Election (แก้ไขผ่านหน้า /admin ได้)
// ==========================================
export const DEFAULT_GE_MILESTONE = {
  eventTitle: 'BNK48 & CGM48 General Election',
  rankBadge: 'SHINING ROSE OF GE',
  rankNumber: 'GE',
  imageUrl: '',
  unitTitle: 'Rose Garden Victory Milestone',
  voteScore: 'พลังรักจากสวนกุหลาบ',
  quote:
    'ทุกคะแนนโหวตและทุกข้อความจากสวนกุหลาบ คือดอกไม้ที่ทำให้โรสเปล่งประกายบนเวทีแห่งความฝัน ขอบคุณที่สู้ไปด้วยกันในทุกก้าวนะคะ',
  goalTarget: 500,
};

export const GE_MILESTONE_BADGES = [
  {
    id: 'prelim-star',
    icon: 'trophy',
    tone: 'butter',
    tag: 'MILESTONE 01',
    title: 'Rising Star in General Election',
    desc: 'สร้างปรากฏการณ์ความประทับใจตั้งแต่ผลด่วนด้วยพลังซัพพอร์ตจากแฟนคลับ',
  },
  {
    id: 'garden-unity',
    icon: 'bouquet',
    tone: 'pink',
    tag: 'MILESTONE 02',
    title: 'Power of Rose Garden',
    desc: 'หัวใจทุกดวงของชาวสวนกุหลาบที่รวมพลังโหวตและส่งกำลังใจเคียงข้างโรส',
  },
  {
    id: 'center-shine',
    icon: 'crown',
    tone: 'lavender',
    tag: 'MILESTONE 03',
    title: 'Shining 6th Generation Pride',
    desc: 'เติบโตอย่างสง่างามจากแคนดิเดตสู่น้องโรสที่เปล่งประกายบนทุกเวที',
  },
  {
    id: 'never-give-up',
    icon: 'medal',
    tone: 'mint',
    tag: 'MILESTONE 04',
    title: 'Effort Never Betrays',
    desc: 'ความพยายามที่ไม่เคยทรยศใคร ผลิบานเป็นความภูมิใจของพวกเราทุกคน',
  },
];

// ==========================================
// ซุ้มส่งช่อดอกไม้และของขวัญฉลอง (Interactive Cheer Pavilion)
// ==========================================
export const DEFAULT_CHEER_STATS = {
  bouquet: 19,
  crown: 12,
  trophy: 15,
  carrot: 24,
};

export const CHEER_ITEMS = [
  {
    key: 'bouquet',
    label: 'ส่งช่อกุหลาบ',
    sub: 'Rose Bouquet',
    icon: 'bouquet',
    tone: 'pink',
    accent: '#e64980',
  },
  {
    key: 'crown',
    label: 'มอบมงกุฎคนเก่ง',
    sub: 'Golden Crown',
    icon: 'crown',
    tone: 'butter',
    accent: '#d98a00',
  },
  {
    key: 'trophy',
    label: 'ชูถ้วยรางวัล',
    sub: 'Victory Trophy',
    icon: 'trophy',
    tone: 'lavender',
    accent: '#8558b5',
  },
  {
    key: 'carrot',
    label: 'เลี้ยงแครอทกระต่าย',
    sub: 'Bunny Treat',
    icon: 'carrot',
    tone: 'mint',
    accent: '#3a8f5e',
  },
];

// คำนวณจำนวนกระต่ายตามจำนวนการ์ดที่อนุมัติแล้ว (1–7 ใบ = 1 ตัว ... สูงสุด 5 ตัว)
export function computeAutoBunnyCount(wishCount = 0) {
  const n = Math.max(0, Number(wishCount) || 0);
  if (n <= 7) return 1;
  return Math.min(5, Math.ceil(n / 7));
}

// ==========================================
// 6 ดีไซน์การ์ดแสดงความยินดี (Congratulations Card Themes)
// ==========================================
export const CARD_THEMES = [
  {
    id: 'royal-rose',
    name: 'Royal Rose Victory',
    sub: 'Royal Rose Letter',
    variant: 'wax-letter',
    accent: '#c94a76',
    softBg: '#fff8fa',
    headerTone: '#f8cddc',
    borderTone: '#eab3c7',
    tapeTone: 'pink-plaid',
    sealText: 'CONGRATS',
    iconName: 'bouquet',
  },
  {
    id: 'bunny-crown',
    name: 'Bunny Crown Note',
    sub: 'Bunny Crown Note',
    variant: 'ribbon-polaroid',
    accent: '#df5c8e',
    softBg: '#fffdf9',
    headerTone: '#ffdbe9',
    borderTone: '#f2bed2',
    tapeTone: 'rose-dot',
    sealText: 'CROWN',
    iconName: 'crown',
  },
  {
    id: 'victory-airmail',
    name: 'Victory Express Postcard',
    sub: 'Victory Express Postcard',
    variant: 'airmail',
    accent: '#b84a6e',
    softBg: '#fdfaf5',
    headerTone: '#f4d5de',
    borderTone: '#d9b8c4',
    tapeTone: 'sage-stripe',
    sealText: 'VICTORY',
    iconName: 'envelope',
  },
  {
    id: 'starlight-diary',
    name: 'Starlight GE Diary',
    sub: 'Starlight GE Diary',
    variant: 'grid-diary',
    accent: '#8558b5',
    softBg: '#fcf9ff',
    headerTone: '#e5d4fa',
    borderTone: '#cbb3eb',
    tapeTone: 'lavender-check',
    sealText: 'SHINING',
    iconName: 'heart-purple',
  },
  {
    id: 'golden-trophy',
    name: 'Golden Trophy Ribbon',
    sub: 'Golden Trophy Ribbon',
    variant: 'tea-frame',
    accent: '#cf7132',
    softBg: '#fffcf5',
    headerTone: '#ffe8b8',
    borderTone: '#f0cf8e',
    tapeTone: 'pink-plaid',
    sealText: 'TROPHY',
    iconName: 'trophy',
  },
  {
    id: 'blooming-medal',
    name: 'Blooming Garden Medal',
    sub: 'Blooming Garden Medal',
    variant: 'botanical',
    accent: '#59876b',
    softBg: '#f9fcf9',
    headerTone: '#d8eadc',
    borderTone: '#b4d4bd',
    tapeTone: 'sage-stripe',
    sealText: 'PROUD',
    iconName: 'medal',
  },
];

// รองรับทั้ง id ใหม่ และ id เดิมทั้งหมด
export function resolveCardTheme(bgValue) {
  if (!bgValue) return CARD_THEMES[0];
  const direct = CARD_THEMES.find((t) => t.id === bgValue);
  if (direct) return direct;

  const legacyMap = {
    'pressed-rose': CARD_THEMES[0],
    'bunny-polaroid': CARD_THEMES[1],
    'vintage-airmail': CARD_THEMES[2],
    'lavender-note': CARD_THEMES[3],
    'tea-party': CARD_THEMES[4],
    'sage-botanical': CARD_THEMES[5],
    'rose-garden': CARD_THEMES[0],
    'rollzy-bunny': CARD_THEMES[1],
    'pixel-mail': CARD_THEMES[2],
    'sweet-lavender': CARD_THEMES[3],
    'strawberry-cake': CARD_THEMES[4],
    'cotton-sky': CARD_THEMES[5],
  };

  return legacyMap[bgValue] || CARD_THEMES[0];
}

// ==========================================
// 6 ตราประทับและสติกเกอร์เกียรติยศบนการ์ด (Stamp & Badge Sticker)
// ==========================================
export const CARD_STAMPS = [
  {
    id: 'crown-gold',
    label: 'Golden Crown',
    titleTh: 'มงกุฎคนเก่ง',
    code: 'OUR QUEEN',
    icon: 'crown',
    bg: '#fff3bf',
    border: '#f59f00',
    color: '#8a5200',
  },
  {
    id: 'trophy-star',
    label: 'Victory Trophy',
    titleTh: 'ถ้วยรางวัลภูมิใจ',
    code: 'SO PROUD',
    icon: 'trophy',
    bg: '#ffe3ef',
    border: '#e64980',
    color: '#8a234b',
  },
  {
    id: 'rose-bouquet',
    label: 'Rose Bouquet',
    titleTh: 'ช่อกุหลาบฉลอง',
    code: 'FULL BLOOM',
    icon: 'bouquet',
    bg: '#ffdbe9',
    border: '#d6336c',
    color: '#7a1c40',
  },
  {
    id: 'medal-no1',
    label: 'Honor Medal',
    titleTh: 'เหรียญแห่งความพยายาม',
    code: 'BEST EFFORT',
    icon: 'medal',
    bg: '#ece3ff',
    border: '#845ef7',
    color: '#492b8c',
  },
  {
    id: 'bunny-cheer',
    label: 'Cheer Bunny',
    titleTh: 'กระต่ายส่งใจ',
    code: 'WITH ROSE',
    icon: 'bunny',
    bg: '#fff0f6',
    border: '#ff6b9d',
    color: '#7a2848',
  },
  {
    id: 'wing-star',
    label: 'Shining Wings',
    titleTh: 'ติดปีกโบยบิน',
    code: 'FLY HIGH',
    icon: 'wing',
    bg: '#dff5e8',
    border: '#40916c',
    color: '#1b4332',
  },
];

export function resolveCardStamp(stampId) {
  if (!stampId) return CARD_STAMPS[0];
  return CARD_STAMPS.find((s) => s.id === stampId) || CARD_STAMPS[0];
}

// ==========================================
// บันทึกเส้นทางสู่ความสำเร็จทั้ง 9 บท (Victory Timeline)
// ==========================================
export const ROSE_TIMELINE = [
  {
    chapter: 1,
    seasonLabel: 'Milestone 01',
    date: '1 November 2007',
    title: 'จุดเริ่มต้นของเมล็ดพันธุ์ดอกกุหลาบ',
    body: '“โรส — ปาณิสรา บูรณาภา” ลืมตาดูโลก ณ จังหวัดนครปฐม พร้อมความฝันอันยิ่งใหญ่ที่จะก้าวขึ้นเป็นศิลปินที่ส่งต่อรอยยิ้มและความสุขให้ทุกคน',
    polaroidNote: 'Baby Rose · Nakhon Pathom',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch1_1793503643189.jpeg',
    scene: 'seed',
    tape: 'pink-plaid',
    bloomCount: 1,
    bloomText: 'Seed of Dream',
  },
  {
    chapter: 2,
    seasonLabel: 'Milestone 02',
    date: 'May 2025',
    title: 'หัวใจที่ไม่เคยยอมแพ้ — แคนดิเดต BNK48 รุ่นที่ 6',
    body: 'ถึงแม้จะผ่านบททดสอบจากการออดิชันหลายครั้ง แต่โรสก็ยังลุกขึ้นสู้ต่อไปจนกลายเป็น Candidates รุ่นที่ 6 พิสูจน์ให้เห็นถึงความมุ่งมั่นที่ไม่เคยลดลง',
    polaroidNote: 'Candidate NO.1054',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch2_1793501954479.jpeg',
    scene: 'sprout',
    tape: 'sage-stripe',
    bloomCount: 2,
    bloomText: 'Growing Courage',
  },
  {
    chapter: 3,
    seasonLabel: 'Milestone 03',
    date: '31 May 2025',
    title: 'เปิดตัวสมาชิก BNK48 รุ่นที่ 6 อย่างเป็นทางการ',
    body: 'จุดเริ่มต้นอย่างเป็นทางการของ Rose BNK48 ความพยายามที่ไม่เคยทรยศใครพาโรสก้าวขึ้นสู่เวทีในฐานะไอดอลเต็มตัว',
    polaroidNote: 'Effort Does Not Betray',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch3_1793502018036.jpeg',
    scene: 'ribbon',
    tape: 'lavender-check',
    bloomCount: 2,
    bloomText: 'Budding Idol',
  },
  {
    chapter: 4,
    seasonLabel: 'Milestone 04',
    date: '23 August 2025',
    title: 'CHAPTER: NEXT — คอนเสิร์ตใหญ่ครั้งแรกในชีวิต',
    body: 'เวทีคอนเสิร์ตใหญ่ที่เปิดโอกาสให้โรสได้เปล่งประกายเคียงข้างรุ่นพี่และเพื่อน ๆ ทุกหยาดเหงื่อจากการซ้อมกลายเป็นพลังที่ส่งถึงแฟนคลับ',
    polaroidNote: 'CHAPTER: NEXT',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch4_1793503071982.jpeg',
    scene: 'stage',
    tape: 'rose-dot',
    bloomCount: 3,
    bloomText: 'First Big Stage',
  },
  {
    chapter: 5,
    seasonLabel: 'Milestone 05',
    date: '11 October 2025',
    title: 'BNK48 6th Generation Debut Stage',
    body: 'สเตจเดบิวต์อย่างเป็นทางการที่ MBK Center กับเพลง “Doushitemo Kimi ga Suki da (จะยังไงก็รักเธอ)” ก้าวสำคัญที่ทำให้ทุกคนหลงรักรอยยิ้มของโรส',
    polaroidNote: 'Doushitemo Kimi ga Suki da',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch5_1793503160845.jpeg',
    scene: 'debut',
    tape: 'pink-plaid',
    bloomCount: 3,
    bloomText: 'Blooming Debut',
  },
  {
    chapter: 6,
    seasonLabel: 'Milestone 06',
    date: 'January 2026',
    title: '(N)EXTENSION — เรื่องราวเบื้องหลังการเติบโต',
    body: 'สารคดีที่พาแฟนคลับไปสัมผัสตัวตนและความตั้งใจของโรสให้ลึกซึ้งยิ่งขึ้น ทั้งความอ่อนโยนและหัวใจที่พร้อมพัฒนาตัวเองเสมอ',
    polaroidNote: 'Documentary Story',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch6_1793503277973.jpeg',
    scene: 'diary',
    tape: 'sage-stripe',
    bloomCount: 4,
    bloomText: 'Heartfelt Story',
  },
  {
    chapter: 7,
    seasonLabel: 'Milestone 07',
    date: 'March 2026',
    title: 'Center เพลงพิเศษ “แค่เพียงมีเธอ (Kimi ga Iru Dake de)”',
    body: 'ความทรงจำสุดภูมิใจกับการยืนตำแหน่ง Center ในโปรเจกต์พิเศษ Collaboration ไทย–ญี่ปุ่น ถ่ายทอดเสน่ห์และเสียงร้องที่อบอุ่นหัวใจ',
    polaroidNote: 'Shining Center Position',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch7_1793503378228.jpeg',
    scene: 'center',
    tape: 'rose-dot',
    bloomCount: 4,
    bloomText: 'Radiant Center',
  },
  {
    chapter: 8,
    seasonLabel: 'Milestone 08',
    date: 'October 2026',
    title: 'First Preliminary Results — พลังรักจากสวนกุหลาบ',
    body: 'แรงซัพพอร์ตจากแฟนคลับทุกคนที่ร่วมแรงร่วมใจสร้างโมเมนต์สุดประทับใจในการประกาศผลด่วน ก้าวแรกที่งดงามบนสมรภูมิ General Election!',
    polaroidNote: 'Thank You GARDENs!',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch8_1793503428608.jpeg',
    scene: 'bouquet',
    tape: 'lavender-check',
    bloomCount: 5,
    bloomText: 'Garden of Love',
  },
  {
    chapter: 9,
    seasonLabel: 'Victory Finale',
    date: 'General Election 2026',
    title: 'Congratulations Rose! — ชัยชนะแห่งความพยายามและสวนกุหลาบ',
    body: 'ขอแสดงความยินดีกับโรสในงาน General Election! ทุกหยาดเหงื่อของโรสและทุกพลังโหวตจากแฟนคลับได้ผลิบานเป็นความสำเร็จที่น่าภาคภูมิใจที่สุด พวกเราจะเดินเคียงข้างโรสต่อไปในทุกเส้นทางนะ!',
    polaroidNote: 'Congratulations Our Shining Rose!',
    img: 'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/timeline_ch9_1793503787742.jpeg',
    scene: 'victory',
    tape: 'pink-plaid',
    bloomCount: 5,
    bloomText: 'GE Victory Bloom',
  },
];

// ==========================================
// ช่องทางการติดตาม Official ของ Rose BNK48
// ==========================================
export const ROSE_SOCIALS = [
  {
    key: 'instagram',
    platform: 'Instagram',
    handle: '@rose.bnk48office',
    href: 'https://www.instagram.com/rose.bnk48office/',
  },
  {
    key: 'facebook',
    platform: 'Facebook',
    handle: 'Rose BNK48',
    href: 'https://www.facebook.com/rose.bnk48official',
  },
  {
    key: 'tiktok',
    platform: 'TikTok',
    handle: '@rose.bnk48official',
    href: 'https://www.tiktok.com/@rose.bnk48official',
  },
];

// ==========================================
// การ์ดแสดงความยินดีตัวอย่างสำหรับโหมด Local (แยกจากเว็บวันเกิด)
// ==========================================
export const INITIAL_DEMO_WISHES = [
  {
    id: 201,
    bg: 'royal-rose',
    stamp: 'crown-gold',
    name: 'ชาวสวนกุหลาบของโรส',
    message:
      'ขอแสดงความยินดีกับน้องโรสสำหรับความสำเร็จในงาน General Election ครั้งนี้ด้วยนะ! ขอบคุณที่ตั้งใจซ้อมและสู้อย่างเต็มที่มาตลอด พวกเราภูมิใจในตัวโรสที่สุดเลย จะคอยซัพพอร์ตโรสในทุกก้าวต่อไปนะ!',
    img: '',
    likes: 19,
    is_featured: true,
    status: 'approved',
    created_at: '2026-11-10T00:12:00+07:00',
  },
  {
    id: 202,
    bg: 'bunny-crown',
    stamp: 'trophy-star',
    name: 'BunnyGuard48',
    message:
      'Congratulations นะคะคนเก่ง! ทุกหยาดเหงื่อและความพยายามของโรสไม่เคยทรยศเลยจริง ๆ ดีใจที่ได้ร่วมเดินทางและโหวตให้โรสใน GE ครั้งนี้นะ เปล่งประกายบนเวทีให้เต็มที่เลยน้า~',
    img: '',
    likes: 14,
    is_featured: true,
    status: 'approved',
    created_at: '2026-11-10T00:08:00+07:00',
  },
  {
    id: 203,
    bg: 'golden-trophy',
    stamp: 'rose-bouquet',
    name: 'RoseGarden_OfficialFan',
    message:
      'ส่งช่อดอกกุหลาบและการ์ดใบนี้มาแสดงความยินดีนะโรส เก่งมาก ๆ เลย ขอบคุณที่เป็นรอยยิ้มและพลังบวกให้พวกเราเสมอ ขอให้เส้นทางข้างหน้าของโรสโรยด้วยกลีบกุหลาบและความสุขนะ!',
    img: '',
    likes: 11,
    is_featured: false,
    status: 'approved',
    created_at: '2026-11-10T00:05:00+07:00',
  },
];

// ==========================================
// เพลย์ลิสต์เพลงฉลองความสำเร็จของ Rose BNK48
// ==========================================
export const ROSE_PLAYLIST = [
  {
    id: 'kimi-ga-suki',
    title: 'จะยังไงก็รักเธอ (Doushitemo Kimi ga Suki da)',
    youtubeId: 'CDSCbCJRdQM',
    audioUrl: '',
  },
  {
    id: 'kimi-iru',
    title: 'แค่เพียงมีเธอ (Kimi ga Iru Dake de)',
    youtubeId: 'ijhKKAgQggY',
    audioUrl: '',
  },
  {
    id: 'ram-wong-matsuri',
    title: 'รำวง Matsuri',
    youtubeId: 'I3kkyB-GVm8',
    audioUrl: '',
  },
  {
    id: 'aisuru-hito',
    title: 'เธอ (Aisuru Hito)',
    youtubeId: 'T05XirvPIx0',
    audioUrl: '',
  },
];
