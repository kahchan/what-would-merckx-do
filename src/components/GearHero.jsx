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
  const dx   = RING_X - COG_X
  const sinA = Math.min(0.98, (ringR - cogR) / dx)
  const cosA = Math.sqrt(1 - sinA * sinA)
  const f    = n => n.toFixed(1)

  const ctX = COG_X  - cogR  * sinA,  ctY = COG_Y  - cogR  * cosA
  const rtX = RING_X - ringR * sinA,  rtY = RING_Y - ringR * cosA
  const cbX = COG_X  + cogR  * sinA,  cbY = COG_Y  + cogR  * cosA
  const rbX = RING_X + ringR * sinA,  rbY = RING_Y + ringR * cosA

  return [
    `M ${f(ctX)} ${f(ctY)}`,
    `L ${f(rtX)} ${f(rtY)}`,
    `A ${f(ringR)} ${f(ringR)} 0 1 1 ${f(rbX)} ${f(rbY)}`,
    `L ${f(cbX)} ${f(cbY)}`,
    `A ${f(cogR)}  ${f(cogR)}  0 1 0 ${f(ctX)} ${f(ctY)}`,
  ].join(' ')
}

// outerStroke: heavy outer ring weight (cog=4, chainring=6)
// holeCount: 4 for cog, 5 for chainring (BCD)
// teeth: actual tooth count — drives tooth-mark density
function GearSVG({ cx, cy, r, color, outerStroke, holeCount, teeth, animDuration }) {
  const spinStyle = {
    animation: `wwmd-spin ${animDuration.toFixed(2)}s linear infinite`,
    transformOrigin: '0px 0px',
  }

  // Tooth marks: short radial lines just outside the outer circle
  const toothLen = 5
  const toothMarks = Array.from({ length: teeth }, (_, i) => {
    const a  = (i / teeth) * 2 * Math.PI
    const x1 = (r + 2)           * Math.cos(a)
    const y1 = (r + 2)           * Math.sin(a)
    const x2 = (r + 2 + toothLen) * Math.cos(a)
    const y2 = (r + 2 + toothLen) * Math.sin(a)
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth="0.9" opacity="0.5" strokeLinecap="round" />
  })

  // Lightening holes / BCD bolt holes
  const holes = Array.from({ length: holeCount }, (_, i) => {
    const a  = (i / holeCount) * 2 * Math.PI - (holeCount === 5 ? Math.PI / 2 : 0)
    const hr = r * 0.64
    return (
      <circle key={i}
        cx={hr * Math.cos(a)} cy={hr * Math.sin(a)}
        r={Math.max(1.4, r * 0.072)}
        fill="none" stroke={color} strokeWidth="1" opacity="0.3"
      />
    )
  })

  return (
    <g transform={`translate(${cx},${cy})`}>
      <g style={spinStyle}>
        {/* Tooth marks at outer rim */}
        {toothMarks}
        {/* Outer ring — heavy */}
        <circle r={r} fill="none" stroke={color} strokeWidth={outerStroke} />
        {/* Inner ring — light, creates depth */}
        <circle r={r * 0.45} fill="none" stroke={color} strokeWidth="1" opacity="0.18" />
        {/* Centre hub */}
        <circle r={r * 0.13} fill={color} />
        {/* Holes */}
        {holes}
      </g>
    </g>
  )
}

export default function GearHero({ cog, chainring, tA, spinFast }) {
  const cogT  = Math.max(8,  Math.min(55, parseInt(cog)      || 16))
  const ringT = Math.max(22, Math.min(62, parseInt(chainring) || 48))
  const cogR  = gearRadius(cogT,  true)
  const ringR = gearRadius(ringT, false)

  const baseDur = spinFast ? 1.4 : 5
  const ringDur = baseDur
  // cog period = chainring period × (cog / chainring) — smaller cog spins faster
  const cogDur  = baseDur * (cogT / ringT)

  const chainPath = buildChainPath(cogR, ringR)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>

      {/* Chain — round dots evoke rollers */}
      <path d={chainPath} fill="none"
        stroke="var(--text-dim)" strokeWidth="2.5"
        strokeDasharray="2 6" strokeLinecap="round" opacity="0.55"
      />

      {/* Cog */}
      <GearSVG
        cx={COG_X} cy={COG_Y} r={cogR}
        color={tA.a2} outerStroke={4} holeCount={4}
        teeth={cogT} animDuration={cogDur}
      />

      {/* Chainring */}
      <GearSVG
        cx={RING_X} cy={RING_Y} r={ringR}
        color={tA.a1} outerStroke={6} holeCount={5}
        teeth={ringT} animDuration={ringDur}
      />

    </svg>
  )
}
