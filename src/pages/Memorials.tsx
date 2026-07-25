import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Flame, Mic, Search, Users, Video } from 'lucide-react';
import Reveal from '@/components/Reveal';
import PrivacyBadge from '@/components/PrivacyBadge';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import type { ServiceProvider } from '@/components/ServiceProviderRail';
import { cn } from '@/lib/utils';

/* ---------- Section 2 data — filters ---------- */

type Country = 'Zimbabwe' | 'South Africa' | 'Diaspora';
type CountryFilter = 'All' | Country;
type EraFilter = 'All' | '2010s' | '2020s';

const COUNTRIES: CountryFilter[] = ['All', 'Zimbabwe', 'South Africa', 'Diaspora'];
const ERAS: EraFilter[] = ['All', '2010s', '2020s'];
const TOTAL_PUBLIC = 128;

interface SeedMemorial {
  name: string;
  born: number;
  died: number;
  place: string;
  country: Country;
  candles: number;
  livestream?: boolean;
  voice?: boolean;
  /** Celebrity-style community memorial disclaimer (memorials.md §4) */
  community?: boolean;
  /** Placeholder portrait tone — silhouette/landscape style, never fake faces */
  tone: string;
}

const SEED_MEMORIALS: SeedMemorial[] = [
  { name: 'Tendai Moyo', born: 1941, died: 2024, place: 'Bulawayo', country: 'Zimbabwe', candles: 86, livestream: true, voice: true, tone: 'from-forest to-forest-deep' },
  { name: 'Sipho Nkosi', born: 1960, died: 2025, place: 'Durban', country: 'South Africa', candles: 132, voice: true, tone: 'from-evergreen to-forest' },
  { name: 'Mai Chiweshe', born: 1938, died: 2023, place: 'Masvingo', country: 'Zimbabwe', candles: 54, voice: true, tone: 'from-forest-soft to-forest-deep' },
  { name: 'Thandiwe Dlamini', born: 1952, died: 2025, place: 'Johannesburg', country: 'South Africa', candles: 201, livestream: true, tone: 'from-forest to-evergreen' },
  { name: 'Kuda Mapfumo', born: 1947, died: 2021, place: 'Mutare', country: 'Zimbabwe', candles: 63, tone: 'from-forest-deep to-forest' },
  { name: 'Naledi Mokoena', born: 1965, died: 2024, place: 'Cape Town', country: 'South Africa', candles: 118, livestream: true, voice: true, tone: 'from-evergreen to-forest-deep' },
  { name: 'Sekuru Banda', born: 1929, died: 2019, place: 'Gweru', country: 'Zimbabwe', candles: 41, tone: 'from-forest to-forest-soft' },
  { name: 'Ayanda Khumalo', born: 1988, died: 2020, place: 'London', country: 'Diaspora', candles: 307, livestream: true, voice: true, tone: 'from-forest-soft to-evergreen' },
  { name: 'Mbuya Takawira', born: 1935, died: 2018, place: 'Chinhoyi', country: 'Zimbabwe', candles: 29, tone: 'from-forest-deep to-evergreen' },
  { name: 'Pieter van Wyk', born: 1954, died: 2022, place: 'Pretoria', country: 'South Africa', candles: 77, tone: 'from-evergreen to-forest-soft' },
  { name: 'Rudo Chikafu', born: 1971, died: 2025, place: 'Toronto', country: 'Diaspora', candles: 144, voice: true, tone: 'from-forest to-forest-deep' },
  { name: 'Baba Solomon Moyo', born: 1930, died: 2022, place: 'Harare', country: 'Zimbabwe', candles: 512, livestream: true, community: true, tone: 'from-forest-deep to-forest-soft' },
];

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
    phone: '+263 77 555 0143',
    tier: 'basic',
  },
  {
    name: 'ClearStream Funeral Streaming',
    category: 'Livestream Services',
    phone: '+27 82 555 0119',
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
        'inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors duration-150',
        active
          ? 'border-evergreen bg-evergreen text-bone'
          : 'border-[color:var(--line)] bg-surface text-soft hover:border-evergreen hover:text-evergreen',
      )}
    >
      {children}
    </button>
  );
}

function CandleStat({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Flame size={14} aria-hidden className="text-ember" />
      {count} Candles
    </span>
  );
}

/* ---------- Section 3 — Featured memorials ---------- */

function FeaturedCard({
  href,
  img,
  imgAlt,
  name,
  years,
  line,
  stats,
  badge,
  badgeClasses,
  cta,
  delay,
}: {
  href: string;
  img: string;
  imgAlt: string;
  name: string;
  years: string;
  line: string;
  stats: ReactNode;
  badge: string;
  badgeClasses: string;
  cta: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <Link
        to={href}
        className="card-raised group flex h-full flex-col border border-brass/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass sm:flex-row"
      >
        <div className="overflow-hidden rounded-t-sm sm:w-44 sm:flex-none sm:rounded-l-sm sm:rounded-tr-none lg:w-52">
          <img
            src={img}
            alt={imgAlt}
            loading="lazy"
            className="aspect-[4/5] h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span
            className={cn(
              'inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
              badgeClasses,
            )}
          >
            {badge}
          </span>
          <h3 className="font-display mt-4 text-2xl text-body">
            {name} <span className="text-soft">({years})</span>
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-soft">{line}</p>
          <p className="type-meta mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-soft">{stats}</p>
          <span className="link-arrow mt-5">
            {cta} <ArrowRight size={14} aria-hidden />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/* ---------- Section 4 — Results grid card ---------- */

function MemorialCard({ memorial }: { memorial: SeedMemorial }) {
  return (
    <article className="card-raised group h-full overflow-hidden border border-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/50">
      {/* 4:5 portrait placeholder — silhouette/tree motif, never a fake face */}
      <div
        aria-hidden
        className={cn(
          'flex aspect-[4/5] items-center justify-center bg-gradient-to-b transition-transform duration-300 group-hover:scale-[1.01]',
          memorial.tone,
        )}
      >
        <img src="/logo-mark.svg" alt="" width={72} height={72} className="opacity-70" />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-body">{memorial.name}</h3>
        <p className="type-meta mt-1 text-soft">
          {memorial.born}–{memorial.died} · {memorial.place}
        </p>
        <p className="type-meta mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-soft">
          <CandleStat count={memorial.candles} />
          {memorial.livestream && (
            <span className="inline-flex items-center gap-1.5">
              <Video size={14} aria-hidden className="text-evergreen" /> Livestream
            </span>
          )}
          {memorial.voice && (
            <span className="inline-flex items-center gap-1.5">
              <Mic size={14} aria-hidden className="text-evergreen" /> Voice notes
            </span>
          )}
        </p>
        <div className="mt-4">
          <PrivacyBadge level="public" />
        </div>
        {memorial.community && (
          <p className="mt-3 text-xs leading-relaxed text-soft">
            Unofficial community memorial — not affiliated with or endorsed by the estate.
          </p>
        )}
      </div>
    </article>
  );
}

/* ---------- Page ---------- */

/** Memorials — `/memorials` (memorials.md). Parchment directory with dignified search + filters. */
export default function Memorials() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [country, setCountry] = useState<CountryFilter>('All');
  const [era, setEra] = useState<EraFilter>('All');
  const [withLivestream, setWithLivestream] = useState(false);
  const [withVoice, setWithVoice] = useState(false);

  // Live results with 300ms debounce (memorials.md §2)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const visible = useMemo(() => {
    return SEED_MEMORIALS.filter((m) => {
      if (country !== 'All' && m.country !== country) return false;
      if (era !== 'All' && `${Math.floor(m.died / 10) * 10}s` !== era) return false;
      if (withLivestream && !m.livestream) return false;
      if (withVoice && !m.voice) return false;
      if (debouncedQuery) {
        const hay = `${m.name} ${m.place} ${m.country}`.toLowerCase();
        if (!hay.includes(debouncedQuery)) return false;
      }
      return true;
    });
  }, [country, era, withLivestream, withVoice, debouncedQuery]);

  const isFiltering =
    debouncedQuery !== '' || country !== 'All' || era !== 'All' || withLivestream || withVoice;

  return (
    <>
      {/* Section 1 — Page header */}
      <section className="section-pad pb-12" aria-labelledby="memorials-heading">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow">MEMORIALS</p>
            <h1 id="memorials-heading" className="type-h1 mt-4 text-body">
              Every life, remembered.
            </h1>
            <p className="type-story mt-4 max-w-reading text-soft">
              Browse public memorials created by families across Southern Africa and the diaspora.
              Private and family-tier memorials never appear here.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-content pb-16 md:pb-24 xl:flex xl:gap-14">
        <div className="min-w-0 flex-1">
          {/* Section 2 — Search & filter bar */}
          <Reveal>
            <div className="sticky top-[88px] z-30 card-well p-4 md:p-5" role="search">
              <label className="relative block">
                <span className="sr-only">Search by name, place, or family</span>
                <Search
                  size={18}
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-soft"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, place, or family…"
                  className="min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface pl-11 pr-4 text-base text-body placeholder:text-soft focus:border-evergreen focus:outline-none"
                />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by country">
                {COUNTRIES.map((c) => (
                  <Chip key={c} active={country === c} onClick={() => setCountry(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by era and features">
                {ERAS.map((e) => (
                  <Chip key={e} active={era === e} onClick={() => setEra(e)}>
                    {e === 'All' ? 'All eras' : e}
                  </Chip>
                ))}
                <span aria-hidden className="mx-1 hidden h-6 w-px bg-[color:var(--line)] sm:inline-block" />
                <Chip active={withLivestream} onClick={() => setWithLivestream((v) => !v)}>
                  <Video size={14} aria-hidden /> With livestream
                </Chip>
                <Chip active={withVoice} onClick={() => setWithVoice((v) => !v)}>
                  <Mic size={14} aria-hidden /> With voice notes
                </Chip>
              </div>
              <p className="type-meta mt-4 text-soft" aria-live="polite">
                {TOTAL_PUBLIC} public memorials
                {isFiltering && ` — ${visible.length} shown`}
              </p>
            </div>
          </Reveal>

          {/* Section 3 — Featured memorials */}
          <section className="mt-14" aria-label="Featured memorials">
            <div className="grid gap-6 lg:grid-cols-2">
              <FeaturedCard
                href="/memorials/virginia-dadirayi-chiimba"
                img="/virginia-portrait.jpg"
                imgAlt="Portrait placeholder of Virginia Dadirayi Chiimba"
                name="Virginia Dadirayi Chiimba"
                years="1955–2025"
                line="A loving, caring, strong, and deeply faithful mother. The heart of our family."
                stats={
                  <>
                    <CandleStat count={12} />
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={14} aria-hidden className="text-evergreen" /> 25 Family
                    </span>
                  </>
                }
                badge="Founding Memorial"
                badgeClasses="border border-brass bg-brass/10 text-brass"
                cta="Visit Memorial"
                delay={0}
              />
              <FeaturedCard
                href="/memorials/john-peters"
                img="/memorial-john-portrait.jpg"
                imgAlt="Illustrative portrait of the fictional John Peters"
                name="John Peters"
                years="1958–2026"
                line="A Father Who Connected Continents"
                stats={
                  <>
                    <CandleStat count={247} />
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={14} aria-hidden className="text-evergreen" /> 4 Resting Places
                    </span>
                  </>
                }
                badge="Example Memorial — fictional family"
                badgeClasses="border border-sage/60 bg-sage/15 text-ink-soft"
                cta="Explore the Demo"
                delay={0.1}
              />
            </div>
          </section>

          {/* Section 4 — Results grid */}
          <section className="mt-14" aria-label="Public memorials" aria-live="polite">
            {visible.length > 0 ? (
              <motion.ul
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {visible.map((m, i) => (
                    <motion.li
                      key={m.name}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.05 }}
                    >
                      <MemorialCard memorial={m} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <div className="card-well flex flex-col items-center px-6 py-16 text-center">
                <hr className="brass-rule" />
                <p className="type-story mt-8 max-w-reading text-soft">
                  No public memorials match. Many families keep their memorials within their circle
                  — perhaps create the first for your loved one.
                </p>
                <Link to="/create" className="btn btn-evergreen mt-8">
                  Create a Memorial — free
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Service Provider Rail (memorials.md) */}
        <ServiceProviderRail className="mt-16 xl:mt-0" providers={RAIL_PROVIDERS} />
      </div>

      {/* Section 5 — CTA band */}
      <section className="bg-forest py-16 md:py-24" aria-labelledby="memorials-cta-heading">
        <div className="container-content flex flex-col items-center text-center">
          <Reveal>
            <hr className="brass-rule mx-auto" />
            <h2 id="memorials-cta-heading" className="type-h3 mt-8 !text-[1.75rem] text-bone">
              Someone you love belongs here.
            </h2>
            <Link to="/create" className="btn btn-evergreen mt-8">
              Create a Memorial — free
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
