import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link2, Music, Play, Plus, Upload } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { cn } from '@/lib/utils';

type Source = 'spotify' | 'youtube' | 'uploaded';

export interface PlaylistTrack {
  title: string;
  artist?: string;
  addedBy?: string;
  durationSeconds?: number;
  /** Uploaded tracks: audio file URL (optional — simulated playback if absent). */
  src?: string;
  /** Spotify/YouTube: embed URL and thumbnail for the click-to-play facade. */
  embedUrl?: string;
  thumbnail?: string;
}

const TABS: { id: Source; label: string }[] = [
  { id: 'spotify', label: 'Spotify' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'uploaded', label: 'Uploaded' },
];

/**
 * PlaylistCard — "Her Songs" music repository (design.md §7.9). Source tabs
 * (Spotify · YouTube · Uploaded). External sources render click-to-play
 * facades over official embeds; uploaded tracks render AudioPlayer rows.
 * Nothing autoplays; AudioPlayer enforces one-track-at-a-time globally.
 */
export default function PlaylistCard({
  heading = 'The Songs She Loved',
  spotifyTracks = [],
  youtubeTracks = [],
  uploadedTracks = [],
  onAddSong,
  className,
}: {
  heading?: string;
  spotifyTracks?: PlaylistTrack[];
  youtubeTracks?: PlaylistTrack[];
  uploadedTracks?: PlaylistTrack[];
  onAddSong?: () => void;
  className?: string;
}) {
  const [tab, setTab] = useState<Source>('spotify');
  const [playingEmbed, setPlayingEmbed] = useState<string | null>(null);

  const tracks: Record<Source, PlaylistTrack[]> = {
    spotify: spotifyTracks,
    youtube: youtubeTracks,
    uploaded: uploadedTracks,
  };
  const active = tracks[tab];

  return (
    <section className={cn('card-raised p-6 sm:p-8', className)} aria-label={heading}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="type-h3 text-body">{heading}</h3>
        {/* Source tabs */}
        <div className="flex gap-1 rounded-sm border border-[color:var(--line)] p-1" role="tablist" aria-label="Playlist source">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
                setPlayingEmbed(null);
              }}
              className={cn(
                'min-h-10 rounded-sm px-4 text-sm font-medium transition-colors duration-200',
                tab === t.id ? 'bg-evergreen text-bone' : 'text-soft hover:text-body',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          {active.length === 0 ? (
            /* Empty state (grief-UX, gentle) */
            <div className="card-well flex flex-col items-center px-6 py-12 text-center">
              <Music size={28} className="text-brass" aria-hidden />
              <p className="type-quote mt-4 max-w-md text-body">
                Every life has a soundtrack. Add the songs that meant something.
              </p>
              <button type="button" onClick={onAddSong} className="btn btn-evergreen mt-6 min-h-12">
                <Plus size={16} aria-hidden /> Add Song
              </button>
              <p className="mt-3 flex items-center gap-2 text-xs text-soft">
                <Link2 size={12} aria-hidden /> paste a Spotify / YouTube link
                <span aria-hidden>·</span>
                <Upload size={12} aria-hidden /> or upload a recording
              </p>
            </div>
          ) : tab === 'uploaded' ? (
            <ul className="space-y-3">
              {active.map((t) => (
                <li key={t.title}>
                  <AudioPlayer
                    title={t.title}
                    kind="Uploaded track"
                    durationSeconds={t.durationSeconds ?? 60}
                    src={t.src}
                    addedBy={t.addedBy}
                    avatarInitial={t.artist?.charAt(0)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            /* Spotify / YouTube click-to-play facades */
            <ul className="grid gap-4 sm:grid-cols-2">
              {active.map((t) => (
                <li key={t.title} className="card-well overflow-hidden">
                  {playingEmbed === t.title && t.embedUrl ? (
                    <iframe
                      src={t.embedUrl}
                      title={`${t.title} — ${tab === 'spotify' ? 'Spotify' : 'YouTube'} player`}
                      className="aspect-video w-full"
                      allow="encrypted-media; fullscreen"
                      loading="lazy"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingEmbed(t.title)}
                      className="group relative block aspect-video w-full"
                      aria-label={`Play ${t.title} on ${tab === 'spotify' ? 'Spotify' : 'YouTube'}`}
                    >
                      <img
                        src={t.thumbnail ?? '/theme-msasa-gold.jpg'}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute inset-0 bg-forest-deep/45 transition-colors duration-200 group-hover:bg-forest-deep/30" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-evergreen text-bone transition-colors group-hover:bg-evergreen-bright">
                          <Play size={20} className="ml-0.5" aria-hidden />
                        </span>
                      </span>
                    </button>
                  )}
                  <div className="p-4">
                    <p className="text-sm font-medium text-body">{t.title}</p>
                    <p className="type-meta mt-0.5 text-soft">
                      {t.artist ?? (tab === 'spotify' ? 'Spotify' : 'YouTube')}
                      {t.addedBy ? ` · added by ${t.addedBy}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
