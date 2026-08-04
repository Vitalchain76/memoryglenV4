import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Clock, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/useAuth';
import { vetoTransition } from '@/lib/phase2Api';
import type { LifeRecordState } from '@/lib/phase2Api';

interface LifeRecordStateBadgeProps {
  lifeRecordId: string;
  status: LifeRecordState;
  ownerId: string;
  transitionCommitAt: string | null;
  onVetoed?: () => void;
}

const STATE_COPY: Record<LifeRecordState, { label: string; className: string; Icon: typeof ShieldCheck }> = {
  ACTIVE: {
    label: 'Active -- LivingGlen',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Icon: ShieldCheck,
  },
  PENDING_TRANSITION: {
    label: 'Pending transition',
    className: 'bg-amber-100 text-amber-800 border-amber-300',
    Icon: Clock,
  },
  MEMORIAL: {
    label: 'Memorial -- MemoryGlen',
    className: 'bg-purple-100 text-purple-800 border-purple-300',
    Icon: Flower2,
  },
};

function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return 'Finalizing...';
  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Visual state-machine badge for the ACTIVE -> PENDING_TRANSITION -> MEMORIAL
 * lifecycle, with a live 7-day countdown and an owner veto ("I'm still here")
 * check-in button while a transition is pending.
 */
export default function LifeRecordStateBadge({
  lifeRecordId,
  status,
  ownerId,
  transitionCommitAt,
  onVetoed,
}: LifeRecordStateBadgeProps) {
  const { user } = useAuth();
  const isOwner = user?.id === ownerId;
  const [now, setNow] = useState(() => Date.now());
  const [vetoing, setVetoing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'PENDING_TRANSITION') return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const msRemaining = useMemo(() => {
    if (!transitionCommitAt) return 0;
    return new Date(transitionCommitAt).getTime() - now;
  }, [transitionCommitAt, now]);

  const { label, className, Icon } = STATE_COPY[status];

  const handleVeto = async () => {
    setVetoing(true);
    setError(null);
    const { error: err } = await vetoTransition(lifeRecordId);
    setVetoing(false);
    if (err) {
      setError(err);
      return;
    }
    onVetoed?.();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium',
          className,
        )}
      >
        <Icon size={14} aria-hidden />
        {label}
      </span>

      {status === 'PENDING_TRANSITION' && (
        <span className="text-sm text-soft" aria-live="polite">
          Commits in {formatCountdown(msRemaining)}
        </span>
      )}

      {status === 'PENDING_TRANSITION' && isOwner && (
        <button
          type="button"
          onClick={handleVeto}
          disabled={vetoing}
          className="rounded-full border border-brass px-3 py-1 text-sm font-medium text-brass transition-colors hover:bg-brass/10 disabled:opacity-60"
        >
          {vetoing ? "Confirming you're here..." : "I'm still here -- cancel transition"}
        </button>
      )}

      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
