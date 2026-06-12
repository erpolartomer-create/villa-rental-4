import { NextResponse } from 'next/server'

// MyMemory free translation API — no API key required, 10k words/day free tier
// Limit: 500 chars per request → we chunk long texts by paragraph

const LOREM_PATTERN = /lorem\s+ipsum/i

async function translateChunk(text: string, from: string, to: string): Promise<string> {
  const url  = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res  = await fetch(url, { next: { revalidate: 0 } })
  const data = await res.json()

  if (data.responseStatus !== 200) throw new Error(data.responseDetails || 'Translation failed')

  const translated = data.responseData.translatedText as string

  // MyMemory occasionally returns lorem ipsum for short/test-like strings.
  // In that case, fall back to the original text so the user sees something sensible.
  if (LOREM_PATTERN.test(translated)) return text

  return translated
}

async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return ''
  // Split into ≤500-char chunks on paragraph boundaries
  const paragraphs = text.split(/\n\n+/)
  const results: string[] = []

  for (const para of paragraphs) {
    if (para.length <= 500) {
      results.push(await translateChunk(para, from, to))
    } else {
      // Split long paragraphs into sentences
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para]
      let chunk = ''
      const subResults: string[] = []
      for (const s of sentences) {
        if ((chunk + s).length > 490) {
          if (chunk) { subResults.push(await translateChunk(chunk.trim(), from, to)); chunk = '' }
        }
        chunk += s
      }
      if (chunk.trim()) subResults.push(await translateChunk(chunk.trim(), from, to))
      results.push(subResults.join(' '))
    }
  }

  return results.join('\n\n')
}

export async function POST(req: Request) {
  try {
    const { fields, from, targets } = await req.json() as {
      fields: Record<string, string>   // { name, shortDesc, desc }
      from: string                      // 'tr' | 'en' | 'ru'
      targets: string[]                 // ['en', 'ru'] etc.
    }

    const result: Record<string, Record<string, string>> = {}

    for (const to of targets) {
      result[to] = {}
      for (const [key, value] of Object.entries(fields)) {
        result[to][key] = value ? await translateText(value, from, to) : ''
      }
    }

    return NextResponse.json({ ok: true, result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
