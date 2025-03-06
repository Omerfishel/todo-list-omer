
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DatePickerProps {
  dueDate: Date | null;
  setDueDate: (date: Date | null) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ dueDate, setDueDate }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="dueDate" className="text-right">
        Due Date
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="dueDate"
            variant="outline"
            className={cn(
              "col-span-3 justify-start text-left font-normal",
              !dueDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dueDate || undefined}
            onSelect={setDueDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
