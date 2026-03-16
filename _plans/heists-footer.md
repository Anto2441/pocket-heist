# Plan: Heists Footer

## Context

The dashboard (heist pages) needs a persistent footer matching the site's visual identity. The footer must only appear on dashboard routes (`/heists`, `/heists/:id`, `/heists/create`) — not on public pages (home, login, signup). It should scroll naturally with the page and include social icons (real Lucide icons, placeholder links) for a polished look.

---

## Files to Create

### 1. `components/Footer/Footer.tsx`
- Stateless presentational component (no hooks, no Firebase)
- Content:
  - Left side: brand line `© 2026 Pocket Heist — Plan your tiny missions`
  - Right side: 3 social icon links using **Lucide** icons (`Github`, `Twitter`, `Linkedin`) with `href="#"` (fake data)
- Layout: `flex justify-between items-center`, max-width `max-w-6xl mx-auto`, consistent with Navbar
- Icon links: `text-body hover:text-primary transition-colors`

### 2. `components/Footer/Footer.module.css`
- Pattern: `@reference "../../app/globals.css"` (mirrors Navbar.module.css)
- `.siteFooter`: `@apply bg-lighter px-2 py-6`
- `.siteFooter nav`: `@apply mx-auto max-w-6xl flex justify-between items-center`
- `.iconLink`: `@apply text-body hover:text-primary transition-colors`

### 3. `components/Footer/index.ts`
```ts
export { default } from "./Footer"
```

---

## Files to Modify

### 4. `app/(dashboard)/layout.tsx`
- Import `Footer` from `@/components/Footer`
- Wrap the layout in a `<div className="flex flex-col min-h-screen">` so the footer sticks to the bottom on short pages
- Give `<main>` a `className="flex-1"` to push footer down
- Add `<Footer />` after `</main>`

**Result:**
```tsx
return (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
```

---

## Files to Create (Tests)

### 5. `tests/components/Footer.test.tsx`
Pattern: mirrors `tests/components/Navbar.test.tsx` — Vitest + RTL, no mocks needed (Footer has no hooks/Firebase).

Tests:
- Renders brand text (`© 2026 Pocket Heist`)
- Renders 3 social icon links (`link` role, `href="#"`)
- Snapshot test

### 6. Update `tests/layouts/DashboardLayout.test.tsx`
- Add `vi.mock("@/components/Footer", () => ({ default: () => <footer>Footer</footer> }))` so layout tests stay isolated
- Add assertion: `expect(screen.getByRole("contentinfo")).toBeInTheDocument()` when authenticated

---

## Critical Files

| File | Action |
|------|--------|
| `components/Footer/Footer.tsx` | Create |
| `components/Footer/Footer.module.css` | Create |
| `components/Footer/index.ts` | Create |
| `app/(dashboard)/layout.tsx` | Modify (add Footer + flex wrapper) |
| `tests/components/Footer.test.tsx` | Create |
| `tests/layouts/DashboardLayout.test.tsx` | Modify (mock Footer, add assertion) |

## Reuse Reference
- `components/Navbar/Navbar.module.css` — CSS Module pattern (`@reference` + `@apply`)
- `components/Navbar/Navbar.tsx` — Lucide icon import pattern, layout structure
- `tests/components/Navbar.test.tsx` — Test structure to mirror

---

## Verification

1. Run `npm run dev` and visit `/heists` — footer should appear below content
2. Visit `/` and `/login` — footer must be absent
3. On a page with few items, footer should be at bottom of viewport (flex-1 on main)
4. Run `npm test` — all tests pass including new Footer and updated DashboardLayout tests
