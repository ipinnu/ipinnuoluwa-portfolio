'use client'

import dynamic from 'next/dynamic'
import { useTheme } from './ThemeProvider'

const AMBIENT_COMPONENTS = {
  fire:          dynamic(() => import('./ambient/FireAmbient'),          { ssr: false }),
  spores:        dynamic(() => import('./ambient/SporesAmbient'),        { ssr: false }),
  caustic:       dynamic(() => import('./ambient/CausticAmbient'),       { ssr: false }),
  constellation: dynamic(() => import('./ambient/ConstellationAmbient'), { ssr: false }),
  corona:        dynamic(() => import('./ambient/CoronaAmbient'),        { ssr: false }),
  still:         dynamic(() => import('./ambient/StillAmbient'),         { ssr: false }),
  aurora:        dynamic(() => import('./ambient/AuroraAmbient'),        { ssr: false }),
  petals:        dynamic(() => import('./ambient/PetalsAmbient'),        { ssr: false }),
  crystal:       dynamic(() => import('./ambient/CrystalAmbient'),       { ssr: false }),
  dust:          dynamic(() => import('./ambient/DustAmbient'),          { ssr: false }),
  breath:        dynamic(() => import('./ambient/BreathAmbient'),        { ssr: false }),
  scanline:      dynamic(() => import('./ambient/ScanlineAmbient'),      { ssr: false }),
}

export interface AmbientProps {
  speed:        number
  primaryColor: string
  mode:         'dark' | 'light'
}

export function AmbientLayer() {
  const { theme, mode } = useTheme()
  const AmbientComponent = AMBIENT_COMPONENTS[theme.ambient.type]

  return (
    <div
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        0,
        opacity:       mode === 'dark' ? theme.ambient.intensity : theme.ambient.intensity * 0.4,
        transition:    'opacity 0.6s ease',
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
