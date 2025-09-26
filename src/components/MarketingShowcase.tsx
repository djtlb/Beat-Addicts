import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Crown, 
  Sparkles, 
  Zap, 
  Music, 
  Headphones,
  Radio,
  Target,
  Activity,
  Brain,
  Cpu,
  Eye,
  Wand2,
  Settings,
  Layers,
  BarChart3,
  Clock,
  ChevronRight,
  Star
} from 'lucide-react';
import { SpinningVinylIcon, EqualizerIcon, WaveformIcon } from './MusicIcons';

const MarketingShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const features = [
    {
      id: 'ai-generation',
      title: 'Dual AI Generation',
      subtitle: 'Two Professional Tracks Instantly',
      description: 'Our advanced AI creates two unique, professional-quality tracks simultaneously. Each track offers different arrangements and creative interpretations of your vision.',
      icon: Wand2,
      color: 'from-purple-500 to-pink-500',
      stats: ['2 Tracks Generated', '27.27x Real-time Speed', '192kHz Studio Quality'],
      demo: 'generation'
    },
    {
      id: 'gpt4-enhancement',
      title: 'GPT-4 Turbo Enhanced',
      subtitle: 'Intelligent Prompt Enhancement',
      description: 'Your simple descriptions become professional music production briefs. GPT-4 Turbo understands musical terminology and enhances your creative vision.',
      icon: Brain,
      color: 'from-cyan-500 to-blue-500',
      stats: ['Smart Prompt Analysis', 'Music Theory Integration', 'Genre-Specific Enhancement'],
      demo: 'prompt'
    },
    {
      id: 'studio-features',
      title: 'Professional Studio',
      subtitle: 'Full DAW Experience',
      description: 'Complete music production environment with beat sequencer, piano roll, sample library, effects, and professional mixing capabilities.',
      icon: Settings,
      color: 'from-emerald-500 to-teal-500',
      stats: ['8-Track Mixing', 'Beat Sequencer', 'Sample Library', 'Effects Rack'],
      demo: 'studio'
    },
    {
      id: 'export-options',
      title: 'Export Everything',
      subtitle: 'Ready for Any Platform',
      description: 'Export in multiple formats including WAV, MP3, FLAC, and individual stems. Generate DAW project files for Ableton, FL Studio, Logic Pro, and more.',
      icon: Download,
      color: 'from-orange-500 to-red-500',
      stats: ['Multiple Formats', 'DAW Projects', 'Stem Separation', 'Commercial License'],
      demo: 'export'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Rodriguez',
      role: 'Electronic Music Producer',
      content: 'Beat Addicts AI has revolutionized my workflow. The dual generation feature gives me options I never had before.',
      rating: 5,
      avatar: '🎧'
    },
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      content: 'Finally, an AI that understands music like a human producer. The quality is absolutely professional.',
      rating: 5,
      avatar: '🎵'
    },
    {
      name: 'Marcus Johnson',
      role: 'Film Composer',
      content: 'The GPT-4 enhancement turns my rough ideas into detailed production notes. It\'s like having a co-producer.',
      rating: 5,
      avatar: '🎬'
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            setShowResults(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const currentFeature = features[activeFeature];
  const Icon = currentFeature.icon;

  return (
    <div className="space-y-16 py-16">
      {/* Hero Showcase */}
      <div className="text-center space-y-8">
        <div className="relative inline-block">
          <SpinningVinylIcon className="w-32 h-32 mx-auto" isSpinning={true} />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div>
          <h1 className="text-7xl font-raver text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            BEAT ADDICTS AI
          </h1>
          <p className="text-3xl text-gray-300 font-underground mb-8">
            The Future of Music Production is Here
          </p>
          <div className="flex items-center justify-center space-x-12 text-gray-400">
            <span className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-purple-400" />
              <span>27.27x RTF Processing</span>
            </span>
            <span className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-cyan-400" />
              <span>Professional Quality</span>
            </span>
            <span className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-emerald-400" />
              <span>Dual Generation</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Feature Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Feature Selection */}
        <div className="space-y-6">
          <h2 className="text-4xl font-raver text-white mb-8">Why Beat Addicts AI?</h2>
          
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-500 ${
                  index === activeFeature 
                    ? `bg-gradient-to-r ${feature.color} scale-105 shadow-2xl` 
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    index === activeFeature ? 'bg-white/20' : 'bg-gray-700'
                  }`}>
                    <FeatureIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-raver text-white text-xl mb-1">{feature.title}</h3>
                    <p className="text-gray-300 font-underground text-sm mb-3">{feature.subtitle}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {feature.stats.map((stat, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white">
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Demo */}
        <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-700">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${currentFeature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-raver text-white">{currentFeature.title}</h3>
          </div>

          {/* Demo Content Based on Feature */}
          {currentFeature.demo === 'generation' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">User Prompt:</div>
                <div className="text-white">"Epic cinematic EDM with orchestral elements"</div>
              </div>
              
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  setGenerationProgress(0);
                  setShowResults(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-raver text-lg hover:scale-105 transition-all"
              >
                <div className="flex items-center justify-center space-x-2">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  <span>{isPlaying ? 'GENERATING...' : 'GENERATE DUAL TRACKS'}</span>
                </div>
              </button>

              {isPlaying && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress:</span>
                    <span className="text-purple-400 font-bold">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {showResults && (
                <div className="grid grid-cols-2 gap-4">
                  {['Track A', 'Track B'].map((track, i) => (
                    <div key={i} className="bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="font-raver text-white mb-2">{track}</h4>
                      <WaveformIcon isActive={true} />
                      <div className="flex justify-between mt-3">
                        <span className="text-xs text-gray-400">3:42</span>
                        <Play className="w-4 h-4 text-purple-400 cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentFeature.demo === 'prompt' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="text-xs text-gray-400 mb-2">Your Input:</div>
                <div className="text-white text-sm">"Make a cool EDM track"</div>
              </div>
              
              <div className="flex justify-center">
                <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              
              <div className="bg-cyan-500/20 p-4 rounded-xl border border-cyan-500/30">
                <div className="text-xs text-cyan-300 mb-2">GPT-4 Enhanced:</div>
                <div className="text-white text-sm leading-relaxed">
                  "Progressive house track with analog warm basslines, ethereal pad sweeps, punchy kick drums at 128 BPM, dramatic build-ups with white noise risers, euphoric melodic breakdown with plucked arpeggios, professional sidechain compression, and cinematic transitions..."
                </div>
              </div>
            </div>
          )}

          {currentFeature.demo === 'studio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-8 gap-1 mb-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-gradient-to-t from-purple-600 to-pink-600 rounded-sm animate-pulse"
                    style={{
                      height: `${Math.random() * 40 + 20}px`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {['Kick', 'Snare', 'Hi-Hat', 'Bass'].map((track, i) => (
                  <div key={track} className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-xs font-raver text-white mb-2">{track}</div>
                    <Volume2 className="w-4 h-4 text-purple-400 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentFeature.demo === 'export' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { format: 'WAV', quality: '192kHz/24-bit' },
                  { format: 'MP3', quality: '320kbps' },
                  { format: 'FLAC', quality: 'Lossless' },
                  { format: 'STEMS', quality: 'Separated' }
                ].map((format, i) => (
                  <div key={i} className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="font-raver text-white">{format.format}</div>
                    <div className="text-xs text-gray-400">{format.quality}</div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-raver flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>DOWNLOAD ALL FORMATS</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Showcase */}
      <div className="bg-gray-900/50 p-12 rounded-3xl border border-gray-700">
        <h2 className="text-4xl font-raver text-white text-center mb-12">Powered by Advanced AI</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '27.27x', label: 'Real-time Speed', icon: Zap, color: 'text-purple-400' },
            { value: '192kHz', label: 'Studio Quality', icon: Activity, color: 'text-cyan-400' },
            { value: '2', label: 'Tracks Generated', icon: Layers, color: 'text-emerald-400' },
            { value: '∞', label: 'Possibilities', icon: Sparkles, color: 'text-pink-400' }
          ].map((stat, i) => {
            const StatIcon = stat.icon;
            return (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600`}>
                  <StatIcon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-raver text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 font-underground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="text-center">
        <h2 className="text-4xl font-raver text-white mb-12">What Producers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700">
              <div className="text-6xl mb-4">{testimonial.avatar}</div>
              
              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 font-underground text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              
              <div>
                <div className="font-raver text-white">{testimonial.name}</div>
                <div className="text-gray-400 font-underground text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-br from-purple-900/50 to-cyan-900/50 p-12 rounded-3xl border border-purple-500/30">
        <h2 className="text-5xl font-raver text-white mb-6">Ready to Create?</h2>
        <p className="text-xl text-gray-300 font-underground mb-8 max-w-2xl mx-auto">
          Join thousands of producers creating professional music with Beat Addicts AI. 
          Start your journey into the future of music production.
        </p>
        
        <div className="flex items-center justify-center space-x-6">
          <button className="px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white rounded-2xl font-raver text-2xl hover:scale-105 transition-all shadow-2xl">
            <Crown className="w-8 h-8 inline mr-3" />
            START CREATING NOW
            <ChevronRight className="w-8 h-8 inline ml-3" />
          </button>
        </div>
        
        <div className="flex items-center justify-center space-x-8 mt-8 text-gray-400">
          <span>✓ No Credit Card Required</span>
          <span>✓ Instant Access</span>
          <span>✓ Professional Quality</span>
        </div>
      </div>
    </div>
  );
};

export default MarketingShowcase;