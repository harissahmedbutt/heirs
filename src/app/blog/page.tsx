import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://heirs.ae'

export const metadata: Metadata = {
  title: 'Guides — UAE Wills & Estate Planning',
  description:
    'Clear, up-to-date guides on UAE wills, inheritance law, guardianship and estate planning for expats — from Heirs.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Heirs Guides — UAE Wills & Estate Planning',
    description: 'Guides on UAE wills, inheritance law and estate planning for expats.',
    url: `${BASE_URL}/blog`,
    type: 'website',
  },
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogIndexPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  })

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/blog/${a.slug}`,
      name: a.title,
    })),
  }

  return (
    <div className="bg-brand-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-semibold text-brand-navy">
            heirs
          </Link>
          <Link href="/start" className="btn-primary !py-2 text-sm">
            Start your will
          </Link>
        </div>
      </header>

      <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-14 lg:py-20">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-navy/40">Guides</p>
        <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-tight text-brand-navy lg:text-5xl">
          UAE wills &amp; estate planning, explained
        </h1>
        <p className="mt-4 max-w-prose text-brand-navy/60">
          Practical guidance for expats — wills, inheritance, guardianship and protecting your family in the UAE and abroad.
        </p>

        <div className="mt-12 divide-y divide-black/5 border-t border-black/5">
          {articles.length === 0 && (
            <p className="py-12 text-brand-navy/50">New guides are on the way.</p>
          )}
          {articles.map((a) => (
            <article key={a.id} className="group py-8">
              <Link href={`/blog/${a.slug}`} className="block">
                {a.publishedAt && (
                  <time className="text-[13px] text-brand-navy/40">{fmtDate(a.publishedAt)}</time>
                )}
                <h2 className="mt-1 font-serif text-2xl text-brand-navy group-hover:underline">{a.title}</h2>
                <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-brand-navy/65">{a.excerpt}</p>
                <span className="mt-3 inline-block text-[14px] font-medium text-brand-navy">Read guide →</span>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
