'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

export default function BreathAmbient({ primaryColor, mode }: AmbientProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const darkPeak  = 0.08
    const lightPeak = 0.03
    const peak      = mode === 'dark' ? darkPeak : lightPeak
    const period    = 4000
    let start: number | null = null
    let raf: number

    function tick(ts: number) {
      if (!start) start = ts
      const t       = ((ts - start) % period) / period
      const opacity = peak * Math.sin(t * Math.PI)
      if (el) el.style.opacity = String(Math.max(0, opacity))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  return (
    <div
      ref={ref}
      style={{
        position:        'absolute',
        inset:           0,
        backgroundColor: primaryColor,
        opacity:         0,
        transition:      'none',
      }}
    />
  )
}
