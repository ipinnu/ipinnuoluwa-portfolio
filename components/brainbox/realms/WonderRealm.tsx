'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { BrainboxNode } from '@/lib/types/brainbox'
import { useEffect } from 'react'

interface WonderRealmProps {
  node: BrainboxNode
  onClose: () => void
}

export default function WonderRealm({ node, onClose }: WonderRealmProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-30 overflow-hidden cursor-pointer"
      onClick={onClose}
    >
      {/* Background image with Ken Burns */}
      {node.image_url ? (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 20, ease: 'linear' }}
        >
          <Image
            src={node.image_url}
            alt={node.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.1) 100%)' }} />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-bg-primary" />
      )}

      {/* Content overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-16 left-8 right-8 max-w-2xl"
      >
        <span className="font-mono text-[11px] text-text-tertiary mb-3 block">Wonder</span>
        <h2 className="font-syne text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
          {node.title}
        </h2>
        {node.content && (
          <p className="font-syne text-lg text-text-secondary leading-relaxed" style={{ opacity: 0.8 }}>
            {node.content}
          </p>
        )}
        <p className="font-mono text-[11px] text-text-tertiary mt-6">Click anywhere to close</p>
      </motion.div>
    </motion.div>
  )
}
