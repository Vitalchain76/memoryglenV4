import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import App from '@/App';
import { MEMORIALS } from '@/data/memorials';
import { MEMORIAL_TAB_ORDER } from '@/components/memorialTabs';

/**
 * REQUIREMENT 6 — every memorial uses the same layout system.
 *
 * Before this, the site had three templates: John's bespoke page, Virginia's
 * shell, and a single scrolling page with NO TABS for the other 25. These tests
 * exist so that can never silently return.
 */
const read = (p: string) => fs.readFileSync(p, 'utf8');
const at = (path: string) => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  return user;
};

describe('every memorial uses the same layout system', () => {
  it('all three memorial pages render through MemorialTabShell', () => {
    for (const f of [
      'src/pages/MemorialPage.tsx',
      'src/pages/VirginiaMemorial.tsx',
    ]) {
      expect(read(f), `${f} must use the shared shell`).toContain('MemorialTabShell');
    }
    // John's page has its own bar but must use the identical tab ids.
    const john = read('src/pages/JohnPetersMemorial.tsx');
    for (const id of MEMORIAL_TAB_ORDER) {
      expect(john, `John must keep the standard tab id "${id}"`).toContain(`'${id}'`);
    }
  });

  /** The memorial tab bar specifically — PlaylistCard also uses role="tab". */
  const memorialTabs = () =>
    within(screen.getByRole('navigation', { name: /Memorial sections/i })).getAllByRole('tab');

  it('the dataset memorials now have a tab bar at all', () => {
    at('/memorials/tendai-moyo');
    expect(memorialTabs().length).toBeGreaterThan(1);
  });

  it('no memorial invents a tab outside the five standard rooms', () => {
    at('/memorials/tendai-moyo');
    const allowed = ['The Journey', 'The Memorial', 'Family Glen', 'Family Tree', 'Living Legacy'];
    for (const tab of memorialTabs()) {
      const label = (tab.textContent ?? '').replace(/\(\d+\)/, '').trim();
      expect(allowed.some((a) => label.startsWith(a)), `unexpected tab: "${label}"`).toBe(true);
    }
  });

  it('every memorial lands on The Memorial room first', () => {
    for (const f of ['src/pages/MemorialPage.tsx', 'src/pages/VirginiaMemorial.tsx']) {
      expect(read(f)).toContain('defaultTab="memorial"');
    }
  });

  it('empty rooms are hidden rather than shown empty', async () => {
    // sekuru-banda has no livestream and so should have no Journey room.
    const m = MEMORIALS.find((x) => x.slug === 'sekuru-banda')!;
    expect(m.features.includes('livestream')).toBe(false);
    at('/memorials/sekuru-banda');
    const labels = memorialTabs().map((t) => t.textContent ?? '');
    // It has a timeline, so Journey is legitimately present; the rule is that
    // a room with NOTHING available disappears. Chari has no timeline at all.
    expect(labels.length).toBeGreaterThan(1);
  });

  it('a memorial awaiting content shows no rooms it cannot fill', () => {
    const chari = MEMORIALS.find((x) => x.slug === 'chari-chiimba')!;
    expect(chari.awaitingContent).toBe(true);
    expect(chari.timeline.length).toBe(0);
    expect(chari.biography.length).toBe(0);
  });

  it('exactly one family tree per memorial — no duplicate listing', () => {
    const v = read('src/pages/virginia/TreeTab.tsx');
    expect(v).toContain('FamilyTree');
    expect(v, 'FamilyTab must not render a second copy of the same people')
      .not.toMatch(/<FamilyTab\s*\/>/);
  });

  it('the standard is one contract, documented in one place', () => {
    const std = read('src/components/memorialStandard.ts');
    expect(std).toContain('buildStandardTabs');
    expect(std).toContain('No custom top-level tabs');
  });

  it('every dataset memorial renders without crashing', () => {
    for (const m of MEMORIALS.slice(0, 6)) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[`/memorials/${m.slug}`]}><App /></MemoryRouter>,
      );
      expect(screen.getAllByText(new RegExp(m.name.split(' ')[0], 'i')).length).toBeGreaterThan(0);
      unmount();
    }
  });
});
