import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Moon, Sparkles, Clock, Music, Bed, Plus } from 'lucide-react';

export function CreateSleepProgramModal({ isOpen, onClose, onAddSleepProgram }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    routineType: 'Yoga Nidra',
    duration: '20 Minutes',
    audioTrack: 'Delta Binaural Waves (0.5 - 4 Hz)',
    bedtimeWindow: '21:00 - 23:00 (Night)',
    description: 'Guided Yoga Nidra body scan designed for rapid sleep onset and deep REM restoration.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a sleep program title', 'warning');
      return;
    }

    const newSleep = {
      id: `SLP-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: formData.title.trim(),
      routineType: formData.routineType,
      duration: formData.duration,
      audioTrack: formData.audioTrack,
      bedtimeWindow: formData.bedtimeWindow,
      description: formData.description.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddSleepProgram) {
      onAddSleepProgram(newSleep);
    }

    showToast(`Sleep Program "${newSleep.title}" created successfully!`, 'success');
    
    // Reset form
    setFormData({
      title: '',
      routineType: 'Yoga Nidra',
      duration: '20 Minutes',
      audioTrack: 'Delta Binaural Waves (0.5 - 4 Hz)',
      bedtimeWindow: '21:00 - 23:00 (Night)',
      description: 'Guided Yoga Nidra body scan designed for rapid sleep onset and deep REM restoration.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Sleep Program"
      subtitle="Configure Yoga Nidra routines, bedtime wind-downs, and insomnia relief protocols"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-400" /> Sleep Program Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Deep Sleep Nidra & Delta Wave Reset"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Routine Type & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Routine Type
            </label>
            <select
              value={formData.routineType}
              onChange={(e) => setFormData({ ...formData, routineType: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Yoga Nidra">Yoga Nidra (Body Scan)</option>
              <option value="Bedtime Wind-Down">Bedtime Wind-Down Stretch</option>
              <option value="Insomnia Relief">Insomnia Relief Protocol</option>
              <option value="Nighttime Breathwork">4-7-8 Nighttime Breathwork</option>
              <option value="Lucid Relaxation">Lucid Relaxation Soundscape</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Session Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="15 Minutes">15 Minutes (Quick Reset)</option>
              <option value="20 Minutes">20 Minutes (Standard Nidra)</option>
              <option value="30 Minutes">30 Minutes (Deep Sleep)</option>
              <option value="45 Minutes (Full Cycle)">45 Minutes (Full Sleep Cycle)</option>
            </select>
          </div>
        </div>

        {/* Audio Track & Bedtime Window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-emerald-500" /> Audio & Delta Frequency
            </label>
            <select
              value={formData.audioTrack}
              onChange={(e) => setFormData({ ...formData, audioTrack: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Delta Binaural Waves (0.5 - 4 Hz)">Delta Binaural Waves (0.5 - 4 Hz)</option>
              <option value="Deep Night Rain & Thunder">Deep Night Rain & Thunder</option>
              <option value="White/Pink Noise Hybrid">White/Pink Noise Hybrid</option>
              <option value="Soft Ambient Harp & Strings">Soft Ambient Harp & Strings</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-indigo-400" /> Recommended Bedtime
            </label>
            <select
              value={formData.bedtimeWindow}
              onChange={(e) => setFormData({ ...formData, bedtimeWindow: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="21:00 - 23:00 (Night)">21:00 - 23:00 (Night)</option>
              <option value="Anytime Insomnia">Anytime Insomnia Alert</option>
              <option value="Post-Work Wind-Down">Post-Work Evening Wind-Down</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Routine Overview & Bedtime Instructions
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe instructions for the sleep audio track..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Create Sleep Program
          </Button>
        </div>
      </form>
    </Modal>
  );
}
