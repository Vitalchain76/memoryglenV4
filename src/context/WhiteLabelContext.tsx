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

const nyaradzoConfig: PartnerConfig = {
  id: 'nyaradzo',
  name: 'Nyaradzo Funeral Services',
  shortName: 'Nyaradzo Group',
  tagline: 'Sahwira Mukuru - Your Trusted Companion in Digital Legacy & Bereavement',
  primaryColor: '#005A36',
  accentColor: '#D4AF37',
  hotline: '+263 242 792696 / +263 772 123 456',
  portalUrl: 'https://www.nyaradzo.co.zw',
  badgeText: 'Official Nyaradzo Partner Portal',
  policyCheckUrl: 'https://www.nyaradzo.co.zw/self-service'
};

interface WhiteLabelContextType {
  isLivingGlen: boolean;
  isNyaradzoMode: boolean;
  toggleNyaradzoMode: () => void;
  config: PartnerConfig | null;
}

const WhiteLabelContext = createContext<WhiteLabelContextType>({
  isLivingGlen: false,
  isNyaradzoMode: false,
  toggleNyaradzoMode: () => {},
  config: null,
});

export const WhiteLabelProvider = ({ children }: { children: ReactNode }) => {
  const [isNyaradzoMode, setIsNyaradzoMode] = useState<boolean>(() => {
    return localStorage.getItem('mg_nyaradzo_mode') === 'true';
  });

  const [isLivingGlen, setIsLivingGlen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLivingGlen(window.location.hostname.toLowerCase().includes('livingglen'));
    }
  }, []);

  const toggleNyaradzoMode = () => {
    setIsNyaradzoMode((prev) => {
      const next = !prev;
      localStorage.setItem('mg_nyaradzo_mode', String(next));
      return next;
    });
  };

  return (
    <WhiteLabelContext.Provider
      value={{
        isLivingGlen,
        isNyaradzoMode,
        toggleNyaradzoMode,
        config: isNyaradzoMode ? nyaradzoConfig : null,
      }}
      >
    <div className={isNyaradzoMode ? 'nyaradzo-partner-theme' : ''}>
      {children}
    </div>
    </WhiteLabelContext.Provider>
        );
      };

export const useWhiteLabel = () => useContext(WhiteLabelContext);
</WhiteLabelContext.Provider>
