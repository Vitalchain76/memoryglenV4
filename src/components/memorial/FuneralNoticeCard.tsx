import { Calendar, MapPin, Navigation } from 'lucide-react';

interface FuneralNoticeCardProps {
  venueName: string;
  address: string;
  latitude: number;
  longitude: number;
  serviceDate: string;
}

/**
 * FuneralNoticeCard — service details with one-tap GPS directions. The link
 * uses the universal Google Maps directions endpoint, which opens the native
 * maps app (Google or Apple) on mobile and the web app on desktop.
 */
export default function FuneralNoticeCard({
  venueName,
  address,
  latitude,
  longitude,
  serviceDate,
}: FuneralNoticeCardProps) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="card-raised p-6 sm:p-8">
      <div className="mb-2 flex items-center gap-3 text-brass">
        <Calendar size={18} aria-hidden />
        <span className="type-meta text-xs font-semibold uppercase tracking-wider">
          Funeral &amp; Service Details
        </span>
      </div>

      <h3 className="type-h3 text-body">{venueName}</h3>
      <p className="mt-1 flex items-start gap-2 text-sm text-soft">
        <MapPin size={15} className="mt-0.5 flex-none text-brass" aria-hidden />
        {address}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--line)] pt-4">
        <span className="rounded-full bg-sage/15 px-3 py-1.5 text-xs font-medium text-body">
          {new Date(serviceDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </span>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-evergreen inline-flex min-h-12 items-center gap-2 px-4 text-sm"
        >
          <Navigation size={16} aria-hidden /> Get GPS Directions
        </a>
      </div>
    </div>
  );
}
