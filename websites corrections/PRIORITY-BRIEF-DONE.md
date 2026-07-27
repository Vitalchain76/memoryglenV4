# MemoryGlen V4 — Priority Brief, delivered

**Patch: `memoryglen-priority-brief.patch`** · 209 KB · 5 commits on `main` @ `4789e70`.
Applies clean · builds · lints (no new errors) · **34 tests pass**.

Nothing outside the four priorities was added.

---

## P1 — Homepage clarity ✅

**Hero:** two buttons only. **Create a Memorial** (primary) and **View Demo
Memorial** (secondary) — the latter now goes to `/memorials/john-peters`, a real
populated memorial, not the directory. Supporting line rewritten to say what the
product does.

**How it works:** cut from four steps to three, as specified.

**New section — "What is a Family Glen?"** One paragraph, **38 words**:

> A Family Glen is a shared digital space that connects related memorials — like
> a family plot that lives online. When someone belongs to more than one family
> line, they appear in each relevant Glen.

**Trust note:** three cards answering *who can see it*, *who controls it*, *how
long it lasts*.

**Order changed:** Hero → How it works → What is a Family Glen → demo → tabs.
The product is explained before it is shown off.

---

## P2 — Family Tree ✅ (the data model was the root cause)

**You were right to ask me to check the data first.** The two trees had
incompatible shapes and neither could support what you asked for:

| | Shape | parent/child | spouse | multi-Glen |
|---|---|---|---|---|
| John Peters | x/y coordinates hand-placed on an SVG canvas | ❌ implied by position | ❌ | ✅ |
| Virginia | four flat lists | ❌ none | ❌ | ❌ |

That is why the trees were hard to follow, and why nothing could be shared
between them. Fixed at the model, not in the view layer.

**`src/components/family/familyModel.ts`** — one `FamilyPerson` with explicit
`generation`, `parentIds`, `spouseOf`, `glens`, `living`, `memorialSlug`.
Generations are explicit integers rather than derived, because derivation breaks
on half-siblings, remarriages and adoptions.

**`src/components/family/FamilyTree.tsx`** — the single component, used on every
memorial with a tree:

- Legend at the top
- Generation groups with visible labels and counts
- **Multi-Glen badge** — "2 Glens" — plus the explanatory note
- Loading (skeleton, `aria-busy`), empty, and error (`role="alert"`) states
- **Generation rows that wrap, not a fixed canvas.** A canvas needs hand-placed
  coordinates per person, cannot grow with a family, and forces horizontal
  scrolling on a phone. Rows stack to one column and stay readable at 320px.

Adapters map both memorials onto the model **without changing their source
data**, so nothing already approved was disturbed.

---

## P3 — Mobile ✅

- Every interactive element raised to **at least 44px** — 7 were below
- Body text confirmed at **16px**
- Tab bar scrolls rather than overflowing the page
- Family tree stacks to one column; no pinch-zoom needed
- The only fixed-width element is the pricing comparison table, already inside
  `overflow-x-auto`, which is correct

---

## P4 — Open Graph ✅ (and why the obvious approach would not have worked)

**react-helmet would have done nothing.** MemoryGlen is a Vite SPA: the build
emits one HTML file and every route is drawn by JavaScript. WhatsApp, Facebook
and iMessage **do not run JavaScript** when unfurling a link — they fetch the
URL, read the raw HTML, and stop. Any tag injected at runtime is invisible to
them, which is exactly why every memorial has been sharing as the generic site
title.

**`scripts/prerender.mjs`** writes a real static HTML file per memorial at build
time, with the tags already in the markup. **29 pages generated.** Wired into
`npm run build`, so it cannot be forgotten.

What WhatsApp will now show for your mother:

```
og:title        Virginia Dadirayi Chiimba (1955–2025) — MemoryGlen
og:description  In loving memory of Virginia Dadirayi Chiimba,
                7 June 1955 – 19 May 2025. Gogo Chiimba.
og:image        https://memoryglen.com/virginia-portrait-blue-headscarf.jpg
```

Plus canonical URLs and Twitter card tags. Vercel serves a matching static file
in preference to the SPA rewrite, so crawlers get the tags and people still get
the app.

**WhatsApp share action** added to memorial pages via `wa.me`.

---

## Applies across all memorials, not one demo person ✅

| | |
|---|---|
| Open Graph | **29 pages** — Virginia, John, all 19 demos, the 3 Chiimba, the 3 Peters, home, directory |
| Family tree | Virginia and John — every memorial that has a tree tab |
| Mobile fixes | site-wide |
| Homepage | site-wide |

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git checkout main
git pull

git checkout -b feat/priority-brief
git am "C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\memoryglen-priority-brief.patch"

npm install
npm test
npm run build

git push -u origin feat/priority-brief
```

`npm install` required — the earlier commits in this patch add Supabase and the
test harness. Same rules: **no `<` redirection**, **keep the quotes**.

`npm run build` will now end with `[prerender] wrote 29 pages with Open Graph
tags`. If you do not see that line, the tags did not generate.

---

## What lands (5 commits)

```
c67d4b5  Priority brief: homepage, family tree, mobile, Open Graph
2afd5ac  Provider rail: clear the sticky tab bar, pin layout with tests
3986b0f  Fix: provider panel crowded memorial content below 1280px
f5de88e  Auth: Supabase sign-up, sign-in, profiles, invitations
57199a6  Fix: tab content blank until a second activation
```

If you have already merged any of these, tell me which and I will rebuild a
patch with only what is missing.

---

## After deploying — verify the share cards

Paste a memorial URL into **developers.facebook.com/tools/debug** and press
*Scrape Again*. WhatsApp and Facebook cache aggressively, so an old blank preview
can persist for days until you force a refresh.

---

## Two things I could not verify from here

**Mobile rendering.** I have no browser and jsdom has no layout engine. The
mobile work is from reading the CSS and pinning it with source assertions. If
something still looks wrong at 320–390px, send a screenshot **in this
conversation** with the width and the page.

**The `memoryglen-v3` site.** Still live, still built from different code. Every
patch I write goes to V4. Worth retiring V3 or repointing its links, or these
reports will keep contradicting each other.
