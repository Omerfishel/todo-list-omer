import { TodoProvider } from "@/contexts/TodoContext";
import { TodoList } from "@/components/TodoList";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">To Do List</h1>
        <p className="text-gray-500 text-center mb-8 animate-fadeIn">
          Stay organized and productive
        </p>
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      </div>
    </div>;
};
export default Index;