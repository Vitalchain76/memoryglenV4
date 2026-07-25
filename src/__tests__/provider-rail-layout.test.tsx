import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import App from '@/App';

/**
 * The "Family Service Providers" panel must never sit beside the memorial
 * content on a narrow screen.
 *
 * ServiceProviderRail renders two things: a sticky <aside> shown only from xl
 * up, and an inline <section> shown below xl. If the enclosing container is a
 * flex ROW at every width, that inline section becomes a flex sibling of the
 * memorial content on phones and squeezes it into an unreadable column.
 * Every container that wraps the rail must therefore stack by default and only
 * become a row at xl.
 */

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

describe('service provider panel never crowds the memorial content', () => {
  it('every container wrapping the rail stacks below xl', () => {
    const files = walk('src').filter(
      (f) => /\.tsx$/.test(f) && !f.includes('__tests__'),
    );
    const offenders: string[] = [];

    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      if (!text.includes('<ServiceProviderRail')) continue;
      // Any flex-row container in a file that renders the rail must be responsive.
      const rowFlex = text.match(/className="[^"]*\bflex gap-12\b[^"]*"/g) ?? [];
      for (const cls of rowFlex) {
        if (!cls.includes('flex-col') || !cls.includes('xl:flex-row')) {
          offenders.push(`${file}: ${cls}`);
        }
      }
    }
    expect(offenders, `flex row at all widths:\n${offenders.join('\n')}`).toEqual([]);
  });

  it('the rail itself is full width when stacked, fixed only at xl', () => {
    const src = fs.readFileSync('src/components/ServiceProviderRail.tsx', 'utf8');
    expect(src).toContain('w-full');
    expect(src).toContain('xl:w-[280px]');
    expect(src).toContain('xl:flex-none');
  });

  it('memorial content and the panel both render on a memorial page', () => {
    render(
      <MemoryRouter initialEntries={['/memorials/tendai-moyo']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/Tendai Moyo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/Family service providers/i).length).toBeGreaterThan(0);
  });

  it('the directory page renders without the panel crowding it', () => {
    render(
      <MemoryRouter initialEntries={['/memorials']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/Tendai Moyo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Virginia Dadirayi Chiimba/i).length).toBeGreaterThan(0);
  });
});
