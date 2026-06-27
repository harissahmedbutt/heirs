// Service fee + government registration fee per recommended plan, in fils
// (AED * 100). The government fee is passed through at cost and always shown
// separately — Heirs never marks it up.
export const PRICING: Record<string, { amountFils: number; govFeeFils: number }> = {
  'UAE Will': { amountFils: 79900, govFeeFils: 95000 },
  'Mirror Wills': { amountFils: 119900, govFeeFils: 190000 },
}

export function fmtAed(fils: number): string {
  return `AED ${(fils / 100).toLocaleString('en-AE', { minimumFractionDigits: 0 })}`
}

export function pricingFor(plan: string) {
  return PRICING[plan] ?? PRICING['UAE Will']
}
