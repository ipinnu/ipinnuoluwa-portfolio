'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface InkArtifactProps {
  onTriggered: () => void
}

export default function InkArtifact({ onTriggered }: InkArtifactProps) {
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
      animate={{ opacity: 0.18 + taps * 0.14 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        bottom: -14,
        right: -18,
        width: 14,
        height: 14,
        background: 'none',
        border: 'none',
        cursor: 'default',
        padding: 0,
        zIndex: 12,
      }}
      aria-hidden
      tabIndex={-1}
    >
      {/* Quill / nib icon */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M11 1C12.2 1 13 1.8 13 3C13 4.2 12 5 10.5 6.5L4.5 12.5L2 13L2.5 10.5L8.5 4.5C10 3 10.8 2 11 1Z"
          fill="#A3C4B4"
          opacity="0.75"
        />
        <path
          d="M2 13L2.5 10.5L4 12L2 13Z"
          fill="#A3C4B4"
          opacity="0.5"
        />
        <path
          d="M2.5 10.5L4 12"
          stroke="#82A898"
          strokeWidth="0.6"
          opacity="0.6"
        />
      </svg>
    </motion.button>
  )
}
