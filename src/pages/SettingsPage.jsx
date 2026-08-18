import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Tabs } from '../components/common/Tabs';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import { Settings, Key, Sliders, ShieldCheck, Save, Eye, EyeOff } from 'lucide-react';

export function SettingsPage() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('ai-keys');
  const [showKey, setShowKey] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Yoga Prana Fitness & Mindfulness Platform',
    aiModelVersion: 'v2.4-NeuralFlow',
    razorpayKeyConfig: 'rzp_test_51Pq349YogaKey2026',
    healthKitEnabled: true,
    telemetrySyncInterval: '15 mins',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await api.getSettings();
      if (data) setSettings(data);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await api.updateSettings(settings);
    setIsSaving(false);
    showToast('Platform Settings saved successfully to Backend!', 'success');
  };

  const tabs = [
    { id: 'ai-keys', label: 'AI & Payment Gateway Keys', icon: Key },
    { id: 'general', label: 'Platform Branding', icon: Sliders },
    { id: 'security', label: 'Security & Roles', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> Platform System Settings
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage LLM model API keys, Razorpay payment credentials, branding theme tokens, and security policies.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="primary" icon={Save} loading={isSaving} className="w-full sm:w-auto" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'ai-keys' && (
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle subtitle="Configure generative practice models & payment gateway credentials">
              AI & Payment Gateway Configurations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Razorpay Key ID (Payment Gateway)</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.razorpayKeyConfig || ''}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyConfig: e.target.value })}
                  className="w-full pl-4 pr-10 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">AI Neural Model Version</label>
              <input
                type="text"
                value={settings.aiModelVersion || ''}
                onChange={(e) => setSettings({ ...settings, aiModelVersion: e.target.value })}
                className="w-full px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'general' && (
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle subtitle="Custom branding, primary HSL accent tokens, and email templates">
              Branding & Aesthetics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Platform Name</label>
                <input
                  type="text"
                  value={settings.siteName || ''}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value="#4F46E5" readOnly className="w-10 h-10 rounded-lg cursor-pointer bg-transparent" />
                  <input type="text" value="#4F46E5" readOnly className="w-full px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
