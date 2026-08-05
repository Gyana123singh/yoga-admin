import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Sparkles, Bot, Sliders, Activity, ArrowRight, Plus, ShieldAlert } from 'lucide-react';

export function CreateAIRuleModal({ isOpen, onClose, onAddRule }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    userState: '',
    triggerCondition: '',
    priority: 'High',
    aiPromptTemplate: '',
    recommendedSequence: ['Box Breathing (5m)', 'Restorative Spine Reset (15m)'],
  });

  const presetSequences = [
    'Box Breathing (5 min)',
    'Restorative Spine Reset (15 min)',
    'Body Scan Meditation (10 min)',
    'Kapalabhati Breath (3 min)',
    'Dynamic Sun Salutation (12 min)',
    'Yoga Nidra Deep Relaxation (20 min)',
  ];

  const handleSequenceToggle = (seq) => {
    setFormData((prev) => {
      const exists = prev.recommendedSequence.includes(seq);
      return {
        ...prev,
        recommendedSequence: exists
          ? prev.recommendedSequence.filter((s) => s !== seq)
          : [...prev.recommendedSequence, seq],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userState.trim()) {
      showToast('Please enter a target user state or mood', 'warning');
      return;
    }

    const newRule = {
      id: `RULE-${Math.floor(Math.random() * 900 + 100)}`,
      userState: formData.userState.trim(),
      triggerCondition: formData.triggerCondition.trim() || 'User manual selection',
      recommendedSequence: formData.recommendedSequence.length > 0
        ? formData.recommendedSequence
        : ['Box Breathing (5m)', 'Restorative Flow (15m)'],
      priority: formData.priority,
      aiPromptTemplate: formData.aiPromptTemplate.trim() || 'Synthesize parasympathetic restoration sequence',
      status: 'Active',
      matchCount: 0,
    };

    if (onAddRule) {
      onAddRule(newRule);
    }

    showToast('New AI Recommendation Rule deployed successfully!', 'success');
    
    // Reset form
    setFormData({
      userState: '',
      triggerCondition: '',
      priority: 'High',
      aiPromptTemplate: '',
      recommendedSequence: ['Box Breathing (5m)', 'Restorative Spine Reset (15m)'],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deploy New Recommendation Rule"
      subtitle="Define biometric triggers, mood targets, priority levels, and AI prompt overrides"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target User State / Mood */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Target User State / Mood <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.userState}
            onChange={(e) => setFormData({ ...formData, userState: e.target.value })}
            placeholder="e.g. High Anxiety & Shoulder Stiffness"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Biometric Trigger Condition & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Trigger Condition
            </label>
            <input
              type="text"
              value={formData.triggerCondition}
              onChange={(e) => setFormData({ ...formData, triggerCondition: e.target.value })}
              placeholder="e.g. Heart Rate > 95 bpm OR HRV < 40 ms"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Rule Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Urgent High">Urgent High</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Recommended Flow Sequence Presets */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" /> Recommended Flow Modules
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presetSequences.map((seq) => {
              const isSelected = formData.recommendedSequence.includes(seq);
              return (
                <button
                  key={seq}
                  type="button"
                  onClick={() => handleSequenceToggle(seq)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {seq}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI System Prompt Override */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI System Prompt Logic
          </label>
          <textarea
            rows={3}
            value={formData.aiPromptTemplate}
            onChange={(e) => setFormData({ ...formData, aiPromptTemplate: e.target.value })}
            placeholder="Describe instructions for the LLM practice sequence generator..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Deploy Rule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
