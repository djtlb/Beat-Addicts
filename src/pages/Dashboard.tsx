import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Scissors, 
  Mic, 
  Waves, 
  TrendingUp, 
  Clock, 
  Download,
  Play,
  Crown,
  Activity,
  Headphones,
  Radio,
  Disc3,
  Volume2,
  Zap,
  Settings,
  BarChart3,
  Music4,
  Sliders,
  Layers,
  Sparkles,
  Target
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { 
  SpinningVinylIcon, 
  EqualizerIcon, 
  WaveformIcon, 
  StudioMonitorIcon,
  HeadphonesIcon,
  MusicNoteIcon
} from '../components/MusicIcons';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemLoad, setSystemLoad] = useState(87);
  const { isAdmin } = useAuth();

  console.log('Beat Addicts Studio Dashboard rendered, admin status:', isAdmin());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setSystemLoad(prev => Math.max(60, Math.min(95, prev + (Math.random() - 0.5) * 10)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: 'AI Synthesis Engine',
      description: 'Beat Addicts AI-powered music generation with advanced algorithmic composition',
      icon: Wand2,
      href: '/generate',
      gradient: 'from-purple-600 via-pink-500 to-purple-800',
      bgColor: 'bg-purple-500/20',
      glow: 'shadow-purple-500/30'
    },
    {
      title: 'Quantum Stem Splitter',
      description: 'AI-driven source separation with Beat Addicts machine learning isolation technology',
      icon: Scissors,
      href: '/stem-splitter',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      bgColor: 'bg-cyan-500/20',
      glow: 'shadow-cyan-500/30'
    },
    {
      title: 'Beat Addicts Vocal Engine',
      description: 'Advanced lyric-to-vocal synthesis with deep learning voice modeling',
      icon: Mic,
      href: '/lyrics-flow',
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      bgColor: 'bg-emerald-500/20',
      glow: 'shadow-emerald-500/30'
    },
    {
      title: 'Harmonic Matrix',
      description: 'Multi-dimensional harmony generation with spectral analysis processing',
      icon: Waves,
      href: '/harmonies',
      gradient: 'from-rose-500 via-pink-500 to-red-600',
      bgColor: 'bg-rose-500/20',
      glow: 'shadow-rose-500/30'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Quantum Symphony Alpha',
      type: 'Beat Addicts Generation',
      duration: '4:32',
      createdAt: '47 minutes ago',
      quality: 'Studio Master',
      isPlaying: false,
      waveform: true,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Ethereal Vocal Matrix',
      type: 'AI Vocal Synthesis',
      duration: '3:18',
      createdAt: '2 hours ago',
      quality: 'HD Audio',
      isPlaying: true,
      waveform: true,
      status: 'processing'
    },
    {
      id: 3,
      title: 'Harmonic Convergence',
      type: 'Multi-Layer Harmony',
      duration: '5:44',
      createdAt: '6 hours ago',
      quality: 'Ultra HD',
      isPlaying: false,
      waveform: true,
      status: 'completed'
    }
  ];

  // Admin-only system stats - only visible to admin users
  const systemStats = [
    { 
      label: 'Beat Addicts Networks Active', 
      value: '12', 
      icon: Activity, 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/20',
      glow: 'shadow-purple-500/20'
    },
    { 
      label: 'Processing Cores', 
      value: '2,048', 
      icon: Zap, 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/20',
      glow: 'shadow-cyan-500/20'
    },
    { 
      label: 'Audio Quality', 
      value: '192kHz', 
      icon: Volume2, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/20',
      glow: 'shadow-emerald-500/20'
    },
    { 
      label: 'System Performance', 
      value: `${systemLoad}%`, 
      icon: BarChart3, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/20',
      glow: 'shadow-rose-500/20'
    }
  ];

  const userIsAdmin = isAdmin();

  return (
    <div className="min-h-screen studio-bg">
      <div className="space-y-8 p-8">
        {/* Beat Addicts Header */}
        <div className="studio-glass-card p-8 rounded-3xl relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex items-center space-x-8">
              <div className="relative">
                <SpinningVinylIcon className="w-24 h-24" isSpinning={true} />
              </div>
              
              <div>
                <h1 className="text-5xl font-raver studio-text-gradient mb-3">
                  Beat Addicts Audio Studio
                </h1>
                <div className="text-xl text-gray-300 mb-4 flex items-center space-x-3 font-underground">
                  <HeadphonesIcon isActive={true} />
                  <span>Quantum-Enhanced Music Production Suite</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-medium">ONLINE</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400 font-studio">
                  <span className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Precision: 99.7%</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Enhanced</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Advanced System Visualizer - Admin Only */}
            {userIsAdmin && (
              <div className="hidden lg:flex items-center space-x-6">
                <div className="studio-console p-6 rounded-2xl">
                  <div className="text-center mb-4">
                    <div className="text-xs text-gray-400 mb-2 font-producer">QUANTUM PROCESSOR</div>
                    <div className="text-2xl font-dj studio-text-premium">{systemLoad}%</div>
                  </div>
                  <EqualizerIcon className="mx-auto" isActive={true} />
                </div>
              </div>
            )}
          </div>

          {/* Advanced Status Bar - Admin Only */}
          {userIsAdmin && (
            <div className="mt-8 studio-console p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="studio-led studio-led-active"></div>
                    <span className="text-sm text-gray-300 font-studio">Beat Addicts Engine Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300 font-studio">Quantum Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StudioMonitorIcon isActive={true} />
                    <span className="text-sm text-gray-300 font-studio">Ultra-HD Audio Ready</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-dj studio-text-premium">STUDIO ADMIN</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced System Stats - Admin Only */}
        {userIsAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`studio-glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-500 group ${stat.glow} hover:${stat.glow.replace('20', '40')}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl font-raver text-white mb-2 group-hover:studio-text-gradient transition-all duration-300">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400 font-underground">{stat.label}</div>
                    </div>
                    <div className={`p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.color.includes('purple') ? 'from-purple-500 to-pink-500' : 
                        stat.color.includes('cyan') ? 'from-cyan-500 to-blue-500' :
                        stat.color.includes('emerald') ? 'from-emerald-500 to-teal-500' :
                        'from-rose-500 to-pink-500'} transition-all duration-1000 group-hover:animate-pulse`}
                      style={{ width: `${Math.random() * 30 + 70}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Beat Addicts Processing Console */}
        <div>
          <h2 className="text-3xl font-raver mb-8 studio-text-gradient flex items-center space-x-3">
            <Radio className="w-8 h-8" />
            <span>Beat Addicts Processing Console</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-600"></div>
            </div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className={`group studio-glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-500 relative overflow-hidden ${action.glow} hover:${action.glow.replace('30', '50')}`}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="font-raver text-white mb-3 text-xl group-hover:studio-text-gradient transition-all duration-300">
                      {action.title}
                    </h3>
                    <div className="text-sm text-gray-400 leading-relaxed mb-4 font-underground">
                      {action.description}
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="studio-led studio-led-active"></div>
                      <span className="text-emerald-400 font-producer">READY</span>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 ${action.bgColor} opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500 blur-xl`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Active Beat Addicts Sessions */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-raver studio-text-gradient flex items-center space-x-3">
              <MusicNoteIcon isActive={true} />
              <span>Active Beat Addicts Sessions</span>
            </h2>
            <Link 
              to="/library" 
              className="studio-premium-button flex items-center space-x-2"
            >
              <Layers className="w-5 h-5" />
              <span>Master Library</span>
            </Link>
          </div>
          
          <div className="studio-glass-card rounded-3xl overflow-hidden">
            <div className="space-y-0">
              {recentProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`flex items-center justify-between p-8 hover:bg-white/5 transition-all duration-300 group ${
                    index !== recentProjects.length - 1 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <SpinningVinylIcon 
                        className="w-20 h-20" 
                        isSpinning={project.isPlaying} 
                      />
                      {project.status === 'processing' && (
                        <div className="absolute -bottom-2 -left-2 studio-led studio-led-warning animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-raver text-white text-xl mb-2 group-hover:studio-text-gradient transition-all duration-300">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-400 mb-3 font-studio">
                        <span className="flex items-center space-x-2">
                          <Music4 className="w-4 h-4" />
                          <span>{project.type}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{project.duration}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>{project.quality}</span>
                        </span>
                        <span>{project.createdAt}</span>
                      </div>
                      
                      {/* Status badge */}
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-producer ${
                          project.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {project.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Advanced Waveform */}
                    {project.waveform && (
                      <div className="hidden md:block mx-8">
                        <WaveformIcon isActive={project.isPlaying} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="studio-control-button group-hover:border-purple-500/50 transition-all duration-300">
                      <Play className="w-6 h-6 text-white group-hover:text-purple-400" />
                    </button>
                    <button className="studio-control-button group-hover:border-cyan-500/50 transition-all duration-300">
                      <Download className="w-6 h-6 text-white group-hover:text-cyan-400" />
                    </button>
                    <button className="studio-control-button group-hover:border-emerald-500/50 transition-all duration-300">
                      <Settings className="w-6 h-6 text-white group-hover:text-emerald-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beat Addicts Audio Visualizer */}
        <div className="studio-glass-card p-8 rounded-3xl">
          <div className="text-center space-y-8">
            <h3 className="text-2xl font-raver studio-text-gradient">Quantum Audio Processing Engine</h3>
            
            <div className="flex items-center justify-center space-x-2">
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className="studio-equalizer-bar w-2"
                  style={{
                    height: `${Math.random() * 80 + 20}px`,
                    animationDelay: `${i * 0.03}s`
                  }}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-raver studio-text-premium mb-2">2.7ms</div>
                <div className="text-gray-400 font-underground">Ultra-Low Latency</div>
              </div>
              <div>
                <div className="text-3xl font-raver studio-text-premium mb-2">192kHz</div>
                <div className="text-gray-400 font-underground">Studio Master Quality</div>
              </div>
              <div>
                <div className="text-3xl font-raver studio-text-premium mb-2">∞</div>
                <div className="text-gray-400 font-underground">Beat Addicts Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;