import React from 'react';
import { Flower2, Plus } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No Items Found',
  description = 'There are no active records in this section yet.',
  actionLabel = 'Create New Record',
  onAction,
  icon: Icon = Flower2,
}) {
  return (
    <div className="p-12 text-center rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 my-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {onAction && (
        <div className="mt-6">
          <Button variant="primary" icon={Plus} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
