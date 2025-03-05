
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
      todos: {
        Row: {
          id: string
          created_at: string
          title: string
          completed: boolean
          user_id: string
          category_id: string | null
          due_date: string | null
          priority: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          completed?: boolean
          user_id: string
          category_id?: string | null
          due_date?: string | null
          priority?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          completed?: boolean
          user_id?: string
          category_id?: string | null
          due_date?: string | null
          priority?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
        }
      }
    }
  }
}
