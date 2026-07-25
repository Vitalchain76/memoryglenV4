import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/memorials', label: 'Memorials' },
  { to: '/themes', label: 'Themes' },
  { to: '/funeral-parlours', label: 'Funeral Parlours' },
  { to: '/burial-societies', label: 'Burial Societies' },
  { to: '/plans', label: 'Plans' },
];

/**
 * Navbar — design.md §7.1. Sticky 72px, translucent mode-aware surface with
 * backdrop blur. Gains a 1px brass bottom rule after 40px of scroll.
 * Positioning contract: sticky in normal flow — pages do NOT compensate for
 * nav height.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 h-[72px] backdrop-blur-md transition-[border-color,background-color] duration-300',
          scrolled ? 'border-b border-brass' : 'border-b border-transparent',
        )}
        style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 90%, transparent)' }}
      >
        <div className="container-content flex h-full items-center justify-between gap-4">
          {/* Wordmark */}
          <Link to="/" className="flex min-h-12 items-center gap-2.5" aria-label="MemoryGlen home">
            <img src="/logo-mark.svg" alt="" width={28} height={28} />
            <span className="font-display text-[1.375rem] font-medium text-body">MemoryGlen</span>
          </Link>

          {/* Center nav — desktop */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'py-2 text-[0.9375rem] font-medium transition-colors duration-200',
                    isActive ? 'text-evergreen' : 'text-body hover:text-evergreen',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              aria-label="Search MemoryGlen"
              onClick={() => setSearchOpen(true)}
              className="flex min-h-12 min-w-12 items-center justify-center rounded-sm text-body transition-colors hover:text-evergreen"
            >
              <Search size={20} aria-hidden />
            </button>
            <Link
              to="/create"
              className="hidden min-h-12 items-center px-2 text-[0.9375rem] font-medium text-body transition-colors hover:text-evergreen sm:inline-flex"
            >
              Sign In
            </Link>
            <Link to="/create" className="btn btn-evergreen hidden !min-h-11 px-5 py-2 text-[0.9375rem] sm:inline-flex">
              Get Started
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="flex min-h-12 min-w-12 items-center justify-center rounded-sm text-body lg:hidden"
            >
              <Menu size={22} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Quiet full-screen search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-start justify-center bg-forest-deep/95 px-6 pt-[18vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onClick={() => setSearchOpen(false)}
          >
            <div className="w-full max-w-reading" onClick={(e) => e.stopPropagation()}>
              <label htmlFor="site-search" className="eyebrow mb-4 !text-sage">
                Search MemoryGlen
              </label>
              <input
                id="site-search"
                autoFocus
                type="search"
                placeholder="A name, a place, a hymn…"
                className="w-full border-0 border-b border-brass/60 bg-transparent pb-4 font-display text-3xl text-bone placeholder:text-sage/60 focus:outline-none"
              />
              <p className="mt-4 text-sm text-sage">Search is coming soon. Browse <Link to="/memorials" className="text-brass-soft underline underline-offset-4">public memorials</Link> in the meantime.</p>
            </div>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="absolute right-6 top-6 flex min-h-12 min-w-12 items-center justify-center text-bone"
            >
              <X size={24} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer — full-height forest */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-forest lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-[72px] items-center justify-between px-6">
              <span className="flex items-center gap-2.5">
                <img src="/logo-mark.svg" alt="" width={28} height={28} />
                <span className="font-display text-[1.375rem] font-medium text-bone">MemoryGlen</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-12 min-w-12 items-center justify-center text-bone"
              >
                <X size={24} aria-hidden />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-6 pt-8" aria-label="Mobile">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.3 }}
                >
                  <Link
                    to={l.to}
                    className="block min-h-12 py-3 font-display text-2xl text-bone transition-colors hover:text-brass-soft"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * NAV_LINKS.length, duration: 0.3 }}
                className="mt-8"
              >
                <Link to="/create" className="btn btn-evergreen w-full">
                  Get Started
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
