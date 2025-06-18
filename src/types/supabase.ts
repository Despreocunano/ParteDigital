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
          last_name: string | null
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
          last_name?: string | null
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
          last_name?: string | null
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
      landing_pages: {
        Row: {
          id: string
          user_id: string
          groom_name: string
          bride_name: string
          wedding_date: string
          welcome_message: string | null
          ceremony_date: string | null
          ceremony_time: string | null
          ceremony_location: string | null
          ceremony_address: string | null
          ceremony_place_id: string | null
          party_date: string | null
          party_time: string | null
          party_location: string | null
          party_address: string | null
          party_place_id: string | null
          music_enabled: boolean
          selected_track: string | null
          template_id: string | null
          slug: string | null
          published_at: string | null
          cover_image: string | null
          gallery_images: GalleryImage[] | null
          bank_info: BankInfo | null
          hashtag: string | null
          dress_code: string
          additional_info: string
          accepts_kids: boolean
          accepts_pets: boolean
          couple_code: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          groom_name: string
          bride_name: string
          wedding_date: string
          welcome_message?: string | null
          ceremony_date?: string | null
          ceremony_time?: string | null
          ceremony_location?: string | null
          ceremony_address?: string | null
          ceremony_place_id?: string | null
          party_date?: string | null
          party_time?: string | null
          party_location?: string | null
          party_address?: string | null
          party_place_id?: string | null
          music_enabled?: boolean
          selected_track?: string | null
          template_id?: string | null
          slug?: string | null
          published_at?: string | null
          cover_image?: string | null
          gallery_images?: GalleryImage[] | null
          bank_info?: BankInfo | null
          hashtag?: string | null
          dress_code?: string
          additional_info?: string
          accepts_kids?: boolean
          accepts_pets?: boolean
          couple_code?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          groom_name?: string
          bride_name?: string
          wedding_date?: string
          welcome_message?: string | null
          ceremony_date?: string | null
          ceremony_time?: string | null
          ceremony_location?: string | null
          ceremony_address?: string | null
          ceremony_place_id?: string | null
          party_date?: string | null
          party_time?: string | null
          party_location?: string | null
          party_address?: string | null
          party_place_id?: string | null
          music_enabled?: boolean
          selected_track?: string | null
          template_id?: string | null
          slug?: string | null
          published_at?: string | null
          cover_image?: string | null
          gallery_images?: GalleryImage[] | null
          bank_info?: BankInfo | null
          hashtag?: string | null
          dress_code?: string
          additional_info?: string
          accepts_kids?: boolean
          accepts_pets?: boolean
          couple_code?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      guest_tables: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          capacity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
      }
    }
  }
}

interface GalleryImage {
  url: string;
  caption?: string;
}

interface BankInfo {
  accountHolder: string;
  rut: string;
  bank: string;
  accountType: string;
  accountNumber: string;
  email: string;
}

export type Attendee = Database['public']['Tables']['attendees']['Row']
export type AttendeeInsert = Database['public']['Tables']['attendees']['Insert']
export type AttendeeUpdate = Database['public']['Tables']['attendees']['Update']
export type LandingPage = Database['public']['Tables']['landing_pages']['Row']
export type LandingPageInsert = Database['public']['Tables']['landing_pages']['Insert']
export type LandingPageUpdate = Database['public']['Tables']['landing_pages']['Update']
export type GuestTable = Database['public']['Tables']['guest_tables']['Row']
export type GuestTableInsert = Database['public']['Tables']['guest_tables']['Insert']
export type GuestTableUpdate = Database['public']['Tables']['guest_tables']['Update']