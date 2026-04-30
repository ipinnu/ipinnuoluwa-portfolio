'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ArchiveCategory, ArchiveType } from '@/lib/types/archive'
import { createType, deleteType } from '@/lib/archive'
import { createClient } from '@supabase/supabase-js'
import CategoryEditor from './CategoryEditor'
import TypeEditor from './TypeEditor'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  categories:     ArchiveCategory[]
  types:          ArchiveType[]
  onClose:        () => void
  onCatAdded:     (cat: ArchiveCategory) => void
  onCatDeleted:   (id: string) => void
  onTypeAdded:    (type: ArchiveType) => void
  onTypeDeleted:  (id: string) => void
}

type Tab = 'categories' | 'types'

export default function ArchiveSettings({ categories, types, onClose, onCatAdded, onCatDeleted, onTypeAdded, onTypeDeleted }: Props) {
  const [tab, setTab] = useState<Tab>('categories')

  const handleAddCat = async (name: string, colorHex: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()
    const r   = hexToRgb(colorHex)
    const { data, error } = await supabase
      .from('archive_categories')
      .insert({ id, name, color_hex: colorHex, color_rgb: r, is_default: false, display_order: categories.length + 1 })
      .select().single()
    if (error || !data) return
    onCatAdded({ id: data.id, name: data.name, colorHex: data.color_hex, colorRgb: data.color_rgb, isDefault: false, displayOrder: data.display_order })
  }

  const handleDeleteCat = async (id: string) => {
    const { error } = await supabase.from('archive_categories').delete().eq('id', id)
    if (!error) onCatDeleted(id)
  }

  const handleAddType = async (categoryId: string, name: string) => {
    const type = await createType(categoryId, name)
    if (type) onTypeAdded(type)
  }

  const handleDeleteType = async (id: string) => {
    await deleteType(id)
    onTypeDeleted(id)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{    opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 91,
          width: 'min(500px, calc(100vw - 32px))', maxHeight: '80vh',
          background: 'var(--theme-bg)', backdropFilter: 'blur(24px)',
          border: '0.5px solid var(--theme-border)',
          borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 80px var(--theme-shadow)',
          filter: 'url(#liquid-glass-soft)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '0.5px solid rgba(var(--theme-primary-rgb),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--theme-primary)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            Archive Settings
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--theme-text-muted)', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(var(--theme-primary-rgb),0.1)', flexShrink: 0 }}>
          {(['categories', 'types'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9,
                color: tab === t ? 'var(--theme-primary)' : '#1A3028',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 16px', letterSpacing: '0.1em', textTransform: 'uppercase',
                borderBottom: tab === t ? '1px solid var(--theme-primary)' : '1px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <AnimatePresence mode="wait">
            {tab === 'categories' ? (
              <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CategoryEditor categories={categories} onAdd={handleAddCat} onDelete={handleDeleteCat} />
              </motion.div>
            ) : (
              <motion.div key="typ" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TypeEditor categories={categories} types={types} onAdd={handleAddType} onDelete={handleDeleteType} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
