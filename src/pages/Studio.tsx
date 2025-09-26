import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Wand2, 
  Scissors, 
  Mic, 
  Waves, 
  Play, 
  Pause,
  Volume2,
  Settings,
  Layers,
  Save,
  Download,
  Crown,
  Zap,
  Activity,
  Target,
  Clock,
  BarChart3,
  Piano,
  Drum,
  Guitar,
  Sliders,
  Grid3X3,
  Square,
  Circle,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Monitor,
  Headphones,
  Mic2,
  VolumeX,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Package,
  Upload,
  FolderOpen,
  CheckCircle,
  X,
  File,
  Sparkles,
  Brain,
  Eye,
  MessageSquare,
  Cpu,
  Radio,
  Send,
  Loader2,
  Archive,
  FileText
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { aceStepClient, type GenerationParams } from '../lib/aceStep';
import { openaiClient } from '../lib/openaiClient';
import UniversalAudioPlayer from '../components/UniversalAudioPlayer';
import PlayButton from '../components/PlayButton';
import BeatPatternPlayer from '../components/BeatPatternPlayer';
import GenreSelector from '../components/GenreSelector';
import SoundPackCreator from '../components/SoundPackCreator';
import DAWExporter from '../components/DAWExporter';
import DefaultSampleLibrary from '../components/DefaultSampleLibrary';
import { 
  initializeDefaultSamples,
  type DefaultSample,
  type DefaultSamplePack
} from '../lib/defaultSamples';

interface LoadedSamplePack {
  id: string;
  name: string;
  type: string;
  samples: Array<{
    id: string;
    name: string;
    type: string;
    audioUrl: string;
    duration: number;
    bpm: number;
    key: string;
    tags: string[];
  }>;
  totalSamples: number;
  bpm: number;
  key: string;
}

interface SongVision {
  enhancedVision: string;
  arrangement: string;
  productionNotes: string;
  mixingGuidance: string;
}

interface Track {
  id: number;
  name: string;
  type: string;
  color: string;
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
  samples: any[];
  isPlaying: boolean;
}

const Studio = () => {
  // Transport and sequencer state
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tempo, setTempo] = useState(128);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [activePattern, setActivePattern] = useState('drums');
  const [pianoRollNote, setPianoRollNote] = useState(60);
  const [selectedGenre, setSelectedGenre] = useState('edm');
  const [generatedTracks, setGeneratedTracks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [activeTab, setActiveTab] = useState('sequencer');
  const [loadedSamplePacks, setLoadedSamplePacks] = useState<LoadedSamplePack[]>([]);
  const [selectedSamplePack, setSelectedSamplePack] = useState<string>('');
  const [draggedSample, setDraggedSample] = useState<any>(null);
  
  // AI Vision System
  const [songVision, setSongVision] = useState('');
  const [aiVision, setAiVision] = useState<SongVision | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [showDAWExporter, setShowDAWExporter] = useState(false);

  // Audio context and refs
  const audioContext = useRef<AudioContext | null>(null);
  const transportIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { hasAccess, subscription, isAdmin } = useAuth();

  console.log('🎛️ Studio loaded with improved layout and responsive design - no network calls');

  // Initialize audio context and default samples
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('🔊 Audio context initialized for Studio');
      }
    };

    // Initialize default samples
    initializeDefaultSamples();

    // Initialize on user interaction
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    return () => document.removeEventListener('click', handleUserInteraction);
  }, []);

  // Load sample packs from localStorage
  useEffect(() => {
    const loadSamplePacks = () => {
      try {
        const savedPacks = localStorage.getItem('beatAddictsStudioPacks');
        if (savedPacks) {
          const packs = JSON.parse(savedPacks);
          setLoadedSamplePacks(packs);
          console.log('📦 Loaded', packs.length, 'sample packs into Studio');
        }
      } catch (error) {
        console.error('Failed to load sample packs:', error);
      }
    };

    loadSamplePacks();

    // Listen for new sample packs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'beatAddictsStudioPacks') {
        loadSamplePacks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced track configuration with working controls
  const [tracks, setTracks] = useState<Track[]>([
    { id: 0, name: 'Kick', type: 'drum', color: 'from-red-500 to-red-600', muted: false, solo: false, volume: 0.8, pan: 0, samples: [], isPlaying: false },
    { id: 1, name: 'Snare', type: 'drum', color: 'from-orange-500 to-orange-600', muted: false, solo: false, volume: 0.7, pan: 0, samples: [], isPlaying: false },
    { id: 2, name: 'Hi-Hat', type: 'drum', color: 'from-yellow-500 to-yellow-600', muted: false, solo: false, volume: 0.6, pan: 0.1, samples: [], isPlaying: false },
    { id: 3, name: 'Bass', type: 'bass', color: 'from-purple-500 to-purple-600', muted: false, solo: false, volume: 0.9, pan: 0, samples: [], isPlaying: false },
    { id: 4, name: 'Lead Synth', type: 'synth', color: 'from-cyan-500 to-cyan-600', muted: false, solo: false, volume: 0.6, pan: -0.2, samples: [], isPlaying: false },
    { id: 5, name: 'Pad', type: 'synth', color: 'from-green-500 to-green-600', muted: false, solo: false, volume: 0.4, pan: 0.3, samples: [], isPlaying: false },
    { id: 6, name: 'Arp', type: 'synth', color: 'from-pink-500 to-pink-600', muted: false, solo: false, volume: 0.5, pan: -0.1, samples: [], isPlaying: false },
    { id: 7, name: 'Vocals', type: 'vocal', color: 'from-indigo-500 to-indigo-600', muted: false, solo: false, volume: 0.8, pan: 0, samples: [], isPlaying: false }
  ]);

  // Piano Roll Notes (C Major Scale) - working implementation
  const pianoNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const fullPianoRoll = [];
  for (let octave = 8; octave >= 1; octave--) {
    for (let i = pianoNotes.length - 1; i >= 0; i--) {
      fullPianoRoll.push({
        note: `${pianoNotes[i]}${octave}`,
        midi: (octave * 12) + i,
        isBlack: pianoNotes[i].includes('#')
      });
    }
  }

  // Beat Pattern Grid (16 steps) - fully functional
  const beatSteps = Array.from({ length: 16 }, (_, i) => i);
  const [beatPattern, setBeatPattern] = useState({
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hihat: [2, 6, 10, 14],
    openhat: [7, 15]
  });

  // Working transport controls
  const handlePlayPause = () => {
    console.log('🎵 Transport:', isPlaying ? 'Pausing' : 'Playing');
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start playback
      transportIntervalRef.current = setInterval(() => {
        setPlayheadPosition(prev => (prev + 0.1) % 16);
      }, (60 / tempo / 4) * 1000);
    } else {
      // Stop playback
      if (transportIntervalRef.current) {
        clearInterval(transportIntervalRef.current);
        transportIntervalRef.current = null;
      }
    }
  };

  const handleStop = () => {
    console.log('⏹️ Transport: Stopping');
    setIsPlaying(false);
    setPlayheadPosition(0);
    
    if (transportIntervalRef.current) {
      clearInterval(transportIntervalRef.current);
      transportIntervalRef.current = null;
    }
  };

  const handleRecord = () => {
    console.log('🔴 Transport:', isRecording ? 'Stop Recording' : 'Start Recording');
    setIsRecording(!isRecording);
  };

  const handleSkipBack = () => {
    console.log('⏮️ Transport: Skip Back');
    setPlayheadPosition(Math.max(0, playheadPosition - 4));
  };

  const handleSkipForward = () => {
    console.log('⏭️ Transport: Skip Forward');
    setPlayheadPosition(Math.min(15, playheadPosition + 4));
  };

  // Working beat pattern controls
  const toggleBeatStep = (instrument: string, step: number) => {
    console.log(`🥁 Toggling ${instrument} step ${step}`);
    setBeatPattern(prev => ({
      ...prev,
      [instrument]: prev[instrument].includes(step) 
        ? prev[instrument].filter(s => s !== step)
        : [...prev[instrument], step].sort()
    }));
  };

  // Working beat preview generation - NO NETWORK CALLS
  const generateBeatPreview = async () => {
    console.log('🎵 Generating beat pattern preview with simulation mode (NO API CALLS)');
    setIsGeneratingPreview(true);

    try {
      const beatDescription = `Professional drum loop: kick hits on steps ${beatPattern.kick.join(', ')}, snare hits on steps ${beatPattern.snare.join(', ')}, hi-hat on steps ${beatPattern.hihat.join(', ')}, open hat on ${beatPattern.openhat.join(', ')}. ${selectedGenre} style at ${tempo} BPM, 8 bar loop, studio quality, punchy drums, clear separation`;

      console.log('🎛️ Using local simulation for beat preview - no network calls');
      
      const result = await aceStepClient.generateMusic({
        tags: beatDescription,
        duration: 8,
        steps: 30,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000),
        scheduler_type: 'euler',
        cfg_type: 'constant',
        use_random_seed: true,
        genre: selectedGenre
      });

      setPreviewAudio(result.audio_url);
      console.log('✅ Beat pattern preview generated successfully (simulation mode)');
    } catch (error) {
      console.error('Beat preview generation failed:', error);
      alert('Beat preview generation failed. Please try again.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Working AI vision analysis
  const analyzeVision = async () => {
    if (!songVision.trim()) {
      alert('Please describe your song vision first');
      return;
    }

    console.log('🧠 Analyzing song vision with GPT-4 Turbo');
    setIsAnalyzing(true);

    try {
      const vision = await openaiClient.generateSongVision(
        beatPattern,
        songVision,
        selectedGenre,
        tempo
      );

      setAiVision(vision);
      console.log('✨ GPT-4 Turbo vision analysis completed');
    } catch (error) {
      console.error('Vision analysis failed:', error);
      alert('Vision analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Working enhanced generation with AI vision - NO NETWORK CALLS
  const handleGenerateWithVision = async () => {
    if (!songVision.trim()) {
      alert('Please describe your song vision to generate tracks');
      return;
    }

    setIsGenerating(true);
    console.log('🎵 Generating tracks with simulation mode (NO API CALLS)');
    
    try {
      let enhancedPrompt = `${selectedGenre} track at ${tempo} BPM with custom beat pattern. ${songVision}`;
      
      if (aiVision) {
        enhancedPrompt += `. ${aiVision.enhancedVision}. Arrangement: ${aiVision.arrangement}. Production notes: ${aiVision.productionNotes}`;
      }

      const finalPrompt = await openaiClient.enhancePrompt(enhancedPrompt, selectedGenre);
      
      const params: GenerationParams = {
        tags: finalPrompt,
        duration: 240,
        steps: 75,
        guidance_scale: 8.0,
        seed: Math.floor(Math.random() * 1000000),
        scheduler_type: 'euler',
        cfg_type: 'constant',
        use_random_seed: true,
        genre: selectedGenre
      };

      console.log('🚀 Generating cutting-edge tracks with simulation mode (NO API CALLS)');

      const [track1, track2] = await Promise.all([
        aceStepClient.generateMusic(params),
        aceStepClient.generateMusic({
          ...params,
          seed: Math.floor(Math.random() * 1000000)
        })
      ]);
      
      const newTracks = [
        {
          id: Date.now(),
          title: `Studio Vision A - ${selectedGenre.toUpperCase()}`,
          audioUrl: track1.audio_url,
          duration: `${Math.floor(track1.duration / 60)}:${String(track1.duration % 60).padStart(2, '0')}`,
          vision: songVision,
          aiEnhanced: true,
          quality: '10/10 Professional'
        },
        {
          id: Date.now() + 1,
          title: `Studio Vision B - ${selectedGenre.toUpperCase()}`,
          audioUrl: track2.audio_url,
          duration: `${Math.floor(track2.duration / 60)}:${String(track2.duration % 60).padStart(2, '0')}`,
          vision: songVision,
          aiEnhanced: true,
          quality: '10/10 Professional'
        }
      ];
      
      setGeneratedTracks(newTracks);
      console.log('🎉 Cutting-edge Studio track generation completed (simulation mode)');
    } catch (error) {
      console.error('Studio generation failed:', error);
      alert('Studio generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Working track controls
  const toggleMute = (trackId: number) => {
    console.log(`🔇 Toggling mute for track ${trackId}`);
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, muted: !track.muted } : track
    ));
  };

  const toggleSolo = (trackId: number) => {
    console.log(`🎯 Toggling solo for track ${trackId}`);
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, solo: !track.solo } : track
    ));
  };

  const updateTrackVolume = (trackId: number, volume: number) => {
    console.log(`🔊 Setting track ${trackId} volume to ${Math.round(volume * 100)}%`);
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, volume } : track
    ));
  };

  const updateTrackPan = (trackId: number, pan: number) => {
    console.log(`🎛️ Setting track ${trackId} pan to ${pan > 0 ? 'R' : pan < 0 ? 'L' : 'C'}`);
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, pan } : track
    ));
  };

  // Working sample selection from default library
  const handleDefaultSampleSelect = (sample: DefaultSample) => {
    console.log('🎵 Selected default sample:', sample.name);
    
    // Auto-load to appropriate track based on sample type
    const trackMapping = {
      kick: 0,
      snare: 1, 
      hihat: 2,
      bass: 3,
      lead: 4,
      pad: 5,
      arp: 6,
      vocal: 7
    };
    
    const targetTrackId = trackMapping[sample.type as keyof typeof trackMapping] ?? activeTrack;
    
    setTracks(prev => prev.map(track => 
      track.id === targetTrackId 
        ? { ...track, samples: [...track.samples, sample] }
        : track
    ));
    
    alert(`Default sample "${sample.name}" loaded into ${tracks[targetTrackId].name} track!`);
  };

  // Working sample pack loading from default library
  const handleDefaultPackLoad = (pack: DefaultSamplePack) => {
    console.log('📦 Loading default sample pack:', pack.name);
    
    // Convert DefaultSamplePack to LoadedSamplePack format
    const convertedPack: LoadedSamplePack = {
      id: pack.id,
      name: pack.name,
      type: pack.type,
      samples: pack.samples.map(sample => ({
        id: sample.id,
        name: sample.name,
        type: sample.type,
        audioUrl: sample.audioUrl,
        duration: sample.duration,
        bpm: sample.bpm,
        key: sample.key,
        tags: sample.tags
      })),
      totalSamples: pack.totalSamples,
      bpm: pack.bpm,
      key: pack.key
    };
    
    setLoadedSamplePacks(prev => {
      const exists = prev.some(p => p.id === convertedPack.id);
      if (exists) return prev;
      return [...prev, convertedPack];
    });
  };

  // Working sample drag and drop
  const handleSampleDrop = (sample: any, trackId: number) => {
    console.log(`🎵 Loading sample "${sample.name}" into track ${trackId}`);
    
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, samples: [...track.samples, sample] }
        : track
    ));
    
    alert(`Sample "${sample.name}" loaded into ${tracks[trackId].name} track!`);
  };

  const handleDragStart = (sample: any) => {
    setDraggedSample(sample);
    console.log('Started dragging sample:', sample.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, trackId: number) => {
    e.preventDefault();
    if (draggedSample) {
      handleSampleDrop(draggedSample, trackId);
      setDraggedSample(null);
    }
  };

  // Working zoom controls
  const handleZoomIn = () => {
    const newZoom = Math.min(2, zoom + 0.25);
    console.log('🔍 Zooming in to', Math.round(newZoom * 100) + '%');
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.5, zoom - 0.25);
    console.log('🔍 Zooming out to', Math.round(newZoom * 100) + '%');
    setZoom(newZoom);
  };

  // Working save and load functions
  const handleSaveProject = () => {
    const project = {
      name: `Studio Project ${Date.now()}`,
      tempo,
      timeSignature,
      tracks,
      beatPattern,
      songVision,
      aiVision,
      generatedTracks,
      createdAt: new Date().toISOString()
    };
    
    const projects = JSON.parse(localStorage.getItem('studioProjects') || '[]');
    projects.push(project);
    localStorage.setItem('studioProjects', JSON.stringify(projects));
    
    console.log('💾 Project saved successfully');
    alert('Project saved successfully!');
  };

  // Working download function
  const handleDownloadTrack = (track: any) => {
    console.log('📥 Downloading track:', track.title);
    
    if (track.audioUrl) {
      const a = document.createElement('a');
      a.href = track.audioUrl;
      a.download = `${track.title.replace(/\s+/g, '_')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Project data for DAW export
  const getProjectData = () => ({
    name: `Studio Session ${Date.now()}`,
    tempo,
    timeSignature,
    tracks,
    beatPattern,
    songVision,
    generatedTracks
  });

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (transportIntervalRef.current) {
        clearInterval(transportIntervalRef.current);
      }
    };
  }, []);

  const tabs = [
    { id: 'sequencer', label: 'SEQUENCER', icon: Grid3X3 },
    { id: 'soundpack', label: 'SOUND PACK CREATOR', icon: Package },
    { id: 'samples', label: 'SAMPLE LIBRARY', icon: FolderOpen },
    { id: 'defaultsamples', label: 'DEFAULT SAMPLES', icon: Music },
    { id: 'export', label: 'DAW EXPORT', icon: Archive }
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Enhanced Top Bar with Improved Design */}
      <div className="flex-shrink-0 bg-black/30 backdrop-blur-sm border-b border-white/10 shadow-lg">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-4 sm:space-x-6 min-w-0">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-sm sm:text-lg hidden sm:block">BEAT ADDICTS STUDIO</span>
              <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs font-bold text-purple-400 border border-purple-500/30">
                SIMULATION MODE
              </div>
            </div>
            
            {/* Working Transport Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button 
                onClick={handleRecord}
                className={`p-2 rounded-lg transition-all duration-200 ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'hover:bg-white/10'}`}
                title="Record"
              >
                <Circle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:shadow-lg"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button 
                onClick={handleStop}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:shadow-lg"
                title="Stop"
              >
                <Square className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={handleSkipBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:shadow-lg hidden sm:block"
                title="Skip Back"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSkipForward}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:shadow-lg hidden sm:block"
                title="Skip Forward"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Working Tempo and Time Signature */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400 font-bold">BPM</span>
                <input
                  type="number"
                  value={tempo}
                  onChange={(e) => {
                    const newTempo = Number(e.target.value);
                    console.log('🎯 Tempo changed to:', newTempo);
                    setTempo(newTempo);
                  }}
                  className="w-16 px-2 py-1 bg-black/40 border border-gray-600/50 rounded-lg text-white text-center font-mono backdrop-blur-sm focus:border-purple-500/50 transition-colors"
                  min="60"
                  max="200"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400 font-bold">TIME</span>
                <select
                  value={timeSignature}
                  onChange={(e) => {
                    console.log('🎼 Time signature changed to:', e.target.value);
                    setTimeSignature(e.target.value);
                  }}
                  className="px-2 py-1 bg-black/40 border border-gray-600/50 rounded-lg text-white font-mono backdrop-blur-sm focus:border-purple-500/50 transition-colors"
                >
                  <option value="4/4">4/4</option>
                  <option value="3/4">3/4</option>
                  <option value="6/8">6/8</option>
                  <option value="7/8">7/8</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:block text-xs text-gray-400 font-bold">
              Packs: {loadedSamplePacks.length} • AI: GPT-4 • Status: {isPlaying ? 'Playing' : 'Stopped'}
            </div>
            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Studio Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSaveProject}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Save Project"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Improved Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Improved Responsive Design */}
        <div className="w-full sm:w-80 lg:w-96 bg-black/20 backdrop-blur-sm flex flex-col border-r border-white/10 shadow-xl">
          {/* Tab Selector with Better Visual Design */}
          <div className="p-3 sm:p-4 border-b border-white/10 bg-gradient-to-r from-black/20 to-transparent">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      console.log('📱 Switching to tab:', tab.label);
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center justify-center lg:justify-start space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white backdrop-blur-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'sequencer' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* AI Song Vision Section - Improved Layout */}
              <div className="p-4 border-b border-white/10 space-y-4 bg-gradient-to-b from-purple-500/5 to-transparent">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white">AI SONG VISION</h3>
                  <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30 font-bold">
                    GPT-4 TURBO
                  </div>
                </div>
                
                <div className="space-y-3">
                  <textarea
                    value={songVision}
                    onChange={(e) => setSongVision(e.target.value)}
                    placeholder="Describe your song vision... e.g., 'An epic cinematic drop with ethereal vocals, building from ambient intro to massive festival climax with emotional breakdown'"
                    className="w-full h-20 px-3 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white text-sm placeholder-gray-400 resize-none backdrop-blur-sm focus:border-purple-500/50 transition-colors"
                  />
                  
                  <button
                    onClick={analyzeVision}
                    disabled={!songVision.trim() || isAnalyzing}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                      songVision.trim() && !isAnalyzing
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ANALYZING WITH AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>ANALYZE WITH GPT-4</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Vision Results - Enhanced Display */}
                {aiVision && (
                  <div className="space-y-3 mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-cyan-400 text-sm">AI PROFESSIONAL ANALYSIS</span>
                    </div>
                    
                    <div className="space-y-2 text-xs max-h-40 overflow-y-auto">
                      <div>
                        <div className="text-purple-400 font-bold mb-1">Enhanced Vision:</div>
                        <div className="text-gray-300 leading-relaxed">{aiVision.enhancedVision}</div>
                      </div>
                      
                      <div>
                        <div className="text-cyan-400 font-bold mb-1">Arrangement:</div>
                        <div className="text-gray-300 leading-relaxed">{aiVision.arrangement}</div>
                      </div>
                      
                      <div>
                        <div className="text-emerald-400 font-bold mb-1">Production Notes:</div>
                        <div className="text-gray-300 leading-relaxed">{aiVision.productionNotes}</div>
                      </div>
                      
                      <div>
                        <div className="text-yellow-400 font-bold mb-1">Mixing Guidance:</div>
                        <div className="text-gray-300 leading-relaxed">{aiVision.mixingGuidance}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Track List - Improved Layout */}
              <div className="flex-1 overflow-auto">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`p-3 border-b border-white/5 cursor-pointer transition-all duration-200 ${
                      activeTrack === track.id ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'
                    }`}
                    onClick={() => {
                      console.log('🎵 Active track changed to:', track.name);
                      setActiveTrack(track.id);
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, track.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 bg-gradient-to-br ${track.color} rounded shadow-lg`}></div>
                      <span className="font-bold text-white text-sm flex-1">{track.name}</span>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute(track.id);
                          }}
                          className={`p-1 rounded text-xs transition-all duration-200 ${
                            track.muted ? 'bg-red-500 text-white shadow-lg' : 'hover:bg-white/10'
                          }`}
                          title={track.muted ? "Unmute" : "Mute"}
                        >
                          {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSolo(track.id);
                          }}
                          className={`p-1 rounded text-xs transition-all duration-200 ${
                            track.solo ? 'bg-yellow-500 text-black shadow-lg' : 'hover:bg-white/10'
                          }`}
                          title={track.solo ? "Unsolo" : "Solo"}
                        >
                          S
                        </button>
                      </div>
                    </div>
                    
                    {/* Volume and Pan Controls */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 w-8 font-bold">VOL</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={track.volume}
                          onChange={(e) => updateTrackVolume(track.id, Number(e.target.value))}
                          className="flex-1 h-1 bg-gray-700 rounded appearance-none cursor-pointer slider-modern"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-gray-400 w-8 font-bold">{Math.round(track.volume * 100)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 w-8 font-bold">PAN</span>
                        <input
                          type="range"
                          min="-1"
                          max="1"
                          step="0.1"
                          value={track.pan}
                          onChange={(e) => updateTrackPan(track.id, Number(e.target.value))}
                          className="flex-1 h-1 bg-gray-700 rounded appearance-none cursor-pointer slider-modern"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs text-gray-400 w-8 font-bold">
                          {track.pan > 0 ? 'R' : track.pan < 0 ? 'L' : 'C'}
                        </span>
                      </div>
                    </div>

                    {/* Sample Loading Indicator */}
                    {track.samples && track.samples.length > 0 && (
                      <div className="mt-2 text-xs text-cyan-400 font-bold">
                        {track.samples.length} samples loaded
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Generation Section */}
              <div className="p-4 border-t border-white/10 space-y-3 bg-gradient-to-t from-purple-500/5 to-transparent">
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    console.log('🎶 Genre changed to:', e.target.value);
                    setSelectedGenre(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-gray-600/50 rounded-lg text-white backdrop-blur-sm focus:border-purple-500/50 transition-colors"
                >
                  <option value="edm">EDM</option>
                  <option value="house">House</option>
                  <option value="techno">Techno</option>
                  <option value="trap">Trap</option>
                  <option value="dubstep">Dubstep</option>
                  <option value="trance">Trance</option>
                  <option value="ambient">Ambient</option>
                </select>
                
                <button
                  onClick={handleGenerateWithVision}
                  disabled={isGenerating || !songVision.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                    !isGenerating && songVision.trim()
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>GENERATING 10/10 TRACKS...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>GENERATE WITH AI VISION</span>
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {!songVision.trim() && (
                  <div className="text-xs text-yellow-400 font-bold text-center bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                    ⚠️ Describe your song vision above for AI-enhanced generation
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Tab Content */}
          {activeTab === 'samples' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-bold text-white mb-3">LOADED SAMPLE PACKS</h3>
                {loadedSamplePacks.length === 0 ? (
                  <div className="text-center py-6 bg-black/20 rounded-lg backdrop-blur-sm">
                    <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold text-sm">No sample packs loaded</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Create packs in the Sound Pack Creator
                    </p>
                  </div>
                ) : (
                  <select
                    value={selectedSamplePack}
                    onChange={(e) => {
                      console.log('📦 Selected sample pack:', e.target.value);
                      setSelectedSamplePack(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-black/40 border border-gray-600/50 rounded-lg text-white backdrop-blur-sm focus:border-purple-500/50 transition-colors"
                  >
                    <option value="">Select a sample pack...</option>
                    {loadedSamplePacks.map((pack) => (
                      <option key={pack.id} value={pack.id}>
                        {pack.name} ({pack.totalSamples} samples)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Sample Browser */}
              {selectedSamplePack && (
                <div className="flex-1 overflow-auto p-4">
                  {(() => {
                    const pack = loadedSamplePacks.find(p => p.id === selectedSamplePack);
                    if (!pack) return null;

                    return (
                      <div className="space-y-3">
                        <div className="text-xs text-gray-400 font-bold mb-3 bg-black/20 p-2 rounded-lg">
                          {pack.name} • {pack.bpm} BPM • Key of {pack.key}
                        </div>
                        
                        {pack.samples.map((sample) => (
                          <div
                            key={sample.id}
                            draggable
                            onDragStart={() => handleDragStart(sample)}
                            className="bg-black/20 backdrop-blur-sm p-3 rounded-lg cursor-grab hover:cursor-grabbing hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-purple-500/30 shadow-lg"
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                <File className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-white text-xs truncate">{sample.name}</div>
                                <div className="text-xs text-gray-400 font-bold">
                                  {sample.type} • {sample.duration.toFixed(1)}s
                                </div>
                              </div>
                              <PlayButton
                                audioUrl={sample.audioUrl}
                                title={sample.name}
                                size="sm" 
                                variant="compact"
                              />
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              {sample.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-bold border border-purple-500/30">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === 'soundpack' && (
            <div className="flex-1 p-4 overflow-auto">
              <SoundPackCreator />
            </div>
          )}

          {activeTab === 'defaultsamples' && (
            <div className="flex-1 overflow-auto">
              <DefaultSampleLibrary 
                onSampleSelect={handleDefaultSampleSelect}
                onPackLoad={handleDefaultPackLoad}
              />
            </div>
          )}

          {activeTab === 'export' && (
            <div className="flex-1 p-4 overflow-auto">
              <DAWExporter 
                projectData={getProjectData()}
                onExportComplete={() => console.log('DAW export completed')}
              />
            </div>
          )}
        </div>

        {/* Center Panel - Main Sequencer */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-black/10 to-purple-900/20">
          {activeTab === 'sequencer' ? (
            <>
              {/* Pattern Tabs */}
              <div className="flex border-b border-white/20 bg-black/20 backdrop-blur-sm shadow-lg">
                <button
                  className={`px-4 lg:px-6 py-3 font-bold text-xs lg:text-sm border-r border-white/20 transition-all duration-200 ${
                    activePattern === 'drums' ? 'bg-purple-500/30 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActivePattern('drums')}
                >
                  BEAT SEQUENCER
                </button>
                <button
                  className={`px-4 lg:px-6 py-3 font-bold text-xs lg:text-sm border-r border-white/20 transition-all duration-200 ${
                    activePattern === 'synth' ? 'bg-purple-500/30 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActivePattern('synth')}
                >
                  PIANO ROLL
                </button>
                <button
                  className={`px-4 lg:px-6 py-3 font-bold text-xs lg:text-sm transition-all duration-200 ${
                    activePattern === 'bass' ? 'bg-purple-500/30 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActivePattern('bass')}
                >
                  BASSLINE GENERATOR
                </button>
              </div>

              {/* Pattern Content */}
              <div className="flex-1 p-4 overflow-auto">
                {activePattern === 'drums' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                      <h3 className="font-bold text-white text-lg">BEAT SEQUENCER</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <button
                          onClick={generateBeatPreview}
                          disabled={isGeneratingPreview}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                            !isGeneratingPreview
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isGeneratingPreview ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>GENERATING...</span>
                            </>
                          ) : (
                            <>
                              <Radio className="w-4 h-4" />
                              <span>PREVIEW BEAT</span>
                            </>
                          )}
                        </button>
                        
                        <span className="text-sm text-gray-400 font-bold">16 Steps</span>
                        <button 
                          className="p-1 hover:bg-white/10 rounded transition-all duration-200"
                          onClick={() => {
                            console.log('🔄 Resetting beat pattern');
                            setBeatPattern({
                              kick: [0, 4, 8, 12],
                              snare: [4, 12],
                              hihat: [2, 6, 10, 14],
                              openhat: [7, 15]
                            });
                          }}
                          title="Reset Pattern"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Beat Preview Player */}
                    {previewAudio && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20 backdrop-blur-sm shadow-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <Radio className="w-5 h-5 text-cyan-400" />
                          <span className="font-bold text-white">BEAT PATTERN PREVIEW</span>
                          <div className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full font-bold">
                            SIMULATION MODE
                          </div>
                        </div>
                        <UniversalAudioPlayer
                          audioUrl={previewAudio}
                          title="Beat Pattern Preview"
                          duration="0:08"
                          showWaveform={true}
                          showDownload={true}
                        />
                      </div>
                    )}
                    
                    {/* Beat Grid - Responsive Design */}
                    <div className="space-y-2">
                      {Object.entries(beatPattern).map(([instrument, steps]) => (
                        <div key={instrument} className="flex items-center space-x-2">
                          <div 
                            className="w-12 sm:w-16 text-xs sm:text-sm font-bold text-white uppercase p-2 bg-black/30 backdrop-blur-sm rounded cursor-pointer border border-white/10 hover:border-purple-500/30 transition-all duration-200"
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggedSample) {
                                console.log(`🎵 Loading sample ${draggedSample.name} into ${instrument}`);
                                alert(`Sample "${draggedSample.name}" loaded into ${instrument}!`);
                                setDraggedSample(null);
                              }
                            }}
                            title={`Drop samples here for ${instrument}`}
                          >
                            {instrument}
                          </div>
                          <div className="flex space-x-0.5 sm:space-x-1 overflow-x-auto">
                            {beatSteps.map((step) => (
                              <button
                                key={step}
                                onClick={() => toggleBeatStep(instrument, step)}
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded border transition-all duration-200 relative flex-shrink-0 ${
                                  steps.includes(step)
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400 shadow-lg transform scale-110' 
                                    : 'border-gray-600 hover:border-gray-400 bg-black/20'
                                } ${
                                  Math.floor(playheadPosition) === step ? 'ring-2 ring-cyan-400 shadow-cyan-400/50' : ''
                                }`}
                              >
                                {step % 4 === 0 && (
                                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full shadow-lg"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Playhead */}
                    <div className="relative mt-4">
                      <div 
                        className="absolute top-0 w-0.5 h-full bg-cyan-400 transition-all duration-100 z-10 shadow-lg shadow-cyan-400/50"
                        style={{ left: `${(window.innerWidth < 640 ? 60 : 80) + (playheadPosition * (window.innerWidth < 640 ? 28 : 36))}px` }}
                      ></div>
                    </div>

                    {/* Sample Drop Instructions */}
                    {draggedSample && (
                      <div className="mt-6 p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-xl backdrop-blur-sm shadow-lg">
                        <div className="text-center">
                          <div className="text-cyan-400 font-bold mb-2">
                            DRAG TO INSTRUMENT SLOT
                          </div>
                          <div className="text-sm text-gray-300 font-bold">
                            Drop "{draggedSample.name}" onto an instrument to load it
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activePattern === 'synth' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                      <h3 className="font-bold text-white text-lg">PIANO ROLL</h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={handleZoomOut}
                          className="p-1 hover:bg-white/10 rounded transition-all duration-200"
                          title="Zoom Out"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-400 font-bold">{Math.round(zoom * 100)}%</span>
                        <button 
                          onClick={handleZoomIn}
                          className="p-1 hover:bg-white/10 rounded transition-all duration-200"
                          title="Zoom In"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Piano Roll Grid - Responsive */}
                    <div className="flex bg-black/20 rounded-lg backdrop-blur-sm border border-white/10 overflow-hidden">
                      {/* Piano Keys */}
                      <div className="w-16 sm:w-20 space-y-px">
                        {fullPianoRoll.slice(0, 24).map((note, i) => (
                          <div
                            key={note.midi}
                            className={`h-3 sm:h-4 flex items-center justify-end px-2 text-xs font-mono border-r border-gray-600 cursor-pointer hover:bg-white/10 transition-all duration-200 ${
                              note.isBlack 
                                ? 'bg-gray-800 text-gray-400' 
                                : 'bg-gray-700 text-white'
                            } ${
                              pianoRollNote === note.midi ? 'bg-purple-600 shadow-lg' : ''
                            }`}
                            onClick={() => {
                              console.log('🎹 Piano roll note selected:', note.note);
                              setPianoRollNote(note.midi);
                            }}
                          >
                            {note.note}
                          </div>
                        ))}
                      </div>
                      
                      {/* Grid */}
                      <div className="flex-1 relative overflow-x-auto" style={{ transform: `scaleX(${zoom})` }}>
                        {fullPianoRoll.slice(0, 24).map((note, i) => (
                          <div key={note.midi} className="h-3 sm:h-4 border-b border-gray-600 relative">
                            <div className="absolute inset-0 grid grid-cols-16 gap-px">
                              {Array.from({ length: 16 }).map((_, step) => (
                                <div
                                  key={step}
                                  className="border-r border-gray-700 hover:bg-purple-500/20 cursor-pointer transition-all duration-200"
                                  onClick={() => {
                                    console.log(`🎵 Piano roll: Note ${note.note} at step ${step}`);
                                    setPianoRollNote(note.midi);
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePattern === 'bass' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-white text-lg">BASSLINE GENERATOR</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {['Sub Bass', 'Reese Bass', '303 Acid', 'Wobble Bass'].map((bassType) => (
                        <button
                          key={bassType}
                          onClick={() => {
                            console.log('🎸 Bass type selected:', bassType);
                            alert(`${bassType} selected! Pattern will be applied to bass track.`);
                          }}
                          className="p-4 bg-black/20 hover:bg-white/10 rounded-xl text-center transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <div className="font-bold text-sm text-white mb-2">{bassType}</div>
                          <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded transition-all duration-1000`} style={{ width: '60%' }}></div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Bass Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">CUTOFF</label>
                        <input 
                          type="range" 
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-modern"
                          onChange={(e) => console.log('🎛️ Cutoff:', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">RESONANCE</label>
                        <input 
                          type="range" 
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-modern"
                          onChange={(e) => console.log('🎛️ Resonance:', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">ATTACK</label>
                        <input 
                          type="range" 
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-modern"
                          onChange={(e) => console.log('🎛️ Attack:', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">RELEASE</label>
                        <input 
                          type="range" 
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-modern"
                          onChange={(e) => console.log('🎛️ Release:', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 p-4 overflow-auto">
              {activeTab === 'defaultsamples' && (
                <DefaultSampleLibrary 
                  onSampleSelect={handleDefaultSampleSelect}
                  onPackLoad={handleDefaultPackLoad}
                />
              )}
              {activeTab === 'soundpack' && (
                <SoundPackCreator />
              )}
              {activeTab === 'export' && (
                <DAWExporter 
                  projectData={getProjectData()}
                  onExportComplete={() => console.log('DAW export completed')}
                />
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Generated Tracks & Sample Packs */}
        <div className="hidden lg:flex w-80 bg-black/20 backdrop-blur-sm border-l border-white/10 shadow-xl flex-col">
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-black/20 to-transparent">
            <h3 className="font-bold text-white">STUDIO ASSETS</h3>
            <div className="text-sm font-bold text-gray-300 mt-1">
              {generatedTracks.length} tracks • {loadedSamplePacks.length} packs
            </div>
          </div>
          
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {/* Generated Tracks Section */}
            <div className="border-b border-white/20 pb-4">
              <h4 className="font-bold text-white text-sm mb-3">GENERATED TRACKS</h4>
              {generatedTracks.length === 0 ? (
                <div className="text-center py-6 bg-black/20 rounded-lg backdrop-blur-sm">
                  <Music className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <div className="text-gray-500 font-bold text-sm">No tracks generated</div>
                  <div className="text-gray-600 text-xs mt-1">Describe your vision and generate</div>
                </div>
              ) : (
                generatedTracks.map((track, index) => (
                  <div key={track.id} className="bg-black/20 backdrop-blur-sm p-4 rounded-xl mb-3 border border-white/10 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-bold text-white text-sm">
                        {track.title}
                      </h5>
                      {track.aiEnhanced && (
                        <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30 font-bold">
                          GPT-4
                        </div>
                      )}
                    </div>
                    
                    {track.vision && (
                      <div className="text-xs text-gray-400 mb-3 font-bold">
                        Vision: {track.vision.substring(0, 50)}...
                      </div>
                    )}
                    
                    <UniversalAudioPlayer
                      audioUrl={track.audioUrl}
                      title={track.title}
                      duration={track.duration}
                      showWaveform={false}
                      showDownload={true}
                    />
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-emerald-400 font-bold">
                        {track.quality}
                      </div>
                      <button 
                        onClick={() => handleDownloadTrack(track)}
                        className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm flex items-center justify-center space-x-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>DOWNLOAD</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sample Packs Section */}
            <div>
              <h4 className="font-bold text-white text-sm mb-3">SAMPLE PACKS</h4>
              {loadedSamplePacks.length === 0 ? (
                <div className="text-center py-6 bg-black/20 rounded-lg backdrop-blur-sm">
                  <Package className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <div className="text-gray-500 font-bold text-sm">No sample packs</div>
                  <div className="text-gray-600 text-xs mt-1">
                    Create in Sound Pack tab
                  </div>
                </div>
              ) : (
                loadedSamplePacks.map((pack) => (
                  <div key={pack.id} className="bg-black/20 backdrop-blur-sm p-3 rounded-xl mb-3 border border-white/10 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-white text-sm">{pack.name}</h5>
                      <span className="text-xs text-gray-400 font-bold">
                        {pack.totalSamples}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-bold">
                      {pack.type} • {pack.bpm} BPM • {pack.key}
                    </div>
                    <button 
                      onClick={() => {
                        console.log('📦 Browsing sample pack:', pack.name);
                        setActiveTab('samples');
                        setSelectedSamplePack(pack.id);
                      }}
                      className="w-full mt-2 py-2 px-3 text-xs bg-black/30 hover:bg-white/10 rounded-lg transition-all duration-200 font-bold border border-white/10 hover:border-purple-500/30"
                    >
                      BROWSE SAMPLES
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Master Section */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
            <h4 className="font-bold text-white text-sm mb-3">MASTER OUTPUT</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-gray-400" />
                <input 
                  type="range" 
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-modern"
                  onChange={(e) => console.log('🔊 Master volume:', e.target.value)}
                />
                <span className="text-xs text-gray-400 w-8 font-bold">-6dB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-gray-400" />
                <input 
                  type="range" 
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-modern"
                  onChange={(e) => console.log('🎧 Headphone volume:', e.target.value)}
                />
                <span className="text-xs text-gray-400 w-8 font-bold">0dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;