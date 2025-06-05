export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type RsvpStatus = 'pending' | 'confirmed' | 'declined';

export interface Database {
  public: {
    Tables: {
      attendees: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          rsvp_status: RsvpStatus
          dietary_restrictions: string | null
          needs_accommodation: boolean
          accommodation_notes: string | null
          table_id: string | null
          has_plus_one: boolean
          plus_one_name: string | null
          plus_one_dietary_restrictions: string | null
          plus_one_rsvp_status: RsvpStatus | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          rsvp_status?: RsvpStatus
          dietary_restrictions?: string | null
          needs_accommodation?: boolean
          accommodation_notes?: string | null
          table_id?: string | null
          has_plus_one?: boolean
          plus_one_name?: string | null
          plus_one_dietary_restrictions?: string | null
          plus_one_rsvp_status?: RsvpStatus | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          rsvp_status?: RsvpStatus
          dietary_restrictions?: string | null
          needs_accommodation?: boolean
          accommodation_notes?: string | null
          table_id?: string | null
          has_plus_one?: boolean
          plus_one_name?: string | null
          plus_one_dietary_restrictions?: string | null
          plus_one_rsvp_status?: RsvpStatus | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          wedding_name: string
          created_at: string
        }
        Insert: {
          id: string
          wedding_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          wedding_name?: string
          created_at?: string
        }
      }
      tables: Table
      email_logs: EmailLog
    }
  }
}

interface Table {
  Row: {
    id: string
    user_id: string
    name: string
    capacity: number
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    name: string
    capacity?: number
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    name?: string
    capacity?: number
    created_at?: string
    updated_at?: string
  }
}

interface EmailLog {
  Row: {
    id: string
    user_id: string
    guest_id: string
    subject: string
    content: string
    sent_at: string
  }
  Insert: {
    id?: string
    user_id: string
    guest_id: string
    subject: string
    content: string
    sent_at?: string
  }
}

export type Attendee = Database['public']['Tables']['attendees']['Row']
export type AttendeeInsert = Database['public']['Tables']['attendees']['Insert']
export type AttendeeUpdate = Database['public']['Tables']['attendees']['Update']
export type Table = Database['public']['Tables']['tables']['Row']
export type TableInsert = Database['public']['Tables']['tables']['Insert']
export type TableUpdate = Database['public']['Tables']['tables']['Update']
export type User = Database['public']['Tables']['users']['Row']
export type UserUpdate = Database['public']['Tables']['users']['Update']