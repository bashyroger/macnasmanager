export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          payload: Json | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          payload?: Json | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          instagram_handle: string | null
          is_archived: boolean
          notes: string | null
          phone: string | null
          preferences: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          instagram_handle?: string | null
          is_archived?: boolean
          notes?: string | null
          phone?: string | null
          preferences?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          instagram_handle?: string | null
          is_archived?: boolean
          notes?: string | null
          phone?: string | null
          preferences?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      google_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string | null
          refresh_token: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token?: string | null
          refresh_token: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string | null
          refresh_token?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      material_sustainability_scores: {
        Row: {
          id: string
          material_id: string
          notes: string | null
          score: number
          sustainability_axis_id: string
        }
        Insert: {
          id?: string
          material_id: string
          notes?: string | null
          score: number
          sustainability_axis_id: string
        }
        Update: {
          id?: string
          material_id?: string
          notes?: string | null
          score?: number
          sustainability_axis_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_sustainability_scores_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_sustainability_scores_sustainability_axis_id_fkey"
            columns: ["sustainability_axis_id"]
            isOneToOne: false
            referencedRelation: "sustainability_axes"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          availability_notes: string | null
          bendability_rating: number | null
          biodegradability: string | null
          carbon_footprint: string | null
          color_options: string | null
          compostability: string | null
          cost_per_unit: number
          created_at: string
          durability_rating: number | null
          end_of_life: string | null
          id: string
          is_archived: boolean
          name: string
          origin_story: string | null
          production_method: string | null
          stock_level: number | null
          strength_rating: number | null
          supplier_name: string | null
          supplier_url: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          availability_notes?: string | null
          bendability_rating?: number | null
          biodegradability?: string | null
          carbon_footprint?: string | null
          color_options?: string | null
          compostability?: string | null
          cost_per_unit: number
          created_at?: string
          durability_rating?: number | null
          end_of_life?: string | null
          id?: string
          is_archived?: boolean
          name: string
          origin_story?: string | null
          production_method?: string | null
          stock_level?: number | null
          strength_rating?: number | null
          supplier_name?: string | null
          supplier_url?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          availability_notes?: string | null
          bendability_rating?: number | null
          biodegradability?: string | null
          carbon_footprint?: string | null
          color_options?: string | null
          compostability?: string | null
          cost_per_unit?: number
          created_at?: string
          durability_rating?: number | null
          end_of_life?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          origin_story?: string | null
          production_method?: string | null
          stock_level?: number | null
          strength_rating?: number | null
          supplier_name?: string | null
          supplier_url?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_tiers: {
        Row: {
          code: string
          id: string
          is_active: boolean
          label: string
          min_labor_hours: number | null
          min_total_cost: number | null
          rule_json: Json
          sort_order: number
        }
        Insert: {
          code: string
          id?: string
          is_active?: boolean
          label: string
          min_labor_hours?: number | null
          min_total_cost?: number | null
          rule_json?: Json
          sort_order?: number
        }
        Update: {
          code?: string
          id?: string
          is_active?: boolean
          label?: string
          min_labor_hours?: number | null
          min_total_cost?: number | null
          rule_json?: Json
          sort_order?: number
        }
        Relationships: []
      }
      project_financial_snapshots: {
        Row: {
          charged_amount: number | null
          computed_at: string
          id: string
          labor_cost: number
          labor_minutes: number
          material_cost: number
          overhead_cost: number
          product_tier_id: string | null
          profit_amount: number | null
          profit_margin_pct: number | null
          project_id: string
          total_cost: number
        }
        Insert: {
          charged_amount?: number | null
          computed_at?: string
          id?: string
          labor_cost: number
          labor_minutes: number
          material_cost: number
          overhead_cost: number
          product_tier_id?: string | null
          profit_amount?: number | null
          profit_margin_pct?: number | null
          project_id: string
          total_cost: number
        }
        Update: {
          charged_amount?: number | null
          computed_at?: string
          id?: string
          labor_cost?: number
          labor_minutes?: number
          material_cost?: number
          overhead_cost?: number
          product_tier_id?: string | null
          profit_amount?: number | null
          profit_margin_pct?: number | null
          project_id?: string
          total_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_financial_snapshots_product_tier_id_fkey"
            columns: ["product_tier_id"]
            isOneToOne: false
            referencedRelation: "product_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_financial_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_financial_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_financials_current"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_financial_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_public_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          is_public: boolean
          project_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          project_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          project_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_financials_current"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_public_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      project_materials: {
        Row: {
          computed_material_cost: number
          created_at: string
          id: string
          material_id: string
          notes: string | null
          project_id: string
          quantity_used: number
          unit_cost_snapshot: number
          unit_snapshot: string
          updated_at: string
        }
        Insert: {
          computed_material_cost: number
          created_at?: string
          id?: string
          material_id: string
          notes?: string | null
          project_id: string
          quantity_used: number
          unit_cost_snapshot: number
          unit_snapshot: string
          updated_at?: string
        }
        Update: {
          computed_material_cost?: number
          created_at?: string
          id?: string
          material_id?: string
          notes?: string | null
          project_id?: string
          quantity_used?: number
          unit_cost_snapshot?: number
          unit_snapshot?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_financials_current"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_public_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notes: {
        Row: {
          body: string
          created_at: string
          created_by: string
          id: string
          note_type: Database["public"]["Enums"]["note_type"]
          project_id: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by: string
          id?: string
          note_type: Database["public"]["Enums"]["note_type"]
          project_id: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string
          id?: string
          note_type?: Database["public"]["Enums"]["note_type"]
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_financials_current"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_public_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sustainability_axis_snapshots: {
        Row: {
          id: string
          letter_grade: string
          score: number
          snapshot_id: string
          sustainability_axis_id: string
        }
        Insert: {
          id?: string
          letter_grade: string
          score: number
          snapshot_id: string
          sustainability_axis_id: string
        }
        Update: {
          id?: string
          letter_grade?: string
          score?: number
          snapshot_id?: string
          sustainability_axis_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_sustainability_axis_snapsho_sustainability_axis_id_fkey"
            columns: ["sustainability_axis_id"]
            isOneToOne: false
            referencedRelation: "sustainability_axes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_sustainability_axis_snapshots_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "project_sustainability_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sustainability_snapshots: {
        Row: {
          computed_at: string
          id: string
          overall_score: number
          project_id: string
          radar_chart_payload: Json
        }
        Insert: {
          computed_at?: string
          id?: string
          overall_score: number
          project_id: string
          radar_chart_payload?: Json
        }
        Update: {
          computed_at?: string
          id?: string
          overall_score?: number
          project_id?: string
          radar_chart_payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "project_sustainability_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_sustainability_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_financials_current"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_sustainability_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_public_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          charged_amount: number | null
          client_id: string
          completed_at: string | null
          created_at: string
          hero_image_path: string | null
          hourly_rate_snapshot: number | null
          id: string
          is_archived: boolean
          overhead_amount: number
          private_notes: string | null
          product_tier_id: string | null
          public_description: string | null
          public_title: string | null
          publish_enabled: boolean
          published_at: string | null
          short_code: string | null
          slug: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          target_delivery_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          charged_amount?: number | null
          client_id: string
          completed_at?: string | null
          created_at?: string
          hero_image_path?: string | null
          hourly_rate_snapshot?: number | null
          id?: string
          is_archived?: boolean
          overhead_amount?: number
          private_notes?: string | null
          product_tier_id?: string | null
          public_description?: string | null
          public_title?: string | null
          publish_enabled?: boolean
          published_at?: string | null
          short_code?: string | null
          slug: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_delivery_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          charged_amount?: number | null
          client_id?: string
          completed_at?: string | null
          created_at?: string
          hero_image_path?: string | null
          hourly_rate_snapshot?: number | null
          id?: string
          is_archived?: boolean
          overhead_amount?: number
          private_notes?: string | null
          product_tier_id?: string | null
          public_description?: string | null
          public_title?: string | null
          publish_enabled?: boolean
          published_at?: string | null
          short_code?: string | null
          slug?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_delivery_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_product_tier_id_fkey"
            columns: ["product_tier_id"]
            isOneToOne: false
            referencedRelation: "product_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      sustainability_axes: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          grade_a_min: number
          grade_b_min: number
          grade_c_min: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order: number
          grade_a_min: number
          grade_b_min: number
          grade_c_min: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          weight: number
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          grade_a_min?: number
          grade_b_min?: number
          grade_c_min?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      sync_runs: {
        Row: {
          finished_at: string | null
          id: string
          started_at: string
          status: Database["public"]["Enums"]["sync_run_status"]
          summary_json: Json | null
          sync_type: Database["public"]["Enums"]["sync_run_type"]
        }
        Insert: {
          finished_at?: string | null
          id?: string
          started_at?: string
          status: Database["public"]["Enums"]["sync_run_status"]
          summary_json?: Json | null
          sync_type: Database["public"]["Enums"]["sync_run_type"]
        }
        Update: {
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["sync_run_status"]
          summary_json?: Json | null
          sync_type?: Database["public"]["Enums"]["sync_run_type"]
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          created_at: string
          created_by: string | null
          duration_minutes: number
          end_time: string
          external_calendar_id: string | null
          external_event_id: string | null
          id: string
          needs_manual_assignment: boolean
          project_id: string | null
          source: Database["public"]["Enums"]["time_entry_source"]
          start_time: string
          sync_status: Database["public"]["Enums"]["time_sync_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duration_minutes: number
          end_time: string
          external_calendar_id?: string | null
          external_event_id?: string | null
          id?: string
          needs_manual_assignment?: boolean
          project_id?: string | null
          source: Database["public"]["Enums"]["time_entry_source"]
          start_time: string
          sync_status?: Database["public"]["Enums"]["time_sync_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          end_time?: string
          external_calendar_id?: string | null
          external_event_id?: string | null
          id?: string
          needs_manual_assignment?: boolean
          project_id?: string | null
          source?: Database["public"]["Enums"]["time_entry_source"]
          start_time?: string
          sync_status?: Database["public"]["Enums"]["time_sync_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_financials_current"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_public_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      website_pages: {
        Row: {
          body_json: Json
          id: string
          is_published: boolean
          page_key: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body_json?: Json
          id?: string
          is_published?: boolean
          page_key: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body_json?: Json
          id?: string
          is_published?: boolean
          page_key?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_project_financials_current: {
        Row: {
          charged_amount: number | null
          hourly_rate_snapshot: number | null
          labor_cost: number | null
          labor_minutes: number | null
          material_cost: number | null
          overhead_amount: number | null
          overhead_cost: number | null
          profit_amount: number | null
          profit_margin_pct: number | null
          project_id: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string | null
          total_cost: number | null
        }
        Relationships: []
      }
      v_project_public_showcase: {
        Row: {
          hero_image_path: string | null
          id: string | null
          overall_sustainability_score: number | null
          product_tier_code: string | null
          product_tier_label: string | null
          public_description: string | null
          public_title: string | null
          published_at: string | null
          radar_chart_payload: Json | null
          slug: string | null
        }
        Relationships: []
      }
      v_unassigned_time_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          end_time: string | null
          external_calendar_id: string | null
          external_event_id: string | null
          id: string | null
          needs_manual_assignment: boolean | null
          project_id: string | null
          project_title: string | null
          source: Database["public"]["Enums"]["time_entry_source"] | null
          start_time: string | null
          sync_status: Database["public"]["Enums"]["time_sync_status"] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          external_calendar_id?: string | null
          external_event_id?: string | null
          id?: string | null
          needs_manual_assignment?: boolean | null
          project_id?: string | null
          project_title?: never
          source?: Database["public"]["Enums"]["time_entry_source"] | null
          start_time?: string | null
          sync_status?: Database["public"]["Enums"]["time_sync_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          external_calendar_id?: string | null
          external_event_id?: string | null
          id?: string | null
          needs_manual_assignment?: boolean | null
          project_id?: string | null
          project_title?: never
          source?: Database["public"]["Enums"]["time_entry_source"] | null
          start_time?: string | null
          sync_status?: Database["public"]["Enums"]["time_sync_status"] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_financials_current"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_public_showcase"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_app_user: { Args: never; Returns: boolean }
      is_owner_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      note_type: "internal" | "public_draft"
      project_status:
        | "inquiry"
        | "consultation"
        | "design"
        | "production"
        | "completed"
        | "delivered"
        | "archived"
      sync_run_status: "running" | "success" | "partial_success" | "failed"
      sync_run_type: "google_calendar_import" | "google_calendar_export"
      time_entry_source: "manual" | "google_calendar"
      time_sync_status: "pending" | "synced" | "conflict" | "error"
      user_role: "owner_admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      note_type: ["internal", "public_draft"],
      project_status: [
        "inquiry",
        "consultation",
        "design",
        "production",
        "completed",
        "delivered",
        "archived",
      ],
      sync_run_status: ["running", "success", "partial_success", "failed"],
      sync_run_type: ["google_calendar_import", "google_calendar_export"],
      time_entry_source: ["manual", "google_calendar"],
      time_sync_status: ["pending", "synced", "conflict", "error"],
      user_role: ["owner_admin", "editor"],
    },
  },
} as const
