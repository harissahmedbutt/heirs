import type { Plan, Testimonial, FAQ } from '@/types'

// Source data for the page's SEO structured data (components/StructuredData.tsx).
// Visible UI content lives self-contained inside each section component.

export const PLANS: Plan[] = [
  {
    name: 'UAE Will',
    price: 'AED 799',
    note: '+ AED 950 court fee',
    popular: false,
    features: [
      'Full UAE Will drafted & registered',
      'ADJD or DIFC court registration',
      'Guardianship for children',
      'Vault document storage',
      'Annual reminder to review',
      'Digital copy delivered',
    ],
  },
  {
    name: 'Mirror Wills',
    price: 'AED 1,199',
    note: '+ AED 1,900 court fee (couple)',
    popular: true,
    features: [
      'Two UAE Wills for couples',
      'Both registered through courts',
      'Guardianship for children',
      'Vault document storage',
      'Annual reminder to review',
      'Digital copies delivered',
    ],
  },
  {
    name: 'Complete Package',
    price: 'From AED 1,699',
    note: 'UAE + Home-country will',
    popular: false,
    features: [
      'UAE Will + Home-country Will',
      'Covers assets in UAE & abroad',
      'UK or India will available',
      'Power of attorney included',
      'Vault document storage',
      'Priority support',
    ],
  },
]

export const TESTIMONIALS: Testimonial[] = [
  { quote: 'I just had the session with ADJD via Webex. It is all done now. The whole process was seamless from start to finish.', name: 'Beat', detail: 'UAE Will' },
  { quote: 'Smooth, responsive, efficient and cost effective in comparison to other services I researched. Highly recommended.', name: 'Phil', detail: 'Mirror Wills' },
  { quote: 'The convenience and cost for our situation made Heirs the obvious choice. Easy to use and great support throughout.', name: 'Alan', detail: 'UAE Will' },
  { quote: 'I reviewed the online market and Heirs came out the best — both in terms of price and the quality of service.', name: 'Jon', detail: 'Complete Package' },
  { quote: "Very relevant to many expats in UAE. I love the service so far — it gave us peace of mind we've needed for a while.", name: 'Tom', detail: 'UAE Will' },
  { quote: 'The process was very straightforward. I would refer Heirs to every expat family I know in the UAE.', name: 'Michael', detail: 'Mirror Wills' },
  { quote: 'Great Service and Great Value. Exactly what expats need — professional, affordable, and genuinely helpful.', name: 'Ken', detail: 'Power of attorney' },
  { quote: 'Very fast and efficient thanks to them. Had our wills done and registered within two weeks of starting.', name: 'Nori', detail: 'Mirror Wills' },
]

export const FAQS: FAQ[] = [
  {
    question: 'Do I need a will if I live in the UAE?',
    answer:
      "Yes. Without a registered UAE will, your estate may be distributed under UAE personal status law, which can differ significantly from your home country's rules. This is especially important for expats with children, property, or bank accounts in the UAE.",
  },
  {
    question: 'How long does it take to create my will?',
    answer:
      'The online questionnaire takes 10–15 minutes. We then prepare your documents within 1–2 business days. Court registration typically takes a further 1–3 weeks depending on the emirate and court.',
  },
  {
    question: 'How much does a UAE will cost with Heirs?',
    answer:
      'Our fee starts at AED 799 for a single UAE will. Mirror wills for couples cost AED 1,199. Court fees (AED 950 per will, AED 1,900 for mirrors) are payable separately to the UAE courts — we never mark these up.',
  },
  {
    question: 'Which courts can register my will?',
    answer:
      'We work with the ADJD (Abu Dhabi Judicial Department), the Dubai International Financial Centre (DIFC) Wills Service, and ADGM (Abu Dhabi Global Market). We recommend the best option for your situation during our review.',
  },
  {
    question: 'Can I include assets from my home country?',
    answer:
      'Yes. We offer home-country wills for assets held in the UK and India (with more countries coming soon). A cross-border estate plan ensures your assets everywhere are protected without conflicts between jurisdictions.',
  },
  {
    question: 'What happens if I die without a will in the UAE?',
    answer:
      'Without a registered will, UAE courts may apply Sharia law to distribute your UAE-based estate, regardless of your nationality or religion. This can mean your assets do not pass to the people you intended, and guardianship of children may be uncertain.',
  },
  {
    question: 'Can I update my will after it is registered?',
    answer:
      'Yes. You can update or revoke your will at any time. We send annual reminders so your will stays current with your life circumstances. Updates are straightforward and typically cost less than the original registration.',
  },
  {
    question: 'Is my personal information secure?',
    answer:
      'Absolutely. All data is encrypted in transit and at rest. Your documents are stored in our secure Vault and only accessible by you and the people you designate. We never share your information with third parties.',
  },
]
