const OPTS = [
  { key: '32',     long: '32"',           short: '32"'    },
  { key: '700c',   long: '700c / 29"',    short: '29"'    },
  { key: '650b',   long: '650b / 27.5"',  short: '27.5"'  },
  { key: '26',     long: '26"',           short: '26"'    },
  { key: 'custom', long: '···',           short: '···'    },
]

export default function WheelRow({ wheelSel, setWheelSel, customCirc, setCustomCirc, rollout, accent1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {OPTS.map(({ key, long, short }) => {
          const active = wheelSel === key
          return (
            <button
              key={key}
              className={`wwmd-wheel-btn${active ? ' active' : ''}`}
              onClick={() => setWheelSel(key)}
              style={active ? {
                border: `1.5px solid ${accent1}`,
                background: accent1 + '1a',
                color: accent1,
              } : {
                flex: key === 'custom' ? 0.65 : 1,
              }}
            >
              <span className="wwmd-wheel-long">{long}</span>
              <span className="wwmd-wheel-short">{short}</span>
            </button>
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
