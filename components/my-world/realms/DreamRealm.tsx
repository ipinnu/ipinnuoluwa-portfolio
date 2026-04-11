'use client'

import { motion } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'

interface DreamRealmProps {
  node: CelestialNode
  onClose: () => void
}

const STATUS_LABELS: Record<string, string> = {
  forming: 'Gathering energy',
  active: 'In motion',
  archived: 'Resting',
}

export default function DreamRealm({ node, onClose }: DreamRealmProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0D0D0D',
          border: '0.5px solid #1A1A1A',
          borderTop: '2px solid #993C1D',
          borderRadius: 12,
          padding: '32px',
          width: '100%',
          maxWidth: 460,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ghost watermark */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 0,
          fontFamily: 'var(--font-syne)', fontSize: 80, fontWeight: 800,
          color: '#993C1D', opacity: 0.04, letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
        }}>
          FORMING
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#993C1D', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              The Dream
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#444440', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11 }}>
              esc ×
            </button>
          </div>

          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 22, fontWeight: 700, color: '#F5F5F0', marginBottom: 8, lineHeight: 1.3, fontStyle: 'italic' }}>
            {node.title}
          </h2>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#993C1D', opacity: 0.7 }} />
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#993C1D99', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {STATUS_LABELS[node.status] ?? node.status}
            </span>
          </div>

          {node.summary && (
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, fontWeight: 300, color: '#888884', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
              {node.summary}
            </p>
          )}

          {node.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {node.tags.map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#33332F', border: '0.5px solid #1A1A18', padding: '3px 8px', borderRadius: 2 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p style={{ fontFamily: 'var(--font-syne)', fontSize: 11, color: '#993C1D55', fontStyle: 'italic' }}>
            Not yet. But soon.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
