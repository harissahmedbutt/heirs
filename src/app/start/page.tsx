'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { recommend } from '@/lib/recommendation'
import type { QuestionnaireAnswers } from '@/types'

/* ── Conversational flow (chat-style will questionnaire) ── */

type Step =
  | { id: string; type: 'message'; lines: string[] }
  | { id: string; type: 'choice'; question: string; options: string[] }
  | { id: string; type: 'text'; question: string; placeholder: string; inputType?: 'text' | 'email' }

const ASSISTANT = {
  name: 'Layla',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
}

const FLOW: Step[] = [
  {
    id: 'intro',
    type: 'message',
    lines: [
      "Hi, I'm Layla.",
      "Let's get your will started. First, a few quick questions, so we get a basic picture of your family and what you own here in the UAE and abroad.",
      'We use that to work out what your UAE will needs to do, and whether anything beyond it would help, like a will for assets back home.',
    ],
  },
  {
    id: 'marital',
    type: 'choice',
    question: "Let's start easy. What's your marital status?",
    options: ['Married', 'Single', 'Divorced', 'Widowed'],
  },
  {
    id: 'children',
    type: 'choice',
    question: "And do you have children? It's one of the main things a will exists to settle.",
    options: ['No', 'Yes'],
  },
  {
    id: 'uaeProperty',
    type: 'choice',
    question: 'Do you own property here in the UAE?',
    options: ['No', 'Yes'],
  },
  {
    id: 'abroad',
    type: 'choice',
    question: 'And do you hold assets outside the UAE — property, accounts or investments?',
    options: ['No', 'Yes'],
  },
  {
    id: 'name',
    type: 'text',
    question: "Great. What should we call you?",
    placeholder: 'Your name',
  },
  {
    id: 'email',
    type: 'text',
    question: 'Where should we send your recommendation?',
    placeholder: 'you@email.com',
    inputType: 'email',
  },
]

/* ── Sub-components ── */

function Avatar() {
  return (
    <Image
      src={ASSISTANT.avatar}
      alt={ASSISTANT.name}
      width={44}
      height={44}
      className="h-11 w-11 rounded-full object-cover"
    />
  )
}

function AnswerPill({ label }: { label: string }) {
  return (
    <div className="mt-4 flex justify-end">
      <span className="rounded-full border border-black/5 bg-white px-5 py-2.5 text-[15px] font-medium text-brand-navy shadow-sm">
        {label}
      </span>
    </div>
  )
}

/* Streams a set of lines in character by character (like a live chat), then calls onDone. */
function Streamed({
  lines,
  onDone,
  onTick,
}: {
  lines: string[]
  onDone: () => void
  onTick?: () => void
}) {
  const full = lines.join('\n')
  const [n, setN] = useState(0)
  const finished = n >= full.length

  useEffect(() => {
    if (finished) {
      onDone()
      return
    }
    const id = setTimeout(() => {
      setN((c) => Math.min(full.length, c + 2))
      onTick?.()
    }, 16)
    return () => clearTimeout(id)
  }, [n, full, finished, onDone, onTick])

  const shown = full.slice(0, n).split('\n')

  return (
    <div className="space-y-4">
      {shown.map((line, i) => (
        <p key={i} className="font-serif text-[20px] leading-relaxed text-brand-navy lg:text-[22px]">
          {line}
          {!finished && i === shown.length - 1 && (
            <span className="ml-0.5 inline-block h-[1.1em] w-[2px] -translate-y-[1px] animate-pulse bg-brand-navy/60 align-middle" />
          )}
        </p>
      ))}
    </div>
  )
}

/* ── Page ── */

export default function StartPage() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [draft, setDraft] = useState('')
  // Controls (answer cards / Continue) only appear once the active message finishes streaming.
  const [revealed, setRevealed] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const done = index >= FLOW.length
  const progress = Math.min(index / FLOW.length, 1)

  // Re-hide controls each time a new step (or the closing message) becomes active.
  useEffect(() => {
    setRevealed(false)
  }, [index])

  const onStreamDone = useCallback(() => setRevealed(true), [])
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [index, scrollToBottom])

  // When a message finishes streaming, the answer controls appear below it —
  // scroll them into view so the user never has to scroll to the latest question.
  useEffect(() => {
    if (revealed) scrollToBottom()
  }, [revealed, scrollToBottom])

  // Once the questionnaire is complete, persist the answers as a draft will
  // application (anonymous, cookie-tied) so the dashboard can pick them up.
  const postedRef = useRef(false)
  useEffect(() => {
    if (done && !postedRef.current) {
      postedRef.current = true
      fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      }).catch(() => {})
    }
  }, [done, answers])

  const answer = (id: string, value: string) => {
    setAnswers((a) => ({ ...a, [id]: value }))
    setDraft('')
    setIndex((i) => i + 1)
  }

  const restart = () => {
    setAnswers({})
    setDraft('')
    setIndex(0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      {/* Header with segmented progress bar */}
      <header className="sticky top-0 z-20 bg-brand-cream/90 backdrop-blur">
        <div className="flex gap-1 px-1 pt-1" aria-hidden="true">
          {[0, 1, 2, 3].map((s) => {
            const fill = Math.max(0, Math.min(1, progress * 4 - s))
            return (
              <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-black/10">
                <div className="h-full bg-brand-navy transition-all duration-500" style={{ width: `${fill * 100}%` }} />
              </div>
            )
          })}
        </div>
        <div className="relative flex items-center justify-center px-6 py-5">
          <Link href="/" className="select-none font-serif text-[26px] font-semibold tracking-tight text-brand-navy">
            heirs
          </Link>
          <button
            type="button"
            onClick={restart}
            aria-label="Start over"
            className="absolute right-6 text-brand-navy/60 transition-colors hover:text-brand-navy"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Conversation */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-6 py-12 lg:py-16">
          {FLOW.slice(0, index + 1).map((step, i) => {
            const isActive = i === index && !done
            const isPast = i < index
            const muted = isPast ? 'text-brand-navy/35' : 'text-brand-navy'

            return (
              <section key={step.id} className={i > 0 ? (isPast ? 'mt-8' : 'mt-12') : ''}>
                {/* Assistant turn — avatar only shows on the active question, not answered history */}
                {!isPast && (
                  <div className="mb-1">
                    <Avatar />
                  </div>
                )}

                {step.type === 'message' && (
                  <div className="mt-3 space-y-4">
                    {isActive ? (
                      <>
                        <Streamed lines={step.lines} onDone={onStreamDone} onTick={scrollToBottom} />
                        {revealed && (
                          <button type="button" onClick={() => setIndex((n) => n + 1)} className="btn-primary mt-2">
                            Continue
                          </button>
                        )}
                      </>
                    ) : (
                      step.lines.map((line, li) => (
                        <p key={li} className={`font-serif text-[20px] leading-relaxed lg:text-[22px] ${muted}`}>
                          {line}
                        </p>
                      ))
                    )}
                  </div>
                )}

                {step.type === 'choice' && (
                  <div className="mt-3">
                    {isActive ? (
                      <>
                        <Streamed lines={[step.question]} onDone={onStreamDone} onTick={scrollToBottom} />
                        {revealed && (
                          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                            {step.options.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => answer(step.id, opt)}
                                className="rounded-2xl border border-black/5 bg-white px-5 py-6 text-[15px] font-semibold text-brand-navy shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-navy"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className={`font-serif text-[20px] leading-relaxed lg:text-[22px] ${muted}`}>
                          {step.question}
                        </p>
                        <AnswerPill label={answers[step.id]} />
                      </>
                    )}
                  </div>
                )}

                {step.type === 'text' && (
                  <div className="mt-3">
                    {isActive ? (
                      <>
                        <Streamed lines={[step.question]} onDone={onStreamDone} onTick={scrollToBottom} />
                        {revealed && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (draft.trim()) answer(step.id, draft.trim())
                            }}
                            className="mt-6 flex flex-col gap-3 sm:flex-row"
                          >
                            <input
                              type={step.inputType ?? 'text'}
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              placeholder={step.placeholder}
                              autoFocus
                              required
                              className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3.5 text-[15px] text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-navy"
                            />
                            <button type="submit" className="btn-primary">
                              Continue
                            </button>
                          </form>
                        )}
                      </>
                    ) : (
                      <>
                        <p className={`font-serif text-[20px] leading-relaxed lg:text-[22px] ${muted}`}>
                          {step.question}
                        </p>
                        <AnswerPill label={answers[step.id]} />
                      </>
                    )}
                  </div>
                )}
              </section>
            )
          })}

          {/* Closing recommendation */}
          {done && (
            <section className="mt-12">
              <div className="mb-1">
                <Avatar />
              </div>
              <div className="mt-3">
                <Streamed
                  lines={[recommend(answers as QuestionnaireAnswers).closing]}
                  onDone={onStreamDone}
                  onTick={scrollToBottom}
                />
                {revealed && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a href="/dashboard" className="btn-primary">
                      See my recommendation
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-white px-7 py-3.5 text-[15px] font-medium text-brand-navy transition hover:bg-white/60"
                    >
                      Book a call instead
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}

          <div ref={bottomRef} />
        </div>
      </main>
    </div>
  )
}
