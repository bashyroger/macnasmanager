# Studio Macnas — Agent Guidelines & Structural Safety

## 🚨 CRITICAL: UTF-8 Encoding Enforcement
All files generated or modified in this project **MUST** be encoded in **UTF-8**. 
Windows-specific tools (like PowerShell redirections or Supabase CLI) may default to UTF-16LE. This **corrupts** the build and blocks AI readability.

### Rules:
1.  **Supabase Type Gen**: If you run `supabase gen types`, you **MUST** immediately verify the encoding. If it's not UTF-8, use the provided `application/fix-encoding.js` script to fix it.
2.  **No Redirections**: Avoid using `>` or `|` in PowerShell for file creation if possible; use `Set-Content -Encoding UTF8` or the `write_to_file` tool.
3.  **Verification**: After creating any binary-looking file (like a large `.ts` file), confirm it's readable with `view_file`.

## 🛠️ Environment Rules
- **OS**: Windows (PowerShell). 
- **Tooling**: Use `npm run dev` for the dashboard.
- **Supabase**: Use the `supabase-mcp-server` for database operations. Apply migrations via `apply_migration`.

## 🚀 Next.js 16.2+ & Vercel Best Practices
- **Routing**: `params` and `searchParams` in dynamic routes are **Promises** in Next.js 15+ and must be `await`ed before accessing properties (e.g., `const { slug } = await params;`).
- **Middleware**: Use `proxy.ts` with an `export async function proxy` instead of `middleware.ts`. If renaming the file locally, you **MUST** restart the Next.js dev server.
- **Images**: Always provide a `sizes` prop when using `fill` on `next/image` to prevent performance warnings.
- **Vercel Builds**: Missing icon exports (e.g., specific `lucide-react` icons) or TS errors will break the Vercel build. Always verify imports and type bindings locally.

## 🏗️ Component Architecture
- **Reusable Primitives**: Extract repetitive UI structures into highly generic, reusable components. For example, build a single `<DataTable />` component that accepts generic columns and data arrays instead of rewriting table markup, sorting, and filtering logic on every dashboard page.


## 📑 Project Workflow Integration
- High-level planning must be documented in `spec-kit/10-delivery-plan.md`.
- Active work must be tracked in the conversation-level `task.md`.
- Post-implementation walkthroughs are mandatory in `walkthrough.md`.

## 🧠 Memory Bank (Antigravity Persistent Context)
- **At the start of every session**, run `/memory-bank` to load compressed context from recent sessions via the Antigravity memory bank.
- **At the end of every meaningful session**, run `/compress-session` to save what was done into the memory bank for future sessions.
- The full session history lives in: `C:\Users\rogie\.gemini\antigravity\knowledge\macnasmanager\`
- A human-readable summary of recent sessions is committed to this repo at: `memory.md` — always read it at session start if `/memory-bank` is not yet run.

## ⚠️ Known Issues & Fixes
- **TypeScript `never` types**: Often caused by encoding mismatches in `database.types.ts`. Fix encoding via `node fix-encoding.js` before debugging types.
