import Reveal from '@/components/Reveal';
import { FAMILY_VIDEO } from '@/pages/virginia/data';

/**
 * Her, alive and speaking.
 *
 * Self-hosted with `preload="none"` and a poster frame, so nothing downloads
 * until a visitor chooses to play. No third-party player, no tracking.
 */
export default function FamilyVideoSection() {
  const mins = Math.floor(FAMILY_VIDEO.durationSeconds / 60);
  const secs = String(FAMILY_VIDEO.durationSeconds % 60).padStart(2, '0');

  return (
    <section aria-labelledby="vg-video-heading">
      <Reveal>
        <p className="eyebrow">Her Voice, Her Face</p>
        <h3 id="vg-video-heading" className="type-h3 mt-4 text-body">
          {FAMILY_VIDEO.title}
        </h3>
        <p className="mt-3 max-w-reading leading-relaxed text-soft">
          {FAMILY_VIDEO.description}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <figure className="card-raised mt-8 overflow-hidden">
          <video
            controls
            preload="none"
            poster={FAMILY_VIDEO.poster}
            className="w-full bg-forest-deep"
            playsInline
          >
            <source src={FAMILY_VIDEO.src} type="video/mp4" />
            Your browser cannot play this video.{' '}
            <a href={FAMILY_VIDEO.src} className="underline">
              Download it instead
            </a>
            .
          </video>
          <figcaption className="flex flex-wrap items-center justify-between gap-3 p-5">
            <span className="text-body">{FAMILY_VIDEO.title}</span>
            <span className="type-meta text-soft">
              {mins}:{secs}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
