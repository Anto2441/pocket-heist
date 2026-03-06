# Plan: Auth State Management with useUser Hook

## Context

The app has Firebase Auth already initialised in `lib/firebase.ts` (exports `auth`), but no global state management for the current user. Components that need user data currently have no way to access it. The goal is to add a React context that listens to Firebase's `onAuthStateChanged` and exposes the current user through a `useUser` hook — usable in any page or component. The spec confirms the hook should return `{ user: User | null, loading: boolean }`.

## Files to create

### `contexts/AuthContext.tsx`

- Mark as `"use client"` (required for Next.js App Router — uses state + effects)
- Create `AuthContext` with shape `{ user: User | null, loading: boolean }`
- `AuthProvider` component:
  - State: `user` (initial `null`) and `loading` (initial `true`)
  - `useEffect` → subscribe to `onAuthStateChanged(auth, ...)` from `firebase/auth`
  - On each auth state change: update `user` and set `loading: false`
  - Cleanup: unsubscribe on unmount (return value of `onAuthStateChanged`)
  - Render `<AuthContext value={{ user, loading }}>{children}</AuthContext>`

### `hooks/useUser.ts`

- `useUser()` hook:
  - Calls `useContext(AuthContext)`
  - If context is `undefined`, throw `Error("useUser must be used within AuthProvider")`
  - Returns `{ user, loading }`

## Files to modify

### `app/layout.tsx`

- Import `AuthProvider` from `contexts/AuthContext`
- Wrap `{children}` in `<AuthProvider>` inside `<body>`
- Must remain a server component — `AuthProvider` is the client boundary

### `components/Navbar/Navbar.tsx`

- Import `useUser` and `Avatar`
- Call `useUser()` to get `{ user }`
- Render `<Avatar name={user.displayName ?? user.email ?? "?"} />` when `user` is not null
- No change needed when `user` is null (hide avatar or show nothing)

## Files to create (tests)

### `tests/hooks/useUser.test.tsx`

Using vitest + React Testing Library (jsdom), mock `firebase/auth`:

- `useUser` returns `{ user: null, loading: true }` before auth resolves
- `useUser` returns `{ user: mockUser, loading: false }` when authenticated
- `useUser` returns `{ user: null, loading: false }` when logged out
- Calling `useUser` outside `AuthProvider` throws an error

## Key constraints

- `AuthProvider` must be `"use client"` — Next.js App Router requires this for hooks/state
- `app/layout.tsx` stays a server component; only the children boundary is client-side
- Firebase's `onAuthStateChanged` must be unsubscribed on unmount to avoid memory leaks
- No sign-in/sign-up/sign-out logic in scope

## Verification

1. Run `npm test` — all tests pass including new `useUser` tests
2. Run `npm run dev` — app loads without errors
3. Confirm `Navbar` renders Avatar when a user is logged in
4. Confirm no TypeScript errors (`npm run build`)

## Out of Scope

Per spec, these are explicitly NOT inclduded:

- Login/signup/logout flow implemantation
- Firebase auth integration in LoginForm/SignupForm
- Logout button or user menu
- Do not use the hook anywhere in the application yet
