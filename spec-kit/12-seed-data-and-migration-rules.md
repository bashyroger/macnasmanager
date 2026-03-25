# Seed Data and Migration Rules

## Migration rules
- All schema changes go through versioned SQL migrations
- Never edit old migrations after shared use
- Add forward-only corrective migrations
- Include rollback notes in migration comments where practical

## Seed rules
Provide local seed data for:
- 2 users
- 5 clients
- 8 projects across statuses
- 15 materials
- sustainability axes
- tier rules
- example time entries
- 2 publishable showcase projects

## Local dev commands expected
- npm install
- supabase start
- supabase db reset
- npm run dev

## Required scripts
- db:generate-types
- db:reset
- db:seed
- test
- lint
- typecheck
