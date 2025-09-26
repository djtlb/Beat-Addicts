import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';

interface EnhancedPlayButtonProps {
  audioUrl?: string;
  title?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'minimal' | 'studio';
  disabled?: boolean;
  volume?: number;
  showWaveform?: boolean;
}

const EnhancedPlayButton: React.FC<EnhancedPlayButtonProps> = ({
  audioUrl,
  title = 'Audio',
  onPlay,
  onPause,
  onEnded,
  className = '',
  size = 'md',
  variant = 'default',
  disabled = false,
  volume = 0.8,
  showWaveform = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

  console.log('🎵 EnhancedPlayButton:', { 
    title, 
    audioUrl: audioUrl ? audioUrl.substring(0, 30) + '...' : 'none', 
    isPlaying, 
    hasError,
    size,
    variant
  });

  // Initialize audio element with enhanced error handling
  useEffect(() => {
    if (!audioUrl || disabled) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    console.log('🔊 Initializing enhanced audio for:', title);
    setHasError(false);
    setIsLoading(true);
    
    const audio = new Audio();
    audioRef.current = audio;

    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audio.volume = volume;

    const handleCanPlay = () => {
      console.log('✅ Enhanced audio ready:', title);
      setIsLoading(false);
      setHasError(false);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleError = () => {
      console.error('❌ Enhanced audio error for:', title);
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      console.log('🔚 Enhanced audio ended:', title);
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    try {
      audio.src = audioUrl;
    } catch (err) {
      console.error('❌ Failed to set enhanced audio source:', err);
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl, disabled, title, onEnded, volume]);

  // Waveform visualization
  useEffect(() => {
    if (!showWaveform || !canvasRef.current) return;

    const drawWaveform = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const progress = duration > 0 ? currentTime / duration : 0;

      ctx.clearRect(0, 0, width, height);

      const barCount = 20;
      const barWidth = width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.sin((i / barCount) * Math.PI * 2 + currentTime) * (height * 0.3) + (height * 0.4);
        const x = i * barWidth;
        const y = (height - barHeight) / 2;
        
        const isActive = (i / barCount) <= progress;
        ctx.fillStyle = isActive ? '#8B5CF6' : '#374151';
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(drawWaveform);
      }
    };

    drawWaveform();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, duration, showWaveform]);

  const handleClick = async () => {
    if (disabled || !audioUrl) return;

    if (hasError) {
      console.log('🔄 Retrying enhanced audio after error');
      setRetryCount(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
      
      if (audioRef.current) {
        try {
          audioRef.current.src = audioUrl;
        } catch (err) {
          setHasError(true);
          setIsLoading(false);
        }
      }
      return;
    }

    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        console.log('⏸️ Enhanced pause:', title);
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        console.log('▶️ Enhanced play:', title);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          setHasError(false);
          onPlay?.();
        }
      }
    } catch (error: any) {
      console.error('❌ Enhanced playback failed:', error);
      setIsPlaying(false);
      setHasError(true);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return { button: 'w-5 h-5 p-1', icon: 'w-2 h-2' };
      case 'sm': return { button: 'w-6 h-6 p-1', icon: 'w-3 h-3' };
      case 'lg': return { button: 'w-12 h-12 p-3', icon: 'w-6 h-6' };
      default: return { button: 'w-8 h-8 p-2', icon: 'w-4 h-4' };
    }
  };

  const getVariantClasses = () => {
    if (disabled) return 'bg-gray-600 cursor-not-allowed opacity-50';
    
    switch (variant) {
      case 'compact':
        return 'bg-white/10 hover:bg-white/20 border border-white/20';
      case 'minimal':
        return 'hover:bg-white/10';
      case 'studio':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 shadow-lg';
    }
  };

  const { button: buttonSize, icon: iconSize } = getSizeClasses();

  if (showWaveform && size !== 'xs' && size !== 'sm') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`
            ${buttonSize} 
            ${getVariantClasses()} 
            rounded-full transition-all duration-200 
            flex items-center justify-center
          `}
          title={hasError ? 'Click to retry' : isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <Loader2 className={`${iconSize} text-white animate-spin`} />
          ) : hasError ? (
            retryCount > 0 ? (
              <RefreshCw className={`${iconSize} text-orange-400`} />
            ) : (
              <AlertCircle className={`${iconSize} text-red-400`} />
            )
          ) : isPlaying ? (
            <Pause className={`${iconSize} text-white`} />
          ) : (
            <Play className={`${iconSize} text-white ${size !== 'xs' && size !== 'sm' ? 'ml-0.5' : ''}`} />
          )}
        </button>

        <canvas
          ref={canvasRef}
          width={120}
          height={24}
          className="flex-1 max-w-32 h-6 rounded"
        />

        <div className="text-xs text-gray-400 font-mono">
          {duration > 0 ? `${Math.floor(currentTime)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}` : '--:--'}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${buttonSize} 
        ${getVariantClasses()} 
        rounded-full transition-all duration-200 
        flex items-center justify-center
        ${className}
      `}
      title={hasError ? 'Click to retry' : isPlaying ? 'Pause' : 'Play'}
    >
      {isLoading ? (
        <Loader2 className={`${iconSize} text-white animate-spin`} />
      ) : hasError ? (
        retryCount > 0 ? (
          <RefreshCw className={`${iconSize} text-orange-400`} />
        ) : (
          <AlertCircle className={`${iconSize} text-red-400`} />
        )
      ) : isPlaying ? (
        <Pause className={`${iconSize} text-white`} />
      ) : (
        <Play className={`${iconSize} text-white ${size !== 'xs' && size !== 'sm' ? 'ml-0.5' : ''}`} />
      )}
    </button>
  );
};

export default EnhancedPlayButton;