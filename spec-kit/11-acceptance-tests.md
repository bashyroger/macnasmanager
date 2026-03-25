# Acceptance Tests

## Auth
- Given an unauthenticated visitor, when they visit /app, then they are redirected to login
- Given an allow-listed Google user, when they log in, then they can access dashboard routes

## Clients and projects
- Create client successfully
- Create project linked to client successfully
- Archive client blocked if policy forbids linked live projects

## Materials
- Import materials from CSV
- Edit material cost and sustainability properties
- Add material usage to project and cost updates immediately

## Time tracking
- Manual time entry computes duration correctly
- Editing manual entry updates financial totals
- Imported calendar event with known short code links to correct project
- Unknown imported event lands in unassigned queue

## Financials
- Labor cost matches formula from time entries and hourly rate snapshot
- Material cost equals sum of project material lines
- Profit and margin compute correctly

## Sustainability
- Missing axis score for used material blocks completion
- Completed project creates sustainability snapshot
- Axis letter grades follow thresholds exactly
- Radar chart payload generated

## Publishing
- Incomplete project cannot publish
- Completed project with required public data can publish
- Public page does not expose private fields
- Unpublish removes public accessibility

## Website admin
- Editing home/about/contact content updates public pages
- SEO metadata renders correctly

## Security
- Anonymous user cannot query private tables through app routes
- Editor cannot access forbidden settings if role policy says no
