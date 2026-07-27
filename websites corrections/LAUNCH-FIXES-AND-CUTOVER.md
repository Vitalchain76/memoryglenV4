# Three fixes + domain cutover readiness

**Patch: `launch-fixes.patch`** · 16 KB · 1 commit · base `main` @ `717ba2b` (your PR #14).
Tested on a fresh clone: applies clean, **65 tests pass**.

---

## 1. "Invalid API key" — configuration, but the code was unhelpful

**First, a useful fact: the key you gave me is correct.** I decoded it:

```
project ref : alwgebguexzlmokdqtbg   ← matches your URL exactly
role        : anon                    ← correct, not service_role
expires     : 2036-07-24              ← not expired
length      : 208 characters
```

**So whatever is in Vercel is different from what you sent me.**

**And the error itself narrows it further.** My code hides the Sign in link
entirely when either variable is missing. You reached a registration form and got
a Supabase response — so **both variables are set**, and the key is present but
rejected. That rules out "missing" and leaves four causes, in order of
likelihood:

1. **Truncated on paste** — it is 208 characters and the tail is easy to clip
2. **A space or newline** in the value — Vercel preserves it, Supabase rejects it
3. **Key from a different Supabase project**
4. **URL and key pasted into each other's fields**

### What to do

**Vercel → Settings → Environment Variables.** Delete both variables and re-add
them. Do not edit in place — that is how trailing whitespace survives.

```
VITE_SUPABASE_URL       https://alwgebguexzlmokdqtbg.supabase.co
VITE_SUPABASE_ANON_KEY  <the anon public key, all 208 chars, no line break>
```

Copy the key from **Supabase → Settings → API → Project API keys → `anon` `public`**
using the copy button, not by selecting the text.

Tick **Production** and **Preview**, save, then **redeploy** — they are baked in
at build time.

### What the patch adds

The anon key is a JWT carrying its own project ref, so the app now decodes it at
startup and says exactly what is wrong:

> `[MemoryGlen] Supabase is misconfigured: the key belongs to project "abc123"
> but the URL points at "alwgebguexzlmokdqtbg" — they are from different Supabase
> projects.`

Open the site, press F12 → Console, and it will name the fault. Safe in the
browser: the anon key is public by design, and it logs structural facts only,
never the key.

The sign-in form also stops showing a raw database error to a grieving family. It
now reads: *"Accounts are not set up correctly on this deployment yet… nothing is
wrong on your side."*

---

## 2. PWA install not appearing — two causes, both addressed

**a) The rewrite could have swallowed the service worker.** The old rule was
`/((?!assets/).*)` → `/index.html`, which pattern-matches `/sw.js`. Vercel checks
the filesystem first so it probably did not fire, but if it ever had, registration
would fail **silently** — I catch registration errors — and the prompt would never
appear. Now excluded explicitly, with `Cache-Control: max-age=0` and
`Service-Worker-Allowed: /` headers.

**b) Chrome does not surface a visible prompt any more.** On most Android phones
the option sits in the ⋮ menu, exactly where you looked. The supported fix is to
capture `beforeinstallprompt` and offer your own button — so the patch adds one.

It appears **only when Chrome has confirmed the site is installable**, so it can
never be a button that does nothing. It hides once installed, and it is
dismissible.

**Note:** Chrome requires a *previous visit* before it will fire the event. After
deploying, open the site, close it, and open it again.

---

## 3. Demo priority — Virginia was still a second large card

She was a full `FeaturedCard` directly beneath John — same size, same weight,
competing for the same attention.

Now a quiet row: small portrait, **Founding Memorial** label, and one line —
*"the memorial MemoryGlen was built for."* Permanent and dignified, but no longer
competing. **John is now the only FeaturedCard on the directory.**

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git fetch origin
git checkout -B fix/launch-fixes origin/main

git am "C:\Users\Gilbert\Desktop\MemGlenFinal\websites corrections\launch-fixes.patch"

npm install
npm test
npm run build

git push -u origin fix/launch-fixes
```

---

# Domain cutover — are you ready?

**Not yet. Four things first, and one of them is not a small matter.**

### ⚠️ memoryglen.com is currently serving a different project

`memoryglen.com` points at the **`dadirayi-memory-park`** Vercel project. That is
a live site, and it is the one your mother's memorial has been on. **Repointing
the domain takes it down.**

Before you touch DNS:

1. **Open `memoryglen.com` and see what is actually there today.** If family have
   that link, they will get V4 instead the moment you switch.
2. **Check whether anyone has shared it** — WhatsApp messages, the QR plaque, the
   memorial booklet. A QR code on a brass plaque cannot be edited later.
3. **Decide what happens to the old project.** Keep it on a subdomain, or retire
   it deliberately.

This is the one that would hurt, and it is not a technical problem.

### Blocking

| | |
|---|---|
| **Supabase key** | Registration is broken. Fix before, not after. |
| **`SITE_URL`** | Must become `https://memoryglen.com` at cutover, then redeploy — otherwise every share link points at the vercel.app host forever. |
| **Legal review** | Terms and Privacy are not lawyer-reviewed, and the POPIA Information Officer is still a placeholder. You will be storing data about living people. |
| **The old project** | See above. |

### Not blocking, but do them soon

- Google login — needs the OAuth client created in Google Cloud and pasted into
  Supabase. Tell me when the provider is on and the button is twenty lines.
- WhatsApp first-click — still unreproduced. Send a screen recording.
- John on the shared shell.

### The cutover itself, when you are ready

1. **Vercel → memoryglen-v4 → Settings → Domains → Add** `memoryglen.com` and
   `www.memoryglen.com`.
2. Vercel will say the domain is in use by another project. **Remove it from
   `dadirayi-memory-park` first.**
3. At **domains.co.za**, point the records Vercel shows you — usually an `A`
   record for the apex to `76.76.21.21` and a `CNAME` for `www` to
   `cname.vercel-dns.com`. Use whatever Vercel displays; it is authoritative.
4. Wait for the SSL certificate to issue — usually minutes, up to an hour.
5. **Change `SITE_URL` to `https://memoryglen.com` and redeploy.**
6. **Supabase → Authentication → URL Configuration** — add `https://memoryglen.com`
   to the redirect allow-list, or email confirmation links will bounce.
7. Re-scrape share cards at **developers.facebook.com/tools/debug**.
8. Test: home, a memorial, registration, and install on Android.

DNS is reversible; a QR plaque is not. Take step 1 slowly.
