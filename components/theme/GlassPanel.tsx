'use client'

import { useTheme } from './ThemeProvider'

interface GlassPanelProps {
  children:   React.ReactNode
  className?: string
  intensity?: 'soft' | 'full'
  style?:     React.CSSProperties
  onClick?:   () => void
}

export function GlassPanel({ children, className = '', intensity = 'soft', style, onClick }: GlassPanelProps) {
  const { mode } = useTheme()

  return (
    <div
      className={`glass-panel ${className}`}
      data-mode={mode}
      onClick={onClick}
      style={{
        background:           'var(--theme-glass-bg)',
        backdropFilter:       'blur(var(--theme-glass-blur)) saturate(180%)',
        WebkitBackdropFilter: 'blur(var(--theme-glass-blur)) saturate(180%)',
        border:               '1px solid var(--theme-glass-border)',
        boxShadow: mode === 'dark'
          ? `inset 0 1px 0 rgba(var(--theme-primary-rgb), 0.15),
             inset 0 -1px 0 rgba(var(--theme-primary-rgb), 0.05),
             0 8px 32px rgba(var(--theme-primary-rgb), 0.06),
             0 1px 0 rgba(255,255,255,0.04)`
          : `0 2px 8px var(--theme-shadow),
             0 1px 2px var(--theme-shadow),
             inset 0 1px 0 rgba(255,255,255,0.8)`,
        filter:     `url(#liquid-glass-${intensity === 'full' ? '' : 'soft'})`,
        transition: 'all 0.3s ease',
        cursor:     onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.filter      = 'url(#liquid-glass)'
        el.style.borderColor = 'rgba(var(--theme-primary-rgb), 0.35)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.filter      = 'url(#liquid-glass-soft)'
        el.style.borderColor = 'var(--theme-glass-border)'
      }}
    >
      {children}
    </div>
  )
}
