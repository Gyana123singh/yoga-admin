import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Video, Clock, Check, Image as ImageIcon, 
  Sparkles, Layers, Play, ChevronRight, Eye, RefreshCw, Upload, Film, FileText, Tag, ArrowLeft
} from 'lucide-react';
import { getActiveApiUrl, getMediaUrl } from '../services/api';

export function ExploreSessionManagerPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'preview'
  const [selectedSessionForPreview, setSelectedSessionForPreview] = useState(null);

  // Modal states
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    badgeTag: 'BREATH',
    subtitle: '',
    totalDurationText: '12:45',
    heroImageUrlCustom: '',
    bgImageUrlCustom: '',
    order: 0,
    isActive: true
  });
  const [heroImageFile, setHeroImageFile] = useState(null);

  // Video Class Modal states
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [targetSessionId, setTargetSessionId] = useState(null);
  const [editingVideoClass, setEditingVideoClass] = useState(null);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    durationTag: '30 MINS',
    durationCategory: '30 Mins',
    subtitle: 'HD 1080p Video • Voice Guided',
    description: 'Quick & effective guided video class designed to awaken your body and sharpen mental focus in 30 minutes.',
    includesText: 'Includes: Sun Salutation, Child Pose, Downward Dog, Cobra',
    buttonText: 'Start 30 Mins Class',
    durationMinutes: 30,
    videoUrlCustom: '',
    thumbnailUrlCustom: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const activeApi = getActiveApiUrl();
      const res = await fetch(`${activeApi}/explore-sessions`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSessions(json.data);
          if (json.data.length > 0 && !selectedSessionForPreview) {
            setSelectedSessionForPreview(json.data[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Session Modal for Create/Edit
  const handleOpenSessionModal = (sessionToEdit = null) => {
    if (sessionToEdit) {
      setEditingSession(sessionToEdit);
      setSessionFormData({
        title: sessionToEdit.title || '',
        badgeTag: sessionToEdit.badgeTag || 'BREATH',
        subtitle: sessionToEdit.subtitle || '',
        totalDurationText: sessionToEdit.totalDurationText || '12:45',
        heroImageUrlCustom: sessionToEdit.heroImageUrl || '',
        bgImageUrlCustom: sessionToEdit.bgImageUrl || '',
        order: sessionToEdit.order || 0,
        isActive: sessionToEdit.isActive !== false
      });
    } else {
      setEditingSession(null);
      setSessionFormData({
        title: '',
        badgeTag: 'BREATH',
        subtitle: '',
        totalDurationText: '12:45',
        heroImageUrlCustom: '',
        bgImageUrlCustom: '',
        order: sessions.length + 1,
        isActive: true
      });
    }
    setHeroImageFile(null);
    setIsSessionModalOpen(true);
  };

  // Save Session (Create / Edit)
  const handleSaveSession = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const activeApi = getActiveApiUrl();
      const formData = new FormData();
      formData.append('title', sessionFormData.title);
      formData.append('badgeTag', sessionFormData.badgeTag);
      formData.append('subtitle', sessionFormData.subtitle);
      formData.append('totalDurationText', sessionFormData.totalDurationText);
      formData.append('order', sessionFormData.order);
      formData.append('isActive', sessionFormData.isActive);
      if (sessionFormData.heroImageUrlCustom) {
        formData.append('heroImageUrlCustom', sessionFormData.heroImageUrlCustom);
      }
      if (heroImageFile) {
        formData.append('heroImage', heroImageFile);
      }

      const url = editingSession 
        ? `${activeApi}/explore-sessions/${editingSession._id}`
        : `${activeApi}/explore-sessions`;
      
      const method = editingSession ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData
      });

      if (res.ok) {
        await fetchSessions();
        setIsSessionModalOpen(false);
      } else {
        alert('Failed to save session. Please try again.');
      }
    } catch (err) {
      console.error('Save Session error:', err);
      alert('Error saving session: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete Session
  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this Explore Session and all its video classes?')) {
      return;
    }
    try {
      const activeApi = getActiveApiUrl();
      const res = await fetch(`${activeApi}/explore-sessions/${sessionId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchSessions();
      }
    } catch (err) {
      console.error('Delete Session error:', err);
    }
  };

  // Open Video Class Modal
  const handleOpenVideoModal = (sessionId, videoClassToEdit = null) => {
    setTargetSessionId(sessionId);
    if (videoClassToEdit) {
      setEditingVideoClass(videoClassToEdit);
      setVideoFormData({
        title: videoClassToEdit.title || '',
        durationTag: videoClassToEdit.durationTag || '30 MINS',
        durationCategory: videoClassToEdit.durationCategory || '30 Mins',
        subtitle: videoClassToEdit.subtitle || 'HD 1080p Video • Voice Guided',
        description: videoClassToEdit.description || '',
        includesText: videoClassToEdit.includesText || 'Includes: Sun Salutation, Child Pose',
        buttonText: videoClassToEdit.buttonText || 'Start 30 Mins Class',
        durationMinutes: videoClassToEdit.durationMinutes || 30,
        videoUrlCustom: videoClassToEdit.videoUrl || '',
        thumbnailUrlCustom: videoClassToEdit.thumbnailUrl || ''
      });
    } else {
      setEditingVideoClass(null);
      setVideoFormData({
        title: '',
        durationTag: '30 MINS',
        durationCategory: '30 Mins',
        subtitle: 'HD 1080p Video • Voice Guided',
        description: 'Quick & effective guided video class designed to awaken your body and sharpen mental focus in 30 minutes.',
        includesText: 'Includes: Sun Salutation, Child Pose, Downward Dog, Cobra',
        buttonText: 'Start 30 Mins Class',
        durationMinutes: 30,
        videoUrlCustom: '',
        thumbnailUrlCustom: ''
      });
    }
    setVideoFile(null);
    setThumbnailFile(null);
    setIsVideoModalOpen(true);
  };

  // Save Video Class
  const handleSaveVideoClass = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const activeApi = getActiveApiUrl();
      const formData = new FormData();
      formData.append('title', videoFormData.title);
      formData.append('durationTag', videoFormData.durationTag);
      formData.append('durationCategory', videoFormData.durationCategory);
      formData.append('subtitle', videoFormData.subtitle);
      formData.append('description', videoFormData.description);
      formData.append('includesText', videoFormData.includesText);
      formData.append('buttonText', videoFormData.buttonText);
      formData.append('durationMinutes', videoFormData.durationMinutes);
      if (videoFormData.videoUrlCustom) formData.append('videoUrlCustom', videoFormData.videoUrlCustom);
      if (videoFormData.thumbnailUrlCustom) formData.append('thumbnailUrlCustom', videoFormData.thumbnailUrlCustom);

      if (videoFile) formData.append('video', videoFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const url = editingVideoClass
        ? `${activeApi}/explore-sessions/${targetSessionId}/video-classes/${editingVideoClass._id}`
        : `${activeApi}/explore-sessions/${targetSessionId}/video-classes`;
      
      const method = editingVideoClass ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });

      if (res.ok) {
        await fetchSessions();
        setIsVideoModalOpen(false);
      } else {
        alert('Failed to save video class.');
      }
    } catch (err) {
      console.error('Save Video Class error:', err);
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete Video Class
  const handleDeleteVideoClass = async (sessionId, classId) => {
    if (!window.confirm('Delete this video class from session?')) return;
    try {
      const activeApi = getActiveApiUrl();
      const res = await fetch(`${activeApi}/explore-sessions/${sessionId}/video-classes/${classId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchSessions();
      }
    } catch (err) {
      console.error('Delete Video Class error:', err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              User Explore Page Flow
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">• Real-Time Backend API</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Explore Sessions & Video Classes Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add sessions for user side. Clicking a session opens its video classes screen (Image 2) & plays the class video.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSessions()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'manage' ? 'preview' : 'manage')}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>{activeTab === 'manage' ? 'Live App Preview' : 'Back to Manager'}</span>
          </button>

          <button
            onClick={() => handleOpenSessionModal()}
            className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-glow-primary hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Explore Session</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      {activeTab === 'manage' ? (
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-500">Loading explore sessions from server...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Sessions Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click "+ Add Explore Session" above to create your first session (e.g., Morning Prana Boost) and upload video classes for users.
              </p>
              <button
                onClick={() => handleOpenSessionModal()}
                className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Session</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {sessions.map((session) => {
                const videoClassesCount = session.videoClasses ? session.videoClasses.length : 0;
                
                return (
                  <div
                    key={session._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    {/* Session Card Header Bar */}
                    <div className="p-5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                          <img
                            src={getMediaUrl(session.heroImageUrl) || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=300'}
                            alt={session.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[8px] font-bold text-white uppercase">
                            {session.badgeTag || 'BREATH'}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
                              {session.title}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                              {videoClassesCount} {videoClassesCount === 1 ? 'Class' : 'Classes'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl font-serif">
                            {session.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons for Session */}
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          onClick={() => handleOpenVideoModal(session._id)}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Video Class</span>
                        </button>

                        <button
                          onClick={() => handleOpenSessionModal(session)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Session"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteSession(session._id)}
                          className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inner Video Classes Grid */}
                    <div className="p-5 pt-0">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                        <Film className="w-4 h-4 text-indigo-500" />
                        <span>Session Video Classes (Screen 2 List)</span>
                      </h4>

                      {videoClassesCount === 0 ? (
                        <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                          No video classes added to this session yet. Click "Add Video Class" to add 30 Mins / 1 Hour classes.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {session.videoClasses.map((cls) => {
                            const thumb = getMediaUrl(cls.thumbnailUrl) || getMediaUrl(session.heroImageUrl) || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=400';
                            
                            return (
                              <div
                                key={cls._id}
                                className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between space-y-3"
                              >
                                <div className="flex gap-3">
                                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                                    <img
                                      src={thumb}
                                      alt={cls.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                      <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                                      </div>
                                    </div>
                                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-emerald-300">
                                      {cls.durationTag || '30 MINS'}
                                    </span>
                                  </div>

                                  <div className="flex-1 min-w-0 space-y-1">
                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white font-serif leading-snug truncate">
                                      {cls.title}
                                    </h5>
                                    <p className="text-[11px] font-medium text-slate-400">
                                      {cls.subtitle || 'HD 1080p Video • Voice Guided'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                      {cls.description}
                                    </p>
                                  </div>
                                </div>

                                {cls.includesText && (
                                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-serif italic truncate">
                                    {cls.includesText}
                                  </p>
                                )}

                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    CTA: {cls.buttonText || 'Start Class'}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleOpenVideoModal(session._id, cls)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 transition-colors flex items-center gap-1"
                                    >
                                      <Edit2 className="w-3 h-3" /> Edit
                                    </button>

                                    <button
                                      onClick={() => handleDeleteVideoClass(session._id, cls._id)}
                                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Select Session to Preview Screen 2
              </h3>
              <div className="space-y-2">
                {sessions.map(s => (
                  <button
                    key={s._id}
                    onClick={() => setSelectedSessionForPreview(s)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      selectedSessionForPreview?._id === s._id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{s.title}</p>
                      <p className="text-[10px] text-slate-400">{s.videoClasses?.length || 0} Video Classes</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Screen Mockup Preview */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="w-[380px] h-[720px] bg-[#FAF9F5] rounded-[40px] border-[8px] border-slate-900 shadow-2xl overflow-hidden flex flex-col font-serif relative text-stone-800">
              {/* Top Notch */}
              <div className="h-6 bg-slate-900 w-full flex items-center justify-center">
                <div className="w-20 h-3 bg-slate-800 rounded-full" />
              </div>

              {/* Mobile Header (Image 2) */}
              <div className="p-4 flex items-center justify-between border-b border-stone-200 bg-white">
                <button className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h4 className="text-xs font-extrabold text-stone-900 text-center flex-1 mx-2 truncate font-serif">
                  {selectedSessionForPreview?.title || 'Morning Prana Boost'}
                </h4>
                <div className="w-8" />
              </div>

              {/* Mobile Body Content */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 no-scrollbar">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-stone-900">Session Video Classes</h4>
                  <span className="text-[10px] text-stone-400 font-serif font-medium">
                    {selectedSessionForPreview?.videoClasses?.length || 0} Classes
                  </span>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 text-[10px] font-sans">
                  <span className="px-3 py-1 rounded-lg bg-[#2E4028] text-white font-bold">All</span>
                  <span className="px-3 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 font-bold">30 Mins</span>
                  <span className="px-3 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 font-bold">1 Hour</span>
                </div>

                {/* Video Cards list preview */}
                <div className="space-y-4">
                  {(selectedSessionForPreview?.videoClasses || []).map((cls, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-2 p-3">
                      <div className="relative h-32 w-full rounded-xl bg-stone-900 overflow-hidden">
                        <img
                          src={getMediaUrl(cls.thumbnailUrl) || getMediaUrl(selectedSessionForPreview.heroImageUrl)}
                          alt={cls.title}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 text-[#2E4028] flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white text-[#2E4028] text-[8px] font-extrabold font-sans uppercase">
                          {cls.durationTag || '30 MINS'}
                        </span>
                      </div>

                      <h5 className="text-xs font-extrabold text-stone-900 leading-snug">{cls.title}</h5>
                      <p className="text-[10px] text-stone-400 font-sans">{cls.subtitle || 'HD 1080p Video • Voice Guided'}</p>
                      <p className="text-[10px] text-stone-600 line-clamp-2">{cls.description}</p>
                      <button className="w-full py-2.5 rounded-xl bg-[#2E4028] text-white text-[10px] font-serif font-extrabold flex items-center justify-center gap-1">
                        <Play className="w-3 h-3 fill-white" />
                        <span>{cls.buttonText || 'Start Class'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EXPLORE SESSION */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
                {editingSession ? 'Edit Explore Session' : 'Add New Explore Session'}
              </h3>
              <button
                onClick={() => setIsSessionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Prana Boost"
                  value={sessionFormData.title}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-serif text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badge Tag *
                  </label>
                  <select
                    value={sessionFormData.badgeTag}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, badgeTag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="BREATH">BREATH</option>
                    <option value="CALM">CALM</option>
                    <option value="ADVANCED">ADVANCED</option>
                    <option value="VITALITY">VITALITY</option>
                    <option value="FULL BODY">FULL BODY</option>
                    <option value="STRESS">STRESS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Duration Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12:45"
                    value={sessionFormData.totalDurationText}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, totalDurationText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-serif text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle / Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Energize your body and mind with refreshing breathing techniques • 12:45"
                  value={sessionFormData.subtitle}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-serif text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Background Image (Upload file or paste URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  value={sessionFormData.heroImageUrlCustom}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, heroImageUrlCustom: e.target.value })}
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSession ? 'Update Session' : 'Create Session'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT VIDEO CLASS INSIDE SESSION */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
                {editingVideoClass ? 'Edit Session Video Class' : 'Add Session Video Class (Screen 2)'}
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVideoClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Video Class Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30 Min Express Morning Prana Boost"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-serif text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration Tag Pill *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 MINS or 1 HOUR"
                    value={videoFormData.durationTag}
                    onChange={(e) => setVideoFormData({ ...videoFormData, durationTag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Filter Tab Category *
                  </label>
                  <select
                    value={videoFormData.durationCategory}
                    onChange={(e) => setVideoFormData({ ...videoFormData, durationCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans text-slate-900 dark:text-white"
                  >
                    <option value="30 Mins">30 Mins</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="15 Mins">15 Mins</option>
                    <option value="45 Mins">45 Mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle Line
                </label>
                <input
                  type="text"
                  placeholder="e.g. HD 1080p Video • Voice Guided"
                  value={videoFormData.subtitle}
                  onChange={(e) => setVideoFormData({ ...videoFormData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Quick & effective guided video class designed to awaken your body and sharpen mental focus in 30 minutes."
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-serif text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Includes Poses Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Includes: Sun Salutation, Child Pose, Downward Dog, Cobra"
                  value={videoFormData.includesText}
                  onChange={(e) => setVideoFormData({ ...videoFormData, includesText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-serif text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Start 30 Mins Class"
                    value={videoFormData.buttonText}
                    onChange={(e) => setVideoFormData({ ...videoFormData, buttonText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (in Minutes)
                  </label>
                  <input
                    type="number"
                    value={videoFormData.durationMinutes}
                    onChange={(e) => setVideoFormData({ ...videoFormData, durationMinutes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Video File Upload */}
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-2">
                <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-indigo-600" />
                  <span>Class Video File (MP4/WEBM Upload or Custom URL)</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
                <input
                  type="text"
                  placeholder="Or paste MP4 video URL (https://...)"
                  value={videoFormData.videoUrlCustom}
                  onChange={(e) => setVideoFormData({ ...videoFormData, videoUrlCustom: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-sans"
                />
              </div>

              {/* Thumbnail Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Video Thumbnail Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingVideoClass ? 'Update Class' : 'Save Video Class'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
