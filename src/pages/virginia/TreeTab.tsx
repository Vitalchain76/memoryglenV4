import Reveal from '@/components/Reveal';
import FamilyTab from '@/pages/virginia/FamilyTab';
import { CHILDREN, GRANDCHILDREN, SIBLINGS } from '@/pages/virginia/data';

/**
 * TAB 4 — Family Tree.
 *
 * Four generations, all from real family-supplied data:
 *   Johannes & Juliana Mushore (living)
 *     → the ten children, Virginia first
 *       → her seven children
 *         → her eighteen grandchildren
 *
 * The full listing lives in FamilyTab, which this wraps. Nothing here is
 * inferred: no dates are estimated, no relationships are guessed, and living
 * people are shown as living.
 */
export default function TreeTab() {
  const departedSiblings = SIBLINGS.filter((s) => s.deathYear && !s.isVirginia).length;

  return (
    <div className="space-y-16 md:space-y-24">
      <section aria-labelledby="tree-heading">
        <Reveal>
          <p className="eyebrow">Family Tree</p>
          <h2 id="tree-heading" className="type-h2 mt-4 text-body">
            Four generations
          </h2>
          <p className="type-story mt-4 max-w-reading text-soft">
            From her parents, Sekuru Johannes and Ambuya Juliana Mushore, through the ten
            children they raised, to her own seven and their eighteen.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '2', l: 'Parents', s: 'both living' },
              { n: String(SIBLINGS.length), l: 'Her generation', s: `Virginia firstborn of ten` },
              { n: String(CHILDREN.length), l: 'Her children', s: 'six sons, one daughter' },
              { n: String(GRANDCHILDREN.length), l: 'Her grandchildren', s: 'and counting' },
            ].map((stat) => (
              <div key={stat.l} className="card-well p-5">
                <dt className="type-meta text-soft">{stat.l}</dt>
                <dd className="type-stat mt-1 text-body">{stat.n}</dd>
                <dd className="type-meta mt-1 text-soft">{stat.s}</dd>
              </div>
            ))}
          </dl>
          {departedSiblings > 0 && (
            <p className="type-meta mt-4 text-soft">
              {departedSiblings} of her brothers and sisters have since passed.
            </p>
          )}
        </Reveal>
      </section>

      <FamilyTab />
    </div>
  );
}
