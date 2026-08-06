import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Info,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Music,
  Wind,
  Flower2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export function QuickPracticeTimerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useApp();

  // Retrieve selected practice parameters or fallback
  const practiceData = location.state?.practice || {
    title: '2 Min Quick Reset',
    subtitle: 'Mindful Breath • Inner Balance',
    durationMinutes: 2,
    badgeText: 'Quick Practice Session',
    bgImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a14f4e.mp3',
    phases: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Retain Breath Gently' },
      { phase: 'EXHALE', durationSeconds: 4, instruction: 'Release Slowly' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Rest & Pause' }
    ]
  };

  // State Management
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState(practiceData.phases[0]?.durationSeconds || 4);
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState((practiceData.durationMinutes || 2) * 60);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(true);
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Audio References
  const musicAudioRef = useRef(null);
  const voiceAudioRef = useRef(null);

  const currentPhase = practiceData.phases[phaseIdx] || practiceData.phases[0];

  // Handle Background Music Audio Playback
  useEffect(() => {
    if (musicAudioRef.current) {
      if (isPlaying && bgMusicEnabled && practiceData.bgMusicUrl) {
        musicAudioRef.current.play().catch(() => {});
      } else {
        musicAudioRef.current.pause();
      }
    }
  }, [isPlaying, bgMusicEnabled, practiceData.bgMusicUrl]);

  // Handle Voice Guidance Audio Playback
  useEffect(() => {
    if (voiceAudioRef.current) {
      if (isPlaying && voiceGuidanceEnabled && practiceData.voiceGuidanceUrl) {
        voiceAudioRef.current.play().catch(() => {});
      } else {
        voiceAudioRef.current.pause();
      }
    }
  }, [isPlaying, voiceGuidanceEnabled, practiceData.voiceGuidanceUrl]);

  // Breathing Phase Timer Countdown Effect
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsLeftInPhase((prevSec) => {
          if (prevSec <= 1) {
            // Transition to next phase
            const nextIdx = (phaseIdx + 1) % practiceData.phases.length;
            setPhaseIdx(nextIdx);
            return practiceData.phases[nextIdx].durationSeconds || 4;
          }
          return prevSec - 1;
        });

        setTotalSecondsRemaining((prevTotal) => {
          if (prevTotal <= 1) {
            handleCompletePractice();
            return 0;
          }
          return prevTotal - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, phaseIdx, practiceData.phases]);

  const handleStop = () => {
    setIsPlaying(false);
    navigate(-1);
  };

  const handleCompletePractice = async () => {
    setIsPlaying(false);
    await api.logPracticeCompletion({
      title: practiceData.title,
      durationMinutes: practiceData.durationMinutes || 2,
      practiceType: 'Quick Practice'
    });
    showToast(`🎉 Quick Practice "${practiceData.title}" completed!`, 'success');
    navigate(-1);
  };

  const formatMinSec = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 select-none bg-cover bg-center font-serif overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(10, 20, 15, 0.75), rgba(10, 20, 15, 0.85)), url('${practiceData.bgImageUrl}')`
      }}
    >
      {/* Background Audio Elements */}
      {practiceData.bgMusicUrl && (
        <audio ref={musicAudioRef} src={practiceData.bgMusicUrl} loop />
      )}
      {practiceData.voiceGuidanceUrl && (
        <audio ref={voiceAudioRef} src={practiceData.voiceGuidanceUrl} loop />
      )}

      {/* TOP HEADER BAR matching Images 2 & 5 */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between z-10 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md hover:bg-white/25 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center font-serif text-white">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
            {practiceData.title}
          </h1>
          <p className="text-xs font-sans text-stone-300 font-medium">
            {practiceData.subtitle || 'Mindful Breath • Inner Balance'}
          </p>
        </div>

        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md hover:bg-white/25 transition-all"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* TOP PILL BADGE */}
      <div className="w-full max-w-xl mx-auto text-center z-10 my-2">
        <span className="inline-block px-5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-sans text-xs font-bold shadow-sm">
          {practiceData.badgeText || 'Quick Practice Session'}
        </span>
      </div>

      {/* CENTRAL ROUND MANDALA FRAME & BREATHING VISUALIZER (Images 2 & 5) */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center z-10 my-auto">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Custom Admin Decorative Mandala Ring Frame Image (or SVG fallback) */}
          {practiceData.frameDesignUrl ? (
            <img
              src={practiceData.frameDesignUrl}
              alt="Mandala Frame"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none animate-spin-slow drop-shadow-2xl scale-110"
            />
          ) : (
            <div className="absolute inset-0 rounded-full border-4 border-amber-400/40 animate-spin-slow pointer-events-none flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300/30 p-2">
                <div className="w-full h-full rounded-full border-8 border-amber-500/20" />
              </div>
            </div>
          )}

          {/* Decorative Outer Sun/Lotus Petals matching Images 2 & 5 */}
          <svg className="absolute inset-0 w-full h-full text-amber-400/80 animate-pulse-slow pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </svg>

          {/* Inner Circular Timer Card */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-stone-100/95 dark:bg-stone-900/95 backdrop-blur-xl border-4 border-[#3B4D2B] dark:border-emerald-600 shadow-2xl flex flex-col items-center justify-center p-6 text-center text-slate-900 dark:text-amber-50 font-serif space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#3B4D2B]/10 dark:bg-emerald-500/20 text-[#3B4D2B] dark:text-emerald-400 flex items-center justify-center">
              <Flower2 className="w-5 h-5" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-[#3B4D2B] dark:text-emerald-400">
              {currentPhase.phase}
            </h2>

            <p className="text-xs font-sans text-stone-500 dark:text-stone-400 font-medium px-2">
              {currentPhase.instruction || 'Retain Breath Gently'}
            </p>

            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white pt-1">
              {formatMinSec(secondsLeftInPhase)}
            </div>
          </div>
        </div>

        {/* Caption instruction matching Images 2 & 5 */}
        <p className="text-xs font-sans text-amber-100/90 mt-6 text-center italic tracking-wide">
          🍃 Follow the sound. Breathe in... Breathe out... 🍃
        </p>
      </div>

      {/* MEDIA CONTROLS & TOGGLES (Images 2 & 5) */}
      <div className="w-full max-w-xl mx-auto space-y-5 z-10 pb-4">
        {/* Stop & Pause/Play Buttons */}
        <div className="flex items-center justify-center gap-6 font-sans">
          <button
            onClick={handleStop}
            className="flex flex-col items-center gap-1 text-xs font-bold text-stone-300 hover:text-white transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-amber-100/90 dark:bg-stone-800/90 text-amber-900 dark:text-amber-200 flex items-center justify-center shadow-lg">
              <Square className="w-5 h-5 fill-current" />
            </div>
            <span>Stop</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex flex-col items-center gap-1 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-[#1C3A27] text-white flex items-center justify-center shadow-2xl border border-emerald-500/40">
              {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
            </div>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        {/* Audio Toggle Switches matching Images 2 & 5 */}
        <div className="grid grid-cols-2 gap-4 font-sans">
          {/* Voice Guidance Toggle */}
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                {voiceGuidanceEnabled ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4 text-stone-400" />}
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-amber-100 leading-tight">
                Voice Guidance
              </span>
            </div>

            <button
              onClick={() => setVoiceGuidanceEnabled(!voiceGuidanceEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                voiceGuidanceEnabled ? 'bg-[#23381B]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  voiceGuidanceEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Music Toggle */}
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                <Music className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-amber-100 leading-tight">
                Background Music
              </span>
            </div>

            <button
              onClick={() => setBgMusicEnabled(!bgMusicEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                bgMusicEnabled ? 'bg-[#23381B]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  bgMusicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
