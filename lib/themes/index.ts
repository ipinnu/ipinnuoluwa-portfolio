export { THEMES, THEME_ORDER } from './config'
export type { Theme, ThemeMode, ThemeState, ThemeColors, ThemeModeConfig, LightRig, LightPoint, AmbientType } from './types'
export { SECTION_MODE_DEFAULTS, SECTION_THEME_DEFAULTS } from './types'

import type { LightRig } from './types'

export function updateLightRig(lights: LightRig): void {
  if (typeof document === 'undefined') return
  const keyEl  = document.getElementById('glass-key-light')
  const softEl = document.getElementById('glass-soft-key')
  const rimEl  = document.getElementById('glass-rim-light')
  const fillEl = document.getElementById('glass-fill-light')

  if (keyEl)  { keyEl.setAttribute('x',  String(lights.key.x));  keyEl.setAttribute('y',  String(lights.key.y)) }
  if (softEl) { softEl.setAttribute('x', String(lights.key.x));  softEl.setAttribute('y', String(lights.key.y)) }
  if (rimEl)  { rimEl.setAttribute('x',  String(500)) }
  if (fillEl) { fillEl.setAttribute('x', String(lights.fill.x)); fillEl.setAttribute('y', String(lights.fill.y)) }
}

export function interpolateLights(from: LightRig, to: LightRig, duration: number): void {
  const start = performance.now()
  function tick(now: number) {
    const p    = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - p, 3)
    updateLightRig({
      key:  { ...to.key,  x: from.key.x  + (to.key.x  - from.key.x)  * ease, y: from.key.y  + (to.key.y  - from.key.y)  * ease, z: to.key.z },
      fill: { ...to.fill, x: from.fill.x + (to.fill.x - from.fill.x) * ease, y: from.fill.y + (to.fill.y - from.fill.y) * ease, z: to.fill.z },
      rim:  to.rim,
    })
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
