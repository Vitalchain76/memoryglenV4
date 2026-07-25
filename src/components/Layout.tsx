import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ThemeMode = 'parchment' | 'dusk';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'parchment', toggleMode: () => {} });

/** Read the current Parchment/Dusk mode and its toggle (used by Footer, pages). */
export function useThemeMode() {
  return useContext(ThemeContext);
}

function initialMode(): ThemeMode {
  try {
    const saved = window.localStorage.getItem('mg-theme');
    if (saved === 'dusk' || saved === 'parchment') return saved;
  } catch {
    /* storage unavailable */
  }
  // Dusk is the default after local sunset (design.md §2)
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? 'dusk' : 'parchment';
}

/**
 * Layout — shared shell. Pattern A (children): App.tsx MUST render
 * `<Layout><Routes>…</Routes></Layout>`. Navbar is sticky in normal flow, so
 * pages never compensate for nav height. Owns Lenis smooth scrolling
 * (lerp 0.09, disabled under prefers-reduced-motion) and the Parchment/Dusk
 * theme on <html data-theme>.
 */
export default function Layout({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    try {
      window.localStorage.setItem('mg-theme', mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const toggleMode = () => setMode((m) => (m === 'dusk' ? 'parchment' : 'dusk'));

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <div className="flex min-h-[100dvh] flex-col bg-bg text-body">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}
