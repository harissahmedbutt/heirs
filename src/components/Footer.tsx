const DISCLAIMER =
  'Heirs is an estate-planning platform built for expats and cross-border lives. We help customers understand what protection may be relevant for their situation and guide them through the process. Heirs is not a law firm and does not provide legal advice.'

const FOOTER_LINKS: ReadonlyArray<{
  title: string
  links: ReadonlyArray<{ label: string; href: string }>
}> = [
  {
    title: 'Services',
    links: [
      { label: 'Individuals', href: '/#services' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Guides', href: '/blog' },
      { label: 'Contact', href: '/help' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Manage cookies', href: '/cookies' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-brand-cream-warm text-brand-navy">
      <div className="container-width section-padding">
        {/* Top area: brand + link columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          {/* Brand column */}
          <div className="max-w-md">
            <a
              href="/"
              className="font-serif text-3xl lowercase tracking-tight text-brand-navy"
              aria-label="Heirs home"
            >
              heirs
            </a>
            <p className="mt-6 max-w-md text-[14px] leading-relaxed text-gray-500">
              {DISCLAIMER}
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-16 sm:gap-24">
            {FOOTER_LINKS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-[14px] font-semibold text-brand-navy">
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-4">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[14px] text-gray-500 transition-colors duration-150 hover:text-brand-navy"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-2 border-t border-black/10 pt-8 text-[13px] text-gray-500">
          <p>© 2026 Heirs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
