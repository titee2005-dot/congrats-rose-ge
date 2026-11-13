import { useState } from 'react';
import { useSiteCopy } from '../content/SiteCopy';
import { SectionHeading } from './PixelFrame';
import { PixelIcon } from './PixelSprites';
import { PAST_ACTIVITIES } from '../data/pastActivities';

const cleanActivityTitle = text => text.replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\u200d\ufe0f]/gu, '').trim();

function ActivityCard({ item }) {
  const copy = useSiteCopy();
  const [imgIdx, setImgIdx] = useState(0);
  const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
  const currentImage = images[imgIdx] || item.image || '';

  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <article className={`activity-memory ${item.id === 18 ? 'is-featured' : ''}`} key={item.id}>
      <div className="activity-memory-image">
        {currentImage ? (
          <img src={currentImage} alt={copy(`activity.${item.id}.title`, item.title)} loading="lazy" />
        ) : (
          <div className="activity-image-placeholder">
            <PixelIcon name={item.chapter ? 'book' : 'camera'} size={32} />
            <span>{copy("PastActivities.ca13cbaf95", "ภาพความทรงจำเร็ว ๆ นี้")}</span>
          </div>
        )}
        <span className="activity-number">{String(item.id).padStart(2, '0')}</span>
        {images.length > 1 && (
          <div className="activity-gallery-nav">
            <button type="button" className="activity-gallery-btn" onClick={handlePrev} aria-label="Previous image">◀</button>
            <span className="activity-gallery-counter">{imgIdx + 1}/{images.length}</span>
            <button type="button" className="activity-gallery-btn" onClick={handleNext} aria-label="Next image">▶</button>
          </div>
        )}
      </div>
      <div className="activity-memory-copy">
        <span className="activity-kicker">
          {item.chapter
            ? copy("PastActivities.5ea7b2af9f", "Chapter {value1}", { value1: item.chapter })
            : copy("PastActivities.7b68f84bd8", "ACTIVITY {value1}", { value1: String(item.id).padStart(2, '0') })}
        </span>
        <h3 className="activity-title">
          <PixelIcon name={item.icon || "star"} size={20} />
          <span>{cleanActivityTitle(copy(`activity.${item.id}.title`, item.title))}</span>
        </h3>
      </div>
    </article>
  );
}

function ActivityCards({ items }) {
  return (
    <div className="activity-archive-grid">
      {items.map((item) => (
        <ActivityCard item={item} key={item.id} />
      ))}
    </div>
  );
}

export default function PastActivities() {
  const copy = useSiteCopy();
  return <section className="px-section past-activities" id="activities">
    <SectionHeading chip={copy("PastActivities.82c8bb9fff", "OUR MEMORIES TOGETHER")} icon="book" title={copy("PastActivities.ca369f85ec", "RoseIsOn5ire")} desc={copy("PastActivities.01c7d9ceff", "กิจกรรมที่ผ่านมา · ความทรงจำของโรสและพวกเราตลอดเส้นทาง General Election")} />
    <ActivityCards items={PAST_ACTIVITIES.filter(item => !item.chapter)} />
    <div className="activity-story">
      <div className="activity-story-heading">
        <span>{copy("PastActivities.0e9d4805dc", "THE STORY COLLECTION · 5 CHAPTERS")}</span>
        <h3 className="activity-story-title">
          <PixelIcon name="bunny" size={25} />
          <span>{copy("PastActivities.c9e40ff110", "ROLLZY BUNNY’s Story")}</span>
          <PixelIcon name="book" size={24} />
        </h3>
      </div>
      <ActivityCards items={PAST_ACTIVITIES.filter(item => item.chapter)} />
    </div>
  </section>;
}
