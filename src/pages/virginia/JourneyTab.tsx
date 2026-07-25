import Reveal from '@/components/Reveal';
import FuneralTab from '@/pages/virginia/FuneralTab';
import AnniversaryTab from '@/pages/virginia/AnniversaryTab';
import {
  COORDINATING_TEAM,
  JOURNEY_STAGES,
  UNVEILING_PROGRAMME,
} from '@/pages/virginia/data';

/**
 * TAB 1 — The Journey.
 *
 * Six stages, from the family's own record of May–October 2025. Nothing here is
 * inferred and no emotional colour has been added; the events carry their own
 * weight. See the rules on JOURNEY_STAGES in data.ts before editing.
 */
export default function JourneyTab() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section aria-labelledby="journey-heading">
        <Reveal>
          <p className="eyebrow">The Journey</p>
          <h2 id="journey-heading" className="type-h2 mt-4 text-body">
            From 19 May 2025
          </h2>
          <p className="type-story mt-4 max-w-reading text-soft">
            The months between her passing and the unveiling of her stone, as the family
            recorded them.
          </p>
        </Reveal>
      </section>

      {/* The six stages */}
      <section aria-label="The final journey">
        <ol className="relative border-l border-[color:var(--line)] pl-6 sm:pl-8">
          {JOURNEY_STAGES.map((s, i) => (
            <Reveal as="li" key={s.id} delay={Math.min(i, 5) * 0.06}>
              <div className="relative pb-12 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[1.9rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-brass bg-bg sm:-left-[2.4rem]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                </span>
                <p className="type-meta uppercase tracking-[0.14em] text-brass">{s.date}</p>
                <h3 className="type-h3 mt-2 text-body">{s.label}</h3>
                <div className="mt-3 space-y-3">
                  {s.body.map((line, li) => (
                    <p key={li} className="max-w-reading leading-relaxed text-soft">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Stage 2 — those who coordinated it */}
                {s.id === 'coordination' && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {COORDINATING_TEAM.map((p) => (
                      <li key={p.name} className="card-well p-4">
                        <p className="font-display text-base text-body">{p.name}</p>
                        <p className="type-meta mt-0.5 text-soft">{p.role}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Stage 4 — the order of service */}
                {s.id === 'unveiling' && (
                  <div className="card-well mt-6 p-6 sm:p-8">
                    <p className="eyebrow">Order of Service</p>
                    <ul className="mt-5 space-y-3">
                      {UNVEILING_PROGRAMME.map((row, ri) => (
                        <li
                          key={ri}
                          className="flex flex-col gap-0.5 border-b border-[color:var(--line)] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4"
                        >
                          <span className="type-meta w-28 flex-none tabular-nums text-brass">
                            {row.time ?? ''}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-body">{row.item}</span>
                            {row.who && (
                              <span className="type-meta mt-0.5 block text-soft">{row.who}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stage 5 — the album exists; the link stays with the family */}
                {s.id === 'after' && (
                  <p className="type-meta mt-4 max-w-reading text-soft">
                    The album is held by the family. It is not linked publicly, because it
                    holds photographs of many living relatives at a private gathering.
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Existing funeral & memorial event detail and service recordings */}
      <FuneralTab />

      <AnniversaryTab />
    </div>
  );
}
