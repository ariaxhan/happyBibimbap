# Happy Bibimbap

**Personal portfolio website built with React, featuring music and interactive pages**

---

## Project Context

**Tier**: 1 - Personal portfolio/creative project
**Stack**: React 18 + Create React App, React Router v6, Framer Motion, Three.js
**Domain**: Web portfolio (single-page app with multi-route structure)

**Key constraints**:
- Built with Create React App (CRA) - no custom webpack config
- Uses standard CRA scripts: `npm start`, `npm build`, `npm test`
- Music files served from `/public/music/` directory
- Images stored in both `/src/images/` and `/public/`
- Mobile-responsive design is critical (see git history)

---

## Coding Rules

### Component Structure
- Pages live in `src/pages/` (Home, AboutMe, Portfolio, Introduction, ContactMe)
- Reusable components in `src/components/` (NavBar)
- Each page is a default export
- NavBar component imported into each page individually

### Styling
- Global styles in `src/styles.css`
- Component-specific styles in `src/App.css`
- Uses linear gradients for backgrounds (`rgba(240, 144, 144, 0.83) → #e379a9 → #ee9258`)
- Mobile-first responsive design with flex layouts

### Routing
- React Router v6 syntax (element prop, not component prop)
- Routes defined in `src/App.js`
- Pattern: `<Route path="/x" element={<Component />} />`

### Asset Handling
- Static assets (music, favicons) go in `/public/`
- Component-level assets (images used in components) can be in `/src/`
- Reference public assets with `/path` (e.g., `/music/HappyBibimbap.mp3`)
- Import src assets directly (e.g., `import logo from './logo.png'`)

### Naming Conventions
- Components: PascalCase (e.g., `NavBar.js`, `AboutMe.js`)
- CSS classes: kebab-case (e.g., `nav-link`, `audio-gallery`)
- Files: Match component name exactly

---

## Default Behaviors

These behaviors apply automatically based on task context:

### When Adding New Features
1. Check existing pages for similar patterns first
2. Maintain consistent styling with gradient backgrounds
3. Ensure mobile responsiveness (flex layouts, wrap behavior)
4. Test in dev mode (`npm start`) before committing

### When Debugging
1. Check browser console for errors (CRA shows detailed errors)
2. Verify asset paths (public vs src imports)
3. Check React Router syntax (v6 vs v5 differences)
4. Test mobile viewport in browser dev tools

### When Styling
1. Add global styles to `styles.css`
2. Use existing color palette (pinks, oranges from gradient)
3. Maintain flex-based layouts for responsiveness
4. Test on mobile breakpoints

### Before Committing
1. Run `npm start` to verify no build errors
2. Check mobile layout in browser dev tools
3. Verify all asset paths resolve correctly
4. Keep commits small and descriptive (see git history)

Methodology banks in `kernel/banks/` provide deeper guidance when needed.

---

## Tech Stack Details

**Core**:
- React 18.3.1
- React Router DOM 6.24.0
- Create React App 5.0.1

**Animation/3D**:
- Framer Motion 11.2.12
- React Three Fiber 8.16.8
- React Three Drei 9.107.0
- Three.js 0.165.0

**Utilities**:
- React Spring 9.7.3
- React Intersection Observer 9.10.3

**Testing**:
- Jest (via CRA)
- React Testing Library

---

## Common Tasks

### Development
```bash
cd happy-bibimbap
npm start  # Runs on localhost:3000
```

### Building
```bash
cd happy-bibimbap
npm run build  # Creates production build in /build
```

### Testing
```bash
cd happy-bibimbap
npm test  # Runs test suite in watch mode
```

---

## Project Structure

```
happy-bibimbap/
├── public/          # Static assets
│   ├── music/       # Audio files (.mp3)
│   ├── index.html   # HTML template
│   └── *.png        # Favicons, logos
├── src/
│   ├── pages/       # Route components
│   ├── components/  # Reusable components
│   ├── images/      # Component images
│   ├── App.js       # Router setup
│   ├── index.js     # React root
│   └── styles.css   # Global styles
└── package.json
```

---

## Known Patterns

### Audio Implementation
- Audio data stored as array of objects with `{title, src, lyrics}`
- Uses HTML5 `<audio controls>` element
- Toggle lyrics with state management (`useState`)
- Pattern established in `src/pages/Home.js:7-125`

### Navigation
- NavBar component rendered at top of each page
- Links use React Router `Link` component
- Consistent styling across all pages

---

## KERNEL Reference

**Banks** (auto-applied based on context):
- `PLANNING-BANK.md` — Interface-first design, mental simulation
- `DEBUGGING-BANK.md` — Reproduce → Isolate → Root cause → Fix
- `RESEARCH-BANK.md` — Find existing solutions before custom code
- `REVIEW-BANK.md` — Correctness, consistency, completeness
- `DISCOVERY-BANK.md` — Map unfamiliar codebases
- `ITERATION-BANK.md` — Systematic improvement
- `TEARITAPART-BANK.md` — Critical review before implementation

**Explicit commands** (when you need them):
- `/build` — Full pipeline from idea to working code
- `/docs` — Documentation mode
- `/branch`, `/ship`, `/release` — Git workflow
- `/handoff` — Session continuation
- `/validate` — Run tests and build
