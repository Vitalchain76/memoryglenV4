import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reveal — the standard MemoryGlen entrance (design.md §5): opacity 0→1,
 * translateY 24px→0, 400ms ease-out, trigger at 20% viewport, staggerable
 * children at 80ms via `delay={i * 0.08}`.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'span' | 'figure' | 'li';
}) {
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className={cn(className)}
    >
      {children}
    </Comp>
  );
}
