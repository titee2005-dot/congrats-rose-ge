import { useSiteCopy } from '../content/SiteCopy';
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
  const copy = useSiteCopy();
  return (
    <section className="px-section" id="cheer">
      <ScrollReveal>
        <SectionHeading chip={copy("CheerPavilion.1719d7b1d2", "ROSE'S GARDEN")} icon="bunny" title={copy("CheerPavilion.56d29de232", "ฟาร์มกระต่าย")} />
      </ScrollReveal>
      <ScrollReveal delay={70}>
        <PixelFrame label={copy("CheerPavilion.bb7c0f6bcd", "Rose's Garden")} icon="bunny" tone="pink" bodyClassName="cheer-pavilion-body">
          <BunnyFarmGallery />
          <div className="completed-tier-grid" aria-label={copy("CheerPavilion.89f68ad29b", "ภาพขอบคุณครบทั้ง 4 Tier")}>
            {TIERS.map(({ tier, file }) => (
              <figure className="completed-tier" key={tier}>
                <figcaption>{copy("CheerPavilion.3becd4dd96", "Tier ")}{tier}</figcaption>
                <img src={`/assets/tiers/${file}`} alt={copy("CheerPavilion.5417fe2b82", "ภาพขอบคุณ Tier {value1}", {value1: tier})} width="1045" height="1567" loading="lazy" />
              </figure>
            ))}
          </div>
        </PixelFrame>
      </ScrollReveal>
    </section>
  );
}
