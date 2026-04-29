const OPTS = [
  { key: '700c',   label: '700c' },
  { key: '650b',   label: '650b' },
  { key: '26',     label: '26"'  },
  { key: 'custom', label: '···'  },
]

export default function WheelRow({ wheelSel, setWheelSel, customCirc, setCustomCirc, rollout, accent1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {OPTS.map(({ key, label }) => {
          const active = wheelSel === key
          return (
            <button
              key={key}
              className="wwmd-wheel-btn"
              onClick={() => setWheelSel(key)}
              style={{
                flex: key === 'custom' ? 0.65 : 1,
                border: `1.5px solid ${active ? accent1 : 'var(--border)'}`,
                background: active ? accent1 + '1a' : 'transparent',
                color: active ? accent1 : 'var(--text-dim)',
              }}
            >{label}</button>
          )
        })}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 16,
          fontWeight: 700,
          color: accent1,
          minWidth: 58,
          textAlign: 'right',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
        }}>
          {rollout.toFixed(2)}m
        </div>
      </div>

      {wheelSel === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-dim)',
            letterSpacing: '0.12em',
            flexShrink: 0,
          }}>CIRC</span>
          <input
            type="text"
            inputMode="numeric"
            value={customCirc}
            onChange={e => setCustomCirc(e.target.value)}
            placeholder="2105"
            style={{
              flex: 1,
              background: 'var(--bg2)',
              border: '1.5px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              padding: '6px 10px',
              borderRadius: 3,
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>mm</span>
        </div>
      )}
    </div>
  )
}
