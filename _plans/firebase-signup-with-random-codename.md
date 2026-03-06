# Plan: Firebase Auth Signup with Random Codename

## Context

The signup form currently only logs email/password to the console. This plan wires it up to Firebase Auth, generates a random office-heist codename for each new user, sets it as their `displayName`, and creates a Firestore document in the `users` collection with `id` and `codename` (no email).

## Answers to Open Questions

- **Word lists**: Hardcoded in the utility file (no external dependency needed).
- **Post-signup redirect**: `/heists` (the main authenticated dashboard).
- **Firestore document ID**: Firebase UID (standard pattern, enables O(1) lookup by user).

## Key Discovery: `lib/firebase.ts` already exists

The spec references `lib/firebase/config.ts`, but the file already lives at `lib/firebase.ts` and already exports `auth` and `db` via env vars. `AuthContext` and other code already import from `@/lib/firebase`. **No new Firebase config file is needed** — we reuse the existing one.

---

## Files to Create

### 1. `lib/utils/generateCodename.ts`
- Define three word arrays (each ~15–20 unique words), themed around office heists:
  - Set A: action adjectives (e.g., `Silent`, `Swift`, `Phantom`, `Rogue`…)
  - Set B: color/descriptor adjectives (e.g., `Crimson`, `Cobalt`, `Velvet`, `Shadow`…)
  - Set C: nouns (e.g., `Fox`, `Vault`, `Eagle`, `Cipher`…)
- Export `generateCodename(): string` — picks one word randomly from each set and concatenates them in PascalCase (e.g., `SilentCrimsonFox`).

### 2. `tests/utils/generateCodename.test.ts`
- Test: return value is a non-empty string.
- Test: output matches PascalCase pattern (each segment starts uppercase, no spaces).
- Test: result is composed of exactly one word from each of the three lists.
- Test: each word list has no duplicate entries.

---

## Files to Modify

### 3. `components/AuthForm/AuthForm.tsx`
Add two optional props:
- `onSubmit?: (email: string, password: string) => Promise<void>` — custom submit handler; falls back to the current console.log if absent.
- `error?: string | null` — displays an error message below the form inputs when set.
- Add a `loading` boolean state internally; set to `true` while the async `onSubmit` is running, disable the submit button during loading, reset on completion.

### 4. `app/(public)/signup/page.tsx`
Convert to a Client Component (`"use client"`):
- Manage `error: string | null` state.
- Implement `handleSignup(email, password)`:
  1. Call `createUserWithEmailAndPassword(auth, email, password)` from `firebase/auth`.
  2. Generate codename via `generateCodename()`.
  3. Call `updateProfile(user, { displayName: codename })`.
  4. Call `setDoc(doc(db, "users", user.uid), { id: user.uid, codename })` using `firebase/firestore`.
  5. Redirect to `/heists` via `useRouter().push("/heists")`.
  6. On Firebase error, map the error code to a user-friendly message and set `error` state (cover `auth/email-already-in-use`, `auth/weak-password`, generic fallback).
- Pass `onSubmit={handleSignup}` and `error={error}` to `<AuthForm>`.

---

## Imports Summary

| In signup page | Source |
|---|---|
| `createUserWithEmailAndPassword`, `updateProfile` | `firebase/auth` |
| `doc`, `setDoc` | `firebase/firestore` |
| `auth`, `db` | `@/lib/firebase` |
| `generateCodename` | `@/lib/utils/generateCodename` |
| `useRouter` | `next/navigation` |

---

## Verification

1. Run `npm test` — all existing tests pass, new `generateCodename` tests pass.
2. Start dev server, navigate to `/signup`, submit valid credentials → user created in Firebase Auth console with a PascalCase `displayName`, Firestore `users` collection gains a document with `id` + `codename` only, browser redirects to `/heists`.
3. Submit with an already-registered email → error message displayed in the form.
4. Submit with a password < 6 chars → error message displayed in the form.
