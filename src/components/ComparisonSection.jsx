import ComparisonEntry from './ComparisonEntry.jsx'

export default function ComparisonSection({ entries, onDelete, onClearAll, tA }) {
  const maxRollout = Math.max(...entries.map(e => e.rollout), 0.001)

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.18em',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
        }}>
          Comparison
        </span>
        {entries.length > 0 && (
          <button
            onClick={onClearAll}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.length === 0 ? (
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: 'var(--text-dim)',
            textAlign: 'center',
            padding: '28px 0 16px',
            lineHeight: 2.2,
            borderTop: '1px solid var(--border)',
            marginTop: 4,
          }}>
            No setups saved yet.<br />
            <span style={{ opacity: 0.5, fontSize: 10 }}>Label a gear and hit + ADD.</span>
          </div>
        ) : (
          entries.map(e => (
            <ComparisonEntry
              key={e.id}
              entry={e}
              maxRollout={maxRollout}
              onDelete={() => onDelete(e.id)}
              tA={tA}
            />
          ))
        )}
      </div>
    </div>
  )
}
