# Spec for Route Protection

branch: claude/feature/route-protection

## Summary

Protect the app's two route groups by redirecting users based on their authentication status. Pages in the `(public)` group (login, signup) should only be accessible to unauthenticated users — authenticated users get redirected away. Pages in the `(dashboard)` group should only be accessible to authenticated users — unauthenticated users get redirected to login. While Firebase resolves the current auth state, each group layout shows a simple loading indicator to prevent a flash of the wrong content.

## Functional requirements

- The `(public)` group layout redirects authenticated users away (e.g. to `/heists`) before rendering its children.
- The `(dashboard)` group layout redirects unauthenticated users to `/login` before rendering its children.
- Both layouts use the existing `useUser` hook to read the current auth state.
- While auth state is loading (`loading === true` from `useUser`), each layout renders a simple loader instead of its children.
- Once auth state is resolved, the appropriate redirect or render happens immediately.
- No redirect occurs on the server — this is a client-side guard using `"use client"` layouts.

## Possible Edge Cases

- Firebase takes a moment to resolve the auth state on first load — the loader must prevent children from flashing before the redirect fires.
- User manually navigates to `/login` while already authenticated — they should be redirected without seeing the form.
- User manually navigates to `/heists` while unauthenticated — they should be redirected to `/login`.
- User logs out while on a dashboard page — the `useUser` hook updates, triggering a redirect to `/login`.

## Acceptance Criteria

- Visiting a `(public)` page while authenticated immediately redirects to `/heists`.
- Visiting a `(dashboard)` page while unauthenticated immediately redirects to `/login`.
- A loader is shown in both group layouts while `loading === true`.
- No children are rendered until auth state is resolved.
- Redirects use Next.js `router.replace` (not `push`) so the guarded route is not added to browser history.

## Open Questions

- What should the loader look like? A simple centered spinner or text indicator is sufficient — no specific design required. A simple centered spinner
- Should the `(public)` layout redirect to `/heists` specifically, or to a more generic "home after login" destination? to `/heists` specifically

## Testing Guidelines

Create test files in `./tests/layouts` for the group layout behaviour:

- `(public)` layout: renders children when user is unauthenticated.
- `(public)` layout: redirects to `/heists` when user is authenticated.
- `(public)` layout: shows loader while auth state is loading.
- `(dashboard)` layout: renders children when user is authenticated.
- `(dashboard)` layout: redirects to `/login` when user is unauthenticated.
- `(dashboard)` layout: shows loader while auth state is loading.
