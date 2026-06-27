import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentApplication } from '@/lib/application'
import PrintButton from '@/components/PrintButton'
import type { Recommendation, WillDetails } from '@/types'

export const dynamic = 'force-dynamic'

export default async function WillDocumentPage() {
  const app = await getCurrentApplication()
  if (!app) redirect('/start')
  if (!app.details) redirect('/will')

  const details = JSON.parse(app.details) as WillDetails
  const rec = app.recommendation ? (JSON.parse(app.recommendation) as Recommendation) : null
  const t = details.testator
  const e = details.executor
  const court = app.jurisdiction === 'ADJD' ? 'Abu Dhabi Judicial Department (ADJD)' : 'DIFC Courts'
  const hasGuardians = app.guardians.length > 0
  let n = 0
  const num = () => ++n

  return (
    <div className="min-h-screen bg-brand-cream-dark print:bg-white">
      {/* Toolbar — hidden when printing */}
      <div className="sticky top-0 z-10 border-b border-black/5 bg-brand-cream/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-sm text-brand-navy/60 underline underline-offset-2 hover:text-brand-navy">
            ← Back to dashboard
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* The document */}
      <div className="mx-auto my-8 max-w-3xl bg-white px-12 py-16 shadow-sm print:my-0 print:shadow-none">
        <div className="relative">
          {/* Watermark */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rotate-[-30deg] text-[120px] font-bold text-brand-navy/[0.04]">DRAFT</span>
          </div>

          <div className="relative font-serif text-[15px] leading-relaxed text-brand-navy">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-navy/40">Heirs</p>
            <h1 className="mt-1 text-3xl font-semibold">Last Will and Testament</h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Draft for review — not yet executed
            </p>

            <p className="mt-8 text-justify">
              I, <strong>{t.fullName || '________________'}</strong>
              {t.nationality ? `, a national of ${t.nationality}` : ''}
              {t.passportNumber ? `, holder of passport no. ${t.passportNumber}` : ''}
              {t.emiratesId ? `, Emirates ID ${t.emiratesId}` : ''}
              {t.address ? `, residing at ${t.address}` : ''}, being of sound mind, declare this to be my Last
              Will and Testament in respect of my assets in the United Arab Emirates.
            </p>

            <Clause title={`${num()}. Revocation`}>
              I revoke all wills and codicils previously made by me in respect of my UAE assets.
            </Clause>

            <Clause title={`${num()}. Appointment of Executor`}>
              I appoint <strong>{e.fullName || '________________'}</strong>
              {e.relationship ? ` (my ${e.relationship})` : ''} as the Executor of this Will.
              {e.backupName ? ` Should they be unable or unwilling to act, I appoint ${e.backupName} as substitute Executor.` : ''}
            </Clause>

            {hasGuardians && (
              <Clause title={`${num()}. Guardianship of Minor Children`}>
                {app.guardians.map((g, i) => (
                  <span key={i} className="block">
                    I appoint <strong>{g.fullName}</strong>
                    {g.relationship ? ` (my ${g.relationship})` : ''} as {g.kind === 'interim' ? 'interim' : 'permanent'}{' '}
                    guardian of my minor children.
                  </span>
                ))}
              </Clause>
            )}

            <Clause title={`${num()}. Distribution of Estate`}>
              I give my UAE estate to the following beneficiaries in the shares stated:
              <span className="mt-3 block divide-y divide-black/5 rounded-lg border border-black/5">
                {app.beneficiaries.map((b, i) => (
                  <span key={i} className="flex justify-between px-4 py-2">
                    <span>
                      {b.fullName}
                      {b.relationship ? ` — ${b.relationship}` : ''}
                    </span>
                    <span className="font-semibold">{b.sharePercent}%</span>
                  </span>
                ))}
              </span>
            </Clause>

            <Clause title={`${num()}. Governing Law & Registration`}>
              This Will is intended to be registered with the {court} and to govern the distribution of my UAE
              assets in accordance with Federal Decree-Law No. 41 of 2022 on Civil Personal Status for non-Muslims.
              {rec ? ` Prepared under the ${rec.plan} plan.` : ''}
            </Clause>

            {/* Signatures */}
            <div className="mt-16 grid grid-cols-2 gap-x-12 gap-y-12">
              <SigLine label={`Testator: ${t.fullName}`} />
              <SigLine label="Witness 1" />
              <SigLine label="Witness 2" />
              <SigLine label="Date" />
            </div>

            <p className="mt-16 border-t border-black/10 pt-4 text-center text-[11px] text-brand-navy/45">
              Prepared by Heirs. Heirs is not a law firm and does not provide legal advice. This document is a
              draft for your review and is not valid until executed and registered with the relevant UAE authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-1 text-justify">{children}</div>
    </div>
  )
}

function SigLine({ label }: { label: string }) {
  return (
    <div>
      <div className="h-10 border-b border-brand-navy/60" />
      <p className="mt-2 text-xs text-brand-navy/60">{label}</p>
    </div>
  )
}
