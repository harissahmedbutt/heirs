import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentApplication } from '@/lib/application'
import { pricingFor } from '@/lib/pricing'
import { ziinaConfigured, createPaymentIntent } from '@/lib/ziina'
import { settlePayment } from '@/lib/payments'
import type { Recommendation } from '@/types'

// Start checkout. With Ziina configured, creates a hosted-checkout payment
// intent and returns its redirect_url. Without a key (local demo), records a
// paid payment immediately so the flow still completes.
export async function POST() {
  const app = await getCurrentApplication()
  if (!app) return NextResponse.json({ error: 'No will application found.' }, { status: 404 })
  if (app.payments.some((p) => p.status === 'paid')) {
    return NextResponse.json({ ok: true, paid: true })
  }

  const rec = app.recommendation ? (JSON.parse(app.recommendation) as Recommendation) : null
  const plan = rec?.plan ?? 'UAE Will'
  const { amountFils, govFeeFils } = pricingFor(plan)

  if (!ziinaConfigured) {
    const payment = await prisma.payment.create({
      data: { applicationId: app.id, amountFils, govFeeFils, provider: 'demo', status: 'pending' },
    })
    await settlePayment(payment.id)
    return NextResponse.json({ ok: true, demo: true })
  }

  const payment = await prisma.payment.create({
    data: { applicationId: app.id, amountFils, govFeeFils, provider: 'ziina', status: 'pending' },
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const intent = await createPaymentIntent({
    amountFils: amountFils + govFeeFils,
    message: `Heirs — ${plan}`,
    successUrl: `${appUrl}/checkout/complete?intent={PAYMENT_INTENT_ID}`,
    cancelUrl: `${appUrl}/checkout?canceled=1`,
    failureUrl: `${appUrl}/checkout?failed=1`,
  })

  await prisma.payment.update({ where: { id: payment.id }, data: { providerRef: intent.id } })
  return NextResponse.json({ redirect_url: intent.redirect_url })
}
