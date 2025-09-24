import { Award, Headphones, Mic, Music, Radio, Zap } from 'lucide-react';
import { useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { aceStepClient } from '../lib/aceStep';
import { openaiClient } from '../lib/openai';

const RadioReadyGenerator = () => {
  const [selectedGenre, setSelectedGenre] = useState<'pop' | 'hip-hop' | 'rock' | 'country'>('pop');
  const [songTheme, setSongTheme] = useState('');
  const [includeVocals, setIncludeVocals] = useState(true);
  const [lyrics, setLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  type GeneratedSong = {
    id: number | string;
    title: string;
    duration: string;
    theme: string;
    genre: string;
    type: string;
    productionStyle: string;
    audioUrl: string;
    generationTime?: number;
    rtf?: number;
    lyrics?: string;
    metadata?: Record<string, unknown>;
  } | null;

  const [generatedSong, setGeneratedSong] = useState<GeneratedSong>(null);

  const radioGenres = [
    {
      id: 'pop' as const,
      name: 'Pop Radio',
      icon: Music,
      description: 'Catchy anthems for mainstream radio',
      targetLength: '3:30',
      characteristics: ['Memorable hooks', 'Commercial production', 'Broad appeal']
    },
    {
      id: 'hip-hop' as const,
      name: 'Hip-Hop/R&B',
      icon: Mic,
      description: 'Urban contemporary hits',
      targetLength: '3:15',
      characteristics: ['Strong vocals', 'Radio-clean lyrics', 'Catchy chorus']
    },
    {
      id: 'rock' as const,
      name: 'Modern Rock',
      icon: Headphones,
      description: 'Rock radio singles',
      targetLength: '4:00',
      characteristics: ['Powerful guitars', 'Strong drums', 'Memorable riffs']
    },
    {
      id: 'country' as const,
      name: 'Country Radio',
      icon: Award,
      description: 'Country music standards',
      targetLength: '3:30',
      characteristics: ['Storytelling lyrics', 'Acoustic elements', 'Emotional delivery']
    }
  ];

  const generateLyrics = async () => {
    if (!songTheme.trim()) return;

    setIsGeneratingLyrics(true);
    try {
      const genrePrompts = {
        pop: 'upbeat, catchy, radio-friendly pop lyrics',
        'hip-hop': 'urban contemporary, radio-clean hip-hop lyrics',
        rock: 'anthemic, powerful rock lyrics',
        country: 'storytelling, emotional country lyrics'
      };

      const generatedLyrics = await openaiClient.generateLyrics(
        songTheme,
        selectedGenre,
        'radio-ready',
        { temperature: 0.8, max_tokens: 800 }
      );
      setLyrics(generatedLyrics);
    } catch (error) {
      console.error('Lyrics generation failed:', error);
      alert('Lyrics generation failed. Please try again.');
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  const generateRadioSong = async () => {
    if (!songTheme.trim()) return;

    setIsGenerating(true);
    try {
      let result;

      switch (selectedGenre) {
        case 'pop':
          result = await aceStepClient.generatePopRadioAnthem(songTheme, includeVocals, lyrics);
          break;
        case 'hip-hop':
          result = await aceStepClient.generateHipHopRadioSingle(songTheme, includeVocals, lyrics);
          break;
        case 'rock':
          result = await aceStepClient.generateRockRadioSingle(songTheme, includeVocals, lyrics);
          break;
        case 'country':
          result = await aceStepClient.generateCountryRadioSong(songTheme, includeVocals, lyrics);
          break;
        default:
          result = await aceStepClient.generatePopRadioAnthem(songTheme, includeVocals, lyrics);
      }

      setGeneratedSong({
        id: Date.now(),
        title: `${selectedGenre.toUpperCase()} Radio Single - "${songTheme}"`,
        duration: `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')}`,
        theme: songTheme,
        genre: selectedGenre,
        type: includeVocals ? 'with-vocals' : 'instrumental',
        productionStyle: 'radio-ready',
        audioUrl: result.audio_url,
        generationTime: result.generation_time,
        rtf: result.rtf,
        lyrics: lyrics,
        metadata: result.metadata
      });

      console.log('✅ Radio-ready song generated successfully!');

    } catch (error) {
      console.error('❌ Radio song generation failed:', error);
      alert('Song generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedGenreData = radioGenres.find(g => g.id === selectedGenre);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Radio className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-gradient">Radio-Ready Song Generator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Create professional radio-quality songs with ACE-Step AI
        </p>
        <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-muted-foreground">
          <span>🎵 Commercial Production</span>
          <span>•</span>
          <span>📻 Broadcast Standards</span>
          <span>•</span>
          <span>🎙️ Radio-Ready Vocals</span>
          <span>•</span>
          <span>⭐ Professional Quality</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Selection */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Radio className="w-5 h-5" />
              <span>Radio Format</span>
            </h3>

            <div className="space-y-3">
              {radioGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedGenre === genre.id
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <genre.icon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{genre.name}</div>
                      <div className="text-xs text-muted-foreground">{genre.targetLength}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{genre.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {genre.characteristics.map((char, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        {char}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Song Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-xl space-y-6">
            {/* Song Theme */}
            <div>
              <label className="block text-sm font-medium mb-2">Song Theme</label>
              <input
                type="text"
                value={songTheme}
                onChange={(e) => setSongTheme(e.target.value)}
                placeholder={`e.g., "Love in the digital age", "Chasing dreams", "Heartbreak recovery"`}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Describe the emotional core and story of your radio-ready song
              </p>
            </div>

            {/* Vocals Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeVocals"
                checked={includeVocals}
                onChange={(e) => setIncludeVocals(e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="includeVocals" className="text-sm font-medium">
                Include Radio-Ready Vocals
              </label>
            </div>

            {/* Lyrics Section */}
            {includeVocals && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Lyrics (Optional)</label>
                  <button
                    onClick={generateLyrics}
                    disabled={!songTheme.trim() || isGeneratingLyrics}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                      songTheme.trim() && !isGeneratingLyrics
                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {isGeneratingLyrics ? (
                      <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                    <span>AI Generate</span>
                  </button>
                </div>
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Write your own lyrics or use AI generation above..."
                  className="w-full h-32 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateRadioSong}
              disabled={!songTheme.trim() || isGenerating}
              className={`w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                songTheme.trim() && !isGenerating
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg premium-glow'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                  <span>Generating Radio-Ready {selectedGenreData?.name}...</span>
                </>
              ) : (
                <>
                  <Radio className="w-5 h-5" />
                  <span>Generate Radio-Ready Song</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Song */}
          {generatedSong && (
            <div className="glass-card p-8 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{generatedSong.title}</h3>
                  <p className="text-muted-foreground">
                    {generatedSong.genre.toUpperCase()} • Radio-Ready • {generatedSong.duration}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Generated in {generatedSong.generationTime}s</span>
                  <span>•</span>
                  <span>RTF: {generatedSong.rtf}x</span>
                </div>
              </div>

              {/* Audio Player */}
              <AudioPlayer
                audioUrl={generatedSong.audioUrl}
                title={generatedSong.title}
                duration={generatedSong.duration}
              />

              {/* Song Details */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Radio-Ready Specifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Format:</span>
                    <div className="font-medium">{selectedGenreData?.name}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target Length:</span>
                    <div className="font-medium">{selectedGenreData?.targetLength}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vocals:</span>
                    <div className="font-medium">{includeVocals ? 'Included' : 'Instrumental'}</div>
                  </div>
                </div>
                {generatedSong.lyrics && (
                  <div className="mt-4">
                    <span className="text-muted-foreground text-sm">Lyrics:</span>
                    <div className="mt-1 p-3 bg-background rounded text-sm font-mono whitespace-pre-wrap">
                      {generatedSong.lyrics}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadioReadyGenerator;
