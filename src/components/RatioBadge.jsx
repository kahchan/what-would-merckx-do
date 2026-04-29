export default function RatioBadge({ ratio, color }) {
  return (
    <div style={{
      flexShrink: 0,
      width: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 5,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 28,
        fontWeight: 700,
        color,
        textAlign: 'center',
        width: '100%',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        padding: '13px 6px',
      }}>
        {ratio.toFixed(2)}
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.14em',
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
      }}>Ratio</span>
    </div>
  )
}
