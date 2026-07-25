import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Check, ArrowRight, Mail } from 'lucide-react';
import Reveal from '@/components/Reveal';
import ServiceProviderRail from '@/components/ServiceProviderRail';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Florist',
  'Caterer',
  'Tombstone Maker',
  'Transport',
  'Photographer',
  'Livestream Services',
  'Other',
];

const TIERS = [
  {
    name: 'Featured',
    price: 'from R750/month · per region',
    featured: true,
    features: [
      'Only 1 per page region',
      'Brass-framed card with your logo',
      'One-line description & contact link',
      'Top of the rail, every page in your region',
    ],
  },
  {
    name: 'Standard',
    price: 'from R350/month',
    featured: false,
    features: ['Card with name, category & one line', 'Contact link', 'Below the Featured placement'],
  },
  {
    name: 'Basic',
    price: 'from R150/month',
    featured: false,
    features: ['Text listing: name, category, phone', 'A quiet presence beside the memorials'],
  },
];

const DRAFT_KEY = 'mg-provider-enquiry';

interface Enquiry {
  business: string;
  category: string;
  region: string;
  contact: string;
}

const EMPTY_ENQUIRY: Enquiry = { business: '', category: CATEGORIES[0], region: '', contact: '' };

const inputClass =
  'mt-2 min-h-12 w-full rounded-sm border border-[color:var(--line)] bg-surface px-4 text-base text-body placeholder:text-soft';

export default function ServiceProviders() {
  const [enquiry, setEnquiry] = useState<Enquiry>(EMPTY_ENQUIRY);
  const [sent, setSent] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);

  // Restore autosaved draft
  useEffect(() => {
    try {
      const draft = window.localStorage.getItem(DRAFT_KEY);
      if (draft) setEnquiry({ ...EMPTY_ENQUIRY, ...(JSON.parse(draft) as Partial<Enquiry>) });
    } catch {
      /* storage unavailable */
    }
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  // Autosave draft (debounced)
  const update = (patch: Partial<Enquiry>) => {
    setEnquiry((prev) => {
      const next = { ...prev, ...patch };
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
          setSavedAt(new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }));
        } catch {
          /* storage unavailable */
        }
      }, 800);
      return next;
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Service listing enquiry — ${enquiry.business || 'New provider'}`);
    const body = encodeURIComponent(
      `Business name: ${enquiry.business}\nCategory: ${enquiry.category}\nRegion: ${enquiry.region}\nContact: ${enquiry.contact}\n`,
    );
    window.location.href = `mailto:admin@memoryglen.com?subject=${subject}&body=${body}`;
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
    setSent(true);
  };

  return (
    <div>
      {/* Header */}
      <section className="container-content section-pad pb-12 text-center">
        <Reveal>
          <p className="eyebrow eyebrow-centered">For Service Providers</p>
          <h1 className="type-h1 mt-6 text-body">Be there when a family needs you.</h1>
          <p className="type-story mx-auto mt-6 max-w-reading text-soft">
            Florists, caterers, tombstone makers, transporters, photographers and livestream
            services — listed quietly beside the memorials, labelled with dignity, never in the way.
          </p>
        </Reveal>
      </section>

      {/* Where listings appear */}
      <section className="container-content section-pad border-t border-[color:var(--line)]">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="eyebrow">Where you appear</p>
              <h2 className="type-h2 mt-4 text-body">A quiet rail, not a billboard.</h2>
              <p className="mt-6 max-w-reading text-base leading-relaxed text-soft">
                Your listing appears in the right-hand <strong className="font-medium text-body">Family Service
                Providers</strong> rail on memorial and directory pages — a 280px panel that sits
                beside the page on wide screens and folds into the page flow on smaller ones. This
                is a live example of the rail exactly as families see it.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="mt-8 space-y-3">
                {[
                  'Ads never appear on paid family pages, inside private glens, or on Living Legacy dashboards.',
                  'Never animated, never autoplay, never a popup.',
                  'Only categories relevant to the family are shown.',
                  'Every card carries a small "Paid listing" label — dignified transparency.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-base leading-relaxed text-soft">
                    <Check size={16} className="mt-1.5 flex-none text-brass" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="card-well p-6 lg:w-[320px]">
            <ServiceProviderRail />
          </Reveal>
        </div>
      </section>

      {/* Listing tiers */}
      <section className="container-content section-pad pt-0">
        <Reveal className="text-center">
          <p className="eyebrow eyebrow-centered">Listing tiers</p>
          <h2 className="type-h2 mt-4 text-body">Three ways to be listed.</h2>
          <p className="type-meta mt-4 text-soft">All prices indicative — final pricing to be confirmed.</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="h-full">
              <div className={cn('card-raised flex h-full flex-col p-8', t.featured && 'border border-brass')}>
                <h3 className="type-h3 text-body">{t.name}</h3>
                <p className="mt-4 font-display text-2xl leading-none text-body">{t.price}</p>
                <ul className="mt-6 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-soft">
                      <Check size={16} className="mt-1 flex-none text-brass" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <a href="#list-your-service" className={cn('btn mt-8 min-h-12 w-full', t.featured ? 'btn-evergreen' : 'btn-outline-evergreen')}>
                  Choose {t.name}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Transparency policy */}
      <section className="container-content section-pad pt-0">
        <Reveal>
          <div className="card-well mx-auto max-w-reading border-l-2 border-brass p-8">
            <h2 className="font-display text-xl text-body">Our "Paid listing" promise</h2>
            <p className="mt-4 text-base leading-relaxed text-soft">
              Every paid placement is labelled "Paid listing" in small, muted text — visible to
              every family, on every page. We never disguise advertising as a recommendation, we
              never sell a family's data, and a grieving family will never see an ad inside their
              private space.
            </p>
          </div>
        </Reveal>
      </section>

      {/* List your service — enquiry form */}
      <section id="list-your-service" className="container-content section-pad pt-0">
        <div className="mx-auto max-w-reading">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow-centered">List your service</p>
            <h2 className="type-h2 mt-4 text-body">Tell us about your work.</h2>
            <p className="mt-4 text-base leading-relaxed text-soft">
              A few details and we'll be in touch. Your draft saves automatically — come back
              anytime.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            {sent ? (
              <div className="card-raised p-10 text-center">
                <h3 className="type-h3 text-body">Thank you.</h3>
                <p className="mt-4 text-base leading-relaxed text-soft">
                  Your enquiry is on its way. If your mail app didn't open, write to us directly at{' '}
                  <a href="mailto:admin@memoryglen.com" className="link-arrow inline-flex">
                    admin@memoryglen.com
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="card-raised p-8 md:p-10">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sp-business" className="type-meta text-soft">
                      Business name
                    </label>
                    <input
                      id="sp-business"
                      required
                      value={enquiry.business}
                      onChange={(e) => update({ business: e.target.value })}
                      placeholder="e.g. Msasa Florists"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="sp-category" className="type-meta text-soft">
                      Category
                    </label>
                    <select
                      id="sp-category"
                      value={enquiry.category}
                      onChange={(e) => update({ category: e.target.value })}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sp-region" className="type-meta text-soft">
                      Region
                    </label>
                    <input
                      id="sp-region"
                      required
                      value={enquiry.region}
                      onChange={(e) => update({ region: e.target.value })}
                      placeholder="e.g. Harare, Johannesburg, Bulawayo"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="sp-contact" className="type-meta text-soft">
                      Email or phone
                    </label>
                    <input
                      id="sp-contact"
                      required
                      value={enquiry.contact}
                      onChange={(e) => update({ contact: e.target.value })}
                      placeholder="How do we reach you?"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button type="submit" className="btn btn-evergreen min-h-12 px-8">
                    Send enquiry
                    <ArrowRight size={16} aria-hidden />
                  </button>
                  {savedAt && (
                    <p className="type-meta text-soft" role="status">
                      Draft saved at {savedAt}
                    </p>
                  )}
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section className="container-content section-pad pt-0 text-center">
        <hr className="brass-rule mx-auto mb-16" />
        <Reveal>
          <h2 className="type-h3 text-body">Questions first? That's fine too.</h2>
          <a href="mailto:admin@memoryglen.com" className="btn btn-outline-evergreen mt-8 min-h-12 px-8">
            <Mail size={16} aria-hidden />
            admin@memoryglen.com
          </a>
        </Reveal>
      </section>
    </div>
  );
}
