import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Card({
  children,
  className = '',
  hoverEffect = true,
  gradientBorder = false,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={clsx(
        'rounded-2xl transition-all duration-300 relative overflow-hidden',
        'glass-card-light dark:glass-card-dark shadow-sm hover:shadow-md dark:shadow-glass-dark',
        gradientBorder && 'gradient-border',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '', actions }) {
  return (
    <div className={clsx('flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 p-4 sm:p-5 border-b border-slate-200/60 dark:border-slate-800/60', className)}>
      <div>{children}</div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '', subtitle }) {
  return (
    <div>
      <h3 className={clsx('text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight', className)}>
        {children}
      </h3>
      {subtitle && (
        <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={clsx('p-3.5 sm:p-5', className)}>{children}</div>;
}
