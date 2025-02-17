
import React, { useState } from 'react';
import { Plus, X, Check, Calendar } from 'lucide-react';
import { useTodo, TodoItem } from '@/contexts/TodoContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export function TodoList() {
  const { todos, categories, addTodo, deleteTodo, toggleTodo } = useTodo();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filter, setFilter] = useState('all');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodo(newTodoTitle.trim(), selectedCategory, selectedDate);
      setNewTodoTitle('');
      setSelectedDate(undefined);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fadeIn">
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <Input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
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
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button type="submit">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex gap-2 justify-center">
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
      </div>

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

function TodoItem({ todo }: { todo: TodoItem }) {
  const { toggleTodo, deleteTodo, categories } = useTodo();
  const category = categories.find(c => c.id === todo.categoryId);

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm border transition-all animate-slideIn
        ${todo.completed ? 'opacity-50' : ''}`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleTodo(todo.id)}
        className={`shrink-0 ${todo.completed ? 'text-green-500' : ''}`}
      >
        <Check className={`h-4 w-4 ${todo.completed ? 'opacity-100' : 'opacity-30'}`} />
      </Button>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}
          >
            {todo.title}
          </span>
          {category && (
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}
        </div>
        {todo.reminder && (
          <div className="text-xs text-gray-500 mt-1">
            Reminder: {format(todo.reminder, 'PPp')}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTodo(todo.id)}
        className="shrink-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
