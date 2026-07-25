import { useState } from 'react';
import MemorialGallery from '@/pages/virginia/MemorialGallery';
import Reveal from '@/components/Reveal';
import { GALLERY, GALLERY_CAPTION } from '@/pages/virginia/data';
import { cn } from '@/lib/utils';

const FILTERS = ['All', 'Family', 'Church', 'Seke'] as const;
type Filter = (typeof FILTERS)[number];

/** TAB: Gallery (13) — full-width masonry with filter chips + lightbox. */
export default function GalleryTab() {
  const [filter, setFilter] = useState<Filter>('All');
  const items = filter === 'All' ? GALLERY : GALLERY.filter((g) => g.category === filter);

  return (
    <div>
      <Reveal>
        <h2 className="type-h2 text-body">Family Memories</h2>
        <p className="type-meta mt-2 text-soft">Click any photo to view full-screen.</p>
        <p className="mt-3 max-w-reading leading-relaxed text-soft">{GALLERY_CAPTION}</p>
      </Reveal>

      {/* Filter chips */}
      <Reveal delay={0.05}>
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter photos">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                'min-h-12 rounded-full border px-5 text-sm font-medium transition-colors duration-200',
                filter === f
                  ? 'border-evergreen bg-evergreen text-bone'
                  : 'border-[color:var(--line)] text-soft hover:border-evergreen hover:text-body',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-8">
        <MemorialGallery items={items} />
      </div>
    </div>
  );
}
