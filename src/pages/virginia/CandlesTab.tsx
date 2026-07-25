import { useState } from 'react';
import type { CSSProperties } from 'react';
import { CandleFlame, LightACandle } from '@/components/CandleFlame';
import type { Candle } from '@/components/CandleFlame';
import Reveal from '@/components/Reveal';
import { CANDLES } from '@/pages/virginia/data';

/** TAB: Digital Candles (12) — candle field, LightACandle ritual, dated list. */
export default function CandlesTab() {
  const [candles, setCandles] = useState<Candle[]>(CANDLES);

  return (
    <div className="max-w-reading">
      <Reveal>
        <p className="eyebrow">In her memory</p>
        <h2 className="type-h2 mt-4 text-body">{candles.length} Candles Lit</h2>
      </Reveal>

      {/* Candle-field strip — 12 flames, staggered flicker phases */}
      <Reveal delay={0.05}>
        <div
          className="candle-field mt-8 flex flex-wrap items-end justify-center gap-x-4 gap-y-6 rounded-sm bg-forest-deep p-8"
          aria-label={`${candles.length} candles burning for Virginia`}
        >
          <style>{`
            .candle-field .candle-flame-flicker { animation-delay: var(--fd, 0s); }
          `}</style>
          {candles.slice(0, 12).map((c, i) => (
            <span
              key={`${c.name}-${i}`}
              title={c.name}
              style={{ '--fd': `${(i * 0.37) % 2.4}s` } as CSSProperties}
            >
              <CandleFlame size={26} />
            </span>
          ))}
        </div>
      </Reveal>

      {/* Light a Digital Candle */}
      <Reveal delay={0.1}>
        <div className="mt-12">
          <h3 className="type-h3 text-body">Light a Digital Candle</h3>
          <p className="mt-2 leading-relaxed text-soft">
            Leave a candle and a message of remembrance.
          </p>
          <LightACandle
            memorialId="virginia-dadirayi-chiimba"
            candles={candles}
            onCandleLit={(candle) => setCandles((prev) => [candle, ...prev])}
            className="mt-6"
          />
        </div>
      </Reveal>
    </div>
  );
}
