import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BrandSkin {
  id: string;
  /** Brand label shown on the chip/toggle and inside the mock header. */
  name: string;
  /** White-label domain shown in the mock browser bar. */
  domain: string;
  /** Logo disc initials. */
  initials: string;
  /** Tonal palette for the mock (kept tasteful per design.md §2). */
  colors: {
    deep: string;
    primary: string;
    surface: string;
    text: string;
  };
}

/**
 * BrandReskinDemo — "Same engine. Your identity."
 * A single family-hub mock (browser bar, brand header, hub content) that
 * re-skins — logo, palette, domain bar — between partner brands with a
 * 400ms crossfade (funeral-parlours.md / burial-societies.md §4).
 * All skins render stacked; only opacity changes, so the crossfade is a
 * true dissolve with no layout shift.
 */
export default function BrandReskinDemo({
  skins,
  label,
  caption = 'Same engine. Your identity.',
  className,
}: {
  skins: BrandSkin[];
  /** Accessible label + visible lead-in above the controls. */
  label: string;
  caption?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(skins[0].id);

  return (
    <div className={cn('w-full', className)}>
      <p className="type-meta mb-3 text-soft">{label}</p>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
        {skins.map((skin) => {
          const active = skin.id === activeId;
          return (
            <button
              key={skin.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveId(skin.id)}
              className={cn(
                'inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200',
                active
                  ? 'bg-evergreen text-bone'
                  : 'bg-well text-soft hover:text-body',
              )}
            >
              <span
                aria-hidden
                className="h-3 w-3 rounded-full border border-bone/40"
                style={{ background: skin.colors.primary }}
              />
              {skin.name}
            </button>
          );
        })}
      </div>

      <div className="relative mt-6 h-[340px] overflow-hidden rounded-sm shadow-raised sm:h-[380px]">
        {skins.map((skin) => {
          const active = skin.id === activeId;
          const c = skin.colors;
          return (
            <motion.div
              key={skin.id}
              role="tabpanel"
              aria-hidden={!active}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={cn('absolute inset-0', !active && 'pointer-events-none')}
              style={{ background: c.surface }}
            >
              {/* Browser domain bar */}
              <div
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ background: c.deep }}
              >
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-bone/30" />
                  <span className="h-2 w-2 rounded-full bg-bone/30" />
                  <span className="h-2 w-2 rounded-full bg-bone/30" />
                </span>
                <span className="truncate rounded-sm bg-bone/10 px-3 py-1 text-xs text-bone/80">
                  {skin.domain}
                </span>
              </div>
              {/* Brand header */}
              <div
                className="flex items-center gap-3 border-b px-5 py-4"
                style={{ borderColor: `${c.text}1F` }}
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-sm text-bone"
                  style={{ background: c.primary }}
                >
                  {skin.initials}
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate font-display text-lg leading-tight"
                    style={{ color: c.text }}
                  >
                    {skin.name}
                  </p>
                  <p className="text-xs" style={{ color: `${c.text}99` }}>
                    Family Hub
                  </p>
                </div>
              </div>
              {/* Hub content mock */}
              <div className="space-y-4 px-5 py-5">
                <div
                  className="h-3 w-2/5 rounded-full"
                  style={{ background: `${c.text}26` }}
                />
                <div
                  className="h-2.5 w-4/5 rounded-full"
                  style={{ background: `${c.text}1A` }}
                />
                <div
                  className="h-2.5 w-3/5 rounded-full"
                  style={{ background: `${c.text}1A` }}
                />
                <div
                  className="mt-2 rounded-sm border p-4"
                  style={{ borderColor: `${c.text}1F` }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="h-2.5 w-1/3 rounded-full"
                      style={{ background: `${c.text}26` }}
                    />
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium text-bone"
                      style={{ background: c.primary }}
                    >
                      Journey live
                    </span>
                  </div>
                  <div
                    className="mt-3 h-1 w-full rounded-full"
                    style={{ background: `${c.text}14` }}
                  >
                    <div
                      className="h-1 w-2/3 rounded-full"
                      style={{ background: c.primary }}
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span
                      className="h-6 w-16 rounded-sm"
                      style={{ background: `${c.primary}33` }}
                    />
                    <span
                      className="h-6 w-20 rounded-sm"
                      style={{ background: `${c.text}14` }}
                    />
                  </div>
                </div>
                <p
                  className="pt-1 text-center text-[11px]"
                  style={{ color: `${c.text}80` }}
                >
                  Powered by MemoryGlen
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="type-meta mt-3 text-soft">{caption}</p>
    </div>
  );
}
