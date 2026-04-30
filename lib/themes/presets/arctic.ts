import type { Theme } from '../types'

export const arctic: Theme = {
  id:       'arctic',
  name:     'Arctic',
  subtitle: 'The Crystal',
  mood:     'Clear · precise · enduring',
  colors: {
    primary: '#5BC8E8',
    deep:    '#011220',
    mid:     '#2A88B0',
    light:   '#A8E8FF',
    rgb:     '91, 200, 232',
  },
  ambient: { type: 'crystal', speed: 0.25, intensity: 0.5 },

  dark: {
    background:      '#010a12',
    surface:         '#04121E',
    surfaceElevated: '#081A2C',
    writingSurface:  '#010810',
    textPrimary:     '#D8F4FF',
    textSecondary:   '#A8E8FF',
    textMuted:       '#1E6080',
    border:          'rgba(91, 200, 232, 0.2)',
    glassBackground: 'rgba(91, 200, 232, 0.06)',
    glassBorder:     'rgba(91, 200, 232, 0.2)',
    glassBlur:       22,
    glassOpacity:    0.06,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 400, y: -250, z: 450, intensity: 0.9, color: '#FFFFFF' },
      fill: { x: -50, y: 600, z: 220, intensity: 0.35, color: '#2A4A70' },
      rim:  { intensity: 0.8, color: '#C8F4FF' },
    },
  },

  light: {
    background:      '#FFFFFF',
    surface:         '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#0A0A0A',
    textSecondary:   '#0A5070',
    textMuted:       '#4090B0',
    border:          'rgba(10, 80, 130, 0.13)',
    glassBackground: 'rgba(255, 255, 255, 0.70)',
    glassBorder:     'rgba(91, 200, 232, 0.25)',
    glassBlur:       8,
    glassOpacity:    0.70,
    shadowColor:     'rgba(10, 60, 110, 0.08)',
    lights: {
      key:  { x: 400, y: -400, z: 700, intensity: 1.0, color: '#FFFFFF' },
      fill: { x: 100, y: 500, z: 400, intensity: 0.3, color: '#C8E8FF' },
      rim:  { intensity: 0.04, color: '#A8E8FF' },
    },
  },
}
