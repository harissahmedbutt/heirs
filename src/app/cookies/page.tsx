import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'
import ManageCookiesButton from '@/components/ManageCookiesButton'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Heirs uses cookies and similar technology, and how to manage your preferences.',
  alternates: { canonical: '/cookies' },
}

export default function CookiesPage() {
  return (
    <LegalShell title="Cookie Policy" updated="16 June 2026">
      <p>
        This Cookie Policy explains how Heirs uses cookies and similar technology on our website and
        applications (the &ldquo;Service&rdquo;), and how you can manage your choices.
      </p>
      <p>
        <strong>Template notice.</strong> This document is a working template and not legal advice. It
        should be reviewed and adapted by qualified counsel before Heirs relies on it.
      </p>

      <h2>What cookies are</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. They help the
        site work, remember your preferences, and understand how the site is used. We also use similar
        technologies such as local storage, which we refer to collectively as &ldquo;cookies&rdquo;.
      </p>

      <h2>How we use cookies</h2>
      <ul>
        <li><strong>Essential</strong> — needed for the Service to function, such as keeping you signed in, securing your session and remembering your cookie choice.</li>
        <li><strong>Preferences</strong> — remember settings and choices so your experience is consistent.</li>
        <li><strong>Analytics</strong> — help us understand how the Service is used so we can improve it. These are only set with your consent.</li>
      </ul>

      <h2>Third-party cookies</h2>
      <p>
        Some features rely on third parties — for example sign-in with Google or UAE Pass, and payment
        processing. Those providers may set their own cookies, governed by their own policies.
      </p>

      <h2>Managing your preferences</h2>
      <p>
        You can reset your cookie choice at any time using the button below. This clears your saved
        preference and reloads the page so the cookie notice appears again.
      </p>
      <p>
        <ManageCookiesButton />
      </p>
      <p>
        You can also control cookies through your browser settings. Blocking essential cookies may stop
        parts of the Service from working.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time and will update the date above when we do.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about cookies? Email <a href="mailto:hello@heirs.ae">hello@heirs.ae</a>.
      </p>
    </LegalShell>
  )
}
