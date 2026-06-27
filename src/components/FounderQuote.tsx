import Image from 'next/image'

type AddOn = {
  title: string
  price: string
  description: string
}

const ADD_ONS: AddOn[] = [
  {
    title: 'Home-country will',
    price: 'From AED 499',
    description:
      'For property, accounts or other assets outside the UAE. UK and India available now, with more countries to come.',
  },
  {
    title: 'Power of attorney',
    price: 'AED 499',
    description:
      'Let someone you trust handle banking, healthcare or UAE admin if you are travelling, unavailable or unable to act yourself.',
  },
  {
    title: 'Vault & Capsules',
    price: 'Included',
    description:
      'Store your documents in one place and share key instructions with the right people.',
  },
]

export default function FounderQuote() {
  return (
    <section id="founder" className="bg-brand-cream section-padding">
      <div className="container-width">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: Founder quote */}
          <figure className="max-w-md">
            <span
              aria-hidden="true"
              className="block font-serif text-7xl leading-none text-brand-navy/25"
            >
              &ldquo;
            </span>

            <blockquote className="mt-2 font-serif text-2xl leading-snug text-brand-navy lg:text-3xl">
              A UAE will covers your life here &mdash; for many people, that&rsquo;s
              all they need. If your life spans borders, we&rsquo;ll tell you
              what&rsquo;s worth adding: a will for assets back home, a power of
              attorney, or nothing at all.
            </blockquote>

            <figcaption className="mt-8 flex items-center gap-3">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Heirs founder"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span>
                <span className="text-[14px] font-semibold text-brand-navy">
                  James Whitfield
                </span>{' '}
                <span className="text-[13px] text-gray-500">Founder</span>
              </span>
            </figcaption>
          </figure>

          {/* RIGHT: Add-ons */}
          <div>
            <ul role="list">
              {ADD_ONS.map((addOn, index) => (
                <li
                  key={addOn.title}
                  className={
                    index === 0
                      ? 'py-6 first:pt-0'
                      : 'border-t border-black/10 py-6'
                  }
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-semibold text-brand-navy">
                      {addOn.title}
                    </h3>
                    <span className="shrink-0 text-[13px] text-gray-500">
                      {addOn.price}
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                    {addOn.description}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[12px] leading-relaxed text-gray-500">
              POA notary fees are paid separately. UK and India wills are add-ons
              to the UAE will journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
