# Build Plan — What Would Merckx Do?

## Phase 0 — Project Setup

- [ ] `npm create vite@latest . -- --template react`
- [ ] Install `gh-pages` dev dependency
- [ ] Configure `vite.config.js`: set `base: '/what-would-merckx-do/'`
- [ ] Add `deploy` script to `package.json`: `"deploy": "vite build && gh-pages -d dist"`
- [ ] Strip Vite boilerplate (default CSS, App template)
- [ ] Create `src/components/` and `src/styles/` directories
- [ ] Init git, create GitHub repo, push, enable Pages from `gh-pages` branch

## Phase 1 — Foundation (CSS + Theme System)

- [ ] `global.css`: CSS reset, base typography, neutral background, layout shell vars
- [ ] `themes.css`: Define `--accent-primary`, `--accent-secondary`, `--accent-tertiary` per `.theme-motorola`, `.theme-look`, `.theme-7eleven`
- [ ] Wire theme class to `<body>` from `appState.theme`
- [ ] `ThemeSelector`: 3 dot buttons, localStorage read/write, active ring indicator
- [ ] `Topbar`: wordmark left, ThemeSelector right

## Phase 2 — Calculations Utility

- [ ] `src/calculations.js`: pure functions
  - `calcRatio(chainring, cog)` → 2dp number
  - `calcRollout(chainring, cog, circumference)` → metres, 2dp
  - `calcGearInches(chainring, cog, circumference)` → 1dp number
- [ ] Manual verification against known setups (e.g. 48×16 on 700c)

## Phase 3 — Input Components

- [ ] `GearSVG`: SVG circle with decorative rings, CSS spin animation, accepts `teeth` and `animDuration` props
- [ ] `GearHero`: positions two GearSVGs + dotted chain connector; derives animation durations from ratio
- [ ] `InputRow`: cog input + `RatioBadge` + chainring input; updates state on blur
- [ ] `RatioBadge`: displays live ratio
- [ ] `WheelRow`: 4-button selector + rollout readout; toggles CustomExpand
- [ ] `CustomExpand`: inline circumference input in mm
- [ ] `LabelAddRow`: label input + Add button (disabled guard)

## Phase 4 — Comparison Stack

- [ ] `ComparisonSection`: renders live entry + saved entries list + Clear all
- [ ] `ComparisonEntry`: label, stats row (ring×cog, ratio, rollout, gear inches), RolloutBar, hover-delete ×
- [ ] `RolloutBar`: dynamic width = `(entry.rollout / maxRollout) * 100%`
- [ ] Live entry visual treatment: accent border/glow via CSS var
- [ ] Entry cap logic: trim to 10 on add

## Phase 5 — Layout & Responsiveness

- [ ] Mobile layout (single column, stacked)
- [ ] Desktop layout (2-column grid at 768px+, left panel + right panel)
- [ ] Topbar full width above columns on desktop

## Phase 6 — Polish & Edge Cases

- [ ] Default label fallback (`ring×cog` when blank)
- [ ] Custom circumference persistence on wheel selector toggle
- [ ] Input validation: non-numeric, zero, negative guarded at blur
- [ ] GearHero: handle ratio = 1 and edge cog/ring values gracefully
- [ ] Theme dot active state visual
- [ ] Rollout bar scales correctly when single entry present

## Phase 7 — Deploy

- [ ] `npm run build` — verify dist output
- [ ] `npm run deploy` — push to `gh-pages` branch
- [ ] Verify live on `https://[username].github.io/what-would-merckx-do/`
- [ ] Test on mobile viewport

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Vite over CRA | Faster, simpler, better GitHub Pages support |
| CSS variables for themes | No runtime overhead, no library, easy to extend |
| Blur not keystroke | Spec requirement; avoids jank during mid-number entry |
| `calculations.js` as pure functions | Testable in isolation, no React dependency |
| No context/Redux | App is small enough for prop drilling + lifted state in App |
