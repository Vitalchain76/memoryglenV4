import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Download, FileText, Globe, MapPin, Video, X } from 'lucide-react';
import DemoBanner from '@/components/DemoBanner';
import AudioPlayer from '@/components/AudioPlayer';
import PlaylistCard from '@/components/PlaylistCard';
import QRShareBlock from '@/components/QRShareBlock';
import Reveal from '@/components/Reveal';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import MemorialTabShell from '@/components/MemorialTabShell';
import UserMemorial from '@/pages/UserMemorial';
import { buildStandardTabs } from '@/components/memorialStandard';
import type { RoomSpec } from '@/components/memorialStandard';
import FamilyTree from '@/components/family/FamilyTree';
import { buildDatasetTree } from '@/data/datasetFamilyTree';
import type { ServiceProvider } from '@/components/ServiceProviderRail';
import StatBand from '@/components/StatBand';
import Timeline from '@/components/Timeline';
import { LightACandle } from '@/components/CandleFlame';
import type { Candle } from '@/components/CandleFlame';
import {
  getMemorial,
  hasFeature,
  memorialUrl,
  possessive,
  splitAttribution,
  voiceNoteSeconds,
} from '@/data/memorials';
import type { Memorial } from '@/data/memorials';
import { HYMN_IMAGE, captionFromSearch, getAssets } from '@/data/memorialAssets';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const RAIL_PROVIDERS: ServiceProvider[] = [
  {
    name: 'Horizon Funeral Services (demo)',
    category: 'Funeral Services',
    description: 'Dignified funerals and repatriation support across the region.',
    contactHref: 'mailto:admin@memoryglen.com?subject=Horizon%20Funeral%20Services',
    tier: 'featured',
  },
  {
    name: 'Eternal Stone Tombstones',
    category: 'Tombstone Maker',
    description: 'Granite headstones, engraved with care.',
    tier: 'standard',
  },
  {
    name: 'Msasa Florists',
    category: 'Florist',
    description: 'Wreaths & grave flowers.',
    tier: 'basic',
  },
  {
    name: 'ClearStream Funeral Streaming',
    category: 'Livestream Services',
    description: 'Funeral streaming for family abroad.',
    tier: 'basic',
  },
];

/* ---------- Hero ---------- */

function PortraitPlate({ memorial }: { memorial: Memorial }) {
  const assets = getAssets(memorial.slug);
  return (
    <div className="inline-block rounded-sm bg-parchment p-3 pb-4">
      {assets.portraitSrc ? (
        <img
          src={assets.portraitSrc}
          alt={`Portrait of ${memorial.name}`}
          width={200}
          height={250}
          className="rounded-sm object-cover"
          style={{ width: 200, height: 250 }}
        />
      ) : (
        <div
          role="img"
          aria-label={`Placeholder portrait plate for ${memorial.name}`}
          className={cn(
            'flex items-center justify-center rounded-sm bg-gradient-to-b',
            assets.portraitTone,
          )}
          style={{ width: 200, height: 250 }}
        >
          <img src="/logo-mark.svg" alt="" width={72} height={72} className="opacity-70" />
        </div>
      )}
      <hr className="brass-rule mx-auto mt-4" aria-hidden />
    </div>
  );
}

function Hero({ memorial, onLightCandle }: { memorial: Memorial; onLightCandle: () => void }) {
  return (
    <section className="bg-forest pb-16 pt-12 text-center text-bone md:pb-20 md:pt-16" aria-labelledby="memorial-name">
      <div className="container-content flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
            <Globe size={12} aria-hidden /> Public Memorial
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sage px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage">
            <Check size={12} aria-hidden /> Published
          </span>
          {hasFeature(memorial, 'livestream') && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sage px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage">
              <Video size={12} aria-hidden /> Livestream
            </span>
          )}
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="mt-8"
        >
          <PortraitPlate memorial={memorial} />
        </motion.figure>

        <motion.h1
          id="memorial-name"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="type-display mt-8 text-bone"
        >
          {memorial.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="type-meta mt-4 font-medium tracking-[0.2em] text-brass"
        >
          {memorial.years}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.72 }}
          className="mt-5 font-display text-2xl italic text-bone/90"
        >
          “{memorial.tagline}”
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.82 }}
          className="type-meta mt-3 text-sage"
        >
          {memorial.location}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.92 }}
          className="mt-10"
        >
          <StatBand
            onDark
            stats={[
              { value: String(memorial.candles), label: 'Candles' },
              { value: String(memorial.tributes.length), label: 'Tributes' },
              { value: String(memorial.images.gallery.length), label: 'Photographs' },
              { value: String(memorial.timeline.length), label: 'Milestones' },
            ]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button type="button" onClick={onLightCandle} className="btn btn-evergreen min-h-12">
            Light a Candle
          </button>
          <a href="#mg-share" className="btn btn-outline-bone min-h-12">
            Share
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Livestream ---------- */

function Livestream({ memorial }: { memorial: Memorial }) {
  return (
    <Reveal as="section" aria-label="Funeral livestream">
      <div className="card-well border border-brass/40 p-6 sm:p-8">
        <p className="eyebrow">Livestream</p>
        <h3 className="type-h3 mt-4 text-body">The service, streamed for family abroad</h3>
        <p className="mt-3 max-w-reading leading-relaxed text-soft">
          {memorial.name}’s service was streamed so that family who could not travel could be
          present. The recording stays here for those who need to return to it. This is a
          demonstration memorial, so no recording is attached.
        </p>
        <div className="mt-6 flex aspect-video w-full items-center justify-center rounded-sm bg-forest-deep">
          <span className="flex flex-col items-center gap-3 text-sage">
            <Video size={28} aria-hidden />
            <span className="type-meta">Recording available to invited family</span>
          </span>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- Gallery ---------- */

function Gallery({ memorial }: { memorial: Memorial }) {
  const assets = getAssets(memorial.slug);
  const items = memorial.images.gallery.map((brief, i) => ({
    src: assets.gallery[i] ?? assets.gallery[0],
    caption: captionFromSearch(brief.stockSearch),
  }));
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % items.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + items.length) % items.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items.length]);

  return (
    <section aria-labelledby="family-memories">
      <Reveal>
        <h3 id="family-memories" className="type-h3 text-body">
          Family Memories
        </h3>
        <p className="type-meta mt-2 text-soft">Click any photo to view full-screen.</p>
        <p className="mt-3 max-w-reading leading-relaxed text-soft">{memorial.galleryCaption}</p>
      </Reveal>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((g, i) => (
          <Reveal as="li" key={`${g.src}-${i}`} delay={Math.min(i, 3) * 0.06}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View photo full-screen: ${g.caption}`}
              className="group block w-full overflow-hidden rounded-sm"
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
            <p className="type-meta mt-2 text-soft">{g.caption}</p>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-deep/[0.88] p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={() => setOpen(null)}
          >
            <motion.figure
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-4xl bg-parchment p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[open].src}
                alt={items[open].caption}
                className="max-h-[70vh] w-full object-contain"
              />
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-ink-soft">
                <span>{items[open].caption}</span>
                <span className="type-meta">
                  {open + 1} / {items.length}
                </span>
              </figcaption>
            </motion.figure>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open - 1 + items.length) % items.length);
              }}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-brass transition-colors hover:text-brass-soft"
            >
              <ChevronLeft size={28} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open + 1) % items.length);
              }}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-brass transition-colors hover:text-brass-soft"
            >
              <ChevronRight size={28} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Close photo viewer"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center text-bone transition-colors hover:text-brass-soft"
            >
              <X size={22} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Page ---------- */

export default function MemorialPage() {
  const { slug } = useParams();
  const memorial = getMemorial(slug);

  // Not in the static dataset → it may be a memorial a family created, which
  // lives in the database. UserMemorial handles its own not-found state.
  if (!memorial) {
    if (!slug) return <Navigate to="/memorials" replace />;
    return <UserMemorial key={slug} slug={slug} />;
  }

  // A real person whose page the family has not yet written.
  if (memorial.awaitingContent) {
    return <AwaitingContent key={memorial.slug} memorial={memorial} />;
  }

  // Keyed by slug so all page state resets cleanly when navigating between memorials.
  return <MemorialBody key={memorial.slug} memorial={memorial} />;
}

/**
 * A real person whose memorial the family has not yet written. Rather than
 * render a page of empty sections, we show what is known and say plainly that
 * the rest is coming. No placeholder prose, no invented content.
 */
function AwaitingContent({ memorial }: { memorial: Memorial }) {
  return (
    <div>
      <section className="bg-forest pb-16 pt-12 text-center text-bone md:pb-20 md:pt-16">
        <div className="container-content flex flex-col items-center">
          <h1 className="type-display text-bone">{memorial.name}</h1>
          <p className="type-meta mt-4 font-medium tracking-[0.2em] text-brass">{memorial.years}</p>
          {memorial.familyRelation && (
            <p className="type-meta mt-3 text-sage">{memorial.familyRelation}</p>
          )}
        </div>
      </section>

      <div className="container-content py-16 md:py-24">
        <div className="mx-auto max-w-reading space-y-10">
          {memorial.restingPlace.name && (
            <Reveal>
              <p className="eyebrow">Resting Place</p>
              <p className="type-h3 mt-3 flex items-center gap-2 text-body">
                <MapPin size={20} className="text-brass" aria-hidden /> {memorial.restingPlace.name}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.08}>
            <div className="rounded-sm border border-dashed border-brass/60 p-6 sm:p-8">
              <p className="type-story text-body">
                This memorial is being written by the family.
              </p>
              <p className="mt-3 leading-relaxed text-soft">
                {memorial.name}’s life story, photographs and tributes will be added here.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <QRShareBlock
              qrSrc={`/qr-${memorial.slug}.svg`}
              url={memorialUrl(memorial)}
              title={`Share ${memorial.name}’s memorial`}
            />
          </Reveal>

          <Reveal delay={0.2}>
            <Link to="/memorials/virginia-dadirayi-chiimba?tab=glen" className="link-arrow text-sm">
              Return to the Family Glen <ArrowRight size={14} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function MemorialBody({ memorial }: { memorial: Memorial }) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const Poss = possessive(memorial);
  const assets = getAssets(memorial.slug);
  const url = memorialUrl(memorial);
  const scrollToCandles = () =>
    document.getElementById('mg-candles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // ---- THE STANDARD FIVE ROOMS (see components/memorialStandard.ts) ----
  // Declared against one contract so this page, Virginia and John all behave
  // identically. Rooms with no content are dropped automatically.
  const rooms: RoomSpec[] = [
    {
      id: 'journey',
      sections: [
        { id: 'mg-livestream', label: 'Livestream', available: hasFeature(memorial, 'livestream'),
          content: <Livestream memorial={memorial} /> },
        { id: 'mg-timeline', label: 'Life Timeline', available: memorial.timeline.length > 0, content: (
<section aria-labelledby="life-timeline">
          <Reveal>
            <p className="eyebrow">{Poss} Journey</p>
            <h3 id="life-timeline" className="type-h3 mt-4 text-body">
              Life Timeline
            </h3>
          </Reveal>
          <div className="mt-8">
            <Timeline
              items={memorial.timeline.map((t, i) => ({
                date: t.year,
                title: t.title,
                body: t.text,
                status: i === memorial.timeline.length - 1 ? ('key' as const) : ('plain' as const),
              }))}
            />
          </div>
        </section>
        ) },
      ],
    },
    {
      id: 'memorial',
      sections: [
        { id: 'mg-biography', label: 'Life Story', available: memorial.biography.length > 0, content: (
<section aria-labelledby="their-life">
          <Reveal>
            <p className="eyebrow">Biography</p>
            <h2 id="their-life" className="type-h2 mt-4 text-body">
              {memorial.biographyTitle}
            </h2>
          </Reveal>
          <div className="mt-6 space-y-5">
            {memorial.biography.map((paragraph, i) => (
              <Reveal key={i} delay={Math.min(i, 3) * 0.06}>
                <p className="type-story text-body">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </section>
        ) },
        { id: 'mg-tributes', label: 'Tributes', available: memorial.tributes.length > 0, content: (
<section aria-labelledby="tributes">
          <Reveal>
            <p className="eyebrow">With love</p>
            <h2 id="tributes" className="type-h2 mt-4 text-body">
              {memorial.tributesTitle}
            </h2>
          </Reveal>
          <ul className="mt-8 space-y-6">
            {memorial.tributes.map((t, i) => {
              const { text, attribution } = splitAttribution(t);
              return (
                <Reveal as="li" key={i} delay={Math.min(i, 4) * 0.08}>
                  <blockquote className="card-raised p-6 sm:p-8">
                    <span aria-hidden className="font-display text-4xl leading-none text-brass">
                      “
                    </span>
                    <p className="type-quote mt-2 text-body">{text}</p>
                    {attribution && (
                      <footer className="type-meta mt-4 text-soft">— {attribution}</footer>
                    )}
                  </blockquote>
                </Reveal>
              );
            })}
          </ul>
        </section>
        ) },
        { id: 'mg-scripture', label: 'Scripture', available: memorial.scripture.length > 0, content: (
<Reveal as="section" aria-label="Scripture">
          <div className="card-well border border-brass/40 p-6 sm:p-8">
            <p className="eyebrow">Scripture</p>
            <div className="mt-6 space-y-6">
              {memorial.scripture.map((verse, i) => (
                <blockquote key={i}>
                  <p className="type-quote text-body">“{verse.text}”</p>
                  {verse.reference && (
                    <footer className="type-meta mt-3 uppercase tracking-[0.14em] text-brass">
                      — {verse.reference}
                    </footer>
                  )}
                </blockquote>
              ))}
            </div>
          </div>
        </Reveal>
        ) },
        { id: 'mg-hymn', label: 'Hymn', available: Boolean(memorial.hymn.original), content: (
<Reveal as="section" aria-label="A hymn they loved">
          <div className="card-raised flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <img
              src={HYMN_IMAGE}
              alt="Hymn book and choir robes on a church pew"
              width={220}
              height={147}
              loading="lazy"
              className="w-full flex-none rounded-sm object-cover sm:w-[220px]"
            />
            <div>
              <p className="eyebrow">A Hymn {Poss === 'His' ? 'He' : 'She'} Loved</p>
              <p className="type-quote mt-4 text-body">“{memorial.hymn.original}”</p>
              <p className="mt-3 text-sm italic text-soft">{memorial.hymn.translation}</p>
              <p className="type-meta mt-3 text-soft">{memorial.hymn.language}</p>
            </div>
          </div>
        </Reveal>
        ) },
        { id: 'mg-poem', label: 'Poem', available: memorial.poem.lines.length > 0, content: (
<Reveal as="section" aria-label={memorial.poem.title}>
          <div className="text-center">
            <hr className="brass-rule mx-auto" aria-hidden />
            <h3 className="type-h3 mt-8 text-body">{memorial.poem.title}</h3>
            <div className="type-quote mt-6 space-y-1.5 text-body">
              {memorial.poem.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="type-quote mt-6 text-body">{memorial.poem.closing}</p>
            <hr className="brass-rule mx-auto mt-8" aria-hidden />
          </div>
        </Reveal>
        ) },
        { id: 'mg-song', label: 'Music', available: Boolean(memorial.favouriteSong.title), content: (
<section aria-labelledby="their-songs">
          <Reveal>
            <div className="card-well mb-6 p-6 sm:p-8">
              <p className="eyebrow">{Poss} Favourite Song</p>
              <h3 id="their-songs" className="type-h3 mt-4 text-body">
                {memorial.favouriteSong.title}{' '}
                <span className="text-soft">· {memorial.favouriteSong.artist}</span>
              </h3>
              <p className="mt-4 max-w-reading leading-relaxed text-soft">
                {memorial.favouriteSong.description}
              </p>
              <a
                href={`https://music.youtube.com/search?q=${encodeURIComponent(
                  memorial.favouriteSong.youtubeSearch,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-arrow mt-4 inline-flex text-sm"
              >
                Open in YouTube Music
              </a>
            </div>
            <PlaylistCard
              heading={`The Songs ${Poss === 'His' ? 'He' : 'She'} Loved`}
              youtubeTracks={[
                {
                  title: memorial.favouriteSong.title,
                  artist: `${memorial.favouriteSong.artist} · YouTube Music`,
                  thumbnail: assets.gallery[0],
                },
              ]}
              spotifyTracks={[
                {
                  title: `${memorial.name} — family playlist`,
                  artist: 'Spotify',
                  thumbnail: HYMN_IMAGE,
                },
              ]}
              uploadedTracks={[
                {
                  title: 'Choir recording — family upload',
                  artist: 'Family recording',
                  addedBy: 'the family',
                  durationSeconds: 96,
                },
              ]}
              onAddSong={() => {
                window.location.href = `mailto:admin@memoryglen.com?subject=${encodeURIComponent(
                  `Add a song for ${memorial.name}`,
                )}`;
              }}
            />
            <p className="type-meta mt-3 text-soft">{memorial.favouriteSong.playlistNote}</p>
          </Reveal>
        </section>
        ) },
        { id: 'mg-gallery', label: 'Photographs', available: memorial.images.gallery.length > 0,
          content: <Gallery memorial={memorial} /> },
        { id: 'mg-voice', label: 'Voice', available: Boolean(memorial.voiceNote.title), content: (
<Reveal as="section" aria-label="Voice note">
          <div>
            <p className="eyebrow">{Poss} Voice</p>
            <h3 className="type-h3 mt-4 text-body">{memorial.voiceNote.title}</h3>
            <p className="mt-3 max-w-reading leading-relaxed text-soft">
              {memorial.voiceNote.description}
            </p>
            <AudioPlayer
              title={memorial.voiceNote.title}
              durationSeconds={voiceNoteSeconds(memorial)}
              avatarInitial={memorial.name.charAt(0)}
              className="mt-6"
            />
          </div>
        </Reveal>
        ) },
        { id: 'mg-booklets', label: 'Booklets', available: memorial.booklets.length > 0, content: (
<section aria-labelledby="booklets">
          <Reveal>
            <h3 id="booklets" className="type-h3 text-body">
              Memorial Booklets
            </h3>
            <p className="mt-3 max-w-reading leading-relaxed text-soft">
              Programme, invitations, and tribute booklets created to honour {memorial.name}’s
              life. These are demonstration documents.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {memorial.booklets.map((title, i) => (
              <Reveal as="li" key={title} delay={i * 0.06}>
                <div className="card-raised flex h-full items-center gap-4 p-5">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-sm bg-well text-soft">
                    <FileText size={22} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-body">{title}</span>
                    <span className="type-meta mt-0.5 block text-soft">PDF · demo</span>
                  </span>
                  <span className="btn btn-outline-evergreen !min-h-11 flex-none px-4 py-1.5 text-sm">
                    <Download size={14} aria-hidden /> Download
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
        ) },
        { id: 'mg-candles', label: 'Candles', available: true, content: (
<section id="mg-candles" className="scroll-mt-36" aria-labelledby="candles-heading">
          <Reveal>
            <h3 id="candles-heading" className="type-h3 text-body">
              <span className="type-stat mr-3 align-middle">{memorial.candles}</span> Candles Lit
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <LightACandle
                memorialId={memorial.slug}
                candles={candles}
                onCandleLit={(c) => setCandles((list) => [c, ...list])}
              />
            </div>
          </Reveal>
        </section>
        ) },
      ],
    },
    {
      id: 'glen',
      sections: [
        { id: 'mg-resting', available: Boolean(memorial.restingPlace.name), content: (
<section aria-labelledby="resting-place">
          <Reveal>
            <p className="eyebrow">Final Resting Place</p>
            <h3 id="resting-place" className="type-h3 mt-4 flex items-center gap-2 text-body">
              <MapPin size={20} className="text-brass" aria-hidden /> {memorial.restingPlace.name}
            </h3>
            <p className="mt-4 max-w-reading leading-relaxed text-soft">
              {memorial.restingPlace.description}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8" id="mg-share">
              <p className="eyebrow mb-4">A Plaque for {Poss} Resting Place</p>
              <QRShareBlock
                qrSrc={`/qr-${memorial.slug}.svg`}
                url={url}
                extended
                title={`Order a brass QR plaque for ${memorial.name}’s resting place`}
              />
            </div>
          </Reveal>
        </section>
        ) },
      ],
    },
    {
      // Always shown. FamilyTree renders its own empty state, which is honest
      // and keeps every memorial looking like the same product.
      id: 'tree',
      alwaysShow: true,
      sections: [
        { id: 'mg-tree', available: true, content: <FamilyTree data={buildDatasetTree(memorial)} /> },
      ],
    },
  ];

  const tabs = buildStandardTabs(rooms, (sections) => (
    <div className="container-content py-16 md:py-24">
      <div className="flex flex-col gap-12 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-16 md:space-y-24">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-36">
              {s.content}
            </section>
          ))}
        </div>
        <ServiceProviderRail providers={RAIL_PROVIDERS} belowStickyTabs />
      </div>
    </div>
  ));


  return (
    <div>
      {!bannerDismissed ? (
        <div className="relative">
          <DemoBanner />
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss demonstration notice"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-bone/70 transition-colors hover:text-bone"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setBannerDismissed(false)}
          className="fixed bottom-4 left-4 z-50 rounded-full border border-brass bg-forest-deep px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brass-soft shadow-raised"
        >
          Demo
        </button>
      )}

      {memorial.communityMemorial && (
        <div className="border-b border-[color:var(--line)] bg-well">
          <div className="container-content py-3">
            <p className="text-xs leading-relaxed text-soft">
              Unofficial community memorial — not affiliated with or endorsed by the estate.
            </p>
          </div>
        </div>
      )}

      <Hero memorial={memorial} onLightCandle={scrollToCandles} />

      <MemorialTabShell tabs={tabs} defaultTab="memorial" />

      <section className="bg-parchment-deep" aria-label="Create a memorial">
        <div className="mx-auto max-w-reading px-6 py-16 text-center md:py-20">
          <Reveal>
            <hr className="brass-rule mx-auto" aria-hidden />
            <p className="type-quote mt-8 text-body">
              Every life deserves a place where it can be found again.
            </p>
            <Link to="/create" className="btn btn-evergreen mt-8 min-h-12">
              Create a Memorial — free
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
