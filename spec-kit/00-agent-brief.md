# Agent Brief

Build a deterministic, production-ready web application for Studio Macnas.

## Core objective
Create one unified application that includes:
1. Public marketing website
2. Public digital product passport pages for completed projects
3. Private authenticated internal dashboard

## Required stack
- Frontend/app framework: Next.js (latest stable App Router), TypeScript
- Runtime: Node.js LTS
- Database/auth/storage: Supabase
- Local backend development: Supabase CLI + local Docker services
- Deployment: Vercel
- Styling: Tailwind CSS
- Forms: React Hook Form + Zod
- Tables: TanStack Table
- Charts: Recharts or Nivo
- Background jobs: Vercel Cron + database-backed job state, or Supabase Edge Functions where appropriate
- ORM/querying: Prefer SQL-first with typed query layer or Drizzle ORM. Avoid Prisma if it complicates Supabase local workflows.

## Architectural stance
This must be a single codebase and a single deployable application.
Do not build a separate backend API service unless a hard requirement emerges.
Server-side logic should live in:
- Next.js server actions
- Route handlers
- Background job handlers
- Database functions where deterministic calculation belongs close to data

## Domain scope
The app must support:
- Client management
- Project management
- Notes and reference images
- Materials library
- Project-material usage tracking
- Time tracking
- Google Calendar bidirectional sync
- Project finances
- Sustainability profile engine
- Public digital product passport pages
- Lightweight website CMS/admin for editable website content

## Product stance
This is an operations-first tool, not a generic CMS.
The system should reduce manual coordination across calendar, materials, costing, and website publishing.

## Determinism requirement
All calculations and state transitions must be deterministic and testable.
No AI/LLM features in the MVP.
No fuzzy matching unless explicit fallback rules are documented.
Every computed field must have a traceable formula.

## Delivery priority
1. Stable data model
2. Auth + access control
3. CRUD flows
4. Deterministic calculations
5. Public/private route separation
6. Calendar sync
7. Auto-publish flow
8. Polish and performance

## Output expected from agent
The coding agent must:
- Create the full app skeleton
- Add migrations
- Add seed scripts
- Add sample env files
- Add test coverage for all business rules
- Add README setup instructions for local Supabase and Vercel deployment
- Add CI checks
- Document every important decision in /docs or /spec-kit/implementation-notes.md
