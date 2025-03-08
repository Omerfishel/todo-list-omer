import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Calendar, Clock, Search, Sparkles, Edit2, Save, LayoutGrid, List, MapPin, LogOut } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';
import type { TodoItem } from '@/contexts/TodoContext';
import { format, setHours, setMinutes } from 'date-fns';
import { useSwipeable } from 'react-swipeable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { generateImageForTask } from '@/utils/imageGenerator';
import '../styles/dust-effect.css';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MapPicker } from './MapPicker';
import { CalendarView } from './CalendarView';

type SortOption = 'modified' | 'reminder' | 'urgency' | 'created';
type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

interface TodoItemProps {
  todo: TodoItem;
  viewMode: 'grid' | 'list';
}

type TodoItemExtended = TodoItem;

const PASTEL_COLORS = ['#F2FCE2',
// Soft Green
'#FEF7CD',
// Soft Yellow
'#FEC6A1',
// Soft Orange
'#E5DEFF',
// Soft Purple
'#FFDEE2',
// Soft Pink
'#FDE1D3',
// Soft Peach
'#D3E4FD',
// Soft Blue
'#F1F0FB' // Soft Gray
];

const getRandomPastelColor = () => {
  const randomIndex = Math.floor(Math.random() * PASTEL_COLORS.length);
  return PASTEL_COLORS[randomIndex];
};

const TodoItemComponent = ({
  todo,
  viewMode
}: TodoItemProps) => {
  const {
    toggleTodo,
    deleteTodo,
    categories,
    updateTodoContent,
    updateTodoCategories
  } = useTodo();
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
  const [editLocation, setEditLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(todo.location);
  const [editUrgency, setEditUrgency] = useState<UrgencyLevel>(todo.urgency || 'low');
  const [selectedTime, setSelectedTime] = useState(editReminder ? format(editReminder, 'HH:mm') : '');

  const {
    user
  } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const createDustParticles = () => {
    const container = document.getElementById(`todo-${todo.id}`);
    if (!container) return;
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;
      const angle = Math.random() * Math.PI - Math.PI / 4;
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
    const newCategories = currentCategories.includes(categoryId) ? currentCategories.filter(id => id !== categoryId) : [...currentCategories, categoryId];
    updateTodoCategories(todo.id, newCategories);
  };

  const swipeHandlers = useSwipeable({
    onSwiping: e => {
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
    touchEventOptions: {
      passive: false
    }
  });

  const getSwipeBackground = (translateX: number) => {
    if (translateX > 0) {
      const opacity = Math.min(Math.abs(translateX) / 200, 0.5);
      return `linear-gradient(to right, white, rgba(34, 197, 94, ${opacity}))`;
    } else if (translateX < 0) {
      const opacity = Math.min(Math.abs(translateX) / 200, 0.5);
      return `linear-gradient(to left, white, rgba(239, 68, 68, ${opacity}))`;
    }
    return 'white';
  };

  const renderCategories = (showAll: boolean = false) => <div className="flex flex-wrap gap-1">
      {categories.filter(cat => showAll || todo.category_ids?.includes(cat.id)).map(category => <button key={category.id} onClick={() => handleCategoryToggle(category.id)} className={`
              px-2 py-0.5 rounded-full text-xs transition-all
              ${todo.category_ids?.includes(category.id) ? 'opacity-100' : 'opacity-50'}
              hover:opacity-100
            `} style={{
      backgroundColor: category.color
    }}>
            {category.name}
          </button>)}
    </div>;

  const handleSave = () => {
    updateTodoContent(todo.id, editContent, editReminder, editLocation, editTitle, editUrgency);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setEditTitle(todo.title);
    setEditContent(todo.content || '');
    setEditReminder(todo.reminder);
    setEditLocation(todo.location);
    setEditUrgency(todo.urgency || 'low');
    setIsEditing(false);
  };

  const getUrgencyColor = (level: UrgencyLevel = 'low') => {
    switch (level) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderUrgencyBadge = () => <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(todo.urgency)}`}>
      {todo.urgency || 'low'}
    </div>;

  return <>
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

      <div id={`todo-${todo.id}`} {...!isEditing ? swipeHandlers : {}} className={`
          dust-container
          relative group rounded-lg shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out hover:shadow-xl
          ${viewMode === 'grid' ? 'min-h-[200px] flex flex-col' : 'flex items-center p-4'}
          ${todo.completed ? 'animate-scaleOut' : ''}
          ${dustEffect ? 'dust-effect' : ''}
          ${isEditing ? 'ring-2 ring-blue-500' : ''}
        `} style={{
      transform: `translateX(${translateX}px)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      background: getSwipeBackground(translateX)
    }}>
        {viewMode === 'grid' ? <>
            <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent z-10">
              {!isEditing && <Button variant="ghost" size="icon" onClick={() => setDeleteDialogOpen(true)} className="text-red-500 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </Button>}
              <div className="flex gap-2">
                {isEditing ? <>
                    <Button variant="ghost" size="icon" onClick={handleDiscard} className="text-red-500 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleSave} className="text-green-500 hover:bg-green-50">
                      <Save className="h-4 w-4" />
                    </Button>
                  </> : <>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-blue-500 hover:bg-blue-50">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleTodo(todo.id)} className={`shrink-0 ${todo.completed ? 'text-green-500' : ''}`}>
                      {todo.completed ? <Sparkles className="h-4 w-4 animate-scaleIn" /> : <Check className="h-4 w-4 opacity-30" />}
                    </Button>
                  </>}
              </div>
            </div>

            <div className="p-4 pt-12 flex-1 flex flex-col">
              {!imageError && taskImage && <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100 relative">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200" />
                  <img src={taskImage} alt={todo.title} className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300" onError={() => setImageError(true)} onLoad={e => {
              const img = e.target as HTMLImageElement;
              img.style.opacity = '1';
            }} style={{
              opacity: '0'
            }} loading="lazy" />
                </div>}

              {isEditing ? <>
                  <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-lg font-medium mb-3" />
                  <div className="mb-3">
                    {renderCategories(true)}
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" type="button">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3">
                          <CalendarComponent mode="single" selected={editReminder} onSelect={setEditReminder} initialFocus />
                          {editReminder && <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">Select Time</span>
                              </div>
                              <Input type="time" value={selectedTime} onChange={e => {
                        setSelectedTime(e.target.value);
                        if (e.target.value && editReminder) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newDate = setHours(setMinutes(editReminder, minutes), hours);
                          setEditReminder(newDate);
                        }
                      }} />
                            </div>}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <MapPicker location={editLocation} onLocationChange={setEditLocation} />
                    <Select value={editUrgency} onValueChange={(value: UrgencyLevel) => setEditUrgency(value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Set urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low" className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Low
                        </SelectItem>
                        <SelectItem value="medium" className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500" />
                          Medium
                        </SelectItem>
                        <SelectItem value="high" className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          High
                        </SelectItem>
                        <SelectItem value="urgent" className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Urgent
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {editLocation && <div className="text-sm text-gray-500 flex-1">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {editLocation.address}
                      </div>}
                  </div>
                  <div className="prose max-w-none flex-1">
                    <RichTextEditor content={editContent} onChange={setEditContent} />
                  </div>
                </> : <>
                  <h3 className={`text-lg font-medium mb-3 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.title}
                  </h3>
                  <div className="mb-3 flex items-center gap-2">
                    {renderCategories(false)}
                    {renderUrgencyBadge()}
                  </div>
                  <div className="prose max-w-none flex-1">
                    <div dangerouslySetInnerHTML={{
                __html: todo.content || ''
              }} />
                  </div>
                </>}

              {todo.reminder && !isEditing && <div className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(todo.reminder, 'PPp')}
                </div>}

              {todo.location && !isEditing && <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {todo.location.address}
                </div>}
            </div>
          </> : <div className="flex items-center gap-4 w-full">
            {!isEditing && <Button variant="ghost" size="icon" onClick={() => setDeleteDialogOpen(true)} className="text-red-500 hover:bg-red-50 mr-2">
                <X className="h-4 w-4" />
              </Button>}

            {isEditing ? <div className="flex-1 space-y-4">
                <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-lg font-medium" />

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {editReminder ? format(editReminder, 'MMM d, h:mm a') : 'Add reminder'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3">
                          <CalendarComponent mode="single" selected={editReminder} onSelect={setEditReminder} initialFocus />
                          {editReminder && <div className="mt-3">
                              <Input type="time" value={selectedTime} onChange={e => {
                        setSelectedTime(e.target.value);
                        if (e.target.value && editReminder) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newDate = setHours(setMinutes(editReminder, minutes), hours);
                          setEditReminder(newDate);
                        }
                      }} />
                            </div>}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <MapPicker location={editLocation} onLocationChange={setEditLocation} />
                  </div>
                  {renderCategories(true)}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Select value={editUrgency} onValueChange={(value: UrgencyLevel) => setEditUrgency(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Set urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Low
                      </SelectItem>
                      <SelectItem value="medium" className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        Medium
                      </SelectItem>
                      <SelectItem value="high" className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        High
                      </SelectItem>
                      <SelectItem value="urgent" className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Urgent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <RichTextEditor content={editContent} onChange={setEditContent} />

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleDiscard} className="text-red-500">
                    Cancel
                  </Button>
                  <Button variant="ghost" onClick={handleSave} className="text-green-500">
                    Save Changes
                  </Button>
                </div>
              </div> : <>
                <Button variant="ghost" size="icon" onClick={() => toggleTodo(todo.id)} className={todo.completed ? 'text-green-500' : ''}>
                  {todo.completed ? <Sparkles className="h-4 w-4 animate-scaleIn" /> : <Check className="h-4 w-4 opacity-30" />}
                </Button>

                <div className="flex-1">
                  <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.title}
                  </h3>
                  <div className="mb-3 flex items-center gap-2">
                    {renderCategories(false)}
                    {renderUrgencyBadge()}
                  </div>
                  {todo.content && <div className="prose max-w-none mt-2 text-sm text-gray-600">
                      <div dangerouslySetInnerHTML={{
                __html: todo.content
              }} />
                    </div>}
                </div>

                <div className="flex items-center gap-4">
                  {todo.reminder && <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(todo.reminder, 'PPp')}
                    </div>}

                  {todo.location && <div className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {todo.location.address}
                    </div>}

                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-blue-500 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </>}
          </div>}
      </div>
    </>;
};

export const TodoList = () => {
  const {
    todos,
    categories,
    addTodo,
    addCategory,
    deleteCategory
  } = useTodo();
  const {
    signOut
  } = useAuth();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>('low');
  const [filter, setFilter] = useState('active');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(getRandomPastelColor());
  const [view, setView] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [editLocation, setEditLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('modified');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleOpenCategoryDialog = () => {
    setNewCategoryColor(getRandomPastelColor());
    setIsNewCategoryDialogOpen(true);
  };

  const renderCategoryTags = () => <div className="flex flex-wrap gap-2 mb-4">
      <Button variant={categoryFilter === '' ? 'default' : 'outline'} onClick={() => setCategoryFilter('')} size="sm">
        All
      </Button>
      {categories.map(category => <div key={category.id} className="flex items-center gap-1">
          <Button variant={categoryFilter === category.id ? 'default' : 'outline'} onClick={() => setCategoryFilter(category.id)} size="sm" className="flex items-center gap-2" style={{
        backgroundColor: categoryFilter === category.id ? category.color : undefined,
        borderColor: 'white',
        color: categoryFilter === category.id ? 'black' : undefined
      }}>
            <span className="w-2 h-2 rounded-full" style={{
          backgroundColor: category.color
        }} />
            {category.name}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-red-100 flex-shrink-0" onClick={e => {
        e.stopPropagation();
        deleteCategory(category.id);
      }}>
            <X className="h-3 w-3 text-red-500" />
          </Button>
        </div>)}
    </div>;

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newTodoTitle.trim()) {
        const reminder = selectedDate && selectedTime ? new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`) : selectedDate;
        await addTodo(newTodoTitle.trim(), selectedCategory, newTodoContent, reminder, editLocation, selectedUrgency);
        setNewTodoTitle('');
        setNewTodoContent('');
        setSelectedCategory('');
        setSelectedDate(undefined);
        setSelectedTime('');
        setEditLocation(null);
        setSelectedUrgency('low');
        const editor = document.querySelector('.ProseMirror');
        if (editor) {
          editor.innerHTML = '';
        }
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (newCategoryName.trim()) {
        const color = newCategoryColor === '#E5DEFF' ? getRandomPastelColor() : newCategoryColor;
        await addCategory(newCategoryName.trim(), color);
        setNewCategoryName('');
        setNewCategoryColor('#E5DEFF');
        setIsNewCategoryDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const sortTodos = (todos: TodoItemExtended[]) => {
    return [...todos].sort((a, b) => {
      switch (sortBy) {
        case 'reminder':
          if (!a.reminder) return 1;
          if (!b.reminder) return -1;
          return new Date(a.reminder).getTime() - new Date(b.reminder).getTime();
        case 'urgency':
          const urgencyOrder = {
            urgent: 3,
            high: 2,
            medium: 1,
            low: 0
          };
          return (urgencyOrder[b.urgency || 'low'] || 0) - (urgencyOrder[a.urgency || 'low'] || 0);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'modified':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || (filter === 'completed' ? todo.completed : !todo.completed);
    const matchesCategory = !categoryFilter || (todo.category_ids || []).includes(categoryFilter);
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || todo.title.toLowerCase().includes(searchLower) || (todo.content || '').toLowerCase().includes(searchLower) || (todo.description || '').toLowerCase().includes(searchLower);
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const sortedAndFilteredTodos = sortTodos(filteredTodos);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderSortSelector = () => (
    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="modified">Last Modified</SelectItem>
        <SelectItem value="created">Creation Date</SelectItem>
        <SelectItem value="reminder">Reminder Date</SelectItem>
        <SelectItem value="urgency">Urgency</SelectItem>
      </SelectContent>
    </Select>
  );

  const getViewIcon = () => {
    switch (view) {
      case 'grid':
        return <LayoutGrid className="h-4 w-4" />;
      case 'list':
        return <List className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
    }
  };

  return <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn overflow-x-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600">To Do List</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button variant="outline" size="icon" onClick={() => setView(prev => prev === 'calendar' ? 'grid' : prev === 'grid' ? 'list' : 'calendar')} className="ml-4">
              {getViewIcon()}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tasks..." className="pl-10" />
        </div>
        
        {renderSortSelector()}

        <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={handleOpenCategoryDialog}>Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category name" />
              <Input type="color" value={newCategoryColor} onChange={e => setNewCategoryColor(e.target.value)} />
            </div>
            <DialogFooter>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleAddTodo} className="space-y-4">
          <Input type="text" value={newTodoTitle} onChange={e => setNewTodoTitle(e.target.value)} placeholder="Task title..." className="text-lg font-semibold" />
          
          <RichTextEditor content={newTodoContent} onChange={setNewTodoContent} />

          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => <SelectItem key={category.id} value={category.id} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{
                  backgroundColor: category.color
                }} />
                    {category.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedUrgency} onValueChange={(value: UrgencyLevel) => setSelectedUrgency(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Set urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Low
                </SelectItem>
                <SelectItem value="medium" className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  Medium
                </SelectItem>
                <SelectItem value="high" className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  High
                </SelectItem>
                <SelectItem value="urgent" className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Urgent
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" type="button">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  {selectedDate && <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Select Time</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[9, 12, 15, 18].map(hour => {
                        const timeValue = format(setHours(selectedDate, hour), 'HH:mm');
                        return <Button key={hour} type="button" variant={selectedTime === timeValue ? 'default' : 'outline'} className="text-xs py-1" onClick={() => setSelectedTime(timeValue)}>
                                {format(setHours(selectedDate, hour), 'ha')}
                              </Button>;
                      })}
                        </div>
                        <div className="flex items-center gap-2">
                      <Input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="flex-1" />
                          {selectedTime && <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedTime('')} className="text-red-500 hover:text-red-600">
                              <X className="h-4 w-4" />
                            </Button>}
                        </div>
                    </div>}
                </div>
              </PopoverContent>
            </Popover>
              
              <MapPicker location={editLocation} onLocationChange={setEditLocation} />

              <div className="flex gap-2 items-center">
                {selectedDate && <span className="text-sm text-gray-600">
                    {format(selectedDate, 'MMM d')}
                    {selectedTime && `, ${format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}`}
                  </span>}
                {editLocation && <span className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {editLocation.address}
                  </span>}
              </div>
            </div>

            <Button type="submit" className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="w-24">
            {/* Empty space for balance */}
          </div>
          
          <div className="flex gap-2 justify-center flex-1">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="w-24">
              All
            </Button>
            <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')} className="w-24">
              Active
            </Button>
            <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')} className="w-24">
              Completed
            </Button>
          </div>
          
          <div className="w-24 flex justify-end">
            {!isMobile && (
              <Button variant="outline" size="icon" onClick={() => setView(prev => prev === 'calendar' ? 'grid' : prev === 'grid' ? 'list' : 'calendar')}>
                {getViewIcon()}
              </Button>
            )}
          </div>
        </div>

        {renderCategoryTags()}

        {view === 'calendar' ? <CalendarView todos={sortedAndFilteredTodos} sortBy={sortBy} /> : <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedAndFilteredTodos.map(todo => <TodoItemComponent key={todo.id} todo={todo} viewMode={view} />)}
            {sortedAndFilteredTodos.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">
                No tasks found
          </div>}
            </div>}
        </div>
      </div>;
};

