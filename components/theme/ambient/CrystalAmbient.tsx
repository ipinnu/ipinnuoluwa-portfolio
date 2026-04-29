'use client'

import { useEffect, useRef } from 'react'
import type { AmbientProps } from '../AmbientLayer'

interface Crystal { x: number; y: number; size: number; life: number; maxLife: number; angle: number }

const FPS = 30

export default function CrystalAmbient({ speed, primaryColor, mode }: AmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const crystals: Crystal[] = []
    const spawnInterval = mode === 'light' ? 200 : 800

    function spawn() {
      crystals.push({
        x:       Math.random() * W,
        y:       Math.random() * H,
        size:    mode === 'light' ? 4 + Math.random() * 8 : 10 + Math.random() * 30,
        life:    0,
        maxLife: mode === 'light' ? 20 + Math.random() * 20 : 100 + Math.random() * 150,
        angle:   Math.random() * Math.PI,
      })
    }

    function drawBranch(x: number, y: number, len: number, angle: number, depth: number) {
      if (depth === 0 || len < 2) return
      const ex = x + Math.cos(angle) * len
      const ey = y + Math.sin(angle) * len
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(ex, ey)
      ctx.stroke()
      drawBranch(ex, ey, len * 0.55, angle + Math.PI / 3, depth - 1)
      drawBranch(ex, ey, len * 0.55, angle - Math.PI / 3, depth - 1)
    }

    const interval = 1000 / FPS
    let lastTime   = 0
    let lastSpawn  = 0
    let raf: number

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastTime < interval) return
      lastTime = ts

      if (ts - lastSpawn > spawnInterval) { spawn(); lastSpawn = ts }

      ctx.clearRect(0, 0, W, H)

      for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i]
        c.life++
        if (c.life > c.maxLife) { crystals.splice(i, 1); continue }

        const t       = c.life / c.maxLife
        const growT   = Math.min(t * 2, 1)
        const fadeT   = Math.max(0, t * 2 - 1)
        const alpha   = mode === 'light'
          ? Math.sin(t * Math.PI) * 0.9
          : growT * (1 - fadeT) * 0.4
        const curSize = c.size * growT

        ctx.strokeStyle = mode === 'light' ? `rgba(255,255,255,${alpha})` : `rgba(${hexToRgb(primaryColor)},${alpha})`
        ctx.lineWidth   = mode === 'light' ? 1.5 : 0.8

        for (let arm = 0; arm < 6; arm++) {
          drawBranch(c.x, c.y, curSize, c.angle + (arm / 6) * Math.PI * 2, 3)
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
