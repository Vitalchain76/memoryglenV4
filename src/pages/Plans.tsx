import { useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type PlanFamily = 'families' | 'parlours' | 'societies' | 'providers';

const FAMILY_TABS: { id: PlanFamily; label: string }[] = [
  { id: 'families', label: 'For Families' },
  { id: 'parlours', label: 'For Funeral Parlours' },
  { id: 'societies', label: 'For Societies' },
  { id: 'providers', label: 'For Service Providers' },
];

interface Tier {
  name: string;
  monthly?: string;
  yearly?: string;
  onceOff?: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const FAMILY_TIERS: Tier[] = [
  {
    name: 'Free Forever',
    monthly: 'R0',
    yearly: 'R0',
    features: [
      '1 family cemetery',
      '5 resting places',
      '3-generation family tree',
      'Basic memory lane (text)',
      'Public & private memorials',
      'QR share',
    ],
    cta: 'Create free',
  },
  {
    name: 'Heritage',
    monthly: 'R99',
    yearly: 'R990',
    popular: true,
    features: [
      '3 cemeteries',
      '25 resting places each',
      'Family crest & colours (EmblemStudio)',
      'Full family tree',
      'Memory lane with voice, photo & video',
      'Memory book PDF export',
      'No service-provider rail on your pages',
    ],
    cta: 'Choose Heritage',
  },
  {
    name: 'Legacy',
    monthly: 'R299',
    yearly: 'R2,990',
    features: [
      'Unlimited cemeteries & resting places',
      'Custom web address (yourfamily.memoryglen.com)',
      'Living Legacy & the sealed Vault',
      'AI tree suggestions',
      'Multi-glen linking',
      'Heritage book export',
      'Permanent archive',
      'Priority support',
    ],
    cta: 'Choose Legacy',
  },
  {
    name: 'Diaspora Family',
    monthly: 'R199',
    features: [
      'For families spread across borders',
      'Repatriation tracker',
      'Multi-currency support fund',
      'Livestream bundle',
      'Digital service booklets',
      'Everything in Heritage',
    ],
    cta: 'Choose Diaspora',
  },
];

const PARLOUR_TIERS: Tier[] = [
  {
    name: 'Free Partner',
    monthly: 'R0',
    features: ['Directory listing', '1 staff seat', 'Basic family-hub activation'],
    cta: 'Join free',
  },
  {
    name: 'Standard Partner',
    monthly: 'R499',
    popular: true,
    features: [
      'Featured directory listing',
      'Your branding on family hubs',
      '10 staff seats',
      'Memorial management',
      'Livestream scheduling',
      'Analytics',
    ],
    cta: 'Choose Standard',
  },
  {
    name: 'Premium Partner',
    monthly: 'R999',
    features: [
      'Priority placement',
      'Full white label (your domain, your colours)',
      'Unlimited staff',
      'API',
      'Livestream integration',
      'Pre-need (Living Legacy) co-sell',
    ],
    cta: 'Choose Premium',
  },
];

const PROVIDER_TIERS: Tier[] = [
  {
    name: 'Featured',
    monthly: 'from R750',
    features: ['1 per page region', 'Brass-framed card with logo, description & contact', 'Top of rail'],
    cta: 'List your service',
  },
  {
    name: 'Standard',
    monthly: 'from R350',
    features: ['Card with name, category, one line & contact'],
    cta: 'List your service',
  },
  {
    name: 'Basic',
    monthly: 'from R150',
    features: ['Text listing: name, category, phone'],
    cta: 'List your service',
  },
];

const COMPARISON: { label: string; values: [string, string, string, string] }[] = [
  { label: 'Cemeteries', values: ['1', '3', 'Unlimited', 'Unlimited'] },
  { label: 'Resting places', values: ['5', '25 each', 'Unlimited', '25 each'] },
  { label: 'Family tree depth', values: ['3 gen', 'Full', 'Full', 'Full'] },
  { label: 'Voice & video media', values: ['–', 'yes', 'yes', 'yes'] },
  { label: 'Living Legacy Vault', values: ['–', '–', 'yes', '–'] },
  { label: 'Repatriation tracker', values: ['–', '–', 'yes', 'yes'] },
  { label: 'Custom web address', values: ['–', '–', 'yes', '–'] },
  { label: 'Heritage book export', values: ['–', 'PDF', 'Printed + PDF', 'PDF'] },
  { label: 'Storage', values: ['100MB', '5GB', '50GB', '10GB'] },
];

const ONE_TIME_PRODUCTS = [
  { name: 'Memorial Books (printed)', price: 'from R450' },
  { name: 'QR Plaques (brass)', price: 'from R650' },
  { name: 'Service Booklets (print-ready PDF + print run)', price: 'from R300' },
  { name: 'Candle dedications', price: 'small gestures from R25' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Do my memorials disappear if I cancel?',
    a: 'No. Public memorials stay online; paid features pause. Recordings stay in the family hub forever.',
  },
  {
    q: "Who owns our family's data?",
    a: 'Your family. POPIA compliant; export or delete anytime.',
  },
  {
    q: 'Is the Digital Will a legal will?',
    a: 'No — it records wishes only and is labelled as such.',
  },
  {
    q: 'Can a parlour or society cancel?',
    a: "Anytime; white-label branding sleeps, and family memorials remain accessible under MemoryGlen's banner.",
  },
  {
    q: 'Payment security?',
    a: 'We are a payment facilitator; card data is handled by our PCI-DSS processor and never stored.',
  },
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-soft">
          <Check size={16} className="mt-1 flex-none text-brass" aria-hidden />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function TierCard({ tier, yearly, delay = 0 }: { tier: Tier; yearly?: boolean; delay?: number }) {
  const price = yearly && tier.yearly ? tier.yearly : tier.monthly;
  const per = tier.onceOff ? '' : yearly && tier.yearly ? '/year' : '/month';
  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={cn(
          'card-raised relative flex h-full flex-col p-8',
          tier.popular && 'border border-brass',
        )}
      >
        {tier.popular && (
          <span className="absolute -top-3 left-8 rounded-full bg-brass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-deep">
            Most chosen
          </span>
        )}
        <h3 className="type-h3 text-body">{tier.name}</h3>
        <p className="mt-4">
          <span className="type-stat text-body">{tier.onceOff ?? price}</span>
          {per && <span className="type-meta ml-1 text-soft">{per}</span>}
        </p>
        <FeatureList features={tier.features} />
        <div className="mt-8 flex-1" />
        <Link
          to="/create"
          className={cn('btn min-h-12 w-full', tier.popular ? 'btn-evergreen' : 'btn-outline-evergreen')}
        >
          {tier.cta}
        </Link>
      </div>
    </Reveal>
  );
}

function FamiliesTab() {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-1 rounded-full">
        <div className="card-well inline-flex rounded-full p-1" role="group" aria-label="Billing period">
          {(['Monthly', 'Yearly'] as const).map((label) => {
            const active = (label === 'Yearly') === yearly;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setYearly(label === 'Yearly')}
                aria-pressed={active}
                className={cn(
                  'min-h-12 rounded-full px-6 text-sm font-medium transition-colors duration-200',
                  active ? 'bg-evergreen text-bone' : 'text-soft hover:text-body',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {FAMILY_TIERS.map((t, i) => (
          <TierCard key={t.name} tier={t} yearly={yearly} delay={i * 0.08} />
        ))}
      </div>

      {/* Forever Glen — once-off */}
      <Reveal delay={0.1} className="mt-10">
        <div className="card-raised flex flex-col items-start gap-6 border border-brass p-8 md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="type-h3 text-body">Forever Glen</h3>
            <p className="mt-3">
              <span className="type-stat text-body">R4,999</span>
              <span className="type-meta ml-2 text-soft">once-off</span>
            </p>
            <p className="mt-3 max-w-reading text-[0.9375rem] leading-relaxed text-soft">
              One permanent glen. Never billed again. Also available inside funeral packages through
              partner parlours.
            </p>
          </div>
          <a href="mailto:admin@memoryglen.com?subject=Forever%20Glen%20enquiry" className="btn btn-evergreen min-h-12 flex-none">
            Enquire
          </a>
        </div>
      </Reveal>
    </div>
  );
}

function ParloursTab() {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {PARLOUR_TIERS.map((t, i) => (
          <TierCard key={t.name} tier={t} delay={i * 0.08} />
        ))}
      </div>
      <p className="type-meta mt-8 text-center text-soft">
        White-labelled hubs are powered by MemoryGlen and run while your partnership is active.
      </p>
    </div>
  );
}

function SocietiesTab() {
  return (
    <Reveal>
      <div className="card-raised mx-auto max-w-3xl p-8 md:p-12">
        <h3 className="type-h3 text-body">For burial societies & stokvels</h3>
        <p className="mt-4">
          <span className="type-stat text-body">R10–15</span>
          <span className="type-meta ml-2 text-soft">per member per month</span>
        </p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-soft">
          Billed to the society as a line item; under 50c/day per member. Includes branded society
          portal, instant family hubs, repatriation tracker, support fund, livestreams, community
          glen.
        </p>
        <div className="card-well mt-6 border-l-2 border-brass p-5">
          <p className="font-display text-lg text-body">Design-partner offer</p>
          <p className="mt-1 text-sm leading-relaxed text-soft">First 3 societies: free for 6 months.</p>
        </div>
        <a
          href="mailto:admin@memoryglen.com?subject=Burial%20society%20partnership"
          className="btn btn-evergreen mt-8 min-h-12"
        >
          Talk to us
        </a>
      </div>
    </Reveal>
  );
}

function ProvidersTab() {
  return (
    <div>
      <p className="mx-auto max-w-reading text-center text-[0.9375rem] leading-relaxed text-soft">
        Family service providers — florists, caterers, tombstone makers, transporters,
        photographers, streaming services — appear in the quiet Service Provider rail beside
        memorial and directory pages. Families see only relevant, labelled, dignified listings.{' '}
        <strong className="font-medium text-body">
          Ads never appear on paid family pages, inside private glens, or on Living Legacy
          dashboards.
        </strong>
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PROVIDER_TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className="h-full">
            <div className={cn('card-raised flex h-full flex-col p-8', t.name === 'Featured' && 'border border-brass')}>
              <h3 className="type-h3 text-body">{t.name}</h3>
              <p className="mt-4">
                <span className="font-display text-3xl leading-none text-body">{t.monthly}</span>
                <span className="type-meta ml-1 text-soft">/month{t.name === 'Featured' ? ' · per region' : ''}</span>
              </p>
              <FeatureList features={t.features} />
              <p className="type-meta mt-4 text-soft">Indicative — final pricing to be confirmed.</p>
              <div className="mt-6 flex-1" />
              <Link to="/service-providers" className="btn btn-outline-evergreen min-h-12 w-full">
                {t.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="type-meta mt-8 text-center text-soft">
        Every placement carries a "Paid listing" label.
      </p>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="card-well overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead className="sticky top-[72px]">
          <tr className="bg-well">
            <th scope="col" className="sticky left-0 bg-well px-6 py-4 font-display text-base text-body">
              Compare plans
            </th>
            {['Free', 'Heritage', 'Legacy', 'Diaspora'].map((c) => (
              <th key={c} scope="col" className="px-6 py-4 font-display text-base text-body">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map((row) => (
            <tr key={row.label} className="border-t border-[color:var(--line)]">
              <th scope="row" className="sticky left-0 bg-well px-6 py-4 text-sm font-medium text-body">
                {row.label}
              </th>
              {row.values.map((v, i) => (
                <td key={i} className="px-6 py-4 text-sm text-soft">
                  {v === 'yes' ? (
                    <Check size={16} className="text-brass" aria-label="Included" />
                  ) : v === '–' ? (
                    <Minus size={16} className="text-soft" aria-label="Not included" />
                  ) : (
                      v
                    )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Plans() {
  const [family, setFamily] = useState<PlanFamily>('families');

  return (
    <div>
      {/* Section 1 — Header */}
      <section className="container-content section-pad pb-12 text-center">
        <Reveal>
          <p className="eyebrow eyebrow-centered">Plans</p>
          <h1 className="type-h1 mt-6 text-body">Forever has a simple price.</h1>
          <p className="type-story mx-auto mt-6 max-w-reading text-soft">
            Start free. Upgrade when your family grows. Cancel anytime — your memorials and
            recordings stay.
          </p>
        </Reveal>
      </section>

      {/* Section 2 — Plan family tabs */}
      <section className="container-content pb-16 md:pb-24">
        <div className="mb-12 flex justify-center">
          <div
            className="card-well inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full p-1"
            role="tablist"
            aria-label="Plan families"
          >
            {FAMILY_TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={family === t.id}
                onClick={() => setFamily(t.id)}
                className={cn(
                  'min-h-12 rounded-full px-5 text-sm font-medium transition-colors duration-200',
                  family === t.id ? 'bg-evergreen text-bone' : 'text-soft hover:text-body',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={family}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {family === 'families' && <FamiliesTab />}
            {family === 'parlours' && <ParloursTab />}
            {family === 'societies' && <SocietiesTab />}
            {family === 'providers' && <ProvidersTab />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Section 3 — Comparison table */}
      <section className="container-content section-pad border-t border-[color:var(--line)]">
        <Reveal>
          <p className="eyebrow">Compare</p>
          <h2 className="type-h2 mt-4 text-body">Every family plan, side by side.</h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <ComparisonTable />
        </Reveal>
      </section>

      {/* Section 4 — One-time products */}
      <section className="container-content section-pad pt-0">
        <Reveal>
          <p className="eyebrow">Once-off</p>
          <h2 className="type-h2 mt-4 text-body">Things you can hold.</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ONE_TIME_PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08} className="h-full">
              <div className="card-raised flex h-full flex-col p-6">
                <h3 className="font-display text-lg leading-snug text-body">{p.name}</h3>
                <div className="flex-1" />
                <p className="type-meta mt-6 text-brass">{p.price}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Section 5 — FAQ */}
      <section className="container-content section-pad pt-0">
        <div className="mx-auto max-w-reading">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 className="type-h2 mt-4 text-body">Asked gently, answered plainly.</h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <Accordion type="single" collapsible>
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border-[color:var(--line)]">
                  <AccordionTrigger className="min-h-12 py-5 text-left font-display text-lg text-body hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-soft">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Section 6 — Closing CTA */}
      <section className="container-content section-pad pt-0 text-center">
        <hr className="brass-rule mx-auto mb-16" />
        <Reveal>
          <h2 className="type-h3 text-body">Start free. Stay forever.</h2>
          <Link to="/create" className="btn btn-evergreen mt-8 min-h-12 px-8">
            Create a Memorial — free
            <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
