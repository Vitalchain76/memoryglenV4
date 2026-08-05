import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  GraduationCap,
  Heart,
  Images,
  Mic,
  Music,
  QrCode,
  ShieldCheck,
  Sparkles,
  Store,
  Trophy,
  Users,
  Video,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import CandleFlame from '@/components/CandleFlame';
import Hero from '@/pages/home/Hero';
import JohnDemo from '@/pages/home/JohnDemo';
import HowItWorks from '@/pages/home/HowItWorks';
import FamilyGlenExplainer from '@/pages/home/FamilyGlenExplainer';
import { useWhiteLabel } from '@/context/WhiteLabelContext';

// LivingGlen active-life palette. Kept local so MemoryGlen's forest/brass
// design tokens are never touched.
const LG_EMERALD = '#059669';
const LG_MINT = '#D1FAE5';
const LG_STONE = '#F5F5F4';

/* ---------- Section 5 — Feature grid ---------- */
const FEATURES = [
  { Icon: Images, title: 'Photo & Video Gallery', body: 'Every photograph, every clip — kept in one permanent, beautiful place.' },
  { Icon: Mic, title: 'Voice Notes', body: 'A voice saved — a birthday wish, a blessing, a laugh — kept forever.' },
  { Icon: Music, title: 'Song Playlists', body: 'Compile the songs they loved from Spotify, YouTube, or your own recordings. On every memorial.' },
  { Icon: Video, title: 'Funeral Livestreams', body: 'The diaspora killer feature — the recording stays in the family hub forever.' },
  { Icon: QrCode, title: 'QR Code Plaques', body: 'A brass plaque on the headstone that opens the memorial — every visit finds every memory.' },
  { Icon: BookOpen, title: 'Memorial Books', body: 'The story, tributes, and photographs printed and bound for the family shelf.' },
  { Icon: ShieldCheck, title: 'Family Control', body: 'Guardians approve all content. Full privacy control.' },
  { Icon: Flame, title: 'Digital Candles', body: 'Light a candle from anywhere in the world. The flames never go out.' },
];

function FeatureGrid() {
  return (
    <section className="section-pad" aria-labelledby="features-heading">
      <div className="container-content">
        <Reveal>
          <p className="eyebrow eyebrow-centered">EVERYTHING A MEMORY DESERVES</p>
          <h2 id="features-heading" className="type-h2 mt-4 text-center text-body">
            A sanctuary, fully furnished.
          </h2>
        </Reveal>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={(i % 4) * 0.08}>
              <div className="card-well group h-full p-6 transition-transform duration-200 hover:-translate-y-0.5">
                <Icon
                  size={24}
                  aria-hidden
                  className="text-evergreen transition-colors duration-200 group-hover:text-brass"
                />
                <h3 className="type-h3 mt-4 text-body">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft">{body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Section 6 — The Five Tabs teaser ---------- */
const FIVE_TABS = [
  {
    title: 'The Journey',
    line: 'From the moment the news arrives to the moment they rest.',
    img: '/john-journey-border.jpg',
    href: '/memorials/john-peters?tab=journey',
  },
  {
    title: 'The Memorial',
    line: 'Story, gallery, voice, song, candles.',
    img: '/john-portrait.jpg',
    href: '/memorials/john-peters?tab=memorial',
  },
  {
    title: 'Family Glen',
    line: "Your family's own cemetery, designed by you.",
    img: '/glen-grove-earthly.jpg',
    href: '/memorials/john-peters?tab=glen',
  },
  {
    title: 'Family Tree',
    line: 'Woven as you add the people you love.',
    img: null, // tree motif
    href: '/memorials/john-peters?tab=tree',
  },
  {
    title: 'Living Legacy',
    line: 'Decide how the world remembers you.',
    img: '/living-legacy-hero.jpg',
    href: '/memorials/john-peters?tab=legacy',
  },
];

function FiveTabs() {
  return (
    <section className="section-pad bg-forest" aria-labelledby="five-tabs-heading">
      <div className="container-content">
        <Reveal>
          <p className="eyebrow !text-sage">THE FIVE-ROOM MEMORIAL</p>
          <h2 id="five-tabs-heading" className="type-h2 mt-4 text-bone">
            One memorial. Five rooms.
          </h2>
        </Reveal>
        <ul className="mt-14 grid snap-x snap-mandatory grid-flow-col gap-6 overflow-x-auto pb-4 [grid-auto-columns:80%] sm:[grid-auto-columns:46%] lg:grid-flow-row lg:grid-cols-5 lg:overflow-visible lg:[grid-auto-columns:unset]">
          {FIVE_TABS.map((tab, i) => (
            <Reveal as="li" key={tab.title} delay={i * 0.1} className="snap-start">
              <Link
                to={tab.href}
                className="group flex h-full flex-col rounded-sm border border-brass/30 bg-forest-deep p-3 transition-colors duration-300 hover:border-brass"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-sm">
                  {tab.img ? (
                    <img
                      src={tab.img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-forest-soft">
                      <img
                        src="/logo-mark.svg"
                        alt=""
                        width={96}
                        height={96}
                        className="transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="font-display text-xl text-bone">{tab.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-sage">{tab.line}</p>
                  <span className="link-arrow mt-4 !text-brass-soft">
                    Explore <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Section 7 — Stats band ---------- */
function HomeStats() {
  return (
    <section className="bg-forest-deep py-14" aria-label="MemoryGlen in numbers">
      <div className="container-content">
        {/* These were '500+ Families Served', '200+ Livestreams', '1K+ QR Codes'
            and '50+ Partner Parlours'. MemoryGlen has not launched, so every one
            of those numbers was untrue. Claiming traction you do not have is the
            fastest way to lose the trust this product depends on, and it is the
            kind of thing an investor checks.

            Replaced with what is actually true today. Put real numbers back the
            day they are real, and not before. */}
        <div className="mx-auto max-w-reading text-center">
          <p className="type-quote text-bone">
            Built for families across Zimbabwe, South Africa and the diaspora —
            wherever a memorial link needs to reach.
          </p>
          <p className="type-meta mt-4 text-sage">
            A memorial is free to create and stays free to visit.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 8 — Partner bands ---------- */
const PARTNERS = [
  {
    img: '/parlour-hero.jpg',
    title: 'Your brand. Your families. Powered by MemoryGlen.',
    body: 'White-label memorial portals under your own name. Sign families up from your own website.',
    cta: 'Become a Partner',
    href: '/funeral-parlours',
    alt: 'A dignified funeral-home reception in warm wood and soft light',
  },
  {
    img: '/society-hero.jpg',
    title: 'No more 3AM WhatsApp chaos.',
    body: 'From R10 per member per month — under 50c a day.',
    cta: 'For Societies & Stokvels',
    href: '/burial-societies',
    alt: 'Hands of a circle of people passing a ledger book at golden hour',
  },
];

function PartnerBands() {
  return (
    <section aria-label="For funeral parlours and burial societies">
      <div className="grid md:grid-cols-2">
        {PARTNERS.map((p) => (
          <Reveal key={p.title}>
            <Link to={p.href} className="group relative block min-h-[380px] overflow-hidden">
              <img
                src={p.img}
                alt={p.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform [transition-duration:600ms] group-hover:scale-[1.04]"
              />
              <div aria-hidden className="absolute inset-0 bg-forest-deep/70" />
              <div className="relative flex min-h-[380px] flex-col justify-end p-8 md:p-12">
                <h3 className="type-h3 max-w-md !text-[1.5rem] text-bone">{p.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/80">{p.body}</p>
                <span className="btn btn-evergreen mt-6 w-fit">{p.cta}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Section 9 — Closing CTA ---------- */
function ClosingCta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [ignited, setIgnited] = useState(false);
  if (inView && !ignited) setIgnited(true);

  return (
    <section ref={ref} className="section-pad" aria-labelledby="closing-heading">
      <div className="container-content flex flex-col items-center text-center">
        {/* The one signature flourish — the flame ignites on entry */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={ignited ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <CandleFlame size={28} lit={ignited} />
        </motion.div>
        <Reveal>
          <hr className="brass-rule mx-auto mt-8" />
          <h2 id="closing-heading" className="type-h2 mt-8 max-w-reading text-body">
            Start preserving memories today.
          </h2>
          <p className="type-story mt-4 text-soft">Create a free memorial in minutes. It stays forever.</p>
          <Link to="/create" className="btn btn-evergreen mt-8">
            Create a Memorial — free
          </Link>
          <p className="mt-6 text-sm text-soft">
            Questions? Write to{' '}
            <a href="mailto:admin@memoryglen.com" className="text-evergreen underline underline-offset-4">
              admin@memoryglen.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ==========================================================================
   LivingGlen (livingglen.com) — active Life Operating System home sections.
   These render ONLY when isLivingGlen is true. No memorial / funeral / tribute
   content appears on the LivingGlen home. Emerald / mint / stone palette,
   kept local so MemoryGlen tokens are untouched.
   ========================================================================== */

/* ---------- LivingGlen §1 — Group Glens showcase ---------- */
const GROUP_GLENS = [
  { Icon: Heart, title: 'Family Circles', body: 'A shared living space for your whole family — births, milestones, weekly moments, all in one private circle.' },
  { Icon: GraduationCap, title: 'School Alumni Cohorts', body: 'Reunite your class year. Keep the group story growing long after graduation day.' },
  { Icon: Trophy, title: 'Sports Teams', body: 'Seasons, wins, and the people who made them. A living record for the whole squad.' },
];

function GroupGlensShowcase() {
  return (
    <section id="group-glens" className="section-pad scroll-mt-24" style={{ backgroundColor: LG_STONE }} aria-labelledby="group-glens-heading">
      <div className="container-content">
        <Reveal>
          <p className="eyebrow" style={{ color: LG_EMERALD }}>GROUP GLENS</p>
          <h2 id="group-glens-heading" className="type-h2 mt-4 text-body">
            Every circle you belong to, alive in one place.
          </h2>
          <p className="type-story mt-4 max-w-reading text-soft">
            Start a shared Glen for the people you do life with — and let everyone add to the story as it happens.
          </p>
        </Reveal>
        <ul className="mt-14 grid gap-6 sm:grid-cols-3">
          {GROUP_GLENS.map(({ Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08}>
              <div
                className="group h-full rounded-lg p-7 transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: '#ffffff', border: `1px solid ${LG_MINT}` }}
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: LG_MINT, color: LG_EMERALD }}
                >
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="type-h3 mt-5 text-body">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft">{body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <Link
            to="/plans"
            className="btn mt-10 inline-flex min-h-12"
            style={{ backgroundColor: LG_EMERALD, color: '#ffffff', borderColor: LG_EMERALD }}
          >
            Start a Group Glen <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- LivingGlen §2 — Time Capsules & Milestone cards ---------- */
const TIME_CAPSULES = [
  { Icon: Mic, title: 'Voice Notes', body: 'Record a message today, delivered to future you — or to someone you love, on a date you choose.' },
  { Icon: Clock, title: 'Anniversary Archives', body: 'Bundle a year of moments into a capsule that opens on the day that matters.' },
  { Icon: Sparkles, title: 'Milestone Cards', body: 'Mark first steps, new jobs, big moves — each one saved to your living record forever.' },
];

function TimeCapsules() {
  return (
    <section id="time-capsules" className="section-pad scroll-mt-24" style={{ backgroundColor: '#ffffff' }} aria-labelledby="time-capsules-heading">
      <div className="container-content">
        <Reveal>
          <p className="eyebrow" style={{ color: LG_EMERALD }}>TIME CAPSULES & MILESTONES</p>
          <h2 id="time-capsules-heading" className="type-h2 mt-4 text-body">
            Capture the moment now. Open it when it counts.
          </h2>
        </Reveal>
        <ul className="mt-14 grid gap-6 sm:grid-cols-3">
          {TIME_CAPSULES.map(({ Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08}>
              <div
                className="h-full rounded-lg p-7"
                style={{ backgroundColor: LG_STONE, border: `1px solid ${LG_MINT}` }}
              >
                <Icon size={24} aria-hidden style={{ color: LG_EMERALD }} />
                <h3 className="type-h3 mt-4 text-body">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft">{body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- LivingGlen §3 — Service Provider & Partner marketplace preview ---------- */
function ServiceProviderPreview() {
  return (
    <section className="section-pad" style={{ backgroundColor: LG_STONE }} aria-labelledby="providers-heading">
      <div className="container-content">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow" style={{ color: LG_EMERALD }}>SERVICE PROVIDER MARKETPLACE</p>
            <h2 id="providers-heading" className="type-h2 mt-4 text-body">
              The partners who help you live it well.
            </h2>
            <p className="type-story mt-4 text-soft">
              Photographers, celebrants, printers and planners — a curated directory of providers to bring your milestones to life. List your service or find the right partner.
            </p>
            <Link
              to="/service-providers"
              className="btn mt-8 inline-flex min-h-12"
              style={{ backgroundColor: LG_EMERALD, color: '#ffffff', borderColor: LG_EMERALD }}
            >
              Explore Service Providers <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="flex flex-col gap-4 rounded-lg p-7"
              style={{ backgroundColor: '#ffffff', border: `1px solid ${LG_MINT}` }}
            >
              {[
                { Icon: Store, label: 'Featured providers, vetted for quality' },
                { Icon: Users, label: 'Trusted by Group Glens across the network' },
                { Icon: ShieldCheck, label: 'Secure, private, and always your call' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: LG_MINT, color: LG_EMERALD }}
                  >
                    <Icon size={18} aria-hidden />
                  </span>
                  <p className="text-sm text-body">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- LivingGlen §4 — Closing CTA ---------- */
function LivingGlenClosingCta() {
  return (
    <section className="section-pad" style={{ backgroundColor: '#042f25' }} aria-labelledby="lg-closing-heading">
      <div className="container-content flex flex-col items-center text-center">
        <Sparkles size={28} aria-hidden style={{ color: LG_MINT }} />
        <h2 id="lg-closing-heading" className="type-h2 mt-6 max-w-reading" style={{ color: '#ffffff' }}>
          Start authoring your story today.
        </h2>
        <p className="type-story mt-4" style={{ color: LG_MINT }}>
          Your living record — milestones, voices, and time capsules — begins in minutes.
        </p>
        <Link
          to="/plans"
          className="btn mt-8 inline-flex min-h-12"
          style={{ backgroundColor: LG_EMERALD, color: '#ffffff', borderColor: LG_EMERALD }}
        >
          Start Your Living Record
        </Link>
      </div>
    </section>
  );
}

/** Home — `/` (home.md). Parchment by day / Dusk after sunset; no provider rail.
 *
 * Domain-aware: on livingglen.com (isLivingGlen) the page renders the active
 * LivingGlen sections only — Group Glens, Time Capsules, Service Providers and
 * a living-record CTA. It never renders JohnDemo, the five-room memorial teaser,
 * the memorial feature grid, the stats band or the funeral/society partner
 * bands. memoryglen.com renders the original memorial home unchanged. */
export default function Home() {
  const { isLivingGlen } = useWhiteLabel();

  if (isLivingGlen) {
    return (
      <>
        <Hero />
        <GroupGlensShowcase />
        <TimeCapsules />
        <ServiceProviderPreview />
        <LivingGlenClosingCta />
      </>
    );
  }

  return (
    <>
      <Hero />
      {/* Explain the product before showing it off: three steps, then the one
          piece of jargon the whole site depends on. */}
      <HowItWorks />
      <FamilyGlenExplainer />
      <JohnDemo />
      <FiveTabs />
      <FeatureGrid />
      <HomeStats />
      <PartnerBands />
      <ClosingCta />
    </>
  );
}
