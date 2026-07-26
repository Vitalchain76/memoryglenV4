import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

/**
 * The "Family Service Providers" panel is the only advertising surface on a
 * memorial. These assertions pin the layout rules that keep it from covering or
 * squeezing the memorial content. They are source assertions rather than visual
 * ones because jsdom has no CSS layout engine — but they catch the exact class
 * changes that would reintroduce the problem.
 */
const read = (p: string) => fs.readFileSync(p, 'utf8');

describe('service provider panel never overlaps memorial content', () => {
  const rail = read('src/components/ServiceProviderRail.tsx');

  it('is full width and stacked below xl, a fixed column only at xl and up', () => {
    // Without w-full + min-w-0 it becomes a flex sibling and squeezes the
    // memorial into an unreadable column on narrow screens.
    expect(rail).toContain('w-full min-w-0 xl:w-[280px] xl:flex-none');
  });

  it('renders the sticky sidebar only at xl, and the inline panel only below xl', () => {
    expect(rail).toContain('hidden xl:block');
    expect(rail).toContain('xl:hidden');
  });

  it('its sticky offset clears the sticky tab bar on memorial pages', () => {
    // navbar 72px + tab bar (~48px, ~82px with sub-nav). top-24 (96px) is not
    // enough and tucks the panel under the tab bar.
    expect(rail).toContain("belowStickyTabs ? 'top-[10.5rem]' : 'top-24'");
  });

  it('every page with a sticky tab bar passes belowStickyTabs', () => {
    for (const file of [
      'src/pages/MemorialPage.tsx',
      'src/pages/VirginiaMemorial.tsx',
      'src/pages/john-peters/JourneyTab.tsx',
      'src/pages/john-peters/MemorialTab.tsx',
      'src/pages/john-peters/GlenTab.tsx',
    ]) {
      const src = read(file);
      if (!src.includes('<ServiceProviderRail')) continue;
      expect(src, `${file} must pass belowStickyTabs`).toContain('belowStickyTabs');
    }
  });

  it('parent layouts stack on mobile and only go side-by-side at xl', () => {
    // A bare `flex` here would put the panel beside the content at every width.
    expect(read('src/pages/MemorialPage.tsx')).toContain('flex flex-col gap-12 xl:flex-row');
    expect(read('src/pages/Memorials.tsx')).toContain('xl:flex xl:gap-14');
  });

  it('the sticky stack has no z-index inversion', () => {
    expect(read('src/components/Navbar.tsx')).toContain('sticky top-0 z-50');
    expect(read('src/components/MemorialTabShell.tsx')).toContain('sticky top-[72px] z-40');
  });
});
