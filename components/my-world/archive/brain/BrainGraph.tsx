'use client'

import { useEffect, useRef, useState } from 'react'
import type { ArchiveNote, ArchiveCategory, ArchiveConnection } from '@/lib/types/archive'

interface SimNode {
  id:         string
  title:      string
  categoryId: string | null
  aiCluster:  string | null
  connCount:  number
  x:          number
  y:          number
  vx:         number
  vy:         number
  fx?:        number | null
  fy?:        number | null
}

interface SimLink {
  source:    string | SimNode
  target:    string | SimNode
  type:      'explicit' | 'keyword' | 'semantic'
  confirmed: boolean
  strength:  number
}

interface Props {
  notes:       ArchiveNote[]
  categories:  ArchiveCategory[]
  connections: ArchiveConnection[]
  analyzing:   boolean
  onOpenNote:  (note: ArchiveNote) => void
}

export default function BrainGraph({ notes, categories, connections, analyzing, onOpenNote }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [nodes, setNodes] = useState<SimNode[]>([])
  const [links, setLinks] = useState<SimLink[]>([])
  const [hovered, setHovered] = useState<string | null>(null)
  const [pan,  setPan]  = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null)
  const rafRef   = useRef<number | null>(null)

  // Observe size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const e = entries[0]
      setDims({ w: e.contentRect.width, h: e.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Build custom force simulation
  useEffect(() => {
    if (notes.length === 0) { setNodes([]); setLinks([]); return }
    const { w, h } = dims

    const connCount: Record<string, number> = {}
    connections.forEach(c => {
      connCount[c.noteA] = (connCount[c.noteA] ?? 0) + 1
      connCount[c.noteB] = (connCount[c.noteB] ?? 0) + 1
    })

    const sNodes: SimNode[] = notes.map((n, i) => ({
      id: n.id, title: n.title, categoryId: n.categoryId,
      aiCluster: n.aiCluster, connCount: connCount[n.id] ?? 0,
      x: w / 2 + (Math.random() - 0.5) * 200,
      y: h / 2 + (Math.random() - 0.5) * 200,
      vx: 0, vy: 0,
    }))

    const nodeById = Object.fromEntries(sNodes.map(n => [n.id, n]))

    const sLinks: SimLink[] = connections
      .filter(c => nodeById[c.noteA] && nodeById[c.noteB])
      .map(c => ({ source: c.noteA, target: c.noteB, type: c.type, confirmed: c.confirmed, strength: c.strength }))

    const ALPHA = 0.3
    const DECAY = 0.028
    let alpha = ALPHA

    function tick() {
      if (alpha < 0.001) return

      // Resolve link source/target to node refs
      const resolvedLinks = sLinks.map(l => ({
        src: nodeById[typeof l.source === 'string' ? l.source : (l.source as SimNode).id],
        tgt: nodeById[typeof l.target === 'string' ? l.target : (l.target as SimNode).id],
        ...l,
      })).filter(l => l.src && l.tgt)

      // Link force
      for (const l of resolvedLinks) {
        const { src, tgt } = l
        const dist = 80 + (1 - l.strength) * 80
        const dx = tgt.x - src.x
        const dy = tgt.y - src.y
        const d  = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (d - dist) / d * alpha * 0.5
        src.vx += dx * force; src.vy += dy * force
        tgt.vx -= dx * force; tgt.vy -= dy * force
      }

      // Charge (repulsion)
      for (let i = 0; i < sNodes.length; i++) {
        for (let j = i + 1; j < sNodes.length; j++) {
          const a = sNodes[i]; const b = sNodes[j]
          const dx = b.x - a.x; const dy = b.y - a.y
          const d2 = dx * dx + dy * dy + 1
          const force = -250 / d2 * alpha
          const fx = dx / Math.sqrt(d2) * force
          const fy = dy / Math.sqrt(d2) * force
          a.vx -= fx; a.vy -= fy
          b.vx += fx; b.vy += fy
        }
      }

      // Center force
      for (const n of sNodes) {
        n.vx += (w / 2 - n.x) * 0.01 * alpha
        n.vy += (h / 2 - n.y) * 0.01 * alpha
      }

      // Integrate
      for (const n of sNodes) {
        n.vx *= 0.7; n.vy *= 0.7
        n.x  += n.vx; n.y  += n.vy
      }

      alpha -= alpha * DECAY
      setNodes([...sNodes])
      setLinks([...sLinks])
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [notes.length, connections.length, dims.w, dims.h])

  // Build node lookup for rendering
  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))

  // Cluster label positions
  const clusterMap: Record<string, { x: number; y: number; count: number; catId: string | null }> = {}
  nodes.forEach(n => {
    if (!n.aiCluster) return
    if (!clusterMap[n.aiCluster]) clusterMap[n.aiCluster] = { x: 0, y: 0, count: 0, catId: n.categoryId }
    clusterMap[n.aiCluster].x += n.x
    clusterMap[n.aiCluster].y += n.y
    clusterMap[n.aiCluster].count++
  })
  Object.values(clusterMap).forEach(c => { c.x /= c.count; c.y /= c.count })

  // Hovered connection set
  const hoveredIds = hovered ? new Set<string>([
    hovered,
    ...links.filter(l => {
      const sid = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
      const tid = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
      return sid === hovered || tid === hovered
    }).flatMap(l => {
      const sid = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
      const tid = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
      return [sid, tid]
    }),
  ]) : null

  // Pan/zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.min(2.5, Math.max(0.25, z - e.deltaY * 0.001)))
  }
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node')) return
    panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!panStart.current) return
    setPan({ x: panStart.current.px + e.clientX - panStart.current.x, y: panStart.current.py + e.clientY - panStart.current.y })
  }
  const onPointerUp  = () => { panStart.current = null }
  const onDblClick   = () => { setPan({ x: 0, y: 0 }); setZoom(1) }

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDblClick}
      style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'grab', userSelect: 'none' }}
    >
      {analyzing && (
        <p style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#1A3028', letterSpacing: '0.1em', zIndex: 10, pointerEvents: 'none' }}>
          Analyzing connections…
        </p>
      )}
      {nodes.filter(n => n.connCount === 0).length > 0 && (
        <p style={{ position: 'absolute', bottom: 14, left: 16, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1A3028', pointerEvents: 'none' }}>
          {nodes.filter(n => n.connCount === 0).length} note(s) with no connections yet
        </p>
      )}
      <p style={{ position: 'absolute', bottom: 14, right: 16, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#151D18', pointerEvents: 'none' }}>
        scroll to zoom · drag to pan · dbl-click to reset
      </p>

      <div style={{ position: 'absolute', inset: 0, transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: '50% 50%' }}>
        {/* SVG lines */}
        <svg width={dims.w} height={dims.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
          {links.map((l, i) => {
            const sid = typeof l.source === 'string' ? l.source : (l.source as SimNode).id
            const tid = typeof l.target === 'string' ? l.target : (l.target as SimNode).id
            const src = nodeById[sid]
            const tgt = nodeById[tid]
            if (!src || !tgt) return null
            const isH = !hoveredIds || hoveredIds.has(sid) || hoveredIds.has(tid)
            const ls  = linkStyle(l)
            return (
              <line key={i}
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={ls.stroke} strokeWidth={ls.width}
                strokeOpacity={isH ? ls.opacity : 0.06}
                strokeDasharray={l.type === 'semantic' && !l.confirmed ? '4 2' : undefined}
                style={{ transition: 'stroke-opacity 0.2s' }}
              />
            )
          })}

          {/* Cluster labels */}
          {Object.entries(clusterMap).map(([label, pos]) => {
            const cat = categories.find(c => c.id === pos.catId)
            return (
              <text key={label} x={pos.x} y={pos.y - 36} textAnchor="middle"
                fill={cat?.colorHex ?? '#444440'} fillOpacity={0.6}
                fontSize={10} fontFamily="var(--font-jetbrains-mono)"
                letterSpacing="0.15em" style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {label.toUpperCase()}
              </text>
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(n => {
          const cat    = categories.find(c => c.id === n.categoryId)
          const radius = Math.min(40, 20 + n.connCount * 2)
          const dim    = radius * 2
          const isH    = !hoveredIds || hoveredIds.has(n.id)
          const alone  = n.connCount === 0

          return (
            <div key={n.id} className="graph-node"
              onClick={() => onOpenNote({
                id: n.id, title: n.title, content: '', categoryId: n.categoryId,
                typeId: null, topic: null, tags: [], connections: [],
                aiCluster: n.aiCluster, aiFootnotes: [], wordCount: 0,
                status: 'active', createdAt: '', updatedAt: '',
              })}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute', left: n.x - radius, top: n.y - radius,
                width: dim, height: dim, borderRadius: '50%', cursor: 'pointer',
                background: cat ? `rgba(${cat.colorRgb},0.1)` : 'rgba(29,158,117,0.08)',
                border:     `0.5px solid ${cat ? `rgba(${cat.colorRgb},0.3)` : 'rgba(29,158,117,0.2)'}`,
                boxShadow:  cat ? `inset 0 1px 0 rgba(${cat.colorRgb},0.2), 0 0 16px rgba(${cat.colorRgb},0.06)` : undefined,
                filter:     hoveredIds?.has(n.id) ? 'url(#liquid-glass)' : 'url(#liquid-glass-soft)',
                opacity:    alone ? 0.45 : (isH ? 1 : 0.12),
                transition: 'opacity 0.2s, filter 0.2s',
                display:    'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: Math.max(8, Math.min(11, radius * 0.35)),
                color: cat ? cat.colorHex : '#1D9E75', textAlign: 'center',
                padding: '0 4px', lineHeight: 1.2, overflow: 'hidden',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                maxWidth: dim - 8,
              }}>
                {n.title || 'Untitled'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function linkStyle(l: SimLink): { stroke: string; width: number; opacity: number } {
  if (l.type === 'explicit') return { stroke: '#1D9E75', width: 1.5, opacity: 0.6 }
  if (l.type === 'keyword')  return { stroke: '#1D9E75', width: 1,   opacity: 0.35 }
  return { stroke: '#333330', width: 0.5, opacity: 0.2 }
}
