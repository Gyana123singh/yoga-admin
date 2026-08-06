import React from 'react';
import { Play, X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button';

export function BreathingDetailModal({ isOpen, onClose, technique, onStartSync }) {
  if (!isOpen || !technique) return null;

  const defaultBenefits = [
    'Lowers cortisol stress hormone',
    'Enhances mental clarity',
    'Balances autonomic nervous system'
  ];

  const benefitsList = technique.benefits && technique.benefits.length > 0 ? technique.benefits : defaultBenefits;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-end justify-center p-0 sm:p-4">
      {/* Modal Container matching Image 3 */}
      <div className="w-full max-w-md bg-[#FAF7F2] dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200/80 dark:border-stone-800 space-y-6 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header Title */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-slate-900 dark:text-amber-50">
              {technique.title}
            </h2>
            <p className="text-xs font-serif text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
              {technique.subtitle || 'Tactical breathing technique to rapidly calm the nervous system and heighten focus.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center shrink-0 hover:bg-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BENEFITS SECTION matching Image 3 */}
        <div className="space-y-2.5 font-serif">
          <h4 className="text-xs font-bold text-[#4A5D37] dark:text-emerald-400 uppercase tracking-widest">
            BENEFITS
          </h4>
          <ul className="space-y-2 text-xs font-serif text-slate-800 dark:text-stone-300">
            {benefitsList.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#4A5D37] dark:text-emerald-400 font-bold">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SAFETY CAUTION SECTION matching Image 3 */}
        <div className="space-y-1.5 font-serif pt-1">
          <h4 className="text-xs font-bold text-[#C85A32] dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
            SAFETY CAUTION
          </h4>
          <p className="text-xs font-serif text-stone-600 dark:text-stone-400 leading-relaxed">
            {technique.safetyCaution || 'If pregnant or experiencing high blood pressure, reduce hold phase to comfortable level.'}
          </p>
        </div>

        {/* PRIMARY ACTION BUTTON matching Image 3 */}
        <div className="pt-2">
          <button
            onClick={() => onStartSync(technique)}
            className="w-full py-4 rounded-2xl bg-[#4A5D37] hover:bg-[#3B4C2B] text-amber-50 font-serif font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-amber-50" />
            <span>Start Breath Sync</span>
          </button>
        </div>
      </div>
    </div>
  );
}
