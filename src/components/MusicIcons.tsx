import React from 'react';
import { Mic, Radio, Music, Disc3, Headphones, Volume2, Waveform } from 'lucide-react';

// Live Microphone Icon with pulsing red dot
export const LiveMicIcon: React.FC<{ className?: string; isLive?: boolean }> = ({ 
  className = '', 
  isLive = false 
}) => (
  <div className={`relative ${className}`}>
    <Mic className="w-6 h-6 text-red-400" />
    {isLive && (
      <>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
      </>
    )}
    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-bold">
      {isLive ? 'LIVE' : 'MIC'}
    </div>
  </div>
);

// Recording Icon with animated pulse
export const RecordingIcon: React.FC<{ className?: string; isRecording?: boolean }> = ({ 
  className = '', 
  isRecording = false 
}) => (
  <div className={`relative ${className}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      isRecording 
        ? 'bg-red-500 animate-pulse' 
        : 'bg-red-500/30 border-2 border-red-500'
    }`}>
      <div className="w-4 h-4 bg-white rounded-full"></div>
    </div>
    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-bold">
      {isRecording ? 'REC' : 'READY'}
    </div>
  </div>
);

// Spinning Vinyl Record
export const SpinningVinylIcon: React.FC<{ className?: string; isSpinning?: boolean }> = ({ 
  className = '', 
  isSpinning = true 
}) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    <div className={`relative ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
      <Disc3 className="w-8 h-8 text-purple-400" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
      </div>
      {/* Vinyl grooves */}
      <div className="absolute inset-1 border border-purple-400/30 rounded-full"></div>
      <div className="absolute inset-2 border border-purple-400/20 rounded-full"></div>
    </div>
    <span className="text-xs text-purple-400 font-bold mt-1">
      {isSpinning ? 'PLAY' : 'STOP'}
    </span>
  </div>
);

// Equalizer Bars
export const EqualizerIcon: React.FC<{ className?: string; isActive?: boolean }> = ({ 
  className = '', 
  isActive = false 
}) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    <div className="flex items-end space-x-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full transition-all duration-150 ${
            isActive ? 'animate-bounce' : ''
          }`}
          style={{
            height: `${Math.random() * 24 + 8}px`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
    <span className="text-xs text-cyan-400 font-bold mt-1">EQ</span>
  </div>
);

// Waveform Display
export const WaveformIcon: React.FC<{ className?: string; isActive?: boolean }> = ({ 
  className = '', 
  isActive = false 
}) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    <div className="flex items-center space-x-0.5 h-8">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`w-0.5 bg-gradient-to-t from-emerald-500 to-green-400 rounded-full transition-all duration-200 ${
            isActive ? 'animate-pulse' : ''
          }`}
          style={{
            height: `${Math.sin(i * 0.8) * 15 + 16}px`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
    <span className="text-xs text-emerald-400 font-bold mt-1">WAVE</span>
  </div>
);

// Studio Monitor Speakers
export const StudioMonitorIcon: React.FC<{ className?: string; isActive?: boolean }> = ({ 
  className = '', 
  isActive = false 
}) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    <div className="relative">
      <Volume2 className="w-6 h-6 text-orange-400" />
      {isActive && (
        <>
          <div className="absolute -right-1 top-0 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute -right-2 top-1 w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -right-3 top-2 w-0.5 h-0.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </>
      )}
    </div>
    <span className="text-xs text-orange-400 font-bold mt-1">OUT</span>
  </div>
);

// Headphones with audio waves - Fixed DOM structure
export const HeadphonesIcon: React.FC<{ className?: string; isActive?: boolean }> = ({ 
  className = '', 
  isActive = false 
}) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    <div className="relative">
      <Headphones className="w-6 h-6 text-pink-400" />
      {isActive && (
        <div className="absolute -top-1 -left-1">
          <div className="w-2 h-2 border border-pink-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 border border-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      )}
    </div>
    <span className="text-xs text-pink-400 font-bold mt-1">PHONES</span>
  </div>
);

// Music Note with bounce
export const MusicNoteIcon: React.FC<{ className?: string; isActive?: boolean }> = ({ 
  className = '', 
  isActive = false 
}) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    <Music className={`w-6 h-6 text-yellow-400 ${isActive ? 'animate-bounce' : ''}`} />
    <span className="text-xs text-yellow-400 font-bold mt-1">NOTE</span>
  </div>
);