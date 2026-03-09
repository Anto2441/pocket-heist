# Spec for Create Heist Form

branch: claude/feature/create-heist-form
figma_component (if used): N/A

## Summary

A form page at `/heists/create` that allows authenticated users to create a new heist document in Firestore. The form lets the user enter a title, description, and select an agent to assign the heist to (fetched from the Firestore `users` collection). On successful submission, the new document is written to the `heists` collection and the user is redirected to `/heists`.

## Functional requirements

- The form renders at `app/(dashboard)/heists/create/page.tsx`
- The form contains the following user-editable fields:
  - **Title** (text input, required)
  - **Description** (textarea, required)
  - **Assigned To** (dropdown/select of agents fetched from the `users` collection, required)
- `createdAt` is set programmatically using `serverTimestamp()` (not shown to the user)
- `deadline` is set programmatically to 48 hours after the current time (not shown to the user)
- `finalStatus` defaults to `null` on creation
- `createdBy` and `createdByCodename` are derived from the currently authenticated user
- `assignedTo` (uid) and `assignedToCodename` are derived from the selected agent in the dropdown
- The list of assignable agents is fetched from the Firestore `users` collection on page load
- On submit, a new document is created in the `heists` Firestore collection using the `CreateHeistInput` interface
- After successful creation, the user is redirected to `/heists`
- While the form is submitting, the submit button is disabled and shows a loading state
- If the Firestore write fails, an error message is shown to the user

## Possible Edge Cases

- The `users` collection is empty or returns no agents — show a fallback message in the dropdown
- The currently authenticated user is not found in `users` — handle gracefully
- Network failure during Firestore fetch or write — surface a user-facing error
- The user navigates away before submitting — no draft is saved (no persistence needed)

## Acceptance Criteria

- The form is only accessible to authenticated users (route is already protected)
- The form cannot be submitted with empty required fields
- The `Assigned To` dropdown lists all users from the `users` Firestore collection
- Submitting a valid form creates a document in the `heists` collection with correct fields
- After a successful submission the user lands on `/heists`
- An error state is shown if the Firestore write fails
- The submit button is disabled during submission

## Open Questions

- Should a user be able to assign a heist to themselves, or only to other agents? Should be able to assign a heist to themselves
- Should the form support a "cancel" button that returns to `/heists`? Yes
- Is there a character limit on title or description fields? No

## Testing Guidelines

Create a test file in `./tests` for the create heist form, covering:

- Renders all form fields (title, description, assigned-to dropdown)
- Submit button is disabled while the form is submitting
- Shows a validation error when required fields are empty on submit
- Calls Firestore `addDoc` with the correct payload on valid submission
- Redirects to `/heists` after successful creation
- Shows an error message when the Firestore write fails
