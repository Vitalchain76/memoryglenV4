import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import type { ServiceProvider } from '@/components/ServiceProviderRail';
import { cn } from '@/lib/utils';

/* ---------- Section 2 data — dual filters ---------- */

type ContentTag =
  | 'Flowers'
  | 'Landscape'
  | 'Sky'
  | 'Candles'
  | 'Symbols'
  | 'Faith'
  | 'Abstract'
  | 'Heritage';
type ContentFilter = 'All' | ContentTag;
type Colour = 'Forest' | 'Gold' | 'Ivory' | 'Dusk Blue' | 'Clay' | 'Wine';
type ColourFilter = 'All' | Colour;

const CONTENT_FILTERS: ContentFilter[] = [
  'All',
  'Flowers',
  'Landscape',
  'Sky',
  'Candles',
  'Symbols',
  'Faith',
  'Abstract',
  'Heritage',
];

/** Swatch dots rendered in the actual palette tone (themes.md §2) */
const COLOUR_SWATCHES: Record<Colour, string> = {
  Forest: '#2E5945',
  Gold: '#C4A24C',
  Ivory: '#F6F1E7',
  'Dusk Blue': '#46586E',
  Clay: '#A65A3C',
  Wine: '#722F3A',
};
const COLOUR_FILTERS: ColourFilter[] = ['All', 'Forest', 'Gold', 'Ivory', 'Dusk Blue', 'Clay', 'Wine'];

/* ---------- Section 3 data — the 16 named themes ---------- */

interface Theme {
  slug: string;
  name: string;
  description: string;
  image: string;
  tags: ContentTag[];
  colour: Colour;
}

const THEMES: Theme[] = [
  { slug: 'msasa-gold', name: 'Msasa Gold', description: 'Golden light through autumn msasa leaves.', image: '/theme-msasa-gold.jpg', tags: ['Landscape'], colour: 'Gold' },
  { slug: 'baobab-dusk', name: 'Baobab Dusk', description: 'Ancient, rooted, watching over the glen.', image: '/theme-baobab-dusk.jpg', tags: ['Landscape'], colour: 'Forest' },
  { slug: 'white-rose', name: 'White Rose', description: 'A white rose symbolizes purity and remembrance.', image: '/theme-white-rose.jpg', tags: ['Flowers'], colour: 'Ivory' },
  { slug: 'protea', name: 'Protea', description: 'The king protea — courage and transformation.', image: '/theme-protea.jpg', tags: ['Flowers'], colour: 'Wine' },
  { slug: 'candles-in-the-dark', name: 'Candles in the Dark', description: 'Candles symbolize remembrance, bringing light to cherished memories.', image: '/theme-candles-dark.jpg', tags: ['Candles'], colour: 'Dusk Blue' },
  { slug: 'eternal-flame', name: 'Eternal Flame', description: 'One flame, tended by many hands.', image: '/theme-flame-eternal.jpg', tags: ['Candles'], colour: 'Gold' },
  { slug: 'cross-on-the-hill', name: 'Cross on the Hill', description: "Faith, quiet and certain, at day's end.", image: '/theme-cross-hill.jpg', tags: ['Faith'], colour: 'Ivory' },
  { slug: 'chapel-light', name: 'Chapel Light', description: 'Stained-glass warmth on old stone.', image: '/theme-sand-dunes.jpg', tags: ['Faith'], colour: 'Gold' },
  { slug: 'still-water', name: 'Still Water', description: 'Be still; the water keeps every reflection.', image: '/theme-still-water.jpg', tags: ['Landscape'], colour: 'Dusk Blue' },
  { slug: 'paper-doves', name: 'Paper Doves', description: 'Released, yet never gone.', image: '/theme-paper-doves.jpg', tags: ['Symbols'], colour: 'Ivory' },
  { slug: 'holding-hands', name: 'Holding Hands', description: 'The hands that held ours, held.', image: '/theme-holding-hands.jpg', tags: ['Symbols'], colour: 'Clay' },
  { slug: 'night-forest', name: 'Night Forest', description: 'Even behind the clouds, their light continues to shine upon us.', image: '/theme-night-forest.jpg', tags: ['Sky'], colour: 'Dusk Blue' },
  { slug: 'rain-mist', name: 'Rain Mist', description: 'The soft rain that ends the drought.', image: '/theme-rain-mist.jpg', tags: ['Sky'], colour: 'Forest' },
  { slug: 'heritage-kente', name: 'Heritage Kente', description: 'Woven threads of generations.', image: '/theme-heritage-kente.jpg', tags: ['Heritage'], colour: 'Gold' },
  { slug: 'quiet-marble', name: 'Quiet Marble', description: 'Museum-calm stone, engraved in brass.', image: '/theme-marble-quiet.jpg', tags: ['Abstract'], colour: 'Ivory' },
  { slug: 'sunflower', name: 'Sunflower', description: 'She turned toward the light her whole life.', image: '/theme-sunflower.jpg', tags: ['Flowers'], colour: 'Gold' },
];

const RAIL_PROVIDERS: ServiceProvider[] = [
  {
    name: 'Heritage Printers',
    category: 'Memorial Booklets & Plaques',
    description: 'Beautifully bound memorial books and brass QR plaques, delivered before the service.',
    contactHref: 'mailto:admin@memoryglen.com?subject=Heritage%20Printers',
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
    phone: '+263 77 555 0143',
    tier: 'basic',
  },
];

/* ---------- Small pieces ---------- */

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-12 items-center gap-2.5 rounded-full border px-5 text-sm font-medium transition-colors duration-150',
        active
          ? 'border-evergreen bg-evergreen text-bone'
          : 'border-[color:var(--line)] bg-surface text-soft hover:border-evergreen hover:text-evergreen',
      )}
    >
      {children}
    </button>
  );
}

function Swatch({ colour }: { colour: Colour }) {
  return (
    <span
      aria-hidden
      className="h-4 w-4 flex-none rounded-full border border-black/15"
      style={{ backgroundColor: COLOUR_SWATCHES[colour] }}
    />
  );
}

/* ---------- Section 3 — Theme card ---------- */

function ThemeCard({
  theme,
  selected,
  onSelect,
  onPreview,
}: {
  theme: Theme;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <article className="card-raised group flex h-full flex-col overflow-hidden border border-transparent transition-colors duration-200 hover:border-brass/50">
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Preview the ${theme.name} theme`}
        className="relative block aspect-[8/5] w-full overflow-hidden"
      >
        <img
          src={theme.image}
          alt={`${theme.name} theme preview`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-forest-deep/0 transition-colors duration-200 group-hover:bg-forest-deep/30"
        >
          <Eye size={28} className="text-bone opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </span>
      </button>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-body">{theme.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-soft">{theme.description}</p>
        <div className="mt-4 flex items-center gap-3">
          {/* Demo — the John Peters sample memorial with theme variables swapped */}
          <Link
            to={`/memorials/john-peters?theme=${theme.slug}`}
            className="btn btn-outline-evergreen flex-1 !min-h-11 px-4 py-2 text-sm transition-all duration-200"
          >
            Demo
          </Link>
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={cn(
              'btn flex-1 !min-h-11 px-4 py-2 text-sm',
              selected ? 'bg-evergreen text-bone' : 'btn-evergreen',
            )}
          >
            {selected && <Check size={14} aria-hidden />}
            {selected ? 'Selected' : 'Select this theme'}
          </button>
        </div>
        {/* Signed out — prompt save-to-account (themes.md §3) */}
        {selected && (
          <p className="mt-3 text-xs leading-relaxed text-soft">
            You're signed out.{' '}
            <Link to="/create" className="text-evergreen underline underline-offset-4">
              Sign in to save this theme to your account →
            </Link>
          </p>
        )}
      </div>
    </article>
  );
}

/* ---------- Section 3.5 — Theme preview lightbox (design.md §7.14) ---------- */

function ThemeLightbox({
  themes,
  index,
  onClose,
  onNavigate,
}: {
  themes: Theme[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;
  const theme = open ? themes[index] : null;

  // Full keyboard support: ESC close, arrows navigate
  useEffect(() => {
    if (!open || themes.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % themes.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + themes.length) % themes.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, index, themes.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && theme && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${theme.name} theme preview`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-forest-deep/[0.88] p-6"
          onClick={onClose}
        >
          {/* Close */}
          <button
            type="button"
            aria-label="Close preview"
            onClick={onClose}
            className="absolute right-6 top-6 flex min-h-12 min-w-12 items-center justify-center rounded-sm text-brass-soft transition-colors hover:text-brass"
          >
            <X size={24} aria-hidden />
          </button>
          {/* Prev / next — brass chevrons */}
          <button
            type="button"
            aria-label="Previous theme"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + themes.length) % themes.length);
            }}
            className="absolute left-4 top-1/2 flex min-h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-sm text-brass transition-colors hover:text-brass-soft md:left-10"
          >
            <ChevronLeft size={32} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next theme"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % themes.length);
            }}
            className="absolute right-4 top-1/2 flex min-h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-sm text-brass transition-colors hover:text-brass-soft md:right-10"
          >
            <ChevronRight size={32} aria-hidden />
          </button>

          {/* Centered image with 24px parchment frame */}
          <motion.figure
            key={theme.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-3xl bg-parchment p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={theme.image} alt={`${theme.name} theme preview`} className="aspect-[8/5] w-full object-cover" />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-display text-lg text-ink">{theme.name}</span>
              <span className="type-meta text-ink-soft">{theme.description}</span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Page ---------- */

/** Themes — `/themes` (themes.md). Sixteen named themes with dual content/colour filters. */
export default function Themes() {
  const [contentFilter, setContentFilter] = useState<ContentFilter>('All');
  const [colourFilter, setColourFilter] = useState<ColourFilter>('All');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      THEMES.filter(
        (t) =>
          (contentFilter === 'All' || t.tags.includes(contentFilter)) &&
          (colourFilter === 'All' || t.colour === colourFilter),
      ),
    [contentFilter, colourFilter],
  );

  return (
    <>
      {/* Section 1 — Header */}
      <section className="section-pad pb-12" aria-labelledby="themes-heading">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow">THEMES</p>
            <h1 id="themes-heading" className="type-h1 mt-4 text-body">
              Designs for every life.
            </h1>
            <p className="type-story mt-4 max-w-reading text-soft">
              Choose a theme for a memorial or a family glen — themes for nature lovers, faith
              traditions, quiet minimalists, and more. You can change it anytime later.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-content pb-16 md:pb-24 xl:flex xl:gap-14">
        <div className="min-w-0 flex-1">
          {/* Section 2 — Dual filter rows */}
          <Reveal>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by content">
                <span className="type-meta mr-1 w-16 flex-none text-soft">Content</span>
                {CONTENT_FILTERS.map((c) => (
                  <Chip key={c} active={contentFilter === c} onClick={() => setContentFilter(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by colour">
                <span className="type-meta mr-1 w-16 flex-none text-soft">Colour</span>
                {COLOUR_FILTERS.map((c) => (
                  <Chip key={c} active={colourFilter === c} onClick={() => setColourFilter(c)}>
                    {c !== 'All' && <Swatch colour={c} />}
                    {c}
                  </Chip>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Section 3 — Theme grid (+ Section 4 "Design your own" cell) */}
          <section className="mt-14" aria-label="Theme gallery" aria-live="polite">
            {visible.length > 0 ? (
              <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visible.map((t, i) => (
                    <motion.li
                      key={t.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut', delay: i * 0.06 }}
                    >
                      <ThemeCard
                        theme={t}
                        selected={selectedSlug === t.slug}
                        onSelect={() => setSelectedSlug(selectedSlug === t.slug ? null : t.slug)}
                        onPreview={() => setLightboxIndex(i)}
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>

                {/* Section 4 — "Design your own" first-class grid cell */}
                <motion.li layout>
                  <div className="flex h-full flex-col items-center justify-center rounded-sm border-2 border-dashed border-brass/70 bg-brass/5 p-8 text-center transition-colors duration-200 hover:border-brass">
                    <img src="/logo-mark.svg" alt="" width={48} height={48} aria-hidden />
                    <h3 className="font-display mt-5 text-xl text-body">Design your own</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-soft">
                      Upload your own image, customize colours, crest, and motto.
                    </p>
                    <Link to="/create" className="btn btn-outline-evergreen mt-6">
                      Open the Studio
                    </Link>
                    <p className="type-meta mt-3 text-soft">Heritage plan feature</p>
                  </div>
                </motion.li>
              </motion.ul>
            ) : (
              <div className="card-well flex flex-col items-center px-6 py-16 text-center">
                <hr className="brass-rule" />
                <p className="type-story mt-8 max-w-reading text-soft">
                  No themes match those filters. Try widening your search — or let our creative team
                  design one just for your family.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContentFilter('All');
                    setColourFilter('All');
                  }}
                  className="btn btn-outline-evergreen mt-8"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* Section 5 — Custom design CTA */}
          <Reveal className="mt-16">
            <div className="card-well flex flex-col items-center gap-6 px-6 py-10 text-center md:flex-row md:justify-between md:text-left">
              <p className="max-w-reading text-base leading-relaxed text-soft">
                Haven't found the perfect design yet? Our creative team will build a custom theme
                for your family or parlour.
              </p>
              <a href="mailto:admin@memoryglen.com" className="btn btn-evergreen flex-none">
                Contact the creative team
              </a>
            </div>
          </Reveal>

          {/* Section 6 — Trust strip */}
          <Reveal className="mt-14">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="type-meta text-soft">
                POPIA compliant · Family-controlled · Recordings stay forever
              </p>
              <Link to="/remember" className="link-arrow text-sm">
                How to write a memorial story <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Service Provider Rail (themes.md) */}
        <ServiceProviderRail className="mt-16 xl:mt-0" providers={RAIL_PROVIDERS} />
      </div>

      {/* Theme preview lightbox */}
      <ThemeLightbox
        themes={visible}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
