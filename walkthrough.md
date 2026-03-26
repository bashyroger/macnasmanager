# Macnas Manager — Phase 1 Walkthrough

## What was built

Studio Macnas Unified Platform — Phase 1 complete. App running at `http://localhost:3000`.

## Infrastructure

| Item | Detail |
|------|--------|
| Supabase project | `macnasmanager` — `fsbpxifvpjtkrltfizmv` (eu-west-1) |
| App directory | `application/` — Next.js 16 + Tailwind + TypeScript strict |
| Auth | Supabase SSR (getAll/setAll), Google OAuth |
| DB migrations | 4 applied: schema, RLS, views, seed data |

## Database (4 migrations applied)

- **14 tables**: users, clients, projects, project_images, project_notes, materials, sustainability_axes, material_sustainability_scores, project_materials, time_entries, product_tiers, project_financial_snapshots, project_sustainability_snapshots, website_pages, sync_runs, audit_logs
- **RLS** on all tables with helper functions `is_app_user()`, `is_owner_admin()`
- **3 views**: `v_project_public_showcase`, `v_project_financials_current`, `v_unassigned_time_entries`
- **Seed data**: 5 sustainability axes, 3 product tiers, 3 website pages, 15 real materials

## Pages built

### Public routes
- `/` — Home hero page
- `/showcase` — Public project grid (reads from public view only)
- `/showcase/[slug]` — Digital product passport with sustainability bars

### Auth
- `/login` — Google OAuth login card
- `/auth/callback` — OAuth code exchange

### Dashboard (protected — redirects unauthenticated users to `/login`)
- `/app` — Dashboard home with open project count, unassigned time alert, quick nav
- `/app/clients` — Client list table
- `/app/clients/new` — Create client form
- `/app/clients/[id]` — Client detail with linked projects
- `/app/clients/[id]/edit` — Edit client
- `/app/projects` — Project list with status badges
- `/app/projects/new` — Create project form (slug auto-gen, client selector)
- `/app/projects/[id]` — Project detail with quick finance stats + tabs
- `/app/materials` — Materials library (15 seed materials ready)
- `/app/time-entries` — Time log with unassigned alert

## Screenshots

### Home page
![Home page](home_page_1774466550808.png)

### Login page
![Login page](login_page_1774466563501.png)

### Showcase page
![Showcase page](showcase_page_1774466577457.png)

## Next steps (Phase 2–3)
- Project material usage form (`/app/projects/[id]/materials`)
- Time entry create form with duration auto-calc
- Finance calculator service (deterministic)
- Sustainability engine
- Publish flow

## Setup for Google OAuth
You need to add your Supabase project callback URL to Google Console:
```
https://fsbpxifvpjtkrltfizmv.supabase.co/auth/v1/callback
```
Then enable Google provider in Supabase Dashboard → Auth → Providers.
