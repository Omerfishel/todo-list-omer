import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Calendar, ListChecks, ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';
import { CategorySelect } from './CategorySelect';
import { DatePicker } from './DatePicker';
import { PrioritySelect } from './PrioritySelect';
import { Navbar } from '@/components/Navbar';

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
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export function TodoList() {
  const { todos, addTodo, updateTodo, deleteTodo, categories, moveTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const { user } = useAuth();

  useEffect(() => {
    if (editTodoId) {
      const todoToEdit = todos.find(todo => todo.id === editTodoId);
      if (todoToEdit) {
        setEditTitle(todoToEdit.title);
        setSelectedCategory(todoToEdit.category_id || '');
        setDueDate(todoToEdit.due_date ? new Date(todoToEdit.due_date) : null);
        setPriority(todoToEdit.priority || '');
      }
    } else {
      setEditTitle('');
      setSelectedCategory('');
      setDueDate(null);
      setPriority('');
    }
  }, [editTodoId, todos]);

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'priority') {
      const priorityValues: { [key: string]: number } = { 'high': 3, 'medium': 2, 'low': 1, '': 0 };
      const priorityA = priorityValues[a.priority || ''];
      const priorityB = priorityValues[b.priority || ''];
      return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
    }
    return 0;
  });

  const handleAddTodo = async () => {
    if (title.trim() === '') {
      toast({
        title: "Error",
        description: "Title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a todo.",
        variant: "destructive",
      });
      return;
    }

    const newTodoId = uuidv4();
    await addTodo({
      id: newTodoId,
      title,
      completed: false,
      user_id: user.id,
      category_id: selectedCategory || null,
      due_date: dueDate ? dueDate.toISOString() : null,
      priority: priority || null,
    });
    setTitle('');
    setOpen(false);
    setSelectedCategory('');
    setDueDate(null);
    setPriority('');
    toast({
      title: "Success",
      description: "Todo added successfully.",
    });
  };

  const handleUpdateTodo = async (id: string) => {
    if (editTitle.trim() === '') {
      toast({
        title: "Error",
        description: "Title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    await updateTodo(id, {
      title: editTitle,
      category_id: selectedCategory || null,
      due_date: dueDate ? dueDate.toISOString() : null,
      priority: priority || null,
    });
    setEditTodoId(null);
    setSelectedCategory('');
    setDueDate(null);
    setPriority('');
    toast({
      title: "Success",
      description: "Todo updated successfully.",
    });
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    toast({
      title: "Success",
      description: "Todo deleted successfully.",
    });
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed: !completed });
    toast({
      title: "Success",
      description: `Todo ${completed ? 'marked as incomplete' : 'completed'} successfully.`,
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const todoId = result.draggableId;
    const newIndex = result.destination.index;

    moveTodo(todoId, newIndex);
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add Task</SheetTitle>
                <SheetDescription>
                  Add a new task to your todo list.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                </div>
                <CategorySelect selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
                <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
                <PrioritySelect priority={priority} setPriority={setPriority} />
              </div>
              <Button type="submit" onClick={handleAddTodo}>Add Task</Button>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() => {
              setSortBy('dueDate');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          >
            Sort by Due Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />)}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSortBy('priority');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
          >
            Sort by Priority {sortBy === 'priority' && (sortOrder === 'asc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />)}
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {sortedTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow p-4 mb-2 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <GripVertical className="mr-2 h-5 w-5 cursor-grab" />
                          <button onClick={() => toggleComplete(todo.id, todo.completed)} className="mr-4">
                            {todo.completed ? <CheckCircle className="h-6 w-6 text-green-500" /> : <XCircle className="h-6 w-6 text-gray-400" />}
                          </button>
                          <span className={cn(
                            "text-lg",
                            todo.completed ? "line-through text-gray-500" : "text-gray-900"
                          )}>
                            {todo.title}
                          </span>
                        </div>
                        <div>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="sm" className="mr-2">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-md">
                              <SheetHeader>
                                <SheetTitle>Edit Task</SheetTitle>
                                <SheetDescription>
                                  Edit your task details.
                                </SheetDescription>
                              </SheetHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="editTitle" className="text-right">
                                    Title
                                  </Label>
                                  <Input id="editTitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="col-span-3" />
                                </div>
                                <CategorySelect selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
                                <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
                                <PrioritySelect priority={priority} setPriority={setPriority} />
                              </div>
                              <Button type="submit" onClick={() => handleUpdateTodo(todo.id)}>Update Task</Button>
                            </SheetContent>
                          </Sheet>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your task from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTodo(todo.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
}
