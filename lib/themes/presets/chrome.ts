import type { Theme } from '../types'

export const chrome: Theme = {
  id:       'chrome',
  name:     'Chrome',
  subtitle: 'The System',
  mood:     'Precise · neutral · functional',
  colors: {
    primary: '#B0B0C0',
    deep:    '#0A0A0A',
    mid:     '#606070',
    light:   '#E0E0F0',
    rgb:     '176, 176, 192',
  },
  ambient: { type: 'scanline', speed: 0, intensity: 0.3 },

  dark: {
    background:      '#080808',
    surface:         '#101010',
    surfaceElevated: '#181818',
    writingSurface:  '#060606',
    textPrimary:     '#E8E8F0',
    textSecondary:   '#B0B0C0',
    textMuted:       '#404050',
    border:          'rgba(176, 176, 192, 0.15)',
    glassBackground: 'rgba(176, 176, 192, 0.05)',
    glassBorder:     'rgba(176, 176, 192, 0.15)',
    glassBlur:       14,
    glassOpacity:    0.05,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 400, y: -200, z: 500, intensity: 0.7, color: '#D0D0E0' },
      fill: { x: 200, y: 600, z: 200, intensity: 0.2, color: '#606070' },
      rim:  { intensity: 0.5, color: '#E0E0F0' },
    },
  },

  light: {
    background:      '#F8F8FC',
    surface:         '#F0F0F6',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#101018',
    textSecondary:   '#404060',
    textMuted:       '#9090A0',
    border:          'rgba(60, 60, 90, 0.12)',
    glassBackground: 'rgba(255, 255, 255, 0.70)',
    glassBorder:     'rgba(176, 176, 192, 0.25)',
    glassBlur:       6,
    glassOpacity:    0.70,
    shadowColor:     'rgba(40, 40, 70, 0.08)',
    lights: {
      key:  { x: 400, y: -300, z: 600, intensity: 0.75, color: '#FFFFFF' },
      fill: { x: 200, y: 500, z: 400, intensity: 0.25, color: '#E8E8F0' },
      rim:  { intensity: 0.03, color: '#E0E0F0' },
    },
  },
}
