'use client'

import { useEffect, useRef } from 'react'

interface EntrySphereProps {
  onReady?: () => void
}

export default function EntrySphere({ onReady }: EntrySphereProps) {
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true
    const timer = setTimeout(() => onReady?.(), 1500)
    return () => clearTimeout(timer)
  }, [onReady])

  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '0.5px solid #E8FF47',
          opacity: 0.6,
          animation: 'spin 8s linear infinite',
        }}
      />
      {/* Tilted equator */}
      <div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 80,
          border: '0.5px solid #E8FF47',
          opacity: 0.35,
          transform: 'rotateX(70deg)',
          animation: 'spin 6s linear infinite reverse',
        }}
      />
      {/* Diagonal arc */}
      <div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 80,
          border: '0.5px solid #E8FF47',
          opacity: 0.25,
          transform: 'rotateY(70deg)',
          animation: 'spin 10s linear infinite',
        }}
      />
      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 4,
          height: 4,
          background: '#E8FF47',
          opacity: 0.8,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotateX(70deg) rotate(0deg); }
          to   { transform: rotateX(70deg) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
