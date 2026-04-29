'use client'

import { useState } from 'react'
import type { ArchiveCategory, ArchiveType } from '@/lib/types/archive'

interface Props {
  categories: ArchiveCategory[]
  types:      ArchiveType[]
  onAdd:      (categoryId: string, name: string) => Promise<void>
  onDelete:   (id: string) => Promise<void>
}

export default function TypeEditor({ categories, types, onAdd, onDelete }: Props) {
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [newType,     setNewType]     = useState('')
  const [saving,      setSaving]      = useState(false)

  const cat       = categories.find(c => c.id === selectedCat)
  const catTypes  = types.filter(t => t.categoryId === selectedCat)

  const handleAdd = async () => {
    if (!selectedCat || !newType.trim()) return
    setSaving(true)
    await onAdd(selectedCat, newType.trim())
    setSaving(false)
    setNewType('')
  }

  return (
    <div>
      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.18em', display: 'block', marginBottom: 16 }}>
        Types
      </span>

      {/* Category selector */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1A3028', display: 'block', marginBottom: 6 }}>Select category</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9,
                color: c.colorHex,
                background: selectedCat === c.id ? `rgba(${c.colorRgb},0.12)` : `rgba(${c.colorRgb},0.05)`,
                border: `0.5px solid rgba(${c.colorRgb},${selectedCat === c.id ? '0.3' : '0.15'})`,
                borderRadius: 4, padding: '4px 8px', cursor: 'pointer',
                filter: selectedCat === c.id ? 'url(#liquid-glass)' : 'url(#liquid-glass-soft)',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Types list */}
      {selectedCat && (
        <div style={{ background: 'rgba(29,158,117,0.03)', border: '0.5px solid rgba(29,158,117,0.1)', borderRadius: 6, padding: '12px 14px' }}>
          {cat && (
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1A3028', margin: '0 0 10px', letterSpacing: '0.1em' }}>
              Types under {cat.name}
            </p>
          )}

          {catTypes.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#1A3028', fontStyle: 'italic', margin: '0 0 10px' }}>No types yet</p>
          ) : (
            catTypes.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid rgba(29,158,117,0.05)' }}>
                <span style={{
                  fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9,
                  color: cat ? cat.colorHex : '#1D9E75',
                  background: cat ? `rgba(${cat.colorRgb},0.06)` : 'rgba(29,158,117,0.06)',
                  border: cat ? `0.5px solid rgba(${cat.colorRgb},0.15)` : '0.5px solid rgba(29,158,117,0.15)',
                  borderRadius: 3, padding: '2px 6px',
                }}>
                  {t.name}
                </span>
                <button
                  onClick={() => onDelete(t.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2A3028', fontSize: 13, padding: '0 4px' }}
                >
                  ×
                </button>
              </div>
            ))
          )}

          {/* Add type */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input
              value={newType}
              onChange={e => setNewType(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
              placeholder="+ Add type..."
              style={{
                flex: 1, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#A0C0B0',
                background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(29,158,117,0.12)',
                borderRadius: 4, padding: '6px 8px', outline: 'none',
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!newType.trim() || saving}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9,
                color: '#080810', background: '#1D9E75',
                border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
                opacity: !newType.trim() ? 0.4 : 1,
              }}
            >
              {saving ? '…' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
