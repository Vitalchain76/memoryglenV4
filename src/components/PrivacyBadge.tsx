import { Globe, Lock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PrivacyLevel = 'inner-circle' | 'family' | 'public';

const CONFIG: Record<PrivacyLevel, { label: string; Icon: typeof Lock; classes: string }> = {
  'inner-circle': {
    label: 'Inner Circle',
    Icon: Lock,
    classes: 'bg-forest text-bone border border-forest',
  },
  family: {
    label: 'Family',
    Icon: Users,
    classes: 'bg-transparent text-evergreen border border-evergreen',
  },
  public: {
    label: 'Public',
    Icon: Globe,
    classes: 'bg-transparent text-brass border border-brass',
  },
};

/**
 * PrivacyBadge — small pill marking content visibility (design.md §7.6):
 * Inner Circle (forest solid, lock) · Family (evergreen outline, people) ·
 * Public (brass outline, globe). Appears on memory cards, posts, events.
 */
export default function PrivacyBadge({ level, className }: { level: PrivacyLevel; className?: string }) {
  const { label, Icon, classes } = CONFIG[level];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
        classes,
        className,
      )}
    >
      <Icon size={12} aria-hidden />
      {label}
    </span>
  );
}
