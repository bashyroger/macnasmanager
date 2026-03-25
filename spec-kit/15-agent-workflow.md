# Agent Workflow

## Required build order
1. Initialize Next.js app with TypeScript, Tailwind, ESLint, strict mode
2. Configure Supabase local development
3. Add auth and protected routes
4. Create database schema + migrations
5. Build core CRUD flows
6. Add deterministic calculators and tests
7. Add public showcase routes
8. Add website admin content
9. Add Google Calendar integration
10. Add CI and deployment instructions

## Rules for the coding agent
- Do not skip migrations
- Do not invent undocumented business logic
- Do not use fuzzy matching for project-event linking
- Do not expose private project fields to public components
- Do not leave TODOs for critical business rules
- Keep components and server logic modular
- Add tests before marking deterministic logic complete

## Files the agent must create outside spec-kit
- README.md
- .env.example
- supabase/config.toml
- supabase/migrations/*
- supabase/seed.sql or seed scripts
- src/lib/*
- src/app/*
- tests/*
- docs/implementation-notes.md
