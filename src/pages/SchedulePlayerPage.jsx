import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Info,
  Square,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Mic,
  Music,
  Flower2
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export function SchedulePlayerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const routine = location.state?.routine || {
    title: 'Sleep Journey Practice',
    category: 'Sleep',
    durationMinutes: 15,
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
  };

  const totalSeconds = (routine.durationMinutes || 10) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isPlaying, setIsPlaying] = useState(true);

  const [phase, setPhase] = useState('INHALE');
  const [phaseSeconds, setPhaseSeconds] = useState(4);

  const [isVoiceGuidanceOn, setIsVoiceGuidanceOn] = useState(true);
  const [isBgMusicOn, setIsBgMusicOn] = useState(true);

  const audioRef = useRef(null);

  // Background Music sync
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && isBgMusicOn) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isBgMusicOn]);

  // Main Timer & Breathing Phase Cycle (Inhale 4s -> Hold 4s -> Exhale 4s)
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });

        setPhaseSeconds((prev) => {
          if (prev <= 1) {
            if (phase === 'INHALE') {
              setPhase('HOLD');
              return 4;
            } else if (phase === 'HOLD') {
              setPhase('EXHALE');
              return 4;
            } else {
              setPhase('INHALE');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, phase]);

  const handleComplete = async () => {
    setIsPlaying(false);
    if (routine._id || routine.id) {
      await api.toggleDailyScheduleStatus(routine._id || routine.id);
    }
    showToast(`🎉 "${routine.title}" completed!`, 'success');
    navigate(-1);
  };

  const formatMinSec = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-serif text-white max-w-lg mx-auto flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* ADMIN UPLOADED BACKGROUND NATURE IMAGE matching Image 4 */}
      <img
        src={routine.bgImageUrl || 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop'}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0 scale-105 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-slate-950/80 z-0" />

      {/* TOP HEADER BAR matching Image 4 */}
      <div className="relative z-10 flex items-center justify-between pt-2 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center font-serif">
          <h1 className="text-xl sm:text-2xl font-extrabold text-amber-50 drop-shadow-md">
            {routine.title}
          </h1>
          <p className="text-xs font-serif text-stone-300 font-medium">
            Mindful Breath • Inner Balance
          </p>
        </div>

        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-md">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* SESSION CATEGORY BADGE matching Image 4 */}
      <div className="relative z-10 text-center mb-2">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-sans font-extrabold text-amber-100 border border-white/30 shadow-md">
          Quick Practice Session
        </span>
      </div>

      {/* ROUND MANDALA DECORATIVE FRAME RING matching Image 4 */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          
          {/* Animated Outer Pulsing Ring */}
          <div className={`absolute inset-0 rounded-full border-4 border-amber-400/40 transition-transform duration-1000 ${
            phase === 'INHALE' ? 'scale-110' : phase === 'EXHALE' ? 'scale-90' : 'scale-100'
          }`} />

          {/* Mandala Frame Image Ring matching Image 4 */}
          <img
            src={routine.frameDesignUrl || 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png'}
            alt="Mandala Ring Frame"
            className="absolute inset-0 w-full h-full object-contain animate-spin-slow opacity-90 drop-shadow-2xl"
          />

          {/* Inner Breathing Circle Content */}
          <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md border-4 border-[#3B4D2B] text-slate-900 flex flex-col items-center justify-center text-center p-4 shadow-2xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#EBF2E4] text-[#3B4D2B] flex items-center justify-center">
              <Flower2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 tracking-wider">
                {phase}
              </h2>
              <p className="text-xs font-serif text-stone-600 font-bold mt-0.5">
                {phase === 'INHALE' ? 'Breathe In Deeply' : phase === 'HOLD' ? 'Hold Breath Calmly' : 'Slowly Release Breath'}
              </p>
            </div>

            <div className="text-2xl font-extrabold font-mono text-[#3B4D2B] tracking-tight">
              {formatMinSec(secondsLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* PHASE GUIDANCE QUOTE matching Image 4 */}
      <div className="relative z-10 text-center my-2">
        <p className="text-xs font-serif italic text-stone-200 drop-shadow-md">
          🍃 Follow the sound. Breathe in... Breathe out... 🍃
        </p>
      </div>

      {/* CONTROL BUTTONS (STOP / PAUSE) matching Image 4 */}
      <div className="relative z-10 space-y-4 pt-2 font-sans">
        <div className="flex items-center justify-center gap-6">
          {/* Stop Button */}
          <div className="text-center space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="w-14 h-14 rounded-full bg-stone-100/90 text-amber-900 flex items-center justify-center shadow-lg hover:bg-white transition-transform active:scale-95"
            >
              <Square className="w-5 h-5 fill-amber-900" />
            </button>
            <span className="text-xs font-bold text-stone-300 block">Stop</span>
          </div>

          {/* Pause / Play Button */}
          <div className="text-center space-y-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-[#3B4D2B] text-white flex items-center justify-center shadow-2xl hover:bg-[#2D3C20] transition-transform active:scale-95 border-2 border-emerald-400/40"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
            </button>
            <span className="text-xs font-bold text-stone-300 block">
              {isPlaying ? 'Pause' : 'Resume'}
            </span>
          </div>
        </div>

        {/* AUDIO TOGGLE SWITCHES (Voice Guidance / Background Music) matching Image 4 */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Voice Guidance Toggle */}
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-50">
              <Mic className="w-4 h-4 text-emerald-300" />
              <span>Voice Guidance</span>
            </div>
            <button
              onClick={() => setIsVoiceGuidanceOn(!isVoiceGuidanceOn)}
              className={`w-11 h-6 rounded-full transition-colors relative ${isVoiceGuidanceOn ? 'bg-emerald-600' : 'bg-stone-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${isVoiceGuidanceOn ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Background Music Toggle */}
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-50">
              <Music className="w-4 h-4 text-amber-300" />
              <span>Background Music</span>
            </div>
            <button
              onClick={() => setIsBgMusicOn(!isBgMusicOn)}
              className={`w-11 h-6 rounded-full transition-colors relative ${isBgMusicOn ? 'bg-emerald-600' : 'bg-stone-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${isBgMusicOn ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* BACKGROUND MUSIC AUDIO PLAYER STREAM */}
      {routine.bgMusicUrl && (
        <audio ref={audioRef} src={routine.bgMusicUrl} loop />
      )}
    </div>
  );
}
