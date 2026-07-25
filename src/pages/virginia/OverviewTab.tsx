import { useState } from 'react';
import { Download, FileText, MapPin } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import Lightbox from '@/pages/virginia/Lightbox';
import PlaylistCard from '@/components/PlaylistCard';
import QRShareBlock from '@/components/QRShareBlock';
import Reveal from '@/components/Reveal';
import StatBand from '@/components/StatBand';
import Timeline from '@/components/Timeline';
import MemorialGallery from '@/pages/virginia/MemorialGallery';
import {
  BIOGRAPHY,
  BOOKLETS,
  BOOKLETS_COPY,
  GALLERY,
  GALLERY_CAPTION,
  HYMN,
  LIFE_TIMELINE,
  MEMORIAL_URL,
  POEM_LINES,
  RESTING_PLACE,
  SCRIPTURES,
  TRIBUTES,
  VOICE_NOTE,
} from '@/pages/virginia/data';

/** TAB: Overview (default) — 12 sections in order (virginia.md). */
export default function OverviewTab() {
  const [graveIndex, setGraveIndex] = useState<number | null>(null);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1 — Biography */}
      <section aria-labelledby="her-life">
        <Reveal>
          <p className="eyebrow">Biography</p>
          <h2 id="her-life" className="type-h2 mt-4 text-body">
            Her Life
          </h2>
        </Reveal>
        <div className="mt-6 space-y-5">
          {BIOGRAPHY.map((paragraph, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 0.06}>
              <p className="type-story text-body">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2 — Tributes from Her Children and Family */}
      <section aria-labelledby="tributes">
        <Reveal>
          <p className="eyebrow">With love</p>
          <h2 id="tributes" className="type-h2 mt-4 text-body">
            Tributes from Her Children and Family
          </h2>
        </Reveal>
        <ul className="mt-8 space-y-6">
          {TRIBUTES.map((t, i) => (
            <Reveal as="li" key={t.name} delay={Math.min(i, 4) * 0.08}>
              <blockquote className="card-raised p-6 sm:p-8">
                <span aria-hidden className="font-display text-4xl leading-none text-brass">
                  “
                </span>
                <p className="type-quote mt-2 text-body">{t.quote}</p>
                <footer className="type-meta mt-4 text-soft">
                  — {t.name} <span aria-hidden>·</span> {t.relation}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 3 — Scripture */}
      <Reveal as="section" aria-label="Scripture">
        <div className="card-well border border-brass/40 p-6 sm:p-8">
          <p className="eyebrow">Scripture</p>
          <div className="mt-6 space-y-6">
            {SCRIPTURES.map((s) => (
              <blockquote key={s.reference}>
                <p className="type-quote text-body">“{s.text}”</p>
                <footer className="type-meta mt-3 uppercase tracking-[0.14em] text-brass">
                  — {s.reference}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 4 — Shona Hymn */}
      <Reveal as="section" aria-label="Shona hymn">
        <div className="card-raised flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <img
            src="/virginia-gallery-4.jpg"
            alt="Hymn book and choir robes on a church pew"
            width={220}
            height={147}
            loading="lazy"
            className="w-full flex-none rounded-sm object-cover sm:w-[220px]"
          />
          <div>
            <p className="eyebrow">A Hymn She Loved</p>
            <p className="type-quote mt-4 text-body">“{HYMN.shona}”</p>
            <p className="mt-3 text-sm italic text-soft">{HYMN.translation}</p>
          </div>
        </div>
      </Reveal>

      {/* 5 — Poem — "Forever in Our Hearts" */}
      <Reveal as="section" aria-label="Poem — Forever in Our Hearts">
        <div className="text-center">
          <hr className="brass-rule mx-auto" aria-hidden />
          <h3 className="type-h3 mt-8 text-body">Forever in Our Hearts</h3>
          <div className="type-quote mt-6 space-y-1.5 text-body">
            {POEM_LINES.slice(0, 8).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="type-quote mt-6 text-body">{POEM_LINES[8]}</p>
          <hr className="brass-rule mx-auto mt-8" aria-hidden />
        </div>
      </Reveal>

      {/* 6 — Her Favourite Song → The Songs She Loved (PlaylistCard) */}
      <section aria-labelledby="her-songs">
        <Reveal>
          <div className="card-well mb-6 p-6 sm:p-8">
            <p className="eyebrow">Her Favourite Song</p>
            <p className="mt-4 max-w-reading leading-relaxed text-soft">
              This was one of Virginia's favourite songs — a melody that filled her home and heart with
              joy. It plays at family gatherings still, and every note brings her close.
            </p>
            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow mt-4 inline-flex text-sm"
            >
              Open in YouTube Music
            </a>
          </div>
          <PlaylistCard
            heading="The Songs She Loved"
            youtubeTracks={[
              {
                title: 'Her Favourite Hymn',
                artist: 'YouTube Music',
                thumbnail: '/virginia-gallery-4.jpg',
              },
            ]}
            spotifyTracks={[
              {
                title: 'Family Hymn Playlist',
                artist: 'Spotify · the hymns she sang',
                thumbnail: '/virginia-gallery-4.jpg',
              },
            ]}
            uploadedTracks={[
              {
                title: 'Choir recording — family upload',
                artist: 'Family Choir',
                addedBy: 'the family',
                durationSeconds: 96,
              },
            ]}
            onAddSong={() => {
              window.location.href = 'mailto:admin@memoryglen.com?subject=Add%20a%20song%20for%20Virginia';
            }}
          />
        </Reveal>
      </section>

      {/* 7 — Family Memories gallery */}
      <section aria-labelledby="family-memories">
        <Reveal>
          <h3 id="family-memories" className="type-h3 text-body">
            Family Memories
          </h3>
          <p className="type-meta mt-2 text-soft">Click any photo to view full-screen.</p>
          <p className="mt-3 max-w-reading leading-relaxed text-soft">{GALLERY_CAPTION}</p>
        </Reveal>
        <div className="mt-8">
          <MemorialGallery items={GALLERY} />
        </div>
      </section>

      {/* 8 — Voice Note */}
      <Reveal as="section" aria-label="Voice note">
        <div>
          <p className="eyebrow">Her Voice</p>
          <h3 className="type-h3 mt-4 text-body">{VOICE_NOTE.title}</h3>
          <p className="mt-3 max-w-reading leading-relaxed text-soft">{VOICE_NOTE.description}</p>
          <AudioPlayer title={VOICE_NOTE.title} durationSeconds={42} avatarInitial="V" className="mt-6" />
        </div>
      </Reveal>

      {/* 9 — Memorial Booklets */}
      <section aria-labelledby="booklets">
        <Reveal>
          <h3 id="booklets" className="type-h3 text-body">
            Memorial Booklets
          </h3>
          <p className="mt-3 max-w-reading leading-relaxed text-soft">{BOOKLETS_COPY}</p>
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {BOOKLETS.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 0.06}>
              <a
                href={b.href}
                download
                className="group card-raised flex h-full items-center gap-4 p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-sm bg-well text-soft transition-colors duration-200 group-hover:text-brass">
                  <FileText size={22} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-body">{b.title}</span>
                  <span className="type-meta mt-0.5 block text-soft">PDF · {b.size}</span>
                </span>
                <span className="btn btn-outline-evergreen !min-h-10 flex-none px-4 py-1.5 text-sm">
                  <Download size={14} aria-hidden /> Download
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 10 — Final Resting Place */}
      <section aria-labelledby="resting-place">
        <Reveal>
          <p className="eyebrow">Final Resting Place</p>
          <h3 id="resting-place" className="type-h3 mt-4 flex items-center gap-2 text-body">
            <MapPin size={20} className="text-brass" aria-hidden /> {RESTING_PLACE.title}
          </h3>
          <p className="mt-4 max-w-reading leading-relaxed text-soft">{RESTING_PLACE.copy}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {RESTING_PLACE.photos.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setGraveIndex(i)}
                  aria-label="View grave photo full-screen"
                  className="block w-full overflow-hidden rounded-sm"
                >
                  <img
                    src={src}
                    alt={i === 0 ? 'The gravesite in Seke, Zinganga, shaded by msasa trees' : 'Flowers laid on her grave'}
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
          <div className="mt-8">
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

      {/* 11 — Stats bar */}
      <Reveal as="section" aria-label="Memorial statistics">
        <div className="card-well p-6 sm:p-8">
          <StatBand
            stats={[
              { value: '3', label: 'Contributions' },
              { value: '13', label: 'Media Files' },
              { value: '12', label: 'Digital Candles' },
              { value: '25', label: 'Family Members' },
            ]}
          />
        </div>
      </Reveal>

      {/* 12 — Life Timeline */}
      <section aria-labelledby="life-timeline">
        <Reveal>
          <p className="eyebrow">Her Journey</p>
          <h3 id="life-timeline" className="type-h3 mt-4 text-body">
            Life Timeline
          </h3>
        </Reveal>
        <div className="mt-8">
          <Timeline items={LIFE_TIMELINE} />
        </div>
      </section>
    </div>
  );
}
