# Backend (NestJS API)

This module powers:

- Aid logic and APIs
- Verification APIs
- On-chain anchoring integrations

## Local development

From the repo root:

```bash
pnpm install
pnpm --filter backend run start:dev
```

By default the server listens on `PORT` (see `.env.example`).

## Environment

Create `app/backend/.env` from `app/backend/.env.example`.

Required variables:

- `DATABASE_URL`
- `STELLAR_RPC_URL` (default: `https://soroban-testnet.stellar.org`)
- `OPENAI_API_KEY`

## Database (Prisma)

Prisma schema lives in `prisma/schema.prisma`.

Run migrations:

```bash
pnpm --filter backend prisma:generate
pnpm --filter backend prisma:migrate
```

## Routes

- `GET /health`

Example:

```bash
curl -s http://localhost:3001/health
```

## Scripts

Run from repo root:

```bash
pnpm --filter backend lint
pnpm --filter backend test
```

## Contributing

See `app/backend/CONTRIBUTING.md`.
