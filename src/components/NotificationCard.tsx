import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * NotificationCard — the family-hub alert rendered as a card (design.md §7.15):
 * forest-deep bg, brass ✦ glyph, Fraunces headline, detail line, timestamp,
 * "— MemoryGlen" attribution.
 */
export default function NotificationCard({
  headline,
  detail,
  timestamp,
  className,
  pulse = false,
}: {
  headline: string;
  detail?: string;
  timestamp?: string;
  className?: string;
  /** Play the one-time soft brass halo pulse around the ✦ on entry. */
  pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('max-w-sm rounded-sm bg-forest-deep p-5 text-bone shadow-raised', className)}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            'mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full text-brass',
            pulse && 'animate-halo-pulse',
          )}
        >
          ✦
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg leading-snug">{headline}</p>
          {detail && <p className="mt-1 text-sm leading-relaxed text-sage">{detail}</p>}
          <p className="mt-3 flex items-center justify-between text-xs text-sage">
            {timestamp && <span>{timestamp}</span>}
            <span className="ml-auto">— MemoryGlen</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
