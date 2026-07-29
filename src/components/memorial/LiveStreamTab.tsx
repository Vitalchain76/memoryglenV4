import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, ChevronDown, Info, Radio, RefreshCw, Volume2, Clock } from 'lucide-react';
import Reveal from '@/components/Reveal';

/**
 * LiveStreamTab — a reusable, standardised live-streaming module for any
 * MemoryGlen memorial page.
 *
 * It renders four states from a single config object:
 *   'upcoming' — a live ticking countdown (Days : Hours : Mins : Secs) to
 *                scheduledStreamTime, plus an Upcoming Service badge.
 *   'live'     — an animated LIVE NOW badge with the youtube-nocookie player.
 *   'ended'    — an Archived Service Replay badge with the recorded player.
 *   'none'     — a quiet No Live Service Scheduled notice with contact info.
 *
 * The embed uses the youtube-nocookie.com privacy-enhanced player so it stays
 * compatible with the site's Content-Security-Policy.
 *
 * Styled with the shared design tokens (card-raised / card-well, type-h2 /
 * type-h3, text-brass / text-body / text-soft, forest palette) and the Reveal
 * scroll animation, so it drops into any template consistently.
 */

export type StreamStatus = 'upcoming' | 'live' | 'ended' | 'none';

export interface LiveStreamConfig {
  /** Human name of the person, used in headings and labels. */
  name: string;
  status: StreamStatus;
  /** YouTube video / live broadcast id. Required for 'upcoming' | 'live' | 'ended'. */
  youtubeLiveId?: string;
  /** ISO 8601 datetime the service begins. Required for 'upcoming' (drives the countdown). */
  scheduledStreamTime?: string;
  /** Short note shown to remote guests. */
  streamInstructions?: string;
  /** Optional contact line shown in the 'none' state. */
  contactHref?: string;
  contactLabel?: string;
}

interface Remaining {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  done: boolean;
}

function diff(target: number): Remaining {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    mins: Math.floor((ms % 3_600_000) / 60_000),
    secs: Math.floor((ms % 60_000) / 1000),
    done: ms <= 0,
  };
}

function useCountdown(iso?: string): Remaining | null {
  const target = useMemo(() => (iso ? new Date(iso).getTime() : NaN), [iso]);
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    Number.isNaN(target) ? null : diff(target),
  );

  useEffect(() => {
    if (Number.isNaN(target)) {
      setRemaining(null);
      return;
    }
    setRemaining(diff(target));
    const id = window.setInterval(() => setRemaining(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return remaining;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/* ---------- Status badge ---------- */
function StatusBadge({ status }: { status: StreamStatus }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#B4552D] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-bone">
        <motion.span
          aria-hidden
          className="h-2 w-2 rounded-full bg-bone"
          animate={{ opacity: [1, 0.25, 1], scale: [1, 0.85, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        Live Now
      </span>
    );
  }
  if (status === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
        <CalendarClock size={12} aria-hidden /> Upcoming Service
      </span>
    );
  }
  if (status === 'ended') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass-soft">
        <Clock size={12} aria-hidden /> Archived Service Replay
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-soft">
      No Live Service Scheduled
    </span>
  );
}

/* ---------- Countdown ---------- */
function Countdown({ iso }: { iso?: string }) {
  const r = useCountdown(iso);
  if (!r) return null;

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: r.days },
    { label: 'Hours', value: r.hours },
    { label: 'Mins', value: r.mins },
    { label: 'Secs', value: r.secs },
  ];

  return (
    <div>
      <p className="type-meta text-sage">Service starts in</p>
      <div className="mt-3 flex items-stretch gap-2 sm:gap-3" role="timer" aria-live="off">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-stretch gap-2 sm:gap-3">
            <div className="min-w-[62px] rounded-sm bg-forest-deep px-3 py-3 text-center sm:min-w-[76px]">
              <span className="type-stat block tabular-nums text-brass-soft">{pad(u.value)}</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-sage">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span aria-hidden className="self-center text-2xl font-light text-brass/60">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- YouTube (privacy-enhanced) embed ---------- */
function StreamPlayer({ videoId, title }: { videoId: string; title: string }) {
  const src =
    'https://www.youtube-nocookie.com/embed/' + videoId + '?rel=0&modestbranding=1&playsinline=1';
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-forest-deep">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

/* ---------- Remote viewer instructions (collapsible) ---------- */
function ViewerInstructions({ note }: { note?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-well mt-6 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-body">
          <Info size={16} className="flex-none text-brass" aria-hidden />
          Watching from afar? Read this first
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} aria-hidden>
          <ChevronDown size={18} className="text-soft" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="space-y-4 px-5 pb-5">
              {note && <p className="text-sm leading-relaxed text-soft">{note}</p>}
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-body">
                  <Clock size={16} className="mt-0.5 flex-none text-brass" aria-hidden />
                  <span>
                    <span className="font-medium">Timezone.</span> Times shown are in the family&apos;s
                    local timezone. The countdown above follows the clock on your own device, so it is
                    always accurate for you.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-body">
                  <Volume2 size={16} className="mt-0.5 flex-none text-brass" aria-hidden />
                  <span>
                    <span className="font-medium">Sound.</span> The stream may start muted on some
                    devices. Tap the video and unmute using the speaker icon in the player.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-body">
                  <RefreshCw size={16} className="mt-0.5 flex-none text-brass" aria-hidden />
                  <span>
                    <span className="font-medium">If the stream drops.</span> Refresh this page. The
                    player reconnects to the broadcast automatically, and the full recording remains
                    here afterwards.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Main component ---------- */
export default function LiveStreamTab({ config }: { config: LiveStreamConfig }) {
  const { name, status, youtubeLiveId, scheduledStreamTime, streamInstructions } = config;

  return (
    <div>
      <Reveal>
        <p className="eyebrow">Live &amp; remembered together</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <h2 className="type-h2 text-body">Live Service</h2>
          <StatusBadge status={status} />
        </div>
      </Reveal>

      {status === 'none' ? (
        <Reveal delay={0.05}>
          <div className="card-well mt-8 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest text-brass-soft">
                <Radio size={20} aria-hidden />
              </span>
              <div>
                <h3 className="type-h3 text-body">No live service scheduled</h3>
                <p className="mt-2 max-w-reading leading-relaxed text-soft">
                  There is no live broadcast planned for {name} at this time. When a service is
                  scheduled, a countdown and the live player will appear here automatically.
                </p>
                {config.contactHref && (
                  <a href={config.contactHref} className="link-arrow mt-4 inline-block text-sm">
                    {config.contactLabel ?? 'Contact the family'} &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={0.05}>
          <div className="card-raised mt-8 p-6 sm:p-8">
            {status === 'upcoming' && (
              <div className="mb-8">
                <Countdown iso={scheduledStreamTime} />
              </div>
            )}

            {status === 'ended' && (
              <p className="mb-6 max-w-reading text-sm leading-relaxed text-soft">
                The live service has ended. The full recording is preserved below and will remain in
                the memorial for family and friends to revisit at any time.
              </p>
            )}

            {youtubeLiveId ? (
              <StreamPlayer
                videoId={youtubeLiveId}
                title={name + ' — ' + (status === 'ended' ? 'service recording' : 'live service')}
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-forest-deep text-center">
                <p className="max-w-sm px-6 text-sm text-sage">
                  The player will appear here once the broadcast link is added.
                </p>
              </div>
            )}

            {streamInstructions && (
              <p className="mt-5 font-display text-lg italic leading-relaxed text-brass">
                {streamInstructions}
              </p>
            )}

            <ViewerInstructions note={streamInstructions} />
          </div>
        </Reveal>
      )}
    </div>
  );
}
