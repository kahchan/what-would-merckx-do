import { useState } from 'react'

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

// Returns top and bottom tangent strands only — no wrap arcs.
// Wrap is implied by where the strands meet the gear circles.
function buildChainStrands(cogR, ringR) {
  const dx   = RING_X - COG_X
  const sinA = Math.min(0.98, (ringR - cogR) / dx)
  const cosA = Math.sqrt(1 - sinA * sinA)
  const f    = n => n.toFixed(1)

  // Both tangent vectors point in the same perpendicular direction from their centers —
  // top: (−sinA, −cosA), bottom: (−sinA, +cosA). X offset is always −sinA.
  const ctX = COG_X  - cogR  * sinA,  ctY = COG_Y  - cogR  * cosA
  const rtX = RING_X - ringR * sinA,  rtY = RING_Y - ringR * cosA
  const cbX = COG_X  - cogR  * sinA,  cbY = COG_Y  + cogR  * cosA
  const rbX = RING_X - ringR * sinA,  rbY = RING_Y + ringR * cosA

  return {
    top:    `M ${f(ctX)} ${f(ctY)} L ${f(rtX)} ${f(rtY)}`,
    bottom: `M ${f(rbX)} ${f(rbY)} L ${f(cbX)} ${f(cbY)}`,
  }
}

// Chain strand rendered as two interleaved dash layers — simulates alternating
// inner/outer chain plates. Both layers animate strokeDashoffset in sync;
// layer 2 is offset half a cycle via negative animationDelay to preserve interleave.
function ChainStrand({ d, chainDur }) {
  const anim = {
    animationName: 'wwmd-chain',
    animationDuration: `${chainDur.toFixed(3)}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  }
  const shared = {
    fill: 'none',
    stroke: 'var(--text-dim)',
    strokeWidth: 3,
    strokeDasharray: '8 8',
    strokeLinecap: 'butt',
  }
  return (
    <>
      <path d={d} {...shared} opacity="0.65"
        style={{ ...anim, animationDelay: '0s' }} />
      <path d={d} {...shared} opacity="0.38"
        style={{ ...anim, animationDelay: `-${(chainDur / 2).toFixed(3)}s` }} />
    </>
  )
}

function GearSVG({ cx, cy, r, color, outerStroke, holeCount, teeth, animDuration }) {
  const spinStyle = {
    animation: `wwmd-spin ${animDuration.toFixed(2)}s linear infinite`,
    transformOrigin: '0px 0px',
  }

  const toothLen = 5
  const toothMarks = Array.from({ length: teeth }, (_, i) => {
    const a  = (i / teeth) * 2 * Math.PI
    const x1 = (r + 2)            * Math.cos(a)
    const y1 = (r + 2)            * Math.sin(a)
    const x2 = (r + 2 + toothLen) * Math.cos(a)
    const y2 = (r + 2 + toothLen) * Math.sin(a)
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth="0.9" opacity="0.5" strokeLinecap="round" />
  })

  // First hole is filled — acts as a rotation marker so spin direction is visible.
  // All holes start at 12 o'clock (−π/2 offset).
  const holes = Array.from({ length: holeCount }, (_, i) => {
    const a  = (i / holeCount) * 2 * Math.PI - Math.PI / 2
    const hr = r * 0.64
    const filled = i === 0
    return (
      <circle key={i}
        cx={hr * Math.cos(a)} cy={hr * Math.sin(a)}
        r={Math.max(1.4, r * 0.072)}
        fill={filled ? color : 'none'}
        stroke={color} strokeWidth="1"
        opacity={filled ? 0.55 : 0.3}
      />
    )
  })

  return (
    <g transform={`translate(${cx},${cy})`}>
      <g style={spinStyle}>
        {toothMarks}
        <circle r={r}        fill="none" stroke={color} strokeWidth={outerStroke} />
        {/* Inner ring — 25% opacity for depth hint without competing with outer */}
        <circle r={r * 0.45} fill="none" stroke={color} strokeWidth="1" opacity="0.25" />
        <circle r={r * 0.13} fill={color} />
        {holes}
      </g>
    </g>
  )
}

export default function GearHero({ cog, chainring, tA, spinFast, rpm }) {
  const [hovered, setHovered] = useState(false)

  const cogT  = Math.max(8,  Math.min(55, parseInt(cog)      || 16))
  const ringT = Math.max(22, Math.min(62, parseInt(chainring) || 48))
  // Chainring BCD holes: 3–5 scaled linearly across 22–62t range
  const ringHoles = 3 + Math.round((ringT - 22) / 40 * 2)
  const cogR  = gearRadius(cogT,  true)
  const ringR = gearRadius(ringT, false)

  // Hovering the hero spins everything 3× faster.
  const baseDur  = rpm !== null ? 60 / rpm : (spinFast ? 1.4 : 5)
  const ringDur  = Math.max(0.18, hovered ? baseDur / 3 : baseDur)
  const cogDur   = ringDur * (cogT / ringT)
  // Chain surface speed: 1 dash cycle (16px) passes in ringDur / ringT seconds.
  // Clamped so it stays visible at high cadence.
  const chainDur = Math.max(0.04, ringDur / ringT)

  const { top: topStrand, bottom: bottomStrand } = buildChainStrands(cogR, ringR)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="wwmd-hero"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* Chain strands — drawn behind gears so they disappear under the circles */}
      <ChainStrand d={topStrand} chainDur={chainDur} />
      <ChainStrand d={bottomStrand} chainDur={chainDur} />

      {/* Cog */}
      <GearSVG
        cx={COG_X} cy={COG_Y} r={cogR}
        color={tA.a2} outerStroke={4} holeCount={4}
        teeth={cogT} animDuration={cogDur}
      />

      {/* Chainring */}
      <GearSVG
        cx={RING_X} cy={RING_Y} r={ringR}
        color={tA.a1} outerStroke={6} holeCount={ringHoles}
        teeth={ringT} animDuration={ringDur}
      />

    </svg>
  )
}
