import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';

interface AudioEngineContextType {
  audioContext: AudioContext | null;
  masterGain: GainNode | null;
  isInitialized: boolean;
  initializeAudio: () => Promise<void>;
  playAudioBuffer: (url: string, volume?: number) => Promise<void>;
  createOscillator: (frequency: number, type: OscillatorType) => OscillatorNode | null;
}

const AudioEngineContext = createContext<AudioEngineContextType | null>(null);

export const useAudioEngine = () => {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error('useAudioEngine must be used within AudioEngineProvider');
  }
  return context;
};

interface AudioEngineProviderProps {
  children: React.ReactNode;
}

export const AudioEngineProvider: React.FC<AudioEngineProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  console.log('🎛️ Studio Audio Engine Provider initialized');

  const initializeAudio = useCallback(async () => {
    if (audioContextRef.current) {
      console.log('🔊 Audio context already initialized');
      return;
    }

    try {
      console.log('🔊 Initializing Studio Audio Engine with Web Audio API');
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create master gain node
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = 0.8;

      setIsInitialized(true);
      console.log('✅ Studio Audio Engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Studio Audio Engine:', error);
    }
  }, []);

  const playAudioBuffer = useCallback(async (url: string, volume: number = 0.8) => {
    if (!audioContextRef.current || !masterGainRef.current) {
      console.warn('⚠️ Audio engine not initialized for playback');
      return;
    }

    try {
      console.log('🎵 Loading audio buffer for Studio playback:', url.substring(0, 50) + '...');
      
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = audioBuffer;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      
      source.start();
      console.log('✅ Audio buffer playing through Studio engine');
    } catch (error) {
      console.error('❌ Failed to play audio buffer:', error);
    }
  }, []);

  const createOscillator = useCallback((frequency: number, type: OscillatorType): OscillatorNode | null => {
    if (!audioContextRef.current) {
      console.warn('⚠️ Audio context not available for oscillator');
      return null;
    }

    const oscillator = audioContextRef.current.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    return oscillator;
  }, []);

  // Initialize on user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isInitialized) {
        initializeAudio();
      }
    };

    // Multiple event listeners to catch first user interaction
    const events = ['click', 'touchstart', 'mousedown', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [initializeAudio, isInitialized]);

  const value: AudioEngineContextType = {
    audioContext: audioContextRef.current,
    masterGain: masterGainRef.current,
    isInitialized,
    initializeAudio,
    playAudioBuffer,
    createOscillator
  };

  return (
    <AudioEngineContext.Provider value={value}>
      {children}
    </AudioEngineContext.Provider>
  );
};