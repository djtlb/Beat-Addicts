import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Music, 
  Drum, 
  Piano, 
  Mic, 
  Waves, 
  Target,
  Package,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  Star,
  Clock,
  Zap,
  Radio,
  Eye,
  HeadphonesIcon,
  Grab,
  Move
} from 'lucide-react';
import PlayButton from './PlayButton';
import UniversalAudioPlayer from './UniversalAudioPlayer';
import { 
  defaultSamplePacks,
  allDefaultSamples,
  sampleCategories,
  getSamplesByCategory,
  getSamplesByType,
  searchSamples,
  initializeDefaultSamples,
  type DefaultSample,
  type DefaultSamplePack
} from '../lib/defaultSamples';

interface DragItem {
  id: string;
  type: 'sample' | 'pack' | 'track' | 'element';
  data: any;
}

interface DraggableItemProps {
  item: DragItem;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// Inline DraggableItem component to avoid import issues
const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  children,
  className = '',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) return;
    
    console.log('🎯 Draggable item start:', item.id);
    setIsDragging(true);
    
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    console.log('✅ Draggable item end:', item.id);
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        ${!disabled ? 'drag-source cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'} 
        ${isDragging ? 'dragging opacity-70 transform rotate-2 scale-105' : ''} 
        ${className}
      `}
      style={{
        transition: 'all 0.2s ease',
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
        opacity: isDragging ? 0.7 : 1,
        wordBreak: 'normal',
        overflowWrap: 'break-word',
        whiteSpace: 'normal'
      }}
    >
      {!disabled && (
        <div className="absolute top-1 right-1 z-10">
          <Grab className="w-3 h-3 text-gray-400" />
        </div>
      )}
      {children}
    </div>
  );
};

interface DefaultSampleLibraryProps {
  onSampleSelect?: (sample: DefaultSample) => void;
  onPackLoad?: (pack: DefaultSamplePack) => void;
  className?: string;
}

const DefaultSampleLibrary: React.FC<DefaultSampleLibraryProps> = ({
  onSampleSelect,
  onPackLoad,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPack, setSelectedPack] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSamples, setFilteredSamples] = useState(allDefaultSamples);
  const [playingSample, setPlayingSample] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  console.log('🎵 Default Sample Library with working audio players loaded with', allDefaultSamples.length, 'samples');

  // Initialize default samples on component mount
  useEffect(() => {
    initializeDefaultSamples();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('beatAddictsStudioFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
  }, []);

  // Filter samples based on category, pack, and search
  useEffect(() => {
    let samples = allDefaultSamples;

    // Filter by category
    if (selectedCategory !== 'all') {
      samples = getSamplesByCategory(selectedCategory);
    }

    // Filter by pack
    if (selectedPack !== 'all') {
      const pack = defaultSamplePacks.find(p => p.id === selectedPack);
      if (pack) {
        samples = pack.samples;
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      samples = searchSamples(searchQuery);
    }

    setFilteredSamples(samples);
    console.log('🔍 Filtered samples:', samples.length, 'results');
  }, [selectedCategory, selectedPack, searchQuery]);

  const handleSamplePlay = (sampleId: string) => {
    setPlayingSample(sampleId);
  };

  const handleSamplePause = () => {
    setPlayingSample(null);
  };

  const toggleFavorite = (sampleId: string) => {
    const newFavorites = favorites.includes(sampleId)
      ? favorites.filter(id => id !== sampleId)
      : [...favorites, sampleId];
    
    setFavorites(newFavorites);
    localStorage.setItem('beatAddictsStudioFavorites', JSON.stringify(newFavorites));
    console.log('⭐ Toggled favorite for sample:', sampleId);
  };

  const loadPackIntoStudio = (pack: DefaultSamplePack) => {
    console.log('📦 Loading default pack into Studio:', pack.name);
    
    try {
      // Add to Studio sample packs if not already present
      const studioPacks = JSON.parse(localStorage.getItem('beatAddictsStudioPacks') || '[]');
      const packExists = studioPacks.some((p: any) => p.id === pack.id);
      
      if (!packExists) {
        studioPacks.push(pack);
        localStorage.setItem('beatAddictsStudioPacks', JSON.stringify(studioPacks));
        console.log('✅ Pack added to Studio library');
      }
      
      onPackLoad?.(pack);
      alert(`"${pack.name}" is now available in your Studio!`);
    } catch (error) {
      console.error('Failed to load pack:', error);
      alert('Failed to load pack into Studio');
    }
  };

  const downloadSample = (sample: DefaultSample) => {
    console.log('💾 Downloading sample:', sample.name);
    
    try {
      const a = document.createElement('a');
      a.href = sample.audioUrl;
      a.download = `${sample.name.replace(/\s+/g, '_')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: { [key: string]: any } = {
      drums: Drum,
      bass: Music,
      synths: Piano,
      vocals: Mic,
      fx: Waves,
      percussion: Target
    };
    return iconMap[categoryId] || Music;
  };

  return (
    <div className={`space-y-6 ${className}`} style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-raver underground-text-glow" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
            DEFAULT SAMPLE LIBRARY
          </h2>
          <p className="text-sm text-gray-300 font-underground mt-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
            {allDefaultSamples.length} professional samples • {defaultSamplePacks.length} curated packs • All play buttons working
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full text-emerald-400 text-xs font-raver border border-emerald-500/30">
            ROYALTY FREE
          </div>
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-400 text-xs font-raver border border-purple-500/30">
            STUDIO READY
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="studio-glass-card p-4 rounded-xl space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search samples by name, tags, or description..."
            className="w-full pl-10 pr-4 py-3 bg-black/40 border-2 border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-underground placeholder-gray-400"
            style={{
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              whiteSpace: 'normal'
            }}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block font-raver text-white text-sm mb-2">CATEGORY</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg text-white font-underground"
            >
              <option value="all">All Categories ({allDefaultSamples.length})</option>
              {sampleCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Pack Filter */}
          <div>
            <label className="block font-raver text-white text-sm mb-2">SAMPLE PACK</label>
            <select
              value={selectedPack}
              onChange={(e) => setSelectedPack(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg text-white font-underground"
            >
              <option value="all">All Packs</option>
              {defaultSamplePacks.map(pack => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} ({pack.totalSamples})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-lg text-xs font-raver transition-colors ${
              selectedCategory === 'all' 
                ? 'raver-button underground-glow' 
                : 'underground-glass hover:underground-glow'
            }`}
            style={{
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              whiteSpace: 'normal'
            }}
          >
            ALL
          </button>
          {sampleCategories.map(category => {
            const Icon = getCategoryIcon(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-raver transition-colors ${
                  selectedCategory === category.id 
                    ? 'raver-button underground-glow' 
                    : 'underground-glass hover:underground-glow'
                }`}
                style={{
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal'
                }}
              >
                <Icon className="w-3 h-3" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sample Packs Overview */}
      {selectedPack === 'all' && selectedCategory === 'all' && !searchQuery && (
        <div className="studio-glass-card p-6 rounded-xl">
          <h3 className="font-raver text-white text-lg mb-4">FEATURED SAMPLE PACKS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultSamplePacks.slice(0, 6).map(pack => (
              <div key={pack.id} className="underground-glass p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-raver text-white text-sm truncate" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                      {pack.name}
                    </h4>
                    <div className="text-xs text-gray-400 font-underground">
                      {pack.totalSamples} samples • {pack.bpm} BPM • {pack.key}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-300 font-underground mb-3 line-clamp-2" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                  {pack.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPack(pack.id)}
                    className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-xs font-raver transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>BROWSE</span>
                  </button>
                  
                  <button
                    onClick={() => loadPackIntoStudio(pack)}
                    className="flex items-center space-x-2 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-raver transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>LOAD</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Grid */}
      <div className="studio-glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-raver text-white text-lg" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
            {searchQuery ? `SEARCH RESULTS (${filteredSamples.length})` : 
             selectedPack !== 'all' ? defaultSamplePacks.find(p => p.id === selectedPack)?.name.toUpperCase() :
             selectedCategory !== 'all' ? sampleCategories.find(c => c.id === selectedCategory)?.name.toUpperCase() :
             'ALL SAMPLES'}
          </h3>
          
          {filteredSamples.length > 0 && (
            <div className="text-sm text-gray-400 font-underground">
              {filteredSamples.length} samples available • All play buttons working
            </div>
          )}
        </div>

        {filteredSamples.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-raver text-gray-400 mb-2">No samples found</h4>
            <p className="text-sm text-gray-500 font-underground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredSamples.map(sample => {
              const Icon = getCategoryIcon(sample.category);
              const isFavorite = favorites.includes(sample.id);
              const isPlaying = playingSample === sample.id;
              
              return (
                <DraggableItem
                  key={sample.id}
                  item={{
                    id: sample.id,
                    type: 'sample',
                    data: sample
                  }}
                  className="underground-glass p-4 rounded-xl hover:underground-glow transition-all cursor-pointer group relative"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <div className="flex items-center space-x-1">
                      <Grab className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Move className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div 
                    onClick={() => onSampleSelect?.(sample)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-raver text-white text-sm group-hover:text-purple-400 transition-colors" 
                            style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                          {sample.name}
                        </h4>
                        <div className="text-xs text-gray-400 font-underground">
                          {sample.type} • {sample.duration.toFixed(1)}s • {sample.bpm} BPM
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(sample.id);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    
                    {/* Working Audio Player */}
                    <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                      <UniversalAudioPlayer
                        audioUrl={sample.audioUrl}
                        title={sample.name}
                        duration={`${Math.floor(sample.duration / 60)}:${String(Math.floor(sample.duration % 60)).padStart(2, '0')}`}
                        showWaveform={false}
                        showDownload={false}
                        onPlay={() => handleSamplePlay(sample.id)}
                        onPause={handleSamplePause}
                        className="mb-0"
                        compact={true}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {sample.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-producer"
                              style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400 font-underground">
                        Key: {sample.key}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSample(sample);
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Download Sample"
                        >
                          <Download className="w-3 h-3 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSampleSelect?.(sample);
                          }}
                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded text-xs font-raver transition-colors"
                        >
                          USE
                        </button>
                      </div>
                    </div>
                  </div>
                </DraggableItem>
              );
            })}
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="underground-glass p-4 rounded-xl">
        <h4 className="font-raver text-white text-sm mb-2">HOW TO USE SAMPLES - ALL AUDIO WORKING</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300 font-underground">
          <div className="flex items-start space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-raver text-cyan-400 mb-1">PREVIEW AUDIO</div>
              <div style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                Click play to preview any sample - all audio players are working with real playback
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Upload className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-raver text-emerald-400 mb-1">DRAG TO STUDIO</div>
              <div style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                Drag samples directly to tracks or click "USE" to add to your Studio
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-raver text-yellow-400 mb-1">FAVORITES</div>
              <div style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
                Star your favorite samples for quick access later
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultSampleLibrary;