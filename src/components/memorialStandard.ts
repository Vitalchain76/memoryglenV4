import type { ReactNode } from 'react';
import type { MemorialTab, MemorialTabId, SubNavLink } from '@/components/memorialTabs';
import { MEMORIAL_TAB_ORDER } from '@/components/memorialTabs';

/**
 * THE MEMORIAL STANDARD — one contract every memorial inherits.
 *
 * Before this existed there were three different templates on the site:
 *
 *   John Peters   a bespoke page with its own hand-written tab bar
 *   Virginia      MemorialTabShell with her own five tabs
 *   everyone else a single scrolling page with NO TABS AT ALL — 25 of the
 *                 27 memorials, with no Journey, no Family Glen and no
 *                 Family Tree
 *
 * That is why memorials felt like different products. Every memorial now
 * declares its content against this one contract and gets the same five rooms,
 * the same tab bar and the same behaviour.
 *
 * THE RULES, and they are rules rather than suggestions:
 *
 *  1. Five rooms, always in this order: Journey, Memorial, Family Glen,
 *     Family Tree, Living Legacy. No custom top-level tabs, ever.
 *  2. A room with no content is HIDDEN, not shown empty. A visitor should
 *     never open a tab to find nothing.
 *  3. Extra content — videos, booklets, songs — becomes a SECTION inside an
 *     existing room with a sub-navigation entry. It never becomes a sixth tab.
 *  4. The Memorial room is the default landing room. A visitor sees the life
 *     before the funeral.
 *  5. Exactly one family tree per memorial. Never render a second listing of
 *     the same people underneath it.
 */

export interface MemorialSection {
  /** Anchor id, used for sub-navigation. */
  id: string;
  /** Sub-navigation label. Omit to keep the section out of the sub-nav. */
  label?: string;
  /** False hides the section entirely — rule 2. */
  available: boolean;
  content: ReactNode;
}

export interface RoomSpec {
  id: MemorialTabId;
  /** Override the standard tab label. Rarely needed. */
  label?: string;
  count?: number;
  /**
   * Sections inside this room, in order. A room whose sections are all
   * unavailable is dropped from the tab bar.
   */
  sections: MemorialSection[];
  /** Force the room to show even with no available sections. */
  alwaysShow?: boolean;
}

/**
 * Turns a memorial's declared rooms into tabs for MemorialTabShell.
 * Drops empty rooms, builds sub-navigation, and keeps the canonical order.
 */
export function buildStandardTabs(
  rooms: RoomSpec[],
  renderSections: (sections: MemorialSection[]) => ReactNode,
): MemorialTab[] {
  const byId = new Map(rooms.map((r) => [r.id, r]));

  return MEMORIAL_TAB_ORDER.flatMap((id) => {
    const room = byId.get(id);
    if (!room) return [];

    const available = room.sections.filter((s) => s.available);
    // Rule 2 — never show a room a visitor would open to find nothing.
    if (available.length === 0 && !room.alwaysShow) return [];

    const subnav: SubNavLink[] = available
      .filter((s) => s.label)
      .map((s) => ({ label: s.label as string, href: `#${s.id}` }));

    return [
      {
        id,
        label: room.label,
        count: room.count,
        // Sub-navigation is noise for one section.
        subnav: subnav.length > 1 ? subnav : undefined,
        content: renderSections(available),
      },
    ];
  });
}

/** Which rooms a memorial ended up with. Used by the consistency tests. */
export function roomIds(tabs: MemorialTab[]): MemorialTabId[] {
  return tabs.map((t) => t.id);
}
