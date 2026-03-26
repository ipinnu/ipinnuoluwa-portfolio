'use client'

import { motion } from 'framer-motion'
import { NODE_COLORS } from '@/lib/types/brainbox'
import type { BrainboxNode } from '@/lib/types/brainbox'

interface NodePreviewProps {
  node: BrainboxNode
}

const TYPE_LABELS: Record<string, string> = {
  thought: 'Thought',
  project: 'Project',
  paper: 'Paper',
  wonder: 'Wonder',
}

export default function NodePreview({ node }: NodePreviewProps) {
  const color = NODE_COLORS[node.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute z-20 pointer-events-none"
      style={{
        left: 'calc(100% + 12px)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 220,
        background: '#111111',
        border: '0.5px solid #222220',
        borderRadius: 12,
        padding: '14px 16px',
      }}
    >
      {/* Type badge */}
      <span
        className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full mb-2"
        style={{ background: color + '22', color }}
      >
        {TYPE_LABELS[node.type]}
      </span>

      {/* Title */}
      <p className="font-syne text-sm font-bold text-text-primary leading-tight mb-1">
        {node.title}
      </p>

      {/* Summary */}
      {node.summary && (
        <p className="font-dm-sans text-[12px] font-light text-text-secondary leading-snug line-clamp-2 mb-2">
          {node.summary}
        </p>
      )}

      {/* Tags */}
      {node.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {node.tags.slice(0, 3).map(tag => (
            <span key={tag} className="font-mono text-[10px] text-text-tertiary">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[11px] font-mono"
        style={{ color: '#E8FF47' }}
      >
        Click to explore →
      </motion.span>
    </motion.div>
  )
}
