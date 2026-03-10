# Spec for useHeists Hook

branch: claude/feature/use-heists-hook
figma_component (if used): N/A

## Summary

Create a `useHeists` React hook that subscribes to real-time heist data from the Firestore `heists` collection. The hook accepts a mode argument that determines which subset of heists to return. Use the hook in the heists dashboard page to display the titles of heists in three distinct sections.

## Functional requirements

- Create the hook at `hooks/useHeists.ts`
- The hook signature is `useHeists(mode: 'active' | 'assigned' | 'expired')`
- The hook returns `{ heists: Heist[], loading: boolean }`
- The hook uses a Firestore real-time listener (`onSnapshot`) so the UI updates automatically when data changes
- The hook reads the current user's uid via `useUser()`
- Query behaviour by mode:
  - `'active'`: heists where `assignedTo == currentUser.uid` AND `deadline > now`
  - `'assigned'`: heists where `createdBy == currentUser.uid` AND `deadline > now`
  - `'expired'`: heists where `deadline <= now` AND `finalStatus != null` (regardless of user)
- The hook cleans up the Firestore listener on unmount
- Use `heistConverter` for type-safe deserialization
- Update `app/(dashboard)/heists/page.tsx` to be a client component that calls `useHeists` three times (once per mode) and renders only the heist titles under the existing section headings

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- User is not yet authenticated when the hook mounts — the hook should not run the query if `user` is null/undefined and should return an empty array
- A mode value could theoretically change at runtime; the hook should re-subscribe when the mode or user changes
- Firestore may return zero results for a given mode — the UI should render an empty section gracefully

## Acceptance Edge Cases

- When the same heist matches multiple modes (e.g. edge-case timestamps), it should only appear in the section that corresponds to the query constraints
- Expired heists with `finalStatus == null` must not appear in the `'expired'` results

## Acceptance Criteria

- `useHeists('active')` returns only heists assigned to the current user with a future deadline
- `useHeists('assigned')` returns only heists created by the current user with a future deadline
- `useHeists('expired')` returns only heists with a past deadline and a non-null `finalStatus`
- The heists dashboard page renders three labelled sections, each listing heist titles from the corresponding hook call
- The page re-renders automatically when Firestore data changes (real-time behaviour)
- No Firestore listener leak on unmount

## Open Questions

- Should the `'expired'` query be further filtered by user involvement (creator or assignee), or truly global across all users? The spec currently says "regardless of the user" — confirm this is intentional. Yes
- Should heists with a past deadline but `finalStatus == null` be shown anywhere, or silently excluded everywhere? Shown somewhere

## Testing Guidelines

Create a test file at `tests/hooks/useHeists.test.tsx`. Focus on the following cases without going too heavy:

- Returns an empty array and `loading: true` on initial render
- Calls `onSnapshot` with the correct Firestore query for each mode (`active`, `assigned`, `expired`)
- Returns heist data passed back from the mocked `onSnapshot` callback
- Does not subscribe when `user` is null
- Cleans up the listener (calls the unsubscribe function) on unmount
