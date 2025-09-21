import React, { useState } from 'react';
import { 
  Mic, 
  Play, 
  Download, 
  Copy, 
  Wand2, 
  Volume2,
  Loader2,
  Music,
  Crown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PremiumGate from '../components/PremiumGate';
import AudioPlayer from '../components/AudioPlayer';

const LyricsFlow = () => {
  const [lyrics, setLyrics] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('fast-rap');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlow, setGeneratedFlow] = useState(null);
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const { hasAccess } = useAuth();

  console.log('LyricsFlow component rendered');

  const flowStyles = [
    {
      id: 'fast-rap',
      name: 'Fast Rap',
      description: 'Fast-paced, complex rhyme schemes',
      image: '🎤',
      premium: false
    },
    {
      id: 'melodic-rap',
      name: 'Melodic Rap',
      description: 'Melodic, emotional delivery',
      image: '🎵',
      premium: false
    },
    {
      id: 'smooth-flow',
      name: 'Smooth Flow',
      description: 'Smooth, conversational flow',
      image: '🎭',
      premium: 'studio'
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      description: 'Dynamic, narrative style',
      image: '👑',
      premium: 'studio'
    },
    {
      id: 'custom',
      name: 'Custom Style',
      description: 'Define your own flow style',
      image: '✨',
      premium: 'studio'
    }
  ];

  const handleGenerate = async () => {
    if (!lyrics.trim()) return;
    
    console.log('Generating flow for lyrics:', lyrics.substring(0, 50) + '...');
    setIsGenerating(true);
    
    // Create a realistic audio blob for demonstration
    try {
      // Generate a simple audio tone for demo purposes
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = 30; // 30 seconds
      const arrayBuffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const channelData = arrayBuffer.getChannelData(0);
      
      // Generate a simple melody with rhythm pattern
      for (let i = 0; i < channelData.length; i++) {
        const t = i / sampleRate;
        const beat = Math.floor(t * 2) % 4; // 4/4 time at 120 BPM
        const melody = Math.sin(2 * Math.PI * (220 + beat * 55) * t) * 0.1; // Varying pitch
        const rhythm = beat % 2 === 0 ? 0.3 : 0.1; // Emphasis on beats 1 and 3
        channelData[i] = melody * rhythm * Math.exp(-t * 0.1); // Decay over time
      }
      
      // Convert to WAV blob
      const wavBlob = audioBufferToWav(arrayBuffer);
      const audioUrl = URL.createObjectURL(wavBlob);
      
      setTimeout(() => {
        setGeneratedFlow({
          id: Date.now(),
          originalLyrics: lyrics,
          style: selectedStyle,
          audioFile: 'generated_flow.wav',
          audioUrl: audioUrl,
          duration: '0:30',
          timestamp: new Date().toISOString()
        });
        setIsGenerating(false);
        console.log('Flow generation completed');
      }, 3500);
    } catch (error) {
      console.error('Audio generation error:', error);
      // Fallback to demo without actual audio
      setTimeout(() => {
        setGeneratedFlow({
          id: Date.now(),
          originalLyrics: lyrics,
          style: selectedStyle,
          audioFile: 'generated_flow.wav',
          audioUrl: '', // No audio URL for fallback
          duration: '0:30',
          timestamp: new Date().toISOString()
        });
        setIsGenerating(false);
      }, 3500);
    }
  };

  // Helper function to convert AudioBuffer to WAV blob
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channelData = buffer.getChannelData(0);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const sampleLyrics = `Started from the bottom now we here
Started from the bottom now my whole team here
Started from the bottom now we here
Started from the bottom now the whole team here`;

  const loadSample = () => {
    setLyrics(sampleLyrics);
    console.log('Sample lyrics loaded');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">Rap Lyrics-to-Flow Engine</h1>
        <p className="text-muted-foreground text-lg">
          Transform your raw lyrics into professional rap vocals with AI
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-card p-8 rounded-xl space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Your Lyrics</label>
            <button
              onClick={loadSample}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Paste your rap lyrics here... Each line will be analyzed for rhythm and flow patterns."
            className="w-full h-40 px-4 py-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{lyrics.length} characters</span>
            <span>{lyrics.split('\n').filter(line => line.trim()).length} lines</span>
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Flow Style</label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {flowStyles.map((style) => (
              <div key={style.id}>
                {style.premium && !hasAccess(style.premium) ? (
                  <PremiumGate 
                    requiredTier={style.premium} 
                    showUpgrade={false}
                    fallback={
                      <div className="relative p-4 rounded-lg border border-border text-center opacity-60 cursor-not-allowed">
                        <Crown className="absolute top-2 right-2 w-4 h-4 text-yellow-400" />
                        <div className="text-2xl mb-2">{style.image}</div>
                        <div className="font-medium text-sm">{style.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{style.description}</div>
                      </div>
                    }
                  >
                    {null}
                  </PremiumGate>
                ) : (
                  <button
                    onClick={() => setSelectedStyle(style.id)}
                    className={`
                      relative p-4 rounded-lg border text-center transition-all cursor-pointer
                      ${selectedStyle === style.id 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{style.image}</div>
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{style.description}</div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Style Input */}
        {selectedStyle === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2">Describe Your Style</label>
            <input
              type="text"
              value={customStylePrompt}
              onChange={(e) => setCustomStylePrompt(e.target.value)}
              placeholder="e.g., 'Aggressive, fast tempo, heavy autotune, trap-style delivery'"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!lyrics.trim() || isGenerating || (selectedStyle === 'custom' && !customStylePrompt.trim())}
          className={`
            w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all
            ${lyrics.trim() && !isGenerating && (selectedStyle !== 'custom' || customStylePrompt.trim())
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Converting to flow...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Rap Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Processing Status */}
      {isGenerating && (
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">AI is creating your rap flow...</h3>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing lyrics • Matching rhythm • Generating vocals • Applying style
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Result */}
      {generatedFlow && (
        <div className="glass-card p-6 rounded-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Mic className="w-6 h-6 text-primary" />
              <span>Generated Flow</span>
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{flowStyles.find(s => s.id === generatedFlow.style)?.name} Style</span>
              <span>•</span>
              <span>{generatedFlow.duration}</span>
            </div>
          </div>

          {/* Audio Player */}
          <AudioPlayer
            audioUrl={generatedFlow.audioUrl}
            title="Rap Flow Audio"
            duration={generatedFlow.duration}
            showWaveform={true}
          />

          {/* Original Lyrics Reference */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Original Lyrics</h4>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedFlow.originalLyrics)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground font-mono whitespace-pre-line max-h-32 overflow-y-auto">
              {generatedFlow.originalLyrics}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                if (generatedFlow.audioUrl) {
                  const a = document.createElement('a');
                  a.href = generatedFlow.audioUrl;
                  a.download = generatedFlow.audioFile;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              }}
              disabled={!generatedFlow.audioUrl}
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Download Audio</span>
            </button>
            <button className="px-4 py-2 border border-border hover:bg-white/5 rounded-lg transition-colors">
              Save to Library
            </button>
            <button className="px-4 py-2 border border-border hover:bg-white/5 rounded-lg transition-colors">
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LyricsFlow;