# Data Model

## Core entities

### users
- id uuid pk
- email text unique
- role enum(owner_admin, editor)
- full_name text nullable
- created_at timestamptz
- updated_at timestamptz

### clients
- id uuid pk
- full_name text not null
- email text nullable
- phone text nullable
- instagram_handle text nullable
- preferences text nullable
- notes text nullable
- is_archived boolean default false
- created_at timestamptz
- updated_at timestamptz

### projects
- id uuid pk
- client_id uuid fk -> clients.id
- title text not null
- slug text unique not null
- short_code text unique nullable
- status enum(inquiry, consultation, design, production, completed, delivered, archived)
- public_title text nullable
- private_notes text nullable
- public_description text nullable
- start_date date nullable
- target_delivery_date date nullable
- completed_at timestamptz nullable
- charged_amount numeric(12,2) nullable
- hourly_rate_snapshot numeric(12,2) nullable
- overhead_amount numeric(12,2) default 0
- publish_enabled boolean default false
- published_at timestamptz nullable
- product_tier_id uuid nullable
- hero_image_path text nullable
- is_archived boolean default false
- created_at timestamptz
- updated_at timestamptz

### project_images
- id uuid pk
- project_id uuid fk
- storage_path text not null
- alt_text text nullable
- caption text nullable
- sort_order int default 0
- is_public boolean default false
- created_at timestamptz

### project_notes
- id uuid pk
- project_id uuid fk
- note_type enum(internal, public_draft)
- body text not null
- created_by uuid fk -> users.id
- created_at timestamptz

### materials
- id uuid pk
- name text not null unique
- unit text not null
- cost_per_unit numeric(12,4) not null
- supplier_name text nullable
- supplier_url text nullable
- stock_level numeric(12,4) nullable
- origin_story text nullable
- production_method text nullable
- end_of_life text nullable
- carbon_footprint text nullable
- biodegradability text nullable
- compostability text nullable
- strength_rating int nullable
- color_options text nullable
- availability_notes text nullable
- bendability_rating int nullable
- durability_rating int nullable
- is_archived boolean default false
- created_at timestamptz
- updated_at timestamptz

### sustainability_axes
- id uuid pk
- name text not null unique
- description text nullable
- weight numeric(8,4) not null
- grade_a_min numeric(8,4) not null
- grade_b_min numeric(8,4) not null
- grade_c_min numeric(8,4) not null
- display_order int not null
- is_active boolean default true
- created_at timestamptz
- updated_at timestamptz

### material_sustainability_scores
- id uuid pk
- material_id uuid fk
- sustainability_axis_id uuid fk
- score numeric(8,4) not null
- notes text nullable
- unique(material_id, sustainability_axis_id)

### project_materials
- id uuid pk
- project_id uuid fk
- material_id uuid fk
- quantity_used numeric(12,4) not null
- unit_snapshot text not null
- unit_cost_snapshot numeric(12,4) not null
- computed_material_cost numeric(12,2) not null
- notes text nullable
- created_at timestamptz
- updated_at timestamptz

### time_entries
- id uuid pk
- project_id uuid fk nullable
- source enum(manual, google_calendar)
- external_event_id text nullable unique
- external_calendar_id text nullable
- title text not null
- start_time timestamptz not null
- end_time timestamptz not null
- duration_minutes int not null
- needs_manual_assignment boolean default false
- sync_status enum(pending, synced, conflict, error) default 'pending'
- created_by uuid fk -> users.id nullable
- created_at timestamptz
- updated_at timestamptz

### product_tiers
- id uuid pk
- code text unique not null
- label text not null
- min_total_cost numeric(12,2) nullable
- min_labor_hours numeric(12,2) nullable
- rule_json jsonb not null
- is_active boolean default true
- sort_order int default 0

### project_financial_snapshots
- id uuid pk
- project_id uuid fk
- labor_minutes int not null
- labor_cost numeric(12,2) not null
- material_cost numeric(12,2) not null
- overhead_cost numeric(12,2) not null
- total_cost numeric(12,2) not null
- charged_amount numeric(12,2) nullable
- profit_amount numeric(12,2) nullable
- profit_margin_pct numeric(8,4) nullable
- product_tier_id uuid nullable
- computed_at timestamptz not null

### project_sustainability_snapshots
- id uuid pk
- project_id uuid fk
- overall_score numeric(8,4) not null
- radar_chart_payload jsonb not null
- computed_at timestamptz not null

### project_sustainability_axis_snapshots
- id uuid pk
- snapshot_id uuid fk -> project_sustainability_snapshots.id
- sustainability_axis_id uuid fk
- score numeric(8,4) not null
- letter_grade text not null

### website_pages
- id uuid pk
- page_key text unique not null
- title text not null
- slug text unique not null
- body_json jsonb not null
- seo_title text nullable
- seo_description text nullable
- is_published boolean default true
- updated_by uuid fk -> users.id
- updated_at timestamptz

### sync_runs
- id uuid pk
- sync_type enum(google_calendar_import, google_calendar_export)
- started_at timestamptz
- finished_at timestamptz nullable
- status enum(running, success, partial_success, failed)
- summary_json jsonb

### audit_logs
- id uuid pk
- actor_user_id uuid nullable
- entity_type text not null
- entity_id uuid nullable
- action text not null
- payload jsonb
- created_at timestamptz

## Views
### v_project_financials_current
Current computed project finances for dashboard use

### v_project_public_showcase
Only public-safe fields for published showcase rendering

### v_unassigned_time_entries
Time entries requiring manual project assignment

## Storage buckets
- website-public
- project-public
- project-private

## RLS principles
- dashboard tables: authenticated + role checks
- public showcase view: anonymous read only on published/public-safe view
- storage: separate public/private bucket policies
