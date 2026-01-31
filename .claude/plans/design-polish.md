# Design Polish Plan: Subtle Touches & Edge Cases

**Status:** Plan  
**Created:** 2025-01-30  
**Scope:** Aesthetic polish only — true to original gradient, Fredoka/Righteous, pink-orange palette, WCAG AA. No layout or structural redesign.

---

## 1. Context (Design Audit)

| Item | Current state |
|------|----------------|
| **Framework** | React 18, CRA, Framer Motion |
| **Styling** | Global `styles.css` + `microinteractions.css`, CSS variables in both |
| **Design tokens** | `styles.css` (WCAG colors, spacing, radius) + `microinteractions.css` (separate palette, shadows, timing) |
| **Visual language** | Gradient body (247deg pink→orange), cards (rgba white), Righteous headings, Fredoka body, nav/buttons primary pink, accent orange |

**Design principle for this plan:** Function dictates form. Polish = subtle highlights, microinteractions, and intentional edge-case handling — no new patterns, no Inter, no emoji in UI, no shadow/radius sprawl.

---

## 2. Goals

1. **Stay true to original** — Same gradient, same fonts, same color roles, same layout.
2. **Subtle touches** — Light hover/focus refinements, small motion and highlight details.
3. **Microinteractions & optimizations** — Consistent timing/easing, reduce duplication between `styles.css` and `microinteractions.css` where it causes conflict.
4. **Intentional edge cases** — Empty states, loading/error, disabled, long text, very small viewports, reduced motion.

---

## 3. Proposed Changes (Prioritized)

### 3.1 Token & consistency pass (low risk)

- **Unify timing/easing**  
  Use one set of transition timings in `styles.css` and reference them from `microinteractions.css` (or document that `microinteractions` overrides only where needed) so hover/focus don’t feel inconsistent.
- **No new tokens**  
  Use existing `--transition-fast`, `--transition-normal`, `--radius-*`, `--spacing-*` for new polish.

### 3.2 Subtle visual polish

- **Cards (music, thread-item, forum-post, reply-form)**  
  - Optional: very subtle border (e.g. `1px solid rgba(168, 50, 113, 0.08)`) so cards don’t float flat on gradient.  
  - Keep single `--shadow-card`; no extra shadow layers.
- **Nav links**  
  - Active state: slight glow or 1px highlight (e.g. bottom border or box-shadow) so “current page” is clearer without changing layout.  
  - Ensure active + hover is one clear state (no double treatment).
- **Buttons (primary/secondary)**  
  - Already have microinteractions (lift, ripple). Only add: consistent focus-visible ring (reuse `--color-focus` / `--color-focus-ring`) and ensure disabled state is clearly muted (opacity + no hover lift).
- **Back button (thread)**  
  - Subtle hover: light background tint (e.g. `rgba(168, 50, 113, 0.06)`) so it’s clearly interactive.

### 3.3 Microinteractions (refinements only)

- **Focus-visible**  
  One pattern everywhere: 2–3px outline + offset, `--color-focus`. Ensure no outline on focus (mouse) and no double focus from both `styles.css` and `microinteractions.css`.
- **Reduced motion**  
  Verify `prefers-reduced-motion: reduce` in both files reduces/removes transform and animation (already partially there); ensure no new motion ignores it.
- **Form inputs**  
  Keep current focus ring; optional: very subtle “filled” state (e.g. background tint when not empty) only if it doesn’t clash with existing focus styling.
- **Like button**  
  Keep heart pulse; ensure disabled state has no hover scale and no animation.

### 3.4 Edge-case handling

- **Empty states**  
  `.empty-state`: optional soft icon or short line (e.g. “Nothing here yet”) so it doesn’t look broken; keep padding and typography as-is.
- **Loading / error**  
  `.loading-state`, `.error-state`: ensure spinner/error message have enough contrast on gradient; optional very light card background only if readability fails.
- **Long text**  
  Thread title, post content, intro: already have `word-wrap` / `overflow-wrap`; add `overflow-wrap: break-word` where missing and ensure no horizontal scroll on small viewports.
- **Very small viewports (320px)**  
  Confirm nav doesn’t overflow, container padding is sufficient, and no fixed widths cause horizontal scroll.
- **Modal**  
  Focus trap and scroll lock already implied by overlay; ensure modal scroll area uses the same scrollbar styling as `.modal-content` and that long content doesn’t break layout.

### 3.5 Scrollbar & overflow

- Keep current document and overflow scrollbar styling (pink, thin).
- Ensure any new scrollable region (e.g. a new dropdown or list) reuses the same scrollbar rules (class or repeat the same `scrollbar-*` / `::-webkit-scrollbar` pattern).

### 3.6 Out of scope (do not do)

- No new fonts (no Inter).
- No emoji in UI copy.
- No new gradient layers or extra shadow stacking.
- No “rounded-full” style on large containers.
- No skeleton loaders for quick operations.
- No layout or DOM structure changes beyond what’s needed for the above.

---

## 4. Implementation Order

1. **Audit & align** — Document where `microinteractions.css` overrides `styles.css` (buttons, focus, thread-item). Resolve any conflicting focus or transition so one source of truth wins.
2. **Edge cases** — Add/refine empty, loading, error, long-text, 320px; ensure reduced-motion respected.
3. **Subtle polish** — Card border (optional), nav active highlight, back-button hover, button disabled consistency.
4. **Microinteractions** — Unify focus-visible, verify reduced motion, optional form “filled” hint.
5. **Validate** — Run app, test keyboard nav, toggle reduced motion, test 320px and long content; fix any regressions.

---

## 5. Files to Touch

| File | Changes |
|------|--------|
| `happy-bibimbap/src/styles.css` | Card border (optional), nav active highlight, back-button hover, empty/loading/error tweaks, focus consistency, long-text overflow-wrap. |
| `happy-bibimbap/src/microinteractions.css` | Align focus-visible with styles.css, ensure reduced-motion and disabled states for new/updated animations. |
| Components (only if needed) | e.g. SuccessToast, LoadingSpinner — only if we add a class for scrollbar or empty-state icon; otherwise CSS-only. |

---

## 6. Success Criteria

- [ ] Visual design unchanged at a glance (same gradient, fonts, palette).
- [ ] Subtle improvements: cards feel slightly more defined; nav “current” and back button clearer; focus and disabled states consistent.
- [ ] No duplicate or conflicting focus/transition rules between the two CSS files.
- [ ] Empty, loading, error, long text, and 320px behave without overflow or readability issues.
- [ ] `prefers-reduced-motion: reduce` respected for all new or touched motion.
- [ ] No new anti-patterns (no Inter, no emoji in UI, no shadow/radius sprawl).

---

## 7. Notes

- **BUILD-BANK / kernel** — Not present in repo; this plan follows the build pipeline (research → plan → execute → validate) and design principles (restraint, accessibility, no anti-patterns).
- **State** — When implementation is complete, update this file status to **Done** and add a short “Completed” section with date and any deviations from the plan.
