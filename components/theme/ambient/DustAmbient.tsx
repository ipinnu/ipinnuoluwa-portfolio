'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

interface Mote { x: number; y: number; vx: number; vy: number; size: number; opacity: number; phase: number }

const FPS = 30

export default function DustAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const count = 30
    const motes: Mote[] = Array.from({ length: count }, () => ({
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * 0.3 * (mode === 'light' ? 1.5 : 0.8),
      vy:      (Math.random() - 0.5) * 0.15 + 0.05,
      size:    1 + Math.random() * 2,
      opacity: mode === 'light' ? 0.3 + Math.random() * 0.3 : 0.2 + Math.random() * 0.2,
      phase:   Math.random() * Math.PI * 2,
    }))

    const interval = 1000 / FPS
    let lastTime   = 0
    let raf: number

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts
      ctx.clearRect(0, 0, W, H)

      // Heat shimmer waves (earth/desert)
      if (mode === 'light') {
        ctx.globalAlpha = 0.025
        const t = ts * 0.0003 * (0.3 + speed)
        for (let y = H * 0.5; y < H; y += 6) {
          ctx.beginPath()
          const shift = Math.sin(y * 0.015 + t) * 5
          ctx.moveTo(shift, y)
          ctx.lineTo(W + shift, y)
          ctx.strokeStyle = primaryColor
          ctx.lineWidth   = 1
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      for (const m of motes) {
        m.x  += m.vx + Math.sin(ts * 0.0005 + m.phase) * 0.15
        m.y  += m.vy
        if (m.y > H + 5) m.y = -5
        if (m.x < -5) m.x = W + 5
        if (m.x > W + 5) m.x = -5

        const brightness = mode === 'light' ? 0.7 : 0.5 + 0.2 * Math.sin(ts * 0.001 + m.phase)
        const color      = mode === 'light' ? '#C09060' : primaryColor

        ctx.globalAlpha = m.opacity * brightness
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
        ctx.fillStyle   = color
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [speed, primaryColor, mode])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
