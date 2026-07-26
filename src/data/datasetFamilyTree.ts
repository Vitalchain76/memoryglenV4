import { groupByGeneration } from '@/components/family/familyModel';
import type { FamilyTreeData } from '@/components/family/familyModel';
import { CHIIMBA_GLEN_SLUGS, MEMORIALS } from '@/data/memorials';
import type { Memorial } from '@/data/memorials';

/**
 * Family tree for the content-pack memorials.
 *
 * Most of these have no recorded family at all, so FamilyTree shows its empty
 * state — "This family tree has not been built yet" — which is honest and reads
 * better than hiding the room and making the memorial look different from every
 * other one.
 *
 * The Chiimba men are the exception: Chari, Timothy and Moses share a Glen, so
 * they are shown together. Nothing is invented — only the relationships the
 * family has actually supplied.
 */

const CHIIMBA = 'Chiimba Family Glen';

export function buildDatasetTree(memorial: Memorial): FamilyTreeData | undefined {
  if (!(CHIIMBA_GLEN_SLUGS as readonly string[]).includes(memorial.slug)) {
    return undefined; // empty state
  }

  const glenMembers = MEMORIALS.filter((m) =>
    (CHIIMBA_GLEN_SLUGS as readonly string[]).includes(m.slug),
  ).sort((a, b) => a.deathYear - b.deathYear);

  const people = glenMembers.map((m) => ({
    id: m.slug,
    name: m.name,
    years: m.years,
    relation: m.familyRelation,
    living: false,
    // Chari is a generation above his sons.
    generation: m.slug === 'chari-chiimba' ? 0 : 1,
    glens: [CHIIMBA],
    memorialSlug: m.slug === memorial.slug ? undefined : m.slug,
    isSubject: m.slug === memorial.slug,
  }));

  return {
    caption: 'The Chiimba men, who rest together in the family glen.',
    generations: groupByGeneration(people, { 0: 'Grandfather', 1: 'His sons' }),
  };
}
