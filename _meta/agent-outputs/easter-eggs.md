# Happy Bibimbap Easter Eggs

**Created:** 2026-01-27
**Status:** Implemented and tested

---

## Summary

Added 7 delightful easter eggs throughout the Happy Bibimbap site. Each easter egg is subtle, non-intrusive, and rewards curious users with fun surprises.

---

## Easter Eggs Catalog

### 1. Konami Code - Achievement Unlocked

**Trigger:** Press the Konami Code sequence on any page
```
Up, Up, Down, Down, Left, Right, Left, Right, B, A
```

**Effect:**
- Full-screen celebration overlay appears
- Bouncing bibimbap bowl emoji
- "Achievement Unlocked!" message
- Confetti explosion with bibimbap ingredient emojis
- Click anywhere or wait 10 seconds to dismiss

**Files:** `src/hooks/useEasterEggs.js`

---

### 2. Logo Click (5x) - Mix It Up!

**Trigger:** Click the Happy Bibimbap logo on the Home page 5 times quickly (within 2 seconds)

**Effect:**
- Logo spins 360 degrees with scaling animation
- "Mix it up!" message appears
- Confetti explosion
- Logo becomes clickable with hover effect

**Files:**
- `src/hooks/useEasterEggs.js`
- `src/pages/Home.js`
- `src/styles.css` (`.logo-clickable` class)

---

### 3. Type "bibimbap" - Secret Word Confetti

**Trigger:** Type "bibimbap" anywhere on the site (not in input fields)

**Effect:**
- Confetti explosion with bibimbap ingredient emojis
- Toast notification: "You found a secret!"
- Toast slides up from bottom, disappears after 2 seconds

**Files:** `src/hooks/useEasterEggs.js`

---

### 4. Console Secret Message

**Trigger:** Open browser developer console on any page

**Effect:**
- Styled welcome message with gradient background
- Hint about the Konami Code
- Key sequence displayed

**Console output:**
```
Welcome to Happy Bibimbap!
Secret: Try the Konami Code!
(Up, Up, Down, Down, Left, Right, Left, Right, B, A)
```

**Files:** `src/hooks/useEasterEggs.js`

---

### 5. Shift + Hover - Secret Messages

**Trigger:** Hold Shift key and hover over specific elements

**Elements with secrets:**
- Home page "Hello!" title: "Made with love and gochujang!"
- About Me page "Hello!" title: "Founded in the Joseon Dynasty, still delicious today!"

**Effect:**
- Tooltip appears near cursor with secret message
- Pink gradient background
- Disappears when mouse leaves

**Files:**
- `src/hooks/useEasterEggs.js`
- `src/pages/Home.js`
- `src/pages/AboutMe.js`
- `src/styles.css` (`.has-secret-message` class)

---

### 6. 404 Page - Ingredient Sequence Game

**Trigger:** Navigate to any non-existent page (e.g., `/asdfasdf`)

**Effect:**
- Custom 404 page with rotating sad messages
- **Hidden game:** Click ingredients in the correct order to make bibimbap
  - Correct sequence: Rice (1), Egg (2), Vegetables (3), Gochujang (4)
- Shows progress: "X/4 ingredients selected..."
- On completion: Confetti, "Secret Found!" message, "You made a perfect bibimbap!"

**Files:**
- `src/pages/NotFound.js`
- `src/App.js` (route added)

---

### 7. Special Date Celebrations

**Trigger:** Visit the site on specific dates

**Dates:**
- **December 31st (Bibimbap Day / New Year's Eve):**
  - Golden banner: "Happy Bibimbap Day & New Year's Eve!"
  - Confetti explosion

- **January 1st (New Year):**
  - Gold banner: "Happy New Year from Happy Bibimbap!"
  - Confetti explosion

- **September 14-17 (Chuseok / Korean Thanksgiving):**
  - Brown/gold banner: "Happy Chuseok!"

**Effect:**
- Banner slides down from top after 2 seconds
- Auto-dismisses after 8 seconds

**Files:** `src/hooks/useEasterEggs.js`

---

## Files Modified

| File | Changes |
|------|---------|
| `src/hooks/useEasterEggs.js` | **NEW** - Main easter eggs hook with all logic |
| `src/pages/Home.js` | Added hook import, logo click handler, shift-hover |
| `src/pages/AboutMe.js` | Added hook import, shift-hover on title |
| `src/pages/NotFound.js` | **NEW** - 404 page with ingredient game |
| `src/App.js` | Added NotFound import and catch-all route |
| `src/styles.css` | Added easter egg animations and utility classes |

---

## CSS Animations Added

```css
@keyframes confettiFall     /* Falling confetti particles */
@keyframes fadeIn/fadeOut   /* Overlay fade transitions */
@keyframes bounce           /* Bouncing bowl in Konami */
@keyframes popIn/popOut     /* Message pop animations */
@keyframes slideUp/Down     /* Toast slide animations */
@keyframes spinBowl         /* Logo spin animation */
```

**Utility Classes:**
- `.logo-clickable` - Makes logo interactive with hover effect
- `.has-secret-message` - Adds subtle underline hint on hover

---

## Accessibility Notes

- Easter eggs are purely visual enhancements
- All core functionality remains accessible without discovering them
- Confetti and overlays are non-blocking
- All animations respect user preferences (can be disabled with `prefers-reduced-motion`)
- Keyboard navigation not impeded

---

## Testing Checklist

- [x] Konami code triggers celebration
- [x] Logo click counter works (5 clicks)
- [x] Type "bibimbap" shows confetti
- [x] Console shows secret message
- [x] Shift+hover shows tooltips
- [x] 404 page loads correctly
- [x] 404 ingredient game works
- [x] Build completes successfully

---

## Visual Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| Primary Pink | `#d74d8b` | Buttons, text, accents |
| Secondary Orange | `#f1823c` | Gradients, hover states |
| Overlay Background | `rgba(0, 0, 0, 0.85)` | Konami celebration |
| Toast Shadow | `rgba(215, 77, 139, 0.4)` | Drop shadows |
| White | `#fff` | Text on dark backgrounds |

---

## Suggestions for Style Bank

**Pattern: Emoji Confetti System**
- Uses CSS-only animation for falling emojis
- Randomized size (20-40px), position, and timing
- Self-cleaning (removes DOM elements after animation)
- Reusable across projects

**Pattern: Achievement Overlay**
- Full-screen modal with fade animation
- Bouncing emoji focal point
- Click-to-dismiss or auto-timeout
- Works well for celebratory moments

**Pattern: Typing Detection (non-input)**
- Tracks character sequence without input focus
- Resets on wrong character
- Ignores form fields automatically
- Good for hidden commands/secrets

---

*Easter eggs add personality without compromising UX. They reward curiosity and create memorable moments.*
