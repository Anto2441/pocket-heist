# Spec for Login Form Functionality

branch: claude/feature/login-form-functionality

## Summary

Wire up the login page (`app/(public)/login/`) so that submitting the form with valid credentials signs the user in via Firebase Authentication. On success, show an inline success message. No redirect is required at this stage.

## Functional requirements

- The login page uses the existing `AuthForm` component — connect its `onSubmit` handler to call Firebase `signInWithEmailAndPassword`.
- On successful sign-in, display a success message (e.g. "You are now logged in!") on the page, below or near the form.
- On failure (wrong password, user not found, etc.), display an inline error message describing what went wrong.
- While the sign-in request is in flight, the submit button should be disabled to prevent duplicate submissions.
- The success/error state lives in the login page (or a wrapper), not inside `AuthForm` itself.

## Possible Edge Cases

- User submits with an email that does not exist in Firebase → show a friendly "No account found with that email" message.
- User submits with a correct email but wrong password → show "Incorrect password".
- Firebase returns a generic/unexpected error → show a fallback "Something went wrong. Please try again." message.
- User submits while a previous request is still in flight (button should be disabled, so double-submit is prevented).
- Email field is empty or not a valid email format → rely on the existing HTML validation in `AuthForm`.

## Acceptance Criteria

- Submitting the form with valid credentials results in a visible success message on the page.
- Submitting with invalid credentials results in a visible, user-friendly error message.
- The submit button is disabled while the request is in flight.
- No page redirect occurs after login (success message stays visible).
- The success/error message is cleared if the user modifies the form and resubmits.

## Open Questions

- Should the success message replace the form, or appear alongside it? Appear alongside it
- What is the desired copy for the success message? Login successful
- Should we mask Firebase-specific error codes before displaying them to the user? Most recommanded from you

## Testing Guidelines

Create a test file in `./tests/components` (or `./tests/pages`) for the login form behaviour, with meaningful tests for:

- Successful login: mock `signInWithEmailAndPassword` to resolve → assert success message is shown.
- Failed login (wrong password): mock rejection with `auth/wrong-password` → assert error message is shown.
- Failed login (user not found): mock rejection with `auth/user-not-found` → assert error message is shown.
- Submit button is disabled while the request is pending.
- Submit button is re-enabled after the request completes (success or failure).
