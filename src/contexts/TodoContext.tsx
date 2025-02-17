import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type SubItem = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
  reminder?: Date;
  description?: string;
  content?: string;
  subItems: SubItem[];
};

type TodoContextType = {
  todos: TodoItem[];
  categories: Category[];
  addTodo: (title: string, categoryId: string, reminder?: Date, description?: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  addSubItem: (todoId: string, title: string) => void;
  deleteSubItem: (todoId: string, subItemId: string) => void;
  toggleSubItem: (todoId: string, subItemId: string) => void;
  updateTodoDescription: (todoId: string, description: string) => void;
  updateTodoContent: (todoId: string, content: string) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const defaultCategories: Category[] = [
  { id: '1', name: 'Personal', color: '#E5DEFF' },
  { id: '2', name: 'Work', color: '#FDE1D3' },
  { id: '3', name: 'Shopping', color: '#D3E4FD' },
];

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const { toast } = useToast();

  const addTodo = (title: string, categoryId: string, reminder?: Date, description?: string) => {
    const newTodo: TodoItem = {
      id: Math.random().toString(36).substring(7),
      title,
      completed: false,
      categoryId,
      reminder,
      description,
      content: '',
      subItems: [],
    };
    setTodos([...todos, newTodo]);
    toast({
      title: "Todo added",
      description: "Your todo has been added successfully.",
    });
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Todo deleted",
      description: "Your todo has been deleted successfully.",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Math.random().toString(36).substring(7),
      name,
      color,
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: "Your category has been added successfully.",
    });
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    toast({
      title: "Category deleted",
      description: "Your category has been deleted successfully.",
    });
  };

  const addSubItem = (todoId: string, title: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subItems: [...todo.subItems, {
            id: Math.random().toString(36).substring(7),
            title,
            completed: false,
          }],
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
          subItems: todo.subItems.filter(item => item.id !== subItemId),
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
          subItems: todo.subItems.map(item =>
            item.id === subItemId ? { ...item, completed: !item.completed } : item
          ),
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

  const updateTodoContent = (todoId: string, content: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, content } : todo
    ));
  };

  return (
    <TodoContext.Provider value={{
      todos,
      categories,
      addTodo,
      deleteTodo,
      toggleTodo,
      addCategory,
      deleteCategory,
      addSubItem,
      deleteSubItem,
      toggleSubItem,
      updateTodoDescription,
      updateTodoContent,
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
