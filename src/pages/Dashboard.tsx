import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Wand2, 
  Scissors, 
  Mic, 
  Waves, 
  TrendingUp, 
  Clock, 
  Download,
  Play,
  Crown,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  console.log('Dashboard component rendered');

  const quickActions = [
    {
      title: 'AI Generate',
      description: 'Create new tracks with AI',
      icon: Wand2,
      href: '/generate',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'ACE-Step',
      description: 'Foundation model generation',
      icon: Zap,
      href: '/ace-step',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Stem Splitter',
      description: 'Separate audio elements',
      icon: Scissors,
      href: '/stem-splitter',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Lyrics Flow',
      description: 'Convert lyrics to vocals',
      icon: Mic,
      href: '/lyrics-flow',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'AI Harmonies',
      description: 'Add vocal layers',
      icon: Waves,
      href: '/harmonies',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Summer Vibes Beat',
      type: 'AI Generated',
      duration: '3:24',
      createdAt: '2 hours ago',
      isPlaying: false
    },
    {
      id: 2,
      title: 'Rap Flow Demo',
      type: 'Lyrics to Flow',
      duration: '2:45',
      createdAt: '1 day ago',
      isPlaying: true
    },
    {
      id: 3,
      title: 'Harmony Layers',
      type: 'AI Harmonies',
      duration: '4:12',
      createdAt: '3 days ago',
      isPlaying: false
    }
  ];

  const stats = [
    { label: 'Tracks Created', value: '47', icon: Music },
    { label: 'Hours Produced', value: '156', icon: Clock },
    { label: 'Downloads', value: '1.2K', icon: Download },
    { label: 'Trending Score', value: '89%', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card p-8 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Welcome back, Sally! 
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to create some amazing music with AI?
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 px-4 py-2 rounded-lg border border-red-500/30">
            <Crown className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Administrator</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="group glass-card p-6 rounded-xl hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link 
            to="/library" 
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="space-y-0">
            {recentProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${
                  index !== recentProjects.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
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
                  <div>
                    <h3 className="font-medium text-foreground">{project.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{project.type}</span>
                      <span>•</span>
                      <span>{project.duration}</span>
                      <span>•</span>
                      <span>{project.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="glass-card p-8 rounded-xl">
        <div className="flex items-center justify-center space-x-2">
          <div className="audio-wave">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="audio-wave-bar"
                style={{
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-center text-muted-foreground mt-4">
          AI-powered music visualization
        </p>
      </div>
    </div>
  );
};

export default Dashboard;