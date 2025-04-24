
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with our custom properties
export interface User extends SupabaseUser {
  name?: string;
  farmName?: string;
  location?: string;
  phone?: string;
  website?: string;
  // Add any other custom user properties here
}
