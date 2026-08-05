import { motion } from 'framer-motion';
import { Link } from 'react-router';
import CandleFlame from '@/components/CandleFlame';
import { useWhiteLabel } from '@/context/WhiteLabelContext';

const MEMORYGLEN_H1_WORDS = ['Where', 'Memories', 'Live', 'Forever.'];
const LIVINGGLEN_H1_WORDS = ['Where', 'You', 'Live', 'and', 'Author', 'Your', 'Story.'];

// LivingGlen active-life palette. Kept local so MemoryGlen's forest/brass
// design tokens are never touched.
const LG_EMERALD = '#059669';
const LG_MINT = '#D1FAE5';

/**
 * Hero — home.md §1. Full-bleed /hero-home.jpg with forest-deep scrim,
 * content bottom-left, word-level H1 rise (90ms stagger), CTAs, and the
 * quiet candle proof-of-life at bottom-right. No scroll pin — restraint.
 *
 * Domain-aware copy: on livingglen.com (isLivingGlen from WhiteLabelContext)
 * this renders the LivingGlen "Active Life" messaging with an emerald/mint
 * active palette. On memoryglen.com the original MemoryGlen memorial copy
 * and forest/brass palette are left completely unchanged.
 */
export default function Hero() {
  const { isLivingGlen } = useWhiteLabel();
  const h1Words = isLivingGlen ? LIVINGGLEN_H1_WORDS : MEMORYGLEN_H1_WORDS;

  // Emerald scrim for LivingGlen; original forest-deep scrim for MemoryGlen.
  const scrim = isLivingGlen
    ? 'linear-gradient(to top, rgba(4,47,37,0.82) 0%, rgba(4,47,37,0.40) 40%, rgba(4,47,37,0) 70%)'
    : 'linear-gradient(to top, rgba(14,33,29,0.88) 0%, rgba(14,33,29,0.45) 40%, rgba(14,33,29,0) 70%)';

  return (
    <section
      className="relative flex min-h-[calc(100dvh-72px)] flex-col justify-end overflow-hidden"
      style={{ backgroundColor: isLivingGlen ? '#042f25' : undefined }}
    >
      {/* Image — scales 1.06 → 1.0 over 1.8s on load */}
      <motion.img
        src="/hero-home.jpg"
        alt={
          isLivingGlen
            ? 'A bright, sunlit landscape — an open path into an active, growing life'
            : 'A golden-hour African savanna glade, a single dirt path leading into the light'
        }
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Gradient scrim (bottom → top) */}
      <div aria-hidden className="absolute inset-0" style={{ background: scrim }} />

      <div className="container-content relative pb-20 pt-40 md:pb-24">
        <div className="max-w-reading">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="eyebrow"
            style={{ color: isLivingGlen ? LG_MINT : undefined }}
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
            {isLivingGlen ? (
              <>
                <Link
                  to="/plans"
                  className="btn min-h-12"
                  style={{ backgroundColor: LG_EMERALD, color: '#ffffff', borderColor: LG_EMERALD }}
                >
                  Start Your Living Record
                </Link>
                <Link
                  to="/service-providers"
                  className="btn min-h-12"
                  style={{ backgroundColor: 'transparent', color: LG_MINT, border: `1px solid ${LG_MINT}` }}
                >
                  Explore Service Providers
                </Link>
              </>
            ) : (
              <>
                <Link to="/create" className="btn btn-evergreen min-h-12">
                  Create a Memorial
                </Link>
                {/* Secondary must land on a real, populated memorial — not the directory. */}
                <Link to="/memorials/john-peters" className="btn btn-outline-bone min-h-12">
                  View Demo Memorial
                </Link>
              </>
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
        {isLivingGlen ? (
          <>
            <span aria-hidden style={{ color: LG_MINT }}>●</span>
            <p className="text-xs" style={{ color: LG_MINT }}>
              Milestones captured every day across our living glens
            </p>
          </>
        ) : (
          <>
            <CandleFlame size={16} />
            <p className="text-xs text-bone/75">12 candles lit this week across our glens</p>
          </>
        )}
      </motion.div>
    </section>
  );
}
