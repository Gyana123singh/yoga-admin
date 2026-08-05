import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import { Wind, Play, Pause, RotateCcw, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

export function BreathingLibraryPage() {
  const { showToast } = useApp();
  const [techniques, setTechniques] = useState([]);
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [timerSeconds, setTimerSeconds] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBreathing() {
      setIsLoading(true);
      const data = await api.getBreathingTechniques();
      setTechniques(data);
      if (data.length > 0) {
        setActiveTechnique(data[0]);
      }
      setIsLoading(false);
    }
    loadBreathing();
  }, []);

  // Animated breath cycle simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wind className="w-7 h-7 text-cyan-500" /> Pranayama & Breathing Library
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Visual breath cadence engine with acoustic voice synthesizers and autonomic resetting protocols.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 text-sm font-medium">
          Loading Breathing Techniques...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Breath Simulator Player */}
          {activeTechnique && (
            <Card className="lg:col-span-1 gradient-border flex flex-col justify-between p-6 text-center space-y-6">
              <div>
                <Badge variant="cyan" size="lg" className="mx-auto">
                  {activeTechnique.name}
                </Badge>
                <p className="text-xs font-semibold text-slate-400 mt-2">{activeTechnique.pattern}</p>
              </div>

              {/* Expanding Pulsing Ring */}
              <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: isPlaying ? (breathPhase === 'Inhale' ? 1.35 : breathPhase === 'Hold' ? 1.35 : 0.85) : 1,
                    opacity: isPlaying ? [0.6, 0.9, 0.6] : 0.7,
                  }}
                  transition={{ duration: 3.8, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full gradient-bg-primary shadow-glow-primary opacity-30"
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-white">
                  <span className="text-sm font-bold uppercase tracking-widest text-cyan-300">
                    {isPlaying ? breathPhase : 'Ready'}
                  </span>
                  <span className="text-5xl font-black mt-1">
                    {isPlaying ? `${timerSeconds}s` : '04:00'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="cyan"
                  size="lg"
                  icon={isPlaying ? Pause : Play}
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    showToast(isPlaying ? 'Breath simulator paused' : 'Starting breath session...', 'info');
                  }}
                >
                  {isPlaying ? 'Pause Routine' : 'Start Practice'}
                </Button>
                <Button
                  variant="glass"
                  size="icon"
                  onClick={() => {
                    setIsPlaying(false);
                    setTimerSeconds(4);
                    setBreathPhase('Inhale');
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Right: Technique Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Curated Breathwork Catalog
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techniques.map((tech) => (
                <div
                  key={tech.id || tech._id}
                  onClick={() => {
                    setActiveTechnique(tech);
                    setIsPlaying(false);
                  }}
                  className={`p-5 rounded-2xl glass-card-light dark:glass-card-dark border transition-all cursor-pointer space-y-3 ${
                    activeTechnique?.name === tech.name
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg'
                      : 'border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo">{tech.category}</Badge>
                    <span className="text-xs font-semibold text-slate-400">{tech.defaultDuration}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{tech.name}</h4>
                    <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 mt-0.5">{tech.pattern}</p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tech.benefits}
                  </p>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mic className="w-3 h-3 text-cyan-400" /> {tech.audioGuide}
                    </span>
                    <span>{tech.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
