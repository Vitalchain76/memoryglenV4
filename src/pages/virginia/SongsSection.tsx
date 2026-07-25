import Reveal from '@/components/Reveal';
import { SONGS } from '@/pages/virginia/data';

/**
 * Songs she loved.
 *
 * Embedded via youtube-nocookie.com, so a visitor to her memorial is not
 * tracked by YouTube before choosing to play anything. Lazy-loaded so nothing
 * from YouTube is requested until the section scrolls into view.
 */
export default function SongsSection() {
  return (
    <section aria-labelledby="vg-songs-heading">
      <Reveal>
        <p className="eyebrow">Her Music</p>
        <h3 id="vg-songs-heading" className="type-h3 mt-4 text-body">
          Songs She Loved
        </h3>
      </Reveal>

      <ul className="mt-8 grid gap-8 md:grid-cols-2">
        {SONGS.map((song, i) => (
          <Reveal as="li" key={song.youtubeId} delay={Math.min(i, 3) * 0.08}>
            <div className="card-raised overflow-hidden">
              <div className="aspect-video w-full bg-forest-deep">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?rel=0`}
                  title={song.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <div className="p-5">
                <p className="font-display text-lg text-body">{song.title}</p>
                {song.titlePending && (
                  <p className="type-meta mt-1 text-soft">Title to be confirmed by the family</p>
                )}
                {song.note && (
                  <p className="mt-2 leading-relaxed text-soft">{song.note}</p>
                )}
                <a
                  href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow mt-3 inline-flex text-sm"
                >
                  Open on YouTube
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
