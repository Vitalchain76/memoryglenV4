import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import DemoBanner from '@/components/DemoBanner';
import StatBand from '@/components/StatBand';
import QRShareBlock from '@/components/QRShareBlock';
import JourneyTab from '@/pages/john-peters/JourneyTab';
import MemorialTab from '@/pages/john-peters/MemorialTab';
import GlenTab from '@/pages/john-peters/GlenTab';
import TreeTab from '@/pages/john-peters/TreeTab';
import LegacyTab from '@/pages/john-peters/LegacyTab';
import { cn } from '@/lib/utils';

export type JohnPetersTabId = 'journey' | 'memorial' | 'glen' | 'tree' | 'legacy';

const TABS: { id: JohnPetersTabId; label: string; count?: number }[] = [
  { id: 'journey', label: 'The Journey' },
  { id: 'memorial', label: 'The Memorial' },
  { id: 'glen', label: 'Family Glen', count: 4 },
  { id: 'tree', label: 'Family Tree' },
  { id: 'legacy', label: 'Living Legacy' },
];

const TAB_IDS = TABS.map((t) => t.id);

/** Quiet in-page sub-nav (text links) for long tabs (memorial.md §A). */
const SUBNAV: Partial<Record<JohnPetersTabId, { label: string; href: string }[]>> = {
  journey: [
    { label: 'Tracker', href: '#jp-tracker' },
    { label: 'Support Fund', href: '#jp-fund' },
    { label: 'Livestream', href: '#jp-livestream' },
    { label: 'Booklet', href: '#jp-booklet' },
  ],
  memorial: [
    { label: 'Life Story', href: '#jp-story' },
    { label: 'Photographs', href: '#jp-photos' },
    { label: 'His Voice', href: '#jp-voice' },
    { label: 'Songs', href: '#jp-songs' },
    { label: 'Memory Lane', href: '#jp-memories' },
    { label: 'Tributes', href: '#jp-tributes' },
    { label: 'Candles', href: '#jp-candles' },
    { label: 'Timeline', href: '#jp-timeline' },
  ],
};

/* ---------- Memorial Hero — "The Name" (memorial.md §A) ---------- */

function BlurName({ name }: { name: string }) {
  return (
    <h1 className="type-display text-bone" aria-label={name}>
      {name.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 + i * 0.03 }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </h1>
  );
}

function MemorialHero({ onLightCandle }: { onLightCandle: () => void }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!shareOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShareOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shareOpen]);

  return (
    <section className="bg-forest" aria-labelledby="jp-name">
      <div className="container-content flex min-h-[52vh] flex-col items-center py-16 text-center md:py-20">
        {/* Portrait in a 12px parchment mat with 1px brass rule */}
        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative bg-[#FBF8F1] p-3 shadow-raised"
        >
          <span aria-hidden className="pointer-events-none absolute inset-1.5 border border-brass" />
          <img
            src="/memorial-john-portrait.jpg"
            alt="Portrait of John Peters, a fictional elderly Zimbabwean gentleman, hands clasped in golden window light"
            width={200}
            height={250}
            className="h-[250px] w-[200px] object-cover"
          />
        </motion.figure>

        <div className="mt-8" id="jp-name">
          <BlurName name="John Peters" />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="type-meta mt-4 font-medium tracking-[0.2em] text-brass"
        >
          1958 – 2026
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="mt-5 font-display text-2xl italic text-bone/90"
        >
          “A Father Who Connected Continents.”
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.95 }}
          className="type-meta mt-3 text-sage"
        >
          Three generations of schoolchildren knew his keys and his kindness.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.05 }}
          className="mt-10"
        >
          <StatBand
            onDark
            stats={[
              { value: '247', label: 'Candles' },
              { value: '38', label: 'Tributes' },
              { value: '24', label: 'Memories' },
              { value: '4', label: 'Resting Places' },
            ]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button type="button" onClick={onLightCandle} className="btn btn-evergreen min-h-12">
            Light a Candle
          </button>
          <button type="button" onClick={() => setShareOpen(true)} className="btn btn-outline-bone min-h-12">
            Share
          </button>
          <button
            type="button"
            onClick={() => setFollowing((f) => !f)}
            aria-pressed={following}
            className="btn btn-outline-bone min-h-12"
          >
            <Bell size={16} aria-hidden />
            {following ? 'Following' : 'Follow Memorial'}
          </button>
        </motion.div>
      </div>

      {/* Share modal — QRShareBlock (extended) */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-deep/[0.88] p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Share this memorial"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-parchment p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                aria-label="Close share panel"
                className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center text-ink-soft transition-colors hover:text-ink"
              >
                <X size={20} aria-hidden />
              </button>
              <QRShareBlock
                qrSrc="/qr-john.svg"
                url="https://memoryglen.com/memorials/john-peters"
                extended
                className="shadow-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- MemorialTabBar (design.md §7.10, memorial.md §A) ---------- */

function MemorialTabBar({
  active,
  onSelect,
}: {
  active: JohnPetersTabId;
  onSelect: (tab: JohnPetersTabId) => void;
}) {
  const subnav = SUBNAV[active];
  return (
    <div className="sticky top-[72px] z-40 border-b border-[color:var(--line)] bg-bg/95 backdrop-blur">
      <div className="container-content">
        <nav
          aria-label="Memorial sections"
          className="relative flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(t.id)}
                className={cn(
                  'relative flex-none px-4 py-4 text-[0.9375rem] font-medium transition-colors duration-200',
                  isActive ? 'text-body' : 'text-soft hover:text-body',
                )}
              >
                {t.label}
                {typeof t.count === 'number' && (
                  <span className="ml-1.5 text-xs text-soft">({t.count})</span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="jp-tab-underline"
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute inset-x-3 bottom-0 h-0.5 bg-brass"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </nav>
        {subnav && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-[color:var(--line)] py-2.5">
            {subnav.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="text-xs font-medium text-soft transition-colors hover:text-evergreen"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Page shell ---------- */

export default function JohnPetersMemorial() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab');
  const tab: JohnPetersTabId = TAB_IDS.includes(raw as JohnPetersTabId)
    ? (raw as JohnPetersTabId)
    : 'memorial';

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const tabBarAnchor = useRef<HTMLDivElement>(null);

  const selectTab = (next: JohnPetersTabId, scroll = true) => {
    setSearchParams({ tab: next });
    if (scroll) {
      window.setTimeout(() => {
        tabBarAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const lightCandleFromHero = () => {
    selectTab('memorial');
    window.setTimeout(() => {
      document.getElementById('jp-candles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  };

  return (
    <div>
      {/* DemoBanner — always present on all tabs (memorial.md §A). Dismissible,
          but returns as a floating "Demo" chip so honesty is never lost. */}
      {!bannerDismissed ? (
        <div className="relative">
          <DemoBanner />
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss demonstration notice"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-bone/70 transition-colors hover:text-bone"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setBannerDismissed(false)}
          className="fixed bottom-4 left-4 z-50 rounded-full border border-brass bg-forest-deep px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brass-soft shadow-raised"
        >
          Demo
        </button>
      )}

      <MemorialHero onLightCandle={lightCandleFromHero} />

      <div ref={tabBarAnchor} className="scroll-mt-[72px]" aria-hidden />
      <MemorialTabBar active={tab} onSelect={(t) => selectTab(t, false)} />

      {/* Tab content — crossfade 250ms with 8px rise (design.md §5) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {tab === 'journey' && <JourneyTab />}
          {tab === 'memorial' && <MemorialTab onNavigate={selectTab} />}
          {tab === 'glen' && <GlenTab onNavigate={selectTab} />}
          {tab === 'tree' && <TreeTab />}
          {tab === 'legacy' && <LegacyTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
