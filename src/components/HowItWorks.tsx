'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/* ── Content (local consts — no imports from @/constants/data) ── */

type Step = {
  number: string
  label: string
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    number: '01',
    label: 'Your life',
    title: 'We get to know you',
    body: 'We ask the key questions a lawyer would normally ask in a first meeting. You answer online, in your own time, and we use that to recommend the right protection for your situation. Most people finish this part in around 10–15 minutes.',
  },
  {
    number: '02',
    label: 'Recommendation',
    title: 'Get your recommendation',
    body: 'Based on your answers, Heirs recommends what protection to put in place. For most people, that starts with a UAE will. If a power of attorney or a coordinated home-country will would be useful, we explain why and show how it fits into your plan.',
  },
  {
    number: '03',
    label: 'Preparation',
    title: 'We prepare your documents',
    body: 'Once you choose what to move forward with, we prepare the documents you selected — your UAE will, a power of attorney, or a coordinated home-country will where relevant. You can review the drafts and request changes if anything needs adjusting.',
  },
  {
    number: '04',
    label: 'Support',
    title: 'Human support throughout',
    body: 'You are assigned a Heirs expert who manages your case, answers questions and tells you what is needed next. You can track progress in your dashboard at any time. You are not left to figure out the process alone.',
  },
  {
    number: '05',
    label: 'Paperwork',
    title: 'We handle the paperwork',
    body: 'We coordinate registration with the relevant UAE court and store your finished documents securely in your Vault — accessible to you, and the right people, when it matters most.',
  },
]

type Faq = { question: string; answer: string }

const FAQS: Faq[] = [
  {
    question: 'Is my data secure?',
    answer:
      'Yes. Everything you share is encrypted in transit and at rest, and your finished documents live in a secure Heirs Vault. You decide who can access them.',
  },
  {
    question: 'Can I include crypto and digital accounts?',
    answer:
      'Absolutely. List your crypto holdings, exchange accounts and other digital assets, and record where the keys, passwords and access details can be safely found.',
  },
  {
    question: 'Who is Heirs best for?',
    answer:
      'Heirs is built for expats and cross-border families in the UAE — people whose assets and loved ones span more than one country and who want clear, court-ready protection.',
  },
]

/* ── Component ── */

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const sectionRef = useRef<HTMLElement | null>(null)

  /* Drive the active step from scroll progress while the section is pinned. */
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = sectionRef.current
      if (!el) return
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total)
      const progress = total > 0 ? scrolled / total : 0
      const idx = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))
      setActive((prev) => (prev === idx ? prev : idx))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /* Clicking a step label scrolls to the part of the section where it's active. */
  const scrollToStep = (i: number) => {
    const el = sectionRef.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    const target = el.offsetTop + ((i + 0.5) / STEPS.length) * total
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const current = STEPS[active]

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      {/* Pinned viewport — stays put while the section scrolls past */}
      <div className="sticky top-0 flex h-screen w-full items-stretch overflow-hidden">
      {/* Full-bleed family photo background */}
      <Image
        src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1920&q=80"
        alt="A family together"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Legibility overlays */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
      />

      {/* Content */}
      <div className="container-width relative z-10 flex w-full flex-col gap-10 py-20 lg:flex-row lg:items-stretch lg:gap-12 lg:py-24">
        {/* Right-hand step list (rendered first on mobile, sits right on desktop) */}
        <div
          role="tablist"
          aria-label="How it works steps"
          aria-orientation="vertical"
          className="order-first flex w-full min-w-0 max-w-full flex-row gap-5 overflow-x-auto pb-2 lg:order-last lg:w-56 lg:max-w-none lg:shrink-0 lg:flex-col lg:items-end lg:justify-center lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {STEPS.map((step, i) => {
            const isActive = active === i
            return (
              <button
                key={step.number}
                type="button"
                role="tab"
                id={`step-tab-${i}`}
                aria-selected={isActive}
                aria-controls="step-panel"
                onClick={() => scrollToStep(i)}
                className="group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full text-[16px] font-medium tracking-tight outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:text-[17px]"
              >
                <span
                  className={
                    isActive
                      ? 'font-semibold text-white'
                      : 'text-white/40 group-hover:text-white/70'
                  }
                >
                  {step.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`transition-opacity duration-200 ${
                    isActive ? 'text-white opacity-100' : 'opacity-0'
                  }`}
                >
                  →
                </span>
              </button>
            )
          })}
        </div>

        {/* Left-hand content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Main text — vertically centered */}
          <div
            role="tabpanel"
            id="step-panel"
            aria-labelledby={`step-tab-${active}`}
            aria-live="polite"
            className="flex flex-1 flex-col justify-center"
          >
            <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              How it works
            </p>
            <h2
              key={active}
              className="max-w-xl animate-slide-up font-serif text-[40px] font-medium leading-[1.05] text-white sm:text-[52px] lg:text-[60px]"
            >
              {current.title}
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/85 lg:text-[17px]">
              {current.body}
            </p>
          </div>

          {/* FAQ accordion pills — bottom left */}
          <div className="mt-12 max-w-md space-y-3 lg:mt-10">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none transition-colors duration-200 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60"
                  >
                    <span className="text-[14px] font-medium text-white lg:text-[15px]">
                      {faq.question}
                    </span>
                    <svg
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-white/80 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0">
                      <p className="px-5 pb-4 text-[13px] leading-relaxed text-white/75 lg:text-[14px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
