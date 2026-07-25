import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface LightboxImage {
  src: string;
  caption: string;
}

/**
 * Lightbox — design.md §7.14. Forest-deep overlay (88%), centered image with
 * a 24px parchment frame, caption in Inter small, prev/next brass chevrons,
 * ESC / backdrop close, full keyboard support (arrows + ESC).
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const open = index !== null;

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, prev, next]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-forest-deep/[0.88] p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index! + 1} of ${images.length}: ${current.caption}`}
          onClick={onClose}
        >
          <figure
            className="max-h-full max-w-4xl rounded-sm bg-parchment p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={current.src + index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={current.src}
              alt={current.caption}
              className="max-h-[70dvh] w-full rounded-sm object-contain"
            />
            <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-ink-soft">
              <span>{current.caption}</span>
              <span className="flex-none tabular-nums">
                {index! + 1} / {images.length}
              </span>
            </figcaption>
          </figure>

          {/* Prev / next — brass chevrons */}
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 flex min-h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-sm text-brass transition-colors hover:text-brass-soft sm:left-8"
          >
            <ChevronLeft size={32} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 flex min-h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-sm text-brass transition-colors hover:text-brass-soft sm:right-8"
          >
            <ChevronRight size={32} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Close photo viewer"
            onClick={onClose}
            className="absolute right-6 top-6 flex min-h-12 min-w-12 items-center justify-center rounded-sm text-bone transition-colors hover:text-brass-soft"
          >
            <X size={24} aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
