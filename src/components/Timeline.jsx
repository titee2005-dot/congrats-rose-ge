import { useState } from 'react';
import { ROSE_TIMELINE } from '../data/roseData';
import ScrollReveal from './ScrollReveal';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelIcon, TimelineChapterArt } from './PixelSprites';

// แปลงชื่อฉากให้ตรงกับภาพประกอบพิกเซล
const SCENE_MAP = {
  seed: 'birth',
  sprout: 'audition',
  ribbon: 'gen6',
  stage: 'concert',
  debut: 'debut',
  diary: 'story',
  center: 'center',
  bouquet: 'ge2026',
  victory: 'victory',
  birthday19: 'victory',
};

const TONES = ['pink', 'lavender', 'mint', 'butter'];
const NODE_ICONS = ['heart', 'rose', 'star', 'crown'];

function MemoryCard({ ev, index, isLast }) {
  const [imgError, setImgError] = useState(false);
  const isLeft = index % 2 === 0;

  return (
    <ScrollReveal
      direction={isLeft ? 'left' : 'right'}
      delay={60}
      className={`tl-row ${isLeft ? 'is-left' : 'is-right'}`}
    >
      {/* หมุดบนเส้นเวลา */}
      <div className={`tl-node ${isLast ? 'is-final' : ''}`}>
        <PixelIcon
          name={isLast ? 'trophy' : NODE_ICONS[index % NODE_ICONS.length]}
          size={22}
        />
      </div>

      <PixelFrame
        label={`${ev.seasonLabel || `Milestone ${String(index + 1).padStart(2, '0')}`} · ${ev.date || ''}`}
        icon={isLast ? 'trophy' : 'rose'}
        tone={isLast ? 'butter' : TONES[index % TONES.length]}
        className="tl-card"
      >
        <div className="tl-photo">
          {!imgError && ev.img ? (
            <img
              src={ev.img}
              alt={ev.title}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <TimelineChapterArt
              scene={SCENE_MAP[ev.scene] || 'birth'}
              chapter={ev.chapter || index + 1}
            />
          )}
        </div>

        <h3 className="tl-title">{ev.title}</h3>
        <p className="tl-body">{ev.body}</p>
        {ev.polaroidNote && (
          <span className="tl-note">
            <PixelIcon name="heart" size={14} />
            <span>{ev.polaroidNote}</span>
          </span>
        )}
      </PixelFrame>
    </ScrollReveal>
  );
}

export default function Timeline({ items }) {
  const timelineList =
    Array.isArray(items) && items.length > 0 ? items : ROSE_TIMELINE;

  return (
    <section className="px-section" id="journey">
      <ScrollReveal>
        <SectionHeading
          chip="ROAD TO VICTORY"
          icon="rose"
          title="บันทึกเส้นทางความพยายามของโรส"
          desc="ย้อนดูทุกก้าวสำคัญตั้งแต่วันแรกของความฝัน จนถึงวันที่ผลิบานอย่างภาคภูมิใจในงาน General Election"
        />
      </ScrollReveal>

      <div className="tl">
        <div className="tl-line" aria-hidden="true" />
        {timelineList.map((ev, idx) => (
          <MemoryCard
            key={ev.chapter || idx}
            ev={ev}
            index={idx}
            isLast={idx === timelineList.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
