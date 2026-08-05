import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Flower2, Sparkles, Clock, Award, Layers, Plus, Check } from 'lucide-react';

export function CreateProgramEntryModal({ isOpen, onClose, title = 'Yoga Programs', category = 'Yoga Programs', onAddEntry }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    level: 'Beginner',
    duration: '3 Weeks (21 Sessions)',
    instructor: 'Master Yogini Ananya',
    description: '',
    status: 'Active Published',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a program entry name', 'warning');
      return;
    }

    const newEntry = {
      id: `PRG-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: formData.name.trim(),
      category: category,
      level: formData.level,
      duration: formData.duration,
      instructor: formData.instructor,
      description: formData.description.trim() || `Comprehensive series designed for ${title}`,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddEntry) {
      onAddEntry(newEntry);
    }

    showToast(`New "${newEntry.name}" entry created successfully!`, 'success');
    
    // Reset
    setFormData({
      name: '',
      level: 'Beginner',
      duration: '3 Weeks (21 Sessions)',
      instructor: 'Master Yogini Ananya',
      description: '',
      status: 'Active Published',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`New ${title} Entry`}
      subtitle={`Configure new series, content modules, and difficulty tracks for ${title}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Entry Name / Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Flower2 className="w-3.5 h-3.5 text-indigo-500" /> Program / Entry Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={`e.g. 21-Day ${title} Series`}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Level / Difficulty & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Target Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Beginner">Beginner Level</option>
              <option value="Intermediate">Intermediate Level</option>
              <option value="Advanced">Advanced Level</option>
              <option value="All Levels">All Levels Welcome</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Series Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 4 Weeks (12 Sessions)"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Instructor & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Instructor / Lead
            </label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="e.g. Master Yogini Ananya"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Publication Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Active Published">Active Published</option>
              <option value="Draft">Save as Draft</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Program Description & Objectives
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={`Describe instructions, benefits, and curriculum for this ${title}...`}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Create Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
