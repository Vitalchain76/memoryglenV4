import { Link } from 'react-router';
import Reveal from '@/components/Reveal';

/** TAB: Anniversary Room — explainer + empty state (virginia.md). */
export default function AnniversaryTab() {
  return (
    <div className="mx-auto max-w-reading">
      <Reveal>
        <div className="card-raised p-6 sm:p-8">
          <p className="eyebrow">Gathering to remember</p>
          <h2 className="type-h2 mt-4 text-body">Anniversary Room</h2>
          <p className="mt-4 leading-relaxed text-soft">
            Anniversary rooms are scheduled gatherings where family and friends can come together
            virtually to remember Virginia Dadirayi Chiimba. Check back for upcoming anniversary
            events.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="card-well mt-8 flex flex-col items-center px-6 py-16 text-center">
          <img
            src="/empty-anniversary.svg"
            alt=""
            width={300}
            height={200}
            className="opacity-90"
            loading="lazy"
          />
          <p className="type-quote mt-8 text-body">No anniversary rooms scheduled yet.</p>
          <Link to="/create" className="link-arrow mt-6 text-sm">
            Schedule an anniversary room
          </Link>
          <p className="type-meta mt-2 text-soft">Available to family members.</p>
        </div>
      </Reveal>
    </div>
  );
}
