import React from 'react';
import clsx from 'clsx';

export function Badge({ children, variant = 'indigo', className = '', size = 'md' }) {
  const variantStyles = {
    indigo: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    slate: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-all',
      variantStyles[variant] || variantStyles.indigo,
      sizeStyles[size],
      className
    )}>
      {children}
    </span>
  );
}
