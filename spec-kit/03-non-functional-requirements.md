# Non-Functional Requirements

## Performance
- Public pages should achieve strong Core Web Vitals on mobile
- First contentful render for public routes should use server rendering where appropriate
- Dashboard interactions should remain responsive for small-business scale datasets

## Responsiveness
- Fully responsive for phone, tablet, and desktop
- Dashboard must remain usable on tablet
- Public site must be polished on mobile first

## Security
- Row-level security required in Supabase
- Private data inaccessible from public routes
- Google OAuth only for dashboard access
- Validate all input on server
- Avoid leaking service role keys to browser

## Reliability
- Migrations are the source of truth
- Seed scripts for local dev
- Sync jobs idempotent
- All deterministic calculations covered by tests

## Maintainability
- Clear module boundaries
- Typed contracts
- Avoid excessive abstraction
- Prefer explicitness over magic

## Observability
- Error logging for server actions and sync jobs
- Audit trail for publish and settings changes
- Health/readiness notes in README

## Accessibility
- WCAG-minded semantics
- Keyboard navigable admin UI
- Proper labels, error states, contrast, focus states

## SEO
- Public pages require metadata, canonical URLs, Open Graph tags, structured data where relevant

## Ownership
- App must be deployable under client-owned Vercel and Supabase accounts
