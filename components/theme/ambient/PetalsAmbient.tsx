'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

interface Petal { x: number; y: number; vx: number; vy: number; rot: number; rotV: number; size: number; opacity: number; phase: number }

const FPS = 30

export default function PetalsAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    function spawnPetal(): Petal {
      const base = mode === 'light' ? 1.5 : 0.8
      return {
        x:       Math.random() * W,
        y:       -20,
        vx:      (Math.random() - 0.5) * 0.8 * (base + speed),
        vy:      0.3 + Math.random() * 0.6 * (base + speed),
        rot:     Math.random() * Math.PI * 2,
        rotV:    (Math.random() - 0.5) * 0.03,
        size:    8 + Math.random() * 12,
        opacity: mode === 'light' ? 0.15 + Math.random() * 0.15 : 0.2 + Math.random() * 0.2,
        phase:   Math.random() * Math.PI * 2,
      }
    }

    const petals: Petal[] = Array.from({ length: 20 }, () => {
      const p = spawnPetal(); p.y = Math.random() * H; return p
    })

    const interval = 1000 / FPS
    let lastTime   = 0
    let raf: number

    function drawPetal(x: number, y: number, size: number, rot: number) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.bezierCurveTo(size * 0.5, -size * 0.8, size * 0.5, size * 0.3, 0, size * 0.4)
      ctx.bezierCurveTo(-size * 0.5, size * 0.3, -size * 0.5, -size * 0.8, 0, -size)
      ctx.closePath()
      ctx.restore()
    }

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.x   += p.vx + Math.sin(ts * 0.001 + p.phase) * 0.3
        p.y   += p.vy
        p.rot += p.rotV
        if (p.y > H + 30) { petals[i] = spawnPetal(); continue }

        ctx.save()
        ctx.globalAlpha = p.opacity
        drawPetal(p.x, p.y, p.size, p.rot)
        ctx.fillStyle   = mode === 'light' ? `rgba(255,180,200,1)` : primaryColor
        ctx.fill()
        ctx.restore()
      }
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [speed, primaryColor, mode])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
