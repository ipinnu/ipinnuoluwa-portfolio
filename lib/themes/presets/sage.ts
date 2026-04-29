import type { Theme } from '../types'

export const sage: Theme = {
  id:       'sage',
  name:     'Sage',
  subtitle: 'The Library',
  mood:     'Measured · clear · considered',
  colors: {
    primary: '#A3C4B4',
    deep:    '#061410',
    mid:     '#4A8A6A',
    light:   '#D4EDE2',
    rgb:     '163, 196, 180',
  },
  ambient: { type: 'breath', speed: 0.08, intensity: 0.4 },

  dark: {
    background:      '#030A06',
    surface:         '#060F08',
    surfaceElevated: '#0C1A0E',
    writingSurface:  '#020804',
    textPrimary:     '#E0EEE8',
    textSecondary:   '#A3C4B4',
    textMuted:       '#2A5040',
    border:          'rgba(163, 196, 180, 0.15)',
    glassBackground: 'rgba(163, 196, 180, 0.06)',
    glassBorder:     'rgba(163, 196, 180, 0.18)',
    glassBlur:       16,
    glassOpacity:    0.06,
    shadowColor:     'transparent',
    lights: {
      key:  { x: -100, y: -100, z: 300, intensity: 0.7, color: '#A3C4B4' },
      fill: { x: 700, y: 600, z: 200, intensity: 0.3, color: '#1A4030' },
      rim:  { intensity: 0.5, color: '#D4EDE2' },
    },
  },

  light: {
    background:      '#F6FBF8',
    surface:         '#EDF5F0',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FAFFF9',
    textPrimary:     '#0A2018',
    textSecondary:   '#205040',
    textMuted:       '#608070',
    border:          'rgba(50, 110, 80, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(163, 196, 180, 0.3)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(30, 80, 55, 0.08)',
    lights: {
      key:  { x: 700, y: -150, z: 400, intensity: 0.55, color: '#C8E0D4' },
      fill: { x: 100, y: 400, z: 350, intensity: 0.2, color: '#E0F0E8' },
      rim:  { intensity: 0.04, color: '#D4EDE2' },
    },
  },
}
