import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Wand2, 
  Scissors, 
  Mic, 
  Waves, 
  Eye, 
  Brain, 
  Sparkles, 
  Music, 
  Headphones,
  Radio,
  Zap,
  Target,
  Crown,
  Settings,
  Layers,
  BarChart3,
  Activity,
  Cpu,
  Download,
  X,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shuffle,
  Clock,
  StudioMonitorIcon
} from 'lucide-react';
import { SpinningVinylIcon, EqualizerIcon, WaveformIcon, HeadphonesIcon } from './MusicIcons';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  component: string;
  duration: number;
  autoActions: Array<{
    delay: number;
    action: string;
    target: string;
    value?: any;
  }>;
}

const InteractiveDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [currentGenre, setCurrentGenre] = useState('edm');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [beatPattern, setBeatPattern] = useState([0, 4, 8, 12]);
  const [studioTour, setStudioTour] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const demoSteps: DemoStep[] = [
    {
      id: 'intro',
      title: 'Beat Addicts AI Engine',
      description: 'Welcome to the world\'s most advanced AI music production platform. Watch as we demonstrate professional music creation in real-time.',
      component: 'intro',
      duration: 4000,
      autoActions: []
    },
    {
      id: 'genre-selection',
      title: 'AI Genre Intelligence',
      description: 'Our AI automatically analyzes and adapts to different musical genres, understanding the nuances of each style.',
      component: 'genres',
      duration: 6000,
      autoActions: [
        { delay: 1000, action: 'selectGenre', target: 'house' },
        { delay: 3000, action: 'selectGenre', target: 'techno' },
        { delay: 5000, action: 'selectGenre', target: 'dubstep' }
      ]
    },
    {
      id: 'generation',
      title: 'Dual Track Generation',
      description: 'Beat Addicts AI generates two unique professional tracks simultaneously, each with distinct character and arrangement.',
      component: 'generation',
      duration: 8000,
      autoActions: [
        { delay: 500, action: 'startGeneration', target: 'prompt' },
        { delay: 1000, action: 'updateProgress', target: 'progress', value: 25 },
        { delay: 3000, action: 'updateProgress', target: 'progress', value: 50 },
        { delay: 5000, action: 'updateProgress', target: 'progress', value: 75 },
        { delay: 7000, action: 'updateProgress', target: 'progress', value: 100 }
      ]
    },
    {
      id: 'studio',
      title: 'Professional Studio',
      description: 'Access our fully-featured DAW with beat sequencer, piano roll, sample library, and advanced mixing capabilities.',
      component: 'studio',
      duration: 6000,
      autoActions: [
        { delay: 1000, action: 'showBeatGrid', target: 'sequencer' },
        { delay: 3000, action: 'toggleSteps', target: 'beat-pattern' },
        { delay: 5000, action: 'showMixer', target: 'mixer' }
      ]
    },
    {
      id: 'ai-features',
      title: 'Advanced AI Features',
      description: 'GPT-4 enhanced prompting, stem separation, voice cloning, and intelligent arrangement suggestions.',
      component: 'ai-features',
      duration: 5000,
      autoActions: [
        { delay: 1000, action: 'showAI', target: 'gpt4' },
        { delay: 3000, action: 'showStemSeparation', target: 'stems' }
      ]
    },
    {
      id: 'results',
      title: 'Professional Results',
      description: 'Export studio-quality tracks in multiple formats, ready for streaming, DJs, or further production.',
      component: 'results',
      duration: 4000,
      autoActions: [
        { delay: 1000, action: 'showTracks', target: 'results' },
        { delay: 2500, action: 'showExport', target: 'export' }
      ]
    }
  ];

  const genres = [
    { id: 'edm', name: 'EDM', color: 'from-purple-500 to-pink-500' },
    { id: 'house', name: 'House', color: 'from-cyan-500 to-blue-500' },
    { id: 'techno', name: 'Techno', color: 'from-emerald-500 to-teal-500' },
    { id: 'dubstep', name: 'Dubstep', color: 'from-orange-500 to-red-500' },
    { id: 'trance', name: 'Trance', color: 'from-indigo-500 to-purple-500' },
    { id: 'trap', name: 'Trap', color: 'from-yellow-500 to-orange-500' }
  ];

  useEffect(() => {
    if (isPlaying) {
      const step = demoSteps[currentStep];
      
      // Execute auto actions
      step.autoActions.forEach(action => {
        stepTimeoutRef.current = setTimeout(() => {
          executeAutoAction(action);
        }, action.delay);
      });

      // Progress to next step
      stepTimeoutRef.current = setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % demoSteps.length);
        setAutoProgress(0);
      }, step.duration);

      // Update progress bar
      intervalRef.current = setInterval(() => {
        setAutoProgress(prev => {
          const increment = (100 / step.duration) * 100;
          return Math.min(100, prev + increment);
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, [isPlaying, currentStep]);

  const executeAutoAction = (action: any) => {
    console.log('Executing demo action:', action);
    
    switch (action.action) {
      case 'selectGenre':
        setCurrentGenre(action.target);
        break;
      case 'startGeneration':
        setGenerationProgress(0);
        setShowResults(false);
        break;
      case 'updateProgress':
        setGenerationProgress(action.value);
        if (action.value === 100) {
          setTimeout(() => setShowResults(true), 500);
        }
        break;
      case 'toggleSteps':
        setBeatPattern(prev => 
          prev.includes(2) 
            ? prev.filter(s => s !== 2)
            : [...prev, 2].sort()
        );
        break;
      case 'showTracks':
        setShowResults(true);
        break;
    }
  };

  const handlePlayPause = () => {
    console.log('Demo:', isPlaying ? 'Pausing' : 'Starting');
    setIsPlaying(!isPlaying);
  };

  const handleStepChange = (direction: 'prev' | 'next') => {
    setIsPlaying(false);
    setAutoProgress(0);
    
    if (direction === 'next') {
      setCurrentStep(prev => (prev + 1) % demoSteps.length);
    } else {
      setCurrentStep(prev => (prev - 1 + demoSteps.length) % demoSteps.length);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setAutoProgress(0);
    setGenerationProgress(0);
    setShowResults(false);
    setCurrentGenre('edm');
    setBeatPattern([0, 4, 8, 12]);
  };

  const startStudioTour = () => {
    setStudioTour(true);
    console.log('Starting studio tour...');
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <Play className="w-8 h-8 group-hover:animate-pulse" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <Eye className="w-3 h-3 text-white animate-pulse" />
          </div>
        </button>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Watch Demo
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="fixed inset-4 z-50 bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-cyan-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SpinningVinylIcon className="w-12 h-12" isSpinning={isPlaying} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                <Eye className="w-3 h-3 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-raver text-white">Beat Addicts AI Demo</h2>
              <p className="text-gray-400 font-underground">Interactive Feature Showcase</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={startStudioTour}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-raver text-sm hover:scale-105 transition-all"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Studio Tour
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5 text-gray-400" /> : <Maximize2 className="w-5 h-5 text-gray-400" />}
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${autoProgress}%` }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-raver text-white text-lg mb-2">{currentStepData.title}</h3>
            <p className="text-sm text-gray-300 font-underground leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          <div className="flex-1 p-4 space-y-3">
            {demoSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(index);
                  setAutoProgress(0);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  index === currentStep 
                    ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/50' 
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === currentStep ? 'bg-purple-500' : 'bg-gray-600'
                  }`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-raver text-white text-sm">{step.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-700 space-y-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStepChange('prev')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className={`flex-1 py-3 px-4 rounded-lg font-raver transition-all ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                    : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600'
                } text-white`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isPlaying ? 'PAUSE' : 'START DEMO'}</span>
                </div>
              </button>
              
              <button
                onClick={() => handleStepChange('next')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-raver text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET DEMO</span>
            </button>
          </div>
        </div>

        {/* Main Demo Area */}
        <div className="flex-1 p-8 overflow-auto">
          {currentStepData.component === 'intro' && (
            <div className="text-center space-y-8">
              <div className="relative mx-auto w-32 h-32">
                <SpinningVinylIcon className="w-32 h-32" isSpinning={isPlaying} />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              
              <div>
                <h1 className="text-6xl font-raver text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  BEAT ADDICTS AI
                </h1>
                <p className="text-2xl text-gray-300 font-underground mb-6">
                  Professional Music Production Platform
                </p>
                <div className="flex items-center justify-center space-x-8 text-gray-400">
                  <span className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>GPT-4 Enhanced</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <span>27.27x RTF</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <span>Studio Quality</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                {[
                  { icon: Wand2, title: 'AI Generation', desc: 'Dual track synthesis' },
                  { icon: Settings, title: 'Professional Studio', desc: 'Full DAW capabilities' },
                  { icon: Brain, title: 'Smart AI', desc: 'GPT-4 enhanced prompting' },
                  { icon: Download, title: 'Export Ready', desc: 'Multiple formats' }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="bg-gray-800/50 p-6 rounded-2xl">
                      <Icon className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                      <h3 className="font-raver text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-400 font-underground">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStepData.component === 'genres' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-raver text-white mb-4">AI Genre Intelligence</h2>
                <p className="text-xl text-gray-300 font-underground">
                  Our AI understands musical genres at a molecular level
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setCurrentGenre(genre.id)}
                    className={`p-6 rounded-2xl transition-all duration-300 ${
                      currentGenre === genre.id
                        ? `bg-gradient-to-br ${genre.color} scale-105 shadow-2xl`
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-center">
                      <Music className="w-12 h-12 text-white mx-auto mb-3" />
                      <h3 className="font-raver text-white text-xl">{genre.name}</h3>
                      <div className="mt-3 h-1 bg-white/20 rounded-full">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-1000"
                          style={{ width: currentGenre === genre.id ? '100%' : '30%' }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-gray-800/50 p-6 rounded-2xl">
                <h3 className="font-raver text-white text-xl mb-4">Current Genre Analysis: {currentGenre.toUpperCase()}</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-raver text-purple-400 mb-2">128</div>
                    <div className="text-gray-400 font-underground">BPM Range</div>
                  </div>
                  <div>
                    <div className="text-3xl font-raver text-cyan-400 mb-2">4/4</div>
                    <div className="text-gray-400 font-underground">Time Signature</div>
                  </div>
                  <div>
                    <div className="text-3xl font-raver text-emerald-400 mb-2">C</div>
                    <div className="text-gray-400 font-underground">Key Signature</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStepData.component === 'generation' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-raver text-white mb-4">Dual Track Generation</h2>
                <p className="text-xl text-gray-300 font-underground">
                  Watch as Beat Addicts AI creates two unique professional tracks
                </p>
              </div>

              <div className="bg-gray-800/50 p-8 rounded-2xl">
                <textarea
                  value="Epic cinematic EDM track with orchestral elements, massive drops, and emotional breakdowns"
                  className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white resize-none"
                  readOnly
                />
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-raver text-white">Generation Progress</span>
                    <span className="text-purple-400 font-bold">{generationProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h3 className="font-raver text-white mb-2">Track A</h3>
                      <div className="space-y-2">
                        <EqualizerIcon isActive={generationProgress > 0} />
                        <div className="text-xs text-gray-400 font-underground">
                          {generationProgress > 50 ? 'Generating arrangement...' : 'Processing prompt...'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h3 className="font-raver text-white mb-2">Track B</h3>
                      <div className="space-y-2">
                        <WaveformIcon isActive={generationProgress > 25} />
                        <div className="text-xs text-gray-400 font-underground">
                          {generationProgress > 75 ? 'Finalizing mix...' : 'Creating variation...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showResults && (
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: 'Epic Cinematic EDM - Track A', time: '3:42' },
                    { title: 'Epic Cinematic EDM - Track B', time: '3:38' }
                  ].map((track, i) => (
                    <div key={i} className="bg-gray-800/50 p-6 rounded-2xl">
                      <h3 className="font-raver text-white text-lg mb-4">{track.title}</h3>
                      <div className="space-y-4">
                        <WaveformIcon isActive={true} />
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-underground">{track.time}</span>
                          <div className="flex space-x-2">
                            <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                              <Play className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                              <Download className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStepData.component === 'studio' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-raver text-white mb-4">Professional Studio</h2>
                <p className="text-xl text-gray-300 font-underground">
                  Full-featured DAW with advanced production tools
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Beat Sequencer */}
                <div className="col-span-2 bg-gray-800/50 p-6 rounded-2xl">
                  <h3 className="font-raver text-white text-xl mb-4">Beat Sequencer</h3>
                  <div className="space-y-3">
                    {['Kick', 'Snare', 'Hi-Hat'].map((instrument, i) => (
                      <div key={instrument} className="flex items-center space-x-2">
                        <div className="w-16 text-sm font-raver text-white">{instrument}</div>
                        <div className="flex space-x-1">
                          {Array.from({ length: 16 }).map((_, step) => (
                            <button
                              key={step}
                              className={`w-6 h-6 rounded border transition-all ${
                                (i === 0 && beatPattern.includes(step)) ||
                                (i === 1 && [4, 12].includes(step)) ||
                                (i === 2 && [2, 6, 10, 14].includes(step))
                                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400' 
                                  : 'border-gray-600 hover:border-gray-400'
                              }`}
                              onClick={() => {
                                if (i === 0) {
                                  setBeatPattern(prev => 
                                    prev.includes(step) 
                                      ? prev.filter(s => s !== step)
                                      : [...prev, step].sort()
                                  );
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mixer */}
                <div className="bg-gray-800/50 p-6 rounded-2xl">
                  <h3 className="font-raver text-white text-xl mb-4">Mixer</h3>
                  <div className="space-y-4">
                    {['Master', 'Drums', 'Bass', 'Synth'].map((channel) => (
                      <div key={channel} className="space-y-2">
                        <div className="text-xs font-raver text-white">{channel}</div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="range" 
                            className="flex-1 h-1 bg-gray-600 rounded appearance-none" 
                            defaultValue={channel === 'Master' ? 80 : 70}
                          />
                          <Volume2 className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Layers, title: 'Multi-Track', desc: '8 tracks' },
                  { icon: Scissors, title: 'Sample Editor', desc: 'Cut & splice' },
                  { icon: Settings, title: 'Effects Rack', desc: '20+ effects' },
                  { icon: Download, title: 'Export', desc: 'WAV, MP3, STEM' }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="bg-gray-800/50 p-4 rounded-xl text-center">
                      <Icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <h4 className="font-raver text-white text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-400 font-underground">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStepData.component === 'ai-features' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-raver text-white mb-4">Advanced AI Features</h2>
                <p className="text-xl text-gray-300 font-underground">
                  Cutting-edge AI technology at your fingertips
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-6 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Brain className="w-8 h-8 text-purple-400" />
                    <h3 className="font-raver text-white text-xl">GPT-4 Enhanced Prompting</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">User Input:</div>
                      <div className="text-sm text-white">"Make a cool EDM track"</div>
                    </div>
                    <div className="flex justify-center">
                      <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/30">
                      <div className="text-xs text-purple-300 mb-1">AI Enhanced:</div>
                      <div className="text-sm text-white">
                        "Progressive house track with analog warm basslines, ethereal pad sweeps, punchy kick drums at 128 BPM, dramatic build-ups with white noise risers, euphoric melodic breakdown..."
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Scissors className="w-8 h-8 text-cyan-400" />
                    <h3 className="font-raver text-white text-xl">AI Stem Separation</h3>
                  </div>
                  <div className="space-y-3">
                    {['Vocals', 'Drums', 'Bass', 'Other'].map((stem, i) => (
                      <div key={stem} className="flex items-center space-x-3">
                        <div className="w-12 text-xs font-raver text-white">{stem}</div>
                        <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              i === 0 ? 'bg-purple-500' :
                              i === 1 ? 'bg-cyan-500' :
                              i === 2 ? 'bg-emerald-500' : 'bg-pink-500'
                            }`}
                            style={{ width: `${70 + Math.random() * 30}%` }}
                          />
                        </div>
                        <Volume2 className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mic className="w-8 h-8 text-emerald-400" />
                    <h3 className="font-raver text-white text-xl">Voice Cloning</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Headphones className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm text-gray-300">Upload voice sample</div>
                      <div className="text-xs text-emerald-400 mt-2">AI analyzes vocal characteristics</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-8 h-8 text-pink-400" />
                    <h3 className="font-raver text-white text-xl">Smart Arrangement</h3>
                  </div>
                  <div className="space-y-2">
                    {['Intro', 'Build', 'Drop', 'Break', 'Drop', 'Outro'].map((section, i) => (
                      <div key={section} className="flex items-center space-x-3">
                        <div className="w-12 text-xs font-raver text-white">{section}</div>
                        <div className="flex-1 h-6 bg-gray-700 rounded flex items-center px-2">
                          <div className={`h-2 rounded flex-1 bg-gradient-to-r ${
                            i % 2 === 0 ? 'from-purple-500 to-pink-500' : 'from-cyan-500 to-blue-500'
                          }`} />
                        </div>
                        <div className="text-xs text-gray-400">32 bars</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStepData.component === 'results' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-raver text-white mb-4">Professional Results</h2>
                <p className="text-xl text-gray-300 font-underground">
                  Studio-quality tracks ready for any platform
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Track Results */}
                <div className="space-y-6">
                  <h3 className="font-raver text-white text-2xl">Generated Tracks</h3>
                  {[
                    { title: 'Epic Cinematic EDM - Track A', time: '3:42', quality: '192kHz/24-bit' },
                    { title: 'Epic Cinematic EDM - Track B', time: '3:38', quality: '192kHz/24-bit' }
                  ].map((track, i) => (
                    <div key={i} className="bg-gray-800/50 p-6 rounded-2xl">
                      <div className="flex items-center space-x-4 mb-4">
                        <SpinningVinylIcon className="w-16 h-16" isSpinning={true} />
                        <div className="flex-1">
                          <h4 className="font-raver text-white text-lg">{track.title}</h4>
                          <div className="text-gray-400 font-underground text-sm">
                            {track.time} • {track.quality} • Commercial License
                          </div>
                        </div>
                      </div>
                      
                      <WaveformIcon isActive={true} />
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex space-x-2">
                          <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                            <Play className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                            <Volume2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-raver text-sm hover:scale-105 transition-all">
                          <Download className="w-4 h-4 inline mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Export Options */}
                <div className="space-y-6">
                  <h3 className="font-raver text-white text-2xl">Export Options</h3>
                  
                  <div className="bg-gray-800/50 p-6 rounded-2xl space-y-4">
                    <h4 className="font-raver text-white text-lg">Audio Formats</h4>
                    {[
                      { format: 'WAV', desc: 'Uncompressed studio quality', quality: '192kHz/24-bit' },
                      { format: 'MP3', desc: 'Streaming optimized', quality: '320kbps' },
                      { format: 'FLAC', desc: 'Lossless compression', quality: 'CD Quality' },
                      { format: 'STEMS', desc: 'Individual track elements', quality: 'Separated' }
                    ].map((format, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div>
                          <div className="font-raver text-white">{format.format}</div>
                          <div className="text-xs text-gray-400">{format.desc}</div>
                        </div>
                        <div className="text-xs text-cyan-400">{format.quality}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-2xl space-y-4">
                    <h4 className="font-raver text-white text-lg">DAW Projects</h4>
                    {[
                      { daw: 'Ableton Live', ext: '.als' },
                      { daw: 'FL Studio', ext: '.flp' },
                      { daw: 'Logic Pro', ext: '.logicx' },
                      { daw: 'Pro Tools', ext: '.ptx' }
                    ].map((daw, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div className="font-raver text-white">{daw.daw}</div>
                        <div className="text-xs text-gray-400 font-mono">{daw.ext}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-2xl font-raver text-xl hover:scale-105 transition-all shadow-2xl">
                  <Crown className="w-6 h-6 inline mr-3" />
                  START CREATING NOW
                  <Sparkles className="w-6 h-6 inline ml-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;