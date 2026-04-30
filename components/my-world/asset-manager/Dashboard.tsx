'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAssets, updateAsset as persistAsset, createAsset as persistCreate, seedIfEmpty } from '@/lib/assets'
import { fetchVisions } from '@/lib/visions'
import { getFloorState, worstSignal } from '@/lib/floor'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Asset, Vision, FloorState, AssetClass } from '@/lib/types/forge'
import { SEED_FORGE_ASSETS, SEED_VISIONS } from '@/lib/types/forge'
import FloorBar from './FloorBar'
import VisionLayer from './VisionLayer'
import AssetLedger from './AssetLedger'
import AssetDetail from './AssetDetail'
import RebalanceView from './RebalanceView'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { GlassFilter } from '@/components/theme/GlassFilter'
import { AmbientLayer } from '@/components/theme/AmbientLayer'

type View = 'detail' | 'rebalance'

interface Props { onClose: () => void }

export default function Dashboard({ onClose }: Props) {
  const isMobile = useIsMobile()

  const [assets,   setAssets]   = useState<Asset[]>(SEED_FORGE_ASSETS)
  const [visions,  setVisions]  = useState<Vision[]>(SEED_VISIONS)
  const [selected, setSelected] = useState<Asset | null>(null)
  const [view,     setView]     = useState<View>('detail')
  const [floor,    setFloor]    = useState<FloorState>(getFloorState())
  const [loading,  setLoading]  = useState(true)
  const [typed,    setTyped]    = useState('')

  // Mobile: which panel is visible ('list' | 'detail')
  const [mobilePanel, setMobilePanel] = useState<'list' | 'detail'>('list')

  // New asset modal
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName]       = useState('')
  const [newClass, setNewClass]     = useState<AssetClass>('B')
  const [creating, setCreating]     = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      await seedIfEmpty()
      const [a, v] = await Promise.all([fetchAssets(), fetchVisions()])
      if (cancelled) return
      setAssets(a)
      setVisions(v)
      setSelected(a[0] ?? null)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Typewriter
  useEffect(() => {
    const msg = 'Welcome back, Ipinnu.'
    let i = 0
    const iv = setInterval(() => {
      i++
      setTyped(msg.slice(0, i))
      if (i >= msg.length) clearInterval(iv)
    }, 45)
    return () => clearInterval(iv)
  }, [])

  const updateAsset = useCallback(async (id: string, patch: Partial<Asset>) => {
    // Optimistic update
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a))
    setSelected(prev => prev?.id === id ? { ...prev, ...patch } : prev)
    try {
      await persistAsset(id, patch)
    } catch (err) {
      console.warn('updateAsset failed — changes may not persist:', err)
    }
  }, [])

  const handleCreate = useCallback(async () => {
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    const now = new Date().toISOString().split('T')[0]
    const asset: Asset = {
      id:              `asset-${Date.now()}`,
      name,
      assetClass:      newClass,
      allocation:      0,
      returnTypes:     [],
      status:          newClass === 'A' ? 'active' : newClass === 'B' ? 'forming' : 'monitor',
      mandateText:     '',
      mandateProgress: 0,
      scores:          { revenue: 0, impact: 0, strategic: 0, momentum: 0 },
      actions:         [],
      lastReviewed:    now,
      visionIds:       [],
    }
    setAssets(prev => [asset, ...prev])
    setSelected(asset)
    setView('detail')
    if (isMobile) setMobilePanel('detail')
    setShowCreate(false)
    setNewName('')
    setNewClass('B')
    try { await persistCreate(asset) } catch (err) { console.warn('create failed:', err) }
    setCreating(false)
  }, [newName, newClass, isMobile])

  const handleSelectAsset = useCallback((asset: Asset) => {
    setSelected(asset)
    setView('detail')
    if (isMobile) setMobilePanel('detail')
  }, [isMobile])

  const handleRebalance = () => {
    setView('rebalance')
    if (isMobile) setMobilePanel('detail')
  }

  const handleBack = () => {
    if (isMobile) {
      setMobilePanel('list')
    } else {
      setView('detail')
    }
  }

  const worst = worstSignal(floor)

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50"
        style={{ background: 'rgba(6,6,14,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330', letterSpacing: '0.2em' }}>
          Loading ledger...
        </p>
      </motion.div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const selAsset = selected ? assets.find(a => a.id === selected.id) ?? selected : null

  return (
    <ThemeProvider section="forge">
    <GlassFilter />
    <AmbientLayer />
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50"
      style={{ background: 'rgba(6,6,14,0.97)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jetbrains-mono)' }}
    >
      {/* ── Floor Bar (always top) ── */}
      <FloorBar state={floor} onChange={setFloor} onClose={onClose} isMobile={isMobile} />

      {/* ── Portfolio lock overlay when shaking ── */}
      <AnimatePresence>
        {worst === 'shaking' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,6,14,0.85)', backdropFilter: 'blur(4px)', top: isMobile ? 40 : 44 }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-syne)', fontSize: isMobile ? 16 : 18, color: '#888884', marginBottom: 18, lineHeight: 1.5 }}>
                Stabilize the floor.<br />The portfolio waits.
              </p>
              <button
                onClick={() => {}}
                style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#E8FF47', background: 'none', border: '0.5px solid rgba(232,255,71,0.3)', borderRadius: 4, padding: '8px 20px', cursor: 'pointer' }}
              >
                Update floor status
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pressured banner ── */}
      {worst === 'pressured' && (
        <div style={{ padding: '6px 20px', background: '#1f1505', borderBottom: '0.5px solid #EF9F27', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: isMobile ? 8 : 9, color: '#EF9F27' }}>
            ⚠ Floor under pressure. Review before deploying more capital.
          </span>
        </div>
      )}

      {/* ── Vision Layer ── */}
      <VisionLayer
        visions={visions}
        assets={assets}
        onSelectAsset={handleSelectAsset}
        isMobile={isMobile}
      />

      {/* ── Typewriter ── */}
      {!isMobile && (
        <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1C1C1A', padding: '6px 20px 4px', margin: 0, flexShrink: 0, minHeight: 22 }}>
          {typed}<span style={{ opacity: typed.length > 0 ? 1 : 0, color: '#333330' }}>_</span>
        </p>
      )}

      {/* ── Main workspace ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden',
          opacity: worst === 'shaking' ? 0.08 : 1,
          transition: 'opacity 0.3s',
          pointerEvents: worst === 'shaking' ? 'none' : 'auto',
        }}
      >
        {/* Left: Asset Ledger */}
        {(!isMobile || mobilePanel === 'list') && (
          <div style={{
            width: isMobile ? '100%' : '42%',
            minWidth: isMobile ? undefined : 260,
            borderRight: isMobile ? 'none' : '0.5px solid #111111',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: isMobile ? 1 : undefined,
          }}>
            <AssetLedger
              assets={assets}
              visions={visions}
              selected={selAsset}
              onSelect={handleSelectAsset}
              onCreate={() => { setNewName(''); setNewClass('B'); setShowCreate(true) }}
              onRebalance={handleRebalance}
              onUpdateAsset={updateAsset}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Right: Detail or Rebalance */}
        {(!isMobile || mobilePanel === 'detail') && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: isMobile ? '100%' : undefined,
          }}>
            <AnimatePresence mode="wait">
              {view === 'rebalance' ? (
                <RebalanceView
                  key="rebalance"
                  assets={assets}
                  visions={visions}
                  onBack={handleBack}
                  isMobile={isMobile}
                />
              ) : selAsset ? (
                <AssetDetail
                  key={selAsset.id}
                  asset={selAsset}
                  assets={assets}
                  visions={visions}
                  onUpdate={updateAsset}
                  onBack={isMobile ? () => setMobilePanel('list') : undefined}
                  isMobile={isMobile}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isMobile ? null : (
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#1E1E1C' }}>
                      Select an asset
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      {/* ── New Asset Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: '#080810', border: '0.5px solid #1A1A24', borderRadius: 10, padding: isMobile ? '28px 22px' : '32px 36px', width: isMobile ? 'calc(100vw - 48px)' : 360 }}
            >
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 20px' }}>New Asset</p>

              <input
                autoFocus
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
                placeholder="Asset name..."
                style={{ width: '100%', background: '#0D0D0D', border: '0.5px solid #1A1A24', borderRadius: 5, padding: '10px 12px', fontFamily: 'var(--font-syne)', fontSize: 16, fontWeight: 600, color: '#F5F5F0', outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                {(['A', 'B', 'C'] as AssetClass[]).map(cls => {
                  const clsColor: Record<AssetClass, string> = { A: '#E8FF47', B: '#EF9F27', C: '#444440' }
                  const selected = newClass === cls
                  return (
                    <button
                      key={cls}
                      onClick={() => setNewClass(cls)}
                      style={{ flex: 1, padding: '8px', background: selected ? `${clsColor[cls]}18` : 'transparent', border: `0.5px solid ${selected ? clsColor[cls] : '#1A1A24'}`, borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: selected ? clsColor[cls] : '#333330' }}
                    >
                      Class {cls}
                    </button>
                  )
                })}
              </div>

              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#333330', margin: '0 0 18px', lineHeight: 1.5 }}>
                {newClass === 'A' ? 'Core position — active, high conviction, deployed capital.' : newClass === 'B' ? 'Forming position — emerging, building conviction.' : 'Monitor only — thesis, no capital deployed.'}
              </p>

              <button
                onClick={handleCreate}
                disabled={!newName.trim() || creating}
                style={{ width: '100%', padding: '11px', background: newName.trim() ? 'rgba(232,255,71,0.1)' : '#0A0A0A', border: `0.5px solid ${newName.trim() ? 'rgba(232,255,71,0.35)' : '#111118'}`, borderRadius: 5, cursor: newName.trim() ? 'pointer' : 'default', fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500, color: newName.trim() ? '#E8FF47' : '#222220' }}
              >
                {creating ? 'Creating...' : '+ Add to Ledger'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </ThemeProvider>
  )
}
