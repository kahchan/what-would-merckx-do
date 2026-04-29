import { contrastColor } from '../calculations.js'

export default function LabelAddRow({ label, setLabel, onAdd, tA, disabled }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={label}
        onChange={e => setLabel(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !disabled && onAdd()}
        placeholder="Race day"
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
        onClick={onAdd}
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
