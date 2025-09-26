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
  Tag,
  Plus,
  Wand2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Library = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  console.log('Library component rendered - showing only real user content');

  // No fake/placeholder songs - only real user-generated content will be displayed
  const projects = []; // Empty array - will be populated with actual user generations from Supabase

  const filterOptions = [
    { id: 'all', label: 'All Projects', count: 0 },
    { id: 'ai-generated', label: 'AI Generated', count: 0 },
    { id: 'lyrics-flow', label: 'Lyrics to Flow', count: 0 },
    { id: 'harmonies', label: 'AI Harmonies', count: 0 },
    { id: 'stems', label: 'Stem Separation', count: 0 }
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
            Your collection of AI-generated music projects
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
            placeholder="Search your music projects..."
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

      {/* Empty State - Always shown since no fake content */}
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/20">
          <Music className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gradient">Your Music Library is Empty</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Start creating amazing AI-generated music to build your personal library. Every track you generate will appear here.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/generate" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
          >
            <Wand2 className="w-5 h-5" />
            <span>Generate Your First Track</span>
          </Link>
          
          <Link 
            to="/lyrics-flow" 
            className="border border-border hover:bg-accent text-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Lyrics Flow</span>
          </Link>
        </div>

        {/* Feature Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="font-semibold mb-2">AI Generation</h4>
            <p className="text-sm text-muted-foreground">Create unique beats and melodies with advanced AI</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Music className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="font-semibold mb-2">Stem Separation</h4>
            <p className="text-sm text-muted-foreground">Isolate individual instruments from any track</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Tag className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="font-semibold mb-2">Smart Organization</h4>
            <p className="text-sm text-muted-foreground">Automatically organize tracks by genre and style</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;