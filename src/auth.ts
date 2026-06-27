import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import type { Provider } from 'next-auth/providers'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { DRAFT_COOKIE } from '@/lib/draft'

// ── UAE Pass OIDC provider ────────────────────────────────────────────────────
// UAE Pass is the UAE national digital identity app — residents sign in with
// their phone, no new password required. The env vars control whether it's
// active: staging uses https://stg-id.uaepass.ae, production uses the live URL.
// Only included in the provider array when credentials are configured so local
// dev without UAE Pass secrets still boots cleanly.
// ─────────────────────────────────────────────────────────────────────────────
const uaePassProvider: Provider | null = process.env.UAEPASS_CLIENT_ID
  ? {
      id: 'uaepass',
      name: 'UAE Pass',
      type: 'oidc',
      issuer: process.env.UAEPASS_ISSUER ?? 'https://stg-id.uaepass.ae',
      clientId: process.env.UAEPASS_CLIENT_ID,
      clientSecret: process.env.UAEPASS_CLIENT_SECRET!,
      authorization: { params: { scope: 'openid profile email' } },
      checks: ['pkce', 'state'],
      // Map UAE Pass claims to the NextAuth user shape.
      // UAE Pass returns fullnameEN (English name) rather than the standard `name`.
      profile(profile: Record<string, string>) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.fullnameEN ?? null,
          email: profile.email ?? null,
          image: null,
        }
      },
    }
  : null

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // JWT strategy so the Credentials (email/password) provider works alongside
  // OAuth. The adapter still persists users/accounts for Google and UAE Pass.
  session: { strategy: 'jwt' },
  providers: [
    // Reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET from the environment.
    Google({ allowDangerousEmailAccountLinking: true }),
    ...(uaePassProvider ? [uaePassProvider] : []),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = String(creds?.email ?? '').toLowerCase().trim()
        const password = String(creds?.password ?? '')
        if (!email || !password) return null
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash) return null
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  pages: { signIn: '/auth/sign-in' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token?.id && session.user) session.user.id = token.id as string
      return session
    },
  },
  events: {
    // On sign-in, claim the anonymous draft created at /start (cov_draft cookie)
    // and attach it to the account.
    async signIn({ user }) {
      if (!user?.id) return
      try {
        const token = (await cookies()).get(DRAFT_COOKIE)?.value
        if (!token) return
        await prisma.willApplication.updateMany({
          where: { draftToken: token, userId: null },
          data: { userId: user.id },
        })
      } catch {
        // Non-fatal: sign-in should still succeed even if claiming fails.
      }
    },
  },
})
