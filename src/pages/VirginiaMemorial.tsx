import { useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeMode } from '@/components/Layout';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import Hero from '@/pages/virginia/Hero';
import VirginiaTabBar from '@/pages/virginia/TabBar';
import type { VirginiaTabId } from '@/pages/virginia/TabBar';
import OverviewTab from '@/pages/virginia/OverviewTab';
import LifeStoryTab from '@/pages/virginia/LifeStoryTab';
import GalleryTab from '@/pages/virginia/GalleryTab';
import VideosTab from '@/pages/virginia/VideosTab';
import VoiceNotesTab from '@/pages/virginia/VoiceNotesTab';
import FuneralTab from '@/pages/virginia/FuneralTab';
import FamilyTab from '@/pages/virginia/FamilyTab';
import GuestbookTab from '@/pages/virginia/GuestbookTab';
import CandlesTab from '@/pages/virginia/CandlesTab';
import AnniversaryTab from '@/pages/virginia/AnniversaryTab';
import { PROVIDERS, isAnniversaryToday } from '@/pages/virginia/data';

const TAB_COMPONENTS: Record<VirginiaTabId, ComponentType> = {
  overview: OverviewTab,
  'life-story': LifeStoryTab,
  gallery: GalleryTab,
  videos: VideosTab,
  'voice-notes': VoiceNotesTab,
  funeral: FuneralTab,
  family: FamilyTab,
  guestbook: GuestbookTab,
  candles: CandlesTab,
  anniversary: AnniversaryTab,
};

function isTabId(value: string | null): value is VirginiaTabId {
  return value !== null && value in TAB_COMPONENTS;
}

/**
 * The founding memorial — Virginia Dadirayi Chiimba (1955–2025).
 * `/memorials/virginia-dadirayi-chiimba` — a REAL memorial, never demo-labelled
 * (no DemoBanner). 10 tabs with counts, forest hero, Service Provider Rail.
 * On 19 May each year the page keeps Dusk with a live candle counter.
 */
export default function VirginiaMemorial() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const active: VirginiaTabId = isTabId(tabParam) ? tabParam : 'overview';
  const ActiveTab = TAB_COMPONENTS[active];
  const contentRef = useRef<HTMLDivElement>(null);

  const { mode, toggleMode } = useThemeMode();
  const anniversary = isAnniversaryToday();
  const forcedDusk = useRef(false);

  // Anniversary dusk (virginia.md): on 19 May the memorial renders in Dusk.
  useEffect(() => {
    if (anniversary && mode === 'parchment' && !forcedDusk.current) {
      forcedDusk.current = true;
      toggleMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anniversary]);

  const selectTab = (tab: VirginiaTabId) => {
    setSearchParams(tab === 'overview' ? {} : { tab }, { preventScrollReset: false });
    // Bring the tab content back into view after switching
    window.setTimeout(() => {
      contentRef.current?.scrollIntoView({ block: 'start' });
    }, 0);
  };

  return (
    <div>
      {/* NO DemoBanner — this is the real founding memorial */}
      <Hero anniversary={anniversary} onLightCandle={() => selectTab('candles')} />

      <VirginiaTabBar active={active} onSelect={selectTab} />

      <div ref={contentRef} className="container-content scroll-mt-36 py-16 md:py-24">
        <div className="flex gap-12">
          {/* Tab content — crossfades 250ms with an 8px rise (design.md §5) */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <ActiveTab />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Service Provider Rail — right, sticky ≥1280px, inline below */}
          <ServiceProviderRail providers={PROVIDERS} />
        </div>
      </div>
    </div>
  );
}
