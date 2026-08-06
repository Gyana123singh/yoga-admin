import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  XCircle,
  Play,
  Sun,
  Flower2,
  Brain,
  Moon
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { AddPracticeModal } from '../components/modals/AddPracticeModal';

export function CalendarPage() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // July (1-indexed)
  const [selectedDayNum, setSelectedDayNum] = useState(4); // 4 July

  const [schedules, setSchedules] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [monthStats, setMonthStats] = useState({
    completedDays: 0,
    partiallyCompleted: 0,
    missedDays: 31,
    activeDatesWithStatus: {}
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const selectedDateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDayNum).padStart(2, '0')}`;

  useEffect(() => {
    loadDailySchedules();
    loadMonthStats();
  }, [selectedDateStr, currentMonth, currentYear]);

  const loadDailySchedules = async () => {
    setIsLoading(true);
    const res = await api.getDailySchedulesByDate(selectedDateStr);
    if (res && res.data) {
      setSchedules(res.data);
      setCompletedCount(res.meta?.completedCount || 0);
    }
    setIsLoading(false);
  };

  const loadMonthStats = async () => {
    const stats = await api.getDailyScheduleMonthStats(currentYear, currentMonth);
    if (stats) setMonthStats(stats);
  };

  const handleToggleComplete = async (e, id) => {
    e.stopPropagation();
    const updated = await api.toggleDailyScheduleStatus(id);
    if (updated) {
      setSchedules((prev) => prev.map((s) => (s._id === id || s.id === id ? updated : s)));
      showToast(`Routine status updated!`, 'success');
      loadDailySchedules();
      loadMonthStats();
    }
  };

  const handlePlayRoutine = (routine) => {
    navigate('/schedule-player', { state: { routine } });
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate Month Days Grid
  const daysInMonthCount = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun
  // Convert Sunday=0 to Monday=0
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const categoryIconMap = {
    Breathing: '☀️',
    Yoga: '🧘',
    Meditation: '🧠',
    Relaxation: '🌙',
    Sleep: '😴'
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-950 font-serif text-slate-900 dark:text-amber-50 p-4 sm:p-6 max-w-lg mx-auto pb-24 select-none">
      {/* HEADER BAR matching Image 1 */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-stone-200/60 dark:bg-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 hover:bg-stone-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center font-serif">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-amber-50">
            Calendar
          </h1>
          <p className="text-xs font-serif text-stone-500 dark:text-stone-400 font-medium">
            Plan. Practice. Track. Transform.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[#EBF2E4] dark:bg-emerald-950 text-[#3B4D2B] dark:text-emerald-400 flex items-center justify-center hover:bg-[#3B4D2B] hover:text-white transition-colors shadow-xs"
        >
          <CalendarIcon className="w-5 h-5" />
        </button>
      </div>

      {/* MONTH NAVIGATOR HEADER matching Image 1 */}
      <div className="flex items-center justify-center gap-6 mb-4 font-serif">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-full bg-stone-200/50 dark:bg-stone-800 flex items-center justify-center text-slate-700 dark:text-stone-300 hover:bg-stone-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-amber-50">
          {monthNames[currentMonth - 1]} {currentYear}
        </h2>

        <button
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-full bg-stone-200/50 dark:bg-stone-800 flex items-center justify-center text-slate-700 dark:text-stone-300 hover:bg-stone-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* MONTH GRID CARD matching Image 1 */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4 mb-6">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold font-serif text-slate-900 dark:text-amber-100">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="py-1">{d}</div>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 gap-1 font-serif text-sm">
          {/* Empty leading cells */}
          {Array.from({ length: adjustedFirstDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 text-stone-300 dark:text-stone-700 flex items-center justify-center text-xs">
              {28 + idx}
            </div>
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonthCount }).map((_, idx) => {
            const dayNum = idx + 1;
            const isSelected = dayNum === selectedDayNum;
            const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const status = monthStats.activeDatesWithStatus?.[dateKey];

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDayNum(dayNum)}
                className={`relative h-10 rounded-full flex flex-col items-center justify-center font-extrabold transition-all ${
                  isSelected
                    ? 'bg-[#3B4D2B] text-white shadow-md scale-105'
                    : 'text-slate-900 dark:text-amber-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>{dayNum}</span>
                {status === 'completed' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute bottom-1" />
                )}
                {status === 'partially' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* STATUS LEGEND BAR matching Image 1 */}
      <div className="flex items-center justify-center gap-4 text-xs font-serif text-stone-600 dark:text-stone-400 mb-6 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>All Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          <span>Partially Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block" />
          <span>Not Completed</span>
        </div>
      </div>

      {/* TODAY'S PRACTICE PLAN SECTION matching Image 2 */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold font-serif text-slate-900 dark:text-amber-50 uppercase tracking-wide">
              TODAY'S PRACTICE PLAN ({selectedDayNum} {monthNames[currentMonth - 1].slice(0, 3)})
            </h3>
            <p className="text-xs font-serif text-stone-500 dark:text-stone-400 mt-0.5">
              {completedCount} of {schedules.length} sessions completed today
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-[#3B4D2B] text-white text-xs font-sans font-extrabold flex items-center gap-1 shadow-sm hover:bg-[#2D3C20] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Practice</span>
          </button>
        </div>

        {/* ROUTINES CARDS LIST matching Image 2 */}
        <div className="space-y-3 font-sans">
          {schedules.map((routine) => {
            const isDone = routine.status === 'Completed';
            const catIcon = categoryIconMap[routine.category] || '☀️';

            return (
              <div
                key={routine._id || routine.id}
                onClick={() => handlePlayRoutine(routine)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer hover:border-[#3B4D2B] ${
                  isDone
                    ? 'bg-[#EBF2E4] dark:bg-emerald-950/60 border-[#3B4D2B]'
                    : 'bg-[#FAF7F2]/80 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xl flex items-center justify-center shrink-0 shadow-xs">
                    {catIcon}
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold font-serif text-slate-900 dark:text-amber-50 leading-snug">
                      {routine.title}
                    </h4>
                    <p className="text-xs font-serif text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {routine.scheduledTime} • {routine.durationMinutes} Minutes
                    </p>
                  </div>
                </div>

                {/* Status Toggle Button matching Image 2 */}
                <button
                  onClick={(e) => handleToggleComplete(e, routine._id || routine.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-[#3B4D2B] text-white border-[#3B4D2B]'
                      : 'bg-white dark:bg-stone-900 text-slate-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-[#3B4D2B]'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 fill-white text-[#3B4D2B]" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-stone-400" />
                      <span>Pending</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* THIS MONTH STATS CARD matching Image 2 */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-amber-50">
          This Month
        </h3>

        <div className="grid grid-cols-3 gap-3 font-sans">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-amber-50 font-serif">
              {monthStats.completedDays}
            </div>
            <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 leading-tight">
              Complete Days
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-amber-50 font-serif">
              {monthStats.partiallyCompleted}
            </div>
            <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 leading-tight">
              Partially Completed
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-500 flex items-center justify-center mx-auto mb-1">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-amber-50 font-serif">
              {monthStats.missedDays}
            </div>
            <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 leading-tight">
              Missed Days
            </div>
          </div>
        </div>
      </div>

      {/* ADD PRACTICE MODAL */}
      <AddPracticeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedDate={selectedDateStr}
        onRoutineAdded={() => {
          loadDailySchedules();
          loadMonthStats();
        }}
      />
    </div>
  );
}
