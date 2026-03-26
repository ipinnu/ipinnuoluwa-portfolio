'use client'

import { motion } from 'framer-motion'
import type { NodeType } from '@/lib/types/brainbox'

type Filter = 'all' | NodeType

interface FilterStripProps {
  active: Filter
  counts: Record<string, number>
  onChange: (f: Filter) => void
}

const FILTERS: { key: Filter; label: string; symbol: string }[] = [
  { key: 'all',     label: 'All',     symbol: '' },
  { key: 'thought', label: 'Thoughts', symbol: '●' },
  { key: 'project', label: 'Projects', symbol: '■' },
  { key: 'paper',   label: 'Papers',   symbol: '▬' },
  { key: 'wonder',  label: 'Wonders',  symbol: '◆' },
]

export default function FilterStrip({ active, counts, onChange }: FilterStripProps) {
  return (
    <div
      className="fixed bottom-7 left-1/2 z-10 flex items-center gap-1 px-4 py-2"
      style={{
        transform: 'translateX(-50%)',
        background: 'rgba(17,17,17,0.9)',
        border: '0.5px solid #222220',
        borderRadius: 99,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {FILTERS.map(f => {
        const isActive = active === f.key
        const count = f.key === 'all'
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : (counts[f.key] ?? 0)
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className="relative px-3 py-1 rounded-full text-[12px] font-mono transition-colors"
            style={{
              color: isActive ? '#0A0A0A' : '#444440',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: '#E8FF47' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {f.symbol && <span className="mr-1">{f.symbol}</span>}
              {f.label}
              <span className="ml-1 opacity-50">({count})</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
