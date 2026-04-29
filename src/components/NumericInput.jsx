import { useState, useEffect, useRef } from 'react'

export default function NumericInput({ value, onChange, label, accentColor, min = 1, max = 99 }) {
  const [draft, setDraft] = useState(String(value))
  const [flash, setFlash] = useState(false)
  const ref = useRef()

  useEffect(() => { setDraft(String(value)) }, [value])

  const doFlash = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 250)
  }

  const commit = (raw) => {
    const n = parseInt(raw)
    if (!isNaN(n)) {
      const v = Math.max(min, Math.min(max, n))
      setDraft(String(v))
      onChange(v)
      doFlash()
    } else {
      setDraft(String(value))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const v = Math.min(max, value + 1)
      onChange(v); setDraft(String(v)); doFlash()
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const v = Math.max(min, value - 1)
      onChange(v); setDraft(String(v)); doFlash()
    }
    if (e.key === 'Enter') ref.current?.blur()
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`wwmd-num-field${flash ? ' flashing' : ''}`}
        style={{ border: `1.5px solid ${accentColor}`, color: accentColor }}
      />
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.14em',
        color: 'var(--text-dim)',
        textAlign: 'center',
        textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  )
}
