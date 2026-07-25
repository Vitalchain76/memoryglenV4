import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Flame,
  Images,
  Mic,
  Music,
  QrCode,
  ShieldCheck,
  Video,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import StatBand from '@/components/StatBand';
import CandleFlame from '@/components/CandleFlame';
import Hero from '@/pages/home/Hero';
import JohnDemo from '@/pages/home/JohnDemo';
import HowItWorks from '@/pages/home/HowItWorks';

/* ---------- Section 2 — Founding Memorial ---------- */
function FoundingMemorial() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ['start end', 'end start'] });
  // Parallax: portrait scrolls at 0.96× (subtle 20px offset total)
  const y = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <section className="section-pad" aria-labelledby="founding-heading">
      <div className="container-content grid items-center gap-12 lg:grid-cols-[55fr_45fr]">
        {/* Portrait in parchment-matted frame */}
        <Reveal as="figure">
          <div ref={portraitRef} className="relative bg-[#FBF8F1] p-6 shadow-raised">
            {/* Brass inner rule — draws on entry */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="absolute inset-3 origin-left border border-brass"
              aria-hidden
            />
            <motion.img
              src="/virginia-portrait.jpg"
              alt="Portrait placeholder of Virginia Dadirayi Chiimba, an elderly Zimbabwean mother in a headscarf"
              style={{ y }}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <figcaption className="type-meta mt-4 text-soft">
            Seke, Chitungwiza · 7 June 1955 — 19 May 2025
          </figcaption>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal>
            <p className="eyebrow">OUR FOUNDING MEMORIAL</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="founding-heading" className="type-h2 mt-4 text-body">
              Virginia Dadirayi Chiimba
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="type-quote mt-5 text-body">
              “A loving, caring, strong, and deeply faithful mother. The heart of our family.”
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="type-story mt-5 max-w-xl text-soft">
              MemoryGlen began with one family's love. This platform was built to honour our
              founder's mother — her voice notes, her hymns, her photographs, her resting place in
              Seke, Zinganga. Everything we build for your family, we first built for ours.
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <StatBand
              className="mt-8"
              stats={[
                { value: '12', label: 'Candles' },
                { value: '2', label: 'Tributes' },
                { value: '13', label: 'Media' },
                { value: '25', label: 'Family' },
              ]}
            />
          </Reveal>
          <Reveal delay={0.4}>
            <Link to="/memorials/virginia-dadirayi-chiimba" className="link-arrow mt-8 inline-flex">
              Visit Her Memorial <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 5 — Feature grid ---------- */
const FEATURES = [
  { Icon: Images, title: 'Photo & Video Gallery', body: 'Every photograph, every clip — kept in one permanent, beautiful place.' },
  { Icon: Mic, title: 'Voice Notes', body: 'Her voice, wishing you a happy new year — forever.' },
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
    img: '/john-life-6.jpg',
    href: '/memorials/john-peters?tab=journey',
  },
  {
    title: 'The Memorial',
    line: 'Story, gallery, voice, song, candles.',
    img: '/john-life-2.jpg',
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
        <StatBand
          onDark
          className="justify-between"
          stats={[
            { value: '500+', label: 'Families Served' },
            { value: '200+', label: 'Livestreams' },
            { value: '1K+', label: 'QR Codes' },
            { value: '50+', label: 'Partner Parlours' },
          ]}
        />
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

/** Home — `/` (home.md). Parchment by day / Dusk after sunset; no provider rail. */
export default function Home() {
  return (
    <>
      <Hero />
      <FoundingMemorial />
      <JohnDemo />
      <HowItWorks />
      <FeatureGrid />
      <FiveTabs />
      <HomeStats />
      <PartnerBands />
      <ClosingCta />
    </>
  );
}
