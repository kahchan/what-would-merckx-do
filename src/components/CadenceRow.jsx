import { useState, useRef } from 'react'

// Mirrors the WheelRow layout: controls on the left, output right-aligned to
// match the rollout column so rollout and speed read as a vertical pair.
export default function CadenceRow({ rpm, onRpmChange, speed, accent1 }) {
  const [draft, setDraft]       = useState(rpm === null ? '' : String(rpm))
  const [dragging, setDragging] = useState(false)
  const ref     = useRef()
  const dragRef = useRef(null)

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

  const handleMouseDown = (e) => {
    if (e.pointerType !== 'mouse') return  // touch/pen: let browser handle focus + keyboard
    if (e.button !== 0) return
    e.preventDefault()
    ref.current?.blur()
    setDragging(true)
    const startRpm = parseInt(draft) || 90
    dragRef.current = { startY: e.clientY, startValue: startRpm }

    const onMove = (me) => {
      const delta = Math.round((dragRef.current.startY - me.clientY) / 2)
      const v = Math.max(1, Math.min(220, dragRef.current.startValue + delta))
      setDraft(String(v))
      onRpmChange(v)
    }

    const onUp = () => {
      dragRef.current = null
      setDragging(false)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {/* left side: rpm control — fills same space as wheel buttons */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
          color: 'var(--text-dim)', textTransform: 'uppercase', flexShrink: 0,
        }}>@</span>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          placeholder="90"
          onChange={e => setDraft(e.target.value)}
          onBlur={e => { if (!dragRef.current) commit(e.target.value) }}
          onKeyDown={handleKeyDown}
          onPointerDown={handleMouseDown}
          style={{
            width: 52,
            background: 'var(--bg2)',
            border: '1.5px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 700,
            padding: '5px 6px',
            borderRadius: 3,
            textAlign: 'center',
            cursor: 'ns-resize',
            userSelect: dragging ? 'none' : undefined,
          }}
        />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.10em',
          color: 'var(--text-dim)',
        }}>rpm</span>
      </div>

      {/* right side: speed — aligns with rollout column */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 16,
        fontWeight: 700,
        color: speed !== null ? accent1 : 'var(--text-dim)',
        letterSpacing: '-0.02em',
        minWidth: 58,
        textAlign: 'right',
        whiteSpace: 'nowrap',
      }}>
        {speed !== null ? `${speed.toFixed(1)} km/h` : '—'}
      </div>
    </div>
  )
}
