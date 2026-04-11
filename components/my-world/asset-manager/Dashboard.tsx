'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SEED_ASSETS } from '@/lib/types/celestial'
import type { Asset, AssetClass } from '@/lib/types/celestial'

const STORAGE_KEY = 'ip_asset_ledger'
const CLASS_COLOR: Record<AssetClass, string> = {
  A: '#E8FF47',
  B: '#EF9F27',
  C: '#444440',
}
const STATUS_DOT: Record<string, string> = {
  active: '#22c55e',
  forming: '#EF9F27',
  monitor: '#444440',
}
const RETURN_COLORS: Record<string, string> = {
  revenue: '#A3C4B4',
  impact: '#534AB7',
  brand: '#E8FF47',
  strategic: '#993C1D',
}

function loadAssets(): Asset[] {
  if (typeof window === 'undefined') return SEED_ASSETS
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : SEED_ASSETS
  } catch {
    return SEED_ASSETS
  }
}

function saveAssets(assets: Asset[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(assets)) } catch {}
}

function ScoreBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: 14, height: 4, borderRadius: 1,
          backgroundColor: i < value ? color : '#1A1A1A',
          transition: 'background-color 0.3s',
        }} />
      ))}
    </div>
  )
}

interface DashboardProps {
  onClose: () => void
}

export default function Dashboard({ onClose }: DashboardProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selected, setSelected] = useState<Asset | null>(null)
  const [classFilter, setClassFilter] = useState<AssetClass | 'ALL'>('ALL')
  const [typed, setTyped] = useState('')
  const [showRebalance, setShowRebalance] = useState(false)

  useEffect(() => {
    const loaded = loadAssets()
    setAssets(loaded)
    setSelected(loaded[0] ?? null)

    // Typewriter entry
    const msg = 'Welcome back, Ipinnu.'
    let i = 0
    const iv = setInterval(() => {
      i++
      setTyped(msg.slice(0, i))
      if (i >= msg.length) clearInterval(iv)
    }, 40)
    return () => clearInterval(iv)
  }, [])

  const updateAsset = useCallback((id: string, patch: Partial<Asset>) => {
    setAssets(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...patch } : a)
      saveAssets(next)
      if (selected?.id === id) setSelected(s => s ? { ...s, ...patch } : s)
      return next
    })
  }, [selected])

  const filteredAssets = assets.filter(a => classFilter === 'ALL' || a.assetClass === classFilter)

  const totalAllocated = assets.reduce((s, a) => s + a.allocation, 0)
  const onTrack = assets.filter(a => a.mandateProgress >= 50).length
  const healthPct = Math.round((onTrack / Math.max(assets.length, 1)) * 100)

  const selAsset = selected ? assets.find(a => a.id === selected.id) ?? selected : null
  const totalScore = selAsset
    ? Object.values(selAsset.scores).reduce((s, v) => s + v, 0)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex"
      style={{ background: 'rgba(10,10,10,0.97)', fontFamily: 'var(--font-jetbrains-mono)' }}
    >
      {/* ── Left panel — Asset Ledger ── */}
      <div style={{
        width: '40%', minWidth: 280, borderRight: '0.5px solid #1A1A1A',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
        padding: '28px 0 20px',
      }}>
        {/* Header */}
        <div style={{ padding: '0 24px 16px', borderBottom: '0.5px solid #111111' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 10, color: '#444440', textTransform: 'uppercase', letterSpacing: '0.18em', margin: 0 }}>Asset Ledger</p>
              <p style={{ fontSize: 10, color: '#333330', margin: '2px 0 0' }}>CIO: Ipinnuoluwa</p>
            </div>
            <button
              onClick={() => setShowRebalance(r => !r)}
              style={{ fontSize: 10, color: '#444440', background: 'none', border: '0.5px solid #222220', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
            >
              Rebalance ↻
            </button>
          </div>

          {/* Portfolio health */}
          <div style={{ marginTop: 14, padding: '10px 12px', background: '#0D0D0D', borderRadius: 6, border: '0.5px solid #111111' }}>
            <p style={{ fontSize: 9, color: '#333330', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Portfolio Health</p>
            <div style={{ height: 2, background: '#1A1A1A', borderRadius: 1, marginBottom: 4 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: healthPct >= 60 ? '#22c55e' : '#EF9F27', borderRadius: 1 }}
              />
            </div>
            <p style={{ fontSize: 9, color: '#333330', margin: 0 }}>
              {onTrack}/{assets.length} on track · {totalAllocated}u deployed
            </p>
          </div>
        </div>

        {/* Class filter */}
        <div style={{ display: 'flex', gap: 4, padding: '12px 24px', borderBottom: '0.5px solid #111111' }}>
          {(['ALL', 'A', 'B', 'C'] as const).map(cls => (
            <button
              key={cls}
              onClick={() => setClassFilter(cls)}
              style={{
                fontSize: 9, padding: '3px 10px', borderRadius: 3, cursor: 'pointer',
                fontFamily: 'var(--font-jetbrains-mono)',
                background: classFilter === cls ? (cls === 'ALL' ? '#E8FF47' : CLASS_COLOR[cls as AssetClass]) : 'transparent',
                color: classFilter === cls ? '#0A0A0A' : '#444440',
                border: `0.5px solid ${classFilter === cls ? 'transparent' : '#1A1A1A'}`,
                transition: 'all 0.15s',
              }}
            >
              {cls === 'ALL' ? 'ALL' : `CLASS ${cls}`}
            </button>
          ))}
        </div>

        {/* Typewriter */}
        <p style={{ fontSize: 9, color: '#222220', padding: '8px 24px 0', margin: 0, minHeight: 16 }}>
          {typed}<span style={{ opacity: typed.length > 0 ? 1 : 0 }}>_</span>
        </p>

        {/* Asset rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredAssets.map(asset => (
            <button
              key={asset.id}
              onClick={() => setSelected(asset)}
              style={{
                width: '100%', textAlign: 'left', background: 'none', cursor: 'pointer',
                padding: '12px 24px', borderBottom: '0.5px solid #0D0D0D',
                borderLeft: selAsset?.id === asset.id ? `2px solid ${CLASS_COLOR[asset.assetClass]}` : '2px solid transparent',
                backgroundColor: selAsset?.id === asset.id ? '#0D0D0D' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: STATUS_DOT[asset.status] ?? '#444440', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#F5F5F0', fontFamily: 'var(--font-syne)', fontWeight: 700 }}>{asset.name}</span>
                </div>
                <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 2,
                  background: `${CLASS_COLOR[asset.assetClass]}22`,
                  color: CLASS_COLOR[asset.assetClass],
                  border: `0.5px solid ${CLASS_COLOR[asset.assetClass]}44`,
                }}>
                  {asset.assetClass}
                </span>
              </div>

              {/* Return type pills */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                {asset.returnTypes.map(rt => (
                  <span key={rt} style={{ fontSize: 8, color: RETURN_COLORS[rt] + '99', border: `0.5px solid ${RETURN_COLORS[rt]}33`, padding: '1px 5px', borderRadius: 2 }}>
                    {rt}
                  </span>
                ))}
              </div>

              {/* Mandate bar */}
              {asset.assetClass !== 'C' && (
                <div>
                  <div style={{ height: 1.5, background: '#1A1A1A', borderRadius: 1 }}>
                    <div style={{ height: '100%', width: `${asset.mandateProgress}%`, background: CLASS_COLOR[asset.assetClass], borderRadius: 1, opacity: 0.6 }} />
                  </div>
                  <p style={{ fontSize: 8, color: '#333330', margin: '2px 0 0' }}>Mandate: {asset.mandateProgress}%</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right panel — Asset Detail ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
          <button
            onClick={onClose}
            style={{ fontSize: 10, color: '#333330', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.textContent = 'return to the universe')}
            onMouseLeave={e => (e.currentTarget.textContent = '× exit')}
          >
            × exit
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showRebalance ? (
            <RebalanceView key="rebalance" assets={assets} onBack={() => setShowRebalance(false)} />
          ) : selAsset ? (
            <motion.div
              key={selAsset.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Asset header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: CLASS_COLOR[selAsset.assetClass], textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    Class {selAsset.assetClass} Asset
                  </span>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: STATUS_DOT[selAsset.status] }} />
                  <span style={{ fontSize: 9, color: STATUS_DOT[selAsset.status], textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {selAsset.status}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 26, fontWeight: 700, color: '#F5F5F0', margin: '0 0 4px' }}>
                  {selAsset.name}
                </h2>
                <p style={{ fontSize: 9, color: '#333330', margin: 0 }}>Last reviewed: {selAsset.lastReviewed}</p>

                {/* Ghost text for Class A */}
                {selAsset.assetClass === 'A' && (
                  <div style={{ position: 'absolute', marginTop: -32, right: 32, fontSize: 60, fontFamily: 'var(--font-syne)', fontWeight: 800, color: CLASS_COLOR.A, opacity: 0.04, pointerEvents: 'none', letterSpacing: '-0.04em' }}>
                    DEPLOYED
                  </div>
                )}
              </div>

              {/* Score card — 2×2 grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                {(Object.entries(selAsset.scores) as [string, number][]).map(([key, val]) => (
                  <div key={key} style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '10px 12px' }}>
                    <p style={{ fontSize: 9, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 6px' }}>{key}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-syne)', fontSize: 20, fontWeight: 800, color: '#F5F5F0' }}>{val}</span>
                      <span style={{ fontSize: 9, color: '#333330' }}>/5</span>
                    </div>
                    <ScoreBar value={val} color={CLASS_COLOR[selAsset.assetClass]} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, color: '#444440', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total</span>
                <span style={{
                  fontFamily: 'var(--font-syne)', fontSize: 28, fontWeight: 800,
                  color: totalScore >= 16 ? '#E8FF47' : totalScore >= 11 ? '#EF9F27' : '#E24B4A',
                }}>
                  {totalScore}
                </span>
                <span style={{ fontSize: 11, color: '#333330' }}>/20</span>
              </div>

              {/* Allocation */}
              <div style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '14px 16px', marginBottom: 20 }}>
                <p style={{ fontSize: 9, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Allocation</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontSize: 32, fontWeight: 800, color: '#F5F5F0' }}>{selAsset.allocation}</span>
                  <span style={{ fontSize: 11, color: '#333330' }}>/ 100u</span>
                  <div style={{ flex: 1, height: 3, background: '#1A1A1A', borderRadius: 1 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selAsset.allocation}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{ height: '100%', background: CLASS_COLOR[selAsset.assetClass], borderRadius: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Mandate */}
              <div style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '14px 16px', marginBottom: 20 }}>
                <p style={{ fontSize: 9, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Mandate</p>
                <p style={{ fontSize: 12, color: '#888884', lineHeight: 1.6, margin: '0 0 12px', fontFamily: 'var(--font-dm-sans)' }}>
                  {selAsset.mandateText}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <input
                    type="range" min={0} max={100} value={selAsset.mandateProgress}
                    onChange={e => updateAsset(selAsset.id, { mandateProgress: Number(e.target.value) })}
                    style={{ flex: 1, accentColor: CLASS_COLOR[selAsset.assetClass] }}
                  />
                  <span style={{ fontSize: 10, color: CLASS_COLOR[selAsset.assetClass], minWidth: 32, textAlign: 'right' }}>
                    {selAsset.mandateProgress}%
                  </span>
                </div>
              </div>

              {/* Actions checklist */}
              {selAsset.actions.length > 0 && (
                <div style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '14px 16px', marginBottom: 20 }}>
                  <p style={{ fontSize: 9, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>Next Actions</p>
                  {selAsset.actions.map((action, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={action.done}
                        onChange={() => {
                          const newActions = selAsset.actions.map((a, j) => j === i ? { ...a, done: !a.done } : a)
                          updateAsset(selAsset.id, { actions: newActions })
                        }}
                        style={{ accentColor: CLASS_COLOR[selAsset.assetClass], marginTop: 2, flexShrink: 0 }}
                      />
                      <span style={{
                        fontSize: 11, color: action.done ? '#333330' : '#888884',
                        fontFamily: 'var(--font-dm-sans)',
                        textDecoration: action.done ? 'line-through' : 'none',
                        transition: 'all 0.2s',
                      }}>
                        {action.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Quick links */}
              {selAsset.links && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {selAsset.links.caseStudy && (
                    <a href={selAsset.links.caseStudy} style={{ fontSize: 10, color: '#444440', border: '0.5px solid #222220', padding: '5px 12px', borderRadius: 4, textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E8FF47')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#444440')}>
                      ↗ Case Study
                    </a>
                  )}
                  {selAsset.links.github && (
                    <a href={selAsset.links.github} style={{ fontSize: 10, color: '#444440', border: '0.5px solid #222220', padding: '5px 12px', borderRadius: 4, textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E8FF47')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#444440')}>
                      ↗ GitHub
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Rebalance view
function RebalanceView({ assets, onBack }: { assets: Asset[]; onBack: () => void }) {
  const totalAllocated = assets.reduce((s, a) => s + a.allocation, 0)
  const classA = assets.filter(a => a.assetClass === 'A').reduce((s, a) => s + a.allocation, 0)
  const classB = assets.filter(a => a.assetClass === 'B').reduce((s, a) => s + a.allocation, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <button onClick={onBack} style={{ fontSize: 10, color: '#444440', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }}>
        ← back to ledger
      </button>
      <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 20, fontWeight: 700, color: '#F5F5F0', marginBottom: 24 }}>
        Portfolio Allocation
      </h2>

      {/* Allocation bars */}
      {assets.filter(a => a.allocation > 0).map(asset => (
        <div key={asset.id} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#888884', fontFamily: 'var(--font-dm-sans)' }}>{asset.name}</span>
            <span style={{ fontSize: 10, color: CLASS_COLOR[asset.assetClass] }}>{asset.allocation}u</span>
          </div>
          <div style={{ height: 3, background: '#1A1A1A', borderRadius: 1 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${asset.allocation}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ height: '100%', background: CLASS_COLOR[asset.assetClass], borderRadius: 1, opacity: 0.7 }}
            />
          </div>
        </div>
      ))}

      <div style={{ marginTop: 28, padding: '14px 16px', background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6 }}>
        <p style={{ fontSize: 9, color: '#333330', margin: '0 0 8px' }}>TOTAL: {totalAllocated}u / 100u</p>
        <p style={{ fontSize: 9, color: '#444440', margin: '0 0 4px' }}>Class A: {classA}u &nbsp; Class B: {classB}u</p>
      </div>
    </motion.div>
  )
}
