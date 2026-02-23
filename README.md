# Costume Voting App

One-night party app for costume voting. Mobile-first Hebrew RTL interface.

## Flow
1. Guests register at entrance (name + phone) via QR code → `/register`
2. Admin adds costumes and opens voting
3. Guests vote for best costume via QR code → `/vote`
4. Admin views results and announces winner

## Setup

### 1. Create Neon Database
- Go to [neon.tech](https://neon.tech) or add Neon via Vercel Marketplace
- Create a new project/database
- Copy the connection strings

### 2. Environment Variables
```bash
cp .env.example .env
```

Fill in:
```
POSTGRES_PRISMA_URL="postgresql://...@...-pooler.../db?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://...@.../db?sslmode=require"
ADMIN_PASSWORD="your-chosen-password"
AUTH_SECRET="any-random-string-here"
```

### 3. Run Migrations & Seed
```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Start Dev Server
```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add Neon integration (or set env vars manually):
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
4. Deploy — Prisma generates on build automatically
5. Run migration: `npx prisma migrate deploy` (or add to build command)

Build command override (if needed):
```
prisma migrate deploy && prisma generate && next build
```

## Event Night Checklist

- [ ] Open admin panel: `/admin` (login with your ADMIN_PASSWORD)
- [ ] Verify registration is open (toggle ON)
- [ ] Print QR code pointing to `/register` — place at entrance
- [ ] As guests arrive, they register with name + phone
- [ ] Add costumes in `/admin/costumes`
- [ ] When ready to vote: close registration, open voting
- [ ] Print QR code pointing to `/vote` — announce to guests
- [ ] Monitor results live at `/admin/results`
- [ ] Close voting when ready
- [ ] Announce the winner!

## Tech Stack
- Next.js (App Router)
- Prisma + Neon Postgres
- Tailwind CSS v4
- TypeScript
