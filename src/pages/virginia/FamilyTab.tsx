import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { CHILDREN, GRANDCHILDREN } from '@/pages/virginia/data';
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
