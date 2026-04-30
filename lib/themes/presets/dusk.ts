import type { Theme } from '../types'

export const dusk: Theme = {
  id:       'dusk',
  name:     'Dusk',
  subtitle: 'The Between',
  mood:     'Liminal · soft · becoming',
  colors: {
    primary: '#9B59B6',
    deep:    '#100518',
    mid:     '#6C3483',
    light:   '#D2B4DE',
    rgb:     '155, 89, 182',
  },
  ambient: { type: 'aurora', speed: 0.15, intensity: 0.5 },

  dark: {
    background:      '#0a0314',
    surface:         '#110520',
    surfaceElevated: '#1A0830',
    writingSurface:  '#080212',
    textPrimary:     '#EDE0FF',
    textSecondary:   '#D2B4DE',
    textMuted:       '#502870',
    border:          'rgba(155, 89, 182, 0.2)',
    glassBackground: 'rgba(155, 89, 182, 0.07)',
    glassBorder:     'rgba(155, 89, 182, 0.2)',
    glassBlur:       18,
    glassOpacity:    0.07,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 200, y: 500, z: 250, intensity: 0.7, color: '#9B59B6' },
      fill: { x: 700, y: -100, z: 200, intensity: 0.35, color: '#4A1870' },
      rim:  { intensity: 0.6, color: '#E8D0FF' },
    },
  },

  light: {
    background:      '#FFFFFF',
    surface:         '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#0A0A0A',
    textSecondary:   '#5A2080',
    textMuted:       '#9060B0',
    border:          'rgba(100, 50, 150, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(155, 89, 182, 0.2)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(80, 30, 120, 0.08)',
    lights: {
      key:  { x: 300, y: -100, z: 400, intensity: 0.45, color: '#C8A0E0' },
      fill: { x: 600, y: 400, z: 350, intensity: 0.25, color: '#E8D0FF' },
      rim:  { intensity: 0.04, color: '#D2B4DE' },
    },
  },
}
