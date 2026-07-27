# Virginia — The Journey and the Family Glen

Branch `feat/virginia-portrait-and-origin-family` (three commits), off `main` @ `4877d2d`.
**Nothing merged. Nothing deployed.** Patch verified: applies clean, builds, lints, 47 checks pass.

Your instruction arrived identical to the previous one, so rather than repeat the
proposal I built it — taking the **conservative default on every open question**.
Each is one line to reverse.

---

## The one thing I did differently from your instruction

**I did not convert two demo memorials.** I created two clean entries instead.

You said I *may* convert. Here is what conversion would have inherited: each demo
persona carries **nine invented biography paragraphs, six invented tributes signed
by people who do not exist, an invented hymn and an invented voice recording**.
Renaming one to *Chari Chiimba* would have put a fictional life story on your
grandfather.

So: two new entries, exactly as we did for the Peters family. `unlisted`, holding
only the four facts you gave me. **All nineteen demo memorials remain intact and
unrenamed** — the investor set is whole.

If you still want them converted, say so and I'll do it. But I wasn't going to on
a re-paste.

---

## 1. The Journey — six stages

| | Stage | Date |
|---|---|---|
| 1 | Her Passing | 19 May 2025 |
| 2 | Family Coordination and Planning | Early October 2025 |
| 3 | Tombstone Preparation | 14 – 24 October 2025 |
| 4 | Memorial Service and Tombstone Unveiling | Saturday 25 October 2025 |
| 5 | After the Service | 26 – 30 October 2025 |
| 6 | Ongoing Remembrance | Every year |

Rendered as a vertical timeline with a brass node at each stage.

**The Coordinating Team**, named with roles, in stage 2:

| | |
|---|---|
| Rev Chinyowa | Methodist Revival Church (MRC) |
| Sekuru Robson | Master of Ceremonies |
| Sekuru Joachim Mushore | Her brother |
| Raymond · Gilbert · Douglas · Hamu | Her sons |

**The full order of service** in stage 4 — all nine items, opening prayer through
lunch, with Rev Chinyowa named at the prayer and the unveiling.

One sentence I added because the record supports it: the service was held at
Mushore Homestead in Seke, *her own family's homestead, and the home of her
brother, Sekuru Joachim Mushore.*

No emotional language. No events not in your record.

### Three defaults I took — all reversible

**1. The photograph album link is not published.** The gallery holds many living
relatives at a private gathering; a public search-indexed page would make it
findable by anyone. The album is noted as existing and *"held by the family."*
Same reasoning you accepted on your grandparents' anniversary venue. Say the word
and the link goes in.

**2. WhatsApp handles are not published.** *South Ray*, *Giri* and *Para bellum*
are absent; Raymond, Gilbert, Douglas and Hamu appear instead.

**3. The gap between 19 May and October is left as a gap.** Your record doesn't
cover the burial, and I didn't invent a date for it. If there was a funeral in
May 2025 it should be stage 2, and everything after shifts down by one.

---

## 2. The Chiimba Family Glen

```
  CHARI CHIIMBA                     1905 – 1980   →
  Grandfather · her father-in-law

  MOSES SARIRE IVHU CHIIMBA         1943 – 2001   →
  Uncle · her brother-in-law

  VIRGINIA DADIRAYI CHIIMBA         1955 – 2025
  · this memorial · Seke, Zinganga

  Also remembered — resting places not yet recorded
  Victoria Mushore 1975–2016 · Joseph Mushore 1968–2024
```

Oldest first. Chari and Moses each link through to their own page.

**On the relationship framing** — I used both, the way Sekuru and Amaini worked
on the Mushore side. Family term as your children say it, her own relation
beneath, since Chiimba is her married name. One line to change if you'd rather
have one or the other alone.

---

## 3. Chari's and Moses's pages

New `awaitingContent` flag. Rather than a page of empty section shells, they
render:

- Name and years, in the forest hero
- Their relation to the family
- Chiimba Family Glen as resting place
- *"This memorial is being written by the family."*
- Their own QR code
- A link back to the Family Glen

**No biography. No tributes. No hymn. No voice note. No timeline.** Verified in
code, not just by eye.

---

## Verified

47 checks, all passing. Beyond the new work:

| | |
|---|---|
| Hymn — Mwari, both stanzas | ✅ |
| Poem — "you we still find" preserved | ✅ |
| Both tribute sets, all eleven | ✅ |
| **Her Happy New Year recording** | ✅ |
| All nine biography paragraphs | ✅ |
| Sekuru Johannes, Ambuya Juliana, all ten siblings | ✅ |
| No demo banner on her page | ✅ |
| 19 demo memorials intact, none renamed | ✅ |
| John Peters intact | ✅ |

---

## To apply

```bash
cd /path/to/memoryglenV4
git checkout main && git pull
git checkout -b feat/virginia-journey-and-glen
git am < virginia-journey-and-glen.patch
npm install && npm run build
git push -u origin feat/virginia-journey-and-glen
```

Three commits land together: her portrait and the Mushore family, the five-room
standard, and the Journey and Glen.

On the preview: walk all five rooms, then Glen → Chari → back, and **play the
voice note**.

---

## Open

1. Was there a burial in May 2025? If so it becomes stage 2.
2. Photograph album — publish the link, or leave as is?
3. Convert demo memorials after all, or keep the clean entries?
4. Living Legacy room on a real memorial — keep the product pitch, soften it, or drop it?
5. Phase 2 — the other 22 memorials onto the five-room shell.

Still awaited: her early life and working years, tributes from Eddie, Taka and
Nyasha, the full photograph set, MRC details, the remaining booklet PDFs.
