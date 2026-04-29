'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

const FPS = 30

export default function AuroraAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const WAVES = 3
    const period = (20 + (1 - speed) * 10) * 1000

    const interval = 1000 / FPS
    let lastTime   = 0
    let raf: number

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts
      ctx.clearRect(0, 0, W, H)

      const t = (ts / period) * Math.PI * 2

      for (let w = 0; w < WAVES; w++) {
        const wPhase   = (w / WAVES) * Math.PI * 2
        const yBase    = H * (0.1 + w * 0.08)
        const amp      = H * 0.06
        const maxAlpha = mode === 'dark' ? 0.2 + w * 0.05 : 0.07

        ctx.beginPath()
        ctx.moveTo(0, yBase)
        for (let x = 0; x <= W; x += 4) {
          const y = yBase + Math.sin(x * 0.005 + t + wPhase) * amp
                          + Math.sin(x * 0.008 + t * 1.3 + wPhase) * amp * 0.4
          ctx.lineTo(x, y)
        }
        ctx.lineTo(W, 0)
        ctx.lineTo(0, 0)
        ctx.closePath()

        const g = ctx.createLinearGradient(0, 0, 0, yBase + amp)
        g.addColorStop(0,   `rgba(${hexToRgb(primaryColor)},${maxAlpha})`)
        g.addColorStop(0.6, `rgba(${hexToRgb(primaryColor)},${maxAlpha * 0.4})`)
        g.addColorStop(1,   `rgba(${hexToRgb(primaryColor)},0)`)
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
