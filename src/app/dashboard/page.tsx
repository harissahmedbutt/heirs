import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { getCurrentApplication } from '@/lib/application'
import { fmtAed } from '@/lib/pricing'
import type { QuestionnaireAnswers, Recommendation } from '@/types'

export const dynamic = 'force-dynamic'

const PLAN_PRICE: Record<string, string> = {
  'UAE Will': 'AED 799 + AED 950 court fee',
  'Mirror Wills': 'AED 1,199 + AED 1,900 court fee (couple)',
}

const ADDON_LABEL: Record<string, string> = {
  'mirror-will': 'Mirror wills for couples',
  'home-country-will': 'Home-country will (assets abroad)',
  'power-of-attorney': 'Power of attorney',
  guardianship: 'Guardianship for children',
  'digital-assets-will': 'Digital assets will (crypto)',
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft saved',
  submitted: 'Submitted',
  'in-review': 'In review',
  drafted: 'Drafted',
  translated: 'Translated',
  'awaiting-notary': 'Awaiting notary',
  registered: 'Registered',
  delivered: 'Delivered',
}

export default async function DashboardPage() {
  const session = await auth()
  const app = await getCurrentApplication()

  if (!app) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 text-center">
        <h1 className="font-serif text-3xl text-brand-navy">Nothing here yet</h1>
        <p className="mt-3 max-w-md text-brand-navy/60">
          Start your will and we&rsquo;ll save your answers so you can pick up right here.
        </p>
        <Link href="/start" className="btn-primary mt-8">
          Start your will
        </Link>
      </main>
    )
  }

  const answers = JSON.parse(app.answers) as QuestionnaireAnswers
  const rec = app.recommendation ? (JSON.parse(app.recommendation) as Recommendation) : null
  const hasDetails = !!app.details
  const paid = app.payments.some((p) => p.status === 'paid')
  const documents = app.documents ?? []

  const DOC_LABEL: Record<string, string> = {
    'will-draft': 'Will draft (PDF)',
    'arabic-translation': 'Arabic translation',
    'registration-certificate': 'Registration certificate',
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-semibold text-brand-navy">
            heirs
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-medium text-brand-navy/70">
              {STATUS_LABEL[app.status] ?? app.status}
            </span>
            {session?.user ? (
              <div className="flex items-center gap-3 text-xs text-brand-navy/60">
                <span className="hidden sm:inline">{session.user.email}</span>
                <form
                  action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/' })
                  }}
                >
                  <button type="submit" className="underline underline-offset-2 hover:text-brand-navy">
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="text-xs font-medium text-brand-navy underline underline-offset-2 hover:text-brand-navy/70"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {!session?.user && (
        <div className="border-b border-black/5 bg-brand-navy/[0.03]">
          <div className="mx-auto max-w-3xl px-6 py-3 text-center text-[13px] text-brand-navy/70">
            Your plan is saved on this device.{' '}
            <Link href="/auth/sign-in" className="font-medium text-brand-navy underline underline-offset-2">
              Sign in with Google
            </Link>{' '}
            to keep it across devices.
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-navy/40">Your plan</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-brand-navy lg:text-5xl">
          {answers.name ? `${answers.name}, here's` : "Here's"} what we recommend
        </h1>

        {rec && (
          <>
            {/* Recommended plan card */}
            <div className="mt-10 rounded-brand border border-black/5 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-2xl text-brand-navy">{rec.plan}</h2>
                <span className="text-brand-navy/60">{PLAN_PRICE[rec.plan] ?? ''}</span>
              </div>
              <p className="mt-1 text-sm text-brand-navy/50">
                Registered with {rec.jurisdiction === 'ADJD' ? 'the Abu Dhabi Judicial Department (ADJD)' : 'the DIFC'} — valid across the UAE.
              </p>

              {rec.addOns.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-brand-navy">Worth adding</p>
                  <ul className="mt-3 space-y-2">
                    {rec.addOns.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-[15px] text-brand-navy/80">
                        <svg className="h-4 w-4 text-brand-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {ADDON_LABEL[a] ?? a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!hasDetails ? (
                <Link href="/will" className="btn-primary mt-7 inline-block">
                  Complete your will details
                </Link>
              ) : !paid ? (
                <Link href="/checkout" className="btn-primary mt-7 inline-block">
                  Continue to checkout
                </Link>
              ) : (
                <Link href="/will/document" className="btn-primary mt-7 inline-block">
                  View your will draft
                </Link>
              )}
            </div>

            {/* Progress */}
            <div className="mt-8 rounded-brand border border-black/5 bg-white/60 p-6">
              <p className="text-sm font-semibold text-brand-navy">Your progress</p>
              <ol className="mt-4 space-y-3">
                {(
                  [
                    ['Questionnaire completed', true, null],
                    ['Will details added', hasDetails, '/will'],
                    ['Payment', paid, '/checkout'],
                    ['Drafting & registration', paid, null],
                  ] as const
                ).map(([label, done, href]) => (
                  <li key={label} className="flex items-center gap-3 text-[15px]">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                        done ? 'bg-brand-navy text-white' : 'border border-black/15 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className={done ? 'text-brand-navy' : 'text-brand-navy/55'}>{label}</span>
                    {!done && href && (
                      <Link href={href} className="ml-auto text-[13px] text-brand-navy underline underline-offset-2">
                        {label === 'Payment' ? 'Pay' : 'Add'}
                      </Link>
                    )}
                    {label === 'Drafting & registration' && paid && (
                      <span className="ml-auto text-[13px] text-brand-navy/50">In progress</span>
                    )}
                  </li>
                ))}
              </ol>
              {paid && app.payments[0] && (
                <p className="mt-5 border-t border-black/5 pt-4 text-[13px] text-brand-navy/55">
                  Paid {fmtAed(app.payments[0].amountFils)} service fee + {fmtAed(app.payments[0].govFeeFils)} government fee.
                </p>
              )}
            </div>

            {/* Documents — shown once the ops team has uploaded files */}
            {documents.length > 0 && (
              <div className="mt-8 rounded-brand border border-black/5 bg-white p-6">
                <p className="text-sm font-semibold text-brand-navy">Your documents</p>
                <ul className="mt-4 divide-y divide-black/5">
                  {documents.map((d) => (
                    <li key={d.id} className="flex items-center justify-between py-3 text-[15px]">
                      <span className="text-brand-navy">{DOC_LABEL[d.kind] ?? d.kind}</span>
                      <a
                        href={`/api/vault/${d.id}`}
                        download
                        className="text-[13px] font-medium text-brand-navy underline underline-offset-2 hover:text-brand-navy/70"
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Why */}
            <div className="mt-8">
              <h3 className="font-serif text-xl text-brand-navy">Why this is right for you</h3>
              <ul className="mt-4 space-y-3">
                {rec.reasons.map((r, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-brand-navy/75">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy/40" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Answer summary */}
        <div className="mt-10 rounded-brand border border-black/5 bg-white/60 p-6">
          <p className="text-sm font-semibold text-brand-navy">What you told us</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[15px]">
            {(
              [
                ['Marital status', answers.marital],
                ['Children', answers.children],
                ['UAE property', answers.uaeProperty],
                ['Assets abroad', answers.abroad],
              ] as const
            ).map(([label, value]) =>
              value ? (
                <div key={label}>
                  <dt className="text-brand-navy/45">{label}</dt>
                  <dd className="text-brand-navy">{value}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>

        <p className="mt-8 text-center text-xs text-brand-navy/40">
          Heirs is not a law firm and does not provide legal advice.
        </p>
      </div>
    </main>
  )
}
