import { Todo, updateTodo, deleteTodo } from '@/lib/api';
import { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await updateTodo(todo.id, { ...todo, completed: !todo.completed });
      onUpdate();
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsLoading(true);
    try {
      await deleteTodo(todo.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      await updateTodo(todo.id, { title, description });
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {editing ? (
        <div className="p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control mb-3"
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control mb-4"
            rows={3}
            placeholder="Task description"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setEditing(false)}
              className="btn px-4 py-2 border border-border"
              disabled={isLoading}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary px-4 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <FaCheck className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-item-header">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-muted' : ''}`}>
              {todo.title}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditing(true)}
                className="btn p-2 text-primary hover:bg-secondary rounded-md"
                disabled={isLoading}
                title="Edit task"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                className="btn p-2 text-danger hover:bg-secondary rounded-md"
                disabled={isLoading}
                title="Delete task"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          
          {description && (
            <div className="todo-item-body">
              <p className={`text-sm ${todo.completed ? 'text-muted' : ''}`}>
                {description}
              </p>
            </div>
          )}
          
          <div className="todo-item-footer">
            <span className="flex items-center text-xs">
              <FaClock className="mr-1" /> {formatDate(todo.created_at)}
            </span>
            
            <button
              onClick={handleToggleComplete}
              className={`badge ${todo.completed ? 'badge-success' : 'badge-default'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Updating...</span>
              ) : todo.completed ? (
                'Completed'
              ) : (
                'Mark Complete'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}