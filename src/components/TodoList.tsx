import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Calendar, Clock, Search, Sparkles, Edit2, Save, LayoutGrid, List, MapPin } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';
import type { TodoItem } from '@/contexts/TodoContext';
import { format, addHours, setHours, setMinutes } from 'date-fns';
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
import '../styles/dust-effect.css';
import { useAuth } from '@/contexts/AuthContext';
import { X as XIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MapPicker } from './MapPicker';

type SortOption = 'modified' | 'reminder' | 'urgency' | 'created';
type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

interface TodoItemExtended extends TodoItem {
  urgency?: UrgencyLevel;
}

export function TodoList() {
  const { todos, categories, addTodo, addCategory, deleteCategory } = useTodo();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#E5DEFF');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editLocation, setEditLocation] = useState<{ address: string; lat: number; lng: number; } | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('modified');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      const reminder = selectedDate && selectedTime
        ? new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`)
        : selectedDate;
      addTodo(newTodoTitle.trim(), selectedCategory, newTodoContent, reminder, editLocation);
      setNewTodoTitle('');
      setNewTodoContent('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setEditLocation(null);
      
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

  const sortTodos = (todos: TodoItemExtended[]) => {
    return [...todos].sort((a, b) => {
      switch (sortBy) {
        case 'reminder':
          if (!a.reminder) return 1;
          if (!b.reminder) return -1;
          return new Date(b.reminder).getTime() - new Date(a.reminder).getTime();
        case 'urgency':
          const urgencyOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
          return (urgencyOrder[b.urgency || 'low'] || 0) - (urgencyOrder[a.urgency || 'low'] || 0);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'modified':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  };

  const filteredTodos = sortTodos(todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' ? todo.completed : !todo.completed);
    const matchesCategory = !categoryFilter || 
      (todo.category_ids || []).includes(categoryFilter);
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.content || '').toLowerCase().includes(searchLower) ||
      (todo.description || '').toLowerCase().includes(searchLower);
    return matchesFilter && matchesCategory && matchesSearch;
  }));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn overflow-x-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600">To Do List</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
          className="ml-4"
        >
          {viewMode === 'grid' ? (
            <List className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      </div>

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

            <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                  {selectedDate && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Select Time</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[9, 12, 15, 18].map(hour => {
                            const timeValue = format(setHours(selectedDate, hour), 'HH:mm');
                            return (
                              <Button
                                key={hour}
                                variant={selectedTime === timeValue ? 'default' : 'outline'}
                                className="text-xs py-1"
                                onClick={() => setSelectedTime(timeValue)}
                              >
                                {format(setHours(selectedDate, hour), 'ha')}
                              </Button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                            className="flex-1"
                          />
                          {selectedTime && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTime('')}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
              
              <MapPicker
                location={editLocation}
                onLocationChange={setEditLocation}
              />

              {selectedDate && (
                <span className="text-sm text-gray-600">
                  {format(selectedDate, 'MMM d')}
                  {selectedTime && `, ${format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}`}
                </span>
              )}
            </div>

            <Button type="submit" className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex justify-center gap-2 border-b pb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
            className="w-24"
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
            className="w-24"
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
            className="w-24"
        >
          Completed
        </Button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
            <div key={category.id} className="flex items-center gap-1">
              <div className="flex items-center">
          <Button
            variant={categoryFilter === category.id ? 'default' : 'outline'}
            onClick={() => setCategoryFilter(prev => prev === category.id ? '' : category.id)}
            className="flex items-center gap-2"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
                  <span className="hidden md:inline-block ml-2 hover:bg-red-100 hover:text-red-500 rounded-full p-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(category.id);
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(category.id)}
                  className="md:hidden h-8 w-8 p-0 hover:bg-red-100 hover:text-red-500"
                >
                  <XIcon className="h-4 w-4" />
          </Button>
              </div>
            </div>
        ))}
        </div>
      </div>

      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
      }>
        {filteredTodos.map((todo) => (
          <TodoItemComponent 
            key={todo.id} 
            todo={todo} 
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}

function TodoItemComponent({ todo, viewMode }: { todo: TodoItemExtended; viewMode: 'grid' | 'list' }) {
  const { toggleTodo, deleteTodo, categories, updateTodoContent, updateTodoCategories } = useTodo();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [taskImage, setTaskImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [dustEffect, setDustEffect] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editContent, setEditContent] = useState(todo.content || '');
  const [editReminder, setEditReminder] = useState<Date | undefined>(todo.reminder);
  const [editLocation, setEditLocation] = useState<{ address: string; lat: number; lng: number; } | null>(todo.location);
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const createDustParticles = () => {
    const container = document.getElementById(`todo-${todo.id}`);
    if (!container) return;

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      
      // Random position within the container
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;
      
      // Random direction for particle movement, but biased towards left
      const angle = Math.random() * Math.PI - Math.PI / 4; // -45 to 135 degrees
      const distance = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      container.appendChild(particle);
    }
  };

  const handleDeleteWithEffect = () => {
    setIsDeleting(true);
    setDustEffect(true);
    createDustParticles();
    
    setTimeout(() => {
      deleteTodo(todo.id);
    }, 800);
  };

  const handleComplete = () => {
    toggleTodo(todo.id);
    const element = document.getElementById(`todo-${todo.id}`);
    if (element) {
      element.classList.add('completion-effect');
      setTimeout(() => {
        element.classList.remove('completion-effect');
      }, 800);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        if (!taskImage && !imageError) {
          setImageError(false);
          const imageUrl = await generateImageForTask(todo.title, todo.id);
          if (isMounted && imageUrl) {
            setTaskImage(imageUrl);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading image:', error);
          setImageError(true);
          setTaskImage(null);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [todo.title, todo.id]);

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = todo.category_ids || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    updateTodoCategories(todo.id, newCategories);
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      if (isDeleting) return;
      setIsDragging(true);
      setTranslateX(e.deltaX);
    },
    onSwipedLeft: () => {
      if (isDeleting) return;
      if (translateX < -100) {
        handleDeleteWithEffect();
      }
      setTranslateX(0);
      setIsDragging(false);
    },
    onSwipedRight: () => {
      if (isDeleting) return;
      if (translateX > 100) {
        handleComplete();
      }
      setTranslateX(0);
      setIsDragging(false);
    },
    onTouchEndOrOnMouseUp: () => {
      if (isDeleting) return;
      setTranslateX(0);
      setIsDragging(false);
    },
    trackMouse: true,
    delta: 10,
    touchEventOptions: { passive: false }
  });

  const getSwipeBackground = (translateX: number) => {
    if (translateX > 0) {
      // Green gradient for right swipe
      const opacity = Math.min(Math.abs(translateX) / 200, 0.5);
      return `linear-gradient(to right, white, rgba(34, 197, 94, ${opacity}))`;
    } else if (translateX < 0) {
      // Red gradient for left swipe
      const opacity = Math.min(Math.abs(translateX) / 200, 0.5);
      return `linear-gradient(to left, white, rgba(239, 68, 68, ${opacity}))`;
    }
    return 'white';
  };

  const renderCategories = (showAll: boolean = false) => (
    <div className="flex flex-wrap gap-1">
      {categories
        .filter(cat => showAll || todo.category_ids?.includes(cat.id))
        .map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryToggle(category.id)}
            className={`
              px-2 py-0.5 rounded-full text-xs transition-all
              ${todo.category_ids?.includes(category.id) ? 'opacity-100' : 'opacity-50'}
              hover:opacity-100
            `}
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </button>
        ))}
    </div>
  );

  const handleSave = () => {
    updateTodoContent(
      todo.id,
      editContent,
      editReminder,
      editLocation,
      editTitle
    );
    updateTodoCategories(todo.id, todo.category_ids || []);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setEditTitle(todo.title);
    setEditContent(todo.content || '');
    setEditReminder(todo.reminder);
    setEditLocation(todo.location);
    setIsEditing(false);
  };

  const getUrgencyColor = (level: UrgencyLevel = 'low') => {
    switch (level) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderUrgencyBadge = () => (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(todo.urgency)}`}>
      {todo.urgency || 'low'}
    </div>
  );

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
            <AlertDialogAction onClick={handleDeleteWithEffect} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        id={`todo-${todo.id}`}
        {...(!isEditing ? swipeHandlers : {})}
        className={`
          dust-container
          relative group rounded-lg shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out hover:shadow-xl
          ${viewMode === 'grid' ? 'min-h-[200px] flex flex-col' : 'flex items-center p-4'}
          ${todo.completed ? 'animate-scaleOut' : ''}
          ${dustEffect ? 'dust-effect' : ''}
          ${isEditing ? 'ring-2 ring-blue-500' : ''}
        `}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          background: getSwipeBackground(translateX),
        }}
      >
        {viewMode === 'grid' ? (
          <>
            <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent z-10">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
          <Button
            variant="ghost"
            size="icon"
                      onClick={handleDiscard}
            className="text-red-500 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSave}
                      className="text-green-500 hover:bg-green-50"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
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
                  </>
                )}
              </div>
        </div>

            <div className="p-4 pt-12 flex-1 flex flex-col">
              {!imageError && taskImage && (
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100 relative">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200" />
                  <img 
                    src={taskImage} 
                    alt={todo.title}
                    className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
                    onError={() => setImageError(true)}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.opacity = '1';
                    }}
                    style={{ opacity: '0' }}
                    loading="lazy"
                  />
                </div>
              )}

              {isEditing ? (
                <>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-lg font-medium mb-3"
                  />
                  <div className="mb-3">
                    {renderCategories(true)}
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {editReminder ? format(editReminder, 'MMM d, h:mm a') : 'Add reminder'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3">
                          <CalendarComponent
                            mode="single"
                            selected={editReminder}
                            onSelect={(date) => {
                              if (date) {
                                const time = editReminder ? format(editReminder, 'HH:mm') : '09:00';
                                const newDate = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
                                setEditReminder(newDate);
                              } else {
                                setEditReminder(undefined);
                              }
                            }}
                            initialFocus
                          />
                          {editReminder && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">Select Time</span>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {[9, 12, 15, 18].map(hour => {
                                  const timeValue = format(setHours(editReminder, hour), 'HH:mm');
                                  const currentTime = editReminder ? format(editReminder, 'HH:mm') : '';
                                  return (
                                    <Button
                                      key={hour}
                                      variant={currentTime === timeValue ? 'default' : 'outline'}
                                      className="text-xs py-1"
                                      onClick={() => {
                                        const newDate = setHours(editReminder, hour);
                                        setEditReminder(newDate);
                                      }}
                                    >
                                      {format(setHours(new Date(), hour), 'ha')}
                                    </Button>
                                  );
                                })}
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="time"
                                  value={editReminder ? format(editReminder, 'HH:mm') : ''}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const [hours, minutes] = e.target.value.split(':').map(Number);
                                      const newDate = setHours(setMinutes(editReminder, minutes), hours);
                                      setEditReminder(newDate);
                                    }
                                  }}
                                  className="flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditReminder(undefined)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    {editReminder && (
                      <span className="text-sm text-gray-600">
                        {format(editReminder, 'MMM d, h:mm a')}
                      </span>
                    )}
                  </div>
                  <div className="prose max-w-none flex-1">
                    <RichTextEditor
                      content={editContent}
                      onChange={setEditContent}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h3 className={`text-lg font-medium mb-3 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.title}
                  </h3>
                  <div className="mb-3">
                    {renderCategories(false)}
                  </div>
                  <div className="prose max-w-none flex-1">
                    <div dangerouslySetInnerHTML={{ __html: todo.content || '' }} />
                  </div>
                </>
              )}

              {todo.reminder && !isEditing && (
                <div className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(todo.reminder, 'PPp')}
                </div>
              )}

              {todo.location && !isEditing && (
                <div className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {todo.location.address}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                {!isMobile && !isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-red-500 hover:bg-red-50 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg font-medium mb-3"
                    />
                    <div className="mb-3">
                      {renderCategories(true)}
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {editReminder ? format(editReminder, 'MMM d, h:mm a') : 'Add reminder'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3">
                            <CalendarComponent
                              mode="single"
                              selected={editReminder}
                              onSelect={(date) => {
                                if (date) {
                                  const time = editReminder ? format(editReminder, 'HH:mm') : '09:00';
                                  const newDate = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
                                  setEditReminder(newDate);
                                } else {
                                  setEditReminder(undefined);
                                }
                              }}
                              initialFocus
                            />
                            {editReminder && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">Select Time</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {[9, 12, 15, 18].map(hour => {
                                    const timeValue = format(setHours(editReminder, hour), 'HH:mm');
                                    const currentTime = editReminder ? format(editReminder, 'HH:mm') : '';
                                    return (
                                      <Button
                                        key={hour}
                                        variant={currentTime === timeValue ? 'default' : 'outline'}
                                        className="text-xs py-1"
                                        onClick={() => {
                                          const newDate = setHours(editReminder, hour);
                                          setEditReminder(newDate);
                                        }}
                                      >
                                        {format(setHours(new Date(), hour), 'ha')}
                                      </Button>
                                    );
                                  })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="time"
                                    value={editReminder ? format(editReminder, 'HH:mm') : ''}
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        const [hours, minutes] = e.target.value.split(':').map(Number);
                                        const newDate = setHours(setMinutes(editReminder, minutes), hours);
                                        setEditReminder(newDate);
                                      }
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditReminder(undefined)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
            </div>
          )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="prose max-w-none">
                      <RichTextEditor
                        content={editContent}
                        onChange={setEditContent}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </h3>
                    {todo.content && (
                      <div className="mt-1 text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: todo.content }}
                      />
                    )}
                    {todo.category_ids?.length > 0 && (
                      <div className="mt-2">
                        {renderCategories(false)}
          </div>
                    )}
                  </>
                )}
          </div>

              {todo.reminder && !isEditing && (
                <div className="text-xs text-gray-500 flex items-center gap-1 ml-auto mr-4">
              <Clock className="h-3 w-3" />
              {format(todo.reminder, 'PPp')}
            </div>
          )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDiscard}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSave}
                      className="text-green-500 hover:bg-green-50"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
        </div>
          </>
        )}
      </div>
    </>
  );
}
