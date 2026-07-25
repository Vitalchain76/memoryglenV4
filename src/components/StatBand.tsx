import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Stat {
  /** Display value, e.g. "500+", "1K+", "12". The numeric part counts up. */
  value: string;
  label: string;
}

function parseValue(value: string): { target: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: 0, suffix: value };
  return { target: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] };
}

/**
 * StatBand — row of Fraunces numerals + Inter labels separated by brass ticks
 * (design.md §7.16). Numerals count up gently over 1.2s on first viewport entry.
 */
export default function StatBand({ stats, className, onDark = false }: { stats: Stat[]; className?: string; onDark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - t, 3)); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className={cn('flex flex-wrap items-stretch gap-x-8 gap-y-6', className)}>
      {stats.map((s, i) => {
        const { target, suffix } = parseValue(s.value);
        const shown = Math.round(target * progress).toLocaleString('en-ZA');
        return (
          <div key={s.label} className="flex items-center gap-8">
            {i > 0 && <span aria-hidden className="hidden h-10 w-px bg-brass/60 sm:block" />}
            <div>
              <p className={cn('type-stat', onDark ? 'text-bone' : 'text-body')}>
                {shown}
                {suffix}
              </p>
              <p className={cn('type-meta mt-2', onDark ? 'text-sage' : 'text-soft')}>{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
