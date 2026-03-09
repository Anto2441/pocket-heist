# Plan: Login Form Functionality

## Context

The login page (`app/(public)/login/`) renders `<AuthForm>` but has no `onSubmit` handler — submitting the form only logs to the console. This plan wires it up to Firebase `signInWithEmailAndPassword`, displays a success message on the page when sign-in succeeds, and shows friendly error messages on failure.

---

## Key Discoveries

- `AuthForm` already accepts `onSubmit?: (email, password) => Promise<void>` and `error?: string | null`. No changes to `AuthForm` needed.
- `AuthForm` manages `loading` internally — it sets the submit button `disabled` while awaiting `onSubmit`, then resets it in `finally`. No external loading prop required.
- `AuthForm` renders errors via `{error && <p role="alert">{error}</p>}` — just pass the error string as a prop.
- The signup page (`app/(public)/signup/page.tsx`) is the established pattern: `"use client"`, `useState` for error, a `mapFirebaseError` helper, and `onSubmit={handler}` + `error={error}` passed to `AuthForm`.
- Success message must live in the login page (outside `AuthForm`), rendered alongside the form.

---

## Files to Modify

### 1. `app/(public)/login/page.tsx`

Convert to a client component and wire up Firebase auth:

- Add `"use client"`.
- Import `signInWithEmailAndPassword` from `firebase/auth` and `auth` from `@/lib/firebase`.
- `useState<string | null>(null)` for `error`.
- `useState<boolean>(false)` for `success`.
- `mapFirebaseError(code: string): string` helper mapping:
  - `auth/invalid-credential` or `auth/wrong-password` → `"Incorrect email or password."`
  - `auth/user-not-found` → `"No account found with that email."`
  - `auth/invalid-email` → `"Please enter a valid email address."`
  - `auth/too-many-requests` → `"Too many attempts. Please try again later."`
  - Fallback → `"Something went wrong. Please try again."`
- `handleLogin(email, password)` async function:
  - Clears `error` and `success` at the start of each attempt.
  - Calls `signInWithEmailAndPassword(auth, email, password)`.
  - On success: sets `success = true`.
  - On error: maps the Firebase error code with `mapFirebaseError`, sets `error`.
- Render `<AuthForm ... onSubmit={handleLogin} error={error} />`.
- Render `<p>Login successful</p>` (or styled element) below the form when `success` is true.

### 2. `tests/pages/LoginPage.test.tsx` *(new file)*

Mock `signInWithEmailAndPassword` from `firebase/auth` and `auth` from `@/lib/firebase`.

Tests to include:
- **Success**: mock resolves → "Login successful" is visible.
- **Wrong credentials**: mock rejects with `auth/invalid-credential` → error message visible.
- **User not found**: mock rejects with `auth/user-not-found` → error message visible.
- **Button disabled while pending**: use a deferred promise to assert button is disabled mid-flight.
- **Button re-enabled after completion**: assert button is enabled after resolve or reject.
- **State clears on resubmit**: on second submit, previous success/error message disappears before new result.

---

## Verification

1. Run `npm test` — all existing tests pass, new `LoginPage` tests pass.
2. Start dev server, visit `/login`, submit with invalid credentials → friendly error appears.
3. Submit with valid credentials → "Login successful" appears alongside the form, no redirect occurs.
4. Modify fields and resubmit → previous success/error message clears before the new result appears.
