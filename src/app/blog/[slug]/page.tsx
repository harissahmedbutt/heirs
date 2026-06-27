import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://heirs.ae'

async function getArticle(slug: string, allowDraft: boolean) {
  const a = await prisma.article.findUnique({ where: { slug } })
  if (!a) return null
  if (a.status !== 'published' && !allowDraft) return null
  return a
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = await prisma.article.findUnique({ where: { slug } })
  if (!a) return { title: 'Not found' }
  return {
    title: a.title,
    description: a.metaDescription,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.metaDescription,
      url: `${BASE_URL}/blog/${a.slug}`,
      type: 'article',
      publishedTime: a.publishedAt?.toISOString(),
      modifiedTime: a.updatedAt.toISOString(),
      authors: [a.author],
    },
    twitter: { card: 'summary_large_image', title: a.title, description: a.metaDescription },
  }
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const { preview } = await searchParams
  const session = preview ? await auth() : null
  const a = await getArticle(slug, !!preview && !!session?.user)
  if (!a) notFound()

  const faq = JSON.parse(a.faq) as { q: string; a: string }[]
  const tags = JSON.parse(a.tags) as string[]
  const published = a.publishedAt ?? a.createdAt

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.metaDescription,
      datePublished: published.toISOString(),
      dateModified: a.updatedAt.toISOString(),
      author: { '@type': 'Organization', name: a.author },
      publisher: { '@type': 'Organization', name: 'Heirs', url: BASE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${a.slug}` },
      keywords: tags.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: a.title, item: `${BASE_URL}/blog/${a.slug}` },
      ],
    },
    ...(faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : []),
  ]

  return (
    <div className="bg-brand-cream">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-2xl font-semibold text-brand-navy">
            heirs
          </Link>
          <Link href="/blog" className="text-sm text-brand-navy/60 underline underline-offset-2">
            All guides
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-14 lg:py-20">
        {a.status !== 'published' && (
          <p className="mb-6 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">Draft preview</p>
        )}
        <p className="text-[13px] text-brand-navy/40">
          {fmtDate(published)} · {a.author}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-brand-navy lg:text-[44px]">{a.title}</h1>

        <article className="prose prose-neutral mt-10 max-w-none prose-headings:font-serif prose-headings:text-brand-navy prose-p:text-brand-navy/80 prose-li:text-brand-navy/80 prose-a:text-brand-navy prose-strong:text-brand-navy">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{a.bodyMarkdown}</ReactMarkdown>
        </article>

        {faq.length > 0 && (
          <section className="mt-14">
            <h2 className="font-serif text-2xl text-brand-navy">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-black/5 border-t border-black/5">
              {faq.map((f, i) => (
                <div key={i} className="py-5">
                  <h3 className="font-medium text-brand-navy">{f.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-brand-navy/70">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-brand-navy/5 px-3 py-1 text-[12px] text-brand-navy/60">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 rounded-brand bg-brand-navy p-8 text-center text-white">
          <h2 className="font-serif text-2xl">Ready to protect your family?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/70">
            Start your UAE will online in minutes. We&rsquo;ll recommend exactly what you need.
          </p>
          <Link href="/start" className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-brand-navy">
            Start your will
          </Link>
        </div>

        <p className="mt-10 text-center text-xs text-brand-navy/40">
          This guide is general information, not legal advice. Heirs is not a law firm.
        </p>
      </main>

      <Footer />
    </div>
  )
}
