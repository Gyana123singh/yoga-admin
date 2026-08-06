import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Dumbbell,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Video,
  Upload,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  Flower2,
  BookOpen,
  Sparkles,
  X
} from 'lucide-react';

export function ExerciseLibraryPage() {
  const { showToast } = useApp();

  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalState, setModalState] = useState({
    open: false,
    isEdit: false,
    id: null,
    title: '',
    subtitle: 'Restorative Decompression • Spine Extension',
    badgeTag: 'REST',
    category: 'Exercises',
    durationMinutes: 10,

    // Accordion fields
    whatIs: 'Balasana (Child Pose) is a gentle, restorative yoga posture that lengthens the spine.',
    benefits: 'Gently stretches hips, thighs, and ankles. Relieves back and neck strain while promoting relaxation.',
    correctPosture: 'Kneel on the mat, bring big toes together, sit on heels, and fold torso forward extending arms out long.',
    instructions: 'General instructions and alignment guidelines before beginning your movement flow.',
    howToDo: 'Rest forehead on mat, extend arms forward, and breathe deeply into lower back.',
    whatItDoesntGuarantee: 'Provides immediate tension relief but is not a substitute for professional orthopedic care.',
    contraindications: 'Avoid if suffering from severe knee joint injury or ankle sprain.',
    originHistory: 'Originated from traditional Hatha Yoga.',

    // Media upload files and URLs
    heroImageFile: null,
    heroImageUrlCustom: '',
    demoVideoFile: null,
    demoVideoUrlCustom: '',
    bgImageFile: null,
    bgImageUrlCustom: '',
    frameDesignFile: null,
    frameDesignUrlCustom: '',
    bgMusicFile: null,
    bgMusicUrlCustom: ''
  });

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setIsLoading(true);
    const data = await api.getExercises();
    if (data) setExercises(data);
    setIsLoading(false);
  };

  const handleOpenAdd = () => {
    setModalState({
      open: true,
      isEdit: false,
      id: null,
      title: '',
      subtitle: 'Restorative Decompression • Spine Extension',
      badgeTag: 'REST',
      category: 'Exercises',
      durationMinutes: 10,

      whatIs: 'Balasana (Child Pose) is a gentle, restorative yoga posture that lengthens the spine.',
      benefits: 'Gently stretches hips, thighs, and ankles. Relieves lower back strain.',
      correctPosture: 'Kneel on the mat, bring big toes together, sit on heels, and fold torso forward.',
      instructions: 'General instructions and alignment guidelines before starting.',
      howToDo: 'Rest forehead on mat, extend arms forward, and breathe deeply into lower back.',
      whatItDoesntGuarantee: 'Provides immediate tension relief but is not a permanent substitute for orthopedic care.',
      contraindications: 'Avoid if suffering from severe knee or ankle injury.',
      originHistory: 'Originated from traditional Hatha Yoga.',

      heroImageFile: null,
      heroImageUrlCustom: '',
      demoVideoFile: null,
      demoVideoUrlCustom: '',
      bgImageFile: null,
      bgImageUrlCustom: '',
      frameDesignFile: null,
      frameDesignUrlCustom: '',
      bgMusicFile: null,
      bgMusicUrlCustom: ''
    });
  };

  const handleOpenEdit = (item) => {
    setModalState({
      open: true,
      isEdit: true,
      id: item._id || item.id,
      title: item.title || '',
      subtitle: item.subtitle || 'Restorative Decompression • Spine Extension',
      badgeTag: item.badgeTag || 'REST',
      category: item.category || 'Exercises',
      durationMinutes: item.durationMinutes || 10,

      whatIs: item.whatIs || '',
      benefits: item.benefits || '',
      correctPosture: item.correctPosture || '',
      instructions: item.instructions || '',
      howToDo: item.howToDo || '',
      whatItDoesntGuarantee: item.whatItDoesntGuarantee || '',
      contraindications: item.contraindications || '',
      originHistory: item.originHistory || '',

      heroImageFile: null,
      heroImageUrlCustom: item.heroImageUrl || '',
      demoVideoFile: null,
      demoVideoUrlCustom: item.demoVideoUrl || '',
      bgImageFile: null,
      bgImageUrlCustom: item.bgImageUrl || '',
      frameDesignFile: null,
      frameDesignUrlCustom: item.frameDesignUrl || '',
      bgMusicFile: null,
      bgMusicUrlCustom: item.bgMusicUrl || ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', modalState.title);
    formData.append('subtitle', modalState.subtitle);
    formData.append('badgeTag', modalState.badgeTag);
    formData.append('category', modalState.category);
    formData.append('durationMinutes', modalState.durationMinutes);

    // Accordion fields
    formData.append('whatIs', modalState.whatIs);
    formData.append('benefits', modalState.benefits);
    formData.append('correctPosture', modalState.correctPosture);
    formData.append('instructions', modalState.instructions);
    formData.append('howToDo', modalState.howToDo);
    formData.append('whatItDoesntGuarantee', modalState.whatItDoesntGuarantee);
    formData.append('contraindications', modalState.contraindications);
    formData.append('originHistory', modalState.originHistory);

    // File uploads & URLs
    if (modalState.heroImageFile) formData.append('heroImage', modalState.heroImageFile);
    formData.append('heroImageUrlCustom', modalState.heroImageUrlCustom);

    if (modalState.demoVideoFile) formData.append('demoVideo', modalState.demoVideoFile);
    formData.append('demoVideoUrlCustom', modalState.demoVideoUrlCustom);

    if (modalState.bgImageFile) formData.append('bgImage', modalState.bgImageFile);
    formData.append('bgImageUrlCustom', modalState.bgImageUrlCustom);

    if (modalState.frameDesignFile) formData.append('frameDesign', modalState.frameDesignFile);
    formData.append('frameDesignUrlCustom', modalState.frameDesignUrlCustom);

    if (modalState.bgMusicFile) formData.append('bgMusic', modalState.bgMusicFile);
    formData.append('bgMusicUrlCustom', modalState.bgMusicUrlCustom);

    try {
      if (modalState.isEdit) {
        const updated = await api.updateExercise(modalState.id, formData);
        if (updated) {
          showToast(`Exercise "${modalState.title}" updated!`, 'success');
          loadExercises();
          setModalState({ ...modalState, open: false });
        }
      } else {
        const created = await api.createExercise(formData);
        if (created) {
          showToast(`Exercise "${modalState.title}" created!`, 'success');
          loadExercises();
          setModalState({ ...modalState, open: false });
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    await api.deleteExercise(id);
    setExercises((prev) => prev.filter((e) => e._id !== id && e.id !== id));
    showToast(`Exercise "${title}" deleted from library`, 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 mb-2">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Explore Library Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Exercises Library Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Configure Featured Exercises (Balasana, Padmasana, etc.), Upload Demo Videos, Mandala Frames, Nature Background Imagery, Ambient Audio & Accordion Instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadExercises}>
            Sync Library
          </Button>
        </div>
      </div>

      {/* Exercises Grid */}
      <Card>
        <CardHeader
          actions={
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
              Add Exercise
            </Button>
          }
        >
          <CardTitle subtitle="Rendered live on Flutter Mobile App Explore Library -> Exercises Tab">
            Configured Exercises ({exercises.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((item) => (
              <div
                key={item._id || item.id}
                className="p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs group hover:border-emerald-500/40 transition-all"
              >
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden">
                  <img
                    src={item.heroImageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop'}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <Badge variant="emerald" className="absolute top-2 left-2 font-bold uppercase">
                    {item.badgeTag || 'REST'}
                  </Badge>
                  <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold">
                    {item.durationMinutes || 10} Mins
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{item.subtitle}</p>
                </div>

                {/* Status Badges */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5 text-slate-500 font-medium">
                  <p className="flex items-center justify-between">
                    <span>Demo Video:</span>
                    <strong className="text-emerald-500 flex items-center gap-1 font-bold">
                      <Video className="w-3.5 h-3.5" /> Uploaded
                    </strong>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Mandala Frame:</span>
                    <strong className="text-indigo-400 flex items-center gap-1 font-bold">
                      <Flower2 className="w-3.5 h-3.5" /> Ready
                    </strong>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Accordion Guides:</span>
                    <strong className="text-amber-500 font-bold">8 Categories</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button variant="ghost" size="sm" icon={Edit2} onClick={() => handleOpenEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(item._id || item.id, item.title)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ADD / EDIT MODAL */}
      {modalState.open && (
        <div
          onClick={() => setModalState({ ...modalState, open: false })}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative cursor-default"
          >
            <button
              onClick={() => setModalState({ ...modalState, open: false })}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 pr-8">
              <Dumbbell className="w-6 h-6 text-emerald-500" />
              {modalState.isEdit ? 'Edit Exercise / Pose' : 'Add Exercise / Pose'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* BASIC INFO */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Exercise Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balasana"
                    value={modalState.title}
                    onChange={(e) => setModalState({ ...modalState, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                  <input
                    type="text"
                    placeholder="Restorative Decompression • Spine Extension"
                    value={modalState.subtitle}
                    onChange={(e) => setModalState({ ...modalState, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Badge Tag</label>
                  <select
                    value={modalState.badgeTag}
                    onChange={(e) => setModalState({ ...modalState, badgeTag: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="REST">REST</option>
                    <option value="MEDITATION">MEDITATION</option>
                    <option value="FULL BODY">FULL BODY</option>
                    <option value="STRENGTH">STRENGTH</option>
                    <option value="FLEXIBILITY">FLEXIBILITY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    value={modalState.durationMinutes}
                    onChange={(e) => setModalState({ ...modalState, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* MEDIA ASSETS UPLOADS (Videos, Images, Mandala, Music) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4" /> Media & Video Assets Upload (Rendered on Customer Flutter App)
                </h4>

                {/* COVER IMAGE UPLOAD */}
                <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    🖼️ Hero Cover Image (Upload Image File OR Optional URL)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setModalState({ ...modalState, heroImageFile: e.target.files[0] })}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                  />
                  <input
                    type="url"
                    placeholder="OR enter Cover Image URL"
                    value={modalState.heroImageUrlCustom}
                    onChange={(e) => setModalState({ ...modalState, heroImageUrlCustom: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                {/* DEMO VIDEO UPLOAD */}
                <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    📹 Demo Video for Exercise Detail Page (Upload MP4 File OR Optional URL)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setModalState({ ...modalState, demoVideoFile: e.target.files[0] })}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                  />
                  <input
                    type="url"
                    placeholder="OR enter direct Video URL"
                    value={modalState.demoVideoUrlCustom}
                    onChange={(e) => setModalState({ ...modalState, demoVideoUrlCustom: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                {/* MANDALA FRAME UPLOAD */}
                <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    ⭕ Round Mandala Decorative Frame Ring (Upload PNG File OR Optional URL)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setModalState({ ...modalState, frameDesignFile: e.target.files[0] })}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                  />
                  <input
                    type="url"
                    placeholder="OR enter Mandala Frame URL"
                    value={modalState.frameDesignUrlCustom}
                    onChange={(e) => setModalState({ ...modalState, frameDesignUrlCustom: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                {/* BACKGROUND MUSIC UPLOAD */}
                <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    🎵 Background Ambient Music Stream (Upload Audio File OR Optional URL)
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setModalState({ ...modalState, bgMusicFile: e.target.files[0] })}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                  />
                  <input
                    type="url"
                    placeholder="OR enter Audio Stream URL"
                    value={modalState.bgMusicUrlCustom}
                    onChange={(e) => setModalState({ ...modalState, bgMusicUrlCustom: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* ALL 8 ACCORDION INSTRUCTIONS */}
              <div className="space-y-3 pt-3">
                <h4 className="text-xs font-extrabold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> 8 Accordion Instructions
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">🍃 What is (Exercise Description)</label>
                    <textarea
                      rows={2}
                      value={modalState.whatIs}
                      onChange={(e) => setModalState({ ...modalState, whatIs: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">⭐ Benefits</label>
                    <textarea
                      rows={2}
                      value={modalState.benefits}
                      onChange={(e) => setModalState({ ...modalState, benefits: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">🧘 Correct Posture</label>
                    <textarea
                      rows={2}
                      value={modalState.correctPosture}
                      onChange={(e) => setModalState({ ...modalState, correctPosture: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">📋 General Instructions</label>
                    <textarea
                      rows={2}
                      value={modalState.instructions}
                      onChange={(e) => setModalState({ ...modalState, instructions: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">📝 How to Do (Step-by-Step)</label>
                    <textarea
                      rows={2}
                      value={modalState.howToDo}
                      onChange={(e) => setModalState({ ...modalState, howToDo: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">🛡️ What It Doesn't Guarantee</label>
                    <textarea
                      rows={2}
                      value={modalState.whatItDoesntGuarantee}
                      onChange={(e) => setModalState({ ...modalState, whatItDoesntGuarantee: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">⚠️ Contraindications (If You Have This, Don't Do It)</label>
                    <textarea
                      rows={2}
                      value={modalState.contraindications}
                      onChange={(e) => setModalState({ ...modalState, contraindications: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">🏛️ Origin & History</label>
                    <textarea
                      rows={2}
                      value={modalState.originHistory}
                      onChange={(e) => setModalState({ ...modalState, originHistory: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button variant="ghost" type="button" onClick={() => setModalState({ ...modalState, open: false })}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon={Upload}>
                  Save Exercise
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
