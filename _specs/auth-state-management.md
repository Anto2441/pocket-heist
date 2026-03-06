# Spec for Auth State Management

branch: claude/feature/auth-state-management

## Summary

Add a global Firebase Authentication state listener to the app, exposing the current user via a `useUser` hook. The hook returns the Firebase `User` object when logged in, or `null` when logged out. Any page or component can call `useUser` to access the current auth state reactively, without prop drilling or manual state management.

## Functional requirements

- Implement a context provider (`AuthProvider`) that wraps the app and subscribes to Firebase's `onAuthStateChanged` listener.
- The listener updates a shared state whenever the auth state changes (login, logout, token refresh).
- Expose a `useUser` hook that returns the current `User | null` value from the context.
- The hook must be usable in any page or component inside the provider tree.
- The provider should handle the loading/initializing state (before Firebase has resolved the initial auth state) with a sensible initial value (e.g. `null`).
- Do not implement any sign-in, sign-up, or sign-out flows in this spec — only the listener and hook.
- Update any existing components that already reference a user object to use `useUser` instead.

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- Firebase may take a moment to resolve the initial auth state on page load — components should handle a `null` user gracefully during this window.
- The provider must be mounted high enough in the tree to cover all pages and components that need auth state.
- Multiple components calling `useUser` simultaneously should all receive the same value without triggering multiple listeners.

## Acceptance Edge Cases

- Calling `useUser` outside of `AuthProvider` should throw a clear error.
- If the user's session expires or is revoked, `useUser` should reactively return `null`.

## Acceptance Criteria

- `AuthProvider` wraps the application at the root level (e.g. in `app/layout.tsx`).
- `useUser` returns `User | null` reflecting the current Firebase auth state.
- Auth state updates propagate to all mounted components using `useUser` without a page reload.
- Existing components that reference the user object are updated to use `useUser`.
- The listener is unsubscribed when the provider unmounts (no memory leaks).

## Open Criteria

- N/A

## Open Questions

- Should the loading state (before initial auth resolution) be exposed separately (e.g. `{ user, loading }`) or is `null` sufficient?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` returns `null` when no user is authenticated.
- `useUser` returns the user object when a user is authenticated.
- `useUser` updates reactively when auth state changes.
- Calling `useUser` outside of `AuthProvider` throws an error.
