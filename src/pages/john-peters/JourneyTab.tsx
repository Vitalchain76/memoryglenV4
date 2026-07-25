import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Download, Play } from 'lucide-react';
import Reveal from '@/components/Reveal';
import StatBand from '@/components/StatBand';
import NotificationCard from '@/components/NotificationCard';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import type { ServiceProvider } from '@/components/ServiceProviderRail';
import { cn } from '@/lib/utils';

const RAIL_PROVIDERS: ServiceProvider[] = [
  {
    name: 'SafePassage Repatriation Services (demo)',
    category: 'Transport',
    description: 'Cross-border transport, documents, border clearance — Johannesburg to Harare.',
    contactHref: 'mailto:admin@memoryglen.com?subject=SafePassage%20Repatriation',
    tier: 'featured',
  },
  {
    name: 'Horizon Funeral Services (demo)',
    category: 'Funeral Services',
    description: 'Family liaison and preparation, Johannesburg.',
    tier: 'standard',
  },
  {
    name: 'ClearStream Funeral Streaming',
    category: 'Livestream Services',
    phone: '+27 11 555 0140',
    tier: 'basic',
  },
  {
    name: 'Eternal Stone Tombstones',
    category: 'Tombstone Maker',
    phone: '+263 71 555 0119',
    tier: 'basic',
  },
];

const DOCUMENTS = [
  'Death notice (DHA-1663)',
  'Unabridged death certificate',
  'Removal order / transit permit',
  'Port Health export permit + non-infectious disease certificate',
  'Embalming certificate',
  "Funeral director's affidavit & packaging certificate",
  "Deceased's passport/ID + next-of-kin affidavit",
  'Next-of-kin ID',
  'Zimbabwe Consulate No Objection Letter',
  'Ministry of Health import permit',
  'Beitbridge transit & burial permits',
  'Proof of burial site (Glen Forest allotment letter)',
];

interface Stage {
  date: string;
  title: string;
  body: string;
  status: 'done' | 'key';
  image?: { src: string; alt: string; caption?: string };
  checklist?: boolean;
  notification?: boolean;
  italicCaption?: string;
}

const STAGES: Stage[] = [
  {
    date: '3 Aug, 06:40',
    title: 'Passing Confirmed',
    body: 'John passed peacefully at a Johannesburg hospital. Grace was with him. The family hub activated immediately — you have been invited by Grace Peters.',
    status: 'done',
  },
  {
    date: '3 Aug, 09:15',
    title: 'In Care of the Funeral Home',
    body: 'Horizon Funeral Services (demo), Johannesburg, collected John. Preparation for cross-border transit began. Family liaison: Mrs. T. Dube.',
    status: 'done',
  },
  {
    date: '4 Aug, 14:00',
    title: 'Documentation',
    body: 'The full cross-border document pack, coordinated and checked off one by one.',
    status: 'done',
    checklist: true,
  },
  {
    date: '5 Aug, 18:00',
    title: 'In Transit',
    body: 'Road journey commenced. N1 north from Johannesburg. The family gathered for a departure blessing.',
    status: 'done',
    image: { src: '/john-life-5.jpg', alt: 'The N1 highway at dawn, heading north through the bushveld', caption: 'N1 north — the road home' },
  },
  {
    date: '6 Aug, 03:15',
    title: 'Border Cleared',
    body: 'Beitbridge border post. All permits validated in the quiet hours.',
    status: 'key',
    image: { src: '/john-life-6.jpg', alt: 'The border-post gate at 3AM, one warm lamp under a starry sky', caption: 'Beitbridge, 03:15' },
    notification: true,
    italicCaption: 'Sarah in London knew Dad had crossed the border before her morning tea. Nobody phoned anyone at 3AM.',
  },
  {
    date: '6 Aug, 08:30',
    title: 'Arrived Harare',
    body: 'Received by David Peters at the family home, Glen Norah, Harare.',
    status: 'done',
  },
  {
    date: '7–9 Aug',
    title: 'Vigil at the Family Home',
    body: 'Relatives from across Harare visited. Sarah watched via live link from London. Michael contributed a video tribute from Johannesburg.',
    status: 'done',
  },
  {
    date: '10 Aug, 11:00',
    title: 'Burial',
    body: 'Funeral service and burial at Glen Forest Memorial Park, Harare. John laid to rest in the Peters family plot. Streamed live to family in three countries.',
    status: 'key',
  },
];

const LEDGER = [
  { name: 'Johannesburg family', origin: 'Johannesburg', amount: 'R18,400', converted: 'ZAR' },
  { name: 'Sarah', origin: 'London', amount: '£150', converted: '→ R3,450' },
  { name: 'Cousin', origin: 'Toronto', amount: 'C$200', converted: '→ R2,800' },
  { name: 'Uncle', origin: 'Dallas', amount: '$400', converted: '→ R7,200' },
  { name: 'Aunt', origin: 'Manchester', amount: '£100', converted: '→ R2,300' },
];

const EXPENSES = [
  { label: 'Repatriation and transport', amount: 'R32,000' },
  { label: 'Funeral service and burial', amount: 'R8,500' },
  { label: 'Catering and venue', amount: 'R4,200' },
  { label: 'Remaining to family', amount: 'R3,500' },
];

/* ---------- Section 1 — Journey Hero ---------- */
function JourneyHero() {
  return (
    <section className="section-pad" aria-labelledby="journey-heading">
      <Reveal>
        <p className="eyebrow">THE JOURNEY</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 id="journey-heading" className="type-h1 mt-4 max-w-3xl text-body">
          Bringing John Home — A Father's Final Journey.
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="type-story mt-5 max-w-2xl text-soft">
          When John Peters passed away in Johannesburg, his family was in three countries before
          breakfast. This is how MemoryGlen carried them — and him — home together.
        </p>
      </Reveal>
      <Reveal delay={0.24}>
        <div className="mt-8 inline-block rounded-sm bg-parchment-deep px-6 py-5">
          <StatBand
            stats={[
              { value: '7', label: 'days, 4 hours, 20 minutes — total journey' },
              { value: '3', label: 'countries' },
              { value: '0', label: '3AM phone calls' },
            ]}
          />
        </div>
      </Reveal>
      <Reveal delay={0.32}>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-soft">
          A burial society claim activated this private family hub automatically. The family joined
          from Harare, London, and Johannesburg by invite link.
        </p>
      </Reveal>
    </section>
  );
}

/* ---------- Section 2 — Repatriation Tracker ---------- */
function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const night = stage.notification;
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative pl-10"
    >
      {/* Node */}
      <span
        aria-hidden
        className={cn(
          'absolute left-[-5px] top-2 h-2.5 w-2.5 rounded-full',
          stage.status === 'done' && 'bg-evergreen ring-4 ring-evergreen/20',
          stage.status === 'key' && 'bg-brass ring-4 ring-brass-soft/50',
        )}
      />
      <p className="eyebrow">{stage.date}</p>
      <div
        className={cn(
          'mt-3 rounded-sm p-6',
          night
            ? 'bg-gradient-to-b from-forest to-forest-deep text-bone shadow-raised'
            : 'card-raised',
        )}
      >
        <h3 className={cn('type-h3', night ? 'text-bone' : 'text-body')}>
          {index + 1}. {stage.title}
        </h3>
        <p className={cn('mt-2 leading-relaxed', night ? 'text-sage' : 'text-soft')}>{stage.body}</p>

        {stage.checklist && (
          <div className="mt-4">
            <p className="type-meta mb-3 text-soft">12-document pack</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {DOCUMENTS.map((doc, i) => (
                <motion.li
                  key={doc}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-start gap-2 text-sm text-body"
                >
                  <Check size={16} className="mt-0.5 flex-none text-evergreen" aria-hidden />
                  {doc}
                </motion.li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-soft">
              MemoryGlen coordinates; parlours and airlines execute.
            </p>
          </div>
        )}

        {stage.image && (
          <figure className="mt-4">
            <img
              src={stage.image.src}
              alt={stage.image.alt}
              className="w-full rounded-sm object-cover"
              loading="lazy"
            />
            {stage.image.caption && (
              <figcaption className={cn('type-meta mt-2', night ? 'text-sage' : 'text-soft')}>
                {stage.image.caption}
              </figcaption>
            )}
          </figure>
        )}

        {stage.notification && (
          <div className="mt-5">
            <NotificationCard
              pulse
              headline="John has crossed the border. He is home."
              detail="His body cleared Zimbabwean customs and immigration at Beitbridge. All permits validated. Estimated arrival in Harare: 08:00. — No calls needed; we'll update you at arrival."
              timestamp="03:15"
            />
            <p className="mt-5 font-display text-lg italic leading-relaxed text-brass-soft">
              {stage.italicCaption}
            </p>
          </div>
        )}
      </div>
    </motion.li>
  );
}

function Tracker() {
  const spineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start 0.6', 'end 0.6'],
  });
  const beadTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="jp-tracker" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="tracker-heading">
      <Reveal>
        <p className="eyebrow">REPATRIATION TRACKER</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 id="tracker-heading" className="type-h2 mt-4 text-body">
          Every step, carried together.
        </h2>
      </Reveal>
      <ol ref={spineRef} className="relative mt-12 space-y-10 border-l border-brass/60">
        {/* Brass progress bead that travels down the spine with scroll */}
        <motion.span
          aria-hidden
          style={{ top: beadTop }}
          className="absolute -left-[7px] h-3.5 w-3.5 rounded-full bg-brass shadow-[0_0_12px_2px_rgba(196,162,76,0.5)]"
        />
        {STAGES.map((stage, i) => (
          <StageCard key={stage.title} stage={stage} index={i} />
        ))}
      </ol>
    </section>
  );
}

/* ---------- Section 3 — Family Support Fund ---------- */
function SupportFund() {
  return (
    <section id="jp-fund" className="section-pad scroll-mt-36" aria-labelledby="fund-heading">
      <div className="rounded-sm bg-forest p-6 text-bone sm:p-10">
        <Reveal>
          <h2 id="fund-heading" className="type-h3 text-bone">
            The Peters Family Support Fund
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sage">
            Opened by Sarah from London at 07:00. She saw the progress bar, the expense list, and
            the GBP to ZAR conversion. She contributed £150 instantly.
          </p>
        </Reveal>

        {/* Progress bar — fills 0→87% over 1.4s on viewport entry */}
        <Reveal delay={0.16}>
          <div className="mt-8">
            <div className="h-2 w-full overflow-hidden rounded-full bg-forest-soft">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '87%' }}
                viewport={{ once: true, margin: '-20% 0px' }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="h-full rounded-full bg-brass"
              />
            </div>
            <p className="type-meta mt-3 text-bone">
              R48,200 of R55,000 raised — <span className="text-brass-soft">87% complete</span> · 19
              contributors
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr]">
          {/* Ledger */}
          <div>
            <p className="eyebrow !text-sage">CONTRIBUTION LEDGER</p>
            <ul className="mt-4 divide-y divide-forest-soft">
              {LEDGER.map((row, i) => (
                <motion.li
                  key={row.name + row.origin}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-bone">{row.name}</p>
                    <p className="text-xs text-sage">{row.origin}</p>
                  </div>
                  <p className="text-right text-sm">
                    <span className="font-medium text-bone">{row.amount}</span>{' '}
                    <span className="text-sage">{row.converted}</span>
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Expense statement */}
          <div className="rounded-sm bg-forest-deep p-6">
            <p className="eyebrow !text-sage">EVERY RAND ACCOUNTED FOR</p>
            <ul className="mt-4 space-y-3">
              {EXPENSES.map((row) => (
                <li key={row.label} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-sage">{row.label}</span>
                  <span className="font-medium text-bone">{row.amount}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn btn-evergreen min-h-12 px-5 text-sm">
                Contribute
              </button>
              <button type="button" className="btn btn-outline-bone min-h-12 px-5 text-sm">
                View Full Ledger
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center gap-1.5 px-2 text-sm font-medium text-sage transition-colors hover:text-bone"
              >
                <Download size={14} aria-hidden /> Download Receipt
              </button>
            </div>
            <p className="mt-4 text-xs text-sage">
              MemoryGlen is a payment facilitator; funds never pool on the platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 4 — Burial Service Livestream ---------- */
function Livestream() {
  return (
    <section id="jp-livestream" className="section-pad scroll-mt-36" aria-labelledby="live-heading">
      <div className="rounded-sm bg-forest-deep p-6 text-bone sm:p-10">
        <Reveal>
          <h2 id="live-heading" className="type-h3 text-bone">
            Live Funeral Service — John Peters.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sage">
            10 August 2026, 11:00 AM CAT · Glen Forest Memorial Park, Harare. Streamed live to
            family in London, Johannesburg, and Toronto. 247 family members and friends watched. 34
            left virtual candles.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <button
            type="button"
            aria-label="Watch the funeral service recording"
            className="group relative mt-8 block aspect-video w-full overflow-hidden rounded-sm"
          >
            <img
              src="/john-life-2.jpg"
              alt="Warm light spilling from the church doorway where the service was held"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-forest-deep/45 transition-colors duration-200 group-hover:bg-forest-deep/30" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-evergreen text-bone transition-transform duration-200 group-hover:scale-[1.04]">
                <Play size={22} className="ml-1" aria-hidden />
              </span>
            </span>
          </button>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 font-display text-lg italic text-brass">
            “Recording stays in the family hub forever.”
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-evergreen min-h-12 px-5 text-sm">
              Watch Recording
            </button>
            <button type="button" className="btn btn-outline-bone min-h-12 px-5 text-sm">
              Light a Candle
            </button>
            <button type="button" className="btn btn-outline-bone min-h-12 px-5 text-sm">
              Download Programme
            </button>
          </div>
          <p className="mt-4 text-xs text-sage">
            During the service, Sarah's message from London was read aloud at the graveside.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Section 5 — Digital Service Booklet ---------- */
const BOOKLET_CONTENTS = [
  'Order of service',
  'Hymn lyrics',
  'Eulogy by David Peters',
  'Messages from Sarah & Michael',
  'Photo gallery',
  'Family tree snapshot',
];

function Booklet() {
  return (
    <section id="jp-booklet" className="section-pad scroll-mt-36" aria-labelledby="booklet-heading">
      <Reveal>
        <div className="card-well p-6 sm:p-10">
          <h2 id="booklet-heading" className="type-h3 text-body">
            Digital Service Booklet
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-soft">
            An interactive programme for those who could not be there in person — order of service,
            hymns, prayers, eulogies, and family messages. QR-linked from the printed programme;
            shareable to family anywhere. Print-ready PDF included.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {BOOKLET_CONTENTS.map((c) => (
              <li
                key={c}
                className="rounded-full border border-brass/50 px-4 py-1.5 text-xs font-medium text-body"
              >
                {c}
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-evergreen mt-8 min-h-12">
            <Download size={16} aria-hidden /> Download Service Booklet
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Section 6 — Closing CTA ---------- */
function ClosingCTA() {
  return (
    <section className="section-pad text-center" aria-label="Closing">
      <Reveal>
        <hr className="brass-rule mx-auto" />
        <h2 className="type-h3 mx-auto mt-8 max-w-xl text-body">
          Every family deserves to bring their people home calmly.
        </h2>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link to="/create" className="btn btn-evergreen min-h-12">
            Create your own memorial — free
          </Link>
          <Link to="/funeral-parlours" className="link-arrow text-sm">
            See how funeral parlours offer this →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Tab ---------- */
export default function JourneyTab() {
  return (
    <div className="container-content flex gap-12">
      <div className="w-full min-w-0 max-w-[880px]">
        <JourneyHero />
        <Tracker />
        <SupportFund />
        <Livestream />
        <Booklet />
        <ClosingCTA />
      </div>
      <ServiceProviderRail providers={RAIL_PROVIDERS} className="mt-24" />
    </div>
  );
}
