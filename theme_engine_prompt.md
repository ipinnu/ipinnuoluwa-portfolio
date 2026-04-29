# Theme Engine — Complete Build Prompt
### lib/themes/ · components/theme/ · Global system
### Applies to: Archive Studio, Asset Manager, Chronicle Studio
### 12 themes · 2 modes · 3-point lighting · ambient motion

---

## Philosophy

Two modes are not two color schemes.
They are two physical realities.

DARK MODE — you are inside the world.
  Light is scarce and intentional.
  Glass glows because it catches the only available light.
  Ambient motion is the atmosphere breathing around you.
  The environment wraps and holds you.

LIGHT MODE — you are observing in daylight.
  Everything is revealed.
  Glass is transparent — light passes through it.
  Shadows are the structure, not glow.
  The environment is open and clear.

Same 12 themes. Completely different physical experience.
The code must reflect this — not just swap colors.

---

## Architecture

```
lib/
  themes/
    index.ts              ← theme registry + active theme hook
    types.ts              ← Theme, ThemeMode, LightRig types
    config.ts             ← all 12 theme definitions
    presets/
      ember.ts
      forest.ts
      ocean.ts
      royal.ts
      solar.ts
      void.ts
      dusk.ts
      rose.ts
      arctic.ts
      earth.ts
      sage.ts
      chrome.ts

components/
  theme/
    ThemeProvider.tsx     ← context + localStorage + CSS var injection
    ThemeToggle.tsx       ← dark/light mode toggle button
    ThemeSwitcher.tsx     ← 12-theme selector (glass pill grid)
    GlassFilter.tsx       ← SVG filter defs + 3-point light updater
    AmbientLayer.tsx      ← renders active ambient animation
    ambient/
      FireAmbient.tsx
      SporesAmbient.tsx
      CausticAmbient.tsx
      ConstellationAmbient.tsx
      CoronaAmbient.tsx
      StillAmbient.tsx
      AuroraAmbient.tsx
      PetalsAmbient.tsx
      CrystalAmbient.tsx
      DustAmbient.tsx
      BreathAmbient.tsx
      ScanlineAmbient.tsx
```

---

## TypeScript Types

```typescript
// lib/themes/types.ts

export type ThemeMode = 'dark' | 'light'

export type AmbientType =
  | 'fire' | 'spores' | 'caustic' | 'constellation'
  | 'corona' | 'still' | 'aurora' | 'petals'
  | 'crystal' | 'dust' | 'breath' | 'scanline'

export interface LightPoint {
  x: number            // SVG coordinate
  y: number
  z: number
  intensity: number    // 0-1
  color: string        // hex
}

export interface LightRig {
  key: LightPoint      // primary directional light
  fill: LightPoint     // softer opposite fill
  rim: {
    intensity: number
    color: string
  }
}

export interface ThemeColors {
  primary: string      // main accent hex
  deep: string         // darkest — used for backgrounds in dark mode
  mid: string          // glass tint color
  light: string        // rim light / highlighted text
  rgb: string          // 'R, G, B' of primary for CSS rgba()
}

export interface ThemeModeConfig {
  background: string         // main canvas background
  surface: string            // panel / card surface
  surfaceElevated: string    // elevated cards
  writingSurface: string     // textarea background (sacred — always clean)
  textPrimary: string
  textSecondary: string
  textMuted: string
  border: string
  glassBackground: string    // rgba() string for glass panels
  glassBorder: string        // rgba() string for glass borders
  glassBlur: number          // px
  glassOpacity: number       // 0-1
  shadowColor: string        // for light mode shadows
  lights: LightRig
}

export interface Theme {
  id: string
  name: string
  subtitle: string           // 'The Fire', 'The Depth' etc.
  mood: string               // 'Primal · urgent · alive'
  colors: ThemeColors
  ambient: {
    type: AmbientType
    speed: number            // 0-1
    intensity: number        // 0-1
  }
  dark: ThemeModeConfig
  light: ThemeModeConfig
}

export interface ThemeState {
  themeId: string
  mode: ThemeMode
}

// Per-section mode defaults
export const SECTION_MODE_DEFAULTS: Record<string, ThemeMode> = {
  archive:   'dark',
  forge:     'light',
  chronicle: 'light',
}

// Per-section theme defaults
export const SECTION_THEME_DEFAULTS: Record<string, string> = {
  archive:   'sage',
  forge:     'solar',
  chronicle: 'ocean',
}
```

---

## Theme Definitions — All 12

Each theme defines both dark and light mode completely.
The light mode is not derived from dark — it is explicitly defined.

```typescript
// lib/themes/presets/ember.ts
export const ember: Theme = {
  id: 'ember',
  name: 'Ember',
  subtitle: 'The Fire',
  mood: 'Primal · urgent · alive',
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
    writingSurface:  '#100300',    // deep ember dark — intimate
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
    }
  },

  light: {
    background:      '#FFF8F4',    // warm white — sunlit forge
    surface:         '#FFF0E8',
    surfaceElevated: '#FFFFFF',
    writingSurface:  '#FFFFFF',    // pure white — maximum clarity
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
      // Light mode: lights create shadow, not illumination
      key:  { x: 400, y: -200, z: 500, intensity: 0.6, color: '#FF8040' },
      fill: { x: -200, y: 400, z: 300, intensity: 0.2, color: '#FFD0A0' },
      rim:  { intensity: 0.1, color: '#FF9060' },   // rim irrelevant in light
    }
  },
}
```

Define all 12 themes following this exact structure.
Full specifications for each:

```
EMBER (fire)
  dark bg: #0f0400 · light bg: #FFF8F4 (warm sunlit forge)
  dark write: #100300 · light write: #FFFFFF
  dark ambient: fire particles drift upward, heat shimmer
  light ambient: subtle heat distortion only — no particles (daylight)
  dark lights: orange-hot key top-right, red fill bottom-left, amber rim
  light lights: strong top key creates downward orange shadow, soft fill

FOREST (spores)
  dark bg: #020802 · light bg: #F4FBF4 (morning canopy)
  dark write: #030A03 · light write: #FAFFF8
  dark ambient: organic spore drift, slow, bioluminescent particles
  light ambient: dust motes in beam of canopy light — slower, golden
  dark lights: canopy green top, deep forest floor fill, leaf-light rim
  light lights: sun-through-leaves — dappled key, warm fill from ground

OCEAN (caustic)
  dark bg: #010810 · light bg: #F4F8FF (surface light on water)
  dark write: #010610 · light write: #FAFCFF
  dark ambient: caustic light ripple, underwater undulation
  light ambient: surface wave shimmer — faster, lighter, joyful
  dark lights: surface light from above, deep water fill, caustic rim
  light lights: overhead sun harsh, deep bounce fill, no rim

ROYAL (constellation)
  dark bg: #040210 · light bg: #F8F6FF (cathedral white stone)
  dark write: #030112 · light write: #FFFFFF
  dark ambient: slow particle constellation, court atmosphere
  light ambient: stained glass light scatter — color patches drift slowly
  dark lights: violet crown top-left, indigo deep fill, lilac rim
  light lights: cathedral window key top, cool stone fill, no rim

SOLAR (corona)
  dark bg: #0d0a00 · light bg: #FFFDF0 (bleached noon)
  dark write: #0a0800 · light write: #FFFFF8
  dark ambient: slow corona pulse from top, light ray cast
  light ambient: heat haze shimmer — barely visible, just movement
  dark lights: high noon top-center, warm ground bounce, sunlight rim
  light lights: max intensity top key, white fill everywhere, no rim

VOID (still)
  dark bg: #000000 · light bg: #FFFFFF (the other absolute)
  dark write: #000000 · light write: #FFFFFF
  dark ambient: no motion — pure stillness, only refraction shimmer
  light ambient: no motion — pure stillness (symmetric)
  dark lights: single white point top, near nothing fill, precise rim
  light lights: single strong top, near nothing fill, no rim

DUSK (aurora)
  dark bg: #0a0314 · light bg: #FBF6FF (lavender afternoon)
  dark write: #080212 · light write: #FDFAFF
  dark ambient: slow purple aurora drift, between-worlds
  light ambient: soft color wash drift — very slow, barely there
  dark lights: purple dusk horizon, deep violet fill, lilac rim
  light lights: soft diffuse — no strong direction, hazy afternoon

ROSE (petals)
  dark bg: #100208 · light bg: #FFF6F8 (garden morning)
  dark write: #0e0208 · light write: #FFFAFC
  dark ambient: slow organic petal drift, heartbeat pulse
  light ambient: petal drift visible but faster — morning breeze
  dark lights: warm rose top-right, deep crimson base, petal-light rim
  light lights: morning side-light key, warm fill from garden floor

ARCTIC (crystal)
  dark bg: #010a12 · light bg: #F6FBFF (snow field)
  dark write: #010810 · light write: #FAFEFF
  dark ambient: ice crystal formation/dissolution, aurora borealis
  light ambient: ice crystal sparkle — bright, instant, not slow
  dark lights: cold white top, deep ice fill, crystal refraction rim
  light lights: blinding white top, blue-white fill, no rim

EARTH (dust)
  dark bg: #0c0700 · light bg: #FFF8EE (desert noon)
  dark write: #0a0600 · light write: #FFFDF8
  dark ambient: dust motes in light, cave painting feel, amber warmth
  light ambient: heat shimmer over sand, dust swirl — visible, slow
  dark lights: desert sun top, terracotta warm fill, golden rim
  light lights: harsh overhead desert sun, warm sandy fill

SAGE (breath)
  dark bg: #030A06 · light bg: #F6FBF8 (library window)
  dark write: #020804 · light write: #FAFFF9
  dark ambient: slow breathing rhythm — pulse every 4 seconds
  light ambient: very subtle dust motes in window light
  dark lights: library lamp glow top-left, deep sage shadow, soft rim
  light lights: window light key right, cool room fill, no rim

CHROME (scanline)
  dark bg: #080808 · light bg: #F8F8FC (clean lab)
  dark write: #060606 · light write: #FFFFFF
  dark ambient: subtle scan line texture, barely visible
  light ambient: no motion — fluorescent precision, stillness
  dark lights: overhead fluorescent, cool grey bounce, metallic rim
  light lights: overhead tubes, cool fill, harsh and even
```

---

## CSS Variable Injection System

ThemeProvider injects all theme values as CSS custom properties on `:root`.
This means every component uses variables — no hardcoded colors anywhere.

```typescript
// components/theme/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Theme, ThemeMode, ThemeState } from '@/lib/themes/types'
import { THEMES } from '@/lib/themes/config'

interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  setTheme: (id: string) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  modeConfig: Theme['dark'] | Theme['light']
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  section,
}: {
  children: React.ReactNode
  section: 'archive' | 'forge' | 'chronicle'
}) {
  const storageKey = `ip_theme_${section}`

  const [state, setState] = useState<ThemeState>(() => {
    if (typeof window === 'undefined') return {
      themeId: SECTION_THEME_DEFAULTS[section],
      mode: SECTION_MODE_DEFAULTS[section],
    }
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : {
        themeId: SECTION_THEME_DEFAULTS[section],
        mode: SECTION_MODE_DEFAULTS[section],
      }
    } catch { return {
      themeId: SECTION_THEME_DEFAULTS[section],
      mode: SECTION_MODE_DEFAULTS[section],
    }}
  })

  const theme = THEMES[state.themeId] ?? THEMES['sage']
  const modeConfig = state.mode === 'dark' ? theme.dark : theme.light

  useEffect(() => {
    // Inject all CSS variables
    const root = document.documentElement
    const m = modeConfig
    const c = theme.colors

    root.style.setProperty('--theme-bg',            m.background)
    root.style.setProperty('--theme-surface',        m.surface)
    root.style.setProperty('--theme-surface-raised', m.surfaceElevated)
    root.style.setProperty('--theme-writing',        m.writingSurface)
    root.style.setProperty('--theme-text-primary',   m.textPrimary)
    root.style.setProperty('--theme-text-secondary', m.textSecondary)
    root.style.setProperty('--theme-text-muted',     m.textMuted)
    root.style.setProperty('--theme-border',         m.border)
    root.style.setProperty('--theme-glass-bg',       m.glassBackground)
    root.style.setProperty('--theme-glass-border',   m.glassBorder)
    root.style.setProperty('--theme-glass-blur',     `${m.glassBlur}px`)
    root.style.setProperty('--theme-shadow',         m.shadowColor)
    root.style.setProperty('--theme-primary',        c.primary)
    root.style.setProperty('--theme-primary-rgb',    c.rgb)
    root.style.setProperty('--theme-deep',           c.deep)
    root.style.setProperty('--theme-mid',            c.mid)
    root.style.setProperty('--theme-light-color',    c.light)
    root.style.setProperty('--theme-mode',           state.mode)

    // Update SVG light sources
    updateLightRig(m.lights)

    // Persist
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, modeConfig, theme])

  function setTheme(id: string) {
    setState(prev => ({ ...prev, themeId: id }))
  }

  function setMode(mode: ThemeMode) {
    setState(prev => ({ ...prev, mode }))
  }

  function toggleMode() {
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }))
  }

  return (
    <ThemeContext.Provider value={{
      theme, mode: state.mode, setTheme, setMode, toggleMode, modeConfig
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
```

---

## The Three-Point Lighting Rig

### SVG Filter Definition (GlassFilter.tsx)

```tsx
// components/theme/GlassFilter.tsx
'use client'

import { useEffect } from 'react'
import { updateLightRig } from '@/lib/themes'

export function GlassFilter() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const light = document.getElementById('glass-key-light')
      const fill  = document.getElementById('glass-fill-light')
      if (light) {
        light.setAttribute('x', String(e.clientX))
        light.setAttribute('y', String(e.clientY))
      }
      // Fill light moves opposite — tracked loosely
      if (fill) {
        fill.setAttribute('x', String(window.innerWidth - e.clientX * 0.3))
        fill.setAttribute('y', String(window.innerHeight - e.clientY * 0.3))
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        {/* Full liquid glass — used on hover */}
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="3"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic" in2="noise"
            scale="8"
            xChannelSelector="R" yChannelSelector="G"
            result="displaced"
          />
          <feSpecularLighting
            in="noise"
            surfaceScale="4"
            specularConstant="0.9"
            specularExponent="140"
            result="key-specular"
          >
            <fePointLight id="glass-key-light" x="300" y="100" z="400" />
          </feSpecularLighting>
          <feSpecularLighting
            in="noise"
            surfaceScale="2"
            specularConstant="0.4"
            specularExponent="60"
            result="fill-specular"
          >
            <fePointLight id="glass-fill-light" x="700" y="600" z="250" />
          </feSpecularLighting>
          <feBlend in="fill-specular" in2="key-specular" mode="screen" result="combined-specular"/>
          <feBlend in="displaced" in2="combined-specular" mode="screen" result="lit"/>
          <feComposite in="lit" in2="SourceGraphic" operator="in"/>
        </filter>

        {/* Soft glass — used at rest */}
        <filter id="liquid-glass-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic" in2="noise"
            scale="4"
            result="displaced"
          />
          <feSpecularLighting
            in="noise"
            surfaceScale="2"
            specularConstant="0.5"
            specularExponent="80"
            result="specular"
          >
            <fePointLight id="glass-soft-key" x="300" y="100" z="350" />
          </feSpecularLighting>
          <feBlend in="displaced" in2="specular" mode="screen" result="lit"/>
          <feComposite in="lit" in2="SourceGraphic" operator="in"/>
        </filter>

        {/* Rim light filter — thin edge highlight */}
        <filter id="rim-light" x="-5%" y="-5%" width="110%" height="110%">
          <feSpecularLighting
            in="SourceGraphic"
            surfaceScale="1"
            specularConstant="0.6"
            specularExponent="200"
            result="rim"
          >
            <fePointLight id="glass-rim-light" x="400" y="-100" z="100"/>
          </feSpecularLighting>
          <feComposite in="rim" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
    </svg>
  )
}

// Call this when theme/mode changes to reposition static lights
export function updateLightRig(lights: LightRig) {
  const keyEl = document.getElementById('glass-key-light')
  const softEl = document.getElementById('glass-soft-key')
  const rimEl  = document.getElementById('glass-rim-light')
  const fillEl = document.getElementById('glass-fill-light')

  if (keyEl)  { keyEl.setAttribute('x', String(lights.key.x))   }
  if (softEl) { softEl.setAttribute('x', String(lights.key.x))  }
  if (rimEl)  { rimEl.setAttribute('x', String(500))             }
  if (fillEl) { fillEl.setAttribute('x', String(lights.fill.x)) }
}
```

---

## Glass Panel Component

```tsx
// components/theme/GlassPanel.tsx
import { useTheme } from './ThemeProvider'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  intensity?: 'soft' | 'full'   // soft = rest state, full = hover
  style?: React.CSSProperties
}

export function GlassPanel({
  children,
  className = '',
  intensity = 'soft',
  style,
}: GlassPanelProps) {
  const { mode } = useTheme()

  return (
    <div
      className={`glass-panel ${className}`}
      data-mode={mode}
      style={{
        background:      'var(--theme-glass-bg)',
        backdropFilter:  `blur(var(--theme-glass-blur)) saturate(180%)`,
        WebkitBackdropFilter: `blur(var(--theme-glass-blur)) saturate(180%)`,
        border:          '1px solid var(--theme-glass-border)',
        boxShadow: mode === 'dark'
          ? `inset 0 1px 0 rgba(var(--theme-primary-rgb), 0.15),
             inset 0 -1px 0 rgba(var(--theme-primary-rgb), 0.05),
             0 8px 32px rgba(var(--theme-primary-rgb), 0.06),
             0 1px 0 rgba(255,255,255,0.04)`
          : `0 2px 8px var(--theme-shadow),
             0 1px 2px var(--theme-shadow),
             inset 0 1px 0 rgba(255,255,255,0.8)`,
        filter: `url(#liquid-glass-${intensity === 'full' ? '' : 'soft'})`,
        transition: 'all 0.3s ease',
        ...style,
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.filter = 'url(#liquid-glass)'
        ;(e.currentTarget as HTMLElement).style.borderColor =
          `rgba(var(--theme-primary-rgb), 0.35)`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.filter = 'url(#liquid-glass-soft)'
        ;(e.currentTarget as HTMLElement).style.borderColor =
          'var(--theme-glass-border)'
      }}
    >
      {children}
    </div>
  )
}
```

---

## The Mode Transition

When mode or theme changes — a 600ms cross-fade.
Not a flash. Not an instant swap. A breath.

```typescript
// In ThemeProvider, wrap the CSS variable injection in a transition:

function applyWithTransition(apply: () => void) {
  document.documentElement.style.transition =
    'background-color 0.6s ease, color 0.6s ease'

  // Also transition all glass panels
  document.querySelectorAll('.glass-panel').forEach(el => {
    ;(el as HTMLElement).style.transition =
      'background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease'
  })

  apply()

  // Clean up transition after it completes
  setTimeout(() => {
    document.documentElement.style.transition = ''
  }, 700)
}
```

SVG light positions also interpolate during the transition:
```typescript
function interpolateLights(from: LightRig, to: LightRig, duration: number) {
  const start = performance.now()
  function tick(now: number) {
    const p = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - p, 3)
    const interpolated = {
      key: {
        x: from.key.x + (to.key.x - from.key.x) * ease,
        y: from.key.y + (to.key.y - from.key.y) * ease,
        z: from.key.z + (to.key.z - from.key.z) * ease,
      },
      fill: {
        x: from.fill.x + (to.fill.x - from.fill.x) * ease,
        y: from.fill.y + (to.fill.y - from.fill.y) * ease,
      }
    }
    updateLightPositions(interpolated)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
```

---

## Ambient Animation System

Each ambient type is a React component that renders a canvas or SVG
positioned absolutely behind the UI. All are lazy-loaded — only the
active theme's ambient component is mounted.

```tsx
// components/theme/AmbientLayer.tsx
import dynamic from 'next/dynamic'
import { useTheme } from './ThemeProvider'

const AMBIENT_COMPONENTS = {
  fire:          dynamic(() => import('./ambient/FireAmbient')),
  spores:        dynamic(() => import('./ambient/SporesAmbient')),
  caustic:       dynamic(() => import('./ambient/CausticAmbient')),
  constellation: dynamic(() => import('./ambient/ConstellationAmbient')),
  corona:        dynamic(() => import('./ambient/CoronaAmbient')),
  still:         dynamic(() => import('./ambient/StillAmbient')),
  aurora:        dynamic(() => import('./ambient/AuroraAmbient')),
  petals:        dynamic(() => import('./ambient/PetalsAmbient')),
  crystal:       dynamic(() => import('./ambient/CrystalAmbient')),
  dust:          dynamic(() => import('./ambient/DustAmbient')),
  breath:        dynamic(() => import('./ambient/BreathAmbient')),
  scanline:      dynamic(() => import('./ambient/ScanlineAmbient')),
}

export function AmbientLayer() {
  const { theme, mode } = useTheme()
  const AmbientComponent = AMBIENT_COMPONENTS[theme.ambient.type]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        // Light mode: ambient at 40% of dark mode intensity
        opacity: mode === 'dark' ? theme.ambient.intensity : theme.ambient.intensity * 0.4,
        transition: 'opacity 0.6s ease',
      }}
    >
      <AmbientComponent
        speed={theme.ambient.speed}
        primaryColor={theme.colors.primary}
        mode={mode}
      />
    </div>
  )
}
```

### Ambient Component Specs

Each ambient component receives: `{ speed, primaryColor, mode }`
All use `<canvas>` with `requestAnimationFrame`.
Canvas: `position: absolute, inset: 0, width: 100%, height: 100%`.

**FireAmbient** — particle system
```
~60 particles per canvas
Each: y position decreasing (rising), x sinusoidal drift
Color: orange → red → transparent gradient per particle
Size: 2-6px, randomized
Dark mode: full opacity particles, heat shimmer (canvas blur)
Light mode: no particles — only subtle heat distortion
  (feDisplacementMap on canvas, very low scale)
```

**SporesAmbient** — organic drift
```
~40 particles
Slow random walk (Perlin noise direction)
Dark mode: circular, bioluminescent glow, low opacity
Light mode: smaller, golden-brown, faster (dust motes in sunbeam)
```

**CausticAmbient** — light refraction
```
SVG-based: multiple overlapping radial gradients
Positions animate slowly on sin/cos curves
Dark mode: teal/blue caustic patterns, high contrast
Light mode: white caustic patterns, very subtle — just shimmer
```

**ConstellationAmbient** — particle stars
```
~80 small dots
Very slow drift, occasional twinkle (opacity pulse)
Dark mode: white/violet particles, connected by thin lines if close
Light mode: colored light scatter (stained glass patches)
  — use theme primary color at 10% opacity blobs that drift
```

**CoronaAmbient** — radial pulse
```
SVG: expanding ring from top-center
Multiple rings at different phases
Dark mode: golden glow, full rings
Light mode: heat shimmer only — rings barely visible, fast
```

**StillAmbient** — nothing
```
No animation whatsoever.
Component renders nothing.
The refraction shimmer from GlassFilter IS the ambient.
```

**AuroraAmbient** — color waves
```
Canvas: horizontal sine waves across top 40% of viewport
Dark mode: purple/indigo/lilac waves, opacity 0.15-0.3
Light mode: very soft lavender wash, opacity 0.05-0.1
Speed: very slow (full cycle 20-30 seconds)
```

**PetalsAmbient** — organic shapes
```
~20 petal shapes (SVG paths, not circles)
Drift with gentle rotation
Dark mode: rose/crimson, opacity 0.2-0.4
Light mode: pink/white, opacity 0.15, faster (morning breeze)
```

**CrystalAmbient** — geometric growth
```
Canvas: ice crystal fractal patterns
Slowly crystallize from random points, then dissolve
Dark mode: teal/white, high contrast on dark bg
Light mode: white sparkle flashes — bright, instant, not slow
```

**DustAmbient** — particle motes
```
~30 dust particles
Very slow movement, slight gravity
Dark mode: amber/gold, visible in beams of light
Light mode: same particles but faster, more visible
  (desert heat shimmer also: canvas sine displacement, low intensity)
```

**BreathAmbient** — opacity pulse
```
No particles — the ENTIRE ambient layer pulses
opacity: 0.0 → 0.08 → 0.0 every 4 seconds (breathing rhythm)
The color is just the theme primary at that opacity
Dark mode: noticeable pulse
Light mode: imperceptible pulse (opacity peaks at 0.03)
```

**ScanlineAmbient** — texture
```
CSS only (no canvas):
  repeating-linear-gradient(
    transparent 0px,
    transparent 1px,
    rgba(255,255,255,0.015) 1px,
    rgba(255,255,255,0.015) 2px
  )
Background-size: 100% 2px
Dark mode: white scanlines at 1.5% opacity
Light mode: no scanlines (not needed in light — fluorescent is flat)
```

---

## Theme Switcher Component

```tsx
// components/theme/ThemeSwitcher.tsx
// A 12-pill grid, each pill is a glass swatch

export function ThemeSwitcher() {
  const { theme: activeTheme, mode, setTheme } = useTheme()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      padding: '16px',
    }}>
      {Object.values(THEMES).map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          style={{
            background: mode === 'dark'
              ? `rgba(${t.colors.rgb}, 0.12)`
              : `rgba(${t.colors.rgb}, 0.08)`,
            backdropFilter: 'blur(12px)',
            border: activeTheme.id === t.id
              ? `1.5px solid ${t.colors.primary}`
              : `0.5px solid rgba(${t.colors.rgb}, 0.25)`,
            borderRadius: '10px',
            padding: '10px 8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            filter: 'url(#liquid-glass-soft)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: t.colors.primary,
            boxShadow: `0 0 8px ${t.colors.primary}60`,
          }}/>
          <span style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: '9px',
            color: t.colors.light,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {t.name}
          </span>
        </button>
      ))}
    </div>
  )
}
```

---

## Theme Toggle (dark/light)

```tsx
// components/theme/ThemeToggle.tsx
// Small button — sun icon (light) / moon icon (dark)
// Lives in the top-right of Archive/Forge/Chronicle header

export function ThemeToggle() {
  const { mode, toggleMode, theme } = useTheme()

  return (
    <button
      onClick={toggleMode}
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        width: '36px', height: '36px',
        borderRadius: '8px',
        border: '0.5px solid var(--theme-glass-border)',
        background: 'var(--theme-glass-bg)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'url(#liquid-glass-soft)',
        transition: 'all 0.2s ease',
        color: 'var(--theme-primary)',
      }}
    >
      {/* Sun SVG for light mode icon, Moon SVG for dark mode icon */}
      {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
```

---

## Where to Integrate

### Archive Studio
```tsx
// Wrap the entire ArchiveStudio in ThemeProvider
<ThemeProvider section="archive">
  <GlassFilter />
  <AmbientLayer />
  {/* rest of Archive UI */}
</ThemeProvider>
```

### Asset Manager Dashboard
```tsx
<ThemeProvider section="forge">
  <GlassFilter />
  <AmbientLayer />
  {/* Dashboard */}
</ThemeProvider>
```

### Chronicle Studio
```tsx
<ThemeProvider section="chronicle">
  <GlassFilter />
  <AmbientLayer />
  {/* ChronicleStudio */}
</ThemeProvider>
```

All three sections remember their own theme + mode independently.

---

## Performance Rules

1. Only ONE ambient component mounted at a time — dynamic import ensures
   unmounted themes don't run their animation loops

2. All canvas animations use requestAnimationFrame with a frame limiter:
   ```ts
   const FPS = 30  // ambient doesn't need 60fps
   const interval = 1000 / FPS
   let lastTime = 0
   function animate(time: number) {
     if (time - lastTime < interval) { requestAnimationFrame(animate); return }
     lastTime = time
     // draw
     requestAnimationFrame(animate)
   }
   ```

3. SVG filters run on GPU — no performance cost for the light rig

4. Mousemove listener is passive and updates only 2 SVG attributes

5. Theme transition adds CSS transition temporarily then removes it —
   no permanent transition overhead on all elements

6. AmbientLayer opacity is 0 during theme switch — ambient unmounts
   and remounts without being visible

7. localStorage saves debounced 500ms — not on every state change

---

## localStorage Keys

```
ip_theme_archive    → { themeId: string, mode: 'dark' | 'light' }
ip_theme_forge      → { themeId: string, mode: 'dark' | 'light' }
ip_theme_chronicle  → { themeId: string, mode: 'dark' | 'light' }
```

---

## Build Order

```
1.  lib/themes/types.ts — all TypeScript types
2.  lib/themes/presets/ — all 12 theme files
3.  lib/themes/config.ts — THEMES registry (all 12 imported + exported)
4.  lib/themes/index.ts — exports + updateLightRig function
5.  components/theme/GlassFilter.tsx — SVG defs + mousemove handler
6.  components/theme/GlassPanel.tsx — reusable glass wrapper
7.  components/theme/ThemeProvider.tsx — context + CSS var injection
8.  components/theme/ThemeToggle.tsx — dark/light toggle button
9.  components/theme/ThemeSwitcher.tsx — 12-theme selector grid
10. components/theme/AmbientLayer.tsx — dynamic ambient loader
11. components/theme/ambient/StillAmbient.tsx — (void — renders nothing)
12. components/theme/ambient/BreathAmbient.tsx — (sage — CSS pulse)
13. components/theme/ambient/ScanlineAmbient.tsx — (chrome — CSS texture)
14. components/theme/ambient/FireAmbient.tsx — (ember)
15. components/theme/ambient/SporesAmbient.tsx — (forest)
16. components/theme/ambient/CausticAmbient.tsx — (ocean)
17. components/theme/ambient/ConstellationAmbient.tsx — (royal)
18. components/theme/ambient/CoronaAmbient.tsx — (solar)
19. components/theme/ambient/AuroraAmbient.tsx — (dusk)
20. components/theme/ambient/PetalsAmbient.tsx — (rose)
21. components/theme/ambient/CrystalAmbient.tsx — (arctic)
22. components/theme/ambient/DustAmbient.tsx — (earth)
23. Wrap ArchiveStudio with ThemeProvider
24. Wrap Dashboard with ThemeProvider
25. Wrap ChronicleStudio with ThemeProvider
26. Update Saturn Archive prompt — replace GlassFilter with theme system
27. Test all 12 themes in dark mode
28. Test all 12 themes in light mode
29. Test theme transition (600ms cross-fade, no flash)
30. Test ambient performance (30fps cap, single instance)
31. Test localStorage persistence (theme survives page refresh)
32. Test section independence (Archive and Forge can have different themes)
```

---

## Do NOT

- Do not hardcode any color anywhere — only CSS variables
- Do not run more than one ambient animation simultaneously
- Do not use gradients in light mode glass — shadows only
- Do not make the ambient so intense it distracts from writing
- Do not flash on theme change — always 600ms ease
- Do not sync themes across sections — they are independent
- Do not use localStorage to share state between sections
- Do not add a system preference sync (prefers-color-scheme) —
  the section defaults are intentional and personal
- Do not animate the writing surface background on theme change —
  it transitions with the rest but stays clean

---

## Acceptance Criteria

- [ ] All 12 themes render correctly in dark mode
- [ ] All 12 themes render correctly in light mode
- [ ] Glass panels show refraction shimmer following cursor
- [ ] Three-point lighting shifts when theme changes
- [ ] Light positions interpolate smoothly on theme change
- [ ] Ambient animation matches active theme
- [ ] Only one ambient component runs at a time
- [ ] Theme transition is 600ms, no flash, no jump
- [ ] ThemeSwitcher shows 12 glass swatches in correct colors
- [ ] ThemeToggle cycles dark/light with correct icon
- [ ] Archive defaults to sage/dark
- [ ] Forge defaults to solar/light
- [ ] Chronicle defaults to ocean/light
- [ ] Each section remembers its theme independently
- [ ] Writing surface is always clean — no glass filter applied
- [ ] Light mode uses shadows not glow for depth
- [ ] Dark mode uses glow and rim light for depth
- [ ] All 12 ambient types run at ≤30fps
- [ ] No performance degradation over 5 minutes of use
- [ ] No console errors, no TypeScript errors

---

*12 worlds. 2 realities each.*
*Light is not the absence of dark — it is a different truth.*
