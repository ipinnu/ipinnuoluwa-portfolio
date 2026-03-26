'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BrainboxNode } from '@/lib/types/brainbox'
import { NODE_COLORS, NODE_SIZES } from '@/lib/types/brainbox'
import NodePreview from './NodePreview'

interface OrbitNodeProps {
  node: BrainboxNode
  isFiltered: boolean // true = this node is hidden by filter
  onOpen: (node: BrainboxNode) => void
  animIndex: number
}

export default function OrbitNode({ node, isFiltered, onOpen, animIndex }: OrbitNodeProps) {
  const [hovered, setHovered] = useState(false)
  const color = NODE_COLORS[node.type]
  const size = NODE_SIZES[node.type]

  const shapeStyle: React.CSSProperties = {
    width: size.w,
    height: size.h,
    borderRadius: size.radius,
    background: color + '14',
    border: `0.5px solid ${color}`,
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(node.type === 'wonder' ? { transform: 'rotate(45deg)' } : {}),
  }

  return (
    <motion.div
      layoutId={`node-${node.id}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isFiltered ? 0.1 : 1,
        scale: isFiltered ? 0.85 : 1,
      }}
      transition={
        isFiltered
          ? { duration: 0.3 }
          : { delay: 1.5 + animIndex * 0.08, type: 'spring', stiffness: 60, damping: 15 }
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => !isFiltered && onOpen(node)}
      style={{ position: 'relative' }}
      whileHover={{ scale: isFiltered ? 0.85 : 1.15 }}
    >
      <div style={shapeStyle} />

      <AnimatePresence>
        {hovered && !isFiltered && (
          <NodePreview node={node} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
