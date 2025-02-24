import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useTodo } from '@/contexts/TodoContext';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, Check, X, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSwipeable } from 'react-swipeable';
import { RichTextEditor } from './RichTextEditor';
import type { TodoItem } from '@/contexts/TodoContext';
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
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import type { UrgencyLevel } from '@/contexts/TodoContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPicker } from './MapPicker';

interface TodoItemExtended extends TodoItem {
  description?: string;
}

interface CalendarViewProps {
  sortBy: 'modified' | 'reminder' | 'urgency' | 'created';
  todos: TodoItemExtended[];
}

export function CalendarView({ sortBy, todos }: CalendarViewProps) {
  const { toggleTodo, deleteTodo, updateTodoContent, categories } = useTodo();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [editingTodoId, setEditingTodoId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editContent, setEditContent] = React.useState('');
  const [editReminder, setEditReminder] = React.useState<Date | undefined>();
  const [editLocation, setEditLocation] = React.useState<{ address: string; lat: number; lng: number; } | null>(null);
  const [editUrgency, setEditUrgency] = React.useState<UrgencyLevel>('low');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [todoToDelete, setTodoToDelete] = React.useState<string | null>(null);

  const getUrgencyColor = (level: UrgencyLevel = 'low') => {
    switch (level) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderUrgencyBadge = (urgency: UrgencyLevel) => (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(urgency)}`}>
      {urgency}
    </div>
  );

  const todosByDate = React.useMemo(() => {
    const grouped = todos.reduce((acc, todo) => {
      if (todo.reminder) {
        const dateKey = format(new Date(todo.reminder), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(todo);
      }
      return acc;
    }, {} as Record<string, typeof todos>);

    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        switch (sortBy) {
          case 'reminder':
            return new Date(a.reminder!).getTime() - new Date(b.reminder!).getTime();
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
    });

    return grouped;
  }, [todos, sortBy]);

  const selectedDateTodos = React.useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return todosByDate[dateKey] || [];
  }, [selectedDate, todosByDate]);

  const handleSave = async (todoId: string) => {
    await updateTodoContent(
      todoId,
      editContent,
      editReminder,
      editLocation,
      editTitle,
      editUrgency
    );
    setEditingTodoId(null);
  };

  const handleDelete = async (todoId: string) => {
    await deleteTodo(todoId);
    setTodoToDelete(null);
    setDeleteDialogOpen(false);
  };

  const TodoItem = ({ todo }: { todo: TodoItemExtended }) => {
    const swipeHandlers = useSwipeable({
      onSwipedLeft: () => setTodoToDelete(todo.id),
      onSwipedRight: () => toggleTodo(todo.id),
      delta: 50,
    });

    const isEditing = editingTodoId === todo.id;

    if (isEditing) {
      return (
        <Card className="p-4 space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-lg font-medium"
          />
          <RichTextEditor
            content={editContent}
            onChange={setEditContent}
          />
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              type="datetime-local"
              value={editReminder ? format(editReminder, "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={(e) => setEditReminder(e.target.value ? new Date(e.target.value) : undefined)}
            />
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
            <MapPicker
              location={editLocation}
              onLocationChange={setEditLocation}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setEditingTodoId(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleSave(todo.id)}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card
        {...swipeHandlers}
        className="p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                {todo.title}
              </h4>
              {renderUrgencyBadge(todo.urgency || 'low')}
            </div>
            {todo.reminder && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {format(new Date(todo.reminder), 'h:mm a')}
              </div>
            )}
            {todo.location && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {todo.location.address}
              </div>
            )}
            {todo.content && (
              <div 
                className="mt-2 text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: todo.content }}
              />
            )}
            {todo.category_ids?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {todo.category_ids.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  if (!category) return null;
                  return (
                    <span
                      key={category.id}
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingTodoId(todo.id);
                setEditTitle(todo.title);
                setEditContent(todo.content || '');
                setEditReminder(todo.reminder);
                setEditLocation(todo.location);
                setEditUrgency(todo.urgency || 'low');
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTodo(todo.id)}
            >
              <Check 
                className={`h-4 w-4 ${todo.completed ? 'text-green-500' : ''}`}
              />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px,1fr] gap-6">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow"
          modifiers={{
            booked: (date) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              return !!todosByDate[dateKey]?.length;
            },
          }}
          modifiersStyles={{
            booked: {
              fontWeight: 'bold',
              backgroundColor: 'rgb(236, 253, 245)',
            },
          }}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Tasks for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
        </h3>
        {selectedDateTodos.length === 0 ? (
          <p className="text-gray-500">No tasks scheduled for this date</p>
        ) : (
          <div className="space-y-4">
            {selectedDateTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>

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
            <AlertDialogAction 
              onClick={() => todoToDelete && handleDelete(todoToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
