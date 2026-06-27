import type { Metadata } from 'next'
import Link from 'next/link'
import SignInForm from '@/components/SignInForm'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to Heirs to manage your UAE will and documents.',
  alternates: { canonical: '/auth/sign-in' },
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      {/* Minimal header */}
      <header className="flex items-center justify-center px-6 py-6">
        <Link href="/" className="select-none font-serif text-[26px] font-semibold tracking-tight text-brand-navy">
          heirs
        </Link>
      </header>

      {/* Centred card */}
      <main className="flex flex-1 items-start justify-center px-6 pb-16 pt-6 sm:items-center">
        <div className="w-full max-w-md rounded-brand border border-black/5 bg-white/60 p-8 shadow-sm sm:p-10">
          <SignInForm />
        </div>
      </main>
    </div>
  )
}
