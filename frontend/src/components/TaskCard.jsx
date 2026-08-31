import React from 'react';
import ReminderBadge from './ReminderBadge';
import { Calendar, User, Trash2, CheckCircle, Circle } from 'lucide-react';

const priorityColors = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-green-50 text-green-700 border-green-200',
};

export default function TaskCard({ task, onToggleDone, onDelete }) {
  const isDone = task.status === 'done';
  const priorityStr = task.priority ? String(task.priority).toLowerCase() : null;
  const colorClass = priorityStr && priorityColors[priorityStr] 
    ? priorityColors[priorityStr] 
    : 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className={`relative bg-white rounded-2xl border ${isDone ? 'border-slate-200 opacity-60' : 'border-slate-200 shadow-sm'} p-5 transition-all hover:shadow-md group flex flex-col h-full`}>
      <div className="flex items-start gap-3 mb-3">
        <button 
          onClick={() => onToggleDone(task)}
          className="mt-1 flex-shrink-0 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        >
          {isDone ? (
            <CheckCircle className="w-6 h-6 text-blue-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg text-slate-900 leading-tight mb-1 truncate ${isDone ? 'line-through text-slate-500' : ''}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <User className="w-3.5 h-3.5" />
            <span className="truncate">{task.owner}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          {task.priority ? (
            <span className={`text-xs font-medium px-2 py-1 rounded-md border ${colorClass} capitalize`}>
              {task.priority} Priority
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 rounded-md border bg-slate-50 text-slate-500 border-slate-200">
              No priority set
            </span>
          )}
          {task.dueDate && <ReminderBadge dueDate={task.dueDate} isDone={isDone} />}
        </div>
        
        <button 
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg hover:bg-red-50"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
