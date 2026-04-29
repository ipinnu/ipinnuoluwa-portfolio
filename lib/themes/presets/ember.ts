import type { Theme } from '../types'

export const ember: Theme = {
  id:       'ember',
  name:     'Ember',
  subtitle: 'The Fire',
  mood:     'Primal · urgent · alive',
  colors: {
    primary: '#FF6414',
    deep:    '#1a0800',
    mid:     '#CC3D00',
    light:   '#FF9060',
    rgb:     '255, 100, 20',
  },
  ambient: { type: 'fire', speed: 0.4, intensity: 0.6 },

  dark: {
    background:      '#0f0400',
    surface:         '#1a0800',
    surfaceElevated: '#2d1000',
    writingSurface:  '#100300',
    textPrimary:     '#FFE0D0',
    textSecondary:   '#FF9060',
    textMuted:       '#804020',
    border:          'rgba(220, 80, 20, 0.2)',
    glassBackground: 'rgba(255, 100, 20, 0.07)',
    glassBorder:     'rgba(255, 100, 20, 0.2)',
    glassBlur:       16,
    glassOpacity:    0.07,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 600, y: -100, z: 300, intensity: 0.9, color: '#FF6414' },
      fill: { x: -100, y: 600, z: 200, intensity: 0.4, color: '#CC2000' },
      rim:  { intensity: 0.7, color: '#FF9060' },
    },
  },

  light: {
    background:      '#FFF8F4',
    surface:         '#FFF0E8',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#2D0F00',
    textSecondary:   '#8B3010',
    textMuted:       '#C47040',
    border:          'rgba(180, 60, 0, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(255, 100, 20, 0.25)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(180, 60, 0, 0.12)',
    lights: {
      key:  { x: 400, y: -200, z: 500, intensity: 0.6, color: '#FF8040' },
      fill: { x: -200, y: 400, z: 300, intensity: 0.2, color: '#FFD0A0' },
      rim:  { intensity: 0.1, color: '#FF9060' },
    },
  },
}
