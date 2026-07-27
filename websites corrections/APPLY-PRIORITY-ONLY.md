# Priority brief only — the smaller patch

**Use `priority-brief-only.patch`.** 48 KB · **1 commit** · 18 files.

Base: `main` @ `8707a51` (your PR #9). Verified against it just now:
applies clean · builds · 34 tests pass · no new lint errors.

---

## Why the big one failed

You had already merged more than either of us was tracking. As of now, `main`
contains:

| | |
|---|---|
| Tab fix (blank panel until a second click) | ✅ merged |
| Supabase auth | ✅ merged |
| Provider rail overlap + sticky offset | ✅ merged |
| **Priority brief** | ❌ **the only thing missing** |

The 209 KB patch tried to re-apply all four, so `git am` hit files that already
existed and stopped. This one contains **only** the priority work.

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git checkout main
git pull

git checkout -b feat/priority-brief
git am "C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\priority-brief-only.patch"

npm install
npm test
npm run build

git push -u origin feat/priority-brief
```

`npm run build` must end with:

```
[prerender] wrote 29 pages with Open Graph tags
```

If that line is missing, the share previews did not generate.

Same rules as always: **no `<` redirection**, **keep the quotes** on the path.

---

## If `git am` still stops

It should not, but if it does:

```powershell
git am --abort
git apply "C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\priority-brief-only.patch"
git add -A
git commit -m "Priority brief: homepage clarity, family tree, mobile, Open Graph"
```

And paste me the error either way — with one commit it will be a specific
conflict rather than a pile of them.

---

## What is in it

**1. Homepage clarity**
- `src/pages/home/Hero.tsx` — two buttons only; **View Demo Memorial** goes to
  John Peters, a real populated memorial
- `src/pages/home/HowItWorks.tsx` — four steps cut to three
- `src/pages/home/FamilyGlenExplainer.tsx` — **new**; the 38-word plain-language
  paragraph plus the trust note (who can see it, who controls it, how long it
  lasts)
- `src/pages/Home.tsx` — explanation now comes before the showcase

**2. Family tree**
- `src/components/family/familyModel.ts` — **new**; one normalised model with
  explicit generation, parentIds, spouseOf and glens
- `src/components/family/FamilyTree.tsx` — **new**; the single component. Legend,
  generation labels, multi-Glen badges and note, loading/empty/error states,
  stacks to one column on a phone
- `src/pages/virginia/familyTreeData.ts`, `src/pages/john-peters/familyTreeData.ts`
  — **new**; adapters, so neither memorial's source data had to change
- Both `TreeTab.tsx` files now render the shared component

**3. Open Graph / WhatsApp**
- `scripts/prerender.mjs` — **new**; writes a real static HTML file per memorial
  at build time with og:title, og:description, og:image, canonical and Twitter
  card tags. 29 pages.
- `package.json` — prerender wired into `npm run build`
- `src/components/QRShareBlock.tsx` — WhatsApp share via `wa.me`

**4. Mobile touch targets**
- `PlaylistCard.tsx`, `MemorialPage.tsx`, `virginia/OverviewTab.tsx`,
  `john-peters/GlenTab.tsx` — seven elements raised from 40px to 44px

**Tests**
- `src/__tests__/priority-brief.test.tsx` — **new**; 15 tests, one per
  requirement in your brief

**Not included, as you asked:** the auth work and the tab fix.

---

## After it deploys

Paste a memorial URL into **developers.facebook.com/tools/debug** and press
*Scrape Again*. WhatsApp and Facebook cache link previews hard, and an old blank
one can persist for days until you force the refresh.
