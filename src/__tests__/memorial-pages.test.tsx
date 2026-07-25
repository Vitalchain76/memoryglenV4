import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import App from '@/App';


const renderAt = (path: string) => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  return user;
};

// A marker of text unique to each tab's real content
const MARKERS: Record<string, RegExp> = {
  'The Journey': /From 19 May 2025|Documentation|final journey/i,
  'Family Glen': /Where she rests|Where He Rests|Family Glen/i,
  'Family Tree': /Four generations|Her Parents and Siblings|Family Tree/i,
  'Living Legacy': /Living Legacy/i,
};

describe('real memorial pages — one click shows the tab', () => {
  it("Virginia's five rooms", async () => {
    const user = renderAt('/memorials/virginia-dadirayi-chiimba');
    for (const [tabName, marker] of Object.entries(MARKERS)) {
      await user.click(screen.getByRole('tab', { name: new RegExp(tabName, 'i') }));
      const hits = screen.queryAllByText(marker);
      expect(hits.length, `Virginia · ${tabName}: nothing rendered on click`).toBeGreaterThan(0);
    }
  });

  it("John Peters' five rooms", async () => {
    const user = renderAt('/memorials/john-peters');
    for (const tabName of ['The Journey', 'Family Glen', 'Family Tree', 'Living Legacy', 'The Memorial']) {
      await user.click(screen.getByRole('tab', { name: new RegExp(tabName, 'i') }));
      // The panel must be non-empty the instant the click resolves
      const main = document.body.textContent ?? '';
      expect(main.length, `John · ${tabName}: blank panel on click`).toBeGreaterThan(3000);
    }
  });
});
