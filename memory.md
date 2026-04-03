# macnasmanager — Memory Bank

> This file is auto-updated by `/compress-session` at the end of each working session.
> It's a human-readable snapshot of recent development. Antigravity reads this at session start.

---

## Last Session: 2026-04-03

**Goal**: Antigravity Memory Bank Setup — adapting claude-mem's pattern to work natively with Antigravity.

**Key Decisions**:
- claude-mem cannot be installed directly (Claude Code plugin, incompatible with Antigravity)
- Two global workflows created: `/compress-session` (end of session) + `/memory-bank` (start of session)
- KI per project in `C:\Users\rogie\.gemini\antigravity\knowledge\macnasmanager\`

**Patterns Established**:
- KI format: `metadata.json` index + `artifacts/session_<date>.md` per session
- `// turbo` annotations on safe-to-auto-run workflow steps
- `knowledge.lock` is a plain-text audit log (not JSON)

**Open TODOs**:
- (done this session) Added `/memory-bank` + `memory.md` instructions to AGENTS.md
- Continue macnasmanager feature development (calendar sync, time entries, CMS)

**Gotchas**:
- Always UTF-8 for all files in `knowledge/` — never PowerShell `>` redirections
- KI summaries at session start are titles-only; artifacts need explicit `view_file` reads

---

## Active Patterns (cumulative)

| Pattern | Description |
|---|---|
| `await params` | Next.js 15+ dynamic route params are Promises — must await |
| `Set-Content -Encoding UTF8` | All PowerShell file writes must specify UTF-8 |
| `<DataTable />` | Generic reusable table component for all dashboard pages |
| `apply_migration` | All DDL goes through Supabase MCP `apply_migration`, never raw SQL in prod |
| `hard navigation` | After data mutations, use `router.push()` not `router.refresh()` to avoid hangs |

---

## Project Status

| Area | Status |
|---|---|
| Auth + dashboard shell | ✅ Done |
| Client / Project CRUD | ✅ Done |
| Time entries + calendar view | 🔄 In progress (drag-to-create, bidirectional sync) |
| CMS / website content | 🔄 In progress (modular rich-text editor, image pipeline) |
| Financial management | ⏳ Not started |
| Public showcase | 🔄 In progress |
