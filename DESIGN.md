# Heirs — Design Language

This document defines the visual and interaction system for Heirs. It is the
single source of truth for how the product looks, moves, and feels. The goal is a
calm, premium, **trust-first** experience: estate planning is a serious, emotional
decision, so the interface stays quiet and editorial and lets warmth come from
photography and language — never from loud UI.

---

## 1. Principles

1. **Restraint over decoration.** Generous whitespace, few borders, no gradients-as-accent.
   The page should feel like a well-set page of print, not a dashboard.
2. **Editorial serif + clean sans.** A serif carries every headline and question; a
   neutral sans carries body copy. The contrast is the brand.
3. **Monochrome UI, photography as colour.** The interface is warm off-white, near-black
   ink, and white. Colour enters through full-bleed human photography and a few muted
   pastel cards — not through a coloured accent.
4. **Black is the action colour.** Primary actions are solid black pills. There is no blue
   (or other) brand accent; emphasis comes from weight, scale, and contrast.
5. **Motion that feels alive, never busy.** Text streams in like a real conversation, a
   section pins and advances as you scroll, testimonials drift slowly. Motion is smooth,
   slow, and always respects `prefers-reduced-motion`.

---

## 2. Colour

Defined in `tailwind.config.ts` under `theme.extend.colors`.

| Token | Hex | Role |
| --- | --- | --- |
| `brand-navy` | `#1A1816` | Primary ink: text, headings, dark sections, black pills. A warm near-black, **not** pure black. |
| `brand-navy-mid` | `#2B2826` | Hover/pressed state for the ink (e.g. primary button hover). |
| `brand-navy-light` | `#48433F` | Tertiary warm ink for rare low-emphasis fills. |
| `brand-cream` | `#F9F8F6` | Page background. Warm off-white — the default canvas. |
| `brand-cream-dark` | `#F0EDE9` | Subtle raised/striped surfaces on cream. |
| `brand-cream-warm` | `#ECE9E3` | Footer background — a touch deeper than cream. |
| `brand-muted` | `#6A7282` | Muted/secondary text where `text-gray-500` isn't warm enough. |
| `pastel-sage` `pastel-tan` `pastel-blue` `pastel-stone` `pastel-rose` | `#DDE4D8` `#EFE7DA` `#D8E3EC` `#E7E4DD` `#EEE1DC` | Testimonial card backgrounds. Always muted, never saturated. Cycle in order. |

**Rules**
- The page is cream; sections alternate cream ↔ white ↔ full-bleed photo. The **footer**
  is the only persistently darker-warm surface (`brand-cream-warm`).
- Body/secondary copy uses `text-gray-500`; headings and primary copy use `text-brand-navy`.
- **No blue.** If a design needs "an accent", the answer is contrast (black pill),
  scale (bigger serif), or a photograph — not a colour.

---

## 3. Typography

Loaded via `next/font` in `app/layout.tsx`; exposed as CSS variables and mapped in
`tailwind.config.ts`.

- **Display / headings — `font-serif` → Source Serif 4.** Every `h1`–`h6` is serif by
  default (set globally in `globals.css`). Weight `500`–`600`, tight leading. This is the
  voice of the brand: hero headline, section titles, the offer price, every question in
  the Start flow, testimonial quotes, the founder quote.
- **Body / UI — `font-sans` → Source Sans 3.** Paragraphs, labels, nav links, button text,
  feature descriptions, footnotes.
- **Base size: 15px** (`body` in `globals.css`). The scale runs roughly:
  - Hero headline `text-5xl → text-7xl`
  - Section headings `text-4xl → text-5xl`
  - Questions / lead copy `text-[20px] → text-[22px]` serif
  - Body `text-[15px]–text-[17px]`, muted detail `text-[13px]–text-[14px]`

**Rule:** if it's a headline, a question, a quote, or a price → serif. Everything else → sans.

---

## 4. Layout, spacing & shape

- **`container-width`** — `max-w-7xl` centred with responsive horizontal padding. The hero
  copy and navbar share this container so the wordmark and headline align on the same left edge.
- **`section-padding`** — the standard vertical rhythm between sections (`py-20 lg:py-28`).
- **Radius**
  - `rounded-brand` = **24px** — cards, panels, answer tiles, image frames.
  - `rounded-full` — buttons, pills, chips, the avatar.
- **Full-bleed photo sections** break out of the container and run edge-to-edge (hero,
  "How it works", final CTA). White text sits over a left/bottom dark gradient for legibility.
- Section backgrounds alternate to create rhythm: `cream → white → photo → cream …`.

---

## 5. Components & patterns

### Buttons
- **Primary** — `.btn-primary` (in `globals.css`): solid black pill, white text,
  `rounded-full`, subtle press scale. Used for every primary action ("Start Your Will",
  "Continue", "Create my account").
- **On photos** — a **white** pill with `text-brand-navy` (same shape) for contrast over imagery.
- **Tertiary** — a plain text link with a chevron ("See how it works"); inherits white on
  photos, ink on light.

### Navbar (`Navbar.tsx`)
Transparent with **white** wordmark/links while over the hero; on scroll it collapses into
a **floating white pill** (`useScrolled`) with ink text and a black "Start Your Will" pill.
The wordmark is the lowercase serif `heirs`.

### Hero (`Hero.tsx`)
Full-bleed photograph, dark left/bottom gradient, white serif headline + subcopy positioned
**lower-left** and aligned to `container-width`. A small trust pill ("2,000+ UAE wills created")
and a "Learn more" scroll cue.

### Pillars (`ServicePillars.tsx`)
Centred serif heading + four **plain text columns** (title + description). No cards, icons,
or borders — pure typography.

### How it works (`HowItWorks.tsx`)
A **scroll-pinned** section: the section is tall, an inner `sticky top-0 h-screen` panel
holds a fixed full-bleed photo, and the active step (Your life → Recommendation → Preparation
→ Support → Paperwork) is **driven by scroll progress**. A vertical step list sits on the
right; step labels are also clickable (smooth-scroll). Three translucent FAQ pills sit lower-left.

### The offer (`Pricing.tsx`)
Centred eyebrow + a large serif price headline, then a **full-width striped feature list**
(`<dl>` rows, alternating subtle stripe). No photo, no pricing tiers — one clear offer.

### Testimonials (`Testimonials.tsx`)
A continuous, slow **marquee** of uniform fixed-size cards in muted pastels, with one
**black "2,000+" stat card**. Pauses on hover; halts under `prefers-reduced-motion`.

### Founder + Add-ons (`FounderQuote.tsx`)
Two columns on cream: a large serif pull-quote (with avatar + name) on the left, the
add-on list (title · price · description, divided rows) on the right.

### Final CTA (`FinalCTA.tsx`)
Full-bleed family photo, dark gradient, white serif "Ready to get started?" + white pill.

### Footer (`Footer.tsx`)
Light `brand-cream-warm`. Lowercase serif wordmark + disclaimer on the left; "Services" and
"Legal" link columns on the right; licence + copyright bottom row.

### Start Your Will — conversational form (`app/start/page.tsx`)
The questionnaire is a **chat**, not a form:
- Minimal header: segmented progress bar, centred `heirs` wordmark, restart icon.
- An assistant ("Layla") avatar appears **only on the active question**; answered turns
  collapse into greyed history.
- Assistant messages **stream in character-by-character** with a blinking caret; answer
  controls (white tiles, Continue, or input) appear only once the text finishes.
- The user's answer renders as a **right-aligned pill**. The view auto-scrolls to the newest turn.

### Cookie notice (`CookieConsent.tsx`)
A dismissible dark bar pinned to the bottom, site-wide. Renders only after mount (no
hydration flash) and remembers dismissal in `localStorage`.

---

## 6. Motion

| Pattern | Where | Feel |
| --- | --- | --- |
| **Streaming text** | Start flow questions/messages | Live, human, conversational. |
| **Scroll-pin + step** | How it works | Immersive, deliberate; you control the pace. |
| **Slow marquee** | Testimonials | Ambient drift; pauses on hover. |
| **Hover lift** | Answer tiles, cards | `-translate-y` + soft shadow; small and quick. |
| **Reveal/slide** | Section content | `animate-slide-up` / fade; 200–500ms, ease-out. |

All motion is smooth and unhurried. Anything that loops or auto-plays must pause on hover
and disable under `prefers-reduced-motion`.

---

## 7. Imagery

- Warm, candid, **human** photography — families, couples, and UAE context (e.g. the Dubai
  skyline at dusk for the hero). Documentary, not stock-posed.
- Photos run **full-bleed** in the hero, "How it works", and final CTA.
- Over any photo, apply a dark gradient (heavier on the side the text sits) so white serif
  text stays legible.
- Replace placeholder imagery with **licensed** Heirs photography before production.

---

## 8. Voice & tone

Plain, warm, and expert. Short sentences. Reassuring, never salesy or legalistic in the
marketing copy; conversational and one-question-at-a-time in the Start flow. We explain
*why* something matters ("…it's one of the main things a will exists to settle").

---

## 9. Quick do / don't

**Do**
- Lead with a serif headline and lots of space.
- Use black pills for actions and photography for warmth.
- Keep history quiet; emphasise the one thing that's active.

**Don't**
- Introduce a coloured brand accent (no blue/gold).
- Box everything in cards or borders.
- Use pure black `#000` or pure-cold grey — keep ink and neutrals warm.
- Animate fast or loop without a hover-pause and reduced-motion fallback.
