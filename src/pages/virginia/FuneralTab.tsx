import { CalendarDays, Clock, Download, Globe, MapPin } from 'lucide-react';
import Reveal from '@/components/Reveal';
import VideoFacade from '@/pages/virginia/VideoFacade';
import { FUNERAL_EVENT, SERVICE_VIDEOS } from '@/pages/virginia/data';

/** TAB: Funeral — "Funeral & Memorial Events" (virginia.md). */
export default function FuneralTab() {
  return (
    <div>
      <Reveal>
        <p className="eyebrow">In her honour</p>
        <h2 className="type-h2 mt-4 text-body">Funeral &amp; Memorial Events</h2>
      </Reveal>

      {/* Event card */}
      <Reveal delay={0.05}>
        <div className="card-raised mt-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="type-h3 text-body">{FUNERAL_EVENT.title}</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
              <Globe size={12} aria-hidden /> PUBLIC Event
            </span>
          </div>
          <dl className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="flex-none text-brass" aria-hidden />
              <dt className="sr-only">Date</dt>
              <dd className="text-sm font-medium text-body">{FUNERAL_EVENT.date}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="flex-none text-brass" aria-hidden />
              <dt className="sr-only">Time</dt>
              <dd className="text-sm font-medium text-body">{FUNERAL_EVENT.time}</dd>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="flex-none text-brass" aria-hidden />
              <dt className="sr-only">Venue</dt>
              <dd className="text-sm font-medium text-body">{FUNERAL_EVENT.venue}</dd>
            </div>
          </dl>

          {/* Service Programme */}
          <div className="card-well mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-body">Service Programme</p>
              <p className="mt-1 text-sm text-soft">Download the funeral programme for this service.</p>
            </div>
            <a href="/booklets/booklet2.pdf" download className="btn btn-evergreen min-h-12 flex-none px-5 text-sm">
              <Download size={16} aria-hidden /> Download Programme
            </a>
          </div>
        </div>
      </Reveal>

      {/* Funeral Service Videos */}
      <Reveal delay={0.1}>
        <h3 className="type-h3 mt-16 text-body">Funeral Service Videos</h3>
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
