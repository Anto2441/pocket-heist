# Plan: Heist Card Component

## Context

The heists dashboard page currently shows section headings but no actual heist data. We need a reusable HeistCard component to display heists in a 3-column grid layout on the active and assigned sections. We also need a skeleton loader for while data is fetching.

---

## Architecture Decisions

- The card is a pure, reusable component at `components/HeistCard/HeistCard.tsx` (not page-specific).
- Use CSS modules for scoped styling to avoid leaks.
- Skeleton component is a separate file `components/HeistCard/HeistCardSkeleton.tsx`.
- Deadline formatting uses a utility function or lightweight library (day.js, date-fns) for relative time (e.g., "2 days left").
- The heists page layout uses CSS Grid or Tailwind's grid utilities for responsive 3/2/1 column layout.
- No changes to `/heists/:id` detail page in this feature.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `components/HeistCard/HeistCard.tsx` | Create |
| `components/HeistCard/HeistCard.module.css` | Create |
| `components/HeistCard/HeistCardSkeleton.tsx` | Create |
| `components/HeistCard/HeistCardSkeleton.module.css` | Create |
| `components/HeistCard/index.ts` | Create (export both) |
| `app/(dashboard)/heists/page.tsx` | Modify to integrate cards in grid |
| `tests/components/HeistCard.test.tsx` | Create |
| `tests/components/HeistCardSkeleton.test.tsx` | Create |

---

## Implementation Steps

### 1. HeistCard Component

**Structure**:
- Props: `heist: Heist` (the full heist object)
- Render:
  - Title as `<Link href={/heists/${heist.id}}>`
  - Description text (truncated to 2 lines via CSS)
  - Agent name with icon/emoji (🎭 or similar)
  - Deadline as relative time (e.g., "2 days left" or "Overdue")
- Styling:
  - Use design tokens from `globals.css` (colors, fonts)
  - Card padding: 16px, border-radius: 8px, border: 1px solid `--color-body/20`
  - Hover state: subtle border/background change
  - Deadline urgent (< 24h): use `--color-error` text color
- Accessibility: semantic HTML, focus ring on title link

**Deadline Formatter**:
- Create a small utility `lib/formatDeadline.ts` that takes a Date and returns relative time
- If deadline is in the past: "Overdue"
- If deadline is within 24h: show hours remaining, color red
- Otherwise: show days remaining

### 2. HeistCardSkeleton Component

**Structure**:
- No props required
- Render placeholder boxes for title, description, agent, deadline with same spacing as HeistCard
- Animated shimmer using CSS keyframes (linear-gradient animation)
- Animation duration: 1.5s infinite

**Styling**:
- Use CSS modules to keep animation scoped
- Background colors: slightly lighter than card background (for skeleton effect)
- Matches HeistCard dimensions

### 3. HeistsPage Integration

**Modify** `app/(dashboard)/heists/page.tsx`:
- Import `useHeists` hook (already done)
- Add grid layout with responsive column counts (3 on desktop, 2 on tablet, 1 on mobile)
- For "active" section: map `activeHeists` to `HeistCard` components, show `HeistCardSkeleton` while loading
- For "assigned" section: same pattern with `assignedHeists`
- For "expired" section: keep as text-only list (no cards)
- Example structure:
  ```
  <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
    {activeHeists.map(heist => <HeistCard key={heist.id} heist={heist} />)}
  </div>
  {loading && <div className="grid ..."><HeistCardSkeleton /><HeistCardSkeleton />...</div>}
  ```

---

## Reuse

- Design tokens: `globals.css` (colors, typography)
- Heist types: `types/firestore.ts`
- useHeists hook: `hooks/useHeists.ts` (already created)
- Link component: Next.js `next/link`
- Testing patterns: existing test files in `tests/components/`

---

## Verification

1. Run `npm run dev` → navigate to `/heists` → verify cards display in 3-column grid for active/assigned
2. On mobile view, verify grid collapses to 1 column
3. Hover over a card → verify subtle visual feedback
4. Click card title → verify navigation to detail page (404 is OK, page not implemented yet)
5. Monitor loading state → verify skeletons appear and animate
6. Run `npm test` → all card and skeleton tests pass
