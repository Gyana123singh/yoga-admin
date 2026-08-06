import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Bookmark,
  Share2,
  Calendar,
  BarChart2,
  Users,
  CheckCircle2,
  Lock,
  Play,
  Grid,
  Zap,
  UserCheck,
  Wind
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { SubscriptionPaywallModal } from '../components/modals/SubscriptionPaywallModal';

export function ProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useApp();

  const [program, setProgram] = useState(location.state?.program || null);
  const [completedDays, setCompletedDays] = useState([1]); // Day 1 completed
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [paywallModal, setPaywallModal] = useState({ open: false, dayNumber: 3 });

  useEffect(() => {
    loadProgram();
  }, [id]);

  const loadProgram = async () => {
    if (id) {
      const data = await api.getYogaProgramById(id);
      if (data) setProgram(data);
    }
  };

  if (!program) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-950 flex items-center justify-center p-4">
        <div className="text-center font-serif text-slate-500">Loading Goal Program...</div>
      </div>
    );
  }

  const handleDayClick = (day) => {
    // If Day is locked (> 2 and not subscribed)
    if (!day.isFree && day.dayNumber > (program.freeDaysCount || 2)) {
      setPaywallModal({ open: true, dayNumber: day.dayNumber });
      return;
    }

    // Navigate to Daily Session Overview Page (Image 4)
    navigate(`/yoga-programs/${program._id || program.id}/day/${day.dayNumber}`, {
      state: { program, day }
    });
  };

  const improvementsList = program.improvements && program.improvements.length > 0
    ? program.improvements
    : [
        { name: 'Core Stability', icon: 'grid' },
        { name: 'Abdominal Strength', icon: 'zap' },
        { name: 'Balance', icon: 'user' },
        { name: 'Breath Coordination', icon: 'wind' }
      ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-950 font-serif text-slate-900 dark:text-amber-50 p-4 sm:p-6 max-w-lg mx-auto pb-24 select-none">
      {/* HEADER BAR WITH HERO BANNER matching Image 3 */}
      <div className="relative rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-md overflow-hidden mb-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={program.heroImageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop'}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Action Buttons Header */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-amber-100 hover:bg-white transition-colors shadow-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsBookmarked(!isBookmarked);
                  showToast(isBookmarked ? 'Removed from Bookmarks' : 'Saved to Bookmarks', 'info');
                }}
                className="w-10 h-10 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-amber-100 hover:bg-white transition-colors shadow-md"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#3B4D2B] text-[#3B4D2B]' : ''}`} />
              </button>
              <button
                onClick={() => showToast('Share link copied to clipboard!', 'success')}
                className="w-10 h-10 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-amber-100 hover:bg-white transition-colors shadow-md"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Title & Info Badges */}
        <div className="p-5 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-amber-50">
              {program.title}
            </h1>
            <p className="text-xs sm:text-sm font-serif text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              {program.subtitle}
            </p>
          </div>

          {/* Badges Bar matching Image 3 */}
          <div className="flex items-center gap-3 font-sans">
            <div className="px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-stone-300">
              <Calendar className="w-3.5 h-3.5 text-[#3B4D2B]" />
              <span>{program.totalDays} Days</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-stone-300">
              <BarChart2 className="w-3.5 h-3.5 text-[#3B4D2B]" />
              <span>{program.difficultyLevel || 'Intermediate'}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-stone-300">
              <Users className="w-3.5 h-3.5 text-[#3B4D2B]" />
              <span>{program.enrolledCount || '8.5K+'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY PROGRESS HORIZONTAL SCROLL CARDS matching Image 3 */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-amber-50">
          Daily progress
        </h3>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 font-sans">
          {(program.dailySchedules || []).map((day) => {
            const isCompleted = completedDays.includes(day.dayNumber);
            const isLocked = !day.isFree && day.dayNumber > (program.freeDaysCount || 2);

            return (
              <div
                key={day.dayNumber}
                onClick={() => handleDayClick(day)}
                className={`min-w-[150px] sm:min-w-[160px] p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2.5 shadow-sm active:scale-[0.98] ${
                  isCompleted
                    ? 'bg-[#EBF2E4] dark:bg-emerald-950/70 border-[#3B4D2B] dark:border-emerald-600'
                    : isLocked
                    ? 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 opacity-80'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-[#3B4D2B]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                    Day {day.dayNumber}
                  </span>
                  {!isLocked && (
                    <span className="px-2 py-0.5 rounded-md bg-[#3B4D2B]/10 text-[#3B4D2B] text-[10px] font-extrabold uppercase">
                      UNLOCKED
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-extrabold font-serif text-slate-900 dark:text-amber-50 truncate">
                    {day.title}
                  </h4>
                  <p className="text-[11px] font-sans text-stone-500 dark:text-stone-400 font-medium">
                    {day.durationMinutes} min
                  </p>
                </div>

                <div className="pt-1">
                  {isCompleted ? (
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3B4D2B] dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 fill-[#3B4D2B] text-white" />
                      <span>Completed</span>
                    </div>
                  ) : isLocked ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400">
                      <Lock className="w-4 h-4" />
                      <span>Locked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3B4D2B] dark:text-emerald-400">
                      <Play className="w-4 h-4 fill-[#3B4D2B]" />
                      <span>Start</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YOU WILL IMPROVE GRID matching Image 3 */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-amber-50">
          You will improve
        </h3>

        <div className="grid grid-cols-4 gap-3 font-sans">
          {improvementsList.map((imp, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center space-y-2 flex flex-col items-center justify-center shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-[#EBF2E4] dark:bg-emerald-950 text-[#3B4D2B] dark:text-emerald-400 flex items-center justify-center">
                <Grid className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-stone-300 leading-tight">
                {imp.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING START PROGRAM BUTTON matching Image 3 */}
      <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-30 font-serif">
        <button
          onClick={() => handleDayClick(program.dailySchedules[0] || { dayNumber: 1, isFree: true })}
          className="w-full py-4 rounded-2xl bg-[#3B4D2B] hover:bg-[#2D3C20] text-amber-50 font-serif font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-[0.99]"
        >
          <span>START PROGRAM</span>
        </button>
      </div>

      {/* PAYWALL MODAL */}
      <SubscriptionPaywallModal
        isOpen={paywallModal.open}
        onClose={() => setPaywallModal({ open: false, dayNumber: 3 })}
        dayNumber={paywallModal.dayNumber}
        programTitle={program.title}
      />
    </div>
  );
}
