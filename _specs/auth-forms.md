# Spec for Authentication Forms

branch: claude/feature/auth-forms

## Summary

Add authentication forms to the existing `/login` and `/signup` pages. Each form collects an email and password, with a toggle to show/hide the password. On submit, the form logs the entered details to the browser console (no backend integration yet). Users should be able to easily navigate between the two forms.

## Functional requirements

- Both `/login` and `/signup` pages display a form with an email field and a password field
- Each password field has a clickable icon that toggles between showing and hiding the password text
- The `/login` form has a submit button labelled "Log In"
- The `/signup` form has a submit button labelled "Sign Up"
- On form submission, the email and password values are logged to the browser console via `console.log`
- The default form submission/page reload is prevented
- Each form includes a link to the other form (e.g. "Don't have an account? Sign up" on login, "Already have an account? Log in" on signup)
- Both forms use the existing `center-content` and `page-content` layout classes already on these pages
- Email field uses `type="email"` for basic browser validation
- Password field uses `type="password"` by default, toggled to `type="text"` when visibility is on

## Possible Edge Cases

- User submits the form with empty fields (rely on browser-native required field validation)
- User toggles password visibility multiple times in quick succession
- Very long email or password strings

## Acceptance Criteria

- Visiting `/login` shows a form with email input, password input, visibility toggle icon, and a "Log In" button
- Visiting `/signup` shows a form with email input, password input, visibility toggle icon, and a "Sign Up" button
- Clicking the password visibility icon toggles the password field between hidden and visible
- Submitting either form logs `{ email, password }` to the console and does not navigate away
- Each page contains a link that navigates to the other authentication page
- All form fields are required

## Open Questions

- Should there be any client-side validation beyond required fields and email format (e.g. minimum password length)? No
- Should the password visibility icon come from the existing lucide-react icon set or another source? From the existing lucide-react icon

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Login form renders email input, password input, and submit button
- Signup form renders email input, password input, and submit button
- Password visibility toggle switches the input type between "password" and "text"
- Form submission calls console.log with the entered email and password
- Each form contains a link to the other form
