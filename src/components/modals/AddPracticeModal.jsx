import React, { useState } from 'react';
import { X, Sun, Flower2, Brain, Moon, Clock, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export function AddPracticeModal({ isOpen, onClose, selectedDate, onRoutineAdded }) {
  const { showToast } = useApp();

  const [category, setCategory] = useState('Breathing');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('07:00 AM');
  const [duration, setDuration] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { label: 'Breathing', icon: '☀️', name: 'Breathing' },
    { label: 'Yoga', icon: '🧘', name: 'Yoga' },
    { label: 'Meditation', icon: '🧠', name: 'Meditation' },
    { label: 'Relaxation', icon: '🌙', name: 'Relaxation' },
    { label: 'Sleep', icon: '😴', name: 'Sleep' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dateStr = selectedDate || new Date().toISOString().split('T')[0];
    const routineTitle = title.trim() || `${category} Session`;

    const payload = {
      title: routineTitle,
      category,
      scheduledDate: dateStr,
      scheduledTime: time,
      durationMinutes: parseInt(duration) || 10
    };

    const created = await api.addDailySchedule(payload);
    if (created) {
      showToast(`Routine "${routineTitle}" added to calendar!`, 'success');
      if (onRoutineAdded) onRoutineAdded(created);
      onClose();
    } else {
      showToast('Failed to add routine', 'error');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-stone-200/80 dark:border-stone-800 space-y-5 font-serif select-none">
        
        {/* Top Handle / Close */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto sm:hidden mb-2" />
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-amber-50">
            + Add Practice Routine
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CHOOSE CATEGORY PILLS matching Image 3 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold font-serif text-stone-500 uppercase tracking-wider">
              CHOOSE CATEGORY
            </label>

            <div className="flex flex-wrap gap-2.5 font-sans">
              {categories.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
                      isSelected
                        ? 'bg-[#EBF2E4] dark:bg-emerald-950 text-[#3B4D2B] dark:text-emerald-300 border-[#3B4D2B] shadow-sm'
                        : 'bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ROUTINE TITLE INPUT matching Image 3 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-serif text-slate-900 dark:text-amber-100">
              Routine Title
            </label>
            <input
              type="text"
              placeholder="e.g. Morning Breathing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-slate-900 dark:text-amber-50 font-serif text-sm focus:outline-none focus:border-[#3B4D2B]"
            />
          </div>

          {/* TIME & DURATION PICKERS matching Image 3 */}
          <div className="grid grid-cols-2 gap-3 font-sans">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold font-serif text-slate-900 dark:text-amber-100">
                Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-slate-900 dark:text-amber-50 font-bold text-xs"
                />
                <Clock className="w-4 h-4 text-[#3B4D2B] absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold font-serif text-slate-900 dark:text-amber-100">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-slate-900 dark:text-amber-50 font-bold text-xs"
              >
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>
          </div>

          {/* PRIMARY BUTTON matching Image 3 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#3B4D2B] hover:bg-[#2D3C20] text-amber-50 font-serif font-extrabold text-base flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.99]"
          >
            <span>Add to Calendar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
