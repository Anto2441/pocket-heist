# Plan: useHeists Hook + Heists Dashboard Page

## Context

The `/heists` dashboard page is a skeleton. We need a real-time Firestore hook (`useHeists`) that returns filtered heist arrays based on a mode argument, and we need the heists page to use it to display heist titles in three sections.

---

## Architecture Decisions

- The hook lives at `hooks/useHeists.ts` alongside the existing `hooks/useUser.ts`.
- Real-time data via `onSnapshot` (not `getDocs`) — the hook subscribes and unsubscribes on unmount.
- The hook uses `useUser()` internally to get `user.uid`; it skips the subscription and returns `[]` when `user` is null.
- Query logic per mode:
  - `'active'`: `where('assignedTo', '==', uid)` + `where('deadline', '>', now)`
  - `'assigned'`: `where('createdBy', '==', uid)` + `where('deadline', '>', now)`
  - `'expired'`: `where('deadline', '<=', now)` — all past-deadline heists regardless of `finalStatus` or user
- `app/(dashboard)/heists/page.tsx` becomes a client component (`"use client"`) — it calls `useHeists` three times.
- The hook re-subscribes whenever `mode` or `user` changes (both in the `useEffect` dependency array).

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `hooks/useHeists.ts` | Create |
| `app/(dashboard)/heists/page.tsx` | Convert to client component, use hook |
| `tests/hooks/useHeists.test.tsx` | Create |

---

## Implementation Steps

### 1. `hooks/useHeists.ts`

- Import: `useState`, `useEffect` from `react`; `collection`, `onSnapshot`, `query`, `where`, `Timestamp` from `firebase/firestore`; `db` from `@/lib/firebase`; `Heist`, `heistConverter`, `COLLECTIONS` from `@/types/firestore`; `useUser` from `@/hooks/useUser`
- Export type: `type HeistMode = 'active' | 'assigned' | 'expired'`
- Return type: `{ heists: Heist[], loading: boolean }`
- State: `heists: Heist[]`, `loading: boolean` (initial `true`)
- `useEffect` depends on `[mode, user]`:
  - If `!user`: set `heists = []`, `loading = false`, return early (no subscription)
  - Build a `now = Timestamp.now()` at subscription time
  - Build Firestore `query` based on mode:
    - `active`: `where('assignedTo', '==', user.uid)`, `where('deadline', '>', now)`
    - `assigned`: `where('createdBy', '==', user.uid)`, `where('deadline', '>', now)`
    - `expired`: `where('deadline', '<=', now)`
  - Apply `.withConverter(heistConverter)` to the collection ref
  - Call `onSnapshot(q, (snapshot) => { setHeists(snapshot.docs.map(d => d.data())); setLoading(false) })`
  - Return the unsubscribe function as the effect cleanup

### 2. `app/(dashboard)/heists/page.tsx`

- Add `"use client"` directive
- Call `useHeists('active')`, `useHeists('assigned')`, `useHeists('expired')`
- Under each existing section heading, render a `<ul>` listing `heist.title` per result — empty list renders nothing special (graceful empty state)
- Keep existing class names (`page-content`, `active-heists`, `assigned-heists`, `expired-heists`)

### 3. `tests/hooks/useHeists.test.tsx`

Mocks:
- `vi.mock('firebase/firestore', ...)` — mock `onSnapshot`, `collection`, `query`, `where`, `Timestamp`
- `vi.mock('@/lib/firebase', ...)` — `{ db: {} }`
- `vi.mock('@/hooks/useUser', ...)` — return `{ user: { uid: 'user-1' }, loading: false }`

Test helper: `renderHook(() => useHeists(mode))` from `@testing-library/react`

Test cases:
1. Returns `loading: true` and `heists: []` before snapshot fires
2. Calls `onSnapshot` with the correct query for `'active'` mode (checks `where` args)
3. Calls `onSnapshot` with the correct query for `'assigned'` mode
4. Calls `onSnapshot` with the correct query for `'expired'` mode
5. Returns heist data from the snapshot callback
6. Does not call `onSnapshot` when `user` is null; returns `loading: false`, `heists: []`
7. Calls the unsubscribe function returned by `onSnapshot` on unmount

---

## Reuse

- `useUser` from `@/hooks/useUser`
- `db` from `@/lib/firebase`
- `Heist`, `heistConverter`, `COLLECTIONS` from `@/types/firestore`
- `onSnapshot`, `collection`, `query`, `where`, `Timestamp` from `firebase/firestore`
- Testing patterns from `tests/hooks/useUser.test.tsx` (mock structure, renderHook pattern)

---

## Verification

1. Run `npm run dev` → navigate to `/heists` — verify three sections each showing live titles
2. Create a heist via `/heists/create` — verify it appears in the correct section immediately (real-time)
3. Run `npm test` — all tests in `tests/hooks/useHeists.test.tsx` should pass
