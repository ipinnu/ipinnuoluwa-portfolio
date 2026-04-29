import type { Theme } from '../types'

export const ocean: Theme = {
  id:       'ocean',
  name:     'Ocean',
  subtitle: 'The Deep',
  mood:     'Fluid · vast · luminous',
  colors: {
    primary: '#1E8EC9',
    deep:    '#010B18',
    mid:     '#0E5A8A',
    light:   '#5EC8FF',
    rgb:     '30, 142, 201',
  },
  ambient: { type: 'caustic', speed: 0.3, intensity: 0.5 },

  dark: {
    background:      '#010810',
    surface:         '#020D1C',
    surfaceElevated: '#041830',
    writingSurface:  '#010610',
    textPrimary:     '#C8E8FF',
    textSecondary:   '#5EC8FF',
    textMuted:       '#1E5A80',
    border:          'rgba(30, 142, 201, 0.2)',
    glassBackground: 'rgba(30, 142, 201, 0.07)',
    glassBorder:     'rgba(30, 142, 201, 0.2)',
    glassBlur:       20,
    glassOpacity:    0.07,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 400, y: -200, z: 400, intensity: 0.85, color: '#1E8EC9' },
      fill: { x: -50, y: 700, z: 250, intensity: 0.4, color: '#0A3A6A' },
      rim:  { intensity: 0.65, color: '#80D8FF' },
    },
  },

  light: {
    background:      '#F4F8FF',
    surface:         '#EAF2FF',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FAFCFF',
    textPrimary:     '#03213A',
    textSecondary:   '#0A5A8A',
    textMuted:       '#3A8AB4',
    border:          'rgba(10, 80, 140, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(30, 142, 201, 0.25)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(10, 60, 120, 0.10)',
    lights: {
      key:  { x: 400, y: -300, z: 600, intensity: 0.8, color: '#80C8E8' },
      fill: { x: 0, y: 600, z: 300, intensity: 0.25, color: '#C0E0FF' },
      rim:  { intensity: 0.05, color: '#5EC8FF' },
    },
  },
}
