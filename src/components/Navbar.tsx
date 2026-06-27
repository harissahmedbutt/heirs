'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useScrolled } from '@/hooks/useScrolled'

const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Guides', href: '/blog' },
  { label: 'FAQs', href: '/help' },
]

export default function Navbar({ overHero = true }: { overHero?: boolean }) {
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState(false)

  // dark = solid/dark-text treatment (scrolled, or a page without a hero).
  const dark = scrolled || !overHero
  // The floating rounded pill is DESKTOP ONLY. On mobile the bar is always full width.
  const pillMode = overHero && scrolled

  // Lock background scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkColor = dark ? 'text-brand-navy/70 hover:text-brand-navy' : 'text-white/80 hover:text-white'
  const barColor = dark ? 'bg-brand-navy' : 'bg-white'

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 ${
        dark ? 'border-b border-black/5 bg-brand-cream/90 backdrop-blur' : ''
      } ${pillMode ? 'lg:border-transparent lg:bg-transparent lg:backdrop-blur-0' : ''}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-4 transition-all duration-300 lg:px-10 ${
          pillMode
            ? 'lg:mt-3 lg:max-w-5xl lg:rounded-full lg:border lg:border-black/5 lg:bg-white/95 lg:px-5 lg:py-2.5 lg:shadow-lg lg:shadow-black/5 lg:backdrop-blur'
            : ''
        }`}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className={`select-none font-serif text-[28px] font-semibold tracking-tight ${
            dark ? 'text-brand-navy' : 'text-white'
          }`}
        >
          heirs
        </Link>

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className={`text-[14px] transition-colors ${linkColor}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/help" className={`text-[14px] transition-colors ${linkColor}`}>
            Help
          </Link>
          <Link href="/auth/sign-in" className={`text-[14px] transition-colors ${linkColor}`}>
            Log in
          </Link>
          <Link
            href="/start"
            className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-[14px] font-semibold transition-colors ${
              dark ? 'bg-brand-navy text-white hover:bg-brand-navy-mid' : 'bg-white text-brand-navy hover:bg-white/90'
            }`}
          >
            Start Your Will
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Open menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`block h-0.5 w-5 ${barColor}`} />
          <span className={`block h-0.5 w-5 ${barColor}`} />
          <span className={`block h-0.5 w-5 ${barColor}`} />
        </button>
      </div>
    </header>

    {/* Full-screen mobile menu overlay — sibling of <header> so no backdrop-filter
        ancestor traps its position:fixed (otherwise it can't cover the viewport). */}
    {open && (
      <div className="fixed inset-0 z-[60] flex flex-col bg-brand-cream lg:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="select-none font-serif text-[28px] font-semibold tracking-tight text-brand-navy"
            >
              heirs
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center text-brand-navy"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 px-6 pt-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-black/5 py-4 font-serif text-[24px] text-brand-navy"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/help"
              onClick={() => setOpen(false)}
              className="border-b border-black/5 py-4 font-serif text-[24px] text-brand-navy"
            >
              Help
            </Link>
            <Link
              href="/auth/sign-in"
              onClick={() => setOpen(false)}
              className="py-4 font-serif text-[24px] text-brand-navy"
            >
              Log in
            </Link>
          </nav>

        <div className="px-6 pb-10">
          <Link href="/start" onClick={() => setOpen(false)} className="btn-primary w-full">
            Start Your Will
          </Link>
        </div>
      </div>
    )}
    </>
  )
}
