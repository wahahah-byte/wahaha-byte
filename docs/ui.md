# UI Coding Standards

**Last updated: April 19, 2026**

---

## Styling — Tailwind Only

All styling must use Tailwind CSS utility classes. Do not introduce external CSS libraries, CSS Modules, styled-components, or any other styling mechanism.

**Allowed:**
- Tailwind utility classes via `className`
- `style={{}}` inline props for values that are dynamic, component-scoped, or not expressible as a Tailwind utility (e.g. computed colors, exact pixel offsets, `gridTemplateColumns` strings)
- Custom keyframe animations and named helper classes defined in `globals.css` (e.g. `.blink-cursor`, `.slash-line`, `.task-row-wrapper`)

**Not allowed:**
- CSS Modules (`.module.css`)
- Styled-components or Emotion
- Plain `.css` files outside of `globals.css`
- Inline `<style>` tags in components

---

## Color Palette

The project uses a fixed dark palette. Always pull from these values — never introduce new ad-hoc colors.

| Role | Value |
|---|---|
| Page background | `#1e1f22` |
| Surface / card | `#2a2b2f` |
| Elevated surface / header | `#23242a` |
| Input background | `#1e1f22` |
| Border default | `#3a3b3f` |
| Border hover | `#555` |
| Accent blue | `#5bb8e0` |
| Accent blue dark (bg) | `#1a3a4a` |
| Accent blue border | `#1e5068` |
| Accent amber | `#f59e0b` |
| Accent green | `#4ade80` |
| Accent purple | `#a78bfa` |
| Danger red | `#ef4444` |
| Body text | `#f0f0f0` / `#ffffff` |
| Muted text | `rgba(255,255,255,0.6)` |
| Dim text / labels | `rgba(255,255,255,0.3)` |
| Priority — high | `#ef4444` |
| Priority — medium | `#f59e0b` |
| Priority — low | `#22c55e` |

Opacity variants of the accent colors follow the pattern `rgba(91,184,224,0.15)` for hover backgrounds, `rgba(91,184,224,0.35)` for borders, etc.

---

## Typography

- **Font family:** Geist Sans (body), Geist Mono (code/IDs) — loaded via `next/font` in the root layout.
- **All labels, filter tabs, column headers, button text, and field names:** `text-[9px]` or `text-[10px]` with `tracking-widest uppercase`. This is the primary text treatment throughout the UI.
- **Body / task text:** `text-sm` (`14px`).
- **Modal titles:** `text-xs font-bold tracking-widest uppercase`.
- **Point values / emphasized numbers:** `text-xs font-semibold` or `font-semibold` with the accent blue color.
- Never use default browser font stacks. The `font-sans` and `font-mono` Tailwind tokens map to Geist.

---

## Layout & Spacing

- Page content is constrained to `max-w-3xl` centered with `mx-auto px-4`.
- Modals are constrained to `max-w-md` centered with `px-4` on the backdrop.
- Modal structure is always: header (`bg #23242a`, bottom border) → scrollable body (`px-5 py-4`) → footer (`bg #23242a`, top border).
- Use `flex flex-col gap-{n}` for vertical stacks. Prefer `gap-1`, `gap-1.5`, `gap-2`, `gap-3`, or `gap-4` over margins.
- Use `grid` with explicit `gridTemplateColumns` in `style={{}}` when columns have precise fixed widths (e.g. task list rows).

---

## Borders & Radius

- Default border: `1px solid #3a3b3f`.
- Modals and cards: `border-radius: 4px` (use `style={{}}` or Tailwind `rounded`).
- Inputs, selects, small buttons: `border-radius: 3px` (use `style={{}}`).
- Pill / toggle: `border-radius: 999px`.
- Never use large rounded values (`rounded-xl`, `rounded-2xl`, etc.) — the design language is sharp and minimal.

---

## Buttons

All interactive buttons follow the same pattern:

1. Base styles via `className` (sizing, tracking, cursor, transitions).
2. Colors and borders via `style={{}}`.
3. Hover state via `onMouseEnter` / `onMouseLeave` toggling `e.currentTarget.style.*`.

**Primary action button** (e.g. "Create Task", "+ New"):
```
background: #1a3a4a  |  color: #5bb8e0  |  border: 1px solid #1e5068
hover background: #1e4d63
```

**Secondary / ghost button** (e.g. "Cancel"):
```
background: transparent  |  color: rgba(255,255,255,0.35)  |  border: 1px solid #3a3b3f
hover border: #555  |  hover color: rgba(255,255,255,0.6)
```

**Danger button** (e.g. "Submit anyway"):
```
background: rgba(239,68,68,0.08)  |  color: #ef4444  |  border: 1px solid rgba(239,68,68,0.45)
hover background: rgba(239,68,68,0.18)
```

**Disabled state:** `disabled:opacity-30 disabled:cursor-not-allowed` via Tailwind.

Icon-only action buttons (task row actions) use `background: transparent` with colored hover backgrounds at 0.15 opacity.

---

## Inputs & Selects

- Background: `#1e1f22`, color: `#f0f0f0`, border: `1px solid #3a3b3f`, border-radius: `3px`.
- Focus ring: swap border color to `#5bb8e0` via `onFocus` / `onBlur` on `e.currentTarget.style.borderColor`.
- Remove default outlines: `outline-none` on all inputs.
- Remove default `<select>` appearance with `appearance-none`; add a custom `▾` caret via an absolutely-positioned `<span>`.
- Placeholder text: `placeholder-white/20`.

---

## Overlays & Modals

- Backdrop: `fixed inset-0 z-50 flex items-center justify-center px-4` with `background: rgba(0,0,0,0.72)`.
- Clicking the backdrop closes the modal (`onClick` on the backdrop div, `e.stopPropagation()` on the panel).
- Box shadow: `0 20px 60px rgba(0,0,0,0.7)`.
- Z-index ladder: `z-20` (dropdowns) → `z-50` (modals) → `z-[60]` (confirmations over modals).

---

## Animations

Custom animations live in `globals.css` as `@keyframes` + named classes. Do not define keyframes inside component files.

Current named animations:

| Class | Purpose |
|---|---|
| `.blink-cursor` | Blinking text cursor |
| `.pulse-dot` | Pulsing status indicator |
| `.filed-badge-enter` | Badge pop-in on task filing |
| `.submit-btn` (`:active`) | Submit button press feedback |
| `.slash-line` | Sword-slash delete effect |
| `.task-row-deleting` | Row collapse on delete |
| `.error-banner-anim` | Error banner slide-up dismiss |
| `.recurring-pts-popup` | Points float-up on recurring check-in |
| `.bg-scanlines` | Subtle scanline texture on page background |

Use Tailwind's `animate-spin` for loading spinners (`w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin`).

---

## Date Formatting

Dates displayed in the UI must follow this format: **April 23, 2026** (full month name, numeric day, four-digit year).

Use `toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })` for display-facing dates.

For compact in-table dates (due date column), use `{ month: "short", day: "numeric" }` — e.g. **Apr 23**.

For timestamps that include time (e.g. completedAt), use `toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })`.

Never render raw ISO strings or numeric timestamps directly to the user.

---

## Icons

Inline `<svg>` elements are used for all icons — no icon library. Keep SVG viewBoxes small (`10x10` or `10x12`). Stroke-based icons use `strokeLinecap="round" strokeLinejoin="round"` and a stroke width of `1.5`. Colors are set via `stroke` or `fill` attributes matching the palette above.

---

## Component Patterns

**Field wrapper** (`NewTaskModal`): A `<div className="flex flex-col gap-1.5">` with a `<span className="text-[9px] tracking-widest uppercase">` label above the control. Reuse the `Field` component pattern for all form fields.

**Row wrapper** (`TaskDetailModal`): A `<div className="flex flex-col gap-1">` with a dim label span above the value. Reuse the `Row` component pattern for detail grids.

**Task row**: Always uses the `.task-row-wrapper` + `.task-row-inner` CSS class pair from `globals.css` for hover interactions. Action buttons live in a `.task-actions` child that is hidden by default and shown on row hover via CSS.
