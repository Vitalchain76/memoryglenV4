import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, beforeAll } from 'vitest';
import MemorialTabShell from '@/components/MemorialTabShell';
import type { MemorialTab } from '@/components/memorialTabs';

beforeAll(() => { Element.prototype.scrollIntoView = () => {}; });

const tabs: MemorialTab[] = [
  { id: 'journey',  content: <p>JOURNEY_CONTENT</p> },
  { id: 'memorial', content: <p>MEMORIAL_CONTENT</p> },
  { id: 'glen',     content: <p>GLEN_CONTENT</p> },
  { id: 'tree',     content: <p>TREE_CONTENT</p> },
  { id: 'legacy',   content: <p>LEGACY_CONTENT</p> },
];

const setup = () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/m']}>
      <MemorialTabShell tabs={tabs} defaultTab="memorial" />
    </MemoryRouter>,
  );
  return user;
};

describe('tab content appears on the click itself', () => {
  it('IMMEDIATELY after one click — no waiting, no second activation', async () => {
    const user = setup();
    await user.click(screen.getByRole('tab', { name: /Family Glen/i }));
    // No waitFor. This is what the user sees the instant they click.
    expect(screen.queryByText('GLEN_CONTENT'), 'new tab content missing right after click').toBeTruthy();
    expect(screen.queryByText('MEMORIAL_CONTENT'), 'old tab content still on screen').toBeFalsy();
  });

  it('every tab, immediately', async () => {
    const user = setup();
    for (const [name, text] of [
      ['The Journey', 'JOURNEY_CONTENT'],
      ['Family Glen', 'GLEN_CONTENT'],
      ['Family Tree', 'TREE_CONTENT'],
      ['Living Legacy', 'LEGACY_CONTENT'],
    ] as const) {
      await user.click(screen.getByRole('tab', { name: new RegExp(name, 'i') }));
      expect(screen.queryByText(text), `${name}: content not shown on click`).toBeTruthy();
    }
  });
});
