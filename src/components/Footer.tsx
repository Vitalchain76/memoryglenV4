import { Link } from 'react-router';
import { Moon, Sun } from 'lucide-react';
import { useThemeMode } from '@/components/Layout';

const QUICK_LINKS = [
  { to: '/memorials', label: 'Browse Memorials' },
  { to: '/create', label: 'Create a Memorial' },
  { to: '/themes', label: 'Themes' },
  { to: '/plans', label: 'Plans & Pricing' },
];

type FooterLink = { to: string; label: string; href?: never } | { href: string; label: string; to?: never };

const SUPPORT_LINKS: FooterLink[] = [
  { to: '/create', label: 'Help Center' },
  { href: 'mailto:admin@memoryglen.com', label: 'Contact' },
  { to: '/plans', label: 'Privacy Policy' },
  { to: '/plans', label: 'Terms' },
  { to: '/plans', label: 'POPIA' },
];

const PARTNER_LINKS = [
  { to: '/funeral-parlours', label: 'Funeral Parlours' },
  { to: '/burial-societies', label: 'Burial Societies' },
  { to: '/service-providers', label: 'Service Providers — list your service' },
];

const LANGUAGES = [
  { code: 'EN', label: 'English', soon: false },
  { code: 'SN', label: 'chiShona', soon: true },
  { code: 'ND', label: 'isiNdebele', soon: true },
  { code: 'ZU', label: 'isiZulu', soon: true },
  { code: 'AF', label: 'Afrikaans', soon: true },
];

/** Footer — design.md §7.2. Forest surface, bone text, dedication on every page. */
export default function Footer() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <footer className="bg-forest text-bone">
      <div className="container-content grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* 1 — Wordmark */}
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo-mark.svg" alt="" width={32} height={32} />
            <span className="font-display text-[1.375rem] font-medium">MemoryGlen</span>
          </Link>
          <p className="mt-3 text-sm text-sage">Where Memories Live Forever.</p>
          <p className="mt-6 max-w-xs text-sm italic leading-relaxed text-sage">
            Inspired by the life and memory of Virginia Dadirayi Chiimba.
          </p>
        </div>

        {/* 2 — Quick Links */}
        <nav aria-label="Quick links">
          <h3 className="eyebrow !text-sage">Quick Links</h3>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="inline-flex min-h-6 items-center text-sm text-bone/85 transition-colors hover:text-brass-soft">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3 — Support */}
        <nav aria-label="Support">
          <h3 className="eyebrow !text-sage">Support</h3>
          <ul className="mt-5 space-y-3">
            {SUPPORT_LINKS.map((l) => (
              <li key={l.label}>
                {'href' in l && l.href ? (
                  <a href={l.href} className="inline-flex min-h-6 items-center text-sm text-bone/85 transition-colors hover:text-brass-soft">
                    {l.label} <span className="sr-only">(email admin@memoryglen.com)</span>
                  </a>
                ) : (
                  <Link to={l.to!} className="inline-flex min-h-6 items-center text-sm text-bone/85 transition-colors hover:text-brass-soft">
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-sage">admin@memoryglen.com</p>
        </nav>

        {/* 4 — For Partners */}
        <nav aria-label="For partners">
          <h3 className="eyebrow !text-sage">For Partners</h3>
          <ul className="mt-5 space-y-3">
            {PARTNER_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="inline-flex min-h-6 items-center text-sm text-bone/85 transition-colors hover:text-brass-soft">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-bone/10">
        <div className="container-content flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <p className="text-sm text-sage">© 2026 MemoryGlen. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            {/* Dusk / Parchment mode toggle */}
            <button
              type="button"
              onClick={toggleMode}
              aria-label={mode === 'dusk' ? 'Switch to Parchment (light) mode' : 'Switch to Dusk (dark) mode'}
              className="flex min-h-12 items-center gap-2 rounded-sm px-2 text-sm text-sage transition-colors hover:text-brass-soft"
            >
              {mode === 'dusk' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
              {mode === 'dusk' ? 'Parchment' : 'Dusk'}
            </button>

            {/* Language selector */}
            <div className="flex items-center gap-2 text-sm" aria-label="Language">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  disabled={l.soon}
                  title={l.soon ? `${l.label} — coming soon` : l.label}
                  className={
                    l.soon
                      ? 'min-h-12 cursor-default px-1 text-sage/50'
                      : 'min-h-12 px-1 font-semibold text-bone'
                  }
                >
                  {l.code}
                  {l.soon && <span className="ml-1 text-[10px] uppercase tracking-wider">soon</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
