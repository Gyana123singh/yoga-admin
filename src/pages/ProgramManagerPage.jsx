import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Flower2,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Calendar,
  Lock,
  Upload,
  Play,
  Layers,
  CheckCircle2,
  Clock,
  Flame,
  Video,
  ListOrdered,
  X
} from 'lucide-react';

export function ProgramManagerPage() {
  const { showToast } = useApp();

  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Program Form Modal
  const [formModal, setFormModal] = useState({
    open: false,
    isEdit: false,
    id: null,
    title: '',
    subtitle: '',
    goalCategory: 'Strength',
    totalDays: 30,
    difficultyLevel: 'Intermediate',
    enrolledCount: '8.5K+',
    freeDaysCount: 2,
    tags: 'Core Activation, Abdominal Strength',
    heroImageUrlCustom: '',
    heroImageFile: null
  });

  // Day & Step Sessions Schedule Builder Modal
  const [scheduleModal, setScheduleModal] = useState({
    open: false,
    program: null,
    selectedDayNumber: 1,
    dayTitle: 'Core Awareness',
    focusTitle: 'Core Activation',
    focusDescription: 'Activate your core, improve body awareness and connect with your breath.',
    durationMinutes: 15,
    estimatedCalories: 112,
    difficultyTag: 'Beginner Friendly',
    steps: [
      {
        stepNumber: 1,
        title: 'Breath Preparation',
        subtitle: 'Deep breathing',
        durationSeconds: 180,
        instructionTitle: 'Inhale',
        instructionDetail: 'Breathe in slowly through your nose and fill your lungs and slowly release.',
        videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
        poseImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
      }
    ]
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setIsLoading(true);
    const data = await api.getYogaPrograms();
    if (data) setPrograms(data);
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formModal.title);
    formData.append('subtitle', formModal.subtitle);
    formData.append('goalCategory', formModal.goalCategory);
    formData.append('totalDays', formModal.totalDays);
    formData.append('difficultyLevel', formModal.difficultyLevel);
    formData.append('enrolledCount', formModal.enrolledCount);
    formData.append('freeDaysCount', formModal.freeDaysCount);
    formData.append('heroImageUrlCustom', formModal.heroImageUrlCustom);

    const tagsArray = typeof formModal.tags === 'string'
      ? formModal.tags.split(',').map(t => t.trim())
      : formModal.tags;
    formData.append('tags', JSON.stringify(tagsArray));

    if (formModal.heroImageFile) {
      formData.append('heroImage', formModal.heroImageFile);
    }

    try {
      if (formModal.isEdit) {
        const updated = await api.updateYogaProgram(formModal.id, formData);
        if (updated) {
          setPrograms((prev) => prev.map((p) => (p._id === formModal.id ? updated : p)));
          showToast(`Goal Program "${formModal.title}" updated`, 'success');
        }
      } else {
        const created = await api.createYogaProgram(formData);
        if (created) {
          setPrograms((prev) => [...prev, created]);
          showToast(`Goal Program "${formModal.title}" created`, 'success');
        }
      }
      closeForm();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    await api.deleteYogaProgram(id);
    setPrograms((prev) => prev.filter((p) => p._id !== id && p.id !== id));
    showToast(`Goal Program "${title}" deleted`, 'info');
  };

  const openScheduleModal = (prog) => {
    const defaultSchedules = prog.dailySchedules || [];
    const day1 = defaultSchedules.find(d => d.dayNumber === 1) || {
      dayNumber: 1,
      title: 'Core Awareness',
      focusTitle: 'Core Activation',
      focusDescription: 'Activate your core, improve body awareness and connect with your breath.',
      durationMinutes: 15,
      estimatedCalories: 112,
      difficultyTag: 'Beginner Friendly',
      steps: [
        {
          stepNumber: 1,
          title: 'Breath Preparation',
          subtitle: 'Deep breathing',
          durationSeconds: 180,
          instructionTitle: 'Inhale',
          instructionDetail: 'Breathe in slowly through your nose and fill your lungs and slowly release.',
          videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
          poseImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
        }
      ]
    };

    setScheduleModal({
      open: true,
      program: prog,
      selectedDayNumber: 1,
      dayTitle: day1.title,
      focusTitle: day1.focusTitle,
      focusDescription: day1.focusDescription,
      durationMinutes: day1.durationMinutes,
      estimatedCalories: day1.estimatedCalories,
      difficultyTag: day1.difficultyTag,
      steps: day1.steps || []
    });
  };

  const handleSelectDay = (dayNum) => {
    const prog = scheduleModal.program;
    const defaultSchedules = prog?.dailySchedules || [];
    const targetDay = defaultSchedules.find(d => d.dayNumber === dayNum) || {
      dayNumber: dayNum,
      title: `Day ${dayNum} Focus`,
      focusTitle: `Day ${dayNum} Activation`,
      focusDescription: 'Perform exercises with steady breath and focus.',
      durationMinutes: 15,
      estimatedCalories: 110,
      difficultyTag: 'All Levels',
      steps: [
        {
          stepNumber: 1,
          title: 'Breath Preparation',
          subtitle: 'Deep breathing',
          durationSeconds: 180,
          instructionTitle: 'Inhale',
          instructionDetail: 'Breathe in slowly through your nose and fill your lungs.',
          videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
          poseImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
        }
      ]
    };

    setScheduleModal((prev) => ({
      ...prev,
      selectedDayNumber: dayNum,
      dayTitle: targetDay.title,
      focusTitle: targetDay.focusTitle,
      focusDescription: targetDay.focusDescription,
      durationMinutes: targetDay.durationMinutes,
      estimatedCalories: targetDay.estimatedCalories,
      difficultyTag: targetDay.difficultyTag,
      steps: targetDay.steps || []
    }));
  };

  const handleSaveDaySchedule = async () => {
    const prog = scheduleModal.program;
    if (!prog) return;

    let existingSchedules = prog.dailySchedules ? [...prog.dailySchedules] : [];
    const dayIndex = existingSchedules.findIndex(d => d.dayNumber === scheduleModal.selectedDayNumber);

    const newDayObj = {
      dayNumber: scheduleModal.selectedDayNumber,
      title: scheduleModal.dayTitle,
      focusTitle: scheduleModal.focusTitle,
      focusDescription: scheduleModal.focusDescription,
      durationMinutes: parseInt(scheduleModal.durationMinutes) || 15,
      estimatedCalories: parseInt(scheduleModal.estimatedCalories) || 110,
      difficultyTag: scheduleModal.difficultyTag,
      isFree: scheduleModal.selectedDayNumber <= (prog.freeDaysCount || 2),
      steps: scheduleModal.steps
    };

    if (dayIndex >= 0) {
      existingSchedules[dayIndex] = newDayObj;
    } else {
      existingSchedules.push(newDayObj);
    }

    const formData = new FormData();
    formData.append('dailySchedules', JSON.stringify(existingSchedules));

    const updated = await api.updateYogaProgram(prog._id || prog.id, formData);
    if (updated) {
      setPrograms((prev) => prev.map((p) => (p._id === (prog._id || prog.id) ? updated : p)));
      showToast(`Day ${scheduleModal.selectedDayNumber} session schedule saved for "${prog.title}"!`, 'success');
      setScheduleModal({ ...scheduleModal, open: false });
    }
  };

  const addStepToDay = () => {
    const nextStepNum = scheduleModal.steps.length + 1;
    const newStep = {
      stepNumber: nextStepNum,
      title: `Step ${nextStepNum} Asana`,
      subtitle: 'Postural alignment',
      durationSeconds: 180,
      instructionTitle: 'Inhale',
      instructionDetail: 'Breathe steadily and hold pose with active core.',
      videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
      poseImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    };
    setScheduleModal((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeStepFromDay = (index) => {
    const updated = scheduleModal.steps.filter((_, idx) => idx !== index);
    setScheduleModal((prev) => ({ ...prev, steps: updated }));
  };

  const closeForm = () => {
    setFormModal({
      open: false,
      isEdit: false,
      id: null,
      title: '',
      subtitle: '',
      goalCategory: 'Strength',
      totalDays: 30,
      difficultyLevel: 'Intermediate',
      enrolledCount: '8.5K+',
      freeDaysCount: 2,
      tags: 'Core Activation, Abdominal Strength',
      heroImageUrlCustom: '',
      heroImageFile: null
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 mb-2">
            <Flower2 className="w-3.5 h-3.5" />
            <span>Dedicated Goal-Based Yoga Programmes Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Goal-Based Programmes Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Configure 30-Day Goal Journeys (Strength, Mobility, Mind, Energy), Daily Session Timelines, Free Trial Days, and Step Videos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadPrograms}>
            Sync Database
          </Button>
        </div>
      </div>

      {/* Program Grid */}
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
                goalCategory: 'Strength',
                totalDays: 30,
                difficultyLevel: 'Intermediate',
                enrolledCount: '8.5K+',
                freeDaysCount: 2,
                tags: 'Core Activation, Abdominal Strength',
                heroImageUrlCustom: '',
                heroImageFile: null
              })}
            >
              Add Programme
            </Button>
          }
        >
          <CardTitle subtitle="Manage 30-Day Journeys, Free Days & Subscribed Locks">
            Configured Goal Programmes ({programs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div key={prog._id || prog.id} className="p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs group hover:border-emerald-500/40 transition-all">
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden">
                  <img src={prog.heroImageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop'} alt={prog.title} className="w-full h-full object-cover opacity-85" />
                  <Badge variant="indigo" className="absolute top-2 left-2">
                    {prog.goalCategory || 'Strength'}
                  </Badge>
                  <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold">
                    {prog.totalDays} Days
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{prog.title}</h4>
                  <p className="text-xs text-slate-400 font-medium truncate">{prog.subtitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5 text-slate-500 font-medium">
                  <p className="flex items-center justify-between">
                    <span>Level: <strong className="text-slate-800 dark:text-slate-200">{prog.difficultyLevel || 'Intermediate'}</strong></span>
                    <span className="text-emerald-500 font-bold">{prog.enrolledCount || '8.5K+'} Enrolled</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-amber-500 font-bold">
                    <Lock className="w-3.5 h-3.5" /> Free Trial: {prog.freeDaysCount || 2} Days Unlocked
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {/* Button to open 30-Day Step Session Schedule Builder */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                    icon={ListOrdered}
                    onClick={() => openScheduleModal(prog)}
                  >
                    Manage Days & Step Sessions
                  </Button>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => setFormModal({
                        open: true,
                        isEdit: true,
                        id: prog._id || prog.id,
                        title: prog.title,
                        subtitle: prog.subtitle || '',
                        goalCategory: prog.goalCategory || 'Strength',
                        totalDays: prog.totalDays || 30,
                        difficultyLevel: prog.difficultyLevel || 'Intermediate',
                        enrolledCount: prog.enrolledCount || '8.5K+',
                        freeDaysCount: prog.freeDaysCount || 2,
                        tags: (prog.tags || []).join(', '),
                        heroImageUrlCustom: prog.heroImageUrl || '',
                        heroImageFile: null
                      })}
                    >
                      Edit Info
                    </Button>

                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(prog._id || prog.id, prog.title)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PROGRAM FORM MODAL */}
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
              <Flower2 className="w-5 h-5 text-emerald-500" />
              {formModal.isEdit ? 'Edit Goal Programme' : 'Add New Goal Programme'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Programme Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core & Belly Strength"
                  value={formModal.title}
                  onChange={(e) => setFormModal({ ...formModal, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Build a stronger core and improve stability & overall fitness."
                  value={formModal.subtitle}
                  onChange={(e) => setFormModal({ ...formModal, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Goal Category</label>
                  <select
                    value={formModal.goalCategory}
                    onChange={(e) => setFormModal({ ...formModal, goalCategory: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Mind">Mind</option>
                    <option value="Energy">Energy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Days</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formModal.totalDays}
                    onChange={(e) => setFormModal({ ...formModal, totalDays: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Difficulty Level</label>
                  <select
                    value={formModal.difficultyLevel}
                    onChange={(e) => setFormModal({ ...formModal, difficultyLevel: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Free Trial Days Unlocked</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formModal.freeDaysCount}
                    onChange={(e) => setFormModal({ ...formModal, freeDaysCount: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Core Activation, Abdominal Strength"
                  value={formModal.tags}
                  onChange={(e) => setFormModal({ ...formModal, tags: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Hero Image Upload + Optional URL */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Hero Image (Upload File OR Optional URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormModal({ ...formModal, heroImageFile: e.target.files[0] })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white"
                />
                <input
                  type="url"
                  placeholder="OR enter Hero Image URL (e.g. https://images.unsplash.com/...)"
                  value={formModal.heroImageUrlCustom}
                  onChange={(e) => setFormModal({ ...formModal, heroImageUrlCustom: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <Button variant="ghost" type="button" onClick={closeForm} className="w-full sm:w-auto">
                  Cancel
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={async (e) => {
                      await handleSave(e);
                      const targetProg = programs.find(p => p.title === formModal.title) || programs[0];
                      if (targetProg) openScheduleModal(targetProg);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <ListOrdered className="w-4 h-4" />
                    <span>Manage Sessions →</span>
                  </button>

                  <Button variant="primary" type="submit" icon={Upload} className="whitespace-nowrap">
                    Save Programme
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAY & STEP SESSIONS SCHEDULE BUILDER MODAL */}
      {scheduleModal.open && scheduleModal.program && (
        <div
          onClick={() => setScheduleModal({ ...scheduleModal, open: false })}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans relative cursor-default"
          >
            <button
              onClick={() => setScheduleModal({ ...scheduleModal, open: false })}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 pr-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-emerald-500" />
                  Manage Days & Step Sessions ({scheduleModal.program.title})
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Add/Edit all Day sessions with instructions, duration, and related video stream for each day!
                </p>
              </div>
            </div>

            {/* DAY SELECTOR TABS (Day 1 to Day 30) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Select Day Number</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {Array.from({ length: scheduleModal.program.totalDays || 30 }, (_, i) => i + 1).map((dayNum) => (
                  <button
                    key={dayNum}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      scheduleModal.selectedDayNumber === dayNum
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Day {dayNum} {dayNum <= (scheduleModal.program.freeDaysCount || 2) ? '🔓' : '🔒'}
                  </button>
                ))}
              </div>
            </div>

            {/* DAY METADATA FORM */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-3">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider block">
                Day {scheduleModal.selectedDayNumber} Overview Config
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Day Card Title</label>
                  <input
                    type="text"
                    value={scheduleModal.dayTitle}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, dayTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Today's Focus Title</label>
                  <input
                    type="text"
                    value={scheduleModal.focusTitle}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, focusTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-800 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Focus Description</label>
                <input
                  type="text"
                  value={scheduleModal.focusDescription}
                  onChange={(e) => setScheduleModal({ ...scheduleModal, focusDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={scheduleModal.durationMinutes}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Est Calories (kcal)</label>
                  <input
                    type="number"
                    value={scheduleModal.estimatedCalories}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, estimatedCalories: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Difficulty Tag</label>
                  <input
                    type="text"
                    value={scheduleModal.difficultyTag}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, difficultyTag: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* STEP SESSIONS SEQUENCE EDITOR */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Today's Step Sessions Sequence ({scheduleModal.steps.length} Steps)
                </span>
                <Button variant="outline" size="sm" icon={Plus} onClick={addStepToDay}>
                  Add Step Session
                </Button>
              </div>

              <div className="space-y-4">
                {scheduleModal.steps.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 font-extrabold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => removeStepFromDay(idx)}>
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Step Asana Title</label>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const updated = [...scheduleModal.steps];
                            updated[idx].title = e.target.value;
                            setScheduleModal({ ...scheduleModal, steps: updated });
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={st.subtitle}
                          onChange={(e) => {
                            const updated = [...scheduleModal.steps];
                            updated[idx].subtitle = e.target.value;
                            setScheduleModal({ ...scheduleModal, steps: updated });
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Duration Seconds</label>
                        <input
                          type="number"
                          value={st.durationSeconds}
                          onChange={(e) => {
                            const updated = [...scheduleModal.steps];
                            updated[idx].durationSeconds = parseInt(e.target.value) || 180;
                            setScheduleModal({ ...scheduleModal, steps: updated });
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Instruction Sub-Title</label>
                        <input
                          type="text"
                          value={st.instructionTitle}
                          onChange={(e) => {
                            const updated = [...scheduleModal.steps];
                            updated[idx].instructionTitle = e.target.value;
                            setScheduleModal({ ...scheduleModal, steps: updated });
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Detailed Step Instructions</label>
                      <textarea
                        rows={2}
                        value={st.instructionDetail}
                        onChange={(e) => {
                          const updated = [...scheduleModal.steps];
                          updated[idx].instructionDetail = e.target.value;
                          setScheduleModal({ ...scheduleModal, steps: updated });
                        }}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Step Video Stream File Upload + URL */}
                    <div className="p-3 rounded-xl bg-slate-200/60 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Step Instructor Video (Upload File OR Enter URL)</span>
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          showToast(`Uploading step video file...`, 'info');
                          const formData = new FormData();
                          formData.append('media', file);
                          try {
                            const res = await fetch('http://localhost:5000/api/quick-practices/upload', {
                              method: 'POST',
                              body: formData
                            });
                            if (res.ok) {
                              const data = await res.json();
                              const uploadedUrl = data.url;
                              const updated = [...scheduleModal.steps];
                              updated[idx].videoUrl = uploadedUrl;
                              setScheduleModal({ ...scheduleModal, steps: updated });
                              showToast(`Step video file uploaded successfully!`, 'success');
                            }
                          } catch (err) {
                            showToast(`Upload failed: ${err.message}`, 'error');
                          }
                        }}
                        className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white cursor-pointer"
                      />
                      <input
                        type="url"
                        placeholder="OR enter Video URL (e.g. https://cdn.pixabay.com/video/...)"
                        value={st.videoUrl}
                        onChange={(e) => {
                          const updated = [...scheduleModal.steps];
                          updated[idx].videoUrl = e.target.value;
                          setScheduleModal({ ...scheduleModal, steps: updated });
                        }}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setScheduleModal({ ...scheduleModal, open: false })}>
                Cancel
              </Button>
              <Button variant="primary" icon={CheckCircle2} onClick={handleSaveDaySchedule}>
                Save Day {scheduleModal.selectedDayNumber} Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
