# System Architecture

## High-level architecture
Single Next.js application with:
- public website routes
- authenticated dashboard routes
- Supabase for auth, database, storage
- Google Calendar integration
- Vercel deployment

## Runtime topology
- Browser client
- Next.js server runtime on Vercel
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Vercel Cron or scheduled invocation for sync jobs

## App layers
### Presentation layer
- Public pages
- Dashboard pages
- Shared UI components

### Application layer
- Server actions
- Route handlers
- Job handlers
- Domain services

### Domain layer
- project service
- finance calculator
- sustainability engine
- calendar sync service
- publish service

### Data layer
- Postgres schema
- SQL views/functions where useful
- storage buckets
- audit tables

## Route separation
- /(public) for public site
- /app for authenticated dashboard
- /api/internal/* for integration endpoints if needed
- /showcase/[slug] for public digital product passport pages

## Key architectural rules
- No duplicated business logic between client and server
- All authoritative calculations occur on server
- Use database transactions for multi-step writes
- Use idempotency keys or stable external IDs for sync logic
- Public rendering reads from a public-safe projection only
