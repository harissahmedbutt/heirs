/* ── Content (local consts — adapted for Heirs) ── */

type QuoteItem = { kind: 'quote'; name: string; quote: string }
type StatItem = { kind: 'stat' }
type Item = QuoteItem | StatItem

const TESTIMONIALS: QuoteItem[] = [
  { kind: 'quote', name: 'Tom', quote: 'I love the service so far. Very relevant to many expats in the UAE.' },
  { kind: 'quote', name: 'Michael', quote: 'The process was very straightforward. I would refer Heirs to my friends.' },
  { kind: 'quote', name: 'Ken', quote: 'Great Service and Great Value.' },
  { kind: 'quote', name: 'Nori', quote: 'Very fast and efficient thanks to them.' },
  { kind: 'quote', name: 'Beat', quote: 'I just had the session with ADJD via Webex. It is all done now.' },
  { kind: 'quote', name: 'Phil', quote: 'Smooth, responsive, efficient and cost effective in comparison with alternative services.' },
  { kind: 'quote', name: 'Alan', quote: 'The convenience and cost for our situation made it attractive. The process has been very easy.' },
  { kind: 'quote', name: 'Jon', quote: 'I reviewed the online market and Heirs came out the best service.' },
]

/* Build the strip with one black stat card inserted at the third position. */
const ITEMS: Item[] = [
  TESTIMONIALS[0],
  TESTIMONIALS[1],
  { kind: 'stat' },
  ...TESTIMONIALS.slice(2),
]

/* Muted pastel backgrounds cycle through the configured palette, then repeat. */
const PASTELS = ['bg-pastel-sage', 'bg-pastel-tan', 'bg-pastel-blue', 'bg-pastel-stone', 'bg-pastel-rose'] as const

/* Every card shares one fixed footprint so the strip is perfectly uniform.
   The trailing margin (instead of a flex gap) makes the marquee's -50% shift exact. */
const CARD_SIZE = 'h-[360px] w-[280px] mr-5 shrink-0 rounded-brand'

function Card({ item, pastel }: { item: Item; pastel: string }) {
  if (item.kind === 'stat') {
    return (
      <div className={`flex flex-col justify-center bg-brand-navy p-8 text-center ${CARD_SIZE}`}>
        <p className="font-serif text-5xl font-semibold leading-none text-white">Court-ready</p>
        <p className="mt-4 text-sm leading-relaxed text-white/70">Wills drafted and registered with the UAE courts</p>
      </div>
    )
  }
  return (
    <figure className={`flex flex-col p-6 lg:p-8 ${CARD_SIZE} ${pastel}`}>
      <span aria-hidden="true" className="font-serif text-5xl leading-none text-brand-navy/30">
        &ldquo;
      </span>
      <blockquote className="mt-3 flex-1 overflow-hidden font-serif text-[16px] leading-snug text-brand-navy lg:text-[18px]">
        {item.quote}
      </blockquote>
      <figcaption className="mt-6 text-sm text-gray-500">{item.name}</figcaption>
    </figure>
  )
}

/* ── Section ── */

export default function Testimonials() {
  // Pre-assign a pastel to each non-stat card so the colour order is stable.
  let pastelIndex = 0
  const cards = ITEMS.map((item) => ({
    item,
    pastel: item.kind === 'quote' ? PASTELS[pastelIndex++ % PASTELS.length] : '',
  }))

  return (
    <section id="testimonials" className="bg-brand-cream section-padding">
      <div className="container-width">
        <h2 className="max-w-md font-serif text-4xl font-semibold leading-tight tracking-tight text-brand-navy lg:text-5xl">
          Trusted by people just like you.
        </h2>
      </div>

      {/* Continuous marquee — one track holding two copies loops seamlessly. Pauses on hover. */}
      <div className="group mt-12 overflow-hidden" role="region" aria-label="Client testimonials">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {cards.map(({ item, pastel }, i) => (
            <Card key={`a-${i}`} item={item} pastel={pastel} />
          ))}
          {cards.map(({ item, pastel }, i) => (
            <Card key={`b-${i}`} item={item} pastel={pastel} />
          ))}
        </div>
      </div>
    </section>
  )
}
