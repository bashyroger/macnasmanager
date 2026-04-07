# macnasmanager — Memory Bank

> This file is auto-updated by `/compress-session` at the end of each working session.
> It's a human-readable snapshot of recent development. Antigravity reads this at session start.

---

## Last Session: 2026-04-04

**Goal**: Mobile Usability Fixes — addressing broken navigation and unusable calendar views on small screens.

**Key Decisions**:
- Dashboard sidebar is now a slide-in drawer on mobile (`< md`).
- "Week" view disabled on mobile to prevent 7-column squishing; default to "Day" view.
- Calendar toolbar buttons stack vertically on mobile for better touch targets.
- Main content area uses `pt-14` offset to accommodate the new mobile fixed top bar.

**Patterns Established**:
- Use `isMobile` client-side state for component-level prop adjustments (e.g., `views` list).
- Standardized `h-14` height for mobile dashboard headers with calculated layout offsets.

**Open TODOs**:
- Continue macnasmanager feature development (calendar sync, CMS content editing).
- Monitor mobile performance with many calendar entries in "Month" view.

**Gotchas**:
- `react-big-calendar` requires explicit `views` array manipulation to remove toolbar buttons.
- Always ensure `onClose` is called on mobile drawers after link clicks.

---

## Active Patterns (cumulative)

| Pattern | Description |
|---|---|
| `await params` | Next.js 15+ dynamic route params are Promises — must await |
| `Set-Content -Encoding UTF8` | All PowerShell file writes must specify UTF-8 |
| `<DataTable />` | Generic reusable table component for all dashboard pages |
| `apply_migration` | All DDL goes through Supabase MCP `apply_migration`, never raw SQL in prod |
| `hard navigation` | After data mutations, use `router.push()` not `router.refresh()` to avoid hangs |
| `h-14 mobile header` | Fixed mobile headers are 56px (`h-14`), requiring 3.5rem (`pt-14`) main padding |

---

## Project Status

| Area | Status |
|---|---|
| Auth + dashboard shell | ✅ Done (Responsive) |
| Client / Project CRUD | ✅ Done |
| Time entries + calendar view | ✅ Done (Mobile optimized) |
| CMS / website content | 🔄 In progress |
| Financial management | ⏳ Not started |
| Public showcase | ✅ Done (Basic responsive) |
