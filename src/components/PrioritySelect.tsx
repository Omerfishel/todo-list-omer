
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrioritySelectProps {
  priority: string;
  setPriority: (value: string) => void;
}

export const PrioritySelect: React.FC<PrioritySelectProps> = ({ priority, setPriority }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="priority" className="text-right">
        Priority
      </Label>
      <Select 
        value={priority || "none"} 
        onValueChange={setPriority}
      >
        <SelectTrigger id="priority" className="col-span-3">
          <SelectValue placeholder="Select a priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="low">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-green-500" />
              Low
            </div>
          </SelectItem>
          <SelectItem value="medium">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500" />
              Medium
            </div>
          </SelectItem>
          <SelectItem value="high">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-red-500" />
              High
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
