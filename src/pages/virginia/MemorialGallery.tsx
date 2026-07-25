import { useState } from 'react';
import { motion } from 'framer-motion';
import Lightbox from '@/pages/virginia/Lightbox';
import type { GalleryItem } from '@/pages/virginia/data';
import { cn } from '@/lib/utils';

/**
 * MemorialGallery — masonry grid of the family memories with lightbox.
 * Hover: scale 1.02 + caption slide (virginia.md). Used by the Overview tab
 * (full set) and the Gallery tab (with filter chips).
 */
export default function MemorialGallery({ items }: { items: GalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="columns-2 gap-4 md:columns-3 [&>li]:mb-4">
        {items.map((item, i) => (
          <motion.li
            key={`${item.src}-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(i, 5) * 0.05 }}
            className="break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`View full-screen: ${item.caption}`}
              className="group relative block w-full overflow-hidden rounded-sm"
            >
              <img
                src={item.src}
                alt={item.caption}
                loading="lazy"
                className={cn(
                  'w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]',
                  // Vary heights for a masonry feel within CSS columns
                  i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-[3/2]' : 'aspect-square',
                )}
              />
              <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-forest-deep/70 px-3 py-2 text-left text-xs leading-snug text-bone opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <Lightbox
        images={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
