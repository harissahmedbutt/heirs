import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { generateArticle, togetherConfigured } from '@/lib/together'

export const dynamic = 'force-dynamic'

async function uniqueSlug(base: string): Promise<string> {
  let slug = base || 'article'
  let i = 2
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`
  }
  return slug
}

async function generateAction(formData: FormData) {
  'use server'
  await requireAdmin()
  const topic = String(formData.get('topic') ?? '').trim()
  if (!topic) return
  const a = await generateArticle(topic)
  await prisma.article.create({
    data: {
      slug: await uniqueSlug(a.slug),
      title: a.title,
      excerpt: a.excerpt,
      metaDescription: a.metaDescription,
      bodyMarkdown: a.bodyMarkdown,
      faq: JSON.stringify(a.faq),
      tags: JSON.stringify(a.tags),
    },
  })
  revalidatePath('/ops/articles')
}

async function togglePublish(formData: FormData) {
  'use server'
  await requireAdmin()
  const id = String(formData.get('id'))
  const a = await prisma.article.findUnique({ where: { id } })
  if (!a) return
  const publishing = a.status !== 'published'
  await prisma.article.update({
    where: { id },
    data: { status: publishing ? 'published' : 'draft', publishedAt: publishing ? (a.publishedAt ?? new Date()) : a.publishedAt },
  })
  revalidatePath('/ops/articles')
  revalidatePath('/blog')
}

async function deleteArticle(formData: FormData) {
  'use server'
  await requireAdmin()
  await prisma.article.delete({ where: { id: String(formData.get('id')) } })
  revalidatePath('/ops/articles')
  revalidatePath('/blog')
}

export default async function OpsArticlesPage() {
  await requireAdmin()

  const articles = await prisma.article.findMany({ orderBy: { updatedAt: 'desc' } })

  return (
    <main className="min-h-screen bg-brand-cream">
      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/ops" className="font-serif text-2xl font-semibold text-brand-navy">
            heirs <span className="text-brand-navy/40">ops · articles</span>
          </Link>
          <Link href="/blog" className="text-sm text-brand-navy/60 underline underline-offset-2">
            View blog →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Generate */}
        <div className="rounded-brand border border-black/5 bg-white p-6">
          <h2 className="font-serif text-xl text-brand-navy">Generate a new article</h2>
          <p className="mt-1 text-sm text-brand-navy/55">
            Drafts are created with Together AI for you to review before publishing.{' '}
            {!togetherConfigured && <span className="text-amber-700">Set TOGETHER_API_KEY to enable.</span>}
          </p>
          <form action={generateAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              name="topic"
              required
              placeholder="e.g. DIFC vs ADJD wills: which should expats choose?"
              className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-brand-navy outline-none focus:border-brand-navy"
            />
            <button type="submit" disabled={!togetherConfigured} className="btn-primary disabled:opacity-50">
              Generate draft
            </button>
          </form>
        </div>

        {/* List */}
        <div className="mt-8 space-y-3">
          {articles.length === 0 && <p className="text-brand-navy/50">No articles yet.</p>}
          {articles.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-brand border border-black/5 bg-white p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-brand-navy">{a.title}</p>
                <p className="truncate text-[13px] text-brand-navy/45">/blog/{a.slug}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs ${a.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-brand-navy/5 text-brand-navy/60'}`}>
                {a.status}
              </span>
              <Link href={`/blog/${a.slug}?preview=1`} className="text-[13px] text-brand-navy underline underline-offset-2">
                Preview
              </Link>
              <form action={togglePublish}>
                <input type="hidden" name="id" value={a.id} />
                <button className="rounded-lg bg-brand-navy px-3 py-1.5 text-[13px] font-medium text-white">
                  {a.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
              </form>
              <form action={deleteArticle}>
                <input type="hidden" name="id" value={a.id} />
                <button className="text-[13px] text-brand-navy/40 hover:text-red-600">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
