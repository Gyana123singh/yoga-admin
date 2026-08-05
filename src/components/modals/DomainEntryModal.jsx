import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { 
  Building, Heart, Lightbulb, Watch, Calendar, Bell, Music, Mic, 
  Target, Compass, Video, Award, Users2, UserCheck, FileText, Star, 
  BarChart3, Trophy, ShieldCheck, UserCog, History, Code2, ShieldAlert, Plus, Sparkles, Check
} from 'lucide-react';

export function DomainEntryModal({ isOpen, onClose, title, category, onAddEntry }) {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [fieldA, setFieldA] = useState('');
  const [fieldB, setFieldB] = useState('');
  const [description, setDescription] = useState('');

  // Reset inputs when title changes or modal opens
  useEffect(() => {
    setName('');
    setDescription('');
    if (title === 'Office & Desk Yoga') {
      setFieldA('Chair Seated');
      setFieldB('Neck & Upper Back Decompression');
    } else if (title === 'Senior & Gentle Mode') {
      setFieldA('Low Impact Chair');
      setFieldB('Hip & Knee Mobility');
    } else if (title === 'Beginner Pathways') {
      setFieldA('Sun Salutation Foundation');
      setFieldB('Beginner Level 1');
    } else if (title === 'Smartwatch Sync') {
      setFieldA('Apple Watch Series 9/Ultra');
      setFieldB('HRV Telemetry Stream');
    } else if (title === 'Smart Calendar') {
      setFieldA('Daily Habit Schedule');
      setFieldB('07:00 AM EST');
    } else if (title === 'Smart Reminders') {
      setFieldA('Push Notification');
      setFieldB('Daily Inactivity Trigger');
    } else if (title === 'Ambience & Music Library') {
      setFieldA('432Hz Solfeggio Frequency');
      setFieldB('Tibetan Singing Bowls & Nature Rain');
    } else if (title === 'Voice & Synthesizers') {
      setFieldA('Maya (Calm Female Voice)');
      setFieldB('Neural Pitch Modulated');
    } else if (title === 'Wellness Goals') {
      setFieldA('Stress & Cortisol Reduction');
      setFieldB('Target HRV > 75 ms');
    } else if (title === 'Onboarding Config') {
      setFieldA('Biometric & Health Questionnaire');
      setFieldB('Step 1 of 4');
    } else if (title === 'Live Stream Classes') {
      setFieldA('Master Yogini Ananya');
      setFieldB('500 Max Capacity');
    } else if (title === 'Experts & Teachers') {
      setFieldA('Certified Yoga Guru & Physiotherapist');
      setFieldB('10+ Years Experience');
    } else if (title === 'Community & Groups') {
      setFieldA('Morning Vinyasa Challenge');
      setFieldB('1,200 Active Members');
    } else if (title === 'Family Profiles') {
      setFieldA('Family Household Subscription');
      setFieldB('Up to 5 Sub-Accounts');
    } else if (title === 'CMS & Blogs') {
      setFieldA('Wellness & Mindful Living');
      setFieldB('Published');
    } else if (title === 'Reviews & Feedback') {
      setFieldA('App Store 5-Star Review');
      setFieldB('High Satisfaction Score');
    } else if (title === 'Advanced Analytics') {
      setFieldA('30-Day Cohort Retention');
      setFieldB('MRR Growth Metric');
    } else if (title === 'Wellness Reports') {
      setFieldA('Monthly Patient Health Statement');
      setFieldB('PDF & CSV Export');
    } else if (title === 'Roles & RBAC') {
      setFieldA('Instructor Admin Role');
      setFieldB('Full Access Control');
    } else if (title === 'Admins & Team') {
      setFieldA('Senior Platform Administrator');
      setFieldB('2FA Enabled');
    } else if (title === 'System Audit Logs') {
      setFieldA('Security Authorization Alert');
      setFieldB('Info Severity');
    } else if (title === 'API & AI Keys') {
      setFieldA('OpenAI GPT-4o Key Token');
      setFieldB('Production Environment');
    } else if (title === 'Safety Center') {
      setFieldA('Medical Disclaimer Protocol');
      setFieldB('Emergency Contraindication Rule');
    } else {
      setFieldA('Standard Setting');
      setFieldB('Active Published');
    }
  }, [title, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(`Please enter a valid title for ${title}`, 'warning');
      return;
    }

    const newEntry = {
      id: `MOD-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: name.trim(),
      fieldA,
      fieldB,
      description: description.trim() || `Configured entry for ${title}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddEntry) {
      onAddEntry(newEntry);
    }

    showToast(`New "${newEntry.name}" entry created for ${title}!`, 'success');
    onClose();
  };

  const getIcon = () => {
    switch (title) {
      case 'Office & Desk Yoga': return Building;
      case 'Senior & Gentle Mode': return Heart;
      case 'Beginner Pathways': return Lightbulb;
      case 'Smartwatch Sync': return Watch;
      case 'Smart Calendar': return Calendar;
      case 'Smart Reminders': return Bell;
      case 'Ambience & Music Library': return Music;
      case 'Voice & Synthesizers': return Mic;
      case 'Wellness Goals': return Target;
      case 'Onboarding Config': return Compass;
      case 'Live Stream Classes': return Video;
      case 'Experts & Teachers': return Award;
      case 'Community & Groups': return Users2;
      case 'Family Profiles': return UserCheck;
      case 'CMS & Blogs': return FileText;
      case 'Reviews & Feedback': return Star;
      case 'Advanced Analytics': return BarChart3;
      case 'Wellness Reports': return Trophy;
      case 'Roles & RBAC': return ShieldCheck;
      case 'Admins & Team': return UserCog;
      case 'System Audit Logs': return History;
      case 'API & AI Keys': return Code2;
      case 'Safety Center': return ShieldAlert;
      default: return Sparkles;
    }
  };

  const IconComp = getIcon();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create New ${title} Entry`}
      subtitle={`Configure parameters, rules, and telemetry for ${title}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Entry Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <IconComp className="w-3.5 h-3.5 text-indigo-500" /> Entry Title / Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. New ${title} Configuration`}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Dynamic Parameter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Primary Setting / Type
            </label>
            <input
              type="text"
              value={fieldA}
              onChange={(e) => setFieldA(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Target Parameter / Scope
            </label>
            <input
              type="text"
              value={fieldB}
              onChange={(e) => setFieldB(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Description / Instructions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Module Description & Instructions
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Describe rules or instructions for ${title}...`}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Create {title} Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
