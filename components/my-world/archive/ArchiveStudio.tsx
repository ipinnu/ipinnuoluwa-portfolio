'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider }   from '@/components/theme/ThemeProvider'
import { GlassFilter }     from '@/components/theme/GlassFilter'
import { AmbientLayer }    from '@/components/theme/AmbientLayer'
import { ThemeToggle }     from '@/components/theme/ThemeToggle'
import { ThemeSwitcher }   from '@/components/theme/ThemeSwitcher'

import NoteBrowser    from './write/NoteBrowser'
import WritingSurface from './write/WritingSurface'
import FootnoteRail   from './write/FootnoteRail'
import BrainGraph     from './brain/BrainGraph'
import QuickCapture   from './QuickCapture'
import ArchiveSettings from './settings/ArchiveSettings'

import type { ArchiveNote, ArchiveCategory, ArchiveType, ArchiveConnection } from '@/lib/types/archive'
import {
  fetchNotes, fetchCategories, fetchTypes, fetchConnections,
  createNote, deleteNote, updateNote,
} from '@/lib/archive'
import { scanFootnotes, analyzeClusters } from '@/lib/archive-ai'
import { useIsMobile } from '@/hooks/useIsMobile'

type Mode = 'write' | 'brain'

interface Props {
  onClose: () => void
}

export default function ArchiveStudio({ onClose }: Props) {
  return (
    <ThemeProvider section="archive">
      <Inner onClose={onClose} />
    </ThemeProvider>
  )
}

function Inner({ onClose }: Props) {
  const [notes,       setNotes]       = useState<ArchiveNote[]>([])
  const [categories,  setCategories]  = useState<ArchiveCategory[]>([])
  const [types,       setTypes]       = useState<ArchiveType[]>([])
  const [connections, setConnections] = useState<ArchiveConnection[]>([])
  const [selected,    setSelected]    = useState<ArchiveNote | null>(null)
  const [mode,        setMode]        = useState<Mode>('write')
  const [showBrowser, setShowBrowser] = useState(true)
  const [showRail,    setShowRail]    = useState(true)
  const [showCapture, setShowCapture] = useState(false)
  const [showSettings,setShowSettings]= useState(false)
  const [showThemes,  setShowThemes]  = useState(false)
  const [analyzing,   setAnalyzing]   = useState(false)
  const [loading,     setLoading]     = useState(true)
  const isMobile = useIsMobile()

  const saveCountRef  = useRef(0)
  const aiTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([fetchNotes(), fetchCategories(), fetchTypes(), fetchConnections()])
      .then(([n, c, t, conn]) => {
        setNotes(n); setCategories(c); setTypes(t); setConnections(conn)
        if (n.length > 0) setSelected(n[0])
        setLoading(false)
        // Background cluster analysis on open
        runClusterAnalysis(n, c)
      })
  }, [])

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (e.key === 'Escape') { onClose(); return }
      if (meta && e.key === 'k')          { e.preventDefault(); setShowCapture(true) }
      if (meta && e.key === '[')          { e.preventDefault(); setShowBrowser(v => !v) }
      if (meta && e.key === ']')          { e.preventDefault(); setShowRail(v => !v) }
      if (meta && e.shiftKey && e.key === 'A') { e.preventDefault(); setShowCapture(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // ── AI footnote scanner ───────────────────────────────────────────────────
  const scheduleFootnoteScan = useCallback((note: ArchiveNote) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    aiTimerRef.current = setTimeout(async () => {
      const fns = await scanFootnotes(note, notes)
      if (fns.length > 0) {
        await updateNote(note.id, { aiFootnotes: fns })
        setNotes(prev => prev.map(n => n.id === note.id ? { ...n, aiFootnotes: fns } : n))
        setSelected(prev => prev?.id === note.id ? { ...prev, aiFootnotes: fns } : prev)
      }
    }, 3000)
  }, [notes])

  // ── Cluster analysis ──────────────────────────────────────────────────────
  const runClusterAnalysis = async (ns: ArchiveNote[], cats: ArchiveCategory[]) => {
    setAnalyzing(true)
    try {
      const clusterMap = await analyzeClusters(ns)
      if (Object.keys(clusterMap).length > 0) {
        const updates = Object.entries(clusterMap).map(([id, label]) =>
          updateNote(id, { aiCluster: label })
        )
        await Promise.all(updates)
        setNotes(prev => prev.map(n => clusterMap[n.id] ? { ...n, aiCluster: clusterMap[n.id] } : n))
      }
    } finally {
      setAnalyzing(false)
    }
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    const note = await createNote()
    if (!note) return
    setNotes(prev => [note, ...prev])
    setSelected(note)
    setMode('write')
    if (isMobile) setShowBrowser(false)
  }

  const handleDelete = async (note: ArchiveNote) => {
    await deleteNote(note.id)
    setNotes(prev => prev.filter(n => n.id !== note.id))
    if (selected?.id === note.id) setSelected(notes.find(n => n.id !== note.id) ?? null)
  }

  const handleNoteChange = (updated: ArchiveNote) => {
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
    setSelected(updated)
    saveCountRef.current++
    scheduleFootnoteScan(updated)
    // Cluster analysis every 5 saves
    if (saveCountRef.current % 5 === 0) {
      runClusterAnalysis([...notes.map(n => n.id === updated.id ? updated : n)], categories)
    }
  }

  const handleCapture = (note: ArchiveNote) => {
    setNotes(prev => [note, ...prev])
    setShowCapture(false)
  }

  const handleOpenNote = (note: ArchiveNote) => {
    const full = notes.find(n => n.id === note.id) ?? note
    setSelected(full)
    setMode('write')
    if (isMobile) setShowBrowser(false)
  }

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#06060E', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#1D9E75', letterSpacing: '0.18em' }}>
          Loading archive…
        </span>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#06060E', zIndex: 60, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <GlassFilter />
      <AmbientLayer />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        height: 44, flexShrink: 0, background: '#080810',
        borderBottom: '0.5px solid rgba(29,158,117,0.1)',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
      }}>
        {/* Close */}
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#2A4030', padding: '4px 0' }}>
          ← My World
        </button>

        {/* Divider */}
        <span style={{ color: '#1A2820', fontSize: 10 }}>|</span>

        {/* Archive label */}
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          The Archive
        </span>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 12, background: 'rgba(29,158,117,0.05)', borderRadius: 5, padding: 3, border: '0.5px solid rgba(29,158,117,0.1)' }}>
          {(['write', 'brain'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, cursor: 'pointer',
                color: mode === m ? '#1D9E75' : '#1A3028',
                background: mode === m ? 'rgba(29,158,117,0.12)' : 'none',
                border: 'none', borderRadius: 3, padding: '3px 8px', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                filter: mode === m ? 'url(#liquid-glass-soft)' : 'none',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Quick capture */}
        <button
          onClick={() => setShowCapture(true)}
          title="Quick capture (⌘K)"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#2A4030' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </button>

        {/* Theme switcher toggle */}
        <button
          onClick={() => setShowThemes(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#2A4030' }}
          title="Theme"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 0-20z"/>
          </svg>
        </button>

        <ThemeToggle />
      </div>

      {/* Theme switcher dropdown */}
      <AnimatePresence>
        {showThemes && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 70 }} onClick={() => setShowThemes(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: 48, right: 56, zIndex: 71 }}
            >
              <ThemeSwitcher />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {mode === 'write' ? (
          <motion.div
            key="write"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}
          >
            {/* Note browser — desktop always visible, mobile toggles */}
            <AnimatePresence>
              {(showBrowser || !isMobile) && (
                <motion.div
                  key="browser"
                  initial={isMobile ? { x: -280 } : false}
                  animate={{ x: 0 }} exit={{ x: -280 }}
                  style={{
                    width: isMobile ? '100%' : 240, flexShrink: 0,
                    borderRight: '0.5px solid rgba(29,158,117,0.1)',
                    position: isMobile ? 'absolute' : 'relative',
                    inset: isMobile ? 0 : undefined,
                    zIndex: isMobile ? 50 : 'auto',
                    background: isMobile ? '#06060E' : 'transparent',
                    height: '100%', overflow: 'hidden',
                  }}
                >
                  <NoteBrowser
                    notes={notes} categories={categories} types={types}
                    selected={selected} onSelect={n => { setSelected(n); if (isMobile) setShowBrowser(false) }}
                    onCreate={handleCreate} onDelete={handleDelete}
                    onSettings={() => setShowSettings(true)}
                    isMobile={isMobile}
                    onClose={() => setShowBrowser(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile: browser toggle button */}
            {isMobile && !showBrowser && (
              <button
                onClick={() => setShowBrowser(true)}
                style={{
                  position: 'absolute', top: 12, left: 12, zIndex: 40,
                  background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.2)',
                  borderRadius: 4, padding: '6px 10px', cursor: 'pointer',
                  fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75',
                }}
              >
                ☰ Notes
              </button>
            )}

            {/* Writing surface */}
            <WritingSurface
              note={selected} allNotes={notes}
              categories={categories} types={types}
              onChange={handleNoteChange}
              isMobile={isMobile}
            />

            {/* Footnote rail — desktop right panel, mobile bottom drawer */}
            {!isMobile && showRail && (
              <FootnoteRail
                note={selected} allNotes={notes}
                categories={categories}
                onOpen={handleOpenNote}
                isMobile={false}
              />
            )}

            {/* Mobile footnote drawer */}
            {isMobile && selected?.aiFootnotes && selected.aiFootnotes.length > 0 && (
              <AnimatePresence>
                {showRail && (
                  <motion.div
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30 }}
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
                      maxHeight: '50%', background: '#06060E',
                      borderTop: '0.5px solid rgba(29,158,117,0.15)',
                    }}
                  >
                    <button
                      onClick={() => setShowRail(false)}
                      style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#2A4030', fontSize: 16 }}
                    >
                      ×
                    </button>
                    <FootnoteRail note={selected} allNotes={notes} categories={categories} onOpen={handleOpenNote} isMobile />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            {isMobile && selected?.aiFootnotes && selected.aiFootnotes.length > 0 && !showRail && (
              <button
                onClick={() => setShowRail(true)}
                style={{
                  position: 'absolute', bottom: 16, right: 16, zIndex: 40,
                  background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.2)',
                  borderRadius: 4, padding: '6px 10px', cursor: 'pointer',
                  fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#1D9E75',
                }}
              >
                {selected.aiFootnotes.length} connections
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="brain"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
          >
            <BrainGraph
              notes={notes} categories={categories}
              connections={connections} analyzing={analyzing}
              onOpenNote={handleOpenNote}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Overlays ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCapture && (
          <QuickCapture
            key="qc"
            categories={categories} types={types}
            onCapture={handleCapture} onClose={() => setShowCapture(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <ArchiveSettings
            key="settings"
            categories={categories} types={types}
            onClose={() => setShowSettings(false)}
            onCatAdded={cat   => setCategories(prev => [...prev, cat])}
            onCatDeleted={id  => setCategories(prev => prev.filter(c => c.id !== id))}
            onTypeAdded={type => setTypes(prev => [...prev, type])}
            onTypeDeleted={id => setTypes(prev => prev.filter(t => t.id !== id))}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
