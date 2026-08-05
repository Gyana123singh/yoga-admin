import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Globe,
  Sparkles,
  Plus,
  Command,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Flower2
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import clsx from 'clsx';

export function Navbar({ isCollapsed, onMobileToggle }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { setIsSearchOpen, setIsNotificationsOpen, currentLanguage, setCurrentLanguage, showToast } = useApp();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const languages = ['English (US)', 'Spanish (ES)', 'German (DE)', 'French (FR)', 'Japanese (JP)'];

  return (
    <header className={clsx(
      'sticky top-0 z-30 transition-all duration-300 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5',
      'glass-header-light dark:glass-header-dark'
    )}>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Mobile Menu Button & Search Launcher */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={onMobileToggle}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Search Launcher Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Omnisearch Trigger (Desktop & Tablet) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/50 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-semibold transition-all group w-48 md:w-80 cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="flex-1 text-left truncate">Search poses, rules, users...</span>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-400">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Practice AI Generator Button */}
          <div className="relative">
            <Button
              variant="cyan"
              size="sm"
              icon={Sparkles}
              onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            >
              <span className="hidden lg:inline">Quick Action</span>
            </Button>

            {isQuickActionOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-1">
                <button
                  onClick={() => {
                    showToast('Opening AI Practice Generator...', 'success');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> AI Practice Generator
                </button>
                <button
                  onClick={() => {
                    showToast('Opening Pose Creator...', 'success');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Asana (Pose)
                </button>
                <button
                  onClick={() => {
                    showToast('Broadcasting Live Session...', 'success');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  <Flower2 className="w-4 h-4" /> Start Live Stream
                </button>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Globe className="w-4 h-4 text-indigo-500" />
              <span className="hidden xl:inline">{currentLanguage}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 p-1.5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-0.5">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLanguage(lang);
                      setIsLangDropdownOpen(false);
                      showToast(`Language switched to ${lang}`, 'success');
                    }}
                    className={clsx(
                      'w-full text-left px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors',
                      currentLanguage === lang
                        ? 'bg-indigo-500 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Notifications Drawer Launcher */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          </button>

          {/* Admin Avatar Menu */}
          <div className="relative pl-2 border-l border-slate-200/60 dark:border-slate-800">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Profile"
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-1">
                <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-400">sarah.jenkins@aura.io</p>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-indigo-400" /> Account Profile
                </button>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4 text-cyan-400" /> System Settings
                </button>
                <button
                  onClick={() => {
                    showToast('Logged out safely', 'warning');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
