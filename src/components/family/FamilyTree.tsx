import { Link } from 'react-router';
import { AlertCircle, ArrowRight, Layers, Lock } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { MULTI_GLEN_NOTE, flatten, multiGlenPeople } from '@/components/family/familyModel';
import type { FamilyPerson, FamilyTreeData } from '@/components/family/familyModel';
import { cn } from '@/lib/utils';

/**
 * The family tree, used by EVERY memorial that has one.
 *
 * Layout choice, deliberately: generation rows that wrap, not an SVG canvas
 * with absolute coordinates. A canvas needs hand-placed x/y per person, cannot
 * grow with a family, and forces horizontal scrolling on a phone. Rows stack
 * naturally at any width and stay readable at 320px without pinch-zoom, which
 * is where most people will open a memorial link from WhatsApp.
 */

function PersonCard({ person }: { person: FamilyPerson }) {
  const multiGlen = (person.glens?.length ?? 0) > 1;
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-display text-base text-body">
            {person.name}
            {person.isSubject && (
              <span className="type-meta ml-2 whitespace-nowrap not-italic text-brass">
                · this memorial
              </span>
            )}
          </p>
          <p className="type-meta mt-0.5 text-soft">
            {person.kinship ? `${person.kinship} · ` : ''}
            {person.relation}
            {person.years ? ` · ${person.years}` : ''}
          </p>
        </div>
        <span
          aria-hidden
          className={cn(
            'mt-1.5 h-2 w-2 flex-none rounded-full',
            person.living ? 'bg-evergreen' : 'bg-brass',
          )}
        />
      </div>

      {(multiGlen || person.legacyMember || person.living) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]',
              person.living ? 'border-evergreen text-evergreen' : 'border-brass/60 text-soft',
            )}
          >
            {person.living ? 'Living' : 'Remembered'}
          </span>
          {multiGlen && (
            <span className="inline-flex items-center gap-1 rounded-full border border-brass bg-brass/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
              <Layers size={10} aria-hidden /> {person.glens!.length} Glens
            </span>
          )}
          {person.legacyMember && (
            <span className="inline-flex items-center gap-1 rounded-full border border-brass px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
              <Lock size={10} aria-hidden /> Living Legacy
            </span>
          )}
        </div>
      )}

      {multiGlen && (
        <p className="type-meta mt-2 text-soft">{person.glens!.join(' · ')}</p>
      )}

      {person.memorialSlug && (
        <span className="link-arrow mt-3 text-sm">
          Visit memorial <ArrowRight size={14} aria-hidden />
        </span>
      )}
    </>
  );

  // Minimum 44px touch target is satisfied by p-4 plus two lines of content.
  const classes =
    'card-raised block h-full min-h-[44px] p-4 transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass';

  return person.memorialSlug ? (
    <Link to={`/memorials/${person.memorialSlug}`} className={cn(classes, 'hover:-translate-y-0.5')}>
      {inner}
    </Link>
  ) : (
    <div className={classes}>{inner}</div>
  );
}

function Legend({ hasMultiGlen }: { hasMultiGlen: boolean }) {
  return (
    <div className="card-well p-4 sm:p-5">
      <p className="eyebrow">Legend</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-evergreen" />
          <span className="type-meta text-soft">Living</span>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-brass" />
          <span className="type-meta text-soft">Remembered</span>
        </li>
        {hasMultiGlen && (
          <li className="flex items-center gap-2">
            <Layers size={12} className="text-brass" aria-hidden />
            <span className="type-meta text-soft">Belongs to more than one Family Glen</span>
          </li>
        )}
        <li className="flex items-center gap-2">
          <ArrowRight size={12} className="text-brass" aria-hidden />
          <span className="type-meta text-soft">Has their own memorial</span>
        </li>
      </ul>
    </div>
  );
}

export default function FamilyTree({
  data,
  loading = false,
  error = null,
}: {
  data?: FamilyTreeData;
  loading?: boolean;
  error?: string | null;
}) {
  /* ---- error ---- */
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-sm border border-dashed border-brass/60 p-6 text-center sm:p-8"
      >
        <AlertCircle size={20} className="mx-auto text-brass" aria-hidden />
        <p className="mt-3 text-body">This family tree could not be loaded.</p>
        <p className="type-meta mt-1 text-soft">{error}</p>
      </div>
    );
  }

  /* ---- loading ---- */
  if (loading) {
    return (
      <div aria-busy="true" aria-live="polite" className="space-y-8">
        <span className="sr-only">Loading the family tree…</span>
        {[0, 1].map((row) => (
          <div key={row}>
            <div className="h-3 w-32 rounded-sm bg-well" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((c) => (
                <div key={c} className="h-24 rounded-sm bg-well" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const people = data ? flatten(data) : [];

  /* ---- empty ---- */
  if (!data || people.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-brass/60 p-6 text-center sm:p-8">
        <p className="text-body">This family tree has not been built yet.</p>
        <p className="type-meta mt-1 text-soft">
          When the family adds parents, brothers, sisters and children, they will appear here.
        </p>
      </div>
    );
  }

  const multi = multiGlenPeople(people);

  return (
    <div>
      {data.caption && (
        <Reveal>
          <p className="max-w-reading leading-relaxed text-soft">{data.caption}</p>
        </Reveal>
      )}

      <Reveal delay={0.05}>
        <div className="mt-6">
          <Legend hasMultiGlen={multi.length > 0} />
        </div>
      </Reveal>

      {multi.length > 0 && (
        <Reveal delay={0.08}>
          <p className="type-meta mt-4 max-w-reading text-soft">{MULTI_GLEN_NOTE}</p>
        </Reveal>
      )}

      {/* Generation rows. Stacks to one column on a phone; no horizontal scroll. */}
      <div className="mt-10 space-y-12">
        {data.generations.map((gen, gi) => (
          <section key={gen.generation} aria-labelledby={`gen-${gen.generation}`}>
            <Reveal>
              <div className="flex items-center gap-4">
                <h3
                  id={`gen-${gen.generation}`}
                  className="type-meta whitespace-nowrap uppercase tracking-[0.14em] text-brass"
                >
                  {gen.label}
                </h3>
                <span aria-hidden className="h-px flex-1 bg-[color:var(--line)]" />
                <span className="type-meta text-soft">{gen.people.length}</span>
              </div>
            </Reveal>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gen.people.map((p, i) => (
                <Reveal as="li" key={p.id} delay={Math.min(i, 5) * 0.04 + gi * 0.02}>
                  <PersonCard person={p} />
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
