import { createClient } from '@supabase/supabase-js'
import type { ArchiveNote, ArchiveCategory, ArchiveType, ArchiveConnection, Footnote } from './types/archive'
import { DEFAULT_CATEGORIES } from './types/archive'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Categories ────────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<ArchiveCategory[]> {
  const { data, error } = await supabase
    .from('archive_categories')
    .select('*')
    .order('display_order', { ascending: true })
  if (error || !data || data.length === 0) return DEFAULT_CATEGORIES
  return data.map(r => ({
    id:           r.id,
    name:         r.name,
    colorHex:     r.color_hex,
    colorRgb:     r.color_rgb,
    isDefault:    r.is_default,
    displayOrder: r.display_order,
  }))
}

// ── Types ─────────────────────────────────────────────────────────────────────

export async function fetchTypes(): Promise<ArchiveType[]> {
  const { data, error } = await supabase.from('archive_types').select('*').order('name')
  if (error || !data) return []
  return data.map(r => ({ id: r.id, categoryId: r.category_id, name: r.name }))
}

export async function createType(categoryId: string, name: string): Promise<ArchiveType | null> {
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const { data, error } = await supabase
    .from('archive_types')
    .insert({ id: `${categoryId}-${id}-${Date.now()}`, category_id: categoryId, name })
    .select().single()
  if (error) { console.warn('createType:', error.message); return null }
  return { id: data.id, categoryId: data.category_id, name: data.name }
}

export async function deleteType(id: string): Promise<void> {
  await supabase.from('archive_types').delete().eq('id', id)
}

// ── Notes ─────────────────────────────────────────────────────────────────────

function noteFromDb(r: Record<string, unknown>): ArchiveNote {
  return {
    id:          r.id as string,
    title:       (r.title as string) ?? 'Untitled',
    content:     (r.content as string) ?? '',
    categoryId:  (r.category_id as string | null) ?? null,
    typeId:      (r.type_id as string | null) ?? null,
    topic:       (r.topic as string | null) ?? null,
    tags:        (r.tags as string[]) ?? [],
    connections: (r.connections as string[]) ?? [],
    aiCluster:   (r.ai_cluster as string | null) ?? null,
    aiFootnotes: (r.ai_footnotes as Footnote[]) ?? [],
    wordCount:   (r.word_count as number) ?? 0,
    status:      (r.status as 'active' | 'archived') ?? 'active',
    createdAt:   r.created_at as string,
    updatedAt:   r.updated_at as string,
  }
}

export async function fetchNotes(): Promise<ArchiveNote[]> {
  const { data, error } = await supabase
    .from('archive_notes')
    .select('*')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
  if (error) { console.warn('fetchNotes:', error.message); return [] }
  return (data ?? []).map(noteFromDb)
}

export async function createNote(opts?: { categoryId?: string; typeId?: string; content?: string }): Promise<ArchiveNote | null> {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('archive_notes')
    .insert({
      title:       '',
      content:     opts?.content ?? '',
      category_id: opts?.categoryId ?? null,
      type_id:     opts?.typeId ?? null,
      tags:        [],
      connections: [],
      ai_footnotes: [],
      word_count:  opts?.content ? opts.content.split(/\s+/).filter(Boolean).length : 0,
      status:      'active',
      created_at:  now,
      updated_at:  now,
    })
    .select().single()
  if (error) { console.warn('createNote:', error.message); return null }
  return noteFromDb(data as Record<string, unknown>)
}

export async function updateNote(id: string, patch: Partial<{
  title: string; content: string; categoryId: string | null; typeId: string | null
  topic: string | null; tags: string[]; connections: string[]; aiCluster: string | null
  aiFootnotes: Footnote[]; wordCount: number
}>): Promise<void> {
  const map: Record<string, string> = {
    categoryId: 'category_id', typeId: 'type_id', aiCluster: 'ai_cluster',
    aiFootnotes: 'ai_footnotes', wordCount: 'word_count',
  }
  const out: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const [k, v] of Object.entries(patch)) {
    out[map[k] ?? k] = v
  }
  const { error } = await supabase.from('archive_notes').update(out).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteNote(id: string): Promise<void> {
  await supabase.from('archive_notes').update({ status: 'archived' }).eq('id', id)
}

// ── Connections ───────────────────────────────────────────────────────────────

export async function fetchConnections(): Promise<ArchiveConnection[]> {
  const { data } = await supabase.from('archive_connections').select('*')
  if (!data) return []
  return data.map(r => ({
    id: r.id, noteA: r.note_a, noteB: r.note_b,
    strength: r.strength, type: r.type, confirmed: r.confirmed,
  }))
}

export async function upsertConnection(noteA: string, noteB: string, strength: number, type: 'semantic' | 'keyword' | 'explicit'): Promise<void> {
  const [a, b] = [noteA, noteB].sort()
  await supabase.from('archive_connections').upsert(
    { note_a: a, note_b: b, strength, type, confirmed: type === 'explicit' },
    { onConflict: 'note_a,note_b' }
  )
}

export async function confirmConnection(id: string): Promise<void> {
  await supabase.from('archive_connections').update({ confirmed: true, type: 'keyword' }).eq('id', id)
}
