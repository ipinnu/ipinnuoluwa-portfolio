'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface ArchiveArtifactProps {
  onTriggered: () => void
}

export default function ArchiveArtifact({ onTriggered }: ArchiveArtifactProps) {
  const [taps, setTaps] = useState(0)
  const clickCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const handleClick = useCallback(() => {
    clickCount.current += 1
    clearTimeout(timerRef.current)

    if (clickCount.current === 3) {
      clickCount.current = 0
      setTaps(0)
      onTriggered()
    } else {
      setTaps(clickCount.current)
      timerRef.current = setTimeout(() => {
        clickCount.current = 0
        setTaps(0)
      }, 800)
    }
  }, [onTriggered])

  return (
    <motion.button
      onClick={handleClick}
      style={{
        width: 14,
        height: 14,
        background: 'none',
        border: 'none',
        cursor: 'default',
        padding: '14px',
        margin: '-14px',
        zIndex: 13,
        display: 'block',
      }}
      aria-hidden
      tabIndex={-1}
    >
      <motion.span
        animate={{ opacity: taps > 0 ? 0.8 + taps * 0.1 : [0.6, 1, 0.6] }}
        transition={taps > 0
          ? { duration: 0.15 }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ display: 'block', filter: 'drop-shadow(0 0 4px rgba(29,158,117,0.95))' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="2" width="10" height="10" rx="1.5" fill="none" stroke="#1D9E75" strokeWidth="1.2"/>
          <line x1="4.5" y1="5" x2="9.5" y2="5" stroke="#1D9E75" strokeWidth="0.9" opacity="0.9"/>
          <line x1="4.5" y1="7" x2="9.5" y2="7" stroke="#1D9E75" strokeWidth="0.9" opacity="0.75"/>
          <line x1="4.5" y1="9" x2="7.5" y2="9" stroke="#1D9E75" strokeWidth="0.9" opacity="0.6"/>
        </svg>
      </motion.span>
    </motion.button>
  )
}
