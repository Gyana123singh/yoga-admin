import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Workflow, Save, Layers, Lock, Sparkles } from 'lucide-react';

export function SavePracticeSequenceModal({ isOpen, onClose, timeline = [], onSaveSequence }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    sequenceName: 'Morning Vinyasa & Chakra Reset Flow',
    targetGoal: 'Stress Relief & Spine Alignment',
    difficulty: 'Intermediate',
    access: 'Premium Only',
    notes: 'Custom sequence designed for morning activation and thoracic spine opening.',
  });
  const [isSaving, setIsSaving] = useState(false);

  const calculateTotalMinutes = () => {
    return timeline.reduce((acc, block) => {
      const mins = parseInt(block.duration) || 5;
      return acc + mins;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sequenceName.trim()) {
      showToast('Please enter a sequence title', 'warning');
      return;
    }

    setIsSaving(true);
    const savedSequence = await api.createPractice({
      title: formData.sequenceName.trim(),
      description: formData.notes.trim(),
      targetGoal: formData.targetGoal,
      difficulty: formData.difficulty,
      duration: `${calculateTotalMinutes()} min`,
      poses: timeline.map(t => ({ name: t.name, holdTime: t.duration })),
      tags: ['Custom Flow', formData.targetGoal],
      createdBy: 'Studio Instructor'
    });

    setIsSaving(false);
    if (onSaveSequence) {
      onSaveSequence(savedSequence);
    }

    showToast(`Sequence "${formData.sequenceName}" saved to Studio Library via Backend!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Custom Practice Sequence"
      subtitle="Publish custom sequence into the studio library for client assignment and AI rules"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Timeline Summary Pill */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-indigo-400">
            <span className="flex items-center gap-1.5">
              <Workflow className="w-4 h-4" /> Current Active Sequence Summary
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white font-extrabold text-[10px]">
              {timeline.length} Modules • {calculateTotalMinutes()} Mins Total
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {timeline.map((b, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                #{i + 1} {b.name} ({b.duration})
              </span>
            ))}
          </div>
        </div>

        {/* Sequence Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Sequence Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.sequenceName}
            onChange={(e) => setFormData({ ...formData, sequenceName: e.target.value })}
            placeholder="e.g. Cervical Spine & Vagus Nerve Release"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Goal & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Primary Goal Target
            </label>
            <select
              value={formData.targetGoal}
              onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Stress Relief & Spine Alignment">Stress Relief & Spine Alignment</option>
              <option value="Core Strength & Flexibility">Core Strength & Flexibility</option>
              <option value="Pre-Bed Winddown">Pre-Bed Winddown</option>
              <option value="General Daily Flow">General Daily Flow</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Difficulty Track
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels Welcome</option>
            </select>
          </div>
        </div>

        {/* Access Level */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500" /> Member Access Restriction
          </label>
          <select
            value={formData.access}
            onChange={(e) => setFormData({ ...formData, access: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="Premium Only">Premium Tier Only</option>
            <option value="Public (All Members)">Public (Available to All Free & Premium Members)</option>
            <option value="Private Draft">Private Admin Draft</option>
          </select>
        </div>

        {/* Studio Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Instructor / Studio Notes
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add optional instructor guidance..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSaving} icon={Save}>
            Save Sequence
          </Button>
        </div>
      </form>
    </Modal>
  );
}
