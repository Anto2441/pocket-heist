# Plan: Authentication Forms

## Context

The `/login` and `/signup` pages are currently empty skeletons with just headings. The spec (`_specs/auth-forms.md`) calls for adding email + password forms with a show/hide password toggle, console-only submit, and links to switch between forms. No backend — just UI and console logging.

## Approach: Shared `AuthForm` Component

Both forms are nearly identical. A shared `AuthForm` component avoids duplication. The pages become thin wrappers passing different props.

### `AuthForm` Props

| Prop | Login | Signup |
|------|-------|--------|
| `title` | "Log in to Your Account" | "Signup for an Account" |
| `headingLevel` | `"h1"` | `"h2"` |
| `buttonLabel` | "Log In" | "Sign Up" |
| `linkText` | "Don't have an account? Sign up" | "Already have an account? Log in" |
| `linkHref` | `/signup` | `/login` |

### Component internals
- `"use client"` (uses `useState`)
- State: `email`, `password`, `showPassword`
- `Eye` / `EyeOff` icons from lucide-react for toggle
- Toggle button has `type="button"` and dynamic `aria-label`
- Submit: `e.preventDefault()` then `console.log({ email, password })`
- All fields `required`

## Files to Create

| File | Purpose |
|------|---------|
| `tests/components/AuthForm.test.tsx` | Tests (written first) |
| `components/AuthForm/AuthForm.tsx` | Shared form component |
| `components/AuthForm/AuthForm.module.css` | Styles |
| `components/AuthForm/index.ts` | Barrel export |

## Files to Modify

| File | Changes |
|------|---------|
| `app/(public)/login/page.tsx` | Rename fn `SignupPage` → `LoginPage`, add `"use client"`, render `AuthForm` with login props |
| `app/(public)/signup/page.tsx` | Add `"use client"`, render `AuthForm` with signup props |

## Implementation Order (TDD)

1. **Write tests** → `tests/components/AuthForm.test.tsx`
   - Login variant: renders email, password, submit button; link to signup
   - Signup variant: renders email, password, submit button; link to login
   - Behavior: password toggle switches type; submit logs to console
2. **Run tests** → expect failure (component doesn't exist)
3. **Create component** → `AuthForm.tsx`, `.module.css`, `index.ts`
4. **Run tests** → expect pass
5. **Update pages** → login + signup pages use `AuthForm`
6. **Final test run** → all green

## Verification

- `npm test tests/components/AuthForm.test.tsx` — all tests pass
- `npm run build` — no type errors
- Manual: visit `/login` and `/signup`, fill forms, check console output, toggle password, use switch links
