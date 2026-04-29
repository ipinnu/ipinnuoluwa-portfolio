'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

interface Star { x: number; y: number; vx: number; vy: number; size: number; phase: number }

const FPS = 30
const CONNECT_DIST = 120

export default function ConstellationAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const count = 80
    const stars: Star[] = Array.from({ length: count }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.08 * (0.5 + speed),
      vy:    (Math.random() - 0.5) * 0.08 * (0.5 + speed),
      size:  0.8 + Math.random() * 1.5,
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

      for (const s of stars) {
        s.x += s.vx; s.y += s.vy
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0
      }

      if (mode === 'dark') {
        // Draw connecting lines between nearby stars
        ctx.strokeStyle = `rgba(${hexToRgb(primaryColor)},0.12)`
        ctx.lineWidth   = 0.5
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const dx   = stars[i].x - stars[j].x
            const dy   = stars[i].y - stars[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < CONNECT_DIST) {
              ctx.globalAlpha = (1 - dist / CONNECT_DIST) * 0.3
              ctx.beginPath()
              ctx.moveTo(stars[i].x, stars[i].y)
              ctx.lineTo(stars[j].x, stars[j].y)
              ctx.stroke()
            }
          }
        }
        ctx.globalAlpha = 1
      }

      // Draw stars/blobs
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(ts * 0.001 + s.phase)

        if (mode === 'light') {
          // Light scatter blob
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 20)
          g.addColorStop(0,   `rgba(${hexToRgb(primaryColor)},${0.08 * twinkle})`)
          g.addColorStop(1,   `rgba(${hexToRgb(primaryColor)},0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, 20, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        } else {
          ctx.globalAlpha = twinkle * 0.8
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.fill()
          ctx.globalAlpha = 1
        }
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
