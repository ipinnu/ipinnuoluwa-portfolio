'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

const FPS = 30

export default function CoronaAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const ringCount = 4
    const rings     = Array.from({ length: ringCount }, (_, i) => ({ phase: (i / ringCount) * Math.PI * 2 }))

    const interval = 1000 / FPS
    let lastTime   = 0
    let raf: number

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts
      ctx.clearRect(0, 0, W, H)

      const t     = ts * 0.0003 * (0.3 + speed)
      const cx    = W / 2
      const maxR  = Math.max(W, H) * 0.55

      for (const ring of rings) {
        const prog    = ((t + ring.phase / (Math.PI * 2)) % 1)
        const r       = prog * maxR
        const opacity = mode === 'dark'
          ? Math.max(0, (1 - prog) * 0.18)
          : Math.max(0, (1 - prog) * 0.04)

        ctx.beginPath()
        ctx.arc(cx, -H * 0.1, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${hexToRgb(primaryColor)},${opacity})`
        ctx.lineWidth   = mode === 'dark' ? 2 : 1
        ctx.stroke()
      }

      // Central glow
      if (mode === 'dark') {
        const glow = ctx.createRadialGradient(cx, -H * 0.05, 0, cx, -H * 0.05, W * 0.3)
        glow.addColorStop(0,   `rgba(${hexToRgb(primaryColor)},0.15)`)
        glow.addColorStop(1,   `rgba(${hexToRgb(primaryColor)},0)`)
        ctx.beginPath()
        ctx.arc(cx, -H * 0.05, W * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = glow
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
