import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { uploadDocument, vaultConfigured } from '@/lib/vault'

// ── Teaching note ─────────────────────────────────────────────────────────────
// This route is ops-only. The request body is multipart/form-data so we can
// receive the PDF binary alongside structured fields without base64 overhead.
// Next.js App Router exposes FormData via req.formData() — no busboy/multer.
// ─────────────────────────────────────────────────────────────────────────────

// When the ops team uploads a will PDF, the application status should advance
// automatically to reflect the new stage.
const KIND_TO_STATUS: Record<string, string> = {
  'will-draft': 'drafted',
  'arabic-translation': 'translated',
  'registration-certificate': 'registered',
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
}
function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/** Upload a will document (PDF) to the encrypted vault. Admin only. */
export async function POST(req: Request) {
  if (!vaultConfigured) {
    return NextResponse.json({ error: 'Vault not configured.' }, { status: 503 })
  }

  // Auth: must be a signed-in admin.
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'admin') return forbidden()

  // Parse multipart form.
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data.' }, { status: 400 })
  }

  const applicationId = (formData.get('applicationId') as string | null)?.trim()
  const kind = (formData.get('kind') as string | null)?.trim()
  const file = formData.get('file') as File | null

  if (!applicationId || !kind || !file) {
    return NextResponse.json({ error: 'Missing applicationId, kind, or file.' }, { status: 400 })
  }
  if (!['will-draft', 'arabic-translation', 'registration-certificate'].includes(kind)) {
    return NextResponse.json({ error: 'Invalid kind.' }, { status: 400 })
  }

  const app = await prisma.willApplication.findUnique({ where: { id: applicationId } })
  if (!app) return NextResponse.json({ error: 'Application not found.' }, { status: 404 })

  // Encrypt and push to S3.
  const data = Buffer.from(await file.arrayBuffer())
  const storageKey = await uploadDocument(applicationId, kind, data)

  // Persist the document record and advance the will's status in one transaction.
  // Using the callback form of $transaction so we can do the conditional update
  // cleanly and TypeScript knows doc is a WillDocument.
  const nextStatus = KIND_TO_STATUS[kind]
  const doc = await prisma.$transaction(async (tx) => {
    const created = await tx.willDocument.create({ data: { applicationId, kind, storageKey } })
    if (nextStatus) {
      await tx.willApplication.update({ where: { id: applicationId }, data: { status: nextStatus } })
    }
    return created
  })

  return NextResponse.json({ ok: true, id: doc.id })
}
