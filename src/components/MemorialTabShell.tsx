import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { MEMORIAL_TAB_LABELS, MEMORIAL_TAB_ORDER } from '@/components/memorialTabs';
import type { MemorialTab, MemorialTabId } from '@/components/memorialTabs';
import { cn } from '@/lib/utils';

/**
 * Renders a memorial as the platform's five rooms.
 *
 * This shell owns the tab contract only: ids, labels, URL state (?tab=),
 * sticky bar, sub-navigation and transitions. It renders whatever sections a
 * given memorial supplies, so a memorial with a great deal of content and one
 * with very little both get the same five rooms.
 *
 * Tab definitions live in `@/components/memorialTabs`.
 */

function isTabId(v: string | null, tabs: MemorialTab[]): v is MemorialTabId {
  return v !== null && tabs.some((t) => t.id === v);
}

export default function MemorialTabShell({
  tabs,
  defaultTab = 'memorial',
  children,
}: {
  tabs: MemorialTab[];
  /** Which room a visitor lands in. */
  defaultTab?: MemorialTabId;
  /** Hero or banner rendered above the tab bar. */
  children?: ReactNode;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab');
  const active: MemorialTabId = isTabId(raw, tabs) ? raw : defaultTab;
  const contentRef = useRef<HTMLDivElement>(null);

  const ordered = MEMORIAL_TAB_ORDER.map((id) => tabs.find((t) => t.id === id)).filter(
    (t): t is MemorialTab => Boolean(t),
  );
  const current = ordered.find((t) => t.id === active) ?? ordered[0];

  const select = (id: MemorialTabId) => {
    setSearchParams(id === defaultTab ? {} : { tab: id }, { preventScrollReset: true });
    window.setTimeout(() => {
      contentRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 0);
  };

  return (
    <div>
      {children}

      <div
        className="sticky top-[72px] z-40 border-b border-[color:var(--line)]"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg) 92%, transparent)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="container-content relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[color:var(--bg)] to-transparent md:hidden"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[color:var(--bg)] to-transparent md:hidden"
          />
          <nav
            aria-label="Memorial sections"
            className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0"
          >
            <ul className="flex min-w-max items-stretch gap-1 md:min-w-0 md:flex-wrap" role="tablist">
              {ordered.map((tab) => {
                const selected = tab.id === active;
                return (
                  <li key={tab.id} role="presentation">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => select(tab.id)}
                      className={cn(
                        'relative flex min-h-12 items-center px-4 py-3 text-[0.9375rem] font-medium transition-colors duration-200',
                        selected ? 'text-body' : 'text-soft hover:text-body',
                      )}
                    >
                      {tab.label ?? MEMORIAL_TAB_LABELS[tab.id]}
                      {typeof tab.count === 'number' && (
                        <span className="ml-1.5 text-xs text-soft">({tab.count})</span>
                      )}
                      {selected && (
                        <motion.span
                          layoutId="mg-tab-underline"
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="absolute inset-x-3 bottom-0 h-0.5 bg-brass"
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {current?.subnav && current.subnav.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-[color:var(--line)] py-2.5">
              {current.subnav.map((s) => (
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

      <div ref={contentRef} className="scroll-mt-36">
        {/* No AnimatePresence / mode="wait" here.
            mode="wait" holds the incoming tab back until the outgoing tab's exit
            animation completes; under React 19 that callback can be deferred, so
            the new tab never mounts until some other render forces it. The tab
            content must appear on the click itself, so the new panel mounts
            immediately and simply fades in. */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {current?.content}
        </motion.div>
      </div>
    </div>
  );
}
