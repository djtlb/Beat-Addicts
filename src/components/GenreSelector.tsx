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
  Info,
  Sparkles,
  Flame,
  Atom,
  Satellite,
  Lightbulb,
  Cpu,
  Dna,
  Rocket,
  Globe,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface GenreInfo {
  name: string;
  description: string;
  icon: React.ElementType;
  bpm: string;
  elements: string[];
  structure: string[];
  color: string;
  examples: string[];
  category: 'experimental' | 'mainstream' | 'underground';
  adminOnly?: boolean;
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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'experimental' | 'mainstream' | 'underground'>('all');
  const { isAdmin } = useAuth();

  console.log('GenreSelector rendered:', { selectedGenre, isAdmin: isAdmin() });

  const genres: { [key: string]: GenreInfo } = {
    // EXPERIMENTAL EDM GENRES (ADMIN ONLY)
    'levity-push': {
      name: 'Levity Push',
      description: 'Ethereal, pushing electronic music inspired by Levity - Push It',
      icon: Lightbulb,
      bmp: '140-150 BPM',
      elements: ['ethereal leads', 'pushing bass', 'cosmic atmospheres', 'levitating synths', 'space percussion'],
      structure: ['ambient', 'push-build', 'levity-drop', 'space-break', 'final-push', 'outro'],
      color: 'from-yellow-400 via-orange-500 to-red-600',
      examples: ['ethereal push', 'cosmic levitation', 'space bass', 'astral beats'],
      category: 'experimental',
      adminOnly: true
    },
    'wubcraft': {
      name: 'Wubcraft',
      description: 'Precision-engineered dubstep variations inspired by AHEE - Wubcraft',
      icon: Cpu,
      bpm: '140-150 BPM',
      elements: ['crafted wobbles', 'precise wubs', 'engineered bass', 'technical percussion', 'surgical cuts'],
      structure: ['craft-intro', 'wub-build', 'craft-drop', 'wub-break', 'final-craft', 'outro'],
      color: 'from-green-400 via-emerald-500 to-teal-600',
      examples: ['precision dubstep', 'crafted bass', 'technical wubs', 'engineered drops'],
      category: 'experimental',
      adminOnly: true
    },
    'neuro-bass': {
      name: 'Neuro Bass',
      description: 'AI-driven complex bass design with neural network patterns',
      icon: Cpu,
      bpm: '170-180 BPM',
      elements: ['Neural bass', 'Glitch patterns', 'Complex rhythms', 'AI samples', 'Digital artifacts'],
      structure: ['Intro (16)', 'Build (16)', 'Neuro Drop (32)', 'Breakdown (16)', 'Chaos Build (16)', 'Final Drop (32)', 'Outro (16)'],
      color: 'from-cyan-500 via-blue-600 to-purple-700',
      examples: ['liquid neuro', 'tech neuro', 'experimental neuro', 'AI neuro'],
      category: 'experimental',
      adminOnly: true
    },
    'quantum-step': {
      name: 'Quantum Step',
      description: 'Dubstep evolved with quantum computing-inspired sound design',
      icon: Atom,
      bpm: '140-150 BPM',
      elements: ['Quantum wobbles', 'Particle effects', 'Phase modulation', 'Dimensional drops', 'Reality bends'],
      structure: ['Reality Check (8)', 'Quantum Build (16)', 'Particle Drop (32)', 'Phase Shift (16)', 'Quantum Build (16)', 'Reality Drop (32)', 'Collapse (8)'],
      color: 'from-green-400 via-emerald-500 to-teal-600',
      examples: ['quantum wobble', 'particle dubstep', 'dimensional bass', 'reality step'],
      category: 'experimental',
      adminOnly: true
    },
    'cyber-trap': {
      name: 'Cyber Trap',
      description: 'Futuristic trap with cyberpunk aesthetics and AI vocals',
      icon: Satellite,
      bpm: '130-170 BPM',
      elements: ['Cyber 808s', 'Digital hi-hats', 'Holographic leads', 'AI vocal chops', 'Neon arps'],
      structure: ['Boot Up (8)', 'Cyber Verse (16)', 'Digital Hook (16)', 'Glitch Verse (16)', 'Neon Hook (16)', 'System Bridge (8)', 'Final Hook (16)', 'Shutdown (8)'],
      color: 'from-pink-500 via-purple-600 to-indigo-700',
      examples: ['neon trap', 'digital trap', 'holographic trap', 'AI trap'],
      category: 'experimental',
      adminOnly: true
    },
    'bio-techno': {
      name: 'Bio Techno',
      description: 'Organic techno with biological rhythms and heartbeat patterns',
      icon: Dna,
      bpm: '120-135 BPM',
      elements: ['Heartbeat kicks', 'Organic sequences', 'DNA spirals', 'Cell division', 'Neural networks'],
      structure: ['Genesis (32)', 'Evolution (32)', 'Mutation (32)', 'Adaptation (32)', 'Natural Selection (32)', 'Peak Evolution (64)', 'Extinction (16)'],
      color: 'from-green-500 via-lime-500 to-yellow-500',
      examples: ['cellular techno', 'DNA sequences', 'heartbeat tech', 'organic minimal'],
      category: 'experimental',
      adminOnly: true
    },
    'space-bass': {
      name: 'Space Bass',
      description: 'Cosmic dubstep with intergalactic sound design',
      icon: Rocket,
      bpm: '140-160 BPM',
      elements: ['Cosmic wobbles', 'Stellar drops', 'Nebula pads', 'Galaxy sweeps', 'Asteroid hits'],
      structure: ['Launch (16)', 'Orbit (16)', 'Solar Drop (32)', 'Deep Space (16)', 'Warp Build (16)', 'Galaxy Drop (32)', 'Re-entry (16)'],
      color: 'from-purple-600 via-indigo-600 to-blue-700',
      examples: ['cosmic dubstep', 'interstellar bass', 'nebula step', 'galaxy wobble'],
      category: 'experimental',
      adminOnly: true
    },
    'psychedelic-trap': {
      name: 'Psychedelic Trap',
      description: 'Mind-bending trap with psychedelic elements and time dilation',
      icon: Lightbulb,
      bpm: '130-150 BPM',
      elements: ['Trippy 808s', 'Kaleidoscope leads', 'Time-stretched vocals', 'Reality glitches', 'Consciousness beats'],
      structure: ['Awakening (8)', 'Trip Verse (16)', 'Psychedelic Hook (16)', 'Reality Shift (16)', 'Transcendence (16)', 'Mind Melt (8)', 'Cosmic Hook (16)', 'Landing (8)'],
      color: 'from-yellow-400 via-orange-500 to-red-600',
      examples: ['consciousness trap', 'reality trap', 'trippy beats', 'mind-bending'],
      category: 'experimental',
      adminOnly: true
    },

    // MAINSTREAM RADIO GENRES (AVAILABLE TO ALL)
    'pop': {
      name: 'Pop',
      description: 'Chart-topping radio hits with catchy hooks and modern production',
      icon: Radio,
      bpm: '100-130 BPM',
      elements: ['Catchy hooks', 'Radio vocals', 'Modern drums', 'Synth leads', 'Pop structure'],
      structure: ['Intro (8)', 'Verse (16)', 'Pre-Chorus (8)', 'Chorus (16)', 'Verse (16)', 'Pre-Chorus (8)', 'Chorus (16)', 'Bridge (8)', 'Final Chorus (16)', 'Outro (8)'],
      color: 'from-pink-400 via-rose-500 to-red-500',
      examples: ['radio pop', 'dance pop', 'electro pop', 'mainstream pop'],
      category: 'mainstream'
    },
    'country': {
      name: 'Country',
      description: 'Modern country with radio-friendly production and storytelling',
      icon: Guitar,
      bpm: '90-140 BPM',
      elements: ['Acoustic guitar', 'Steel guitar', 'Country vocals', 'Fiddle', 'Banjo'],
      structure: ['Intro (8)', 'Verse (16)', 'Chorus (16)', 'Verse (16)', 'Chorus (16)', 'Bridge (8)', 'Solo (16)', 'Chorus (16)', 'Outro (8)'],
      color: 'from-amber-500 via-orange-500 to-red-600',
      examples: ['radio country', 'pop country', 'contemporary country', 'crossover country'],
      category: 'mainstream'
    },
    'r&b': {
      name: 'R&B',
      description: 'Smooth R&B with contemporary production and soulful vocals',
      icon: Mic2,
      bpm: '70-110 BPM',
      elements: ['Smooth vocals', 'R&B drums', 'Bass lines', 'Chord progressions', 'Soul elements'],
      structure: ['Intro (8)', 'Verse (16)', 'Chorus (16)', 'Verse (16)', 'Chorus (16)', 'Bridge (8)', 'Vocal runs (8)', 'Final Chorus (16)', 'Outro (8)'],
      color: 'from-purple-500 via-pink-500 to-rose-600',
      examples: ['contemporary R&B', 'neo soul', 'alternative R&B', 'urban contemporary'],
      category: 'mainstream'
    },
    'latin': {
      name: 'Latin',
      description: 'Latin rhythms with reggaeton, salsa, and modern Latin fusion',
      icon: Globe,
      bpm: '90-120 BPM',
      elements: ['Reggaeton beat', 'Latin percussion', 'Brass sections', 'Spanish vocals', 'Salsa rhythms'],
      structure: ['Intro (8)', 'Verso (16)', 'Coro (16)', 'Verso (16)', 'Coro (16)', 'Puente (8)', 'Solo (16)', 'Coro Final (16)', 'Outro (8)'],
      color: 'from-red-500 via-orange-500 to-yellow-500',
      examples: ['reggaeton', 'latin pop', 'bachata', 'salsa moderna'],
      category: 'mainstream'
    },
    'alternative': {
      name: 'Alternative Rock',
      description: 'Modern alternative rock with radio appeal and indie sensibilities',
      icon: Guitar,
      bpm: '110-150 BPM',
      elements: ['Distorted guitars', 'Alternative drums', 'Indie vocals', 'Bass grooves', 'Atmospheric elements'],
      structure: ['Intro (8)', 'Verse (16)', 'Chorus (16)', 'Verse (16)', 'Chorus (16)', 'Bridge (8)', 'Guitar Solo (16)', 'Final Chorus (16)', 'Outro (8)'],
      color: 'from-gray-600 via-slate-600 to-zinc-700',
      examples: ['indie rock', 'modern rock', 'alternative pop', 'radio rock'],
      category: 'mainstream'
    },

    // UNDERGROUND EDM GENRES (AVAILABLE TO ALL)
    'edm': {
      name: 'EDM / Electronic Dance Music',
      description: 'High-energy electronic music designed for festivals and clubs',
      icon: Zap,
      bpm: '120-140 BPM',
      elements: ['Synth leads', 'Bass drops', 'Build-ups', 'Breakdowns', 'Risers'],
      structure: ['Intro (16)', 'Build (16)', 'Drop (32)', 'Breakdown (16)', 'Build (16)', 'Drop (32)', 'Outro (16)'],
      color: 'from-purple-500 to-pink-500',
      examples: ['festival anthem', 'big room house', 'progressive house', 'electro house'],
      category: 'underground'
    },
    'house': {
      name: 'House Music',
      description: 'Four-on-the-floor rhythms with soulful grooves',
      icon: Radio,
      bpm: '120-130 BPM',
      elements: ['Four-on-floor kick', 'Hi-hats', 'Piano stabs', 'Vocal chops', 'Deep bass'],
      structure: ['Intro (32)', 'Verse (32)', 'Chorus (32)', 'Break (16)', 'Verse (32)', 'Chorus (32)', 'Outro (32)'],
      color: 'from-blue-500 to-cyan-500',
      examples: ['deep house', 'tech house', 'future house', 'tropical house'],
      category: 'underground'
    },
    'trap': {
      name: 'Trap',
      description: 'Heavy 808s with rapid hi-hat patterns and hard-hitting drums',
      icon: Volume2,
      bpm: '130-170 BPM',
      elements: ['808 drums', 'Hi-hat rolls', 'Snare patterns', 'Melodic leads', 'Vocal chops'],
      structure: ['Intro (8)', 'Verse (16)', 'Hook (16)', 'Verse (16)', 'Hook (16)', 'Bridge (8)', 'Hook (16)', 'Outro (8)'],
      color: 'from-red-500 to-orange-500',
      examples: ['festival trap', 'hybrid trap', 'future bass', 'hardstyle trap'],
      category: 'underground'
    },
    'dubstep': {
      name: 'Dubstep',
      description: 'Heavy wobble bass with syncopated drum patterns',
      icon: Waves,
      bpm: '140-150 BPM',
      elements: ['Wobble bass', 'Syncopated drums', 'Vocal samples', 'Risers', 'Impacts'],
      structure: ['Intro (16)', 'Build (16)', 'Drop (32)', 'Break (16)', 'Build (16)', 'Drop (32)', 'Outro (16)'],
      color: 'from-green-500 to-emerald-500',
      examples: ['riddim', 'melodic dubstep', 'heavy dubstep', 'experimental bass'],
      category: 'underground'
    },
    'techno': {
      name: 'Techno',
      description: 'Driving rhythms with industrial sounds and hypnotic loops',
      icon: Headphones,
      bpm: '120-135 BPM',
      elements: ['Driving kick', 'Percussion loops', 'Acid sequences', 'Industrial sounds'],
      structure: ['Intro (64)', 'Development (64)', 'Peak (32)', 'Break (32)', 'Rebuild (32)', 'Climax (64)', 'Outro (32)'],
      color: 'from-gray-500 to-slate-600',
      examples: ['minimal techno', 'acid techno', 'industrial techno', 'peak time techno'],
      category: 'underground'
    },
    'trance': {
      name: 'Trance',
      description: 'Uplifting melodies with emotional breakdowns and epic build-ups',
      icon: Music,
      bpm: '130-140 BPM',
      elements: ['Arpeggiated leads', 'Uplifting pads', 'Epic breakdowns', 'Gate effects'],
      structure: ['Intro (32)', 'Break (32)', 'Build (32)', 'Climax (64)', 'Break (32)', 'Build (32)', 'Climax (64)', 'Outro (32)'],
      color: 'from-indigo-500 to-purple-500',
      examples: ['uplifting trance', 'progressive trance', 'psy trance', 'vocal trance'],
      category: 'underground'
    },
    'hip-hop': {
      name: 'Hip-Hop',
      description: 'Rhythm-focused beats with strong emphasis on lyrics and flow',
      icon: Mic2,
      bpm: '70-140 BPM',
      elements: ['Drum breaks', 'Bass lines', 'Melodic samples', 'Vocal elements'],
      structure: ['Intro (8)', 'Verse (16)', 'Chorus (16)', 'Verse (16)', 'Chorus (16)', 'Bridge (8)', 'Chorus (16)', 'Outro (8)'],
      color: 'from-yellow-500 to-orange-500',
      examples: ['boom bap', 'trap rap', 'lo-fi hip hop', 'conscious rap'],
      category: 'underground'
    },
    'dnb': {
      name: 'Drum & Bass',
      description: 'Fast breakbeats with heavy sub-bass and complex rhythms',
      icon: Drum,
      bpm: '170-180 BPM',
      elements: ['Breakbeats', 'Sub bass', 'Reese bass', 'Atmospheric pads'],
      structure: ['Intro (32)', 'Build (16)', 'Drop (64)', 'Break (32)', 'Build (16)', 'Drop (64)', 'Outro (16)'],
      color: 'from-teal-500 to-green-500',
      examples: ['liquid dnb', 'neurofunk', 'jungle', 'jump up'],
      category: 'underground'
    },
    'rock': {
      name: 'Rock',
      description: 'Guitar-driven music with powerful drums and dynamic arrangements',
      icon: Guitar,
      bpm: '110-140 BPM',
      elements: ['Electric guitars', 'Bass guitar', 'Live drums', 'Powerful vocals'],
      structure: ['Intro (8)', 'Verse (16)', 'Chorus (16)', 'Verse (16)', 'Chorus (16)', 'Bridge (8)', 'Solo (16)', 'Chorus (16)', 'Outro (8)'],
      color: 'from-red-600 to-rose-500',
      examples: ['alternative rock', 'indie rock', 'hard rock', 'progressive rock'],
      category: 'underground'
    },
    'ambient': {
      name: 'Ambient',
      description: 'Atmospheric soundscapes with evolving textures and minimal rhythm',
      icon: Piano,
      bpm: '60-90 BPM',
      elements: ['Atmospheric pads', 'Field recordings', 'Evolving textures', 'Subtle percussion'],
      structure: ['Emergence (120)', 'Development (120)', 'Climax (120)', 'Resolution (120)'],
      color: 'from-sky-400 to-blue-500',
      examples: ['dark ambient', 'space ambient', 'drone', 'new age'],
      category: 'underground'
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

  // Filter genres based on admin status
  const filteredGenres = Object.entries(genres).filter(([key, genre]) => {
    // If genre is admin-only, only show to admins
    if (genre.adminOnly && !isAdmin()) {
      return false;
    }
    
    // Apply category filter
    if (selectedCategory === 'all') return true;
    return genre.category === selectedCategory;
  });

  const currentGenre = genres[selectedGenre] || genres.edm;
  const Icon = currentGenre.icon;

  const categoryColors = {
    experimental: 'from-cyan-500 to-purple-600',
    mainstream: 'from-pink-500 to-rose-600', 
    underground: 'from-purple-500 to-indigo-600'
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { id: 'all', label: 'All Genres', icon: Globe },
          { id: 'experimental', label: 'Experimental EDM', icon: Atom },
          { id: 'mainstream', label: 'Mainstream Radio', icon: Radio },
          { id: 'underground', label: 'Underground EDM', icon: Flame }
        ].map(category => {
          const CategoryIcon = category.icon;
          
          // For experimental category, show admin badge if not admin
          const isExperimentalLocked = category.id === 'experimental' && !isAdmin();
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              disabled={isExperimentalLocked}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-raver text-sm transition-all duration-300 relative
                ${selectedCategory === category.id 
                  ? 'raver-button underground-glow' 
                  : isExperimentalLocked
                    ? 'underground-glass opacity-50 cursor-not-allowed'
                    : 'underground-glass hover:underground-glow border border-white/20'
                }
              `}
            >
              <CategoryIcon className="w-5 h-5" />
              <span>{category.label}</span>
              {isExperimentalLocked && (
                <Shield className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Notice for Experimental Genres */}
      {selectedCategory === 'experimental' && !isAdmin() && (
        <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <span className="font-raver text-yellow-400">ADMIN ACCESS REQUIRED</span>
          </div>
          <p className="text-sm text-gray-300 font-underground">
            Experimental EDM genres like Levity Push and Wubcraft are admin-only features
          </p>
        </div>
      )}

      {/* Genre Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredGenres.map(([key, genre]) => {
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
                relative p-4 rounded-xl border-2 text-left transition-all duration-300 group font-producer
                ${isSelected 
                  ? 'raver-button underground-glow-intense scale-105' 
                  : 'underground-glass hover:underground-glow hover:scale-102'
                }
              `}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${genre.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <GenreIcon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-raver text-xs mb-1 text-white">{genre.name}</h3>
              <p className="text-xs text-gray-300 mb-2 font-underground">{genre.bpm}</p>
              
              {/* Category indicator */}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoryColors[genre.category]}/20 border border-current/30`}>
                <span className="raver-text-shadow text-xs">
                  {genre.category.toUpperCase()}
                </span>
              </div>

              {/* Admin badge for experimental genres */}
              {genre.adminOnly && (
                <div className="absolute top-2 right-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                </div>
              )}
              
              {/* Hover info */}
              {isHovered && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 underground-glass border z-20 text-xs">
                  <p className="text-white mb-2 font-underground">{genre.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {genre.elements.slice(0, 3).map((element, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-dj">
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
      <div className={`underground-glass p-6 rounded-xl bg-gradient-to-r ${currentGenre.color}/10 border border-current/20`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentGenre.color} rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-raver underground-text-glow">{currentGenre.name}</h3>
                {currentGenre.adminOnly && (
                  <Shield className="w-5 h-5 text-yellow-400" />
                )}
              </div>
              <p className="text-sm text-gray-300 font-underground">{currentGenre.bpm}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowStructure(!showStructure)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showStructure ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <p className="text-sm text-gray-300 mb-4 font-underground">{currentGenre.description}</p>
        
        {/* Key Elements */}
        <div className="mb-4">
          <h4 className="font-raver text-sm mb-2 flex items-center space-x-1 text-white">
            <Music className="w-4 h-4" />
            <span>KEY ELEMENTS</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentGenre.elements.map((element, i) => (
              <span key={i} className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-dj">
                {element}
              </span>
            ))}
          </div>
        </div>
        
        {/* Song Structure */}
        {showStructure && (
          <div className="space-y-4 border-t border-white/20 pt-4">
            <h4 className="font-raver text-sm flex items-center space-x-1 text-white">
              <Info className="w-4 h-4" />
              <span>SONG STRUCTURE</span>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {currentGenre.structure.map((section, i) => (
                <div key={i} className="p-2 underground-glass rounded text-center text-sm font-producer text-white">
                  {section}
                </div>
              ))}
            </div>
            
            {/* Examples */}
            <div>
              <h4 className="font-raver text-sm mb-2 text-white">SUB-GENRES & STYLES</h4>
              <div className="flex flex-wrap gap-2">
                {currentGenre.examples.map((example, i) => (
                  <span key={i} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded font-underground">
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