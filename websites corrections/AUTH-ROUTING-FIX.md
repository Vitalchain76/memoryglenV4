# Auth routing — found it, and it was blunt

**Patch: `auth-routing-fix.patch`** · 12 KB · 1 commit · base `main` @ `717ba2b`.
Tested on a fresh clone: applies clean, **67 tests pass**.

---

## The bug

`src/components/Navbar.tsx`:

```jsx
<Link to="/create" ...>
  Sign In        ← labelled "Sign In", linked to the memorial wizard
</Link>
```

**The header link labelled "Sign In" pointed at `/create`.** So did "Get Started".
Anyone trying to sign in landed on the memorial-creation wizard. Exactly what you
saw, and not a routing subtlety — the button was simply wired to the wrong place.

### Two things kept it hidden

**1. The real sign-in link hid itself.** I wrote `AccountLink` to disappear when
Supabase is unconfigured:

```jsx
if (!configured) return null;
```

That seemed tidy at the time. It was a mistake. With the anon key broken on the
live deployment, the genuine sign-in link vanished and the **only** remaining
button in the header was the mislabelled one. A broken configuration hid the
evidence of itself.

**2. `/register`, `/signup` and `/login` had no routes at all.** They fell through
to the catch-all.

---

## Fixed

| | |
|---|---|
| Header "Sign In" → `/create` | **removed** |
| `AccountLink` | now **always rendered**, never hides |
| "Get Started" → `/create` | now → `/register` (header and mobile drawer) |
| `/signin`, `/login`, `/sign-in` | → **Sign in** page |
| `/register`, `/signup`, `/sign-up`, `/create-account` | → **Create your account** page |

`/register` is a distinct page with its own heading and its own copy — not a
hidden toggle inside sign-in. It shares SignIn's form, so there is one
implementation and one place for bugs. Switching between them updates the URL, so
both are linkable and Back behaves.

The aliases exist because `/login` and `/signup` are what people type, and a
wrong turn at that exact moment loses the user.

**On hiding UI when a service is down:** I have stopped doing it here. The
sign-in page now explains plainly if accounts are not ready. A visible link that
says "not set up yet" is far better than no link at all — you would have found
this in a minute rather than after a deploy.

---

## PowerShell

```powershell
cd C:\path\to\memoryglenV4

git fetch origin
git checkout -B fix/auth-routing origin/main

git am "C:\Users\Gilbert\Desktop\MemGlenFinal\websites corrections\auth-routing-fix.patch"

npm install
npm test
npm run build

git push -u origin fix/auth-routing
```

**Note:** `launch-fixes.patch` from the previous message may still be unmerged.
Check with `git log --oneline -3`. If you do not see *"Diagnose the Supabase key,
surface the install button, quieten Virginia"*, apply that one too — it contains
the key diagnostics described below.

---

## Confirming the Supabase variables

**I cannot read your Vercel dashboard**, so I cannot confirm this from here. But
there are two checks you can run in under a minute.

### 1. Is the key reaching the browser at all?

Open the live site → **F12 → Console** → paste:

```js
console.log(
  'URL :', import.meta?.env?.VITE_SUPABASE_URL ?? '(not exposed at runtime)'
);
```

That will not work from the console — Vite inlines the values at build time. So
instead:

**F12 → Network → reload → click the main `index-*.js` file → Search (Ctrl+F)
inside it for `supabase.co`.**

- **Found, with your project ref `alwgebguexzlmokdqtbg`** → the variables reached
  the build. The problem is the key value itself.
- **Not found** → the variables did **not** reach the build. Re-add them and
  redeploy.

### 2. Once `launch-fixes.patch` is merged

That patch decodes the key at startup and prints the exact fault:

> `[MemoryGlen] Supabase is misconfigured: the key belongs to project "abc123"
> but the URL points at "alwgebguexzlmokdqtbg" — they are from different
> Supabase projects.`

Open the site, F12 → Console. If there is no such message, the key is structurally
correct and the fault is elsewhere.

### Reminder of what to do

**Vercel → Settings → Environment Variables.** **Delete both and re-add them** —
do not edit in place, that is how a trailing newline survives.

```
VITE_SUPABASE_URL       https://alwgebguexzlmokdqtbg.supabase.co
VITE_SUPABASE_ANON_KEY  <208 characters, no line break>
```

Copy the key with Supabase's **copy button** (Settings → API → `anon` `public`),
not by selecting the text. Tick **Production** and **Preview**. Save. **Redeploy.**

---

## After deploying, check these

1. `/signin` → **Sign in** page
2. `/register` and `/signup` → **Create your account**
3. `/login` → **Sign in**
4. Header **Sign in** → the sign-in page, not the wizard
5. Header **Get Started** → the register page
6. Try registering. If it still says the key is wrong, the console will now tell
   you exactly why.
