import { groupByGeneration } from '@/components/family/familyModel';
import type { FamilyPerson, FamilyTreeData } from '@/components/family/familyModel';

/**
 * The Peters family, mapped into the shared model.
 *
 * The old canvas used hand-placed x/y coordinates with relationships implied by
 * position. Generations are explicit here, and the `glens` already present in
 * that data carry straight over — Sarah and Thomas Miller belong to both the
 * Peters and Miller Glens, which is the multi-Glen case the badge is for.
 *
 * All fictional: this is the demonstration memorial.
 */
const PETERS = 'Peters Family Glen';
const MILLER = 'Miller Family Glen';
const CHIWESHE = 'Chiweshe Family Glen';

const PEOPLE: FamilyPerson[] = [
  { id: 'samuel', name: 'Samuel Peters', years: '1931\u20132001', relation: 'Father of John', living: false, generation: 0, glens: [PETERS], memorialSlug: 'samuel-peters' },
  { id: 'ruth', name: 'Ruth Peters', years: '1935\u20132011', relation: 'Mother of John', living: false, generation: 0, glens: [PETERS], memorialSlug: 'ruth-peters', spouseOf: 'samuel' },

  { id: 'john', name: 'John Peters', years: '1958\u20132026', relation: 'This memorial', living: false, generation: 1, glens: [PETERS], memorialSlug: 'john-peters', isSubject: true, parentIds: ['samuel', 'ruth'], photo: '/john-portrait.jpg' },
  { id: 'grace', name: 'Grace Peters', years: 'b. 1960', relation: 'Wife of John', living: true, generation: 1, glens: [PETERS], legacyMember: true, spouseOf: 'john', photo: '/john-wife.jpg' },
  { id: 'james', name: 'James Peters', years: '1961\u20132019', relation: 'Brother of John', living: false, generation: 1, glens: [PETERS], memorialSlug: 'james-peters', parentIds: ['samuel', 'ruth'] },

  { id: 'david', name: 'David Peters', years: 'b. 1986', relation: 'Son \u00b7 Harare', living: true, generation: 2, glens: [PETERS, CHIWESHE], legacyMember: true, parentIds: ['john', 'grace'], photo: '/john-son.jpg' },
  { id: 'sarah', name: 'Sarah Miller', years: 'b. 1988', relation: 'Daughter \u00b7 London', living: true, generation: 2, glens: [PETERS, MILLER], legacyMember: true, parentIds: ['john', 'grace'], photo: '/john-daughter.jpg' },
  { id: 'thomas', name: 'Thomas Miller', years: 'b. 1987', relation: 'Husband of Sarah', living: true, generation: 2, glens: [MILLER], spouseOf: 'sarah' },
  { id: 'michael', name: 'Michael Peters', years: 'b. 1991', relation: 'Son \u00b7 Johannesburg', living: true, generation: 2, glens: [PETERS], parentIds: ['john', 'grace'] },
];

export function buildJohnTree(): FamilyTreeData {
  return {
    caption:
      'Three generations of the Peters family. Sarah and David each belong to two Family Glens \u2014 one through birth, one through marriage.',
    generations: groupByGeneration(PEOPLE, {
      0: 'His parents',
      1: 'His generation',
      2: 'His children',
    }),
  };
}
