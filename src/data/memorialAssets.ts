/**
 * Image assets for the 19 dataset memorials.
 *
 * These are fictional demo personas, so we deliberately do NOT ship invented
 * faces. Portraits use the site's existing "silhouette plate" convention
 * (gradient + logo mark) already used by the /memorials directory cards, and
 * galleries reuse dignified landscape assets already in /public.
 *
 * When real (AI-generated or licensed stock) imagery lands, drop the files in
 * /public and replace the entries below — nothing else needs to change. The
 * generation prompts and stock-search phrases live on each memorial object in
 * `memorials.json` under `images`.
 */

export interface MemorialAssets {
  /** Tailwind gradient pair for the placeholder portrait plate. */
  portraitTone: string;
  /** Optional real portrait — takes precedence over the placeholder plate. */
  portraitSrc?: string;
  /** Four landscape images for the Family Memories gallery. */
  gallery: string[];
}

/** Shared hymnal photograph used by the hymn panel on the template pages. */
export const HYMN_IMAGE = '/virginia-gallery-4.jpg';

const GALLERY_POOL = [
  '/theme-msasa-gold.jpg',
  '/theme-baobab-dusk.jpg',
  '/theme-still-water.jpg',
  '/theme-protea.jpg',
  '/theme-white-rose.jpg',
  '/theme-holding-hands.jpg',
  '/theme-sunflower.jpg',
  '/theme-rain-mist.jpg',
  '/theme-heritage-kente.jpg',
  '/theme-paper-doves.jpg',
  '/theme-candles-dark.jpg',
  '/theme-cross-hill.jpg',
  '/theme-sand-dunes.jpg',
  '/theme-marble-quiet.jpg',
  '/theme-night-forest.jpg',
  '/theme-flame-eternal.jpg',
  '/glen-grove-earthly.jpg',
  '/glen-grove-spiritual.jpg',
  '/glen-grove-religious.jpg',
];

const TONES = [
  'from-forest to-forest-deep',
  'from-evergreen to-forest',
  'from-forest-soft to-forest-deep',
  'from-forest to-evergreen',
  'from-forest-deep to-forest',
  'from-evergreen to-forest-deep',
  'from-forest to-forest-soft',
  'from-forest-soft to-evergreen',
  'from-forest-deep to-evergreen',
  'from-evergreen to-forest-soft',
  'from-forest-deep to-forest-soft',
];

const SLUG_ORDER = [
  'tendai-moyo',
  'sipho-nkosi',
  'mai-chiweshe',
  'thandiwe-dlamini',
  'kuda-mapfumo',
  'naledi-mokoena',
  'sekuru-banda',
  'ayanda-khumalo',
  'mbuya-takawira',
  'pieter-van-wyk',
  'rudo-chikafu',
  'baba-solomon-moyo',
  'grace-nyoni',
  'farai-gumbo',
  'nomsa-dube',
  'tapiwa-zvobgo',
  'lindiwe-ncube',
  'chipo-marufu',
  'themba-sibanda',
];

const ASSETS: Record<string, MemorialAssets> = Object.fromEntries(
  SLUG_ORDER.map((slug, i) => [
    slug,
    {
      portraitTone: TONES[i % TONES.length],
      gallery: [0, 1, 2, 3].map((k) => GALLERY_POOL[(i * 4 + k * 5) % GALLERY_POOL.length]),
    },
  ]),
);

const FALLBACK: MemorialAssets = {
  portraitTone: 'from-forest to-forest-deep',
  gallery: GALLERY_POOL.slice(0, 4),
};

export function getAssets(slug: string): MemorialAssets {
  return ASSETS[slug] ?? FALLBACK;
}

/** "african family gathering meal outdoors" → "African family gathering meal outdoors" */
export function captionFromSearch(phrase: string): string {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}
