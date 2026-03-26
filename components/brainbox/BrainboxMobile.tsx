'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BrainboxNode } from '@/lib/types/brainbox'
import { NODE_COLORS, NODE_SIZES } from '@/lib/types/brainbox'
import type { NodeType } from '@/lib/types/brainbox'
import FilterStrip from './FilterStrip'
import ThoughtRealm from './realms/ThoughtRealm'
import ProjectRealm from './realms/ProjectRealm'
import PaperRealm from './realms/PaperRealm'
import WonderRealm from './realms/WonderRealm'

type Filter = 'all' | NodeType

interface BrainboxMobileProps {
  nodes: BrainboxNode[]
}

function NodeIcon({ type }: { type: NodeType }) {
  const color = NODE_COLORS[type]
  const size = NODE_SIZES[type]
  return (
    <div
      style={{
        width: size.w * 0.7,
        height: size.h * 0.7,
        borderRadius: size.radius,
        background: color + '14',
        border: `0.5px solid ${color}`,
        flexShrink: 0,
        ...(type === 'wonder' ? { transform: 'rotate(45deg)' } : {}),
      }}
    />
  )
}

export default function BrainboxMobile({ nodes }: BrainboxMobileProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [openNode, setOpenNode] = useState<BrainboxNode | null>(null)

  const counts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const visible = filter === 'all' ? nodes : nodes.filter(n => n.type === filter)

  return (
    <>
      {/* Drape — coming soon overlay */}
      <div
        className="fixed inset-0 z-20 flex flex-col items-center justify-center select-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.82) 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          pointerEvents: 'all',
          cursor: 'default',
          top: 64,
        }}
      >
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div
              className="absolute inset-0 rounded-full opacity-20 animate-ping"
              style={{ background: '#E8FF47', animationDuration: '2s' }}
            />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#E8FF47' }} />
          </div>
          <p className="font-syne font-bold text-xl text-text-primary">
            Something&apos;s taking shape.
          </p>
          <p className="font-mono text-xs text-text-tertiary max-w-xs leading-relaxed">
            My world is being built. Come back soon. There is a lot in here.
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
            {['Thoughts', 'Projects', 'Papers', 'Wonders'].map((label) => (
              <span
                key={label}
                className="font-mono text-[10px] px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid #222220', color: '#444440' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 pb-32 brainbox-grid min-h-screen space-y-3">
        {/* Entry sphere placeholder */}
        <div className="flex flex-col items-center py-10">
          <div
            className="w-16 h-16 rounded-full animate-pulse"
            style={{ border: '1px solid #E8FF47' }}
          />
          <p className="font-syne text-sm mt-4" style={{ color: '#888884' }}>
            Welcome to my world.
          </p>
        </div>

        {visible.map((node, i) => {
          const color = NODE_COLORS[node.type]
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              onClick={() => setOpenNode(node)}
              className="flex items-start gap-4 p-4 rounded-xl cursor-pointer"
              style={{ background: '#111111', border: '0.5px solid #222220' }}
            >
              <div className="flex items-center justify-center mt-1" style={{ width: 40 }}>
                <NodeIcon type={node.type} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full mb-1.5"
                  style={{ background: color + '22', color }}
                >
                  {node.type}
                </span>
                <p className="font-syne text-sm font-bold text-text-primary leading-snug mb-1">
                  {node.title}
                </p>
                {node.summary && (
                  <p className="font-dm-sans text-[12px] text-text-secondary line-clamp-2">
                    {node.summary}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <FilterStrip active={filter} counts={counts} onChange={setFilter} />

      <AnimatePresence>
        {openNode && openNode.type === 'thought' && (
          <ThoughtRealm key={openNode.id} node={openNode} onClose={() => setOpenNode(null)} />
        )}
        {openNode && openNode.type === 'project' && (
          <ProjectRealm key={openNode.id} node={openNode} onClose={() => setOpenNode(null)} />
        )}
        {openNode && openNode.type === 'paper' && (
          <PaperRealm key={openNode.id} node={openNode} onClose={() => setOpenNode(null)} />
        )}
        {openNode && openNode.type === 'wonder' && (
          <WonderRealm key={openNode.id} node={openNode} onClose={() => setOpenNode(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
