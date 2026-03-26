'use client'

import { motion } from 'framer-motion'
import type { BrainboxNode } from '@/lib/types/brainbox'
import { NODE_COLORS } from '@/lib/types/brainbox'
import { useEffect, useState } from 'react'

interface PaperRealmProps {
  node: BrainboxNode
  onClose: () => void
}

export default function PaperRealm({ node, onClose }: PaperRealmProps) {
  const color = NODE_COLORS.paper
  const [progress, setProgress] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
    setProgress(Math.round(pct * 100))
  }

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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-30"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className="absolute right-0 top-0 bottom-0 flex flex-col"
        style={{
          width: 'min(60vw, 680px)',
          background: '#0F0F0F',
          borderLeft: `0.5px solid ${color}44`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-0.5 bg-border relative">
          <motion.div
            className="h-full absolute left-0 top-0"
            style={{ background: color, width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-4 border-b border-border">
          <div>
            <span
              className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full mb-3"
              style={{ background: color + '22', color }}
            >
              Paper
            </span>
            <h2 className="font-syne text-lg font-bold text-text-primary">
              {node.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[11px] text-text-tertiary hover:text-text-secondary transition-colors mt-1"
          >
            [esc]
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto p-8 pt-6"
          onScroll={handleScroll}
        >
          {node.content ? (
            <div className="font-dm-sans text-sm text-text-secondary leading-relaxed space-y-4 max-w-prose">
              {node.content.split('\n\n').map((para, i) => {
                if (para.startsWith('# ')) {
                  return <h1 key={i} className="font-syne text-xl font-bold text-text-primary mt-6">{para.slice(2)}</h1>
                }
                if (para.startsWith('## ')) {
                  return <h2 key={i} className="font-syne text-base font-bold text-text-primary mt-5">{para.slice(3)}</h2>
                }
                if (para.startsWith('**') && para.endsWith('**')) {
                  return <p key={i} className="font-semibold text-text-primary">{para.slice(2, -2)}</p>
                }
                return <p key={i}>{para}</p>
              })}
            </div>
          ) : (
            <p className="text-text-tertiary font-mono text-sm">No content yet.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
