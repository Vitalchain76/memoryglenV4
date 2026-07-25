import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import App from '@/App';

/**
 * The memorial pages are public. Adding accounts must not gate them, and the
 * app must not break when Supabase is unconfigured (no .env present, which is
 * exactly the state of a fresh clone and of this test environment).
 */
const renderAt = (path: string) => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  return user;
};

describe('memorials stay public after adding auth', () => {
  it('Virginia renders for a signed-out visitor, with no credentials configured', () => {
    renderAt('/memorials/virginia-dadirayi-chiimba');
    expect(screen.getAllByText(/Virginia Dadirayi Chiimba/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mwari mubatsiri wedu/i).length).toBeGreaterThan(0);
  });

  it('John Peters renders for a signed-out visitor', () => {
    renderAt('/memorials/john-peters');
    expect(screen.getAllByText(/John Peters/i).length).toBeGreaterThan(0);
  });

  it('the directory renders for a signed-out visitor', () => {
    renderAt('/memorials');
    expect(screen.getAllByText(/Tendai Moyo/i).length).toBeGreaterThan(0);
  });

  it('tabs still switch on one click while signed out', async () => {
    const user = renderAt('/memorials/virginia-dadirayi-chiimba');
    await user.click(screen.getByRole('tab', { name: /Family Tree/i }));
    expect(screen.getAllByText(/Sekuru Johannes/i).length).toBeGreaterThan(0);
  });

  it('sign-in page degrades gracefully when unconfigured', () => {
    renderAt('/signin');
    expect(screen.getAllByText(/Accounts are not switched on yet/i).length).toBeGreaterThan(0);
    // and still points people back to the public memorials
    expect(screen.getAllByText(/Browse memorials without an account/i).length).toBeGreaterThan(0);
  });

  it('no Supabase key is hard-coded anywhere in source', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? walk(p) : [p];
      });
    // Exclude this file: it necessarily contains the patterns it searches for.
    const files = walk('src').filter(
      (f) => /\.(ts|tsx)$/.test(f) && !f.includes('__tests__'),
    );
    const projectHost = ['supabase', 'co'].join('.');
    const jwtPrefix = ['eyJ', 'hbGciOi'].join('');
    const offenders = files.filter((f) => {
      const t = fs.readFileSync(f, 'utf8');
      return t.includes(projectHost) || t.includes(jwtPrefix);
    });
    expect(offenders, `hard-coded credentials in: ${offenders.join(', ')}`).toEqual([]);
  });
});
