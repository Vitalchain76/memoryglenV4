import { Link } from 'react-router';
import { Eye, Infinity as InfinityIcon, KeyRound } from 'lucide-react';
import Reveal from '@/components/Reveal';

/**
 * "Family Glen" is the one piece of MemoryGlen jargon a first-time visitor
 * cannot guess. It appears in the navigation, on every memorial and in the
 * three steps above, so it has to be explained in plain language before it is
 * used again — in one short paragraph, not a feature list.
 *
 * The trust note answers the three questions people actually ask about a
 * memorial: who can see it, who controls it, and whether it will still be here.
 */

const TRUST = [
  {
    Icon: Eye,
    title: 'Who can see it',
    body: 'You choose: open to everyone, visible to family only, or private to a few. Set per memorial, changeable at any time.',
  },
  {
    Icon: KeyRound,
    title: 'Who controls it',
    body: 'The family does. You decide who may add memories and who may edit. No one else can change what you have written.',
  },
  {
    Icon: InfinityIcon,
    title: 'How long it lasts',
    body: 'A memorial is built to outlive the people who made it. Your words, photographs and recordings stay put.',
  },
];

export default function FamilyGlenExplainer() {
  return (
    <section className="section-pad" aria-labelledby="what-is-a-glen">
      <div className="container-content">
        <div className="max-w-reading">
          <Reveal>
            <p className="eyebrow">In plain language</p>
            <h2 id="what-is-a-glen" className="type-h2 mt-4 text-body">
              What is a Family Glen?
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="type-story mt-5 text-body">
              A Family Glen is a shared digital space that connects related memorials &mdash; like a
              family plot that lives online. When someone belongs to more than one family line,
              they appear in each relevant Glen.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <Link to="/memorials/john-peters?tab=glen" className="link-arrow mt-5 inline-flex text-sm">
              See a Family Glen
            </Link>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {TRUST.map(({ Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={Math.min(i, 2) * 0.07}>
              <div className="card-well h-full p-6">
                <Icon size={20} className="text-brass" aria-hidden />
                <h3 className="mt-4 font-display text-lg text-body">{title}</h3>
                <p className="mt-2 leading-relaxed text-soft">{body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
