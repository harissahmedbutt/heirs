import { FAQS, PLANS, TESTIMONIALS } from '@/constants/data'

const BASE_URL = 'https://heirs.ae'

function buildSchemas() {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/#organization`,
    name: 'Heirs',
    url: BASE_URL,
    description:
      'Online estate planning platform for expat families in the UAE. UAE wills, home-country wills, power of attorney, and document vault.',
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },
    priceRange: 'AED 499 – AED 1,699+',
    serviceType: ['Will Writing', 'Estate Planning', 'Power of Attorney', 'Document Storage'],
    availableLanguage: ['English'],
    sameAs: [],
  }

  const services = PLANS.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: plan.name,
    provider: { '@id': `${BASE_URL}/#organization` },
    offers: {
      '@type': 'Offer',
      price: plan.price.replace(/[^0-9,]/g, '').replace(',', ''),
      priceCurrency: 'AED',
      description: plan.note,
    },
    serviceOutput: plan.features.join(', '),
  }))

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const aggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Heirs',
    url: BASE_URL,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: TESTIMONIALS.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: TESTIMONIALS.slice(0, 5).map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: t.quote,
      itemReviewed: {
        '@type': 'Service',
        name: t.detail,
        provider: { '@id': `${BASE_URL}/#organization` },
      },
    })),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'How it works', item: `${BASE_URL}/#how-it-works` },
      { '@type': 'ListItem', position: 3, name: 'Pricing', item: `${BASE_URL}/#pricing` },
      { '@type': 'ListItem', position: 4, name: 'FAQs', item: `${BASE_URL}/help` },
    ],
  }

  return [localBusiness, ...services, faqPage, aggregateRating, breadcrumb]
}

export default function StructuredData() {
  const schemas = buildSchemas()

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
