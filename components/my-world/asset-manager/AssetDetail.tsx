'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Asset, Vision } from '@/lib/types/forge'

const CLASS_COLOR: Record<string, string>  = { A: '#E8FF47', B: '#EF9F27', C: '#444440' }
const CLASS_LABEL: Record<string, string>  = { A: 'Core / Deployed', B: 'Forming', C: 'Monitor Only' }
const CLASS_STATUS: Record<string, Asset['status']> = { A: 'active', B: 'forming', C: 'monitor' }
const STATUS_DOT: Record<string, string>   = { active: '#22c55e', forming: '#EF9F27', monitor: '#444440' }
const RETURN_COLORS: Record<string, string> = { revenue: '#A3C4B4', impact: '#534AB7', brand: '#E8FF47', strategic: '#993C1D' }
const RANK_COLOR = ['#E8FF47', '#A3C4B4', '#534AB7']

function ScoreBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{ width: 12, height: 3, borderRadius: 1, backgroundColor: i < value ? color : '#1A1A1A', transition: 'background-color 0.2s' }} />
      ))}
    </div>
  )
}

function daysOverdue(lastReviewed: string): number {
  const last = new Date(lastReviewed).getTime()
  return Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24))
}

interface Props {
  asset: Asset
  assets: Asset[]
  visions: Vision[]
  onUpdate: (id: string, patch: Partial<Asset>) => void
  onBack?: () => void
  isMobile: boolean
}

export default function AssetDetail({ asset, assets, visions, onUpdate, onBack, isMobile }: Props) {
  const [classPickerOpen, setClassPickerOpen] = useState(false)
  const [transferOpen,   setTransferOpen]   = useState(false)
  const [transferFromId, setTransferFromId] = useState('')
  const [transferUnits,  setTransferUnits]  = useState(0)
  const [editingMandate, setEditingMandate] = useState(false)
  const [mandateDraft, setMandateDraft]     = useState(asset.mandateText)
  const [editingThesis, setEditingThesis]   = useState(false)
  const [thesisDraft, setThesisDraft]       = useState(asset.thesis ?? '')
  const [editingExit, setEditingExit]       = useState(false)
  const [exitDraft, setExitDraft]           = useState(asset.exitCondition ?? '')
  const [newActionText, setNewActionText]   = useState('')
  const [markReviewedFeedback, setMark]     = useState(false)

  // Reset drafts when asset changes
  useEffect(() => {
    setMandateDraft(asset.mandateText)
    setThesisDraft(asset.thesis ?? '')
    setExitDraft(asset.exitCondition ?? '')
    setEditingMandate(false)
    setEditingThesis(false)
    setEditingExit(false)
    setNewActionText('')
    setTransferOpen(false)
    setTransferFromId('')
    setTransferUnits(0)
  }, [asset.id])

  const color = CLASS_COLOR[asset.assetClass]
  const totalScore = Object.values(asset.scores).reduce((s, v) => s + v, 0)
  const days = daysOverdue(asset.lastReviewed)
  const overdue = days > 30

  const sortedVisions = [...visions].sort((a, b) => b.gameWeight - a.gameWeight)

  const otherAssets = assets.filter(a => a.id !== asset.id)
  const transferSource = otherAssets.find(a => a.id === transferFromId) ?? otherAssets[0] ?? null
  const totalDeployed  = assets.reduce((s, a) => s + a.allocation, 0)
  const POOL = 100

  function openTransfer() {
    const defaultSrc = otherAssets.find(a => a.allocation > 0) ?? otherAssets[0] ?? null
    setTransferFromId(defaultSrc?.id ?? '')
    setTransferUnits(0)
    setTransferOpen(true)
  }

  function confirmTransfer() {
    if (!transferSource || transferUnits <= 0) return
    const units = Math.min(transferUnits, transferSource.allocation)
    onUpdate(transferSource.id, { allocation: transferSource.allocation - units })
    onUpdate(asset.id, { allocation: asset.allocation + units })
    setTransferOpen(false)
    setTransferUnits(0)
  }

  const mandateDueDate  = asset.mandateDue ? new Date(asset.mandateDue) : null
  const mandateDueOver  = mandateDueDate ? mandateDueDate < new Date() : false
  const mandateDueFmt   = mandateDueDate
    ? mandateDueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: undefined })
    : null

  function reclassify(cls: 'A' | 'B' | 'C') {
    onUpdate(asset.id, { assetClass: cls, status: CLASS_STATUS[cls] })
    setClassPickerOpen(false)
  }

  function cycleStatus() {
    const order: Asset['status'][] = ['active', 'forming', 'monitor']
    const next = order[(order.indexOf(asset.status) + 1) % order.length]
    onUpdate(asset.id, { status: next })
  }

  function markReviewed() {
    onUpdate(asset.id, { lastReviewed: new Date().toISOString().split('T')[0] })
    setMark(true)
    setTimeout(() => setMark(false), 2000)
  }

  function adjustScore(key: keyof Asset['scores'], delta: number) {
    const next = Math.min(5, Math.max(0, asset.scores[key] + delta))
    onUpdate(asset.id, { scores: { ...asset.scores, [key]: next } })
  }

  function toggleAction(i: number) {
    const next = asset.actions.map((a, j) => j === i ? { ...a, done: !a.done } : a)
    onUpdate(asset.id, { actions: next })
  }

  function deleteAction(i: number) {
    onUpdate(asset.id, { actions: asset.actions.filter((_, j) => j !== i) })
  }

  function addAction() {
    const t = newActionText.trim()
    if (!t) return
    onUpdate(asset.id, { actions: [...asset.actions, { text: t, done: false }] })
    setNewActionText('')
  }

  function toggleVision(visionId: string) {
    const has = asset.visionIds.includes(visionId)
    const next = has ? asset.visionIds.filter(id => id !== visionId) : [...asset.visionIds, visionId]
    onUpdate(asset.id, { visionIds: next })
  }

  // Floor trace: for each connected vision, show its floorLink
  const connectedVisions = visions.filter(v => asset.visionIds.includes(v.id))
  const floorTrace = connectedVisions.map(v => ({
    vision: v,
    floorPrinciple: v.floorLink.split('—')[0]?.trim() ?? v.floorLink,
  }))

  return (
    <motion.div
      key={asset.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ height: '100%', overflowY: 'auto', padding: isMobile ? '16px 16px 40px' : '24px 28px 40px' }}
    >
      {/* Back button (mobile) */}
      {isMobile && onBack && (
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 18, padding: 0 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#E8FF47' }}>←</span>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#444440' }}>back to ledger</span>
        </button>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          {/* Class selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setClassPickerOpen(o => !o)}
              title="Click to reclassify"
              style={{ background: 'none', border: `0.5px solid ${color}40`, borderRadius: 3, cursor: 'pointer', padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Class {asset.assetClass}
              </span>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: `${color}80` }}>▾</span>
            </button>
            {classPickerOpen && (
              <div onClick={() => setClassPickerOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 19 }} />
            )}
            <AnimatePresence>
              {classPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#0D0D0D', border: '0.5px solid #222220', borderRadius: 5, overflow: 'hidden', zIndex: 20, minWidth: 160 }}
                >
                  {(['A', 'B', 'C'] as const).map(cls => (
                    <button
                      key={cls}
                      onClick={() => reclassify(cls)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        background: asset.assetClass === cls ? `${CLASS_COLOR[cls]}10` : 'none',
                        border: 'none', borderBottom: '0.5px solid #161616',
                        padding: '8px 12px', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: CLASS_COLOR[cls], fontWeight: 700, minWidth: 14 }}>{cls}</span>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: asset.assetClass === cls ? CLASS_COLOR[cls] : '#444440' }}>{CLASS_LABEL[cls]}</span>
                      {asset.assetClass === cls && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: CLASS_COLOR[cls] }}>✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={cycleStatus} title="Click to cycle status" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: STATUS_DOT[asset.status] }} />
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: STATUS_DOT[asset.status], textTransform: 'uppercase', letterSpacing: '0.1em' }}>{asset.status}</span>
          </button>
        </div>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#F5F5F0', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          {asset.name}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: overdue ? '#EF9F27' : '#333330' }}>
            Reviewed {days === 0 ? 'today' : `${days}d ago`}{overdue ? ' — overdue' : ''}
          </span>
          {asset.assetClass === 'A' && mandateDueFmt && (
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: mandateDueOver ? '#EF9F27' : '#2A4030' }}>
              · mandate due {mandateDueFmt}{mandateDueOver ? ' — overdue' : ''}
            </span>
          )}
          {markReviewedFeedback ? (
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#22c55e' }}>✓ Marked</span>
          ) : (
            <button onClick={markReviewed} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#444440', background: 'none', border: '0.5px solid #222220', borderRadius: 3, padding: '2px 7px', cursor: 'pointer' }}>
              Mark today
            </button>
          )}
        </div>
      </div>

      {/* Return types */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 20 }}>
        {asset.returnTypes.map(rt => (
          <span key={rt} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: RETURN_COLORS[rt], background: `${RETURN_COLORS[rt]}12`, border: `0.5px solid ${RETURN_COLORS[rt]}30`, padding: '2px 7px', borderRadius: 2 }}>
            {rt}
          </span>
        ))}
      </div>

      {/* Scores — 2×2 grid with +/− */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
        {(Object.entries(asset.scores) as [keyof Asset['scores'], number][]).map(([key, val]) => (
          <div key={key} style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '10px 12px' }}>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 5px' }}>{key}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-syne)', fontSize: 20, fontWeight: 800, color: '#F5F5F0', lineHeight: 1 }}>{val}</span>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330' }}>/5</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                <button onClick={() => adjustScore(key, -1)} style={{ width: isMobile ? 28 : 20, height: isMobile ? 28 : 20, background: '#1A1A1A', border: '0.5px solid #222220', borderRadius: 3, cursor: 'pointer', color: '#555550', fontSize: isMobile ? 15 : 12, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>−</button>
                <button onClick={() => adjustScore(key, +1)} style={{ width: isMobile ? 28 : 20, height: isMobile ? 28 : 20, background: '#1A1A1A', border: '0.5px solid #222220', borderRadius: 3, cursor: 'pointer', color: '#555550', fontSize: isMobile ? 15 : 12, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
              </div>
            </div>
            <ScoreBar value={val} color={color} />
          </div>
        ))}
      </div>

      {/* Total conviction */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#444440', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Conviction</span>
        <span style={{ fontFamily: 'var(--font-syne)', fontSize: 28, fontWeight: 800, color: totalScore >= 16 ? '#E8FF47' : totalScore >= 11 ? '#EF9F27' : '#ef4444', lineHeight: 1 }}>{totalScore}</span>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>/20</span>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: totalScore >= 16 ? '#E8FF47' : totalScore >= 11 ? '#EF9F27' : '#ef4444', marginLeft: 4 }}>
          {totalScore >= 16 ? 'Strong Buy' : totalScore >= 11 ? 'Hold' : 'Review'}
        </span>
      </div>

      {/* Allocation */}
      <div style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Capital Deployment</p>
          {!transferOpen && (
            <button
              onClick={openTransfer}
              style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#444440', background: 'none', border: '0.5px solid #222220', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }}
            >
              Adjust ↕
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: transferOpen ? 12 : 0 }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontSize: 28, fontWeight: 800, color: '#F5F5F0', lineHeight: 1 }}>{asset.allocation}</span>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330' }}>/ {POOL}u</span>
          <div style={{ flex: 1, height: 3, background: '#1A1A1A', borderRadius: 1 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(asset.allocation / POOL) * 100}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ height: '100%', background: color, borderRadius: 1 }} />
          </div>
        </div>

        {/* Transfer prompt */}
        <AnimatePresence>
          {transferOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ borderTop: '0.5px solid #1A1A1A', paddingTop: 12 }}>
                <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', margin: '0 0 8px' }}>Transfer into {asset.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440' }}>Move</span>
                  <input
                    type="number" min={0} max={transferSource?.allocation ?? 0}
                    value={transferUnits}
                    onChange={e => setTransferUnits(Math.max(0, Math.min(Number(e.target.value), transferSource?.allocation ?? 0)))}
                    style={{ width: 52, background: '#111111', border: '0.5px solid #333330', borderRadius: 3, padding: '4px 6px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#F5F5F0', outline: 'none', textAlign: 'center' }}
                  />
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440' }}>units from</span>
                  <select
                    value={transferFromId}
                    onChange={e => { setTransferFromId(e.target.value); setTransferUnits(0) }}
                    style={{ background: '#111111', border: '0.5px solid #333330', borderRadius: 3, padding: '4px 6px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#888884', outline: 'none', cursor: 'pointer' }}
                  >
                    {otherAssets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.allocation}u)</option>
                    ))}
                  </select>
                </div>
                {transferSource && transferUnits > 0 && (
                  <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', margin: '0 0 8px' }}>
                    {transferSource.name}: {transferSource.allocation}u → {transferSource.allocation - transferUnits}u
                    {' · '}{asset.name}: {asset.allocation}u → {asset.allocation + transferUnits}u
                    {' · '} Pool: {totalDeployed}/{POOL}u
                  </p>
                )}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setTransferOpen(false)}
                    style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#444440', background: 'none', border: '0.5px solid #222220', borderRadius: 3, padding: '5px 12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmTransfer}
                    disabled={!transferSource || transferUnits <= 0}
                    style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: transferUnits > 0 ? '#E8FF47' : '#333330', background: 'none', border: `0.5px solid ${transferUnits > 0 ? 'rgba(232,255,71,0.35)' : '#222220'}`, borderRadius: 3, padding: '5px 12px', cursor: transferUnits > 0 ? 'pointer' : 'default' }}
                  >
                    Confirm Transfer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mandate */}
      <Section label="Mandate">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: color }}>{asset.mandateProgress}%</span>
          <button
            onClick={() => { setMandateDraft(asset.mandateText); setEditingMandate(e => !e) }}
            style={pencilBtn}
          >
            {editingMandate ? 'done' : '✎'}
          </button>
        </div>

        {editingMandate ? (
          <div>
            {/* Context panel */}
            {(connectedVisions.length > 0 || asset.actions.length > 0) && (
              <div style={{ background: '#080808', border: '0.5px solid #161616', borderRadius: 4, padding: '8px 10px', marginBottom: 8 }}>
                <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#1E1E1C', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 6px' }}>Context</p>
                {connectedVisions.map(v => (
                  <p key={v.id} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#2A3830', margin: '0 0 2px' }}>↗ {v.title}</p>
                ))}
                {connectedVisions.length > 0 && asset.actions.length > 0 && (
                  <div style={{ height: '0.5px', background: '#161616', margin: '5px 0' }} />
                )}
                {asset.actions.map((a, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: a.done ? '#1A1A18' : '#2A3028', margin: '0 0 2px', textDecoration: a.done ? 'line-through' : 'none' }}>
                    · {a.text}
                  </p>
                ))}
              </div>
            )}
            <textarea
              value={mandateDraft}
              onChange={e => setMandateDraft(e.target.value)}
              onBlur={() => { onUpdate(asset.id, { mandateText: mandateDraft }); setEditingMandate(false) }}
              autoFocus
              placeholder="Write the mandate informed by the context above..."
              style={textareaStyle}
            />
            {asset.assetClass === 'A' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330' }}>Due by</span>
                <input
                  type="date"
                  value={asset.mandateDue ?? ''}
                  onChange={e => onUpdate(asset.id, { mandateDue: e.target.value || undefined })}
                  style={{ background: '#111111', border: '0.5px solid #333330', borderRadius: 3, padding: '4px 8px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#888884', outline: 'none', cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        ) : (
          <p
            onClick={() => { setMandateDraft(asset.mandateText); setEditingMandate(true) }}
            style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#888884', lineHeight: 1.6, margin: '0 0 10px', cursor: 'text' }}
          >
            {asset.mandateText || <em style={{ color: '#333330' }}>No mandate. Click ✎ to write one.</em>}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="range" min={0} max={100} value={asset.mandateProgress}
            onChange={e => onUpdate(asset.id, { mandateProgress: Number(e.target.value) })}
            style={{ flex: 1, accentColor: color }}
          />
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: color, minWidth: 28, textAlign: 'right' }}>{asset.mandateProgress}%</span>
        </div>
      </Section>

      {/* Investment thesis */}
      <Section label="Investment Thesis">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <button onClick={() => { setThesisDraft(asset.thesis ?? ''); setEditingThesis(e => !e) }} style={pencilBtn}>
            {editingThesis ? 'done' : '✎'}
          </button>
        </div>
        {editingThesis ? (
          <textarea value={thesisDraft} onChange={e => setThesisDraft(e.target.value)}
            onBlur={() => { onUpdate(asset.id, { thesis: thesisDraft }); setEditingThesis(false) }}
            autoFocus placeholder="Why are you invested in this? What's the expected return path?"
            style={textareaStyle} />
        ) : (
          <p onClick={() => { setThesisDraft(asset.thesis ?? ''); setEditingThesis(true) }}
            style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: asset.thesis ? '#888884' : '#333330', lineHeight: 1.65, margin: 0, cursor: 'text', fontStyle: asset.thesis ? 'normal' : 'italic' }}>
            {asset.thesis || 'No thesis yet. Click to write one.'}
          </p>
        )}
      </Section>

      {/* Exit condition */}
      <Section label="Exit Condition">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <button onClick={() => { setExitDraft(asset.exitCondition ?? ''); setEditingExit(e => !e) }} style={pencilBtn}>
            {editingExit ? 'done' : '✎'}
          </button>
        </div>
        {editingExit ? (
          <textarea value={exitDraft} onChange={e => setExitDraft(e.target.value)}
            onBlur={() => { onUpdate(asset.id, { exitCondition: exitDraft }); setEditingExit(false) }}
            autoFocus placeholder="When do you stop holding this?"
            style={textareaStyle} />
        ) : (
          <p onClick={() => { setExitDraft(asset.exitCondition ?? ''); setEditingExit(true) }}
            style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: asset.exitCondition ? '#888884' : '#EF9F27', lineHeight: 1.65, margin: 0, cursor: 'text', fontStyle: asset.exitCondition ? 'normal' : 'italic' }}>
            {asset.exitCondition || 'No exit condition. Click ✎ to define one.'}
          </p>
        )}
      </Section>

      {/* Actions */}
      {(asset.actions.length > 0 || asset.assetClass !== 'C') && (
        <Section label="Next Actions">
          <AnimatePresence initial={false}>
            {asset.actions.map((action, i) => (
              <motion.label
                key={i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: isMobile ? 12 : 8, cursor: 'pointer', overflow: 'hidden' }}
              >
                <input type="checkbox" checked={action.done} onChange={() => toggleAction(i)}
                  style={{ accentColor: color, marginTop: 2, flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: action.done ? '#2A2A28' : '#888884', textDecoration: action.done ? 'line-through' : 'none', transition: 'all 0.2s', lineHeight: 1.5 }}>
                  {action.text}
                </span>
                <button onClick={() => deleteAction(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2A2A28', fontSize: 14, padding: isMobile ? '4px 8px' : '0 4px', flexShrink: 0, lineHeight: 1 }}>×</button>
              </motion.label>
            ))}
          </AnimatePresence>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              type="text" value={newActionText}
              onChange={e => setNewActionText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addAction() }}
              placeholder="Add action..."
              style={{ flex: 1, fontFamily: 'var(--font-dm-sans)', fontSize: 16, background: '#111111', border: '0.5px solid #1A1A1A', borderRadius: 3, padding: '8px 10px', color: '#888884', outline: 'none' }}
            />
            <button onClick={addAction} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, background: '#1A1A1A', border: '0.5px solid #222220', borderRadius: 3, padding: '5px 10px', cursor: 'pointer', color: '#444440' }}>
              + Add
            </button>
          </div>
        </Section>
      )}

      {/* Vision connections */}
      <Section label="Serving These Visions">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {connectedVisions.map((v, i) => {
            const rank = sortedVisions.findIndex(sv => sv.id === v.id)
            const c = RANK_COLOR[rank] ?? '#444440'
            return (
              <div key={v.id} style={{ background: '#0D0D0D', border: `0.5px solid ${c}30`, borderRadius: 5, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: c }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-syne)', fontSize: 10, fontWeight: 600, color: '#C0C0B8', margin: 0 }}>{v.title}</p>
                  <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#333330', margin: '1px 0 0' }}>{v.gameWeight}% of game</p>
                </div>
                <button onClick={() => toggleVision(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2A2A28', fontSize: 11, marginLeft: 4, padding: 0 }}>×</button>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {visions.filter(v => !asset.visionIds.includes(v.id)).map(v => (
            <button key={v.id} onClick={() => toggleVision(v.id)}
              style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', background: 'none', border: '0.5px solid #1A1A1A', borderRadius: 3, padding: '3px 8px', cursor: 'pointer' }}>
              + {v.title}
            </button>
          ))}
        </div>
      </Section>

      {/* Floor trace */}
      {floorTrace.length > 0 && (
        <Section label="Floor Trace">
          {floorTrace.map(({ vision, floorPrinciple }) => (
            <div key={vision.id} style={{ marginBottom: 10 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#444440', margin: '0 0 2px', fontStyle: 'italic' }}>
                {asset.name} → {vision.title}
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#333330', margin: '0 0 2px', paddingLeft: 12, fontStyle: 'italic', lineHeight: 1.5 }}>
                └── "{vision.floorLink}"
              </p>
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#E8FF47', paddingLeft: 24, margin: 0, opacity: 0.5 }}>
                └── THE FLOOR: {floorPrinciple}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Quick links */}
      {asset.links && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {asset.links.caseStudy && (
            <a href={asset.links.caseStudy} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', border: '0.5px solid #222220', padding: '5px 12px', borderRadius: 4, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8FF47')} onMouseLeave={e => (e.currentTarget.style.color = '#444440')}>
              ↗ Case Study
            </a>
          )}
          {asset.links.github && (
            <a href={asset.links.github} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', border: '0.5px solid #222220', padding: '5px 12px', borderRadius: 4, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8FF47')} onMouseLeave={e => (e.currentTarget.style.color = '#444440')}>
              ↗ GitHub
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0D0D0D', border: '0.5px solid #111111', borderRadius: 6, padding: '12px 14px', marginBottom: 12 }}>
      <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>{label}</p>
      {children}
    </div>
  )
}

const pencilBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440',
  padding: '6px 8px', margin: '-6px -8px',
}

const textareaStyle: React.CSSProperties = {
  width: '100%', fontSize: 16, color: '#888884', lineHeight: 1.65,
  fontFamily: 'var(--font-dm-sans)', background: '#111111',
  border: '0.5px solid #333330', borderRadius: 4, padding: '8px',
  resize: 'none', minHeight: 70, outline: 'none', marginBottom: 4,
  boxSizing: 'border-box',
}
