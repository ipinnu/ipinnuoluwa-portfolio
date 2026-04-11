'use client'

import { motion } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'

interface ChronicleRealmProps {
  node: CelestialNode
  onClose: () => void
}

export default function ChronicleRealm({ node, onClose }: ChronicleRealmProps) {
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
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#111111',
          border: '0.5px solid #222220',
          borderTop: '2px solid #534AB7',
          borderRadius: 12,
          padding: '32px',
          width: '100%',
          maxWidth: 560,
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              The Chronicle
            </span>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 22, fontWeight: 700, color: '#F5F5F0', margin: '6px 0 0', lineHeight: 1.3 }}>
              {node.title}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#444440', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11 }}>
            esc ×
          </button>
        </div>

        {node.summary && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 300, color: '#888884', lineHeight: 1.8, marginBottom: 20 }}>
            {node.summary}
          </p>
        )}

        {node.content ? (
          <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: '#888884', lineHeight: 1.8 }}>
            {node.content}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 11, color: '#333330', fontStyle: 'italic' }}>
            Full text coming soon.
          </p>
        )}

        {node.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 24, flexWrap: 'wrap' }}>
            {node.tags.map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#534AB766', background: '#534AB711', border: '0.5px solid #534AB733', padding: '3px 8px', borderRadius: 2 }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
