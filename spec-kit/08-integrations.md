# Integrations

## Google Calendar
### Scope
- OAuth connection for approved admin user
- dedicated Studio Macnas calendar
- import events into time_entries
- export dashboard-created entries to calendar

### Required capabilities
- periodic import job
- create/update calendar events
- conflict handling
- revoked token handling
- sync logs

### Job schedule
- import every 15 minutes in MVP
- export on write plus retry job for failures

### Event title convention
Prefer:
[SHORT_CODE] Project Title - Client Name

### Unmatched events
- create time entry with needs_manual_assignment = true
- surface in review queue

## Supabase
### Use for
- auth
- postgres
- storage
- optional edge functions if needed

### Local development
- supabase start
- migrations tracked in repo
- seed scripts required
- local storage emulation supported where practical

## Vercel
### Use for
- Next.js deployment
- preview deployments
- environment variable management
- scheduled cron invocation if selected for sync jobs
