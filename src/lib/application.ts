import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { DRAFT_COOKIE } from '@/lib/draft'

const include = { beneficiaries: true, guardians: true, payments: true, documents: true } as const

/** Resolve the active will application for this request: the signed-in user's
 *  most recent one, or the anonymous draft tied to the cov_draft cookie. */
export async function getCurrentApplication() {
  const session = await auth()
  if (session?.user?.id) {
    return prisma.willApplication.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include,
    })
  }
  const token = (await cookies()).get(DRAFT_COOKIE)?.value
  if (!token) return null
  return prisma.willApplication.findUnique({ where: { draftToken: token }, include })
}

export type CurrentApplication = NonNullable<Awaited<ReturnType<typeof getCurrentApplication>>>
