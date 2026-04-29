'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

interface Particle { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number }

const FPS = 30

export default function FireAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const particles: Particle[] = []
    const count = mode === 'dark' ? 60 : 0

    function spawn(): Particle {
      return {
        x:       Math.random() * W,
        y:       H + 5,
        vx:      (Math.random() - 0.5) * 0.8,
        vy:      -(1 + Math.random() * 2) * (0.4 + speed * 1.2),
        size:    2 + Math.random() * 4,
        life:    0,
        maxLife: 80 + Math.random() * 80,
      }
    }

    for (let i = 0; i < count; i++) {
      const p = spawn()
      p.y     = Math.random() * H
      p.life  = Math.random() * p.maxLife
      particles.push(p)
    }

    const interval = 1000 / FPS
    let lastTime   = 0
    let raf: number

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts

      ctx.clearRect(0, 0, W, H)

      if (mode === 'light') {
        // Light mode: heat shimmer only — subtle sine displacement effect
        ctx.globalAlpha = 0.03
        const t = ts * 0.0005
        for (let y = 0; y < H; y += 8) {
          ctx.beginPath()
          const shift = Math.sin(y * 0.02 + t) * 4
          ctx.moveTo(0 + shift, y)
          ctx.lineTo(W + shift, y)
          ctx.strokeStyle = primaryColor
          ctx.lineWidth   = 1
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        return
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x   += p.vx + Math.sin(ts * 0.001 + i) * 0.3
        p.y   += p.vy
        p.life++
        if (p.life > p.maxLife || p.y < -10) { particles[i] = spawn(); continue }

        const t = p.life / p.maxLife
        const alpha = Math.sin(t * Math.PI) * 0.5

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0,   `rgba(255,160,40,${alpha})`)
        gradient.addColorStop(0.5, `rgba(220,60,10,${alpha * 0.6})`)
        gradient.addColorStop(1,   'rgba(180,20,0,0)')

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [speed, primaryColor, mode])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
