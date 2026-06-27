import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { WillStatus } from '@/types'

// Valid statuses in the order a will moves through them.
// Document uploads (via POST /api/vault) advance status automatically for
// "drafted", "translated", and "registered". This route handles everything else.
const VALID_STATUSES: WillStatus[] = [
  'draft',
  'submitted',
  'in-review',
  'drafted',
  'translated',
  'awaiting-notary',
  'registered',
  'delivered',
]

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
}
function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/** PATCH /api/ops/applications/[id] — advance or roll back a will's status. Admin only. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'admin') return forbidden()

  const body = (await req.json().catch(() => null)) as { status?: string } | null
  const status = body?.status as WillStatus | undefined

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    )
  }

  const app = await prisma.willApplication.findUnique({ where: { id } })
  if (!app) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  const updated = await prisma.willApplication.update({
    where: { id },
    data: { status },
  })
  return NextResponse.json({ ok: true, status: updated.status })
}
