import { useState, useRef, useCallback } from 'react'
import { THEMES, THEME_KEYS, compute, adaptTheme } from './calculations.js'
import Topbar from './components/Topbar.jsx'
import GearHero from './components/GearHero.jsx'
import NumericInput from './components/NumericInput.jsx'
import RatioBadge from './components/RatioBadge.jsx'
import WheelRow from './components/WheelRow.jsx'
import LabelAddRow from './components/LabelAddRow.jsx'
import ComparisonSection from './components/ComparisonSection.jsx'

// ── CSS variable maps ──────────────────────────────────────────────────────────

const DARK_VARS = {
  '--bg':       '#0c0c0c',
  '--bg2':      '#161616',
  '--border':   '#232320',
  '--text':     '#f0eeea',
  '--text-dim': '#555550',
}

const LIGHT_VARS = {
  '--bg':       '#f2ede4',
  '--bg2':      '#e8e2d8',
  '--border':   '#cac4ba',
  '--text':     '#1a1614',
  '--text-dim': '#6e6560',
}

// Molteni light: wheat background uses the theme's own a3 colour as the page bg
const MOLTENI_LIGHT_VARS = {
  '--bg':       '#F5DEB3',
  '--bg2':      '#EDD49A',
  '--border':   '#D4B87A',
  '--text':     '#1a1614',
  '--text-dim': '#7a5c38',
}

const FONT_VARS = {
  '--font-display': "'DM Serif Display', serif",
  '--font-ui':      "'Space Grotesk', sans-serif",
  '--font-mono':    "'Space Mono', monospace",
}

// ── Storage helpers ────────────────────────────────────────────────────────────

function pickInitialTheme() {
  const stored = localStorage.getItem('wwmd-theme')
  if (stored && THEMES[stored]) return stored
  return THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)]
}

function pickInitialDark() {
  const stored = localStorage.getItem('wwmd-dark')
  if (stored !== null) return stored === 'true'
  return true
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme,       setThemeRaw]    = useState(pickInitialTheme)
  const [isDark,      setIsDarkRaw]   = useState(pickInitialDark)
  const [cog,         setCog]         = useState(16)
  const [chainring,   setChainring]   = useState(48)
  const [wheelSel,    setWheelSel]    = useState('700c')
  const [customCirc,  setCustomCirc]  = useState('2105')
  const [label,       setLabel]       = useState('')
  const [entries,     setEntries]     = useState([])
  const [spinFast,    setSpinFast]    = useState(false)

  const spinTimer = useRef(null)

  const setTheme = (v) => {
    setThemeRaw(v)
    localStorage.setItem('wwmd-theme', v)
  }

  const toggleDark = () => {
    setIsDarkRaw(prev => {
      const next = !prev
      localStorage.setItem('wwmd-dark', String(next))
      return next
    })
  }

  const triggerSpin = useCallback(() => {
    setSpinFast(true)
    clearTimeout(spinTimer.current)
    spinTimer.current = setTimeout(() => setSpinFast(false), 1400)
  }, [])

  const t   = THEMES[theme] || THEMES.motorola
  const tA  = adaptTheme(t, isDark)
  // ui1: the interactive/text accent — for Look, yellow is reserved for SVG gear
  // visuals only; red is used for all text, borders, and interactive states.
  const ui1 = tA.uiAccent || tA.a1
  // tUI: tA with a1 replaced by ui1, used by all non-SVG components
  const tUI = { ...tA, a1: ui1 }
  const { ratio, rollout, gearInches } = compute(cog, chainring, wheelSel, customCirc)

  const handleAdd = () => {
    const entry = {
      id:         Date.now().toString(),
      label:      label.trim() || `${chainring}×${cog}`,
      cog:        parseInt(cog)       || 16,
      chainring:  parseInt(chainring) || 48,
      ratio,
      rollout,
      gearInches,
    }
    setEntries(prev => [entry, ...prev].slice(0, 10))
    setLabel('')
  }

  const handleDelete  = (id) => setEntries(prev => prev.filter(e => e.id !== id))
  const handleClearAll = ()  => setEntries([])

  const addDisabled = !cog || !chainring || parseInt(cog) < 1 || parseInt(chainring) < 1

  const bgVars = isDark ? DARK_VARS
    : theme === 'molteni' ? MOLTENI_LIGHT_VARS
    : LIGHT_VARS

  const cssVars = { ...bgVars, ...FONT_VARS }

  return (
    <div className="wwmd" style={cssVars}>
      <Topbar
        theme={theme}
        onThemeChange={setTheme}
        isDark={isDark}
        onDarkToggle={toggleDark}
      />

      <div className="wwmd-grid">
        {/* ── Left panel ── */}
        <div className="wwmd-left" style={{ padding: '18px 20px 28px' }}>
          <div className="wwmd-section-label">{chainring}×{cog}</div>

          <GearHero
            cog={cog}
            chainring={chainring}
            tA={tA}
            spinFast={spinFast}
          />

          {/* Input row — 16px top breathing room (doubled from suggestion) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 16 }}>
            <NumericInput
              value={cog}
              onChange={v => { setCog(v); triggerSpin() }}
              label="Cog Teeth"
              accentColor={tA.a2}
              min={8}
              max={55}
            />
            <RatioBadge ratio={ratio} color={tA.a3} />
            <NumericInput
              value={chainring}
              onChange={v => { setChainring(v); triggerSpin() }}
              label="Ring Teeth"
              accentColor={ui1}
              min={22}
              max={62}
            />
          </div>

          <WheelRow
            wheelSel={wheelSel}
            setWheelSel={w => { setWheelSel(w); triggerSpin() }}
            customCirc={customCirc}
            setCustomCirc={setCustomCirc}
            rollout={rollout}
            accent1={ui1}
          />

          <div style={{ height: 14 }} />

          <LabelAddRow
            label={label}
            setLabel={setLabel}
            onAdd={handleAdd}
            tA={tUI}
            disabled={addDisabled}
          />
        </div>

        {/* ── Right panel ── */}
        <div className="wwmd-right" style={{ padding: '18px 20px 28px' }}>
          <ComparisonSection
            entries={entries}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
            tA={tUI}
          />
        </div>
      </div>
    </div>
  )
}
