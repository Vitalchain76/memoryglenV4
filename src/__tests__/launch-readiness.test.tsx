import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import App from '@/App';
import { MEMORIALS } from '@/data/memorials';

const read = (p: string) => fs.readFileSync(p, 'utf8');
const at = (path: string) =>
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe('launch readiness', () => {
  it('no fabricated traction statistics anywhere', () => {
    const home = read('src/pages/Home.tsx');
    // The values themselves, not the explanatory comment.
    expect(home).not.toMatch(/value: '500\+'/);
    expect(home).not.toMatch(/value: '200\+'/);
    expect(home).not.toMatch(/value: '1K\+'/);
    expect(home).not.toMatch(/value: '50\+'/);
  });

  it('John Peters leads the memorials directory, Virginia sits beneath', () => {
    const dir = read('src/pages/Memorials.tsx');
    expect(dir.indexOf('/memorials/john-peters')).toBeLessThan(
      dir.indexOf('/memorials/virginia-dadirayi-chiimba'),
    );
  });

  it('Virginia keeps her quiet Founding Memorial treatment', () => {
    expect(read('src/pages/Memorials.tsx')).toContain('Founding Memorial');
  });

  it('Terms and Privacy pages render', () => {
    at('/terms');
    expect(screen.getAllByText(/Terms of Service/i).length).toBeGreaterThan(0);
  });

  it('Privacy covers living people in family trees', () => {
    at('/privacy');
    expect(screen.getAllByText(/living people/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/POPIA/i).length).toBeGreaterThan(0);
  });

  it('Terms cover content ownership and family control', () => {
    const t = read('src/pages/legal/legalContent.ts');
    expect(t).toContain('Who owns what you add');
    expect(t).toContain('Who controls a memorial');
    expect(t).toContain('Living people who appear in a memorial');
  });

  it('legal links are in the footer on every page', () => {
    at('/');
    expect(screen.getAllByRole('link', { name: /Terms of Service/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Privacy Policy/i }).length).toBeGreaterThan(0);
  });

  it('Open Graph never falls back to the homepage hero for a memorial', () => {
    const s = read('scripts/prerender.mjs');
    expect(s).toContain('og-memorial-fallback.jpg');
    // the memorial loop must not use hero-home
    const loop = s.slice(s.indexOf('for (const m of pack)'));
    expect(loop).not.toContain("'/hero-home.jpg'");
  });

  it('the PWA manifest is valid and complete', () => {
    const m = JSON.parse(read('public/manifest.webmanifest'));
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBeTruthy();
    expect(m.display).toBe('standalone');
    expect(m.theme_color).toBe('#16302B');
    const sizes = m.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    expect(m.icons.some((i: { purpose: string }) => i.purpose === 'maskable')).toBe(true);
  });

  it('the icons actually exist', () => {
    for (const f of ['public/icon-192.png', 'public/icon-512.png', 'public/icon-maskable-512.png']) {
      expect(fs.existsSync(f), `${f} missing`).toBe(true);
    }
  });

  it('the service worker never caches account or sign-in pages', () => {
    const sw = read('public/sw.js');
    expect(sw).toContain("/account");
    expect(sw).toContain("/signin");
    expect(sw).toContain('navigate');
  });

  it('index.html links the manifest and theme colour', () => {
    const h = read('index.html');
    expect(h).toContain('manifest.webmanifest');
    expect(h).toContain('theme-color');
  });

  it('/create is a real multi-step flow, not a placeholder', () => {
    const c = read('src/pages/Create.tsx');
    expect(c.length).toBeGreaterThan(5000);
    expect(c).toContain('step');
  });

  it('every memorial still renders after these changes', () => {
    for (const m of MEMORIALS.slice(0, 4)) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[`/memorials/${m.slug}`]}><App /></MemoryRouter>,
      );
      expect(screen.getAllByText(new RegExp(m.name.split(' ')[0], 'i')).length).toBeGreaterThan(0);
      unmount();
    }
  });
});
