import React, { useState } from 'react';
import { 
  Music, 
  Zap, 
  Volume2, 
  Waves, 
  Radio,
  Headphones,
  Mic2,
  Guitar,
  Piano,
  Drum,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface GenreInfo {
  name: string;
  description: string;
  icon: React.ElementType;
  bpm: string;
  elements: string[];
  structure: string[];
  color: string;
  examples: string[];
}

interface GenreSelectorProps {
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
  onTagsUpdate: (tags: string) => void;
  className?: string;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenre,
  onGenreSelect,
  onTagsUpdate,
  className = ''
}) => {
  const [showStructure, setShowStructure] = useState(false);
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  console.log('GenreSelector rendered:', { selectedGenre });

  const genres: { [key: string]: GenreInfo } = {
    edm: {
      name: 'EDM / Electronic Dance Music',
      description: 'High-energy electronic music designed for festivals and clubs',
      icon: Zap,
      bpm: '120-140 BPM',
      elements: ['Synth leads', 'Bass drops', 'Build-ups', 'Breakdowns', 'Risers'],
      structure: ['Intro (16)', 'Build (16)', 'Drop (32)', 'Breakdown (16)', 'Build (16)', 'Drop (32)', 'Outro (16)'],
      color: 'from-purple-500 to-pink-500',
      examples: ['festival anthem', 'big room house', 'progressive house', 'electro house']
    },
    house: {
      name: 'House Music',
      description: 'Four-on-the-floor rhythms with soulful grooves',
      icon: Radio,
      bpm: '120-130 BPM',
      elements: ['Four-on-floor kick', 'Hi-hats', 'Piano stabs', 'Vocal chops', 'Deep bass'],
      structure: ['Intro (32)', 'Verse (32)', 'Chorus (32)', 'Break (16)', 'Verse (32)', 'Chorus (32)', 'Outro (32)'],
      color: 'from-blue-500 to-cyan-500',
      examples: ['deep house', 'tech house', 'future house', 'tropical house']
    },
    trap: {
      name: 'Trap',
      description: 'Heavy 808s with rapid hi-hat patterns and hard-hitting drums',
      icon: Volume2,
      bpm: '130-170 BPM',
      elements: ['808 drums', 'Hi-hat rolls', 'Snare patterns', 'Melodic leads', 'Vocal chops'],
      structure: ['Intro (8)', 'Verse (16)', 'Hook (16)', 'Verse (16)', 'Hook (16)', 'Bridge (8)', 'Hook (16)', 'Outro (8)'],
      color: 'from-red-500 to-orange-500',
      examples: ['festival trap', 'hybrid trap', 'future bass', 'hardstyle trap']
    },
    dubstep: {
      name: 'Dubstep',
      description: 'Heavy wobble bass with syncopated drum patterns',
      icon: Waves,
      bpm: '140-150 BPM',
      elements: ['Wobble bass', 'Syncopated drums', 'Vocal samples', 'Risers', 'Impacts'],
      structure: ['Intro (16)', 'Build (16)', 'Drop (32)', 'Break (16)', 'Build (16)', 'Drop (32)', 'Outro (16)'],
      color: 'from-green-500 to-emerald-500',
      examples: ['riddim', 'melodic dubstep', 'heavy dubstep', 'experimental bass']
    },
    techno: {
      name: 'Techno',
      description: 'Driving rhythms with industrial sounds and hypnotic loops',
      icon: Headphones,
      bpm: '120-135 BPM',
      elements: ['Driving kick', 'Percussion loops', 'Acid sequences', 'Industrial sounds'],
      structure: ['Intro (64)', 'Development (64)', 'Peak (32)', 'Break (32)', 'Rebuild (32)', 'Climax (64)', 'Outro (32)'],
      color: 'from-gray-500 to-slate-600',
      examples: ['minimal techno', 'acid techno', 'industrial techno', 'peak time techno']
    },
    trance: {
      name: 'Trance',
      description: 'Uplifting melodies with emotional breakdowns and epic build-ups',
      icon: Music,
      bpm: '130-140 BPM',
      elements: ['Arpeggiated leads', 'Uplifting pads', 'Epic breakdowns', 'Gate effects'],
      structure: ['Intro (32)', 'Break (32)', 'Build (32)', 'Climax (64)', 'Break (32)', 'Build (32)', 'Climax (64)', 'Outro (32)'],
      color: 'from-indigo-500 to-purple-500',
      examples: ['uplifting trance', 'progressive trance', 'psy trance', 'vocal trance']
    },
    'hip-hop': {
      name: 'Hip-Hop',
      description: 'Rhythm-focused beats with strong emphasis on lyrics and flow',
      icon: Mic2,
      bpm: '70-140 BPM',
      elements: ['Drum breaks', 'Bass lines', 'Melodic samples', 'Vocal elements'],
      structure: ['Intro (8)', 'Verse (16)', 'Chorus (16)', 'Verse (16)', 'Chorus (16)', 'Bridge (8)', 'Chorus (16)', 'Outro (8)'],
      color: 'from-yellow-500 to-orange-500',
      examples: ['boom bap', 'trap rap', 'lo-fi hip hop', 'conscious rap']
    },
    dnb: {
      name: 'Drum & Bass',
      description: 'Fast breakbeats with heavy sub-bass and complex rhythms',
      icon: Drum,
      bpm: '170-180 BPM',
      elements: ['Breakbeats', 'Sub bass', 'Reese bass', 'Atmospheric pads'],
      structure: ['Intro (32)', 'Build (16)', 'Drop (64)', 'Break (32)', 'Build (16)', 'Drop (64)', 'Outro (16)'],
      color: 'from-teal-500 to-green-500',
      examples: ['liquid dnb', 'neurofunk', 'jungle', 'jump up']
    },
    rock: {
      name: 'Rock',
      description: 'Guitar-driven music with powerful drums and dynamic arrangements',
      icon: Guitar,
      bpm: '110-140 BPM',
      elements: ['Electric guitars', 'Bass guitar', 'Live drums', 'Powerful vocals'],
      structure: ['Intro (8)', 'Verse (16)', 'Chorus (16)', 'Verse (16)', 'Chorus (16)', 'Bridge (8)', 'Solo (16)', 'Chorus (16)', 'Outro (8)'],
      color: 'from-red-600 to-rose-500',
      examples: ['alternative rock', 'indie rock', 'hard rock', 'progressive rock']
    },
    ambient: {
      name: 'Ambient',
      description: 'Atmospheric soundscapes with evolving textures and minimal rhythm',
      icon: Piano,
      bpm: '60-90 BPM',
      elements: ['Atmospheric pads', 'Field recordings', 'Evolving textures', 'Subtle percussion'],
      structure: ['Emergence (120)', 'Development (120)', 'Climax (120)', 'Resolution (120)'],
      color: 'from-sky-400 to-blue-500',
      examples: ['dark ambient', 'space ambient', 'drone', 'new age']
    }
  };

  const handleGenreSelect = (genreKey: string) => {
    console.log('Genre selected:', genreKey);
    onGenreSelect(genreKey);
    
    // Auto-update tags based on genre selection
    const genre = genres[genreKey];
    if (genre) {
      const genreTags = `${genre.name.toLowerCase()}, ${genre.elements.slice(0, 3).join(', ').toLowerCase()}, professional production, ${genre.bpm.split('-')[0]}bpm`;
      onTagsUpdate(genreTags);
    }
  };

  const currentGenre = genres[selectedGenre] || genres.edm;
  const Icon = currentGenre.icon;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Genre Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(genres).map(([key, genre]) => {
          const GenreIcon = genre.icon;
          const isSelected = selectedGenre === key;
          const isHovered = hoveredGenre === key;
          
          return (
            <button
              key={key}
              onClick={() => handleGenreSelect(key)}
              onMouseEnter={() => setHoveredGenre(key)}
              onMouseLeave={() => setHoveredGenre(null)}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all duration-300 group
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50 hover:scale-102'
                }
              `}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${genre.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <GenreIcon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-sm mb-1">{genre.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{genre.bpm}</p>
              
              {/* Hover info */}
              {isHovered && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-black/90 backdrop-blur-sm border border-border rounded-lg z-10 text-xs">
                  <p className="text-white mb-2">{genre.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {genre.elements.slice(0, 3).map((element, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Genre Info */}
      <div className={`glass-card p-6 rounded-xl bg-gradient-to-r ${currentGenre.color}/10 border border-current/20`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentGenre.color} rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{currentGenre.name}</h3>
              <p className="text-sm text-muted-foreground">{currentGenre.bpm}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowStructure(!showStructure)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showStructure ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{currentGenre.description}</p>
        
        {/* Key Elements */}
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 flex items-center space-x-1">
            <Music className="w-4 h-4" />
            <span>Key Elements</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentGenre.elements.map((element, i) => (
              <span key={i} className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                {element}
              </span>
            ))}
          </div>
        </div>
        
        {/* Song Structure */}
        {showStructure && (
          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="font-medium text-sm flex items-center space-x-1">
              <Info className="w-4 h-4" />
              <span>Typical Song Structure</span>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {currentGenre.structure.map((section, i) => (
                <div key={i} className="p-2 bg-black/20 rounded text-center text-sm">
                  {section}
                </div>
              ))}
            </div>
            
            {/* Examples */}
            <div>
              <h4 className="font-medium text-sm mb-2">Sub-genres & Styles</h4>
              <div className="flex flex-wrap gap-2">
                {currentGenre.examples.map((example, i) => (
                  <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreSelector;