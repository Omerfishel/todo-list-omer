
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
      categories: {
        Row: {
          color: string
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      todo_categories: {
        Row: {
          category_id: string
          todo_id: string
        }
        Insert: {
          category_id: string
          todo_id: string
        }
        Update: {
          category_id?: string
          todo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_categories_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          }
        ]
      }
      todos: {
        Row: {
          completed: boolean | null
          content: string | null
          created_at: string | null
          creator_id: string
          id: string
          image_url: string | null
          location: Json | null
          reminder: string | null
          title: string
          updated_at: string | null
          urgency: string
        }
        Insert: {
          completed?: boolean | null
          content?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          image_url?: string | null
          location?: Json | null
          reminder?: string | null
          title: string
          updated_at?: string | null
          urgency?: string
        }
        Update: {
          completed?: boolean | null
          content?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          image_url?: string | null
          location?: Json | null
          reminder?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
