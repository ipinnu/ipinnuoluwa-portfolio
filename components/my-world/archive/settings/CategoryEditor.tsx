'use client'

import { useState } from 'react'
import type { ArchiveCategory } from '@/lib/types/archive'

const PRESET_COLORS = [
  '#7F77DD','#1D9E75','#EF9F27','#D4AF37','#4A6FA5','#A3C4B4',
  '#D85A30','#534AB7','#E8FF47','#C4647A','#60C0D0','#E84393',
  '#5BC8E8','#C87941','#B0B0C0','#9B59B6','#FFB800','#888888',
  '#2D8A4E','#E84040','#40C080','#8080FF','#FF8040','#40FF80',
]

interface Props {
  categories: ArchiveCategory[]
  onAdd:      (name: string, colorHex: string) => Promise<void>
  onDelete:   (id: string) => Promise<void>
}

export default function CategoryEditor({ categories, onAdd, onDelete }: Props) {
  const [adding,  setAdding]  = useState(false)
  const [name,    setName]    = useState('')
  const [color,   setColor]   = useState('#1D9E75')
  const [custom,  setCustom]  = useState('')
  const [saving,  setSaving]  = useState(false)

  const handleAdd = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onAdd(name.trim(), color)
    setSaving(false)
    setName(''); setAdding(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          Categories
        </span>
        <button
          onClick={() => setAdding(v => !v)}
          style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.2)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
        >
          + Add
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background: 'rgba(29,158,117,0.04)', border: '0.5px solid rgba(29,158,117,0.12)', borderRadius: 6, padding: 16, marginBottom: 16 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category name..."
            autoFocus
            style={{
              display: 'block', width: '100%', marginBottom: 12,
              fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#D0EDE0',
              background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(29,158,117,0.15)',
              borderRadius: 4, padding: '8px 10px', outline: 'none', boxSizing: 'border-box',
            }}
          />

          {/* Color presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 24, height: 24, borderRadius: 4,
                  background: `rgba(${hexToRgb(c)},0.15)`,
                  border: `1px solid ${color === c ? c : `rgba(${hexToRgb(c)},0.3)`}`,
                  cursor: 'pointer',
                  filter: color === c ? 'url(#liquid-glass)' : 'url(#liquid-glass-soft)',
                  transform: color === c ? 'scale(1.15)' : 'none',
                  transition: 'transform 0.15s',
                }}
              />
            ))}
          </div>

          {/* Custom hex */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              value={custom}
              onChange={e => { setCustom(e.target.value); if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setColor(e.target.value) }}
              placeholder="#HEX"
              style={{
                width: 80, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#A0C0B0',
                background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(29,158,117,0.15)',
                borderRadius: 4, padding: '5px 8px', outline: 'none',
              }}
            />
            <div style={{ width: 24, height: 24, borderRadius: 4, background: color, flexShrink: 0 }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} disabled={!name.trim() || saving}
              style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#080810', background: '#1D9E75', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', opacity: !name.trim() ? 0.4 : 1 }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setAdding(false)}
              style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#2A4030', background: 'none', border: '0.5px solid rgba(29,158,117,0.15)', borderRadius: 4, padding: '6px 10px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {categories.map(c => (
        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid rgba(29,158,117,0.05)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: c.colorHex, flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, flexShrink: 0,
            color: c.colorHex,
            background: `rgba(${c.colorRgb},0.08)`,
            border: `0.5px solid rgba(${c.colorRgb},0.2)`,
            borderRadius: 4, padding: '2px 8px',
            filter: 'url(#liquid-glass-soft)',
          }}>
            {c.name}
          </span>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1A3028', flex: 1 }}>
            {c.colorHex}
          </span>
          {!c.isDefault && (
            <button
              onClick={() => onDelete(c.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2A3028', fontSize: 13, padding: '0 4px' }}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
