'use client'

import { useState } from 'react'

type Faq = { q: string; a: string }

const FAQS: Faq[] = [
  {
    q: 'I live in Dubai. Does this work for me?',
    a: 'Yes. We help residents across all seven emirates, including Dubai. Your will can be registered through the ADJD, the DIFC Wills Service or ADGM, and we recommend the right option for where you live and hold assets.',
  },
  {
    q: 'Is Heirs only for UAE wills?',
    a: 'No. A UAE will is the foundation for most people, but we also arrange home-country wills for assets held abroad (UK and India today, with more on the way) and a power of attorney where it helps.',
  },
  {
    q: 'Is Heirs a law firm?',
    a: 'No. Heirs is an estate-planning platform, not a law firm, and we do not provide legal advice. We guide you through the process, prepare court-ready documents, and work with the relevant UAE courts for registration.',
  },
  {
    q: 'Who is Heirs best for?',
    a: 'Expats and cross-border families in the UAE — anyone whose family, assets or wishes span more than one country and who wants clear, court-ready protection without the cost of a traditional law firm.',
  },
  {
    q: 'Who manages my case?',
    a: 'You are assigned a dedicated Heirs expert who handles your case from start to registration, answers your questions, and tells you exactly what is needed at each step.',
  },
  {
    q: 'What happens after I pay?',
    a: 'We prepare your documents within 1–2 business days, you review and approve the wording, and we guide you through signing and court registration. You can track progress in your dashboard the whole way.',
  },
  {
    q: 'How long does it take, including registration?',
    a: 'The questionnaire takes about 10–15 minutes. We prepare documents in 1–2 business days, and court registration typically takes a further 1–3 weeks depending on the emirate and court.',
  },
  {
    q: 'Is the ADJD court fee included?',
    a: 'No. Court fees are paid directly to the UAE courts and we never mark them up. ADJD registration is AED 950 per will (AED 1,900 for mirror wills); our service fee starts at AED 799.',
  },
  {
    q: "What does Heirs's fee include?",
    a: 'A dedicated expert, your will drafted in English and Arabic where the courts require it, guidance through ADJD or ADGM submission, secure Vault storage, and an annual reminder to keep your will up to date.',
  },
  {
    q: 'What if the court asks for a change?',
    a: 'We handle it. If the court requests an amendment during registration, your Heirs expert makes the change and resubmits at no extra service fee.',
  },
  {
    q: 'What if I have UK or overseas assets?',
    a: 'We can add a coordinated home-country will for assets held abroad — UK and India are available now, with more countries coming — so your estate is protected without conflicts between jurisdictions.',
  },
  {
    q: 'Can I include crypto and digital accounts?',
    a: 'Yes. You can list crypto holdings, exchange accounts and other digital assets, and record where the keys, passwords and access details can be safely found by the people you trust.',
  },
  {
    q: 'What if my life changes later?',
    a: 'You can update or revoke your will at any time. We send annual reminders so it stays current, and updates are straightforward — usually less than the original registration.',
  },
  {
    q: 'Why is Heirs more affordable than a traditional law firm?',
    a: 'We have turned a manual legal process into a guided online one, so you get expert-prepared, court-ready documents without paying traditional law-firm hourly rates.',
  },
  {
    q: 'Do you have an office I can visit?',
    a: 'Everything is handled online, so you can complete your will from anywhere in the UAE. If you would prefer to talk, your expert is available by chat, email or call.',
  },
  {
    q: "Who's behind Heirs?",
    a: 'Heirs is built by a team focused on estate planning for expats and cross-border lives, working alongside UAE-qualified legal professionals for document preparation and registration.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Everything you share is encrypted in transit and at rest, stored in a secure Heirs Vault, and only accessible to you and the people you designate. We never sell your information.',
  },
]

export default function HelpFaqs() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="border-t border-black/10">
      {FAQS.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="border-b border-black/10">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`help-faq-${i}`}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="text-[15px] font-medium text-brand-navy lg:text-[16px]">{faq.q}</span>
              <span
                aria-hidden="true"
                className={`shrink-0 text-brand-navy/50 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              id={`help-faq-${i}`}
              role="region"
              className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0">
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-gray-500">{faq.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
