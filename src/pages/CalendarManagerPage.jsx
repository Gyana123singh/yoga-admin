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
  Volume2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Flower2,
  X
} from 'lucide-react';

export function CalendarManagerPage() {
  const { showToast } = useApp();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formModal, setFormModal] = useState({
    open: false,
    isEdit: false,
    id: null,
    name: 'Breathing',
    icon: '☀️',
    bgImageUrlCustom: '',
    bgImageFile: null,
    frameDesignUrlCustom: '',
    frameDesignFile: null,
    bgMusicUrlCustom: '',
    bgMusicFile: null,
    voiceGuidanceUrlCustom: '',
    voiceGuidanceFile: null
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await api.getCalendarCategories();
    if (data) setCategories(data);
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (formModal.id) formData.append('id', formModal.id);
    formData.append('name', formModal.name);
    formData.append('icon', formModal.icon);
    formData.append('bgImageUrlCustom', formModal.bgImageUrlCustom);
    formData.append('frameDesignUrlCustom', formModal.frameDesignUrlCustom);
    formData.append('bgMusicUrlCustom', formModal.bgMusicUrlCustom);
    formData.append('voiceGuidanceUrlCustom', formModal.voiceGuidanceUrlCustom);

    if (formModal.bgImageFile) formData.append('bgImage', formModal.bgImageFile);
    if (formModal.frameDesignFile) formData.append('frameDesign', formModal.frameDesignFile);
    if (formModal.bgMusicFile) formData.append('bgMusic', formModal.bgMusicFile);
    if (formModal.voiceGuidanceFile) formData.append('voiceGuidance', formModal.voiceGuidanceFile);

    try {
      const saved = await api.saveCalendarCategory(formData);
      if (saved) {
        showToast(`Practice Category "${formModal.name}" saved successfully!`, 'success');
        loadCategories();
        closeForm();
      } else {
        showToast('Failed to save category assets', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving category', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    await api.deleteCalendarCategory(id);
    setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
    showToast(`Category "${name}" deleted`, 'info');
  };

  const handleEdit = (cat) => {
    setFormModal({
      open: true,
      isEdit: true,
      id: cat._id || cat.id,
      name: cat.name || 'Breathing',
      icon: cat.icon || '☀️',
      bgImageUrlCustom: cat.bgImageUrl || '',
      bgImageFile: null,
      frameDesignUrlCustom: cat.frameDesignUrl || '',
      frameDesignFile: null,
      bgMusicUrlCustom: cat.bgMusicUrl || '',
      bgMusicFile: null,
      voiceGuidanceUrlCustom: cat.voiceGuidanceUrl || '',
      voiceGuidanceFile: null
    });
  };

  const closeForm = () => {
    setFormModal({
      open: false,
      isEdit: false,
      id: null,
      name: 'Breathing',
      icon: '☀️',
      bgImageUrlCustom: '',
      bgImageFile: null,
      frameDesignUrlCustom: '',
      frameDesignFile: null,
      bgMusicUrlCustom: '',
      bgMusicFile: null,
      voiceGuidanceUrlCustom: '',
      voiceGuidanceFile: null
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar & Practice Routine Categories Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Calendar Practice Categories & Media Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Configure User Calendar Practice Categories (Breathing, Yoga, Meditation, Relaxation, Sleep), Mandala Frames, Background Nature Images, and Ambient Audio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadCategories}>
            Sync Database
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setFormModal({ ...formModal, open: true })}>
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <Card>
        <CardHeader
          actions={
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setFormModal({ ...formModal, open: true })}>
              Add Practice Category
            </Button>
          }
        >
          <CardTitle subtitle="Manage Practice Categories & Audio/Visual Media Assets">
            Configured Practice Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-sm font-medium text-slate-400">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((item) => (
                <div key={item._id || item.id} className="p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs group hover:border-emerald-500/40 transition-all">
                  <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden">
                    <img
                      src={item.bgImageUrl || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop'}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge variant="emerald" className="absolute top-2 left-2 flex items-center gap-1">
                      <span>{item.icon || '☀️'}</span>
                      <span>{item.name}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Admin Practice Category</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5 text-slate-500 font-medium">
                    <p className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-indigo-500 font-bold">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Background Image
                      </span>
                      <span className="text-emerald-500 font-bold">Configured</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                        <Flower2 className="w-3.5 h-3.5" />
                        Mandala Ring Frame
                      </span>
                      <span className="text-emerald-500 font-bold">Configured</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-cyan-500 font-bold">
                        <Music className="w-3.5 h-3.5" />
                        Ambient Audio Music
                      </span>
                      <span className="text-emerald-500 font-bold">Configured</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <Button variant="outline" size="sm" icon={Edit2} onClick={() => handleEdit(item)}>
                      Edit Category
                    </Button>
                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(item._id || item.id, item.name)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FORM MODAL - ADD / EDIT CATEGORY */}
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
              {formModal.isEdit ? 'Edit Practice Category' : 'Add Practice Category to Calendar'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Breathing, Yoga, Sleep"
                    value={formModal.name}
                    onChange={(e) => setFormModal({ ...formModal, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon / Emoji</label>
                  <input
                    type="text"
                    placeholder="e.g. ☀️, 🧘, 😴"
                    value={formModal.icon}
                    onChange={(e) => setFormModal({ ...formModal, icon: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-center text-lg"
                  />
                </div>
              </div>

              {/* Background Nature Image Upload + Optional URL */}
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Background Nature Image (Upload File OR Optional URL)</span>
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
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mandala Decorative Frame Ring (Upload File OR Optional URL)</span>
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
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Background Ambient Music (Upload Audio File OR Optional URL)</span>
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

              {/* Voice Guidance Audio Upload + Optional URL */}
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Voice Guidance Audio (Upload Audio File OR Optional URL)</span>
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormModal({ ...formModal, voiceGuidanceFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Voice Guidance Audio URL"
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
                  Save Category Assets
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
