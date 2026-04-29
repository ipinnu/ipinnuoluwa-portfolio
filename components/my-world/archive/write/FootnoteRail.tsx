'use client'

import type { ArchiveNote, Footnote, ArchiveCategory } from '@/lib/types/archive'

interface Props {
  note:       ArchiveNote | null
  allNotes:   ArchiveNote[]
  categories: ArchiveCategory[]
  onOpen:     (note: ArchiveNote) => void
  isMobile:   boolean
}

export default function FootnoteRail({ note, allNotes, categories, onOpen, isMobile }: Props) {
  const footnotes: Footnote[] = note?.aiFootnotes ?? []

  function getCategoryForNote(n: ArchiveNote) {
    return categories.find(c => c.id === n.categoryId)
  }

  return (
    <div style={{
      width:           isMobile ? '100%' : 280,
      flexShrink:      0,
      borderLeft:      '0.5px solid rgba(29,158,117,0.12)',
      backgroundColor: 'rgba(29,158,117,0.03)',
      display:         'flex',
      flexDirection:   'column',
      overflow:        'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '0.5px solid rgba(29,158,117,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            Connections
          </span>
          {footnotes.length > 0 && (
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1A4030', background: 'rgba(29,158,117,0.1)', borderRadius: 3, padding: '1px 5px' }}>
              {footnotes.length}
            </span>
          )}
        </div>
      </div>

      {/* Footnote cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
        {footnotes.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#1A3028', fontStyle: 'italic', textAlign: 'center', marginTop: 40, lineHeight: 1.65 }}>
            Write a few paragraphs and connections will appear here automatically.
          </p>
        ) : (
          footnotes.map((fn) => {
            const refNote = allNotes.find(n => n.id === fn.noteId)
            if (!refNote) return null
            const cat = getCategoryForNote(refNote)
            return (
              <div
                key={fn.noteId}
                style={{
                  background:     `rgba(${cat?.colorRgb ?? '29, 158, 117'}, 0.06)`,
                  border:         `0.5px solid rgba(${cat?.colorRgb ?? '29, 158, 117'}, 0.18)`,
                  borderRadius:   6,
                  padding:        '12px',
                  marginBottom:   10,
                  filter:         'url(#liquid-glass-soft)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: cat?.colorHex ?? '#1D9E75', fontWeight: 700 }}>
                    {fn.superscript}
                  </span>
                  {cat && (
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: cat.colorHex, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {cat.name}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-syne)', fontSize: 10, fontWeight: 600, color: '#8ABAA8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {refNote.title || 'Untitled'}
                  </span>
                </div>

                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#2A5040', lineHeight: 1.55, margin: '0 0 8px', fontStyle: 'italic' }}>
                  &ldquo;{fn.excerpt}&rdquo;
                </p>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => onOpen(refNote)}
                    style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1D9E75', background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.2)', borderRadius: 3, padding: '4px 8px', cursor: 'pointer' }}
                  >
                    → Open note
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
