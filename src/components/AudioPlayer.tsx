import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, SkipBack, SkipForward } from 'lucide-react';
import UniversalAudioPlayer from './UniversalAudioPlayer';

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
  console.log('🎵 AudioPlayer wrapper using UniversalAudioPlayer for:', title);

  // Use UniversalAudioPlayer for all audio functionality
  return (
    <UniversalAudioPlayer
      audioUrl={audioUrl}
      title={title}
      duration={duration}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
      className={className}
      showWaveform={showWaveform}
      showDownload={true}
      autoLoad={true}
      compact={false}
    />
  );
};

export default AudioPlayer;