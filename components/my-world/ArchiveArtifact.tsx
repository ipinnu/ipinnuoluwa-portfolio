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
      animate={{ opacity: 0.18 + taps * 0.2 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        bottom: -16,
        right: -14,
        width: 14,
        height: 14,
        background: 'none',
        border: 'none',
        cursor: 'default',
        padding: '12px',
        margin: '-12px',
        zIndex: 13,
      }}
      aria-hidden
      tabIndex={-1}
    >
      {/* Small scroll / archive icon in teal */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="2" width="10" height="10" rx="1.5" fill="none" stroke="#1D9E75" strokeWidth="1.2" opacity="0.8"/>
        <line x1="4.5" y1="5" x2="9.5" y2="5" stroke="#1D9E75" strokeWidth="0.9" opacity="0.7"/>
        <line x1="4.5" y1="7" x2="9.5" y2="7" stroke="#1D9E75" strokeWidth="0.9" opacity="0.6"/>
        <line x1="4.5" y1="9" x2="7.5" y2="9" stroke="#1D9E75" strokeWidth="0.9" opacity="0.5"/>
      </svg>
    </motion.button>
  )
}
