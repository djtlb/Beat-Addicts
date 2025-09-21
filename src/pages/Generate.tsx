import React, { useState } from 'react';
import { 
  Wand2, 
  Play, 
  Download, 
  Settings, 
  Crown,
  Loader2,
  Music,
  Volume2,
  Sliders,
  Clock,
  Shuffle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PremiumGate from '../components/PremiumGate';
import AudioPlayer from '../components/AudioPlayer';
import { aceStepClient, type GenerationParams } from '../lib/aceStep';

const Generate = () => {
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [generationType, setGenerationType] = useState('full-track');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced parameters
  const [duration, setDuration] = useState(60);
  const [steps, setSteps] = useState(27);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState(42);
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  const [schedulerType, setSchedulerType] = useState('euler');
  const [cfgType, setCfgType] = useState('constant');
  
  const { hasAccess } = useAuth();

  console.log('Generate component rendered with ACE-Step integration');

  const generationTypes = [
    { id: 'full-track', label: 'Full Track', description: 'Complete song with all elements' },
    { id: 'instrumental', label: 'Instrumental', description: 'Music without vocals' },
    { id: 'lyrics-only', label: 'Lyrics Only', description: 'Just the vocal content', premium: 'pro' },
    { id: 'stems', label: 'Stems', description: 'Separated audio elements', premium: 'pro' },
    { id: 'vocals-only', label: 'Vocals Only', description: 'Only vocal parts', premium: 'studio' }
  ];

  const schedulerTypes = ['euler', 'ddpm', 'ddim', 'lms', 'dpm_solver'];
  const cfgTypes = ['constant', 'linear', 'cosine'];

  const samplePrompts = [
    'Upbeat electronic dance music with synthesizer, energetic beats, festival atmosphere',
    'Acoustic folk guitar, peaceful nature sounds, campfire vibes, warm vocals',
    'Hip-hop beat with heavy bass, trap drums, urban atmosphere, modern production',
    'Classical piano composition, emotional melody, orchestral arrangement, cinematic',
    'Jazz fusion with saxophone, complex harmonies, improvisational style, smooth'
  ];

  const sampleLyrics = [
    '[verse]\nWalking down the empty street\nCity lights beneath my feet\n[chorus]\nThis is where I want to be\nFree as I can ever be',
    '[verse]\nMountains high and valleys low\nEvery path I need to know\n[chorus]\nJourney on, my heart is strong\nThis is where I belong',
    '[verse]\nBeats drop heavy in the night\nNeon colors burning bright\n[chorus]\nFeel the rhythm, feel the flow\nLet the music help you grow'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    console.log('Starting ACE-Step music generation');
    setIsGenerating(true);
    
    try {
      const params: GenerationParams = {
        tags: prompt,
        lyrics: lyrics || undefined,
        duration: duration,
        steps: steps,
        guidance_scale: guidanceScale,
        seed: useRandomSeed ? Math.floor(Math.random() * 1000000) : seed,
        scheduler_type: schedulerType,
        cfg_type: cfgType,
        use_random_seed: useRandomSeed
      };

      const result = await aceStepClient.generateMusic(params);
      
      setGeneratedTrack({
        id: Date.now(),
        title: 'ACE-Step Generated Track',
        duration: `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')}`,
        prompt: prompt,
        lyrics: lyrics,
        type: generationType,
        audioUrl: result.audio_url,
        generationTime: result.generation_time,
        rtf: result.rtf,
        metadata: result.metadata
      });
      
      console.log('ACE-Step generation completed successfully');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Music generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSamplePrompt = (index: number) => {
    setPrompt(samplePrompts[index]);
  };

  const loadSampleLyrics = (index: number) => {
    setLyrics(sampleLyrics[index]);
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">ACE-Step Music Generation</h1>
        <p className="text-muted-foreground text-lg">
          Foundation model for professional music generation • 27x faster than LLM baselines
        </p>
        <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-muted-foreground">
          <span>RTF: 27.27x on A100</span>
          <span>•</span>
          <span>19 Languages Supported</span>
          <span>•</span>
          <span>Up to 4min Generation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-xl space-y-6">
            {/* Prompt Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Tags & Style Description</label>
                <div className="flex space-x-2">
                  {samplePrompts.slice(0, 3).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => loadSamplePrompt(index)}
                      className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                    >
                      Sample {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., upbeat electronic dance music, synthesizer, energetic beats, festival atmosphere, 128 bpm"
                className="w-full h-20 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Describe genre, mood, instruments, tempo, or scene
              </p>
            </div>

            {/* Lyrics Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Lyrics (Optional)</label>
                <div className="flex space-x-2">
                  {sampleLyrics.slice(0, 3).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => loadSampleLyrics(index)}
                      className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                    >
                      Sample {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="[verse]&#10;Your lyrics here&#10;[chorus]&#10;With structure tags"
                className="w-full h-32 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use structure tags: [verse], [chorus], [bridge], [outro]
              </p>
            </div>

            {/* Generation Type */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Generation Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {generationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setGenerationType(type.id)}
                    disabled={type.premium && !hasAccess(type.premium)}
                    className={`
                      p-4 rounded-lg border text-left transition-all relative
                      ${generationType === type.id 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border hover:border-primary/50'
                      }
                      ${type.premium && !hasAccess(type.premium) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {type.premium && !hasAccess(type.premium) && (
                      <Crown className="absolute top-2 right-2 w-4 h-4 text-yellow-400" />
                    )}
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Duration (seconds)</label>
                <span className="text-sm text-muted-foreground">{duration}s</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="15"
                  max="240"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>15s</span>
                <span>2min</span>
                <span>4min</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`
              w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all
              ${prompt.trim() && !isGenerating
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl premium-glow'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating with ACE-Step...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Music</span>
              </>
            )}
          </button>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">ACE-Step Settings</h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Steps */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Inference Steps</label>
                  <span className="text-sm text-muted-foreground">{steps}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Fast (10)</span>
                  <span>Quality (100)</span>
                </div>
              </div>

              {/* Guidance Scale */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Guidance Scale</label>
                  <span className="text-sm text-muted-foreground">{guidanceScale}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={guidanceScale}
                  onChange={(e) => setGuidanceScale(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Creative (1)</span>
                  <span>Accurate (20)</span>
                </div>
              </div>

              {/* Seed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Seed</label>
                  <button
                    onClick={randomizeSeed}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(Number(e.target.value))}
                    disabled={useRandomSeed}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <button
                    onClick={() => setUseRandomSeed(!useRandomSeed)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      useRandomSeed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    Random
                  </button>
                </div>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Scheduler Type</label>
                    <select
                      value={schedulerType}
                      onChange={(e) => setSchedulerType(e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {schedulerTypes.map(type => (
                        <option key={type} value={type}>{type.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">CFG Type</label>
                    <select
                      value={cfgType}
                      onChange={(e) => setCfgType(e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {cfgTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Performance Info */}
          <div className="glass-card p-4 rounded-xl">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Performance</span>
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Expected Time:</span>
                <span>{(duration / 27.27).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>RTF (A100):</span>
                <span>27.27x</span>
              </div>
              <div className="flex justify-between">
                <span>Steps:</span>
                <span>{steps}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">ACE-Step is generating your music...</h3>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Flow-matching • DCAE compression • MERT alignment • Linear transformer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Result */}
      {generatedTrack && (
        <div className="glass-card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Music className="w-6 h-6 text-primary" />
              <span>Generated Track</span>
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Generated in {generatedTrack.generationTime?.toFixed(2)}s</span>
              <span>•</span>
              <span>{generatedTrack.rtf?.toFixed(2)}x RTF</span>
            </div>
          </div>

          {/* Audio Player */}
          <AudioPlayer
            audioUrl={generatedTrack.audioUrl}
            title={generatedTrack.title}
            duration={generatedTrack.duration}
            showWaveform={true}
          />

          {/* Generation Parameters */}
          <div className="border border-border rounded-lg p-4 bg-black/10">
            <h4 className="font-medium text-sm mb-2">Generation Parameters</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>Steps: {steps}</div>
              <div>Guidance: {guidanceScale}</div>
              <div>Scheduler: {schedulerType}</div>
              <div>Duration: {duration}s</div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>Prompt: "{generatedTrack.prompt}"</p>
              {generatedTrack.lyrics && <p>Lyrics: "{generatedTrack.lyrics.substring(0, 100)}..."</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generate;