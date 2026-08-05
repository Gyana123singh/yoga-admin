import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Brain, Sparkles, Clock, Mic, Music, Volume2, Plus } from 'lucide-react';

export function CreateMeditationModal({ isOpen, onClose, onAddMeditation }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Stress & Anxiety',
    duration: '15 Minutes',
    voiceGuide: 'Voice 01 (Calm Female - Maya)',
    ambientTrack: 'Delta Binaural Beats (432Hz)',
    description: 'Guided mindfulness meditation designed to lower cortisol and soothe the nervous system.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a meditation session title', 'warning');
      return;
    }

    const newMeditation = {
      id: `MED-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: formData.title.trim(),
      category: formData.category,
      duration: formData.duration,
      voiceGuide: formData.voiceGuide,
      ambientTrack: formData.ambientTrack,
      description: formData.description.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddMeditation) {
      onAddMeditation(newMeditation);
    }

    showToast(`Meditation "${newMeditation.title}" created successfully!`, 'success');
    
    // Reset form
    setFormData({
      title: '',
      category: 'Stress & Anxiety',
      duration: '15 Minutes',
      voiceGuide: 'Voice 01 (Calm Female - Maya)',
      ambientTrack: 'Delta Binaural Beats (432Hz)',
      description: 'Guided mindfulness meditation designed to lower cortisol and soothe the nervous system.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Meditation Session"
      subtitle="Configure mindfulness audio tracks, ambient soundscapes, and voice guides"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-500" /> Meditation Session Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Vagus Nerve Reset & Sound Bath"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Category & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Mindfulness Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Stress & Anxiety">Stress & Anxiety</option>
              <option value="Deep Sleep & Nidra">Deep Sleep & Nidra</option>
              <option value="Focus & Productivity">Focus & Productivity</option>
              <option value="Emotional Healing">Emotional Healing</option>
              <option value="Spiritual Balance">Spiritual Balance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Target Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="5 Minutes">5 Minutes (Express)</option>
              <option value="10 Minutes">10 Minutes (Standard)</option>
              <option value="15 Minutes">15 Minutes (Deep)</option>
              <option value="20 Minutes">20 Minutes (Extended)</option>
              <option value="30 Minutes">30 Minutes (Masterclass)</option>
            </select>
          </div>
        </div>

        {/* Voice Guide & Ambient Soundscape */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-500" /> Voice Narrator
            </label>
            <select
              value={formData.voiceGuide}
              onChange={(e) => setFormData({ ...formData, voiceGuide: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Voice 01 (Calm Female - Maya)">Voice 01 (Calm Female - Maya)</option>
              <option value="Voice 02 (Gentle Female - Priya)">Voice 02 (Gentle Female - Priya)</option>
              <option value="Voice 03 (Deep Male - Julian)">Voice 03 (Deep Male - Julian)</option>
              <option value="Ambient Only (No Voice)">Ambient Only (No Voice)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-emerald-500" /> Ambient Track / Frequency
            </label>
            <select
              value={formData.ambientTrack}
              onChange={(e) => setFormData({ ...formData, ambientTrack: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Delta Binaural Beats (432Hz)">Delta Binaural Beats (432Hz)</option>
              <option value="Tibetan Singing Bowls">Tibetan Singing Bowls</option>
              <option value="Gentle Forest Rain">Gentle Forest Rain</option>
              <option value="Ocean Waves & Soft Wind">Ocean Waves & Soft Wind</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Session Description & Script
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter instructions, breathing prompts, or visualization script..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Create Meditation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
