
import React, { useState } from 'react';
import { Plus, X, Check, Calendar, Clock } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';
import type { TodoItem } from '@/contexts/TodoContext';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function TodoList() {
  const { todos, categories, addTodo } = useTodo();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      const reminder = selectedDate && selectedTime
        ? new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`)
        : selectedDate;
      addTodo(newTodoTitle.trim(), selectedCategory, reminder);
      setNewTodoTitle('');
      setSelectedDate(undefined);
      setSelectedTime('');
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
          <TodoItemComponent key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

function TodoItemComponent({ todo }: { todo: TodoItem }) {
  const { toggleTodo, deleteTodo, categories, addSubItem, deleteSubItem, toggleSubItem, updateTodoDescription } = useTodo();
  const category = categories.find(c => c.id === todo.categoryId);
  const [newSubItem, setNewSubItem] = useState('');
  const [description, setDescription] = useState(todo.description || '');

  const handleAddSubItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubItem.trim()) {
      addSubItem(todo.id, newSubItem.trim());
      setNewSubItem('');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateTodoDescription(todo.id, newDescription);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border rounded-lg bg-white">
        <div className="flex items-center gap-4 p-4">
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
              <AccordionTrigger className="hover:no-underline">
                <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.title}
                </span>
              </AccordionTrigger>
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

        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Add a description..."
              className="w-full p-2 text-sm border rounded-md"
              rows={3}
            />

            <div className="space-y-2">
              <form onSubmit={handleAddSubItem} className="flex gap-2">
                <Input
                  type="text"
                  value={newSubItem}
                  onChange={(e) => setNewSubItem(e.target.value)}
                  placeholder="Add a sub-item..."
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>

              <div className="space-y-2">
                {todo.subItems.map((subItem) => (
                  <div
                    key={subItem.id}
                    className="flex items-center gap-2 pl-4 text-sm"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSubItem(todo.id, subItem.id)}
                      className={`shrink-0 h-6 w-6 ${subItem.completed ? 'text-green-500' : ''}`}
                    >
                      <Check className={`h-3 w-3 ${subItem.completed ? 'opacity-100' : 'opacity-30'}`} />
                    </Button>
                    <span className={subItem.completed ? 'line-through text-gray-400' : ''}>
                      {subItem.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSubItem(todo.id, subItem.id)}
                      className="shrink-0 h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
