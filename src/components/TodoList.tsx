
import React, { useState } from 'react';
import { Todo } from '@/services/api';
import { todoApi, categoryApi } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Category } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MoveRight, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';

export function TodoList() {
  const { userProfile, getTimeOfDayGreeting } = useAuth();
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const queryClient = useQueryClient();

  const { data: todos, isLoading: todosLoading, isError: todosError, error: todosErrorDetails } = useQuery({
    queryKey: ['todos'],
    queryFn: () => todoApi.getAll(),
    retry: 1,
  });

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
    retry: 1,
  });

  const createTodoMutation = useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodo('');
      toast({
        title: "Todo created",
        description: "Your todo has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Create todo error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create todo",
        variant: "destructive",
      });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: Partial<Todo> }) => todoApi.update(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingTodoId(null);
      setEditedTodoTitle('');
      toast({
        title: "Todo updated",
        description: "Your todo has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Update todo error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update todo",
        variant: "destructive",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: todoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Todo deleted",
        description: "Your todo has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Delete todo error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete todo",
        variant: "destructive",
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: Partial<Todo> }) => todoApi.update(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error: any) => {
      console.error('Toggle todo error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update todo",
        variant: "destructive",
      });
    },
  });

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    try {
      await createTodoMutation.mutateAsync({
        title: newTodo,
        completed: false,
        urgency: 'low',
        category_ids: []
      });
    } catch (error) {
      console.error('Error in handleCreateTodo:', error);
    }
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditedTodoTitle(todo.title);
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodoTitle('');
  };

  const handleUpdateTodo = async (id: string) => {
    try {
      await updateTodoMutation.mutateAsync({
        id,
        todo: { title: editedTodoTitle }
      });
    } catch (error) {
      console.error('Error in handleUpdateTodo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodoMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error in handleDeleteTodo:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await toggleCompleteMutation.mutateAsync({
        id: todo.id,
        todo: { completed: !todo.completed }
      });
    } catch (error) {
      console.error('Error in handleToggleComplete:', error);
    }
  };

  if (todosLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (todosError || categoriesError) {
    console.error('Todos error:', todosErrorDetails);
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>
              There was an error loading your todos. Please try refreshing the page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['todos'] })}>
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {getTimeOfDayGreeting()}, {userProfile?.username}
        </h1>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks effectively.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTodo} className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button type="submit" disabled={createTodoMutation.isPending}>
              {createTodoMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </form>
          <ul>
            {todos?.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    disabled={toggleCompleteMutation.isPending}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      } cursor-pointer`}
                  >
                    {todo.completed ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500 inline-block" />
                    ) : null}
                    {editingTodoId === todo.id ? (
                      <Input
                        type="text"
                        value={editedTodoTitle}
                        onChange={(e) => setEditedTodoTitle(e.target.value)}
                        onBlur={handleCancelEditing}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateTodo(todo.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEditing();
                          }
                        }}
                        className="text-sm"
                      />
                    ) : (
                      todo.title
                    )}
                  </label>
                </div>
                <div>
                  {editingTodoId === todo.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateTodo(todo.id)}
                        disabled={updateTodoMutation.isPending}
                      >
                        {updateTodoMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEditing}
                        disabled={updateTodoMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEditing(todo)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your todo from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTodo(todo.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
