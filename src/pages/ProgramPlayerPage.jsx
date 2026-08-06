import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  MoreHorizontal,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  Flower2,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export function ProgramPlayerPage() {
  const { programId, dayNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useApp();

  const program = location.state?.program || {
    _id: programId,
    title: 'Core & Belly Strength',
    totalDays: 30
  };

  const day = location.state?.day || {
    dayNumber: parseInt(dayNumber) || 1,
    title: 'Core Awareness',
    steps: [
      {
        stepNumber: 1,
        title: 'Breath Preparation',
        subtitle: 'Deep breathing',
        durationSeconds: 180,
        instructionTitle: 'Inhale',
        instructionDetail: 'Breathe in slowly through your nose and fill your lungs and slowly release the air from your lungs.',
        videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
        poseImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
      },
      {
        stepNumber: 2,
        title: 'Cat Cow',
        subtitle: 'Spinal warm up',
        durationSeconds: 120,
        instructionTitle: 'Arch & Curve',
        instructionDetail: 'Inhale to drop your belly and lift your gaze. Exhale to round your spine toward the ceiling.',
        videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
        poseImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
      }
    ]
  };

  const stepsList = day.steps && day.steps.length > 0 ? day.steps : [
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
  ];

  const initialStepIdx = location.state?.initialStepIdx || 0;
  const [currentStepIdx, setCurrentStepIdx] = useState(initialStepIdx);
  const currentStep = stepsList[currentStepIdx] || stepsList[0];

  const [secondsLeft, setSecondsLeft] = useState(currentStep.durationSeconds || 180);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(currentStep.durationSeconds || 180);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) videoRef.current.play().catch(() => {});
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentStepIdx]);

  // Video & Audio Play/Pause sync
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  // Countdown timer effect
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsLeft((prevSec) => {
          if (prevSec <= 1) {
            handleStepComplete();
            return 0;
          }
          return prevSec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIdx, stepsList]);

  const handleStepComplete = async () => {
    if (currentStepIdx < stepsList.length - 1) {
      // Auto advance to next step!
      setCurrentStepIdx(currentStepIdx + 1);
      showToast(`Step ${currentStepIdx + 1} complete! Next step starting...`, 'info');
    } else {
      // All steps for this day completed!
      setIsPlaying(false);
      await api.logProgramDayCompletion(program._id || programId, day.dayNumber);
      showToast(`🎉 Day ${day.dayNumber} of ${program.title} completed!`, 'success');
      navigate(`/yoga-programs/${program._id || programId}`, { state: { program } });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) setCurrentStepIdx(currentStepIdx - 1);
  };

  const handleNextStep = () => {
    handleStepComplete();
  };

  const formatMinSec = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-stone-950 font-serif text-slate-900 dark:text-amber-50 p-4 sm:p-6 max-w-lg mx-auto flex flex-col justify-between pb-8 select-none">
      {/* TOP HEADER BAR matching Image 5 */}
      <div className="flex items-center justify-between z-10 pt-2 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 shadow-sm hover:bg-stone-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center font-serif">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-amber-50">
            {program.title}
          </h1>
          <p className="text-xs font-sans text-stone-500 dark:text-stone-400 font-medium">
            Day {day.dayNumber} of {program.totalDays || 30}
          </p>
        </div>

        <button className="w-10 h-10 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 shadow-sm hover:bg-stone-100 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* STEP INDICATOR TRACKER BAR (1 ── 2 ── 3 ── 4 ── 5) matching Image 5 */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 font-sans">
        {stepsList.map((st, idx) => {
          const isActive = idx === currentStepIdx;
          const isPassed = idx < currentStepIdx;
          return (
            <React.Fragment key={idx}>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all border ${
                  isActive
                    ? 'bg-[#3B4D2B] text-white border-[#3B4D2B] shadow-md scale-110'
                    : isPassed
                    ? 'bg-[#EBF2E4] dark:bg-emerald-950 text-[#3B4D2B] dark:text-emerald-400 border-[#3B4D2B]'
                    : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              {idx < stepsList.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-8 rounded-full ${idx < currentStepIdx ? 'bg-[#3B4D2B]' : 'bg-stone-200 dark:bg-stone-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP TITLE & TIMER PILL matching Image 5 */}
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-amber-50">
          {currentStep.title}
        </h2>
        <p className="text-xs font-sans text-stone-500 dark:text-stone-400 font-medium">
          Step {currentStepIdx + 1} of {stepsList.length}
        </p>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono font-extrabold text-[#3B4D2B] dark:text-emerald-400 shadow-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatMinSec(secondsLeft)}</span>
        </div>
      </div>

      {/* INSTRUCTOR VIDEO / POSE DEMO PLAYER matching Image 5 */}
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black shadow-xl mb-6 border border-stone-200/80 dark:border-stone-800">
        {currentStep.videoUrl ? (
          <video
            ref={videoRef}
            src={currentStep.videoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
          />
        ) : (
          <img
            src={currentStep.poseImageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'}
            alt={currentStep.title}
            className="w-full h-full object-cover"
          />
        )}
        {currentStep.bgMusicUrl && (
          <audio ref={audioRef} src={currentStep.bgMusicUrl} loop />
        )}
      </div>

      {/* INSTRUCTION SUB-CARD matching Image 5 */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBF2E4] dark:bg-emerald-950 text-[#3B4D2B] dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold font-serif text-slate-900 dark:text-amber-50">
                {currentStep.instructionTitle || 'Inhale'}
              </h4>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-[#3B4D2B] text-white flex items-center justify-center">
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-serif text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
          {currentStep.instructionDetail || 'Breathe in slowly through your nose and fill your lungs and slowly release the air from your lungs.'}
        </p>
      </div>

      {/* MEDIA CONTROLS (⏮  ⏯  ⏭) matching Image 5 */}
      <div className="flex items-center justify-center gap-6 font-sans pt-2">
        <button
          onClick={handlePrevStep}
          disabled={currentStepIdx === 0}
          className="w-12 h-12 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 shadow-md disabled:opacity-40 hover:bg-stone-100 transition-colors"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-[#3B4D2B] text-white flex items-center justify-center shadow-xl hover:bg-[#2D3C20] transition-colors"
        >
          {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
        </button>

        <button
          onClick={handleNextStep}
          className="w-12 h-12 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-slate-800 dark:text-amber-100 shadow-md hover:bg-stone-100 transition-colors"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
}
