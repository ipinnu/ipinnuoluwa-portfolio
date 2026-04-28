'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Asset, AssetClass, Vision } from '@/lib/types/forge'

const CLASS_COLOR: Record<AssetClass, string> = { A: '#E8FF47', B: '#EF9F27', C: '#444440' }
const STATUS_DOT: Record<string, string> = { active: '#22c55e', forming: '#EF9F27', monitor: '#444440' }
const RETURN_COLORS: Record<string, string> = { revenue: '#A3C4B4', impact: '#534AB7', brand: '#E8FF47', strategic: '#993C1D' }
const RANK_COLOR = ['#E8FF47', '#A3C4B4', '#534AB7']

interface Props {
  assets: Asset[]
  visions: Vision[]
  selected: Asset | null
  onSelect: (asset: Asset) => void
  onCreate: () => void
  onRebalance: () => void
  onUpdateAsset: (id: string, patch: Partial<Asset>) => void
  isMobile: boolean
}

export default function AssetLedger({ assets, visions, selected, onSelect, onCreate, onRebalance, onUpdateAsset, isMobile }: Props) {
  const [classFilter, setClassFilter] = useState<AssetClass | 'ALL'>('ALL')

  const onTrack = assets.filter(a => a.mandateProgress >= 50).length
  const healthPct = Math.round((onTrack / Math.max(assets.length, 1)) * 100)
  const totalAllocated = assets.reduce((s, a) => s + a.allocation, 0)

  const sorted = [...visions].sort((a, b) => b.gameWeight - a.gameWeight)

  function visionDotsForAsset(asset: Asset) {
    return asset.visionIds.map(vid => {
      const rank = sorted.findIndex(v => v.id === vid)
      return { vid, color: RANK_COLOR[rank] ?? '#444440', title: visions.find(v => v.id === vid)?.title ?? vid }
    })
  }

  const filtered = assets.filter(a => classFilter === 'ALL' || a.assetClass === classFilter)
  const drafts   = filtered.filter(a => a.assetClass !== 'C')
  const monitors = filtered.filter(a => a.assetClass === 'C')
  const floating = assets.filter(a => a.visionIds.length === 0 && a.assetClass !== 'C')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: isMobile ? '14px 14px 10px' : '18px 20px 12px', borderBottom: '0.5px solid #111111', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', textTransform: 'uppercase', letterSpacing: '0.18em', margin: 0 }}>Asset Ledger</p>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#222220', margin: '2px 0 0' }}>CIO: Ipinnuoluwa</p>
          </div>
          <button
            onClick={onRebalance}
            style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', background: 'none', border: '0.5px solid #222220', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
          >
            Rebalance ↻
          </button>
        </div>

        {/* Portfolio health */}
        <div style={{ padding: '8px 10px', background: '#0A0A0A', borderRadius: 5, border: '0.5px solid #111111', marginBottom: 10 }}>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#282820', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Portfolio Health</p>
          <div style={{ height: 2, background: '#1A1A1A', borderRadius: 1, marginBottom: 3 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: healthPct >= 60 ? '#22c55e' : '#EF9F27', borderRadius: 1 }}
            />
          </div>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#282820', margin: 0 }}>
            {onTrack}/{assets.length} on track · {totalAllocated}u deployed
          </p>
        </div>

        {/* Class filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['ALL', 'A', 'B', 'C'] as const).map(cls => (
            <button
              key={cls}
              onClick={() => setClassFilter(cls)}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, padding: '3px 8px', borderRadius: 3, cursor: 'pointer',
                background: classFilter === cls ? (cls === 'ALL' ? '#E8FF47' : CLASS_COLOR[cls as AssetClass]) : 'transparent',
                color: classFilter === cls ? '#0A0A0A' : '#444440',
                border: `0.5px solid ${classFilter === cls ? 'transparent' : '#1A1A1A'}`,
              }}
            >
              {cls === 'ALL' ? 'ALL' : `${cls}`}
            </button>
          ))}
        </div>
      </div>

      {/* New asset button */}
      <div style={{ padding: '8px 10px 4px', flexShrink: 0 }}>
        <button
          onClick={onCreate}
          style={{ width: '100%', padding: '6px', background: 'rgba(232,255,71,0.04)', border: '0.5px solid rgba(232,255,71,0.15)', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#E8FF47', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <span style={{ fontSize: 12, lineHeight: 1 }}>+</span> New Asset
        </button>
      </div>

      {/* Asset rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Pressured banner */}
        {floating.length > 0 && (
          <div style={{ padding: '6px 14px', background: '#1a0e00', borderBottom: '0.5px solid #EF9F27', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#EF9F27' }}>
              ⚠ {floating.length} asset{floating.length > 1 ? 's' : ''} have no vision connection
            </span>
          </div>
        )}

        {drafts.map(asset => (
          <AssetRow
            key={asset.id}
            asset={asset}
            selected={selected?.id === asset.id}
            visionDots={visionDotsForAsset(asset)}
            onSelect={() => onSelect(asset)}
            isMobile={isMobile}
          />
        ))}

        {monitors.length > 0 && (
          <>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#1E1E1C', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '10px 14px 4px', margin: 0 }}>
              Monitor Universe
            </p>
            {monitors.map(asset => (
              <AssetRow
                key={asset.id}
                asset={asset}
                selected={selected?.id === asset.id}
                visionDots={visionDotsForAsset(asset)}
                onSelect={() => onSelect(asset)}
                isMobile={isMobile}
              />
            ))}
          </>
        )}

        {/* Floating section */}
        {floating.length > 0 && classFilter === 'ALL' && (
          <>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#3a1a05', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '10px 14px 4px', margin: 0 }}>
              ─── Floating ───
            </p>
            {floating.map(asset => (
              <AssetRow
                key={`floating-${asset.id}`}
                asset={asset}
                selected={selected?.id === asset.id}
                visionDots={[]}
                onSelect={() => onSelect(asset)}
                isMobile={isMobile}
                floating
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────

function AssetRow({ asset, selected, visionDots, onSelect, isMobile, floating }: {
  asset: Asset
  selected: boolean
  visionDots: { vid: string; color: string; title: string }[]
  onSelect: () => void
  isMobile: boolean
  floating?: boolean
}) {
  const CLASS_COLOR: Record<string, string> = { A: '#E8FF47', B: '#EF9F27', C: '#444440' }
  const RETURN_COLORS: Record<string, string> = { revenue: '#A3C4B4', impact: '#534AB7', brand: '#E8FF47', strategic: '#993C1D' }
  const color = CLASS_COLOR[asset.assetClass]

  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%', textAlign: 'left', background: 'none', cursor: 'pointer',
        padding: isMobile ? '11px 14px' : '10px 14px',
        borderBottom: '0.5px solid #0A0A0A',
        borderLeft: selected ? `2px solid ${color}` : `2px solid ${floating ? '#3a1a05' : 'transparent'}`,
        backgroundColor: selected ? '#0D0D0D' : 'transparent',
        transition: 'background-color 0.12s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: asset.status === 'active' ? '#22c55e' : asset.status === 'forming' ? '#EF9F27' : '#444440', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-syne)', fontSize: isMobile ? 12 : 11, fontWeight: 700, color: selected ? '#F5F5F0' : '#C0C0B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {asset.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          {/* Vision dots */}
          {visionDots.map(dot => (
            <div key={dot.vid} title={dot.title} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: dot.color, opacity: 0.7 }} />
          ))}
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: color, background: `${color}1A`, border: `0.5px solid ${color}33`, padding: '1px 5px', borderRadius: 2 }}>
            {asset.assetClass}
          </span>
        </div>
      </div>

      {/* Return type pills */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: asset.assetClass !== 'C' ? 5 : 0 }}>
        {asset.returnTypes.map(rt => (
          <span key={rt} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: `${RETURN_COLORS[rt]}88`, border: `0.5px solid ${RETURN_COLORS[rt]}22`, padding: '1px 4px', borderRadius: 2 }}>
            {rt}
          </span>
        ))}
      </div>

      {/* Mandate bar */}
      {asset.assetClass !== 'C' && (
        <div>
          <div style={{ height: 1.5, background: '#1A1A1A', borderRadius: 1 }}>
            <div style={{ height: '100%', width: `${asset.mandateProgress}%`, background: color, borderRadius: 1, opacity: 0.55 }} />
          </div>
        </div>
      )}

      {/* Exit condition indicator */}
      {!asset.exitCondition && asset.assetClass !== 'C' && (
        <div style={{ marginTop: 3 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#3a1a05' }}>no exit defined</span>
        </div>
      )}
    </button>
  )
}
