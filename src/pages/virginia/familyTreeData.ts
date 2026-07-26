import { groupByGeneration } from '@/components/family/familyModel';
import type { FamilyPerson, FamilyTreeData } from '@/components/family/familyModel';
import { CHILDREN, GRANDCHILDREN, PARENTS, SIBLINGS } from '@/pages/virginia/data';

/**
 * Virginia's family, mapped into the shared model.
 *
 * Her source data is four flat lists with no edges, so parent links are added
 * here where the family has confirmed them (her parents → the ten children →
 * her seven → their eighteen). Nothing is inferred beyond that: her siblings'
 * own children are not recorded, so no edges are invented for them.
 *
 * Glen membership: the Mushore side (her parents and siblings) and the Chiimba
 * side (her married family). Virginia belongs to both — which is exactly the
 * multi-Glen case the badge exists to show.
 */

const MUSHORE = 'Mushore Family Glen';
const CHIIMBA = 'Chiimba Family Glen';

export function buildVirginiaTree(): FamilyTreeData {
  const parents: FamilyPerson[] = PARENTS.map((p, i) => ({
    id: `parent-${i}`,
    name: p.honorific,
    relation: `${p.name} · ${p.relation}`,
    living: true,
    generation: 0,
    glens: [MUSHORE],
    spouseOf: i === 0 ? 'parent-1' : 'parent-0',
  }));

  const siblings: FamilyPerson[] = SIBLINGS.map((s) => ({
    id: `sib-${s.order}`,
    name: s.name,
    years: s.birthYear
      ? s.deathYear
        ? `${s.birthYear}\u2013${s.deathYear}`
        : `b. ${s.birthYear}`
      : s.deathYear
        ? `d. ${s.deathYear}`
        : undefined,
    relation: s.relation,
    kinship: s.kinship,
    living: !s.deathYear,
    generation: 1,
    // Virginia married into the Chiimba family, so she sits in both Glens.
    glens: s.isVirginia ? [MUSHORE, CHIIMBA] : [MUSHORE],
    parentIds: ['parent-0', 'parent-1'],
    isSubject: s.isVirginia,
    memorialSlug: s.isVirginia ? undefined : undefined,
  }));

  const children: FamilyPerson[] = CHILDREN.map((c, i) => ({
    id: `child-${i}`,
    name: c.name,
    years: c.birthYear ? `b. ${c.birthYear}` : undefined,
    relation: c.relation,
    living: true,
    generation: 2,
    glens: [CHIIMBA],
    parentIds: ['sib-1'],
  }));

  const grandchildren: FamilyPerson[] = GRANDCHILDREN.map((g, i) => ({
    id: `grand-${i}`,
    name: g.name,
    years: g.birthYear ? `b. ${g.birthYear}` : undefined,
    relation: g.relation,
    living: true,
    generation: 3,
    glens: [CHIIMBA],
  }));

  const all = [...parents, ...siblings, ...children, ...grandchildren];

  return {
    caption:
      'Four generations \u2014 from Sekuru Johannes and Ambuya Juliana Mushore, through the ten children they raised, to her own seven and their eighteen.',
    generations: groupByGeneration(all, {
      0: 'Her parents',
      1: 'Her generation',
      2: 'Her children',
      3: 'Her grandchildren',
    }),
  };
}
