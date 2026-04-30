'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ArchiveNote, ArchiveCategory, ArchiveType } from '@/lib/types/archive'

interface Props {
  notes:      ArchiveNote[]
  categories: ArchiveCategory[]
  types:      ArchiveType[]
  selected:   ArchiveNote | null
  onSelect:   (note: ArchiveNote) => void
  onCreate:   () => void
  onDelete:   (note: ArchiveNote) => void
  onSettings: () => void
  isMobile:   boolean
  onClose?:   () => void
}

export default function NoteBrowser({ notes, categories, types, selected, onSelect, onCreate, onDelete, onSettings, isMobile, onClose }: Props) {
  const [collapsed, setCollapsed]   = useState<Record<string, boolean>>({})
  const [search, setSearch]         = useState('')

  const filtered = search
    ? notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    : notes

  const grouped = categories.reduce<Record<string, ArchiveNote[]>>((acc, cat) => {
    acc[cat.id] = filtered.filter(n => n.categoryId === cat.id)
    return acc
  }, {})

  const typeGrouped = (catId: string) => {
    const catTypes = types.filter(t => t.categoryId === catId)
    return catTypes.reduce<Record<string, ArchiveNote[]>>((acc, t) => {
      acc[t.id] = (grouped[catId] ?? []).filter(n => n.typeId === t.id)
      return acc
    }, {})
  }

  const uncategorized = filtered.filter(n => !n.categoryId)

  function toggleCat(id: string) {
    setCollapsed(p => ({ ...p, [id]: !p[id] }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '0.5px solid rgba(var(--theme-primary-rgb),0.12)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--theme-text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Archive</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onSettings} style={iconBtn} title="Settings">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button onClick={onCreate} style={{ ...iconBtn, color: 'var(--theme-primary)' }} title="New note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            {isMobile && onClose && (
              <button onClick={onClose} style={iconBtn} title="Close">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
          style={{ width: '100%', background: 'rgba(var(--theme-primary-rgb),0.04)', border: '0.5px solid rgba(var(--theme-primary-rgb),0.12)', borderRadius: 4, padding: '7px 10px', fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'var(--theme-text-muted)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Category tree */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {categories.map(cat => {
          const catNotes   = grouped[cat.id] ?? []
          const catTypes   = types.filter(t => t.categoryId === cat.id)
          const typeGroups = typeGrouped(cat.id)
          const noType     = catNotes.filter(n => !n.typeId)
          if (catNotes.length === 0 && !search) return null
          const isOpen = !collapsed[cat.id]

          return (
            <div key={cat.id}>
              <button
                onClick={() => toggleCat(cat.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#333330', transform: isOpen ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s' }}>▶</span>
                <span style={{
                  fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, letterSpacing: '0.1em',
                  color: `rgba(${cat.colorRgb}, 0.85)`,
                  background: `rgba(${cat.colorRgb}, 0.08)`,
                  border: `0.5px solid rgba(${cat.colorRgb}, 0.2)`,
                  borderRadius: 4, padding: '2px 8px',
                  filter: 'url(#liquid-glass-soft)',
                }}>
                  {cat.name}
                </span>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1E3028', marginLeft: 'auto' }}>
                  {catNotes.length}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                    {/* Notes without type */}
                    {noType.map(note => (
                      <NoteItem key={note.id} note={note} selected={selected?.id === note.id} color={cat.colorHex} onSelect={() => onSelect(note)} onDelete={() => onDelete(note)} />
                    ))}
                    {/* Types */}
                    {catTypes.map(t => {
                      const tNotes = typeGroups[t.id] ?? []
                      if (tNotes.length === 0) return null
                      return (
                        <div key={t.id} style={{ paddingLeft: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 14px 2px' }}>
                            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: `rgba(${cat.colorRgb},0.5)`, background: `rgba(${cat.colorRgb},0.06)`, border: `0.5px solid rgba(${cat.colorRgb},0.15)`, borderRadius: 3, padding: '1px 6px' }}>{t.name}</span>
                            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#1E2820' }}>{tNotes.length}</span>
                          </div>
                          {tNotes.map(note => (
                            <NoteItem key={note.id} note={note} selected={selected?.id === note.id} color={cat.colorHex} onSelect={() => onSelect(note)} onDelete={() => onDelete(note)} indent />
                          ))}
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Uncategorized */}
        {uncategorized.length > 0 && (
          <div>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#1E2820', textTransform: 'uppercase', letterSpacing: '0.18em', padding: '10px 14px 4px', margin: 0 }}>
              ─── Uncategorized
            </p>
            {uncategorized.map(note => (
              <NoteItem key={note.id} note={note} selected={selected?.id === note.id} color="#444440" onSelect={() => onSelect(note)} onDelete={() => onDelete(note)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NoteItem({ note, selected, color, onSelect, onDelete, indent }: {
  note: ArchiveNote; selected: boolean; color: string
  onSelect: () => void; onDelete: () => void; indent?: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left', background: selected ? `rgba(${hexToRgb(color)},0.06)` : 'none',
        border: 'none', cursor: 'pointer',
        padding: `7px 14px 7px ${indent ? 28 : 22}px`,
        borderLeft: selected ? `2px solid ${color}` : '2px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'var(--theme-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {note.title || 'Untitled'}
      </span>
      {hover && (
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--theme-text-muted)', fontSize: 11, padding: '0 2px', flexShrink: 0, lineHeight: 1 }}
        >×</button>
      )}
    </button>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
  color: 'var(--theme-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
