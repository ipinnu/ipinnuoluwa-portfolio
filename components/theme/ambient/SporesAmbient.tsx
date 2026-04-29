'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

interface Spore { x: number; y: number; vx: number; vy: number; size: number; angle: number; phase: number }

const FPS = 30

export default function SporesAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const count  = 40
    const spores: Spore[] = Array.from({ length: count }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * (mode === 'light' ? 0.6 : 0.3) * (0.3 + speed),
      vy:    (Math.random() - 0.5) * (mode === 'light' ? 0.6 : 0.3) * (0.3 + speed),
      size:  mode === 'light' ? 1.5 + Math.random() * 2 : 2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
    }))

    const interval = 1000 / FPS
    let lastTime   = 0
    let raf: number

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts
      ctx.clearRect(0, 0, W, H)

      for (const s of spores) {
        s.angle += 0.004
        s.x     += s.vx + Math.cos(s.angle) * 0.2
        s.y     += s.vy + Math.sin(s.angle) * 0.2
        if (s.x < -10) s.x = W + 10
        if (s.x > W + 10) s.x = -10
        if (s.y < -10) s.y = H + 10
        if (s.y > H + 10) s.y = -10

        const opacity = mode === 'dark'
          ? 0.3 + 0.2 * Math.sin(ts * 0.001 + s.phase)
          : 0.2 + 0.1 * Math.sin(ts * 0.001 + s.phase)
        const color   = mode === 'light' ? '#B08040' : primaryColor

        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2)
        g.addColorStop(0,   `rgba(${hexToRgb(color)},${opacity})`)
        g.addColorStop(1,   `rgba(${hexToRgb(color)},0)`)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2)
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
