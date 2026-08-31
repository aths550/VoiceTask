import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, isLoading, onToggleDone, onDelete }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"></div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
        <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks yet</h3>
        <p className="text-slate-500">Go back home and extract tasks from your messages.</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          Pending Tasks
          <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full">{pendingTasks.length}</span>
        </h2>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-slate-500 italic">All caught up!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggleDone={onToggleDone} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>

      {doneTasks.length > 0 && (
        <div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Completed
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full">{doneTasks.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doneTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggleDone={onToggleDone} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
