import Reveal from '@/components/Reveal';
import VideoFacade from '@/pages/virginia/VideoFacade';
import { SERVICE_VIDEOS } from '@/pages/virginia/data';

/** TAB: Videos (3) — the three funeral service recordings (virginia.md). */
export default function VideosTab() {
  return (
    <div>
      <Reveal>
        <h2 className="type-h2 text-body">Funeral Service Videos</h2>
        <p className="mt-3 max-w-reading leading-relaxed text-soft">
          Recordings from the memorial service are shared here so family and friends who could not
          attend may still witness and remember the day we honoured her life.
        </p>
        <p className="type-meta mt-4 text-brass">Recordings stay in the family hub forever.</p>
      </Reveal>
      <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SERVICE_VIDEOS.map((v, i) => (
          <Reveal as="li" key={v.title} delay={i * 0.08}>
            <VideoFacade video={v} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
