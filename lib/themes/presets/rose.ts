import type { Theme } from '../types'

export const rose: Theme = {
  id:       'rose',
  name:     'Rose',
  subtitle: 'The Bloom',
  mood:     'Tender · alive · present',
  colors: {
    primary: '#E84393',
    deep:    '#1A0310',
    mid:     '#B02070',
    light:   '#F896C8',
    rgb:     '232, 67, 147',
  },
  ambient: { type: 'petals', speed: 0.2, intensity: 0.45 },

  dark: {
    background:      '#100208',
    surface:         '#1C040E',
    surfaceElevated: '#2A0816',
    writingSurface:  '#0e0208',
    textPrimary:     '#FFE0EE',
    textSecondary:   '#F896C8',
    textMuted:       '#702040',
    border:          'rgba(232, 67, 147, 0.2)',
    glassBackground: 'rgba(232, 67, 147, 0.06)',
    glassBorder:     'rgba(232, 67, 147, 0.2)',
    glassBlur:       18,
    glassOpacity:    0.06,
    shadowColor:     'transparent',
    lights: {
      key:  { x: 550, y: -120, z: 320, intensity: 0.85, color: '#E84393' },
      fill: { x: -80, y: 650, z: 180, intensity: 0.4, color: '#800040' },
      rim:  { intensity: 0.65, color: '#FFB0D8' },
    },
  },

  light: {
    background:      '#FFFFFF',
    surface:         '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',
    textPrimary:     '#0A0A0A',
    textSecondary:   '#901040',
    textMuted:       '#C06080',
    border:          'rgba(180, 30, 80, 0.15)',
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder:     'rgba(232, 67, 147, 0.22)',
    glassBlur:       8,
    glassOpacity:    0.65,
    shadowColor:     'rgba(160, 30, 80, 0.10)',
    lights: {
      key:  { x: 500, y: -100, z: 450, intensity: 0.6, color: '#FFB0C8' },
      fill: { x: -100, y: 500, z: 320, intensity: 0.25, color: '#FFD8E8' },
      rim:  { intensity: 0.05, color: '#F896C8' },
    },
  },
}
