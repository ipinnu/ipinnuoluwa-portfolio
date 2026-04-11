'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'
import { PLANET_CONFIG } from '@/lib/types/celestial'

interface MoonProps {
  node: CelestialNode
  index: number
  radius: number
  onOpen: (node: CelestialNode) => void
}

export default function Moon({ node, index, radius, onOpen }: MoonProps) {
  const [hovered, setHovered] = useState(false)
  const config = PLANET_CONFIG[node.planet]
  const duration = (12 + index * 4) / (node.orbit_speed || 1)
  const delay = -(index / 4) * duration
  const isDream = node.planet === 'dream'
  const moonSize = isDream ? 7 : 9

  return (
    <div
      className="moon-arm"
      style={{
        '--moon-radius': `${radius}px`,
        '--moon-duration': `${duration}s`,
        animationDelay: `${delay}s`,
        animationPlayState: hovered ? 'paused' : 'running',
      } as React.CSSProperties}
    >
      <div style={{ position: 'absolute', transform: `translateX(${radius}px)` }}>
        <motion.button
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={() => onOpen(node)}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: moonSize,
            height: moonSize,
            borderRadius: '50%',
            background: isDream
              ? `radial-gradient(circle at 40% 35%, ${config.color}88, ${config.color}33)`
              : `radial-gradient(circle at 35% 30%, ${config.color}cc, ${config.color}66)`,
            boxShadow: hovered
              ? `0 0 12px 4px ${config.color}55, inset -2px -2px 4px rgba(0,0,0,0.5)`
              : `inset -2px -2px 4px rgba(0,0,0,0.5)`,
            border: `0.5px solid ${config.color}${isDream ? '44' : '88'}`,
            opacity: isDream ? 0.6 : 1,
            cursor: 'pointer',
            position: 'relative',
            transition: 'box-shadow 0.2s',
            display: 'block',
          }}
          aria-label={node.title}
        />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: -28,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                backgroundColor: '#111111',
                border: '0.5px solid #222220',
                borderRadius: 4,
                padding: '3px 8px',
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#888884', margin: 0 }}>
                {node.title}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
