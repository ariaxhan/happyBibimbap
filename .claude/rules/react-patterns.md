# React Patterns

**Observed patterns specific to this React project**

---

## Component Patterns

### Page Components
- All pages are functional components using hooks
- Pattern: `function PageName() { return (...) }`
- Export: `export default PageName`
- NavBar imported and rendered at top of each page

### State Management
- Uses `useState` for local component state
- Pattern: `const [state, setState] = useState(initialValue)`
- Example: Lyrics visibility toggle in Home.js

---

## Import Patterns

### Component Imports
```javascript
import React from 'react';
import ComponentName from './path/to/Component';
```

### Asset Imports
```javascript
// For src/ assets
import image from '../image.png';

// For public/ assets (in JSX)
<img src="/public-path/file.png" />
<audio src="/music/song.mp3" />
```

### Router Imports
```javascript
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
```

---

## Styling Patterns

### CSS Classes
- Use className attribute (not class)
- Kebab-case naming: `className="nav-link"`
- Global styles in styles.css
- Component styles in App.css

### Gradient Background
Consistent across all pages:
```css
background: linear-gradient(
  247deg,
  rgba(240, 144, 144, 0.83) 0%,
  #e379a9 50.01%,
  #ee9258 100%
);
```

---

## Routing Patterns

### React Router v6 Syntax
```javascript
<Route path="/path" element={<Component />} />
```

NOT the old v5 syntax:
```javascript
// ❌ Don't use this
<Route path="/path" component={Component} />
```

---

## Data Patterns

### Array of Objects
Used for songs in Home.js:
```javascript
const items = [
  { title: "Name", src: "/path", field: "value" },
  // ...
];

{items.map((item, index) => (
  <div key={index}>...</div>
))}
```

---

## Mobile Responsiveness

### Flex Patterns
- Use `flex-wrap: wrap` for mobile adaptation
- `justify-content: space-around` for even spacing
- `box-sizing: border-box` to include padding in width

### Container Pattern
```css
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}
```

---

*Patterns evolve as code is written. Update this file when new patterns emerge.*
