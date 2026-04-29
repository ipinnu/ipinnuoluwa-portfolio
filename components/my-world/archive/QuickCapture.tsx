'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ArchiveCategory, ArchiveType } from '@/lib/types/archive'
import { createNote } from '@/lib/archive'
import type { ArchiveNote } from '@/lib/types/archive'

interface Props {
  categories: ArchiveCategory[]
  types:      ArchiveType[]
  onCapture:  (note: ArchiveNote) => void
  onClose:    () => void
}

export default function QuickCapture({ categories, types, onCapture, onClose }: Props) {
  const [text,       setText]       = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId,     setTypeId]     = useState<string | null>(null)
  const [saving,     setSaving]     = useState(false)
  const [toast,      setToast]      = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const availableTypes = types.filter(t => t.categoryId === categoryId)
  const cat = categories.find(c => c.id === categoryId)

  const handleSave = async () => {
    if (!text.trim()) return
    setSaving(true)
    const note = await createNote({ categoryId: categoryId ?? undefined, typeId: typeId ?? undefined, content: text.trim() })
    setSaving(false)
    if (note) {
      onCapture(note)
      setToast(true)
      setTimeout(() => { setToast(false); onClose() }, 1500)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{    opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 91,
          width: 'min(480px, calc(100vw - 32px))',
          background: 'rgba(6,8,14,0.97)', backdropFilter: 'blur(24px)',
          border: '0.5px solid rgba(29,158,117,0.25)',
          borderRadius: 10, padding: '24px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          filter: 'url(#liquid-glass-soft)',
        }}
      >
        {/* Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            Quick Capture
          </span>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1A3028', marginLeft: 'auto' }}>esc to close</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handleSave() } }}
          placeholder="✦ Capture a thought..."
          rows={4}
          style={{
            display: 'block', width: '100%',
            fontFamily: 'var(--font-dm-sans)', fontSize: 16, fontWeight: 300,
            color: '#F5F5F0', lineHeight: 1.7,
            background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(29,158,117,0.1)',
            borderRadius: 6, padding: '12px 14px', outline: 'none', resize: 'none',
            caretColor: '#1D9E75', boxSizing: 'border-box',
          }}
        />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          {/* Category */}
          <select
            value={categoryId ?? ''}
            onChange={e => { setCategoryId(e.target.value || null); setTypeId(null) }}
            style={{
              fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9,
              color: cat ? cat.colorHex : '#2A4030',
              background: 'rgba(29,158,117,0.05)',
              border: '0.5px solid rgba(29,158,117,0.1)',
              borderRadius: 4, padding: '4px 8px', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="">Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Type */}
          {availableTypes.length > 0 && (
            <select
              value={typeId ?? ''}
              onChange={e => setTypeId(e.target.value || null)}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1A4030',
                background: 'rgba(29,158,117,0.05)',
                border: '0.5px solid rgba(29,158,117,0.1)',
                borderRadius: 4, padding: '4px 8px', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="">Type</option>
              {availableTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Close */}
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1A3028', padding: '4px 8px' }}
          >
            ×
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!text.trim() || saving}
            style={{
              fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9,
              color: '#080810', background: '#1D9E75',
              border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer',
              opacity: (!text.trim() || saving) ? 0.4 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', bottom: 24, right: 24, zIndex: 100,
              fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#1D9E75',
              background: 'rgba(6,8,14,0.95)', border: '0.5px solid rgba(29,158,117,0.2)',
              borderRadius: 6, padding: '8px 14px',
            }}
          >
            Thought captured
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
