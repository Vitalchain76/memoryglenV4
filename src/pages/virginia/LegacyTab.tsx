import { Link } from 'react-router';
import { Check } from 'lucide-react';
import Reveal from '@/components/Reveal';

/**
 * TAB 5 — Living Legacy, family-facing.
 *
 * Virginia's memorial is a real memorial. The Living Legacy room on John
 * Peters' demonstration page is a product surface and carries pricing; that
 * has no place beside her grave.
 *
 * This version carries no prices, no plan names, no subscription language and
 * no upgrade prompts. It speaks to her family about what she left them and
 * what they can still add. Keep it that way.
 */

const WHAT_SHE_LEFT = [
  {
    title: 'Her voice',
    body: 'The recording of her wishing the family a happy new year — kept, and playable, for as long as this memorial stands.',
  },
  {
    title: 'Her words',
    body: 'The tributes her children wrote, the booklet the family printed, and the scripture and hymn she loved.',
  },
  {
    title: 'Her photographs',
    body: 'From a studio portrait taken as a young woman to the last years with her grandchildren.',
  },
  {
    title: 'Her people',
    body: 'Four generations named on one page — her parents, her nine brothers and sisters, her seven children and her eighteen grandchildren.',
  },
];

const STILL_TO_COME = [
  'Her early life and her working years',
  'Tributes from Eddie, Taka and Nyasha',
  'Photographs from the unveiling on 25 October',
  'The family\u2019s own captions for her photographs',
  'Her parents\u2019 and her siblings\u2019 own stories',
];

export default function LegacyTab() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section aria-labelledby="legacy-heading">
        <Reveal>
          <p className="eyebrow">Living Legacy</p>
          <h2 id="legacy-heading" className="type-h2 mt-4 text-body">
            What she left, and what we are still adding
          </h2>
          <p className="type-story mt-4 max-w-reading text-soft">
            A memorial is not finished on the day of the funeral. This page grows as the
            family remembers more, and as more of her is written down.
          </p>
        </Reveal>
      </section>

      <section aria-labelledby="legacy-kept">
        <Reveal>
          <h3 id="legacy-kept" className="type-h3 text-body">
            Kept here
          </h3>
        </Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {WHAT_SHE_LEFT.map((item, i) => (
            <Reveal as="li" key={item.title} delay={Math.min(i, 3) * 0.06}>
              <div className="card-raised h-full p-6">
                <p className="font-display text-lg text-body">{item.title}</p>
                <p className="mt-2 leading-relaxed text-soft">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="legacy-coming">
        <Reveal>
          <h3 id="legacy-coming" className="type-h3 text-body">
            Still to come
          </h3>
          <p className="mt-3 max-w-reading leading-relaxed text-soft">
            Written by the family, in the family&rsquo;s own words, as and when they are ready.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {STILL_TO_COME.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={16} className="mt-1 flex-none text-brass" aria-hidden />
                <span className="text-body">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Reveal as="section" aria-label="Add to her memorial">
        <div className="card-well p-6 text-center sm:p-10">
          <hr className="brass-rule mx-auto" aria-hidden />
          <p className="type-quote mt-8 text-body">
            If you remember something about her that is not here, it belongs here.
          </p>
          <Link
            to="/create"
            className="link-arrow mt-6 inline-flex text-sm"
          >
            Add a memory
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
