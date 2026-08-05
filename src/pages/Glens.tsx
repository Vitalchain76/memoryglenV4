import { useMemo, useState } from 'react';
import { Search, Users, MapPin, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { LIVING_GLENS, LIFE_STAGES } from '@/data/livingGlens';
import type { LifeStage } from '@/data/livingGlens';
import { cn } from '@/lib/utils';

type StageFilter = 'all' | LifeStage;

/** Glens — `/glens` (LivingGlen). Active Public Glens directory. Demo data only. */
export default function Glens() {
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState<StageFilter>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIVING_GLENS.filter((g) => {
      if (stage !== 'all' && g.stage !== stage) return false;
      if (q && !`${g.title} ${g.description} ${g.location}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, stage]);

  return (
    <>
      <section className="section-pad pb-12" aria-labelledby="glens-heading">
        <div className="container-content">
          <Reveal>
            <p className="eyebrow">PUBLIC GLENS &amp; ACTIVE ARCHIVES</p>
            <h1 id="glens-heading" className="type-h1 mt-4 text-body">
              Explore Public Glens
            </h1>
            <p className="type-story mt-4 max-w-reading text-soft">
              Discover public family circles, alumni cohorts, sports teams, roadtrip journals, and
              time capsules. All entries below are structural demos while the platform is in preview.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-content pb-16 md:pb-24">
        <Reveal>
          <div className="card-well p-4 md:p-5" role="search">
            <label className="relative block">
              <span className="sr-only">Search Glens</span>
              <Search
                size={18}
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-soft"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search public Glens, roadtrips, teams…"
                className="min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface pl-11 pr-4 text-base text-body placeholder:text-soft focus:border-evergreen focus:outline-none"
              />
            </label>
            <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by life stage">
              <button
                type="button"
                aria-pressed={stage === 'all'}
                onClick={() => setStage('all')}
                className={cn(
                  'inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors',
                  stage === 'all'
                    ? 'border-evergreen bg-evergreen text-bone'
                    : 'border-[color:var(--line)] bg-surface text-soft hover:border-evergreen hover:text-evergreen',
                )}
              >
                All
              </button>
              {LIFE_STAGES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={stage === s.id}
                  onClick={() => setStage(s.id)}
                  className={cn(
                    'inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors',
                    stage === s.id
                      ? 'border-evergreen bg-evergreen text-bone'
                      : 'border-[color:var(--line)] bg-surface text-soft hover:border-evergreen hover:text-evergreen',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <section className="mt-14" aria-label="Public Glens" aria-live="polite">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((glen) => (
              <div
                key={glen.slug}
                className="card-raised flex h-full flex-col border border-brass/30 p-6"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-body"
                    style={{ backgroundColor: `${glen.accentHex}22` }}
                  >
                    {glen.stageName}
                  </span>
                  <span className="type-meta inline-flex items-center gap-1.5 text-soft">
                    <Users size={14} aria-hidden className="text-evergreen" /> {glen.membersCount}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-2xl text-body">{glen.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-soft">{glen.description}</p>
                <p className="type-meta mt-4 inline-flex items-center gap-1.5 text-soft">
                  <MapPin size={14} aria-hidden className="text-brass" /> {glen.location}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {glen.tags.map((t) => (
                    <span key={t} className="rounded border border-brass/30 px-2 py-0.5 text-[11px] text-soft">
                      #{t}
                    </span>
                  ))}
                </div>
                {glen.isDemo && (
                  <p className="mt-3 text-xs leading-relaxed text-soft">
                    Sample Group Glen — Structural Demo. Not a real community.
                  </p>
                )}
                <span className="link-arrow mt-4">
                  Explore Glen <ArrowRight size={14} aria-hidden />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
