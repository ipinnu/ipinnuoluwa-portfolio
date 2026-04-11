'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface LockArtifactProps {
  onTriggered: () => void
}

export default function LockArtifact({ onTriggered }: LockArtifactProps) {
  const [rotation, setRotation] = useState(0)
  const clickCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const handleClick = useCallback(() => {
    clickCount.current += 1
    clearTimeout(timerRef.current)

    if (clickCount.current === 3) {
      clickCount.current = 0
      setRotation(0)
      onTriggered()
    } else {
      setRotation(r => r + 60)
      timerRef.current = setTimeout(() => {
        clickCount.current = 0
        setRotation(0)
      }, 800)
    }
  }, [onTriggered])

  return (
    <motion.button
      onClick={handleClick}
      animate={{ rotate: rotation }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: -12,
        right: -16,
        width: 14,
        height: 14,
        background: 'none',
        border: 'none',
        cursor: 'default',
        padding: 0,
        opacity: 0.25,
        zIndex: 12,
      }}
      aria-hidden
      tabIndex={-1}
    >
      {/* Gear shape — SVG */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm0 1a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
          fill="#888884"
        />
        <path
          d="M7 1l.8 1.4A5 5 0 018.6 2.7L10.2 2l1.8 1.8-.7 1.6c.2.4.4.8.4 1.2L13 7l-.5 2.5-1.7.2c-.2.4-.4.8-.6 1.1L11 12.4 9 13.4l-1.4-.9c-.4.1-.8.1-1.2 0L5 13.4 3 12.4l.8-1.6c-.2-.3-.4-.7-.6-1.1L1.5 9.5 1 7l1.7-.4c.1-.4.3-.8.5-1.2L2.5 3.8 4.3 2l1.6.7c.4-.2.8-.3 1.2-.4L7 1z"
          fill="#555552"
        />
      </svg>
    </motion.button>
  )
}
