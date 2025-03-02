
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
          created_at: string
          updated_at: string
          name: string
          color: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          color: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          color?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string
          avatar_url: string | null
          email: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username: string
          avatar_url?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string
          avatar_url?: string | null
          email?: string | null
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
      todo_categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          todo_id: string
          category_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          todo_id: string
          category_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
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
          created_at: string
          updated_at: string
          title: string
          completed: boolean
          creator_id: string
          description: string | null
          due_date: string | null
          priority: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          completed?: boolean
          creator_id: string
          description?: string | null
          due_date?: string | null
          priority?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          completed?: boolean
          creator_id?: string
          description?: string | null
          due_date?: string | null
          priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "todos_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          todo_id: string | null
          type: string
          message: string
          read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          todo_id?: string | null
          type: string
          message: string
          read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          todo_id?: string | null
          type?: string
          message?: string
          read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_todo_id_fkey"
            columns: ["todo_id"]
            referencedRelation: "todos"
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
  }
}
