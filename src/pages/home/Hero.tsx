import { motion } from 'framer-motion';
import { Link } from 'react-router';
import CandleFlame from '@/components/CandleFlame';

const H1_WORDS = ['Where', 'Memories', 'Live', 'Forever.'];

/**
 * Hero — home.md §1. Full-bleed /hero-home.jpg with forest-deep scrim,
 * content bottom-left, word-level H1 rise (90ms stagger), CTAs, and the
 * quiet candle proof-of-life at bottom-right. No scroll pin — restraint.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-72px)] flex-col justify-end overflow-hidden bg-forest-deep">
      {/* Image — scales 1.06 → 1.0 over 1.8s on load */}
      <motion.img
        src="/hero-home.jpg"
        alt="A golden-hour African savanna glade, a single dirt path leading into the light"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Forest-deep gradient scrim (bottom 70% → top 0%) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(14,33,29,0.88) 0%, rgba(14,33,29,0.45) 40%, rgba(14,33,29,0) 70%)' }}
      />

      <div className="container-content relative pb-20 pt-40 md:pb-24">
        <div className="max-w-reading">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="eyebrow !text-sage"
          >
            MEMORYGLEN · SOUTH AFRICA &amp; ZIMBABWE
          </motion.p>

          <h1 className="type-h1 mt-5 text-bone">
            {H1_WORDS.map((word, i) => (
              <span key={word} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.35 + i * 0.09 }}
                  className="inline-block"
                >
                  {word}
                  {i < H1_WORDS.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="type-story mt-5 max-w-xl text-bone/85"
          >
            A permanent place for memories, stories, voices, and family connection. Preserve the
            lives and legacies of your loved ones across generations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.05 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link to="/create" className="btn btn-evergreen">
              Create a Memorial — free
            </Link>
            <Link to="/memorials" className="btn btn-outline-bone">
              Browse Memorials
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quiet proof of life — bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="absolute bottom-6 right-6 hidden items-center gap-3 sm:flex"
      >
        <CandleFlame size={16} />
        <p className="text-xs text-bone/75">12 candles lit this week across our glens</p>
      </motion.div>
    </section>
  );
}
