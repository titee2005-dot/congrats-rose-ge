import { ROSE_PROFILE, ROSE_SOCIALS } from '../data/roseData';
import ScrollReveal from './ScrollReveal';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

export default function FollowRose() {
  return (
    <section className="px-section" id="follow">
      <ScrollReveal>
        <SectionHeading
          chip="ABOUT ROSE"
          icon="bunny"
          title="รู้จักโรส & ช่องทางติดตาม"
          desc="แวะไปทักทาย ส่งกำลังใจ และติดตามเรื่องราวน่ารัก ๆ ของโรสได้ที่ช่องทางทางการ"
        />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="follow-grid">
          <PixelFrame
            label="Profile"
            icon="rose"
            tone="pink"
            bodyClassName="profile-body"
          >
            <div className="profile-head">
              <div className="profile-avatar" aria-hidden="true">
                <PixelBunnySprite variant="pink-rose" frame="idle" size={64} />
              </div>
              <div>
                <span className="profile-group">{ROSE_PROFILE.group}</span>
                <h3>
                  {ROSE_PROFILE.nicknameTh} · {ROSE_PROFILE.fullNameTh}
                </h3>
                <p className="profile-en">{ROSE_PROFILE.fullNameEn}</p>
              </div>
            </div>

            <dl className="profile-facts">
              <div>
                <dt>วันเกิด</dt>
                <dd>{ROSE_PROFILE.birthDateThai}</dd>
              </div>
              <div>
                <dt>ภูมิลำเนา</dt>
                <dd>{ROSE_PROFILE.hometown}</dd>
              </div>
              <div>
                <dt>ส่วนสูง</dt>
                <dd>{ROSE_PROFILE.height}</dd>
              </div>
              <div>
                <dt>กรุ๊ปเลือด</dt>
                <dd>{ROSE_PROFILE.bloodGroup}</dd>
              </div>
            </dl>

            <div className="profile-likes">
              <span className="likes-title">สิ่งที่โรสชอบ</span>
              <div className="likes-chips">
                {ROSE_PROFILE.favorites.map((fav) => (
                  <span key={fav.text}>
                    <PixelIcon name={fav.icon} size={15} />
                    {fav.text}
                  </span>
                ))}
              </div>
            </div>
          </PixelFrame>

          <div className="social-col">
            {ROSE_SOCIALS.map((soc) => (
              <a
                key={soc.key}
                href={soc.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`px-social s-${soc.key}`}
              >
                <span className="px-social-icon">
                  <PixelIcon name={soc.key} size={34} />
                </span>
                <span className="px-social-info">
                  <small>{soc.platform}</small>
                  <strong>{soc.handle}</strong>
                </span>
                <span className="px-social-arrow" aria-hidden="true">
                  <PixelIcon name="chevron-right" size={18} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
