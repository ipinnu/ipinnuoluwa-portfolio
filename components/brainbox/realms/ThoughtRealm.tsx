'use client'

import { motion } from 'framer-motion'
import type { BrainboxNode } from '@/lib/types/brainbox'
import { NODE_COLORS } from '@/lib/types/brainbox'

interface ThoughtRealmProps {
  node: BrainboxNode
  onClose: () => void
}

export default function ThoughtRealm({ node, onClose }: ThoughtRealmProps) {
  const color = NODE_COLORS.thought

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-30 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`node-${node.id}`}
        className="relative max-w-xl w-full max-h-[80vh] overflow-y-auto"
        style={{
          background: '#0F0F0F',
          border: `0.5px solid ${color}44`,
          borderRadius: 16,
          padding: '28px 32px',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-mono text-[11px] text-text-tertiary hover:text-text-secondary transition-colors"
        >
          [esc]
        </button>

        <span
          className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full mb-4"
          style={{ background: color + '22', color }}
        >
          Thought
        </span>

        <h2 className="font-syne text-xl font-bold text-text-primary mb-4">
          {node.title}
        </h2>

        {node.content && (
          <div className="font-dm-sans text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {node.content}
          </div>
        )}

        {node.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
            {node.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] text-text-tertiary">#{tag}</span>
            ))}
          </div>
        )}

        <p className="font-mono text-[10px] text-text-tertiary mt-3">
          {new Date(node.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
        </p>
      </motion.div>
    </motion.div>
  )
}
