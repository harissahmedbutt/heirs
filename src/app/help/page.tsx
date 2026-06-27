import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HelpFaqs from '@/components/HelpFaqs'

export const metadata: Metadata = {
  title: 'Help & Contact',
  description:
    'Get help with your UAE will. Start a chat for instant answers, email our team, or browse the questions we hear most often about creating and registering your will.',
  alternates: { canonical: '/help' },
}

const SUPPORT_EMAIL = 'hello@heirs.ae'

export default function HelpPage() {
  return (
    <>
      <Navbar overHero={false} />
      <main className="bg-brand-cream">
        <div className="container-width pt-36 pb-20 lg:pt-44 lg:pb-28">
          <div className="max-w-4xl">
            {/* Hero */}
            <h1 className="font-serif text-[44px] font-semibold leading-[1.05] tracking-tight text-brand-navy sm:text-[56px] lg:text-[72px]">
              Get help with your will
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-gray-500 lg:text-[18px]">
              Start a chat for instant answers to common questions. If you need more help, our team
              can step in.
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="btn-primary mt-9">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-3.6-7.2L21 3l-1.2 4.2A8.96 8.96 0 0121 12z" />
              </svg>
              Start chat
            </a>

            {/* Email support */}
            <section className="mt-16 border-t border-black/10 pt-12">
              <h2 className="font-serif text-[28px] font-semibold tracking-tight text-brand-navy lg:text-[34px]">
                Email support
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-500 lg:text-[16px]">
                For questions that aren&apos;t time-sensitive, email us and our team will respond
                within 1–3 business days.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-4 inline-block text-[15px] font-medium text-brand-navy underline underline-offset-4 hover:text-brand-navy-mid"
              >
                {SUPPORT_EMAIL}
              </a>
            </section>

            {/* Common questions */}
            <section className="mt-16 border-t border-black/10 pt-12">
              <h2 className="font-serif text-[28px] font-semibold tracking-tight text-brand-navy lg:text-[34px]">
                Common questions
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-500 lg:text-[16px]">
                Answers to the questions we hear most often about creating and registering your will.
              </p>
              <div className="mt-10">
                <HelpFaqs />
              </div>
            </section>

            {/* Closing line */}
            <p className="mt-12 text-[14px] text-gray-500">
              Still have questions?{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-navy underline underline-offset-2 hover:text-brand-navy-mid">
                Start a chat
              </a>{' '}
              or{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-navy underline underline-offset-2 hover:text-brand-navy-mid">
                send us an email
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
