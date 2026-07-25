# Living Legacy — "How I Want to Be Remembered"

**Status: PLANNED — not built. This note records scope and placement only.**
Added to the plan 25 July 2026. No implementation in this branch.

---

## The one thing to know before building

**Living Legacy already exists in this repo — as marketing copy, not as product.**

It is currently a persuasion surface inside the John Peters demo, plus a
homepage feature card and a pricing-tier mention. There is no profile, no
vault, no trustee record, no activation logic. Nothing is stored.

Existing surfaces:

| File | What's there today |
|---|---|
| `src/pages/john-peters/LegacyTab.tsx` | The full pitch — hero, three "stories" (young mother, father with months, careful planner), sealed-message cards, `WhatsIncluded` feature list, pricing note, CTA |
| `src/pages/Home.tsx:170` | Feature card, `/living-legacy-hero.jpg` |
| `src/pages/Plans.tsx` | Gated to **Legacy** (R299/mo) and included in **Forever Glen** one-time |
| `src/pages/FuneralParlours.tsx:164` | Funeral-preferences bookings pitched to parlour partners |
| `src/components/ServiceProviderRail.tsx:53` | Rail is explicitly forbidden on Living Legacy dashboards |
| `src/pages/john-peters/TreeTab.tsx:344` | "Living Legacy member" lock badge |

So this feature is **not new** — it is *making the existing promise real*.
The demo has been selling it since the John Peters build.

### ⚠️ Discrepancy to resolve before any build

`LegacyTab.tsx` line ~402 advertises **"5-Trustee activation with death
verification."** The brief specifies **2–3 trustees**. These contradict each
other and the demo is live. Pick one and align both — Gilbert's call.

The demo also already advertises a **"Digital Will — wishes only, labelled
non-legal"**, which matches the brief's non-legal requirement. That framing is
correct and should carry through to the real product verbatim.

---

## Scope as briefed

- Living people open a **private** profile while still alive
- Write life story, upload photos, record voice notes
- Leave **birthday / anniversary messages** for loved ones, sealed until a date
- Profile stays **private until activated** by the person or their trustees
- Appoint **2–3 trustees** with clear instructions
- **Not a legal will** — a personal memory and instruction tool
- Later: **payment partner** so diaspora family can send contributions

---

## Where it fits

### Route
New top-level `/living-legacy` (authenticated dashboard), sibling to
`/memorials`. **Not** a memorial route — a living profile is not a memorial and
must never render under `/memorials/:slug`, or it will collide with the
dataset fallback wired in this branch.

### Data
New `src/data/livingLegacy.ts`. Deliberately **separate from
`src/data/memorials.ts`** — memorials are public and static; a living profile
is private, mutable, and per-user. On activation a profile *becomes* a memorial;
that conversion is the interesting engineering problem and should be designed
before either schema is frozen.

### Components already available to reuse
`AudioPlayer` (voice notes), `Timeline` (life story), `PrivacyBadge`
(inner-circle / family / public tiers already exist), `Reveal`, `StatBand`,
`QRShareBlock`. The `SealedMessageCard` in `LegacyTab.tsx` is currently a local
component and should be promoted to `src/components/` when the real vault is
built.

### Backend — the real dependency
Everything above is presentational. This feature is the first in MemoryGlen
that **cannot be static**: it needs auth, private per-user storage, encryption
at rest for sealed content, scheduled release, and an activation workflow with
trustee verification. The current stack is a Vite SPA with no backend.
That decision gates the whole feature.

---

## Suggested phasing

| Phase | Scope | Gates |
|---|---|---|
| 0 | Resolve trustee count (2–3 vs 5). Align `LegacyTab.tsx`. | — |
| 1 | Auth + private profile shell; life story, photos, voice notes. Nothing sealed yet. | Backend decision |
| 2 | Trustee appointment (2–3), written instructions, activation workflow + verification. | Phase 1 |
| 3 | Sealed messages — birthday/anniversary, scheduled release, encryption at rest. | Phase 2 |
| 4 | Activation → memorial conversion. | Phases 2–3 |
| 5 | Diaspora contributions / payment partner. | Phase 1 + gateway approval |

---

## Payment partner (Phase 5) — flagged early because it is long-lead

Gateway approval is a slow, external process and should start well before
Phase 5 if contributions matter. The same evaluation is already open on
VitalChain (PayFast / Paystack / Peach), so **run one evaluation, not two** —
whichever is chosen there is the natural default here.

Cross-border contribution adds requirements the VitalChain evaluation may not
cover: multi-currency, non-ZA card acceptance, remittance/FX handling, and a
clear position on whether MemoryGlen holds funds or passes them through.
Holding other people's money is a materially different regulatory posture than
taking subscription payments — worth deciding deliberately, not by default.

There is an existing **Diaspora Family (R199/mo)** tier in `Plans.tsx`;
contributions should be reconciled with it rather than bolted on beside it.

---

## Open questions for Gilbert

1. Trustee count — 2–3 (brief) or 5 (live demo)?
2. What counts as verification for activation? Death certificate upload,
   trustee consensus, parlour-partner confirmation, or a timeout?
3. Can the person revoke or edit a sealed message after sealing it?
4. If trustees never activate, what happens — indefinite hold, or a dead-man
   timer?
5. Are contributions for funeral costs specifically, or general family support?
   That answer changes the regulatory framing.
6. Does Living Legacy stay gated to Legacy/Forever Glen as `Plans.tsx`
   currently promises?
