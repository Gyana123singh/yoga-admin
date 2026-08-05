import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

export function StatCard({
  title,
  value,
  change,
  changeType = 'increase', // 'increase' | 'decrease' | 'neutral'
  subtitle,
  icon: Icon,
  gradient = 'indigo',
  sparklineData,
}) {
  const gradients = {
    indigo: 'from-indigo-500/20 to-purple-500/5 text-indigo-500 border-indigo-500/30',
    cyan: 'from-cyan-500/20 to-teal-500/5 text-cyan-500 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-green-500/5 text-emerald-500 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-500 border-amber-500/30',
    rose: 'from-rose-500/20 to-red-500/5 text-rose-500 border-rose-500/30',
  };

  const iconGradients = {
    indigo: 'gradient-bg-primary text-white shadow-glow-primary',
    cyan: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-glow-cyan',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-glow-emerald',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md',
    rose: 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md',
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative p-3.5 xs:p-4 sm:p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-md overflow-hidden group"
    >
      {/* Top Subtle Glow */}
      <div className={clsx('absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity', gradients[gradient])} />

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>
          <h3 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight truncate">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={clsx('p-2.5 sm:p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110', iconGradients[gradient])}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      {/* Footer Trend & Subtitle */}
      <div className="mt-3 sm:mt-4 flex items-center justify-between flex-wrap gap-1.5 relative z-10 pt-2.5 sm:pt-3 border-t border-slate-200/40 dark:border-slate-800/60">
        {change !== undefined && (
          <div className={clsx(
            'inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full border shrink-0',
            changeType === 'increase' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
            changeType === 'decrease' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
            changeType === 'neutral' && 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
          )}>
            {changeType === 'increase' && <TrendingUp className="w-3 h-3" />}
            {changeType === 'decrease' && <TrendingDown className="w-3 h-3" />}
            {changeType === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{change}%</span>
          </div>
        )}

        {subtitle && (
          <span className="text-[10px] xs:text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[130px] xs:max-w-none">
            {subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
}
