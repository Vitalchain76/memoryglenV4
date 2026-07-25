import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Check, EyeOff, Lock, Scale, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CandleFlame from '@/components/CandleFlame';

/* ================= Section 1 — Hero ================= */
function LegacyHero() {
  return (
    <section aria-labelledby="legacy-heading">
      <div className="relative overflow-hidden bg-gradient-to-b from-forest to-forest-deep">
        {/* Image — right-aligned, scrimmed */}
        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden>
          <img
            src="/living-legacy-hero.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/70 to-forest/20" />
        </div>
        <div className="container-content relative py-20 md:py-28">
          <Reveal>
            <p className="eyebrow !text-brass">LIVING LEGACY</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 id="legacy-heading" className="type-h1 mt-4 max-w-2xl text-bone">
              Decide how the world remembers you.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="type-story mt-6 max-w-xl text-bone/90">
              Create your memorial while you live — your story, your photos, your songs, your voice.
              It rests sealed and encrypted until the day your five trustees confirm your passing.
              Then it becomes exactly the image you wanted to project to the world.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/create" className="btn btn-evergreen min-h-12">
                Begin your Living Legacy
              </Link>
              <a
                href="#jp-trustees"
                className="inline-flex min-h-12 items-center px-2 font-medium text-bone transition-colors hover:text-brass-soft"
              >
                See how it works
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= Section 2 — Story cards ================= */

/** Sealed message card — play disabled behind a lock (draws on entry). */
function SealedMessageCard({
  title,
  meta,
  sealedNote,
}: {
  title: string;
  meta: string;
  sealedNote: string;
}) {
  return (
    <div className="card-well p-4">
      <div className="flex items-center gap-4">
        <span className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest-deep text-brass">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex"
          >
            <Lock size={18} aria-hidden />
          </motion.span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-body">{title}</p>
          <p className="type-meta mt-0.5 text-soft">{meta}</p>
        </div>
        <button
          type="button"
          disabled
          aria-label={`Sealed — ${title}`}
          className="flex h-12 w-12 flex-none cursor-not-allowed items-center justify-center rounded-full bg-sage/30 text-soft"
        >
          <Lock size={16} aria-hidden />
        </button>
      </div>
      <p className="mt-3 flex items-center gap-2 border-t border-[color:var(--line)] pt-3 text-xs font-medium text-soft">
        <Lock size={12} className="text-brass" aria-hidden />
        {sealedNote}
      </p>
    </div>
  );
}

const STORIES = [
  {
    title: 'The young mother.',
    body: "A mother with a diagnosis and young children records birthday messages for the years she may miss — “Happy eighteenth, my love” — sealed today, delivered on the day.",
    card: (
      <SealedMessageCard
        title="For Tariro's 18th birthday — sealed until 2038"
        meta="Voice note · 1:04 · sealed 12 June 2026"
        sealedNote="Sealed — releases to Tariro, 14 March 2038."
      />
    ),
  },
  {
    title: 'The father with months.',
    body: "A father records blessings for weddings he won't attend, advice for the first grandchild, and the family stories only he remembers. His children will hear his voice when they need it most.",
    card: (
      <SealedMessageCard
        title="Blessings for the weddings I won't attend"
        meta="Voice note · 2:31 · sealed"
        sealedNote="Sealed — releases on activation, one per wedding."
      />
    ),
  },
  {
    title: 'The careful planner.',
    body: 'Your funeral preferences, your favourite hymns, the photograph you actually like, the words you want said — settled calmly, shared with your funeral parlour partner, sparing your family a hundred hard guesses.',
    card: (
      <div className="card-well p-5">
        <p className="type-meta text-soft">FUNERAL PREFERENCES — SHARED WITH YOUR PARLOUR PARTNER</p>
        <ul className="mt-3 space-y-2">
          {['The hymns, in order', 'The photograph on the programme', 'The words to be said', 'The flowers — and the ones to avoid'].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-body">
              <Check size={14} className="flex-none text-brass" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

function StoryCards() {
  return (
    <section className="section-pad" aria-label="Why Living Legacy exists">
      <div className="space-y-16">
        {STORIES.map((s, i) => (
          <Reveal key={s.title}>
            <div
              className={`grid items-center gap-8 md:grid-cols-2 ${
                i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div>
                <h2 className="type-h3 text-body">{s.title}</h2>
                <p className="type-story mt-4 text-soft">{s.body}</p>
              </div>
              <div>{s.card}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= Section 3 — The Five Trustees ================= */

const TRUSTEES = [
  { name: 'Grace', relation: 'Spouse', x: 50, y: 8 },
  { name: 'David', relation: 'Son', x: 92, y: 34 },
  { name: 'Sarah', relation: 'Daughter', x: 78, y: 90 },
  { name: 'Michael', relation: 'Son', x: 22, y: 90 },
  { name: 'Mrs. T. Dube', relation: 'Family friend', x: 8, y: 34 },
];

const TRUSTEE_STEPS = [
  {
    title: 'You create, in private.',
    body: 'Build your memorial draft — bio, photos, voice notes, songs, last words. Only you can ever see it while you live. Not even your trustees.',
  },
  {
    title: 'You appoint five trustees.',
    body: 'Members of MemoryGlen who know you. They accept the role; they cannot view your content — they hold keys, not access.',
  },
  {
    title: 'Verification, when the time comes.',
    body: 'Trustees confirm the passing; a death certificate or obituary is verified by MemoryGlen. A 5-of-5 confirmation (or 3-of-5 with document verification) activates the profile.',
  },
  {
    title: 'Your memorial goes live — exactly as you designed it.',
    body: "Sealed messages begin their schedule. Your trustees' duty is done; your designated trustee becomes the memorial's guardian.",
  },
];

function Trustees() {
  return (
    <section id="jp-trustees" className="section-pad scroll-mt-36 border-t border-[color:var(--line)]" aria-labelledby="trustees-heading">
      <Reveal>
        <h2 id="trustees-heading" className="type-h2 mx-auto max-w-2xl text-center text-body">
          Sealed until five voices say it's time.
        </h2>
      </Reveal>

      {/* Diagram — vault ringed by five trustees */}
      <div className="relative mx-auto mt-12 h-[440px] max-w-2xl">
        {/* Connecting lines — path-draw on scroll (1s) */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {TRUSTEES.map((t, i) => (
            <motion.line
              key={t.name}
              x1={50}
              y1={50}
              x2={t.x}
              y2={t.y}
              stroke="#C4A24C"
              strokeWidth={0.35}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
            />
          ))}
        </svg>

        {/* Central sealed vault */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-forest-deep p-5 text-center shadow-raised"
        >
          <img src="/logo-mark.svg" alt="" className="pointer-events-none absolute inset-0 m-auto h-24 w-24 opacity-10" aria-hidden />
          <span className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-forest text-brass">
            <Lock size={16} aria-hidden />
          </span>
          <p className="relative mt-2 font-display text-sm text-bone">Your sealed vault</p>
          <p className="relative type-meta mt-1 text-sage">encrypted at rest</p>
        </motion.div>

        {/* Trustee chips — pop in 80ms apart */}
        {TRUSTEES.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.6 + i * 0.08 }}
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-evergreen font-display text-base text-bone ring-2 ring-brass/60">
                {t.name.charAt(0)}
              </span>
              <p className="mt-1.5 whitespace-nowrap rounded-sm bg-surface px-2 py-1 text-center text-xs shadow-raised">
                <span className="font-medium text-body">{t.name}</span>
                <span className="block text-[10px] text-soft">{t.relation}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Step cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {TRUSTEE_STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1}>
            <div className="card-raised h-full p-6">
              <p className="font-display text-3xl text-brass">{i + 1}</p>
              <h3 className="type-h3 mt-3 text-body">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= Section 4 — The Vault ================= */

const SCHEDULED = [
  { title: 'For Nyasha — wedding day blessing', note: 'Sealed · releases on wedding date' },
  { title: 'For my grandchildren — the story of Mutare', note: 'Sealed · releases on activation' },
  { title: 'For Grace — every anniversary', note: 'Sealed · recurring, 10 years' },
];

function Vault() {
  return (
    <section className="section-pad" aria-labelledby="vault-heading">
      <div className="rounded-sm bg-forest p-6 text-bone sm:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 id="vault-heading" className="type-h2 text-bone">
              The Living Vault.
            </h2>
            <p className="mt-5 leading-relaxed text-sage">
              Record voice notes, video, and letters. Attach each to a person and a date — a
              birthday, a wedding, a graduation, or simply “when I'm gone.” The panel shows
              countdowns only to you: <em className="text-bone">“Tariro's 18th — 4,312 days.”</em>{' '}
              Everything is encrypted at rest. MemoryGlen staff cannot read it. Trustees cannot read
              it. Only its release unlocks it.
            </p>
          </Reveal>
          <div className="rounded-sm bg-forest-deep p-5">
            <p className="eyebrow !text-sage">SCHEDULED MESSAGES</p>
            <ul className="mt-4 space-y-3">
              {SCHEDULED.map((m, i) => (
                <motion.li
                  key={m.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                  className="flex items-center gap-3 rounded-sm bg-forest-soft p-4"
                >
                  <motion.span
                    initial={{ rotate: 0 }}
                    whileInView={{ rotate: [0, -6, 5, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: 0.4 + i * 0.1 }}
                    className="flex-none text-brass"
                    aria-hidden
                  >
                    <Lock size={14} />
                  </motion.span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm italic text-bone">{m.title}</p>
                    <p className="type-meta mt-0.5 text-sage">{m.note}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Section 5 — Security & trust ================= */

const SECURITY_CARDS = [
  {
    icon: Lock,
    title: 'Encrypted at rest',
    body: 'Your vault and estate plan are encrypted. Only you hold the view key while you live.',
  },
  {
    icon: EyeOff,
    title: 'Trustees see nothing',
    body: 'Trustees confirm an event; they never preview content before activation. This is enforced by the system, not by policy.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified activation',
    body: 'Death verification via certificate or obituary, reviewed by a human. False activation is designed to be impossible.',
  },
  {
    icon: Scale,
    title: 'Yours, legally clear',
    body: 'Your Digital Will records wishes only — it is clearly labelled not a legal document. Your data is POPIA-compliant, family-controlled, deletable.',
  },
];

function SecurityWall() {
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-labelledby="security-heading">
      <Reveal>
        <h2 id="security-heading" className="type-h2 text-body">
          Security & trust.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {SECURITY_CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="card-raised h-full p-6">
              <c.icon size={20} className="text-brass" aria-hidden />
              <h3 className="type-h3 mt-4 text-body">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= Section 6 — What's included ================= */

const INCLUDED = [
  { title: 'Memorial Draft', note: 'bio, photos, songs, last words — activated on passing' },
  { title: '5-Trustee activation', note: 'with death verification' },
  { title: 'Message Scheduling', note: 'with countdowns — the Living Vault' },
  { title: 'Digital Will', note: 'wishes only, labelled non-legal' },
  { title: 'Funeral Preferences', note: 'shared with your parlour partner' },
  { title: 'Memory Requests', note: 'prompts you leave for loved ones — “Tell the story of how we met”' },
];

function WhatsIncluded() {
  return (
    <section className="section-pad" aria-labelledby="included-heading">
      <Reveal>
        <div className="card-well p-6 sm:p-10">
          <h2 id="included-heading" className="type-h3 text-body">
            What's included
          </h2>
          <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {INCLUDED.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <Check size={16} className="mt-1 flex-none text-brass" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-body">{f.title}</p>
                  <p className="type-meta text-soft">{f.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-[color:var(--line)] pt-4 text-sm text-soft">
            Living Legacy is available on the <strong className="font-medium text-body">Legacy</strong>{' '}
            plan (R299/month) and is included in the{' '}
            <strong className="font-medium text-body">Forever Glen</strong> one-time plan.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= Section 7 — Closing ================= */
function LegacyClosing() {
  return (
    <section className="section-pad text-center" aria-label="Begin your Living Legacy">
      <div className="mx-auto max-w-[640px]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-fit"
        >
          <CandleFlame size={32} />
        </motion.div>
        <hr className="brass-rule mx-auto mt-6" />
        <Reveal delay={0.1}>
          <h2 className="type-h2 mt-8 text-body">
            The greatest gift is a goodbye you had time to write.
          </h2>
          <p className="type-story mt-4 text-soft">
            Begin privately today. Change anything, anytime, forever.
          </p>
          <Link to="/create" className="btn btn-evergreen mt-8 min-h-12">
            Begin your Living Legacy
          </Link>
          <p className="mt-4 text-xs text-soft">
            Questions about trustees or security?{' '}
            <a href="mailto:admin@memoryglen.com" className="font-medium text-evergreen underline underline-offset-2">
              admin@memoryglen.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= Tab ================= */
export default function LegacyTab() {
  return (
    <div>
      <LegacyHero />
      <div className="container-content">
        <div className="mx-auto w-full max-w-[880px]">
          <StoryCards />
          <Trustees />
          <Vault />
          <SecurityWall />
          <WhatsIncluded />
          <LegacyClosing />
        </div>
      </div>
    </div>
  );
}
