import React from 'react';
import { Lock, Sparkles, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SubscriptionPaywallModal({ isOpen, onClose, dayNumber, programTitle }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-500/30 text-center space-y-6 relative overflow-hidden font-serif">
        {/* Top Decorative Banner */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-stone-800 text-slate-500 dark:text-stone-400 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Badge Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto pt-1 shadow-inner">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-sans font-extrabold uppercase tracking-wider">
            Day {dayNumber || 3} is Premium Locked 🔒
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-amber-50">
            Unlock Full 30-Day Journey
          </h3>
          <p className="text-xs font-sans text-slate-500 dark:text-stone-400 font-medium">
            You've completed your free trial days for <strong className="text-slate-800 dark:text-slate-200">{programTitle || 'this Goal Program'}</strong>. Upgrade to Premium to unlock all 30 days!
          </p>
        </div>

        {/* Benefits List */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-stone-800/80 border border-slate-200/80 dark:border-stone-700/80 text-left text-xs font-sans space-y-2.5">
          {[
            'Full access to all 30 Days & 250+ guided video sessions',
            'Personalized AI progress tracker & streak analytics',
            'Unlimited access to Sleep, Meditation & Express Flows'
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 font-sans pt-1">
          <button
            onClick={() => {
              onClose();
              navigate('/subscriptions');
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Unlock Premium Pro ($9.99/mo)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-amber-100 transition-colors"
          >
            Continue with Free Days
          </button>
        </div>
      </div>
    </div>
  );
}
