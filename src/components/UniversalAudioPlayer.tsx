import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  Download,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface UniversalAudioPlayerProps {
  audioUrl?: string;
  title?: string;
  duration?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
  showWaveform?: boolean;
  showDownload?: boolean;
  autoLoad?: boolean;
  compact?: boolean;
}

const UniversalAudioPlayer: React.FC<UniversalAudioPlayerProps> = ({
  audioUrl,
  title = 'Audio Track',
  duration = '0:00',
  onPlay,
  onPause,
  onEnded,
  className = '',
  showWaveform = false,
  showDownload = false,
  autoLoad = true,
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  console.log('🎵 UniversalAudioPlayer:', { 
    audioUrl: audioUrl ? audioUrl.substring(0, 50) + '...' : 'none', 
    isPlaying, 
    loadingState,
    compact
  });

  // Initialize audio element with enhanced error handling
  const initializeAudio = useCallback(() => {
    if (!audioUrl) {
      console.warn('⚠️ No audio URL provided');
      setLoadingState('error');
      setErrorMessage('No audio URL provided');
      return;
    }

    if (audioRef.current) {
      console.log('🔄 Cleaning up existing audio element');
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    console.log('🔊 Initializing audio element for:', title);
    setErrorMessage('');
    setLoadingState('loading');
    setIsLoading(true);
    
    const audio = new Audio();
    audioRef.current = audio;

    // Enhanced audio settings
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audio.volume = isMuted ? 0 : volume;

    const handleLoadStart = () => {
      console.log('📡 Audio load started for:', title);
      setIsLoading(true);
      setLoadingState('loading');
      setErrorMessage('');
    };

    const handleLoadedMetadata = () => {
      console.log('📊 Audio metadata loaded for:', title);
      if (isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };

    const handleCanPlay = () => {
      console.log('✅ Audio can play:', title);
      setIsLoading(false);
      setLoadingState('loaded');
      setErrorMessage('');
    };

    const handleCanPlayThrough = () => {
      console.log('✅ Audio can play through completely:', title);
      setIsLoading(false);
      setLoadingState('loaded');
      setErrorMessage('');
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime !== currentTime) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      console.log('🔚 Audio playback ended:', title);
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    const handleError = (e: Event) => {
      const error = (e.target as HTMLAudioElement)?.error;
      let errorMsg = 'Audio playback error';
      
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Audio loading was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error occurred while loading audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Audio format error - unable to decode';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Audio format not supported by browser';
            break;
          default:
            errorMsg = `Audio error: ${error.code}`;
        }
      }
      
      console.error('❌ Audio error for', title, ':', error?.code, error?.message);
      
      setIsLoading(false);
      setLoadingState('error');
      setIsPlaying(false);
      setErrorMessage(errorMsg);
    };

    // Attach all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set source to start loading
    try {
      audio.src = audioUrl;
      console.log('🎵 Audio source set for:', title);
    } catch (err) {
      console.error('❌ Failed to set audio source for', title, ':', err);
      setLoadingState('error');
      setErrorMessage('Failed to set audio source');
    }

    // Cleanup function
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, volume, isMuted, onEnded, title, currentTime]);

  // Initialize audio when component mounts or URL changes
  useEffect(() => {
    if (autoLoad && audioUrl) {
      const cleanup = initializeAudio();
      return cleanup;
    }
  }, [audioUrl, autoLoad, initializeAudio]);

  // Update volume and settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Enhanced play function
  const handlePlay = async () => {
    if (!audioUrl) {
      console.warn('⚠️ No audio URL provided for:', title);
      setErrorMessage('No audio URL provided');
      return;
    }

    if (!audioRef.current) {
      console.log('🔄 Initializing audio for playback:', title);
      initializeAudio();
      setTimeout(handlePlay, 500); // Retry after initialization
      return;
    }

    try {
      console.log('▶️ Attempting to play audio:', title);
      
      if (loadingState === 'error') {
        console.log('🔄 Retrying failed audio load for:', title);
        setRetryCount(prev => prev + 1);
        initializeAudio();
        return;
      }

      if (loadingState !== 'loaded' && audioRef.current.readyState < 3) {
        console.log('⏳ Waiting for audio to load...', title);
        setIsLoading(true);
        return;
      }

      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setErrorMessage('');
        onPlay?.();
        console.log('✅ Audio playing successfully:', title);
      }
    } catch (error: any) {
      console.error('❌ Playback failed for', title, ':', error);
      
      let userMessage = 'Audio playback failed';
      if (error.name === 'NotAllowedError') {
        userMessage = 'Audio autoplay blocked. Please click play to start.';
      } else if (error.name === 'NotSupportedError') {
        userMessage = 'Audio format not supported by your browser.';
      } else if (error.name === 'AbortError') {
        userMessage = 'Audio playback was interrupted.';
      } else {
        userMessage = `Playback error: ${error.message}`;
      }
      
      setIsPlaying(false);
      setLoadingState('error');
      setErrorMessage(userMessage);
    }
  };

  const handlePause = () => {
    if (audioRef.current && isPlaying) {
      console.log('⏸️ Pausing audio:', title);
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleRetry = () => {
    console.log('🔄 Manual retry triggered for:', title);
    setRetryCount(prev => prev + 1);
    setErrorMessage('');
    setLoadingState('idle');
    initializeAudio();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || totalDuration === 0) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * totalDuration;
    
    console.log('🎯 Seeking to:', newTime.toFixed(1) + 's for', title);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current || totalDuration === 0) return;
    
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    console.log('⏭️ Skipping to:', newTime.toFixed(1) + 's for', title);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    console.log('🔇 Toggling mute:', !isMuted, 'for', title);
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    console.log('💾 Downloading audio:', title);
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Waveform visualization
  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || !showWaveform) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const progressPercent = totalDuration > 0 ? currentTime / totalDuration : 0;

    ctx.clearRect(0, 0, width, height);

    const barCount = compact ? 30 : 60;
    const barWidth = width / barCount;
    const maxBarHeight = height * 0.8;
    
    for (let i = 0; i < barCount; i++) {
      const normalizedI = i / barCount;
      const barHeight = Math.sin(normalizedI * Math.PI * 4) * maxBarHeight * 0.5 + maxBarHeight * 0.3;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      
      if (normalizedI <= progressPercent) {
        gradient.addColorStop(0, 'hsl(330, 100%, 60%)');
        gradient.addColorStop(0.5, 'hsl(270, 100%, 50%)');
        gradient.addColorStop(1, 'hsl(180, 100%, 50%)');
      } else {
        gradient.addColorStop(0, 'hsl(0, 0%, 30%)');
        gradient.addColorStop(1, 'hsl(0, 0%, 20%)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawWaveform);
    }
  }, [currentTime, totalDuration, isPlaying, showWaveform, compact]);

  useEffect(() => {
    if (showWaveform) {
      drawWaveform();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showWaveform, drawWaveform]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Compact Play/Pause */}
        <button
          onClick={togglePlayPause}
          disabled={!audioUrl}
          className={`
            p-2 rounded-full transition-all duration-200 
            ${!audioUrl 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>

        {/* Compact Progress */}
        <div
          ref={progressRef}
          className="flex-1 bg-gray-700 rounded-full h-1 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Compact Time */}
        <div className="text-xs text-gray-400 font-mono min-w-0">
          {formatTime(currentTime)}
        </div>

        {/* Error/Retry */}
        {loadingState === 'error' && (
          <button
            onClick={handleRetry}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Retry Loading"
          >
            <RefreshCw className="w-3 h-3 text-orange-400" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-gray-900/50 to-black/50 rounded-lg p-4 border border-gray-700/50 ${className}`}>
      {/* Track Info and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium text-white text-sm truncate">{title}</h4>
          {retryCount > 0 && (
            <span className="text-xs text-yellow-400">
              (Retry {retryCount})
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400">
          {formatTime(currentTime)} / {totalDuration > 0 ? formatTime(totalDuration) : duration}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center space-x-3 mb-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          disabled={!audioUrl}
          className={`
            p-3 rounded-full transition-all duration-200 
            ${!audioUrl 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>

        {/* Skip Controls */}
        <button
          onClick={() => skip(-10)}
          disabled={!audioUrl || totalDuration === 0}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <SkipBack className="w-4 h-4 text-gray-300" />
        </button>

        <button
          onClick={() => skip(10)}
          disabled={!audioUrl || totalDuration === 0}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4 text-gray-300" />
        </button>

        {/* Volume Controls */}
        <div className="flex items-center space-x-2 flex-1">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-gray-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-300" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Retry Button */}
        {loadingState === 'error' && (
          <button
            onClick={handleRetry}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Retry Loading"
          >
            <RefreshCw className="w-4 h-4 text-orange-400" />
          </button>
        )}

        {/* Download Button */}
        {showDownload && (
          <button
            onClick={handleDownload}
            disabled={!audioUrl || loadingState === 'error'}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            title="Download Audio"
          >
            <Download className="w-4 h-4 text-gray-300" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="w-full bg-gray-700 rounded-full h-2 cursor-pointer mb-3"
        onClick={handleProgressClick}
      >
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Waveform */}
      {showWaveform && (
        <canvas
          ref={canvasRef}
          width={400}
          height={60}
          className="w-full h-15 rounded mb-2"
        />
      )}

      {/* Error State */}
      {loadingState === 'error' && errorMessage && (
        <div className="mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Audio Error</p>
                <p className="text-xs text-red-300 mt-1">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="ml-2 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-xs text-red-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && loadingState === 'loading' && (
        <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-400 text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Loading audio... Please wait.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalAudioPlayer;