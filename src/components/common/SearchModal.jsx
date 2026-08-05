import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Sparkles, Command } from 'lucide-react';
import { NAVIGATION_SECTIONS } from '../../constants/navigation';
import { useApp } from '../../context/AppContext';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const allItems = NAVIGATION_SECTIONS.flatMap(section => section.items);

  const filteredItems = query.trim()
    ? allItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8); // Top quick suggestions

  const handleSelect = (path) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Omnisearch Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-500 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a feature, pose, breathing routine, or setting... (Press Esc to exit)"
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
            />
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/50 text-[10px] font-bold text-slate-500">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>

          {/* Search Suggestions list */}
          <div className="p-3 max-h-[60vh] overflow-y-auto space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {query ? 'Search Results' : 'Quick Navigation'}
            </div>

            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-400">Navigate to {item.path}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No matching tools or pages found for "{query}".
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Omni-Search active
            </span>
            <span>Use ↑ ↓ to navigate</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
