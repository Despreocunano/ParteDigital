import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// These would typically come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are not properly set up.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);