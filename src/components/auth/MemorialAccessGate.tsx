import { useState, useEffect } from 'react';
import type { ReactNode, FormEvent } from 'react';
import { Lock, UserPlus, KeyRound, ShieldAlert, Clock } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { supabase } from '@/lib/supabase';
import { getMembershipState, joinMemorial } from '@/lib/membershipApi';
import type { MembershipState } from '@/lib/membershipApi';

interface GateProps {
  memorialSlug: string;
  memorialName: string;
  children: ReactNode;
}

/**
 * MemorialAccessGate — wraps private memorial sections. Non-members see a
 * membership card: signed-out visitors are sent to sign in; signed-in
 * visitors can redeem an invite code for instant access or submit a request
 * that the family must approve (pending). Access is also enforced by RLS at
 * the database, so this gate is a UX layer, not the only guard.
 */
export default function MemorialAccessGate({
  memorialSlug,
  memorialName,
  children,
}: GateProps) {
  const [state, setState] = useState<MembershipState | 'loading'>('loading');
  const [signedIn, setSignedIn] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!supabase) {
        // No auth backend in this environment — fail closed (gated).
        if (!cancelled) {
          setSignedIn(false);
          setState('none');
        }
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setSignedIn(!!user);
      setState(await getMembershipState(memorialSlug));
    }
    verify();
    return () => {
      cancelled = true;
    };
  }, [memorialSlug]);

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await joinMemorial(memorialSlug, inviteCode);
    setLoading(false);
    if (res.success) {
      setState(res.status === 'active' ? 'active' : 'pending');
    } else {
      setError(res.error || 'Failed to join memorial.');
    }
  }

  if (state === 'loading') {
    return (
      <div className="p-8 text-center text-soft">Checking membership access…</div>
    );
  }

  // Approved members see the protected content.
  if (state === 'active') {
    return <>{children}</>;
  }

  // Pending request awaiting family approval.
  if (state === 'pending') {
    return (
      <Reveal>
        <div className="card-raised mx-auto my-10 max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass/10 text-brass">
            <Clock size={24} aria-hidden />
          </div>
          <h3 className="type-h3 text-body">Access request submitted</h3>
          <p className="mt-2 text-sm leading-relaxed text-soft">
            Access request submitted to the family. You will be notified once approved.
          </p>
        </div>
      </Reveal>
    );
  }

  // Not a member: gated card.
  return (
    <Reveal>
      <div className="card-raised mx-auto my-10 max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass/10 text-brass">
          <Lock size={24} aria-hidden />
        </div>
        <h3 className="type-h3 text-body">Private Family Memorial</h3>
        <p className="mt-2 text-sm leading-relaxed text-soft">
          Access to {memorialName}’s guestbook, live stream, family finance
          tracker and anniversary chat is reserved for registered MemoryGlen
          members and invited guests.
        </p>

        {!signedIn ? (
          <div className="mt-6 space-y-3">
            <a
              href="/signin"
              className="btn btn-evergreen inline-flex w-full items-center justify-center gap-2 py-3"
            >
              <UserPlus size={18} aria-hidden /> Sign In or Join MemoryGlen
            </a>
            <p className="text-xs text-soft">
              Free membership required to view family notices and participate.
            </p>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="mt-6 space-y-4 text-left">
            <div>
              <label className="type-meta mb-1 block text-xs font-semibold text-body">
                Have an invite code? (optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. a1b2c3"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--line)] bg-white px-4 py-2.5 pl-10 text-sm"
                />
                <KeyRound
                  size={16}
                  className="absolute left-3 top-3 text-soft"
                  aria-hidden
                />
              </div>
              <p className="mt-1 text-xs text-soft">
                No code? Submit a request and the family will review it.
              </p>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                <ShieldAlert size={14} aria-hidden /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-evergreen w-full py-3 text-sm disabled:opacity-60"
            >
              {loading ? 'Verifying…' : `Join ${memorialName}'s Circle`}
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}
