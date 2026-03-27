# Master Prompt for Claude Code

You are building a production-ready deterministic web application from the spec kit in /spec-kit.

Read every file in /spec-kit before writing code.

Non-negotiable constraints:
- Stack: Next.js 16+ + TypeScript + Node.js + Supabase + Vercel
- Next.js 16+ rules: Use `proxy.ts` (not middleware.ts), `await params` in dynamic routes, and always include `sizes` on `fill` Images.
- Component architecture: Maximize reusability. Build highly generic components (e.g., a single `<DataTable />` for all list views) to strictly minimize code duplication.
- Vercel Deployment Safety: Strictly verify all imports (e.g., `lucide-react` icons) and types to ensure builds do not fail in CI.
- Local backend development must use Supabase CLI locally
- Single codebase for public website + private dashboard + public showcase pages
- No separate backend service
- All calculations and state transitions must be deterministic and tested
- No AI features
- No fuzzy matching in calendar import logic
- Use migrations as source of truth
- Use strict typing
- Keep business logic server-side

Execution order:
1. Summarize the implementation plan based on the spec
2. Scaffold the repo
3. Create schema and migrations
4. Implement auth and route protection
5. Implement clients/projects/materials CRUD
6. Implement time tracking and finance calculations
7. Implement sustainability engine
8. Implement publish flow and public routes
9. Implement Google Calendar sync
10. Add tests, CI, docs, and polish

While building:
- Flag ambiguities using /spec-kit/13-open-questions.md
- Resolve only with explicit documented assumptions
- Record assumptions in docs/implementation-notes.md
- After each major milestone, list completed items and remaining risks

Do not stop at scaffolding. Build the actual application.
