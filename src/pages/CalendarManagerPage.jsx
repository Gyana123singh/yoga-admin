import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Clock,
  Upload,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Flower2,
  X
} from 'lucide-react';

export function CalendarManagerPage() {
  const { showToast } = useApp();

  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formModal, setFormModal] = useState({
    open: false,
    isEdit: false,
    id: null,
    title: '',
    category: 'Breathing',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '07:00 AM',
    durationMinutes: 10,
    bgImageUrlCustom: '',
    bgImageFile: null,
    frameDesignUrlCustom: '',
    frameDesignFile: null,
    bgMusicUrlCustom: '',
    bgMusicFile: null
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setIsLoading(true);
    const res = await api.getDailySchedulesByDate('');
    if (res && res.data) setSchedules(res.data);
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formModal.title);
    formData.append('category', formModal.category);
    formData.append('scheduledDate', formModal.scheduledDate);
    formData.append('scheduledTime', formModal.scheduledTime);
    formData.append('durationMinutes', formModal.durationMinutes);
    formData.append('bgImageUrlCustom', formModal.bgImageUrlCustom);
    formData.append('frameDesignUrlCustom', formModal.frameDesignUrlCustom);
    formData.append('bgMusicUrlCustom', formModal.bgMusicUrlCustom);

    if (formModal.bgImageFile) formData.append('bgImage', formModal.bgImageFile);
    if (formModal.frameDesignFile) formData.append('frameDesign', formModal.frameDesignFile);
    if (formModal.bgMusicFile) formData.append('bgMusic', formModal.bgMusicFile);

    try {
      const created = await api.addDailySchedule(formData);
      if (created) {
        setSchedules((prev) => [...prev, created]);
        showToast(`Calendar Routine "${formModal.title}" created!`, 'success');
        closeForm();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    await api.deleteDailySchedule(id);
    setSchedules((prev) => prev.filter((s) => s._id !== id && s.id !== id));
    showToast(`Routine "${title}" deleted from calendar`, 'info');
  };

  const closeForm = () => {
    setFormModal({
      open: false,
      isEdit: false,
      id: null,
      title: '',
      category: 'Breathing',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '07:00 AM',
      durationMinutes: 10,
      bgImageUrlCustom: '',
      bgImageFile: null,
      frameDesignUrlCustom: '',
      frameDesignFile: null,
      bgMusicUrlCustom: '',
      bgMusicFile: null
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar & Daily Wellness Schedule Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Calendar & Schedule Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Configure User Calendar Routines (Breathing, Yoga, Meditation, Relaxation, Sleep), Mandala Frames, Background Imagery, and Music Streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadSchedules}>
            Sync Database
          </Button>
        </div>
      </div>

      {/* Schedules Grid */}
      <Card>
        <CardHeader
          actions={
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setFormModal({ ...formModal, open: true })}>
              Add Routine
            </Button>
          }
        >
          <CardTitle subtitle="Manage Calendar Routines & Audio/Visual Assets">
            Configured Daily Schedules ({schedules.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((item) => (
              <div key={item._id || item.id} className="p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs group hover:border-emerald-500/40 transition-all">
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden">
                  <img src={item.bgImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop'} alt={item.title} className="w-full h-full object-cover opacity-85" />
                  <Badge variant="emerald" className="absolute top-2 left-2">
                    {item.category}
                  </Badge>
                  <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold">
                    {item.scheduledTime} ({item.durationMinutes}m)
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">Date: <strong className="text-slate-200">{item.scheduledDate}</strong></p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1 text-slate-500 font-medium">
                  <p className="flex items-center justify-between">
                    <span>Status: <strong className={item.status === 'Completed' ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>{item.status}</strong></span>
                    <span className="text-indigo-400">Mandala Frame Uploaded</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(item._id || item.id, item.title)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FORM MODAL */}
      {formModal.open && (
        <div
          onClick={closeForm}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative cursor-default"
          >
            <button
              onClick={closeForm}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pr-8">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Add Practice Routine to Calendar
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Routine Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sleep Journey Practice"
                  value={formModal.title}
                  onChange={(e) => setFormModal({ ...formModal, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                <select
                  value={formModal.category}
                  onChange={(e) => setFormModal({ ...formModal, category: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Breathing">Breathing</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Meditation">Meditation</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Sleep">Sleep</option>
                </select>
              </div>

              {/* Background Nature Image Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Background Nature Image (Upload File OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormModal({ ...formModal, bgImageFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Image URL"
                  value={formModal.bgImageUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, bgImageUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Mandala Decorative Frame Design Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Mandala Decorative Frame Ring (Upload File OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormModal({ ...formModal, frameDesignFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Mandala Frame URL"
                  value={formModal.frameDesignUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, frameDesignUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Background Music Audio Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Background Ambient Music (Upload Audio File OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormModal({ ...formModal, bgMusicFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Background Audio URL"
                  value={formModal.bgMusicUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, bgMusicUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={closeForm}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon={Upload}>
                  Save Routine
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
