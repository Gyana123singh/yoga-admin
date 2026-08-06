import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Smile,
  Target,
  Clock,
  RefreshCw,
  Layers,
  Video,
  Upload,
  Play,
  Zap,
  Radio,
  X
} from 'lucide-react';

export function DailyNeedManagerPage() {
  const { showToast } = useApp();

  // Admin Data States
  const [feelings, setFeelings] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const [durations, setDurations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quickPractices, setQuickPractices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feelings');

  // Admin Form Modals
  const [feelingForm, setFeelingForm] = useState({ open: false, isEdit: false, id: null, name: '', emoji: '😊', description: '' });
  const [focusForm, setFocusForm] = useState({ open: false, isEdit: false, id: null, name: '', icon: 'target', relatedFeelings: [] });
  const [durationForm, setDurationForm] = useState({ open: false, isEdit: false, id: null, label: '', minutes: 15 });
  const [sessionForm, setSessionForm] = useState({ open: false, feeling: 'Calm', focusArea: 'Belly / Core strength', durationMinutes: 20, title: '', stepsText: '' });
  const [videoForm, setVideoForm] = useState({ open: false, title: '', feeling: 'Calm', focusArea: 'Belly / Core strength', stepTitle: '1. Breath Preparation', videoUrlCustom: '', file: null });
  const [quickPracticeForm, setQuickPracticeForm] = useState({
    open: false,
    isEdit: false,
    id: null,
    title: '',
    subtitle: '',
    category: 'quick_timer',
    icon: 'clock',
    durationMinutes: 2,
    badgeText: 'Quick Practice Session',
    bgImageUrl: '',
    frameDesignUrl: '',
    bgMusicUrl: '',
    voiceGuidanceUrl: ''
  });

  // Initial Load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    const data = await api.getDailyNeedsConfig();
    if (data) {
      if (data.feelings && data.feelings.length > 0) setFeelings(data.feelings);
      if (data.focusAreas && data.focusAreas.length > 0) setFocusAreas(data.focusAreas);
      if (data.durations && data.durations.length > 0) setDurations(data.durations);
      if (data.sessions && data.sessions.length > 0) setSessions(data.sessions);
    }

    // Fetch Uploaded Videos with Local & Live auto-failover
    const videoList = await api.getVideos();
    if (videoList) setVideos(videoList);

    // Fetch Quick Practices & SOS Breathing items
    const qpData = await api.getQuickPractices();
    if (qpData && qpData.all) setQuickPractices(qpData.all);

    setIsLoading(false);
  };

  // Admin Feeling Actions
  const handleSaveFeeling = async (e) => {
    e.preventDefault();
    if (feelingForm.isEdit) {
      const updated = await api.updateFeeling(feelingForm.id, { name: feelingForm.name, emoji: feelingForm.emoji, description: feelingForm.description });
      setFeelings((prev) => prev.map((f) => (f._id === feelingForm.id ? updated : f)));
      showToast(`Feeling "${feelingForm.name}" updated`, 'success');
    } else {
      const created = await api.createFeeling({ name: feelingForm.name, emoji: feelingForm.emoji, description: feelingForm.description, order: feelings.length + 1 });
      setFeelings((prev) => [...prev, created]);
      showToast(`Feeling "${feelingForm.name}" created`, 'success');
    }
    setFeelingForm({ open: false, isEdit: false, id: null, name: '', emoji: '😊', description: '' });
  };

  const handleDeleteFeeling = async (id, name) => {
    await api.deleteFeeling(id);
    setFeelings((prev) => prev.filter((f) => f._id !== id && f.id !== id));
    showToast(`Feeling "${name}" deleted`, 'info');
  };

  // Admin Focus Area Actions
  const handleSaveFocusArea = async (e) => {
    e.preventDefault();
    if (focusForm.isEdit) {
      const updated = await api.updateFocusArea(focusForm.id, { name: focusForm.name, icon: focusForm.icon, relatedFeelings: focusForm.relatedFeelings });
      setFocusAreas((prev) => prev.map((fa) => (fa._id === focusForm.id ? updated : fa)));
      showToast(`Focus Area "${focusForm.name}" updated`, 'success');
    } else {
      const created = await api.createFocusArea({ name: focusForm.name, icon: focusForm.icon, relatedFeelings: focusForm.relatedFeelings, order: focusAreas.length + 1 });
      setFocusAreas((prev) => [...prev, created]);
      showToast(`Focus Area "${focusForm.name}" created`, 'success');
    }
    setFocusForm({ open: false, isEdit: false, id: null, name: '', icon: 'target', relatedFeelings: [] });
  };

  const handleDeleteFocusArea = async (id, name) => {
    await api.deleteFocusArea(id);
    setFocusAreas((prev) => prev.filter((fa) => fa._id !== id && fa.id !== id));
    showToast(`Focus area "${name}" deleted`, 'info');
  };

  // Admin Duration Actions
  const handleSaveDuration = async (e) => {
    e.preventDefault();
    const label = `${durationForm.minutes} min`;
    if (durationForm.isEdit) {
      const updated = await api.updateDuration(durationForm.id, { label, minutes: Number(durationForm.minutes) });
      setDurations((prev) => prev.map((d) => (d._id === durationForm.id ? updated : d)));
      showToast(`Duration "${label}" updated`, 'success');
    } else {
      const created = await api.createDuration({ label, minutes: Number(durationForm.minutes), order: durations.length + 1 });
      setDurations((prev) => [...prev, created]);
      showToast(`Duration "${label}" created`, 'success');
    }
    setDurationForm({ open: false, isEdit: false, id: null, label: '', minutes: 15 });
  };

  const handleDeleteDuration = async (id, label) => {
    await api.deleteDuration(id);
    setDurations((prev) => prev.filter((d) => d._id !== id && d.id !== id));
    showToast(`Duration "${label}" deleted`, 'info');
  };

  // Admin Session Config Actions
  const handleSaveSessionConfig = async (e) => {
    e.preventDefault();
    const steps = sessionForm.stepsText.split('\n').filter(s => s.trim()).map((line, idx) => {
      const parts = line.split('-').map(p => p.trim());
      return {
        id: `step-${idx + 1}`,
        duration: parts[0] || '4 min',
        title: parts[1] || line,
        category: idx === 0 ? 'Breath' : idx === 1 ? 'Yoga Flow' : idx === 2 ? 'Relaxation' : 'Cooling'
      };
    });

    const sessionPayload = {
      feeling: sessionForm.feeling,
      focusArea: sessionForm.focusArea,
      durationMinutes: Number(sessionForm.durationMinutes),
      title: sessionForm.title || `${sessionForm.durationMinutes}-Minute ${sessionForm.focusArea} & ${sessionForm.feeling}`,
      badge: 'YOUR PERSONAL SESSION',
      steps: steps.length > 0 ? steps : [
        { id: 'step-1', duration: '4 min', title: `Breath preparation (${sessionForm.feeling} reset)`, category: 'Breath' },
        { id: 'step-2', duration: '11 min', title: `${sessionForm.focusArea} flow`, category: 'Yoga Flow' },
        { id: 'step-3', duration: '3 min', title: 'Deep body relaxation', category: 'Relaxation' },
        { id: 'step-4', duration: '2 min', title: 'Cooling breath', category: 'Cooling' }
      ]
    };

    const created = await api.createSessionConfig(sessionPayload);
    setSessions((prev) => [created, ...prev]);
    showToast(`Session template "${sessionPayload.title}" created`, 'success');
    setSessionForm({ open: false, feeling: 'Calm', focusArea: 'Belly / Core strength', durationMinutes: 20, title: '', stepsText: '' });
  };

  const handleDeleteSession = async (id, title) => {
    await api.deleteSessionConfig(id);
    setSessions((prev) => prev.filter((s) => s._id !== id && s.id !== id));
    showToast(`Session template "${title}" deleted`, 'info');
  };

  // Admin Video Upload Action (Multer / Cloudinary + Socket.io event trigger)
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', videoForm.title || `${videoForm.feeling} Video`);
    formData.append('feeling', videoForm.feeling);
    formData.append('focusArea', videoForm.focusArea);
    formData.append('stepTitle', videoForm.stepTitle);
    formData.append('videoUrlCustom', videoForm.videoUrlCustom);
    if (videoForm.file) {
      formData.append('video', videoForm.file);
    }

    try {
      const json = await api.uploadVideo(formData);
      if (json && json.success) {
        setVideos((prev) => [json.data, ...prev]);
        showToast(`⚡ Video uploaded & Socket.io real-time event emitted for "${videoForm.feeling}"!`, 'success');
        setVideoForm({ open: false, title: '', feeling: 'Calm', focusArea: 'Belly / Core strength', stepTitle: '1. Breath Preparation', videoUrlCustom: '', file: null });
      } else {
        showToast('Failed to upload video', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  const handleDeleteVideo = async (id, title) => {
    await api.deleteVideo(id);
    setVideos((prev) => prev.filter((v) => v._id !== id && v.id !== id));
    showToast(`Video "${title}" deleted`, 'info');
  };

  // Admin Quick Practice Actions
  const handleSaveQuickPractice = async (e) => {
    e.preventDefault();
    if (quickPracticeForm.isEdit) {
      const updated = await api.updateQuickPractice(quickPracticeForm.id, quickPracticeForm);
      if (updated) {
        setQuickPractices((prev) => prev.map((qp) => (qp._id === quickPracticeForm.id ? updated : qp)));
        showToast(`Quick Practice "${quickPracticeForm.title}" updated`, 'success');
      }
    } else {
      const created = await api.createQuickPractice(quickPracticeForm);
      if (created) {
        setQuickPractices((prev) => [...prev, created]);
        showToast(`Quick Practice "${quickPracticeForm.title}" created`, 'success');
      }
    }
    setQuickPracticeForm({
      open: false,
      isEdit: false,
      id: null,
      title: '',
      subtitle: '',
      category: 'quick_timer',
      icon: 'clock',
      durationMinutes: 2,
      badgeText: 'Quick Practice Session',
      bgImageUrl: '',
      frameDesignUrl: '',
      bgMusicUrl: '',
      voiceGuidanceUrl: ''
    });
  };

  const handleDeleteQuickPractice = async (id, title) => {
    await api.deleteQuickPractice(id);
    setQuickPractices((prev) => prev.filter((qp) => qp._id !== id && qp.id !== id));
    showToast(`Quick Practice "${title}" deleted`, 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-500 mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Socket.io Real-time WebSocket Server Connected • Multer & Cloudinary Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Wellness Routine & Mood Config
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage Feelings, Focus Areas, Durations, Session Templates, and Upload Videos linked to Feelings with real-time Socket.io broadcasts.
          </p>

          {/* Quick Suite Jump Bar */}
          <div className="flex items-center gap-2 mt-3 font-sans">
            <a href="/yoga-programs" className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5">
              🧘 Goal Programmes Suite →
            </a>
            <a href="/quick-practice" className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1.5">
              ⚡ Quick Practices Suite →
            </a>
            <a href="/breathing-library" className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all flex items-center gap-1.5">
              🍃 Breathing Library →
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadAllData}>
            Sync Backend
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/60 overflow-x-auto">
        {[
          { id: 'feelings', label: 'Feelings Options', icon: Smile, count: feelings.length },
          { id: 'focus', label: 'Focus Areas & Mapping', icon: Target, count: focusAreas.length },
          { id: 'durations', label: 'Durations', icon: Clock, count: durations.length },
          { id: 'sessions', label: 'Session Templates', icon: Layers, count: sessions.length },
          { id: 'videos', label: 'Feeling Videos (Socket Sync)', icon: Video, count: videos.length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 font-bold">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Full Width Admin Content Area */}
      <div className="space-y-6">
        {/* TAB 1: Feelings Manager */}
        {activeTab === 'feelings' && (
          <Card>
            <CardHeader
              actions={
                <Button variant="primary" size="sm" icon={Plus} onClick={() => setFeelingForm({ open: true, isEdit: false, id: null, name: '', emoji: '😊', description: '' })}>
                  Add Feeling Option
                </Button>
              }
            >
              <CardTitle subtitle="Managed Feelings dataset sent to Flutter mobile app API">
                Feelings Options List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {feelings.map((f) => (
                  <div
                    key={f._id || f.id}
                    className="p-4 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex items-center justify-between group hover:border-indigo-500/40 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-2xl flex items-center justify-center shrink-0">
                        {f.emoji || '😊'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{f.name}</h4>
                        <p className="text-xs text-slate-400 font-medium truncate max-w-[130px]">{f.description || 'Feeling state'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                      <button
                        onClick={() => setFeelingForm({ open: true, isEdit: true, id: f._id || f.id, name: f.name, emoji: f.emoji || '😊', description: f.description || '' })}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFeeling(f._id || f.id, f.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: Focus Areas & Dynamic Feeling Mapping */}
        {activeTab === 'focus' && (
          <Card>
            <CardHeader
              actions={
                <Button variant="primary" size="sm" icon={Plus} onClick={() => setFocusForm({ open: true, isEdit: false, id: null, name: '', icon: 'target', relatedFeelings: ['Calm'] })}>
                  Add Focus Area
                </Button>
              }
            >
              <CardTitle subtitle="Focus areas mapped to specific feelings for Flutter sub-selection logic">
                Focus Areas & Relationship Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {focusAreas.map((fa) => (
                  <div
                    key={fa._id || fa.id}
                    className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 group hover:border-indigo-500/40 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-bold text-base flex items-center justify-center">
                          🎯
                        </span>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{fa.name}</h4>
                          <p className="text-xs text-slate-400 font-medium">{fa.description || 'Target area'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit2}
                          onClick={() => setFocusForm({ open: true, isEdit: true, id: fa._id || fa.id, name: fa.name, icon: fa.icon || 'target', relatedFeelings: fa.relatedFeelings || [] })}
                        >
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteFocusArea(fa._id || fa.id, fa.name)}>
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Associated Feelings Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active under feelings:</span>
                      {fa.relatedFeelings && fa.relatedFeelings.length > 0 ? (
                        fa.relatedFeelings.map((rel, rIdx) => (
                          <Badge key={rIdx} variant="indigo" size="sm">
                            {rel}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="slate" size="sm">
                          All Feelings
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: Durations */}
        {activeTab === 'durations' && (
          <Card>
            <CardHeader
              actions={
                <Button variant="primary" size="sm" icon={Plus} onClick={() => setDurationForm({ open: true, isEdit: false, id: null, label: '', minutes: 20 })}>
                  Add Duration
                </Button>
              }
            >
              <CardTitle subtitle="Configure practice length options sent to Flutter app">
                Duration Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {durations.map((d) => (
                  <div
                    key={d._id || d.id}
                    className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center space-y-3 group hover:border-indigo-500/40 transition-all text-center shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-base">
                      {d.minutes}m
                    </div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{d.label}</span>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 pt-1">
                      <button
                        onClick={() => setDurationForm({ open: true, isEdit: true, id: d._id || d.id, label: d.label, minutes: d.minutes })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDuration(d._id || d.id, d.label)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: Session Templates */}
        {activeTab === 'sessions' && (
          <Card>
            <CardHeader
              actions={
                <Button variant="primary" size="sm" icon={Plus} onClick={() => setSessionForm({ open: true, feeling: 'Calm', focusArea: 'Belly / Core strength', durationMinutes: 20, title: '', stepsText: '' })}>
                  Add Session Template
                </Button>
              }
            >
              <CardTitle subtitle="Pre-defined routine breakdowns returned by backend API">
                Routine Session Templates List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((s) => (
                  <div key={s._id || s.id} className="p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="indigo">{s.badge || 'YOUR PERSONAL SESSION'}</Badge>
                        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">{s.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Feeling: <strong className="text-slate-700 dark:text-slate-300">{s.feeling}</strong> • Focus: <strong className="text-slate-700 dark:text-slate-300">{s.focusArea}</strong> • Duration: <strong className="text-slate-700 dark:text-slate-300">{s.durationMinutes || 20} min</strong>
                        </p>
                      </div>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteSession(s._id || s.id, s.title)}>
                        Delete
                      </Button>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Routine Step Sequence:</span>
                      {s.steps && s.steps.map((st, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{st.title}</p>
                              {st.description && <p className="text-[10px] text-slate-400">{st.description}</p>}
                            </div>
                          </div>
                          <span className="font-extrabold text-indigo-500 shrink-0 ml-2">{st.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 5: Video Uploads Manager (Multer + Cloudinary & Socket.io) */}
        {activeTab === 'videos' && (
          <Card>
            <CardHeader
              actions={
                <Button variant="primary" size="sm" icon={Upload} onClick={() => setVideoForm({ open: true, title: '', feeling: 'Calm', focusArea: 'Belly / Core strength', stepTitle: '1. Breath Preparation', videoUrlCustom: '', file: null })}>
                  Upload New Video
                </Button>
              }
            >
              <CardTitle subtitle="Admin video asset library linked to feelings & focus areas (Triggers Socket.io real-time updates)">
                Feeling Videos Library (Cloudinary / Multer)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v) => (
                  <div key={v._id || v.id} className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs group">
                    <div className="relative aspect-video rounded-xl bg-black overflow-hidden flex items-center justify-center">
                      <video src={v.videoUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                      <Badge variant="indigo" className="absolute top-2 left-2">
                        {v.feeling}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{v.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{v.stepTitle} • {v.focusArea}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500">
                      <span>Length: {v.durationText || '03:00'}</span>
                      <span className="font-bold text-amber-500">{v.caloriesBurnRate || 38} kcal</span>
                      <Badge variant="emerald" size="sm">{v.intensityLevel || 'Moderate'}</Badge>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-ping" /> Socket Synced
                      </span>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteVideo(v._id || v.id, v.title)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 6: Quick Practices & SOS Breathing Management */}
        {activeTab === 'quick_practices' && (
          <Card>
            <CardHeader
              actions={
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setQuickPracticeForm({
                    open: true,
                    isEdit: false,
                    id: null,
                    title: '',
                    subtitle: '',
                    category: 'quick_timer',
                    icon: 'clock',
                    durationMinutes: 2,
                    badgeText: 'Quick Practice Session',
                    bgImageUrl: '',
                    frameDesignUrl: '',
                    bgMusicUrl: '',
                    voiceGuidanceUrl: ''
                  })}
                >
                  Add Quick Practice / SOS Item
                </Button>
              }
            >
              <CardTitle subtitle="Manage Quick Practice Timers (2m, 5m, 10m) & SOS Breathing techniques with Background Images, Audio Music, and Round Frames">
                Quick Practices & SOS Breathing Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickPractices.map((qp) => (
                  <div key={qp._id || qp.id} className="p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
                    <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden">
                      <img src={qp.bgImageUrl || 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop'} alt={qp.title} className="w-full h-full object-cover opacity-80" />
                      <Badge variant={qp.category === 'sos_moment' ? 'rose' : 'indigo'} className="absolute top-2 left-2">
                        {qp.category === 'sos_moment' ? 'SOS Breathing' : 'Quick Timer'}
                      </Badge>
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold">
                        {qp.durationMinutes} min
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{qp.title}</h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{qp.subtitle || 'Mindful breath'}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1 text-slate-500">
                      <p>🎵 Music: <strong className="text-slate-800 dark:text-slate-200">{qp.bgMusicUrl ? 'Custom Audio' : 'Default'}</strong></p>
                      <p>🎙️ Voice: <strong className="text-slate-800 dark:text-slate-200">{qp.voiceGuidanceUrl ? 'Custom Voice' : 'Default'}</strong></p>
                      <p>🔄 Phases: <strong className="text-indigo-500 font-bold">{qp.phases ? qp.phases.length : 4} step cycles</strong></p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => setQuickPracticeForm({
                          open: true,
                          isEdit: true,
                          id: qp._id || qp.id,
                          title: qp.title,
                          subtitle: qp.subtitle || '',
                          category: qp.category || 'quick_timer',
                          icon: qp.icon || 'clock',
                          durationMinutes: qp.durationMinutes || 2,
                          badgeText: qp.badgeText || 'Quick Practice Session',
                          bgImageUrl: qp.bgImageUrl || '',
                          frameDesignUrl: qp.frameDesignUrl || '',
                          bgMusicUrl: qp.bgMusicUrl || '',
                          voiceGuidanceUrl: qp.voiceGuidanceUrl || ''
                        })}
                      >
                        Edit
                      </Button>

                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteQuickPractice(qp._id || qp.id, qp.title)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* FORM MODAL: Add/Edit Feeling */}
      {feelingForm.open && (
        <div
          onClick={() => setFeelingForm({ open: false, isEdit: false, id: null, name: '', emoji: '😊', description: '' })}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 relative cursor-default"
          >
            <button
              onClick={() => setFeelingForm({ open: false, isEdit: false, id: null, name: '', emoji: '😊', description: '' })}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-8">
              {feelingForm.isEdit ? 'Edit Feeling Option' : 'Add New Feeling Option'}
            </h3>
            <form onSubmit={handleSaveFeeling} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Feeling Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calm, Stressed, Energized"
                  value={feelingForm.name}
                  onChange={(e) => setFeelingForm({ ...feelingForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Emoji Icon</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 😊"
                  value={feelingForm.emoji}
                  onChange={(e) => setFeelingForm({ ...feelingForm, emoji: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short description for admin reference"
                  value={feelingForm.description}
                  onChange={(e) => setFeelingForm({ ...feelingForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setFeelingForm({ open: false, isEdit: false, id: null, name: '', emoji: '😊', description: '' })}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Feeling
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: Add/Edit Focus Area */}
      {focusForm.open && (
        <div
          onClick={() => setFocusForm({ open: false, isEdit: false, id: null, name: '', icon: 'target', relatedFeelings: [] })}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 relative cursor-default"
          >
            <button
              onClick={() => setFocusForm({ open: false, isEdit: false, id: null, name: '', icon: 'target', relatedFeelings: [] })}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-8">
              {focusForm.isEdit ? 'Edit Focus Area' : 'Add New Focus Area'}
            </h3>
            <form onSubmit={handleSaveFocusArea} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Focus Area Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belly / Core strength, Flexibility"
                  value={focusForm.name}
                  onChange={(e) => setFocusForm({ ...focusForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Associated Feelings (Dynamic Flutter Filter)</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {feelings.map((f) => {
                    const isChecked = focusForm.relatedFeelings.includes(f.name);
                    return (
                      <label key={f._id || f.id} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFocusForm({ ...focusForm, relatedFeelings: [...focusForm.relatedFeelings, f.name] });
                            } else {
                              setFocusForm({ ...focusForm, relatedFeelings: focusForm.relatedFeelings.filter((rf) => rf !== f.name) });
                            }
                          }}
                          className="rounded text-indigo-600"
                        />
                        <span>{f.emoji} {f.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setFocusForm({ open: false, isEdit: false, id: null, name: '', icon: 'target', relatedFeelings: [] })}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Focus Area
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: Add/Edit Duration */}
      {durationForm.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {durationForm.isEdit ? 'Edit Duration Option' : 'Add New Duration Option'}
            </h3>
            <form onSubmit={handleSaveDuration} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration Minutes</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="e.g. 20"
                  value={durationForm.minutes}
                  onChange={(e) => setDurationForm({ ...durationForm, minutes: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setDurationForm({ open: false, isEdit: false, id: null, label: '', minutes: 15 })}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Duration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: Add Session Config Template */}
      {sessionForm.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Routine Session Template</h3>
            <form onSubmit={handleSaveSessionConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Feeling</label>
                  <select
                    value={sessionForm.feeling}
                    onChange={(e) => setSessionForm({ ...sessionForm, feeling: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {feelings.map((f) => (
                      <option key={f._id || f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Focus Area</label>
                  <select
                    value={sessionForm.focusArea}
                    onChange={(e) => setSessionForm({ ...sessionForm, focusArea: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {focusAreas.map((fa) => (
                      <option key={fa._id || fa.id} value={fa.name}>{fa.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration Minutes</label>
                <input
                  type="number"
                  required
                  value={sessionForm.durationMinutes}
                  onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Routine Custom Title</label>
                <input
                  type="text"
                  placeholder="e.g. 20-Minute Belly & Calm Flow"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Routine Steps (One per line: duration - title)</label>
                <textarea
                  rows={4}
                  placeholder={`4 min - Breath preparation (Calm reset)\n11 min - Belly / Core strength flow\n3 min - Deep body relaxation\n2 min - Cooling breath`}
                  value={sessionForm.stepsText}
                  onChange={(e) => setSessionForm({ ...sessionForm, stepsText: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setSessionForm({ open: false, feeling: 'Calm', focusArea: 'Belly / Core strength', durationMinutes: 20, title: '', stepsText: '' })}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Routine Template
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: Upload Video (Multer / Cloudinary) */}
      {videoForm.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" /> Upload Video (Multer / Cloudinary)
            </h3>
            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3-Minute Calm Breath Preparation Video"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Linked Feeling</label>
                  <select
                    value={videoForm.feeling}
                    onChange={(e) => setVideoForm({ ...videoForm, feeling: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {feelings.map((f) => (
                      <option key={f._id || f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Linked Focus Area</label>
                  <select
                    value={videoForm.focusArea}
                    onChange={(e) => setVideoForm({ ...videoForm, focusArea: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {focusAreas.map((fa) => (
                      <option key={fa._id || fa.id} value={fa.name}>{fa.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Step Sequence Title</label>
                <input
                  type="text"
                  placeholder="e.g. 1. Breath Preparation"
                  value={videoForm.stepTitle}
                  onChange={(e) => setVideoForm({ ...videoForm, stepTitle: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload Video File (Multer MP4/WEBM)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoForm({ ...videoForm, file: e.target.files[0] })}
                  className="w-full px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-500 file:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OR Cloudinary / Video Direct URL</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/yourcloud/video/upload/sample.mp4"
                  value={videoForm.videoUrlCustom}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrlCustom: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setVideoForm({ open: false, title: '', feeling: 'Calm', focusArea: 'Belly / Core strength', stepTitle: '1. Breath Preparation', videoUrlCustom: '', file: null })}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon={Upload}>
                  Upload & Emit Socket Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: Add/Edit Quick Practice or SOS Item */}
      {quickPracticeForm.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              {quickPracticeForm.isEdit ? 'Edit Quick Practice / SOS Item' : 'Add New Quick Practice / SOS Item'}
            </h3>
            <form onSubmit={handleSaveQuickPractice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 min Quick Reset or Calm Me (Box Breathing 4-4-4-4)"
                  value={quickPracticeForm.title}
                  onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Mindful Breath • Inner Balance"
                  value={quickPracticeForm.subtitle}
                  onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={quickPracticeForm.category}
                    onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="quick_timer">Quick Timer (2m, 5m, 10m)</option>
                    <option value="sos_moment">SOS Breathing (Calm Me, Sleep, etc.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration Minutes</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quickPracticeForm.durationMinutes}
                    onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, durationMinutes: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Background Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-1448375240586-882707db888b"
                  value={quickPracticeForm.bgImageUrl}
                  onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, bgImageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Decorative Mandala Frame URL</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png"
                  value={quickPracticeForm.frameDesignUrl}
                  onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, frameDesignUrl: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Background Music Audio URL</label>
                <input
                  type="url"
                  placeholder="https://cdn.pixabay.com/download/audio/sample_music.mp3"
                  value={quickPracticeForm.bgMusicUrl}
                  onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, bgMusicUrl: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Voice Guidance Audio URL</label>
                <input
                  type="url"
                  placeholder="https://cdn.pixabay.com/download/audio/sample_voice.mp3"
                  value={quickPracticeForm.voiceGuidanceUrl}
                  onChange={(e) => setQuickPracticeForm({ ...quickPracticeForm, voiceGuidanceUrl: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setQuickPracticeForm({
                    open: false,
                    isEdit: false,
                    id: null,
                    title: '',
                    subtitle: '',
                    category: 'quick_timer',
                    icon: 'clock',
                    durationMinutes: 2,
                    badgeText: 'Quick Practice Session',
                    bgImageUrl: '',
                    frameDesignUrl: '',
                    bgMusicUrl: '',
                    voiceGuidanceUrl: ''
                  })}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Practice Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
