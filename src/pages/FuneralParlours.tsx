import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Route,
  Search,
  Video,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { CandleFlame } from '@/components/CandleFlame';
import BrandReskinDemo from '@/pages/partners/BrandReskinDemo';
import type { BrandSkin } from '@/pages/partners/BrandReskinDemo';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Part 1 — verified public directory (fictional seed listings)        */
/* ------------------------------------------------------------------ */

interface Parlour {
  name: string;
  city: string;
  country: 'Zimbabwe' | 'South Africa';
  reg: string;
  address: string;
  email: string;
  phone: string;
}

const PARLOURS: Parlour[] = [
  {
    name: 'Moyo Funeral Services',
    city: 'Harare',
    country: 'Zimbabwe',
    reg: 'REG-10234',
    address: '14 Samora Machel Avenue, Harare, Zimbabwe',
    email: 'care@moyofunerals.co.zw',
    phone: '+263 242 700 114',
  },
  {
    name: 'Ncube & Sons Undertakers',
    city: 'Johannesburg',
    country: 'South Africa',
    reg: 'REG-20441',
    address: '88 Main Reef Road, Johannesburg, South Africa',
    email: 'family@ncubeandsons.co.za',
    phone: '+27 11 402 8890',
  },
  {
    name: 'Dube Memorial Services',
    city: 'Bulawayo',
    country: 'Zimbabwe',
    reg: 'REG-10992',
    address: '23 Fife Street, Bulawayo, Zimbabwe',
    email: 'info@dubememorial.co.zw',
    phone: '+263 292 661 407',
  },
  {
    name: 'Khumalo Family Funerals',
    city: 'Durban',
    country: 'South Africa',
    reg: 'REG-31078',
    address: '301 Umbilo Road, Durban, South Africa',
    email: 'hello@khumalofunerals.co.za',
    phone: '+27 31 205 6633',
  },
];

const COUNTRY_FILTERS = ['All Countries', 'Zimbabwe', 'South Africa'] as const;

function ParlourCard({ parlour, index }: { parlour: Parlour; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className="card-raised group h-full p-6 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="type-h3 text-body">{parlour.name}</h3>
          {/* Trust holds steady: the Approved badge never animates on hover. */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-evergreen px-3 py-1 text-xs font-semibold text-bone">
            <Check className="h-3.5 w-3.5" aria-hidden />
            Approved
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="type-meta text-soft">Reg: {parlour.reg}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-well px-3 py-1 text-xs font-medium text-soft">
            <MapPin className="h-3 w-3" aria-hidden />
            {parlour.city}, {parlour.country}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-soft">{parlour.address}</p>
        <div className="mt-4 space-y-2">
          <a
            href={`mailto:${parlour.email}`}
            className="flex min-h-12 items-center gap-2 text-sm font-medium text-evergreen hover:text-evergreen-bright"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {parlour.email}
          </a>
          <a
            href={`tel:${parlour.phone.replace(/\s/g, '')}`}
            className="flex min-h-12 items-center gap-2 text-sm font-medium text-evergreen hover:text-evergreen-bright"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {parlour.phone}
          </a>
        </div>
        <p className="link-arrow mt-4 text-sm">
          View parlour profile
          <ArrowRight className="h-4 w-4" aria-hidden />
        </p>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Part 2 — the white-label pitch                                      */
/* ------------------------------------------------------------------ */

const FLOW_STEPS = [
  {
    n: '01',
    title: 'Your brand, front and center',
    body: "Your logo, your colours, your domain (e.g., memorials.yourparlour.co.za). Families see you. A small 'Powered by MemoryGlen' mark sits in the footer — the engine, not the brand.",
  },
  {
    n: '02',
    title: 'Sign families up from your own website',
    body: 'Embed our signup widget or link your package paperwork. A claim or arrangement auto-activates the family\u2019s private hub — co-branded from minute one.',
  },
  {
    n: '03',
    title: 'Every memorial links back to you',
    body: 'Google presence: each memorial your families create carries your parlour\u2019s name and contact. Every share is an ambassador.',
  },
];

const VALUE_CARDS = [
  {
    icon: LayoutDashboard,
    title: 'White-label family hubs for every funeral',
    body: 'Included at Standard Partner tier and above.',
  },
  {
    icon: Video,
    title: 'Livestreaming as a service line',
    body: 'Billable; diaspora demand is constant. Recording stays in the family hub forever.',
  },
  {
    icon: Route,
    title: 'Repatriation coordination',
    body: 'One shared tracker replaces the 30 phone calls per cross-border case. MemoryGlen coordinates; your parlour executes.',
  },
  {
    icon: CalendarCheck,
    title: 'Pre-need channel',
    body: 'Living Legacy funeral-preferences bookings book tomorrow\u2019s funerals today — shared directly with your parlour.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & staff management',
    body: 'Staff roles, permissions, usage reporting, billing — one quiet dashboard.',
    wide: true,
  },
];

const PARLOUR_SKINS: BrandSkin[] = [
  {
    id: 'horizon',
    name: 'Horizon Funeral Services (demo)',
    domain: 'memorials.horizonfunerals.co.za',
    initials: 'HF',
    colors: { deep: '#26170E', primary: '#7A4A26', surface: '#F3ECE2', text: '#2A2019' },
  },
  {
    id: 'memoryglen',
    name: 'MemoryGlen default',
    domain: 'memoryglen.com/hub',
    initials: 'MG',
    colors: { deep: '#0E211D', primary: '#2E5945', surface: '#F6F1E7', text: '#1C1C1A' },
  },
];

const PLANS = [
  { name: 'Free Partner', price: 'R0', note: 'Directory listing & family links' },
  { name: 'Standard Partner', price: 'R499/month', note: 'White-label hubs included', popular: true },
  { name: 'Premium Partner', price: 'R999/month', note: 'Full analytics & priority support' },
];

/* ------------------------------------------------------------------ */

export default function FuneralParlours() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState<(typeof COUNTRY_FILTERS)[number]>('All Countries');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PARLOURS.filter((p) => {
      const matchesCountry = country === 'All Countries' || p.country === country;
      const matchesQuery =
        q === '' || p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
      return matchesCountry && matchesQuery;
    });
  }, [query, country]);

  return (
    <div className="bg-bg">
      {/* ================= Part 1 — Directory ================= */}
      <section className="container-content section-pad">
        <Reveal>
          <p className="eyebrow">Funeral Parlours</p>
          <h1 className="type-h1 mt-4 text-body">Funeral Parlour Directory.</h1>
          <p className="mt-4 max-w-reading type-story text-soft">
            Find trusted funeral parlours in your area. All listed parlours are verified partners
            of MemoryGlen.
          </p>
        </Reveal>

        {/* Search & filter */}
        <Reveal delay={0.08} className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search by name or city</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-soft"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or city…"
                className="min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface py-3 pl-11 pr-4 text-base text-body placeholder:text-soft/70"
              />
            </label>
            <label className="sm:w-56">
              <span className="sr-only">Filter by country</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as (typeof COUNTRY_FILTERS)[number])}
                className="min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 py-3 text-base text-body"
              >
                {COUNTRY_FILTERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Reveal>

        {/* Directory grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filtered.map((p, i) => (
            <ParlourCard key={p.reg} parlour={p} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-10 text-center type-story text-soft">
            No verified parlours match your search yet. Try a different name, city, or country.
          </p>
        )}
      </section>

      {/* ================= Part 2 — White-label pitch ================= */}
      <section className="relative overflow-hidden bg-forest-deep">
        <motion.img
          src="/parlour-hero.jpg"
          alt=""
          aria-hidden
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-deep/80" aria-hidden />
        <div className="container-content relative py-20 md:py-28">
          <Reveal>
            <p className="eyebrow" style={{ color: 'var(--brass)' }}>
              For Funeral Parlours
            </p>
            <h2 className="type-h1 mt-4 max-w-3xl text-bone">
              Your brand. Your families. Your website — powered by MemoryGlen.
            </h2>
            <p className="mt-6 max-w-reading type-story text-sage">
              Offer every client family a beautiful digital memorial under YOUR parlour&rsquo;s
              name. Families sign up from your own website. The experience is white-labelled
              end-to-end — and it runs only while you&rsquo;re a partner: if the subscription
              ends, the white label sleeps. Your brand grows; we stay invisible.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How the white label works */}
      <section className="container-content section-pad">
        <Reveal>
          <p className="eyebrow">How the white label works</p>
          <h2 className="type-h2 mt-4 text-body">Three steps to your own branded hub.</h2>
        </Reveal>
        <div className="relative mt-12">
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute left-0 top-6 hidden h-px w-full origin-left bg-brass md:block"
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {FLOW_STEPS.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 0.08} className="relative">
                <span className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-brass bg-bg font-display text-lg text-brass">
                  {step.n}
                </span>
                <h3 className="type-h3 mt-5 text-body">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-soft">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Value grid */}
      <section className="bg-well">
        <div className="container-content section-pad">
          <Reveal>
            <p className="eyebrow">What your parlour gains</p>
            <h2 className="type-h2 mt-4 text-body">Built for the work you already do.</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {VALUE_CARDS.map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 0.06}
                className={cn(card.wide && 'md:col-span-2')}
              >
                <article className="card-raised group h-full p-6">
                  <card.icon
                    className="h-6 w-6 text-evergreen transition-colors duration-200 group-hover:text-brass"
                    aria-hidden
                  />
                  <h3 className="type-h3 mt-4 text-body">{card.title}</h3>
                  <p className="mt-2 leading-relaxed text-soft">{card.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Branding demo strip */}
      <section className="container-content section-pad">
        <Reveal>
          <h2 className="type-h2 text-body">See the same family hub in two brands.</h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-8 max-w-2xl">
          <BrandReskinDemo
            skins={PARLOUR_SKINS}
            label="See the same family hub in two brands"
            caption="Same engine. Your identity."
          />
        </Reveal>
      </section>

      {/* Plans teaser + registration CTA */}
      <section className="container-content pb-16 md:pb-24">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'card-raised relative p-6',
                  plan.popular && 'border border-evergreen',
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-evergreen px-3 py-1 text-xs font-semibold text-bone">
                    Popular
                  </span>
                )}
                <p className="type-meta text-soft">{plan.name}</p>
                <p className="type-stat mt-2 text-body">{plan.price}</p>
                <p className="mt-2 text-sm text-soft">{plan.note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div className="relative overflow-hidden rounded-sm bg-forest px-6 py-12 text-center md:px-12">
            <CandleFlame size={26} className="mx-auto" />
            <h2 className="type-h2 mt-4 text-bone">
              Are you a funeral parlour? Register here.
            </h2>
            <p className="mx-auto mt-3 max-w-reading text-sage">
              Four steps — parlour details, verification, branding setup, launch checklist. Your
              progress autosaves.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/funeral-parlours/register" className="btn btn-evergreen">
                Register your parlour
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href="mailto:admin@memoryglen.com" className="btn btn-outline-bone">
                Questions? admin@memoryglen.com
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= Part 3 — Trust & compliance ================= */}
      <section className="border-t border-[color:var(--line)]">
        <div className="container-content grid gap-8 py-12 md:grid-cols-3">
          {[
            'POPIA compliant — family data belongs to families.',
            'Payment facilitator only — we never hold pooled funds.',
            'Fictional demo brands only — your real parlour brand appears after verification.',
          ].map((line) => (
            <Reveal key={line}>
              <hr className="brass-rule-sm" />
              <p className="mt-4 text-sm leading-relaxed text-soft">{line}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
