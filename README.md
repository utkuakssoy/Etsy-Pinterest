# PinPilot

PinPilot is an MVP SaaS dashboard for Etsy sellers who want to import products, generate Pinterest SEO content, create pin drafts, schedule pins, and review basic analytics.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- PostgreSQL with Prisma
- OpenAI API
- Etsy API-ready service wrapper
- Pinterest API-ready service wrapper

## Getting Started

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Configure the values in `.env`:

```bash
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
ETSY_CLIENT_ID=
ETSY_CLIENT_SECRET=
PINTEREST_CLIENT_ID=
PINTEREST_CLIENT_SECRET=
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations after setting `DATABASE_URL`:

```bash
npm run prisma:migrate
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run as a Desktop App

PinPilot can run as a local desktop-style app with Electron. No hosting, domain, or paid website deployment is required.

Build and open the app window:

```bash
npm run desktop:build
```

After the first build, reopen the desktop app with:

```bash
npm run desktop
```

## Pinterest Publishing

To publish real pins, create a Pinterest Developer app and add these values to `.env`:

```bash
PINTEREST_CLIENT_ID=
PINTEREST_CLIENT_SECRET=
```

When PinPilot runs locally, add this OAuth redirect URL in the Pinterest app settings:

```text
http://127.0.0.1:4510/api/pinterest/oauth/callback
```

PinPilot uses the next available local port starting at `4510`, so if that port is busy, copy the exact callback URL from the app window URL and add it to Pinterest as well.

## Local Mode

PinPilot runs locally without hosting. Etsy import accepts a real Etsy shop URL and stores imported listings in `data/etsy-import.json`. Integrations that require credentials, such as Pinterest and OpenAI, keep local fallbacks until API keys are configured.

## Core Routes

- `/dashboard`
- `/products`
- `/products/[id]`
- `/generate`
- `/pins`
- `/schedule`
- `/analytics`
- `/settings`
- `/connect/etsy`
- `/connect/pinterest`
- `/login`

## Services

- `services/etsy.ts` exposes an Etsy import wrapper and demo catalog fallback.
- `services/pinterest.ts` exposes board and pin draft wrappers with demo fallback.
- `services/ai.ts` exports `generateSeoForListing(listing)` and returns strict JSON.
- `services/analytics.ts` returns mock analytics for the MVP dashboard.

## Database

The Prisma schema includes:

- `User`
- `EtsyShop`
- `EtsyListing`
- `PinterestAccount`
- `PinterestBoard`
- `AiSeoGeneration`
- `PinDraft`
- `ScheduledPin`
- `PinAnalyticsSnapshot`

## Next Steps

Replace the demo branches in `services/etsy.ts` and `services/pinterest.ts` with OAuth token exchange and API calls, then persist imported listings and pin drafts through Prisma.
