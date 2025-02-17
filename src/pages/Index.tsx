
import { TodoProvider } from "@/contexts/TodoContext";
import { TodoList } from "@/components/TodoList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-semibold text-center mb-2">Todo List</h1>
        <p className="text-gray-500 text-center mb-8">Stay organized and productive</p>
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      </div>
    </div>
  );
};

export default Index;
