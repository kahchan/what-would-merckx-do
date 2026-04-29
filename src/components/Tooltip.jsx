import { useState } from 'react'

export default function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false)
  return (
    <span
      style={{ position: 'relative', display: 'inline', cursor: 'help' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#141414',
          color: '#c0c0c0',
          border: '1px solid #2a2a2a',
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          padding: '5px 9px',
          borderRadius: 3,
          whiteSpace: 'nowrap',
          zIndex: 300,
          pointerEvents: 'none',
          lineHeight: 1.6,
          display: 'block',
        }}>
          {text}
        </span>
      )}
    </span>
  )
}
