# The Five-Room Memorial — platform standard, Virginia first

Branch `feat/virginia-portrait-and-origin-family` (two commits), off `main` @ `4877d2d`.
**Nothing merged. Nothing deployed.** Patch verified: applies clean, builds, lints, 44 checks pass.

Confirmed: the five tabs are the product, not a demo. Every memorial gets them.

---

## ⚠️ The thing you need to know first

**Virginia's memorial already had *ten* tabs. John Peters has five.**

| | |
|---|---|
| **Virginia (real)** | Overview · Life Story · Gallery · Videos · Voice Notes · Funeral · Family · Guestbook · Digital Candles · Anniversary Room |
| **John Peters (demo)** | Journey · Memorial · Glen · Tree · Legacy |

So "apply the five-tab structure to Virginia" could have meant deleting half her
page. **It didn't.** Her ten tabs were *redistributed into* the five rooms, not
replaced by them:

| Room | What now lives in it |
|---|---|
| **1. Journey** | Funeral & Memorial Events · service videos · Anniversary Room · *(held place for the coordination account)* |
| **2. Memorial** | Overview · Life Story · Gallery · Videos · Voice Notes · Guestbook · Digital Candles — reachable from sub-navigation in the tab bar |
| **3. Family Glen** | Her resting place at Seke, Zinganga — real photographs, QR plaque |
| **4. Family Tree** | Sekuru Johannes & Ambuya Juliana · the ten children · her seven · her eighteen |
| **5. Living Legacy** | The Living Legacy room |

**Nothing was deleted.** I proved it rather than asserting it — see below.

---

## Proof that nothing was lost

I rendered all five rooms and checked her content item by item. All 44 pass:

| | |
|---|---|
| All nine biography paragraphs | ✅ |
| Hymn — Mwari, both stanzas, Watts English | ✅ |
| Poem — four stanzas, "you we still find" preserved | ✅ |
| Both scriptures | ✅ |
| Family Tributes — all seven | ✅ |
| From the Memorial Booklet — all four | ✅ |
| Held places for Eddie, Taka, Nyasha | ✅ |
| **Her Happy New Year voice recording** | ✅ |
| All gallery captions | ✅ |
| Memorial booklets | ✅ |
| Life timeline | ✅ |
| All twelve digital candles | ✅ |
| Guestbook | ✅ |
| Funeral events + service videos | ✅ |
| Anniversary room | ✅ |
| Parents, marked Living | ✅ |
| All ten siblings with Sekuru / Amaini | ✅ |
| Her seven children, her eighteen grandchildren | ✅ |
| No demo banner on her page | ✅ |
| Anniversary venue still unpublished | ✅ |

Also verified untouched: John Peters' five tabs, the homepage, and the dataset
memorials.

---

## The framework — this is the part that scales

Two new files make the five rooms a platform standard rather than a one-off:

**`src/components/memorialTabs.ts`** — canonical ids, labels, order, types.

**`src/components/MemorialTabShell.tsx`** — the reusable shell. Owns the tab
contract only: sticky bar, `?tab=` URL state, sub-navigation, transitions. It
renders whatever sections a memorial supplies, so a memorial with a great deal of
content and one with very little both get the same five rooms.

Any future memorial gets the structure by supplying five pieces of content:

```tsx
<MemorialTabShell
  tabs={[
    { id: 'journey',  content: <Journey /> },
    { id: 'memorial', content: <Memorial />, subnav: [...] },
    { id: 'glen',     content: <Glen /> },
    { id: 'tree',     content: <Tree /> },
    { id: 'legacy',   content: <Legacy /> },
  ]}
  defaultTab="memorial"
>
  <Hero />
</MemorialTabShell>
```

The ids match John Peters' bespoke page exactly, so `?tab=glen` behaves
identically on every memorial and the two stay interchangeable.

---

## Two things I did not invent

**The Journey room is deliberately thin.** You told me not to write the
coordination story without the family's record, and I didn't. The room holds a
place naming the Coordinating Team, the months of planning, and the 25 October
unveiling at Mushore Homestead — then says plainly: *"This account is being
written by the family, in the family's own words."* No Rev Chinyowa, no Sekuru
Robson, no invented detail. It fills the moment your export arrives.

**The Glen names Joseph and Victoria but gives them no plot.** Two of her
siblings have died — Joseph (2024) and Victoria (2016) — and I don't know where
either rests. They are named and remembered, marked *"not yet recorded"*. No
burial location invented, no marker placed on any map.

---

## Three things for you to rule on

**1. Living Legacy on a real memorial.** The Legacy room currently renders the
same content as John Peters' — which is a product pitch, including the R299/mo
tier. On a fictional demo that's a sales surface. On your mother's memorial, a
subscription pitch sits a little oddly next to her grave. Options: keep as is,
write a quieter family-facing version for real memorials, or drop the room from
hers. You said optional but preferred, so it's in — but I'd not leave it
unexamined.

**2. Which room visitors land in.** Hers currently opens on **Memorial**, so a
visitor sees her life first rather than her funeral. John's also opens on
Memorial. Say if you'd rather she opened on Journey.

**3. Phase 2 — the other 22 memorials.** The framework is built and Virginia is
on it. The nineteen dataset memorials and the three Peters family pages are still
single scrolling pages. Putting them on the shell is a separate, larger piece of
work, and I'd rather do it deliberately than half-do it now. Say the word and it
is the next branch.

---

## Files

| File | |
|---|---|
| `src/components/memorialTabs.ts` | **new** — canonical tab definitions |
| `src/components/MemorialTabShell.tsx` | **new** — reusable five-room shell |
| `src/pages/VirginiaMemorial.tsx` | rewired onto the shell |
| `src/pages/virginia/JourneyTab.tsx` | **new** |
| `src/pages/virginia/MemorialTab.tsx` | **new** — her seven content tabs, in order |
| `src/pages/virginia/GlenTab.tsx` | **new** |
| `src/pages/virginia/TreeTab.tsx` | **new** |
| `src/pages/virginia/TabBar.tsx` | now unreferenced; left in place one release in case you want to revert |

Also in this branch (from the previous step): her official portrait, the Mushore
parents and siblings, kinship terms, anniversary removed.

---

## To apply

```bash
cd /path/to/memoryglenV4
git checkout main && git pull
git checkout -b feat/five-room-standard
git am < five-room-standard-and-virginia.patch
npm install && npm run build
git push -u origin feat/five-room-standard
```

On the preview, walk all five rooms on her page and confirm the sub-navigation
in the Memorial tab reaches Overview, Life Story, Gallery, Videos, Her Voice,
Guestbook and Candles. **And play the voice note.**

This restructure is fully reversible — one commit, and her old tab bar is still
on disk.
