import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Bot, Sparkles, Cpu, MessageSquare, ShieldCheck, Plus } from 'lucide-react';

export function CreateAICoachModal({ isOpen, onClose, onAddAICoach }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Yoga Alignment & Form Correction',
    model: 'AURA AI v2.4 (Fine-Tuned)',
    tone: 'Empathetic & Calm',
    disclaimer: 'Standard Non-Medical Wellness Disclaimer Enabled',
    systemPrompt: 'You are Guru Maya, an empathetic AI Yoga & Alignment Coach. Guide users safely through posture adjustments using positive breathwork cues.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter an AI Coach persona name', 'warning');
      return;
    }

    const newCoach = {
      id: `AIC-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: formData.name.trim(),
      specialization: formData.specialization,
      model: formData.model,
      tone: formData.tone,
      disclaimer: formData.disclaimer,
      systemPrompt: formData.systemPrompt.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddAICoach) {
      onAddAICoach(newCoach);
    }

    showToast(`AI Coach "${newCoach.name}" deployed successfully!`, 'success');
    
    // Reset form
    setFormData({
      name: '',
      specialization: 'Yoga Alignment & Form Correction',
      model: 'AURA AI v2.4 (Fine-Tuned)',
      tone: 'Empathetic & Calm',
      disclaimer: 'Standard Non-Medical Wellness Disclaimer Enabled',
      systemPrompt: 'You are Guru Maya, an empathetic AI Yoga & Alignment Coach. Guide users safely through posture adjustments using positive breathwork cues.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure AI Coach Persona & Rules"
      subtitle="Set up AI assistant personas, posture correction guidelines, and chat rule parameters"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Persona Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-indigo-500" /> AI Coach Persona Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Guru Maya - Spine Alignment & Mindfulness"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Specialization & Base LLM Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Specialization Track
            </label>
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Yoga Alignment & Form Correction">Yoga Alignment & Form Correction</option>
              <option value="Biometric HRV & Stress Coach">Biometric HRV & Stress Coach</option>
              <option value="Sleep Nidra Guide">Sleep Nidra Guide</option>
              <option value="Breathwork & Prana Specialist">Breathwork & Prana Specialist</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Underlying LLM Model
            </label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="AURA AI v2.4 (Fine-Tuned)">AURA AI v2.4 (Fine-Tuned)</option>
              <option value="GPT-4o Wellness Agent">GPT-4o Wellness Agent</option>
              <option value="Claude 3.5 Sonnet Medical Agent">Claude 3.5 Sonnet Medical Agent</option>
            </select>
          </div>
        </div>

        {/* Tone & Medical Disclaimer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Conversational Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Empathetic & Calm">Empathetic & Calm</option>
              <option value="Encouraging & Energetic">Encouraging & Energetic</option>
              <option value="Clinical & Precise">Clinical & Precise</option>
              <option value="Traditional Vedic Guru">Traditional Vedic Guru</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Safety Disclaimer
            </label>
            <input
              type="text"
              value={formData.disclaimer}
              onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* System Prompt Instructions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            System Prompt Instructions & Constraints
          </label>
          <textarea
            rows={3}
            value={formData.systemPrompt}
            onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
            placeholder="Define the LLM system prompt instructions..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Deploy AI Coach
          </Button>
        </div>
      </form>
    </Modal>
  );
}
