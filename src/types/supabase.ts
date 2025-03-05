
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
          description: string | null
          completed: boolean
          user_id: string
          category: string | null
          due_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          completed?: boolean
          user_id: string
          category?: string | null
          due_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          completed?: boolean
          user_id?: string
          category?: string | null
          due_date?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
