# Master Prompt for Claude Code

You are building a production-ready deterministic web application from the spec kit in /spec-kit.

Read every file in /spec-kit before writing code.

Non-negotiable constraints:
- Stack: Next.js + TypeScript + Node.js + Supabase + Vercel
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
