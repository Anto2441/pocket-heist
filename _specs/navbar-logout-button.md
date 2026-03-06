# Spec for Navbar Logout Button

branch: claude/feature/navbar-logout-button
figma_component (if used): N/A

## Summary

Add a "Log Out" button to the Navbar that is only visible when the user is authenticated. Clicking it signs the user out via Firebase Auth. The button's visual style should mirror the sign up button (`bg-primary text-dark font-bold py-2 px-4 rounded-md`).

## Functional requirements

- The Navbar must read the current auth state (via the existing `useUser` hook or Firebase `onAuthStateChanged`).
- A "Log Out" button is rendered in the nav's right-hand action area **only** when a user is logged in.
- When no user is logged in, the button is not rendered (not merely hidden).
- Clicking "Log Out" calls Firebase Auth's `signOut` method.
- No redirect occurs after sign-out (out of scope for this spec).
- The button is styled consistently with the sign up button: `bg-primary text-dark font-bold py-2 px-4 rounded-md` (Tailwind utility classes via CSS Module).

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- User's session expires mid-session — auth state listener should handle this automatically.
- `signOut` throws an unexpected error — the button should not crash the page; the error can be silently swallowed or logged to the console.
- The Navbar is rendered on a server component boundary — the component must be a Client Component to access auth state reactively.

## Acceptance Edge Cases

- Button is absent when `user` is `null` (logged-out state).
- Button is absent while auth state is still loading (to avoid flash).
- Button is present and functional when `user` is non-null.

## Acceptance Criteria

- [ ] The "Log Out" button appears in the Navbar when a user is authenticated.
- [ ] The "Log Out" button is not rendered when no user is authenticated.
- [ ] Clicking the button calls `signOut(auth)` from Firebase Auth.
- [ ] The button's visual style matches the sign up button design.
- [ ] No redirect occurs on sign-out.

## Open Criteria

- Whether to show a loading/disabled state on the button while `signOut` is in-flight.

## Open Questions

- Should the Navbar also show the user's codename or avatar when logged in? (Out of scope for this spec — do not implement.)

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Renders without the logout button when `user` is `null`.
- Renders the logout button when `user` is present.
- Calls `signOut` when the logout button is clicked.
- Does not call `signOut` when the button has not been clicked.
