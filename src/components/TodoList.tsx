import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Calendar, Clock, Search, Sparkles } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';
import type { TodoItem } from '@/contexts/TodoContext';
import { format } from 'date-fns';
import { useSwipeable } from 'react-swipeable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateImageForTask } from '@/utils/imageGenerator';

export function TodoList() {
  const { todos, categories, addTodo, addCategory } = useTodo();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#E5DEFF');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      const reminder = selectedDate && selectedTime
        ? new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`)
        : selectedDate;
      addTodo(newTodoTitle.trim(), selectedCategory, newTodoContent, reminder);
      setNewTodoTitle('');
      setNewTodoContent(''); // Clear the rich text editor content
      setSelectedDate(undefined);
      setSelectedTime('');
      
      // Force reset the editor by temporarily unmounting it
      const editor = document.querySelector('.ProseMirror');
      if (editor) {
        editor.innerHTML = '';
      }
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor('#E5DEFF');
      setIsNewCategoryDialogOpen(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' ? todo.completed : !todo.completed);
    const matchesCategory = !categoryFilter || 
      todo.categoryIds.includes(categoryFilter);
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.content || '').toLowerCase().includes(searchLower) ||
      (todo.description || '').toLowerCase().includes(searchLower);
    return matchesFilter && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10"
          />
        </div>
        <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
              />
              <Input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleAddTodo} className="space-y-4">
          <Input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Task title..."
            className="text-lg font-semibold"
          />
          
          <RichTextEditor
            content={newTodoContent}
            onChange={setNewTodoContent}
          />

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="p-3">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                  {selectedDate && (
                    <div className="mt-3 flex gap-2 items-center">
                      <Clock className="h-4 w-4" />
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button type="submit" className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
        {categories.map(category => (
          <Button
            key={category.id}
            variant={categoryFilter === category.id ? 'default' : 'outline'}
            onClick={() => setCategoryFilter(prev => prev === category.id ? '' : category.id)}
            className="flex items-center gap-2"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTodos.map((todo) => (
          <TodoItemComponent key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

function TodoItemComponent({ todo }: { todo: TodoItem }) {
  const { toggleTodo, deleteTodo, categories, updateTodoContent, updateTodoCategories } = useTodo();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [taskImage, setTaskImage] = useState<string | null>(null);

  useEffect(() => {
    generateImageForTask(todo.title).then(setTaskImage);
  }, [todo.title]);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = todo.categoryIds.includes(categoryId)
      ? todo.categoryIds.filter(id => id !== categoryId)
      : [...todo.categoryIds, categoryId];
    updateTodoCategories(todo.id, newCategories);
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      setIsDragging(true);
      setTranslateX(e.deltaX);
    },
    onSwipedLeft: () => {
      if (translateX < -100) {
        setDeleteDialogOpen(true);
      }
      setTranslateX(0);
      setIsDragging(false);
    },
    onSwipedRight: () => {
      if (translateX > 100) {
        toggleTodo(todo.id);
      }
      setTranslateX(0);
      setIsDragging(false);
    },
    onTouchEndOrOnMouseUp: () => {
      setTranslateX(0);
      setIsDragging(false);
    },
    trackMouse: true,
    delta: 10,
    touchEventOptions: { passive: false }
  });

  const handleDelete = () => {
    deleteTodo(todo.id);
    setDeleteDialogOpen(false);
  };

  const swipeBackground = translateX > 50 
    ? 'bg-green-100' 
    : translateX < -50 
      ? 'bg-red-100' 
      : '';

  const transform = isDragging 
    ? `translateX(${translateX}px)` 
    : 'translateX(0)';

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        {...swipeHandlers}
        className={`
          relative group bg-white rounded-lg shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out hover:shadow-xl
          transform hover:-translate-y-1
          min-h-[200px] flex flex-col
          ${todo.completed ? 'animate-scaleOut' : ''}
          ${swipeBackground}
        `}
        style={{
          transform,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTodo(todo.id)}
            className="text-red-500 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleTodo(todo.id)}
            className={`shrink-0 ${todo.completed ? 'text-green-500' : ''}`}
          >
            {todo.completed ? (
              <Sparkles className="h-4 w-4 animate-scaleIn" />
            ) : (
              <Check className="h-4 w-4 opacity-30" />
            )}
          </Button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          {taskImage && (
            <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
              <img 
                src={taskImage} 
                alt={todo.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h3 className={`text-lg font-medium mb-3 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </h3>

          <div className="flex flex-wrap gap-1 mb-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`
                  px-2 py-0.5 rounded-full text-xs transition-all
                  ${todo.categoryIds.includes(category.id) ? 'opacity-100' : 'opacity-50'}
                  hover:opacity-100
                `}
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="prose max-w-none flex-1">
            <RichTextEditor
              content={todo.content || ''}
              onChange={(content) => updateTodoContent(todo.id, content)}
            />
          </div>

          {todo.reminder && (
            <div className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(todo.reminder, 'PPp')}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
