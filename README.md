# Covenant

Covenant is a UAE estate-planning platform — a calm, trust-first product that helps
people create a legally sound will for assets in the UAE. The experience is editorial
and quiet by design; estate planning is a serious, emotional decision, so the interface
stays out of the way. See [`DESIGN.md`](DESIGN.md) for the full design language.

## Tech stack

- **[Next.js 16](https://nextjs.org/)** (App Router) + **React 18** + **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com/)** with `@tailwindcss/typography`
- **[Prisma](https://www.prisma.io/)** ORM on **PostgreSQL**
- **[Auth.js / NextAuth v5](https://authjs.dev/)** — email/password, Google OAuth, UAE Pass OIDC
- **[Ziina](https://ziina.com/)** for payments (AED)
- **[Together AI](https://www.together.ai/)** for the article generator
- **[@react-pdf/renderer](https://react-pdf.org/)** for generating will documents

## Getting started

### Prerequisites

- Node.js 20+ (the project is developed on Node 24)
- A PostgreSQL database — locally via Docker:

  ```bash
  docker compose up -d
  ```

### Setup

```bash
# 1. Install dependencies (runs `prisma generate` automatically)
npm install

# 2. Configure environment
cp .env.example .env.local
# then fill in the values — see "Environment" below

# 3. Apply the database schema
npx prisma migrate dev

# 4. Start the dev server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

> **Note:** On some macOS setups `next dev` can hang during network-host detection.
> If the server starts but never binds, run it with an explicit host:
> `npx next dev -H 127.0.0.1 -p 3000`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |

## Environment

Copy `.env.example` to `.env.local` and fill in the values. Key groups:

- **App** — `NEXT_PUBLIC_APP_URL`
- **Database** — `DATABASE_URL` (PostgreSQL)
- **Auth** — `AUTH_SECRET`, Google OAuth, UAE Pass OIDC
- **Payments** — `ZIINA_API_KEY` (leave blank for local demo mode)
- **Email** — `RESEND_API_KEY`, `EMAIL_FROM`
- **Together AI** — `TOGETHER_API_KEY`, `TOGETHER_MODEL`
- **Document vault** — encrypted S3-compatible storage in a UAE region

See [`.env.example`](.env.example) for the full annotated list.

## Project structure

```
src/
  app/            # App Router pages and API routes
    start/        # Guided will-intake flow
    will/         # Will details + generated document
    checkout/     # Ziina checkout + completion
    dashboard/    # Authenticated user dashboard
    ops/          # Internal ops (articles, etc.)
    blog/ help/   # Marketing + content pages
    api/          # Route handlers (auth, checkout, webhooks, will)
  components/     # UI components
  lib/            # Prisma, auth, payments, email, AI, recommendation
  constants/      # Static content/data
  types/          # Shared TypeScript types
prisma/           # Prisma schema
```

## Deployment

Deployment config lives in [`.do/app.yaml`](.do/app.yaml) (DigitalOcean App Platform).
Set the production environment variables there, and use a UAE-region managed Postgres at launch.
