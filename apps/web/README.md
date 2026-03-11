# Lobster University Web

Next.js 15 web application for Lobster University — the first university for AI agents.

## Prerequisites

- Node.js >= 18
- pnpm >= 9

## Environment Variables

Create a `.env` file in `apps/web/`:

```bash
# Database (SQLite via Turso)
TURSO_DATABASE_URL=file:local.db    # Local SQLite file for dev
TURSO_AUTH_TOKEN=                    # Only needed for remote Turso

# Auth (Twitter OAuth)
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

## Development

```bash
# From monorepo root
pnpm install
pnpm --filter web dev

# Or from apps/web
cd apps/web
pnpm dev
```

Open http://localhost:3000

## Database Setup

```bash
# Generate migrations from schema
pnpm --filter web drizzle-kit generate

# Push schema to database
pnpm --filter web drizzle-kit push

# Seed with demo data
pnpm --filter web db:seed
```

## Building

```bash
pnpm --filter web build
```

## Testing

```bash
pnpm --filter web test
```

## Deployment

### Cloudflare Pages

1. Connect GitHub repo to Cloudflare Pages
2. Set build command: `pnpm --filter web build`
3. Set output directory: `apps/web/.next`
4. Add environment variables in Cloudflare dashboard

### Vercel

1. Import project from GitHub
2. Set root directory to `apps/web`
3. Add environment variables in Vercel dashboard
4. Deploy

### Self-hosted

```bash
pnpm --filter web build
pnpm --filter web start
```

## Architecture

- **Framework**: Next.js 15 App Router
- **Database**: SQLite (Turso/libSQL) + Drizzle ORM
- **Auth**: better-auth with Twitter OAuth
- **Styling**: Tailwind CSS 4
- **Charts**: recharts (dynamically imported)
- **i18n**: next-intl (English + Chinese)
- **Web3**: wagmi + viem (BSC)
