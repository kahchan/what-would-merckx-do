import { useState, useRef } from 'react'

export default function CadenceRow({ rpm, onRpmChange, speed, accent1 }) {
  const [draft, setDraft] = useState(rpm === null ? '' : String(rpm))
  const ref = useRef()

  const commit = (raw) => {
    const n = parseInt(raw)
    if (!isNaN(n) && n > 0) {
      const v = Math.max(1, Math.min(220, n))
      setDraft(String(v))
      onRpmChange(v)
    } else {
      setDraft('')
      onRpmChange(null)
    }
  }

  const handleKeyDown = (e) => {
    const cur = parseInt(draft) || 0
    if (e.key === 'ArrowUp')   { e.preventDefault(); const v = Math.min(220, cur + 1); setDraft(String(v)); onRpmChange(v) }
    if (e.key === 'ArrowDown') { e.preventDefault(); const v = Math.max(1,   cur - 1); setDraft(String(v)); onRpmChange(v) }
    if (e.key === 'Enter')     { ref.current?.blur() }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em',
        color: 'var(--text-dim)', flexShrink: 0, textTransform: 'uppercase',
      }}>RPM</span>

      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={draft}
        placeholder="90"
        onChange={e => setDraft(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: 64,
          background: 'var(--bg2)',
          border: '1.5px solid var(--border)',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 700,
          padding: '6px 8px',
          borderRadius: 3,
          textAlign: 'center',
          cursor: 'ns-resize',
        }}
      />

      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em',
        color: 'var(--text-dim)',
      }}>→</span>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 16,
        fontWeight: 700,
        color: speed !== null ? accent1 : 'var(--text-dim)',
        letterSpacing: '-0.02em',
        minWidth: 80,
      }}>
        {speed !== null ? `${speed.toFixed(1)} km/h` : '—'}
      </div>
    </div>
  )
}
