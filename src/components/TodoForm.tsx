
import React, { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPicker } from './MapPicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TodoFormProps {
  onSubmit?: () => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [reminder, setReminder] = useState<Date>();
  const [location, setLocation] = useState<{ address: string; lat: number; lng: number; } | null>(null);
  const { addTodo, categories } = useTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await addTodo(
        title.trim(),
        selectedCategory,
        '',  // content
        reminder,
        location || undefined
      );
      setTitle('');
      setSelectedCategory('');
      setReminder(undefined);
      setLocation(null);
      onSubmit?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="datetime-local"
          onChange={(e) => setReminder(e.target.value ? new Date(e.target.value) : undefined)}
          className="w-auto"
        />
        <MapPicker location={location} onLocationChange={setLocation} />
        {location && (
          <div className="flex-1 text-sm text-gray-500">
            {location.address}
          </div>
        )}
      </div>
      <Button type="submit" className="w-full">Add Task</Button>
    </form>
  );
}
