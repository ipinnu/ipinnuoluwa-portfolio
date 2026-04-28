'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFloorState, setFloorState, floorIsStale } from '@/lib/floor'
import type { FloorState, FloorSignal } from '@/lib/types/forge'

const SIGNAL_COLOR: Record<FloorSignal, string> = {
  stable:    '#22c55e',
  pressured: '#EF9F27',
  shaking:   '#ef4444',
}
const SIGNAL_LABEL: Record<FloorSignal, string> = {
  stable:    'Stable',
  pressured: 'Under pressure',
  shaking:   'Shaking',
}
const PULSE_DURATION: Record<FloorSignal, string> = {
  stable:    '2s',
  pressured: '1.2s',
  shaking:   '0.6s',
}

interface Props {
  state: FloorState
  onChange: (next: FloorState) => void
  onClose: () => void
  isMobile: boolean
}

export default function FloorBar({ state, onChange, onClose, isMobile }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<FloorState>(state)
  const stale = floorIsStale(state)

  const save = () => {
    const next = { ...draft, lastUpdated: new Date().toISOString() }
    setFloorState(next)
    onChange(next)
    setModalOpen(false)
  }

  const openModal = () => { setDraft(state); setModalOpen(true) }

  return (
    <>
      <div style={{
        height: isMobile ? 40 : 44,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 14px' : '0 24px',
        borderBottom: '0.5px solid #111111',
        backgroundColor: '#06060E',
        gap: 12,
      }}>
        {/* Left label */}
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330', textTransform: 'uppercase', letterSpacing: '0.18em', flexShrink: 0 }}>
          The Floor
        </span>

        {/* Signals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 20, flex: 1, justifyContent: 'center' }}>
          {(['peace', 'sovereignty'] as const).map(key => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Pulsing dot */}
              <div style={{ position: 'relative', width: 7, height: 7, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  backgroundColor: SIGNAL_COLOR[state[key]],
                  animation: `pulse-floor ${PULSE_DURATION[state[key]]} ease-in-out infinite`,
                }} />
              </div>
              {!isMobile && (
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330', textTransform: 'capitalize' }}>
                  {key}:
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: SIGNAL_COLOR[state[key]] }}>
                {isMobile ? key.charAt(0).toUpperCase() + key.slice(1) : SIGNAL_LABEL[state[key]]}
              </span>
            </div>
          ))}
          {stale && (
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#EF9F27', opacity: 0.7 }}>
              · stale
            </span>
          )}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={openModal}
            style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', background: 'none', border: '0.5px solid #222220', borderRadius: 3, padding: isMobile ? '6px 12px' : '3px 9px', cursor: 'pointer' }}
          >
            Update
          </button>
          <button
            onClick={onClose}
            style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#2A2A28', background: 'none', border: 'none', cursor: 'pointer', padding: isMobile ? '8px 4px' : '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#888884')}
            onMouseLeave={e => (e.currentTarget.style.color = '#2A2A28')}
          >
            {isMobile ? '×' : '× exit'}
          </button>
        </div>
      </div>

      {/* Update modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: '#080810', border: '0.5px solid #1A1A24', borderRadius: 10, padding: isMobile ? '28px 24px' : '32px 36px', width: isMobile ? 'calc(100vw - 48px)' : 340 }}
            >
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 20px' }}>
                How are you feeling right now?
              </p>

              {(['peace', 'sovereignty'] as const).map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#888884', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {key}
                  </span>
                  <select
                    value={draft[key]}
                    onChange={e => setDraft(d => ({ ...d, [key]: e.target.value as FloorSignal }))}
                    style={{ backgroundColor: '#0D0D0D', border: '0.5px solid #1A1A24', borderRadius: 4, padding: '8px 10px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 16, color: SIGNAL_COLOR[draft[key]], outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="stable">Stable</option>
                    <option value="pressured">Under pressure</option>
                    <option value="shaking">Shaking</option>
                  </select>
                </div>
              ))}

              <button
                onClick={save}
                style={{ width: '100%', marginTop: 8, padding: '10px', background: 'rgba(163,196,180,0.1)', border: '0.5px solid rgba(163,196,180,0.3)', borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500, color: '#A3C4B4' }}
              >
                Save
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-floor {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </>
  )
}
