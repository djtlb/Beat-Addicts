import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Download, Loader2, Music, Volume2 } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import { aceStepClient, type GenerationParams } from '../lib/aceStep';

const DrumAndBassDemo = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Drum & Bass Experimental parameters
  const demoParams = useMemo(() => ({
    genre: 'dnb',
    prompt: 'experimental drum and bass, atmospheric soundscapes, rolling basslines, mechanical rhythms, underground energy, liquid elements, time-stretching, chopping breaks, bass modulation, reverb processing, evolving soundscapes, meditative atmosphere, spatial depth, organic textures, minimal percussion, granular synthesis, long reverbs, modulation, spatial effects',
    duration: 240, // 4 minutes
    productionStyle: 'experimental',
    arrangementMode: 'progressive'
  }), []);

  const generateDemo = useCallback(async () => {
    setIsGenerating(true);

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

      console.log('🎵 Generating Drum & Bass Experimental track...');
      const result = await aceStepClient.generateMusic(params);

      setGeneratedTrack({
        id: Date.now(),
        title: 'Drum & Bass Experimental Demo',
        duration: `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')}`,
        prompt: demoParams.prompt,
        genre: demoParams.genre,
        type: 'instrumental',
        productionStyle: demoParams.productionStyle,
        arrangementMode: demoParams.arrangementMode,
        audioUrl: result.audio_url,
        generationTime: result.generation_time,
        rtf: result.rtf,
        metadata: result.metadata
      });

      console.log('✅ Demo track generated successfully!');

    } catch (error) {
      console.error('❌ Demo generation failed:', error);
      alert('Demo generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [demoParams]);

  // Auto-generate on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!generatedTrack && !isGenerating) {
        generateDemo();
      }
    }, 1000); // Small delay to ensure component is ready

    return () => clearTimeout(timer);
  }, [generatedTrack, isGenerating, generateDemo]); // Include all dependencies

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
              <div className="font-medium">27.27x</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Status */}
      {!generatedTrack && (
        <div className="glass-card p-8 rounded-xl text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Generating Your Demo Track</h3>
              <p className="text-muted-foreground">
                Creating experimental drum & bass with atmospheric soundscapes...
              </p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Generated Track */}
      {generatedTrack && (
        <div className="glass-card p-8 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">{generatedTrack.title}</h3>
              <p className="text-muted-foreground">
                {generatedTrack.genre.toUpperCase()} • {generatedTrack.productionStyle} • {generatedTrack.duration}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Generated in {generatedTrack.generationTime}s</span>
              <span>•</span>
              <span>RTF: {generatedTrack.rtf}x</span>
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
              <strong>Prompt:</strong> {generatedTrack.prompt}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Structure:</span>
                <div>{generatedTrack.metadata?.structure_analysis?.structure?.join(' → ') || 'Progressive'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Key Elements:</span>
                <div>{generatedTrack.metadata?.structure_analysis?.detected_elements?.join(', ') || 'Atmospheric, Bass-heavy'}</div>
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
            Stream generated tracks immediately with high-quality audio
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrumAndBassDemo;