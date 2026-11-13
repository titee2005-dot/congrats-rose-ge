import { useSiteCopy } from '../content/SiteCopy';
import { ROSE_PROFILE, ROSE_SOCIALS } from '../data/roseData';
import ScrollReveal from './ScrollReveal';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

export default function FollowRose() {
  const copy = useSiteCopy();
  return (
    <section className="px-section" id="follow">
      <ScrollReveal>
        <SectionHeading
          chip={copy("FollowRose.56183db3ed", "ABOUT ROSE")}
          icon="bunny"
          title={copy("FollowRose.3a9b53f97f", "รู้จักโรส & ช่องทางติดตาม")}
          desc={copy("FollowRose.f93f44bd9b", "แวะไปทักทาย ส่งกำลังใจ และติดตามเรื่องราวน่ารัก ๆ ของโรสได้ที่ช่องทางทางการ")}
        />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="follow-grid">
          <PixelFrame
            label={copy("FollowRose.ff4fc0276e", "Profile")}
            icon="rose"
            tone="pink"
            bodyClassName="profile-body"
          >
            <div className="profile-head">
              <div className="profile-avatar" aria-hidden="true">
                <PixelBunnySprite variant="pink-rose" frame="idle" size={64} />
              </div>
              <div>
                <span className="profile-group">{copy('profile.group', ROSE_PROFILE.group)}</span>
                <h3>
                  {copy('profile.nicknameTh', ROSE_PROFILE.nicknameTh)} · {copy('profile.fullNameTh', ROSE_PROFILE.fullNameTh)}
                </h3>
                <p className="profile-en">{copy('profile.fullNameEn', ROSE_PROFILE.fullNameEn)}</p>
              </div>
            </div>

            <dl className="profile-facts">
              <div>
                <dt>{copy("FollowRose.cefb3b84fb", "วันเกิด")}</dt>
                <dd>{copy('profile.birthDateThai', ROSE_PROFILE.birthDateThai)}</dd>
              </div>
              <div>
                <dt>{copy("FollowRose.aa657df9d0", "ภูมิลำเนา")}</dt>
                <dd>{copy('profile.hometown', ROSE_PROFILE.hometown)}</dd>
              </div>
              <div>
                <dt>{copy("FollowRose.4b52c7298c", "ส่วนสูง")}</dt>
                <dd>{copy('profile.height', ROSE_PROFILE.height)}</dd>
              </div>
              <div>
                <dt>{copy("FollowRose.dabd29bdf9", "กรุ๊ปเลือด")}</dt>
                <dd>{copy('profile.bloodGroup', ROSE_PROFILE.bloodGroup)}</dd>
              </div>
            </dl>

            <div className="profile-likes">
              <span className="likes-title">{copy("FollowRose.6b170c6324", "สิ่งที่โรสชอบ")}</span>
              <div className="likes-chips">
                {ROSE_PROFILE.favorites.map((fav) => (
                  <span key={copy(`favorite.${fav.icon}`, fav.text)}>
                    <PixelIcon name={fav.icon} size={15} />
                    {copy(`favorite.${fav.icon}`, fav.text)}
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
                  <small>{copy(`social.${soc.key}.platform`, soc.platform)}</small>
                  <strong>{copy(`social.${soc.key}.handle`, soc.handle)}</strong>
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
