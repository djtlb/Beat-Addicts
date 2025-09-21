import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  duration?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
  showWaveform?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title = 'Generated Track',
  duration = '0:00',
  onPlay,
  onPause,
  onEnded,
  className = '',
  showWaveform = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  console.log('AudioPlayer rendered:', { audioUrl, isPlaying, currentTime });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setTotalDuration(audio.duration);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * totalDuration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `${title.replace(/\s+/g, '_')}.wav`;
      a.click();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalDuration ? (currentTime / totalDuration) * 100 : 0;

  // Generate waveform bars
  const waveformBars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    height: Math.random() * 40 + 10,
    opacity: (i / 60 * 100) <= progressPercent ? 1 : 0.3
  }));

  return (
    <div className={`bg-black/20 rounded-lg p-4 space-y-4 ${className}`}>
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}

      {/* Main Controls */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={!audioUrl || isLoading}
          className="p-3 bg-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Play className="w-5 h-5 text-primary-foreground" />
          )}
        </button>

        {/* Skip Controls */}
        <button
          onClick={() => skip(-10)}
          disabled={!audioUrl}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => skip(10)}
          disabled={!audioUrl}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{title}</h4>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{totalDuration ? formatTime(totalDuration) : duration}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!audioUrl}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="w-full bg-muted rounded-full h-2 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Waveform Visualization */}
      {showWaveform && (
        <div className="flex items-center justify-center space-x-1 h-16">
          {waveformBars.map((bar) => (
            <div
              key={bar.id}
              className="w-1 bg-gradient-to-t from-primary to-purple-400 rounded-full transition-all duration-150"
              style={{
                height: `${bar.height}px`,
                opacity: bar.opacity
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;