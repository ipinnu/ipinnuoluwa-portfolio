import type { Theme } from '../types'

export const royal: Theme = {
  id:       'royal',
  name:     'Royal',
  subtitle: 'The Court',
  mood:     'Regal · sovereign · timeless',
  colors: {
    primary: '#8A6FE8',
    deep:    '#080416',
    mid:     '#5A3DAA',
    light:   '#C4AEFF',
    rgb:     '138, 111, 232',
  },
  ambient: { type: 'constellation', speed: 0.15, intensity: 0.45 },

  dark: {
    background:      '#040210',
    surface:         '#080418',
    surfaceElevated: '#100828',
    writingSurface:  '#030112',
    textPrimary:     '#E8E0FF',
    textSecondary:   '#C4AEFF',
    textMuted:       '#4A3880',
    border:          'rgba(138, 111, 232, 0.2)',
    glassBackground: 'rgba(138, 111, 232, 0.07)',
    glassBorder:     'rgba(138, 111, 232, 0.2)',
    glassBlur:       18,
    glassOpacity:    0.07,
    shadowColor:     'transparent',
    lights: {
      key:  { x: -100, y: -150, z: 350, intensity: 0.85, color: '#8A6FE8' },
      fill: { x: 700, y: 600, z: 200, intensity: 0.4, color: '#3D2880' },
      rim:  { intensity: 0.7, color: '#D4C0FF' },
    },
  },

  light: {
    background:      '#F8F6FF',
    surface:         '#F0ECFF',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#1A0A40',
    textSecondary:   '#4A2AA0',
    textMuted:       '#8060C0',
    border:          'rgba(90, 60, 170, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(138, 111, 232, 0.25)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(60, 30, 130, 0.10)',
    lights: {
      key:  { x: 200, y: -300, z: 500, intensity: 0.6, color: '#C8B8FF' },
      fill: { x: 600, y: 400, z: 300, intensity: 0.2, color: '#E8E0FF' },
      rim:  { intensity: 0.06, color: '#C4AEFF' },
    },
  },
}
