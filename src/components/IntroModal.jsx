import { contrastColor } from '../calculations.js'

function stopProp(e) { e.stopPropagation() }

export default function IntroModal({ ui1, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={stopProp}
        className="wwmd-modal"
        style={{
          width: '60vw', height: '60vh',
          minWidth: 300, minHeight: 340,
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          padding: '44px 52px 40px',
          boxSizing: 'border-box',
        }}
      >
        {/* X */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 18,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-dim)', fontSize: 22, lineHeight: 1,
            padding: '2px 4px',
            fontFamily: 'var(--font-ui)',
            transition: 'color 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
        >
          ×
        </button>

        {/* Wordmark */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 3.2vw, 42px)',
          lineHeight: 1.1,
          color: 'var(--text)',
          marginBottom: 24,
        }}>
          What Would Merckx Do?
        </div>

        {/* Pitch */}
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'clamp(13px, 1.2vw, 16px)',
          lineHeight: 1.65,
          color: 'var(--text)',
          marginBottom: 28,
          maxWidth: '52ch',
        }}>
          A drivetrain calculator for fixed-gear cyclists. Set your chainring and cog, pick
          your wheel size, and see exactly how far each pedal stroke takes you — then save
          and compare setups side by side.
        </p>

        {/* Byline */}
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'clamp(11px, 1vw, 13px)',
          lineHeight: 1.5,
          color: 'var(--text-dim)',
          marginBottom: 20,
        }}>
          Built by a designer who likes building.{' '}
          <a
            href="https://www.linkedin.com/in/kahchan"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit', textUnderlineOffset: 3 }}
          >
            Find me on LinkedIn.
          </a>
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', marginBottom: 20 }} />

        {/* Tip */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 'auto' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.18em',
            color: ui1,
            textTransform: 'uppercase',
            paddingTop: 3,
            flexShrink: 0,
          }}>
            TIP
          </span>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(12px, 1.1vw, 14px)',
            lineHeight: 1.6,
            color: 'var(--text-dim)',
          }}>
            Drag the cog or chainring inputs up or down to change tooth count without typing.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="wwmd-add-btn"
          style={{
            alignSelf: 'flex-start',
            background: ui1,
            color: contrastColor(ui1),
            fontSize: 12,
            letterSpacing: '0.14em',
            padding: '13px 28px',
            marginTop: 28,
          }}
        >
          LET'S GET STARTED
        </button>
      </div>
    </div>
  )
}
