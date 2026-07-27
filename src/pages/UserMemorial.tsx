import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import MediaUploader from '@/components/MediaUploader';
import Reveal from '@/components/Reveal';
import { useAuth } from '@/lib/useAuth';
import { getMemorialBySlug, listMedia, mediaUrl } from '@/lib/memorialsApi';
import type { MediaRow, MemorialRow } from '@/lib/memorialsApi';

/**
 * A memorial created by a user and stored in the database.
 *
 * The two showcase memorials (Virginia, John Peters) are bespoke pages on their
 * own routes and never reach this component. MemorialPage falls through to here
 * when a slug isn't found in the static dataset.
 */
export default function UserMemorial({ slug }: { slug: string }) {
  const { user, loading: authLoading } = useAuth();
  const [memorial, setMemorial] = useState<MemorialRow | null>(null);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    let active = true;

    async function load() {
      const { memorial: found } = await getMemorialBySlug(slug);
      if (!active) return;
      if (!found) {
        setState('missing');
        return;
      }
      const items = await listMedia(found.id);
      if (!active) return;
      setMemorial(found);
      setMedia(items);
      setState('ready');
    }

    void load();
    return () => {
      active = false;
    };
  }, [slug]);

  // Wait for the session before deciding anything — a draft memorial is
  // invisible to anonymous readers, so resolving too early would show the
  // owner a "not found" page for their own memorial.
  if (state === 'loading' || authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="type-meta text-soft">Opening their page…</p>
      </div>
    );
  }

  if (state === 'missing' || !memorial) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="type-h2 text-body">This memorial isn&rsquo;t here</h1>
        <p className="type-story mt-4 text-soft">
          The link may be mistyped, or the page may not have been published yet.
        </p>
        <Link to="/memorials" className="btn btn-evergreen mt-8 min-h-12 px-6">
          Browse memorials
        </Link>
      </div>
    );
  }

  const isOwner = Boolean(user && user.id === memorial.owner_id);
  const years = [memorial.born_on?.slice(0, 4), memorial.died_on?.slice(0, 4)]
    .filter(Boolean)
    .join(' — ');

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      {isOwner && memorial.status === 'draft' && (
        <p className="card-well mb-8 p-4 text-sm text-soft">
          This memorial is a draft — only you can see it.
        </p>
      )}

      <Reveal>
        <header className="text-center">
          <h1 className="type-h1 text-body">{memorial.full_name}</h1>
          {years && <p className="type-meta mt-3 text-soft">{years}</p>}
          {memorial.tagline && (
            <p className="type-story mt-6 text-body">{memorial.tagline}</p>
          )}
          {memorial.resting_place && (
            <p className="type-meta mt-4 inline-flex items-center gap-1.5 text-soft">
              <MapPin size={13} aria-hidden />
              {memorial.resting_place}
            </p>
          )}
        </header>
      </Reveal>

      {memorial.story && (
        <Reveal>
          <section className="mt-16">
            <h2 className="type-h3 text-body">Their story</h2>
            <div className="type-story mt-5 space-y-4 text-body">
              {memorial.story.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="mt-16">
          <h2 className="type-h3 text-body">Photographs</h2>

          {media.length > 0 ? (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {media.map((item) => (
                <li key={item.id}>
                  <img
                    src={mediaUrl(item.storage_path)}
                    alt={item.caption ?? `Photograph of ${memorial.full_name}`}
                    loading="lazy"
                    className="aspect-square w-full rounded-sm bg-surface object-cover"
                  />
                  {item.caption && (
                    <p className="type-meta mt-2 text-soft">{item.caption}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="type-story mt-5 text-soft">
              {isOwner
                ? 'No photographs yet. Add the first one below.'
                : 'No photographs have been added yet.'}
            </p>
          )}

          {isOwner && (
            <MediaUploader
              memorialId={memorial.id}
              ownerId={memorial.owner_id}
              onUploaded={(item) => setMedia((prev) => [item, ...prev])}
            />
          )}
        </section>
      </Reveal>
    </article>
  );
}