import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Module-level bus so only one track plays at a time globally (grief UX). */
const stopOthers = new EventTarget();
const STOP_EVENT = 'mg-audio-stop';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * AudioPlayer — voice notes (design.md §7.8). Parchment-deep well, circular
 * Fraunces-initial avatar, title, "Voice note · 0:42" meta, custom 48px
 * evergreen play disc, thin brass progress line, time readout, and 48 soft
 * sage waveform bars that fill brass as it plays. Never autoplays.
 *
 * If `src` is omitted the player simulates playback for `durationSeconds`
 * (placeholder behaviour until the family uploads a real recording).
 */
export default function AudioPlayer({
  title,
  durationSeconds = 42,
  src,
  addedBy,
  kind = 'Voice note',
  avatarInitial,
  className,
}: {
  title: string;
  durationSeconds?: number;
  /** Optional real audio file URL. */
  src?: string;
  addedBy?: string;
  kind?: string;
  avatarInitial?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  // Deterministic soft waveform heights (48 bars)
  const bars = useMemo(() => {
    const out: number[] = [];
    let seed = title.length * 7 + 3;
    for (let i = 0; i < 48; i++) {
      seed = (seed * 16807) % 2147483647;
      const wave = Math.sin(i * 0.55) * 0.5 + 0.5;
      out.push(0.25 + 0.75 * (0.35 * wave + 0.65 * (seed / 2147483647)));
    }
    return out;
  }, [title]);

  const stop = () => {
    setPlaying(false);
    cancelAnimationFrame(rafRef.current);
    if (audioRef.current) audioRef.current.pause();
  };

  useEffect(() => {
    const onStop = (e: Event) => {
      if ((e as CustomEvent).detail !== title) stop();
    };
    stopOthers.addEventListener(STOP_EVENT, onStop);
    return () => {
      stopOthers.removeEventListener(STOP_EVENT, onStop);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }
    stopOthers.dispatchEvent(new CustomEvent(STOP_EVENT, { detail: title }));
    setPlaying(true);
    if (src) {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.addEventListener('ended', () => {
          stop();
          setElapsed(0);
        });
      }
      audioRef.current.currentTime = elapsed >= durationSeconds ? 0 : elapsed;
      void audioRef.current.play().catch(() => setPlaying(false));
    }
    startRef.current = performance.now() - elapsed * 1000;
    const tick = (now: number) => {
      const next = (now - startRef.current) / 1000;
      if (next >= durationSeconds) {
        setElapsed(0);
        setPlaying(false);
        return;
      }
      setElapsed(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const progress = Math.min(1, elapsed / durationSeconds);
  const litBars = Math.floor(progress * bars.length);
  const initial = (avatarInitial ?? title.trim().charAt(0) ?? 'M').toUpperCase();

  return (
    <div className={cn('card-well p-4', className)}>
      <div className="flex items-center gap-4">
        {/* Avatar / waveform thumbnail */}
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest font-display text-lg text-brass-soft" aria-hidden>
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-body">{title}</p>
          <p className="type-meta mt-0.5 text-soft">
            {kind} · {formatTime(durationSeconds)}
            {addedBy ? ` · added by ${addedBy}` : ''}
          </p>
        </div>

        {/* 48px play disc */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          aria-pressed={playing}
          className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-evergreen text-bone transition-colors duration-200 hover:bg-evergreen-bright"
        >
          {playing ? <Pause size={18} aria-hidden /> : <Play size={18} className="ml-0.5" aria-hidden />}
        </button>
      </div>

      {/* Waveform */}
      <div className="mt-3 flex h-10 items-end gap-[2px]" aria-hidden>
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn('flex-1 rounded-full transition-colors duration-150', i < litBars ? 'bg-brass' : 'bg-sage/50')}
            style={{ height: `${Math.round(h * 100)}%` }}
          />
        ))}
      </div>

      {/* Brass progress line + time readout */}
      <div className="mt-2 flex items-center gap-3">
        <div className="h-px flex-1 bg-sage/30">
          <div className="h-px bg-brass transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="type-meta flex-none text-soft">
          {formatTime(elapsed)} / {formatTime(durationSeconds)}
        </span>
      </div>
    </div>
  );
}
