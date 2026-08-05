import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { useApp } from '../../context/AppContext';
import {
  User,
  HeartPulse,
  Watch,
  Flame,
  Award,
  Activity,
  ShieldAlert,
  Calendar,
  Sparkles,
  Clock,
  Globe,
  Trash2,
  Ban
} from 'lucide-react';

export function UserProfileDrawer() {
  const { selectedUser, setSelectedUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedUser) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'telemetry', label: 'Health & Watch', icon: HeartPulse },
    { id: 'practice', label: 'Practice History', icon: Activity },
    { id: 'achievements', label: 'Badges', icon: Award },
  ];

  return (
    <Drawer
      isOpen={!!selectedUser}
      onClose={() => setSelectedUser(null)}
      title="User Profile Analytics"
      subtitle={`ID: ${selectedUser.id}`}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        {/* User Header Card */}
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedUser.name}
              </h3>
              <Badge variant={selectedUser.status === 'Active' ? 'emerald' : 'rose'}>
                {selectedUser.status}
              </Badge>
              <Badge variant="indigo">
                {selectedUser.planType}
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {selectedUser.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> {selectedUser.country}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {selectedUser.streak} Day Streak
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {selectedUser.totalMinutes} Mins Total
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Primary Wellness Goal</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedUser.primaryGoal}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Subscription Plan</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">{selectedUser.plan}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-400 uppercase font-semibold">AI Assistant Telemetry</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Total Custom AI Flow Prompts:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.aiPromptsCount} prompts</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Last Practice Session:</span>
                <span className="font-semibold text-slate-500">{selectedUser.lastSession}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <HeartPulse className="w-4 h-4" /> Average HRV
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedUser.hrvAvg}</p>
                <p className="text-xs text-slate-400 mt-0.5">Optimal parasympathetic range</p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                  <Activity className="w-4 h-4" /> Sleep Quality Index
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedUser.sleepScore}</p>
                <p className="text-xs text-slate-400 mt-0.5">Deep & REM cycles tracked</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Connected Devices & Wearables</p>
              <div className="space-y-2">
                {selectedUser.devicesConnected.length > 0 ? (
                  selectedUser.devicesConnected.map((dev, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span className="flex items-center gap-2">
                        <Watch className="w-4 h-4 text-indigo-500" /> {dev}
                      </span>
                      <Badge variant="emerald" size="sm">Synced Live</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No smartwatch devices paired.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            icon={Ban}
            onClick={() => showToast(`User ${selectedUser.name} suspended`, 'warning')}
          >
            Suspend User
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => {
              showToast(`User ${selectedUser.name} removed`, 'danger');
              setSelectedUser(null);
            }}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
