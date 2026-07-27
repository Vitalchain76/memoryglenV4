# Apply — Open Graph base URL + mobile tree

**Patch file:** `og-baseurl-and-mobile-tree.patch`
**Save it to:** `C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\`

7.5 KB · **1 commit** · base `main` @ `1d20b95` (your PR #10).

Verified against that exact commit: applies clean, `git am` creates a real
commit, **38 tests pass**, build succeeds.

---

## Scope — three files, nothing else

```
scripts/prerender.mjs                 | 42 ++++---
src/pages/john-peters/TreeTab.tsx     |  9 ++--
src/__tests__/priority-brief.test.tsx | 29 +++++
3 files changed, 75 insertions(+), 5 deletions(-)
```

No new features. No content changes. No memorial touched.

**`scripts/prerender.mjs`** — base URL resolved from the environment, and the
tag-stripping made idempotent.

**`src/pages/john-peters/TreeTab.tsx`** — one class changed:

```diff
- <section className="pb-16" aria-label="The Peters family tree">
+ <section className="hidden pb-16 lg:block" aria-label="The Peters family tree">
```

**`src/__tests__/priority-brief.test.tsx`** — four tests covering the above.

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git checkout main
git pull

git checkout -b fix/og-baseurl-mobile-tree
git am "C:\Users\Gilbert\Desktop\MemGlenFinal\supabase\og-baseurl-and-mobile-tree.patch"

git log --oneline -1
```

That last line must read:

```
Fix Open Graph base URL, make prerender idempotent, and stop the tree canvas trapping mobile scroll
```

If it still shows the PR #10 merge, stop and send me what `git am` printed.

Then:

```powershell
npm install
npm test
npm run build

git push -u origin fix/og-baseurl-mobile-tree
```

`npm test` should report **38 passed**.

---

## ⚠️ Set SITE_URL in Vercel — the patch alone is not enough

The patch makes the base URL configurable. It still has to be told what the URL
is, or it falls back to the Vercel host.

**Vercel → your `memoryglen-v4` project → Settings → Environment Variables →
Add New:**

| Field | Value |
|---|---|
| Key | `SITE_URL` |
| Value | `https://memoryglen-v4.vercel.app` |
| Environments | tick **Production** and **Preview** |

Then **Save**, and **redeploy** — Vercel bakes environment variables in at build
time, so an existing deployment will not pick it up. Deployments → latest → ⋯ →
**Redeploy**.

Change the value to `https://memoryglen.com` on the day V4 becomes the real site.

### Confirm it worked

In the Vercel build log you should see:

```
[prerender] wrote 29 pages with Open Graph tags
[prerender] base URL: https://memoryglen-v4.vercel.app
```

If it says `base URL: http://localhost:5173`, the variable did not reach the
build — check the environment tick-boxes and redeploy.

---

## What the tags become

Before (live now, broken — points at a different Vercel project):

```
og:url    https://memoryglen.com/memorials/virginia-dadirayi-chiimba
og:image  https://memoryglen.com/virginia-portrait-blue-headscarf.jpg
```

After:

```
canonical https://memoryglen-v4.vercel.app/memorials/virginia-dadirayi-chiimba
og:url    https://memoryglen-v4.vercel.app/memorials/virginia-dadirayi-chiimba
og:title  Virginia Dadirayi Chiimba (1955–2025) — MemoryGlen
og:image  https://memoryglen-v4.vercel.app/virginia-portrait-blue-headscarf.jpg
```

---

## Last step — clear the cached previews

WhatsApp and Facebook cache link previews for days. Until you force a refresh you
will keep seeing the old broken card no matter what is deployed.

1. Go to **developers.facebook.com/tools/debug**
2. Paste `https://memoryglen-v4.vercel.app/memorials/virginia-dadirayi-chiimba`
3. Press **Scrape Again**
4. The preview should show her name, her dates and her portrait

Repeat for any other memorial you plan to share.

---

## Then check the phone fix

Open John Peters → **Family Tree** on your phone and swipe up through the tree.
The page should scroll normally. Before this patch it stuck against the canvas.

You will still see the full tree — legend, generation labels, "2 Glens" badges.
Only the drag-and-zoom canvas is gone below 1024px, and it is still there on a
laptop.
