import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Globe, Lock, Users, ImagePlus, X } from 'lucide-react';
import { CandleFlame } from '@/components/CandleFlame';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Draft model                                                          */
/* ------------------------------------------------------------------ */

const DRAFT_KEY = 'mg-create-draft';

interface Draft {
  step: number;
  firstName: string;
  middleNames: string;
  lastName: string;
  birthDate: string;
  passingDate: string;
  birthPlace: string;
  restingPlace: string;
  photoDataUrl: string | null;
  story: string;
  addVoiceNote: boolean;
  addPlaylist: boolean;
  addPhotos: boolean;
  privacy: 'public' | 'family' | 'inner-circle';
  listed: boolean;
  inviteEmail: string;
}

const EMPTY_DRAFT: Draft = {
  step: 0,
  firstName: '',
  middleNames: '',
  lastName: '',
  birthDate: '',
  passingDate: '',
  birthPlace: '',
  restingPlace: '',
  photoDataUrl: null,
  story: '',
  addVoiceNote: false,
  addPlaylist: false,
  addPhotos: false,
  privacy: 'public',
  listed: true,
  inviteEmail: '',
};

function loadDraft(): Draft {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (raw) return { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<Draft>) };
  } catch {
    /* storage unavailable */
  }
  return EMPTY_DRAFT;
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                                */
/* ------------------------------------------------------------------ */

const fieldClass =
  'mt-2 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-base text-body placeholder:text-soft';

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-meta text-soft">
        {label} {optional && <span className="font-normal">(optional — you can add this later)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-sm text-ember">
          {error}
        </p>
      )}
    </div>
  );
}

/** Forgiving date check: empty is fine; anything unparseable gets a plain-language hint. */
function dateError(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const parsed = new Date(v);
  // Accept "7 June 1955", "07/06/1955", ISO etc. Reject obvious non-dates.
  if (Number.isNaN(parsed.getTime()) && !/\d{4}/.test(v)) {
    return "We couldn't read that date — try 7 June 1955";
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* The wizard                                                           */
/* ------------------------------------------------------------------ */

const PROMPT_CHIPS = ['They were born in…', 'What they taught us…', "The thing we'll miss most…"];

export default function Create() {
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const [step, setStep] = useState(draft.step);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [candleLit, setCandleLit] = useState(false);
  const [ritual, setRitual] = useState(false);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const storyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<number | null>(null);

  const update = (patch: Partial<Draft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
          setSavedAt(new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }));
        } catch {
          /* storage unavailable */
        }
      }, 2000);
      return next;
    });
  };

  // Save the step itself immediately so back/exit never loses the place.
  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, step }));
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(
    () => () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    },
    [],
  );

  const fullName = [draft.firstName, draft.middleNames, draft.lastName].filter(Boolean).join(' ');
  const canContinueName = draft.firstName.trim().length > 0 && draft.lastName.trim().length > 0;
  const birthErr = dateError(draft.birthDate);
  const passingErr = dateError(draft.passingDate);

  const goTo = (next: number) => {
    update({ step: next });
    setStep(next);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const onPhoto = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => update({ photoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    onPhoto(e.dataTransfer.files?.[0]);
  };

  const insertChip = (chip: string) => {
    const el = storyRef.current;
    if (!el) {
      update({ story: draft.story + (draft.story ? '\n' : '') + chip + ' ' });
      return;
    }
    const start = el.selectionStart ?? draft.story.length;
    const end = el.selectionEnd ?? start;
    const next = draft.story.slice(0, start) + chip + ' ' + draft.story.slice(end);
    update({ story: next });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + chip.length + 1, start + chip.length + 1);
    });
  };

  const lightFirstCandle = () => {
    setRitual(true);
    window.setTimeout(
      () => {
        setRitual(false);
        setCandleLit(true);
      },
      reduceMotion ? 100 : 2000,
    );
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: 'easeOut' as const };

  const privacyCards = [
    {
      id: 'public' as const,
      icon: Globe,
      title: 'Public',
      body: 'Anyone may visit and light a candle.',
    },
    {
      id: 'family' as const,
      icon: Users,
      title: 'Family',
      body: 'Only people you invite.',
    },
    {
      id: 'inner-circle' as const,
      icon: Lock,
      title: 'Inner Circle',
      body: 'Only closest family.',
    },
  ];

  return (
    <div className="container-content section-pad">
      <div className="mx-auto max-w-[640px]">
        {/* Reduced chrome row: progress spine + save & exit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3" aria-label={`Step ${Math.min(step, 4)} of 4`}>
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                aria-hidden
                className={cn(
                  'h-2 w-2 rounded-full transition-colors duration-300',
                  step >= n ? 'bg-brass' : 'bg-[color:var(--line)]',
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            {savedAt && (
              <p className="type-meta hidden text-soft sm:block" role="status">
                Saved {savedAt}
              </p>
            )}
            <Link to="/" className="min-h-12 px-2 py-3 text-sm font-medium text-soft transition-colors hover:text-body">
              Save &amp; exit
            </Link>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="mt-12"
          >
            {/* ---------------- Step 0 — Welcome ---------------- */}
            {step === 0 && (
              <div className="text-center">
                <h1 className="type-h1 text-body">Let's begin, gently.</h1>
                <p className="type-story mx-auto mt-6 max-w-md text-soft">
                  This takes about ten minutes. You can stop anytime — everything saves
                  automatically.
                </p>
                <button type="button" onClick={() => goTo(1)} className="btn btn-evergreen mt-10 min-h-12 px-10">
                  Begin
                </button>
                <p className="mt-8">
                  <Link
                    to="/memorials/john-peters?tab=legacy"
                    className="link-arrow inline-flex min-h-12 items-center text-sm"
                  >
                    I'm creating a Living Legacy for myself
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </p>
              </div>
            )}

            {/* ---------------- Step 1 — Their name ---------------- */}
            {step === 1 && (
              <div>
                <h1 className="type-h2 text-body">Who would you like to remember?</h1>
                <p className="mt-3 text-base text-soft">The name they were known by is perfect.</p>
                <div className="mt-8 space-y-6">
                  <Field id="cm-first" label="First name">
                    <input
                      id="cm-first"
                      value={draft.firstName}
                      onChange={(e) => update({ firstName: e.target.value })}
                      autoComplete="off"
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="cm-middle" label="Middle name(s)" optional>
                    <input
                      id="cm-middle"
                      value={draft.middleNames}
                      onChange={(e) => update({ middleNames: e.target.value })}
                      autoComplete="off"
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="cm-last" label="Last name">
                    <input
                      id="cm-last"
                      value={draft.lastName}
                      onChange={(e) => update({ lastName: e.target.value })}
                      autoComplete="off"
                      className={fieldClass}
                    />
                  </Field>
                </div>
                <p className="type-meta mt-6 text-soft">
                  If a memorial for this person already exists, we'll help you link it instead of
                  duplicating.
                </p>
                <WizardNav
                  onBack={() => goTo(0)}
                  onNext={() => canContinueName && goTo(2)}
                  nextDisabled={!canContinueName}
                />
              </div>
            )}

            {/* ---------------- Step 2 — Dates, place & photo ---------------- */}
            {step === 2 && (
              <div>
                <h1 className="type-h2 text-body">Their life, in dates and places.</h1>
                <div className="mt-8 space-y-6">
                  <Field id="cm-birth" label="Birth date" error={birthErr}>
                    <input
                      id="cm-birth"
                      value={draft.birthDate}
                      onChange={(e) => update({ birthDate: e.target.value })}
                      placeholder="e.g. 7 June 1955"
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="cm-passing" label="Passing date" error={passingErr}>
                    <input
                      id="cm-passing"
                      value={draft.passingDate}
                      onChange={(e) => update({ passingDate: e.target.value })}
                      placeholder="e.g. 12 March 2026"
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="cm-birthplace" label="Place of birth">
                    <input
                      id="cm-birthplace"
                      value={draft.birthPlace}
                      onChange={(e) => update({ birthPlace: e.target.value })}
                      placeholder="e.g. Seke, Chitungwiza"
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="cm-resting" label="Final resting place" optional>
                    <input
                      id="cm-resting"
                      value={draft.restingPlace}
                      onChange={(e) => update({ restingPlace: e.target.value })}
                      placeholder="You can add this later"
                      className={fieldClass}
                    />
                  </Field>

                  {/* Photo — framed preview in the parchment mat */}
                  <div>
                    <span className="type-meta text-soft">A photograph for their page</span>
                    {draft.photoDataUrl ? (
                      <div className="mt-3 flex items-start gap-4">
                        <div className="card-well p-3">
                          <img
                            src={draft.photoDataUrl}
                            alt={fullName ? `Photograph of ${fullName}` : 'Their photograph'}
                            className="h-48 w-36 rounded-sm bg-surface object-cover p-1"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => update({ photoDataUrl: null })}
                          className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-medium text-soft transition-colors hover:text-body"
                        >
                          <X size={14} aria-hidden /> Remove photo
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        onDrop={onDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="card-well mt-3 flex min-h-40 w-full flex-col items-center justify-center gap-3 border border-dashed border-[color:var(--line)] p-8 text-center transition-colors hover:border-brass"
                      >
                        <ImagePlus size={24} className="text-brass" aria-hidden />
                        <span className="text-sm text-soft">
                          Drop a photo here, or <span className="font-medium text-evergreen">choose one</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-soft">
                          <Camera size={12} aria-hidden /> Your phone's camera works too
                        </span>
                      </button>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onPhoto(e.target.files?.[0])}
                      aria-label="Upload a photograph"
                    />
                  </div>
                </div>
                <WizardNav onBack={() => goTo(1)} onNext={() => goTo(3)} />
              </div>
            )}

            {/* ---------------- Step 3 — Their story ---------------- */}
            {step === 3 && (
              <div>
                <h1 className="type-h2 text-body">Tell us about them — anything at all.</h1>
                <p className="mt-3 text-base text-soft">A sentence is enough to start.</p>
                <textarea
                  ref={storyRef}
                  value={draft.story}
                  onChange={(e) => update({ story: e.target.value })}
                  rows={8}
                  aria-label="Their story"
                  placeholder="Begin wherever feels right…"
                  className="mt-8 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 py-4 text-lg leading-[1.7] text-body placeholder:text-soft"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {PROMPT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => insertChip(chip)}
                      className="min-h-12 rounded-full border border-[color:var(--line)] bg-surface px-4 text-sm text-soft transition-colors hover:border-brass hover:text-body"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <fieldset className="mt-10">
                  <legend className="type-meta text-soft">Would you like to add any of these now?</legend>
                  <div className="mt-3 space-y-2">
                    {(
                      [
                        ['addVoiceNote', 'Voice note', 'Record or upload them speaking, singing, laughing.'],
                        ['addPlaylist', 'Song playlist', 'Spotify or YouTube link, or upload — every memorial has one.'],
                        ['addPhotos', 'Photos', 'More photographs for their gallery.'],
                      ] as const
                    ).map(([key, title, hint]) => (
                      <label
                        key={key}
                        className="card-well flex min-h-12 cursor-pointer items-center gap-4 px-4 py-3"
                      >
                        <input
                          type="checkbox"
                          checked={draft[key]}
                          onChange={(e) => update({ [key]: e.target.checked } as Partial<Draft>)}
                          className="h-5 w-5 accent-evergreen"
                        />
                        <span>
                          <span className="block text-base font-medium text-body">{title}</span>
                          <span className="block text-sm text-soft">{hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="type-meta mt-3 text-soft">Anything you skip can be added later.</p>
                </fieldset>
                <WizardNav onBack={() => goTo(2)} onNext={() => goTo(4)} />
              </div>
            )}

            {/* ---------------- Step 4 — Privacy & family ---------------- */}
            {step === 4 && (
              <div>
                <h1 className="type-h2 text-body">Who may visit?</h1>
                <div className="mt-8 space-y-3" role="radiogroup" aria-label="Privacy">
                  {privacyCards.map((card) => {
                    const Icon = card.icon;
                    const active = draft.privacy === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => update({ privacy: card.id, listed: card.id === 'public' })}
                        className={cn(
                          'flex min-h-12 w-full items-center gap-4 rounded-sm border p-4 text-left transition-colors',
                          active
                            ? 'border-brass bg-surface'
                            : 'border-[color:var(--line)] bg-surface hover:border-sage',
                        )}
                      >
                        <Icon size={20} className={active ? 'text-brass' : 'text-soft'} aria-hidden />
                        <span>
                          <span className="block font-display text-lg text-body">{card.title}</span>
                          <span className="block text-sm text-soft">{card.body}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <label className="mt-6 flex min-h-12 cursor-pointer items-center gap-4">
                  <input
                    type="checkbox"
                    checked={draft.listed}
                    onChange={(e) => update({ listed: e.target.checked })}
                    className="h-5 w-5 accent-evergreen"
                  />
                  <span className="text-base text-body">List in search engines</span>
                </label>

                <div className="mt-8">
                  <Field id="cm-invite" label="Invite family" optional>
                    <input
                      id="cm-invite"
                      type="email"
                      value={draft.inviteEmail}
                      onChange={(e) => update({ inviteEmail: e.target.value })}
                      placeholder="An email address — or skip for now"
                      className={fieldClass}
                    />
                  </Field>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={!draft.inviteEmail.trim()}
                      className="btn btn-outline-evergreen min-h-12 px-5 text-sm disabled:cursor-default disabled:opacity-50"
                    >
                      Send email invite
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `I'd like to invite you to ${fullName || 'our'} memorial on MemoryGlen.`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-evergreen min-h-12 px-5 text-sm"
                    >
                      Share on WhatsApp
                    </a>
                    <span className="inline-flex min-h-12 items-center text-sm font-medium text-soft">
                      You can skip for now
                    </span>
                  </div>
                </div>

                <div className="card-well mt-8 border-l-2 border-brass p-5">
                  <p className="text-sm leading-relaxed text-soft">
                    You'll be the guardian of this memorial. You approve every tribute before it
                    appears.
                  </p>
                </div>
                <WizardNav onBack={() => goTo(3)} onNext={() => goTo(5)} nextLabel="Finish" />
              </div>
            )}

            {/* ---------------- Step 5 — Done (the reveal) ---------------- */}
            {step === 5 && (
              <div className="text-center">
                {/* The hero assembles piece by piece — 1.2s total */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="card-raised mx-auto max-w-md p-8"
                >
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.2 }}
                    className="card-well mx-auto w-fit p-3"
                  >
                    {draft.photoDataUrl ? (
                      <img
                        src={draft.photoDataUrl}
                        alt={fullName ? `Photograph of ${fullName}` : 'Their photograph'}
                        className="h-52 w-40 rounded-sm bg-surface object-cover p-1"
                      />
                    ) : (
                      <div className="flex h-52 w-40 items-center justify-center rounded-sm bg-surface p-1">
                        <span className="font-display text-4xl text-brass">
                          {(draft.firstName[0] ?? '') + (draft.lastName[0] ?? '')}
                        </span>
                      </div>
                    )}
                  </motion.div>
                  <motion.h1
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.6 }}
                    className="type-h2 mt-6 text-body"
                  >
                    {fullName || 'Their name'}
                  </motion.h1>
                  {(draft.birthDate || draft.passingDate) && (
                    <motion.p
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.8 }}
                      className="type-meta mt-2 text-soft"
                    >
                      {draft.birthDate || '…'} — {draft.passingDate || '…'}
                    </motion.p>
                  )}
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : 1.0 }}
                    className="mt-6 flex justify-center"
                  >
                    <CandleFlame size={40} lit={candleLit} />
                  </motion.div>
                </motion.div>

                <p className="type-story mt-10 text-body">Their page is ready.</p>
                <div className="mt-6 flex flex-col items-center gap-3">
                  {!candleLit ? (
                    <button type="button" onClick={lightFirstCandle} className="btn btn-evergreen min-h-12 px-8">
                      <CandleFlame size={14} lit={false} />
                      Light the first candle
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/memorials')}
                      className="btn btn-evergreen min-h-12 px-8"
                    >
                      Visit their page
                      <ArrowRight size={16} aria-hidden />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => goTo(4)}
                    className="min-h-12 px-4 text-sm font-medium text-evergreen transition-colors hover:text-evergreen-bright"
                  >
                    Invite family
                  </button>
                  <Link
                    to="/memorials"
                    className="min-h-12 px-4 py-3 text-sm font-medium text-soft transition-colors hover:text-body"
                  >
                    Add more later
                  </Link>
                </div>
                <p className="type-meta mt-10 text-soft">This memorial stays forever. Free.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The first-candle ritual (design.md §5) */}
      <AnimatePresence>
        {ritual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-forest-deep/60"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ boxShadow: '0 0 80px 32px rgba(217,192,138,0.28)' }}
                className="rounded-full"
              >
                <CandleFlame size={56} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-6 font-display text-xl text-bone"
              >
                The first candle, for {fullName || 'them'}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WizardNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = 'Continue',
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-12 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-medium text-soft transition-colors hover:text-body"
      >
        <ArrowLeft size={16} aria-hidden /> Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="btn btn-evergreen min-h-12 px-8 disabled:cursor-default disabled:opacity-50"
      >
        {nextLabel}
        <ArrowRight size={16} aria-hidden />
      </button>
    </div>
  );
}
