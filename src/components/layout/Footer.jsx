import React from 'react';
import { Flower2, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-8 sm:mt-12 py-5 sm:py-6 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Flower2 className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="truncate">AURA AI Platform v2.4.0 • Enterprise Edition</span>
        </div>

        <div className="flex flex-col xs:flex-row items-center gap-2.5 sm:gap-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" /> Systems Operational (99.98%)
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0 mx-0.5" /> for Mindful Wellness
          </span>
        </div>
      </div>
    </footer>
  );
}
