import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Clock,
  Heart,
  Music,
  Mic,
  Upload,
  Circle,
  Sliders,
  Wind
} from 'lucide-react';

export function QuickPracticeManagerPage() {
  const { showToast } = useApp();

  const [quickPractices, setQuickPractices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const [formModal, setFormModal] = useState({
    open: false,
    isEdit: false,
    id: null,
    title: '',
    subtitle: '',
    category: 'quick_timer',
    filterCategory: 'Calm',
    patternTag: 'Pattern: 4-4-4-4',
    benefits: 'Lowers cortisol stress hormone\nEnhances mental clarity\nBalances autonomic nervous system',
    safetyCaution: 'If pregnant or experiencing high blood pressure, reduce hold phase to comfortable level.',
    icon: 'clock',
    durationMinutes: 2,
    badgeText: 'Quick Practice Session',
    bgImageUrlCustom: '',
    frameDesignUrlCustom: '',
    bgMusicUrlCustom: '',
    voiceGuidanceUrlCustom: '',
    bgImageFile: null,
    frameDesignFile: null,
    bgMusicFile: null,
    voiceGuidanceFile: null
  });

  useEffect(() => {
    loadPractices();
  }, []);

  const loadPractices = async () => {
    setIsLoading(true);
    const qpData = await api.getQuickPractices();
    if (qpData && qpData.all) {
      setQuickPractices(qpData.all);
    }
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formModal.title);
    formData.append('subtitle', formModal.subtitle);
    formData.append('category', formModal.category);
    formData.append('filterCategory', formModal.filterCategory);
    formData.append('patternTag', formModal.patternTag);
    formData.append('safetyCaution', formModal.safetyCaution);

    const benefitsArray = typeof formModal.benefits === 'string' 
      ? formModal.benefits.split('\n').filter(b => b.trim().length > 0)
      : formModal.benefits;
    formData.append('benefits', JSON.stringify(benefitsArray));

    formData.append('icon', formModal.icon);
    formData.append('durationMinutes', formModal.durationMinutes);
    formData.append('badgeText', formModal.badgeText);
    formData.append('bgImageUrlCustom', formModal.bgImageUrlCustom);
    formData.append('frameDesignUrlCustom', formModal.frameDesignUrlCustom);
    formData.append('bgMusicUrlCustom', formModal.bgMusicUrlCustom);
    formData.append('voiceGuidanceUrlCustom', formModal.voiceGuidanceUrlCustom);

    if (formModal.bgImageFile) formData.append('bgImage', formModal.bgImageFile);
    if (formModal.frameDesignFile) formData.append('frameDesign', formModal.frameDesignFile);
    if (formModal.bgMusicFile) formData.append('bgMusic', formModal.bgMusicFile);
    if (formModal.voiceGuidanceFile) formData.append('voiceGuidance', formModal.voiceGuidanceFile);

    try {
      if (formModal.isEdit) {
        const updated = await api.updateQuickPractice(formModal.id, formData);
        if (updated) {
          setQuickPractices((prev) => prev.map((qp) => (qp._id === formModal.id ? updated : qp)));
          showToast(`Quick Practice "${formModal.title}" updated`, 'success');
        }
      } else {
        const created = await api.createQuickPractice(formData);
        if (created) {
          setQuickPractices((prev) => [...prev, created]);
          showToast(`Quick Practice "${formModal.title}" created`, 'success');
        }
      }
      closeForm();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    await api.deleteQuickPractice(id);
    setQuickPractices((prev) => prev.filter((qp) => qp._id !== id && qp.id !== id));
    showToast(`Quick Practice "${title}" deleted`, 'info');
  };

  const closeForm = () => {
    setFormModal({
      open: false,
      isEdit: false,
      id: null,
      title: '',
      subtitle: '',
      category: 'quick_timer',
      icon: 'clock',
      durationMinutes: 2,
      badgeText: 'Quick Practice Session',
      bgImageUrlCustom: '',
      frameDesignUrlCustom: '',
      bgMusicUrlCustom: '',
      voiceGuidanceUrlCustom: '',
      bgImageFile: null,
      frameDesignFile: null,
      bgMusicFile: null,
      voiceGuidanceFile: null
    });
  };

  const quickTimers = quickPractices.filter(i => i.category === 'quick_timer');
  const sosMoments = quickPractices.filter(i => i.category === 'sos_moment');
  const displayList = activeTab === 'quick_timer' ? quickTimers : activeTab === 'sos_moment' ? sosMoments : quickPractices;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-500 mb-2">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Multer & Cloudinary Multi-Media Config Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Quick Practices & SOS Breathing Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Upload images, mandala frame designs, and background audio using Multer/Cloudinary or enter custom direct URLs.
          </p>

          {/* Quick Suite Jump Bar */}
          <div className="flex items-center gap-2 mt-3 font-sans">
            <a href="/yoga-programs" className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5">
              🧘 Goal Programmes Suite →
            </a>
            <a href="/daily-needs" className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all flex items-center gap-1.5">
              🎯 What Do I Need Config →
            </a>
            <a href="/breathing-library" className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition-all flex items-center gap-1.5">
              🍃 Breathing Library →
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadPractices}>
            Sync Database
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setFormModal({
              open: true,
              isEdit: false,
              id: null,
              title: '',
              subtitle: '',
              category: 'quick_timer',
              icon: 'clock',
              durationMinutes: 2,
              badgeText: 'Quick Practice Session',
              bgImageUrlCustom: '',
              frameDesignUrlCustom: '',
              bgMusicUrlCustom: '',
              voiceGuidanceUrlCustom: '',
              bgImageFile: null,
              frameDesignFile: null,
              bgMusicFile: null,
              voiceGuidanceFile: null
            })}
          >
            Add New Practice Item
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/60 overflow-x-auto">
        {[
          { id: 'all', label: 'All Items', icon: Zap, count: quickPractices.length },
          { id: 'quick_timer', label: 'Quick Timers (2m, 5m, 10m)', icon: Clock, count: quickPractices.filter(i => i.category === 'quick_timer').length },
          { id: 'sos_moment', label: 'SOS Breathing (Calm, Sleep, Focus)', icon: Heart, count: quickPractices.filter(i => i.category === 'sos_moment').length },
          { id: 'library', label: 'Pranayama Library (Box, 4-7-8)', icon: Wind, count: quickPractices.filter(i => i.category === 'library').length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/80 dark:border-slate-800'
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

      {/* Items List Grid */}
      <Card>
        <CardHeader
          actions={
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setFormModal({
                open: true,
                isEdit: false,
                id: null,
                title: '',
                subtitle: '',
                category: activeTab === 'sos_moment' ? 'sos_moment' : 'quick_timer',
                icon: 'clock',
                durationMinutes: 2,
                badgeText: activeTab === 'sos_moment' ? 'Breathing SOS' : 'Quick Practice Session',
                bgImageUrlCustom: '',
                frameDesignUrlCustom: '',
                bgMusicUrlCustom: '',
                voiceGuidanceUrlCustom: '',
                bgImageFile: null,
                frameDesignFile: null,
                bgMusicFile: null,
                voiceGuidanceFile: null
              })}
            >
              Add Item
            </Button>
          }
        >
          <CardTitle subtitle="Manage Nature Backgrounds, Mandala Ring Frames, Ambient Audio & Breathing Sequences">
            Configured Practice Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((qp) => (
              <div key={qp._id || qp.id} className="p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs group hover:border-amber-500/40 transition-all">
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

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5 text-slate-500 font-medium">
                  <p className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-emerald-500" /> Music: <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{qp.bgMusicUrl ? 'Active Audio Stream' : 'Default Meditative'}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-indigo-500" /> Voice: <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{qp.voiceGuidanceUrl ? 'Active Voice Guide' : 'Default Maya'}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Circle className="w-3.5 h-3.5 text-amber-500" /> Frame: <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{qp.frameDesignUrl ? 'Mandala Frame Active' : 'Default Lotus'}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-500" /> Phases: <strong className="text-amber-500 font-bold">{qp.phases ? qp.phases.length : 4} step cycles</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit2}
                    onClick={() => setFormModal({
                      open: true,
                      isEdit: true,
                      id: qp._id || qp.id,
                      title: qp.title,
                      subtitle: qp.subtitle || '',
                      category: qp.category || 'quick_timer',
                      icon: qp.icon || 'clock',
                      durationMinutes: qp.durationMinutes || 2,
                      badgeText: qp.badgeText || 'Quick Practice Session',
                      bgImageUrlCustom: qp.bgImageUrl || '',
                      frameDesignUrlCustom: qp.frameDesignUrl || '',
                      bgMusicUrlCustom: qp.bgMusicUrl || '',
                      voiceGuidanceUrlCustom: qp.voiceGuidanceUrl || '',
                      bgImageFile: null,
                      frameDesignFile: null,
                      bgMusicFile: null,
                      voiceGuidanceFile: null
                    })}
                  >
                    Edit Config
                  </Button>

                  <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(qp._id || qp.id, qp.title)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FORM MODAL WITH MULTER FILE UPLOAD + OPTIONAL URL INPUTS */}
      {formModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-500" />
              {formModal.isEdit ? 'Edit Quick Practice / SOS Item' : 'Add New Quick Practice / SOS Item'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 min Quick Reset or Calm Me (Box Breathing 4-4-4-4)"
                  value={formModal.title}
                  onChange={(e) => setFormModal({ ...formModal, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Mindful Breath • Inner Balance"
                  value={formModal.subtitle}
                  onChange={(e) => setFormModal({ ...formModal, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={formModal.category}
                    onChange={(e) => setFormModal({ ...formModal, category: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="quick_timer">Quick Timer (2m, 5m, 10m)</option>
                    <option value="sos_moment">SOS Breathing (Calm Me, Sleep, etc.)</option>
                    <option value="library">Pranayama Library (Box, 4-7-8, Coherent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration Minutes</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formModal.durationMinutes}
                    onChange={(e) => setFormModal({ ...formModal, durationMinutes: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Extra Pranayama Library Fields */}
              {formModal.category === 'library' && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <span className="text-xs font-bold text-amber-500 uppercase block">Pranayama Library Details (Image 2 & 3)</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Filter Tag</label>
                      <select
                        value={formModal.filterCategory}
                        onChange={(e) => setFormModal({ ...formModal, filterCategory: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Calm">Calm</option>
                        <option value="Focus">Focus</option>
                        <option value="Sleep">Sleep</option>
                        <option value="Energy">Energy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pattern Badge</label>
                      <input
                        type="text"
                        placeholder="Pattern: 4-4-4-4"
                        value={formModal.patternTag}
                        onChange={(e) => setFormModal({ ...formModal, patternTag: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Benefits List (1 per line)</label>
                    <textarea
                      rows={3}
                      placeholder="Lowers cortisol stress hormone&#10;Enhances mental clarity&#10;Balances autonomic nervous system"
                      value={formModal.benefits}
                      onChange={(e) => setFormModal({ ...formModal, benefits: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Safety Caution Alert Text</label>
                    <input
                      type="text"
                      placeholder="If pregnant or experiencing high blood pressure, reduce hold phase..."
                      value={formModal.safetyCaution}
                      onChange={(e) => setFormModal({ ...formModal, safetyCaution: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Background Nature Image Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  1. Background Nature Image (Upload File OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormModal({ ...formModal, bgImageFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Image URL (e.g. https://images.unsplash.com/...)"
                  value={formModal.bgImageUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, bgImageUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Decorative Mandala Frame Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  2. Round Mandala Decorative Frame (Upload SVG/PNG OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="image/*,.svg"
                  onChange={(e) => setFormModal({ ...formModal, frameDesignFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Mandala Frame URL (e.g. https://res.cloudinary.com/...)"
                  value={formModal.frameDesignUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, frameDesignUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Background Music Audio Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  3. Background Ambient Music Audio (Upload MP3/WAV OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormModal({ ...formModal, bgMusicFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Audio URL (e.g. https://cdn.pixabay.com/...mp3)"
                  value={formModal.bgMusicUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, bgMusicUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Voice Guidance Audio Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  4. Voice Guidance Audio (Upload MP3/WAV OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormModal({ ...formModal, voiceGuidanceFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-rose-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Voice Audio URL (e.g. https://cdn.pixabay.com/...mp3)"
                  value={formModal.voiceGuidanceUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, voiceGuidanceUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={closeForm}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon={Upload}>
                  Save & Upload Media
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
