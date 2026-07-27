# MEMORYGLEN — SAME-DAY FIX BRIEF (v2, corrected)

Paste this whole document into Claude Code with the repo open.
Work phases in order. Phase 0 is mandatory and must complete before any change is made.

---

## GROUND RULES

1. **Verify before you change.** Two prior AI audits contradict each other on the core symptom, and both were produced by tools that could not render this SPA. Treat every claim below as a hypothesis to test against the repo and database, not as fact.
2. **No hard deletes today.** Unpublish only. This platform holds memorial content for real families. A wrong `DELETE` is not recoverable and not acceptable.
3. **Back up before touching data.** See Phase 0.6.
4. **Stop and ask** if: a change would delete rows, RLS is found disabled, the framework turns out not to be what this brief assumes, or a fix requires a schema migration.
5. **Do not put secrets in files or commit messages.** Environment variables go in the Vercel dashboard only.

---

## VERIFIED FINDINGS

These were confirmed by direct HTTP inspection of the served HTML. Trust these over the audit reports.

**Working — do not "fix":**
- Per-memorial Open Graph metadata is correctly server-generated. `/memorials/john-peters` and `/memorials/virginia-dadirayi-chiimba` each return their own `og:title` (name + years), `og:description`, `og:type=profile`, self-referencing `canonical` and `og:url`, dedicated 1200×630 portrait, and matching Twitter tags.
- One earlier audit claimed per-memorial OG previews were impossible. That claim is false. Do not rewrite working metadata code.

**Broken — confirmed:**
1. **Empty body on every route.** Head metadata is served correctly; the body renders nothing to non-JS clients. This means zero Google indexation. It does **not** affect WhatsApp/Facebook previews, which read the head only.
2. **`/memorials/virginia-dadirayi-chiimba` redirects server-side to `?tab=tree`.** John Peters and Tendai Moyo do not. The redirect is memorial-specific, not a global default.
3. **`/memorials/tendai-moyo` has no portrait** — its `og:image` falls back to `hero-home.jpg`, the site marketing hero. Sharing his memorial previews an advert rather than the person.
4. **`/plans` has no page-specific metadata** and its canonical points at the homepage, so search engines will treat it as a duplicate and drop it.
5. **Base URL resolution is inconsistent between routes and between fetches** — one homepage fetch returned `memoryglen.com` absolute URLs, another route returned `memoryglen-v4.vercel.app`. Consistent with the site URL being baked at build time with mixed cache generations.
6. **OG description formatting is inconsistent** across memorials: sentence case with terminal period on two, Title Case with no period on the third. These strings appear in every share preview.

---

## PHASE 0 — VERIFY (mandatory, ~30 min, no code changes)

### 0.1 — Is the Supabase project paused?

Open the Supabase dashboard. Free-tier projects auto-pause after inactivity, and a paused project makes every auth and DB call fail exactly as reported. A "suspended" event was noted on 24 July.

If paused → unpause, wait for it to come up, retest `/signin`, and re-evaluate the rest of Phase 1. This alone may resolve the auth failure.

### 0.2 — RLS audit (do this while you are in the dashboard)

**This is the highest-severity item in the entire brief.** The project URL has circulated in shared documents, and if the app reads memorial data client-side using the anon key, RLS is the only access control that exists.

For every table and every storage bucket:
- [ ] Is RLS enabled?
- [ ] What are the policies, exactly?
- [ ] Does a policy exist that allows anonymous read of anything beyond published memorials?
- [ ] Do `profiles`, `auth`-adjacent tables, or any table holding contributor emails allow anonymous select?

Then confirm no `service_role` key exists anywhere in client-side code, the repo, `.env` files committed to git, or any `NEXT_PUBLIC_`/`VITE_` prefixed variable.

**Report findings before proceeding. If any table is readable anonymously that shouldn't be, that outranks the auth fix.**

### 0.3 — Identify the framework, definitively

The two source briefs contradict each other: one assumes Next.js App Router, one implies Vite.

```bash
cat package.json | grep -E '"(next|vite|react-router)"'
ls -d app/ pages/ src/ 2>/dev/null
grep -rn "generateMetadata" app/ src/ | head
```

Evidence so far suggests Next.js App Router with a working `generateMetadata` and page bodies rendered client-side. Confirm this. **If it is Vite, stop and report** — Phase 4 is invalid and needs rewriting.

### 0.4 — Determine the real auth failure mode

Vercel → latest production deployment → Functions/Logs. Hit `/signin` and `/register` and read the trace.

Record which it is:
- [ ] Clean feature-flag fallback showing a banner
- [ ] Unhandled exception / 500

These have different fixes. Do not guess.

### 0.5 — Grep

```bash
grep -rn "Accounts are not switched on yet" src/ app/
grep -rn "SUPABASE_URL\|SUPABASE_ANON" . --exclude-dir=node_modules
grep -rn "ENABLE_AUTH\|AUTH_ENABLED\|ENABLE_ACCOUNTS" . --exclude-dir=node_modules
grep -rn "SITE_URL\|vercel.app" src/ app/ next.config* --exclude-dir=node_modules
grep -rn "Dadirayi Memory Park" src/ app/
grep -rn "VITE_" . --exclude-dir=node_modules
```

Record the **actual** env var and flag names. This brief uses conventional names; substitute the real ones everywhere.

### 0.6 — Back up the database

Before any write in Phase 2:

```bash
supabase db dump -f memoryglen-backup-$(date +%Y%m%d).sql
```

Or use the dashboard export. Free-tier Supabase does not guarantee automatic daily backups. Confirm the dump file exists and is non-trivial in size before proceeding.

### 0.7 — Enumerate real content from the database

Do not work from any AI-generated list of memorial names. The "128 memorials" figure and the list of synthetic names are unverified and may be fabricated.

```sql
select id, slug, title, status, created_at from memorials order by created_at;
```

Adjust to the real schema. Save the output. Phase 2 works from this and only this.

### 0.8 — Diagnose the tab-construction bug

Virginia's memorial redirects to `?tab=tree`; the other two do not.

Find where the tab list and default tab are constructed. Report:
- [ ] Is the tab set static, or derived from available content?
- [ ] Is there a `defaultTab` field or similar on the memorial row?
- [ ] What is different about Virginia's record — empty Story field, video attached at a different level, extra relation rows?

**Hypothesis to test:** tabs are derived from content, and fall-through logic selects the tree when an expected section is missing. If true, this single mechanism explains the redirect, the video appearing as a top-level tab instead of under Media, the duplicated tree content, and the tab differences between memorials. Fix the derivation, not the symptom. Do not hardcode a global default tab.

---

## PHASE 1 — AUTH (P0)

Only after Phase 0.1 and 0.4 are complete.

### 1.1 — Environment variables (Vercel, Production scope)

Set only the variables the codebase actually reads, per Phase 0.5. **Do not set both `VITE_` and `NEXT_PUBLIC_` versions "to be safe"** — set the correct ones and delete the stale ones.

- `<PREFIX>_SUPABASE_URL`
- `<PREFIX>_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only, **must not** carry a public prefix
- `<PREFIX>_ENABLE_AUTH=true` — only if the flag exists
- `<PREFIX>_SITE_URL=https://www.memoryglen.com`

### 1.2 — Supabase → Authentication → URL Configuration

- Site URL: `https://www.memoryglen.com`
- Redirect URLs: `https://www.memoryglen.com/**`, `https://memoryglen.com/**`, `https://www.memoryglen.com/auth/callback`, `https://memoryglen-v4.vercel.app/**`
- Email provider enabled; confirm whether email confirmation is intentionally on or off

### 1.3 — Code

Make the auth gate resolve from env rather than a hardcoded value. If Phase 0.4 showed an exception rather than a flag, wrap Supabase client creation so missing config renders a graceful message instead of throwing — but the env vars are the real fix, not the wrapper.

### 1.4 — Route aliases

In `middleware.ts`: 301 `/login`, `/sign-in` → `/signin`; `/signup`, `/sign-up`, `/create-account` → `/register`.

### 1.5 — Verify viewing never requires auth

Open a memorial in a private window while logged out. **If viewing requires an account, that is a launch blocker.** Someone receiving a link at a funeral must never hit a sign-up wall.

### 1.6 — Redeploy

Full production redeploy — env vars are baked at build time. Then purge the Vercel data cache.

### 1.7 — Acceptance

On `www.memoryglen.com`: register → confirm email → sign in → reach `/create` → sign out → sign in → password reset. Desktop and mobile. All must pass before Phase 2.

---

## PHASE 2 — TRUST & CONTENT (P0)

Backup from 0.6 must exist before starting.

### 2.1 — One brand name

**Decision required from Ethan — see Decisions section. Do not proceed on assumption.**

Default recommendation: **MemoryGlen** is the platform. **Dadirayi Memory Park** is the name of the founding memorial only. Apply consistently to `<title>`, logo, nav, footer, `og:site_name`.

### 2.2 — Remove fabricated content

- Footer contact details: replace with real ones or remove entirely. A fake support address on a memorial platform is the single worst trust signal on the site.
- Remove invented statistics ("500+ Families", "200+ Livestreams", "1K+ QR Codes", "50+ Partner Parlours").
- Memorial cards must render real `created_at`, not a placeholder date.
- Remove or clearly label demo service-provider listings.

### 2.3 — Memorial cleanup — UNPUBLISH, DO NOT DELETE

Working from the Phase 0.7 database output only.

**Keep published:**
- Virginia Dadirayi Chiimba and any other confirmed real family memorial
- **John Peters** — retain as the single labelled demo. He is the target of the homepage "View Demo Memorial" CTA and needs to stay. Add a visible "Example memorial" label.

**Unpublish (`status='draft'`, no row deletion):**
- All celebrity and public-figure memorials. These are both a credibility problem and a potential publicity-rights and defamation exposure. Highest priority in this section.
- All synthetic/demo entries other than John Peters, including Tendai Moyo unless he is a real family memorial — **confirm with Ethan before unpublishing him.**
- Any memorial with no real story, no real photos, or placeholder text.
- Test and development profiles.

**Produce the proposed list and get Ethan's sign-off before running any UPDATE.**

### 2.4 — Consent checkbox

Add a required checkbox to memorial creation: the registrant confirms they have the family's consent to publish. Store as boolean plus timestamp on the memorial record.

Note for the roadmap, not for today: living people named in family trees are personal information under POPIA even though the deceased are not. A removal-request mechanism will be needed before real families are invited in at scale.

---

## PHASE 3 — HYGIENE (P1)

### 3.1 — Canonicals and base URL

Derive `canonical` and `og:url` from a single shared metadata helper reading `<PREFIX>_SITE_URL`. Remove every hardcoded `vercel.app` and `memoryglen.com` literal. This fixes the flipping-canonical problem in the same deploy.

### 3.2 — `/plans`

Give it its own title, description, and self-referencing canonical. Also verify the reported duplicate sign-in block — confirm visually before changing anything.

### 3.3 — Tendai Moyo's OG image

Either upload a real portrait, or build a fallback OG card generator that renders name and dates on a plain background. Falling back to the site marketing hero is worse than either.

### 3.4 — OG description consistency

Standardise on: `In memory of [Name], [years]. [One-line tagline].` — sentence case, terminal period. Apply to all published memorials.

### 3.5 — v3 deployment

Enable Deployment Protection on `memoryglen-v3` or delete the project. A public duplicate of the product with no canonical tags competes with production in search results.

### 3.6 — Search

Wire `/search` to a Postgres `ilike` or full-text query on name and location. If it can't ship today, remove the "not activated" text, hide the nav search box, and show an honest coming-soon state.

### 3.7 — Virginia's page deduplication

Biography, scripture blocks and hymn reportedly repeat across the header, Biography section and Life Story tab. **Check whether this resolves itself once Phase 0.8's tab-construction bug is fixed** before writing any dedupe code — it is likely the same root cause. Consolidate the four booklet PDFs to the final version.

---

## PHASE 4 — THIS WEEK (not today)

Only if Phase 0.3 confirms Next.js App Router.

- Server-render or ISR `/memorials` and `/memorials/[slug]` (`revalidate: 60`). This fixes Google indexation. It does **not** affect share previews, which already work.
- Fallback OG image generation via `/api/og`.
- Pre-formatted WhatsApp share payload, and `navigator.share()` for the native OS share sheet.
- Admin/co-admin roles; section-level privacy via `visibility_level`.
- `rel="nofollow noopener noreferrer"` on user-submitted links.
- Image optimisation — memorial pages under 1.5 MB first load.

---

## DECISIONS REQUIRED FROM ETHAN

Claude Code should pause and ask on each of these rather than assuming:

1. **Platform brand name** — MemoryGlen, with Dadirayi Memory Park as the founding memorial? (recommended)
2. **Is Tendai Moyo real or synthetic?** Determines whether he stays published.
3. **Final unpublish list** — sign-off required before any UPDATE runs.
4. **Should Virginia's memorial remain public** during a phase where things visibly break, or be set private until Phase 1–3 are done?
5. **Pricing** — the homepage CTA still has no cost indication.

---

## END-OF-DAY ACCEPTANCE CHECKLIST

- [ ] Supabase project confirmed active, not paused
- [ ] RLS audit complete; no table or bucket anonymously readable that shouldn't be
- [ ] No `service_role` key anywhere client-side or in the repo
- [ ] Database backup taken and verified before any data change
- [ ] `/signin` and `/register` render working forms on www.memoryglen.com — no banner, no 500
- [ ] Full auth round-trip passes on desktop and mobile
- [ ] Viewing a memorial while logged out works without an account
- [ ] All alias routes 301 correctly
- [ ] One brand name everywhere
- [ ] No fake contact details, statistics, or placeholder dates visible anywhere
- [ ] Celebrity memorials unpublished; zero rows deleted
- [ ] John Peters retained and labelled as an example
- [ ] Consent checkbox live on memorial creation
- [ ] `view-source:` on the homepage shows `https://www.memoryglen.com` as canonical, consistently across three repeated fetches
- [ ] All three published memorials land on the Story tab, not the tree
- [ ] `memoryglen-v3.vercel.app` no longer publicly reachable
- [ ] Search works or is honestly labelled

---

## REPORT BACK IN THIS FORMAT

1. **Phase 0 findings** — Supabase paused y/n, RLS status per table, framework confirmed, auth failure mode, actual env var names, tab-construction root cause
2. **What changed** — files, env vars, dashboard settings
3. **Auth status** — working or still broken, with the specific error if broken
4. **Memorials unpublished** — exact list, confirming zero deletions
5. **Remaining blockers**
6. **Exact URLs for Ethan to open on his phone right now**

Do not report a phase as complete unless its acceptance items actually pass.
