import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// ── Teaching note ─────────────────────────────────────────────────────────────
// Server Components and Server Actions can't return a 403 response the way API
// routes do — they redirect instead. requireAdmin() encapsulates that pattern:
// call it at the top of any ops Server Component to gate the whole page.
//
// It also returns the session so the page can use it without a second auth()
// call — small but worth noting since auth() hits the session store each time.
// ─────────────────────────────────────────────────────────────────────────────

/** Redirect to sign-in if not logged in, or to / if logged in but not admin.
 *  Returns the verified session for use in the calling component. */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== 'admin') redirect('/')

  return session
}
