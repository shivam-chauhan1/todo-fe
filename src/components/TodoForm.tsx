import { createTodo } from '@/lib/api';
import { useState } from 'react';

interface TodoFormProps {
  onAdd: () => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createTodo(title, description);
      setTitle('');
      setDescription('');
      onAdd();
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-card-foreground">Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2 text-card-foreground">
            Task Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="What needs to be done?"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-2 text-card-foreground">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows={3}
            placeholder="Add details about this task..."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary w-full py-3 font-medium text-white ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </form>
    </div>
  );
}