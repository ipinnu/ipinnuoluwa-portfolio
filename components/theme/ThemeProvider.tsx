'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Theme, ThemeMode, ThemeState } from '@/lib/themes/types'
import { THEMES } from '@/lib/themes/config'
import { SECTION_THEME_DEFAULTS, SECTION_MODE_DEFAULTS } from '@/lib/themes/types'
import { updateLightRig, interpolateLights } from '@/lib/themes'

interface ThemeContextValue {
  theme:      Theme
  mode:       ThemeMode
  setTheme:   (id: string) => void
  setMode:    (mode: ThemeMode) => void
  toggleMode: () => void
  modeConfig: Theme['dark'] | Theme['light']
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  section,
}: {
  children: React.ReactNode
  section:  'archive' | 'forge' | 'chronicle'
}) {
  const storageKey = `ip_theme_${section}`
  const prevLights = useRef<Theme['dark']['lights'] | null>(null)

  const [state, setState] = useState<ThemeState>(() => {
    if (typeof window === 'undefined') return {
      themeId: SECTION_THEME_DEFAULTS[section] ?? 'sage',
      mode:    SECTION_MODE_DEFAULTS[section] ?? 'dark',
    }
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return {
      themeId: SECTION_THEME_DEFAULTS[section] ?? 'sage',
      mode:    SECTION_MODE_DEFAULTS[section] ?? 'dark',
    }
  })

  const theme      = THEMES[state.themeId] ?? THEMES['sage']
  const modeConfig = state.mode === 'dark' ? theme.dark : theme.light

  useEffect(() => {
    const root = document.documentElement
    const m    = modeConfig
    const c    = theme.colors

    // 600ms cross-fade transition
    root.style.transition = 'background-color 0.6s ease, color 0.6s ease'
    document.querySelectorAll('.glass-panel').forEach(el => {
      ;(el as HTMLElement).style.transition =
        'background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease'
    })

    root.style.setProperty('--theme-bg',            m.background)
    root.style.setProperty('--theme-surface',        m.surface)
    root.style.setProperty('--theme-surface-raised', m.surfaceElevated)
    root.style.setProperty('--theme-writing',        m.writingSurface)
    root.style.setProperty('--theme-text-primary',   m.textPrimary)
    root.style.setProperty('--theme-text-secondary', m.textSecondary)
    root.style.setProperty('--theme-text-muted',     m.textMuted)
    root.style.setProperty('--theme-border',         m.border)
    root.style.setProperty('--theme-glass-bg',       m.glassBackground)
    root.style.setProperty('--theme-glass-border',   m.glassBorder)
    root.style.setProperty('--theme-glass-blur',     `${m.glassBlur}px`)
    root.style.setProperty('--theme-shadow',         m.shadowColor)
    root.style.setProperty('--theme-primary',        c.primary)
    root.style.setProperty('--theme-primary-rgb',    c.rgb)
    root.style.setProperty('--theme-deep',           c.deep)
    root.style.setProperty('--theme-mid',            c.mid)
    root.style.setProperty('--theme-light-color',    c.light)
    root.style.setProperty('--theme-mode',           state.mode)

    // Animate light rig transition
    if (prevLights.current) {
      interpolateLights(prevLights.current, m.lights, 600)
    } else {
      updateLightRig(m.lights)
    }
    prevLights.current = m.lights

    setTimeout(() => { root.style.transition = '' }, 700)

    // Persist (debounced)
    const t = setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify(state)) } catch { /* ignore */ }
    }, 500)
    return () => clearTimeout(t)
  }, [state, modeConfig, theme, storageKey])

  function setTheme(id: string) {
    setState(prev => ({ ...prev, themeId: id }))
  }

  function setMode(mode: ThemeMode) {
    setState(prev => ({ ...prev, mode }))
  }

  function toggleMode() {
    setState(prev => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }))
  }

  return (
    <ThemeContext.Provider value={{ theme, mode: state.mode, setTheme, setMode, toggleMode, modeConfig }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
