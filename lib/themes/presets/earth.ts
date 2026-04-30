import type { Theme } from '../types'

export const earth: Theme = {
  id:       'earth',
  name:     'Earth',
  subtitle: 'The Ground',
  mood:     'Ancient · rooted · honest',
  colors: {
    primary: '#C87941',
    deep:    '#140C00',
    mid:     '#8B4C1A',
    light:   '#F0B070',
    rgb:     '200, 121, 65',
  },
  ambient: { type: 'dust', speed: 0.2, intensity: 0.45 },

  dark: {
    background:      '#0c0700',
    surface:         '#160E00',
    surfaceElevated: '#221500',
    writingSurface:  '#0a0600',
    textPrimary:     '#F5E8D0',
    textSecondary:   '#F0B070',
    textMuted:       '#705028',
    border:          'rgba(200, 121, 65, 0.2)',
    glassBackground: 'rgba(200, 121, 65, 0.07)',
    glassBorder:     'rgba(200, 121, 65, 0.2)',
    glassBlur:       16,
    glassOpacity:    0.07,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 400, y: -350, z: 350, intensity: 0.9, color: '#E8A060' },
      fill: { x: 50, y: 700, z: 200, intensity: 0.4, color: '#703018' },
      rim:  { intensity: 0.6, color: '#FFD090' },
    },
  },

  light: {
    background:      '#FFFFFF',
    surface:         '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#0A0A0A',
    textSecondary:   '#7A3800',
    textMuted:       '#B07040',
    border:          'rgba(160, 80, 20, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(200, 121, 65, 0.25)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(140, 70, 20, 0.10)',
    lights: {
      key:  { x: 400, y: -400, z: 550, intensity: 0.85, color: '#FFD090' },
      fill: { x: 100, y: 600, z: 320, intensity: 0.3, color: '#FFE8C0' },
      rim:  { intensity: 0.04, color: '#F0B070' },
    },
  },
}
