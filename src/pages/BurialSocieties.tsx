import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Globe2, Landmark, PlayCircle, Route } from 'lucide-react';
import Reveal from '@/components/Reveal';
import NotificationCard from '@/components/NotificationCard';
import BrandReskinDemo from '@/pages/partners/BrandReskinDemo';
import type { BrandSkin } from '@/pages/partners/BrandReskinDemo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/* ------------------------------------------------------------------ */
/* Section 1 — hero headline word-rise (90ms stagger, per page doc)    */
/* ------------------------------------------------------------------ */

function WordRise({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '110%', opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </motion.h1>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — "R10–15" numeral count-up on first viewport entry       */
/* ------------------------------------------------------------------ */

function CountUpRange({ from, to, className }: { from: number; to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      R{Math.round(from * progress)}–{Math.round(to * progress)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — member benefits                                         */
/* ------------------------------------------------------------------ */

const TRACKER_STAGES = ['Hospital', 'Mortuary', 'Documents', 'Road', 'Border', 'Home'];

function BenefitCard({
  title,
  body,
  mock,
  delay,
}: {
  title: string;
  body: string;
  mock: ReactNode;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="card-raised h-full p-6 transition-transform duration-200 hover:-translate-y-0.5">
        <h3 className="type-h3 text-body">{title}</h3>
        <p className="mt-2 leading-relaxed text-soft">{body}</p>
        <div className="mt-5">{mock}</div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — branded society portal skins                            */
/* ------------------------------------------------------------------ */

const SOCIETY_SKINS: BrandSkin[] = [
  {
    id: 'harare-home',
    name: 'Harare Home Burial Society (demo)',
    domain: 'hub.hararehome.org.zw',
    initials: 'HH',
    colors: { deep: '#241320', primary: '#6E3B56', surface: '#F4EDE7', text: '#2A1E24' },
  },
  {
    id: 'ubuhle',
    name: 'Ubuhle Stokvel (demo)',
    domain: 'portal.ubuhlestokvel.co.za',
    initials: 'US',
    colors: { deep: '#10202A', primary: '#2F5D6E', surface: '#EDF1F0', text: '#1B2429' },
  },
  {
    id: 'memoryglen',
    name: 'MemoryGlen default',
    domain: 'memoryglen.com/hub',
    initials: 'MG',
    colors: { deep: '#0E211D', primary: '#2E5945', surface: '#F6F1E7', text: '#1C1C1A' },
  },
];

/* ------------------------------------------------------------------ */
/* Section 5 — objections                                              */
/* ------------------------------------------------------------------ */

const OBJECTIONS = [
  {
    q: 'Can we afford it?',
    a: 'At R10–15 per member per month — under 50c per day per member — it sits as a line item inside the subscriptions your members already pay. A 500-member society: R5,000–R7,500 per month, member-funded.',
  },
  {
    q: 'We\u2019re not technical',
    a: 'As simple as WhatsApp. We handle setup and training.',
  },
  {
    q: 'Our elders won\u2019t use it',
    a: 'If a member can open WhatsApp, they can open the family hub. Large text, three taps to light a candle, and our team trains your committee — in person or over a call.',
  },
  {
    q: 'We already have WhatsApp',
    a: 'WhatsApp is chaos at 3AM. MemoryGlen gives structure, tracking, and live streaming.',
  },
  {
    q: 'What about our data?',
    a: 'SA-owned, POPIA compliant, encrypted, family-controlled. NDA available. Private by default — the family controls every memorial.',
  },
];

/* ------------------------------------------------------------------ */

export default function BurialSocieties() {
  return (
    <div className="bg-bg">
      {/* ================= Section 1 — Hero ================= */}
      <section className="relative flex min-h-[80dvh] items-end overflow-hidden bg-forest-deep">
        <motion.img
          src="/society-hero.jpg"
          alt=""
          aria-hidden
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/70 to-forest-deep/30"
          aria-hidden
        />
        <div className="container-content relative pb-16 pt-32 md:pb-24">
          <p className="eyebrow" style={{ color: 'var(--brass)' }}>
            For Burial Societies & Stokvels
          </p>
          <WordRise
            text="No more 3AM WhatsApp chaos."
            className="type-h1 mt-4 max-w-3xl text-bone"
          />
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
            className="mt-6 max-w-reading type-story text-sage"
          >
            When a member passes, your society&rsquo;s private family hub activates instantly — the
            journey tracker, the support fund, the livestream for diaspora relatives, and a
            permanent resting place online. Under your society&rsquo;s own brand.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <a href="#design-partner" className="btn btn-evergreen">
              Become a design partner
            </a>
            <Link
              to="/memorials/john-peters?tab=journey"
              className="inline-flex min-h-12 items-center gap-1.5 font-medium text-bone hover:text-brass-soft"
            >
              See a member&rsquo;s journey
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= Section 2 — The moment of need =================
          Pins for 120vh on desktop (sticky inner panel) while the three
          statement blocks fade in 400ms apart. */}
      <section className="relative bg-forest md:h-[120vh]">
        <div className="flex min-h-[70dvh] items-center md:sticky md:top-0 md:h-[100dvh]">
          <div className="container-content py-16 md:py-0">
            <Reveal>
              <p className="mx-auto max-w-reading text-center font-display text-[1.75rem] leading-[1.5] text-bone">
                When a Zimbabwean breadwinner dies in Johannesburg, the family&rsquo;s grief is
                immediately buried under logistics:
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="mx-auto mt-6 max-w-reading text-center font-display text-[1.75rem] leading-[1.5] text-bone">
                twelve documents, a consulate queue, a road journey through the border — and a
                family scattered across London, Toronto and Harare coordinating it all by 3AM phone
                calls.
              </p>
            </Reveal>
            <Reveal delay={0.8}>
              <hr className="brass-rule mx-auto mt-10" />
              <p className="mt-6 text-center font-medium text-brass">
                Your members live this. MemoryGlen owns the family&rsquo;s experience between the
                claim and the grave.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= Section 3 — What your members get ================= */}
      <section className="container-content section-pad">
        <Reveal>
          <p className="eyebrow">What your members get</p>
          <h2 className="type-h2 mt-4 text-body">On a death, everything is already in place.</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <BenefitCard
            delay={0}
            title="Instant private hub"
            body="A claim or report activates the family’s hub in minutes, co-branded with your society’s name and colours. Invite links reach Harare, London, and Toronto before breakfast."
            mock={
              <NotificationCard
                headline="The Moyo family hub is ready"
                detail="Invite links sent to 14 family members in 3 countries."
                timestamp="03:15"
              />
            }
          />
          <BenefitCard
            delay={0.08}
            title="Repatriation tracker"
            body="Hospital → mortuary → documents → road → border → home. Every family member sees the same truth across timezones. ‘John has crossed the border. He is home.’"
            mock={
              <div className="card-well p-4">
                <div className="flex items-center gap-2 text-soft">
                  <Route className="h-4 w-4 flex-none text-evergreen" aria-hidden />
                  <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium">
                    {TRACKER_STAGES.map((stage, i) => (
                      <li key={stage} className="flex items-center gap-2">
                        <span
                          className={
                            stage === 'Border'
                              ? 'rounded-full bg-evergreen px-2 py-0.5 text-bone'
                              : undefined
                          }
                        >
                          {stage}
                        </span>
                        {i < TRACKER_STAGES.length - 1 && <span aria-hidden>→</span>}
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="mt-3 border-l-2 border-brass pl-3 font-display italic text-body">
                  &ldquo;John has crossed the border. He is home.&rdquo;
                </p>
              </div>
            }
          />
          <BenefitCard
            delay={0.16}
            title="Support fund"
            body="Multi-currency contributions with a transparent ledger every member can see. Every rand accounted for."
            mock={
              <div className="card-well divide-y divide-[color:var(--line)] p-4 text-sm">
                <div className="flex items-center justify-between py-2">
                  <span className="text-body">T. Ncube — Johannesburg</span>
                  <span className="type-meta text-evergreen">R500 received</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-body">L. Peters — London</span>
                  <span className="type-meta text-evergreen">$50 received</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-body">Church group — Harare</span>
                  <span className="type-meta text-evergreen">ZWL 84,000 received</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="flex items-center gap-2 font-medium text-body">
                    <Landmark className="h-4 w-4 text-brass" aria-hidden />
                    Fund balance
                  </span>
                  <span className="type-meta text-body">R12,450</span>
                </div>
              </div>
            }
          />
          <BenefitCard
            delay={0.24}
            title="Livestream + permanent glen"
            body="Diaspora relatives attend from anywhere; the recording stays forever; the member’s resting place joins your society’s community glen."
            mock={
              <div className="card-well space-y-3 p-4 text-sm">
                <p className="flex items-center gap-2 text-body">
                  <PlayCircle className="h-4 w-4 text-evergreen" aria-hidden />
                  Graveside service — 214 watching from 6 countries
                </p>
                <p className="flex items-center gap-2 text-body">
                  <Check className="h-4 w-4 text-evergreen" aria-hidden />
                  Recording stays in the family hub forever.
                </p>
                <p className="flex items-center gap-2 text-body">
                  <Globe2 className="h-4 w-4 text-evergreen" aria-hidden />
                  Resting place added to your society&rsquo;s community glen
                </p>
              </div>
            }
          />
        </div>
      </section>

      {/* ================= Section 4 — Branded society portals ================= */}
      <section className="bg-well">
        <div className="container-content section-pad grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Branded society portals</p>
            <h2 className="type-h2 mt-4 text-body">
              Your society. Your brand. Powered by MemoryGlen.
            </h2>
            <p className="mt-4 type-story text-soft">
              Like our parlour partners, societies get their own branded portal — logo, colours,
              member list, and community glen. Communities beyond societies — churches, old-school
              networks, workplace groups — can carry their brand too. The portal runs while your
              partnership is active: if we&rsquo;re cut off, the white label sleeps.
            </p>
            <p className="mt-6 flex items-start gap-2 text-body">
              <Check className="mt-1 h-5 w-5 flex-none text-evergreen" aria-hidden />
              Every member memorial links back to your society.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <BrandReskinDemo
              skins={SOCIETY_SKINS}
              label="See the same portal in three brands"
              caption="Same engine. Your identity."
            />
          </Reveal>
        </div>
      </section>

      {/* ================= Section 5 — Pricing ================= */}
      <section className="container-content section-pad">
        <Reveal>
          <div className="card-well mx-auto max-w-reading p-8 text-center md:p-12">
            <p className="eyebrow eyebrow-centered">Transparent &amp; simple</p>
            <p className="type-stat mt-6 text-[clamp(2rem,5vw,3rem)] text-body">
              <CountUpRange from={10} to={15} />
              <span className="font-sans text-base font-normal text-soft">
                {' '}
                per member per month.
              </span>
            </p>
            <p className="mx-auto mt-4 max-w-md type-story text-soft">
              A line item inside your existing subscriptions — under 50c per day per member. A
              500-member society: R5,000–R7,500 per month, member-funded.
            </p>
            <p className="mt-4 text-sm text-soft">
              MemoryGlen is a payment facilitator; we never hold your society&rsquo;s pooled funds.
            </p>

            <div className="mt-8 text-left">
              <Accordion type="single" collapsible className="w-full">
                {OBJECTIONS.map((item, i) => (
                  <AccordionItem key={item.q} value={`objection-${i}`}>
                    <AccordionTrigger className="min-h-12 text-left font-medium text-body">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-soft">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= Section 6 — Design-partner offer =================
          Brass frame rules draw 0→100% (600ms) on entry, then content fades. */}
      <section id="design-partner" className="container-content pb-16 md:pb-24">
        <div className="relative mx-auto max-w-reading">
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute left-0 top-0 h-px w-full origin-left bg-brass"
          />
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 h-px w-full origin-right bg-brass"
          />
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-brass"
          />
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute right-0 top-0 h-full w-px origin-bottom bg-brass"
          />
          <Reveal delay={0.6} className="px-6 py-12 text-center md:px-12">
            <h2 className="type-h2 text-body">
              The first three societies partner free for six months.
            </h2>
            <p className="mx-auto mt-4 max-w-md type-story text-soft">
              Be a design partner: weekly feedback sessions, your society&rsquo;s name in our
              founding case studies, and the Heritage Plan free for 6 months. After that, standard
              per-member pricing — cancel anytime.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <a
                href="mailto:admin@memoryglen.com?subject=Design%20partner%20application%20—%20Burial%20society"
                className="btn btn-evergreen"
              >
                Apply as a design partner
              </a>
              <p className="text-sm text-soft">
                or write to{' '}
                <a
                  href="mailto:admin@memoryglen.com"
                  className="font-medium text-evergreen hover:text-evergreen-bright"
                >
                  admin@memoryglen.com
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Section 7 — Closing ================= */}
      <section className="bg-forest">
        <div className="container-content section-pad text-center">
          <Reveal>
            <h3 className="type-h3 mx-auto max-w-2xl text-bone">
              Families will always bring their people home. The only question is whether it happens
              in 3AM chaos — or calmly, under your society&rsquo;s care.
            </h3>
            <a
              href="mailto:admin@memoryglen.com?subject=Burial%20society%20—%20start%20the%20conversation"
              className="btn btn-evergreen mt-8"
            >
              Start the conversation
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
