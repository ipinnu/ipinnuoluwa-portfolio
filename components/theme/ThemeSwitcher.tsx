'use client'

import { THEMES, THEME_ORDER } from '@/lib/themes/config'
import { useTheme } from './ThemeProvider'

export function ThemeSwitcher() {
  const { theme: activeTheme, mode, setTheme } = useTheme()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8,
      padding: 16,
    }}>
      {THEME_ORDER.map(id => {
        const t = THEMES[id]
        if (!t) return null
        const isActive = activeTheme.id === t.id
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.name}
            style={{
              background: mode === 'dark'
                ? `rgba(${t.colors.rgb}, 0.12)`
                : `rgba(${t.colors.rgb}, 0.08)`,
              backdropFilter: 'blur(12px)',
              border: isActive
                ? `1.5px solid ${t.colors.primary}`
                : `0.5px solid rgba(${t.colors.rgb}, 0.25)`,
              borderRadius: 10,
              padding: '10px 8px',
              cursor:  'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems:    'center',
              gap: 4,
              filter:     'url(#liquid-glass-soft)',
              transition: 'all 0.2s ease',
              outline:    'none',
            }}
          >
            <div style={{
              width: 24, height: 24,
              borderRadius: 6,
              background:  t.colors.primary,
              boxShadow:   `0 0 8px ${t.colors.primary}60`,
            }} />
            <span style={{
              fontFamily:    'var(--font-jetbrains-mono)',
              fontSize:      9,
              color:         isActive ? t.colors.primary : t.colors.light,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {t.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
