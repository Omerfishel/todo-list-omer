
import { Database as DatabaseGenerated } from './supabase.types';

export type Database = DatabaseGenerated;

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export interface UserProfile extends Tables<'profiles'> {
  full_name?: string;
}
