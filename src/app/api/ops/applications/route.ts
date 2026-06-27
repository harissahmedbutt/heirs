import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
}
function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/** GET /api/ops/applications — list all applications (admin only). */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'admin') return forbidden()

  const apps = await prisma.willApplication.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      payments: { select: { status: true, amountFils: true, govFeeFils: true } },
      documents: { select: { id: true, kind: true, createdAt: true } },
    },
  })
  return NextResponse.json(apps)
}
