import { contrastColor } from '../calculations.js'
import RolloutBar from './RolloutBar.jsx'
import Tooltip from './Tooltip.jsx'

export default function ComparisonEntry({ entry, maxRollout, onDelete, tA }) {
  return (
    <div className="wwmd-entry" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
      {/* Header row: label + stats + delete */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 5,
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 17,
          fontStyle: 'italic',
          fontWeight: 400,
          lineHeight: 1.2,
          color: 'var(--text)',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {entry.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: 'var(--text-dim)',
          }}>
            {entry.chainring}×{entry.cog} · {entry.ratio.toFixed(2)}
          </span>
          <button className="wwmd-del" onClick={onDelete}>×</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        color: 'var(--text-dim)',
        display: 'flex',
        gap: 14,
        flexWrap: 'wrap',
      }}>
        <span>
          Rollout{' '}
          <Tooltip text="Distance per pedal revolution = (chainring ÷ cog) × wheel circumference">
            <strong style={{ color: tA.a1, fontWeight: 700 }}>{entry.rollout.toFixed(2)}m</strong>
          </Tooltip>
        </span>
        <span>
          Gear in.{' '}
          <Tooltip text="(chainring ÷ cog) × wheel diameter in inches — higher = harder gear">
            <strong style={{ color: tA.a1, fontWeight: 700 }}>{entry.gearInches.toFixed(1)}"</strong>
          </Tooltip>
        </span>
      </div>

      <RolloutBar value={entry.rollout} max={maxRollout} color={tA.barColor ?? tA.a1} />
    </div>
  )
}
