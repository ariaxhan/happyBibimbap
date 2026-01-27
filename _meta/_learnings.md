# Learnings Log

**Project learnings captured over time**

---

## 2026-01-27

**Context:** Major feature additions - 3D visualizations and forum system
**Type:** implementation
**What:** Added complete 3D visualization suite and forum system via parallel agents
**Why:** Capitalize on high traffic (1.23k visitors, 52k requests/month) and enhance visual appeal
**Applied to:**
- 3D Components: BibimbapBowl3D, FloatingIngredients, MusicVisualizer3D
- Forum Frontend: Complete React components with Happy Bibimbap theming
- Forum Backend: Cloudflare Workers + D1 architecture documented
- Documentation: Comprehensive guides in _meta/

**Key Insights:**
- React Three Fiber already installed but unused - leveraged existing dependencies
- Memory-pool has excellent 3D patterns (Threlte/Svelte) that translate to React Three Fiber
- Cloudflare Workers + D1 perfect for serverless forum (free tier covers traffic)
- Parallel agent execution significantly faster than serial implementation

---

## 2026-01-26

**Context:** KERNEL initialization
**Type:** initialization
**What:** Created project-specific KERNEL configuration
**Why:** Establish foundation for AI-assisted development
**Applied to:**
- `.claude/CLAUDE.md` - Project intelligence and patterns
- `.claude/settings.json` - Prettier formatting hooks
- `.claude/rules/react-patterns.md` - React-specific patterns observed
- `_meta/_session.md` - Session context tracking
- `_meta/_learnings.md` - This file

---

*Add new learnings as they occur during development.*
