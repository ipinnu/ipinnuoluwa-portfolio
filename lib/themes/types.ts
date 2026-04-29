export type ThemeMode = 'dark' | 'light'

export type AmbientType =
  | 'fire' | 'spores' | 'caustic' | 'constellation'
  | 'corona' | 'still' | 'aurora' | 'petals'
  | 'crystal' | 'dust' | 'breath' | 'scanline'

export interface LightPoint {
  x: number
  y: number
  z: number
  intensity: number
  color: string
}

export interface LightRig {
  key:  LightPoint
  fill: LightPoint
  rim:  { intensity: number; color: string }
}

export interface ThemeColors {
  primary: string
  deep:    string
  mid:     string
  light:   string
  rgb:     string
}

export interface ThemeModeConfig {
  background:      string
  surface:         string
  surfaceElevated: string
  writingSurface:  string
  textPrimary:     string
  textSecondary:   string
  textMuted:       string
  border:          string
  glassBackground: string
  glassBorder:     string
  glassBlur:       number
  glassOpacity:    number
  shadowColor:     string
  lights:          LightRig
}

export interface Theme {
  id:       string
  name:     string
  subtitle: string
  mood:     string
  colors:   ThemeColors
  ambient: {
    type:      AmbientType
    speed:     number
    intensity: number
  }
  dark:  ThemeModeConfig
  light: ThemeModeConfig
}

export interface ThemeState {
  themeId: string
  mode:    ThemeMode
}

export const SECTION_MODE_DEFAULTS: Record<string, ThemeMode> = {
  archive:   'dark',
  forge:     'light',
  chronicle: 'light',
}

export const SECTION_THEME_DEFAULTS: Record<string, string> = {
  archive:   'sage',
  forge:     'solar',
  chronicle: 'ocean',
}
