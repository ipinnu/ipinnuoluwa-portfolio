import type { Theme } from '../types'

export const voidTheme: Theme = {
  id:       'void',
  name:     'Void',
  subtitle: 'The Absolute',
  mood:     'Silent · precise · infinite',
  colors: {
    primary: '#888888',
    deep:    '#000000',
    mid:     '#222222',
    light:   '#CCCCCC',
    rgb:     '136, 136, 136',
  },
  ambient: { type: 'still', speed: 0, intensity: 0 },

  dark: {
    background:      '#000000',
    surface:         '#080808',
    surfaceElevated: '#111111',
    writingSurface:  '#000000',
    textPrimary:     '#F0F0F0',
    textSecondary:   '#888888',
    textMuted:       '#333333',
    border:          'rgba(255, 255, 255, 0.08)',
    glassBackground: 'rgba(255, 255, 255, 0.04)',
    glassBorder:     'rgba(255, 255, 255, 0.1)',
    glassBlur:       20,
    glassOpacity:    0.04,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 400, y: -200, z: 500, intensity: 0.7, color: '#FFFFFF' },
      fill: { x: 600, y: 600, z: 100, intensity: 0.05, color: '#888888' },
      rim:  { intensity: 0.5, color: '#FFFFFF' },
    },
  },

  light: {
    background:      '#FFFFFF',
    surface:         '#F8F8F8',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#000000',
    textSecondary:   '#444444',
    textMuted:       '#AAAAAA',
    border:          'rgba(0, 0, 0, 0.08)',
    glassBackground: 'rgba(255, 255, 255, 0.75)',
    glassBorder:     'rgba(0, 0, 0, 0.12)',
    glassBlur:       8,
    glassOpacity:    0.75,
    shadowColor:     'rgba(0, 0, 0, 0.08)',
    lights: {
      key:  { x: 400, y: -300, z: 600, intensity: 0.7, color: '#F0F0F0' },
      fill: { x: 600, y: 500, z: 300, intensity: 0.05, color: '#FFFFFF' },
      rim:  { intensity: 0.03, color: '#CCCCCC' },
    },
  },
}
