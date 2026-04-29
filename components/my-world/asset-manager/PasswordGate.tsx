'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PasswordGateProps {
  onSuccess: () => void
  onClose: () => void
  envKey?: string
}

export default function PasswordGate({ onSuccess, onClose, envKey }: PasswordGateProps) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const key = envKey ?? process.env.NEXT_PUBLIC_ASSET_MANAGER_KEY ?? ''
    const correct = key ? btoa(value) === key : value === 'ipinnu'

    if (correct) {
      onSuccess()
    } else {
      setShake(true)
      setTimeout(() => { setShake(false); setValue('') }, 600)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0A0A0A',
          border: '0.5px solid #222220',
          borderRadius: 8,
          padding: '36px 32px',
          width: 'min(320px, calc(100vw - 48px))',
          textAlign: 'center',
        }}
      >
        {/* Gear icon */}
        <div style={{ marginBottom: 20, opacity: 0.5 }}>
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" style={{ margin: '0 auto' }}>
            <path d="M7 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm0 1a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="#888884"/>
            <path d="M7 1l.8 1.4A5 5 0 018.6 2.7L10.2 2l1.8 1.8-.7 1.6c.2.4.4.8.4 1.2L13 7l-.5 2.5-1.7.2c-.2.4-.4.8-.6 1.1L11 12.4 9 13.4l-1.4-.9c-.4.1-.8.1-1.2 0L5 13.4 3 12.4l.8-1.6c-.2-.3-.4-.7-.6-1.1L1.5 9.5 1 7l1.7-.4c.1-.4.3-.8.5-1.2L2.5 3.8 4.3 2l1.6.7c.4-.2.8-.3 1.2-.4L7 1z" fill="#333330"/>
          </svg>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.input
            ref={inputRef}
            type="password"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="..."
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '100%',
              background: '#111111',
              border: '0.5px solid #222220',
              borderRadius: 4,
              padding: '10px 14px',
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 14,
              color: '#F5F5F0',
              textAlign: 'center',
              letterSpacing: '0.2em',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#333330')}
            onBlur={e => (e.target.style.borderColor = '#222220')}
          />
        </form>
      </motion.div>
    </motion.div>
  )
}
