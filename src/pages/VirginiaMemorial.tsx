import { useEffect, useRef } from 'react';
import { useThemeMode } from '@/components/Layout';
import MemorialTabShell from '@/components/MemorialTabShell';
import type { MemorialTab as MemorialTabDef } from '@/components/memorialTabs';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import Hero from '@/pages/virginia/Hero';
import JourneyTab from '@/pages/virginia/JourneyTab';
import MemorialTab from '@/pages/virginia/MemorialTab';
import GlenTab from '@/pages/virginia/GlenTab';
import TreeTab from '@/pages/virginia/TreeTab';
import LegacyTab from '@/pages/virginia/LegacyTab';
import {
  CHILDREN,
  GRANDCHILDREN,
  PROVIDERS,
  SIBLINGS,
  isAnniversaryToday,
} from '@/pages/virginia/data';

/**
 * The founding memorial — Virginia Dadirayi Chiimba (1955–2025).
 * `/memorials/virginia-dadirayi-chiimba` — a REAL memorial, never demo-labelled
 * (no DemoBanner). On 19 May each year the page keeps Dusk.
 *
 * Restructured onto the platform's five-room standard (MemorialTabShell).
 * Her ten former tabs were redistributed, NOT reduced:
 *
 *   Journey  ← Funeral & Memorial Events, service videos, Anniversary Room
 *   Memorial ← Overview, Life Story, Gallery, Videos, Voice Notes,
 *              Guestbook, Digital Candles
 *   Glen     ← her resting place at Seke, Zinganga
 *   Tree     ← Family (parents, siblings, children, grandchildren)
 *   Legacy   ← Living Legacy
 *
 * Every section that existed before still renders. Nothing was deleted.
 */
export default function VirginiaMemorial() {
  const { mode, toggleMode } = useThemeMode();
  const anniversary = isAnniversaryToday();
  const forcedDusk = useRef(false);

  useEffect(() => {
    if (anniversary && mode === 'parchment' && !forcedDusk.current) {
      forcedDusk.current = true;
      toggleMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anniversary]);

  const familyCount = 2 + (SIBLINGS.length - 1) + CHILDREN.length + GRANDCHILDREN.length;

  const tabs: MemorialTabDef[] = [
    { id: 'journey', content: <JourneyTab /> },
    {
      id: 'memorial',
      subnav: [
        { label: 'Overview', href: '#vg-overview' },
        { label: 'Life Story', href: '#vg-life-story' },
        { label: 'Her Music', href: '#vg-songs' },
        { label: 'Gallery', href: '#vg-gallery' },
        { label: 'Videos', href: '#vg-videos' },
        { label: 'Her Voice', href: '#vg-voice' },
        { label: 'Guestbook', href: '#vg-guestbook' },
        { label: 'Candles', href: '#vg-candles' },
      ],
      content: <MemorialTab />,
    },
    { id: 'glen', count: 1, content: <GlenTab /> },
    { id: 'tree', count: familyCount, content: <TreeTab /> },
    { id: 'legacy', content: <LegacyTab /> },
  ];

  const goToCandles = () => {
    document.getElementById('vg-candles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* NO DemoBanner — this is the real founding memorial */}
      <MemorialTabShell tabs={tabs} defaultTab="memorial">
        <Hero anniversary={anniversary} onLightCandle={goToCandles} />
      </MemorialTabShell>

      <div className="container-content pb-16 md:pb-24">
        <ServiceProviderRail providers={PROVIDERS} />
      </div>
    </div>
  );
}
