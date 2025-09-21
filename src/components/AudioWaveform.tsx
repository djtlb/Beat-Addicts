import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioWaveformProps {
  audioUrl?: string;
  duration?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  className?: string;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  duration = '0:00',
  isPlaying = false,
  onPlay,
  className = ''
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const waveformRef = useRef<HTMLDivElement>(null);

  console.log('AudioWaveform rendered:', { audioUrl, isPlaying, progress });

  // Generate random waveform data
  const waveformBars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    height: Math.random() * 60 + 20,
    opacity: Math.random() * 0.6 + 0.4
  }));

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleWaveformClick = (e: React.MouseEvent) => {
    if (waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width * 100;
      setProgress(clickPosition);
      console.log('Waveform clicked at:', clickPosition + '%');
    }
  };

  return (
    <div className={`bg-black/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={onPlay}
          className="p-3 bg-primary hover:bg-primary/90 rounded-full transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Play className="w-5 h-5 text-primary-foreground" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>{Math.floor(progress / 100 * 204)}:{String(Math.floor((progress / 100 * 204) % 60)).padStart(2, '0')}</span>
            <span>{duration}</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      {/* Waveform visualization */}
      <div 
        ref={waveformRef}
        className="flex items-center justify-center space-x-1 h-16 cursor-pointer"
        onClick={handleWaveformClick}
      >
        {waveformBars.map((bar, i) => (
          <div
            key={bar.id}
            className={`w-1 rounded-full transition-all duration-150 ${
              (i / waveformBars.length * 100) <= progress 
                ? 'bg-primary' 
                : 'bg-muted-foreground'
            }`}
            style={{
              height: `${bar.height}px`,
              opacity: (i / waveformBars.length * 100) <= progress ? 1 : bar.opacity
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioWaveform;