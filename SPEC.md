# What Would Merckx Do? — Product Spec v0.5

## Concept

A fixed-gear drivetrain calculator for track cyclists, urban fixed riders, and anyone who thinks in cog teeth and chain tension. Narrow scope, obsessive execution.

Fixed gear only. v1.

---

## Style Direction: Il Cannibale

Single visual direction. Dark editorial — DM Serif Display for wordmark and entry labels, Space Grotesk for UI, Space Mono for all numbers and mono labels. Palette applies as a unified accent system over a neutral dark (or paper) base.

No style direction switching in the production app.

---

## Inputs

| Field | Type | Notes |
|-------|------|-------|
| Cog | Integer, free text | Tooth count; min 8, max 55 |
| Chainring | Integer, free text | Tooth count; min 22, max 62 |
| Wheel size | 4-option selector | 700c / 650b / 26" / Custom |
| Custom circumference | Integer, inline expand | mm, visible only when Custom selected |
| Setup label | Short text | Names the comparison entry (e.g. "race day") |

Arrow key nudging on cog/chainring inputs. Blur commits with a brief flash animation.

---

## Calculated Outputs (per entry)

| Output | Formula | Display |
|--------|---------|---------|
| Gear ratio | `chainring ÷ cog` | 2 dp; live badge between inputs |
| Rollout | `(chainring ÷ cog) × (circumference ÷ 1000)` | metres; live readout next to wheel selector |
| Gear inches | `(chainring ÷ cog) × (wheel diameter mm ÷ 25.4)` | shown in each comparison entry |

**All values update on blur, not on keystroke.**

---

## Visualisation — GearHero

- Two SVG gears: **cog left, chainring right** (driveside read)
- Decorative circles with inner rings and rotation-visible details (bolt holes / lightening holes)
- Both spin continuously; speed reacts to input changes (fast burst on blur, settles back)
  - Chainring: base duration
  - Cog duration: `base × (cog ÷ chainring)` → smaller cog spins faster
- Chain: closed SVG path using external tangent formula — runs from top of each gear, wraps around outer sides with arcs, neutral `var(--text-dim)` colour, dashed stroke

### GearSVG Sizing

Linear interpolation within fixed ranges:

```
cogR  = 18 + (cogT  − 8)  / 47 × 34   → 18–52px  (8–55t)
ringR = 38 + (ringT − 22) / 40 × 52   → 38–90px  (22–62t)
```

ViewBox: 360×200. Cog centred at (83, 100), chainring at (268, 100).

### Gear Details

| Gear | Outer stroke | Inner ring | Centre dot | Rotation markers |
|------|-------------|-----------|-----------|-----------------|
| Cog | `a2` colour, 3px | 47% radius, 35% opacity | `a2` fill | 4 lightening holes at 64% radius |
| Chainring | `a1` colour, 4.5px | 44% radius, 35% opacity | `a1` fill | 5 BCD bolt holes at 64% radius |

---

## Comparison Stack

Saved entries only. No pinned live entry — the gear hero and input row are the live view.

- Most recent entry at top; max 10 (oldest drops off silently)
- Per entry: label (DM Serif Display italic), `chainring×cog · ratio`, rollout (m) with tooltip, gear inches with tooltip, rollout bar
- **Rollout bar:** jersey-stripe fill (`repeating-linear-gradient` at 58°); scales dynamically so longest entry fills full width; `transition: width 450ms cubic-bezier(0.22,1,0.36,1)` on rescale
- All entries same accent colour (theme-driven)
- **Delete:** hover-reveal × per entry
- **Clear all:** available but de-emphasised
- **Empty state:** "No setups saved yet. / Label a gear and hit + ADD."

### Tooltips

- Rollout: *"Distance per pedal revolution = (chainring ÷ cog) × wheel circumference"*
- Gear inches: *"(chainring ÷ cog) × wheel diameter in inches — higher = harder gear"*

---

## Theme System

Four team palettes. Selector: split-circle dot buttons in topbar. Persisted to `localStorage`. Random theme on first session load.

| Key | Team | a1 | a2 | a3 |
|-----|------|----|----|-----|
| `motorola` | Team Motorola | `#B81830` | `#003DA5` | `#FFFFFF` |
| `look` | Team Look | `#F0C000` | `#111111` | `#B81830` |
| `7eleven` | Team 7-Eleven | `#B81830` | `#005C34` | `#FFFFFF` |
| `molteni` | Team Molteni | `#E85D04` | `#00356B` | `#F5DEB3` |

- `a1` = primary accent (chainring, add button, active states)
- `a2` = secondary accent (cog)
- `a3` = tertiary accent (ratio badge)
- Near-white `a3` adapted to near-black in light mode; near-black `a2` adapted to near-white in dark mode

### Theme Dot Design

SVG split-circle: left half `a2`, right half `a1`. Active dot gets a full-opacity ring in `var(--text)`. Inactive: low-opacity ring.

### Colour Adaptation

```js
function adaptTheme(theme, isDark) {
  // near-white (luma > 200) on paper bg → #1E1E1E
  // near-black (luma < 35)  on dark bg  → #D0D0D0
}
```

---

## Light / Dark Mode

Toggle in topbar, adjacent to theme dots. Persisted to `localStorage`.

| Mode | Background | Body text | Dim text | Border |
|------|-----------|-----------|---------|--------|
| Dark (default) | `#0c0c0c` | `#f0eeea` | `#555550` | `#232320` |
| Light (paper) | `#f2ede4` | `#1a1614` | `#6e6560` | `#cac4ba` |

Secondary background (`--bg2`) used for input fields and entry cards:
- Dark: `#161616`
- Light: `#e8e2d8`

---

## Layout

### Mobile (< 720px) — single column

1. Topbar — wordmark left, [theme dots · dark/light toggle] right
2. GearHero
3. InputRow — cog · RatioBadge · chainring
4. WheelRow — selector + rollout readout
5. CustomExpand — inline, visible when Custom
6. LabelAddRow — label + Add button
7. ComparisonSection

### Desktop (≥ 720px) — two columns

- Grid: `2fr 1fr`
- **Left (2fr):** hero + inputs + wheel + label/add; `overflow-y: auto; max-height: calc(100vh - 61px)`
- **Right (1fr):** comparison stack, always visible, same scroll constraints; `border-left: 1px solid var(--border)`
- Topbar: full width, `position: sticky; top: 0`, `height: 61px`

---

## Component List

| Component | Responsibility |
|-----------|---------------|
| `App` | Root state, layout shell, CSS var injection |
| `Topbar` | Wordmark + ThemeSelector + DarkToggle |
| `ThemeSelector` | 4 split-circle dot buttons; localStorage |
| `DarkToggle` | Icon button; toggles dark/light; localStorage |
| `GearHero` | SVG viewBox, chain path, two GearSVGs |
| `GearSVG` | Single gear: rings, holes, CSS spin animation |
| `NumericInput` | Number field; arrow key nudge; blur flash; blur commit |
| `RatioBadge` | Live ratio, no border/background |
| `WheelRow` | Selector buttons + rollout readout + CustomExpand |
| `CustomExpand` | Inline circumference input (mm) |
| `LabelAddRow` | Label field (DM Serif italic) + Add button |
| `ComparisonSection` | Header + entry list + Clear all + empty state |
| `ComparisonEntry` | Label, stats row, tooltips, RolloutBar, hover-delete |
| `RolloutBar` | Jersey-stripe fill, animated width |
| `Tooltip` | Hover tooltip for rollout and gear inches labels |
| `calculations.js` | Pure functions: ratio, rollout, gearInches, adaptTheme |

---

## Behaviour Details

- **Add button** disabled if cog or chainring is 0 / empty
- **Label** defaults to `chainring×cog` if blank on add
- **Entries cap:** 10 max; adding an 11th removes the oldest
- **Custom wheel** circumference persists in state across selector toggles
- **Enter key** in label field triggers Add
- **No server, no auth, no analytics in v1**

---

## Fonts (Google Fonts)

| Variable | Font | Usage |
|----------|------|-------|
| `--font-display` | DM Serif Display | Wordmark, entry labels |
| `--font-ui` | Space Grotesk | Body, buttons, general UI |
| `--font-mono` | Space Mono | All numbers, badges, section labels |

---

## Clarifications vs v0.4

- Style locked to Il Cannibale; direction switching dropped
- Live entry removed from comparison stack; hero + inputs are the live view
- Dark/light toggle added to topbar
- Molteni added as 4th theme
- Colour values updated from design: reds warmed/darkened (`#B81830`), Look restructured (`#F0C000` / `#111111` / `#B81830`)
- GearSVG sizing switched from clamp to linear interpolation formula
- Chain path specified as external tangent with wrap arcs
- Rollout bar: jersey-stripe gradient, cubic-bezier transition
- Arrow key nudge and blur flash confirmed in scope
- Tooltips on rollout and gear inches confirmed

---

## Extension Points (not v1)

| Version | Feature |
|---------|---------|
| v2 | Cadence → speed (RPM input → km/h) |
| v3 | Imperial toggle (rollout in feet) |
| Later | Bike garage |
| Later | Shareable URL |
| Later | Community data |
