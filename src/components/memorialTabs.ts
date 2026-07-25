import type { ReactNode } from 'react';

/**
 * The MemoryGlen five-room memorial — the standard structure every memorial
 * receives, real or demonstration.
 *
 *   1. Journey       — the final journey, coordination, events after passing
 *   2. Memorial      — life story, tributes, photographs, voice, hymn, poem
 *   3. Family Glen   — the family's resting places
 *   4. Family Tree   — genealogy and relationships
 *   5. Living Legacy — optional
 *
 * Ids match John Peters' bespoke page exactly, so the two remain interchangeable
 * and deep links (?tab=glen) behave identically across every memorial.
 */
export type MemorialTabId = 'journey' | 'memorial' | 'glen' | 'tree' | 'legacy';

export const MEMORIAL_TAB_ORDER: MemorialTabId[] = [
  'journey',
  'memorial',
  'glen',
  'tree',
  'legacy',
];

export const MEMORIAL_TAB_LABELS: Record<MemorialTabId, string> = {
  journey: 'The Journey',
  memorial: 'The Memorial',
  glen: 'Family Glen',
  tree: 'Family Tree',
  legacy: 'Living Legacy',
};

export interface SubNavLink {
  label: string;
  href: string;
}

export interface MemorialTab {
  id: MemorialTabId;
  /** Override the standard label if a memorial needs different wording. */
  label?: string;
  count?: number;
  /** Quiet in-page links for long tabs. */
  subnav?: SubNavLink[];
  content: ReactNode;
}
