# og-mobile-fix-v2.patch — apply this one

Save to: `C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\`

**Tested on a fresh clone of your GitHub `main`:** `git am` succeeded, 38 tests
passed, build produced 29 pages with the correct base URL.

---

## Why the last one failed — your local main is two commits behind

```
8707a51   ← your local main is HERE
70b7c66   Priority brief   ← this commit CREATES scripts/prerender.mjs
1d20b95   ← GitHub main is HERE
```

The error said `does not exist in index` because on `8707a51` those two files do
not exist yet. The patch was fine; it was aimed at a newer tree than the one you
were sitting on.

Your `git pull` did not take. Most likely you were on a different branch when you
ran it, or local `main` has diverged. Rather than diagnose that, the commands
below **branch straight from `origin/main`**, which works regardless of what
state your local `main` is in.

---

## PowerShell — use these, they bypass the problem

```powershell
cd C:\path\to\memoryglenV4

git fetch origin
git checkout -B fix/og-baseurl-mobile-tree origin/main

git log --oneline -1
```

That must print:

```
1d20b95 Merge pull request #10 from Vitalchain76/feat/priority-brief
```

**If it prints `8707a51` instead, stop** — the fetch did not reach GitHub. Check
your network or credentials and tell me.

Then:

```powershell
git am "C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\og-mobile-fix-v2.patch"

git log --oneline -1
```

Must now print:

```
Fix Open Graph base URL, make prerender idempotent, and stop the tree canvas trapping mobile scroll
```

Then:

```powershell
npm install
npm test
npm run build

git push -u origin fix/og-baseurl-mobile-tree
```

`npm test` → **38 passed**.
`npm run build` → `[prerender] wrote 29 pages with Open Graph tags`.

### Note on `git checkout -B`

The capital `-B` resets the branch to `origin/main` even if
`fix/og-baseurl-mobile-tree` already exists from your failed attempt. That clears
the half-applied state without you having to delete anything.

If `git am` still reports a stalled session from last time:

```powershell
git am --abort
```

then run the `git am` line again.

---

## While you are there — fix your local main

Not required for this patch, but it will keep biting you:

```powershell
git checkout main
git status
```

- **"Your branch is behind 'origin/main' by 2 commits"** → `git pull` fixes it.
- **"Your branch and 'origin/main' have diverged"** → you have local commits on
  `main`. Send me what `git log --oneline -3` shows and I will tell you which to
  keep; do not force anything yet.

---

## Confirmed file paths, verified on GitHub `main`

| What | Path |
|---|---|
| Prerender script | `scripts/prerender.mjs` |
| Family Tree component | `src/components/family/FamilyTree.tsx` |
| Family Tree data model | `src/components/family/familyModel.ts` |
| Virginia's tree adapter | `src/pages/virginia/familyTreeData.ts` |
| John's tree adapter | `src/pages/john-peters/familyTreeData.ts` |
| Test file this patch edits | `src/__tests__/priority-brief.test.tsx` |
| John's tree tab (the mobile fix) | `src/pages/john-peters/TreeTab.tsx` |

All five confirmed present in a fresh clone of `main`.

---

## What this patch changes — three files only

```
scripts/prerender.mjs                 | 42 ++++---   base URL + idempotence
src/pages/john-peters/TreeTab.tsx     |  9 ++--     canvas desktop-only
src/__tests__/priority-brief.test.tsx | 29 +++++    4 tests
```

Nothing else. No features, no content, no memorial touched.

---

## After the push — set SITE_URL in Vercel

The patch makes the base URL configurable; it still needs telling what it is.

**Vercel → `memoryglen-v4` → Settings → Environment Variables → Add New**

| Field | Value |
|---|---|
| Key | `SITE_URL` |
| Value | `https://memoryglen-v4.vercel.app` |
| Environments | **Production** and **Preview** |

Save, then **redeploy** — Vercel bakes variables in at build time, so an existing
deployment will not pick it up.

Build log should show:

```
[prerender] base URL: https://memoryglen-v4.vercel.app
```

If it says `localhost`, the variable did not reach the build.

---

## Then clear the cached previews

WhatsApp caches for days. Paste a memorial URL into
**developers.facebook.com/tools/debug** and press **Scrape Again**, or you will
keep seeing the old broken card regardless of what is deployed.
