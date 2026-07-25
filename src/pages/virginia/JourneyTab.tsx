import Reveal from '@/components/Reveal';
import FuneralTab from '@/pages/virginia/FuneralTab';
import AnniversaryTab from '@/pages/virginia/AnniversaryTab';

/**
 * TAB 1 — The Journey.
 *
 * Everything from the moment of her passing onward: the funeral and memorial
 * events, the service recordings, and the anniversary room.
 *
 * The coordination narrative for May–October 2025 (the Memorial Coordinating
 * Team, the travel, the 25 October unveiling at Mushore Homestead) is NOT
 * written here. It is waiting on the family's own record. Do not draft it from
 * inference — the place is held below until the account arrives.
 */
export default function JourneyTab() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section aria-labelledby="journey-heading">
        <Reveal>
          <p className="eyebrow">The Journey</p>
          <h2 id="journey-heading" className="type-h2 mt-4 text-body">
            From 19 May 2025 onward
          </h2>
          <p className="type-story mt-4 max-w-reading text-soft">
            The days after she left us, and everything the family carried between then
            and the unveiling of her stone.
          </p>
        </Reveal>
      </section>

      <FuneralTab />

      {/* Held place — the family's own account of the coordination */}
      <Reveal as="section" aria-label="The final journey">
        <div className="rounded-sm border border-dashed border-brass/60 p-6 sm:p-8">
          <p className="eyebrow">The Final Journey</p>
          <h3 className="type-h3 mt-4 text-body">May – October 2025</h3>
          <p className="mt-4 max-w-reading leading-relaxed text-soft">
            The Virginia Chiimba Memorial Coordinating Team, the months of planning across
            three countries, and the Memorial and Tombstone Unveiling Service held on
            25 October 2025 at Mushore Homestead, Seke.
          </p>
          <p className="type-meta mt-4 text-soft">
            This account is being written by the family, in the family&rsquo;s own words.
          </p>
        </div>
      </Reveal>

      <AnniversaryTab />
    </div>
  );
}
