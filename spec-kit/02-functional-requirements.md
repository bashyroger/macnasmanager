# Functional Requirements

## FR-001 Authentication
- Support Google OAuth login via Supabase Auth
- Only authenticated approved users may access dashboard routes
- Public site is accessible without login

## FR-002 User authorization
- MVP roles:
  - owner_admin
  - editor
- owner_admin can do everything
- editor can manage operational data but cannot change system settings or delete critical records unless explicitly allowed

## FR-003 Client management
- Create, read, update, archive clients
- Store contact details, notes, preferences
- View project history per client
- Prevent hard delete if linked projects exist

## FR-004 Project management
- Create, read, update, archive projects
- Required fields:
  - client
  - title
  - status
  - optional short tag/code
- Support statuses:
  - inquiry
  - consultation
  - design
  - production
  - completed
  - delivered
  - archived
- Attach notes and images
- Show timeline and key metadata

## FR-005 Material library
- Create, read, update, archive materials
- Support import from source spreadsheet/CSV
- Track:
  - name
  - unit
  - cost_per_unit
  - supplier
  - stock_level_optional
  - origin
  - production_method
  - end_of_life
  - rated properties
  - sustainability axis values
- Materials must be reusable across projects

## FR-006 Project material usage
- Link one or many materials to a project
- For each usage record store:
  - material_id
  - quantity_used
  - unit_cost_snapshot
  - computed_material_cost
- Allow editing usage history
- Project totals must recalculate immediately and deterministically

## FR-007 Time tracking
- Manual time entry in dashboard
- Calendar-ingested time entry from dedicated Google Calendar
- Each time entry stores:
  - source (manual or calendar)
  - start_time
  - end_time
  - duration_minutes
  - project_id
  - external_event_id nullable
- Support weekly and monthly reporting

## FR-008 Google Calendar sync
- Bidirectional sync with a dedicated Studio Macnas calendar
- Calendar -> system:
  - import events at scheduled intervals
  - match to projects using deterministic rules
  - unmatched events go to review queue
- System -> calendar:
  - manual dashboard time entry can create/update linked calendar event
- Sync must be idempotent

## FR-009 Financial overview
- Per-project private dashboard showing:
  - labor cost
  - material cost
  - overhead cost
  - total project cost
  - client price
  - profit amount
  - profit margin percentage
  - product tier classification
- No financial data may appear on public pages

## FR-010 Sustainability engine
- Allow admin to define sustainability axes
- Allow admin to set:
  - axis name
  - axis weight
  - grade thresholds
- Materials carry values for each axis
- Completed project computes weighted composite scores based on materials used and quantities
- Output:
  - per-axis numeric score
  - per-axis letter grade
  - overall score
  - radar chart data payload

## FR-011 Product tiering
- Admin-configurable tier rules
- A completed project receives a tier label such as:
  - premium
  - mid_range
  - accessible
- Tier rules must be explicit and configurable

## FR-012 Digital product passport
- Each completed project can become a public page
- Public page includes:
  - project title
  - hero/media
  - project story/description
  - materials used
  - start-of-life and end-of-life information
  - sustainability chart
  - product tier
- Public page excludes:
  - internal notes
  - internal pricing
  - labor cost
  - margin
  - private admin metadata

## FR-013 Auto-publish
- Publishing must not create a duplicate website record elsewhere
- Public product passport is a dynamic route rendered from project data
- Publish state is controlled by flags in the same application
- A project must only become public when:
  - status = completed or delivered
  - publish_enabled = true
  - required public fields are present

## FR-014 Website CMS/admin
- Admin-editable website content for basic sections:
  - home page
  - about
  - contact
  - workshop dates or announcements
  - SEO metadata
- This is a lightweight structured content editor, not a block-based general CMS

## FR-015 Media management
- Upload images for projects and website content to Supabase Storage
- Support image alt text
- Public assets must use optimized delivery
- Private assets must remain access-controlled when needed

## FR-016 Search and filtering
- Dashboard lists must support filtering and search for:
  - clients
  - projects
  - materials
  - time entries
  - published showcases

## FR-017 Reporting
- Weekly/monthly time summaries
- Per-project finance summary
- Material usage summary per project
- Basic export to CSV for key admin tables

## FR-018 Auditability
- Log key actions:
  - project created
  - project status changed
  - publish toggled
  - sustainability settings changed
  - tier settings changed
  - calendar sync run
