import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { ServiceVideo } from '@/pages/virginia/data';
import { VIDEOS_META } from '@/pages/virginia/data';

/**
 * VideoFacade — 16:9 click-to-play facade over a service still (church /
 * homestead). Never autoplays. Until the family's recording streams here,
 * pressing play reveals the permanence note in place.
 */
export default function VideoFacade({ video }: { video: ServiceVideo }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="card-raised overflow-hidden">
      <div className="relative aspect-video">
        <img src={video.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
        <AnimatePresence mode="wait">
          {pressed ? (
            <motion.div
              key="note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-forest-deep/90 px-6 text-center"
            >
              <p className="font-display text-lg text-bone">Recording stays in the family hub forever.</p>
              <p className="mt-2 max-w-sm text-sm text-sage">
                The full service recording is being prepared by the family and will play here.
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="facade"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setPressed(true)}
              aria-label={`Play ${video.title}`}
              className="group absolute inset-0"
            >
              <span className="absolute inset-0 bg-forest-deep/45 transition-colors duration-200 group-hover:bg-forest-deep/30" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-evergreen text-bone transition-colors group-hover:bg-evergreen-bright">
                  <Play size={20} className="ml-0.5" aria-hidden />
                </span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-body">{video.title}</p>
        <p className="type-meta mt-0.5 text-soft">{VIDEOS_META}</p>
      </div>
    </div>
  );
}
