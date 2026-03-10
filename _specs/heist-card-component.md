# Spec for Heist Card Component

branch: claude/feature/heist-card-component
figma_component (if used): N/A — Design generated from frontend-design plugin

## Summary

Create a reusable `HeistCard` component that displays a heist's essential information (title, description, assigned agent, deadline) in a compact card format. The component will be displayed on the `/heists` dashboard page in a 3-column grid layout for both "active" and "assigned" heists sections. Include a skeleton component (`HeistCardSkeleton`) for loading states. The card title should link to the heist detail page (`/heists/:id`).

---

## Functional requirements

- Create `components/HeistCard/HeistCard.tsx` — displays:
  - Heist title (clickable link to `/heists/:id`)
  - Brief description (truncated to 2 lines max)
  - Assigned agent name (`assignedToCodename`)
  - Deadline (formatted as relative time, e.g., "2 days left")
  - A subtle "view details" affordance (arrow icon or link styling)
- Create `components/HeistCard/HeistCardSkeleton.tsx` — placeholder component:
  - Same height/width as HeistCard
  - Animated shimmer effect or skeleton loaders for title, description, agent, deadline
- The heists page layout should be a 3-column grid that displays:
  - "Your Active Heists" section with HeistCard components
  - "Heists You've Assigned" section with HeistCard components
  - "All Expired Heists" section (text-only list of titles, no cards)
- Grid should be responsive (collapse to 2 columns on tablet, 1 column on mobile)
- No content should be added to `/heists/:id` detail page in this spec

---

## Design Specifications (Frontend Design)

### Approach: Design generated from project constraints

Since Figma dev mode is unavailable, visual design specifications have been derived from:
1. **Existing design tokens** (`app/globals.css`) — color palette, typography
2. **Visual patterns** from existing components (AuthForm, Navbar)
3. **Grid and spacing conventions** from the project
4. **Accessibility best practices** for card components

### Visual Design

#### Color Palette (from globals.css)
- **Background**: `--color-lighter` (#101828)
- **Text (primary)**: `--color-heading` (white)
- **Text (secondary)**: `--color-body` (#99A1AF)
- **Border**: `--color-body/20` (subtle border for card edges)
- **Accent** (links, hover): `--color-primary` (#C27AFF)
- **Error/Urgent text**: `--color-error` (#FF6467)

#### Typography
- **Card title**: Inter, 16px, bold (font-weight 700)
- **Description text**: Inter, 14px, regular
- **Agent/meta info**: Inter, 12px, secondary color
- **Deadline (urgent)**: Inter, 12px, error color if < 24h remaining, else secondary color

#### Card Layout
```
┌─────────────────────────────┐
│ Heist Title → (link icon)   │
├─────────────────────────────┤
│ Brief description text here │
│ (max 2 lines, text-overflow)│
├─────────────────────────────┤
│ 🎭 Assigned: IronWolf       │
│ ⏱ Deadline: 2 days left     │
└─────────────────────────────┘
```

#### Spacing & Dimensions
- **Card padding**: 16px (1rem)
- **Card border-radius**: 8px (matches AuthForm inputs)
- **Border**: 1px solid `--color-body/20`
- **Card shadow**: subtle (optional, for depth — `0 1px 3px rgba(0,0,0,0.1)`)
- **Grid gap**: 16px (3-column grid, responsive)
- **Min card height**: 140px (approximate, auto-expand for content)

#### Hover & Interaction States
- **Card hover**: Subtle background change or border color shift to primary color
- **Title link**: Underline appears on hover, cursor pointer
- **Card focus**: Keyboard focus ring (outline for accessibility)

#### Skeleton Loader
- **Shimmer animation**: Linear gradient animation left-to-right, opacity pulsing
- **Placeholder elements**:
  - Title placeholder: 60% width, 16px height
  - Description placeholder: 100% width, 40px height (2-line estimate)
  - Agent placeholder: 40% width, 12px height
  - Deadline placeholder: 45% width, 12px height
- **Animation duration**: 1.5s infinite

#### Grid Responsiveness
- **Desktop (≥1024px)**: 3 columns
- **Tablet (768px–1023px)**: 2 columns
- **Mobile (<768px)**: 1 column

---

## Possible Edge Cases

- Heist title is very long (50+ characters) — truncate with ellipsis in the card
- Description text is very short (< 20 chars) — still display but use full space
- Deadline is in the past (should not appear in active/assigned, only in expired) — still display but mark as "Overdue"
- Assigned agent name has special characters or is very long — truncate gracefully
- No description provided — show placeholder text or leave blank
- Heist is approaching deadline (< 24 hours) — highlight deadline in error color

---

## Acceptance Edge Cases

- Card renders correctly when `assignedToCodename` is an empty string
- Card renders correctly when `description` is missing or null
- The 3-column grid wraps correctly on smaller viewports
- Skeleton loader maintains consistent height with actual card
- Links are keyboard accessible (tabbing through cards works)

---

## Acceptance Criteria

- HeistCard displays all four pieces of information: title, description, agent, deadline
- Title is a clickable link to `/heists/:id` with appropriate href
- Deadline shows relative time (e.g., "2 days left") using a date formatter (humanize or similar)
- HeistCardSkeleton has the same dimensions and visual rhythm as HeistCard
- 3-column grid displays on desktop and collapses to 2/1 columns responsively
- Cards have clear visual hierarchy and are easily scannable
- No styling leaks from card (component is scoped — CSS modules or styled-components approach)
- Existing heists page sections ("Your Active Heists", "Heists You've Assigned") now display cards instead of placeholder headings

---

## Open Criteria

- Interaction feedback: Should cards have a subtle hover animation or scale effect?
- Delete/archive action: Should the card include a menu or action button, or is that reserved for the detail page?

---

## Open Questions

- Should the deadline always be in relative time (e.g., "2 days left") or also show the absolute date on hover/tooltip?
- Should expired heists in the "All Expired Heists" section display cards or remain as a simple text list (spec currently suggests text-only list)?
- Should the card component be re-used for the heist detail page, or is that page a different design?

---

## Testing Guidelines

Create test files:
- `tests/components/HeistCard.test.tsx`
- `tests/components/HeistCardSkeleton.test.tsx`

Focus on these cases without going too heavy:

### HeistCard Tests
- Renders heist title, description, agent, deadline
- Title links to the correct heist detail page (`/heists/:id`)
- Deadline is formatted as relative time (e.g., "2 days left")
- Handles missing description gracefully (no crash, renders empty state)
- Handles very long title and truncates with ellipsis
- Deadline text is displayed in error color if deadline is < 24 hours away
- Card is keyboard accessible (can tab to title link)

### HeistCardSkeleton Tests
- Renders without crashing
- Has the same visual height as HeistCard (or close approximation)
- Animates smoothly (no JavaScript errors during animation)
- Is replaced by actual HeistCard when data loads

### Integration Tests (on HeistsPage)
- 3-column grid displays on desktop
- Grid collapses to 2 columns on tablet, 1 column on mobile
- Both "active" and "assigned" sections display HeistCards
- "Expired" section displays text-only list (no cards)
