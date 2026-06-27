import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentApplication } from '@/lib/application'
import WillIntakeForm from '@/components/WillIntakeForm'
import type { QuestionnaireAnswers, WillDetails } from '@/types'

export const dynamic = 'force-dynamic'

export default async function WillDetailsPage() {
  const app = await getCurrentApplication()
  if (!app) redirect('/start')

  const answers = JSON.parse(app.answers) as QuestionnaireAnswers
  const details = app.details ? (JSON.parse(app.details) as WillDetails) : null

  return (
    <main className="min-h-screen bg-brand-cream">
      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-semibold text-brand-navy">
            heirs
          </Link>
          <Link href="/dashboard" className="text-sm text-brand-navy/60 underline underline-offset-2 hover:text-brand-navy">
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-navy/40">Your will details</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-brand-navy">
          Let&rsquo;s capture the details
        </h1>
        <p className="mt-3 max-w-prose text-brand-navy/60">
          These are the specifics we need to prepare your {app.jurisdiction} will. You can change any of this later.
        </p>

        <div className="mt-10">
          <WillIntakeForm
            initialDetails={details}
            initialBeneficiaries={app.beneficiaries.map((b) => ({
              fullName: b.fullName,
              relationship: b.relationship,
              sharePercent: b.sharePercent,
            }))}
            initialGuardians={app.guardians.map((g) => ({
              fullName: g.fullName,
              relationship: g.relationship,
              kind: g.kind,
            }))}
            showGuardians={answers.children === 'Yes'}
          />
        </div>
      </div>
    </main>
  )
}
