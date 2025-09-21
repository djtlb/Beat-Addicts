import React, { useState } from 'react';
import { 
  Wand2, 
  Upload, 
  Play, 
  Download, 
  Settings, 
  Crown,
  Loader2,
  Music,
  Volume2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PremiumGate from '../components/PremiumGate';

const Generate = () => {
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState('full-track');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { hasAccess } = useAuth();

  console.log('Generate component rendered');

  const generationTypes = [
    { id: 'full-track', label: 'Full Track', description: 'Complete song with all elements' },
    { id: 'instrumental', label: 'Instrumental', description: 'Music without vocals' },
    { id: 'lyrics-only', label: 'Lyrics Only', description: 'Just the vocal content', premium: 'pro' },
    { id: 'stems', label: 'Stems', description: 'Separated audio elements', premium: 'pro' },
    { id: 'vocals-only', label: 'Vocals Only', description: 'Only vocal parts', premium: 'studio' }
  ];

  const genres = [
    'Hip Hop', 'Pop', 'Rock', 'Electronic', 'R&B', 'Jazz', 'Classical', 'Country', 'Reggae', 'Blues'
  ];

  const moods = [
    'Energetic', 'Chill', 'Dark', 'Happy', 'Emotional', 'Aggressive', 'Romantic', 'Mysterious'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    console.log('Starting generation with prompt:', prompt);
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedTrack({
        id: Date.now(),
        title: 'AI Generated Track',
        duration: '3:24',
        prompt: prompt,
        type: generationType
      });
      setIsGenerating(false);
      console.log('Generation completed');
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log('File uploaded:', file.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">AI Music Generation</h1>
        <p className="text-muted-foreground text-lg">
          Transform your ideas into professional music with advanced AI
        </p>
      </div>

      {/* Main Generation Panel */}
      <div className="glass-card p-8 rounded-xl">
        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label htmlFor="track-description" className="block text-sm font-medium mb-2">
              Describe your track
            </label>
            <textarea
              id="track-description"
              name="trackDescription"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Upbeat hip-hop track with piano melody, deep bass, and energetic drums. Modern trap style with melodic hooks.'"
              className="w-full h-24 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
                  type="button"
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

          {/* Reference Upload (Premium) */}
          <PremiumGate requiredTier="pro">
            <div className="border border-dashed border-border rounded-lg p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium flex items-center justify-center space-x-2">
                    <span>Upload Reference Audio</span>
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AI will analyze and create similar music
                  </p>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="reference-upload"
                  name="referenceUpload"
                />
                <label
                  htmlFor="reference-upload"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg cursor-pointer transition-colors"
                >
                  Choose File
                </label>
                {uploadedFile && (
                  <p className="text-sm text-green-400">✓ {uploadedFile.name}</p>
                )}
              </div>
            </div>
          </PremiumGate>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="genre-select" className="block text-sm font-medium mb-2">Genre</label>
              <select 
                id="genre-select"
                name="genre"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre.toLowerCase()}>{genre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="mood-select" className="block text-sm font-medium mb-2">Mood</label>
              <select 
                id="mood-select"
                name="mood"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Mood</option>
                {moods.map((mood) => (
                  <option key={mood} value={mood.toLowerCase()}>{mood}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`
              w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all
              ${prompt.trim() && !isGenerating
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating your track...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Music</span>
              </>
            )}
          </button>
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
              <h3 className="font-medium mb-2">AI is creating your track...</h3>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing prompt • Generating melody • Adding instruments • Mixing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Result */}
      {generatedTrack && (
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generated Track</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{generatedTrack.title}</h4>
              <p className="text-sm text-muted-foreground">
                {generatedTrack.duration} • {generationTypes.find(t => t.id === generatedTrack.type)?.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                "{generatedTrack.prompt}"
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

          {/* Audio Waveform Placeholder */}
          <div className="mt-4 p-4 bg-black/10 rounded-lg">
            <div className="flex items-center justify-center space-x-1 h-16">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-electric-500 rounded-full"
                  style={{
                    height: `${Math.random() * 60 + 10}px`,
                    opacity: Math.random() * 0.8 + 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generate;