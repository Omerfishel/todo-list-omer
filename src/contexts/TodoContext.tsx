
import React, { createContext, useContext, useState, useEffect } from 'react';
import { todoApi, categoryApi } from '@/services/api';
import type { Todo, Category } from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { setupDefaultCategories } from '@/lib/setupDefaults';
import { Json } from '@/types/supabase.types';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

// Extended location type to handle both Json and our expected structure
type TodoLocation = {
  address: string;
  lat: number;
  lng: number;
} | null;

// Add additional properties needed by our components
export interface TodoItem extends Omit<Todo, 'location' | 'reminder'> {
  description?: string;
  subItems?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  location?: TodoLocation;
  reminder?: string | null;
  due_date?: string | null;
  category_id?: string | null;
  priority?: string | null;
}

interface TodoContextType {
  todos: TodoItem[];
  categories: Category[];
  addTodo: (
    title: string, 
    categoryId: string, 
    content?: string, 
    reminder?: Date, 
    location?: { address: string; lat: number; lng: number; },
    urgency?: UrgencyLevel
  ) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodoContent: (
    id: string, 
    content: string, 
    reminder?: Date, 
    location?: { address: string; lat: number; lng: number; } | null,
    title?: string,
    urgency?: UrgencyLevel
  ) => Promise<void>;
  updateTodoCategories: (id: string, categoryIds: string[]) => Promise<void>;
  addCategory: (name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addSubItem: (todoId: string, title: string) => void;
  deleteSubItem: (todoId: string, subItemId: string) => void;
  toggleSubItem: (todoId: string, subItemId: string) => void;
  updateTodoDescription: (todoId: string, description: string) => void;
  // Add missing methods that TodoList.tsx expects
  updateTodo: (id: string, updates: Partial<TodoItem>) => Promise<void>;
  moveTodo: (id: string, newIndex: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);
      if (categoriesData.length === 0) {
        const created = await setupDefaultCategories();
        if (created) {
          const newCategories = await categoryApi.getAll();
          setCategories(newCategories);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [todosData] = await Promise.all([
          todoApi.getAll(),
        ]);
        
        // Transform and add required properties
        const transformedTodos: TodoItem[] = todosData.map(todo => ({ 
          ...todo, 
          subItems: [],
          // Add these for TodoList.tsx compatibility
          due_date: todo.reminder,
          category_id: todo.category_ids?.[0] || null,
          priority: null
        }));
        
        setTodos(transformedTodos);
        await loadCategories();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const addTodo = async (
    title: string, 
    categoryId: string, 
    content?: string, 
    reminder?: Date, 
    location?: { address: string; lat: number; lng: number; },
    urgency: UrgencyLevel = 'low'
  ) => {
    try {
      const reminderStr = reminder ? reminder.toISOString() : null;
      
      const newTodo = await todoApi.create({
        title,
        content: content || '',
        completed: false,
        category_ids: categoryId ? [categoryId] : [],
        reminder: reminderStr,
        location,
        urgency,
        image_url: undefined
      });

      // Add the extra fields needed for TodoList.tsx
      const todoWithExtras: TodoItem = {
        ...newTodo,
        subItems: [],
        due_date: reminderStr,
        category_id: categoryId || null,
        priority: null
      };

      setTodos(prev => [todoWithExtras, ...prev]);
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await todoApi.update(id, {
        ...todo,
        completed: !todo.completed
      });

      setTodos(prev => prev.map(t => 
        t.id === id ? { 
          ...updatedTodo, 
          subItems: t.subItems,
          due_date: updatedTodo.reminder,
          category_id: updatedTodo.category_ids?.[0] || null 
        } : t
      ));
      
      if (!todo.completed) {
        toast({
          title: "Task completed! 🎉",
          description: "Great job! Keep up the good work!",
        });
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const updateTodoContent = async (
    id: string, 
    content: string, 
    reminder?: Date, 
    location?: { address: string; lat: number; lng: number; } | null,
    title?: string,
    urgency?: UrgencyLevel
  ) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const reminderStr = reminder ? reminder.toISOString() : todo.reminder;
      
      const updatedTodo = await todoApi.update(id, {
        ...todo,
        title: title || todo.title,
        content,
        reminder: reminderStr,
        location,
        urgency: urgency || todo.urgency || 'low'
      });

      setTodos(prev => prev.map(t => 
        t.id === id ? { 
          ...t,
          ...updatedTodo,
          title: updatedTodo.title,
          content: updatedTodo.content,
          reminder: updatedTodo.reminder,
          location: updatedTodo.location as TodoLocation,
          urgency: updatedTodo.urgency,
          subItems: t.subItems,
          due_date: updatedTodo.reminder,
          category_id: updatedTodo.category_ids?.[0] || null
        } : t
      ));

      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating todo content:', error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    }
  };

  const updateTodoCategories = async (id: string, categoryIds: string[]) => {
    try {
      setTodos(prev => prev.map(t => 
        t.id === id ? { 
          ...t, 
          category_ids: categoryIds,
          category_id: categoryIds[0] || null
        } : t
      ));

      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      await todoApi.update(id, {
        ...todo,
        category_ids: categoryIds
      });
    } catch (error) {
      console.error('Error updating todo categories:', error);
      const originalTodo = todos.find(t => t.id === id);
      if (originalTodo) {
        setTodos(prev => prev.map(t => 
          t.id === id ? originalTodo : t
        ));
      }
      toast({
        title: "Error",
        description: "Failed to update categories.",
        variant: "destructive",
      });
    }
  };

  const addCategory = async (name: string, color: string) => {
    try {
      const newCategory = await categoryApi.create({
        name,
        color
      });
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Category added",
        description: "Your category has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryApi.delete(id);
      setCategories(prev => prev.filter(category => category.id !== id));
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  const addSubItem = (todoId: string, title: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subItems: [
            ...(todo.subItems || []),
            {
              id: Math.random().toString(36).substring(7),
              title,
              completed: false,
            },
          ],
        };
      }
      return todo;
    }));
  };

  const deleteSubItem = (todoId: string, subItemId: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subItems: todo.subItems?.filter(item => item.id !== subItemId) || [],
        };
      }
      return todo;
    }));
  };

  const toggleSubItem = (todoId: string, subItemId: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subItems: todo.subItems?.map(item =>
            item.id === subItemId ? { ...item, completed: !item.completed } : item
          ) || [],
        };
      }
      return todo;
    }));
  };

  const updateTodoDescription = (todoId: string, description: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, description } : todo
    ));
  };

  // Implement the missing methods for TodoList.tsx
  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      // Update local state first for immediate UI feedback
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ));

      // Prepare API compatible updates
      const apiUpdates: Partial<Todo> = {
        ...updates,
        category_ids: updates.category_id ? [updates.category_id] : todo.category_ids,
        reminder: updates.due_date || todo.reminder
      };

      // Update in the API
      await todoApi.update(id, apiUpdates);

      toast({
        title: "Success",
        description: "Todo updated successfully.",
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo.",
        variant: "destructive",
      });
    }
  };

  const moveTodo = (id: string, newIndex: number) => {
    setTodos(prevTodos => {
      const currentTodos = [...prevTodos];
      const todoIndex = currentTodos.findIndex(todo => todo.id === id);
      if (todoIndex === -1) return prevTodos;
      
      const [movedTodo] = currentTodos.splice(todoIndex, 1);
      currentTodos.splice(newIndex, 0, movedTodo);
      
      return currentTodos;
    });
  };

  return (
    <TodoContext.Provider value={{
      todos,
      categories,
      addTodo,
      deleteTodo,
      toggleTodo,
      updateTodoContent,
      updateTodoCategories,
      addCategory,
      deleteCategory,
      addSubItem,
      deleteSubItem,
      toggleSubItem,
      updateTodoDescription,
      updateTodo,
      moveTodo,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
