import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface PartnerConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  hotline: string;
  portalUrl: string;
  badgeText: string;
  policyCheckUrl: string;
}

interface WhiteLabelContextType {
  isLivingGlen: boolean;
  isPartnerMode: boolean;
  togglePartnerMode: () => void;
  config: PartnerConfig | null;
}

const WhiteLabelContext = createContext<WhiteLabelContextType>({
  isLivingGlen: false,
  isPartnerMode: false,
  togglePartnerMode: () => {},
  config: null,
});

export const WhiteLabelProvider = ({ children }: { children: ReactNode }) => {
  const [isPartnerMode, setIsPartnerMode] = useState<boolean>(() => {
    return localStorage.getItem('mg_partner_mode') === 'true';
  });

  const [isLivingGlen, setIsLivingGlen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLivingGlen(window.location.hostname.toLowerCase().includes('livingglen'));
    }
  }, []);

  // Keep the document head in sync with the active brand once the SPA has
  // hydrated. Build-time prerender ships a domain-neutral baseline; this swaps
  // title and Open Graph metadata to the correct brand for users (and for any
  // crawler that does execute JS). MemoryGlen remains the default.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const brandTitle = isLivingGlen
      ? 'LivingGlen — Active Life Operating System'
      : 'MemoryGlen — Where Memories Live Forever';
    const brandDescription = isLivingGlen
      ? 'A secure living archive to capture daily milestones, preserve voice memories, time capsules, and author your personal story as it happens.'
      : 'MemoryGlen — a permanent place for memories, stories, voices, and family connection. Where Memories Live Forever.';

    const setMeta = (selector: string, attr: string, name: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    document.title = brandTitle;
    setMeta('meta[name="description"]', 'name', 'description', brandDescription);
    setMeta('meta[property="og:title"]', 'property', 'og:title', brandTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', brandDescription);
  }, [isLivingGlen]);

  const togglePartnerMode = () => {
    setIsPartnerMode((prev) => {
      const next = !prev;
      localStorage.setItem('mg_partner_mode', String(next));
      return next;
    });
  };

  return (
    <WhiteLabelContext.Provider
      value={{
        isLivingGlen,
        isPartnerMode,
        togglePartnerMode,
        // No generic partner config is wired up yet. Add one here (matching
        // PartnerConfig) once a real, contracted white-label partner is ready
        // to launch. Do not hardcode a specific brand until a partnership is
        // actually signed.
        config: null,
      }}
    >
      <div className={isPartnerMode ? 'partner-theme' : ''}>
        {children}
      </div>
    </WhiteLabelContext.Provider>
  );
};

export const useWhiteLabel = () => useContext(WhiteLabelContext);
