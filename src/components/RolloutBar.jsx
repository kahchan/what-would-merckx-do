export default function RolloutBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div style={{
      height: 4,
      background: 'rgba(128,128,128,0.18)',
      borderRadius: 2,
      overflow: 'hidden',
      marginTop: 9,
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        borderRadius: 2,
        background: `repeating-linear-gradient(58deg, ${color} 0px, ${color} 4px, ${color}50 4px, ${color}50 8px)`,
        transition: 'width 450ms cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </div>
  )
}
