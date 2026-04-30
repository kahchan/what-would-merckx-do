import { useState } from 'react'
import { contrastColor } from '../calculations.js'

const PLACEHOLDERS = [
  'Race day',
  'Training ride',
  'Hill climb',
  'Sprint finish',
  'Sunday spin',
  'Criterium',
  'Time trial',
  'The Cannibal',
  'Café ride',
  'Breakaway',
  'Chain gang',
  'Paris–Roubaix',
  'Morning commute',
  'Attack!',
  'The Merckx',
  'Fixed commute',
]

export default function LabelAddRow({ label, setLabel, onAdd, tA, disabled }) {
  const [phIdx, setPhIdx] = useState(0)

  const handleAdd = () => {
    if (disabled) return
    onAdd()
    setPhIdx(i => {
      let next
      do { next = Math.floor(Math.random() * PLACEHOLDERS.length) }
      while (next === i)
      return next
    })
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={label}
        onChange={e => setLabel(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !disabled && handleAdd()}
        placeholder={PLACEHOLDERS[phIdx]}
        maxLength={28}
        style={{
          flex: 1,
          background: 'var(--bg2)',
          border: '1.5px solid var(--border)',
          color: 'var(--text)',
          fontFamily: "'DM Serif Display', serif",
          fontStyle: 'italic',
          fontSize: 17,
          padding: '11px 14px',
          borderRadius: 3,
        }}
      />
      <button
        className="wwmd-add-btn"
        onClick={handleAdd}
        disabled={disabled}
        style={{
          background: tA.a1,
          color: contrastColor(tA.a1),
        }}
      >
        + ADD
      </button>
    </div>
  )
}
