'use client'

import { motion } from 'framer-motion'

export default function TheSun() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {/* Outer glow ring — slow pulse */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(232,220,120,0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Mid corona */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 150, height: 150,
          background: 'radial-gradient(circle, rgba(248,230,100,0.12) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* The sphere — CSS 3D technique from 21st.dev Solar Loader */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFF4C2 0%, #F5D840 30%, #C8920A 70%, #7A4D00 100%)',
          boxShadow: `
            inset -10px -10px 25px rgba(0,0,0,0.5),
            inset 4px 4px 12px rgba(255,255,200,0.4),
            0 0 40px rgba(232,200,60,0.4),
            0 0 80px rgba(232,200,60,0.15)
          `,
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Reflection highlight */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '22%',
          width: '28%', height: '22%',
          borderRadius: '50%',
          background: 'rgba(255,255,220,0.45)',
          filter: 'blur(3px)',
        }} />
      </div>
    </div>
  )
}
