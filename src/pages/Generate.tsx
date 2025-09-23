import {
    BarChart3,
    Clock,
    Crown,
    Layers,
    Loader2,
    Music,
    Settings,
    Shuffle,
    Sparkles,
    Wand2,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import GenreSelector from '../components/GenreSelector';
import { useAuth } from '../hooks/useAuth';
import { aceStepClient, type GenerationParams } from '../lib/aceStep';
import { openaiClient } from '../lib/openai';

const Generate = () => {
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('edm');
  const [generationType, setGenerationType] = useState('full-track');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [lyricsTheme, setLyricsTheme] = useState('');

  // Advanced parameters
  const [duration, setDuration] = useState(180);
  const [steps, setSteps] = useState(27);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState(42);
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  const [schedulerType, setSchedulerType] = useState('euler');
  const [cfgType, setCfgType] = useState('constant');
  const [productionStyle, setProductionStyle] = useState('professional');
  const [arrangementMode, setArrangementMode] = useState('structured');

  const { hasAccess } = useAuth();

  console.log('Generate component rendered with advanced ACE-Step integration and genre selection');

  const generationTypes = [
    { id: 'full-track', label: 'Full Track', description: 'Complete song with all elements' },
    { id: 'instrumental', label: 'Instrumental', description: 'Music without vocals' },
    { id: 'stems', label: 'Stems', description: 'Individual track elements', premium: 'pro' },
    { id: 'extended', label: 'Extended Mix', description: 'Long-form mix (4-8 minutes)', premium: 'pro' },
    { id: 'remix', label: 'Remix Style', description: 'Club/radio edit variations', premium: 'studio' }
  ];

  const productionStyles = [
    { id: 'professional', label: 'Professional', description: 'Radio-ready, commercial quality' },
    { id: 'underground', label: 'Underground', description: 'Raw, authentic club sound' },
    { id: 'festival', label: 'Festival', description: 'Big, anthemic, crowd-pleasing' },
    { id: 'intimate', label: 'Intimate', description: 'Close, personal, detailed' },
    { id: 'experimental', label: 'Experimental', description: 'Innovative, boundary-pushing' }
  ];

  const arrangementModes = [
    { id: 'structured', label: 'Structured', description: 'Traditional song structure' },
    { id: 'progressive', label: 'Progressive', description: 'Evolving, building arrangement' },
    { id: 'minimal', label: 'Minimal', description: 'Less is more approach' },
    { id: 'maximal', label: 'Maximal', description: 'Full, layered production' }
  ];

  const schedulerTypes = ['euler', 'ddpm', 'ddim', 'lms', 'dpm_solver'];
  const cfgTypes = ['constant', 'linear', 'cosine'];

  const samplePrompts = {
    edm: [
      'Festival anthem with massive drops, uplifting synths, and crowd-pleasing energy',
      'Progressive house journey with emotional breakdowns and euphoric builds',
      'Big room energy with hands-in-the-air moments and festival-ready drops'
    ],
    house: [
      'Deep house groove with soulful vocals, warm bassline, and jazzy piano stabs',
      'Tech house banger with driving percussion, acid sequences, and underground vibe',
      'Tropical house sunset vibes with steel drums, marimbas, and oceanic atmosphere'
    ],
    trap: [
      'Hard-hitting festival trap with massive 808s, vocal chops, and energy drops',
      'Melodic trap with emotional leads, crisp snares, and atmospheric breakdowns',
      'Heavy trap banger with distorted bass, rapid hi-hats, and aggressive energy'
    ],
    dubstep: [
      'Riddim wobbles with mechanical precision, heavy drops, and underground energy',
      'Melodic dubstep with emotional vocals, soaring leads, and powerful bass',
      'Heavy dubstep chaos with crushing drops, metallic sounds, and festival power'
    ],
    rock: [
      'Alternative rock anthem with driving guitars, powerful drums, and emotional vocals',
      'Indie rock groove with jangly guitars, steady rhythm, and introspective lyrics',
      'Hard rock power with heavy riffs, thunderous drums, and stadium energy'
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    console.log('Starting advanced ACE-Step music generation with genre:', selectedGenre);
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
        use_random_seed: useRandomSeed,
        genre: selectedGenre,
        production_style: productionStyle,
        structure: arrangementMode
      };

      const result = await aceStepClient.generateMusic(params);

      setGeneratedTrack({
        id: Date.now(),
        title: `${selectedGenre.toUpperCase()} Track - ${productionStyle}`,
        duration: `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')}`,
        prompt: prompt,
        lyrics: lyrics,
        genre: selectedGenre,
        type: generationType,
        productionStyle: productionStyle,
        arrangementMode: arrangementMode,
        audioUrl: result.audio_url,
        generationTime: result.generation_time,
        rtf: result.rtf,
        metadata: result.metadata
      });

      console.log('Advanced ACE-Step generation completed successfully');
    } catch (error) {
      console.error('Advanced generation failed:', error);
      alert('Music generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSamplePrompt = (index: number) => {
    const prompts = samplePrompts[selectedGenre] || samplePrompts.edm;
    setPrompt(prompts[index] || prompts[0]);
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  const handleGenreTagsUpdate = (tags: string) => {
    setPrompt(tags);
  };

  const generateLyrics = async () => {
    if (!lyricsTheme.trim()) return;

    setIsGeneratingLyrics(true);
    try {
      const generatedLyrics = await openaiClient.generateLyrics(
        lyricsTheme,
        selectedGenre,
        'modern',
        { temperature: 0.8, max_tokens: 1000 }
      );
      setLyrics(generatedLyrics);
    } catch (error) {
      console.error('Lyrics generation failed:', error);
      alert('Lyrics generation failed. Please try again.');
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">Professional Music Generation Studio</h1>
        <p className="text-muted-foreground text-lg">
          Powered by ACE-Step foundation model • Production-ready quality • Advanced genre structures
        </p>
        <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-muted-foreground">
          <span>RTF: 27.27x on A100</span>
          <span>•</span>
          <span>Professional Song Structures</span>
          <span>•</span>
          <span>Up to 8min Extended Mixes</span>
        </div>
      </div>

      {/* Genre Selection */}
      <GenreSelector
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
        onTagsUpdate={handleGenreTagsUpdate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-xl space-y-6">
            {/* Enhanced Prompt Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Production Description</label>
                <div className="flex space-x-2">
                  {(samplePrompts[selectedGenre] || samplePrompts.edm).slice(0, 3).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => loadSamplePrompt(index)}
                      className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                    >
                      Style {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Festival anthem with massive drops, uplifting synths, emotional breakdowns, and crowd-pleasing energy"
                className="w-full h-24 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Describe mood, energy, instruments, and production style
              </p>
            </div>

            {/* Lyrics Input with AI Generation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Lyrics (Optional)</label>
                <button
                  onClick={generateLyrics}
                  disabled={!lyricsTheme.trim() || isGeneratingLyrics}
                  className={`
                    flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-all
                    ${lyricsTheme.trim() && !isGeneratingLyrics
                      ? 'bg-primary/20 text-primary hover:bg-primary/30'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }
                  `}
                >
                  {isGeneratingLyrics ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>AI Generate</span>
                </button>
              </div>

              {/* Lyrics Theme Input */}
              <div className="mb-3">
                <input
                  type="text"
                  value={lyricsTheme}
                  onChange={(e) => setLyricsTheme(e.target.value)}
                  placeholder="Enter lyrics theme (e.g., 'love and heartbreak', 'freedom and adventure')"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              {/* Lyrics Textarea */}
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="[verse]&#10;Your lyrics here&#10;[chorus]&#10;With structure tags&#10;&#10;Or use AI generation above!"
                className="w-full h-32 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Write your own lyrics or use AI to generate them based on your theme
              </p>
            </div>

            {/* Production Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Generation Type */}
              <div>
                <label className="block text-sm font-medium mb-3">Generation Type</label>
                <div className="space-y-2">
                  {generationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setGenerationType(type.id)}
                      disabled={type.premium && !hasAccess(type.premium)}
                      className={`
                        w-full p-3 rounded-lg border text-left transition-all relative
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
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Production Style */}
              <div>
                <label className="block text-sm font-medium mb-3">Production Style</label>
                <div className="space-y-2">
                  {productionStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setProductionStyle(style.id)}
                      className={`
                        w-full p-3 rounded-lg border text-left transition-all
                        ${productionStyle === style.id
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="font-medium text-sm">{style.label}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Duration</label>
                <span className="text-sm text-muted-foreground">{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="30"
                  max="480"
                  step="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>30s</span>
                <span>3min</span>
                <span>5min</span>
                <span>8min</span>
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
                <span>Generating Professional {selectedGenre.toUpperCase()} Track...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Professional Music</span>
              </>
            )}
          </button>
        </div>

        {/* Advanced Settings Panel */}
        <div className="space-y-6">
          {/* ACE-Step Settings */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>ACE-Step Engine</span>
              </h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Inference Steps */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Quality Steps</label>
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
                  <span>Balanced (27)</span>
                  <span>Premium (100)</span>
                </div>
              </div>

              {/* Guidance Scale */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Creativity vs Accuracy</label>
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
                  <span>Creative</span>
                  <span>Balanced</span>
                  <span>Precise</span>
                </div>
              </div>

              {/* Arrangement Mode */}
              <div>
                <label className="block text-sm font-medium mb-2">Arrangement Style</label>
                <select
                  value={arrangementMode}
                  onChange={(e) => setArrangementMode(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  {arrangementModes.map(mode => (
                    <option key={mode.id} value={mode.id}>{mode.label} - {mode.description}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <>
                  {/* Seed Control */}
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
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm"
                      />
                      <button
                        onClick={() => setUseRandomSeed(!useRandomSeed)}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                          useRandomSeed
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-white/10'
                        }`}
                      >
                        Random
                      </button>
                    </div>
                  </div>

                  {/* Scheduler Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Scheduler</label>
                    <select
                      value={schedulerType}
                      onChange={(e) => setSchedulerType(e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      {schedulerTypes.map(type => (
                        <option key={type} value={type}>{type.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  {/* CFG Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">CFG Mode</label>
                    <select
                      value={cfgType}
                      onChange={(e) => setCfgType(e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                <span>Est. Generation Time:</span>
                <span>{(duration / 27.27).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>Real-Time Factor:</span>
                <span>27.27x</span>
              </div>
              <div className="flex justify-between">
                <span>Quality Steps:</span>
                <span>{steps}</span>
              </div>
              <div className="flex justify-between">
                <span>Genre:</span>
                <span className="capitalize">{selectedGenre}</span>
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
              <h3 className="font-medium mb-2">
                Creating Professional {selectedGenre.toUpperCase()} Track with {productionStyle} Production...
              </h3>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '78%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Genre structure analysis • Professional arrangement • Advanced mixing • Master processing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Result */}
      {generatedTrack && (
        <div className="glass-card p-6 rounded-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span>Professional Track Generated</span>
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="capitalize font-medium text-primary">{generatedTrack.genre}</span>
              <span>•</span>
              <span>{generatedTrack.productionStyle} Style</span>
              <span>•</span>
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

          {/* Track Analysis */}
          {generatedTrack.metadata?.structure_analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4 bg-black/10">
                <h4 className="font-medium text-sm mb-2 flex items-center space-x-1">
                  <Layers className="w-4 h-4" />
                  <span>Song Structure</span>
                </h4>
                <div className="space-y-1">
                  {generatedTrack.metadata.structure_analysis.structure.map((section, i) => (
                    <div key={i} className="text-xs px-2 py-1 bg-primary/10 rounded text-primary">
                      {section}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 bg-black/10">
                <h4 className="font-medium text-sm mb-2 flex items-center space-x-1">
                  <Music className="w-4 h-4" />
                  <span>Production Elements</span>
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {generatedTrack.metadata.structure_analysis.detected_elements.map((element, i) => (
                    <div key={i} className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                      {element}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Generation Info */}
          <div className="border border-border rounded-lg p-4 bg-black/10">
            <h4 className="font-medium text-sm mb-2">Generation Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>Steps: {steps}</div>
              <div>Guidance: {guidanceScale}</div>
              <div>Scheduler: {schedulerType}</div>
              <div>Duration: {generatedTrack.duration}</div>
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
