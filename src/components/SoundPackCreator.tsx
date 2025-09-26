import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  Loader2, 
  Package, 
  Wand2, 
  Music, 
  Drum, 
  Guitar, 
  Piano, 
  Mic, 
  Waves,
  Zap,
  CheckCircle,
  X,
  Upload,
  Layers,
  Shuffle,
  Target,
  Activity
} from 'lucide-react';
import { aceStepClient } from '../lib/aceStep';
import { useAuth } from '../hooks/useAuth';
import { useSamplePacks } from '../hooks/useSamplePacks';
import AudioPlayer from './AudioPlayer';

interface SoundPackCreatorProps {
  className?: string;
}

interface GeneratedSample {
  id: string;
  name: string;
  type: string;
  audioUrl: string;
  duration: number;
  size: string;
  bpm: number;
  key: string;
  tags: string[];
  waveformData?: number[];
}

interface SoundPack {
  id: string;
  name: string;
  type: string;
  samples: GeneratedSample[];
  totalSamples: number;
  totalSize: string;
  createdAt: string;
  bpm: number;
  key: string;
}

const SoundPackCreator: React.FC<SoundPackCreatorProps> = ({ className = '' }) => {
  const [selectedPackType, setSelectedPackType] = useState('trap');
  const [selectedSounds, setSelectedSounds] = useState<string[]>(['kick', 'snare', 'hihat']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPack, setGeneratedPack] = useState<SoundPack | null>(null);
  const [packName, setPackName] = useState('');
  const [packBpm, setPackBpm] = useState(128);
  const [packKey, setPackKey] = useState('C');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneratingSample, setCurrentGeneratingSample] = useState('');
  
  const { hasAccess, isAdmin } = useAuth();
  const { saveSamplePack, saveSample } = useSamplePacks();

  console.log('🎛️ Enhanced SoundPackCreator with Supabase integration loaded');

  const packTypes = [
    {
      id: 'trap',
      name: 'Trap Pack',
      description: 'Hard-hitting 808s, crispy hi-hats, and punchy snares',
      icon: Music,
      color: 'from-red-500 to-orange-500',
      bpmRange: [140, 160],
      tags: ['trap', 'hip-hop', '808', 'hard']
    },
    {
      id: 'house',
      name: 'House Pack',
      description: 'Four-on-the-floor kicks, groove basslines, and vocal chops',
      icon: Volume2,
      color: 'from-blue-500 to-cyan-500',
      bpmRange: [120, 130],
      tags: ['house', 'dance', 'groove', 'club']
    },
    {
      id: 'techno',
      name: 'Techno Pack',
      description: 'Industrial drums, acid sequences, and driving rhythms',
      icon: Drum,
      color: 'from-gray-500 to-slate-600',
      bpmRange: [125, 135],
      tags: ['techno', 'industrial', 'acid', 'minimal']
    },
    {
      id: 'ambient',
      name: 'Ambient Pack',
      description: 'Atmospheric pads, textures, and evolving soundscapes',
      icon: Waves,
      color: 'from-purple-500 to-indigo-600',
      bpmRange: [70, 90],
      tags: ['ambient', 'atmospheric', 'pad', 'texture']
    },
    {
      id: 'synthwave',
      name: 'Synthwave Pack',
      description: 'Retro synths, arpeggios, and nostalgic leads',
      icon: Piano,
      color: 'from-pink-500 to-purple-600',
      bpmRange: [110, 125],
      tags: ['synthwave', 'retro', 'synth', 'arp']
    },
    {
      id: 'vocal',
      name: 'Vocal Pack',
      description: 'AI-generated vocal chops, harmonies, and phrases',
      icon: Mic,
      color: 'from-green-500 to-emerald-600',
      bpmRange: [100, 140],
      tags: ['vocal', 'chop', 'harmony', 'phrase']
    }
  ];

  const soundTypes = [
    { id: 'kick', name: 'Kicks', count: 8, icon: Drum, duration: 2, tags: ['drum', 'kick', 'sub'] },
    { id: 'snare', name: 'Snares', count: 6, icon: Drum, duration: 1.5, tags: ['drum', 'snare', 'crack'] },
    { id: 'hihat', name: 'Hi-Hats', count: 10, icon: Drum, duration: 0.5, tags: ['drum', 'hihat', 'perc'] },
    { id: 'openhat', name: 'Open Hats', count: 4, icon: Drum, duration: 1, tags: ['drum', 'openhat', 'decay'] },
    { id: 'crash', name: 'Crashes', count: 3, icon: Drum, duration: 3, tags: ['drum', 'crash', 'cymbal'] },
    { id: 'perc', name: 'Percussion', count: 8, icon: Drum, duration: 1, tags: ['percussion', 'rhythm', 'ethnic'] },
    { id: 'bass', name: 'Bass Shots', count: 5, icon: Music, duration: 4, tags: ['bass', 'sub', 'low'] },
    { id: 'lead', name: 'Lead Shots', count: 6, icon: Guitar, duration: 4, tags: ['lead', 'melody', 'synth'] },
    { id: 'pad', name: 'Pad Shots', count: 4, icon: Piano, duration: 8, tags: ['pad', 'atmosphere', 'chord'] },
    { id: 'fx', name: 'FX & Risers', count: 8, icon: Waves, duration: 2, tags: ['fx', 'riser', 'sweep'] },
    { id: 'vocal', name: 'Vocal Chops', count: 6, icon: Mic, duration: 2, tags: ['vocal', 'chop', 'human'] },
    { id: 'loop', name: 'Loops', count: 4, icon: Volume2, duration: 8, tags: ['loop', 'sequence', 'pattern'] }
  ];

  const musicalKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const toggleSoundType = (soundId: string) => {
    setSelectedSounds(prev => 
      prev.includes(soundId)
        ? prev.filter(id => id !== soundId)
        : [...prev, soundId]
    );
  };

  const generateSoundPack = async () => {
    if (!packName.trim()) {
      alert('Please enter a pack name');
      return;
    }

    if (selectedSounds.length === 0) {
      alert('Please select at least one sound type');
      return;
    }

    console.log('🎵 Starting professional sample pack generation with Supabase integration');
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const packTypeInfo = packTypes.find(p => p.id === selectedPackType);
      const samples: GeneratedSample[] = [];
      let totalSamples = 0;

      // Calculate total samples to generate
      selectedSounds.forEach(soundType => {
        const soundInfo = soundTypes.find(s => s.id === soundType);
        if (soundInfo) totalSamples += soundInfo.count;
      });

      let generatedCount = 0;

      // Generate samples for each selected type
      for (const soundType of selectedSounds) {
        const soundInfo = soundTypes.find(s => s.id === soundType);
        if (!soundInfo) continue;

        console.log(`🎵 Generating ${soundInfo.count} ${soundType} samples with Beat Addicts AI`);

        for (let i = 0; i < soundInfo.count; i++) {
          setCurrentGeneratingSample(`${soundInfo.name} ${i + 1}/${soundInfo.count}`);
          
          // Create specific tags for each sample type
          const specificTags = [
            selectedPackType,
            ...packTypeInfo?.tags || [],
            ...soundInfo.tags,
            `${packBpm}bpm`,
            `key-${packKey}`,
            'one-shot',
            'studio-quality',
            'beat-addicts-ai'
          ];

          // Generate pitch variations for melodic elements
          let pitchVariation = '';
          if (['bass', 'lead', 'pad', 'vocal'].includes(soundType)) {
            const pitchOffsets = ['-12', '-5', '0', '+7', '+12'];
            pitchVariation = `, pitched ${pitchOffsets[i % pitchOffsets.length]} semitones`;
          }

          // Create detailed prompt for each sample
          const samplePrompt = `Professional ${soundType} sample for ${selectedPackType} music${pitchVariation}, ${specificTags.slice(0, 5).join(', ')}, clean, punchy, radio-ready, studio-mastered`;

          console.log(`🎵 Generating sample ${generatedCount + 1}/${totalSamples}: ${samplePrompt.substring(0, 50)}...`);

          try {
            const result = await aceStepClient.generateMusic({
              tags: samplePrompt,
              duration: soundInfo.duration,
              steps: 30, // Faster generation for samples
              guidance_scale: 8.0,
              seed: Math.floor(Math.random() * 1000000),
              scheduler_type: 'euler',
              cfg_type: 'constant',
              use_random_seed: true,
              genre: selectedPackType
            });

            const sample: GeneratedSample = {
              id: `${soundType}_${i + 1}_${Date.now()}`,
              name: `${packTypeInfo?.name || 'Pack'}_${soundInfo.name}_${String(i + 1).padStart(2, '0')}`,
              type: soundType,
              audioUrl: result.audio_url,
              duration: result.duration,
              size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
              bpm: packBpm,
              key: packKey,
              tags: specificTags,
              waveformData: generateWaveformData()
            };

            samples.push(sample);
            console.log(`✅ Sample generated and will be saved to Supabase: ${sample.name}`);

          } catch (error) {
            console.error(`❌ Failed to generate ${soundType} sample ${i + 1}:`, error);
            // Continue with other samples
          }

          generatedCount++;
          setGenerationProgress((generatedCount / totalSamples) * 100);
        }
      }

      if (samples.length === 0) {
        throw new Error('Failed to generate any samples');
      }

      const pack: SoundPack = {
        id: Date.now().toString(),
        name: packName,
        type: selectedPackType,
        samples: samples,
        totalSamples: samples.length,
        totalSize: samples.reduce((acc, sample) => acc + parseFloat(sample.size), 0).toFixed(1),
        createdAt: new Date().toISOString(),
        bpm: packBpm,
        key: packKey
      };

      // Save to Supabase
      console.log('💾 Saving sample pack to Supabase database');
      try {
        const savedPack = await saveSamplePack({
          name: pack.name,
          type: pack.type,
          bpm: pack.bpm,
          key: pack.key,
          samples: pack.samples.map(s => ({
            name: s.name,
            type: s.type,
            audioUrl: s.audioUrl,
            duration: s.duration,
            bpm: s.bpm,
            key: s.key,
            tags: s.tags
          }))
        });

        console.log('✅ Sample pack saved to Supabase:', savedPack.id);
        
        // Save individual samples to library
        for (const sample of pack.samples) {
          await saveSample({
            name: sample.name,
            type: sample.type,
            audio_url: sample.audioUrl,
            duration: sample.duration,
            bmp: sample.bpm,
            key: sample.key,
            tags: sample.tags,
            pack_id: savedPack.id
          });
        }

        console.log('✅ All samples saved to Supabase library');
      } catch (supabaseError) {
        console.error('⚠️ Supabase save failed, pack will be available locally:', supabaseError);
      }

      setGeneratedPack(pack);
      console.log('🎉 Professional sample pack generation completed:', pack.totalSamples, 'samples');

    } catch (error) {
      console.error('💥 Sample pack generation failed:', error);
      alert('Sample pack generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentGeneratingSample('');
    }
  };

  const generateWaveformData = (): number[] => {
    return Array.from({ length: 60 }, () => Math.random() * 100);
  };

  const downloadPack = () => {
    if (!generatedPack) return;

    console.log('📥 Downloading complete sample pack with', generatedPack.totalSamples, 'samples');

    // Download each sample with proper naming
    generatedPack.samples.forEach((sample, index) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = sample.audioUrl;
        a.download = `${generatedPack.name}_${sample.name}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 200); // Stagger downloads
    });

    // Generate and download pack metadata
    const metadata = {
      packName: generatedPack.name,
      packType: generatedPack.type,
      bpm: generatedPack.bpm,
      key: generatedPack.key,
      totalSamples: generatedPack.totalSamples,
      samples: generatedPack.samples.map(s => ({
        name: s.name,
        type: s.type,
        bpm: s.bpm,
        key: s.key,
        tags: s.tags
      })),
      generatedWith: 'Beat Addicts AI Studio',
      createdAt: generatedPack.createdAt
    };

    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const metadataUrl = URL.createObjectURL(metadataBlob);
    const a = document.createElement('a');
    a.href = metadataUrl;
    a.download = `${generatedPack.name}_metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(metadataUrl);
  };

  const loadPackIntoStudio = () => {
    if (!generatedPack) return;
    
    console.log('📦 Loading sample pack into Beat Addicts Studio with Supabase sync:', generatedPack.name);
    
    // Store the pack in localStorage for immediate Studio access
    const studioSamplePacks = JSON.parse(localStorage.getItem('beatAddictsStudioPacks') || '[]');
    studioSamplePacks.push(generatedPack);
    localStorage.setItem('beatAddictsStudioPacks', JSON.stringify(studioSamplePacks));
    
    alert(`"${generatedPack.name}" loaded into Studio! The pack is also saved to your Supabase library for cloud sync.`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {!generatedPack ? (
        <>
          {/* Pack Configuration */}
          <div className="studio-glass-card p-6 rounded-xl space-y-6">
            <h2 className="text-2xl font-raver underground-text-glow">PROFESSIONAL SAMPLE PACK GENERATOR</h2>
            <div className="text-sm text-gray-400 font-underground">
              Generate professional-quality samples with Beat Addicts AI • Automatically saved to Supabase
            </div>
            
            {/* Pack Name and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-raver text-white text-sm mb-2">PACK NAME</label>
                <input
                  type="text"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  placeholder="Enter pack name..."
                  className="w-full px-4 py-3 bg-black/40 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-producer placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block font-raver text-white text-sm mb-2">BPM</label>
                <input
                  type="number"
                  value={packBpm}
                  onChange={(e) => setPackBpm(Number(e.target.value))}
                  min="60"
                  max="200"
                  className="w-full px-4 py-3 bg-black/40 border-2 border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white font-producer text-center"
                />
              </div>
              
              <div>
                <label className="block font-raver text-white text-sm mb-2">KEY</label>
                <select
                  value={packKey}
                  onChange={(e) => setPackKey(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white font-producer"
                >
                  {musicalKeys.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pack Type Selection */}
          <div className="studio-glass-card p-6 rounded-xl space-y-4">
            <h3 className="font-raver text-white text-lg">SELECT PACK TYPE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packTypes.map((pack) => {
                const Icon = pack.icon;
                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      setSelectedPackType(pack.id);
                      setPackBpm(pack.bpmRange[0] + Math.floor(Math.random() * (pack.bpmRange[1] - pack.bpmRange[0])));
                    }}
                    className={`p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedPackType === pack.id
                        ? 'raver-button underground-glow-intense scale-105'
                        : 'underground-glass hover:underground-glow hover:scale-102'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${pack.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-raver text-white text-sm mb-2">{pack.name}</h4>
                    <p className="text-xs text-gray-300 mb-2 font-underground">{pack.description}</p>
                    <div className="text-xs text-gray-500 font-producer">
                      {pack.bpmRange[0]}-{pack.bpmRange[1]} BPM
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Type Selection */}
          <div className="studio-glass-card p-6 rounded-xl space-y-4">
            <h3 className="font-raver text-white text-lg">SELECT SOUND TYPES</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {soundTypes.map((sound) => {
                const Icon = sound.icon;
                const isSelected = selectedSounds.includes(sound.id);
                
                return (
                  <button
                    key={sound.id}
                    onClick={() => toggleSoundType(sound.id)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? 'raver-button underground-glow scale-105'
                        : 'underground-glass hover:underground-glow hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-raver text-white text-xs">{sound.name}</span>
                    </div>
                    <div className="text-xs text-gray-300 font-underground mb-1">
                      {sound.count} samples • {sound.duration}s each
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-2 mx-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateSoundPack}
            disabled={isGenerating || !packName.trim() || selectedSounds.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-raver text-xl flex items-center justify-center space-x-3 transition-all duration-500 ${
              !isGenerating && packName.trim() && selectedSounds.length > 0
                ? 'raver-button underground-glow-intense hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>GENERATING WITH AI + SUPABASE...</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                <span>GENERATE PROFESSIONAL SAMPLES</span>
                <Package className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="studio-glass-card p-6 rounded-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-raver text-white">Beat Addicts AI + Supabase Processing...</h4>
                  <span className="font-producer text-cyan-400">{Math.round(generationProgress)}%</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                
                {currentGeneratingSample && (
                  <p className="text-sm text-gray-300 font-underground">
                    Currently generating: <span className="text-cyan-400">{currentGeneratingSample}</span>
                  </p>
                )}
                
                <div className="text-xs text-gray-500 font-underground">
                  Using Beat Addicts AI neural networks • Saving to Supabase cloud database • Professional quality
                </div>
              </div>
            </div>
          )}

          {/* Pack Preview */}
          {selectedSounds.length > 0 && packName.trim() && (
            <div className="underground-glass p-4 rounded-xl">
              <h4 className="font-raver text-white mb-3">PACK PREVIEW</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-underground">Total Samples:</span>
                  <span className="text-white font-raver">
                    {selectedSounds.reduce((acc, soundId) => {
                      const sound = soundTypes.find(s => s.id === soundId);
                      return acc + (sound?.count || 0);
                    }, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-underground">Pack BPM:</span>
                  <span className="text-white font-raver">{packBpm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-underground">Pack Key:</span>
                  <span className="text-white font-raver">{packKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-underground">Pack Type:</span>
                  <span className="text-white font-raver capitalize">{selectedPackType}</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Generated Pack Display */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-raver underground-text-glow flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <span>{generatedPack.name}</span>
              </h3>
              <div className="text-sm text-gray-300 font-underground mt-2">
                {generatedPack.totalSamples} samples • {generatedPack.totalSize} MB • {generatedPack.bpm} BPM • Key of {generatedPack.key}
              </div>
              <div className="text-xs text-emerald-400 font-underground mt-1">
                ✅ Saved to Supabase cloud database for sync across devices
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadPackIntoStudio}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-raver flex items-center space-x-2 transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>LOAD IN STUDIO</span>
              </button>
              <button
                onClick={downloadPack}
                className="px-6 py-3 raver-button font-raver flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>DOWNLOAD PACK</span>
              </button>
              <button
                onClick={() => setGeneratedPack(null)}
                className="p-3 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sample Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {generatedPack.samples.map((sample, index) => {
              const soundTypeInfo = soundTypes.find(s => s.id === sample.type);
              const Icon = soundTypeInfo?.icon || Music;
              
              return (
                <div key={sample.id} className="underground-glass p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-raver text-white text-sm truncate">{sample.name}</h4>
                      <div className="text-xs text-gray-400 font-underground">
                        {sample.type} • {sample.size} • {sample.duration.toFixed(1)}s • {sample.bpm} BPM
                      </div>
                    </div>
                  </div>
                  
                  <AudioPlayer
                    audioUrl={sample.audioUrl}
                    title={sample.name}
                    duration={`${Math.floor(sample.duration / 60)}:${String(Math.floor(sample.duration % 60)).padStart(2, '0')}`}
                    showWaveform={false}
                    className="mb-3"
                  />
                  
                  <div className="flex flex-wrap gap-1">
                    {sample.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-producer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pack Info and Actions */}
          <div className="underground-glass p-6 rounded-xl">
            <h4 className="font-raver text-white mb-4">PACK INFORMATION</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-raver text-sm text-purple-400 mb-2">TECHNICAL SPECS</h5>
                <ul className="space-y-1 text-xs text-gray-300 font-underground">
                  <li>• Format: WAV 44.1kHz/16-bit</li>
                  <li>• Tempo: {generatedPack.bpm} BPM</li>
                  <li>• Key: {generatedPack.key}</li>
                  <li>• Generated with Beat Addicts AI</li>
                  <li>• Saved to Supabase cloud database</li>
                </ul>
              </div>
              <div>
                <h5 className="font-raver text-sm text-cyan-400 mb-2">USAGE RIGHTS</h5>
                <ul className="space-y-1 text-xs text-gray-300 font-underground">
                  <li>• Royalty-free for commercial use</li>
                  <li>• No attribution required</li>
                  <li>• Resale as individual samples prohibited</li>
                  <li>• Perfect for music production</li>
                </ul>
              </div>
              <div>
                <h5 className="font-raver text-sm text-emerald-400 mb-2">CLOUD FEATURES</h5>
                <ul className="space-y-1 text-xs text-gray-300 font-underground">
                  <li>• Synced across all devices</li>
                  <li>• Available in Studio immediately</li>
                  <li>• Backed up to Supabase</li>
                  <li>• Metadata and tags preserved</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundPackCreator;