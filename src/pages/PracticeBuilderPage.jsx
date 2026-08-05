import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SavePracticeSequenceModal } from '../components/modals/SavePracticeSequenceModal';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import { Workflow, Plus, Trash2, MoveUp, MoveDown, Save, Wind, Dumbbell, Brain, Moon } from 'lucide-react';

export function PracticeBuilderPage() {
  const { showToast } = useApp();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [timeline, setTimeline] = useState([
    { id: 1, type: 'Breathing', name: 'Box Breathing (4-4-4-4)', duration: '5 min', icon: Wind, color: 'text-cyan-400' },
    { id: 2, type: 'Yoga Pose', name: 'Sun Salutation A (Surya Namaskar)', duration: '10 min', icon: Dumbbell, color: 'text-indigo-400' },
    { id: 3, type: 'Meditation', name: 'Mindful Body Scan', duration: '10 min', icon: Brain, color: 'text-emerald-400' },
    { id: 4, type: 'Savasana', name: 'Deep Relaxation & Sound Bath', duration: '5 min', icon: Moon, color: 'text-amber-400' },
  ]);

  const addBlock = (type, name, duration, icon, color) => {
    const newBlock = { id: Date.now(), type, name, duration, icon, color };
    setTimeline([...timeline, newBlock]);
    showToast(`Added ${name} to sequence`, 'success');
  };

  const removeBlock = (id) => {
    setTimeline(timeline.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newTimeline = [...timeline];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newTimeline.length) return;
    const temp = newTimeline[index];
    newTimeline[index] = newTimeline[targetIndex];
    newTimeline[targetIndex] = temp;
    setTimeline(newTimeline);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Workflow className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> Interactive Practice Builder
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Construct custom practice sequences by combining breathwork, pose flows, meditation, and cooldowns.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={Save}
            className="w-full sm:w-auto"
            onClick={() => setIsSaveModalOpen(true)}
          >
            Save Practice Sequence
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Palette of Items */}
        <Card className="lg:col-span-1 space-y-4">
          <CardHeader>
            <CardTitle subtitle="Click to append modules to timeline">
              Module Library Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => addBlock('Breathing', '4-7-8 Relaxing Breath', '7 min', Wind, 'text-cyan-400')}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Wind className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">4-7-8 Breathwork</p>
                  <p className="text-[10px] text-slate-400">7 mins • Calming</p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-indigo-500" />
            </button>

            <button
              onClick={() => addBlock('Yoga Pose', 'Warrior II & Reverse Warrior', '8 min', Dumbbell, 'text-indigo-400')}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Dumbbell className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Standing Power Flow</p>
                  <p className="text-[10px] text-slate-400">8 mins • Legs & Core</p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-indigo-500" />
            </button>

            <button
              onClick={() => addBlock('Meditation', 'Guided Chakra Balance', '12 min', Brain, 'text-emerald-400')}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Chakra Meditation</p>
                  <p className="text-[10px] text-slate-400">12 mins • Focus</p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-indigo-500" />
            </button>
          </CardContent>
        </Card>

        {/* Right Sequence Timeline Workspace */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader actions={<Badge variant="indigo">{timeline.length} Blocks Total</Badge>}>
            <CardTitle subtitle="Arrange order and adjust segment durations">
              Practice Timeline Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline.map((block, index) => {
              const Icon = block.icon;
              return (
                <div
                  key={block.id}
                  className="p-3.5 sm:p-4 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex flex-col xs:flex-row xs:items-center justify-between gap-3 transition-all"
                >
                  {/* Left Side: Sequence Number, Icon, Category & Title */}
                  <div className="flex items-start xs:items-center gap-3 min-w-0 flex-1">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-500/10 text-indigo-500 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 xs:mt-0">
                      #{index + 1}
                    </span>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${block.color} shrink-0 mt-1 xs:mt-0`} />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {block.type}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {block.name}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Duration & Control Actions */}
                  <div className="flex items-center justify-between xs:justify-end gap-2.5 pt-2 xs:pt-0 border-t xs:border-t-0 border-slate-200/50 dark:border-slate-800/80 shrink-0">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700/50 shrink-0">
                      {block.duration}
                    </span>

                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                      <button
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === timeline.length - 1}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Save Practice Sequence Modal */}
      <SavePracticeSequenceModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        timeline={timeline}
      />
    </div>
  );
}
