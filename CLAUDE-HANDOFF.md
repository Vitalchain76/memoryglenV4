# CLAUDE HANDOFF — MemoryGlen Demo Memorial Content Pack

Prepared by Kimi (planning arm). You (Claude) are the execution arm: wire this content into the memoryglen-v3 codebase and redeploy.

## What you receive
1. `memoryglen-memorials-content.json` — 19 memorial objects, one per non-template memorial.
2. `memoryglen-memorials-review.md` — human-readable render of the same data (for Gilbert's review, not for the codebase).

## Task
Every public memorial on the site must render a full memorial page with the SAME sections, styling and background as the two template pages:
- `memoryglen-v3.vercel.app/memorials/virginia-dadirayi-chiimba`
- `memoryglen-v3.vercel.app/memorials/john-peters`

The template section order is:
1. Biography ("His Life" / "Her Life") — `biography` paragraphs under `biographyTitle`
2. Tributes — `tributes` under `tributesTitle`
3. Scripture — `scripture` (2 verses)
4. Hymn panel ("A Hymn He/She Loved") — `hymn.original` + `hymn.translation` (reuses the shared hymnal background image already in the repo)
5. Poem — `poem` ("Forever in Our Hearts")
6. Favourite Song — `favouriteSong` (YouTube Music link = `https://music.youtube.com/search?q=` + `youtubeSearch`; Spotify playlist block = `playlistNote`)
7. Family Memories gallery — `galleryCaption` + 4 gallery images
8. Voice note — `voiceNote` (reuse the template audio player component; if no per-person audio exists yet, reuse the same demo audio file the templates use)
9. Memorial Booklets — `booklets` (reuse the same demo PDF links the templates use)
10. Final Resting Place — `restingPlace`
11. QR plaque block — point at `https://memoryglen.com/memorials/{slug}`
12. Life Timeline — `timeline` (6 entries)

## How to wire it
- If the codebase has a memorials data file (e.g. `data/memorials.ts` / `data/memorials.json`), import/merge these 19 objects there, keyed by `slug`. Do NOT touch `virginia-dadirayi-chiimba` or `john-peters`.
- The memorial page component should fall back to this dataset for every slug; currently non-template slugs fall back to the listing page — that fallback must go.
- Keep each memorial's index-card facts EXACTLY as in the JSON (`years`, `location`, `features`, `candles`). Feature flags: `livestream` → show livestream badge/player block; `voiceNotes` → show voice note section prominently.
- `baba-solomon-moyo` has `communityMemorial: true` — keep the existing banner: "Unofficial community memorial — not affiliated with or endorsed by the estate."

## Known inconsistencies to fix while you're in there
- Homepage strip says "Ayanda Khumalo 1958–2025" but the index card says 1988–2020 — the JSON uses **1988–2020** (index card wins). Align the homepage.
- Homepage strip says "Kudakwashe Mapfumo 1947–2025" but the index card says "Kuda Mapfumo 1947–2021" — the JSON uses **Kuda Mapfumo, 1947–2021**. Align the homepage.
- Homepage strip shows Virginia's dates as "1955–2025 · Seke, Chitungwiza" — leave as is.

## Images
Each memorial has `images.portrait` and `images.gallery[4]` with BOTH an AI-generation `prompt` and a `stockSearch` phrase. Either:
- pull free stock (Unsplash/Pexels) using the `stockSearch` phrases, or
- generate images from the `prompt`s.
Dignified, age-appropriate, African subjects. Portraits: head-and-shoulders, soft natural light. These are demo memorials — fictional people — so AI-generated portraits are fine. Reuse the existing shared assets (hymnal photo, sunset/savanna backgrounds, QR plaque images) already used by the templates for the non-portrait sections.

## Deploy
Commit on a branch, open the preview, Gilbert verifies 2–3 memorial pages against a template page (same sections, same background panels), then merge and let Vercel redeploy production.

## Guardrails
- All 21 people on the site are fictional demo personas — do not add real names, real contact details, real funeral homes, or real PDFs.
- Do not change site styling; the goal is content parity with the templates, not a redesign.
