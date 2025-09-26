import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface PlayButtonProps {
  audioUrl?: string;
  title?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'minimal';
  disabled?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  audioUrl,
  title = 'Audio',
  onPlay,
  onPause,
  onEnded,
  className = '',
  size = 'md',
  variant = 'default',
  disabled = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  console.log('🎵 PlayButton for:', title, { audioUrl: audioUrl ? audioUrl.substring(0, 30) + '...' : 'none', isPlaying, hasError });

  // Initialize audio element
  const initializeAudio = useCallback(() => {
    if (!audioUrl || disabled) {
      console.warn('⚠️ PlayButton: No audio URL or disabled');
      setHasError(true);
      return;
    }

    if (audioRef.current) {
      console.log('🔄 PlayButton: Cleaning up existing audio');
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    console.log('🔊 PlayButton: Initializing audio for:', title);
    setHasError(false);
    setIsLoading(true);
    
    const audio = new Audio();
    audioRef.current = audio;

    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audio.volume = 0.8;

    const handleCanPlay = () => {
      console.log('✅ PlayButton audio ready:', title);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ PlayButton audio error for', title, ':', e);
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      console.log('🔚 PlayButton audio ended:', title);
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    try {
      audio.src = audioUrl;
    } catch (err) {
      console.error('❌ PlayButton failed to set audio source:', err);
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, disabled, title, onEnded]);

  useEffect(() => {
    if (audioUrl && !disabled) {
      const cleanup = initializeAudio();
      return cleanup;
    }
  }, [audioUrl, disabled, initializeAudio]);

  const handleClick = async () => {
    if (disabled || !audioUrl) {
      console.warn('⚠️ PlayButton click ignored: disabled or no URL');
      return;
    }

    if (hasError) {
      console.log('🔄 PlayButton: Retrying after error');
      setRetryCount(prev => prev + 1);
      initializeAudio();
      return;
    }

    if (!audioRef.current) {
      console.log('🔄 PlayButton: No audio element, initializing');
      initializeAudio();
      setTimeout(handleClick, 500);
      return;
    }

    try {
      if (isPlaying) {
        console.log('⏸️ PlayButton pausing:', title);
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        console.log('▶️ PlayButton playing:', title);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          setHasError(false);
          onPlay?.();
        }
      }
    } catch (error: any) {
      console.error('❌ PlayButton playback failed for', title, ':', error);
      setIsPlaying(false);
      setHasError(true);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6 p-1';
      case 'lg': return 'w-12 h-12 p-3';
      default: return 'w-8 h-8 p-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-6 h-6';
      default: return 'w-4 h-4';
    }
  };

  const getVariantClass = () => {
    if (disabled) return 'bg-gray-600 cursor-not-allowed opacity-50';
    
    switch (variant) {
      case 'compact':
        return 'bg-white/10 hover:bg-white/20 border border-white/20';
      case 'minimal':
        return 'hover:bg-white/10';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${getSizeClass()} 
        ${getVariantClass()} 
        rounded-full transition-all duration-200 
        flex items-center justify-center
        ${className}
      `}
      title={hasError ? 'Click to retry' : isPlaying ? 'Pause' : 'Play'}
    >
      {isLoading ? (
        <Loader2 className={`${getIconSize()} text-white animate-spin`} />
      ) : hasError ? (
        retryCount > 0 ? (
          <RefreshCw className={`${getIconSize()} text-orange-400`} />
        ) : (
          <AlertCircle className={`${getIconSize()} text-red-400`} />
        )
      ) : isPlaying ? (
        <Pause className={`${getIconSize()} text-white`} />
      ) : (
        <Play className={`${getIconSize()} text-white ${size !== 'sm' ? 'ml-0.5' : ''}`} />
      )}
    </button>
  );
};

export default PlayButton;