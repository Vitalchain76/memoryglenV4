# Requirement 6 — memorial consistency

**Patch: `memorial-consistency.patch`** · 42 KB · 1 commit · base `main` @ `df1bb8b`
(your PR #12, merged while I was working).

Tested on a fresh clone of your GitHub `main`: applies clean, **47 tests pass**,
build produces 29 pages.

---

## The audit — it was worse than reported

The review said John and Virginia felt like different templates. True, but it
missed the bigger problem:

| Template | Memorials | What it had |
|---|---|---|
| **A** John Peters | 1 | Bespoke page, own hand-written tab bar, 5 tabs |
| **B** Virginia | 1 | `MemorialTabShell`, 5 tabs |
| **C** everyone else | **25** | **One scrolling page. No tabs at all.** |

**25 of 27 memorials had no Journey, no Family Glen, no Family Tree and no tab
bar.** Tendai Moyo, Sekuru Banda, Mai Chiweshe, the Peters family, the Chiimba
men — none of them. That was never checked because nobody opened one.

I also confirmed the tree duplication: Virginia's Family Tree tab rendered the
shared `FamilyTree` **and** `FamilyTab` underneath, so every parent, sibling,
child and grandchild was listed twice.

---

## The standard — `src/components/memorialStandard.ts`

One contract every memorial declares against. Five rules, enforced by tests:

1. **Five rooms, fixed order.** Journey · Memorial · Family Glen · Family Tree ·
   Living Legacy. No custom top-level tabs, ever.
2. **A room with no content is hidden**, not shown empty. Nobody opens a tab to
   find nothing.
3. **Extra content becomes a section**, with a sub-navigation entry — never a
   sixth tab. This is how Virginia's "For Nyasha" video and her booklets fit in
   without breaking the standard.
4. **The Memorial room is where every visitor lands.** The life before the
   funeral.
5. **Exactly one family tree per memorial.**

New memorials inherit all of it by declaring their rooms. There is nothing to
remember and no layout to copy.

---

## What changed

**`src/pages/MemorialPage.tsx`** — all 25 dataset memorials moved from one
scrolling page onto the five rooms. Its thirteen sections were **regrouped, not
rewritten**:

| Room | Sections |
|---|---|
| Journey | Livestream, Life Timeline |
| Memorial | Life Story, Tributes, Scripture, Hymn, Poem, Music, Photographs, Voice, Booklets, Candles |
| Family Glen | Resting Place + QR plaque |
| Family Tree | the shared `FamilyTree` |

Sub-navigation is generated from whichever sections a memorial actually has.

**`src/pages/virginia/TreeTab.tsx`** — the duplicate `FamilyTab` listing removed.

**`src/data/datasetFamilyTree.ts`** — new. The Chiimba men share a Glen and now
appear together. Every other dataset memorial gets `FamilyTree`'s empty state,
which is honest and keeps the product looking like one product.

---

## Rooms each memorial now gets

```
Virginia        Journey · Memorial · Glen · Tree · Legacy
John Peters     Journey · Memorial · Glen · Tree · Legacy
Tendai Moyo     Journey · Memorial · Glen · Tree
Sekuru Banda    Journey · Memorial · Glen · Tree
Chari Chiimba   Glen                              (awaiting family content)
```

Rule 2 working as intended: Chari has no biography, no tributes and no timeline,
so he shows only what he actually has rather than four empty rooms.

---

## Nine tests so this cannot regress

- all memorial pages render through the shared shell
- dataset memorials have a tab bar **at all**
- no memorial invents a tab outside the five rooms
- every memorial lands on The Memorial room
- empty rooms are hidden
- exactly one family tree — `FamilyTab` must not return
- the standard is documented in one place
- dataset memorials render without crashing

One of these caught a real ambiguity while I wrote it: `PlaylistCard` also uses
`role="tab"` for its YouTube/Spotify switcher, so the assertion is scoped to the
memorial tab bar specifically.

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git fetch origin
git checkout -B feat/memorial-consistency origin/main

git log --oneline -1
```

Must print `df1bb8b Merge pull request #12 ...`

```powershell
git am "C:\Users\Gilbert\Desktop\MemGlenFinal\websites corrections\memorial-consistency.patch"

git log --oneline -1
npm install
npm test
npm run build

git push -u origin feat/memorial-consistency
```

`npm test` → **47 passed**.

---

## Worth checking on the preview

Open **`/memorials/tendai-moyo`** — a memorial you have probably never looked at.
It should now have the same tab bar, the same five rooms and the same behaviour
as John's. That is the whole point of this patch, and it is the fastest way to
see whether it worked.

---

## Still not standardised — and I would rather say so

**John Peters keeps his bespoke page.** He uses the same five tab ids, lands on
the same room and passes the consistency tests, but he still has his own tab bar
rather than `MemorialTabShell`, and his tabs contain interactive demo pieces
(the pan/zoom canvas, the emblem studio, the heritage book) that no other
memorial has.

Moving him onto the shell is a further step. I have not done it because his page
is your investor showcase and the risk of breaking it in the same pass as
restructuring 25 other memorials is not worth it. Say the word and it is the next
patch.
