import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { cn } from '@/lib/utils';
import {
  CHILDREN,
  GRANDCHILDREN,
  KINSHIP_NOTE,
  ORIGIN_FAMILY_COPY,
  PARENTS,
  SIBLINGS,
} from '@/pages/virginia/data';
import type { Parent, Sibling } from '@/pages/virginia/data';
import type { FamilyMember } from '@/pages/virginia/data';

function MemberCard({ member, index }: { member: FamilyMember; index: number }) {
  const initial = member.name.trim().charAt(0).toUpperCase();
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(index, 8) * 0.04 }}
      className="card-raised flex items-center gap-4 p-5"
    >
      <span
        aria-hidden
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest font-display text-lg text-brass-soft"
      >
        {initial}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-base text-body">{member.name}</p>
        <p className="type-meta mt-0.5 text-soft">
          {member.relation}
          {member.birthYear ? ` · b. ${member.birthYear}` : ''}
        </p>
      </div>
    </motion.li>
  );
}

function ParentCard({ parent, index }: { parent: Parent; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.06 }}
      className="card-raised flex items-center gap-4 p-5"
    >
      <span
        aria-hidden
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest font-display text-lg text-brass-soft"
      >
        {parent.name.trim().charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-base text-body">{parent.honorific}</p>
        <p className="type-meta mt-0.5 text-soft">
          {parent.name} <span aria-hidden>\u00b7</span> {parent.relation}
        </p>
        {/* Living \u2014 stated plainly so nothing here reads as a memorial */}
        <p className="type-meta mt-1 inline-flex items-center gap-1.5 text-evergreen">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-evergreen" />
          Living
        </p>
      </div>
    </motion.li>
  );
}

function SiblingRow({ sibling, index }: { sibling: Sibling; index: number }) {
  const years = sibling.birthYear
    ? sibling.deathYear
      ? `${sibling.birthYear}\u2013${sibling.deathYear}`
      : `b. ${sibling.birthYear}`
    : sibling.deathYear
      ? `d. ${sibling.deathYear}`
      : null;
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: Math.min(index, 9) * 0.04 }}
      className={cn(
        'flex items-center gap-4 border-b border-[color:var(--line)] py-3 last:border-b-0',
        sibling.isVirginia && 'rounded-sm border-b-0 bg-well px-4',
      )}
    >
      <span
        aria-hidden
        className="type-meta w-6 flex-none tabular-nums text-soft"
      >
        {sibling.order}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-display text-base text-body">
          {sibling.name}
          {sibling.isVirginia && (
            <span className="type-meta ml-2 not-italic text-brass">\u00b7 this memorial</span>
          )}
        </span>
        <span className="type-meta mt-0.5 block text-soft">
          {sibling.kinship ? `${sibling.kinship} \u00b7 ` : ''}
          {sibling.relation}
          {years ? ` \u00b7 ${years}` : ''}
          {/* No birth year supplied \u2014 say so rather than leave it ambiguous */}
          {!years && ' \u00b7 dates not yet recorded'}
        </span>
      </span>
    </motion.li>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mt-12 flex items-center gap-4 first:mt-0">
      <hr className="brass-rule-sm" aria-hidden />
      <h3 className="type-h3 text-body">{label}</h3>
    </div>
  );
}

/** TAB: Family (25) — 7 children + 18 grandchildren (virginia.md). */
export default function FamilyTab() {
  return (
    <div>
      <Reveal>
        <p className="eyebrow">The heart of our family</p>
        <h2 className="type-h2 mt-4 text-body">Her Family</h2>
        <p className="mt-3 max-w-reading leading-relaxed text-soft">
          Seven children and eighteen grandchildren — the family she raised, guided, and loved.
        </p>
      </Reveal>

      {/* The Mushore family — her parents and the ten children, Virginia first */}
      <SectionDivider label="Her Parents and Siblings" />
      <Reveal>
        <p className="mt-4 max-w-reading leading-relaxed text-soft">{ORIGIN_FAMILY_COPY}</p>
      </Reveal>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {PARENTS.map((m, i) => (
          <ParentCard key={m.name} parent={m} index={i} />
        ))}
      </ul>

      <Reveal delay={0.1}>
        <h4 className="type-h3 mt-10 text-body">The Ten Children</h4>
        <p className="type-meta mt-2 max-w-reading text-soft">{KINSHIP_NOTE}</p>
      </Reveal>
      <ul className="mt-4">
        {SIBLINGS.map((sib, i) => (
          <SiblingRow key={sib.name} sibling={sib} index={i} />
        ))}
      </ul>

      <SectionDivider label="Her Children" />
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHILDREN.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i} />
        ))}
      </ul>

      <SectionDivider label="Her Grandchildren" />
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GRANDCHILDREN.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i} />
        ))}
      </ul>
    </div>
  );
}
