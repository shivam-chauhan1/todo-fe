'use client';
import { useEffect, useState } from 'react';
import { getTodos, Todo } from '@/lib/api';
import TodoItem from '@/components/TodoItem';
import TodoForm from '@/components/TodoForm';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="todo-container">
        <div className="todo-header">
          <h1 className="text-4xl font-bold">Task Manager</h1>
          <p className="text-muted mt-2">Organize your tasks efficiently</p>
        </div>
       
        <TodoForm onAdd={fetchTodos} />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted">Loading your tasks...</p>
          </div>
        ) : error ? (
          <div className="bg-danger bg-opacity-10 border border-danger text-danger p-4 rounded-lg text-center">
            <p>{error}</p>
            <button 
              onClick={fetchTodos} 
              className="mt-2 underline hover:text-opacity-80"
            >
              Try again
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Tasks</h2>
              
              <div className="flex text-sm bg-secondary rounded-lg overflow-hidden">
                <button 
                  onClick={() => setFilter('all')} 
                  className={`px-3 py-1 ${filter === 'all' ? 'bg-primary text-white' : ''}`}
                >
                  All ({todos.length})
                </button>
                <button 
                  onClick={() => setFilter('active')} 
                  className={`px-3 py-1 ${filter === 'active' ? 'bg-primary text-white' : ''}`}
                >
                  Active ({activeCount})
                </button>
                <button 
                  onClick={() => setFilter('completed')} 
                  className={`px-3 py-1 ${filter === 'completed' ? 'bg-primary text-white' : ''}`}
                >
                  Completed ({completedCount})
                </button>
              </div>
            </div>
            
            {filteredTodos.length === 0 ? (
              <div className="text-center py-16 bg-secondary bg-opacity-50 rounded-lg">
                <svg className="w-16 h-16 mx-auto text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p className="mt-4 text-muted">
                  {filter === 'all' 
                    ? 'No tasks yet. Create your first task above!' 
                    : filter === 'active' 
                      ? 'No active tasks. Great job!' 
                      : 'No completed tasks yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}