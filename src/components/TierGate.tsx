import { useState } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

/**
 * TierGate — quiet upgrade prompt band (design.md §7.13). Never a modal on
 * memorial pages: one Fraunces line, one evergreen "View Plans" button, one
 * "Not now" text link.
 */
export default function TierGate({
  message = '4 of 5 free resting places used. As the family grows, so should your space.',
  className,
}: {
  message?: string;
  className?: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className={cn(
        'card-well flex flex-col items-start gap-4 border-l-2 border-brass p-6 sm:flex-row sm:items-center',
        className,
      )}
      role="note"
    >
      <p className="flex-1 font-display text-lg leading-snug text-body">{message}</p>
      <div className="flex items-center gap-4">
        <Link to="/plans" className="btn btn-evergreen min-h-12 px-5 py-2 text-sm">
          View Plans
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="min-h-12 px-2 text-sm font-medium text-soft transition-colors hover:text-body"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
