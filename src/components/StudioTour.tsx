import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Target,
  Eye,
  Hand,
  Lightbulb,
  Play,
  Wand2,
  Settings,
  Music,
  Headphones,
  Volume2,
  Layers,
  Grid3X3,
  Sliders,
  Download,
  Crown,
  Sparkles,
  Brain,
  Activity,
  Zap,
  Cpu,
  Radio,
  Mic,
  Scissors,
  Package
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'type' | 'drag';
  component: 'dashboard' | 'generate' | 'studio' | 'library';
  highlight?: boolean;
  tips?: string[];
}

interface StudioTourProps {
  isOpen: boolean;
  onClose: () => void;
  startComponent?: string;
}

const StudioTour: React.FC<StudioTourProps> = ({ 
  isOpen, 
  onClose, 
  startComponent = 'dashboard' 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(true);
  const [tourProgress, setTourProgress] = useState(0);
  const [currentComponent, setCurrentComponent] = useState(startComponent);
  
  const tourSteps: TourStep[] = [
    // Dashboard Tour
    {
      id: 'dashboard-welcome',
      title: 'Welcome to Beat Addicts Studio',
      description: 'Your journey into professional AI music production starts here. This is your creative command center.',
      target: '.dashboard-header',
      position: 'center',
      component: 'dashboard',
      highlight: true,
      tips: [
        'Access all features from the main dashboard',
        'Monitor system performance in real-time',
        'Track your creative projects and progress'
      ]
    },
    {
      id: 'dashboard-console',
      title: 'Beat Addicts Processing Console',
      description: 'These are your main creative tools. Each card represents a different AI-powered music production feature.',
      target: '.processing-console',
      position: 'bottom',
      component: 'dashboard',
      action: 'hover',
      tips: [
        'AI Synthesis Engine for track generation',
        'Quantum Stem Splitter for audio separation',
        'Vocal Engine for lyrics and voice synthesis',
        'Harmonic Matrix for advanced harmony creation'
      ]
    },
    {
      id: 'dashboard-sessions',
      title: 'Active Beat Addicts Sessions',
      description: 'View and manage all your recent music creations. Each session contains your generated tracks and project data.',
      target: '.active-sessions',
      position: 'top',
      component: 'dashboard',
      tips: [
        'Recent projects are automatically saved',
        'Click any session to continue working',
        'Download or share completed tracks'
      ]
    },
    
    // Generation Tour
    {
      id: 'generate-welcome',
      title: 'AI Synthesis Engine',
      description: 'This is where the magic happens. Our advanced AI generates professional music from your creative descriptions.',
      target: '.generation-header',
      position: 'center',
      component: 'generate',
      highlight: true
    },
    {
      id: 'generate-genre',
      title: 'Genre Matrix Selection',
      description: 'Choose your musical style. Our AI understands the nuances of each genre and applies appropriate production techniques.',
      target: '.genre-selector',
      position: 'right',
      component: 'generate',
      action: 'click',
      tips: [
        'Each genre has specific AI training',
        'Tempo and key signatures auto-adjust',
        'Production styles match genre conventions'
      ]
    },
    {
      id: 'generate-prompt',
      title: 'Beat Addicts Description Matrix',
      description: 'Describe your musical vision. Be creative and detailed - our GPT-4 enhanced AI will understand and expand your ideas.',
      target: '.prompt-input',
      position: 'left',
      component: 'generate',
      action: 'type',
      tips: [
        'Use emotional and descriptive language',
        'Mention specific instruments or sounds',
        'AI enhances your prompt automatically',
        'Try: "Epic orchestral drop with celestial vocals"'
      ]
    },
    {
      id: 'generate-quality',
      title: 'Quality Engine Controls',
      description: 'Adjust generation parameters for professional results. Higher steps mean better quality and longer processing time.',
      target: '.quality-controls',
      position: 'left',
      component: 'generate',
      tips: [
        'Minimum 50 steps for professional quality',
        'Pro users get up to 75 steps',
        'Studio users access 100 steps (Quantum)',
        'Longer duration = more complex arrangements'
      ]
    },
    {
      id: 'generate-button',
      title: 'PRODUCE - The Magic Button',
      description: 'Generate your dual tracks! Beat Addicts AI always creates two unique variations for comparison and choice.',
      target: '.generate-button',
      position: 'top',
      component: 'generate',
      action: 'click',
      highlight: true,
      tips: [
        'Dual generation is always active',
        'Each track has unique characteristics',
        'Generation uses advanced neural networks',
        'Real-time progress tracking available'
      ]
    },
    
    // Studio Tour
    {
      id: 'studio-welcome',
      title: 'Professional Studio Environment',
      description: 'Welcome to the full DAW experience. This is where you can edit, arrange, and perfect your AI-generated music.',
      target: '.studio-header',
      position: 'center',
      component: 'studio',
      highlight: true
    },
    {
      id: 'studio-transport',
      title: 'Transport Controls',
      description: 'Professional playback controls just like in any major DAW. Record, play, pause, and navigate your timeline.',
      target: '.transport-controls',
      position: 'bottom',
      component: 'studio',
      action: 'click',
      tips: [
        'Record button for live input',
        'Play/Pause for timeline control',
        'Skip buttons for quick navigation',
        'BPM and time signature adjustment'
      ]
    },
    {
      id: 'studio-sequencer',
      title: 'Beat Sequencer & Piano Roll',
      description: 'Create and edit drum patterns, melodies, and basslines. Switch between sequencer and piano roll modes.',
      target: '.sequencer-area',
      position: 'right',
      component: 'studio',
      action: 'click',
      tips: [
        'Click grid squares to add/remove beats',
        'Piano roll for melodic content',
        'Drag samples directly onto tracks',
        'Real-time preview generation'
      ]
    },
    {
      id: 'studio-tracks',
      title: 'Multi-Track Mixer',
      description: 'Professional mixing console with individual track controls, volume, panning, mute, and solo functions.',
      target: '.track-controls',
      position: 'right',
      component: 'studio',
      tips: [
        'Each track has independent controls',
        'Drag samples from library to tracks',
        'Solo/mute for isolation',
        'Volume and pan adjustment'
      ]
    },
    {
      id: 'studio-vision',
      title: 'AI Song Vision System',
      description: 'Describe your song concept and let GPT-4 Turbo analyze and enhance it with professional music theory.',
      target: '.song-vision',
      position: 'left',
      component: 'studio',
      action: 'type',
      highlight: true,
      tips: [
        'GPT-4 Turbo powered analysis',
        'Professional arrangement suggestions',
        'Production and mixing guidance',
        'Enhanced prompt generation'
      ]
    },
    {
      id: 'studio-samples',
      title: 'Sample Pack Creator & Library',
      description: 'Create your own sample packs or browse loaded packs. Drag and drop samples directly into your tracks.',
      target: '.sample-library',
      position: 'left',
      component: 'studio',
      action: 'drag',
      tips: [
        'Create custom sample packs',
        'Organize by genre and BPM',
        'Drag samples to any track',
        'Preview before loading'
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTourProgress(prev => {
          const newProgress = (currentStep + 1) / tourSteps.length * 100;
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      
      // Change component if needed
      const nextStep = tourSteps[currentStep + 1];
      if (nextStep.component !== currentComponent) {
        setCurrentComponent(nextStep.component);
      }
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      
      // Change component if needed
      const prevStep = tourSteps[currentStep - 1];
      if (prevStep.component !== currentComponent) {
        setCurrentComponent(prevStep.component);
      }
    }
  };

  const handleSkipToComponent = (component: string) => {
    const firstStepIndex = tourSteps.findIndex(step => step.component === component);
    if (firstStepIndex !== -1) {
      setCurrentStep(firstStepIndex);
      setCurrentComponent(component);
    }
  };

  const handleFinish = () => {
    setIsPlaying(false);
    onClose();
    console.log('Studio tour completed!');
  };

  const currentStepData = tourSteps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with spotlight effect */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm">
        {showSpotlight && currentStepData.highlight && (
          <div 
            className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/90"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.9) 70%)`
            }}
          />
        )}
      </div>

      {/* Tour Interface */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gray-900/95 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-raver text-white">Beat Addicts Studio Tour</h2>
                <p className="text-gray-400 font-underground">Interactive feature walkthrough</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm font-underground text-gray-400">
                Step {currentStep + 1} of {tourSteps.length}
              </div>
              <button
                onClick={() => setShowSpotlight(!showSpotlight)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Toggle Spotlight"
              >
                <Lightbulb className={`w-5 h-5 ${showSpotlight ? 'text-yellow-400' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={onClose}
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
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Component Navigation */}
        <div className="p-4 bg-gray-800/50 border-b border-gray-700">
          <div className="flex space-x-2">
            {['dashboard', 'generate', 'studio', 'library'].map((component) => {
              const icons = {
                dashboard: Activity,
                generate: Wand2,
                studio: Settings,
                library: Package
              };
              const Icon = icons[component];
              
              return (
                <button
                  key={component}
                  onClick={() => handleSkipToComponent(component)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-raver text-sm transition-all ${
                    currentComponent === component
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{component.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl mx-auto">
            {/* Tour Step Card */}
            <div className="bg-gray-900/95 border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {currentStepData.component === 'dashboard' && <Activity className="w-8 h-8 text-white" />}
                  {currentStepData.component === 'generate' && <Wand2 className="w-8 h-8 text-white" />}
                  {currentStepData.component === 'studio' && <Settings className="w-8 h-8 text-white" />}
                  {currentStepData.component === 'library' && <Package className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-3xl font-raver text-white mb-3">
                  {currentStepData.title}
                </h3>
                <p className="text-lg text-gray-300 font-underground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Action Indicator */}
              {currentStepData.action && (
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                    {currentStepData.action === 'click' && <Hand className="w-4 h-4 text-purple-400" />}
                    {currentStepData.action === 'hover' && <Eye className="w-4 h-4 text-cyan-400" />}
                    {currentStepData.action === 'type' && <Mic className="w-4 h-4 text-emerald-400" />}
                    {currentStepData.action === 'drag' && <Layers className="w-4 h-4 text-pink-400" />}
                    <span className="text-sm font-raver text-white capitalize">
                      {currentStepData.action} to interact
                    </span>
                  </div>
                </div>
              )}

              {/* Tips */}
              {currentStepData.tips && (
                <div className="mb-6">
                  <h4 className="font-raver text-white text-lg mb-3 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span>Pro Tips</span>
                  </h4>
                  <div className="space-y-2">
                    {currentStepData.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <Target className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300 font-underground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-raver transition-all ${
                    currentStep === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>PREVIOUS</span>
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-3 rounded-xl transition-all ${
                      isPlaying 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isPlaying ? <X className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                  </button>

                  <span className="text-sm font-underground text-gray-400">
                    {currentStep + 1} / {tourSteps.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-xl font-raver transition-all"
                >
                  <span>{currentStep === tourSteps.length - 1 ? 'FINISH TOUR' : 'NEXT'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Overlay */}
        {currentStepData.highlight && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioTour;