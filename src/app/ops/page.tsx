import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { uploadDocument, vaultConfigured } from '@/lib/vault'
import type { QuestionnaireAnswers, Recommendation, WillDetails } from '@/types'

export const dynamic = 'force-dynamic'

const STATUSES = [
  'draft',
  'submitted',
  'in-review',
  'drafted',
  'translated',
  'awaiting-notary',
  'registered',
  'delivered',
] as const

const DOC_KINDS = ['will-draft', 'arabic-translation', 'registration-certificate'] as const

// Statuses that auto-advance when a document of a given kind is uploaded.
const KIND_TO_STATUS: Record<string, string> = {
  'will-draft': 'drafted',
  'arabic-translation': 'translated',
  'registration-certificate': 'registered',
}

async function advanceStatus(formData: FormData) {
  'use server'
  await requireAdmin()
  const id = String(formData.get('id'))
  const status = String(formData.get('status'))
  if (id && (STATUSES as readonly string[]).includes(status)) {
    await prisma.willApplication.update({ where: { id }, data: { status } })
    revalidatePath('/ops')
  }
}

async function uploadDoc(formData: FormData) {
  'use server'
  await requireAdmin()
  if (!vaultConfigured) return

  const applicationId = String(formData.get('applicationId') ?? '').trim()
  const kind = String(formData.get('kind') ?? '').trim()
  const file = formData.get('file') as File | null

  if (!applicationId || !kind || !file || file.size === 0) return
  if (!(DOC_KINDS as readonly string[]).includes(kind)) return

  const data = Buffer.from(await file.arrayBuffer())
  const storageKey = await uploadDocument(applicationId, kind, data)

  const nextStatus = KIND_TO_STATUS[kind]
  await prisma.$transaction(async (tx) => {
    await tx.willDocument.create({ data: { applicationId, kind, storageKey } })
    if (nextStatus) {
      await tx.willApplication.update({ where: { id: applicationId }, data: { status: nextStatus } })
    }
  })
  revalidatePath('/ops')
}

export default async function OpsPage() {
  await requireAdmin()

  const apps = await prisma.willApplication.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { payments: true, documents: true, user: { select: { email: true } } },
  })

  return (
    <main className="min-h-screen bg-brand-cream">
      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-semibold text-brand-navy">
            heirs <span className="text-brand-navy/40">ops</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-brand-navy/50">
            <span>{apps.length} application(s)</span>
            <Link href="/ops/articles" className="underline underline-offset-2">Articles</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        {/* Document upload panel */}
        {vaultConfigured && (
          <div className="rounded-brand border border-black/5 bg-white p-6">
            <h2 className="font-serif text-xl text-brand-navy">Upload document</h2>
            <p className="mt-1 text-sm text-brand-navy/55">
              Choose an application, the document type, and a PDF file. Uploading auto-advances the status.
            </p>
            <form action={uploadDoc} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
              <select
                name="applicationId"
                required
                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[14px] text-brand-navy outline-none focus:border-brand-navy"
              >
                <option value="">Select application…</option>
                {apps.map((a) => {
                  const answers = JSON.parse(a.answers) as QuestionnaireAnswers
                  const details = a.details ? (JSON.parse(a.details) as WillDetails) : null
                  const label = details?.testator.fullName || answers.name || a.id.slice(0, 8)
                  return (
                    <option key={a.id} value={a.id}>
                      {label} — {a.status}
                    </option>
                  )
                })}
              </select>
              <select
                name="kind"
                required
                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[14px] text-brand-navy outline-none focus:border-brand-navy"
              >
                {DOC_KINDS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <input
                type="file"
                name="file"
                accept="application/pdf"
                required
                className="text-[14px] text-brand-navy"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Upload
              </button>
            </form>
          </div>
        )}
        {!vaultConfigured && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
            Document vault not configured — set VAULT_* environment variables to enable uploads.
          </p>
        )}

        {/* Applications table */}
        <div className="overflow-x-auto rounded-brand border border-black/5 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-brand-navy/45">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Docs</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => {
                const answers = JSON.parse(a.answers) as QuestionnaireAnswers
                const rec = a.recommendation ? (JSON.parse(a.recommendation) as Recommendation) : null
                const details = a.details ? (JSON.parse(a.details) as WillDetails) : null
                const name = details?.testator.fullName || answers.name || '—'
                const email = a.user?.email ?? (answers.email || '—')
                const paid = a.payments.some((p) => p.status === 'paid')
                return (
                  <tr key={a.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3">
                      <span className="text-brand-navy">{name}</span>
                      <span className="block text-[12px] text-brand-navy/45">{email}</span>
                    </td>
                    <td className="px-4 py-3 text-brand-navy/70">{rec?.plan ?? '—'}</td>
                    <td className="px-4 py-3">{paid ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-[13px] text-brand-navy/60">
                      {a.documents.length > 0
                        ? a.documents.map((d) => d.kind.replace(/-/g, ' ')).join(', ')
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <form action={advanceStatus} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={a.id} />
                        <select
                          name="status"
                          defaultValue={a.status}
                          className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[13px]"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-lg bg-brand-navy px-3 py-1.5 text-[13px] font-medium text-white"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
