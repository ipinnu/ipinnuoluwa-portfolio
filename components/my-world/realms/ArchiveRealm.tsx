'use client'

import { motion } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'

interface ArchiveRealmProps {
  node: CelestialNode
  onClose: () => void
}

export default function ArchiveRealm({ node, onClose }: ArchiveRealmProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-end"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#111111',
          borderLeft: '0.5px solid #222220',
          borderTop: '2px solid #1D9E75',
          height: '100%',
          width: '100%',
          maxWidth: 540,
          overflowY: 'auto',
          padding: '80px 32px 40px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 24, right: 24,
            background: 'none', border: 'none', color: '#444440',
            cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11,
          }}
        >
          esc ×
        </button>

        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          The Archive
        </span>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 22, fontWeight: 700, color: '#F5F5F0', margin: '8px 0 20px', lineHeight: 1.3 }}>
          {node.title}
        </h2>

        {/* Reading progress bar */}
        <div style={{ height: 1, backgroundColor: '#1A1A1A', marginBottom: 24 }}>
          <div style={{ height: 1, width: '40%', backgroundColor: '#1D9E75', transition: 'width 0.3s' }} />
        </div>

        {node.summary && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, fontWeight: 300, color: '#888884', lineHeight: 1.8, marginBottom: 20 }}>
            {node.summary}
          </p>
        )}

        {node.content ? (
          <div className="prose" style={{ fontSize: 14 }}>{node.content}</div>
        ) : (
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#333330', fontStyle: 'italic' }}>
            Full paper coming soon.
          </p>
        )}

        {node.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 28, flexWrap: 'wrap' }}>
            {node.tags.map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#1D9E7599', background: '#1D9E7511', border: '0.5px solid #1D9E7533', padding: '3px 8px', borderRadius: 2 }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {node.external_url && (
          <a href={node.external_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 24, fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#1D9E75', textDecoration: 'none' }}>
            ↗ Read full paper
          </a>
        )}
      </motion.div>
    </motion.div>
  )
}
