# Merge & Deploy — Virginia's corrections

**Repo:** `Vitalchain76/memoryglenV4`
**Base:** `main` @ `cb71416` (PR #3, Peters family + homepage — already merged)
**Patch:** `virginia-hymn-tributes.patch`

Verified against `cb71416` immediately before writing this: applies clean, builds,
lints, and all 17 content checks pass.

---

## Option A — PR then merge (recommended, gives you a preview first)

```bash
cd /path/to/memoryglenV4
git checkout main && git pull

git checkout -b feat/virginia-hymn-tributes
git am < virginia-hymn-tributes.patch

npm install
npm run build                     # must succeed

git push -u origin feat/virginia-hymn-tributes
```

GitHub prints a "Compare & pull request" link in the push output — open it,
create the PR, and Vercel attaches a preview build to it.

**Check on the preview before merging:**

- `/memorials/virginia-dadirayi-chiimba` — hymn reads **Mwari**, two stanzas,
  English beneath
- Scroll to tributes — *Family Tributes*, then *From the Memorial Booklet*,
  then the panel holding a place for Eddie, Taka and Nyasha
- The poem — four stanzas, and the line reads *"In every thought, you we still find"*
- **Play the voice note.** Confirm her Happy New Year message still plays.
- `?tab=family` — "Her Parents and Siblings" section
- Homepage — John Peters leads, no large portrait of your mother, footer credit present

Then merge the PR on GitHub. Vercel deploys `main` automatically.

## Option B — straight to main

If you'd rather skip the PR:

```bash
cd /path/to/memoryglenV4
git checkout main && git pull
git am < virginia-hymn-tributes.patch
npm run build
git push origin main
```

Vercel deploys on push. No preview step.

---

## If `git am` stalls

```bash
git am --abort
git apply virginia-hymn-tributes.patch
git add -A
git commit -m "Virginia: correct the hymn, restore the booklet poem, carry both tribute sets"
```

Same result, one commit instead of the original message.

---

## What lands

| | |
|---|---|
| `src/pages/virginia/data.ts` | Hymn corrected + expanded; booklet poem; two tribute sets; held places |
| `src/pages/virginia/OverviewTab.tsx` | Renders both tribute sets, awaited panel, hymn with English, four-stanza poem, epigraph |
| `src/pages/virginia/FamilyTab.tsx` | "Her Parents and Siblings" |
| `src/pages/virginia/LifeStoryTab.tsx` | Follows the `TRIBUTES` → `FAMILY_TRIBUTES` rename |

Four files. No new assets. Nothing removed from her page.

---

## Note on production

This deploys **memoryglen-v4.vercel.app**.

Root **memoryglen.com** is a different Vercel project (`dadirayi-memory-park`) and
is untouched by this. Your standing rule holds — nothing goes to the root domain
without your exact words: *"deploy to production approved."*

---

## Still open, for the follow-up branch

- Section 9, The Final Journey — waiting on the WhatsApp .txt export
- The 16 photographs — waiting on your originals
- A larger original of the lectern photograph
- Early life and working years
- Her parents' and nine siblings' names
- Tributes from Eddie, Taka, Nyasha
- Photographs from the 25 October unveiling; anything from the MRC
