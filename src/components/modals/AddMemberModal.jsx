import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { User, Mail, Shield, Flame, Watch, Globe, Target, Activity, Plus, Check } from 'lucide-react';

export function AddMemberModal({ isOpen, onClose, onAddMember }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    planType: 'Premium',
    plan: 'Pro Annual ($149/yr)',
    country: 'United States',
    primaryGoal: 'Stress & Back Pain Relief',
    devicesConnected: ['Apple Watch Series 9'],
    streak: 1,
    hrvAvg: '68 ms',
    status: 'Active',
  });

  const availableDevices = [
    'Apple Watch Series 9',
    'Garmin Fenix 7 Pro',
    'Oura Ring Gen 3',
    'Pixel Watch 2',
    'Fitbit Sense 2',
  ];

  const handleDeviceToggle = (device) => {
    setFormData((prev) => {
      const exists = prev.devicesConnected.includes(device);
      return {
        ...prev,
        devicesConnected: exists
          ? prev.devicesConnected.filter((d) => d !== device)
          : [...prev.devicesConnected, device],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Please fill in required name and email fields', 'warning');
      return;
    }

    const newMember = {
      id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
      plan: formData.plan,
      planType: formData.planType,
      status: formData.status,
      joinedDate: new Date().toISOString().split('T')[0],
      streak: Number(formData.streak) || 1,
      totalMinutes: 120,
      primaryGoal: formData.primaryGoal,
      devicesConnected: formData.devicesConnected,
      lastSession: 'Just joined now',
      hrvAvg: formData.hrvAvg || '65 ms',
      sleepScore: '85/100',
      country: formData.country,
      language: 'English',
      aiPromptsCount: 0,
    };

    if (onAddMember) {
      onAddMember(newMember);
    }
    showToast(`Member "${newMember.name}" successfully added!`, 'success');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      planType: 'Premium',
      plan: 'Pro Annual ($149/yr)',
      country: 'United States',
      primaryGoal: 'Stress & Back Pain Relief',
      devicesConnected: ['Apple Watch Series 9'],
      streak: 1,
      hrvAvg: '68 ms',
      status: 'Active',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Platform Member"
      subtitle="Register a new member profile into the AURA AI Yoga & Health Directory"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ananya Sharma"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. ananya@aura.io"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Subscription Plan & Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" /> Plan Type
            </label>
            <select
              value={formData.planType}
              onChange={(e) => {
                const pType = e.target.value;
                setFormData({
                  ...formData,
                  planType: pType,
                  plan: pType === 'Premium' ? 'Pro Annual ($149/yr)' : 'Starter Free',
                });
              }}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Premium">Premium Tier</option>
              <option value="Free">Free Tier</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Subscription Package
            </label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {formData.planType === 'Premium' ? (
                <>
                  <option value="Pro Annual ($149/yr)">Pro Annual ($149/yr)</option>
                  <option value="Monthly Pro ($14.99/mo)">Monthly Pro ($14.99/mo)</option>
                  <option value="Pro Lifetime ($499)">Pro Lifetime ($499)</option>
                </>
              ) : (
                <option value="Starter Free">Starter Free</option>
              )}
            </select>
          </div>
        </div>

        {/* Primary Goal & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-500" /> Primary Health Goal
            </label>
            <select
              value={formData.primaryGoal}
              onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Stress & Back Pain Relief">Stress & Back Pain Relief</option>
              <option value="Core Strength & Flexibility">Core Strength & Flexibility</option>
              <option value="Better Sleep & Relaxation">Better Sleep & Relaxation</option>
              <option value="Mindfulness & HRV Optimization">Mindfulness & HRV Optimization</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" /> Country / Region
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="United States">United States 🇺🇸</option>
              <option value="United Kingdom">United Kingdom 🇬🇧</option>
              <option value="Germany">Germany 🇩🇪</option>
              <option value="Canada">Canada 🇨🇦</option>
              <option value="Australia">Australia 🇦🇺</option>
              <option value="Japan">Japan 🇯🇵</option>
              <option value="France">France 🇫🇷</option>
              <option value="India">India 🇮🇳</option>
            </select>
          </div>
        </div>

        {/* Connected Wearables Multi-Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Watch className="w-3.5 h-3.5 text-cyan-400" /> Connected Wearable Devices
          </label>
          <div className="flex flex-wrap gap-2">
            {availableDevices.map((dev) => {
              const isSelected = formData.devicesConnected.includes(dev);
              return (
                <button
                  key={dev}
                  type="button"
                  onClick={() => handleDeviceToggle(dev)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {dev}
                </button>
              );
            })}
          </div>
        </div>

        {/* Streak, HRV & Account Status */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Streak Days
            </label>
            <input
              type="number"
              min="0"
              value={formData.streak}
              onChange={(e) => setFormData({ ...formData, streak: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500" /> Avg HRV
            </label>
            <input
              type="text"
              value={formData.hrvAvg}
              onChange={(e) => setFormData({ ...formData, hrvAvg: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Add Member
          </Button>
        </div>
      </form>
    </Modal>
  );
}
