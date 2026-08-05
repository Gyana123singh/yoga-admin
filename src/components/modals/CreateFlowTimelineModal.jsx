import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Sliders, Sparkles, Clock, Activity, Music, Layers, Plus } from 'lucide-react';

export function CreateFlowTimelineModal({ isOpen, onClose, onAddFlowTimeline }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    transitionCurve: 'Ease-In-Out Smooth',
    fps: '60 FPS (Ultra Smooth)',
    holdSeconds: '15',
    audioSync: 'Inhale/Exhale Breath Pacing',
    notes: 'Smooth 3D avatar transition with 4-second inhale curve and 6-second pose hold.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a flow timeline title', 'warning');
      return;
    }

    const newFlow = {
      id: `FLW-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: formData.title.trim(),
      transitionCurve: formData.transitionCurve,
      fps: formData.fps,
      holdSeconds: `${formData.holdSeconds}s`,
      audioSync: formData.audioSync,
      notes: formData.notes.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddFlowTimeline) {
      onAddFlowTimeline(newFlow);
    }

    showToast(`Flow Timeline "${newFlow.title}" created successfully!`, 'success');
    
    // Reset form
    setFormData({
      title: '',
      transitionCurve: 'Ease-In-Out Smooth',
      fps: '60 FPS (Ultra Smooth)',
      holdSeconds: '15',
      audioSync: 'Inhale/Exhale Breath Pacing',
      notes: 'Smooth 3D avatar transition with 4-second inhale curve and 6-second pose hold.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Flow Timeline Animation"
      subtitle="Set up pose transition timings, 3D keyframe rates, and audio sync cues"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Timeline Sequence Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Vinyasa Sun Salutation B Keyframe Sync"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Transition Curve & Keyframe FPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-500" /> Transition Curve
            </label>
            <select
              value={formData.transitionCurve}
              onChange={(e) => setFormData({ ...formData, transitionCurve: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Ease-In-Out Smooth">Ease-In-Out Smooth</option>
              <option value="Breath-Guided Cadence">Breath-Guided Cadence</option>
              <option value="Linear (Constant Speed)">Linear (Constant Speed)</option>
              <option value="Spring Bounce Dynamics">Spring Bounce Dynamics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> 3D Keyframe Rate
            </label>
            <select
              value={formData.fps}
              onChange={(e) => setFormData({ ...formData, fps: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="60 FPS (Ultra Smooth)">60 FPS (Ultra Smooth)</option>
              <option value="30 FPS (Standard)">30 FPS (Standard)</option>
              <option value="120 FPS (High Precision)">120 FPS (High Precision)</option>
            </select>
          </div>
        </div>

        {/* Hold Seconds & Audio Sync */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Default Hold (Seconds)
            </label>
            <input
              type="number"
              min="1"
              value={formData.holdSeconds}
              onChange={(e) => setFormData({ ...formData, holdSeconds: e.target.value })}
              placeholder="e.g. 15"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-emerald-500" /> Audio Sync Mode
            </label>
            <select
              value={formData.audioSync}
              onChange={(e) => setFormData({ ...formData, audioSync: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Inhale/Exhale Breath Pacing">Inhale/Exhale Breath Pacing</option>
              <option value="Binaural Beat Pulse Sync">Binaural Beat Pulse Sync</option>
              <option value="Manual Timestamp Keyframes">Manual Timestamp Keyframes</option>
            </select>
          </div>
        </div>

        {/* Animation Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Keyframe Rules & Animation Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Describe keyframe transition rules..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Save Flow Timeline
          </Button>
        </div>
      </form>
    </Modal>
  );
}
