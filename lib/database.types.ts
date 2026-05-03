export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          series: string
          circuit_name: string
          country: string
          weekend_start: string
          weekend_end: string
          session_types: string[]
          is_active: boolean
          created_at: string
          slug: string
          image_url?: string
        }
        Insert: {
          id?: string
          series: string
          circuit_name: string
          country: string
          weekend_start: string
          weekend_end: string
          session_types?: string[]
          is_active?: boolean
          created_at?: string
          slug: string
          image_url?: string
        }
        Update: {
          id?: string
          series?: string
          circuit_name?: string
          country?: string
          weekend_start?: string
          weekend_end?: string
          session_types?: string[]
          is_active?: boolean
          created_at?: string
          slug?: string
          image_url?: string
        }
      }
      packages: {
        Row: {
          id: string
          event_id: string
          name: string
          price_min_cents: number | null
          price_max_cents: number | null
          includes: string[]
          access_level: string | null
          allocation_total: number | null
          allocation_remaining: number | null
          is_hidden: boolean
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          price_min_cents?: number | null
          price_max_cents?: number | null
          includes?: string[]
          access_level?: string | null
          allocation_total?: number | null
          allocation_remaining?: number | null
          is_hidden?: boolean
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          price_min_cents?: number | null
          price_max_cents?: number | null
          includes?: string[]
          access_level?: string | null
          allocation_total?: number | null
          allocation_remaining?: number | null
          is_hidden?: boolean
        }
      }
      leads: {
        Row: {
          id: string
          event_id: string | null
          full_name: string
          email: string
          whatsapp: string | null
          group_size: number | null
          budget_range: string | null
          preferred_team: string | null
          needs_hotel: boolean
          needs_flights: boolean
          corporate_gift: boolean
          message: string | null
          status: string
          assigned_to: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          full_name: string
          email: string
          whatsapp?: string | null
          group_size?: number | null
          budget_range?: string | null
          preferred_team?: string | null
          needs_hotel?: boolean
          needs_flights?: boolean
          corporate_gift?: boolean
          message?: string | null
          status?: string
          assigned_to?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          full_name?: string
          email?: string
          whatsapp?: string | null
          group_size?: number | null
          budget_range?: string | null
          preferred_team?: string | null
          needs_hotel?: boolean
          needs_flights?: boolean
          corporate_gift?: boolean
          message?: string | null
          status?: string
          assigned_to?: string | null
          created_at?: string
        }
      }
      racing_inventory: {
        Row: {
          id: string
          package_id: string
          event_id: string
          available_spots: number
          last_updated: string
        }
        Insert: {
          id?: string
          package_id: string
          event_id: string
          available_spots: number
          last_updated?: string
        }
        Update: {
          id?: string
          package_id?: string
          event_id?: string
          available_spots?: number
          last_updated?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          full_name?: string | null
          created_at?: string
        }
      }
    }
  }
}
