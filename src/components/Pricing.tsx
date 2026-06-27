type Feature = {
  title: string
  description: string
}

const features: Feature[] = [
  {
    title: 'Assigned expert',
    description: 'A dedicated Heirs expert from start to registration',
  },
  {
    title: 'English & Arabic',
    description: 'Prepared in both languages for the ADJD process',
  },
  {
    title: 'Court submission',
    description: 'Guidance through ADJD or ADGM submission and registration',
  },
  {
    title: 'Protection beyond the UAE',
    description:
      'Add a coordinated power of attorney or a home-country will if your situation calls for it.',
  },
  {
    title: 'Assets and wishes',
    description: 'Money, property, belongings and personal instructions',
  },
  {
    title: 'Guardianship',
    description: 'Name who should care for your children',
  },
  {
    title: 'Executors',
    description: 'Choose who should handle your estate',
  },
  {
    title: 'Mirror wills for couples',
    description: 'Two coordinated wills for AED 1,199',
  },
  {
    title: 'Vault & Capsules',
    description: 'Store documents and share key instructions securely',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-brand-cream section-padding">
      <div className="container-width">
        <div className="text-center">
          <p className="text-[13px] text-gray-500">
            Your UAE will covers the essentials.
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-medium leading-tight text-brand-navy sm:text-5xl">
            What used to cost thousands now starts at AED 799*.
          </h2>
        </div>

        <dl className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-brand sm:mt-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-12 sm:gap-6 ${
                index % 2 === 1 ? 'bg-black/[0.025]' : 'bg-transparent'
              }`}
            >
              <dt className="text-[15px] font-semibold text-brand-navy sm:col-span-5">
                {feature.title}
              </dt>
              <dd className="text-[14px] leading-relaxed text-gray-500 sm:col-span-7">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 text-center">
          <a href="/start" className="btn-primary">
            Start Your Will
          </a>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] leading-relaxed text-gray-500">
          *ADJD registration fee (AED 950, or AED 1,900 for mirror wills) is paid
          separately to the court. Optional fast-track notarization via ADGM is AED 570
          per will, depending on your situation.
        </p>
      </div>
    </section>
  )
}
