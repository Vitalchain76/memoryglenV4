# MEMORYGLEN — SAME-DAY FIX BRIEF FOR CLAUDE CODE

Paste this entire document into Claude Code with the repo open. Work through the phases in order. Do not skip Phase 0.

---

## CONTEXT

- **Stack:** Next.js (App Router) + Supabase (auth + DB) + Vercel. Production domain: `https://www.memoryglen.com` (apex 308-redirects to www — confirmed working). Vercel projects: `memoryglen-v4` (current) and `memoryglen-v3` (old, still publicly live).
- **Symptoms reported:** auth routes either show "Accounts are not switched on yet. Memorial pages work as normal." OR return 500 internal errors (audits conflict — verify which). Search is inactive. Demo/celebrity memorials and placeholder data are live. Branding is split between "MemoryGlen" and "Dadirayi Memory Park" on different routes.
- **Confirmed by direct HTTP inspection (trust these):**
  1. Canonical + og:url on www.memoryglen.com point to `memoryglen-v4.vercel.app` instead of the production domain, and canonical output flips between fetches → site URL is baked at build time and edge caches hold mixed generations.
  2. Every route on every deployment serves an empty body to non-JS clients (no SSR) → zero Google indexation, no per-memorial WhatsApp/OG previews possible.
  3. `memoryglen-v3.vercel.app` is live with no canonical/OG tags — a public duplicate of the product.
- **IMPORTANT — unverified claims:** Several findings in the AI audits (a "128 public memorials" count, specific synthetic memorial names, a dual-template split, exact 500 vs. flag behaviour) came from tools that could not fully render the SPA and may be partly hallucinated. Verify every content claim against the actual repo and database before acting on it. Never hard-delete data based on an AI report.

---

## PHASE 0 — VERIFY BEFORE CHANGING (do first, ~20 min)

1. **Supabase status.** Check the Supabase dashboard: is the project **Paused**? (A "Supabase suspended" event was noted on 24 July — free-tier projects auto-pause after inactivity, and a paused project makes every auth/DB call 500.) If paused → unpause, wait for it to come up, then retest `/signin` before touching anything else. This alone may fix auth.
2. **Determine the real auth failure mode.** Vercel → latest production deployment → Functions/Logs → hit `/signin` and `/register` and read the stack trace. Record: clean flag fallback, or unhandled exception?
3. **Grep the codebase:**
   ```bash
   grep -rn "Accounts are not switched on yet" src/ app/
   grep -rn "NEXT_PUBLIC_SUPABASE" .
   grep -rn "ENABLE_AUTH\|AUTH_ENABLED\|ENABLE_ACCOUNTS" .
   grep -rn "NEXT_PUBLIC_SITE_URL\|memoryglen-v4.vercel.app\|vercel.app" src/ app/ next.config*
   grep -rn "Dadirayi Memory Park" src/ app/
   ```
   Record the exact env var names and flag names the code actually uses — the fix steps below use the common names; substitute the real ones.
4. **Confirm domain ownership.** Vercel → check which project holds `memoryglen.com` / `www.memoryglen.com` (should be v4) and confirm `memoryglen-v3` is a separate project.
5. **Enumerate real content.** Query the DB directly instead of trusting the audit lists:
   ```sql
   select id, slug, title, status, created_at from memorials order by created_at;
   ```
   (Adjust table/column names to the actual schema.) Save the output — Phase 2 works from this list, not from the AI reports.

---

## PHASE 1 — AUTH LIVE (P0)

1. **Vercel env vars, Production scope** (then substitute real names from Phase 0.3):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only — must NOT be `NEXT_PUBLIC_`)
   - `NEXT_PUBLIC_ENABLE_AUTH=true` (if the flag exists)
   - `NEXT_PUBLIC_SITE_URL=https://www.memoryglen.com` (fixes canonicals in the same deploy)
2. **Supabase → Authentication → URL Configuration:**
   - Site URL: `https://www.memoryglen.com`
   - Redirect URLs: `https://www.memoryglen.com/**`, `https://memoryglen.com/**`, `https://www.memoryglen.com/auth/callback`, `https://memoryglen-v4.vercel.app/**`
   - Providers: Email enabled; confirm email-confirmation setting is intentional.
3. **Code:** make the auth gate resolve dynamically from env (not hardcoded `false`). If Phase 0 showed a crash instead of a flag, wrap Supabase client creation so missing config renders a graceful banner rather than throwing — but the real fix is the env vars.
4. **Route aliases** in `middleware.ts`: 301 `/login`, `/sign-in` → `/signin`; `/signup`, `/sign-up`, `/create-account` → `/register`.
5. **RLS check:** confirm authenticated users can insert/update their own `profiles` and `memorials` rows and public read stays open for published memorials. Fix policies only if the check fails — don't blindly run SQL from the audit reports.
6. **Redeploy** (env vars are baked at build time — no redeploy means no change), then purge the Vercel data cache.
7. **Acceptance test:** on www.memoryglen.com — register → confirm email (if on) → sign in → reach `/create` → sign out → sign in → password reset. All must pass on desktop + mobile before Phase 2.

## PHASE 2 — TRUST & CONTENT PURGE (P0)

1. **Branding — one name.** DECISION NEEDED FROM ETHAN: default to **MemoryGlen** as the platform brand; "Dadirayi Memory Park" remains the name of the founding memorial only. Update `<title>`, logo, footer, nav, meta site_name consistently. If two layouts/templates genuinely coexist (verify in the repo — don't assume), delete the stale one.
2. **Kill fake data:**
   - Footer contact: replace `support@dadirayimemorypark.com` and `+27 11 123 4567` with real details or remove.
   - Remove fabricated stats ("500+ Families", "200+ Livestreams", "1K+ QR Codes", "50+ Partner Parlours") until real.
   - Memorial cards: render real `created_at`, not "1 January 2024".
   - Remove or clearly label demo service-provider listings.
3. **Memorial cleanup — soft, not hard.** Working from the Phase 0.5 DB list:
   - KEEP: Virginia Dadirayi Chiimba (founding memorial) and any other confirmed real family memorials.
   - Keep at most ONE clearly labelled example memorial.
   - Everything else (celebrity pages, synthetic/demo entries): set `status='draft'`/unpublished — do NOT delete rows today. Confirm the final list with Ethan before running the update.
4. **Consent:** add a required checkbox to memorial creation: registrant confirms they have the family's consent to publish. Store the acknowledgement (boolean + timestamp) on the memorial record.

## PHASE 3 — SEARCH, CANONICALS, HYGIENE (P1)

1. **Search:** wire `/search` to a real query (Postgres `ilike`/full-text on name + location is enough today). If it can't ship today, replace "not activated" with a proper coming-soon state and hide the nav search box.
2. **Canonicals:** derive canonical + og:url from `NEXT_PUBLIC_SITE_URL` in one shared metadata helper. Grep for any hardcoded `vercel.app` URLs and remove them.
3. **v3:** enable Deployment Protection on the `memoryglen-v3` project (or delete it). Confirm `memoryglen-v4.vercel.app` redirects to the custom domain once it's set as primary.
4. **Virginia's page dedupe:** the biography, scripture blocks, and hymn are repeated across the header, Biography section, and Life Story tab — each piece of content should render once. Consolidate the four booklet PDFs down to the one final version.

## PHASE 4 — THIS WEEK (do not start today unless Phases 1–3 are done)

- SSR/ISR for `/memorials` and `/memorials/[slug]` (`revalidate: 60`) — prerequisite for Google indexing and WhatsApp link previews.
- Per-memorial dynamic OG tags + `/api/og` image generation; pre-formatted WhatsApp share payload.
- Admin/co-admin roles for the main registrant; section-level privacy (`visibility_level` on sub-tables); bereavement-announcement broadcast flow.
- `rel="nofollow noopener noreferrer"` on user-submitted links.

---

## END-OF-DAY ACCEPTANCE CHECKLIST

- [ ] `/signin` and `/register` render working forms on www.memoryglen.com (no banner, no 500)
- [ ] Full auth round-trip passes (register → confirm → sign in → create → sign out → reset)
- [ ] All alias routes redirect correctly
- [ ] One brand name everywhere; no fake contact info, stats, or placeholder dates visible
- [ ] Public directory shows only real memorials + max one labelled example
- [ ] Consent checkbox live on memorial creation
- [ ] `view-source:` on the homepage shows canonical `https://www.memoryglen.com` consistently across repeated fetches
- [ ] memoryglen-v3.vercel.app no longer publicly accessible
- [ ] Search either works or is honestly labelled coming-soon
