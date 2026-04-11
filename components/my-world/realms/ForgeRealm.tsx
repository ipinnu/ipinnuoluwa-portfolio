'use client'

import { motion } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'

interface ForgeRealmProps {
  node: CelestialNode
  onClose: () => void
}

export default function ForgeRealm({ node, onClose }: ForgeRealmProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#111111',
          border: '0.5px solid #222220',
          borderRadius: 12,
          padding: '32px',
          width: '100%',
          maxWidth: 520,
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Forge accent bar */}
        <div style={{ height: 2, backgroundColor: '#E8FF47', borderRadius: 1, marginBottom: 24 }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#E8FF47', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              The Forge
            </span>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 24, fontWeight: 700, color: '#F5F5F0', margin: '6px 0 0' }}>
              {node.title}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#444440', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11 }}>
            esc ×
          </button>
        </div>

        {/* Summary */}
        {node.summary && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, fontWeight: 300, color: '#888884', lineHeight: 1.7, marginBottom: 20 }}>
            {node.summary}
          </p>
        )}

        {/* Tags */}
        {node.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {node.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#444440',
                background: '#0D0D0D', border: '0.5px solid #1A1A1A',
                padding: '4px 8px', borderRadius: 2,
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: node.status === 'active' ? '#22c55e' : '#EF9F27' }} />
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#555552', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {node.status}
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {node.project_slug && (
            <a href={`/work/${node.project_slug}`} style={{
              fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
              color: '#0A0A0A', backgroundColor: '#A3C4B4',
              padding: '8px 16px', borderRadius: 4, textDecoration: 'none',
            }}>
              View case study →
            </a>
          )}
          {node.external_url && (
            <a href={node.external_url} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'var(--font-dm-sans)', fontSize: 13,
              color: '#888884', border: '0.5px solid #222220',
              padding: '8px 16px', borderRadius: 4, textDecoration: 'none',
            }}>
              ↗ External link
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
