/**
 * A single family model for every memorial.
 *
 * WHY THIS EXISTS — the brief asked to confirm the data shape first, and it was
 * right to. The two trees on this platform had incompatible shapes:
 *
 *   John Peters  x/y coordinates hand-placed on an SVG canvas, with `glens[]`
 *                but no explicit parent/child or spouse edges — the relationships
 *                were implied by where a node happened to sit.
 *   Virginia     four flat lists (parents, siblings, children, grandchildren)
 *                with no edges at all and no Glen membership.
 *
 * So neither could express parent/child, spouse or multi-Glen membership
 * reliably, and nothing could be shared between them. That is the root cause,
 * and it is fixed here rather than papered over in the view layer.
 *
 * Generations are explicit integers rather than derived, because derivation
 * breaks the moment a family has half-siblings, remarriages or adoptions — all
 * of which real families have.
 */

export interface FamilyPerson {
  id: string;
  name: string;
  /** "1955–2025", "b. 1960", or omitted when the family has not recorded them. */
  years?: string;
  /** How this person relates to the subject of the memorial. */
  relation?: string;
  /** Family term as the family uses it — Sekuru, Amaini, Ambuya. */
  kinship?: string;
  living: boolean;
  /** Explicit. Lower numbers are older generations. 0 = the eldest shown. */
  generation: number;
  /** Family Glens this person belongs to. More than one is the interesting case. */
  glens?: string[];
  /** Their own memorial, when one exists. */
  memorialSlug?: string;
  photo?: string;
  /** id of a spouse in the same list. */
  spouseOf?: string;
  /** ids of parents in the same list. */
  parentIds?: string[];
  /** The person whose memorial this is. */
  isSubject?: boolean;
  /** Living Legacy member badge. */
  legacyMember?: boolean;
}

export interface GenerationGroup {
  generation: number;
  label: string;
  people: FamilyPerson[];
}

export interface FamilyTreeData {
  /** Rendered above the tree, e.g. "Four generations of the Mushore family". */
  caption?: string;
  generations: GenerationGroup[];
}

/** Groups a flat list into labelled generations, oldest first. */
export function groupByGeneration(
  people: FamilyPerson[],
  labels: Record<number, string>,
): GenerationGroup[] {
  const byGen = new Map<number, FamilyPerson[]>();
  for (const p of people) {
    const list = byGen.get(p.generation) ?? [];
    list.push(p);
    byGen.set(p.generation, list);
  }
  return [...byGen.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([generation, group]) => ({
      generation,
      label: labels[generation] ?? `Generation ${generation + 1}`,
      people: group,
    }));
}

/** Everyone who belongs to more than one Family Glen. */
export function multiGlenPeople(people: FamilyPerson[]): FamilyPerson[] {
  return people.filter((p) => (p.glens?.length ?? 0) > 1);
}

/** Flattens grouped generations back to a list. */
export function flatten(data: FamilyTreeData): FamilyPerson[] {
  return data.generations.flatMap((g) => g.people);
}

export const MULTI_GLEN_NOTE =
  'Some people belong to more than one Family Glen \u2014 through marriage, or because they are ' +
  'part of two family lines. They appear in each one, and are marked here.';
