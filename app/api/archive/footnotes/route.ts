import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are a connection finder for a personal thinking archive.
Given a note being written and a library of existing notes, identify statements in the current note that connect to deeper treatment in other notes.
Be selective — only surface strong, meaningful connections, not superficial keyword matches.
Return JSON only, no markdown.`

export async function POST(req: NextRequest) {
  try {
    const { title, content, library } = await req.json()

    if (!content || !library?.length) {
      return NextResponse.json({ footnotes: [] })
    }

    const userMessage = `Current note title: ${title || 'Untitled'}
Current note content:
${content.slice(0, 2000)}

Note library (${library.length} notes):
${library.map((n: { id: string; title: string; summary: string }) =>
  `ID: ${n.id}\nTitle: ${n.title}\nExcerpt: ${n.summary}`
).join('\n\n')}

Find up to 4 meaningful connections. Return JSON array:
[{
  "noteId": "uuid of the referenced note",
  "statement": "exact short phrase from current note (max 10 words)",
  "excerpt": "relevant excerpt from the referenced note (max 30 words)",
  "superscript": 1
}]

If no strong connections exist, return [].`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system:     SYSTEM,
        messages:   [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) return NextResponse.json({ footnotes: [] })

    const data = await response.json()
    const text = data.content?.[0]?.text ?? '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const footnotes = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({ footnotes })
  } catch (err) {
    console.error('footnotes route error:', err)
    return NextResponse.json({ footnotes: [] })
  }
}
