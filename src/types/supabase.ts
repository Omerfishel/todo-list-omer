
import { Database as DatabaseGenerated } from './supabase.types';

export type Database = DatabaseGenerated;

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export interface UserProfile extends Tables<'profiles'> {
  full_name?: string;
}
