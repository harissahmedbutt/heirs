import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { downloadDocument } from '@/lib/vault'

// ── Teaching note ─────────────────────────────────────────────────────────────
// The client URL is /api/vault/{documentId} — a CUID. The actual S3 object key
// (storageKey) never leaves the server, so even if someone enumerates document
// IDs they still need to be the application owner or an admin to get the bytes.
//
// We stream the decrypted PDF directly from the response body. For a PDF this
// is typically <5MB so buffering it in memory is fine. If we ever store large
// files we'd switch to a ReadableStream pipeline, but that's premature here.
// ─────────────────────────────────────────────────────────────────────────────

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
}
function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/** Download a will document. Owner or admin only. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const [doc, user] = await Promise.all([
    prisma.willDocument.findUnique({
      where: { id },
      include: { application: { select: { userId: true } } },
    }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ])

  if (!doc) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  const isOwner = doc.application.userId === session.user.id
  const isAdmin = user?.role === 'admin'
  if (!isOwner && !isAdmin) return forbidden()

  const pdfBytes = await downloadDocument(doc.storageKey)

  const filename = `${doc.kind}.pdf`
  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      // The response is user-specific — don't cache it anywhere between users.
      'Cache-Control': 'private, no-store',
    },
  })
}
