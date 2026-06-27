# {{Product}} — Design Language

This document defines the visual and interaction system for **{{Product}}**. It is the
single source of truth for how the product looks, moves, and feels. The goal is a
calm, premium, **trust-first** experience: the interface stays quiet and editorial and
lets warmth come from photography and language — never from loud UI.

> **How to use this template.** Replace every `{{placeholder}}` with your project's
> values, rename the colour/spacing tokens to match your config, and swap the component
> examples for your own. Keep the *principles* (§1) and the *do/don't* (§9) intact — they
> are the system; everything else is an instance of it.

---

## 1. Principles

1. **Restraint over decoration.** Generous whitespace, few borders, no gradients-as-accent.
   The page should feel like a well-set page of print, not a dashboard.
2. **Editorial serif + clean sans.** A serif carries every headline and question; a
   neutral sans carries body copy. The contrast is the brand.
3. **Monochrome UI, photography as colour.** The interface is one warm off-white, one
   near-black ink, and white. Colour enters through full-bleed human photography and a few
   muted pastel surfaces — not through a coloured accent.
4. **One action colour.** Primary actions are solid pills in the ink colour. There is no
   secondary brand accent; emphasis comes from weight, scale, and contrast.
5. **Motion that feels alive, never busy.** Reveal copy like a real conversation, let a
   section pin and advance as you scroll, drift ambient elements slowly. Motion is smooth,
   slow, and always respects `prefers-reduced-motion`.

---

## 2. Colour

Define these as named tokens in your theme config (e.g. `tailwind.config.ts` under
`theme.extend.colors`). Names below are roles, not literal values — pick warm hues.

| Token | Example | Role |
| --- | --- | --- |
| `ink` | `#1A1816` | Primary ink: text, headings, dark sections, action pills. A **warm near-black, not pure black**. |
| `ink-mid` | `#2B2826` | Hover/pressed state for the ink (e.g. primary button hover). |
| `ink-light` | `#48433F` | Tertiary warm ink for rare low-emphasis fills. |
| `canvas` | `#F9F8F6` | Page background. Warm off-white — the default canvas. |
| `canvas-dark` | `#F0EDE9` | Subtle raised/striped surfaces on the canvas. |
| `canvas-warm` | `#ECE9E3` | Footer background — a touch deeper than canvas. |
| `muted` | `#6A7282` | Muted/secondary text where the default grey isn't warm enough. |
| `pastel-*` (×5) | `#DDE4D8` `#EFE7DA` `#D8E3EC` `#E7E4DD` `#EEE1DC` | Accent card backgrounds. Always muted, never saturated. Cycle in order. |

**Rules**
- The page is canvas; sections alternate canvas ↔ white ↔ full-bleed photo. The **footer**
  is the only persistently darker-warm surface.
- Body/secondary copy uses a muted grey; headings and primary copy use `ink`.
- **No second accent.** If a design needs "an accent", the answer is contrast (ink pill),
  scale (bigger serif), or a photograph — not a new colour.

---

## 3. Typography

Load fonts via your framework's font pipeline; expose them as CSS variables and map them
in the theme (`font-serif`, `font-sans`).

- **Display / headings — `font-serif`.** Every `h1`–`h6` is serif by default (set globally
  in your base stylesheet). Weight `500`–`600`, tight leading. This is the voice of the
  brand: hero headline, section titles, prices, every question in a flow, quotes.
- **Body / UI — `font-sans`.** Paragraphs, labels, nav links, button text, descriptions,
  footnotes.
- **Base size: ~15px.** The scale runs roughly:
  - Hero headline `text-5xl → text-7xl`
  - Section headings `text-4xl → text-5xl`
  - Questions / lead copy `~20–22px` serif
  - Body `~15–17px`, muted detail `~13–14px`

**Rule:** if it's a headline, a question, a quote, or a price → serif. Everything else → sans.

---

## 4. Layout, spacing & shape

- **`container-width`** — a centred max width (e.g. `max-w-7xl`) with responsive horizontal
  padding. Hero copy and navbar share this container so the wordmark and headline align on
  the same left edge.
- **`section-padding`** — the standard vertical rhythm between sections (e.g. `py-20 lg:py-28`).
- **Radius**
  - `rounded-brand` ≈ **24px** — cards, panels, answer tiles, image frames.
  - `rounded-full` — buttons, pills, chips, avatars.
- **Full-bleed photo sections** break out of the container and run edge-to-edge (hero, key
  explainer, final CTA). White text sits over a left/bottom dark gradient for legibility.
- Section backgrounds alternate to create rhythm: `canvas → white → photo → canvas …`.

---

## 5. Components & patterns

### Buttons
- **Primary** — solid ink pill, white text, `rounded-full`, subtle press scale. Used for
  every primary action.
- **On photos** — a **white** pill with ink text (same shape) for contrast over imagery.
- **Tertiary** — a plain text link with a chevron; inherits white on photos, ink on light.

### Navbar
Transparent with **white** wordmark/links while over the hero; on scroll it collapses into
a **floating white pill** with ink text and a primary pill. The wordmark is the lowercase
serif brand name.

### Hero
Full-bleed photograph, dark left/bottom gradient, white serif headline + subcopy positioned
**lower-left** and aligned to `container-width`. A small trust pill and a "Learn more" scroll cue.

### Pillars / value props
Centred serif heading + several **plain text columns** (title + description). No cards, icons,
or borders — pure typography.

### How it works
A **scroll-pinned** section: the section is tall, an inner `sticky top-0 h-screen` panel
holds a fixed full-bleed photo, and the active step is **driven by scroll progress**. A
vertical step list sits on the right; step labels are clickable (smooth-scroll).

### Pricing / the offer
Centred eyebrow + a large serif price headline, then a **full-width striped feature list**
(alternating subtle stripe). Favour one clear offer over multiple tiers.

### Testimonials
A continuous, slow **marquee** of uniform fixed-size cards in muted pastels, with one
contrasting ink stat card. Pauses on hover; halts under `prefers-reduced-motion`.

### Founder / social proof
Two columns on canvas: a large serif pull-quote (with avatar + name) on one side, a
supporting list (title · detail, divided rows) on the other.

### Final CTA
Full-bleed human photo, dark gradient, white serif headline + white pill.

### Footer
Light warm surface. Lowercase serif wordmark + disclaimer on the left; link columns on the
right; legal + copyright bottom row.

### Conversational form (optional)
For multi-step input, prefer a **chat** over a traditional form:
- Minimal header: segmented progress bar, centred wordmark, restart icon.
- An assistant avatar appears **only on the active question**; answered turns collapse into
  greyed history.
- Assistant messages **stream in character-by-character** with a blinking caret; answer
  controls appear only once the text finishes.
- The user's answer renders as a **right-aligned pill**. The view auto-scrolls to the newest turn.

### Cookie / consent notice
A dismissible dark bar pinned to the bottom, site-wide. Renders only after mount (no
hydration flash) and remembers dismissal in `localStorage`.

---

## 6. Motion

| Pattern | Where | Feel |
| --- | --- | --- |
| **Streaming text** | Conversational flows | Live, human, conversational. |
| **Scroll-pin + step** | Explainer sections | Immersive, deliberate; you control the pace. |
| **Slow marquee** | Testimonials | Ambient drift; pauses on hover. |
| **Hover lift** | Tiles, cards | `-translate-y` + soft shadow; small and quick. |
| **Reveal/slide** | Section content | slide-up / fade; 200–500ms, ease-out. |

All motion is smooth and unhurried. Anything that loops or auto-plays must pause on hover
and disable under `prefers-reduced-motion`.

---

## 7. Imagery

- Warm, candid, **human** photography. Documentary, not stock-posed.
- Photos run **full-bleed** in the hero, key explainer, and final CTA.
- Over any photo, apply a dark gradient (heavier on the side the text sits) so white serif
  text stays legible.
- Replace placeholder imagery with **licensed** photography before production.

---

## 8. Voice & tone

Plain, warm, and expert. Short sentences. Reassuring, never salesy or jargon-heavy in
marketing copy; conversational and one-question-at-a-time in any guided flow. Explain
*why* something matters, not just what to do.

---

## 9. Quick do / don't

**Do**
- Lead with a serif headline and lots of space.
- Use ink pills for actions and photography for warmth.
- Keep history quiet; emphasise the one thing that's active.

**Don't**
- Introduce a second coloured brand accent.
- Box everything in cards or borders.
- Use pure black `#000` or pure-cold grey — keep ink and neutrals warm.
- Animate fast or loop without a hover-pause and reduced-motion fallback.
