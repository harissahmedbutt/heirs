import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { recommend } from '@/lib/recommendation'
import { getCurrentApplication } from '@/lib/application'
import { DRAFT_COOKIE } from '@/lib/draft'
import type { QuestionnaireAnswers, Recommendation, WillDetails } from '@/types'

// ── Teaching note ─────────────────────────────────────────────────────────────
// GET returns a sanitised view of the current application — safe to expose to
// client components. All JSON-string columns (answers, recommendation, details)
// are parsed before returning so callers don't have to JSON.parse themselves.
// The raw draftToken is never included in the response.
// ─────────────────────────────────────────────────────────────────────────────

/** Read the current application for this browser session / signed-in user. */
export async function GET() {
  const app = await getCurrentApplication()
  if (!app) return NextResponse.json(null)

  return NextResponse.json({
    id: app.id,
    status: app.status,
    jurisdiction: app.jurisdiction,
    answers: JSON.parse(app.answers) as QuestionnaireAnswers,
    recommendation: app.recommendation ? (JSON.parse(app.recommendation) as Recommendation) : null,
    details: app.details ? (JSON.parse(app.details) as WillDetails) : null,
    beneficiaries: app.beneficiaries,
    guardians: app.guardians,
    paid: app.payments.some((p) => p.status === 'paid'),
    documents: app.documents?.map((d) => ({ id: d.id, kind: d.kind, createdAt: d.createdAt })) ?? [],
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  })
}

/** Persist the questionnaire answers as a draft will application.
 *  Anonymous for now — tied to an httpOnly cookie until accounts land. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { answers?: QuestionnaireAnswers } | null
  const answers = body?.answers ?? {}
  const recommendation = recommend(answers)

  const jar = await cookies()
  const existingToken = jar.get(DRAFT_COOKIE)?.value

  const data = {
    answers: JSON.stringify(answers),
    recommendation: JSON.stringify(recommendation),
    jurisdiction: recommendation.jurisdiction,
  }

  if (existingToken) {
    const app = await prisma.willApplication.upsert({
      where: { draftToken: existingToken },
      update: data,
      create: { draftToken: existingToken, ...data },
    })
    return NextResponse.json({ ok: true, id: app.id })
  }

  const token = crypto.randomUUID()
  const app = await prisma.willApplication.create({ data: { draftToken: token, ...data } })
  jar.set(DRAFT_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return NextResponse.json({ ok: true, id: app.id })
}
