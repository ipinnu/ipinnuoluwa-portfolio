import { NextRequest, NextResponse } from 'next/server'

type Platform = 'twitter' | 'linkedin' | 'instagram'

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  twitter:
    'A thread. Format each tweet starting with its number and a slash e.g. 1/ ... then a blank line before the next. Max 4-6 tweets, each under 280 chars. Hook hard on tweet 1.',
  linkedin:
    'Short paragraphs separated by blank lines. Start with a strong first line — no greeting, no "I am excited to share". 150-300 words. End with a question or CTA.',
  instagram:
    'Conversational caption, some personality and warmth. 80-150 words. End with 5-8 relevant hashtags on a new line.',
}

function buildPrompt(
  title: string,
  summary: string,
  content: string,
  note: string,
  platform?: Platform,
): string {
  const articleBlock = `Article title: ${title || 'Untitled'}
Summary: ${summary || ''}
Content:
${content?.slice(0, 4000) || ''}`

  const noteBlock = note?.trim()
    ? `\nExtra direction from the author: "${note.trim()}"\n`
    : ''

  if (platform) {
    return `You are a social media content strategist for a software product designer and engineer in Nigeria. You understand each platform deeply — what works on Twitter is different from LinkedIn is different from Instagram.
${noteBlock}
${articleBlock}

Write a ${platform} post only. ${PLATFORM_INSTRUCTIONS[platform]}

Return ONLY a raw JSON object (no markdown fences):
{"${platform}": "your content here"}`
  }

  return `You are a social media content strategist for a software product designer and engineer in Nigeria. You understand each platform deeply — what works on Twitter is different from LinkedIn is different from Instagram.
${noteBlock}
${articleBlock}

Write three platform-optimised posts.

Return ONLY a raw JSON object (no markdown fences, no explanation) with exactly this shape:
{
  "twitter": "...",
  "linkedin": "...",
  "instagram": "..."
}

Twitter: ${PLATFORM_INSTRUCTIONS.twitter}
LinkedIn: ${PLATFORM_INSTRUCTIONS.linkedin}
Instagram: ${PLATFORM_INSTRUCTIONS.instagram}`
}

function parseResponse(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const stripped = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    return JSON.parse(stripped)
  }
}

export async function POST(req: NextRequest) {
  const { title, content, summary, note = '', platform } = await req.json()

  if (!title && !content) {
    return NextResponse.json({ error: 'No content to adapt' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  const prompt = buildPrompt(title, summary, content, note, platform as Platform | undefined)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  try {
    return NextResponse.json(parseResponse(text))
  } catch {
    return NextResponse.json({ error: 'Unexpected response format', raw: text }, { status: 500 })
  }
}
