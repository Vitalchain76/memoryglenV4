import { Link } from 'react-router';
import { Moon, Sun } from 'lucide-react';
import { useThemeMode } from '@/components/Layout';
import { useWhiteLabel } from '@/context/WhiteLabelContext';

// LivingGlen active-life palette (kept local so MemoryGlen tokens are untouched).
const LG_EMERALD = '#059669';
const LG_MINT = '#D1FAE5';
const LG_FOOTER_BG = '#053d31'; // deep emerald/stone surface
const LG_FOOTER_TEXT = '#ecfdf5';
const LG_FOOTER_SOFT = '#a7f3d0';

const QUICK_LINKS = [
  { to: '/memorials', label: 'Browse Memorials' },
  { to: '/create', label: 'Create a Memorial' },
  { to: '/themes', label: 'Themes' },
  { to: '/plans', label: 'Plans & Pricing' },
];

// LivingGlen quick links — active-life sections and real routes. Group Glens
// and Time Capsules are in-page anchors on the LivingGlen home.
const LIVINGGLEN_QUICK_LINKS = [
  { to: '/#group-glens', label: 'Group Glens' },
  { to: '/#time-capsules', label: 'Time Capsules' },
  { to: '/service-providers', label: 'Service Providers' },
  { to: '/plans', label: 'Plans' },
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

// LivingGlen partner column — active-life partners only, no funeral/burial.
const LIVINGGLEN_PARTNER_LINKS = [
  { to: '/service-providers', label: 'Service Providers — list your service' },
  { to: '/plans', label: 'Group & Team Plans' },
];

const LANGUAGES = [
  { code: 'EN', label: 'English', soon: false },
  { code: 'SN', label: 'chiShona', soon: true },
  { code: 'ND', label: 'isiNdebele', soon: true },
  { code: 'ZU', label: 'isiZulu', soon: true },
  { code: 'AF', label: 'Afrikaans', soon: true },
];

/** Footer — design.md §7.2. Forest surface, bone text, dedication on every page.
 *
 * Domain-aware: on livingglen.com (isLivingGlen) the footer switches to the
 * LivingGlen wordmark, active-life quick links, an emerald/stone surface, and
 * drops the Virginia founding-memorial dedication and all mourning copy. Those
 * remain strictly on memoryglen.com. */
export default function Footer() {
  const { mode, toggleMode } = useThemeMode();
  const { isLivingGlen } = useWhiteLabel();

  const quickLinks = isLivingGlen ? LIVINGGLEN_QUICK_LINKS : QUICK_LINKS;
  const partnerLinks = isLivingGlen ? LIVINGGLEN_PARTNER_LINKS : PARTNER_LINKS;

  const footerClass = isLivingGlen ? '' : 'bg-forest text-bone';
  const footerStyle = isLivingGlen ? { backgroundColor: LG_FOOTER_BG, color: LG_FOOTER_TEXT } : undefined;
  const softColor = isLivingGlen ? LG_FOOTER_SOFT : undefined;
  const accentColor = isLivingGlen ? LG_MINT : undefined;

  return (
    <footer className={footerClass} style={footerStyle}>
      <div className="container-content grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* 1 — Wordmark */}
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo-mark.svg" alt="" width={32} height={32} />
            <span className="font-display text-[1.375rem] font-medium">{isLivingGlen ? 'LivingGlen' : 'MemoryGlen'}</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: softColor }}>
            {isLivingGlen ? 'LivingGlen — Active Life Operating System' : 'Where Memories Live Forever.'}
          </p>
          {isLivingGlen ? (
            <p className="mt-6 max-w-xs text-sm leading-relaxed" style={{ color: softColor }}>
              A secure living archive for daily milestones, voice memories and time capsules — author your story as it happens.
            </p>
          ) : (
            <p className="mt-6 max-w-xs text-sm italic leading-relaxed text-sage">
              Inspired by the life and memory of Virginia Dadirayi Chiimba.
            </p>
          )}
        </div>

        {/* 2 — Quick Links */}
        <nav aria-label="Quick links">
          <h3 className={isLivingGlen ? 'eyebrow' : 'eyebrow !text-sage'} style={{ color: softColor }}>Quick Links</h3>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="inline-flex min-h-6 items-center text-sm transition-colors hover:opacity-80" style={{ color: isLivingGlen ? LG_FOOTER_TEXT : undefined }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3 — Support */}
        <nav aria-label="Support">
          <h3 className={isLivingGlen ? 'eyebrow' : 'eyebrow !text-sage'} style={{ color: softColor }}>Support</h3>
          <ul className="mt-5 space-y-3">
            {SUPPORT_LINKS.map((l) => (
              <li key={l.label}>
                {'href' in l && l.href ? (
                  <a href={l.href} className="inline-flex min-h-6 items-center text-sm transition-colors hover:opacity-80" style={{ color: isLivingGlen ? LG_FOOTER_TEXT : undefined }}>
                    {l.label} <span className="sr-only">(email admin@memoryglen.com)</span>
                  </a>
                ) : (
                  <Link to={l.to!} className="inline-flex min-h-6 items-center text-sm transition-colors hover:opacity-80" style={{ color: isLivingGlen ? LG_FOOTER_TEXT : undefined }}>
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm" style={{ color: softColor }}>admin@memoryglen.com</p>
        </nav>

        {/* 4 — For Partners */}
        <nav aria-label="For partners">
          <h3 className={isLivingGlen ? 'eyebrow' : 'eyebrow !text-sage'} style={{ color: softColor }}>For Partners</h3>
          <ul className="mt-5 space-y-3">
            {partnerLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="inline-flex min-h-6 items-center text-sm transition-colors hover:opacity-80" style={{ color: isLivingGlen ? LG_FOOTER_TEXT : undefined }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className={isLivingGlen ? '' : 'border-t border-bone/10'} style={isLivingGlen ? { borderTop: `1px solid ${LG_EMERALD}` } : undefined}>
        <div className="container-content flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm" style={{ color: softColor }}>© 2026 {isLivingGlen ? 'LivingGlen' : 'MemoryGlen'}. All rights reserved.</p>
            {/* Legal links — required on any site that stores personal data */}
            <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: softColor }}>
              <Link to="/terms" className="underline-offset-4 transition-colors hover:underline">
                Terms of Service
              </Link>
              <Link to="/privacy" className="underline-offset-4 transition-colors hover:underline">
                Privacy Policy
              </Link>
            </p>
            {/* Founding credit — Virginia Dadirayi Chiimba is a real person and the
                memorial this platform was built for. Quiet, permanent, never demo-labelled.
                MemoryGlen only — never on the active LivingGlen surface. */}
            {!isLivingGlen && (
              <p className="mt-1.5 text-sm text-sage">
                Inspired by{' '}
                <Link
                  to="/memorials/virginia-dadirayi-chiimba"
                  className="text-brass-soft underline-offset-4 transition-colors hover:text-brass hover:underline"
                >
                  Virginia Dadirayi Chiimba
                </Link>{' '}
                — Founding Memorial
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {/* Dusk / Parchment mode toggle */}
            <button
              type="button"
              onClick={toggleMode}
              aria-label={mode === 'dusk' ? 'Switch to Parchment (light) mode' : 'Switch to Dusk (dark) mode'}
              className="flex min-h-12 items-center gap-2 rounded-sm px-2 text-sm transition-colors hover:opacity-80"
              style={{ color: softColor }}
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
                  className="min-h-12 px-1"
                  style={{
                    color: l.soon ? softColor : accentColor ?? undefined,
                    fontWeight: l.soon ? undefined : 600,
                    cursor: l.soon ? 'default' : 'pointer',
                    opacity: l.soon ? 0.6 : 1,
                  }}
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
