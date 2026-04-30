import { useState, useEffect, useRef } from 'react'

export default function NumericInput({ value, onChange, label, accentColor, min = 1, max = 99 }) {
  const [draft, setDraft]     = useState(String(value))
  const [flash, setFlash]     = useState(false)
  const [dragging, setDragging] = useState(false)
  const ref     = useRef()
  const dragRef = useRef(null)

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

  const handleMouseDown = (e) => {
    if (e.pointerType !== 'mouse') return  // touch/pen: let browser handle focus + keyboard
    if (e.button !== 0) return
    e.preventDefault()
    ref.current?.blur()
    setDragging(true)
    dragRef.current = { startY: e.clientY, startValue: parseInt(String(value)) || min }

    const onMove = (me) => {
      const delta = Math.round((dragRef.current.startY - me.clientY) / 3)
      const v = Math.max(min, Math.min(max, dragRef.current.startValue + delta))
      onChange(v)
      setDraft(String(v))
    }

    const onUp = () => {
      dragRef.current = null
      setDragging(false)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      doFlash()
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={e => { if (!dragRef.current) commit(e.target.value) }}
        onKeyDown={handleKeyDown}
        onPointerDown={handleMouseDown}
        className={`wwmd-num-field${flash ? ' flashing' : ''}`}
        style={{
          border: `1.5px solid ${accentColor}`,
          color: accentColor,
          cursor: dragging ? 'ns-resize' : 'ns-resize',
          userSelect: dragging ? 'none' : undefined,
        }}
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
