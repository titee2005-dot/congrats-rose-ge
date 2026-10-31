// ==========================================
// ข้อมูลหลักของเว็บวันเกิดครบ 19 ปี Rose BNK48 (ปาณิสรา บูรณาภา)
// ธีม: Pastel Pixel Bunny Garden (#19thBloomingRose)
// ==========================================

export const ROSE_PROFILE = {
  nicknameEn: 'Rose',
  nicknameTh: 'โรส',
  fullNameTh: 'ปาณิสรา บูรณาภา',
  fullNameEn: 'Panisara Buranapha',
  group: 'BNK48 6th Generation',
  status: 'BNK48 Trainee',
  birthDateISO: '2007-11-01',
  birthDateDisplay: '01.11.2007',
  birthDateThai: '1 พฤศจิกายน 2550',
  celebrationDateDisplay: '01.11.2026',
  celebrationISO: '2026-11-01T00:00:00+07:00',
  hometown: 'นครปฐม',
  height: '167 cm',
  bloodGroup: 'B',
  favorites: [
    { text: 'กระต่าย น้องแมว และน้องหมา', icon: 'bunny' },
    { text: 'แต่งนิยาย & อ่านเรื่องราวสนุก ๆ', icon: 'book' },
    { text: 'อาหารญี่ปุ่น ปิ้งย่าง และส้มตำ', icon: 'food' },
    { text: 'ดูซีรีส์ เล่นเกม และช็อปปิ้ง', icon: 'ribbon' },
  ],
  hashtags: ['#19thBloomingRose', '#RoseBNK48', '#BNK486thGen'],
};

// ==========================================
// ตั้งค่ามีเดียช่อง Rose Birthday Party (วางไฟล์วิดีโอในโค้ด หรือตั้งค่าผ่านหน้า /admin ได้)
// ==========================================
export const ROSE_PARTY_MEDIA = {
  // วิดีโอวันเกิด Rose BNK48 (สามารถเปลี่ยนหรืออัปโหลดใหม่ผ่านหน้า /admin ได้ตลอดเวลา)
  defaultVideoUrl:
    'https://ctimhxkwpzsebodbtptx.supabase.co/storage/v1/object/public/rose-party-media/rose_party_19th.mp4',
  posterUrl: '',
};

// คำนวณจำนวนกระต่ายตามจำนวนคำอวยพรที่อนุมัติแล้ว:
// การ์ด 7 ใบต่อกระต่าย 1 ตัว (1–7 ใบ = 1 ตัว, 8–14 = 2 ตัว, 15–21 = 3 ตัว, 22–28 = 4 ตัว, 29+ = 5 ตัว) สูงสุด 5 ตัว
export function computeAutoBunnyCount(wishCount = 0) {
  const n = Math.max(0, Number(wishCount) || 0);
  if (n <= 7) return 1;
  return Math.min(5, Math.ceil(n / 7));
}

// ==========================================
// 6 ดีไซน์การ์ดโปสการ์ดและสมุดภาพให้แฟนคลับเลือก (ใช้ไอคอน Vector SVG ทั้งหมด)
// ==========================================
export const CARD_THEMES = [
  {
    id: 'pressed-rose',
    name: 'Pressed Rose Letter',
    sub: 'Pressed Rose Letter',
    variant: 'wax-letter',
    accent: '#c94a76',
    softBg: '#fff8fa',
    headerTone: '#f8cddc',
    borderTone: '#eab3c7',
    tapeTone: 'pink-plaid',
    sealText: 'Rose',
    iconName: 'rose',
  },
  {
    id: 'bunny-polaroid',
    name: 'Bunny Ribbon Note',
    sub: 'Bunny Ribbon Note',
    variant: 'ribbon-polaroid',
    accent: '#df5c8e',
    softBg: '#fffdf9',
    headerTone: '#ffdbe9',
    borderTone: '#f2bed2',
    tapeTone: 'rose-dot',
    sealText: 'BUNNY',
    iconName: 'bunny',
  },
  {
    id: 'vintage-airmail',
    name: 'Rose Garden Postcard',
    sub: 'Rose Garden Postcard',
    variant: 'airmail',
    accent: '#b84a6e',
    softBg: '#fdfaf5',
    headerTone: '#f4d5de',
    borderTone: '#d9b8c4',
    tapeTone: 'sage-stripe',
    sealText: 'POST',
    iconName: 'envelope',
  },
  {
    id: 'lavender-note',
    name: 'Wisteria Diary Page',
    sub: 'Wisteria Diary Page',
    variant: 'grid-diary',
    accent: '#8558b5',
    softBg: '#fcf9ff',
    headerTone: '#e5d4fa',
    borderTone: '#cbb3eb',
    tapeTone: 'lavender-check',
    sealText: 'GEN6',
    iconName: 'heart-purple',
  },
  {
    id: 'tea-party',
    name: 'Sweet 19 Tea Party',
    sub: 'Sweet 19 Tea Party',
    variant: 'tea-frame',
    accent: '#cf6178',
    softBg: '#fffaf6',
    headerTone: '#fdd9ce',
    borderTone: '#f0bcae',
    tapeTone: 'pink-plaid',
    sealText: '19TH',
    iconName: 'cake',
  },
  {
    id: 'sage-botanical',
    name: 'Botanical Greenhouse',
    sub: 'Botanical Greenhouse',
    variant: 'botanical',
    accent: '#59876b',
    softBg: '#f9fcf9',
    headerTone: '#d8eadc',
    borderTone: '#b4d4bd',
    tapeTone: 'sage-stripe',
    sealText: 'BLOOM',
    iconName: 'leaf',
  },
];

// รองรับทั้ง id ใหม่ และ id/hex เดิมทั้งหมด
export function resolveCardTheme(bgValue) {
  if (!bgValue) return CARD_THEMES[0];
  const direct = CARD_THEMES.find((t) => t.id === bgValue);
  if (direct) return direct;

  const legacyMap = {
    'rose-garden': CARD_THEMES[0],
    'rollzy-bunny': CARD_THEMES[1],
    'pixel-mail': CARD_THEMES[2],
    'sweet-lavender': CARD_THEMES[3],
    'strawberry-cake': CARD_THEMES[4],
    'cotton-sky': CARD_THEMES[5],
    '#ffd9ea': CARD_THEMES[0],
    '#ffe0ed': CARD_THEMES[1],
    '#e8dcff': CARD_THEMES[3],
    '#fff0d5': CARD_THEMES[4],
    '#dcecff': CARD_THEMES[5],
  };

  return legacyMap[bgValue] || CARD_THEMES[0];
}

// ==========================================
// บันทึกการผลิบานทั้ง 9 ความทรงจำ (Timeline)
// วางรูปจริงของโรสได้ที่ public/assets/timeline/ch1.jpg ถึง ch9.jpg
// ==========================================
export const ROSE_TIMELINE = [
  {
    chapter: 1,
    seasonLabel: 'Memory 01',
    date: '1 November 2007',
    title: 'วันที่เมล็ดพันธุ์ดอกกุหลาบถือกำเนิด',
    body: 'จุดเริ่มต้นของเรื่องราวแสนอบอุ่น วันที่เด็กสาวชื่อ “โรส — ปาณิสรา บูรณาภา” ลืมตาดูโลก ณ จังหวัดนครปฐม พร้อมรอยยิ้มอ่อนโยนและความฝันเล็ก ๆ ในหัวใจที่จะได้ส่งต่อความสุขผ่านเสียงเพลง',
    polaroidNote: 'Little Rose · Nakhon Pathom',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch1.jpg'
    scene: 'seed',
    tape: 'pink-plaid',
    bloomCount: 1,
    bloomText: 'Seed of Dream',
  },
  {
    chapter: 2,
    seasonLabel: 'Memory 02',
    date: 'May 2025',
    title: 'หัวใจที่ไม่เคยยอมแพ้ — แคนดิเดต BNK48 รุ่นที่ 6',
    body: 'แม้เคยผ่านความผิดหวังจากการออดิชันมาก่อน แต่โรสไม่เคยหยุดพัฒนาตัวเอง เธอกลับมาสู้อีกครั้งในฐานะแคนดิเดต BNK48 รุ่นที่ 6 จนหลายคนตกหลุมรักในความตั้งใจและแววตาที่มุ่งมั่นของเธอ',
    polaroidNote: 'Never Give Up on Your Dream',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch2.jpg'
    scene: 'sprout',
    tape: 'sage-stripe',
    bloomCount: 2,
    bloomText: 'Growing Courage',
  },
  {
    chapter: 3,
    seasonLabel: 'Memory 03',
    date: '31 May 2025',
    title: 'ก้าวสู่สมาชิก BNK48 รุ่นที่ 6 อย่างเป็นทางการ',
    body: 'วินาทีที่ความพยายามผลิดอกออกผลในงานครบรอบ 8 ปีของ BNK48 การได้ก้าวขึ้นยืนบนเวทีเคียงข้างเพื่อนร่วมรุ่นที่ 6 คือจุดเริ่มต้นอย่างเต็มภาคภูมิของ “โรส BNK48”',
    polaroidNote: 'Welcome Rose BNK48 6th Gen!',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch3.jpg'
    scene: 'ribbon',
    tape: 'lavender-check',
    bloomCount: 2,
    bloomText: 'Budding Idol',
  },
  {
    chapter: 4,
    seasonLabel: 'Memory 04',
    date: '23 August 2025',
    title: 'CHAPTER: NEXT — คอนเสิร์ตใหญ่ครั้งแรกในชีวิต',
    body: 'เวทีคอนเสิร์ตใหญ่ที่เปิดโอกาสให้โรสได้เปล่งประกายเคียงข้างรุ่นพี่และเพื่อน ๆ ทุกหยาดเหงื่อจากการฝึกซ้อมแปรเปลี่ยนเป็นรอยยิ้มและความสุขที่ส่งไปถึงผู้ชมทุกที่นั่ง',
    polaroidNote: 'Shining Under the Stage Lights',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch4.jpg'
    scene: 'stage',
    tape: 'rose-dot',
    bloomCount: 3,
    bloomText: 'First Big Stage',
  },
  {
    chapter: 5,
    seasonLabel: 'Memory 05',
    date: '11 October 2025',
    title: 'BNK48 6th Generation Debut Stage',
    body: 'สเตจเดบิวต์อย่างเป็นทางการ ณ MBK Center กับเพลงประจำรุ่น “Doushitemo Kimi ga Suki da (จะยังไงก็รักเธอ)” วันสำคัญที่พิสูจน์ว่าดอกกุหลาบดอกนี้พร้อมเบ่งบานบนเส้นทางไอดอลอย่างงดงาม',
    polaroidNote: 'Doushitemo Kimi ga Suki da',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch5.jpg'
    scene: 'debut',
    tape: 'pink-plaid',
    bloomCount: 3,
    bloomText: 'Blooming Debut',
  },
  {
    chapter: 6,
    seasonLabel: 'Memory 06',
    date: 'January 2026',
    title: '(N)EXTENSION — สมุดบันทึกเบื้องหลังการเติบโต',
    body: 'สารคดีที่พาแฟนคลับไปสัมผัสตัวตนของโรสให้ลึกซึ้งยิ่งขึ้น ทั้งความอ่อนโยน ความฝันของเด็กสาวที่รักกระต่าย ชอบแต่งนิยาย และไม่เคยหยุดเรียนรู้ในทุก ๆ วัน',
    polaroidNote: 'Every Page Tells Her Story',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch6.jpg'
    scene: 'diary',
    tape: 'sage-stripe',
    bloomCount: 4,
    bloomText: 'Heartfelt Story',
  },
  {
    chapter: 7,
    seasonLabel: 'Memory 07',
    date: 'March 2026',
    title: 'Center เพลงพิเศษ “แค่เพียงมีเธอ (Kimi ga Iru Dake de)”',
    body: 'อีกหนึ่งก้าวสำคัญที่น่าภูมิใจสุด ๆ กับการรับตำแหน่ง Center ในโปรเจกต์พิเศษ Collaboration ไทย–ญี่ปุ่น ถ่ายทอดเสียงร้องใสละมุนและเสน่ห์ที่สะกดใจผู้ฟังในวงกว้าง',
    polaroidNote: 'Our Shining Center Rose',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch7.jpg'
    scene: 'center',
    tape: 'rose-dot',
    bloomCount: 4,
    bloomText: 'Radiant Center',
  },
  {
    chapter: 8,
    seasonLabel: 'Memory 08',
    date: 'October 2026',
    title: 'พลังรักจากสวนกุหลาบ — General Election 2026',
    body: 'แรงซัพพอร์ตอันท่วมท้นจากแฟนคลับทุกคนที่ร่วมเดินเคียงข้าง สร้างโมเมนต์สุดประทับใจในการประกาศผลด่วน เป็นเครื่องยืนยันว่าความตั้งใจของโรสมีผู้คนมากมายคอยโอบกอดอยู่เสมอ',
    polaroidNote: 'Together in Rose’s Garden',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch8.jpg'
    scene: 'bouquet',
    tape: 'lavender-check',
    bloomCount: 5,
    bloomText: 'Garden of Love',
  },
  {
    chapter: 9,
    seasonLabel: 'Memory 09',
    date: '1 November 2026',
    title: 'Blooming Nineteen — สุขสันต์วันเกิดครบ 19 ปีนะโรส!',
    body: 'ก้าวเข้าสู่วัย 19 ปีอย่างงดงาม ขอบคุณที่เติบโตมาอย่างดีและเป็นรอยยิ้มที่แสนอบอุ่นให้พวกเราเสมอ ขอให้ฤดูกาลที่ 19 ของโรสเต็มไปด้วยความสุข สุขภาพแข็งแรง ได้กินของอร่อยเยอะ ๆ และเบ่งบานในแบบที่เป็นตัวเองตลอดไป',
    polaroidNote: 'Happy 19th Birthday, Dear Rose!',
    img: '', // วางรูปจริงได้ที่ '/assets/timeline/ch9.jpg'
    scene: 'birthday19',
    tape: 'pink-plaid',
    bloomCount: 5,
    bloomText: 'Full Bloom • 19 Yrs',
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
// คำอวยพรตัวอย่างสำหรับโหมด Local (ก่อนเชื่อมต่อ Supabase จริง)
// ==========================================
export const INITIAL_DEMO_WISHES = [
  {
    id: 105,
    bg: 'pressed-rose',
    name: 'กระต่ายในสวนกุหลาบ',
    message:
      'สุขสันต์วันเกิดครบ 19 ปีนะน้องโรส! ขอบคุณที่ไม่ยอมแพ้กับความฝันจนได้มาเจอกันนะ ขอให้ปีที่ 19 เป็นปีที่ใจดีกับโรสมาก ๆ ยิ้มเยอะ ๆ กินอิ่มนอนหลับ พวกเราจะคอยเป็นสวนกุหลาบที่อบอุ่นให้โรสอยู่ตรงนี้เสมอเลย',
    img: '',
    status: 'approved',
    created_at: '2026-11-01T00:12:00+07:00',
  },
  {
    id: 104,
    bg: 'bunny-polaroid',
    name: 'BunnyLover48',
    message:
      "Happy 19th Birthday P'Rose! ขอให้มีความสุขในทุก ๆ วันเลยนะะะ ดีใจมากที่ได้เห็นโรสเติบโตและเปล่งประกายบนเวที จะยังไงก็รักโรสน้าาา ~",
    img: '',
    status: 'approved',
    created_at: '2026-11-01T00:08:00+07:00',
  },
  {
    id: 103,
    bg: 'vintage-airmail',
    name: 'พิ้งค์กี้โรส',
    message:
      'ส่งโปสการ์ดใบนี้มาอวยพรวันเกิด 19 ขวบนะคะ ขอให้น้องโรสสุขภาพแข็งแรง ไม่ปวดหลัง ได้กินอาหารญี่ปุ่นกับปิ้งย่างอร่อย ๆ บ่อย ๆ รักรอยยิ้มของโรสที่สุดในโลกเลยยย',
    img: '',
    status: 'approved',
    created_at: '2026-11-01T00:05:00+07:00',
  },
  {
    id: 102,
    bg: 'lavender-note',
    name: 'คนแถวนครปฐม',
    message:
      'HBD 19th นะครับน้องโรส ภูมิใจในตัวหนูมาก ๆ ตั้งแต่วันเปิดตัวรุ่น 6 จนถึงวันนี้ หนูเก่งขึ้นทุกวันเลย ขอให้สมหวังในทุกสิ่งที่ตั้งใจนะครับ',
    img: '',
    status: 'approved',
    created_at: '2026-11-01T00:02:00+07:00',
  },
  {
    id: 101,
    bg: 'sage-botanical',
    name: 'GardenKeeper_19',
    message:
      'ขอให้ดอกกุหลาบดอกนี้เบ่งบานอย่างมีความสุขในทุกฤดูกาลเลยนะ ไม่ว่าจะเจอเรื่องอะไร หันมาเมื่อไหร่ก็จะเจอพวกเราเสมอ สุขสันต์วันเกิดวัย 19 ปีครับ',
    img: '',
    status: 'approved',
    created_at: '2026-11-01T00:00:10+07:00',
  },
  {
    id: 106,
    bg: 'tea-party',
    name: 'แฟนคลับที่รอแอดมินอนุมัติ',
    message:
      'สุขสันต์วันเกิดครบ 19 ปีนะโรส! (การ์ดใบนี้เป็นตัวอย่างสถานะ "รออนุมัติ" สามารถเข้าไปกดอนุมัติหรือซ่อนได้ที่หน้า /admin เลยครับ)',
    img: '',
    status: 'pending',
    created_at: '2026-11-01T00:15:00+07:00',
  },
];
