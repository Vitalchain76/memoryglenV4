import { memo, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * CandleFlame — pure SVG candle with a CSS-keyframe flicker (design.md §5:
 * scaleY 0.94–1.06, hue wobble between brass and ember, 2.4s irregular loop).
 * Respects prefers-reduced-motion (static flame via global media query).
 */
export const CandleFlame = memo(function CandleFlame({
  size = 40,
  lit = true,
  className,
}: {
  size?: number;
  lit?: boolean;
  className?: string;
}) {
  const height = size * 2;
  return (
    <svg
      viewBox="0 0 120 240"
      width={size}
      height={height}
      className={className}
      role="img"
      aria-label={lit ? 'A lit candle' : 'An unlit candle'}
    >
      <g>
        <rect x="35" y="110" width="50" height="118" rx="4" fill="#16302B" />
        <rect x="35" y="110" width="50" height="10" rx="4" fill="#1E4038" />
        <path
          d="M35 124 C42 132 46 122 52 128 C58 134 62 124 68 130 C74 136 80 126 85 132 L85 110 L35 110 Z"
          fill="#1E4038"
        />
        <rect x="57" y="96" width="6" height="16" rx="3" fill="#0E211D" />
        <rect x="28" y="226" width="64" height="8" rx="3" fill="#0E211D" />
      </g>
      {lit && (
        <g className="candle-flame-flicker" style={{ transformOrigin: '60px 100px' }}>
          <ellipse cx="60" cy="76" rx="28" ry="34" fill="#D9C08A" opacity="0.16" />
          <path d="M60 100 C48 82 56 62 60 44 C64 62 72 82 60 100 Z" fill="#C4A24C" />
          <path d="M60 96 C53 84 58 70 60 60 C62 70 67 84 60 96 Z" fill="#B4552D" opacity="0.85" />
          <path d="M60 92 C56 84 59 76 60 70 C61 76 64 84 60 92 Z" fill="#F6F1E7" opacity="0.9" />
        </g>
      )}
      {/* Inline style tag keeps the keyframes co-located with the component */}
      <style>{`
        .candle-flame-flicker { animation: mg-flame-flicker 2.4s ease-in-out infinite; }
        @keyframes mg-flame-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); filter: hue-rotate(0deg); }
          18% { transform: scaleY(1.05) scaleX(0.97); filter: hue-rotate(-6deg); }
          35% { transform: scaleY(0.95) scaleX(1.02); filter: hue-rotate(4deg); }
          52% { transform: scaleY(1.06) scaleX(0.96); filter: hue-rotate(-3deg); }
          71% { transform: scaleY(0.94) scaleX(1.03); filter: hue-rotate(6deg); }
          86% { transform: scaleY(1.02) scaleX(0.98); filter: hue-rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .candle-flame-flicker { animation: none; }
        }
      `}</style>
    </svg>
  );
});

/** CandleCounter — Fraunces numerals + label (design.md §7.5). */
export function CandleCounter({ count, label = 'candles lit', className }: { count: number; label?: string; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <CandleFlame size={22} />
      <span className="type-stat !text-[1.75rem] text-body">{count}</span>
      <span className="type-meta text-soft">{label}</span>
    </div>
  );
}

export interface Candle {
  name: string;
  message?: string;
  date: string;
}

interface LightACandleProps {
  /** Identifies the memorial so the one-per-session rule is scoped (design.md §5). */
  memorialId: string;
  candles: Candle[];
  onCandleLit?: (candle: Candle) => void;
  className?: string;
}

/**
 * LightACandle — the signature candle ritual (design.md §5/§7.5).
 * Max 3 steps: button → name + optional message (autosaved draft) → submit →
 * ritual (page dims to 60%, flame draws in at center with brass halo, name
 * fades in beneath, holds 1.2s, restores; new candle appears first in list).
 * One per session per memorial. Signed-out users may light with just a name.
 */
export function LightACandle({ memorialId, candles, onCandleLit, className }: LightACandleProps) {
  const draftKey = `mg-candle-draft-${memorialId}`;
  const sessionKey = `mg-candle-lit-${memorialId}`;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [ritualName, setRitualName] = useState<string | null>(null);
  const [alreadyLit, setAlreadyLit] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      const draft = window.sessionStorage.getItem(draftKey);
      if (draft) {
        const parsed = JSON.parse(draft) as { name?: string; message?: string };
        setName(parsed.name ?? '');
        setMessage(parsed.message ?? '');
      }
      setAlreadyLit(window.sessionStorage.getItem(sessionKey) === '1');
    } catch {
      /* storage unavailable */
    }
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, [draftKey, sessionKey]);

  const persistDraft = (n: string, m: string) => {
    try {
      window.sessionStorage.setItem(draftKey, JSON.stringify({ name: n, message: m }));
    } catch {
      /* storage unavailable */
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setOpen(false);
    setRitualName(trimmed);
    const candle: Candle = {
      name: trimmed,
      message: message.trim() || undefined,
      date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    // Ritual holds ~2s total: dim 400ms, flame 600ms, hold 1.2s, restore.
    timers.current.push(
      window.setTimeout(() => {
        setRitualName(null);
        onCandleLit?.(candle);
        try {
          window.sessionStorage.setItem(sessionKey, '1');
          window.sessionStorage.removeItem(draftKey);
        } catch {
          /* storage unavailable */
        }
        setAlreadyLit(true);
        setName('');
        setMessage('');
      }, 2000),
    );
  };

  return (
    <div className={className}>
      {!open && (
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => !alreadyLit && setOpen(true)}
            disabled={alreadyLit}
            className={cn(
              'btn min-h-12',
              alreadyLit ? 'card-well cursor-default text-soft' : 'btn-evergreen',
            )}
          >
            <CandleFlame size={14} lit={alreadyLit} />
            {alreadyLit ? 'Your candle is lit' : 'Light a Candle'}
          </button>
          <CandleCounter count={candles.length} />
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="card-well mt-4 max-w-md p-6"
          >
            <label htmlFor={`candle-name-${memorialId}`} className="type-meta block text-soft">
              Your name
            </label>
            <input
              id={`candle-name-${memorialId}`}
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                persistDraft(e.target.value, message);
              }}
              placeholder="e.g. Tendai, your nephew"
              className="mt-2 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-body placeholder:text-soft"
            />
            <label htmlFor={`candle-msg-${memorialId}`} className="type-meta mt-4 block text-soft">
              A few words <span className="font-normal">(optional)</span>
            </label>
            <textarea
              id={`candle-msg-${memorialId}`}
              value={message}
              rows={3}
              onChange={(e) => {
                setMessage(e.target.value);
                persistDraft(name, e.target.value);
              }}
              placeholder="A memory, a thank-you, a prayer…"
              className="mt-2 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 py-3 text-body placeholder:text-soft"
            />
            <div className="mt-4 flex items-center gap-4">
              <button type="submit" className="btn btn-evergreen min-h-12">
                Light the Candle
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-12 px-2 text-sm font-medium text-soft transition-colors hover:text-body"
              >
                Not now
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* The Candle ritual overlay (design.md §5) */}
      <AnimatePresence>
        {ritualName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-forest-deep/60"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-full"
                style={{ boxShadow: '0 0 80px 32px rgba(217,192,138,0.28)' }}
              >
                <CandleFlame size={56} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-6 font-display text-xl text-bone"
              >
                {ritualName} lit a candle
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candle list — newest first */}
      {candles.length > 0 && (
        <ul className="mt-6 space-y-3">
          {candles.map((c, i) => (
            <li key={`${c.name}-${i}`} className="flex items-start gap-3">
              <CandleFlame size={14} className="mt-1 flex-none" />
              <div>
                <p className="text-sm font-medium text-body">
                  {c.name} <span className="font-normal text-soft">· {c.date}</span>
                </p>
                {c.message && <p className="mt-0.5 text-sm leading-relaxed text-soft">{c.message}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CandleFlame;
