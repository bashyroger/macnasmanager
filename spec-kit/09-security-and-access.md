# Security and Access

## Auth model
- Google OAuth through Supabase Auth
- allow-list by email for dashboard access in MVP

## Roles
### owner_admin
- full CRUD
- settings
- publishing
- integrations
- role management if implemented

### editor
- CRUD on clients/projects/materials/time
- may prepare publish content
- may not change sustainability formulas or system integration settings unless explicitly granted

## Data exposure rules
- public visitors can only read published public-safe project content and public website content
- private notes, prices, labor data, margins, sync logs, and audit data are never public

## Secrets
- Keep Supabase service role server-only
- Google OAuth secrets server-only
- Never expose secrets through client bundles

## RLS
- enable RLS on all app tables
- use explicit policies
- public read should be through constrained views where possible

## File security
- private project assets in private bucket
- public showcase images in public bucket or signed delivery path as appropriate
