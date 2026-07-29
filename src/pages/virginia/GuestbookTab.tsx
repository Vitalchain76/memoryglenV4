import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { GUESTBOOK } from '@/pages/virginia/data';
import {
  getApprovedGuestbookEntries,
  submitGuestbookEntry,
  type GuestbookRow,
} from '@/lib/guestbookApi';

const MEMORIAL_SLUG = 'virginia-dadirayi-chiimba';

/** TAB: Guestbook (2) — approved entries + live contribution form. */
export default function GuestbookTab() {
  const [dynamicEntries, setDynamicEntries] = useState<GuestbookRow[]>([]);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getApprovedGuestbookEntries(MEMORIAL_SLUG).then((rows) => {
      if (active) setDynamicEntries(rows);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const { error: submitError } = await submitGuestbookEntry({
      memorialSlug: MEMORIAL_SLUG,
      guestName,
      message,
      mediaUrl,
    });
    setSubmitting(false);
    if (submitError) {
      setError(submitError);
      return;
    }
    setNotice(
      'Thank you! Your memory has been submitted and is pending family moderation before publishing.',
    );
    setGuestName('');
    setMessage('');
    setMediaUrl('');
  }

  return (
    <div className="max-w-reading">
      <Reveal>
        <p className="eyebrow">Messages of remembrance</p>
        <h2 className="type-h2 mt-4 text-body">Guestbook</h2>
      </Reveal>

      <ul className="mt-8 space-y-6">
        {dynamicEntries.map((entry, i) => (
          <Reveal as="li" key={entry.id} delay={i * 0.08}>
            <article className="card-raised p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-display text-lg text-body">{entry.guest_name}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sage px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage">
                  <Check size={12} aria-hidden /> Approved
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-body">“{entry.message}”</p>
              {entry.media_url && (
                <img
                  src={entry.media_url}
                  alt=""
                  className="mt-4 max-h-64 rounded-lg object-cover"
                />
              )}
              <footer className="type-meta mt-4 text-soft">
                — {entry.guest_name}{' '}
                <span aria-hidden>·</span>{' '}
                {new Date(entry.created_at).toLocaleDateString()}
              </footer>
            </article>
          </Reveal>
        ))}

        {GUESTBOOK.map((entry, i) => (
          <Reveal as="li" key={entry.title} delay={(dynamicEntries.length + i) * 0.08}>
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

      {/* Contribution form */}
      <Reveal delay={0.15}>
        <div className="card-well mt-10 p-6 sm:p-8">
          <h3 className="type-h3 text-body">Share a Memory</h3>
          <p className="mt-3 max-w-md leading-relaxed text-soft">
            Leave a message for the family. Every tribute is reviewed before it
            appears, to keep the guestbook a respectful space.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="gb-name" className="type-meta block text-body">
                Your name
              </label>
              <input
                id="gb-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-white px-4 py-3 text-body"
              />
            </div>

            <div>
              <label htmlFor="gb-message" className="type-meta block text-body">
                Your message
              </label>
              <textarea
                id="gb-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-white px-4 py-3 text-body"
              />
            </div>

            <div>
              <label htmlFor="gb-media" className="type-meta block text-body">
                Photo URL (optional)
              </label>
              <input
                id="gb-media"
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-line bg-white px-4 py-3 text-body"
              />
            </div>

            {notice && (
              <p className="rounded-lg border border-sage bg-sage/10 px-4 py-3 text-sm text-body">
                {notice}
              </p>
            )}
            {error && (
              <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-evergreen min-h-12 px-6 disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Share a Memory'}
            </button>
          </form>
        </div>
      </Reveal>
    </div>
  );
}
