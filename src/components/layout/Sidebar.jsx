import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION_SECTIONS } from '../../constants/navigation';
import { Flower2, ChevronLeft, ChevronRight, Sparkles, LogOut, Shield } from 'lucide-react';
import clsx from 'clsx';

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const location = useLocation();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-5 px-3 select-none">
      {/* Brand Header */}
      <div>
        <div className={clsx('flex items-center px-3 mb-6', isCollapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-bg-primary flex items-center justify-center text-white shadow-glow-primary shrink-0">
              <Flower2 className="w-6 h-6 animate-pulse-slow" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white flex items-center gap-1">
                  AURA <span className="gradient-text-primary text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">AI</span>
                </span>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  Yoga & Health SaaS
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section Scroll Area */}
        <div className="space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
          {NAVIGATION_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                  {section.title}
                </h4>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => clsx(
                        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group',
                        isActive
                          ? 'gradient-bg-primary text-white shadow-glow-primary'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white',
                        isCollapsed && 'justify-center px-0'
                      )}
                    >
                      <Icon className={clsx('w-4 h-4 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500')} />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={clsx(
                              'px-2 py-0.5 text-[9px] font-extrabold rounded-full border shadow-2xs',
                              item.badgeColor || (isActive ? 'bg-white/20 text-white border-white/30' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20')
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer User Info */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
        <div className={clsx('flex items-center gap-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50', isCollapsed && 'justify-center p-1.5')}>
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Admin"
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Dr. Sarah Jenkins</p>
              <p className="text-[10px] font-medium text-slate-400 truncate flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-400" /> Super Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={clsx(
        'hidden md:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-300',
        'glass-card-light dark:glass-card-dark border-r border-slate-200/80 dark:border-slate-800/80',
        isCollapsed ? 'w-20' : 'w-72'
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-80 max-w-[85vw] h-full glass-card-light dark:glass-card-dark border-r border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
