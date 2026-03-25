# Routes and UI

## Public routes
- /
- /about
- /contact
- /showcase
- /showcase/[slug]

## Private routes
- /app
- /app/clients
- /app/clients/[id]
- /app/projects
- /app/projects/new
- /app/projects/[id]
- /app/projects/[id]/materials
- /app/projects/[id]/time
- /app/projects/[id]/finances
- /app/projects/[id]/publish
- /app/materials
- /app/materials/import
- /app/time-entries
- /app/time-entries/unassigned
- /app/reports
- /app/settings/sustainability
- /app/settings/product-tiers
- /app/settings/website
- /app/settings/integrations

## Dashboard UX requirements
- Left nav on desktop
- Bottom or compact nav treatment on mobile
- Table + detail workflow where practical
- Fast create/edit forms
- Clear computed summaries
- No clutter

## Key screens
### Dashboard home
- open projects
- unassigned time entries
- recent activity
- upcoming production workload
- quick finance summary

### Client detail
- client profile
- preferences
- linked projects
- notes

### Project detail
Tabs:
- overview
- notes
- images
- materials
- time
- finances
- sustainability
- publish

### Materials library
- searchable table
- material detail editor
- import flow

### Unassigned time review
- imported calendar events awaiting project assignment
- assign in one click

### Sustainability settings
- axes table
- weights
- thresholds
- preview calculation examples

### Publish screen
- publish readiness checklist
- public preview
- toggle publish state
