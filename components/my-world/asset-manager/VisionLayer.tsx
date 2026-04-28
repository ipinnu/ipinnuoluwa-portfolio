'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Asset, Vision } from '@/lib/types/forge'
import TensileMap from './TensileMap'

const RANK_COLOR = ['#E8FF47', '#A3C4B4', '#534AB7']
const STATUS_DOT: Record<string, string> = {
  active:   '#22c55e',
  forming:  '#EF9F27',
  realized: '#A3C4B4',
  paused:   '#444440',
}

interface Props {
  visions: Vision[]
  assets: Asset[]
  onSelectAsset: (asset: Asset) => void
  isMobile: boolean
}

export default function VisionLayer({ visions, assets, onSelectAsset, isMobile }: Props) {
  const [expanded, setExpanded] = useState(!isMobile)
  const [editingVision, setEditingVision] = useState<string | null>(null)

  const sorted = [...visions].sort((a, b) => b.gameWeight - a.gameWeight)
  const totalWeight = visions.reduce((s, v) => s + v.gameWeight, 0)

  function assetsForVision(visionId: string): Asset[] {
    return assets.filter(a => a.visionIds.includes(visionId))
  }

  return (
    <div style={{ borderBottom: '0.5px solid #111111', backgroundColor: '#06060E' }}>

      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: isMobile ? '8px 14px' : '8px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', textTransform: 'uppercase', letterSpacing: '0.18em', flexShrink: 0 }}>
          Visions
        </span>
        {!expanded && (
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {sorted.map(v => `${v.title} (${v.gameWeight}%)`).join(' · ')}
          </span>
        )}
        {Math.abs(totalWeight - 100) > 1 && (
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#EF9F27', flexShrink: 0 }}>
            ⚠ {totalWeight}%
          </span>
        )}
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330', marginLeft: 'auto', flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▾
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {/* Vision cards — horizontal scroll on mobile */}
            <div style={{
              display: 'flex',
              gap: 10,
              padding: isMobile ? '8px 14px 10px' : '10px 24px 12px',
              overflowX: isMobile ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            }}>
              {sorted.map((vision, i) => {
                const connected = assetsForVision(vision.id)
                const color = RANK_COLOR[i] ?? '#444440'
                return (
                  <motion.div
                    key={vision.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
                    style={{
                      flexShrink: 0,
                      width: isMobile ? 220 : undefined,
                      flex: isMobile ? undefined : 1,
                      background: '#0D0D0D',
                      border: '0.5px solid #111111',
                      borderLeft: `3px solid ${color}`,
                      borderRadius: 6,
                      padding: '12px 14px',
                      minWidth: isMobile ? undefined : 160,
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: color, letterSpacing: '0.1em' }}>
                        {vision.gameWeight}%
                      </span>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: STATUS_DOT[vision.status] }} />
                    </div>

                    <p style={{ fontFamily: 'var(--font-syne)', fontSize: isMobile ? 12 : 13, fontWeight: 700, color: '#E8E8E0', margin: '0 0 6px', lineHeight: 1.25 }}>
                      {vision.title}
                    </p>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#555550', margin: '0 0 8px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {vision.description}
                    </p>

                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, color: '#333330', margin: '0 0 6px', fontStyle: 'italic', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {vision.floorLink}
                    </p>

                    <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', margin: '0 0 8px' }}>
                      Horizon: {vision.timeHorizon}
                    </p>

                    {/* Connected assets */}
                    {connected.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {connected.map(a => (
                          <button
                            key={a.id}
                            onClick={() => onSelectAsset(a)}
                            style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: color, background: `${color}12`, border: `0.5px solid ${color}30`, borderRadius: 2, padding: '2px 6px', cursor: 'pointer' }}
                          >
                            {a.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Tensile map */}
            <div style={{ padding: isMobile ? '0 0 10px' : '0 24px 14px' }}>
              <TensileMap
                assets={assets}
                visions={sorted}
                onSelectAsset={onSelectAsset}
                onSelectVision={() => {}}
                isMobile={isMobile}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
