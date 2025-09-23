import React, { useState, useEffect } from 'react';
import { Play, Pause, Download, Music, Volume2 } from 'lucide-react';
import { sampleTracks, generateSampleTracks } from '../lib/sampleTracks';

interface SampleLibraryProps {
  onSelectSample?: (track: any) => void;
  className?: string;
}

const SampleLibrary: React.FC<SampleLibraryProps> = ({
  onSelectSample,
  className = ''
}) => {
  const [samples, setSamples] = useState(sampleTracks);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isGeneratingSamples, setIsGeneratingSamples] = useState(false);

  // Generate sample audio on component mount
  useEffect(() => {
    const generateSamples = async () => {
      setIsGeneratingSamples(true);
      try {
        const sampleUrls = await generateSampleTracks();
        setSamples(prevSamples =>
          prevSamples.map(sample => ({
            ...sample,
            audioUrl: sampleUrls[`demo-${sample.genre.toLowerCase()}`] || sample.audioUrl
          }))
        );
      } catch (error) {
        console.error('Failed to generate sample tracks:', error);
      } finally {
        setIsGeneratingSamples(false);
      }
    };

    generateSamples();
  }, []);

  const handlePlaySample = (trackId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingId === trackId) {
      setPlayingId(null);
    } else {
      setPlayingId(trackId);
    }
  };

  const handleSelectSample = (track: any) => {
    if (onSelectSample) {
      onSelectSample(track);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Music className="w-5 h-5" />
          <span>Sample Library</span>
        </h3>
        {isGeneratingSamples && (
          <div className="text-sm text-muted-foreground flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            <span>Generating samples...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {samples.map((track) => (
          <div
            key={track.id}
            className="glass-card p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleSelectSample(track)}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-sm">{track.title}</h4>
                <p className="text-xs text-muted-foreground">{track.genre} • {track.duration}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySample(track.id, track.audioUrl);
                }}
                disabled={!track.audioUrl}
                className={`p-2 rounded-full transition-colors ${
                  track.audioUrl
                    ? 'bg-primary/20 hover:bg-primary/30 text-primary'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {playingId === track.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-3">{track.description}</p>

            <div className="flex flex-wrap gap-1">
              {track.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hidden audio element for playback */}
            {track.audioUrl && (
              <audio
                src={track.audioUrl}
                onEnded={() => setPlayingId(null)}
                onPlay={() => setPlayingId(track.id)}
                onPause={() => setPlayingId(null)}
                className="hidden"
                controls
              />
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Click any sample to load it into the generator, or use the play button to preview.</p>
        <p className="mt-1">Samples are generated on-demand for the best quality experience.</p>
      </div>
    </div>
  );
};

export default SampleLibrary;