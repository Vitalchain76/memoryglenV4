# MemoryGlen Build Mission — Candles, Guestbook, Media
**Status:** APPROVED by Gilbert Chiimba. Begin immediately.
**Executor:** Claude Code (desktop)
**Project:** C:\Users\Gilbert\Desktop\Projects\MemoryGlen (Next.js)
**Live platform:** Vercel project "dadirayi-memory-park" → www.memoryglen.com

---

## Non-negotiable safety rules (read before writing any code)

1. **PROTECTED MEMORIALS — NEVER TEST ON, EDIT, OR TOUCH:**
   - Virginia Dadirayi Chiimba — /memorials/virginia-dadirayi-chiimba
   - John Peters
   These pages must render identically before and after every deploy. Verify visually after each feature.

2. **Deployment rule:** All deploys go to Vercel **preview URLs only**. Nothing deploys to production root memoryglen.com until Gilbert states the exact words: **"deploy to production approved."** No exceptions.

3. **Database snapshot before any migration.** Take a Supabase backup/snapshot and confirm it exists before running each migration. Log the snapshot timestamp.

4. **Additive only.** No changes to existing memorial content, schemas may only gain tables/columns — never alter or drop existing ones. Existing memorial pages must be unaffected if new features fail.

5. **Hidden test memorial first.** Before building Feature 1, create a hidden/unlisted test memorial (e.g., "Test Memorial — Do Not Index", noindex, excluded from listings). ALL testing happens there.

6. **No fabricated identifiers.** Never insert any email, name, or account identifier into code, seeds, or docs unless Gilbert provided it directly.

---

## Build order (do not change)

### Feature 1 — Candles
- Visitors can light a virtual candle on any memorial
- **No account required**
- Optional short message with the candle
- **Post-moderation:** candles appear immediately; memorial owner can remove
- Rate limiting / basic abuse protection (per-IP throttle)
- Candle display section on memorial page (count + recent candles)
- Fits The Sanctuary design system: Deep Forest #16302B, Evergreen #2E5945, Brass Gold #C4A24C (≤5%), Parchment #F6F1E7, Fraunces for names, Inter body ≥18px, WCAG AA

**Done when:** works on the hidden test memorial, deployed to preview URL, Gilbert notified for testing.

### Feature 2 — Guestbook / Comments
- Visitors can leave a written tribute on any memorial
- **Name required** (account not required unless already the pattern)
- **Pre-moderation:** entries invisible until memorial owner approves
- Owner moderation UI: approve / reject / delete
- Guestbook section on memorial page showing approved entries only
- Same design system compliance

**Done when:** full moderation loop verified on test memorial, preview deploy, Gilbert notified.

### Feature 3 — Media uploads (CORE PRODUCT FEATURE)
- Signed-in users can open **any existing memorial** and add photos — without creating a new memorial
- Must work on existing memorial pages (architecture must support the Virginia page class of memorial, though testing NEVER happens on it)
- **Images first.** Short video/audio is phase 2 of this feature — build the schema to accommodate it, ship images.
- Captions allowed per item
- **Client-side image compression** before upload (e.g., browser-image-compression), sensible max dimensions/size
- **Pre-moderation:** nothing public until the memorial owner approves
- Owner moderation UI for media (approve / reject / delete)
- Gallery section on memorial page showing approved media only
- Storage: Supabase Storage (or existing storage pattern in the codebase — follow what exists)
- SSR-safe; approved public media respects existing crawler policy (AI crawlers on public Tier-3 content only)

**Done when:** upload → compress → moderate → gallery loop verified on test memorial, preview deploy, Gilbert notified.

---

## Per-feature workflow (repeat for each of the three)

1. DB snapshot → confirm
2. Migration (additive only)
3. Build feature
4. Test entirely on hidden test memorial
5. Visually verify Virginia and John Peters pages unchanged
6. Commit + push to memoryglen-platform (private repo)
7. Deploy to **preview URL**
8. Report to Gilbert: what shipped, preview link, what to test
9. Wait for Gilbert's go before starting the next feature

---

## Reporting format after each feature

- Feature name + status
- Snapshot timestamp
- Migration summary (tables/columns added)
- Preview URL
- Test checklist for Gilbert
- Confirmation: protected memorials verified unchanged

**Begin with Feature 1: Candles. Confirm mission received, then start.**
