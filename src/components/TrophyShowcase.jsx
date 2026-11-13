import { useSiteCopy } from '../content/SiteCopy';
import { useState } from 'react';
import { DEFAULT_GE_MILESTONE } from '../data/roseData';
import ScrollReveal from './ScrollReveal';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

export default function TrophyShowcase({
  geMilestone,
  onLaunchConfetti,
}) {
  const copy = useSiteCopy();
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
          chip={copy("TrophyShowcase.32065dbe94", "HALL OF FAME")}
          icon="trophy"
          title={copy("TrophyShowcase.48c7e04323", "หอเกียรติยศ")}
          desc={copy("TrophyShowcase.70f9f15b26", "บันทึกความภาคภูมิใจของโรสและแฟนคลับทุกคนที่ร่วมเดินทางเคียงข้างกันในงาน General Election")}
        />
      </ScrollReveal>

      <ScrollReveal delay={70}>
        <div className="trophy-showcase-grid trophy-showcase-single">
          {/* แท่นถ้วยรางวัลหลัก */}
          <PixelFrame
            label={copy("TrophyShowcase.b560902d60", "Honor Pedestal")}
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
                      <img src={info.imageUrl} alt={copy("TrophyShowcase.8422f84eda", "โรส BNK48 ในโอกาสประกาศผล General Election")} onError={() => setFailedImage(info.imageUrl)} />
                    ) : (
                      <div className="result-portrait-placeholder"><PixelBunnySprite variant="crown-ge" frame="hop" size={90} /><span>{copy("TrophyShowcase.3274ef24e6", "ROSE BNK48")}</span></div>
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
                  <span>{!info.rankNumber || info.rankNumber === 'GE' ? copy("TrophyShowcase.d557b4dc23", "GENERAL ELECTION") : copy("TrophyShowcase.83a00e9239", "อันดับที่")}</span>
                  <strong>{info.rankNumber || copy("TrophyShowcase.7841417529", "GE")}</strong>
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
                    <span>{copy("TrophyShowcase.ea4ce1937f", "จุดพลุฉลองความสำเร็จให้โรส!")}</span>
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
