import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Download, Clock } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 30,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  console.log('VoiceRecorder rendered:', { isRecording, duration, recordingTime });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        onRecordingComplete(blob, recordingTime);
        console.log('Recording completed:', { duration: recordingTime, size: blob.size });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      console.log('Recording stopped');
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl('');
    setIsPlaying(false);
    setDuration(0);
    setRecordingTime(0);
    console.log('Recording deleted');
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    return (recordingTime / maxDuration) * 100;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Recording Interface */}
      <div className="glass-card p-6 rounded-xl">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Mic className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Voice Recording</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Record your own voice for ethical AI training. Maximum {maxDuration} seconds.
          </p>

          {/* Recording Controls */}
          {!audioBlob ? (
            <div className="space-y-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Square className="w-8 h-8 text-white" />
                  </button>
                  
                  {/* Recording Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${getProgressPercent()}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {maxDuration - recordingTime} seconds remaining
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Playback Controls */
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={isPlaying ? pauseRecording : playRecording}
                  className="p-3 bg-primary hover:bg-primary/90 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Play className="w-5 h-5 text-primary-foreground" />
                  )}
                </button>
                
                <button
                  onClick={downloadRecording}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={deleteRecording}
                  className="p-3 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatTime(recordingTime)} recorded</span>
              </div>
              
              <button
                onClick={() => {
                  deleteRecording();
                }}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Record Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(Math.floor(audioRef.current.duration));
            }
          }}
        />
      )}

      {/* Ethical Guidelines */}
      <div className="text-xs text-muted-foreground bg-black/20 p-3 rounded-lg">
        <p className="font-medium mb-1">Ethical AI Guidelines:</p>
        <ul className="space-y-1">
          <li>• Only record your own voice</li>
          <li>• Do not attempt to clone celebrity or copyrighted voices</li>
          <li>• Recordings are used for AI training with your consent</li>
          <li>• Maximum {maxDuration} seconds to prevent misuse</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecorder;