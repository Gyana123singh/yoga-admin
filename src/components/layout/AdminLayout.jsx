import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SearchModal } from '../common/SearchModal';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { UserProfileDrawer } from '../users/UserProfileDrawer';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Navigation Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Workspace Wrapper */}
      <div className={clsx(
        'flex-1 flex flex-col transition-all duration-300 min-w-0',
        isCollapsed ? 'md:ml-20' : 'md:ml-72'
      )}>
        {/* Header Navbar */}
        <Navbar
          isCollapsed={isCollapsed}
          onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Page Main Content */}
        <main className="flex-1 px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {children}
          <Footer />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <SearchModal />
      <NotificationDrawer />
      <UserProfileDrawer />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 shadow-2xl text-xs font-bold"
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {toastMessage.type === 'danger' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
            <span className="text-slate-800 dark:text-slate-100">{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
