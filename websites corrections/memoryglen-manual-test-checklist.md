# MemoryGlen — Manual Test Checklist

**Do this on your own phone, on mobile data, not wifi.** You want to feel the page weight your users feel.
Time needed: about 25 minutes.
Write findings in the boxes as you go — don't rely on remembering.

---

## Before you start

- Phone, mobile data on, wifi off
- A notes app open, or print this
- One other phone if possible (iPhone if yours is Android, or the reverse)

---

## PART 1 — The five-minute triage

The highest-value five minutes. Do these first.

**1.1** Open `https://memoryglen-v4.vercel.app` fresh (clear the tab, don't use history).

- [ ] Loads in under 3 seconds
- [ ] "Create a Memorial" button visible without scrolling
- [ ] "View Demo Memorial" button visible without scrolling
- [ ] Exactly two buttons in the hero, not three or more

Time it actually took: ______

**1.2** Without scrolling, read only what's on screen. Then answer:

- [ ] Can you state what MemoryGlen is in one sentence, using only what's visible?
- [ ] Is the price or "free" status findable without clicking?

**1.3** Tap "View Demo Memorial".

- [ ] It opens John Peters
- [ ] It opens on the Story tab, not the Family Tree
- [ ] The page is not blank on first load

Which tab did it land on: ______

---

## PART 2 — Confirm the three known bugs

**2.1 — Default tab redirect**

Open each of these fresh, directly, no query string:

| Memorial | Lands on which tab? | Expected: Story |
|---|---|---|
| `/memorials/john-peters` | | |
| `/memorials/tendai-moyo` | | |
| `/memorials/virginia-dadirayi-chiimba` | | |

Server checks already confirmed Virginia redirects to `?tab=tree` and the other two do not. Confirm what you actually see, and note **what is different about her record** — is the Story tab empty? Is a video attached differently?

Notes: ______________________________

**2.2 — Duplicate Family Tree**

Open `/memorials/virginia-dadirayi-chiimba?tab=tree`

- [ ] Tree content appears once, not twice
- [ ] Same check on John Peters
- [ ] Same check on Tendai Moyo

Appears duplicated on: ______

**2.3 — Video in wrong place**

On Virginia's memorial:

- [ ] Is the video a top-level tab, or under Media/Videos?
- [ ] Compare: where does video sit on John Peters?

Notes: ______________________________

**2.4 — Double sign-in on /plans**

Open `https://memoryglen-v4.vercel.app/plans`

- [ ] Sign-in section appears once only
- [ ] Pricing is stated clearly
- [ ] No duplicated or overlapping blocks

---

## PART 3 — Tab structure across memorials

Open all three memorials and fill this in. This is the uniformity test — the one AIs kept scoring out of 10 without looking.

| Tab name | John Peters | Virginia | Tendai Moyo |
|---|---|---|---|
| Story | | | |
| Journey | | | |
| Family Glen | | | |
| Family Tree | | | |
| Photos | | | |
| Video | | | |
| Voices | | | |
| (other) | | | |

Mark each: **F** = present with content, **E** = present but empty, **—** = not present

- [ ] Every memorial has the same tabs in the same order
- [ ] No tab opens to an empty state
- [ ] Every tab opens on the **first** tap

Tabs that needed two taps: ______

---

## PART 4 — Family Tree on mobile

On each memorial's tree tab:

- [ ] Readable without pinch-zooming
- [ ] No horizontal scrolling
- [ ] Generation labels visible
- [ ] Each card shows the person's relationship (Mother, Uncle, etc.)
- [ ] Multi-Glen badge visible where it applies
- [ ] Explanatory note about multi-Glen membership is present
- [ ] Cards big enough to tap comfortably
- [ ] Looks the same structurally on all three memorials

Worst of the three: ______

---

## PART 5 — The WhatsApp test (most important single test)

This is your distribution channel. Test it properly.

**5.1** Send yourself a memorial link in WhatsApp.

- [ ] Preview shows the person's **name**
- [ ] Preview shows their **years**
- [ ] Preview shows their **portrait**

Repeat for all three. Tendai is expected to show the generic site hero image rather than a portrait — confirm.

| Memorial | Name | Years | Correct photo |
|---|---|---|---|
| John Peters | | | |
| Virginia | | | |
| Tendai Moyo | | | |

**5.2 — First-click behaviour**

Tap the link **from inside WhatsApp** (not copied into Chrome).

- [ ] Opens on the first tap
- [ ] Opens on the correct memorial
- [ ] Content renders, not a blank screen

Now the same link, copied into Chrome:

- [ ] Opens on the first tap

**If it fails in WhatsApp but works in Chrome, that's the bug** — WhatsApp's in-app browser handles client-side routing and service workers badly. Note exactly what you see: blank page, spinner, wrong tab, error.

What happened: ______________________________

**5.3** Test the in-app WhatsApp share button, if one exists.

- [ ] Button exists on memorial pages
- [ ] Produces a sensible pre-filled message
- [ ] The link in the message works

---

## PART 6 — Registration

Use a real email you can check.

- [ ] Sign-up form loads
- [ ] Can submit without a validation error
- [ ] Confirmation email arrives (check spam)
- [ ] Confirmation link works and lands somewhere sensible
- [ ] Can log out and log back in
- [ ] Password reset works

Time from submit to email arriving: ______
Errors seen: ______________________________

**Then, critically:**

- [ ] Open a memorial link in a private/incognito window while logged out.
- [ ] Does viewing a memorial require an account?

**If viewing requires login, stop and fix that before anything else.** Someone receiving a link at a funeral must never hit a sign-up wall.

---

## PART 7 — Creation flow

Start creating a memorial. Go all the way through, one-handed, on the phone.

- [ ] Every field is tappable without zooming
- [ ] Photo upload from camera roll works
- [ ] Can go back a step without losing entered data
- [ ] Reached the end without frustration

Where you hesitated or got stuck: ______________________________

The number of steps: ______

---

## PART 8 — General mobile hygiene

Across the whole site:

- [ ] No horizontal scrolling anywhere
- [ ] No text too small to read comfortably
- [ ] No overlapping elements
- [ ] No broken images
- [ ] Audio players for voice notes are large enough to use
- [ ] Photo lightbox: swipe works, pinch-zoom works, close button reachable
- [ ] Nothing hidden under the notch or home bar

**PWA check:**

- [ ] Chrome offers "Add to Home Screen" / Install
- [ ] If installed, it opens without browser chrome
- [ ] The app icon looks correct, not a generic globe

---

## PART 9 — Console

Desktop Chrome, DevTools open, mobile emulation on.

- [ ] Homepage: no red errors
- [ ] John Peters: no red errors
- [ ] Virginia: no red errors
- [ ] Tendai Moyo: no red errors

Copy any red errors verbatim — they're the fastest route to a fix:

______________________________

Also, Network tab, reload a memorial:

Total page weight: ______ (target: under 1.5 MB)

---

## PART 10 — Record and send

Write up in this format and hand it to whichever AI is doing the fixes:

```
BROKEN — [what], on [exact URL], [what I saw]
BROKEN — ...

INCONSISTENT — [tab/section] present on [X] but not [Y]

MOBILE — [what], on [page]

CONSOLE ERRORS —
[paste verbatim]
```

Only report what you saw. If something worked, don't list it.

---

# PART 11 — The five-person comprehension test

Separate exercise. Do this after the fixes land, not before.

**Setup**

Five people. At least one who has lost a close family member. At least one older relative who isn't comfortable with technology. Their own phones, not yours.

**Script — say exactly this and nothing more:**

> "Have a look at this website and tell me what you think it is."

Then hand them the phone and **say nothing else.** Not one word of explanation, however badly you want to. Every hint you give destroys the data.

**Record, per person:**

| | P1 | P2 | P3 | P4 | P5 |
|---|---|---|---|---|---|
| Seconds until they could say what it is | | | | | |
| First thing they tapped | | | | | |
| Did they find the demo memorial unprompted? | | | | | |
| Did they understand "Family Glen"? | | | | | |
| Where did they get stuck or confused? | | | | | |
| Did they ask what it costs? | | | | | |

**After they've explored freely, then ask:**

1. "Who do you think this is for?"
2. "What would you do next if you wanted to use it?"
3. "Would you trust it with your family's photos? Why or why not?"
4. "What would stop you from using it?"

Write their answers verbatim. Do not paraphrase and do not argue with any of them.

**How to read the results**

- **Under 5 seconds to understand it, for 4 of 5 people** → the homepage works. Move on.
- **Anyone takes over 15 seconds** → the hero needs rewriting, not tweaking.
- **Anyone asks "is this for dead people or living people?"** → the headline is too abstract.
- **Trust question gets hesitation from 2+ people** → your permanence and ownership copy isn't doing its job.
- **Nobody asks about price** → they haven't understood it well enough to care yet. That's worse than a price objection.

The older, less technical relative will find things nobody else does. Weight their confusion heavily.
