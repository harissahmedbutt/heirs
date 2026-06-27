import type { Metadata } from 'next'
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google'
import StructuredData from '@/components/StructuredData'
import CookieConsent from '@/components/CookieConsent'
import './globals.css'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
})

// Display/heading serif — matches Blanket's --font-landing-serif (Source Serif 4)
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-serif',
  display: 'swap',
})

const BASE_URL = 'https://heirs.ae'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Heirs — Make your Will online | UAE Estate Planning',
    template: '%s | Heirs',
  },
  description:
    'Protect your family, assets and wishes in the UAE and beyond. Create your UAE will online in 10–15 minutes. Registered through UAE courts. Starting from AED 799.',
  keywords: [
    'UAE will', 'online will UAE', 'expat will UAE', 'estate planning UAE',
    'power of attorney UAE', 'ADJD will', 'DIFC will', 'mirror wills UAE',
    'will writing Dubai', 'expat estate planning',
  ],
  authors: [{ name: 'Heirs Technologies Ltd' }],
  creator: 'Heirs Technologies Ltd',
  publisher: 'Heirs Technologies Ltd',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: BASE_URL,
    siteName: 'Heirs',
    title: 'Heirs — Make your Will online | UAE Estate Planning',
    description: 'Protect your family, assets and wishes in the UAE and beyond. Create your UAE will online in 10–15 minutes. Starting from AED 799.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Heirs — UAE Estate Planning for Expats' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heirs — Make your Will online | UAE Estate Planning',
    description: 'Protect your family, assets and wishes in the UAE. Create your UAE will online in 10–15 minutes. From AED 799.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: BASE_URL },
  verification: { google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) mutate <body> before hydration; this ignores
          those extension-injected attribute diffs only. */}
      <body suppressHydrationWarning>
        <StructuredData />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
