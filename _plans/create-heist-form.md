# Plan: Create Heist Form

## Context

The `/heists/create` page is currently a skeleton. We need a fully functional form that lets authenticated users create a new heist document in Firestore and redirect to `/heists` upon success. The form must fetch the list of agents from the `users` collection so the creator can assign the heist to any user (including themselves).

---

## Architecture Decisions

- The page is built as a single **client component** (`"use client"`) — no separate component file needed, the form is complex and page-specific.
- Auth is already enforced by `app/(dashboard)/layout.tsx`; we use `useUser()` for the current user's uid and displayName (codename).
- `createdAt` → `serverTimestamp()` | `deadline` → `new Date(Date.now() + 48 * 60 * 60 * 1000)` — both set programmatically, not shown to the user.
- `finalStatus` defaults to `null` on creation.
- The `users` Firestore collection shape is `{ id: string, codename: string }` (written at signup).

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `app/(dashboard)/heists/create/page.tsx` | Replace skeleton with form |
| `tests/pages/CreateHeistPage.test.tsx` | Create test file |

---

## Implementation Steps

### 1. `app/(dashboard)/heists/create/page.tsx`

```
"use client"

State:
  - title: string
  - description: string
  - assignedTo: string (uid)
  - assignedToCodename: string
  - agents: { id: string, codename: string }[]
  - loading: boolean (submit)
  - error: string | null

On mount (useEffect):
  - getDocs(collection(db, 'users')) → populate agents[]

On assignedTo change:
  - find the matching agent in agents[] and set assignedToCodename

On submit (handleSubmit):
  1. setLoading(true), setError(null)
  2. Build CreateHeistInput:
     - createdAt: serverTimestamp()
     - deadline: new Date(Date.now() + 48 * 60 * 60 * 1000)
     - title, description
     - createdBy: user.uid
     - createdByCodename: user.displayName
     - assignedTo, assignedToCodename
     - finalStatus: null
  3. addDoc(collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter), payload)
  4. router.push('/heists')
  5. On error: setError(message), setLoading(false)

UI:
  - <h2 className="form-title">Create a New Heist</h2>
  - label + input[text] for title (required)
  - label + textarea for description (required)
  - label + select for "Assign To" — options from agents[] (required)
  - Error paragraph with role="alert" when error is set
  - Submit button (disabled while loading)
  - Cancel link → /heists (styled as secondary action)
```

Reuse:
- `useUser` from `@/hooks/useUser`
- `useRouter` from `next/navigation`
- `db` from `@/lib/firebase`
- `CreateHeistInput`, `heistConverter`, `COLLECTIONS` from `@/types/firestore`
- `serverTimestamp`, `addDoc`, `collection`, `getDocs` from `firebase/firestore`
- Existing CSS classes: `center-content`, `page-content`, `form-title`, and AuthForm.module.css patterns for inputs/buttons

### 2. `tests/pages/CreateHeistPage.test.tsx`

Mocks needed:
- `vi.mock('firebase/firestore', ...)` → mock `getDocs`, `addDoc`, `collection`, `serverTimestamp`
- `vi.mock('@/lib/firebase', ...)` → `{ db: {} }`
- `vi.mock('@/hooks/useUser', ...)` → return `{ user: { uid: 'user-1', displayName: 'SilentFox' }, loading: false }`
- `vi.mock('next/navigation', ...)` → `{ useRouter: () => ({ push: mockPush }) }`

Test cases:
1. Renders title, description, assigned-to fields and submit button
2. Populates the "Assign To" dropdown with agents fetched from Firestore
3. Disables submit button while submitting
4. Calls `addDoc` with the correct payload (including programmatic fields) on valid submit
5. Redirects to `/heists` after successful submission
6. Shows error message (role="alert") when `addDoc` rejects
7. Renders a Cancel link pointing to `/heists`

---

## Verification

1. Run `npm run dev` and navigate to `/heists/create` — verify the form renders with a populated dropdown
2. Submit a valid form — verify a new document appears in Firestore and the user is redirected to `/heists`
3. Run `npm test` — all tests in `tests/pages/CreateHeistPage.test.tsx` should pass
