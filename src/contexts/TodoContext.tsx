import React, { createContext, useContext, useState, useEffect } from 'react';
import { todoApi, categoryApi } from '@/services/api';
import type { Todo, Category } from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { setupDefaultCategories } from '@/lib/setupDefaults';

export interface TodoItem extends Todo {
  description?: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  subItems?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
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
    urgency?: 'low' | 'medium' | 'high' | 'urgent'
  ) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodoContent: (
    id: string, 
    content: string, 
    reminder?: Date, 
    location?: { address: string; lat: number; lng: number; } | null,
    title?: string
  ) => Promise<void>;
  updateTodoCategories: (id: string, categoryIds: string[]) => Promise<void>;
  addCategory: (name: string, color: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addSubItem: (todoId: string, title: string) => void;
  deleteSubItem: (todoId: string, subItemId: string) => void;
  toggleSubItem: (todoId: string, subItemId: string) => void;
  updateTodoDescription: (todoId: string, description: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
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
        setTodos(todosData.map(todo => ({ ...todo, subItems: [] })));
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
    urgency: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ) => {
    try {
      const newTodo = await todoApi.create({
        title,
        content,
        completed: false,
        category_ids: categoryId ? [categoryId] : [],
        reminder,
        location,
        image_url: null,
        urgency
      });

      setTodos(prev => [{ ...newTodo, subItems: [] }, ...prev]);
      toast({
        title: "Todo added",
        description: "Your todo has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add todo.",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Todo deleted",
        description: "Your todo has been deleted successfully.",
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
        t.id === id ? { ...updatedTodo, subItems: t.subItems } : t
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
    title?: string
  ) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await todoApi.update(id, {
        ...todo,
        title: title || todo.title,
        content,
        reminder,
        location
      });

      setTodos(prev => prev.map(t => 
        t.id === id ? { 
          ...t,
          ...updatedTodo,
          title: updatedTodo.title,
          content: updatedTodo.content,
          reminder: updatedTodo.reminder,
          location: updatedTodo.location,
          subItems: t.subItems 
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
        t.id === id ? { ...t, category_ids: categoryIds } : t
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
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
