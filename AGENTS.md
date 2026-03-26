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

## 📑 Project Workflow Integration
- High-level planning must be documented in `spec-kit/10-delivery-plan.md`.
- Active work must be tracked in the conversation-level `task.md`.
- Post-implementation walkthroughs are mandatory in `walkthrough.md`.

## ⚠️ Known Issues & Fixes
- **TypeScript `never` types**: Often caused by encoding mismatches in `database.types.ts`. Fix encoding via `node fix-encoding.js` before debugging types.
