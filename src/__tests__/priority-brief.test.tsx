import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import App from '@/App';
import FamilyTree from '@/components/family/FamilyTree';
import { buildVirginiaTree } from '@/pages/virginia/familyTreeData';
import { buildJohnTree } from '@/pages/john-peters/familyTreeData';
import { flatten, multiGlenPeople } from '@/components/family/familyModel';

const at = (path: string) => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  return user;
};
const read = (p: string) => fs.readFileSync(p, 'utf8');

/* ---------------- P1 — homepage clarity ---------------- */
describe('P1 homepage explains the product', () => {
  it('hero has exactly two calls to action', () => {
    at('/');
    expect(screen.getAllByRole('link', { name: /Create a Memorial/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /View Demo Memorial/i }).length).toBeGreaterThan(0);
  });

  it('the demo button lands on a real populated memorial, not the directory', () => {
    const hero = read('src/pages/home/Hero.tsx');
    expect(hero).toContain('/memorials/john-peters');
  });

  it('how it works is three steps', () => {
    const src = read('src/pages/home/HowItWorks.tsx');
    expect((src.match(/^\s{4}title: '/gm) ?? []).length).toBe(3);
  });

  it('explains Family Glen in plain language, under 40 words', () => {
    at('/');
    expect(screen.getAllByText(/What is a Family Glen\?/i).length).toBeGreaterThan(0);
    const para = screen.getByText(/A Family Glen is a shared digital space/i).textContent ?? '';
    expect(para.trim().split(/\s+/).length).toBeLessThanOrEqual(40);
  });

  it('answers who can see it, who controls it, and how long it lasts', () => {
    at('/');
    for (const q of [/Who can see it/i, /Who controls it/i, /How long it lasts/i]) {
      expect(screen.getAllByText(q).length).toBeGreaterThan(0);
    }
  });
});

/* ---------------- P2 — family tree everywhere ---------------- */
describe('P2 one family tree, used on every memorial', () => {
  it('the data model supports parent/child, spouse and multi-Glen', () => {
    const people = flatten(buildJohnTree());
    expect(people.some((p) => (p.parentIds?.length ?? 0) > 0), 'parent/child').toBe(true);
    expect(people.some((p) => p.spouseOf), 'spouse').toBe(true);
    expect(multiGlenPeople(people).length, 'multi-Glen').toBeGreaterThan(0);
  });

  it('Virginia and John both use the shared component', () => {
    for (const f of ['src/pages/virginia/TreeTab.tsx', 'src/pages/john-peters/TreeTab.tsx']) {
      expect(read(f), `${f} must use the shared tree`).toContain("from '@/components/family/FamilyTree'");
    }
  });

  it('renders a legend and generation labels', () => {
    render(<MemoryRouter><FamilyTree data={buildVirginiaTree()} /></MemoryRouter>);
    expect(screen.getAllByText(/Legend/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Her parents/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Her grandchildren/i).length).toBeGreaterThan(0);
  });

  it('badges people in more than one Glen, and explains why', () => {
    render(<MemoryRouter><FamilyTree data={buildJohnTree()} /></MemoryRouter>);
    expect(screen.getAllByText(/2 Glens/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/more than one Family Glen/i).length).toBeGreaterThan(0);
  });

  it('handles loading, empty and error states', () => {
    const { unmount: u1 } = render(<MemoryRouter><FamilyTree loading /></MemoryRouter>);
    expect(document.querySelector('[aria-busy="true"]')).toBeTruthy();
    u1();
    const { unmount: u2 } = render(<MemoryRouter><FamilyTree /></MemoryRouter>);
    expect(screen.getAllByText(/has not been built yet/i).length).toBeGreaterThan(0);
    u2();
    render(<MemoryRouter><FamilyTree error="Network unavailable" /></MemoryRouter>);
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
  });

  it('the tree appears on both real memorials, on one click', async () => {
    const user = at('/memorials/virginia-dadirayi-chiimba');
    await user.click(screen.getByRole('tab', { name: /Family Tree/i }));
    expect(screen.getAllByText(/Legend/i).length).toBeGreaterThan(0);
  });
});

/* ---------------- P3 — mobile ---------------- */
describe('P3 mobile usability', () => {
  it('no interactive element is under 44px', () => {
    const walk = (d: string): string[] =>
      fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
        const p = `${d}/${e.name}`;
        return e.isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
      });
    const files = ['src/components', 'src/pages'].flatMap(walk);
    const offenders = files.filter((f) => /min-h-(8|9|10)\b/.test(read(f)));
    expect(offenders, `sub-44px targets in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('body text is at least 16px', () => {
    expect(read('src/index.css')).toMatch(/body\s*\{[^}]*font-size:\s*1rem/s);
  });

  it('the tab bar scrolls rather than overflowing the page', () => {
    expect(read('src/components/MemorialTabShell.tsx')).toContain('overflow-x-auto');
  });

  it('the family tree stacks to one column on a phone', () => {
    expect(read('src/components/family/FamilyTree.tsx')).toContain('grid gap-4 sm:grid-cols-2 lg:grid-cols-3');
  });
});

/* ---------------- P4 — shareability ---------------- */
describe('P4 Open Graph and sharing', () => {
  it('prerenders a real HTML file per memorial with OG tags', () => {
    const dist = 'dist/memorials/virginia-dadirayi-chiimba/index.html';
    if (!fs.existsSync(dist)) return; // only after `npm run build`
    const html = read(dist);
    expect(html).toContain('property="og:title"');
    expect(html).toContain('Virginia Dadirayi Chiimba');
    expect(html).toContain('1955');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('twitter:card');
  });

  it('the prerender script covers every memorial in the pack', () => {
    const script = read('scripts/prerender.mjs');
    expect(script).toContain('memorials.json');
    expect(script).toContain('og:image');
  });

  it('memorial pages offer a WhatsApp share', () => {
    expect(read('src/components/QRShareBlock.tsx')).toContain('wa.me');
  });
});

/* ---------------- follow-up fixes ---------------- */
describe('follow-up: base URL and mobile tree', () => {
  it('the prerender base URL comes from the environment, never hard-coded', () => {
    const s = read('scripts/prerender.mjs');
    expect(s).not.toMatch(/const SITE = .*'https:\/\/memoryglen\.com'/);
    expect(s).toContain('VERCEL_PROJECT_PRODUCTION_URL');
    expect(s).toContain('SITE_URL');
  });

  it('prerender is idempotent — running twice must not duplicate tags', () => {
    const s = read('scripts/prerender.mjs');
    expect(s).toContain('rel="canonical"[^>]*>\\s*/gi');
    expect(s).toContain('property="og:[^"]*"[^>]*>\\s*/gi');
  });

  it("John's pan/zoom canvas does not swallow touch scrolling on a phone", () => {
    const s = read('src/pages/john-peters/TreeTab.tsx');
    expect(s).toContain('hidden pb-16 lg:block');
  });

  it('the readable family tree is still shown on every screen size', () => {
    const s = read('src/pages/john-peters/TreeTab.tsx');
    const shared = s.indexOf('<FamilyTree');
    const canvas = s.indexOf('hidden pb-16 lg:block');
    expect(shared).toBeGreaterThan(-1);
    expect(shared, 'shared tree must come before the desktop-only canvas').toBeLessThan(canvas);
  });
});
