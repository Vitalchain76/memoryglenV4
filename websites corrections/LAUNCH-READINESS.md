# Pre-launch pass — Patch 1 of 2

**Patch: `launch-readiness.patch`** · 370 KB · 1 commit · base `main` @ `267957e`.
Tested on a fresh clone: applies clean, **61 tests pass**, build produces 29 pages.

---

## ⚠️ The most important thing I found — and it was not on your list

Your homepage advertised:

> **500+** Families Served · **200+** Livestreams · **1K+** QR Codes · **50+** Partner Parlours

**MemoryGlen has not launched. Every one of those numbers was untrue.**

They were on a page you are about to point a real domain at, that investors read,
for a product whose entire value proposition is being trustworthy with a family's
memories. If anyone had asked to see those 500 families, there was no answer.

Removed, and replaced with something true:

> Built for families across Zimbabwe, South Africa and the diaspora — wherever a
> memorial link needs to reach.
> *A memorial is free to create and stays free to visit.*

Put real numbers back the day they are real. Not before.

---

## Also in this patch

### Legal foundation ✅

**Terms of Service** and **Privacy Policy**, plain language, footer links on every
page. They cover what you asked:

- **Content ownership** — you keep everything you upload; we store and display it
  only per the memorial's privacy setting; we never sell or license it
- **Family control** — every memorial has a family owner who decides who sees it
  and who may edit; owners can have it removed; we will not take sides in family
  disputes
- **Living people in family trees** — the section most policies avoid. If you are
  named on a memorial you can ask to be removed, **without a reason and without
  the family owner's agreement**

### ⚠️ Have a lawyer read this before cutover

I am not one, and this has not been reviewed. Two things specifically:

**POPIA applies to you.** You operate from South Africa. It requires a named
Information Officer registered with the Regulator. I have left that as a marked
placeholder in `legalContent.ts` — it needs a real name.

**Living people in family trees is your largest legal exposure.** A memorial
records names, birth years and relationships of people who are alive and never
signed up. Under POPIA and GDPR that is personal information processed without
consent. The pages are written to be honest about it rather than hide it, but a
lawyer should tell you whether honesty is sufficient.

### Open Graph ✅

Dataset memorials were sharing with **the homepage hero** as their preview image —
so a memorial unfurled in WhatsApp showed a picture of a landing page. Now uses
the person's own portrait where one exists, and a dignified neutral 1200×630 card
otherwise. Never the hero.

### Memorial ordering ✅

John Peters now leads the directory. Virginia sits beneath him with her quiet
Founding Memorial badge.

### PWA ✅

`manifest.webmanifest` with 192, 512 and maskable icons, standalone display, brand
theme colour. Service worker plus an offline shell.

**The service worker is deliberately conservative.** Navigations are
**network-first**, not cache-first. Showing someone a stale copy of their mother's
memorial — or one that has since been made private — would be worse than showing
nothing. Only hashed build assets are cached aggressively. `/account` and
`/signin` are never cached at all.

---

## Already done — verified, not assumed

| Brief item | Status |
|---|---|
| 1A One shared layout for all memorials | ✅ merged in PR #13 |
| 1B Family Tree renders once | ✅ the earlier duplicate is gone |
| 1B Generation grouping, multi-Glen badge, mobile stacking | ✅ |
| 1C Default landing = Memorial | ✅ |
| 1E `/create` is a real flow | ✅ **already 749 lines**, multi-step with draft saving — not a stub |
| 1F Duplicated sign-in on `/plans` | ✅ none found — zero matches |
| 2A OG title, description, per-memorial | ✅ |
| 2A WhatsApp share on memorials | ✅ |

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git fetch origin
git checkout -B feat/launch-readiness origin/main

git am "C:\Users\Gilbert\Desktop\MemGlenFinal\websites corrections\launch-readiness.patch"

npm install
npm test
npm run build

git push -u origin feat/launch-readiness
```

`npm test` → **61 passed**.

---

## What I did NOT do, and why

**Google / Facebook social login.** Supabase supports both, but enabling them is
mostly work in dashboards I cannot reach: creating a Google Cloud OAuth client,
setting authorised redirect URIs, and pasting the client ID and secret into
Supabase → Authentication → Providers. Writing the button before that exists
would give you a control that fails when pressed. **Tell me when the provider is
enabled in Supabase and the button is about twenty lines — I will send it the
same day.**

**Instagram / TikTok sharing.** Neither has a web share API worth using. The
right answer is the native share sheet (`navigator.share`) or a downloadable
story image, and I would rather build that deliberately than bolt on something
that half works.

**First-click link reliability (1D).** I cannot reproduce it. I have no browser,
and jsdom has no network stack — I cannot open a link in the WhatsApp in-app
browser and watch what happens. What I can tell you is that the prerendered HTML
is correct and the SPA rewrite is correct, so if it still fails the cause is
likely the service worker, the Vercel rewrite order, or WhatsApp's own webview.
**Send me a screen recording and I will find it.** Note this patch adds a service
worker, which is a new variable in that area — test it specifically.

**John Peters on the shared shell.** He passes the consistency tests but keeps his
bespoke tab bar and his interactive demo pieces. Moving him is a further patch,
and I would not do it in the same pass as a domain cutover.

---

## Suggested order

1. Merge this.
2. Set `SITE_URL` in Vercel if you have not — the build log must show
   `[prerender] base URL: https://memoryglen-v4.vercel.app`, not `localhost`.
3. Check the five reference pages, and test **Add to Home Screen** on Android
   Chrome.
4. Send me the WhatsApp first-click recording and enable the Google provider —
   those two become Patch 2.
5. Have a lawyer read the legal pages **before** pointing memoryglen.com here.
