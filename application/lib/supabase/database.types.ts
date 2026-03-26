export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: { action: string; actor_user_id: string | null; created_at: string; entity_id: string | null; entity_type: string; id: string; payload: Json | null };
        Insert: { action: string; actor_user_id?: string | null; created_at?: string; entity_id?: string | null; entity_type: string; id?: string; payload?: Json | null };
        Update: { action?: string; actor_user_id?: string | null; created_at?: string; entity_id?: string | null; entity_type?: string; id?: string; payload?: Json | null };
      };
      clients: {
        Row: { created_at: string; email: string | null; full_name: string; id: string; instagram_handle: string | null; is_archived: boolean; notes: string | null; phone: string | null; preferences: string | null; updated_at: string };
        Insert: { created_at?: string; email?: string | null; full_name: string; id?: string; instagram_handle?: string | null; is_archived?: boolean; notes?: string | null; phone?: string | null; preferences?: string | null; updated_at?: string };
        Update: { created_at?: string; email?: string | null; full_name?: string; id?: string; instagram_handle?: string | null; is_archived?: boolean; notes?: string | null; phone?: string | null; preferences?: string | null; updated_at?: string };
      };
      material_sustainability_scores: {
        Row: { id: string; material_id: string; notes: string | null; score: number; sustainability_axis_id: string };
        Insert: { id?: string; material_id: string; notes?: string | null; score: number; sustainability_axis_id: string };
        Update: { id?: string; material_id?: string; notes?: string | null; score?: number; sustainability_axis_id?: string };
      };
      materials: {
        Row: { availability_notes: string | null; bendability_rating: number | null; biodegradability: string | null; carbon_footprint: string | null; color_options: string | null; compostability: string | null; cost_per_unit: number; created_at: string; durability_rating: number | null; end_of_life: string | null; id: string; is_archived: boolean; name: string; origin_story: string | null; production_method: string | null; stock_level: number | null; strength_rating: number | null; supplier_name: string | null; supplier_url: string | null; unit: string; updated_at: string };
        Insert: { availability_notes?: string | null; bendability_rating?: number | null; biodegradability?: string | null; carbon_footprint?: string | null; color_options?: string | null; compostability?: string | null; cost_per_unit: number; created_at?: string; durability_rating?: number | null; end_of_life?: string | null; id?: string; is_archived?: boolean; name: string; origin_story?: string | null; production_method?: string | null; stock_level?: number | null; strength_rating?: number | null; supplier_name?: string | null; supplier_url?: string | null; unit: string; updated_at?: string };
        Update: { availability_notes?: string | null; bendability_rating?: number | null; biodegradability?: string | null; carbon_footprint?: string | null; color_options?: string | null; compostability?: string | null; cost_per_unit?: number; created_at?: string; durability_rating?: number | null; end_of_life?: string | null; id?: string; is_archived?: boolean; name?: string; origin_story?: string | null; production_method?: string | null; stock_level?: number | null; strength_rating?: number | null; supplier_name?: string | null; supplier_url?: string | null; unit?: string; updated_at?: string };
      };
      product_tiers: {
        Row: { code: string; id: string; is_active: boolean; label: string; min_labor_hours: number | null; min_total_cost: number | null; rule_json: Json; sort_order: number };
        Insert: { code: string; id?: string; is_active?: boolean; label: string; min_labor_hours?: number | null; min_total_cost?: number | null; rule_json: Json; sort_order?: number };
        Update: { code?: string; id?: string; is_active?: boolean; label?: string; min_labor_hours?: number | null; min_total_cost?: number | null; rule_json?: Json; sort_order?: number };
      };
      project_financial_snapshots: {
        Row: { charged_amount: number | null; computed_at: string; id: string; labor_cost: number; labor_minutes: number; material_cost: number; overhead_cost: number; product_tier_id: string | null; profit_amount: number | null; profit_margin_pct: number | null; project_id: string; total_cost: number };
        Insert: { charged_amount?: number | null; computed_at?: string; id?: string; labor_cost: number; labor_minutes: number; material_cost: number; overhead_cost: number; product_tier_id?: string | null; profit_amount?: number | null; profit_margin_pct?: number | null; project_id: string; total_cost: number };
        Update: { charged_amount?: number | null; computed_at?: string; id?: string; labor_cost?: number; labor_minutes?: number; material_cost?: number; overhead_cost?: number; product_tier_id?: string | null; profit_amount?: number | null; profit_margin_pct?: number | null; project_id?: string; total_cost?: number };
      };
      project_images: {
        Row: { alt_text: string | null; caption: string | null; created_at: string; id: string; is_public: boolean; project_id: string; sort_order: number; storage_path: string };
        Insert: { alt_text?: string | null; caption?: string | null; created_at?: string; id?: string; is_public?: boolean; project_id: string; sort_order?: number; storage_path: string };
        Update: { alt_text?: string | null; caption?: string | null; created_at?: string; id?: string; is_public?: boolean; project_id?: string; sort_order?: number; storage_path?: string };
      };
      project_materials: {
        Row: { computed_material_cost: number; created_at: string; id: string; material_id: string; notes: string | null; project_id: string; quantity_used: number; unit_cost_snapshot: number; unit_snapshot: string; updated_at: string };
        Insert: { computed_material_cost: number; created_at?: string; id?: string; material_id: string; notes?: string | null; project_id: string; quantity_used: number; unit_cost_snapshot: number; unit_snapshot: string; updated_at?: string };
        Update: { computed_material_cost?: number; created_at?: string; id?: string; material_id?: string; notes?: string | null; project_id?: string; quantity_used?: number; unit_cost_snapshot?: number; unit_snapshot?: string; updated_at?: string };
      };
      project_notes: {
        Row: { body: string; created_at: string; created_by: string; id: string; note_type: "internal" | "public_draft"; project_id: string };
        Insert: { body: string; created_at?: string; created_by: string; id?: string; note_type: "internal" | "public_draft"; project_id: string };
        Update: { body?: string; created_at?: string; created_by?: string; id?: string; note_type?: "internal" | "public_draft"; project_id?: string };
      };
      project_sustainability_axis_snapshots: {
        Row: { id: string; letter_grade: string; score: number; snapshot_id: string; sustainability_axis_id: string };
        Insert: { id?: string; letter_grade: string; score: number; snapshot_id: string; sustainability_axis_id: string };
        Update: { id?: string; letter_grade?: string; score?: number; snapshot_id?: string; sustainability_axis_id?: string };
      };
      project_sustainability_snapshots: {
        Row: { computed_at: string; id: string; overall_score: number; project_id: string; radar_chart_payload: Json };
        Insert: { computed_at?: string; id?: string; overall_score: number; project_id: string; radar_chart_payload: Json };
        Update: { computed_at?: string; id?: string; overall_score?: number; project_id?: string; radar_chart_payload?: Json };
      };
      projects: {
        Row: { charged_amount: number | null; client_id: string; completed_at: string | null; created_at: string; hero_image_path: string | null; hourly_rate_snapshot: number | null; id: string; is_archived: boolean; overhead_amount: number; private_notes: string | null; product_tier_id: string | null; public_description: string | null; public_title: string | null; publish_enabled: boolean; published_at: string | null; short_code: string | null; slug: string; start_date: string | null; status: ProjectStatus; target_delivery_date: string | null; title: string; updated_at: string };
        Insert: { charged_amount?: number | null; client_id: string; completed_at?: string | null; created_at?: string; hero_image_path?: string | null; hourly_rate_snapshot?: number | null; id?: string; is_archived?: boolean; overhead_amount?: number; private_notes?: string | null; product_tier_id?: string | null; public_description?: string | null; public_title?: string | null; publish_enabled?: boolean; published_at?: string | null; short_code?: string | null; slug: string; start_date?: string | null; status?: ProjectStatus; target_delivery_date?: string | null; title: string; updated_at?: string };
        Update: { charged_amount?: number | null; client_id?: string; completed_at?: string | null; created_at?: string; hero_image_path?: string | null; hourly_rate_snapshot?: number | null; id?: string; is_archived?: boolean; overhead_amount?: number; private_notes?: string | null; product_tier_id?: string | null; public_description?: string | null; public_title?: string | null; publish_enabled?: boolean; published_at?: string | null; short_code?: string | null; slug?: string; start_date?: string | null; status?: ProjectStatus; target_delivery_date?: string | null; title?: string; updated_at?: string };
      };
      sustainability_axes: {
        Row: { created_at: string; description: string | null; display_order: number; grade_a_min: number; grade_b_min: number; grade_c_min: number; id: string; is_active: boolean; name: string; updated_at: string; weight: number };
        Insert: { created_at?: string; description?: string | null; display_order: number; grade_a_min: number; grade_b_min: number; grade_c_min: number; id?: string; is_active?: boolean; name: string; updated_at?: string; weight: number };
        Update: { created_at?: string; description?: string | null; display_order?: number; grade_a_min?: number; grade_b_min?: number; grade_c_min?: number; id?: string; is_active?: boolean; name?: string; updated_at?: string; weight?: number };
      };
      sync_runs: {
        Row: { finished_at: string | null; id: string; started_at: string; status: SyncStatus; summary_json: Json | null; sync_type: SyncType };
        Insert: { finished_at?: string | null; id?: string; started_at?: string; status: SyncStatus; summary_json?: Json | null; sync_type: SyncType };
        Update: { finished_at?: string | null; id?: string; started_at?: string; status?: SyncStatus; summary_json?: Json | null; sync_type?: SyncType };
      };
      time_entries: {
        Row: { created_at: string; created_by: string | null; duration_minutes: number; end_time: string; external_calendar_id: string | null; external_event_id: string | null; id: string; needs_manual_assignment: boolean; project_id: string | null; source: TimeEntrySource; start_time: string; sync_status: TimeSyncStatus; title: string; updated_at: string };
        Insert: { created_at?: string; created_by?: string | null; duration_minutes: number; end_time: string; external_calendar_id?: string | null; external_event_id?: string | null; id?: string; needs_manual_assignment?: boolean; project_id?: string | null; source: TimeEntrySource; start_time: string; sync_status?: TimeSyncStatus; title: string; updated_at?: string };
        Update: { created_at?: string; created_by?: string | null; duration_minutes?: number; end_time?: string; external_calendar_id?: string | null; external_event_id?: string | null; id?: string; needs_manual_assignment?: boolean; project_id?: string | null; source?: TimeEntrySource; start_time?: string; sync_status?: TimeSyncStatus; title?: string; updated_at?: string };
      };
      users: {
        Row: { created_at: string; email: string; full_name: string | null; id: string; role: UserRole; updated_at: string };
        Insert: { created_at?: string; email: string; full_name?: string | null; id: string; role?: UserRole; updated_at?: string };
        Update: { created_at?: string; email?: string; full_name?: string | null; id?: string; role?: UserRole; updated_at?: string };
      };
      website_pages: {
        Row: { body_json: Json; id: string; is_published: boolean; page_key: string; seo_description: string | null; seo_title: string | null; slug: string; title: string; updated_at: string; updated_by: string | null };
        Insert: { body_json: Json; id?: string; is_published?: boolean; page_key: string; seo_description?: string | null; seo_title?: string | null; slug: string; title: string; updated_at?: string; updated_by?: string | null };
        Update: { body_json?: Json; id?: string; is_published?: boolean; page_key?: string; seo_description?: string | null; seo_title?: string | null; slug?: string; title?: string; updated_at?: string; updated_by?: string | null };
      };
    };
    Views: {
      v_project_financials_current: {
        Row: { charged_amount: number | null; hourly_rate_snapshot: number | null; labor_cost: number | null; labor_minutes: number | null; material_cost: number | null; overhead_amount: number | null; overhead_cost: number | null; profit_amount: number | null; profit_margin_pct: number | null; project_id: string | null; status: ProjectStatus | null; title: string | null; total_cost: number | null };
      };
      v_project_public_showcase: {
        Row: { hero_image_path: string | null; id: string | null; overall_sustainability_score: number | null; product_tier_code: string | null; product_tier_label: string | null; public_description: string | null; public_title: string | null; published_at: string | null; radar_chart_payload: Json | null; slug: string | null };
      };
      v_unassigned_time_entries: {
        Row: { created_at: string | null; created_by: string | null; duration_minutes: number | null; end_time: string | null; external_calendar_id: string | null; external_event_id: string | null; id: string | null; needs_manual_assignment: boolean | null; project_id: string | null; project_title: string | null; source: TimeEntrySource | null; start_time: string | null; sync_status: TimeSyncStatus | null; title: string | null; updated_at: string | null };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      project_status: ProjectStatus;
      time_entry_source: TimeEntrySource;
      time_sync_status: TimeSyncStatus;
      user_role: UserRole;
      sync_status: SyncStatus;
      sync_type: SyncType;
    };
  };
};

export type ProjectStatus = "inquiry" | "consultation" | "design" | "production" | "completed" | "delivered" | "archived";
export type UserRole = "owner_admin" | "editor";
export type TimeEntrySource = "manual" | "google_calendar";
export type TimeSyncStatus = "pending" | "synced" | "conflict" | "error";
export type SyncStatus = "running" | "success" | "partial_success" | "failed";
export type SyncType = "google_calendar_import" | "google_calendar_export";
export type NoteType = "internal" | "public_draft";
