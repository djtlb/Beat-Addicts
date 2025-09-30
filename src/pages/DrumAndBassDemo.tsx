import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Download, Loader2, Music, Volume2, AlertCircle, RefreshCw } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import { aceStepClient, type GenerationParams } from '../lib/aceStep';

const DrumAndBassDemo = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  // Drum & Bass Experimental parameters
  const demoParams = useMemo(() => ({
    genre: 'dnb',
    prompt: 'experimental drum and bass, atmospheric soundscapes, rolling basslines, mechanical rhythms, underground energy, liquid elements, time-stretching, chopping breaks, bass modulation, reverb processing, evolving soundscapes, meditative atmosphere, spatial depth, organic textures, minimal percussion, granular synthesis, long reverbs, modulation, spatial effects',
    duration: 240, // 4 minutes
    productionStyle: 'experimental',
    arrangementMode: 'progressive'
  }), []);

  // Progress simulation for better UX
  const simulateProgress = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
    return interval;
  }, []);

  const generateDemo = useCallback(async () => {
    console.log('🎵 Starting Drum & Bass demo generation...');
    setIsGenerating(true);
    setError('');
    setGeneratedTrack(null);

    const progressInterval = simulateProgress();

    try {
      const params: GenerationParams = {
        tags: demoParams.prompt,
        duration: demoParams.duration,
        steps: 27,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000),
        scheduler_type: 'euler',
        cfg_type: 'constant',
        use_random_seed: true,
        genre: demoParams.genre,
        production_style: demoParams.productionStyle,
        structure: demoParams.arrangementMode
      };

      console.log('🚀 Calling ACE-Step API with params:', params);
      const result = await aceStepClient.generateMusic(params);

      clearInterval(progressInterval);
      setProgress(100);

      if (!result || !result.audio_url) {
        throw new Error('Invalid response from music generation service');
      }

      const track = {
        id: Date.now(),
        title: aceStepClient.isInDemoMode() ? 'Drum & Bass Demo (Synthetic)' : 'Drum & Bass Experimental Demo',
        duration: `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')}`,
        prompt: demoParams.prompt,
        genre: demoParams.genre,
        type: 'instrumental',
        productionStyle: demoParams.productionStyle,
        arrangementMode: demoParams.arrangementMode,
        audioUrl: result.audio_url,
        generationTime: result.generation_time,
        rtf: result.rtf,
        metadata: result.metadata,
        isDemoMode: aceStepClient.isInDemoMode()
      };

      setGeneratedTrack(track);
      console.log('✅ Demo track generated successfully!', track);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('❌ Demo generation failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Generation failed: ${errorMessage}`);
      
      // Don't show alert, use state instead
      console.log('🔧 Error details for debugging:', {
        error: errorMessage,
        apiKeyPresent: !!import.meta.env.VITE_ACE_STEP_API_KEY || !!import.meta.env.VITE_OPENAI_API_KEY,
        demoMode: aceStepClient.isInDemoMode()
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [demoParams, simulateProgress]);

  // Auto-generate on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!generatedTrack && !isGenerating && !error) {
        console.log('🎬 Auto-starting demo generation');
        generateDemo();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [generatedTrack, isGenerating, error, generateDemo]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          🎵 Drum & Bass Experimental Demo
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          Experience cutting-edge AI music generation with ACE-Step
        </p>

        {/* Demo Mode Notice */}
        {aceStepClient.isInDemoMode() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Demo Mode: Using synthetic audio. Add VITE_ACE_STEP_API_KEY to .env for real generation.
              </span>
            </div>
          </div>
        )}

        {/* Demo Parameters */}
        <div className="glass-card p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-4">Demo Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Genre:</span>
              <div className="font-medium">Drum & Bass</div>
            </div>
            <div>
              <span className="text-muted-foreground">Style:</span>
              <div className="font-medium">Experimental</div>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <div className="font-medium">4:00</div>
            </div>
            <div>
              <span className="text-muted-foreground">RTF:</span>
              <div className="font-medium">~27x</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-card p-6 rounded-xl border-red-200 bg-red-50">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Generation Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setError('');
              generateDemo();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Generation Status */}
      {isGenerating && !error && (
        <div className="glass-card p-8 rounded-xl text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Generating Your Demo Track</h3>
              <p className="text-muted-foreground">
                Creating experimental drum & bass with atmospheric soundscapes...
              </p>
              {aceStepClient.isInDemoMode() && (
                <p className="text-sm text-yellow-600 mt-1">
                  (Generating synthetic demo audio)
                </p>
              )}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground">
            {progress < 30 ? 'Initializing generation...' :
             progress < 60 ? 'Processing musical elements...' :
             progress < 90 ? 'Finalizing arrangement...' :
             'Almost ready...'}
          </p>
        </div>
      )}

      {/* Generated Track */}
      {generatedTrack && !error && (
        <div className="glass-card p-8 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">{generatedTrack.title}</h3>
              <p className="text-muted-foreground">
                {generatedTrack.genre.toUpperCase()} • {generatedTrack.productionStyle} • {generatedTrack.duration}
                {generatedTrack.isDemoMode && <span className="text-yellow-600"> • Demo Mode</span>}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Generated in {generatedTrack.generationTime?.toFixed(1) || 'N/A'}s</span>
              <span>•</span>
              <span>RTF: {generatedTrack.rtf?.toFixed(1) || 'N/A'}x</span>
            </div>
          </div>

          {/* Audio Player */}
          <AudioPlayer
            audioUrl={generatedTrack.audioUrl}
            title={generatedTrack.title}
            duration={generatedTrack.duration}
          />

          {/* Track Details */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Generation Details</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Prompt:</strong> {generatedTrack.prompt.substring(0, 200)}...
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Structure:</span>
                <div>{generatedTrack.metadata?.structure_analysis?.structure?.join(' → ') || 'Progressive'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Key Elements:</span>
                <div>{generatedTrack.metadata?.structure_analysis?.detected_elements?.slice(0, 3)?.join(', ') || 'Atmospheric, Bass-heavy'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Arrangement:</span>
                <div>{generatedTrack.arrangementMode}</div>
              </div>
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="mt-6 text-center">
            <button
              onClick={generateDemo}
              disabled={isGenerating}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${!isGenerating
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              {isGenerating ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating New Track...</span>
                </span>
              ) : (
                'Generate Another Demo'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl text-center">
          <Music className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">AI-Powered Generation</h3>
          <p className="text-sm text-muted-foreground">
            Advanced ACE-Step model creates professional-quality music in seconds
          </p>
        </div>
        <div className="glass-card p-6 rounded-xl text-center">
          <Volume2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Genre Expertise</h3>
          <p className="text-sm text-muted-foreground">
            Specialized training for drum & bass with authentic production techniques
          </p>
        </div>
        <div className="glass-card p-6 rounded-xl text-center">
          <Play className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Instant Playback</h3>
          <p className="text-sm text-muted-foreground">
            Stream generated tracks immediately with high-quality audio playback
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrumAndBassDemo;