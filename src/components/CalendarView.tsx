
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useTodo } from '@/contexts/TodoContext';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

export function CalendarView() {
  const { todos } = useTodo();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Group todos by date
  const todosByDate = React.useMemo(() => {
    return todos.reduce((acc, todo) => {
      if (todo.reminder) {
        const dateKey = format(new Date(todo.reminder), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(todo);
      }
      return acc;
    }, {} as Record<string, typeof todos>);
  }, [todos]);

  const selectedDateTodos = React.useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return todosByDate[dateKey] || [];
  }, [selectedDate, todosByDate]);

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
          selectedDateTodos.map(todo => (
            <Card key={todo.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                      {todo.title}
                    </h4>
                    {todo.reminder && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(new Date(todo.reminder), 'h:mm a')}
                      </div>
                    )}
                  </div>
                  {todo.urgency && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      todo.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                      todo.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                      todo.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {todo.urgency}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
