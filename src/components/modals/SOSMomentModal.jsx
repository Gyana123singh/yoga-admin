import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight, X, Sparkles } from 'lucide-react';

export function SOSMomentModal({ isOpen, onClose, sosPractices = [] }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const defaultItems = [
    {
      _id: 'sos-1',
      title: 'Calm Me (Box Breathing 4-4-4-4)',
      subtitle: 'Equal 4s Inhale, 4s Hold, 4s Exhale, 4s Hold',
      icon: '🧘',
      category: 'sos_moment',
      durationMinutes: 3,
      bgImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
      phases: [
        { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
        { phase: 'HOLD', durationSeconds: 4, instruction: 'Retain Breath Gently' },
        { phase: 'EXHALE', durationSeconds: 4, instruction: 'Release Slowly' },
        { phase: 'HOLD', durationSeconds: 4, instruction: 'Rest & Pause' }
      ]
    },
    {
      _id: 'sos-2',
      title: 'Help Me Sleep (4-7-8 Sleep Breath)',
      subtitle: 'Parasympathetic Activation • Deep Rest',
      icon: '😴',
      category: 'sos_moment',
      durationMinutes: 5,
      bgImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop',
      phases: [
        { phase: 'INHALE', durationSeconds: 4, instruction: 'Inhale Quietly Through Nose' },
        { phase: 'HOLD', durationSeconds: 7, instruction: 'Hold Your Breath Softly' },
        { phase: 'EXHALE', durationSeconds: 8, instruction: 'Whoosh Exhale Through Mouth' }
      ]
    },
    {
      _id: 'sos-3',
      title: 'Give Me Energy (Kapalabhati Breath)',
      subtitle: 'Rapid Skull-Shining Oxygenation',
      icon: '⚡',
      category: 'sos_moment',
      durationMinutes: 3,
      bgImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
      phases: [
        { phase: 'INHALE', durationSeconds: 2, instruction: 'Passive Inhale' },
        { phase: 'EXHALE', durationSeconds: 1, instruction: 'Forceful Exhale' }
      ]
    },
    {
      _id: 'sos-4',
      title: 'Help Me Focus (Coherent 5-5 Breath)',
      subtitle: 'Heart Rate Variability Alignment',
      icon: '🎯',
      category: 'sos_moment',
      durationMinutes: 4,
      bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
      phases: [
        { phase: 'INHALE', durationSeconds: 5, instruction: 'Inhale Steadily' },
        { phase: 'EXHALE', durationSeconds: 5, instruction: 'Exhale Smoothly' }
      ]
    }
  ];

  const displayList = sosPractices.length > 0 ? sosPractices : defaultItems;

  const handleSelectPractice = (practice) => {
    onClose();
    navigate('/quick-practice-timer', { state: { practice } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#FAF8F5] dark:bg-[#1C1B18] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5 animate-in slide-in-from-bottom duration-300 font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle for mobile bottom sheet */}
        <div className="w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto sm:hidden" />

        {/* Modal Header matching Image 4 */}
        <div className="flex items-start justify-between font-serif">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-amber-50 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span>I Need a Moment (Breathing SOS)</span>
            </h2>
            <p className="text-xs sm:text-sm font-sans font-medium text-stone-500 dark:text-stone-400">
              What do you need right now?
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Breathing Options List matching Image 4 */}
        <div className="space-y-3 font-sans pt-1 max-h-[60vh] overflow-y-auto pr-1">
          {displayList.map((item, idx) => (
            <button
              key={item._id || idx}
              onClick={() => handleSelectPractice(item)}
              className="w-full p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 hover:border-[#3B4D2B] dark:hover:border-emerald-600 flex items-center justify-between text-left transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  {item.icon || '🧘'}
                </span>

                <div>
                  <h4 className="text-base font-bold font-serif text-slate-900 dark:text-amber-50 group-hover:text-[#3B4D2B] dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {item.subtitle || `${item.durationMinutes || 3} min technique`}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
