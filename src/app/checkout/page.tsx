import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentApplication } from '@/lib/application'
import { pricingFor, fmtAed } from '@/lib/pricing'
import { ziinaConfigured } from '@/lib/ziina'
import CheckoutButton from '@/components/CheckoutButton'
import type { Recommendation } from '@/types'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; failed?: string }>
}) {
  const { canceled, failed } = await searchParams
  const app = await getCurrentApplication()
  if (!app) redirect('/start')
  if (!app.details) redirect('/will')

  const rec = app.recommendation ? (JSON.parse(app.recommendation) as Recommendation) : null
  const plan = rec?.plan ?? 'UAE Will'
  const { amountFils, govFeeFils } = pricingFor(plan)

  return (
    <main className="min-h-screen bg-brand-cream">
      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-semibold text-brand-navy">
            heirs
          </Link>
          <Link href="/will" className="text-sm text-brand-navy/60 underline underline-offset-2 hover:text-brand-navy">
            Edit details
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-6 py-12 lg:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-navy/40">Checkout</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-brand-navy">Review and pay</h1>

        {(canceled || failed) && (
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-[14px] text-amber-800">
            {canceled ? 'Payment was cancelled. You can try again below.' : 'That payment didn’t go through. Please try again.'}
          </p>
        )}

        <div className="mt-10 rounded-brand border border-black/5 bg-white p-7 shadow-sm">
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-xl text-brand-navy">{plan}</span>
            <span className="text-brand-navy">{fmtAed(amountFils)}</span>
          </div>
          <p className="mt-1 text-sm text-brand-navy/50">
            Drafted &amp; registered with {app.jurisdiction === 'ADJD' ? 'the ADJD' : 'the DIFC'}.
          </p>

          <div className="mt-6 space-y-2 border-t border-black/5 pt-5 text-[15px]">
            <div className="flex justify-between text-brand-navy/70">
              <span>Heirs service fee</span>
              <span>{fmtAed(amountFils)}</span>
            </div>
            <div className="flex justify-between text-brand-navy/70">
              <span>Government registration fee (at cost)</span>
              <span>{fmtAed(govFeeFils)}</span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-3 font-semibold text-brand-navy">
              <span>Total today</span>
              <span>{fmtAed(amountFils + govFeeFils)}</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-brand-navy/45">
            We never mark up government fees.{' '}
            {ziinaConfigured
              ? 'Payments are processed securely by Ziina (test mode — no real charge).'
              : 'Demo mode: Ziina isn’t connected yet, so no payment is taken.'}
          </p>

          <div className="mt-7">
            <CheckoutButton />
          </div>
        </div>
      </div>
    </main>
  )
}
