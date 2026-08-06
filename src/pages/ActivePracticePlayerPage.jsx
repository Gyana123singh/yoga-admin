import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Volume2,
  VolumeX,
  Maximize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Wind,
  User,
  Heart,
  Flame,
  Clock,
  Activity,
  Square,
  Sparkles,
  ChevronRight,
  Leaf
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api, createSmartSocket } from '../services/api';

export function ActivePracticePlayerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useApp();
  const videoRef = useRef(null);

  // Retrieve parameters from router state or fallbacks matching Image 2 & 3
  const sessionData = location.state?.session || {
    title: '2-Minute Belly & Calm',
    subtitle: 'Personalised for you',
    feeling: 'Calm',
    focusArea: 'Belly / Core strength',
    totalDurationMinutes: 15,
    steps: [
      { id: 'step-1', title: '1. Breath Preparation', duration: '03:00', durationSeconds: 180, description: 'Deep breathing to center your mind and activate core.', category: 'Breath', icon: 'wind' },
      { id: 'step-2', title: '2. Core-Focused Yoga', duration: '08:00', durationSeconds: 480, description: 'Strengthen your core and improve posture stability.', category: 'Yoga Flow', icon: 'user' },
      { id: 'step-3', title: '3. Relaxation', duration: '02:00', durationSeconds: 120, description: 'Release tension and relax your entire body.', category: 'Relaxation', icon: 'lotus' },
      { id: 'step-4', title: '4. Cooling Breath', duration: '02:00', durationSeconds: 120, description: 'Calm your mind and complete your practice.', category: 'Cooling', icon: 'heart' }
    ]
  };

  // State Management
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(63); // 01:03
  const [totalStepSeconds, setTotalStepSeconds] = useState(180); // 03:00
  const [totalTimeLeftSeconds, setTotalTimeLeftSeconds] = useState(831); // 13:51
  const [calories, setCalories] = useState(38);
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const currentStep = sessionData.steps[activeStepIdx] || sessionData.steps[0];

  // Smart Auto-Failover Real-Time Synchronization Listener
  useEffect(() => {
    const socket = createSmartSocket(sessionData.feeling || 'Calm', () => {
      fetchVideos();
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [sessionData.feeling]);

  // Fetch admin uploaded videos with Local & Live auto-failover
  const fetchVideos = async () => {
    const list = await api.getVideos(sessionData.feeling || 'Calm');
    if (list && list.length > 0) {
      setUploadedVideos(list);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [sessionData.feeling]);

  // Playback Step Timer Effect
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalStepSeconds) {
            handleNextStep();
            return 0;
          }
          return prev + 1;
        });

        setTotalTimeLeftSeconds((prev) => Math.max(0, prev - 1));
        setCalories((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalStepSeconds, activeStepIdx]);

  // Media Control Handlers
  const handlePrevStep = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((prev) => prev - 1);
      setCurrentTime(0);
      setTotalStepSeconds(sessionData.steps[activeStepIdx - 1].durationSeconds || 180);
    }
  };

  const handleNextStep = () => {
    if (activeStepIdx < sessionData.steps.length - 1) {
      setActiveStepIdx((prev) => prev + 1);
      setCurrentTime(0);
      setTotalStepSeconds(sessionData.steps[activeStepIdx + 1].durationSeconds || 180);
    } else {
      setIsPlaying(false);
      handleEndSession();
    }
  };

  const handleEndSession = async () => {
    await api.logPracticeCompletion({
      title: sessionData.title,
      durationMinutes: sessionData.totalDurationMinutes,
      moodBefore: sessionData.feeling,
      targetArea: sessionData.focusArea
    });
    showToast(`🎉 Practice complete! Session logged successfully.`, 'success');
    navigate(-1);
  };

  // Dynamic Video Source Resolution
  const activeVideoUrl = uploadedVideos[activeStepIdx]?.videoUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const formatMinSec = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#1A1917] text-slate-900 dark:text-amber-50 font-serif select-none p-3 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-5">
        
        {/* Top Header Bar matching Images 2 & 3 */}
        <div className="flex items-center justify-between font-serif py-1">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-slate-800 dark:text-amber-100 shadow-sm hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="text-center font-serif">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-amber-50 leading-tight">
              {sessionData.title}
            </h1>
            <p className="text-xs font-sans text-stone-500 dark:text-stone-400 font-medium">
              {sessionData.subtitle || 'Personalised for you'}
            </p>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-[#E5EFE2] dark:bg-[#2A3824] border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#3B4D2B] dark:text-emerald-400 shadow-sm"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Video Player Card Section (Image 2) */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 dark:border-stone-800 bg-stone-900 group">
          {/* Top Floating Controls */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between font-sans text-xs">
            <button
              onClick={() => setIsAudioOnly(!isAudioOnly)}
              className="px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-white/40 text-slate-900 dark:text-white font-bold flex items-center gap-2 shadow-md hover:bg-white transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{isAudioOnly ? 'Switch to video instruction' : 'Change to sound-only instruction'}</span>
            </button>

            <button className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Video or Audio Poster */}
          {!isAudioOnly ? (
            <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={activeVideoUrl}
                autoPlay={isPlaying}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            </div>
          ) : (
            <div className="aspect-4/3 w-full gradient-bg-primary flex flex-col items-center justify-center text-white space-y-3 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-pulse-slow">
                <Wind className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm font-bold font-serif">Sound-only Audio Meditation Mode Active</p>
            </div>
          )}

          {/* Video Progress Bar & Scrub Timestamp Overlay (Image 2) */}
          <div className="absolute bottom-3 left-3 right-3 z-20 font-sans space-y-1.5">
            <div className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono font-bold text-xs">
              {formatMinSec(currentTime)} / {formatMinSec(totalStepSeconds)}
            </div>

            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-xs cursor-pointer">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / totalStepSeconds) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Instruction Card (Image 2) */}
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 flex items-center gap-3.5 shadow-2xs font-sans">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-serif text-slate-900 dark:text-amber-100">
              Focus on your breath.
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Inhale... Hold... Exhale...
            </p>
          </div>
        </div>

        {/* Session Flow List Section (Images 2 & 3) */}
        <div className="space-y-3 font-serif">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-amber-50">
              Session Flow
            </h3>
            <span className="text-xs font-sans font-bold text-stone-500">
              {sessionData.totalDurationMinutes} min
            </span>
          </div>

          <div className="space-y-2.5 font-sans">
            {sessionData.steps.map((st, idx) => {
              const isActive = activeStepIdx === idx;
              return (
                <button
                  key={st.id || idx}
                  onClick={() => {
                    setActiveStepIdx(idx);
                    setCurrentTime(0);
                    setTotalStepSeconds(st.durationSeconds || 180);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#F2F7F0] dark:bg-[#23301D] border-[#3B4D2B] shadow-sm'
                      : 'bg-white/80 dark:bg-stone-900/80 border-stone-200/80 dark:border-stone-800 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      isActive ? 'bg-[#3B4D2B] text-amber-50' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}>
                      {isActive ? <Play className="w-4 h-4 fill-amber-50 ml-0.5" /> : idx + 1}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold font-serif text-slate-900 dark:text-amber-100">
                        {st.title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[220px]">
                        {st.description || 'Practice sequence step'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300">{st.duration}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Controls Panel (Image 3) */}
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 flex items-center justify-evenly shadow-md font-sans">
          <button
            onClick={handlePrevStep}
            disabled={activeStepIdx === 0}
            className="flex flex-col items-center gap-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-slate-900 disabled:opacity-40 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <SkipBack className="w-5 h-5 fill-current" />
            </div>
            <span>Previous</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex flex-col items-center gap-1 text-xs font-bold text-[#3B4D2B] dark:text-amber-200 active:scale-95 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#3B4D2B] text-amber-50 flex items-center justify-center shadow-lg">
              {isPlaying ? <Pause className="w-7 h-7 fill-amber-50" /> : <Play className="w-7 h-7 fill-amber-50 ml-1" />}
            </div>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={activeStepIdx === sessionData.steps.length - 1}
            className="flex flex-col items-center gap-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-slate-900 disabled:opacity-40 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <SkipForward className="w-5 h-5 fill-current" />
            </div>
            <span>Next</span>
          </button>
        </div>

        {/* Live Telemetry & End Session Bar (Image 3) */}
        <div className="p-4 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-md font-sans text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">Time Left</span>
              <span className="font-bold font-mono text-slate-900 dark:text-amber-100 text-sm">
                {formatMinSec(totalTimeLeftSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-stone-200 dark:border-stone-800 pl-3">
            <Flame className="w-4 h-4 text-rose-500" />
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">Calories</span>
              <span className="font-bold font-mono text-slate-900 dark:text-amber-100 text-sm">
                {calories} kcal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-stone-200 dark:border-stone-800 pl-3">
            <Activity className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">Intensity</span>
              <span className="font-bold text-slate-900 dark:text-amber-100 text-xs">
                Moderate
              </span>
            </div>
          </div>

          <button
            onClick={handleEndSession}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white font-extrabold text-xs transition-all border border-rose-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>End Session</span>
          </button>
        </div>

      </div>
    </div>
  );
}
