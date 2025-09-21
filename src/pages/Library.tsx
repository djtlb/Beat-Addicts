import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Play, 
  Download, 
  MoreHorizontal,
  Music,
  Clock,
  Calendar,
  Tag
} from 'lucide-react';

const Library = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  console.log('Library component rendered');

  const projects = [
    {
      id: 1,
      title: 'Summer Vibes Beat',
      type: 'AI Generated',
      duration: '3:24',
      createdAt: '2024-01-15',
      tags: ['Hip Hop', 'Energetic', 'Summer'],
      size: '4.2 MB',
      plays: 127,
      isPlaying: false
    },
    {
      id: 2,
      title: 'Rap Flow Demo',
      type: 'Lyrics to Flow',
      duration: '2:45',
      createdAt: '2024-01-14',
      tags: ['Rap', 'Eminem Style', 'Fast'],
      size: '3.8 MB',
      plays: 89,
      isPlaying: true
    },
    {
      id: 3,
      title: 'Harmony Layers',
      type: 'AI Harmonies',
      duration: '4:12',
      createdAt: '2024-01-12',
      tags: ['Gospel', 'Vocals', 'Layered'],
      size: '5.6 MB',
      plays: 156,
      isPlaying: false
    },
    {
      id: 4,
      title: 'Instrumental Stems',
      type: 'Stem Separation',
      duration: '3:58',
      createdAt: '2024-01-10',
      tags: ['Rock', 'Stems', 'Separated'],
      size: '15.2 MB',
      plays: 203,
      isPlaying: false
    },
    {
      id: 5,
      title: 'Chill Lo-Fi Beat',
      type: 'AI Generated',
      duration: '2:33',
      createdAt: '2024-01-08',
      tags: ['Lo-Fi', 'Chill', 'Study'],
      size: '3.1 MB',
      plays: 312,
      isPlaying: false
    },
    {
      id: 6,
      title: 'Pop Harmony Stack',
      type: 'AI Harmonies',
      duration: '3:15',
      createdAt: '2024-01-06',
      tags: ['Pop', 'Harmonies', 'Modern'],
      size: '4.7 MB',
      plays: 95,
      isPlaying: false
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'ai-generated', label: 'AI Generated', count: projects.filter(p => p.type === 'AI Generated').length },
    { id: 'lyrics-flow', label: 'Lyrics to Flow', count: projects.filter(p => p.type === 'Lyrics to Flow').length },
    { id: 'harmonies', label: 'AI Harmonies', count: projects.filter(p => p.type === 'AI Harmonies').length },
    { id: 'stems', label: 'Stem Separation', count: projects.filter(p => p.type === 'Stem Separation').length }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         project.type.toLowerCase().replace(/\s+/g, '-') === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Music Library</h1>
          <p className="text-muted-foreground">
            Manage and organize your AI-generated music projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects, tags, or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {filterOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass-card p-6 rounded-xl hover:shadow-lg hover:shadow-purple-500/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                  <Music className="w-6 h-6 text-white" />
                  {project.isPlaying && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Play className="w-2 h-2 text-white fill-white" />
                    </div>
                  )}
                </div>
                <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.type}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-primary hover:bg-primary/90 rounded-full transition-colors">
                      <Play className="w-4 h-4 text-primary-foreground" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {project.plays} plays
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="space-y-0">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${
                  index !== filteredProjects.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    {project.isPlaying && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Play className="w-2 h-2 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{project.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{project.type}</span>
                      <span>•</span>
                      <span>{project.duration}</span>
                      <span>•</span>
                      <span>{formatDate(project.createdAt)}</span>
                      <span>•</span>
                      <span>{project.size}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground hidden lg:block">
                    {project.plays} plays
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? `No results for "${searchQuery}"` : 'Start creating music to build your library'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Library;