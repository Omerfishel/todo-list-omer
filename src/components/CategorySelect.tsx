
import React from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const { categories } = useTodo();

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="category" className="text-right">
        Category
      </Label>
      <Select 
        value={selectedCategory} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger id="category" className="col-span-3">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
