'use client'

import { useMemo } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  layer: 1 | 2
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export default function StarField() {
  const stars = useMemo<Star[]>(() => {
    const rand = seededRandom(42)
    return Array.from({ length: 180 }, (_, i) => ({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 1.5 + 0.5,
      opacity: rand() * 0.5 + 0.1,
      layer: i < 120 ? 1 : 2,
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: '#F5F5F0',
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  )
}
