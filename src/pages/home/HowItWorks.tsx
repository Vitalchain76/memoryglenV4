import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    title: 'Register',
    body: "Create your family's account in minutes. No cost to begin.",
  },
  {
    title: 'Create a Memorial',
    body: 'A guided wizard gathers the story, photos, voice notes, and songs.',
  },
  {
    title: 'Invite Family',
    body: 'Guardians and contributors join from anywhere in the world.',
  },
  {
    title: 'Preserve Forever',
    body: 'The memorial stays. The recording stays. The story stays.',
  },
];

/**
 * How It Works — home.md §4. GSAP + ScrollTrigger owns this subtree (no
 * Framer Motion here — library isolation, react-dev.md). Desktop: pinned for
 * 150vh, the brass connector draws left→right with scroll progress and each
 * step activates as the line reaches it. Mobile / reduced-motion: unpinned,
 * everything simply visible.
 */
export default function HowItWorks() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const steps = gsap.utils.toArray<HTMLElement>('.hiw-step');
        const line = root.current?.querySelector<HTMLElement>('.hiw-line-fill');
        if (!line) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top+=72',
            end: '+=150%',
            pin: true,
            scrub: 0.6,
          },
        });

        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
        steps.forEach((step, i) => {
          tl.to(
            step,
            {
              duration: 0.12,
              onStart: () => step.classList.add('hiw-on'),
              onReverseComplete: () => step.classList.remove('hiw-on'),
            },
            (i + 0.35) / steps.length,
          );
        });
      }, root);
      return () => ctx.revert();
    });

    // Mobile / reduced motion: simple fade-in, no pin
    mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.hiw-step').forEach((step, i) => {
          step.classList.add('hiw-on');
          gsap.fromTo(
            step,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
              delay: i * 0.08,
              scrollTrigger: { trigger: step, start: 'top 80%' },
            },
          );
        });
        const line = root.current?.querySelector<HTMLElement>('.hiw-line-fill');
        if (line) gsap.set(line, { scaleX: 1 });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="section-pad" aria-labelledby="hiw-heading">
      <div className="container-content">
        <p className="eyebrow eyebrow-centered">HOW IT WORKS</p>
        <h2 id="hiw-heading" className="type-h2 mt-4 text-center text-body">
          From loss to legacy, in four gentle steps.
        </h2>

        <div className="relative mt-16">
          {/* Brass connector (draws across on scroll) */}
          <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-[color:var(--line)] md:block">
            <div className="hiw-line-fill h-px origin-left bg-brass" style={{ transform: 'scaleX(0)' }} />
          </div>

          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="hiw-step relative md:pt-16">
                <span
                  aria-hidden
                  className="hiw-numeral type-stat flex h-12 w-12 items-center justify-center rounded-sm border border-brass/50 text-brass"
                >
                  {i + 1}
                </span>
                <div className="pl-16 md:pl-0">
                  <h3 className="type-h3 text-body">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        .hiw-step .hiw-numeral { transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease; }
        .hiw-step.hiw-on .hiw-numeral { background: var(--brass); color: var(--forest-deep); border-color: var(--brass); }
        @media (min-width: 768px) {
          .hiw-step { opacity: 0.45; transition: opacity 300ms ease; }
          .hiw-step.hiw-on { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
