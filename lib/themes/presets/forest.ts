import type { Theme } from '../types'

export const forest: Theme = {
  id:       'forest',
  name:     'Forest',
  subtitle: 'The Depth',
  mood:     'Organic · alive · ancient',
  colors: {
    primary: '#2D8A4E',
    deep:    '#010F04',
    mid:     '#1A5C30',
    light:   '#6BBF8A',
    rgb:     '45, 138, 78',
  },
  ambient: { type: 'spores', speed: 0.25, intensity: 0.5 },

  dark: {
    background:      '#020802',
    surface:         '#050F06',
    surfaceElevated: '#0A1A0C',
    writingSurface:  '#030A03',
    textPrimary:     '#D0EED8',
    textSecondary:   '#6BBF8A',
    textMuted:       '#2D6040',
    border:          'rgba(45, 138, 78, 0.2)',
    glassBackground: 'rgba(45, 138, 78, 0.07)',
    glassBorder:     'rgba(45, 138, 78, 0.2)',
    glassBlur:       18,
    glassOpacity:    0.07,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 300, y: -150, z: 350, intensity: 0.8, color: '#3AAA60' },
      fill: { x: -100, y: 700, z: 180, intensity: 0.35, color: '#1A5C30' },
      rim:  { intensity: 0.6, color: '#80D090' },
    },
  },

  light: {
    background:      '#FFFFFF',
    surface:         '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#0A0A0A',
    textSecondary:   '#1E6030',
    textMuted:       '#4A8A58',
    border:          'rgba(30, 100, 50, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(45, 138, 78, 0.25)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(20, 80, 35, 0.10)',
    lights: {
      key:  { x: 350, y: -250, z: 500, intensity: 0.65, color: '#A0D4A8' },
      fill: { x: -150, y: 500, z: 280, intensity: 0.3, color: '#E8C880' },
      rim:  { intensity: 0.08, color: '#6BBF8A' },
    },
  },
}
