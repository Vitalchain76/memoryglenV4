import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import TierGate from '@/components/TierGate';
import CandleFlame from '@/components/CandleFlame';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import type { ServiceProvider } from '@/components/ServiceProviderRail';
import type { JohnPetersTabId } from '@/pages/JohnPetersMemorial';
import { cn } from '@/lib/utils';

type GlenTheme = 'earthly' | 'religious' | 'spiritual';

const THEMES: { id: GlenTheme; label: string; img: string; description: string }[] = [
  { id: 'earthly', label: 'Earthly', img: '/glen-grove-earthly.jpg', description: 'A grove at golden hour — warm nature, moss and light.' },
  { id: 'religious', label: 'Religious', img: '/glen-grove-religious.jpg', description: 'A quiet chapel — candle-glow and sacred arch.' },
  { id: 'spiritual', label: 'Spiritual', img: '/glen-grove-spiritual.jpg', description: 'Dusk sky, first stars, floating flames.' },
];

const RAIL_PROVIDERS: ServiceProvider[] = [
  {
    name: 'Eternal Stone Tombstones',
    category: 'Tombstone Maker',
    description: 'Granite headstones, engraved with care — Harare.',
    contactHref: 'mailto:admin@memoryglen.com?subject=Eternal%20Stone%20Tombstones',
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
    phone: '+263 71 555 0166',
    tier: 'basic',
  },
];

interface Marker {
  id: string;
  name: string;
  years: string;
  note: string;
  candles?: number;
  kind: 'stone' | 'tree';
  /** Position over the grove (percentages). */
  x: number;
  y: number;
}

const MARKERS: Marker[] = [
  {
    id: 'john',
    name: 'John Peters',
    years: '1958–2026',
    note: 'Husband, Father, Facilities Manager, Deacon. Built schools, built family, built legacy.',
    candles: 247,
    kind: 'tree',
    x: 62,
    y: 58,
  },
  {
    id: 'samuel',
    name: 'Samuel Peters',
    years: '1931–2001',
    note: 'Teacher, Elder, Storyteller. He taught John the worth of work.',
    kind: 'stone',
    x: 30,
    y: 50,
  },
  {
    id: 'ruth',
    name: 'Ruth Peters',
    years: '1935–2011',
    note: 'Nurse, Mother, Gardener. Her kitchen fed a whole street.',
    kind: 'stone',
    x: 44,
    y: 66,
  },
  {
    id: 'james',
    name: 'James Peters',
    years: '1961–2019',
    note: 'Brother, Uncle, Keeper of Stories. The laughing brother.',
    kind: 'tree',
    x: 76,
    y: 44,
  },
];

/* ---------- Ambient particles (light-motes / fireflies) ---------- */
function AmbientParticles({ variant }: { variant: 'motes' | 'fireflies' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    const count = variant === 'motes' ? 12 : 10;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: ((i * 97) % 100) / 100,
      y: ((i * 61) % 100) / 100,
      phase: i * 1.3,
      speed: 0.6 + ((i * 37) % 10) / 25,
      size: variant === 'motes' ? 1.5 + ((i * 13) % 10) / 6 : 2 + ((i * 7) % 10) / 5,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const color = variant === 'motes' ? '217,192,138' : '196,162,76';
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = t / 1000;
      for (const p of particles) {
        // ~20s drift loop
        const dx = Math.sin(time * 0.3 * p.speed + p.phase) * 24;
        const dy =
          Math.cos(time * 0.22 * p.speed + p.phase * 1.7) * 18 -
          (variant === 'fireflies' ? (time * p.speed * 2) % 40 : 0);
        const x = p.x * canvas.width + dx;
        const y = p.y * canvas.height + dy;
        const alpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(time * p.speed + p.phase * 3));
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

/* ---------- Section 1 — Glen Entrance ---------- */
function GlenEntrance({
  theme,
  onTheme,
}: {
  theme: GlenTheme;
  onTheme: (t: GlenTheme) => void;
}) {
  const [ambience, setAmbience] = useState(false);
  const active = THEMES.find((t) => t.id === theme)!;

  return (
    <section aria-label="The Peters Family Glen entrance">
      <div className="relative h-[80vh] min-h-[560px] overflow-hidden bg-forest-deep">
        {/* Grove illustration — crossfades 600ms on theme switch */}
        <AnimatePresence mode="sync">
          <motion.img
            key={theme}
            src={active.img}
            alt={`Illustrated grove of the Peters Family Glen — ${active.label.toLowerCase()} atmosphere`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {theme !== 'religious' && (
          <AmbientParticles variant={theme === 'earthly' ? 'motes' : 'fireflies'} />
        )}
        {/* Scrim for legibility */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/25 to-forest-deep/10" />

        {/* Theme switcher — top right */}
        <div className="absolute right-4 top-4 z-10 rounded-sm bg-forest-deep/70 p-2 backdrop-blur">
          <p className="sr-only">Entrance atmosphere</p>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTheme(t.id)}
                aria-pressed={theme === t.id}
                className={cn(
                  'group w-20 rounded-sm border p-1 transition-colors duration-200',
                  theme === t.id ? 'border-brass' : 'border-bone/20 hover:border-bone/50',
                )}
              >
                <img src={t.img} alt="" className="h-10 w-full rounded-sm object-cover" loading="lazy" />
                <span className="mt-1 block text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-bone">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
          {theme === 'religious' && (
            <button
              type="button"
              onClick={() => setAmbience((a) => !a)}
              aria-pressed={ambience}
              className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-sm border border-bone/20 px-2 text-[11px] font-medium text-bone transition-colors hover:border-bone/50"
            >
              <Volume2 size={12} aria-hidden />
              {ambience ? 'Hymn ambience · on' : 'Hymn ambience · off'}
            </button>
          )}
        </div>

        {/* Header content — bottom left, bone on scrim */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container-content pb-10">
            <motion.img
              src="/crest-peters.svg"
              alt="The Peters family crest — a carpenter's square and protea over a small tree"
              width={96}
              height={96}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="type-h1 mt-4 text-bone"
            >
              The Peters Family Glen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-2 font-display text-xl italic text-brass"
            >
              “We carry each other.”
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="type-meta mt-3 text-bone/80"
            >
              Established 1987 · Custodian: Grace Peters · Designated successor: David Peters · 4
              resting places
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="mt-4 max-w-[560px] text-sm leading-relaxed text-bone/85"
            >
              A quiet place where the Peters family rests, remembers, and returns. This is your
              digital ancestral home. It belongs to the family. It grows with every generation.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 2 — The Grove (markers) ---------- */
function Grove({
  onNavigate,
}: {
  onNavigate: (tab: JohnPetersTabId) => void;
}) {
  const [selected, setSelected] = useState<Marker | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <section className="relative bg-forest" aria-label="The grove — resting places">
      <div className="relative mx-auto max-w-content px-6 py-10">
        <Reveal>
          <p className="eyebrow !text-sage">THE GROVE</p>
          <h2 className="type-h2 mt-4 text-bone">Four resting places, one quiet hill.</h2>
        </Reveal>

        {/* Desktop: markers placed as in the landscape */}
        <div className="relative mt-10 hidden h-[420px] lg:block">
          {MARKERS.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              onClick={() => setSelected(m)}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
              aria-label={`${m.name}, ${m.years} — open details`}
            >
              <span className="flex items-center gap-3">
                {m.kind === 'stone' ? (
                  <span
                    aria-hidden
                    className="block h-10 w-14 rounded-[50%] bg-gradient-to-b from-[#9AA39B] to-[#6E7770] shadow-raised transition-shadow duration-200 group-hover:shadow-[0_0_18px_2px_rgba(196,162,76,0.45)]"
                  />
                ) : (
                  <svg aria-hidden viewBox="0 0 24 32" className="h-12 w-9 transition-[filter] duration-200 group-hover:drop-shadow-[0_0_8px_rgba(196,162,76,0.6)]">
                    <path d="M12 2 L20 16 H15 L19 24 H5 L9 16 H4 Z" fill="#2E5945" />
                    <rect x="11" y="24" width="2" height="7" fill="#1E4038" />
                  </svg>
                )}
                <span className="rounded-sm bg-forest-deep/80 px-3 py-2 backdrop-blur transition-colors duration-200 group-hover:bg-forest-deep">
                  <span className="block font-display text-base text-bone">{m.name}</span>
                  <span className="block text-xs text-sage">
                    {m.years}
                    {m.candles ? ` · ${m.candles} candles` : ''}
                  </span>
                </span>
              </span>
            </motion.button>
          ))}

          {/* One empty plot — "A place kept." */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{ left: '18%', top: '70%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span className="flex items-center gap-3 opacity-60">
              <span aria-hidden className="block h-10 w-14 rounded-[50%] border border-dashed border-sage/70" />
              <span className="font-display text-sm italic text-sage">A place kept.</span>
            </span>
          </motion.div>
        </div>

        {/* Mobile: stacked list of the same markers */}
        <ul className="mt-8 space-y-3 lg:hidden">
          {MARKERS.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelected(m)}
                className="card-well flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left"
              >
                <span>
                  <span className="block font-display text-base text-body">{m.name}</span>
                  <span className="block text-xs text-soft">{m.years}</span>
                </span>
                {m.candles ? <span className="type-meta flex-none text-soft">{m.candles} candles</span> : null}
              </button>
            </li>
          ))}
          <li className="px-4 py-2 font-display text-sm italic text-sage opacity-70">A place kept.</li>
        </ul>
      </div>

      {/* Detail drawer — slides in from the right */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[70] bg-forest-deep/50"
              onClick={() => setSelected(null)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-y-0 right-0 z-[75] w-full max-w-sm bg-forest-deep p-8 text-bone shadow-raised"
              role="dialog"
              aria-modal="true"
              aria-label={`${selected.name} — resting place details`}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center text-sage transition-colors hover:text-bone"
              >
                <X size={20} aria-hidden />
              </button>
              <CandleFlame size={20} lit={Boolean(selected.candles)} />
              <h3 className="type-h2 mt-4 text-bone">{selected.name}</h3>
              <p className="type-meta mt-2 tracking-[0.2em] text-brass">{selected.years}</p>
              <p className="mt-5 leading-relaxed text-sage">{selected.note}</p>
              {selected.candles && (
                <p className="type-meta mt-5 text-bone">{selected.candles} candles lit</p>
              )}
              {selected.id === 'john' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    onNavigate('memorial');
                  }}
                  className="link-arrow mt-8 text-sm !text-brass-soft"
                >
                  Visit memorial →
                </button>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Section 3 — TierGate ---------- */
function GlenTierGate() {
  return (
    <section aria-label="Plans">
      <TierGate message="4 of 5 free resting places used. As the family grows, so should your space." />
      <p className="type-meta mt-3 text-soft">
        Free — 5 resting places · Heritage R99/mo — 25 places, crest & colours · Legacy R299/mo —
        unlimited, own web address, printed heritage book.
      </p>
    </section>
  );
}

/* ---------- Section 4 — How a Glen Works ---------- */
const GLEN_EXPLAINERS = [
  {
    title: 'Create & name your glen',
    body: 'A family, a group of friends, a school community, soldiers who served together — anyone who shared a life chapter can create their own cemetery. Name it, design its entrance, invite your people in minutes.',
  },
  {
    title: 'One person, many glens',
    body: 'Overlapping membership is first-class: Sarah rests in the story of both the Peters and the Miller glens. One canonical memorial, linked everywhere it is loved — never duplicated.',
  },
  {
    title: 'Privacy in three circles',
    body: 'Inner Circle (closest family), Family (extended + linked trees), Public. Every post, photo, and memory carries its own circle. Tier 1 and 2 never appear to the public or to search engines.',
  },
  {
    title: 'A glen that closes in peace',
    body: 'When every member has passed, the glen closes: finalized, preserved, read-only — a completed garden. Nothing is deleted; the story simply rests.',
  },
];

function HowAGlenWorks() {
  return (
    <section className="section-pad" aria-labelledby="how-heading">
      <Reveal>
        <p className="eyebrow">HOW A GLEN WORKS</p>
        <h2 id="how-heading" className="type-h2 mt-4 text-body">
          A cemetery that grows with you.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {GLEN_EXPLAINERS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="card-raised h-full p-6">
              <h3 className="type-h3 text-body">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Section 5 — Custodianship, Succession & Closure ---------- */
const SUCCESSION_STEPS = [
  'Pre-designated successor is invited (30-day grace to accept).',
  'No successor → the senior co-guardian is promoted.',
  'No guardians → the family votes (48-hour window).',
  'No active family → the glen enters legacy mode: frozen, read-only, preserved forever.',
];

function Custodianship() {
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-labelledby="cust-heading">
      <Reveal>
        <h2 id="cust-heading" className="type-h2 text-body">
          Custodianship, succession & closure.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Custodian card */}
        <Reveal>
          <div className="card-raised h-full p-6">
            <p className="eyebrow">CUSTODIAN</p>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest font-display text-xl text-brass-soft ring-2 ring-brass">
                G
              </span>
              <div>
                <p className="font-display text-lg text-body">Grace Peters</p>
                <p className="type-meta text-soft">Custodian</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest font-display text-xl text-brass-soft ring-2 ring-brass/60">
                D
              </span>
              <div>
                <p className="font-display text-lg text-body">David Peters</p>
                <p className="type-meta text-soft">Designated successor</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-soft">
              Custodianship transfers automatically with a 30-day acceptance window. Backup
              successors supported.
            </p>
          </div>
        </Reveal>

        {/* Succession path */}
        <Reveal delay={0.1}>
          <div className="card-raised h-full p-6">
            <p className="eyebrow">THE SUCCESSION PATH</p>
            <ol className="mt-5 space-y-4 border-l border-brass/60 pl-6">
              {SUCCESSION_STEPS.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.12 }}
                  className="relative text-sm leading-relaxed text-body"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-brass"
                  />
                  <span className="font-display text-brass">{i + 1}.</span> {s}
                </motion.li>
              ))}
            </ol>
            <p className="mt-5 rounded-sm bg-well p-3 text-xs italic leading-relaxed text-soft">
              “This cemetery is in legacy mode. Contact MemoryGlen to reactivate.” — the banner a
              family would see.
            </p>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.15}>
        <p className="mt-8 max-w-2xl font-display text-lg italic text-body">
          “Your glen can never be lost to a password. The family, not the account, owns the story.”
        </p>
      </Reveal>
    </section>
  );
}

/* ---------- Section 6 — EmblemStudio teaser ---------- */
function EmblemStudio() {
  return (
    <section className="bg-forest" aria-labelledby="emblem-heading">
      <div className="mx-auto max-w-content px-6 py-16 md:py-20">
        <Reveal>
          <h2 id="emblem-heading" className="type-h2 text-bone">
            Design the feel of your family's entrance.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {THEMES.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <figure className="group rounded-sm border border-brass/30 p-2 transition-colors duration-200 hover:border-brass">
                <img
                  src={t.img}
                  alt={`${t.label} entrance atmosphere`}
                  loading="lazy"
                  className="aspect-[2/1] w-full rounded-sm object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <figcaption className="p-3">
                  <p className="font-display text-lg text-bone">{t.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-sage">{t.description}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="type-meta mt-8 text-sage">
            EmblemStudio: crest upload · clan totem (mutupo) · praise names · family colours ·
            motto.
          </p>
          <Link to="/create" className="btn btn-evergreen mt-6 min-h-12">
            Create your family's eternal home — free to start.
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Tab ---------- */
export default function GlenTab({ onNavigate }: { onNavigate: (tab: JohnPetersTabId) => void }) {
  const [theme, setTheme] = useState<GlenTheme>('earthly');

  return (
    <div>
      {/* Sections 1–2: the immersive grove — no provider rail here (sanctity of the space) */}
      <GlenEntrance theme={theme} onTheme={setTheme} />
      <Grove onNavigate={onNavigate} />

      {/* Sections 3–7: management & explainer — the rail returns here */}
      <div className="container-content mt-16 flex gap-12">
        <div className="w-full min-w-0">
          <GlenTierGate />
          <HowAGlenWorks />
          <Custodianship />
          <section className="section-pad border-t border-[color:var(--line)]" aria-label="Continue exploring">
            <Reveal>
              <p className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <button type="button" onClick={() => onNavigate('tree')} className="link-arrow">
                  See how Sarah belongs to two glens → Family Tree
                </button>
                <button type="button" onClick={() => onNavigate('memorial')} className="link-arrow">
                  John's full story → The Memorial
                </button>
              </p>
            </Reveal>
          </section>
        </div>
        <ServiceProviderRail providers={RAIL_PROVIDERS} />
      </div>

      <EmblemStudio />
    </div>
  );
}
