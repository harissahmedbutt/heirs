import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Heirs collects, uses and protects your personal information.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="16 June 2026">
      <p>
        This Privacy Policy explains how Heirs collects, uses, shares and protects your personal
        information when you use our website, applications and services (the &ldquo;Service&rdquo;).
      </p>
      <p>
        <strong>Template notice.</strong> This document is a working template and not legal advice. It
        should be reviewed and adapted by qualified counsel before Heirs relies on it.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Heirs is the controller of the personal information processed through the Service. For any
        privacy question, contact us at <a href="mailto:hello@heirs.ae">hello@heirs.ae</a>.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li><strong>Information you give us</strong> — your name, contact details, and the details of your family, assets, beneficiaries and wishes that you enter into our questionnaire.</li>
        <li><strong>Account information</strong> — credentials and sign-in details, including where you log in with Google or UAE Pass.</li>
        <li><strong>Usage information</strong> — how you interact with the Service, collected through cookies and similar technology.</li>
        <li><strong>Device information</strong> — basic technical data such as browser type and IP address.</li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To prepare your documents and recommend the right protection for your situation.</li>
        <li>To coordinate signing and registration with the relevant UAE courts or authorities.</li>
        <li>To operate, secure and improve the Service.</li>
        <li>To communicate with you, including reminders to keep your will up to date.</li>
        <li>To comply with legal obligations and prevent misuse.</li>
      </ul>

      <h2>4. Our legal bases</h2>
      <p>
        We process your information to perform our contract with you, with your consent (which you may
        withdraw), to meet legal obligations, and for our legitimate interests in running and securing
        the Service.
      </p>

      <h2>5. Sharing and disclosure</h2>
      <p>
        We share information only as needed to provide the Service — for example with the legal
        professionals who prepare documents, the courts and authorities that register them, and
        trusted service providers (such as hosting, identity and payment providers) acting on our
        instructions. We do not sell your personal information. We may disclose information where
        required by law.
      </p>

      <h2>6. Data security</h2>
      <p>
        Your information is encrypted in transit and at rest and stored in a secure Heirs Vault.
        Access is limited to you and the people you designate, and to authorised staff who need it to
        provide the Service.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We keep your information for as long as your account is active and as needed to provide the
        Service, and afterwards only as long as required for legal, regulatory or legitimate business
        purposes.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Subject to applicable law, you may request access to, correction of, or deletion of your
        personal information, object to or restrict certain processing, and request a copy of the data
        you provided. To exercise these rights, email <a href="mailto:hello@heirs.ae">hello@heirs.ae</a>.
      </p>

      <h2>9. International transfers</h2>
      <p>
        Where we transfer information outside the UAE — for example to host data or arrange a
        home-country will — we take steps to ensure it remains protected to a comparable standard.
      </p>

      <h2>10. Cookies</h2>
      <p>
        We use cookies and similar technology as described in our <a href="/cookies">Cookie Policy</a>,
        where you can also manage your preferences.
      </p>

      <h2>11. Children</h2>
      <p>
        The Service is intended for adults. We do not knowingly collect personal information from
        anyone under 18 except as part of an adult&apos;s estate planning (for example, naming a
        guardian for a child).
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. If we make material changes we will take
        reasonable steps to notify you and will update the date above.
      </p>

      <h2>13. Contact</h2>
      <p>
        For any privacy question or request, email <a href="mailto:hello@heirs.ae">hello@heirs.ae</a>.
      </p>
    </LegalShell>
  )
}
