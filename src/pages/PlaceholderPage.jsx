import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CreateProgramEntryModal } from '../components/modals/CreateProgramEntryModal';
import { CreateMeditationModal } from '../components/modals/CreateMeditationModal';
import { CreateSleepProgramModal } from '../components/modals/CreateSleepProgramModal';
import { CreateQuickPracticeModal } from '../components/modals/CreateQuickPracticeModal';
import { CreateAICoachModal } from '../components/modals/CreateAICoachModal';
import { CreateFlowTimelineModal } from '../components/modals/CreateFlowTimelineModal';
import { CreateTravelModeModal } from '../components/modals/CreateTravelModeModal';
import { DomainEntryModal } from '../components/modals/DomainEntryModal';
import { api, BACKEND_URL } from '../services/api';
import { Sparkles, Flower2, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function PlaceholderPage({ title, description, icon: Icon = Flower2, category = 'Module Workspace' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> {category}
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> {title}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {description || `Manage and configure settings and analytics for ${title}.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={Plus}
            className="w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            New {title} Entry
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card gradientBorder>
          <CardHeader actions={<Badge variant="emerald">Operational</Badge>}>
            <CardTitle subtitle="Active System Metrics">{title} Active Streams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">1,420</h3>
            <p className="text-xs text-slate-400">Total active configurations in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader actions={<Badge variant="indigo">+14.2%</Badge>}>
            <CardTitle subtitle="User Engagement Rate">Monthly Usage Index</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h3 className="text-3xl font-extrabold text-indigo-500">94.8%</h3>
            <p className="text-xs text-slate-400">High satisfaction score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader actions={<Badge variant="cyan">AI Synced</Badge>}>
            <CardTitle subtitle="Rule Telemetry">Auto Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h3 className="text-3xl font-extrabold text-cyan-400">Active</h3>
            <p className="text-xs text-slate-400">Continuous background sync enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Panel */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" /> {title} Control Center & Analytics
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          This dedicated workspace provides end-to-end administration tools, rule customization, telemetry logging, and user feedback monitoring tailored for <strong>{title}</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {['Automated AI Sequence Optimization', 'Export Data Reports to CSV/JSON', 'Real-time Telemetry Telepath Logs', 'Custom Rule Priority Weighting'].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Dynamic Modals */}
      {title === 'Meditation Library' ? (
        <CreateMeditationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : title === 'Sleep Programs' ? (
        <CreateSleepProgramModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : title === 'Quick Practice Engine' ? (
        <CreateQuickPracticeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : title === 'AI Coach & Assistant' ? (
        <CreateAICoachModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : title === 'Flow Timeline Builder' ? (
        <CreateFlowTimelineModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : title === 'Travel Mode' ? (
        <CreateTravelModeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : title === 'Yoga Programs' ? (
        <CreateProgramEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          category={category}
        />
      ) : (
        <DomainEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          category={category}
        />
      )}
    </div>
  );
}
