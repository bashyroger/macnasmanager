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

- **14 tables**:---

## Final Production Deployment

The project is now fully deployed and automated.

- **Production URL**: [https://macnasmanager.vercel.app](https://macnasmanager.vercel.app)
- **CI/CD Integration**: The Vercel project is now connected to [bashyroger/macnasmanager](https://github.com/bashyroger/macnasmanager). 
- **Auto-Update**: Any push to the `master` branch will automatically trigger a new production build and update the site.

### Google OAuth Configuration
To complete the Google Calendar integration, please add the following **Authorized Redirect URI** to your Google Cloud Console project:
- `https://macnasmanager.vercel.app/api/auth/google/callback`

### Verified Functionality
- [x] **Authentication**: Live at `/login`.
- [x] **Authorization Check**: The dashboard strictly requires an allowlist. New Sign-Ins are automatically redirected to the `/unauthorized` landing page until added to the `public.users` table by an admin.
- [x] **Tables**: Sorting and Filtering fully functional in production.
- [x] **Cron Jobs**: Sync endpoint ready at `/api/cron/sync-calendar`.
- [x] **Environment**: `NEXT_PUBLIC_APP_URL` and all secrets configured.

### Adding New Users to the Dashboard
1. Provide the user with the login URL: `https://macnasmanager.vercel.app/login`
2. After they sign in, they will see an "Access Denied" page.
3. Open your Supabase Dashboard: **Authentication** > **Users** to find their generated `UUID` and `email`.
4. Navigate to the **Table Editor** > `users` table.
5. Insert a new row with their `UUID`, `email`, and desired `role` (e.g., `editor`).
6. The user can now click "Sign out & try another account" and sign in again to access the dashboard!


Congratulations on the launch of Studio Macnas!

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
