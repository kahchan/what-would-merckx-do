# What Would Merckx Do? — CLAUDE.md

## Project Overview

A fixed-gear drivetrain calculator for track cyclists and urban fixed riders. Single-page React app deployed to GitHub Pages.

**Repo:** https://github.com/kahchan/what-would-merckx-do
**Live:** https://kahchan.github.io/what-would-merckx-do/

## Tech Stack

- **React** — functional components, hooks only
- **Vite** — build tool, `base: '/what-would-merckx-do/'` for GitHub Pages
- **CSS variables** — theme + light/dark system, injected via style tag
- **Google Fonts** — DM Serif Display, Space Grotesk, Space Mono
- **No external runtime dependencies in v1**
- **Deploy:** `gh-pages` package, `npm run deploy` → `gh-pages` branch

## File Structure

```
what-would-merckx-do/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── calculations.js        # pure functions only
│   └── components/
│       ├── Topbar.jsx
│       ├── ThemeSelector.jsx
│       ├── DarkToggle.jsx
│       ├── GearHero.jsx
│       ├── NumericInput.jsx
│       ├── RatioBadge.jsx
│       ├── WheelRow.jsx
│       ├── LabelAddRow.jsx
│       ├── ComparisonSection.jsx
│       ├── ComparisonEntry.jsx
│       ├── RolloutBar.jsx
│       └── Tooltip.jsx
├── src/styles/
│   └── global.css
├── SPEC.md
├── PLAN.md
└── CLAUDE.md
```

## Core Calculations (`src/calculations.js`)

```js
export const calcRatio      = (ring, cog) => ring / cog
export const calcRollout    = (ring, cog, circ) => (ring / cog) * (circ / 1000)        // metres
export const calcGearInches = (ring, cog, circ) => (ring / cog) * (circ / Math.PI / 25.4)

export function adaptTheme(t, isDark) {
  // near-white (luma > 200) on paper bg → #1E1E1E
  // near-black (luma < 35)  on dark bg  → #D0D0D0
}
```

**Values update on blur, not on keystroke.**

## Default Wheel Circumferences (mm)

| Label  | circ | diam (mm) |
|--------|------|-----------|
| 700c   | 2105 | 700 |
| 650b   | 1953 | 650 |
| 26"    | 1995 | 660.4 |
| Custom | user input | circ ÷ π |

## Theme System

Four palettes. `localStorage` key: `wwmd-theme`. Random on first session.

| Key | a1 | a2 | a3 |
|-----|----|----|-----|
| `motorola` | `#B81830` | `#003DA5` | `#FFFFFF` |
| `look`     | `#F0C000` | `#111111` | `#B81830` |
| `7eleven`  | `#B81830` | `#005C34` | `#FFFFFF` |
| `molteni`  | `#E85D04` | `#00356B` | `#F5DEB3` |

- `a1` → chainring stroke, add button, active borders
- `a2` → cog stroke
- `a3` → ratio badge colour
- Near-white `a3` adapts to near-black in light mode; near-black `a2` adapts to near-white in dark mode

## Light / Dark Mode

`localStorage` key: `wwmd-dark`. Default: dark.

| Token | Dark | Light (paper) |
|-------|------|--------------|
| `--bg` | `#0c0c0c` | `#f2ede4` |
| `--bg2` | `#161616` | `#e8e2d8` |
| `--border` | `#232320` | `#cac4ba` |
| `--text` | `#f0eeea` | `#1a1614` |
| `--text-dim` | `#555550` | `#6e6560` |

## Typography (Il Cannibale direction only)

| CSS var | Font | Used for |
|---------|------|---------|
| `--font-display` | DM Serif Display | Wordmark (italic), entry labels (italic) |
| `--font-ui` | Space Grotesk | General UI, buttons |
| `--font-mono` | Space Mono | All numbers, badges, section labels |

## GearHero SVG

ViewBox: `360 200`. Cog at `(83, 100)`, chainring at `(268, 100)`.

```
cogR  = 18 + (cogT  − 8)  / 47 × 34   → 18–52px for  8–55t
ringR = 38 + (ringT − 22) / 40 × 52   → 38–90px for 22–62t
```

**Chain:** closed path using external tangent formula. Top strand + chainring outer arc (large arc, CW) + bottom strand + cog outer arc (large arc, CCW). Stroke: `var(--text-dim)`, `strokeDasharray="4 4"`, opacity 0.45.

**Spin:** CSS `animation: spin Xs linear infinite`. `transformOrigin: '0px 0px'` (circles drawn at local 0,0). Cog duration = `base × (cogT / ringT)`. Input change triggers fast burst (base 1.4s → settles to 5s after 1.4s timeout).

## Gear Details

- Cog: outer circle `a2` 3px stroke; inner ring at 47% r, 35% opacity; centre dot fill; 4 lightening holes at 64% r
- Chainring: outer circle `a1` 4.5px stroke; inner ring at 44% r, 35% opacity; centre dot fill; 5 BCD bolt holes at 64% r

## Rollout Bar

Jersey-stripe fill:
```css
background: repeating-linear-gradient(58deg, {color} 0px, {color} 4px, {color}50 4px, {color}50 8px);
transition: width 450ms cubic-bezier(0.22, 1, 0.36, 1);
```

Width = `(entry.rollout / maxRollout) * 100%` as inline style.

## State Shape

```js
{
  theme: 'motorola' | 'look' | '7eleven' | 'molteni',
  isDark: boolean,
  cog: number,          // 8–55
  chainring: number,    // 22–62
  wheelSel: '700c' | '650b' | '26' | 'custom',
  customCirc: string,   // mm, persists across selector toggles
  label: string,
  entries: Entry[],     // max 10, most recent first
}

Entry = {
  id: string,           // Date.now().toString()
  label: string,
  cog: number,
  chainring: number,
  ratio: number,
  rollout: number,
  gearInches: number,
}
```

## Layout

- Breakpoint: 720px (`container-type: inline-size`)
- Mobile: single column
- Desktop: `grid-template-columns: minmax(0,2fr) minmax(0,1fr)`
- Topbar: `height: 61px; position: sticky; top: 0`
- Left/right panels: `overflow-y: auto; max-height: calc(100vh - 61px)`

## Architecture Decisions

- **No external state library** — single App component owns all state; overkill for a one-page calculator
- **On-blur not on-keystroke** — prevents mid-type recalculation jank with numeric inputs
- **Pure functions in `calculations.js`** — keeps logic testable and decoupled from React
- **CSS variables for theming** — four palettes swap by changing 3 vars; no JS theme logic at render time
- **`adaptTheme` luma check** — some palette accent colours are near-white or near-black and become invisible against certain backgrounds; luma-based inversion avoids manual overrides per theme
- **No dependencies in v1** — keeps bundle tiny and deploy trivial; revisit if comparison features need charting

## Current Focus

_Update this at the start of each session._

- v1 shipped and live
- Next: data/UX polish (see Extension points table)

## Rules

- Never install a library without proposing it and waiting for approval
- Show a plan before changing more than 2 files
- Don't touch `calculations.js` for UI work — keep it pure
- Theme changes must work across all four palettes; test all before committing
- Keep GearHero SVG logic in sync with `calculations.js` ratio output

## Coding Conventions

- No class components
- No context/Redux — lift state to App
- CSS vars for all theme-sensitive colours; inline styles only for dynamic values (animation duration, bar width, accent colour)
- `calculations.js` pure functions, no React imports
- No comments except for non-obvious logic (chain tangent math, adaptTheme luma)

## Deployment

```bash
npm run build   # dist/ output
npm run deploy  # gh-pages -d dist
```

`vite.config.js`: `base: '/what-would-merckx-do/'`

## Design Reference

Design prototype extracted from: `what-would-merckx-do/project/wwmd-components.jsx` in the handoff bundle.
