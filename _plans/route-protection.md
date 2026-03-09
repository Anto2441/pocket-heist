# Plan: Route Protection

## Context

The `(public)` and `(dashboard)` route groups have layouts with no auth guards. Any user — authenticated or not — can access any page. This plan adds client-side redirect guards to both layouts using the existing `useUser` hook, and shows a simple spinner while Firebase resolves the auth state to prevent content flashing.

---

## Key Discoveries

- `useUser()` returns `{ user: User | null, loading: boolean }` from `AuthContext` (`hooks/useUser.ts`).
- `AuthContext` starts with `loading: true` and resolves via `onAuthStateChanged` (`contexts/AuthContext.tsx`).
- Both group layouts are currently server components with no auth awareness (`app/(public)/layout.tsx`, `app/(dashboard)/layout.tsx`).
- Test pattern for layouts: mock `useUser` directly with `vi.mock("@/hooks/useUser")` + `vi.mocked(useUser).mockReturnValue(...)` — same pattern used in `tests/components/Navbar.test.tsx`.
- Mock `useRouter` from `next/navigation` to assert redirect calls.
- No shared spinner component exists yet; create `components/Spinner/Spinner.tsx`.

---

## Files to Create

### 1. `components/Spinner/Spinner.tsx`

- Simple `"use client"` component rendering a centered spinner.
- Barrel export via `components/Spinner/index.ts`.

### 2. `tests/layouts/PublicLayout.test.tsx` *(new file)*

Mock `useUser` and `useRouter`. Tests:
- Renders children when `loading: false, user: null`.
- Shows spinner (not children) when `loading: true`.
- Calls `router.replace("/heists")` when `loading: false, user: { ... }`.

### 3. `tests/layouts/DashboardLayout.test.tsx` *(new file)*

Mock `useUser` and `useRouter`. Tests:
- Renders children when `loading: false, user: { ... }`.
- Shows spinner (not children) when `loading: true`.
- Calls `router.replace("/login")` when `loading: false, user: null`.

---

## Files to Modify

### 4. `app/(public)/layout.tsx`

- Add `"use client"`.
- Import `useUser` and `useRouter`.
- Import `<Spinner />`.
- If `loading` → return `<Spinner />`.
- If `user` → call `router.replace("/heists")` and return `<Spinner />` (prevent flash while redirect fires).
- Otherwise → render children normally.

### 5. `app/(dashboard)/layout.tsx`

- Add `"use client"`.
- Import `useUser` and `useRouter`.
- Import `<Spinner />`.
- If `loading` → return `<Spinner />`.
- If `!user` → call `router.replace("/login")` and return `<Spinner />`.
- Otherwise → render children and `<Navbar />` normally.

---

## Verification

1. Run `npm test` — all 32 existing tests pass, 6 new layout tests pass.
2. Start dev server, visit `/login` while authenticated → redirected to `/heists`.
3. Visit `/heists` while unauthenticated → redirected to `/login`.
4. On first load, spinner appears briefly before auth resolves, then content or redirect fires.
