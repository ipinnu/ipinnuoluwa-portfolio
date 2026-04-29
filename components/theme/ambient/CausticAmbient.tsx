'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

const FPS = 30

export default function CausticAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const blobs = Array.from({ length: 5 }, (_, i) => ({
      cx: Math.random(), cy: Math.random(),
      r:  0.15 + Math.random() * 0.2,
      phase: (i / 5) * Math.PI * 2,
    }))

    const interval = 1000 / FPS
    let lastTime   = 0
    let raf: number

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts
      ctx.clearRect(0, 0, W, H)

      const t = ts * 0.0002 * (0.3 + speed)

      for (const b of blobs) {
        const x = (b.cx + Math.sin(t + b.phase) * 0.12) * W
        const y = (b.cy + Math.cos(t * 0.7 + b.phase) * 0.08) * H
        const r = b.r * Math.min(W, H)

        const opacity = mode === 'dark' ? 0.12 : 0.04
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0,   `rgba(${hexToRgb(primaryColor)},${opacity})`)
        g.addColorStop(0.5, `rgba(${hexToRgb(primaryColor)},${opacity * 0.5})`)
        g.addColorStop(1,   `rgba(${hexToRgb(primaryColor)},0)`)

        ctx.beginPath()
        ctx.ellipse(x, y, r, r * 0.6, t * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [speed, primaryColor, mode])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
