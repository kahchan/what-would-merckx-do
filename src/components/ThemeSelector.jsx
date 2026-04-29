import { THEMES, THEME_KEYS } from '../calculations.js'

export default function ThemeSelector({ current, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
      {THEME_KEYS.map(key => {
        const th = THEMES[key]
        const active = current === key
        return (
          <button
            key={key}
            title={th.label}
            className={`wwmd-dot${active ? ' active' : ''}`}
            onClick={() => onChange(key)}
            style={{ width: 22, height: 22 }}
          >
            <svg viewBox="0 0 22 22" width="22" height="22" style={{ display: 'block' }}>
              {/* left half: a2 */}
              <path d="M 11 1 A 10 10 0 0 0 11 21 Z" fill={th.a2} />
              {/* right half: a1 */}
              <path d="M 11 1 A 10 10 0 0 1 11 21 Z" fill={th.a1} />
              <circle
                cx="11" cy="11" r="10"
                fill="none"
                stroke={active ? 'var(--text)' : 'rgba(128,128,128,0.25)'}
                strokeWidth="1.5"
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
