import React, { useState } from 'react';
import { 
  Waves, 
  Play, 
  Download, 
  Volume2, 
  Settings,
  Loader2,
  Music,
  Layers,
  Crown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PremiumGate from '../components/PremiumGate';
import VoiceRecorder from '../components/VoiceRecorder';
import AudioPlayer from '../components/AudioPlayer';

const Harmonies = () => {
  const [recordedVocal, setRecordedVocal] = useState(null);
  const [harmonyStyle, setHarmonyStyle] = useState('natural');
  const [intensity, setIntensity] = useState(50);
  const [layerCount, setLayerCount] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedHarmonies, setProcessedHarmonies] = useState(null);
  const { hasAccess } = useAuth();

  console.log('Harmonies component rendered');

  const harmonyStyles = [
    {
      id: 'natural',
      name: 'Natural',
      description: 'Subtle, realistic harmonies',
      premium: false
    },
    {
      id: 'gospel',
      name: 'Gospel',
      description: 'Rich, soulful choir style',
      premium: false
    },
    {
      id: 'pop',
      name: 'Pop',
      description: 'Modern pop harmonies',
      premium: false
    },
    {
      id: 'choir',
      name: 'Choir',
      description: 'Full choir arrangement',
      premium: 'pro'
    },
    {
      id: 'experimental',
      name: 'Experimental',
      description: 'Creative, unique harmonies',
      premium: 'studio'
    }
  ];

  const handleRecordingComplete = (audioBlob, duration) => {
    setRecordedVocal({
      blob: audioBlob,
      duration: duration,
      name: `vocal_recording_${Date.now()}.wav`,
      size: audioBlob.size
    });
    console.log('Vocal recording completed:', { duration, size: audioBlob.size });
  };

  const handleProcessHarmonies = async () => {
    if (!recordedVocal) return;
    
    console.log('Starting harmony processing');
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const layers = [];
      for (let i = 1; i <= layerCount; i++) {
        layers.push({
          id: i,
          name: `Harmony Layer ${i}`,
          file: `harmony_layer_${i}.wav`,
          size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
          pitch: i === 1 ? '+3 semitones' : i === 2 ? '-3 semitones' : `${i > 3 ? '+' : ''}${(i - 3) * 2} semitones`,
          audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
        });
      }
      
      setProcessedHarmonies({
        originalVocal: {
          name: recordedVocal.name,
          size: `${(recordedVocal.size / (1024 * 1024)).toFixed(1)} MB`,
          audioUrl: URL.createObjectURL(recordedVocal.blob)
        },
        layers: layers,
        mixedVersion: {
          name: 'harmonies_mixed.wav',
          size: `${(Math.random() * 5 + 3).toFixed(1)} MB`,
          audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
        },
        style: harmonyStyle,
        intensity: intensity,
        timestamp: new Date().toISOString()
      });
      setIsProcessing(false);
      console.log('Harmony processing completed');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">AI Harmonies & Vocal Layering</h1>
        <p className="text-muted-foreground text-lg">
          Record your voice and add professional vocal harmonies and layers
        </p>
      </div>

      {/* Voice Recording Section */}
      {!recordedVocal ? (
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          maxDuration={60}
          className="glass-card"
        />
      ) : (
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Recorded Voice</h3>
            <button
              onClick={() => setRecordedVocal(null)}
              className="px-4 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
            >
              Record Again
            </button>
          </div>
          
          <AudioPlayer
            audioUrl={URL.createObjectURL(recordedVocal.blob)}
            title={recordedVocal.name}
            duration={`${Math.floor(recordedVocal.duration / 60)}:${String(recordedVocal.duration % 60).padStart(2, '0')}`}
            showWaveform={true}
          />
        </div>
      )}

      {/* Configuration */}
      {recordedVocal && !isProcessing && !processedHarmonies && (
        <div className="glass-card p-8 rounded-xl space-y-8">
          <h3 className="text-lg font-semibold">Harmony Configuration</h3>
          
          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Harmony Style</label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {harmonyStyles.map((style) => (
                <div key={style.id}>
                  {style.premium && !hasAccess(style.premium) ? (
                    <PremiumGate 
                      requiredTier={style.premium} 
                      showUpgrade={false}
                      fallback={
                        <div className="relative p-4 rounded-lg border border-border text-left opacity-60 cursor-not-allowed">
                          <Crown className="absolute top-2 right-2 w-4 h-4 text-yellow-400" />
                          <div className="font-medium text-sm">{style.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{style.description}</div>
                        </div>
                      }
                    >
                      {null}
                    </PremiumGate>
                  ) : (
                    <button
                      onClick={() => setHarmonyStyle(style.id)}
                      className={`
                        relative p-4 rounded-lg border text-left transition-all cursor-pointer
                        ${harmonyStyle === style.id 
                          ? 'border-primary bg-primary/10 shadow-lg' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{style.description}</div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Harmony Intensity</label>
              <span className="text-sm text-muted-foreground">{intensity}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div 
                className="absolute top-0 h-2 bg-primary rounded-lg pointer-events-none"
                style={{ width: `${intensity}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Subtle</span>
              <span>Balanced</span>
              <span>Prominent</span>
            </div>
          </div>

          {/* Layer Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Number of Harmony Layers</label>
              <span className="text-sm text-muted-foreground">{layerCount} layers</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="8"
                value={layerCount}
                onChange={(e) => setLayerCount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div 
                className="absolute top-0 h-2 bg-primary rounded-lg pointer-events-none"
                style={{ width: `${((layerCount - 1) / 7) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>4</span>
              <span>8</span>
            </div>
          </div>

          {/* Process Button */}
          <button
            onClick={handleProcessHarmonies}
            className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Waves className="w-5 h-5" />
            <span>Generate Harmonies</span>
          </button>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="glass-card p-8 rounded-xl">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Creating Your Harmonies</h3>
              <p className="text-muted-foreground">
                AI is analyzing your vocal and generating {layerCount} harmony layers...
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing pitch • Creating layers • Mixing harmonies
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {processedHarmonies && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <Layers className="w-6 h-6 text-primary" />
              <span>Harmony Layers Ready</span>
            </h3>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
          </div>

          {/* Mixed Version */}
          <div className="glass-card p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
            <h4 className="font-medium mb-3">Complete Mix (Original + Harmonies)</h4>
            <AudioPlayer
              audioUrl={processedHarmonies.mixedVersion.audioUrl}
              title={processedHarmonies.mixedVersion.name}
              duration="3:24"
              showWaveform={true}
            />
          </div>

          {/* Original Vocal */}
          <div className="glass-card p-4 rounded-lg">
            <h4 className="font-medium mb-3">Original Vocal</h4>
            <AudioPlayer
              audioUrl={processedHarmonies.originalVocal.audioUrl}
              title={processedHarmonies.originalVocal.name}
              duration="2:45"
              showWaveform={true}
            />
          </div>

          {/* Individual Layers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedHarmonies.layers.map((layer, index) => (
              <div key={layer.id} className="glass-card p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-3">{layer.name} ({layer.pitch})</h4>
                <AudioPlayer
                  audioUrl={layer.audioUrl}
                  title={layer.name}
                  duration="2:45"
                  showWaveform={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Harmonies;