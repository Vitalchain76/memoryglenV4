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
