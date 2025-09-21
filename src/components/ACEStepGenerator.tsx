import React, { useState } from 'react';
import { 
  Wand2, 
  Play, 
  Download, 
  Settings, 
  Loader2,
  Music,
  Sliders,
  Clock,
  Shuffle,
  Volume2
} from 'lucide-react';

interface GenerationParams {
  tags: string;
  lyrics: string;
  duration: number;
  steps: number;
  guidance_scale: number;
  seed: number;
  scheduler_type: string;
  cfg_type: string;
  use_random_seed: boolean;
}

const ACEStepGenerator = () => {
  const [params, setParams] = useState<GenerationParams>({
    tags: '',
    lyrics: '',
    duration: 60,
    steps: 27,
    guidance_scale: 7.5,
    seed: 42,
    scheduler_type: 'euler',
    cfg_type: 'constant',
    use_random_seed: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [activeTab, setActiveTab] = useState('text2music');
  const [showAdvanced, setShowAdvanced] = useState(false);

  console.log('ACEStepGenerator rendered:', { activeTab, params });

  const schedulerTypes = ['euler', 'ddpm', 'ddim', 'lms', 'dpm_solver'];
  const cfgTypes = ['constant', 'linear', 'cosine'];

  const sampleTags = [
    'upbeat, electronic, dance, synthesizer',
    'acoustic, folk, guitar, peaceful, nature',
    'hip-hop, urban, bass-heavy, energetic',
    'classical, piano, orchestral, emotional',
    'rock, electric guitar, drums, powerful'
  ];

  const sampleLyrics = [
    '[verse]\nWalking down the empty street\nCity lights beneath my feet\n[chorus]\nThis is where I want to be\nFree as I can ever be',
    '[verse]\nMountains high and valleys low\nEvery path I need to know\n[chorus]\nJourney on, my heart is strong\nThis is where I belong',
    '[verse]\nBeats drop heavy in the night\nNeon colors burning bright\n[chorus]\nFeel the rhythm, feel the flow\nLet the music help you grow'
  ];

  const handleGenerate = async () => {
    console.log('Starting ACE-Step generation with params:', params);
    setIsGenerating(true);
    
    // Simulate ACE-Step API call
    setTimeout(() => {
      const rtf = 27.27; // Real-time factor from ACE-Step specs
      const actualGenTime = (params.duration / rtf).toFixed(2);
      
      setGeneratedTrack({
        id: Date.now(),
        title: 'ACE-Step Generated Track',
        duration: `${Math.floor(params.duration / 60)}:${String(params.duration % 60).padStart(2, '0')}`,
        params: { ...params },
        generationTime: actualGenTime,
        rtf: rtf,
        audioFile: `ace_step_${Date.now()}.wav`,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      });
      setIsGenerating(false);
      console.log(`ACE-Step generation completed in ${actualGenTime}s (${rtf}x RTF)`);
    }, Math.max(2000, (params.duration / 27.27) * 1000)); // Simulate actual ACE-Step speed
  };

  const loadSampleTags = (index: number) => {
    setParams(prev => ({ ...prev, tags: sampleTags[index] }));
  };

  const loadSampleLyrics = (index: number) => {
    setParams(prev => ({ ...prev, lyrics: sampleLyrics[index] }));
  };

  const randomizeSeed = () => {
    setParams(prev => ({ ...prev, seed: Math.floor(Math.random() * 1000000) }));
  };

  const tabs = [
    { id: 'text2music', label: 'Text2Music', icon: Music },
    { id: 'retake', label: 'Retake', icon: Shuffle },
    { id: 'edit', label: 'Edit', icon: Settings }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">ACE-Step Music Generator</h1>
        <p className="text-muted-foreground">
          Foundation model for music generation • 15x faster than LLM baselines
        </p>
        <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-muted-foreground">
          <span>RTF: 27.27x on A100</span>
          <span>•</span>
          <span>19 Languages Supported</span>
          <span>•</span>
          <span>Up to 4min Generation</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1
                ${activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'text2music' && (
            <div className="glass-card p-6 rounded-xl space-y-6">
              {/* Tags Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Tags & Style Description</label>
                  <div className="flex space-x-2">
                    {sampleTags.slice(0, 3).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => loadSampleTags(index)}
                        className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                      >
                        Sample {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={params.tags}
                  onChange={(e) => setParams(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., upbeat, electronic, dance, synthesizer, energetic, 120bpm"
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
                  value={params.lyrics}
                  onChange={(e) => setParams(prev => ({ ...prev, lyrics: e.target.value }))}
                  placeholder="[verse]&#10;Your lyrics here&#10;[chorus]&#10;With structure tags"
                  className="w-full h-32 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use structure tags: [verse], [chorus], [bridge], [outro]
                </p>
              </div>

              {/* Duration Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Duration (seconds)</label>
                  <span className="text-sm text-muted-foreground">{params.duration}s</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="15"
                    max="240"
                    step="15"
                    value={params.duration}
                    onChange={(e) => setParams(prev => ({ ...prev, duration: Number(e.target.value) }))}
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
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={(!params.tags.trim() && !params.lyrics.trim()) || isGenerating}
            className={`
              w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all
              ${(!params.tags.trim() && !params.lyrics.trim()) || isGenerating
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl premium-glow'
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

        {/* Right Panel - Settings */}
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Generation Settings</h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Steps */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Inference Steps</label>
                  <span className="text-sm text-muted-foreground">{params.steps}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.steps}
                  onChange={(e) => setParams(prev => ({ ...prev, steps: Number(e.target.value) }))}
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
                  <span className="text-sm text-muted-foreground">{params.guidance_scale}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={params.guidance_scale}
                  onChange={(e) => setParams(prev => ({ ...prev, guidance_scale: Number(e.target.value) }))}
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
                    value={params.seed}
                    onChange={(e) => setParams(prev => ({ ...prev, seed: Number(e.target.value) }))}
                    disabled={params.use_random_seed}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <button
                    onClick={() => setParams(prev => ({ ...prev, use_random_seed: !prev.use_random_seed }))}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      params.use_random_seed 
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
                      value={params.scheduler_type}
                      onChange={(e) => setParams(prev => ({ ...prev, scheduler_type: e.target.value }))}
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
                      value={params.cfg_type}
                      onChange={(e) => setParams(prev => ({ ...prev, cfg_type: e.target.value }))}
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
                <span>{(params.duration / 27.27).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>RTF (A100):</span>
                <span>27.27x</span>
              </div>
              <div className="flex justify-between">
                <span>Steps:</span>
                <span>{params.steps}</span>
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
              <span>Generated in {generatedTrack.generationTime}s</span>
              <span>•</span>
              <span>{generatedTrack.rtf}x RTF</span>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-electric-500 rounded-lg flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{generatedTrack.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {generatedTrack.audioFile} • {generatedTrack.duration}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 bg-primary hover:bg-primary/90 rounded-full transition-colors">
                  <Play className="w-5 h-5 text-primary-foreground" />
                </button>
                <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
                <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Waveform */}
            <div className="mt-4 flex items-center justify-center space-x-1 h-12">
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-electric-500 rounded-full"
                  style={{
                    height: `${Math.random() * 40 + 8}px`,
                    opacity: Math.random() * 0.8 + 0.2
                  }}
                />
              ))}
            </div>
          </div>

          {/* Generation Parameters */}
          <div className="border border-border rounded-lg p-4 bg-black/10">
            <h4 className="font-medium text-sm mb-2">Generation Parameters</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>Steps: {generatedTrack.params.steps}</div>
              <div>Guidance: {generatedTrack.params.guidance_scale}</div>
              <div>Scheduler: {generatedTrack.params.scheduler_type}</div>
              <div>Seed: {generatedTrack.params.seed}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ACEStepGenerator;