'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Asset, Vision } from '@/lib/types/forge'

const CLASS_COLOR: Record<string, string> = { A: '#E8FF47', B: '#EF9F27', C: '#444440' }
const VISION_RANK_COLOR = ['#E8FF47', '#A3C4B4', '#534AB7']

interface Props {
  assets: Asset[]
  visions: Vision[]
  onSelectAsset: (asset: Asset) => void
  onSelectVision: (vision: Vision) => void
  isMobile: boolean
}

interface NodePos { id: string; x: number; y: number }

export default function TensileMap({ assets, visions, onSelectAsset, onSelectVision, isMobile }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [drawn, setDrawn] = useState(false)

  const W = isMobile ? 340 : 600
  const H = isMobile ? 220 : 280

  const GAME_Y   = 22
  const VISION_Y = isMobile ? 80 : 95
  const ASSET_Y  = isMobile ? 155 : 188
  const FLOOR_Y  = isMobile ? 198 : 242

  // Sort visions by game_weight desc (rank 1 = heaviest)
  const sortedVisions = [...visions].sort((a, b) => b.gameWeight - a.gameWeight)

  // Position visions evenly
  const visionPos: NodePos[] = sortedVisions.map((v, i) => ({
    id: v.id,
    x: W * 0.15 + (i * (W * 0.7)) / Math.max(sortedVisions.length - 1, 1),
    y: VISION_Y,
  }))

  // Position assets evenly, split active/forming above floor, C near floor
  const activeAssets = assets.filter(a => a.assetClass !== 'C')
  const assetPos: NodePos[] = activeAssets.map((a, i) => ({
    id: a.id,
    x: W * 0.08 + (i * (W * 0.84)) / Math.max(activeAssets.length - 1, 1),
    y: ASSET_Y,
  }))

  const gameX = W / 2

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 100)
    return () => clearTimeout(t)
  }, [])

  function getVisionPos(visionId: string): { x: number; y: number } | null {
    const idx = sortedVisions.findIndex(v => v.id === visionId)
    return visionPos[idx] ?? null
  }

  function getAssetPos(assetId: string): { x: number; y: number } | null {
    const idx = activeAssets.findIndex(a => a.id === assetId)
    return assetPos[idx] ?? null
  }

  function isHighlighted(id: string): boolean {
    if (!hovered) return true
    if (hovered === id) return true
    // If hovering an asset, highlight its visions too
    const asset = assets.find(a => a.id === hovered)
    if (asset && asset.visionIds.includes(id)) return true
    // If hovering a vision, highlight its assets
    const vision = visions.find(v => v.id === hovered)
    if (vision) {
      const a = assets.find(a => a.id === id)
      if (a && a.visionIds.includes(hovered)) return true
    }
    return false
  }

  function isLineHighlighted(assetId: string, visionId: string): boolean {
    if (!hovered) return true
    return hovered === assetId || hovered === visionId
  }

  function lineLength(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  const totalWeight = sortedVisions.reduce((s, v) => s + v.gameWeight, 0)
  const dominantVision = sortedVisions[0]

  return (
    <div style={{ overflowX: isMobile ? 'auto' : 'hidden', paddingBottom: 4 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{ display: 'block', minWidth: W }}
      >
        {/* Floor line */}
        <line x1={W * 0.04} y1={FLOOR_Y} x2={W * 0.96} y2={FLOOR_Y} stroke="#E8FF47" strokeWidth="2" opacity="0.35" />
        <text x={W / 2} y={FLOOR_Y + 11} textAnchor="middle" fontFamily="var(--font-jetbrains-mono)" fontSize={isMobile ? 7 : 8} fill="#333330" letterSpacing="0.14em">
          THE FLOOR · PEACE · SOVEREIGNTY
        </text>

        {/* Asset → Vision connection lines */}
        {activeAssets.map(asset => {
          const ap = getAssetPos(asset.id)
          if (!ap) return null
          return asset.visionIds.map(vId => {
            const vp = getVisionPos(vId)
            if (!vp) return null
            const len = lineLength(ap.x, ap.y, vp.x, vp.y)
            const highlighted = isLineHighlighted(asset.id, vId)
            return (
              <motion.line
                key={`${asset.id}-${vId}`}
                x1={ap.x} y1={ap.y} x2={vp.x} y2={vp.y}
                stroke={highlighted ? CLASS_COLOR[asset.assetClass] : '#1A1A24'}
                strokeWidth={highlighted ? 1.2 : 0.8}
                opacity={hovered ? (highlighted ? 0.7 : 0.08) : 0.3}
                strokeDasharray={len}
                initial={{ strokeDashoffset: len }}
                animate={{ strokeDashoffset: drawn ? 0 : len }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                style={{ transition: 'opacity 0.2s, stroke 0.2s' }}
              />
            )
          })
        })}

        {/* Vision → Game lines */}
        {sortedVisions.map((v, i) => {
          const vp = visionPos[i]
          const len = lineLength(vp.x, vp.y, gameX, GAME_Y)
          const highlighted = isHighlighted(v.id)
          return (
            <motion.line
              key={`game-${v.id}`}
              x1={vp.x} y1={vp.y} x2={gameX} y2={GAME_Y}
              stroke={highlighted ? VISION_RANK_COLOR[i] : '#1A1A24'}
              strokeWidth={highlighted ? 1 : 0.7}
              opacity={hovered ? (highlighted ? 0.5 : 0.06) : 0.2}
              strokeDasharray={len}
              initial={{ strokeDashoffset: len }}
              animate={{ strokeDashoffset: drawn ? 0 : len }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.06 }}
              style={{ transition: 'opacity 0.2s, stroke 0.2s' }}
            />
          )
        })}

        {/* Vision nodes */}
        {sortedVisions.map((v, i) => {
          const pos = visionPos[i]
          const r = isMobile ? Math.max(10, v.gameWeight / 5) : Math.max(14, v.gameWeight / 3.5)
          const color = VISION_RANK_COLOR[i]
          const dim = !isHighlighted(v.id)
          return (
            <g
              key={v.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectVision(v)}
            >
              <circle cx={pos.x} cy={pos.y} r={r} fill={`${color}18`} stroke={color} strokeWidth="1" opacity={dim ? 0.2 : 0.85} />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-jetbrains-mono)" fontSize={isMobile ? 7 : 8} fill={color} opacity={dim ? 0.2 : 0.9}>
                {v.gameWeight}%
              </text>
              {!isMobile && (
                <text x={pos.x} y={pos.y + r + 11} textAnchor="middle" fontFamily="var(--font-jetbrains-mono)" fontSize={7} fill={dim ? '#222220' : '#666660'} letterSpacing="0.06em">
                  {v.title.toUpperCase().slice(0, 12)}
                </text>
              )}
            </g>
          )
        })}

        {/* Asset nodes */}
        {activeAssets.map(asset => {
          const pos = getAssetPos(asset.id)
          if (!pos) return null
          const color = CLASS_COLOR[asset.assetClass]
          const dim = !isHighlighted(asset.id)
          const size = asset.assetClass === 'A' ? (isMobile ? 8 : 10) : (isMobile ? 6 : 8)
          const r = asset.assetClass === 'B' ? 2 : 1
          return (
            <g
              key={asset.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(asset.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectAsset(asset)}
            >
              <rect
                x={pos.x - size} y={pos.y - size}
                width={size * 2} height={size * 2}
                rx={r} ry={r}
                fill={`${color}20`} stroke={color} strokeWidth="1"
                opacity={dim ? 0.15 : 0.85}
              />
              {!isMobile && (
                <text x={pos.x} y={pos.y + size + 10} textAnchor="middle" fontFamily="var(--font-jetbrains-mono)" fontSize={6.5} fill={dim ? '#1A1A1A' : '#555550'}>
                  {asset.name.split(' ')[0].slice(0, 8)}
                </text>
              )}
            </g>
          )
        })}

        {/* THE GAME — top node */}
        <g style={{ cursor: 'default' }}>
          <motion.circle
            cx={gameX} cy={GAME_Y} r={isMobile ? 8 : 10}
            fill="#E8FF4712" stroke="#E8FF47" strokeWidth="1"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <text x={gameX} y={GAME_Y + 1} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-jetbrains-mono)" fontSize={isMobile ? 5.5 : 6.5} fill="#E8FF47" letterSpacing="0.1em">
            {dominantVision ? dominantVision.title.toUpperCase().slice(0, 8) : 'THE GAME'}
          </text>
        </g>

        {/* Floating assets warning — shown below floor line */}
        {assets.filter(a => a.visionIds.length === 0 && a.assetClass !== 'C').length > 0 && (
          <text x={W / 2} y={FLOOR_Y + 24} textAnchor="middle" fontFamily="var(--font-jetbrains-mono)" fontSize={7} fill="#ef4444" opacity="0.6">
            {assets.filter(a => a.visionIds.length === 0 && a.assetClass !== 'C').length} floating assets — no vision connection
          </text>
        )}

        {/* Weight warning */}
        {Math.abs(totalWeight - 100) > 1 && (
          <text x={W - 8} y={12} textAnchor="end" fontFamily="var(--font-jetbrains-mono)" fontSize={7} fill="#EF9F27">
            ⚠ weights sum to {totalWeight}%
          </text>
        )}
      </svg>
    </div>
  )
}
