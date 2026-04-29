const W = 360, H = 200
const COG_X = 83,  COG_Y = H / 2
const RING_X = 268, RING_Y = H / 2

function gearRadius(teeth, isCog) {
  if (isCog) {
    const t = Math.max(8, Math.min(55, teeth))
    return 18 + (t - 8) / 47 * 34      // 18–52px for 8–55t
  } else {
    const t = Math.max(22, Math.min(62, teeth))
    return 38 + (t - 22) / 40 * 52     // 38–90px for 22–62t
  }
}

function buildChainPath(cogR, ringR) {
  // External tangent: chain runs along outer sides of both gears
  const dx   = RING_X - COG_X
  const sinA = Math.min(0.98, (ringR - cogR) / dx)
  const cosA = Math.sqrt(1 - sinA * sinA)
  const f    = n => n.toFixed(1)

  // Tangent touch points
  const ctX = COG_X  - cogR  * sinA,  ctY = COG_Y  - cogR  * cosA   // cog top
  const rtX = RING_X - ringR * sinA,  rtY = RING_Y - ringR * cosA   // ring top
  const cbX = COG_X  + cogR  * sinA,  cbY = COG_Y  + cogR  * cosA   // cog bottom
  const rbX = RING_X + ringR * sinA,  rbY = RING_Y + ringR * cosA   // ring bottom

  return [
    `M ${f(ctX)} ${f(ctY)}`,
    `L ${f(rtX)} ${f(rtY)}`,
    `A ${f(ringR)} ${f(ringR)} 0 1 1 ${f(rbX)} ${f(rbY)}`,
    `L ${f(cbX)} ${f(cbY)}`,
    `A ${f(cogR)}  ${f(cogR)}  0 1 0 ${f(ctX)} ${f(ctY)}`,
  ].join(' ')
}

function GearSVG({ cx, cy, r, color, holes, holeCount, strokeWidth = 3 }) {
  const spinStyle = {
    animation: `wwmd-spin var(--gear-dur, 5s) linear infinite`,
    transformOrigin: '0px 0px',
  }

  return (
    <g transform={`translate(${cx},${cy})`}>
      <g style={spinStyle}>
        <circle r={r}         fill="none" stroke={color} strokeWidth={strokeWidth} />
        <circle r={r * 0.45}  fill="none" stroke={color} strokeWidth={1.8} opacity="0.35" />
        <circle r={r * 0.12}  fill={color} />
        {Array.from({ length: holeCount }, (_, i) => {
          const a  = (i / holeCount) * 2 * Math.PI - (holeCount === 5 ? Math.PI / 2 : 0)
          const hr = r * 0.64
          return (
            <circle
              key={i}
              cx={hr * Math.cos(a)}
              cy={hr * Math.sin(a)}
              r={Math.max(1.5, r * 0.075)}
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              opacity="0.45"
            />
          )
        })}
      </g>
    </g>
  )
}

export default function GearHero({ cog, chainring, tA, spinFast }) {
  const cogT  = Math.max(8,  Math.min(55, parseInt(cog)      || 16))
  const ringT = Math.max(22, Math.min(62, parseInt(chainring) || 48))
  const cogR  = gearRadius(cogT,  true)
  const ringR = gearRadius(ringT, false)

  const baseDur  = spinFast ? 1.4 : 5
  const ringDur  = baseDur
  const cogDur   = baseDur * (cogT / ringT)

  const chainPath = buildChainPath(cogR, ringR)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', display: 'block', overflow: 'visible' }}
    >
      {/* Chain — behind the gears */}
      <path
        d={chainPath}
        fill="none"
        stroke="var(--text-dim)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.45"
      />

      {/* Cog */}
      <g style={{ '--gear-dur': `${cogDur.toFixed(2)}s` }}>
        <GearSVG cx={COG_X} cy={COG_Y} r={cogR} color={tA.a2} holes strokeWidth={3} holeCount={4} />
      </g>

      {/* Chainring */}
      <g style={{ '--gear-dur': `${ringDur.toFixed(2)}s` }}>
        <GearSVG cx={RING_X} cy={RING_Y} r={ringR} color={tA.a1} holes strokeWidth={4.5} holeCount={5} />
      </g>

      {/* Labels */}
      <text
        x={COG_X} y={COG_Y + cogR + 17}
        textAnchor="middle"
        fill="var(--text-dim)"
        style={{ font: '9px/1 var(--font-mono)', letterSpacing: '0.14em' }}
      >COG</text>
      <text
        x={RING_X} y={RING_Y + ringR + 17}
        textAnchor="middle"
        fill="var(--text-dim)"
        style={{ font: '9px/1 var(--font-mono)', letterSpacing: '0.14em' }}
      >CHAINRING</text>
    </svg>
  )
}
