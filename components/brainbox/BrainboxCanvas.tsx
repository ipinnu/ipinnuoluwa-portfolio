'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import type { BrainboxNode } from '@/lib/types/brainbox'
import { RING_RADIUS } from '@/lib/types/brainbox'
import type { NodeType } from '@/lib/types/brainbox'
import OrbitNode from './OrbitNode'
import FilterStrip from './FilterStrip'
import Breadcrumb from './Breadcrumb'
import ThoughtRealm from './realms/ThoughtRealm'
import ProjectRealm from './realms/ProjectRealm'
import PaperRealm from './realms/PaperRealm'
import WonderRealm from './realms/WonderRealm'

type Filter = 'all' | NodeType

interface BrainboxCanvasProps {
  nodes: BrainboxNode[]
}

const ORBIT_DURATIONS: Record<1 | 2 | 3, number> = { 1: 18, 2: 28, 3: 42 }

export default function BrainboxCanvas({ nodes }: BrainboxCanvasProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [openNode, setOpenNode] = useState<BrainboxNode | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<{ label: string }[]>([{ label: 'My World' }])

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return
    isDragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    setPan({
      x: dragStart.current.panX + e.clientX - dragStart.current.x,
      y: dragStart.current.panY + e.clientY - dragStart.current.y,
    })
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  const handleOpenNode = useCallback((node: BrainboxNode) => {
    setOpenNode(node)
    setBreadcrumb([
      { label: 'My World' },
      { label: node.type.charAt(0).toUpperCase() + node.type.slice(1) + 's' },
      { label: node.title.length > 20 ? node.title.slice(0, 20) + '…' : node.title },
    ])
  }, [])

  const handleClose = useCallback(() => {
    setOpenNode(null)
    setBreadcrumb([{ label: 'My World' }])
  }, [])

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleClose])

  // Node counts per type
  const counts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        trail={breadcrumb.map((crumb, i) => ({
          label: crumb.label,
          onClick: i === 0 ? handleClose : () => {},
        }))}
      />

      {/* Node count badge */}
      <div
        className="fixed z-10 font-mono text-[11px] text-text-tertiary"
        style={{ top: 80, right: 24 }}
      >
        {nodes.length} nodes
      </div>

      {/* Canvas */}
      <div
        className="relative overflow-hidden brainbox-grid"
        style={{ height: 'calc(100vh - 64px)', cursor: isDragging.current ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Panning container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Orbit nodes */}
          {nodes.map((node, i) => {
            const baseDuration = ORBIT_DURATIONS[node.orbit_ring]
            const duration = baseDuration / node.orbit_speed
            const radius = RING_RADIUS[node.orbit_ring]
            // Negative delay to start at orbit_angle
            const delay = -(node.orbit_angle / 360) * duration

            return (
              <div
                key={node.id}
                className="orbit-arm"
                data-node
                style={{
                  '--orbit-duration': `${duration}s`,
                  '--orbit-radius': `${radius}px`,
                  animationDelay: `${delay}s`,
                } as React.CSSProperties}
              >
                <div
                  className="orbit-node-inner"
                  style={{
                    '--orbit-duration': `${duration}s`,
                    '--orbit-radius': `${radius}px`,
                    animationDelay: `${delay}s`,
                  } as React.CSSProperties}
                >
                  <OrbitNode
                    node={node}
                    isFiltered={filter !== 'all' && node.type !== filter}
                    onOpen={handleOpenNode}
                    animIndex={i}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Drape — coming soon overlay */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.82) 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          pointerEvents: 'all',
          cursor: 'default',
        }}
      >
        <div className="flex flex-col items-center gap-4 text-center px-6">
          {/* Pulsing dot */}
          <div className="relative flex items-center justify-center w-10 h-10">
            <div
              className="absolute inset-0 rounded-full opacity-20 animate-ping"
              style={{ background: '#E8FF47', animationDuration: '2s' }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: '#E8FF47' }}
            />
          </div>

          <p className="font-syne font-bold text-xl text-text-primary">
            Something&apos;s taking shape.
          </p>
          <p className="font-mono text-xs text-text-tertiary max-w-xs leading-relaxed">
            My world is being built. Come back soon. There is a lot in here.
          </p>

          {/* Teaser tags */}
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

          {/* Private blog shortcut */}
          <Link
            href="/blog"
            className="font-mono text-[10px] text-text-tertiary hover:text-accent transition-colors mt-4"
            style={{ opacity: 0.35 }}
          >
            ✦ blog
          </Link>
        </div>
      </div>

      {/* Filter strip */}
      <FilterStrip active={filter} counts={counts} onChange={setFilter} />

      {/* Realm overlays */}
      <AnimatePresence>
        {openNode && openNode.type === 'thought' && (
          <ThoughtRealm key={openNode.id} node={openNode} onClose={handleClose} />
        )}
        {openNode && openNode.type === 'project' && (
          <ProjectRealm key={openNode.id} node={openNode} onClose={handleClose} />
        )}
        {openNode && openNode.type === 'paper' && (
          <PaperRealm key={openNode.id} node={openNode} onClose={handleClose} />
        )}
        {openNode && openNode.type === 'wonder' && (
          <WonderRealm key={openNode.id} node={openNode} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  )
}
