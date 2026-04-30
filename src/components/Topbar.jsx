import ThemeSelector from './ThemeSelector.jsx'
import DarkToggle from './DarkToggle.jsx'

export default function Topbar({ theme, onThemeChange, isDark, onDarkToggle }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: 61,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'var(--bg)',
      transition: 'background 0.6s',
    }}>
      <span style={{
        fontFamily: "'DM Serif Display', serif",
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 22,
        color: 'var(--text)',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        <span className="wwmd-wordmark-full">What would Merckx do?</span>
        <span className="wwmd-wordmark-short">wwmd?</span>
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <ThemeSelector current={theme} onChange={onThemeChange} />
        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
        <DarkToggle isDark={isDark} onToggle={onDarkToggle} />
      </div>
    </div>
  )
}
