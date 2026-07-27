# Corrected patch — priority brief only

**Use `priority-brief-only.patch`** · 48 KB · **1 commit** · base `main` @ `8707a51`.

Verified against your exact commit: applies clean, `git am` creates a real
commit, build succeeds, **34 tests pass**.

---

## What went wrong

My fault. The patch I sent contained **5 commits**, and 4 of them were already on
your `main` — the tab fix, the Supabase auth, and the two provider-rail commits,
all merged in your PRs #8 and #9.

`git am` stops dead when it meets a patch that is already applied. It hit the
first already-merged commit, halted, and left your branch identical to `main`.
That is exactly what you saw.

This patch contains **only the new work**, rebased onto `8707a51`.

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git checkout main
git pull

git checkout -b feat/priority-brief
git am "C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\priority-brief-only.patch"

git log --oneline -1
```

**Stop there and check.** `git log --oneline -1` must show:

```
Priority brief: homepage clarity, one family tree, mobile, Open Graph
```

If it still shows the merge commit from PR #9, the patch did not apply — tell me
what `git am` printed and I will fix it rather than guess.

Once you see the right commit:

```powershell
npm install
npm test
npm run build

git push -u origin feat/priority-brief
```

`npm run build` must end with:

```
[prerender] wrote 29 pages with Open Graph tags
```

If that line is missing, the Open Graph tags did not generate.

---

## What is in this one commit

**18 files, +858 / −24.**

### 1. Homepage clarity
- `src/pages/home/Hero.tsx` — two buttons only; **View Demo Memorial** goes to
  `/memorials/john-peters`, a real populated memorial
- `src/pages/home/HowItWorks.tsx` — four steps cut to three
- `src/pages/home/FamilyGlenExplainer.tsx` — **new**: the 38-word plain-language
  explanation plus the trust note (who can see it · who controls it · how long it
  lasts)
- `src/pages/Home.tsx` — explanation now comes before the showcase

### 2. Shared Family Tree
- `src/components/family/familyModel.ts` — **new**: one `FamilyPerson` with
  explicit generation, `parentIds`, `spouseOf`, `glens`
- `src/components/family/FamilyTree.tsx` — **new**: the single component. Legend,
  generation labels, multi-Glen badges and note, loading / empty / error states,
  stacks to one column on a phone
- `src/pages/virginia/familyTreeData.ts`, `src/pages/john-peters/familyTreeData.ts`
  — **new**: adapters, leaving both memorials' source data untouched
- Both `TreeTab.tsx` files now render the shared component

### 3. Open Graph + WhatsApp
- `scripts/prerender.mjs` — **new**: writes 29 real static HTML files at build
  time with `og:title`, `og:description`, `og:image`, canonical and Twitter tags
- `package.json` — prerender wired into `npm run build`
- `src/components/QRShareBlock.tsx` — WhatsApp share via `wa.me`

### 4. Mobile
- 7 interactive elements raised from 40px to 44px across `PlaylistCard`,
  `MemorialPage`, `virginia/OverviewTab`, `john-peters/GlenTab`

### Tests
- `src/__tests__/priority-brief.test.tsx` — **new**: 15 tests, one per
  requirement in your brief

---

## One thing I noticed on your main

`8707a51` contains the auth and tab-fix commits **twice**:

```
fb39390  Auth: Supabase sign-up...     ← in PR #9's branch
7733626  Auth: Supabase sign-up...     ← in PR #8
d82771a  Fix: tab content...           ← in PR #9's branch
81ae3cb  Fix: tab content...           ← in PR #8
```

PR #9's branch was cut before you pulled PR #8, so it carried those commits along
a second time. Git resolved it and the code is correct — I built and tested
against your exact `main` to be sure. Nothing to fix; worth knowing so the
history does not confuse you later.

To avoid it next time: always `git checkout main && git pull` **before**
`git checkout -b`, which the commands above do.

---

## After deploying

Paste a memorial URL into **developers.facebook.com/tools/debug** and press
*Scrape Again*. WhatsApp caches previews aggressively and will keep showing the
old blank card for days otherwise.
