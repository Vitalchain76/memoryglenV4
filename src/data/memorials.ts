import raw from '@/data/memorials.json';

/**
 * Content pack for every NON-template memorial (19 fictional demo personas).
 *
 * The two template memorials — `virginia-dadirayi-chiimba` and `john-peters` —
 * are deliberately NOT in this dataset. They keep their own bespoke pages and
 * must never be driven from here.
 */

export interface MemorialVerse {
  text: string;
  reference: string;
}

/**
 * The content pack was produced by four parallel writers and `scripture` came
 * back in three different shapes: a plain "text — Reference" string, `{ text,
 * ref }`, and `{ text, reference }`. Normalise on load rather than hand-editing
 * the delivered JSON, so a re-delivered pack keeps working.
 */
type RawVerse = string | { text: string; ref?: string; reference?: string };

function normaliseVerse(v: RawVerse): MemorialVerse {
  if (typeof v === 'string') {
    const i = v.lastIndexOf('—');
    if (i === -1) return { text: v.trim(), reference: '' };
    return { text: v.slice(0, i).trim(), reference: v.slice(i + 1).trim() };
  }
  return { text: (v.text ?? '').trim(), reference: (v.reference ?? v.ref ?? '').trim() };
}

export interface MemorialHymn {
  original: string;
  language: string;
  translation: string;
}

export interface MemorialPoem {
  title: string;
  lines: string[];
  closing: string;
}

export interface MemorialFavouriteSong {
  title: string;
  artist: string;
  description: string;
  /** Appended to https://music.youtube.com/search?q= */
  youtubeSearch: string;
  playlistNote: string;
}

export interface MemorialVoiceNote {
  title: string;
  description: string;
  /** "m:ss" */
  duration: string;
}

export interface MemorialRestingPlace {
  name: string;
  description: string;
}

export interface MemorialTimelineEntry {
  year: string;
  title: string;
  text: string;
}

export interface MemorialImageBrief {
  prompt: string;
  stockSearch: string;
}

export interface Memorial {
  slug: string;
  name: string;
  /** en-dash separated, e.g. "1941–2024" */
  years: string;
  birthYear: number;
  deathYear: number;
  location: string;
  tagline: string;
  /** "his" | "her" */
  pronoun: string;
  features: string[];
  candles: number;
  communityMemorial: boolean;
  /**
   * A real person whose memorial the family has not yet written. The page
   * renders name, dates and relation only — never empty section shells, and
   * never invented content. Remove this flag when real content arrives.
   */
  awaitingContent?: boolean;
  /** How this person relates to the family, in the family's own words. */
  familyRelation?: string;
  /** One line for the Family Glen listing. */
  glenNote?: string;
  /** Hidden from the public /memorials directory; still fully reachable by slug.
      Used for the Peters family, who belong to the John Peters demo rather than
      the general public listing. */
  unlisted?: boolean;
  biographyTitle: string;
  biography: string[];
  tributesTitle: string;
  tributes: string[];
  scripture: MemorialVerse[];
  hymn: MemorialHymn;
  poem: MemorialPoem;
  favouriteSong: MemorialFavouriteSong;
  voiceNote: MemorialVoiceNote;
  galleryCaption: string;
  booklets: string[];
  restingPlace: MemorialRestingPlace;
  timeline: MemorialTimelineEntry[];
  images: {
    portrait: MemorialImageBrief;
    gallery: MemorialImageBrief[];
  };
}

/** Slugs that own bespoke template pages — never served from this dataset. */
export const TEMPLATE_SLUGS = ['virginia-dadirayi-chiimba', 'john-peters'] as const;

type RawMemorial = Omit<Memorial, 'scripture'> & { scripture: RawVerse[] };

export const MEMORIALS: Memorial[] = (raw as RawMemorial[]).map((m) => ({
  ...m,
  scripture: m.scripture.map(normaliseVerse),
}));

const BY_SLUG = new Map(MEMORIALS.map((m) => [m.slug, m]));

/** Memorials shown in the public /memorials directory grid. */
export const LISTED_MEMORIALS = MEMORIALS.filter((m) => !m.unlisted);

/** The Chiimba family glen — those who rest with Virginia, oldest first. */
export const CHIIMBA_GLEN_SLUGS = ['chari-chiimba', 'moses-sarire-ivhu-chiimba'] as const;

export const CHIIMBA_GLEN = CHIIMBA_GLEN_SLUGS
  .map((slug) => BY_SLUG.get(slug))
  .filter((m): m is Memorial => Boolean(m))
  .sort((a, b) => a.deathYear - b.deathYear);

export function isTemplateSlug(slug: string): boolean {
  return (TEMPLATE_SLUGS as readonly string[]).includes(slug);
}

/** Returns the memorial for a slug, or undefined for template/unknown slugs. */
export function getMemorial(slug: string | undefined): Memorial | undefined {
  if (!slug || isTemplateSlug(slug)) return undefined;
  return BY_SLUG.get(slug);
}

/* ---------- Derived helpers ---------- */

export function possessive(m: Memorial): 'His' | 'Her' {
  return m.pronoun === 'his' ? 'His' : 'Her';
}

export function hasFeature(m: Memorial, feature: 'livestream' | 'voiceNotes'): boolean {
  return m.features.includes(feature);
}

export function memorialUrl(m: Memorial): string {
  return `https://memoryglen.com/memorials/${m.slug}`;
}

export function youtubeMusicUrl(m: Memorial): string {
  return `https://music.youtube.com/search?q=${encodeURIComponent(m.favouriteSong.youtubeSearch)}`;
}

/** Splits "…quote — Name, relation" into the quote and its attribution. */
export function splitAttribution(line: string): { text: string; attribution: string } {
  const i = line.lastIndexOf('—');
  if (i === -1) return { text: line.trim(), attribution: '' };
  return { text: line.slice(0, i).trim(), attribution: line.slice(i + 1).trim() };
}

export function voiceNoteSeconds(m: Memorial): number {
  const [mins, secs] = m.voiceNote.duration.split(':').map((n) => Number.parseInt(n, 10));
  if (Number.isNaN(mins) || Number.isNaN(secs)) return 60;
  return mins * 60 + secs;
}
