import type { Metadata } from 'next'
import LegalShell from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of Heirs, the estate-planning platform for expats and cross-border lives in the UAE.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="16 June 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Heirs
        website, applications and services (together, the &ldquo;Service&rdquo;). By using the
        Service you agree to these Terms. If you do not agree, please do not use the Service.
      </p>
      <p>
        <strong>Template notice.</strong> This document is a working template and not legal advice.
        It should be reviewed and adapted by qualified counsel before Heirs relies on it.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Heirs is an estate-planning platform built for expats and cross-border lives in the UAE.
        We help you understand what protection may be relevant for your situation and guide you
        through preparing and registering documents. <strong>Heirs is not a law firm and does not
        provide legal advice.</strong> Where legal advice is required, you should consult a qualified
        lawyer.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and able to enter into a binding contract to use the
        Service. By using the Service you confirm that the information you provide is accurate and
        that you are using it for your own lawful estate-planning purposes.
      </p>

      <h2>3. Your account</h2>
      <p>
        You are responsible for keeping your account credentials secure and for all activity that
        happens under your account. Tell us promptly at <a href="mailto:hello@heirs.ae">hello@heirs.ae</a>{' '}
        if you believe your account has been compromised.
      </p>

      <h2>4. The services we provide</h2>
      <p>
        We provide an online questionnaire, document preparation, guidance through signing and
        court registration, and secure storage. The specific documents and steps depend on your
        situation and the options you choose. We may update, add to or discontinue features over time.
      </p>

      <h2>5. Fees and court costs</h2>
      <p>
        Our service fees are shown before you commit and are separate from government and court fees
        (for example, ADJD or ADGM registration fees), which are paid directly to the relevant
        authority and which we do not mark up. Fees are non-refundable once work on your documents
        has begun, except where required by law.
      </p>

      <h2>6. Your responsibilities</h2>
      <ul>
        <li>Provide accurate, complete and current information about your family, assets and wishes.</li>
        <li>Review your documents carefully before they are signed or submitted.</li>
        <li>Comply with any signing, witnessing and registration requirements we explain to you.</li>
      </ul>
      <p>
        We are not responsible for outcomes that result from inaccurate or incomplete information you
        provide.
      </p>

      <h2>7. Documents and registration</h2>
      <p>
        We prepare documents based on your instructions and coordinate registration with the relevant
        UAE courts or authorities. Registration timelines and acceptance are determined by those
        authorities and are outside our control.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The Service, including its software, content and branding, belongs to Heirs or its
        licensors. We grant you a limited, non-exclusive, non-transferable licence to use the Service
        for your personal estate planning. Your documents and personal information remain yours.
      </p>

      <h2>9. Third-party services</h2>
      <p>
        The Service may rely on third parties (for example, identity providers such as Google or UAE
        Pass, and payment processors). Your use of those services is subject to their own terms.
      </p>

      <h2>10. Disclaimers and liability</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; without warranties of any kind. To the maximum
        extent permitted by law, Heirs is not liable for indirect, incidental or consequential
        losses, and our total liability for any claim is limited to the fees you paid us for the
        relevant service.
      </p>

      <h2>11. Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or end your access if you breach
        these Terms or use the Service unlawfully. Sections that by their nature should survive
        termination will continue to apply.
      </p>

      <h2>12. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. If we make material changes we will take
        reasonable steps to notify you. Continuing to use the Service after changes take effect means
        you accept the updated Terms.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of the United Arab Emirates, and the competent UAE courts
        will have jurisdiction over any dispute, subject to any mandatory consumer-protection rights.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? Email us at <a href="mailto:hello@heirs.ae">hello@heirs.ae</a>.
      </p>
    </LegalShell>
  )
}
