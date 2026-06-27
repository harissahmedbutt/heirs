// Together AI client for the article generator (OpenAI-compatible chat API).
const BASE = 'https://api.together.xyz/v1/chat/completions'
const MODEL = process.env.TOGETHER_MODEL ?? 'meta-llama/Llama-3.3-70B-Instruct-Turbo'

export const togetherConfigured = !!process.env.TOGETHER_API_KEY

export interface GeneratedArticle {
  title: string
  slug: string
  excerpt: string
  metaDescription: string
  bodyMarkdown: string
  faq: { q: string; a: string }[]
  tags: string[]
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

/** Pull the first balanced JSON object out of a model response (handles code fences/prose). */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON found in model output')
  return candidate.slice(start, end + 1)
}

const SYSTEM = `You are a senior content writer for Heirs, an online estate-planning service for expats in the United Arab Emirates (heirs.ae).
Write accurate, genuinely helpful, SEO- and answer-engine-optimised articles about UAE wills, inheritance, guardianship, and estate planning.

Rules:
- Be factual and current (UAE law as of 2025-2026). Reference relevant frameworks where appropriate: Federal Decree-Law No. 41 of 2022 (non-Muslim civil personal status), DIFC Wills Service Centre, ADJD (Abu Dhabi Judicial Department).
- Write for expats. Clear, calm, trustworthy tone. No hype.
- Structure for search AND AI answer engines: short intro, then H2 sections phrased as the questions people actually ask, with concise, direct answers up top of each section. 800-1200 words.
- Use markdown (## headings, lists, **bold**). Do NOT include the title as an H1 in the body.
- Heirs is NOT a law firm and does not give legal advice — include a brief disclaimer near the end.
- Output ONLY a single JSON object, no prose, no code fences.`

export async function generateArticle(topic: string): Promise<GeneratedArticle> {
  if (!process.env.TOGETHER_API_KEY) throw new Error('TOGETHER_API_KEY not set')

  const user = `Write an article about: "${topic}".
Return a JSON object with exactly these keys:
{
  "title": "compelling, specific, <= 65 chars",
  "slug": "url-safe-kebab-case",
  "excerpt": "1-2 sentence summary for listings",
  "metaDescription": "<= 155 chars, search-optimised",
  "bodyMarkdown": "the full article in markdown (## headings, no H1)",
  "faq": [{ "q": "question", "a": "concise answer" }, ... 3-5 items],
  "tags": ["3-6", "short", "tags"]
}`

  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: user },
      ],
      temperature: 0.6,
      max_tokens: 4000,
      // JSON mode → valid, properly-escaped JSON (markdown bodies contain newlines).
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) throw new Error(`Together failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content ?? ''
  const parsed = JSON.parse(extractJson(content)) as Partial<GeneratedArticle>

  if (!parsed.title || !parsed.bodyMarkdown) throw new Error('Model output missing title/body')

  return {
    title: parsed.title.trim(),
    slug: slugify(parsed.slug || parsed.title),
    excerpt: parsed.excerpt?.trim() || '',
    metaDescription: (parsed.metaDescription || parsed.excerpt || '').trim().slice(0, 160),
    bodyMarkdown: parsed.bodyMarkdown,
    faq: Array.isArray(parsed.faq) ? parsed.faq.filter((f) => f?.q && f?.a) : [],
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
  }
}
