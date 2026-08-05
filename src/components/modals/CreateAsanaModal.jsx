import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Dumbbell, Sparkles, Image, Box, AlertTriangle, Layers, Plus } from 'lucide-react';

export function CreateAsanaModal({ isOpen, onClose, onAddAsana }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    englishName: '',
    sanskritName: '',
    category: 'Standing / Power',
    difficulty: 'Beginner',
    targetMuscles: 'Spine, Glutes, Chest, Deltoids',
    benefits: 'Strengthens spine, opens heart space, and stimulates abdominal organs.',
    contraindications: 'Back injury, pregnancy, carpal tunnel syndrome.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    pose3dAvailable: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.englishName.trim() || !formData.sanskritName.trim()) {
      showToast('Please enter both English and Sanskrit names', 'warning');
      return;
    }

    const newPose = {
      id: `ASN-${Math.floor(Math.random() * 90 + 10)}`,
      englishName: formData.englishName.trim(),
      sanskritName: formData.sanskritName.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      targetMuscles: formData.targetMuscles.split(',').map((m) => m.trim()).filter(Boolean),
      benefits: formData.benefits.trim(),
      contraindications: formData.contraindications.trim(),
      instructions: [
        'Begin in a stable neutral foundation alignment.',
        'Engage core and lift spine smoothly with controlled breath.',
        'Maintain soft gaze forward and relax shoulders away from ears.',
        'Hold for 5 to 10 deep breathing counts.',
      ],
      equipment: ['Yoga Mat'],
      imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
      pose3dAvailable: formData.pose3dAvailable,
    };

    if (onAddAsana) {
      onAddAsana(newPose);
    }

    showToast(`Pose "${newPose.englishName}" added to library successfully!`, 'success');
    
    // Reset form
    setFormData({
      englishName: '',
      sanskritName: '',
      category: 'Standing / Power',
      difficulty: 'Beginner',
      targetMuscles: 'Spine, Glutes, Chest, Deltoids',
      benefits: 'Strengthens spine, opens heart space, and stimulates abdominal organs.',
      contraindications: 'Back injury, pregnancy, carpal tunnel syndrome.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
      pose3dAvailable: true,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Pose to Asana Library"
      subtitle="Catalog Sanskrit nomenclature, target muscles, 3D assets, and medical guidelines"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-indigo-500" /> English Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.englishName}
              onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
              placeholder="e.g. Cobra Pose"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Sanskrit Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.sanskritName}
              onChange={(e) => setFormData({ ...formData, sanskritName: e.target.value })}
              placeholder="e.g. Bhujangasana"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Standing / Power">Standing / Power</option>
              <option value="Inversion / Stretch">Inversion / Stretch</option>
              <option value="Balance">Balance</option>
              <option value="Hip Opener / Backbend">Hip Opener / Backbend</option>
              <option value="Restorative / Floor">Restorative / Floor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Difficulty Level
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Target Muscles */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Target Muscle Groups (comma separated)
          </label>
          <input
            type="text"
            value={formData.targetMuscles}
            onChange={(e) => setFormData({ ...formData, targetMuscles: e.target.value })}
            placeholder="e.g. Spine, Glutes, Chest, Deltoids"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Image URL & 3D Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-indigo-500" /> Image Cover URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-2 pb-2.5">
            <input
              type="checkbox"
              id="pose3d"
              checked={formData.pose3dAvailable}
              onChange={(e) => setFormData({ ...formData, pose3dAvailable: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="pose3d" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer">
              <Box className="w-3.5 h-3.5 text-cyan-400" /> 3D Animated
            </label>
          </div>
        </div>

        {/* Benefits & Contraindications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Therapeutic Benefits
            </label>
            <textarea
              rows={2}
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Contraindications
            </label>
            <textarea
              rows={2}
              value={formData.contraindications}
              onChange={(e) => setFormData({ ...formData, contraindications: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Save Asana
          </Button>
        </div>
      </form>
    </Modal>
  );
}
