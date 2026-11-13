import { useState, useCallback } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AnnouncementCountdown from '../components/AnnouncementCountdown';
import TrophyShowcase from '../components/TrophyShowcase';
import CheerPavilion from '../components/CheerPavilion';
import Timeline from '../components/Timeline';
import WishForm from '../components/WishForm';
import WishWall from '../components/WishWall';
import FollowRose from '../components/FollowRose';
import Footer from '../components/Footer';
import PastActivities from '../components/PastActivities';
import Supporters from '../components/Supporters';
import PixelBunnies from '../components/PixelBunnies';
import MusicPlayer from '../components/MusicPlayer';
import { PixelIcon } from '../components/PixelSprites';
import { computeAutoBunnyCount, DEFAULT_CHEER_STATS } from '../data/roseData';

// ไอคอนพิกเซลฉลองชัยชนะลอยขึ้นช้า ๆ เป็นฉากหลัง
const FLOATERS = [
  { left: '4%', delay: '0s', dur: '19s', icon: 'crown', size: 22 },
  { left: '12%', delay: '6s', dur: '23s', icon: 'rose', size: 26 },
  { left: '21%', delay: '2.5s', dur: '21s', icon: 'trophy', size: 22 },
  { left: '30%', delay: '9s', dur: '25s', icon: 'bouquet', size: 24 },
  { left: '41%', delay: '4s', dur: '20s', icon: 'medal', size: 22 },
  { left: '52%', delay: '11s', dur: '24s', icon: 'heart', size: 18 },
  { left: '61%', delay: '1.5s', dur: '22s', icon: 'crown', size: 22 },
  { left: '70%', delay: '7.5s', dur: '19s', icon: 'rose', size: 24 },
  { left: '79%', delay: '3s', dur: '26s', icon: 'star', size: 20 },
  { left: '87%', delay: '10s', dur: '21s', icon: 'bunny', size: 26 },
  { left: '95%', delay: '5s', dur: '23s', icon: 'bouquet', size: 22 },
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

const CONFETTI_ICONS = ['rose', 'crown', 'trophy', 'bouquet', 'star', 'heart', 'firework'];

export default function Home({
  wishes,
  addWish,
  likeWish,
  isLoading,
  siteConfig,
  timelineItems,
  cheerStats,
  sendCheer,
  geMilestone,
}) {
  const [bunniesVisible, setBunniesVisible] = useState(true);
  const [carrotSignal, setCarrotSignal] = useState(0);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const approvedCount = wishes.filter((w) => w.status === 'approved').length;
  const autoBunnyCount = computeAutoBunnyCount(approvedCount);
  const targetBunnyCount =
    siteConfig?.bunny_mode === 'manual'
      ? Math.max(0, Math.min(5, Number(siteConfig.bunny_manual_count ?? autoBunnyCount)))
      : autoBunnyCount;

  const stats = {
    ...DEFAULT_CHEER_STATS,
    ...(cheerStats || {}),
  };
  const totalCheers =
    (Number(stats.bouquet) || 0) +
    (Number(stats.crown) || 0) +
    (Number(stats.trophy) || 0) +
    (Number(stats.carrot) || 0);

  const handleDropCarrot = useCallback(() => {
    if (!bunniesVisible) setBunniesVisible(true);
    setCarrotSignal((n) => n + 1);
  }, [bunniesVisible]);

  const handleLaunchConfetti = useCallback(() => {
    const batchId = Date.now();
    const pieces = Array.from({ length: 24 }, (_, idx) => ({
      id: `${batchId}-${idx}`,
      left: `${4 + Math.round(Math.random() * 92)}%`,
      delay: `${(Math.random() * 0.45).toFixed(2)}s`,
      dur: `${(1.8 + Math.random() * 1.3).toFixed(2)}s`,
      drift: `${Math.round((Math.random() - 0.5) * 140)}px`,
      icon: CONFETTI_ICONS[idx % CONFETTI_ICONS.length],
      size: 16 + (idx % 3) * 5,
    }));

    setConfettiPieces((prev) => [...prev.slice(-24), ...pieces]);
    setTimeout(() => {
      setConfettiPieces((prev) =>
        prev.filter((p) => !String(p.id).startsWith(String(batchId)))
      );
    }, 3400);
  }, []);

  return (
    <div className="px-page">
      <div className="px-sky" aria-hidden="true">
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

      {/* เลเยอร์พลุและกลีบกุหลาบฉลองความสำเร็จ */}
      {confettiPieces.length > 0 && (
        <div className="px-confetti-layer" aria-hidden="true">
          {confettiPieces.map((p) => (
            <span
              key={p.id}
              className="px-confetti-piece"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.dur,
                '--cf-drift': p.drift,
              }}
            >
              <PixelIcon name={p.icon} size={p.size} />
            </span>
          ))}
        </div>
      )}

      <Header
        wishCount={approvedCount}
        bunnyCount={targetBunnyCount}
        bunniesVisible={bunniesVisible}
        onToggleBunnies={() => setBunniesVisible((v) => !v)}
        onDropCarrot={handleDropCarrot}
        onLaunchConfetti={handleLaunchConfetti}
      />

      <main className="px-main">
        <AnnouncementCountdown onCelebrate={handleLaunchConfetti} />
        <Hero
          siteConfig={siteConfig}
          geMilestone={geMilestone}
          wishCount={approvedCount}
          totalCheers={totalCheers}
          onHeroScrolledPast={setIsScrolledPastHero}
          onHeroVideoPlaying={setHeroVideoActive}
          onLaunchConfetti={handleLaunchConfetti}
        />

        <TrophyShowcase
          geMilestone={geMilestone}
          wishCount={approvedCount}
          totalCheers={totalCheers}
          onLaunchConfetti={handleLaunchConfetti}
        />

        <PastActivities />

        <CheerPavilion
          cheerStats={cheerStats}
          onSendCheer={sendCheer}
          onDropCarrot={handleDropCarrot}
          goalTarget={geMilestone?.goalTarget || 500}
        />

        <Timeline items={timelineItems} />

        <WishForm
          onAddWish={addWish}
          onLaunchConfetti={handleLaunchConfetti}
        />

        <WishWall
          wishes={wishes}
          isLoading={isLoading}
          onLikeWish={likeWish}
        />

        <FollowRose />
        <Supporters />
      </main>

      <Footer />

      <MusicPlayer
        isScrolledPastHero={isScrolledPastHero}
        heroVideoActive={heroVideoActive}
      />

      <PixelBunnies
        targetCount={targetBunnyCount}
        visible={bunniesVisible}
        carrotSignal={carrotSignal}
      />
    </div>
  );
}
