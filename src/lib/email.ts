import fs from 'node:fs'
import path from 'node:path'

export interface Mail {
  to: string
  subject: string
  html: string
}

/** Send a transactional email.
 *  - Production: Resend (raw REST, no SDK) when RESEND_API_KEY is set.
 *  - Local dev: logs to the console and writes the HTML to ./mail so emails
 *    are visible without a paid provider. */
export async function sendEmail(mail: Mail): Promise<void> {
  const from = process.env.EMAIL_FROM ?? 'Heirs <hello@heirs.ae>'

  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: mail.to, subject: mail.subject, html: mail.html }),
    })
    if (!res.ok) console.error(`Resend failed: ${res.status} ${await res.text()}`)
    return
  }

  // Dev fallback.
  console.log(`\n📧 [dev email]  to=${mail.to}  subject="${mail.subject}"`)
  try {
    const dir = path.join(process.cwd(), 'mail')
    fs.mkdirSync(dir, { recursive: true })
    const safe = mail.to.replace(/[^a-z0-9]/gi, '_')
    fs.writeFileSync(path.join(dir, `${Date.now()}-${safe}.html`), mail.html)
  } catch {
    // ignore filesystem issues in dev
  }
}
