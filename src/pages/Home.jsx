import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import WishForm from '../components/WishForm';
import WishWall from '../components/WishWall';
import FollowRose from '../components/FollowRose';
import Footer from '../components/Footer';
import PixelBunnies from '../components/PixelBunnies';
import MusicPlayer from '../components/MusicPlayer';
import { PixelIcon } from '../components/PixelSprites';
import { computeAutoBunnyCount } from '../data/roseData';

// ไอคอนพิกเซลลอยขึ้นช้า ๆ เป็นฉากหลัง
const FLOATERS = [
  { left: '4%', delay: '0s', dur: '19s', icon: 'heart', size: 22 },
  { left: '12%', delay: '6s', dur: '23s', icon: 'rose', size: 26 },
  { left: '21%', delay: '2.5s', dur: '21s', icon: 'star', size: 18 },
  { left: '30%', delay: '9s', dur: '25s', icon: 'envelope', size: 24 },
  { left: '41%', delay: '4s', dur: '20s', icon: 'note', size: 20 },
  { left: '52%', delay: '11s', dur: '24s', icon: 'heart', size: 18 },
  { left: '61%', delay: '1.5s', dur: '22s', icon: 'gift', size: 24 },
  { left: '70%', delay: '7.5s', dur: '19s', icon: 'rose', size: 22 },
  { left: '79%', delay: '3s', dur: '26s', icon: 'star', size: 20 },
  { left: '87%', delay: '10s', dur: '21s', icon: 'bunny', size: 26 },
  { left: '95%', delay: '5s', dur: '23s', icon: 'heart', size: 20 },
];

// ประกายวิบวับอยู่กับที่
const TWINKLES = [
  { top: '12%', left: '8%', delay: '0s' },
  { top: '22%', left: '91%', delay: '1.2s' },
  { top: '38%', left: '3%', delay: '2.1s' },
  { top: '47%', left: '96%', delay: '0.6s' },
  { top: '63%', left: '6%', delay: '1.8s' },
  { top: '74%', left: '93%', delay: '2.6s' },
  { top: '86%', left: '15%', delay: '0.9s' },
  { top: '8%', left: '58%', delay: '3s' },
];

export default function Home({
  wishes,
  addWish,
  isLoading,
  siteConfig,
  timelineItems,
}) {
  const [bunniesVisible, setBunniesVisible] = useState(true);
  const [carrotSignal, setCarrotSignal] = useState(0);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [heroVideoActive, setHeroVideoActive] = useState(false);

  const approvedCount = wishes.filter((w) => w.status === 'approved').length;
  const autoBunnyCount = computeAutoBunnyCount(approvedCount);
  const targetBunnyCount =
    siteConfig?.bunny_mode === 'manual'
      ? Math.max(0, Math.min(5, Number(siteConfig.bunny_manual_count ?? autoBunnyCount)))
      : autoBunnyCount;

  const handleDropCarrot = () => {
    if (!bunniesVisible) setBunniesVisible(true);
    setCarrotSignal((n) => n + 1);
  };

  return (
    <div className="px-page">
      <div className="px-sky" aria-hidden="true">
        {/* ก้อนเมฆพิกเซลลอยผ่านช้า ๆ */}
        <span className="px-cloud c1" />
        <span className="px-cloud c2" />
        <span className="px-cloud c3" />

        {TWINKLES.map((t, i) => (
          <span
            key={`tw-${i}`}
            className="px-twinkle"
            style={{ top: t.top, left: t.left, animationDelay: t.delay }}
          >
            <PixelIcon name="sparkle" size={14} />
          </span>
        ))}

        {FLOATERS.map((f, i) => (
          <span
            key={`fl-${i}`}
            className="px-floater"
            style={{
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.dur,
            }}
          >
            <PixelIcon name={f.icon} size={f.size} />
          </span>
        ))}
      </div>

      <Header
        wishCount={approvedCount}
        bunnyCount={targetBunnyCount}
        bunniesVisible={bunniesVisible}
        onToggleBunnies={() => setBunniesVisible((v) => !v)}
        onDropCarrot={handleDropCarrot}
      />

      <main className="px-main">
        <Hero
          siteConfig={siteConfig}
          onHeroScrolledPast={setIsScrolledPastHero}
          onHeroVideoPlaying={setHeroVideoActive}
        />
        <Timeline items={timelineItems} />
        <WishForm onAddWish={addWish} />
        <WishWall wishes={wishes} isLoading={isLoading} />
        <FollowRose />
      </main>

      <Footer />

      {/* แผ่นเสียงพิกเซลจิ๋วแบบพับได้ ลอยมุมซ้ายล่างเหนือสนามหญ้า */}
      <MusicPlayer
        isScrolledPastHero={isScrolledPastHero}
        heroVideoActive={heroVideoActive}
      />

      {/* ลูกเล่นน้องกระต่าย Pixel Art วิ่งเล่นบนสนามหญ้าด้านล่างจอ */}
      <PixelBunnies
        targetCount={targetBunnyCount}
        visible={bunniesVisible}
        carrotSignal={carrotSignal}
      />
    </div>
  );
}
