import { Link } from 'react-router';
import { Check } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { GUESTBOOK } from '@/pages/virginia/data';

/** TAB: Guestbook (2) — approved entries + sign-in gate (virginia.md). */
export default function GuestbookTab() {
  return (
    <div className="max-w-reading">
      <Reveal>
        <p className="eyebrow">Messages of remembrance</p>
        <h2 className="type-h2 mt-4 text-body">Guestbook</h2>
      </Reveal>

      <ul className="mt-8 space-y-6">
        {GUESTBOOK.map((entry, i) => (
          <Reveal as="li" key={entry.title} delay={i * 0.08}>
            <article className="card-raised p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-display text-lg text-body">{entry.title}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sage px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage">
                  <Check size={12} aria-hidden /> Approved
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-body">“{entry.message}”</p>
              <footer className="type-meta mt-4 text-soft">
                — {entry.author} <span aria-hidden>·</span> {entry.date}
              </footer>
            </article>
          </Reveal>
        ))}
      </ul>

      {/* Sign-in gate */}
      <Reveal delay={0.15}>
        <div className="card-well mt-10 p-6 text-center sm:p-8">
          <h3 className="type-h3 text-body">Share a Memory</h3>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-soft">
            Sign in to leave a message. To ensure the guestbook remains a respectful space, please
            sign in or create an account.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/create" className="btn btn-evergreen min-h-12 px-6">
              Sign In
            </Link>
            <Link to="/create" className="btn btn-outline-evergreen min-h-12 px-6">
              Create Account
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
