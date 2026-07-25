import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import Reveal from '@/components/Reveal';
import QRShareBlock from '@/components/QRShareBlock';
import Lightbox from '@/pages/virginia/Lightbox';
import { MEMORIAL_URL, RESTING_PLACE, SIBLINGS } from '@/pages/virginia/data';
import { CHIIMBA_GLEN } from '@/data/memorials';

/**
 * TAB 3 — Family Glen.
 *
 * Her resting place at Seke, Zinganga. Real photographs, real location.
 *
 * IMPORTANT: two of her siblings have died — Joseph (2024) and Victoria (2016)
 * — but the family has NOT told us where they rest. Their places are named and
 * held; no burial location is invented for them. Do not place them on any map
 * or plot until the family supplies it.
 */
export default function GlenTab() {
  const [graveIndex, setGraveIndex] = useState<number | null>(null);
  const departed = SIBLINGS.filter((s) => s.deathYear && !s.isVirginia);

  return (
    <div className="space-y-16 md:space-y-24">
      <section aria-labelledby="glen-heading">
        <Reveal>
          <p className="eyebrow">Family Glen</p>
          <h2 id="glen-heading" className="type-h2 mt-4 text-body">
            Where she rests
          </h2>
          <p className="type-story mt-4 max-w-reading text-soft">
            A quiet place in Seke, and a covered stone with benches beside it &mdash; made
            for sitting with her, not only for visiting.
          </p>
        </Reveal>
      </section>

      {/* The Chiimba family glen — Chari, Moses, then Virginia, oldest first.
          Relationship terms are the family's own (Grandfather, Uncle); the
          relation to Virginia is given beneath, since Chiimba is her married
          name and these are her husband's people. */}
      <section aria-labelledby="glen-list">
        <Reveal>
          <h3 id="glen-list" className="type-h3 text-body">
            The Chiimba Family Glen
          </h3>
          <p className="type-meta mt-2 max-w-reading text-soft">
            Family terms are as her children use them. Her own relation is given beneath.
          </p>
        </Reveal>
        <ul className="mt-6 space-y-3">
          {CHIIMBA_GLEN.map((m, i) => (
            <Reveal as="li" key={m.slug} delay={Math.min(i, 3) * 0.06}>
              <Link
                to={`/memorials/${m.slug}`}
                className="card-raised group flex items-center gap-4 p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg text-body">{m.name}</span>
                  <span className="type-meta mt-0.5 block text-soft">
                    {m.familyRelation}
                    {m.familyRelation === 'Grandfather' && ' \u00b7 her father-in-law'}
                    {m.familyRelation === 'Uncle' && ' \u00b7 her brother-in-law'}
                    {' \u00b7 '}
                    {m.years}
                  </span>
                </span>
                <span className="link-arrow flex-none text-sm">
                  Visit <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.18}>
            <div className="card-raised border border-brass/40 p-5">
              <p className="font-display text-lg text-body">
                Virginia Dadirayi Chiimba
                <span className="type-meta ml-2 text-brass">\u00b7 this memorial</span>
              </p>
              <p className="type-meta mt-0.5 text-soft">1955 \u2013 2025 \u00b7 Seke, Zinganga</p>
            </div>
          </Reveal>
        </ul>
      </section>

      <section aria-labelledby="glen-resting">
        <Reveal>
          <h3 id="glen-resting" className="type-h3 flex items-center gap-2 text-body">
            <MapPin size={20} className="text-brass" aria-hidden /> {RESTING_PLACE.title}
          </h3>
          <p className="mt-4 max-w-reading leading-relaxed text-soft">{RESTING_PLACE.copy}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {RESTING_PLACE.photos.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setGraveIndex(i)}
                  aria-label="View resting place photograph full-screen"
                  className="block w-full overflow-hidden rounded-sm"
                >
                  <img
                    src={src}
                    alt={
                      i === 0
                        ? 'Her resting place in Seke, Zinganga'
                        : 'Flowers laid at her grave'
                    }
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </button>
              </li>
            ))}
          </ul>
          <p className="type-meta mt-3 text-soft">{RESTING_PLACE.caption}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10">
            <p className="eyebrow mb-4">A Plaque for Her Resting Place</p>
            <QRShareBlock
              qrSrc="/qr-virginia.svg"
              url={MEMORIAL_URL}
              extended
              title="Order a brass QR plaque for her resting place"
            />
          </div>
        </Reveal>
        <Lightbox
          images={RESTING_PLACE.photos.map((src) => ({ src, caption: RESTING_PLACE.caption }))}
          index={graveIndex}
          onClose={() => setGraveIndex(null)}
          onNavigate={setGraveIndex}
        />
      </section>

      {/* Siblings who have died — named, but no resting place invented */}
      {departed.length > 0 && (
        <Reveal as="section" aria-label="Others in the family who have passed">
          <div className="card-well p-6 sm:p-8">
            <p className="eyebrow">Also remembered</p>
            <p className="mt-4 max-w-reading leading-relaxed text-soft">
              Two of Virginia&rsquo;s brothers and sisters have also passed. Their resting
              places are not yet recorded here.
            </p>
            <ul className="mt-6 space-y-2">
              {departed.map((s) => (
                <li key={s.name} className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-lg text-body">{s.name}</span>
                  <span className="type-meta text-soft">
                    {s.kinship ? `${s.kinship} · ` : ''}
                    {s.birthYear ? `${s.birthYear}\u2013${s.deathYear}` : `d. ${s.deathYear}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </div>
  );
}
