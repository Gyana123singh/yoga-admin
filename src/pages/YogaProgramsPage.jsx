import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Dumbbell, Activity, Brain, Zap, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export function YogaProgramsPage() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('All Goals');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, [selectedGoal]);

  const loadPrograms = async () => {
    setIsLoading(true);
    const data = await api.getYogaPrograms(selectedGoal);
    if (data) setPrograms(data);
    setIsLoading(false);
  };

  const filterTabs = [
    { label: 'All Goals', icon: Sparkles },
    { label: 'Strength', icon: Dumbbell },
    { label: 'Mobility', icon: Activity },
    { label: 'Mind', icon: Brain },
    { label: 'Energy', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-950 font-serif text-slate-900 dark:text-amber-50 p-4 sm:p-6 max-w-lg mx-auto pb-16 select-none">
      {/* TOP HERO HEADER matching Image 2 */}
      <div className="relative mb-6 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-stone-200/60 dark:bg-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 hover:bg-stone-300 transition-colors mb-4"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-slate-900 dark:text-amber-50 leading-tight">
          Goal-Based Yoga Programmes
        </h1>
        <p className="text-xs sm:text-sm font-serif text-stone-500 dark:text-stone-400 mt-2 leading-relaxed max-w-xs">
          Choose a programme and follow a structured journey towards a healthier you.
        </p>
      </div>

      {/* GOAL FILTER TABS matching Image 2 */}
      <div className="flex items-center gap-2.5 mb-6 overflow-x-auto pb-1 font-sans">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedGoal === tab.label || (selectedGoal === 'All Goals' && tab.label === 'All Goals');
          return (
            <button
              key={tab.label}
              onClick={() => setSelectedGoal(tab.label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#3B4D2B] text-white border-[#3B4D2B] shadow-md'
                  : 'bg-white dark:bg-stone-900 text-slate-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label === 'All Goals' ? '✓ All Goals' : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PROGRAM CARDS LIST matching Image 2 */}
      <div className="space-y-5">
        {programs.map((prog) => {
          const dayProgress = 1; // Default current user progress
          const progressPercent = Math.round((dayProgress / prog.totalDays) * 100);

          return (
            <div
              key={prog._id || prog.id}
              onClick={() => navigate(`/yoga-programs/${prog._id || prog.id}`, { state: { program: prog } })}
              className="relative rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-md overflow-hidden cursor-pointer hover:border-[#3B4D2B]/50 transition-all active:scale-[0.99] group"
            >
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-3 z-10 max-w-[65%]">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold font-serif text-slate-900 dark:text-amber-50 group-hover:text-[#3B4D2B] dark:group-hover:text-emerald-400 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs font-sans text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {prog.totalDays} Days • {prog.difficultyLevel || 'Intermediate'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    {(prog.tags || ['Core Activation', 'Abdominal Strength']).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-[#F2F5EF] dark:bg-emerald-950/60 text-[#3B4D2B] dark:text-emerald-300 text-[11px] font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Day Progress Bar matching Image 2 */}
                  <div className="space-y-1 pt-1 font-sans">
                    <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-[#3B4D2B] dark:bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(progressPercent, 10)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                      Day {dayProgress} of {prog.totalDays}
                    </span>
                  </div>
                </div>

                {/* Hero Image Preview matching Image 2 */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={prog.heroImageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop'}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-stone-900/90 text-slate-800 dark:text-amber-100 flex items-center justify-center shadow-md">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
