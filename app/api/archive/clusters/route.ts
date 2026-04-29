import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are a semantic clustering engine for a personal thinking archive.
Given a collection of notes (titles + short previews), group them into thematic clusters.
Cluster names should be 2-4 words, evocative but precise.
Examples: "Sovereignty & Identity", "Financial Architecture", "Lagos & Belonging", "Systems Thinking"
Return JSON only, no markdown.`

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json()

    if (!notes?.length || notes.length < 3) {
      return NextResponse.json({ clusters: [] })
    }

    const userMessage = `Here are ${notes.length} notes from a personal archive:

${notes.map((n: { id: string; title: string; preview: string }) =>
  `ID: ${n.id}\nTitle: ${n.title}\nPreview: ${n.preview}`
).join('\n\n')}

Group these notes into thematic clusters (3-8 notes each ideally).
Return JSON array:
[{
  "label": "2-4 word cluster name",
  "noteIds": ["uuid1", "uuid2"]
}]`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        system:     SYSTEM,
        messages:   [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) return NextResponse.json({ clusters: [] })

    const data = await response.json()
    const text = data.content?.[0]?.text ?? '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const clusters = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ clusters })
  } catch (err) {
    console.error('clusters route error:', err)
    return NextResponse.json({ clusters: [] })
  }
}
