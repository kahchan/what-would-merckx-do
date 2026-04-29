// wwmd-components.jsx — What Would Merckx Do? components

const { useState, useEffect, useRef, useCallback } = React;

// ─── Constants ────────────────────────────────────────────────────────────────

const WHEEL = {
  '700c': { circ: 2105, diam: 700 },
  '650b': { circ: 1953, diam: 650 },
  '26'  : { circ: 1995, diam: 660.4 },
};

const THEMES = {
  motorola : { a1: '#B81830', a2: '#003DA5', a3: '#FFFFFF', label: 'Motorola'  },
  look     : { a1: '#F0C000', a2: '#111111', a3: '#B81830', label: 'Look'      },
  '7eleven': { a1: '#B81830', a2: '#005C34', a3: '#FFFFFF', label: '7-Eleven'  },
  molteni  : { a1: '#E85D04', a2: '#00356B', a3: '#F5DEB3', label: 'Molteni'   },
};
const THEME_KEYS = ['motorola', 'look', '7eleven', 'molteni'];

function compute(cog, chainring, wheelSel, customCirc) {
  const c = Math.max(1, parseInt(cog) || 16);
  const r = Math.max(1, parseInt(chainring) || 48);
  const preset = WHEEL[wheelSel];
  const circ   = wheelSel === 'custom' ? (parseFloat(customCirc) || 2105) : preset.circ;
  const diamMm = wheelSel === 'custom' ? circ / Math.PI : preset.diam;
  return {
    ratio      : r / c,
    rollout    : (r / c) * circ / 1000,
    gearInches : (r / c) * (diamMm / 25.4),
  };
}

function contrastColor(hex) {
  if (!hex || hex[0] !== '#') return '#111';
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b) > 135 ? '#111111' : '#f5f5f5';
}

// Adapt theme accent colors so they're always readable against the current bg
function adaptTheme(t, isDark) {
  const adapt = (hex) => {
    if (!hex || hex.length < 7 || hex[0] !== '#') return hex;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const luma = 0.299*r + 0.587*g + 0.114*b;
    if (!isDark && luma > 200) return '#1E1E1E'; // near-white on paper bg → near-black
    if (isDark  && luma < 35)  return '#D0D0D0'; // near-black on dark bg  → near-white
    return hex;
  };
  return { ...t, a1: adapt(t.a1), a2: adapt(t.a2), a3: adapt(t.a3) };
}

// ─── Global CSS ───────────────────────────────────────────────────────────────

const WWMD_CSS = `
  .wwmd * { box-sizing: border-box; margin: 0; padding: 0; }
  .wwmd { font-family: var(--font-ui); background: var(--bg); color: var(--text); min-height: 100vh; container-type: inline-size; }
  .wwmd input, .wwmd button { font-family: inherit; }
  .wwmd input::placeholder { color: var(--text-dim); opacity: 0.55; }
  .wwmd input:focus { outline: none; }

  @keyframes wwmd-spin  { to { transform: rotate(360deg); } }
  @keyframes wwmd-flash { 0%,100%{ opacity:1; } 50%{ opacity:0.15; } }
  @keyframes wwmd-pulse { 0%,100%{ opacity:1; } 60%{ opacity:0.45; } }

  .wwmd-grid { display: grid; grid-template-columns: 1fr; }
  @container (min-width: 720px) {
    .wwmd-grid { grid-template-columns: minmax(0,2fr) minmax(0,1fr); }
    .wwmd-right { border-left: 1px solid var(--border); }
    .wwmd-left, .wwmd-right { overflow-y: auto; max-height: calc(100vh - 61px); }
  }

  .wwmd-num-field {
    width: 100%; border-radius: 3px; text-align: center;
    font-family: var(--font-mono); font-size: 28px; font-weight: 700;
    padding: 13px 6px; cursor: ns-resize; transition: box-shadow 0.15s;
  }
  .wwmd-num-field:focus { cursor: text; box-shadow: inset 0 0 0 1px currentColor; }
  .wwmd-num-field.flashing { animation: wwmd-flash 0.22s ease; }

  .wwmd-wheel-btn {
    flex: 1; padding: 8px 4px; border-radius: 3px; cursor: pointer;
    font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.05em;
    transition: filter 0.12s;
  }
  .wwmd-wheel-btn:hover { filter: brightness(1.18); }

  .wwmd-add-btn {
    border: none; border-radius: 3px; cursor: pointer;
    font-family: var(--font-mono); font-size: 12px; font-weight: 700;
    letter-spacing: 0.12em; padding: 12px 20px; white-space: nowrap;
    transition: filter 0.12s, transform 0.1s;
  }
  .wwmd-add-btn:hover  { filter: brightness(1.1); }
  .wwmd-add-btn:active { transform: scale(0.96); }

  .wwmd-entry { border-radius: 4px; padding: 12px 14px; position: relative; }
  .wwmd-del {
    opacity: 0; position: absolute; top: 9px; right: 10px;
    background: none; border: none; cursor: pointer;
    color: var(--text-dim); font-size: 17px; line-height: 1; padding: 0;
    transition: opacity 0.14s, color 0.1s;
  }
  .wwmd-entry:hover .wwmd-del { opacity: 1; }
  .wwmd-del:hover { color: #e8001d !important; }

  .wwmd-dot {
    border-radius: 50%; cursor: pointer; padding: 0; border: none;
    background: none; transition: transform 0.14s;
    overflow: hidden; flex-shrink: 0;
  }
  .wwmd-dot:hover { transform: scale(1.18); }
  .wwmd-dot.active { transform: scale(1.08); }
`;

function StyleInjector() {
  useEffect(() => {
    if (!document.getElementById('wwmd-css')) {
      const el = document.createElement('style');
      el.id = 'wwmd-css';
      el.textContent = WWMD_CSS;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

// ─── GearHero ─────────────────────────────────────────────────────────────────

function GearHero({ cog, chainring, t, spinFast, dir }) {
  const cogT  = Math.max(8,  Math.min(55, parseInt(cog) || 16));
  const ringT = Math.max(22, Math.min(62, parseInt(chainring) || 48));

  const cogR  = 18 + (cogT  - 8)  / 47 * 34;  // 18–52 (8–55t)
  const ringR = 38 + (ringT - 22) / 40 * 52;  // 38–90 (22–62t)

  const W = 360, H = 200;
  const cogX = 83, cogY = H / 2;
  const ringX = 268, ringY = H / 2;

  const baseDur = spinFast ? 1.4 : 5;
  const ringDur = baseDur;
  const cogDur  = baseDur * (cogT / ringT);

  const spinStyle = (dur) => ({
    animation: `wwmd-spin ${dur.toFixed(2)}s linear infinite`,
    transformOrigin: '0px 0px',
  });

  const sw = dir === 'domestique' ? 1.3 : 1;

  // ── Chain: proper external tangent with wrap arcs ──────────────────────────
  const dx   = ringX - cogX;
  const sinA = Math.min(0.98, (ringR - cogR) / dx);
  const cosA = Math.sqrt(1 - sinA * sinA);
  const f    = n => n.toFixed(1);

  // Tangent touch points (top and bottom run)
  const ctX = cogX  - cogR  * sinA,  ctY = cogY  - cogR  * cosA;  // cog top
  const rtX = ringX - ringR * sinA,  rtY = ringY - ringR * cosA;  // ring top
  const cbX = cogX  + cogR  * sinA,  cbY = cogY  + cogR  * cosA;  // cog bottom
  const rbX = ringX + ringR * sinA,  rbY = ringY + ringR * cosA;  // ring bottom

  // Closed chain loop: top strand → arc around ring (right/outer side, CW) → bottom strand → arc around cog (left/outer side, CCW)
  const chainPath = [
    `M ${f(ctX)} ${f(ctY)}`,
    `L ${f(rtX)} ${f(rtY)}`,
    `A ${f(ringR)} ${f(ringR)} 0 1 1 ${f(rbX)} ${f(rbY)}`,
    `L ${f(cbX)} ${f(cbY)}`,
    `A ${f(cogR)}  ${f(cogR)}  0 1 0 ${f(ctX)} ${f(ctY)}`,
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>

      {/* Chain loop — rendered first so gears sit on top */}
      <path d={chainPath} fill="none"
        stroke="var(--text-dim)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />

      {/* COG */}
      <g transform={`translate(${cogX},${cogY})`}>
        <g style={spinStyle(cogDur)}>
          <circle r={cogR}        fill="none" stroke={t.a2} strokeWidth={3 * sw} />
          <circle r={cogR * .47}  fill="none" stroke={t.a2} strokeWidth={1.8 * sw} opacity="0.35" />
          <circle r={cogR * .13}  fill={t.a2} />
          {/* 4 lightening holes — make rotation visible */}
          {Array.from({ length: 4 }, (_, i) => {
            const a = (i / 4) * 2 * Math.PI;
            const hr = cogR * 0.64;
            return <circle key={i} cx={hr * Math.cos(a)} cy={hr * Math.sin(a)}
              r={Math.max(1.5, cogR * 0.09)} fill="none" stroke={t.a2} strokeWidth="1.2" opacity="0.45" />;
          })}
        </g>
      </g>

      {/* CHAINRING */}
      <g transform={`translate(${ringX},${ringY})`}>
        <g style={spinStyle(ringDur)}>
          <circle r={ringR}        fill="none" stroke={t.a1} strokeWidth={dir === 'domestique' ? 5.5 : 4.5} />
          <circle r={ringR * .44}  fill="none" stroke={t.a1} strokeWidth={2.5 * sw} opacity="0.35" />
          <circle r={ringR * .11}  fill={t.a1} />
          {/* 5 BCD bolt holes — chainring standard */}
          {Array.from({ length: 5 }, (_, i) => {
            const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
            const br = ringR * 0.64;
            return <circle key={i} cx={br * Math.cos(a)} cy={br * Math.sin(a)}
              r={Math.max(2.5, ringR * 0.055)} fill="none" stroke={t.a1} strokeWidth="1.5" opacity="0.45" />;
          })}
        </g>
      </g>

      <text x={cogX}  y={cogY + cogR  + 17} textAnchor="middle" fill="var(--text-dim)"
        style={{ font: '9px/1 var(--font-mono)', letterSpacing: '0.14em' }}>COG</text>
      <text x={ringX} y={ringY + ringR + 17} textAnchor="middle" fill="var(--text-dim)"
        style={{ font: '9px/1 var(--font-mono)', letterSpacing: '0.14em' }}>CHAINRING</text>
    </svg>
  );
}

// ─── NumericInput ─────────────────────────────────────────────────────────────

function NumericInput({ value, onChange, label, accentColor, min = 1, max = 99 }) {
  const [draft, setDraft] = useState(String(value));
  const [flash, setFlash] = useState(false);
  const ref = useRef();

  useEffect(() => { setDraft(String(value)); }, [value]);

  const doFlash = () => { setFlash(true); setTimeout(() => setFlash(false), 250); };

  const commit = (raw) => {
    const n = parseInt(raw);
    if (!isNaN(n)) {
      const v = Math.max(min, Math.min(max, n));
      setDraft(String(v));
      onChange(v);
      doFlash();
    } else {
      setDraft(String(value));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp')   { e.preventDefault(); const v = Math.min(max, value + 1); onChange(v); setDraft(String(v)); doFlash(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); const v = Math.max(min, value - 1); onChange(v); setDraft(String(v)); doFlash(); }
    if (e.key === 'Enter')     { ref.current?.blur(); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`wwmd-num-field${flash ? ' flashing' : ''}`}
        style={{ background: 'var(--bg2)', border: `1.5px solid ${accentColor}`, color: accentColor }}
      />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--text-dim)', textAlign: 'center', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ─── RatioBadge ───────────────────────────────────────────────────────────────

function RatioBadge({ ratio, color }) {
  return (
    <div style={{ flexShrink: 0, width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{
        borderRadius: 3, padding: '13px 6px',
        fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
        color, textAlign: 'center', width: '100%', letterSpacing: '-0.02em', lineHeight: 1,
        background: 'transparent',
      }}>
        {ratio.toFixed(2)}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Ratio</span>
    </div>
  );
}

// ─── WheelRow ─────────────────────────────────────────────────────────────────

function WheelRow({ wheelSel, setWheelSel, customCirc, setCustomCirc, rollout, accent1 }) {
  const opts = [
    { key: '700c', label: '700c' },
    { key: '650b', label: '650b' },
    { key: '26',   label: '26"'  },
    { key: 'custom', label: '···' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {opts.map(({ key, label }) => {
          const active = wheelSel === key;
          return (
            <button key={key} className="wwmd-wheel-btn"
              onClick={() => setWheelSel(key)}
              style={{
                flex: key === 'custom' ? 0.65 : 1,
                border: `1.5px solid ${active ? accent1 : 'var(--border)'}`,
                background: active ? accent1 + '1a' : 'transparent',
                color: active ? accent1 : 'var(--text-dim)',
              }}
            >{label}</button>
          );
        })}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700,
          color: accent1, minWidth: 58, textAlign: 'right',
          whiteSpace: 'nowrap', letterSpacing: '-0.02em',
        }}>
          {rollout.toFixed(2)}m
        </div>
      </div>
      {wheelSel === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.12em', flexShrink: 0 }}>CIRC</span>
          <input
            type="text" inputMode="numeric"
            value={customCirc} onChange={e => setCustomCirc(e.target.value)}
            placeholder="2105"
            style={{
              flex: 1, background: 'var(--bg2)', border: '1.5px solid var(--border)',
              color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13,
              padding: '6px 10px', borderRadius: 3,
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>mm</span>
        </div>
      )}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tip({ text, children }) {
  const [on, setOn] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline', cursor: 'help' }}
          onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}>
      {children}
      {on && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#141414', color: '#c0c0c0', border: '1px solid #2a2a2a',
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          padding: '5px 9px', borderRadius: 3, whiteSpace: 'nowrap',
          zIndex: 300, pointerEvents: 'none', lineHeight: 1.6, display: 'block',
        }}>{text}</span>
      )}
    </span>
  );
}

// ─── RolloutBar ───────────────────────────────────────────────────────────────

function RolloutBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ height: 4, background: 'rgba(128,128,128,0.18)', borderRadius: 2, overflow: 'hidden', marginTop: 9 }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: 2,
        background: `repeating-linear-gradient(58deg, ${color} 0px, ${color} 4px, ${color}50 4px, ${color}50 8px)`,
        transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1)',
      }} />
    </div>
  );
}

// ─── ComparisonEntry ──────────────────────────────────────────────────────────

function ComparisonEntry({ entry, isLive, maxRollout, onDelete, t }) {
  const liveTextCol = contrastColor(t.a1);
  const bg    = isLive ? t.a1 : 'var(--bg2)';
  const text  = isLive ? liveTextCol : 'var(--text)';
  const dim   = isLive ? liveTextCol + 'aa' : 'var(--text-dim)';
  const data  = isLive ? liveTextCol : t.a1;
  const barC  = isLive ? liveTextCol : t.a1;
  const border = isLive ? 'none' : '1px solid var(--border)';

  return (
    <div className="wwmd-entry" style={{ background: bg, border, color: text }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontStyle: isLive ? 'normal' : 'italic',
          fontWeight: isLive ? 600 : 400,
          lineHeight: 1.2,
          textTransform: 'none',
        }}>
          {entry.label || `${entry.chainring}×${entry.cog}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isLive && (
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700,
              letterSpacing: '0.16em', padding: '2px 7px', borderRadius: 2,
              background: 'rgba(0,0,0,0.15)', color: liveTextCol,
              animation: 'wwmd-pulse 2.2s ease infinite',
            }}>LIVE</span>
          )}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: dim }}>
            {entry.chainring}×{entry.cog} · {entry.ratio.toFixed(2)}
          </span>
          {!isLive && (
            <button className="wwmd-del" onClick={onDelete} style={{ color: dim }}>×</button>
          )}
        </div>
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: dim, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <span>Rollout{' '}
          <Tip text="Distance per pedal revolution = (chainring ÷ cog) × wheel circumference">
            <strong style={{ color: data, fontWeight: 700 }}>{entry.rollout.toFixed(2)}m</strong>
          </Tip>
        </span>
        <span>Gear in.{' '}
          <Tip text="(chainring ÷ cog) × wheel diameter in inches — higher = harder gear">
            <strong style={{ color: data, fontWeight: 700 }}>{entry.gearInches.toFixed(1)}"</strong>
          </Tip>
        </span>
      </div>
      <RolloutBar value={entry.rollout} max={maxRollout} color={barC} />
    </div>
  );
}

// ─── ComparisonSection ────────────────────────────────────────────────────────

function ComparisonSection({ liveEntry, entries, onDelete, onClearAll, t }) {
  const all = liveEntry ? [liveEntry, ...entries] : entries;
  const maxRollout = Math.max(...all.map(e => e.rollout), 0.001);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-dim)' }}>
          COMPARISON
        </span>
        {entries.length > 0 && (
          <button onClick={onClearAll} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-dim)',
          }}>CLEAR ALL</button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {liveEntry && <ComparisonEntry entry={liveEntry} isLive maxRollout={maxRollout} t={t} />}
        {entries.length === 0 && (
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text-dim)',
            textAlign: 'center', padding: '28px 0 16px', lineHeight: 2.2,
            borderTop: '1px solid var(--border)', marginTop: 4,
          }}>
            No setups saved yet.<br />
            <span style={{ opacity: 0.5, fontSize: 10 }}>Label a gear and hit + ADD.</span>
          </div>
        )}
        {entries.map(e => (
          <ComparisonEntry key={e.id} entry={e} isLive={false} maxRollout={maxRollout} onDelete={() => onDelete(e.id)} t={t} />
        ))}
      </div>
    </div>
  );
}

// ─── ThemeSelector ────────────────────────────────────────────────────────────

function ThemeSelector({ current, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
      {THEME_KEYS.map(key => {
        const th = THEMES[key];
        const active = current === key;
        return (
          <button key={key} title={th.label} className={`wwmd-dot${active ? ' active' : ''}`}
            onClick={() => onChange(key)}
            style={{ width: 22, height: 22 }}
          >
            <svg viewBox="0 0 22 22" width="22" height="22" style={{ display: 'block' }}>
              <path d="M 11 1 A 10 10 0 0 0 11 21 Z" fill={th.a2} />
              <path d="M 11 1 A 10 10 0 0 1 11 21 Z" fill={th.a1} />
              <circle cx="11" cy="11" r="10" fill="none"
                stroke={active ? 'var(--text)' : 'rgba(128,128,128,0.25)'} strokeWidth="1.5" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ theme, onThemeChange, dir }) {
  const isCrit = dir === 'criterium';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 20px', height: 61, borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)',
    }}>
      <span style={{
        fontFamily    : isCrit ? "'Oswald', sans-serif" : "'DM Serif Display', serif",
        fontStyle     : isCrit ? 'normal' : 'italic',
        fontWeight    : isCrit ? 700 : 400,
        fontSize      : isCrit ? 18 : 22,
        letterSpacing : isCrit ? '0.14em' : 'normal',
        textTransform : isCrit ? 'uppercase' : 'none',
        color         : 'var(--text)',
        lineHeight    : 1,
        userSelect    : 'none',
      }}>
        {isCrit ? 'WWMD' : 'what would merckx do?'}
      </span>
      <ThemeSelector current={theme} onChange={onThemeChange} />
    </div>
  );
}

// ─── LabelAddRow ──────────────────────────────────────────────────────────────

function LabelAddRow({ label, setLabel, onAdd, t }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={label}
        onChange={e => setLabel(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onAdd()}
        placeholder="Race day"
        maxLength={28}
        style={{
          flex: 1, background: 'var(--bg2)', border: '1.5px solid var(--border)',
          color: 'var(--text)', fontFamily: "'DM Serif Display', serif",
          fontStyle: 'italic', fontSize: 17, padding: '11px 14px', borderRadius: 3,
        }}
      />
      <button className="wwmd-add-btn" onClick={onAdd}
        style={{ background: t.a1, color: contrastColor(t.a1) }}>
        + ADD
      </button>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ text }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--text-dim)', marginBottom: 10 }}>
      {text}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function WWMDApp({ dir = 'cannibale', darkMode = true, theme: themeProp, onThemeChange }) {
  const [theme, setTheme] = useState(() => {
    if (themeProp) return themeProp;
    const stored = localStorage.getItem('wwmd-theme');
    if (stored && THEMES[stored]) return stored;
    return THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)];
  });

  // Sync controlled theme prop
  useEffect(() => { if (themeProp && themeProp !== theme) setTheme(themeProp); }, [themeProp]);

  const handleThemeChange = (v) => { setTheme(v); onThemeChange?.(v); localStorage.setItem('wwmd-theme', v); };

  const [cog, setCog]               = useState(16);
  const [chainring, setChainring]   = useState(48);
  const [wheelSel, setWheelSel]     = useState('700c');
  const [customCirc, setCustomCirc] = useState('2105');
  const [label, setLabel]           = useState('');
  const [entries, setEntries]       = useState([]);
  const [spinFast, setSpinFast]     = useState(false);
  const spinTimer = useRef(null);

  const triggerSpin = useCallback(() => {
    setSpinFast(true);
    clearTimeout(spinTimer.current);
    spinTimer.current = setTimeout(() => setSpinFast(false), 1400);
  }, []);

  const t = THEMES[theme] || THEMES.motorola;
  const isDark = darkMode && dir !== 'domestique';
  const tA = adaptTheme(t, isDark);
  const { ratio, rollout, gearInches } = compute(cog, chainring, wheelSel, customCirc);

  const liveEntry = {
    id: '__live',
    label: label || `${chainring}×${cog}`,
    cog: parseInt(cog) || 16,
    chainring: parseInt(chainring) || 48,
    ratio, rollout, gearInches,
  };

  const handleAdd = () => {
    const entry = {
      id: Date.now().toString(),
      label: label.trim() || `${chainring}×${cog}`,
      cog: parseInt(cog) || 16,
      chainring: parseInt(chainring) || 48,
      ratio, rollout, gearInches,
    };
    setEntries(prev => [entry, ...prev].slice(0, 10));
    setLabel('');
  };

  // CSS variable map
  const paperVars = { '--bg': '#f2ede4', '--bg2': '#e8e2d8', '--border': '#cac4ba', '--text': '#1a1614', '--text-dim': '#6e6560' };
  const darkVarsCrit = { '--bg': '#070707', '--bg2': '#101010', '--border': '#1c1c1c', '--text': '#e5e5e5', '--text-dim': '#484848' };
  const darkVarsCann = { '--bg': '#0c0c0c', '--bg2': '#161616', '--border': '#232320', '--text': '#f0eeea', '--text-dim': '#555550' };

  const bgVars = !isDark ? paperVars : dir === 'criterium' ? darkVarsCrit : darkVarsCann;

  const fontVarsCrit = { '--font-display': "'Oswald', sans-serif", '--font-ui': "'Space Mono', monospace", '--font-mono': "'Space Mono', monospace" };
  const fontVarsStd  = { '--font-display': "'DM Serif Display', serif", '--font-ui': "'Space Grotesk', sans-serif", '--font-mono': "'Space Mono', monospace" };
  const fontVars = dir === 'criterium' ? fontVarsCrit : fontVarsStd;

  const cssVars = { ...bgVars, ...fontVars };

  return (
    <div className="wwmd" style={cssVars}>
      <StyleInjector />
      <Topbar theme={theme} onThemeChange={handleThemeChange} dir={dir} />
      <div className="wwmd-grid">
        {/* Left: hero + inputs */}
        <div className="wwmd-left" style={{ padding: '18px 20px 28px' }}>
          <SectionLabel text="DRIVETRAIN" />
          <GearHero cog={cog} chainring={chainring} t={tA} spinFast={spinFast} dir={dir} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <NumericInput value={cog} onChange={v => { setCog(v); triggerSpin(); }} label="Cog Teeth" accentColor={tA.a2} min={8} max={55} />
            <RatioBadge ratio={ratio} color={tA.a3} />
            <NumericInput value={chainring} onChange={v => { setChainring(v); triggerSpin(); }} label="Ring Teeth" accentColor={tA.a1} min={22} max={62} />
          </div>

          <WheelRow wheelSel={wheelSel} setWheelSel={w => { setWheelSel(w); triggerSpin(); }}
            customCirc={customCirc} setCustomCirc={setCustomCirc}
            rollout={rollout} accent1={tA.a1} />

          <div style={{ height: 14 }} />
          <LabelAddRow label={label} setLabel={setLabel} onAdd={handleAdd} t={tA} />
        </div>

        {/* Right: comparison */}
        <div className="wwmd-right" style={{ padding: '18px 20px 28px' }}>
        <ComparisonSection
            entries={entries}
            onDelete={id => setEntries(prev => prev.filter(e => e.id !== id))}
            onClearAll={() => setEntries([])}
            t={tA}
          />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WWMDApp, THEMES, THEME_KEYS });
