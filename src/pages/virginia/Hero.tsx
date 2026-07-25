import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Globe, MessageCircle } from 'lucide-react';
import { CandleFlame } from '@/components/CandleFlame';
import StatBand from '@/components/StatBand';
import { CANDLES, EPITAPH, MEMORIAL_URL } from '@/pages/virginia/data';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Memorial hero — "The Name" (virginia.md). Forest bg, museum-label restraint.
 * Portrait rise → name resolves from blur → stats fade (under 1.5s total).
 */
export default function Hero({
  anniversary,
  onLightCandle,
}: {
  anniversary: boolean;
  onLightCandle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(MEMORIAL_URL);
    } catch {
      const el = document.createElement('textarea');
      el.value = MEMORIAL_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-forest pb-16 pt-12 text-center text-bone md:pb-20 md:pt-16">
      <div className="container-content flex flex-col items-center">
        {/* Status badges — Public Memorial · Published */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
            <Globe size={12} aria-hidden /> Public Memorial
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sage px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage">
            <Check size={12} aria-hidden /> Published
          </span>
        </motion.div>

        {/* Portrait — 200×250, parchment mat, brass rule */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="mt-8"
        >
          <div className="inline-block rounded-sm bg-parchment p-3 pb-4">
            <img
              src="/virginia-portrait.jpg"
              alt="Portrait of Virginia Dadirayi Chiimba"
              width={200}
              height={250}
              className="rounded-sm object-cover"
              style={{ width: 200, height: 250 }}
            />
          </div>
          <hr className="brass-rule mx-auto mt-4" aria-hidden />
        </motion.figure>

        {/* Name — resolves from blur (Fraunces, bone, clamp to 4.5rem) */}
        <motion.h1
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="type-display mt-6 max-w-3xl text-bone"
        >
          Virginia Dadirayi Chiimba
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="type-meta mt-4 uppercase text-brass"
          style={{ letterSpacing: '0.2em' }}
        >
          1955 – 2025
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="type-quote mt-4 max-w-xl text-bone/90"
        >
          {EPITAPH}
        </motion.p>

        {/* Anniversary dusk signature — live candle counter */}
        {anniversary && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-6 inline-flex items-center gap-2 text-sm text-brass-soft"
          >
            <CandleFlame size={14} /> {CANDLES.length} candles burning today.
          </motion.p>
        )}

        {/* StatBand (bone): 12 Candles · 2 Tributes · 13 Media · 25 Family */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.75 }}
          className="mt-10"
        >
          <StatBand
            onDark
            stats={[
              { value: '12', label: 'Candles' },
              { value: '2', label: 'Tributes' },
              { value: '13', label: 'Media' },
              { value: '25', label: 'Family' },
            ]}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <button type="button" onClick={onLightCandle} className="btn btn-evergreen min-h-12">
            <CandleFlame size={14} /> Light a Candle
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`With love, we remember. Visit this memorial: ${MEMORIAL_URL}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-evergreen min-h-12"
          >
            <MessageCircle size={16} aria-hidden /> Share on WhatsApp
          </a>
          <button type="button" onClick={copyLink} className="btn btn-outline-bone min-h-12 px-4 text-sm">
            {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
            {copied ? 'Link copied' : 'Copy Link'}
          </button>
        </motion.div>

        {/* Family message card — parchment on forest */}
        <motion.blockquote
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 1.0 }}
          className="mt-12 max-w-xl rounded-sm bg-parchment p-6 text-left"
        >
          <p className="font-display text-lg italic leading-relaxed text-ink">“{EPITAPH}”</p>
          <footer className="type-meta mt-3 text-ink-soft">— A message from the family</footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
