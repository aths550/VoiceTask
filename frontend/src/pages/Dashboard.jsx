import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import { getTasks, updateTask, deleteTask } from '../services/api';
import { LayoutDashboard, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks. Ensure backend and database are running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleDone = async (task) => {
    try {
      const newStatus = task.status === 'done' ? 'pending' : 'done';
      const updated = await updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error(err);
      alert('Failed to update task.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task.');
    }
  };

  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Your Tasks</h1>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          isLoading={isLoading} 
          onToggleDone={handleToggleDone} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}
