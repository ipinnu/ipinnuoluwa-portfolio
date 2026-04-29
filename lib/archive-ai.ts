import type { ArchiveNote, Footnote } from './types/archive'

export async function scanFootnotes(
  currentNote: ArchiveNote,
  allNotes:    ArchiveNote[]
): Promise<Footnote[]> {
  const library = allNotes
    .filter(n => n.id !== currentNote.id && n.content.trim().length > 40)
    .slice(0, 40)
    .map(n => ({
      id:      n.id,
      title:   n.title,
      summary: n.content.slice(0, 200),
    }))

  if (library.length === 0 || currentNote.content.trim().length < 80) return []

  try {
    const res = await fetch('/api/archive/footnotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteId:   currentNote.id,
        title:    currentNote.title,
        content:  currentNote.content,
        library,
      }),
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.footnotes) ? data.footnotes : []
  } catch {
    return []
  }
}

export async function analyzeClusters(
  notes: ArchiveNote[]
): Promise<Record<string, string>> {
  if (notes.length < 3) return {}

  const summaries = notes.map(n => ({
    id:      n.id,
    title:   n.title,
    preview: n.content.slice(0, 100),
  }))

  try {
    const res = await fetch('/api/archive/clusters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: summaries }),
    })
    if (!res.ok) return {}
    const data = await res.json()
    const map: Record<string, string> = {}
    if (Array.isArray(data.clusters)) {
      for (const cluster of data.clusters) {
        if (Array.isArray(cluster.noteIds) && cluster.label) {
          for (const id of cluster.noteIds) map[id] = cluster.label
        }
      }
    }
    return map
  } catch {
    return {}
  }
}
