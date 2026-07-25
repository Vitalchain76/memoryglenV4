import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TimelineStatus = 'done' | 'key' | 'pending' | 'plain';

export interface TimelineItem {
  date: string;
  title: string;
  body?: string;
  /** done = filled evergreen · key = brass halo (key moment) · pending = outline · plain = brass disc */
  status?: TimelineStatus;
}

/**
 * Timeline — vertical dated spine (design.md §7.12). Left 1px brass spine,
 * milestone nodes, date eyebrow, Fraunces H3 title, body text. Used for Life
 * Timelines and the Journey tracker (status states).
 */
export default function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn('relative space-y-10 border-l border-brass/60 pl-8', className)}>
      {items.map((item, i) => {
        const status = item.status ?? 'plain';
        return (
          <motion.li
            key={`${item.date}-${item.title}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(i, 4) * 0.08 }}
            className="relative"
          >
            {/* Node */}
            <span
              aria-hidden
              className={cn(
                'absolute -left-[37px] top-1.5 h-2 w-2 rounded-full',
                status === 'done' && 'bg-evergreen ring-4 ring-evergreen/20',
                status === 'key' && 'bg-brass ring-4 ring-brass-soft/50',
                status === 'pending' && 'border border-brass bg-transparent',
                status === 'plain' && 'bg-brass',
              )}
            />
            <p className="eyebrow">{item.date}</p>
            <h3 className="type-h3 mt-2 text-body">{item.title}</h3>
            {item.body && <p className="mt-2 max-w-reading leading-relaxed text-soft">{item.body}</p>}
          </motion.li>
        );
      })}
    </ol>
  );
}
