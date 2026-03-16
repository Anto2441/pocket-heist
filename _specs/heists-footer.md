# Spec for Heists Footer

branch: claude/feature/heists-footer
figma_component (if used): N/A

## Summary

Add a footer component to the dashboard layout (heists pages) that matches the site's visual identity — dark background, purple/pink accent palette, Inter typeface. The footer must **not** appear on public pages (home `/`, login `/login`, signup `/signup`) since those have a distinct centered layout without persistent chrome.

## Functional requirements

- Create a `Footer` component under `components/Footer/`.
- The footer is rendered inside the dashboard layout (`app/(dashboard)/layout.tsx`), below `<main>`, so it is automatically scoped to all heist routes (`/heists`, `/heists/:id`, `/heists/create`).
- The footer must **not** be added to the public layout (`app/(public)/layout.tsx`) nor the root layout.
- Content of the footer should include:
  - A brief brand line or tagline referencing Pocket Heist (e.g. "© 2026 Pocket Heist — Plan your tiny missions").
  - Optional: a couple of lightweight links (e.g. About, GitHub) — kept minimal.
- Styling must follow the existing design tokens defined in `globals.css`:
  - Background: `--color-lighter` (`#101828`) or `--color-light` (`#0A101D`) to sit below the content without competing with it.
  - Text: `--color-body` (`#99A1AF`) for default copy.
  - Accent/hover: `--color-primary` (`#C27AFF`) for any interactive elements.
  - Font: `--font-sans` (Inter).
- The footer should use Tailwind CSS 4 utility classes and/or a CSS Module, consistent with the rest of the component library.
- The footer must be responsive and readable on mobile viewports.

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- On very short pages (few heists), the footer should sit at the bottom of the viewport rather than floating mid-page — use a flex-column layout on the dashboard wrapper if needed.
- Long taglines or translated text should not break the footer layout.

## Acceptance Edge Cases

- Navigating to `/` (home) must show no footer.
- Navigating to `/login` or `/signup` must show no footer.
- Navigating to `/heists` or any sub-route must show the footer.

## Acceptance Criteria

- [ ] A `Footer` component exists at `components/Footer/Footer.tsx`.
- [ ] The footer is rendered in `app/(dashboard)/layout.tsx` and only there.
- [ ] Visual style matches the design system: dark background, muted body text, purple accent.
- [ ] Footer is not visible on public pages.
- [ ] Footer is visible on all dashboard pages (`/heists`, `/heists/create`, `/heists/:id`).
- [ ] Layout does not break on mobile (≥ 375px viewport width).

## Open Criteria

- Decide whether to include navigation links in the footer or keep it purely informational.
- Confirm exact tagline copy with the team.

## Open Questions

- Should the footer have a fixed/sticky position or scroll naturally with page content? Scroll naturally with page content
- Are there any social or external links that should appear in the footer? Use real icons but with fake datas, just for the impression of something real

## Testing Guidelines

Create a test file at `tests/Footer.test.tsx` with meaningful tests for the following cases:

- Renders correctly with expected brand text.
- Snapshot or visual regression test for the default state.
- Verifies the footer is present in the dashboard layout render tree.
- Verifies the footer is absent from the public layout render tree.
