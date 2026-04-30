export const WHEEL = {
  '700c': { circ: 2105, diam: 700 },
  '650b': { circ: 1953, diam: 650 },
  '26':   { circ: 1995, diam: 660.4 },
}

export const THEMES = {
  motorola: { a1: '#B81830', a2: '#003DA5', a3: '#FFFFFF', label: 'Motorola' },
  // Look: yellow is visual-only (gear SVG strokes). uiAccent (red) is used for
  // all text, borders, interactive states — yellow on cream is illegible.
  look:     { a1: '#F0C000', a2: '#003DA5', a3: '#B81830', uiAccent: '#B81830', label: 'Look' },
  '7eleven':{ a1: '#B81830', a2: '#005C34', a3: '#FFFFFF', label: '7-Eleven' },
  molteni:  { a1: '#E85D04', a2: '#00356B', a3: '#F5DEB3', label: 'Molteni' },
}

export const THEME_KEYS = ['motorola', 'look', '7eleven', 'molteni']

export function calcRatio(chainring, cog) {
  return chainring / Math.max(1, cog)
}

export function calcRollout(chainring, cog, circ) {
  return (chainring / Math.max(1, cog)) * (circ / 1000)
}

export function calcGearInches(chainring, cog, circ) {
  // circ = π × diameter, so diameter = circ / π
  return (chainring / Math.max(1, cog)) * (circ / Math.PI / 25.4)
}

export function resolveCircumference(wheelSel, customCirc) {
  if (wheelSel === 'custom') return parseFloat(customCirc) || 2105
  return WHEEL[wheelSel]?.circ ?? 2105
}

export function compute(cog, chainring, wheelSel, customCirc) {
  const c    = Math.max(1, parseInt(cog) || 16)
  const r    = Math.max(1, parseInt(chainring) || 48)
  const circ = resolveCircumference(wheelSel, customCirc)
  return {
    ratio:      calcRatio(r, c),
    rollout:    calcRollout(r, c, circ),
    gearInches: calcGearInches(r, c, circ),
  }
}

// speed in km/h from rollout (metres) and cadence (RPM)
export function calcSpeed(rollout, rpm) {
  if (!rpm || rpm <= 0) return null
  return rollout * rpm * 60 / 1000
}

// luma-based contrast: returns readable foreground colour for a given hex bg
export function contrastColor(hex) {
  if (!hex || hex[0] !== '#') return '#111'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) > 135 ? '#111111' : '#f5f5f5'
}

// Adapt near-white/near-black accents so they're readable on current bg
export function adaptTheme(t, isDark) {
  const adapt = (hex) => {
    if (!hex || hex.length < 7 || hex[0] !== '#') return hex
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luma = 0.299 * r + 0.587 * g + 0.114 * b
    if (!isDark && luma > 200) return '#1E1E1E'
    if (isDark  && luma < 35)  return '#D0D0D0'
    return hex
  }
  const adapted = { ...t, a1: adapt(t.a1), a2: adapt(t.a2), a3: adapt(t.a3) }
  if (t.uiAccent) adapted.uiAccent = adapt(t.uiAccent)
  return adapted
}
