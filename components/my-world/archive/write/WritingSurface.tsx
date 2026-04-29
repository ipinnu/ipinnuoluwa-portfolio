'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ArchiveNote, ArchiveCategory, ArchiveType } from '@/lib/types/archive'
import { updateNote } from '@/lib/archive'

interface Props {
  note:       ArchiveNote | null
  allNotes:   ArchiveNote[]
  categories: ArchiveCategory[]
  types:      ArchiveType[]
  onChange:   (updated: ArchiveNote) => void
  isMobile:   boolean
}

export default function WritingSurface({ note, allNotes, categories, types, onChange, isMobile }: Props) {
  const [title,         setTitle]         = useState(note?.title   ?? '')
  const [content,       setContent]       = useState(note?.content ?? '')
  const [categoryId,    setCategoryId]    = useState<string | null>(note?.categoryId ?? null)
  const [typeId,        setTypeId]        = useState<string | null>(note?.typeId     ?? null)
  const [topic,         setTopic]         = useState(note?.topic    ?? '')
  const [saveState,     setSaveState]     = useState<'idle'|'saving'|'saved'>('idle')
  const [linkQuery,     setLinkQuery]     = useState<string | null>(null)
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [showTypePicker,setShowTypePicker]= useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteIdRef   = useRef<string | null>(null)

  // Sync when note changes
  useEffect(() => {
    if (!note) return
    if (note.id === noteIdRef.current) return
    noteIdRef.current = note.id
    setTitle(note.title)
    setContent(note.content)
    setCategoryId(note.categoryId)
    setTypeId(note.typeId)
    setTopic(note.topic ?? '')
    setSaveState('idle')
  }, [note?.id])

  const cat           = categories.find(c => c.id === categoryId)
  const availableTypes= types.filter(t => t.categoryId === categoryId)
  const wordCount     = content.trim() ? content.trim().split(/\s+/).length : 0

  const triggerSave = useCallback((patch: Partial<{
    title: string; content: string; categoryId: string | null
    typeId: string | null; topic: string | null
  }>) => {
    if (!note) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaveState('saving')
      try {
        const body    = patch.content  ?? content
        const wc      = body.trim().split(/\s+/).filter(Boolean).length
        await updateNote(note.id, { ...patch, wordCount: wc })
        const updated: ArchiveNote = {
          ...note, ...patch, wordCount: wc, updatedAt: new Date().toISOString(),
        }
        onChange(updated)
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 2000)
      } catch {
        setSaveState('idle')
      }
    }, 1000)
  }, [note, content, onChange])

  const handleContent = (val: string) => {
    setContent(val)
    triggerSave({ content: val })

    const cursor = textareaRef.current?.selectionStart ?? val.length
    const before = val.slice(0, cursor)
    const match  = before.match(/\[\[([^\]]*)$/)
    setLinkQuery(match ? match[1] : null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const meta = e.metaKey || e.ctrlKey
    if (meta && e.key === 's') e.preventDefault()
    // Escape closes link picker
    if (e.key === 'Escape') setLinkQuery(null)
  }

  const insertLink = (linked: ArchiveNote) => {
    const ta = textareaRef.current
    if (!ta) return
    const cursor    = ta.selectionStart
    const before    = content.slice(0, cursor)
    const after     = content.slice(cursor)
    const openIdx   = before.lastIndexOf('[[')
    const snippet   = `[[${linked.title}]]`
    const newContent= before.slice(0, openIdx) + snippet + after
    setContent(newContent)
    setLinkQuery(null)
    triggerSave({ content: newContent })
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = openIdx + snippet.length
      ta.focus()
    })
  }

  const linkResults = linkQuery !== null
    ? allNotes.filter(n => n.id !== note?.id && (
        n.title.toLowerCase().includes(linkQuery.toLowerCase()) ||
        linkQuery.length === 0
      )).slice(0, 7)
    : []

  if (!note) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: '#1A3028', fontStyle: 'italic' }}>
          Select a note or create a new one
        </p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', minWidth: 0 }}>
      {/* Toolbar */}
      <div style={{
        padding: '10px 24px', borderBottom: '0.5px solid rgba(29,158,117,0.08)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap',
      }}>
        {/* Category */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowCatPicker(v => !v); setShowTypePicker(false) }}
            style={{
              fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, cursor: 'pointer',
              color:      cat ? cat.colorHex : '#2A4030',
              background: cat ? `rgba(${cat.colorRgb},0.08)` : 'rgba(29,158,117,0.04)',
              border:     `0.5px solid ${cat ? `rgba(${cat.colorRgb},0.2)` : 'rgba(29,158,117,0.1)'}`,
              borderRadius: 4, padding: '4px 8px',
              filter: 'url(#liquid-glass-soft)',
            }}
          >
            {cat ? cat.name : 'Category'} ▾
          </button>
          <AnimatePresence>
            {showCatPicker && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 80,
                  background: 'rgba(5,7,12,0.97)', border: '0.5px solid rgba(29,158,117,0.15)',
                  borderRadius: 6, padding: 6, minWidth: 160,
                  backdropFilter: 'blur(20px)', filter: 'url(#liquid-glass-soft)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <CatBtn label="None" color="#444440" selected={!categoryId} onClick={() => {
                  setCategoryId(null); setTypeId(null); setShowCatPicker(false)
                  triggerSave({ categoryId: null, typeId: null })
                }} />
                {categories.map(c => (
                  <CatBtn key={c.id} label={c.name} color={c.colorHex} selected={categoryId === c.id} onClick={() => {
                    setCategoryId(c.id); setTypeId(null); setShowCatPicker(false)
                    triggerSave({ categoryId: c.id, typeId: null })
                  }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Type */}
        {categoryId && availableTypes.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowTypePicker(v => !v); setShowCatPicker(false) }}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, cursor: 'pointer',
                color: '#1A4030', background: 'rgba(29,158,117,0.05)',
                border: '0.5px solid rgba(29,158,117,0.1)',
                borderRadius: 4, padding: '4px 8px',
                filter: 'url(#liquid-glass-soft)',
              }}
            >
              {types.find(t => t.id === typeId)?.name ?? 'Type'} ▾
            </button>
            <AnimatePresence>
              {showTypePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 80,
                    background: 'rgba(5,7,12,0.97)', border: '0.5px solid rgba(29,158,117,0.15)',
                    borderRadius: 6, padding: 6, minWidth: 140,
                    backdropFilter: 'blur(20px)', filter: 'url(#liquid-glass-soft)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <CatBtn label="None" color="#444440" selected={!typeId} onClick={() => {
                    setTypeId(null); setShowTypePicker(false); triggerSave({ typeId: null })
                  }} />
                  {availableTypes.map(t => (
                    <CatBtn key={t.id} label={t.name} color="#1D9E75" selected={typeId === t.id} onClick={() => {
                      setTypeId(t.id); setShowTypePicker(false); triggerSave({ typeId: t.id })
                    }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Topic */}
        <input
          value={topic}
          onChange={e => { setTopic(e.target.value); triggerSave({ topic: e.target.value || null }) }}
          placeholder="Topic..."
          style={{
            background: 'none', border: 'none',
            borderBottom: '0.5px solid rgba(29,158,117,0.1)',
            fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1A4030',
            padding: '3px 0', outline: 'none', width: isMobile ? 70 : 110,
          }}
        />

        {/* Save state + word count */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1A3028' }}>
            {wordCount}w
          </span>
          {saveState === 'saving' && (
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1D9E75', opacity: 0.5 }}>saving…</span>
          )}
          {saveState === 'saved' && (
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1D9E75' }}>✓</span>
          )}
        </div>
      </div>

      {/* Writing area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '24px 20px' : '40px 56px', position: 'relative' }}>
        {/* Title */}
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); triggerSave({ title: e.target.value }) }}
          placeholder="Untitled thought..."
          style={{
            display: 'block', width: '100%',
            fontFamily: 'var(--font-syne)', fontSize: isMobile ? 22 : 28, fontWeight: 700,
            color: '#F5F5F0', background: 'transparent',
            border: 'none', borderBottom: '1px solid transparent',
            outline: 'none', marginBottom: 28, padding: 0, boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderBottomColor = '#1A1A24' }}
          onBlur={e =>  { e.target.style.borderBottomColor = 'transparent' }}
        />

        {/* Content textarea */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => handleContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Begin writing..."
            style={{
              display: 'block', width: '100%',
              fontFamily: 'var(--font-dm-sans)', fontSize: 16, fontWeight: 300,
              color: '#F5F5F0', lineHeight: 1.85,
              background: 'transparent', border: 'none', resize: 'none', outline: 'none',
              minHeight: 'calc(100vh - 260px)',
              caretColor: '#1D9E75',
              boxSizing: 'border-box',
            }}
          />

          {/* [[ link picker */}
          <AnimatePresence>
            {linkQuery !== null && linkResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', left: 0, top: 40, zIndex: 60,
                  background: 'rgba(5,7,12,0.97)', border: '0.5px solid rgba(29,158,117,0.25)',
                  borderRadius: 8, padding: 6, minWidth: 240, maxWidth: 340,
                  backdropFilter: 'blur(20px)', filter: 'url(#liquid-glass-soft)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1D9E75', margin: '0 0 6px 8px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Link a note
                </p>
                {linkResults.map(n => {
                  const c = categories.find(cat => cat.id === n.categoryId)
                  return (
                    <button
                      key={n.id}
                      onClick={() => insertLink(n)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer',
                        borderRadius: 4,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(29,158,117,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                    >
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#D0EDE0', display: 'block' }}>
                        {n.title || 'Untitled'}
                      </span>
                      {c && (
                        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: c.colorHex }}>
                          {c.name}
                        </span>
                      )}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dismiss overlay for pickers */}
      {(showCatPicker || showTypePicker) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 70 }}
          onClick={() => { setShowCatPicker(false); setShowTypePicker(false) }}
        />
      )}
    </div>
  )
}

function CatBtn({ label, color, selected, onClick }: { label: string; color: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left', padding: '5px 8px',
        background: selected ? 'rgba(255,255,255,0.05)' : 'none',
        border: 'none', cursor: 'pointer', borderRadius: 3,
        fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { e.currentTarget.style.background = selected ? 'rgba(255,255,255,0.05)' : 'none' }}
    >
      {label}
    </button>
  )
}
