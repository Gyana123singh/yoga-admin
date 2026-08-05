import React from 'react';
import clsx from 'clsx';

export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={clsx('flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300/50 dark:border-slate-700/60 shadow-inner w-full sm:w-fit overflow-x-auto touch-scrolling max-w-full', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 select-none',
              isActive
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md border border-slate-200/60 dark:border-slate-600/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={clsx(
                'px-1.5 py-0.5 text-[10px] font-bold rounded-full ml-1',
                isActive ? 'bg-indigo-500 text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
