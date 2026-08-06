import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  Flame,
  Leaf,
  Play,
  Flower2,
  CheckCircle2
} from 'lucide-react';

export function DailySessionOverviewPage() {
  const { programId, dayNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const program = location.state?.program || {
    _id: programId,
    title: 'Core & Belly Strength',
    totalDays: 30
  };

  const day = location.state?.day || {
    dayNumber: parseInt(dayNumber) || 1,
    title: 'Core Awareness',
    focusTitle: 'Core Activation',
    focusDescription: 'Activate your core, improve body awareness and connect with your breath.',
    durationMinutes: 15,
    estimatedCalories: 112,
    difficultyTag: 'Beginner Friendly',
    steps: [
      {
        stepNumber: 1,
        title: 'Breath Preparation',
        subtitle: 'Deep breathing',
        durationSeconds: 180,
        instructionTitle: 'Inhale',
        instructionDetail: 'Breathe in slowly through your nose and fill your lungs and slowly release.',
        videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
        poseImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
      },
      {
        stepNumber: 2,
        title: 'Cat Cow',
        subtitle: 'Spinal warm up',
        durationSeconds: 120,
        instructionTitle: 'Arch & Curve',
        instructionDetail: 'Inhale to drop your belly and lift your gaze. Exhale to round your spine.',
        videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
        poseImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
      }
    ]
  };

  const handleStartSession = (initialStepIdx = 0) => {
    navigate(`/yoga-programs/${programId}/day/${day.dayNumber}/player`, {
      state: { program, day, initialStepIdx }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-950 font-serif text-slate-900 dark:text-amber-50 p-4 sm:p-6 max-w-lg mx-auto pb-24 select-none">
      {/* HEADER BAR matching Image 4 */}
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-stone-200/60 dark:bg-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 hover:bg-stone-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <p className="text-xs font-serif text-stone-500 dark:text-stone-400 font-medium">
            {program.title}
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-serif text-slate-900 dark:text-amber-50">
            Day {day.dayNumber} of {program.totalDays || 30}
          </h1>
        </div>
      </div>

      {/* TODAY'S FOCUS CARD matching Image 4 */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4 mb-6">
        <h3 className="text-xs font-extrabold font-serif text-stone-400 uppercase tracking-widest">
          Today's Focus
        </h3>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#EBF2E4] dark:bg-emerald-950 text-[#3B4D2B] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Flower2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold font-serif text-slate-900 dark:text-amber-50">
              {day.focusTitle || 'Core Activation'}
            </h2>
            <p className="text-xs font-serif text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
              {day.focusDescription || 'Activate your core, improve body awareness and connect with your breath.'}
            </p>
          </div>
        </div>

        {/* Focus Badges Bar matching Image 4 */}
        <div className="grid grid-cols-3 gap-2 font-sans pt-2">
          <div className="p-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 text-center space-y-0.5">
            <Clock className="w-4 h-4 text-[#3B4D2B] mx-auto mb-1" />
            <div className="text-xs font-extrabold text-slate-900 dark:text-amber-100">
              {day.durationMinutes || 15} min
            </div>
            <div className="text-[10px] text-stone-400 font-medium">Duration</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 text-center space-y-0.5">
            <Flame className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <div className="text-xs font-extrabold text-slate-900 dark:text-amber-100">
              {day.estimatedCalories || 112} kcal
            </div>
            <div className="text-[10px] text-stone-400 font-medium">Est. Cal...</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 text-center space-y-0.5">
            <Leaf className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-extrabold text-slate-900 dark:text-amber-100 truncate">
              {day.difficultyTag || 'Beginner...'}
            </div>
            <div className="text-[10px] text-stone-400 font-medium">Friendly</div>
          </div>
        </div>
      </div>

      {/* TODAY'S SESSION TIMELINE SEQUENCE matching Image 4 */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-extrabold font-serif text-slate-900 dark:text-amber-50">
          Today's Session
        </h3>

        <div className="space-y-3 font-sans relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#3B4D2B]/30 pointer-events-none z-0" />

          {(day.steps || []).map((step, idx) => (
            <div
              key={idx}
              onClick={() => handleStartSession(idx)}
              className="relative p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-center justify-between gap-4 z-10 hover:border-[#3B4D2B] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                  <img
                    src={step.poseImageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop'}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <h4 className="text-base font-bold font-serif text-slate-900 dark:text-amber-50 group-hover:text-[#3B4D2B] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {step.subtitle} • {Math.round((step.durationSeconds || 180) / 60)} min
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartSession(idx);
                }}
                className="w-10 h-10 rounded-full bg-[#EBF2E4] dark:bg-emerald-950 text-[#3B4D2B] dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-[#3B4D2B] group-hover:text-white transition-colors"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING START SESSION BUTTON matching Image 4 */}
      <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-30 font-serif">
        <button
          onClick={handleStartSession}
          className="w-full py-4 rounded-2xl bg-[#3B4D2B] hover:bg-[#2D3C20] text-amber-50 font-serif font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-[0.99]"
        >
          <Play className="w-5 h-5 fill-amber-50" />
          <span>START TODAY'S SESSION</span>
        </button>
      </div>
    </div>
  );
}
