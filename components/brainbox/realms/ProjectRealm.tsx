'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BrainboxNode } from '@/lib/types/brainbox'
import { NODE_COLORS } from '@/lib/types/brainbox'

interface ProjectRealmProps {
  node: BrainboxNode
  onClose: () => void
}

export default function ProjectRealm({ node, onClose }: ProjectRealmProps) {
  const color = NODE_COLORS.project

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
        className="relative max-w-md w-full"
        style={{
          background: '#0F0F0F',
          border: `0.5px solid ${color}44`,
          borderRadius: 16,
          padding: '28px 32px',
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
          Project
        </span>

        <h2 className="font-syne text-xl font-bold text-text-primary mb-2">
          {node.title}
        </h2>

        {node.summary && (
          <p className="font-dm-sans text-sm text-text-secondary leading-relaxed mb-4">
            {node.summary}
          </p>
        )}

        {node.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {node.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 rounded-sm"
                style={{ background: '#1A1A1A', color: '#888884' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {node.project_slug && (
            <Link
              href={`/work/${node.project_slug}`}
              className="flex-1 text-center font-mono text-xs py-2.5 rounded-sm transition-colors"
              style={{ background: '#E8FF47', color: '#0A0A0A' }}
              onClick={onClose}
            >
              View case study →
            </Link>
          )}
          {node.external_url && (
            <a
              href={node.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center font-mono text-xs py-2.5 rounded-sm border border-border text-text-secondary hover:text-text-primary transition-colors"
            >
              Live site ↗
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
