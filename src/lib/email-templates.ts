import { fmtAed } from '@/lib/pricing'
import type { Mail } from '@/lib/email'

function layout(title: string, body: string): string {
  return `<div style="font-family:Georgia,'Times New Roman',serif;background:#F9F8F6;padding:32px;color:#1A1816">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid rgba(0,0,0,0.05)">
    <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#1A1816;opacity:.5;margin:0">Heirs</p>
    <h1 style="font-size:24px;margin:8px 0 16px;font-weight:600">${title}</h1>
    ${body}
    <p style="font-size:11px;color:#1A1816;opacity:.45;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
      Heirs is not a law firm and does not provide legal advice.
    </p>
  </div>
</div>`
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#1A1816;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px">${label}</a>`
}

const P = 'font-size:15px;line-height:1.6;margin:0 0 12px'

export function welcomeEmail(name: string | null, appUrl: string): Mail {
  return {
    to: '',
    subject: 'Welcome to Heirs',
    html: layout(
      `Welcome${name ? `, ${name}` : ''}`,
      `<p style="${P}">Your account is ready. You can pick up your will any time, on any device.</p>
       <p style="${P}">${button(`${appUrl}/dashboard`, 'Go to your dashboard')}</p>`,
    ),
  }
}

export function receiptEmail(opts: { plan: string; amountFils: number; govFeeFils: number; appUrl: string }): Mail {
  const { plan, amountFils, govFeeFils, appUrl } = opts
  return {
    to: '',
    subject: 'Your Heirs receipt',
    html: layout(
      'Payment received',
      `<p style="${P}">Thank you — we&rsquo;ve received your payment for the <strong>${plan}</strong>. Our team is now preparing your will.</p>
       <table style="width:100%;font-size:14px;border-collapse:collapse;margin:8px 0 16px">
         <tr><td style="padding:6px 0;opacity:.7">Service fee</td><td style="padding:6px 0;text-align:right">${fmtAed(amountFils)}</td></tr>
         <tr><td style="padding:6px 0;opacity:.7">Government registration fee</td><td style="padding:6px 0;text-align:right">${fmtAed(govFeeFils)}</td></tr>
         <tr><td style="padding:8px 0;border-top:1px solid #eee;font-weight:600">Total</td><td style="padding:8px 0;border-top:1px solid #eee;text-align:right;font-weight:600">${fmtAed(amountFils + govFeeFils)}</td></tr>
       </table>
       <p style="${P}">${button(`${appUrl}/dashboard`, 'View your dashboard')}</p>`,
    ),
  }
}

export function resetEmail(link: string): Mail {
  return {
    to: '',
    subject: 'Reset your Heirs password',
    html: layout(
      'Reset your password',
      `<p style="${P}">We received a request to reset your password. This link expires in one hour.</p>
       <p style="${P}">${button(link, 'Set a new password')}</p>
       <p style="font-size:13px;line-height:1.6;opacity:.6;margin:0">If you didn&rsquo;t request this, you can safely ignore this email.</p>`,
    ),
  }
}
