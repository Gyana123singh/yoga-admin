import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Zap, Sparkles, Clock, Flame, Shield, Plus } from 'lucide-react';

export function CreateQuickPracticeModal({ isOpen, onClose, onAddQuickPractice }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Desk & Office Stretch',
    duration: '5 Minutes (Express)',
    equipment: 'No Equipment Needed (Chair Seated)',
    intensity: 'Gentle',
    description: 'Rapid 5-minute seated spinal twist and shoulder roll micro-flow for immediate desk relief.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a quick practice title', 'warning');
      return;
    }

    const newPractice = {
      id: `QPK-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: formData.title.trim(),
      category: formData.category,
      duration: formData.duration,
      equipment: formData.equipment,
      intensity: formData.intensity,
      description: formData.description.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddQuickPractice) {
      onAddQuickPractice(newPractice);
    }

    showToast(`Quick Practice "${newPractice.title}" created successfully!`, 'success');
    
    // Reset form
    setFormData({
      title: '',
      category: 'Desk & Office Stretch',
      duration: '5 Minutes (Express)',
      equipment: 'No Equipment Needed (Chair Seated)',
      intensity: 'Gentle',
      description: 'Rapid 5-minute seated spinal twist and shoulder roll micro-flow for immediate desk relief.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Quick Practice Routine"
      subtitle="Configure 2-minute to 15-minute express wellness micro-flows"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Practice Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. 2-Min Desk Worker Neck & Eye Reset"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Category & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Express Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Desk & Office Stretch">Desk & Office Stretch</option>
              <option value="Express Breathwork">Express Breathwork (Box/4-7-8)</option>
              <option value="Energy Boost">Morning Energy Boost</option>
              <option value="Posture Reset">Lumbar & Posture Reset</option>
              <option value="Pre-Meeting Calm">Pre-Meeting Calm Focus</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Micro Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="2 Minutes (Micro)">2 Minutes (Micro Express)</option>
              <option value="5 Minutes (Express)">5 Minutes (Express Flow)</option>
              <option value="10 Minutes (Standard)">10 Minutes (Standard Routine)</option>
              <option value="15 Minutes (Power)">15 Minutes (Power Reset)</option>
            </select>
          </div>
        </div>

        {/* Equipment & Intensity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> Equipment Required
            </label>
            <select
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="No Equipment Needed (Chair Seated)">No Equipment Needed (Chair Seated)</option>
              <option value="Yoga Mat Only">Yoga Mat Only</option>
              <option value="Wall Support">Wall Support Required</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Intensity Level
            </label>
            <select
              value={formData.intensity}
              onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Gentle">Gentle Restorative</option>
              <option value="Moderate">Moderate Mobility</option>
              <option value="High Energy">High Energy Activation</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Micro-Flow Steps & Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the rapid pose steps..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Create Quick Practice
          </Button>
        </div>
      </form>
    </Modal>
  );
}
