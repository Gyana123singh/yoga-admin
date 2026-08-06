import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium whitespace-nowrap transition-all rounded-xl cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-semibold',
    icon: 'p-2.5 text-sm',
  };

  const variantStyles = {
    primary: 'gradient-bg-primary text-white shadow-glow-primary hover:opacity-95 active:scale-[0.98]',
    cyan: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-glow-cyan hover:opacity-95 active:scale-[0.98]',
    secondary: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/50 dark:border-slate-700/50',
    glass: 'bg-white/10 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/40 hover:bg-white/20 dark:hover:bg-slate-800/60',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/20 hover:opacity-95',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  );
}
