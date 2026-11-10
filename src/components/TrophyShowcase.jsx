import { useState } from 'react';
import { DEFAULT_GE_MILESTONE } from '../data/roseData';
import ScrollReveal from './ScrollReveal';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

export default function TrophyShowcase({
  geMilestone,
  onLaunchConfetti,
}) {
  const [celebrating, setCelebrating] = useState(false);
  const [failedImage, setFailedImage] = useState('');

  const info = {
    ...DEFAULT_GE_MILESTONE,
    ...(geMilestone || {}),
  };

  const handleCelebrateClick = () => {
    setCelebrating(true);
    onLaunchConfetti?.();
    setTimeout(() => setCelebrating(false), 1200);
  };

  return (
    <section className="px-section" id="milestone">
      <ScrollReveal>
        <SectionHeading
          chip="HALL OF FAME"
          icon="trophy"
          title="หอเกียรติยศ"
          desc="บันทึกความภาคภูมิใจของโรสและแฟนคลับทุกคนที่ร่วมเดินทางเคียงข้างกันในงาน General Election"
        />
      </ScrollReveal>

      <ScrollReveal delay={70}>
        <div className="trophy-showcase-grid trophy-showcase-single">
          {/* แท่นถ้วยรางวัลหลัก */}
          <PixelFrame
            label="Honor Pedestal"
            icon="crown"
            tone="butter"
            className="trophy-main-frame"
            bodyClassName="trophy-main-body result-card-body"
          >
            <div className="trophy-pedestal-wrap">
              <div className={`trophy-emblem-stage ${celebrating ? 'is-bursting' : ''}`}>
                <span className="trophy-spark ts-1" aria-hidden="true">
                  <PixelIcon name="sparkle" size={16} />
                </span>
                <span className="trophy-spark ts-2" aria-hidden="true">
                  <PixelIcon name="star" size={16} />
                </span>
                <span className="trophy-spark ts-3" aria-hidden="true">
                  <PixelIcon name="rose" size={18} />
                </span>
                <span className="trophy-spark ts-4" aria-hidden="true">
                  <PixelIcon name="firework" size={18} />
                </span>

                <div className="trophy-center-badge">
                  <div className="trophy-crown-top">
                    <PixelIcon name="crown" size={28} />
                  </div>
                  <div className="result-portrait">
                    {info.imageUrl && failedImage !== info.imageUrl ? (
                      <img src={info.imageUrl} alt="โรส BNK48 ในโอกาสประกาศผล General Election" onError={() => setFailedImage(info.imageUrl)} />
                    ) : (
                      <div className="result-portrait-placeholder"><PixelBunnySprite variant="crown-ge" frame="hop" size={90} /><span>ROSE BNK48</span></div>
                    )}
                  </div>
                  <div className="trophy-bunny-guards" aria-hidden="true">
                    <PixelBunnySprite variant="crown-ge" frame="hop" size={44} />
                    <PixelBunnySprite
                      variant="pink-rose"
                      frame="hop"
                      size={44}
                      flip
                    />
                  </div>
                </div>
              </div>

              <div className="trophy-plaque-info">
                <span className="trophy-event-chip">
                  <PixelIcon name="medal" size={14} />
                  <span>{info.eventTitle}</span>
                </span>

                <div className="result-rank">
                  <span>{!info.rankNumber || info.rankNumber === 'GE' ? 'GENERAL ELECTION' : 'อันดับที่'}</span>
                  <strong>{info.rankNumber || 'GE'}</strong>
                </div>
                <h3 className="trophy-headline">{info.rankBadge}</h3>

                {info.quote && <blockquote className="trophy-quote">“{info.quote}”</blockquote>}

                <div className="trophy-cta-row">
                  <button
                    type="button"
                    className="px-btn gold-btn"
                    onClick={handleCelebrateClick}
                  >
                    <PixelIcon name="firework" size={17} />
                    <span>จุดพลุฉลองความสำเร็จให้โรส!</span>
                  </button>
                </div>
              </div>
            </div>
          </PixelFrame>

        </div>
      </ScrollReveal>
    </section>
  );
}
