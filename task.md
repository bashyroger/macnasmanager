# Macnas Manager - Build Task Checklist

## Phase 0: Setup & Planning
- [x] Create Supabase project for macnasmanager
- [x] Write implementation plan
- [x] Scaffold Next.js app with TypeScript + Tailwind + ESLint strict mode
- [x] Configure Supabase environment variables
- [x] Set up Supabase auth with Supabase SSR pattern

## Phase 1: Foundation
- [x] Create all database migrations (core schema)
- [x] Implement Supabase RLS policies
- [x] Implement auth middleware (proxy pattern)
- [x] Build dashboard shell with nav layout
- [x] Build login page (Google OAuth)
- [x] Build client CRUD (list, create, edit, archive)
- [x] Build project CRUD (list, create, edit, archive)
- [x] Public website skeleton (/, /about, /contact)
- [ ] Website content admin (/app/settings/website)
- [x] Seed data script

## Phase 2: Tracking
- [x] Materials library CRUD (/app/materials)
- [ ] Materials CSV import flow (/app/materials/import)
- [ ] Project material usage linking (/app/projects/[id]/materials)
- [x] Time entry CRUD (/app/time-entries)
- [ ] Unassigned time entry review queue (/app/time-entries/unassigned)
- [ ] Project-level material/time totals display

## Phase 3: Intelligence
- [ ] Finance calculator service (deterministic)
- [ ] Finance dashboard per project (/app/projects/[id]/finances)
- [ ] Sustainability axes settings (/app/settings/sustainability)
- [ ] Sustainability engine (score computation)
- [ ] Product tier engine + settings (/app/settings/product-tiers)
- [ ] Snapshot system (financial + sustainability)

## Phase 4: Showcase
- [x] Public showcase listing (/showcase)
- [x] Public product passport route (/showcase/[slug])
- [ ] Publish readiness checklist
- [ ] Publish flow (/app/projects/[id]/publish)
- [x] SEO metadata for public pages

## Phase 5: Integrations
- [ ] Google Calendar OAuth connection (/app/settings/integrations)
- [ ] Calendar import sync job
- [ ] Calendar export on write
- [ ] Sync logs + conflict handling

## Phase 6: Hardening
- [ ] Unit tests for business rules
- [ ] TypeScript strict checks passing
- [ ] CI config
- [ ] README + deployment docs
- [ ] Implementation notes doc
- [ ] Performance + accessibility pass
