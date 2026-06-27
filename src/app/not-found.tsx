import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream px-4">
      <Link href="/" className="text-[22px] font-bold text-brand-navy mb-16">heirs</Link>

      <p className="text-[80px] font-bold text-brand-navy/10 leading-none mb-6 select-none">404</p>
      <h1 className="text-[36px] font-bold text-brand-navy mb-4">Page not found</h1>
      <p className="text-gray-500 mb-8 text-center max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a href="/" className="btn-primary">Go home</a>
        <a href="#contact" className="btn-secondary">Contact us</a>
      </div>
    </div>
  )
}
