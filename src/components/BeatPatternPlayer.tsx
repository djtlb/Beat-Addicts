import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';

interface BeatPatternPlayerProps {
  beatPattern: {
    kick: number[];
    snare: number[];
    hihat: number[];
    openhat: number[];
  };
  tempo: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  playheadPosition: number;
  className?: string;
}

const BeatPatternPlayer: React.FC<BeatPatternPlayerProps> = ({
  beatPattern,
  tempo,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  playheadPosition,
  className = ''
}) => {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const scheduleIdRef = useRef<number | null>(null);

  console.log('🥁 BeatPatternPlayer:', { isPlaying, tempo, playheadPosition });

  // Initialize Web Audio API
  const initializeAudio = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('🔊 Beat pattern audio context initialized');
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('🔊 Beat pattern audio context resumed');
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = isMuted ? 0 : volume;
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Failed to initialize beat pattern audio:', error);
    }
  }, [volume, isMuted]);

  // Create drum sounds using Web Audio API
  const createDrumSound = useCallback((type: string, frequency: number, duration: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    try {
      // Create different drum sounds
      switch (type) {
        case 'kick': {
          // Kick drum: Low frequency sine wave with pitch envelope
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, now);
          osc.frequency.exponentialRampToValueAtTime(frequency * 0.3, now + 0.1);
          
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          
          osc.connect(gain);
          gain.connect(gainNodeRef.current);
          
          osc.start(now);
          osc.stop(now + duration);
          break;
        }
        
        case 'snare': {
          // Snare drum: Noise burst with tone
          const noise = ctx.createBufferSource();
          const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
          const noiseData = noiseBuffer.getChannelData(0);
          
          // Generate white noise
          for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * 0.5;
          }
          
          noise.buffer = noiseBuffer;
          
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.6, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          
          // Add tonal component
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(frequency, now);
          oscGain.gain.setValueAtTime(0.3, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);
          
          noise.connect(noiseGain);
          osc.connect(oscGain);
          noiseGain.connect(gainNodeRef.current);
          oscGain.connect(gainNodeRef.current);
          
          noise.start(now);
          osc.start(now);
          noise.stop(now + duration);
          osc.stop(now + duration * 0.5);
          break;
        }
        
        case 'hihat': {
          // Hi-hat: High frequency noise burst
          const noise = ctx.createBufferSource();
          const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
          const noiseData = noiseBuffer.getChannelData(0);
          
          for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * 0.3;
          }
          
          noise.buffer = noiseBuffer;
          
          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(8000, now);
          
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.4, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(gainNodeRef.current);
          
          noise.start(now);
          noise.stop(now + duration);
          break;
        }
        
        case 'openhat': {
          // Open hi-hat: Longer hi-hat with resonance
          const noise = ctx.createBufferSource();
          const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
          const noiseData = noiseBuffer.getChannelData(0);
          
          for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * 0.4;
          }
          
          noise.buffer = noiseBuffer;
          
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(frequency, now);
          filter.Q.setValueAtTime(5, now);
          
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.5, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(gainNodeRef.current);
          
          noise.start(now);
          noise.stop(now + duration);
          break;
        }
      }
    } catch (error) {
      console.error(`❌ Error creating ${type} sound:`, error);
    }
  }, []);

  // Play drum sound for current step
  const playStep = useCallback((step: number) => {
    if (!isInitialized || !audioContextRef.current) return;

    console.log('🥁 Playing step:', step);

    // Check which drums should play on this step
    if (beatPattern.kick.includes(step)) {
      createDrumSound('kick', 60, 0.3);
    }
    if (beatPattern.snare.includes(step)) {
      createDrumSound('snare', 200, 0.15);
    }
    if (beatPattern.hihat.includes(step)) {
      createDrumSound('hihat', 10000, 0.05);
    }
    if (beatPattern.openhat.includes(step)) {
      createDrumSound('openhat', 8000, 0.2);
    }
  }, [beatPattern, createDrumSound, isInitialized]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isInitialized) {
        initializeAudio();
      }
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    return () => document.removeEventListener('click', handleUserInteraction);
  }, [initializeAudio, isInitialized]);

  // Schedule pattern playback
  useEffect(() => {
    if (isPlaying && isInitialized) {
      console.log('🎵 Starting beat pattern playback');
      
      const stepDuration = (60 / tempo / 4) * 1000; // Duration of each 16th note in ms
      let currentStep = Math.floor(playheadPosition);
      
      const scheduleNextStep = () => {
        playStep(currentStep % 16);
        currentStep++;
        
        if (isPlaying) {
          scheduleIdRef.current = window.setTimeout(scheduleNextStep, stepDuration);
        }
      };
      
      scheduleNextStep();
    } else if (scheduleIdRef.current) {
      clearTimeout(scheduleIdRef.current);
      scheduleIdRef.current = null;
    }

    return () => {
      if (scheduleIdRef.current) {
        clearTimeout(scheduleIdRef.current);
        scheduleIdRef.current = null;
      }
    };
  }, [isPlaying, tempo, playStep, isInitialized, playheadPosition]);

  const toggleMute = () => {
    console.log('🔇 Toggling beat pattern mute:', !isMuted);
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Transport Controls */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={!isInitialized}
        className={`
          p-2 rounded-full transition-all duration-200 
          ${!isInitialized 
            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 active:scale-95'
          }
        `}
        title={isPlaying ? "Pause Pattern" : "Play Pattern"}
      >
        {!isInitialized ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white ml-0.5" />
        )}
      </button>

      <button
        onClick={onStop}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        title="Stop Pattern"
      >
        <Square className="w-4 h-4 text-gray-300" />
      </button>

      {/* Volume Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleMute}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-gray-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-gray-300" />
          )}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        
        <span className="text-xs text-gray-400 font-mono w-8">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>

      {/* Pattern Info */}
      <div className="text-xs text-gray-400 font-underground">
        {tempo} BPM • Step {Math.floor(playheadPosition) + 1}/16
      </div>

      {/* Initialization Status */}
      {!isInitialized && (
        <div className="text-xs text-yellow-400 flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Click anywhere to enable audio</span>
        </div>
      )}
    </div>
  );
};

export default BeatPatternPlayer;