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
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface WorkingAudioPlayerProps {
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
}

const WorkingAudioPlayer: React.FC<WorkingAudioPlayerProps> = ({
  audioUrl,
  title = 'Audio Track',
  duration = '0:00',
  onPlay,
  onPause,
  onEnded,
  className = '',
  showWaveform = true,
  showDownload = true,
  autoLoad = true
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

  console.log('🎵 WorkingAudioPlayer:', { 
    audioUrl: audioUrl ? audioUrl.substring(0, 50) + '...' : 'none', 
    isPlaying, 
    loadingState, 
    currentTime: currentTime.toFixed(1),
    totalDuration: totalDuration.toFixed(1),
    errorMessage
  });

  // Validate audio URL format
  const isValidAudioUrl = useCallback((url: string): boolean => {
    if (!url) return false;
    
    // Check if it's a data URL (base64 encoded)
    if (url.startsWith('data:audio/')) {
      console.log('✅ Valid data URL audio format detected');
      return true;
    }
    
    // Check if it's a regular URL with audio extension
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const hasAudioExtension = audioExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (hasAudioExtension) {
      console.log('✅ Valid audio URL with extension detected');
      return true;
    }
    
    console.warn('⚠️ Audio URL format may not be supported:', url.substring(0, 100));
    return true; // Allow it anyway, browser will handle compatibility
  }, []);

  // Initialize audio element with enhanced error handling
  const initializeAudio = useCallback(() => {
    if (!audioUrl || !isValidAudioUrl(audioUrl)) {
      console.warn('⚠️ Invalid or missing audio URL');
      setLoadingState('error');
      setErrorMessage('Invalid audio URL');
      return;
    }

    if (audioRef.current) {
      console.log('🔄 Cleaning up existing audio element');
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    console.log('🔊 Initializing new audio element');
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
      console.log('📡 Audio load started');
      setIsLoading(true);
      setLoadingState('loading');
      setErrorMessage('');
    };

    const handleLoadedMetadata = () => {
      console.log('📊 Audio metadata loaded');
      console.log('🎵 Audio details:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState
      });
      
      if (isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };

    const handleCanPlay = () => {
      console.log('✅ Audio can play');
      setIsLoading(false);
      setLoadingState('loaded');
      setErrorMessage('');
    };

    const handleCanPlayThrough = () => {
      console.log('✅ Audio can play through completely');
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
      console.log('🔚 Audio playback ended');
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
            errorMsg = `Audio error: ${error.code} ${error.message || 'Unknown error'}`;
        }
      }
      
      console.error('❌ Audio error:', error?.code, error?.message);
      console.error('Err Message:', errorMsg);
      
      setIsLoading(false);
      setLoadingState('error');
      setIsPlaying(false);
      setErrorMessage(errorMsg);
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(0);
        const bufferedPercent = (bufferedEnd / audio.duration) * 100;
        if (bufferedPercent > 10) {
          console.log('📥 Audio buffered:', bufferedPercent.toFixed(1) + '%');
        }
      }
    };

    const handleStalled = () => {
      console.warn('⚠️ Audio loading stalled');
      setErrorMessage('Audio loading stalled - please wait or try again');
    };

    const handleSuspend = () => {
      console.log('⏸️ Audio loading suspended');
    };

    // Attach all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('suspend', handleSuspend);

    // Set source to start loading
    try {
      audio.src = audioUrl;
      console.log('🎵 Audio source set:', audioUrl.substring(0, 100) + '...');
    } catch (err) {
      console.error('❌ Failed to set audio source:', err);
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
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('suspend', handleSuspend);
    };
  }, [audioUrl, volume, isMuted, onEnded, isValidAudioUrl, currentTime]);

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
      console.warn('⚠️ No audio URL provided');
      setErrorMessage('No audio URL provided');
      return;
    }

    if (!audioRef.current) {
      console.log('🔄 Initializing audio for playback');
      initializeAudio();
      setTimeout(handlePlay, 500); // Retry after initialization
      return;
    }

    try {
      console.log('▶️ Attempting to play audio');
      console.log('🎵 Audio state:', {
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
        paused: audioRef.current.paused,
        duration: audioRef.current.duration
      });
      
      if (loadingState === 'error') {
        console.log('🔄 Retrying failed audio load');
        setRetryCount(prev => prev + 1);
        initializeAudio();
        return;
      }

      if (loadingState !== 'loaded' && audioRef.current.readyState < 3) {
        console.log('⏳ Waiting for audio to load...');
        setIsLoading(true);
        return;
      }

      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setErrorMessage('');
        onPlay?.();
        console.log('✅ Audio playing successfully');
      }
    } catch (error: any) {
      console.error('❌ Playback failed:', error);
      
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
      console.log('⏸️ Pausing audio');
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
    console.log('🔄 Manual retry triggered');
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
    
    console.log('🎯 Seeking to:', newTime.toFixed(1) + 's');
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current || totalDuration === 0) return;
    
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    console.log('⏭️ Skipping to:', newTime.toFixed(1) + 's');
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    console.log('🔇 Toggling mute:', !isMuted);
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
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const progressPercent = totalDuration > 0 ? currentTime / totalDuration : 0;

    ctx.clearRect(0, 0, width, height);

    const barCount = 80;
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
  }, [currentTime, totalDuration, isPlaying]);

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

  const getStatusIcon = () => {
    switch (loadingState) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />;
      case 'loaded':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-gradient-to-r from-gray-900/50 to-black/50 rounded-lg p-4 border border-gray-700/50 ${className}`}>
      {/* Track Info and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium text-white text-sm truncate">{title}</h4>
          {getStatusIcon()}
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

export default WorkingAudioPlayer;