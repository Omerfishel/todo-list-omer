
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
      categories: {
        Row: {
          id: string
          name: string
          color: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          read: boolean
          created_at: string
          type: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          read?: boolean
          created_at?: string
          type: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          read?: boolean
          created_at?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      todo_assignments: {
        Row: {
          todo_id: string
          user_id: string
          assigned_by: string | null
          created_at: string
        }
        Insert: {
          todo_id: string
          user_id: string
          assigned_by?: string | null
          created_at?: string
        }
        Update: {
          todo_id?: string
          user_id?: string
          assigned_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_assignments_todo_id_fkey"
            columns: ["todo_id"]
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_assignments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      todo_categories: {
        Row: {
          todo_id: string
          category_id: string
        }
        Insert: {
          todo_id: string
          category_id: string
        }
        Update: {
          todo_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_categories_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_categories_todo_id_fkey"
            columns: ["todo_id"]
            referencedRelation: "todos"
            referencedColumns: ["id"]
          }
        ]
      }
      todos: {
        Row: {
          id: string
          title: string
          content: string | null
          completed: boolean
          image_url: string | null
          reminder: string | null
          location: Json | null
          urgency: string
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          completed?: boolean
          image_url?: string | null
          reminder?: string | null
          location?: Json | null
          urgency?: string
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          completed?: boolean
          image_url?: string | null
          reminder?: string | null
          location?: Json | null
          urgency?: string
          creator_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
