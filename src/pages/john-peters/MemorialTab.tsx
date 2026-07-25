import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Download, MapPin, Mic, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import AudioPlayer from '@/components/AudioPlayer';
import PlaylistCard from '@/components/PlaylistCard';
import PrivacyBadge from '@/components/PrivacyBadge';
import type { PrivacyLevel } from '@/components/PrivacyBadge';
import QRShareBlock from '@/components/QRShareBlock';
import Timeline from '@/components/Timeline';
import { LightACandle } from '@/components/CandleFlame';
import type { Candle } from '@/components/CandleFlame';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import type { ServiceProvider } from '@/components/ServiceProviderRail';
import type { JohnPetersTabId } from '@/pages/JohnPetersMemorial';
import { cn } from '@/lib/utils';

const RAIL_PROVIDERS: ServiceProvider[] = [
  {
    name: 'Horizon Funeral Services (demo)',
    category: 'Funeral Services',
    description: 'Johannesburg–Harare repatriation, handled with quiet precision.',
    contactHref: 'mailto:admin@memoryglen.com?subject=Horizon%20Funeral%20Services',
    tier: 'featured',
  },
  {
    name: 'Msasa Florists',
    category: 'Florist',
    description: 'Wreaths & grave flowers, Harare & surrounds.',
    tier: 'standard',
  },
  {
    name: 'Glen View Catering',
    category: 'Caterer',
    description: 'Funeral catering for gatherings of every size.',
    tier: 'standard',
  },
  {
    name: 'Eternal Stone Tombstones',
    category: 'Tombstone Maker',
    phone: '+263 71 555 0119',
    tier: 'basic',
  },
  {
    name: 'ClearStream Funeral Streaming',
    category: 'Livestream Services',
    phone: '+27 11 555 0140',
    tier: 'basic',
  },
];

/* ---------- Section 1 — Life Story ---------- */
function LifeStory() {
  return (
    <section id="jp-story" className="section-pad scroll-mt-36" aria-labelledby="story-heading">
      <Reveal>
        <p className="eyebrow">LIFE STORY</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 id="story-heading" className="type-h2 mt-4 text-body">
          The man who fixed everything.
        </h2>
      </Reveal>
      <div className="type-story mt-8 space-y-6 text-body">
        <Reveal as="div" delay={0.12}>
          <p>
            John Peters believed a locked gate was just a door nobody had asked him to open yet. He
            was born in Mutare on 14 March 1958, the son of Samuel, a teacher, and Ruth, a nurse
            whose kitchen fed a whole street — and he inherited his father's patience and his
            mother's open door.
          </p>
        </Reveal>
        <Reveal as="div" delay={0.16}>
          <p>
            He trained as a carpenter at Mutare Technical College in 1976, and for a while it seemed
            woodwork would be his whole life. Then he joined the church choir, where a soprano named
            Grace Moyo kept standing a little closer than the arrangement required. They married in
            1985, and he built their first table with his own hands.
          </p>
        </Reveal>
        <Reveal as="div" delay={0.2}>
          <p>
            In 2000 he moved to Johannesburg with one bag and his father Samuel's old coat, and
            became facilities manager at a school where he would stay for 26 years. He fixed
            windows, boilers, gates and pews — but colleagues said the real work was elsewhere.
            “Windows were easy,” he liked to say. “It was people who needed maintenance.” He served
            as a deacon for twelve years and was a burial society member for twenty-two, paying his
            subscriptions every month without fail.
          </p>
        </Reveal>
        <Reveal as="div" delay={0.24}>
          <p>
            “We carry each other,” he'd say. “That is the whole constitution.”
          </p>
        </Reveal>
      </div>
      {/* Closing line — the brass rule draws first, then the line */}
      <motion.hr
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="brass-rule-sm mt-12 origin-left"
      />
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
        className="type-quote mt-6 text-body"
      >
        “The gate is open, John. Rest well.”
      </motion.p>
    </section>
  );
}

/* ---------- Section 2 — Photo Gallery + Lightbox (design.md §7.14) ---------- */
const GALLERY = [
  { src: '/john-life-1.jpg', caption: 'Mutare, 1976 — the school he built' },
  { src: '/john-life-2.jpg', caption: 'The choir years' },
  { src: '/john-life-3.jpg', caption: 'Family under the msasa tree' },
  { src: '/john-life-4.jpg', caption: 'Measure twice, cut once' },
  { src: '/john-life-5.jpg', caption: 'N1 north, the road home' },
  { src: '/john-life-6.jpg', caption: 'Beitbridge, 03:15 — the crossing' },
];

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % GALLERY.length));
      if (e.key === 'ArrowLeft')
        setOpen((o) => (o === null ? o : (o - 1 + GALLERY.length) % GALLERY.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section id="jp-photos" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="photos-heading">
      <Reveal>
        <h2 id="photos-heading" className="type-h3 text-body">
          Photographs
        </h2>
        <p className="type-meta mt-2 text-soft">Click any photo to view full-screen.</p>
      </Reveal>
      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4">
        {GALLERY.map((g, i) => (
          <motion.figure
            key={g.src}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.06 }}
            className="group relative break-inside-avoid overflow-hidden rounded-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View photo full-screen: ${g.caption}`}
              className="block w-full"
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-x-0 bottom-0 translate-y-3 bg-parchment-deep/95 px-4 py-2.5 text-left text-xs font-medium text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {g.caption}
              </span>
            </button>
          </motion.figure>
        ))}
      </div>

      {/* Lightbox */}
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
                src={GALLERY[open].src}
                alt={GALLERY[open].caption}
                className="max-h-[70vh] w-full object-contain"
              />
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-ink-soft">
                <span>{GALLERY[open].caption}</span>
                <span className="type-meta">
                  {open + 1} / {GALLERY.length}
                </span>
              </figcaption>
            </motion.figure>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open - 1 + GALLERY.length) % GALLERY.length);
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
                setOpen((open + 1) % GALLERY.length);
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

/* ---------- Section 3 — Voice Note ---------- */
function VoiceNote() {
  return (
    <section id="jp-voice" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="voice-heading">
      <Reveal>
        <h2 id="voice-heading" className="type-h3 text-body">
          His Voice
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-soft">
          John recorded this for the family hub. Press play when you're ready — he says it better
          than we can.
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <AudioPlayer
          className="mt-6"
          title="A greeting for the family — recorded 2019"
          durationSeconds={48}
          addedBy="Grace"
          avatarInitial="J"
        />
      </Reveal>
    </section>
  );
}

/* ---------- Section 4 — His Songs ---------- */
function Songs() {
  return (
    <section id="jp-songs" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="songs-heading">
      <Reveal>
        <h2 id="songs-heading" className="sr-only">
          The Songs He Loved
        </h2>
        <p className="mb-6 max-w-xl leading-relaxed text-soft">
          The hymns and songs that filled his workshop and his Sundays.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <PlaylistCard
          heading="The Songs He Loved"
          spotifyTracks={[
            {
              title: 'Sunday Hymns — compiled by the family',
              artist: 'Spotify playlist',
              thumbnail: '/john-life-2.jpg',
            },
          ]}
          youtubeTracks={[
            { title: 'The hymn sung at his burial', artist: 'YouTube', thumbnail: '/john-life-2.jpg' },
            { title: 'His favourite choir recording', artist: 'YouTube', thumbnail: '/john-life-3.jpg' },
          ]}
          uploadedTracks={[
            {
              title: 'Grace singing at the 30th anniversary',
              artist: 'Family recording',
              durationSeconds: 72,
              addedBy: 'David',
            },
          ]}
          onAddSong={() => {}}
        />
        <p className="type-meta mt-3 text-soft">
          Anyone can suggest a song; guardians approve.
        </p>
      </Reveal>
    </section>
  );
}

/* ---------- Section 5 — Memory Lane ---------- */
const MEMORIES: { name: string; level: PrivacyLevel; text: string }[] = [
  {
    name: 'Grace',
    level: 'inner-circle',
    text: 'I remember when he drove through the night just because I said, on the phone, that the rain sounded lonely.',
  },
  {
    name: 'Michael',
    level: 'inner-circle',
    text: 'Measure twice, cut once, son. That way you only cry once. I am a carpenter because of him.',
  },
  {
    name: 'David',
    level: 'family',
    text: 'I remember when Dad fixed the school gate at midnight before inspection day — and never told anyone it was him.',
  },
  {
    name: 'Mrs Nkosi',
    level: 'public',
    text: "He knew every pipe, every valve, and every teacher's name. When he retired, the staff room felt colder.",
  },
  {
    name: 'A former learner',
    level: 'public',
    text: 'Mr. Peters lent me his own bicycle for my first job interview. I still have a bicycle. I still have the job.',
  },
];

const TIER_EXPLAINERS: Record<PrivacyLevel, string> = {
  'inner-circle':
    "Inner Circle memories are visible only to invited close family — you're seeing it because this is a demonstration.",
  family: 'Family memories are visible to extended family and linked trees — shown here for the demonstration.',
  public: 'Public memories are visible to anyone who visits this memorial.',
};

function MemoryLane() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [text, setText] = useState('');
  const [tier, setTier] = useState<PrivacyLevel>('family');
  const [added, setAdded] = useState<typeof MEMORIES>([]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setAdded((a) => [{ name: 'You', level: tier, text: trimmed }, ...a]);
    setText('');
    setComposerOpen(false);
  };

  return (
    <section id="jp-memories" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="memories-heading">
      <Reveal>
        <h2 id="memories-heading" className="type-h3 text-body">
          Memory Lane
        </h2>
      </Reveal>

      {/* Prompt card — dashed brass outline, 3-step composer */}
      <Reveal delay={0.08}>
        <div className="mt-6 rounded-sm border border-dashed border-brass p-6">
          {!composerOpen ? (
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="flex min-h-12 w-full items-center gap-3 text-left text-soft transition-colors hover:text-body"
            >
              <Mic size={18} className="flex-none text-brass" aria-hidden />
              <span className="font-display text-lg italic">I remember when… — share a memory</span>
            </button>
          ) : (
            <div>
              <p className="type-meta text-soft">Step 1 of 3 — write it, or use voice-to-text</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="I remember when…"
                className="mt-3 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 py-3 text-body placeholder:text-soft"
              />
              <p className="type-meta mt-4 text-soft">Step 2 of 3 — choose who can see it</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['inner-circle', 'family', 'public'] as PrivacyLevel[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setTier(l)}
                    aria-pressed={tier === l}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors',
                      tier === l ? 'border-evergreen bg-evergreen text-bone' : 'border-[color:var(--line)] text-soft hover:text-body',
                    )}
                  >
                    {l === 'inner-circle' ? 'Inner Circle' : l === 'family' ? 'Family' : 'Public'}
                  </button>
                ))}
              </div>
              <p className="type-meta mt-4 text-soft">Step 3 of 3 — share it</p>
              <div className="mt-2 flex items-center gap-4">
                <button type="button" onClick={submit} className="btn btn-evergreen min-h-12 px-5 text-sm">
                  Share memory
                </button>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="min-h-12 px-2 text-sm font-medium text-soft transition-colors hover:text-body"
                >
                  Not now
                </button>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      <ul className="mt-8 space-y-4">
        {[...added, ...MEMORIES].map((m, i) => (
          <motion.li
            key={`${m.name}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(i, 4) * 0.09 }}
            className="card-raised p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="type-meta text-soft">{m.name}</p>
              {/* Badge with hover explainer (demo) */}
              <span className="group relative flex-none">
                <motion.span
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: Math.min(i, 4) * 0.09 + 0.1 }}
                  className="inline-block"
                >
                  <PrivacyBadge level={m.level} />
                </motion.span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute right-0 top-full z-10 mt-2 w-64 rounded-sm bg-forest-deep p-3 text-xs leading-relaxed text-bone opacity-0 shadow-raised transition-opacity duration-200 group-hover:opacity-100"
                >
                  {TIER_EXPLAINERS[m.level]}
                </span>
              </span>
            </div>
            <p className="mt-3 font-display text-lg italic leading-relaxed text-body">“{m.text}”</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Section 6 — Tributes ---------- */
const TRIBUTES = [
  { text: 'A great tree has fallen, and even the birds of three countries feel it.', by: null },
  { text: 'The tomatoes were never just tomatoes. They were love, wrapped in red skin.', by: 'Sarah, London' },
  { text: 'He fixed the boiler, he fixed the pews, he fixed our family. There was nothing John could not mend.', by: 'Grace' },
  { text: 'Every time I use a level, I hear his voice. Measure twice, cut once.', by: 'Michael' },
  { text: 'Thank you for every open gate, Sekuru John.', by: null },
];

function Tributes() {
  const [gateOpen, setGateOpen] = useState(false);
  useEffect(() => {
    if (!gateOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGateOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gateOpen]);

  return (
    <section id="jp-tributes" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="tributes-heading">
      <Reveal>
        <h2 id="tributes-heading" className="type-h3 text-body">
          Tributes
        </h2>
      </Reveal>
      <ul className="mt-8 space-y-8">
        {TRIBUTES.map((t, i) => (
          <motion.li
            key={t.text}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.08 }}
          >
            <blockquote>
              <span aria-hidden className="font-display text-3xl leading-none text-brass">
                “
              </span>
              <p className="type-quote inline text-body">{t.text}”</p>
              {t.by && <footer className="type-meta mt-2 text-soft">— {t.by}</footer>}
            </blockquote>
          </motion.li>
        ))}
      </ul>
      <Reveal delay={0.1}>
        <button
          type="button"
          onClick={() => setGateOpen(true)}
          className="link-arrow mt-8 text-sm"
        >
          Leave a tribute
        </button>
      </Reveal>

      {/* Sign-in gate modal */}
      <AnimatePresence>
        {gateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-deep/[0.88] p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Sign in to leave a tribute"
            onClick={() => setGateOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md rounded-sm bg-parchment p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-display text-xl text-ink">A respectful space</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                To keep this a respectful space, please sign in or create an account.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/create" className="btn btn-evergreen min-h-12">
                  Sign in or create an account
                </Link>
                <button
                  type="button"
                  onClick={() => setGateOpen(false)}
                  className="min-h-12 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  Not now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Section 7 — Digital Candles ---------- */

/** Candle field strip — ~24 flames, max ~10 animating (grief-UX performance rule). */
function CandleField() {
  return (
    <div className="mt-8 flex flex-wrap items-end gap-x-3 gap-y-2" aria-hidden>
      <style>{`
        .jp-field-flame { transform-origin: 12px 18px; }
        .jp-field-flame.jp-anim { animation: jp-field-flicker 2.4s ease-in-out infinite; }
        .jp-field-flame.jp-anim:nth-child(2) { animation-delay: 0.4s; }
        .jp-field-flame.jp-anim:nth-child(3) { animation-delay: 0.9s; }
        .jp-field-flame.jp-anim:nth-child(4) { animation-delay: 1.3s; }
        .jp-field-flame.jp-anim:nth-child(5) { animation-delay: 0.2s; }
        .jp-field-flame.jp-anim:nth-child(6) { animation-delay: 1.7s; }
        .jp-field-flame.jp-anim:nth-child(7) { animation-delay: 0.7s; }
        .jp-field-flame.jp-anim:nth-child(8) { animation-delay: 1.1s; }
        .jp-field-flame.jp-anim:nth-child(9) { animation-delay: 2s; }
        .jp-field-flame.jp-anim:nth-child(10) { animation-delay: 0.5s; }
        @keyframes jp-field-flicker {
          0%, 100% { transform: scaleY(1); }
          25% { transform: scaleY(1.06) scaleX(0.96); }
          50% { transform: scaleY(0.94) scaleX(1.03); }
          75% { transform: scaleY(1.04) scaleX(0.97); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jp-field-flame.jp-anim { animation: none; }
        }
      `}</style>
      {Array.from({ length: 24 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 40" width="14" height="24" className={cn('jp-field-flame', i < 10 && 'jp-anim')}>
          <rect x="8" y="20" width="8" height="18" rx="1.5" fill="#16302B" />
          <ellipse cx="12" cy="12" rx="6" ry="8" fill="#D9C08A" opacity="0.14" />
          <path d="M12 18 C8 12 10 6 12 2 C14 6 16 12 12 18 Z" fill="#C4A24C" />
          <path d="M12 16 C10 12 11 8 12 5 C13 8 14 12 12 16 Z" fill="#B4552D" opacity="0.8" />
        </svg>
      ))}
    </div>
  );
}

const SEED_CANDLES: Candle[] = [
  { name: 'Rudo — Harare', message: 'Rest well, Sekuru.', date: '12 Aug 2026' },
  { name: 'Tendai — London', message: 'You carried us all, Uncle John.', date: '11 Aug 2026' },
  { name: 'The Moyo family — Toronto', message: 'A gate he opened for us in 2003 changed everything.', date: '11 Aug 2026' },
  { name: 'Chipo — Johannesburg', message: 'Measure twice, cut once. Always.', date: '10 Aug 2026' },
];

function Candles() {
  const [candles, setCandles] = useState<Candle[]>(SEED_CANDLES);
  return (
    <section id="jp-candles" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="candles-heading">
      <Reveal>
        <h2 id="candles-heading" className="type-h3 text-body">
          <span className="type-stat mr-3 align-middle">247</span> Candles Lit
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <CandleField />
      </Reveal>
      <Reveal delay={0.16}>
        <div className="mt-8">
          <LightACandle
            memorialId="john-peters"
            candles={candles}
            onCandleLit={(c) => setCandles((list) => [c, ...list])}
          />
          <p className="type-meta mt-6 text-soft">…from London, Toronto, Harare, Johannesburg.</p>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Sections 8–12 ---------- */
function ShareAndQR() {
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-label="Share this memorial">
      <Reveal>
        <QRShareBlock
          qrSrc="/qr-john.svg"
          url="https://memoryglen.com/memorials/john-peters"
          extended
        />
        <p className="type-meta mt-4 text-soft">
          Order a brass QR plaque for the Glen Forest headstone — links the gravestone to this
          memorial forever.
        </p>
      </Reveal>
    </section>
  );
}

const BOOKLET_ITEMS = [
  'Order of service',
  'Hymn lyrics',
  'Eulogy by David Peters',
  'Family messages from Sarah and Michael',
  'Photo gallery',
  'Family tree snapshot',
];

function MemorialBooklet() {
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-labelledby="booklet2-heading">
      <Reveal>
        <div className="card-well p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <BookOpen size={22} className="mt-1 flex-none text-brass" aria-hidden />
            <div>
              <h2 id="booklet2-heading" className="type-h3 text-body">
                Digital Service Booklet
              </h2>
              <p className="mt-2 leading-relaxed text-soft">
                Order of service, hymns and tributes in one link.
              </p>
            </div>
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {BOOKLET_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-body">
                <span aria-hidden className="h-1 w-1 rounded-full bg-brass" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-evergreen min-h-12 px-5 text-sm">
              <Download size={16} aria-hidden /> Download Service Booklet (PDF)
            </button>
            <button type="button" className="btn btn-outline-evergreen min-h-12 px-5 text-sm">
              View Online
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function RestingPlace({ onNavigate }: { onNavigate: (tab: JohnPetersTabId) => void }) {
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-labelledby="rest-heading">
      <Reveal>
        <h2 id="rest-heading" className="type-h3 text-body">
          Final Resting Place
        </h2>
        <p className="mt-3 leading-relaxed text-soft">
          Glen Forest Memorial Park, Harare — the Peters family plot. Buried 10 August 2026, 11:00.
        </p>
        <div className="card-well mt-6 flex items-center gap-4 p-6">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest text-brass-soft">
            <MapPin size={20} aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-body">Glen Forest Memorial Park</p>
            <p className="type-meta text-soft">Harare, Zimbabwe · Peters family plot</p>
          </div>
        </div>
        <button type="button" onClick={() => onNavigate('glen')} className="link-arrow mt-6 text-sm">
          Visit the Peters Family Glen →
        </button>
      </Reveal>
    </section>
  );
}

function LifeTimeline() {
  return (
    <section id="jp-timeline" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="timeline-heading">
      <Reveal>
        <h2 id="timeline-heading" className="type-h3 mb-10 text-body">
          Life Timeline
        </h2>
      </Reveal>
      <Timeline
        items={[
          { date: '1958', title: 'Born in Mutare', status: 'plain' },
          { date: '1976', title: 'Carpenter, Mutare Technical College', status: 'plain' },
          { date: '1985', title: 'Married Grace Moyo', status: 'plain' },
          { date: '2000', title: 'Moved to Johannesburg', status: 'plain' },
          { date: '2003', title: 'Deacon', status: 'plain' },
          { date: '2020', title: 'Retired', status: 'plain' },
          { date: '2026', title: 'Passed away, Johannesburg', status: 'plain' },
          { date: '2026', title: 'Laid to rest, Glen Forest', status: 'key' },
        ]}
      />
    </section>
  );
}

function ClosingQuote() {
  return (
    <section className="bg-parchment-deep" aria-label="A word from the family">
      <div className="mx-auto max-w-reading px-6 py-16 text-center md:py-20">
        <Reveal>
          <p className="type-quote text-body">
            “MemoryGlen let us plan Dad's journey home, watch the funeral from London, and preserve
            his legacy together. It felt like we were all in Harare saying goodbye as one family.”
          </p>
          <p className="type-meta mt-6 text-soft">— Sarah Miller (née Peters), London</p>
          <Link to="/create" className="btn btn-evergreen mt-8 min-h-12">
            Create your own memorial — free
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Tab ---------- */
export default function MemorialTab({ onNavigate }: { onNavigate: (tab: JohnPetersTabId) => void }) {
  return (
    <div>
      <div className="container-content flex gap-12">
        <div className="w-full min-w-0 max-w-reading">
          <LifeStory />
          <Gallery />
          <VoiceNote />
          <Songs />
          <MemoryLane />
          <Tributes />
          <Candles />
          <ShareAndQR />
          <MemorialBooklet />
          <RestingPlace onNavigate={onNavigate} />
          <LifeTimeline />
        </div>
        <ServiceProviderRail providers={RAIL_PROVIDERS} className="mt-24" />
      </div>
      <ClosingQuote />
    </div>
  );
}
