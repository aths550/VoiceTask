import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function ReminderBadge({ dueDate, isDone }) {
  if (!dueDate || isDone) return null;

  const due = new Date(dueDate);
  const now = new Date();
  
  // Reset times for accurate day comparison
  due.setHours(0, 0, 0, 0);
  const today = new Date(now.setHours(0, 0, 0, 0));
  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  let status = 'default';
  let icon = <Calendar className="w-3.5 h-3.5" />;
  let text = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  if (diffDays < 0) {
    status = 'overdue';
    icon = <AlertTriangle className="w-3.5 h-3.5" />;
    text = 'Overdue';
  } else if (diffDays === 0) {
    status = 'dueSoon';
    icon = <Clock className="w-3.5 h-3.5" />;
    text = 'Today';
  } else if (diffDays === 1) {
    status = 'upcoming';
    text = 'Tomorrow';
  }

  const styles = {
    default: 'bg-slate-100 text-slate-600',
    upcoming: 'bg-blue-50 text-blue-700',
    dueSoon: 'bg-orange-50 text-orange-700',
    overdue: 'bg-red-100 text-red-800 font-bold',
  };

  return (
    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${styles[status]}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}
