'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { useIsMobile } from '@/hooks/useIsMobile'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { GlassFilter } from '@/components/theme/GlassFilter'
import { AmbientLayer } from '@/components/theme/AmbientLayer'

// ─── Supabase ─────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: string
  title: string
  slug: string | null
  content: string
  summary: string
  cover_image_url: string | null
  tags: string[]
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  published_at: string | null
}

interface VaultItem {
  id: string
  article_id: string | null
  article_title: string
  platform: 'twitter' | 'linkedin' | 'instagram'
  content: string
  status: 'ready' | 'posted'
  created_at: string
  posted_at: string | null
}

type StudioMode = 'write' | 'distribute' | 'vault'

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORMS = {
  twitter: {
    label: 'Twitter / X',
    color: '#E8E8E0',
    limit: 280,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    openApp: (text: string) => {
      const tweets = text.split(/\n\n(?=\d+\/)/)
      const first = tweets[0]?.replace(/^\d+\/\s*/, '').trim().slice(0, 270) ?? text.slice(0, 270)
      navigator.clipboard.writeText(text)
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(first)}`, '_blank')
    },
    hint: 'First tweet pre-filled · full thread copied to clipboard',
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    limit: 3000,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    openApp: (text: string) => {
      navigator.clipboard.writeText(text)
      window.open('https://www.linkedin.com/feed/', '_blank')
    },
    hint: 'Post copied to clipboard · paste in LinkedIn',
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    limit: 2200,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    openApp: (text: string) => {
      navigator.clipboard.writeText(text)
      // Try app deep link first, fall back to web
      const isIOS = /iPhone|iPad/i.test(navigator.userAgent)
      const isAndroid = /Android/i.test(navigator.userAgent)
      if (isIOS || isAndroid) {
        window.location.href = 'instagram://camera'
        setTimeout(() => window.open('https://www.instagram.com/', '_blank'), 500)
      } else {
        window.open('https://www.instagram.com/', '_blank')
      }
    },
    hint: 'Caption copied · paste when you open Instagram',
  },
} as const

// ─── Markdown preview ─────────────────────────────────────────────────────────

function parseMarkdown(md: string): string {
  const escaped = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = escaped.split('\n')
  const out: string[] = []
  for (const line of lines) {
    if (/^### /.test(line)) { out.push(`<h3>${inlineMd(line.slice(4))}</h3>`); continue }
    if (/^## /.test(line))  { out.push(`<h2>${inlineMd(line.slice(3))}</h2>`); continue }
    if (/^# /.test(line))   { out.push(`<h1>${inlineMd(line.slice(2))}</h1>`); continue }
    if (/^&gt; /.test(line)) { out.push(`<blockquote>${inlineMd(line.slice(5))}</blockquote>`); continue }
    if (/^---$/.test(line))  { out.push('<hr />'); continue }
    if (line.trim() === '')  { out.push('<br />'); continue }
    out.push(`<p>${inlineMd(line)}</p>`)
  }
  return out.join('\n')
}

function inlineMd(s: string): string {
  return s
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:6px" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#A3C4B4">$1</a>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="font-family:var(--font-jetbrains-mono);font-size:0.875em;background:rgba(255,255,255,0.06);padding:1px 5px;border-radius:3px">$1</code>')
}

// ─── Password gate ────────────────────────────────────────────────────────────

function ChronicleGate({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const key = process.env.NEXT_PUBLIC_CHRONICLE_KEY ?? ''
    const correct = key ? btoa(value) === key : value === 'chronicle'
    if (correct) { onSuccess() } else {
      setShake(true)
      setTimeout(() => { setShake(false); setValue('') }, 600)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(14px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#080810', border: '0.5px solid #1A1A24', borderRadius: 10, padding: '36px 32px', width: 300, textAlign: 'center' }}
      >
        <div style={{ marginBottom: 20 }}>
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" style={{ margin: '0 auto', opacity: 0.45 }}>
            <path d="M11 1C12.2 1 13 1.8 13 3C13 4.2 12 5 10.5 6.5L4.5 12.5L2 13L2.5 10.5L8.5 4.5C10 3 10.8 2 11 1Z" fill="#A3C4B4"/>
            <path d="M2 13L2.5 10.5L4 12L2 13Z" fill="#A3C4B4"/>
          </svg>
        </div>
        <form onSubmit={handleSubmit}>
          <motion.input
            ref={inputRef} type="password" value={value}
            onChange={e => setValue(e.target.value)} placeholder="..."
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
            style={{ width: '100%', background: '#0D0D18', border: '0.5px solid #1A1A20', borderRadius: 4, padding: '10px 14px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 14, color: '#F5F5F0', textAlign: 'center', letterSpacing: '0.2em', outline: 'none' }}
          />
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Article list item ────────────────────────────────────────────────────────

function ArticleItem({ article, selected, onSelect, onDelete }: { article: Article; selected: boolean; onSelect: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{ padding: '8px 10px', borderRadius: 5, cursor: 'pointer', backgroundColor: selected ? '#0E0E1A' : hovered ? '#0A0A14' : 'transparent', border: `0.5px solid ${selected ? '#1C1C28' : 'transparent'}`, transition: 'background-color 0.12s', display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 2 }}
    >
      <div style={{ width: 5, height: 5, borderRadius: '50%', marginTop: 5, flexShrink: 0, backgroundColor: article.status === 'published' ? '#22c55e' : '#383838' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: selected ? '#E8E8E0' : '#666660', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: selected ? 500 : 400 }}>
          {article.title || 'Untitled'}
        </p>
        <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#282828', margin: '2px 0 0' }}>
          {new Date(article.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
      {hovered && (
        <button onClick={e => { e.stopPropagation(); onDelete() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2A2A28', padding: '0 2px', fontSize: 12, lineHeight: 1, flexShrink: 0 }}>×</button>
      )}
    </div>
  )
}

// ─── Tag chip ─────────────────────────────────────────────────────────────────

function TagChip({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#A3C4B4', background: 'rgba(163,196,180,0.07)', border: '0.5px solid rgba(163,196,180,0.18)', padding: '3px 7px', borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {tag}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555550', padding: 0, lineHeight: 1, fontSize: 11 }}>×</button>
    </span>
  )
}

// ─── Platform card (Distribute panel) ────────────────────────────────────────

function PlatformCard({
  platform, content, onContentChange, onPost, onSave, onRegen, saving, regening,
}: {
  platform: keyof typeof PLATFORMS
  content: string
  onContentChange: (v: string) => void
  onPost: () => void
  onSave: () => void
  onRegen: () => void
  saving: boolean
  regening: boolean
}) {
  const cfg = PLATFORMS[platform]
  const count = content.length
  const over = count > cfg.limit

  return (
    <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', borderRight: platform !== 'instagram' ? '0.5px solid #0E0E18' : undefined }}>
      {/* Platform header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '0.5px solid #0E0E18', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ color: cfg.color, opacity: 0.85 }}>{cfg.icon}</span>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#3A3A38', letterSpacing: '0.08em' }}>{cfg.label}</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: over ? '#ef4444' : '#282828', marginRight: 8 }}>
          {count}/{cfg.limit}
        </span>
        <button
          onClick={onRegen}
          disabled={regening}
          title="Regenerate this platform"
          style={{ background: 'none', border: '0.5px solid #141420', borderRadius: 3, padding: '2px 6px', cursor: regening ? 'default' : 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: regening ? '#A3C4B4' : '#333330' }}
        >
          {regening ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>↻</motion.span>
          ) : '↻'}
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={e => onContentChange(e.target.value)}
        placeholder={`${cfg.label} content will appear here after adapting...`}
        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none', padding: '16px', fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#777770', lineHeight: 1.75, minHeight: 260 }}
      />

      {/* Actions */}
      <div style={{ padding: '10px 14px', borderTop: '0.5px solid #0A0A14', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#222220', margin: 0, lineHeight: 1.5 }}>{cfg.hint}</p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={onPost}
            disabled={!content}
            style={{ flex: 1, padding: '7px 10px', background: content ? `${cfg.color}18` : '#0A0A0A', border: `0.5px solid ${content ? `${cfg.color}40` : '#111118'}`, borderRadius: 4, cursor: content ? 'pointer' : 'default', fontFamily: 'var(--font-dm-sans)', fontSize: 11, fontWeight: 500, color: content ? cfg.color : '#2A2A28' }}
          >
            → Post
          </button>
          <button
            onClick={onSave}
            disabled={!content || saving}
            style={{ padding: '7px 10px', background: 'none', border: '0.5px solid #141420', borderRadius: 4, cursor: content ? 'pointer' : 'default', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: saving ? '#A3C4B4' : '#2A2A28' }}
          >
            {saving ? '✓' : '💾'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Vault panel ──────────────────────────────────────────────────────────────

function VaultPanel({ items, onMarkPosted, onDelete }: {
  items: VaultItem[]
  onMarkPosted: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [filter, setFilter] = useState<'all' | 'twitter' | 'linkedin' | 'instagram' | 'ready' | 'posted'>('all')

  const filtered = items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'ready' || filter === 'posted') return item.status === filter
    return item.platform === filter
  })

  const PLATFORM_COLORS = { twitter: '#E8E8E0', linkedin: '#0A66C2', instagram: '#E1306C' }
  const FILTER_OPTS = ['all', 'ready', 'posted', 'twitter', 'linkedin', 'instagram'] as const

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Filters */}
      <div style={{ padding: '12px 20px', borderBottom: '0.5px solid #0E0E18', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTER_OPTS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: '3px 10px', borderRadius: 20, border: `0.5px solid ${filter === f ? '#A3C4B4' : '#161620'}`, background: filter === f ? 'rgba(163,196,180,0.08)' : 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: filter === f ? '#A3C4B4' : '#333330', textTransform: 'capitalize' }}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#222220', alignSelf: 'center' }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#1E1E1C' }}>Nothing here yet.</p>
          </div>
        )}
        {filtered.map(item => {
          const cfg = PLATFORMS[item.platform]
          return (
            <div
              key={item.id}
              style={{ background: '#08080F', border: '0.5px solid #111118', borderRadius: 7, padding: '14px 16px', opacity: item.status === 'posted' ? 0.5 : 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ color: PLATFORM_COLORS[item.platform], display: 'flex' }}>{cfg.icon}</span>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330' }}>{item.article_title || 'Untitled'}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: item.status === 'posted' ? '#22c55e' : '#A3C4B4' }} />
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: item.status === 'posted' ? '#22c55e' : '#A3C4B4' }}>{item.status}</span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#555550', margin: '0 0 12px', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {item.content}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {item.status === 'ready' && (
                  <button
                    onClick={() => { cfg.openApp(item.content); onMarkPosted(item.id) }}
                    style={{ padding: '5px 12px', background: `${PLATFORM_COLORS[item.platform]}18`, border: `0.5px solid ${PLATFORM_COLORS[item.platform]}40`, borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 11, fontWeight: 500, color: PLATFORM_COLORS[item.platform] }}
                  >
                    → Post
                  </button>
                )}
                {item.status === 'ready' && (
                  <button
                    onClick={() => onMarkPosted(item.id)}
                    style={{ padding: '5px 10px', background: 'none', border: '0.5px solid #141420', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330' }}
                  >
                    mark posted
                  </button>
                )}
                <button
                  onClick={() => onDelete(item.id)}
                  style={{ marginLeft: 'auto', padding: '5px 10px', background: 'none', border: '0.5px solid #141420', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#222220' }}
                >
                  delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Chronicle Studio ─────────────────────────────────────────────────────────

export default function ChronicleStudio({ onClose }: { onClose: () => void }) {
  const [authed, setAuthed] = useState(false)
  const [mode, setMode] = useState<StudioMode>('write')

  // Articles
  const [articles, setArticles] = useState<Article[]>([])
  const [selected, setSelected] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)

  // Editor fields
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  // Write UI
  const [preview, setPreview] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [tagInput, setTagInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Distribute
  const [adapted, setAdapted] = useState<{ twitter: string; linkedin: string; instagram: string } | null>(null)
  const [adapting, setAdapting] = useState(false)
  const [adaptError, setAdaptError] = useState<string | null>(null)
  const [regenPlatform, setRegenPlatform] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [savingPlatform, setSavingPlatform] = useState<string | null>(null)

  // Vault
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([])

  // Mobile
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Refs
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef({ title, content, summary, tags, status, coverUrl, selected })
  useEffect(() => { editorRef.current = { title, content, summary, tags, status, coverUrl, selected } }, [title, content, summary, tags, status, coverUrl, selected])

  // Collapse sidebar on mobile when article selected; reopen when nothing selected
  useEffect(() => {
    if (isMobile) setSidebarOpen(!selected)
  }, [selected?.id, isMobile])

  // Load on auth
  useEffect(() => {
    if (!authed) return
    loadArticles()
    loadVault()
  }, [authed])

  const loadArticles = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('chronicle_articles').select('*').order('updated_at', { ascending: false })
    if (!error && data) setArticles(data as Article[])
    setLoading(false)
  }

  const loadVault = async () => {
    const { data } = await supabase.from('social_vault').select('*').order('created_at', { ascending: false })
    if (data) setVaultItems(data as VaultItem[])
  }

  // Populate editor when article changes
  useEffect(() => {
    if (!selected) return
    setTitle(selected.title)
    setContent(selected.content)
    setSummary(selected.summary || '')
    setTags(selected.tags || [])
    setStatus(selected.status)
    setCoverUrl(selected.cover_image_url ?? null)
    setPreview(false)
    setSaveState('idle')
    setAdapted(null)
  }, [selected?.id])

  // ── Save ──────────────────────────────────────────────────────────────────

  const doSave = useCallback(async () => {
    const { title, content, summary, tags, status, coverUrl, selected } = editorRef.current
    if (!selected) return
    const slug = selected.slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || null
    const updates = { title, content, summary, tags, status, cover_image_url: coverUrl, slug, updated_at: new Date().toISOString(), published_at: status === 'published' && !selected.published_at ? new Date().toISOString() : selected.published_at }
    const { data, error } = await supabase.from('chronicle_articles').update(updates).eq('id', selected.id).select().single()
    if (error) {
      console.error('chronicle save failed:', error.message, error.code)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 4000)
      return
    }
    if (data) setArticles(prev => prev.map(a => a.id === (data as Article).id ? data as Article : a))
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2500)
  }, [])

  const triggerSave = useCallback(() => {
    if (!editorRef.current.selected) return
    clearTimeout(saveTimerRef.current)
    setSaveState('saving')
    saveTimerRef.current = setTimeout(doSave, 1500)
  }, [doSave])

  const forceSave = useCallback(() => { clearTimeout(saveTimerRef.current); doSave() }, [doSave])

  // ── Create / Delete ───────────────────────────────────────────────────────

  const createArticle = async () => {
    const now = new Date().toISOString()
    const { data, error } = await supabase.from('chronicle_articles').insert({ title: '', content: '', summary: '', tags: [], status: 'draft', created_at: now, updated_at: now }).select().single()
    if (error) { alert(`Couldn't create article: ${error.message}`); return }
    if (data) { const a = data as Article; setArticles(prev => [a, ...prev]); setSelected(a); setMode('write') }
  }

  const deleteArticle = async (article: Article) => {
    if (!window.confirm(`Delete "${article.title || 'Untitled'}"?`)) return
    await supabase.from('chronicle_articles').delete().eq('id', article.id)
    setArticles(prev => prev.filter(a => a.id !== article.id))
    if (selected?.id === article.id) setSelected(null)
  }

  // ── Image uploads ─────────────────────────────────────────────────────────

  const uploadCover = async (file: File) => {
    const path = `covers/${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const { data, error } = await supabase.storage.from('chronicle-images').upload(path, file, { contentType: file.type })
    if (!error && data) { const { data: { publicUrl } } = supabase.storage.from('chronicle-images').getPublicUrl(data.path); setCoverUrl(publicUrl); triggerSave() }
  }

  const uploadInlineImage = async (file: File) => {
    setUploadingImage(true)
    const path = `inline/${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const { data, error } = await supabase.storage.from('chronicle-images').upload(path, file, { contentType: file.type })
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('chronicle-images').getPublicUrl(data.path)
      const ta = textareaRef.current
      if (ta) {
        const start = ta.selectionStart; const end = ta.selectionEnd
        const inserted = `\n![image](${publicUrl})\n`
        const next = content.slice(0, start) + inserted + content.slice(end)
        setContent(next)
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + inserted.length; ta.focus() }, 0)
      }
      triggerSave()
    }
    setUploadingImage(false)
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current!
    const start = ta.selectionStart; const end = ta.selectionEnd; const sel = content.slice(start, end)
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); forceSave(); return }
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault(); const text = sel || 'bold'
      setContent(content.slice(0, start) + `**${text}**` + content.slice(end))
      setTimeout(() => { ta.selectionStart = start + 2; ta.selectionEnd = start + 2 + text.length }, 0); return
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault(); const text = sel || 'italic'
      setContent(content.slice(0, start) + `*${text}*` + content.slice(end))
      setTimeout(() => { ta.selectionStart = start + 1; ta.selectionEnd = start + 1 + text.length }, 0); return
    }
    if (e.key === 'Tab') { e.preventDefault(); setContent(content.slice(0, start) + '  ' + content.slice(end)); setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2 }, 0) }
  }

  // ── Tags ──────────────────────────────────────────────────────────────────

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/,/g, '')
    if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); triggerSave() }
    setTagInput('')
  }

  // ── Adapt with AI ─────────────────────────────────────────────────────────

  const adaptContent = async () => {
    if (!selected) return
    setAdapting(true)
    setAdaptError(null)
    try {
      const res = await fetch('/api/adapt-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, summary, note }),
      })
      const data = await res.json()
      if (data.error) { setAdaptError(data.error); return }
      setAdapted({ twitter: data.twitter ?? '', linkedin: data.linkedin ?? '', instagram: data.instagram ?? '' })
    } catch {
      setAdaptError('Network error — check connection')
    } finally {
      setAdapting(false)
    }
  }

  const regenOne = async (platform: 'twitter' | 'linkedin' | 'instagram') => {
    if (!selected) return
    setRegenPlatform(platform)
    setAdaptError(null)
    try {
      const res = await fetch('/api/adapt-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, summary, note, platform }),
      })
      const data = await res.json()
      if (data.error) { setAdaptError(data.error); return }
      setAdapted(prev => prev ? { ...prev, [platform]: data[platform] ?? '' } : { twitter: '', linkedin: '', instagram: '', [platform]: data[platform] ?? '' })
    } catch {
      setAdaptError('Network error — check connection')
    } finally {
      setRegenPlatform(null)
    }
  }

  // ── Save to vault ─────────────────────────────────────────────────────────

  const saveToVault = async (platform: keyof typeof PLATFORMS, content: string) => {
    setSavingPlatform(platform)
    const { data, error } = await supabase.from('social_vault').insert({
      article_id: selected?.id ?? null,
      article_title: title || 'Untitled',
      platform,
      content,
      status: 'ready',
    }).select().single()
    if (!error && data) setVaultItems(prev => [data as VaultItem, ...prev])
    setTimeout(() => setSavingPlatform(null), 1200)
  }

  // ── Vault actions ─────────────────────────────────────────────────────────

  const markPosted = async (id: string) => {
    await supabase.from('social_vault').update({ status: 'posted', posted_at: new Date().toISOString() }).eq('id', id)
    setVaultItems(prev => prev.map(v => v.id === id ? { ...v, status: 'posted' as const, posted_at: new Date().toISOString() } : v))
  }

  const deleteVaultItem = async (id: string) => {
    await supabase.from('social_vault').delete().eq('id', id)
    setVaultItems(prev => prev.filter(v => v.id !== id))
  }

  // ── Misc ──────────────────────────────────────────────────────────────────

  const wordCount = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content])
  const drafts    = articles.filter(a => a.status === 'draft')
  const published = articles.filter(a => a.status === 'published')
  const readyCount = vaultItems.filter(v => v.status === 'ready').length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (preview) { setPreview(false); return } onClose() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview, onClose])

  // ─────────────────────────────────────────────────────────────────────────

  if (!authed) {
    return <AnimatePresence><ChronicleGate onSuccess={() => setAuthed(true)} onClose={onClose} /></AnimatePresence>
  }

  return (
    <ThemeProvider section="chronicle">
    <GlassFilter />
    <AmbientLayer />
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50"
      style={{ backgroundColor: '#06060E', display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Header ── */}
      <div style={{ height: 46, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: '0.5px solid #0E0E18' }}>
        {/* Left: logo + mode tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.4 }}>
              <path d="M11 1C12.2 1 13 1.8 13 3C13 4.2 12 5 10.5 6.5L4.5 12.5L2 13L2.5 10.5L8.5 4.5C10 3 10.8 2 11 1Z" fill="#A3C4B4"/>
              <path d="M2 13L2.5 10.5L4 12L2 13Z" fill="#A3C4B4"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#3A3A38', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Chronicle</span>
          </div>

          <div style={{ display: 'flex', gap: 2 }}>
            {(['write', 'distribute', 'vault'] as StudioMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{ padding: '3px 10px', borderRadius: 4, border: `0.5px solid ${mode === m ? '#A3C4B4' : '#1A1A24'}`, background: mode === m ? 'rgba(163,196,180,0.08)' : 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: mode === m ? '#A3C4B4' : '#666660', textTransform: 'capitalize', position: 'relative' }}
              >
                {m}
                {m === 'vault' && readyCount > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: '#A3C4B4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 7, color: '#06060E', fontWeight: 700 }}>
                    {readyCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: contextual controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {mode === 'write' && selected && (
            <>
              {!isMobile && <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#282828' }}>{wordCount} words</span>}
              <AnimatePresence mode="wait">
                {saveState !== 'idle' && (
                  <motion.span key={saveState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: saveState === 'saved' ? '#A3C4B4' : saveState === 'error' ? '#ef4444' : '#333330' }}>
                    {saveState === 'saving' ? 'saving...' : saveState === 'error' ? '✗ save failed' : '✓ saved'}
                  </motion.span>
                )}
              </AnimatePresence>
              <button onClick={() => setPreview(p => !p)} style={{ background: preview ? 'rgba(163,196,180,0.09)' : 'none', border: `0.5px solid ${preview ? 'rgba(163,196,180,0.28)' : '#181820'}`, borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: preview ? '#A3C4B4' : '#3A3A38' }}>
                {preview ? '✎ write' : '◎ preview'}
              </button>
            </>
          )}
          {isMobile && mode !== 'vault' && (
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{ background: sidebarOpen ? 'rgba(163,196,180,0.08)' : 'none', border: `0.5px solid ${sidebarOpen ? 'rgba(163,196,180,0.2)' : '#1A1A24'}`, borderRadius: 4, padding: '4px 9px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, color: sidebarOpen ? '#A3C4B4' : '#444440', lineHeight: 1 }}
            >
              ≡
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#2A2A28' }}>esc ×</button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ── Sidebar (Write + Distribute modes) ── */}
        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && mode !== 'vault' && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'absolute', inset: 0, zIndex: 19, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(2px)' }}
          />
        )}
        {mode !== 'vault' && (!isMobile || sidebarOpen) && (
          <div style={{
            width: isMobile ? '82vw' : 216,
            flexShrink: 0,
            borderRight: '0.5px solid #0E0E18',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ...(isMobile ? {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              zIndex: 20,
              backgroundColor: '#06060E',
            } : {}),
          }}>
            <div style={{ padding: '10px 10px 6px' }}>
              <button onClick={createArticle} style={{ width: '100%', padding: '7px 10px', background: 'rgba(163,196,180,0.06)', border: '0.5px solid rgba(163,196,180,0.18)', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#A3C4B4' }}>
                <span style={{ fontSize: 15, lineHeight: 1, marginTop: -1 }}>+</span> New Article
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 6px 12px' }}>
              {loading && <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#282828', textAlign: 'center', padding: '20px 0' }}>loading...</p>}
              {!loading && articles.length === 0 && <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#1E1E1C', textAlign: 'center', padding: '28px 12px', lineHeight: 1.7 }}>No articles yet.<br/>Hit + to start.</p>}
              {drafts.length > 0 && (<><p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#242420', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '10px 4px 4px', userSelect: 'none' }}>Drafts</p>{drafts.map(a => <ArticleItem key={a.id} article={a} selected={selected?.id === a.id} onSelect={() => setSelected(a)} onDelete={() => deleteArticle(a)} />)}</>)}
              {published.length > 0 && (<><p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 8, color: '#242420', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '12px 4px 4px', userSelect: 'none' }}>Published</p>{published.map(a => <ArticleItem key={a.id} article={a} selected={selected?.id === a.id} onSelect={() => setSelected(a)} onDelete={() => deleteArticle(a)} />)}</>)}
            </div>
          </div>
        )}

        {/* ── Write mode ── */}
        {mode === 'write' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!selected && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.1, marginBottom: 14 }}>
                  <path d="M11 1C12.2 1 13 1.8 13 3C13 4.2 12 5 10.5 6.5L4.5 12.5L2 13L2.5 10.5L8.5 4.5C10 3 10.8 2 11 1Z" fill="#A3C4B4"/>
                  <path d="M2 13L2.5 10.5L4 12L2 13Z" fill="#A3C4B4"/>
                </svg>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#222220' }}>Select an article or create a new one</p>
              </div>
            )}
            {selected && preview && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '52px clamp(32px, 8vw, 120px)' }}>
                {coverUrl && <img src={coverUrl} alt="cover" style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 6, marginBottom: 40 }} />}
                <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#F0F0E8', marginBottom: 32, lineHeight: 1.12, letterSpacing: '-0.02em' }}>{title || 'Untitled'}</h1>
                {summary && <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: '#555550', marginBottom: 32, fontWeight: 300, lineHeight: 1.6 }}>{summary}</p>}
                <div className="chronicle-preview" dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: '#777770', lineHeight: 1.85 }} />
              </div>
            )}
            {selected && !preview && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px clamp(28px, 7vw, 110px) 20px' }}>
                  {coverUrl ? (
                    <div style={{ position: 'relative', marginBottom: 28 }}>
                      <img src={coverUrl} alt="cover" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 6 }} />
                      <button onClick={() => { setCoverUrl(null); triggerSave() }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(6,6,14,0.75)', border: '0.5px solid #1A1A22', borderRadius: 4, padding: '4px 9px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#888880' }}>remove cover</button>
                    </div>
                  ) : (
                    <button onClick={() => coverInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', marginBottom: 22, background: 'none', border: '0.5px dashed #161620', borderRadius: 6, padding: '10px 16px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#282826' }}>
                      + add cover image
                    </button>
                  )}
                  <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = '' }} />
                  <input type="text" value={title} onChange={e => { setTitle(e.target.value); triggerSave() }} placeholder="Untitled" style={{ display: 'block', width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-syne)', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#F0F0E8', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 8, padding: 0 }} />
                  <input type="text" value={summary} onChange={e => { setSummary(e.target.value); triggerSave() }} placeholder="A brief summary..." style={{ display: 'block', width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-dm-sans)', fontSize: 15, color: '#3C3C38', marginBottom: 20, padding: 0, fontWeight: 300 }} />
                  <div style={{ height: 1, marginBottom: 24, background: 'linear-gradient(to right, #141420, transparent)' }} />
                  <textarea ref={textareaRef} value={content} onChange={e => { setContent(e.target.value); triggerSave() }} onKeyDown={handleEditorKeyDown} placeholder="Start writing..." style={{ display: 'block', width: '100%', background: 'none', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-dm-sans)', fontSize: 16, color: '#777770', lineHeight: 1.85, minHeight: '40vh', padding: 0 }} />
                  <div style={{ marginTop: 20 }}>
                    <button onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} style={{ background: 'none', border: '0.5px solid #141420', borderRadius: 4, padding: '5px 10px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#2A2A28', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      {uploadingImage ? 'uploading...' : '⌅ insert image'}
                    </button>
                    <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadInlineImage(f); e.target.value = '' }} />
                  </div>
                  <p style={{ marginTop: 14, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1C1C1A', letterSpacing: '0.06em' }}>⌘B bold · ⌘I italic · ⌘S save · # H1 · ## H2 · &gt; quote</p>
                </div>
                <div style={{ flexShrink: 0, borderTop: '0.5px solid #0E0E18', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', minWidth: 0 }}>
                    {tags.map(t => <TagChip key={t} tag={t} onRemove={() => { setTags(prev => prev.filter(x => x !== t)); triggerSave() }} />)}
                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }} placeholder={tags.length === 0 ? 'add tags...' : '+'} style={{ background: 'none', border: 'none', outline: 'none', padding: '2px 4px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#3A3A38', width: tags.length === 0 ? 70 : 28 }} />
                  </div>
                  <button onClick={() => { setStatus(s => s === 'draft' ? 'published' : 'draft'); triggerSave() }} style={{ flexShrink: 0, background: status === 'published' ? 'rgba(34,197,94,0.07)' : 'none', border: `0.5px solid ${status === 'published' ? 'rgba(34,197,94,0.25)' : '#181820'}`, borderRadius: 4, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: status === 'published' ? '#22c55e' : '#353530' }} />
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: status === 'published' ? '#22c55e' : '#353530' }}>{status}</span>
                  </button>
                  <button onClick={forceSave} style={{ flexShrink: 0, background: 'rgba(163,196,180,0.08)', border: '0.5px solid rgba(163,196,180,0.22)', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 12, fontWeight: 500, color: '#A3C4B4' }}>Save</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Distribute mode ── */}
        {mode === 'distribute' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!selected ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#222220' }}>Select an article first</p>
              </div>
            ) : (
              <>
                {/* Adapt bar */}
                <div style={{ flexShrink: 0, padding: '12px 20px', borderBottom: '0.5px solid #0E0E18', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 600, color: '#C0C0B8', margin: 0 }}>{title || 'Untitled'}</p>
                    <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#333330', margin: '2px 0 0' }}>{wordCount} words · ready to distribute</p>
                  </div>

                  {/* Note input */}
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') adaptContent() }}
                    placeholder="Any direction? e.g. focus on the Lagos angle, keep it short..."
                    style={{ flex: 1, minWidth: 0, marginLeft: 'auto', background: '#0A0A12', border: '0.5px solid #1A1A24', borderRadius: 5, padding: '7px 12px', fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#888880', outline: 'none' }}
                  />

                  <button
                    onClick={adaptContent}
                    disabled={adapting}
                    style={{ padding: '8px 18px', background: adapting ? 'rgba(163,196,180,0.06)' : 'rgba(163,196,180,0.1)', border: '0.5px solid rgba(163,196,180,0.3)', borderRadius: 5, cursor: adapting ? 'default' : 'pointer', fontFamily: 'var(--font-dm-sans)', fontSize: 12, fontWeight: 500, color: '#A3C4B4', display: 'flex', alignItems: 'center', gap: 7 }}
                  >
                    {adapting ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>✦</motion.span>
                        Adapting...
                      </>
                    ) : '✦ Adapt with AI'}
                  </button>
                </div>
                {adaptError && (
                  <div style={{ padding: '6px 20px', borderBottom: '0.5px solid #0E0E18' }}>
                    <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#ef4444', margin: 0 }}>
                      ✕ {adaptError}
                    </p>
                  </div>
                )}

                {/* Three platform columns */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {(['twitter', 'linkedin', 'instagram'] as const).map(platform => (
                    <PlatformCard
                      key={platform}
                      platform={platform}
                      content={adapted?.[platform] ?? ''}
                      onContentChange={v => setAdapted(prev => prev ? { ...prev, [platform]: v } : { twitter: '', linkedin: '', instagram: '', [platform]: v })}
                      onPost={() => PLATFORMS[platform].openApp(adapted?.[platform] ?? '')}
                      onSave={() => saveToVault(platform, adapted?.[platform] ?? '')}
                      onRegen={() => regenOne(platform)}
                      saving={savingPlatform === platform}
                      regening={regenPlatform === platform}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Vault mode ── */}
        {mode === 'vault' && (
          <VaultPanel items={vaultItems} onMarkPosted={markPosted} onDelete={deleteVaultItem} />
        )}
      </div>

      <style>{`
        .chronicle-preview h1 { font-family: var(--font-syne); font-size: 28px; font-weight: 800; color: #E8E8E0; margin: 32px 0 16px; line-height: 1.2; }
        .chronicle-preview h2 { font-family: var(--font-syne); font-size: 22px; font-weight: 700; color: #D8D8D0; margin: 28px 0 12px; }
        .chronicle-preview h3 { font-family: var(--font-syne); font-size: 18px; font-weight: 600; color: #C8C8C0; margin: 24px 0 10px; }
        .chronicle-preview p  { margin: 0 0 18px; }
        .chronicle-preview blockquote { border-left: 2px solid #A3C4B4; padding-left: 18px; margin: 24px 0; color: #555550; font-style: italic; }
        .chronicle-preview hr { border: none; border-top: 0.5px solid #1A1A20; margin: 32px 0; }
        .chronicle-preview strong { color: #C8C8C0; font-weight: 600; }
        .chronicle-preview br { display: block; margin: 4px 0; }
      `}</style>
    </motion.div>
    </ThemeProvider>
  )
}
