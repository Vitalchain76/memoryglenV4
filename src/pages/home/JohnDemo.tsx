import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import NotificationCard from '@/components/NotificationCard';
import Reveal from '@/components/Reveal';

const JOURNEY_CHIPS = ['7 days, 4 hours, 20 minutes', '3 countries', '0 3AM phone calls'];

/**
 * Featured demo memorial (John Peters) — home.md §3. Forest band, copy left,
 * framed montage right with a NotificationCard overlapping bottom-left.
 * Montage tilts 1° toward cursor (disabled on touch / reduced-motion).
 */
export default function JohnDemo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useTransform(my, [0, 1], [1, -1]);
  const rotateY = useTransform(mx, [0, 1], [-1, 1]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section className="section-pad bg-forest" aria-labelledby="john-demo-heading">
      <div className="container-content grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-brass/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brass-soft">
              Demonstration Memorial — fictional family
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow mt-6 !text-sage">SEE WHAT MEMORYGLEN CAN DO</p>
            <h2 id="john-demo-heading" className="type-h2 mt-4 text-bone">
              Bringing John Home.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="type-story mt-5 max-w-xl text-bone/80">
              When John Peters passed in Johannesburg, his family was in three countries before
              breakfast. Follow his journey home to Harare — the repatriation tracker, the support
              fund, the livestreamed burial, the family cemetery, the tree that grew. Every tab is
              real product; only the family is fictional.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-6 flex flex-wrap gap-3">
              {JOURNEY_CHIPS.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-parchment-deep/10 px-4 py-2 text-sm font-medium text-bone/85 ring-1 ring-bone/15"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link to="/memorials/john-peters" className="btn btn-evergreen">
                Explore the Demo Memorial
              </Link>
              <Link
                to="/memorials/john-peters?tab=glen"
                className="link-arrow !text-bone hover:!text-brass-soft"
              >
                See the Family Glen <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Montage */}
        <Reveal delay={0.16} className="relative">
          <motion.div
            ref={frameRef}
            onMouseMove={onMove}
            onMouseLeave={() => {
              mx.set(0.5);
              my.set(0.5);
            }}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
            className="relative mx-auto max-w-md"
          >
            <div className="rounded-sm border border-brass/40 bg-forest-deep p-3">
              <img
                src="/memorial-john-portrait.jpg"
                alt="Illustrative portrait of the fictional John Peters, an elderly Zimbabwean gentleman"
                className="aspect-[4/5] w-full rounded-sm object-cover"
                loading="lazy"
              />
            </div>
            <NotificationCard
              headline="✦ John has crossed the border. He is home."
              detail="Beitbridge, 03:15 — the family hub was notified."
              timestamp="Journey · Day 6"
              pulse
              className="absolute -bottom-8 -left-4 sm:-left-10"
            />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
