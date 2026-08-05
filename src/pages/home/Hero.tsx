import { motion } from 'framer-motion';
import { Link } from 'react-router';
import CandleFlame from '@/components/CandleFlame';
import { useWhiteLabel } from '@/context/WhiteLabelContext';

const MEMORYGLEN_H1_WORDS = ['Where', 'Memories', 'Live', 'Forever.'];
const LIVINGGLEN_H1_WORDS = ['Where', 'You', 'Live', 'and', 'Author', 'Your', 'Story.'];

/**
 * Hero — home.md §1. Full-bleed /hero-home.jpg with forest-deep scrim,
 * content bottom-left, word-level H1 rise (90ms stagger), CTAs, and the
 * quiet candle proof-of-life at bottom-right. No scroll pin — restraint.
 *
 * Domain-aware copy: on livingglen.com (isLivingGlen from WhiteLabelContext)
 * this renders the LivingGlen "Active Life" messaging. On memoryglen.com
 * the original MemoryGlen memorial copy is left completely unchanged.
 */
export default function Hero() {
  const { isLivingGlen } = useWhiteLabel();
  const h1Words = isLivingGlen ? LIVINGGLEN_H1_WORDS : MEMORYGLEN_H1_WORDS;

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
            {isLivingGlen ? 'LIVINGGLEN · ACTIVE LIFE OPERATING SYSTEM' : 'MEMORYGLEN · SOUTH AFRICA & ZIMBABWE'}
          </motion.p>

          <h1 className="type-h1 mt-5 text-bone">
            {h1Words.map((word, i) => (
              <span key={word + '-' + i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.35 + i * 0.09 }}
                  className="inline-block"
                >
                  {word}
                  {i < h1Words.length - 1 ? ' ' : ''}
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
            {isLivingGlen
              ? 'A secure living archive to capture daily milestones, preserve voice memories, time capsules, and author your personal story as it happens.'
              : 'Build a lasting memorial for someone you love — their story, their photographs, their voice — and invite your family to add to it from anywhere in the world.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.05 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link to="/create" className="btn btn-evergreen min-h-12">
              {isLivingGlen ? 'Start Your Living Record' : 'Create a Memorial'}
            </Link>
            {/* Secondary must land on a real, populated memorial — not the directory. */}
            {isLivingGlen ? (
              <Link to="/service-providers" className="btn btn-outline-bone min-h-12">
                Explore Service Providers
              </Link>
            ) : (
              <Link to="/memorials/john-peters" className="btn btn-outline-bone min-h-12">
                View Demo Memorial
              </Link>
            )}
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
