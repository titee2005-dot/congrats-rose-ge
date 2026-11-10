import BunnyFarmGallery from './BunnyFarmGallery';
import ScrollReveal from './ScrollReveal';
import PixelFrame, { SectionHeading } from './PixelFrame';

// Tier order confirmed by the owner; the blue artwork is Tier 2.
const TIERS = [
  { tier: 1, file: 'S__8200306_0.jpg' },
  { tier: 2, file: 'S__8200307_0.jpg' },
  { tier: 3, file: 'S__8200308_0.jpg' },
  { tier: 4, file: 'S__8200309_0.jpg' },
];

export default function CheerPavilion() {
  return (
    <section className="px-section" id="cheer">
      <ScrollReveal>
        <SectionHeading chip="ROSE'S GARDEN" icon="bunny" title="ฟาร์มกระต่าย" />
      </ScrollReveal>
      <ScrollReveal delay={70}>
        <PixelFrame label="Rose's Garden" icon="bunny" tone="pink" bodyClassName="cheer-pavilion-body">
          <BunnyFarmGallery />
          <div className="completed-tier-grid" aria-label="ภาพขอบคุณครบทั้ง 4 Tier">
            {TIERS.map(({ tier, file }) => (
              <figure className="completed-tier" key={tier}>
                <figcaption>Tier {tier}</figcaption>
                <img src={`/assets/tiers/${file}`} alt={`ภาพขอบคุณ Tier ${tier}`} width="1045" height="1567" loading="lazy" />
              </figure>
            ))}
          </div>
        </PixelFrame>
      </ScrollReveal>
    </section>
  );
}
