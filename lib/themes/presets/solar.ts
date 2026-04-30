import type { Theme } from '../types'

export const solar: Theme = {
  id:       'solar',
  name:     'Solar',
  subtitle: 'The Crown',
  mood:     'Expansive · radiant · certain',
  colors: {
    primary: '#FFB800',
    deep:    '#1a1500',
    mid:     '#CC9000',
    light:   '#FFD966',
    rgb:     '255, 184, 0',
  },
  ambient: { type: 'corona', speed: 0.2, intensity: 0.45 },

  dark: {
    background:      '#0d0a00',
    surface:         '#181200',
    surfaceElevated: '#261C00',
    writingSurface:  '#0a0800',
    textPrimary:     '#FFF5CC',
    textSecondary:   '#FFD966',
    textMuted:       '#806000',
    border:          'rgba(255, 184, 0, 0.18)',
    glassBackground: 'rgba(255, 184, 0, 0.06)',
    glassBorder:     'rgba(255, 184, 0, 0.18)',
    glassBlur:       16,
    glassOpacity:    0.06,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 400, y: -300, z: 400, intensity: 1.0, color: '#FFB800' },
      fill: { x: 100, y: 700, z: 250, intensity: 0.45, color: '#CC7000' },
      rim:  { intensity: 0.8, color: '#FFE080' },
    },
  },

  light: {
    background:      '#FFFFFF',
    surface:         '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#0A0A0A',
    textSecondary:   '#806000',
    textMuted:       '#B08840',
    border:          'rgba(180, 130, 0, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.70)',
    glassBorder:     'rgba(255, 184, 0, 0.25)',
    glassBlur:       6,
    glassOpacity:    0.70,
    shadowColor:     'rgba(160, 110, 0, 0.10)',
    lights: {
      key:  { x: 400, y: -400, z: 600, intensity: 0.9, color: '#FFEE80' },
      fill: { x: 200, y: 500, z: 400, intensity: 0.35, color: '#FFFFFF' },
      rim:  { intensity: 0.05, color: '#FFD966' },
    },
  },
}
