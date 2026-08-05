import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Plane, Sparkles, Clock, Globe, Shield, Plus } from 'lucide-react';

export function CreateTravelModeModal({ isOpen, onClose, onAddTravelMode }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    setting: 'Hotel Room Bedside',
    focus: 'Jet Lag & Circadian Reset',
    duration: '10 Minutes',
    noEquipment: '100% No Equipment Needed',
    description: 'Post-flight spinal decompression and ankle mobility flow designed for hotel room space.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a travel routine title', 'warning');
      return;
    }

    const newTravel = {
      id: `TRV-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: formData.title.trim(),
      setting: formData.setting,
      focus: formData.focus,
      duration: formData.duration,
      noEquipment: formData.noEquipment,
      description: formData.description.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddTravelMode) {
      onAddTravelMode(newTravel);
    }

    showToast(`Travel Routine "${newTravel.title}" created successfully!`, 'success');
    
    // Reset form
    setFormData({
      title: '',
      setting: 'Hotel Room Bedside',
      focus: 'Jet Lag & Circadian Reset',
      duration: '10 Minutes',
      noEquipment: '100% No Equipment Needed',
      description: 'Post-flight spinal decompression and ankle mobility flow designed for hotel room space.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Travel Mode Routine"
      subtitle="Configure no-equipment hotel room & airport terminal travel wellness flows"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-indigo-500" /> Travel Routine Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. 10-Min Long-Haul Flight Jet Lag Relief"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Setting & Primary Focus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" /> Travel Setting
            </label>
            <select
              value={formData.setting}
              onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Hotel Room Bedside">Hotel Room Bedside</option>
              <option value="Airport Terminal Gate">Airport Terminal Gate</option>
              <option value="Airplane In-Seat Stretch">Airplane In-Seat Stretch</option>
              <option value="Train / Bus Commute">Train / Bus Commute</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Primary Focus
            </label>
            <select
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Jet Lag & Circadian Reset">Jet Lag & Circadian Reset</option>
              <option value="DVT Prevention & Ankle Rolls">DVT Prevention & Ankle Rolls</option>
              <option value="Lower Back Flight Tension">Lower Back Flight Tension</option>
              <option value="Travel Anxiety Relief">Travel Anxiety Relief</option>
            </select>
          </div>
        </div>

        {/* Target Duration & Equipment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Target Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="5 Minutes">5 Minutes (Quick Gate Reset)</option>
              <option value="10 Minutes">10 Minutes (Standard Travel Flow)</option>
              <option value="15 Minutes">15 Minutes (Hotel Room Deep Reset)</option>
              <option value="20 Minutes">20 Minutes (Full Post-Flight Routine)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Equipment Guarantee
            </label>
            <input
              type="text"
              readOnly
              value={formData.noEquipment}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Routine Overview & Space Requirements
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe instructions and posture steps..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Create Travel Routine
          </Button>
        </div>
      </form>
    </Modal>
  );
}
