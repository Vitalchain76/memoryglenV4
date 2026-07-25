# MemoryGlen Demo Memorial Content Pack — Plan

## Goal
Give every non-template memorial on memoryglen-v3.vercel.app the same rich content and structure as the two template memorials (virginia-dadirayi-chiimba, john-peters). Deliverable = drop-in content pack the user hands to Claude (execution arm) to wire into the codebase and redeploy. I cannot edit the deployed Vercel site directly (no repo in workspace; sandbox cannot reach the site except via browser tools).

## Scope
19 memorials = homepage "Newly created memorials" strip minus Virginia (template). John Peters is the second template — untouched.

Canonical facts (from /memorials index cards; homepage dates that conflict are flagged for Claude to align):
1. tendai-moyo — Tendai Moyo, 1941–2024, Bulawayo (livestream, voice notes, 86 candles)
2. sipho-nkosi — Sipho Nkosi, 1960–2025, Durban (voice notes, 132)
3. mai-chiweshe — Mai Chiweshe, 1938–2023, Masvingo (voice notes, 54)
4. thandiwe-dlamini — Thandiwe Dlamini, 1952–2025, Johannesburg (livestream, 201)
5. kuda-mapfumo — Kuda Mapfumo, 1947–2021, Mutare (63)
6. naledi-mokoena — Naledi Mokoena, 1965–2024, Cape Town (livestream, voice notes, 118)
7. sekuru-banda — Sekuru Banda, 1929–2019, Gweru (41)
8. ayanda-khumalo — Ayanda Khumalo, 1988–2020, London (livestream, voice notes, 307)
9. mbuya-takawira — Mbuya Takawira, 1935–2018, Chinhoyi (29)
10. pieter-van-wyk — Pieter van Wyk, 1954–2022, Pretoria (77)
11. rudo-chikafu — Rudo Chikafu, 1971–2025, Toronto (voice notes, 144)
12. baba-solomon-moyo — Baba Solomon Moyo, 1930–2022, Harare (livestream, 512, unofficial community memorial)
13. grace-nyoni — Grace Nyoni, 1949–2025, Kwekwe
14. farai-gumbo — Farai Gumbo, 1962–2025, Kadoma
15. nomsa-dube — Nomsa Dube, 1944–2025, Bulawayo
16. tapiwa-zvobgo — Tapiwa Zvobgo, 1956–2025, Marondera
17. lindiwe-ncube — Lindiwe Ncube, 1968–2025, Cape Town
18. chipo-marufu — Chipo Marufu, 1951–2025, Chegutu
19. themba-sibanda — Themba Sibanda, 1940–2025, Victoria Falls

## Template structure (extracted from the two live template pages)
Per memorial: biography (8-10 paragraphs) → tributes (5-7 quotes) → scripture (2 verses) → hymn (local language + English gloss) → poem "Forever in Our Hearts" → favourite song → voice note → family memories gallery caption → memorial booklets list → final resting place → QR plaque → life timeline (6 entries).

## Stage 1 — Content generation (parallel writers, no skill files needed)
4 background writer subagents, each producing a strict JSON fragment file:
- Writer A: memorials 1–5 → /mnt/agents/output/parts/part_a.json
- Writer B: memorials 6–10 → /mnt/agents/output/parts/part_b.json
- Writer C: memorials 11–15 → /mnt/agents/output/parts/part_c.json
- Writer D: memorials 16–19 → /mnt/agents/output/parts/part_d.json
Each memorial object follows the shared schema (slug, name, years, location, tagline, biography, tributes, scripture, hymn, poem, favouriteSong, voiceNote, galleryCaption, booklets, restingPlace, timeline, images{portrait+gallery prompts + stock search terms}).

Rules for writers: fictional/demo people; warm obituary tone matching templates; culturally grounded (Shona/Ndebele/Zulu/Sotho/Afrikaans as name dictates); varied occupations, family structures, diaspora links; no real contact details (demo placeholders only); keep index-card facts (years, city, features) fixed.

## Stage 2 — Assemble & validate (orchestrator)
- Merge 4 fragments → /mnt/agents/output/memoryglen-memorials-content.json
- Validate JSON parse, schema keys, slug uniqueness, fact consistency vs index cards.
- Auto-generate readable review doc: /mnt/agents/output/memoryglen-memorials-review.md

## Stage 3 — Handoff brief (orchestrator)
- /mnt/agents/output/CLAUDE-HANDOFF.md — exact instructions for Claude: where data goes, template parity checklist, homepage/index date mismatches to fix (Ayanda, Kuda), image sourcing, redeploy step.
