'use client'

import { motion } from 'framer-motion'
import type { Asset, Vision } from '@/lib/types/forge'

const CLASS_COLOR: Record<string, string> = { A: '#E8FF47', B: '#EF9F27', C: '#444440' }
const RETURN_COLORS: Record<string, string> = { revenue: '#A3C4B4', impact: '#534AB7', brand: '#E8FF47', strategic: '#993C1D' }

const CLASS_TARGETS = {
  A: { min: 80, max: 90, label: '80–90%' },
  B: { min: 10, max: 15, label: '10–15%' },
  C: { min: 0,  max: 0,  label: '0%' },
}

interface Props {
  assets: Asset[]
  visions: Vision[]
  onBack: () => void
  isMobile: boolean
}

export default function RebalanceView({ assets, visions, onBack, isMobile }: Props) {
  const total = assets.reduce((s, a) => s + a.allocation, 0)
  const classA = assets.filter(a => a.assetClass === 'A').reduce((s, a) => s + a.allocation, 0)
  const classB = assets.filter(a => a.assetClass === 'B').reduce((s, a) => s + a.allocation, 0)
  const classC = 0

  const pctA = total > 0 ? Math.round((classA / total) * 100) : 0
  const pctB = total > 0 ? Math.round((classB / total) * 100) : 0
  const pctC = 0

  function classSignal(pct: number, cls: 'A' | 'B' | 'C'): { symbol: string; color: string } {
    const t = CLASS_TARGETS[cls]
    if (cls === 'C') return { symbol: '✓', color: '#22c55e' }
    if (pct >= t.min && pct <= t.max) return { symbol: '✓', color: '#22c55e' }
    if (Math.abs(pct - t.min) <= 5 || Math.abs(pct - t.max) <= 5) return { symbol: '⚠', color: '#EF9F27' }
    return { symbol: '✗', color: '#ef4444' }
  }

  const signalA = classSignal(pctA, 'A')
  const signalB = classSignal(pctB, 'B')

  // Return type factor exposure — weighted by allocation
  const returnExposure: Record<string, number> = { revenue: 0, impact: 0, brand: 0, strategic: 0 }
  for (const asset of assets) {
    for (const rt of asset.returnTypes) {
      returnExposure[rt] = (returnExposure[rt] ?? 0) + asset.allocation
    }
  }
  const maxExposure = Math.max(...Object.values(returnExposure), 1)

  // Vision coverage analysis
  const sortedVisions = [...visions].sort((a, b) => b.gameWeight - a.gameWeight)

  function capitalForVision(visionId: string): number {
    return assets.filter(a => a.visionIds.includes(visionId)).reduce((s, a) => s + a.allocation, 0)
  }

  function coverageSignal(capital: number): { label: string; color: string } {
    if (capital >= 40) return { label: 'Strong', color: '#22c55e' }
    if (capital >= 20) return { label: 'Moderate', color: '#EF9F27' }
    return { label: 'Weak', color: '#ef4444' }
  }

  // Priority actions from Class A assets
  const priorityActions = assets
    .filter(a => a.assetClass === 'A')
    .sort((a, b) => b.allocation - a.allocation)
    .flatMap(a => a.actions.filter(x => !x.done).map(x => ({ text: x.text, assetName: a.name, assetId: a.id, color: CLASS_COLOR.A })))
    .slice(0, 8)

  const pad = isMobile ? '14px 16px' : '20px 24px'

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: pad }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22, padding: 0 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#E8FF47' }}>←</span>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#444440' }}>back to ledger</span>
        </button>

        {/* IPS */}
        <div style={{ borderLeft: '3px solid #A3C4B4', paddingLeft: 14, marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 6px' }}>
            Investment Policy Statement
          </p>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#555550', lineHeight: 1.65, margin: 0 }}>
            Deploy capital toward highest-conviction assets that serve active visions and uphold the floor. Maintain Class A concentration &gt; 80%. Review all positions every 30 days. No asset holds without a vision connection.
          </p>
        </div>

        {/* Class allocation vs targets */}
        <Block label="Class Allocation vs Target Bands">
          {([['A', classA, pctA, signalA], ['B', classB, pctB, signalB]] as [string, number, number, { symbol: string; color: string }][]).map(([cls, units, pct, sig], i) => (
            <div key={cls} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: CLASS_COLOR[cls as 'A' | 'B'] }}>CLASS {cls}</span>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330' }}>{units}u  {pct}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330' }}>TARGET {CLASS_TARGETS[cls as 'A' | 'B' | 'C'].label}</span>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: sig.color }}>{sig.symbol}</span>
                </div>
              </div>
              <div style={{ height: 4, background: '#1A1A1A', borderRadius: 2 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.65, ease: 'easeOut', delay: i * 0.08 }}
                  style={{ height: '100%', background: CLASS_COLOR[cls as 'A' | 'B'], borderRadius: 2, opacity: 0.75 }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '0.5px solid #111111' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#222220' }}>TOTAL: {total}u / 100u</span>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#222220' }}>A: {classA}u · B: {classB}u</span>
          </div>
        </Block>

        {/* Return type factor exposure */}
        <Block label="Return Type Factor Exposure">
          {(Object.entries(returnExposure) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([rt, units]) => (
            <div key={rt} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: RETURN_COLORS[rt] }}>{rt}</span>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330' }}>{units}u weighted</span>
              </div>
              <div style={{ height: 3, background: '#1A1A1A', borderRadius: 1 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(units / maxExposure) * 100}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ height: '100%', background: RETURN_COLORS[rt], borderRadius: 1, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </Block>

        {/* Vision coverage */}
        <Block label="Vision Coverage Analysis">
          {sortedVisions.map((vision, i) => {
            const capital = capitalForVision(vision.id)
            const sig = coverageSignal(capital)
            const serving = assets.filter(a => a.visionIds.includes(vision.id))
            const isHighest = i === 0
            return (
              <div key={vision.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontSize: 11, fontWeight: 600, color: '#C0C0B8' }}>{vision.title} ({vision.gameWeight}%)</span>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: sig.color }}>{sig.label}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', margin: '0 0 4px' }}>
                  {serving.length > 0
                    ? `Assets: ${serving.map(a => `${a.name} (${a.allocation}u)`).join(' · ')}`
                    : 'No assets connected'}
                  {' '} · Total capital: {capital}u
                </p>
                <div style={{ height: 3, background: '#1A1A1A', borderRadius: 1, marginBottom: 4 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(capital, 100)}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                    style={{ height: '100%', background: sig.color, borderRadius: 1, opacity: 0.6 }} />
                </div>
                {isHighest && capital < 40 && (
                  <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7.5, color: '#EF9F27', margin: 0 }}>
                    ⚠ Highest game weight but lowest capital coverage.
                  </p>
                )}
              </div>
            )
          })}
        </Block>

        {/* Priority actions */}
        {priorityActions.length > 0 && (
          <Block label="Top Priority Actions (Class A)">
            {priorityActions.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: a.color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#888884', margin: 0, lineHeight: 1.5 }}>{a.text}</p>
                  <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#333330', margin: '1px 0 0' }}>{a.assetName}</p>
                </div>
              </div>
            ))}
          </Block>
        )}
      </div>
    </div>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '14px 16px', marginBottom: 14 }}>
      <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 12px' }}>{label}</p>
      {children}
    </div>
  )
}
