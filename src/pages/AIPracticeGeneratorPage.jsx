import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import { Sparkles, Bot, Copy } from 'lucide-react';

export function AIPracticeGeneratorPage() {
  const { showToast } = useApp();
  const [mood, setMood] = useState('Anxious & Tight Neck');
  const [duration, setDuration] = useState('15 Minutes');
  const [intensity, setIntensity] = useState('Gentle Restorative');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSequence, setGeneratedSequence] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const routine = await api.generateAIPractice({
      userPrompt: `Target mood: ${mood}, Intensity: ${intensity}`,
      targetFocus: mood,
      duration,
      difficulty: intensity === 'Gentle Restorative' ? 'Beginner' : 'Intermediate',
      energyLevel: mood.includes('Low Energy') ? 'Low' : 'Balanced',
      connectedDevices: ['Apple Watch Series 9', 'Oura Ring']
    });

    setIsGenerating(false);
    setGeneratedSequence({
      title: routine.title,
      totalDuration: routine.duration,
      difficulty: routine.difficulty,
      blocks: routine.poses ? routine.poses.map((p, i) => ({
        phase: i === 0 ? 'Breathing Warmup' : i === routine.poses.length - 1 ? 'Savasana Cooldown' : 'Core Pose Sequence',
        item: p.name,
        time: p.holdTime
      })) : []
    });
    showToast('AI Yoga Flow Generated successfully via AURA Engine!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-500" /> AI Practice Generator Studio
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Synthesize custom sequence routines using real-time user state parameters and LLM rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Configuration Form */}
        <Card className="lg:col-span-1 space-y-4">
          <CardHeader>
            <CardTitle subtitle="Configure User State & Goal Parameters">
              Generator Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Mood / Biometric State</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Anxious & Tight Neck">Anxious & Tight Neck (High Cortisol)</option>
                <option value="Low Energy Morning">Low Energy Morning (Sluggish)</option>
                <option value="Lower Back Compression">Lower Back L1-L5 Compression</option>
                <option value="Pre-Bed Night Winddown">Pre-Bed Night Winddown (Insomnia)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Session Length</label>
              <div className="grid grid-cols-3 gap-2">
                {['5 Minutes', '15 Minutes', '30 Minutes'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      duration === d
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Intensity Level</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Gentle Restorative">Gentle Restorative (Yin)</option>
                <option value="Moderate Vinyasa Flow">Moderate Vinyasa Flow</option>
                <option value="Power Core Strength">Power Core Strength</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={isGenerating}
              icon={Sparkles}
              onClick={handleGenerate}
            >
              Generate AI Flow Routine
            </Button>
          </CardContent>
        </Card>

        {/* Right: AI Output Preview */}
        <Card className="lg:col-span-2 gradient-border flex flex-col justify-between">
          <CardHeader
            actions={
              generatedSequence && (
                <Button variant="ghost" size="sm" icon={Copy} onClick={() => showToast('Sequence copied to clipboard', 'success')}>
                  Copy Plan
                </Button>
              )
            }
          >
            <CardTitle subtitle="Real-time LLM sequence compilation output">
              Synthesized Routine Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {generatedSequence ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{generatedSequence.title}</h3>
                    <p className="text-xs text-slate-400">Duration: {generatedSequence.totalDuration} • {generatedSequence.difficulty}</p>
                  </div>
                  <Badge variant="emerald">Compiled via Backend AI API</Badge>
                </div>

                <div className="space-y-3">
                  {generatedSequence.blocks.map((b, idx) => (
                    <div key={idx} className="p-4 rounded-xl glass-card-light dark:glass-card-dark border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{b.phase}</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{b.item}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{b.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Bot className="w-12 h-12 mx-auto text-indigo-500 opacity-60 animate-bounce" />
                <p className="font-bold text-slate-700 dark:text-slate-300">Ready to Compile AI Practice</p>
                <p className="text-xs text-slate-500">Select mood and session parameters on the left to trigger generation.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
