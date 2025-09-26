import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Wand2, 
  Scissors, 
  Mic, 
  Waves, 
  Eye, 
  Brain, 
  Sparkles, 
  Music, 
  Headphones,
  Radio,
  Zap,
  Target,
  Crown,
  Settings,
  Layers,
  BarChart3,
  Activity,
  Cpu,
  Download,
  X,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shuffle,
  Clock,
  StudioMonitorIcon,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Monitor,
  Code,
  Bug,
  Gauge
} from 'lucide-react';
import { SpinningVinylIcon, EqualizerIcon, WaveformIcon, HeadphonesIcon } from './MusicIcons';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface AdminDemoStep {
  id: string;
  title: string;
  description: string;
  component: string;
  duration: number;
  adminFeatures: string[];
  autoActions: Array<{
    delay: number;
    action: string;
    target: string;
    value?: any;
  }>;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  apiLatency: number;
  activeUsers: number;
  generationQueue: number;
  databaseConnections: number;
}

const AdminInteractiveDemo: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [currentGenre, setCurrentGenre] = useState('edm');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [beatPattern, setBeatPattern] = useState([0, 4, 8, 12]);
  const [showSystemMetrics, setShowSystemMetrics] = useState(true);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 67,
    apiLatency: 120,
    activeUsers: 34,
    generationQueue: 3,
    databaseConnections: 12
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const metricsRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect non-admin users
  if (!isAdmin()) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-2xl border border-red-500/30 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-raver text-white mb-2">Admin Access Required</h2>
          <p className="text-gray-400">This demo is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  const adminDemoSteps: AdminDemoStep[] = [
    {
      id: 'admin-intro',
      title: 'Beat Addicts Admin Demo System',
      description: 'Advanced administrative demonstration platform with real-time system monitoring, performance analytics, and debug capabilities.',
      component: 'intro',
      duration: 4000,
      adminFeatures: [
        'Real-time system metrics monitoring',
        'Performance analytics dashboard',
        'Debug panel with detailed logging',
        'User behavior tracking',
        'A/B testing capabilities'
      ],
      autoActions: []
    },
    {
      id: 'system-analytics',
      title: 'System Performance Analytics',
      description: 'Monitor real-time system performance, API response times, database connections, and user activity patterns.',
      component: 'analytics',
      duration: 6000,
      adminFeatures: [
        'CPU and memory usage tracking',
        'API latency monitoring',
        'Database connection pooling stats',
        'Active user session tracking',
        'Generation queue management'
      ],
      autoActions: [
        { delay: 1000, action: 'updateMetrics', target: 'cpu', value: 60 },
        { delay: 3000, action: 'updateMetrics', target: 'memory', value: 72 },
        { delay: 5000, action: 'updateMetrics', target: 'latency', value: 95 }
      ]
    },
    {
      id: 'admin-generation',
      title: 'Advanced Generation Testing',
      description: 'Test dual track generation with enhanced admin controls, performance profiling, and quality assurance metrics.',
      component: 'generation',
      duration: 8000,
      adminFeatures: [
        'Generation performance profiling',
        'Quality assurance scoring',
        'A/B testing different models',
        'Resource usage monitoring',
        'Failure analysis and debugging'
      ],
      autoActions: [
        { delay: 500, action: 'startGeneration', target: 'prompt' },
        { delay: 1000, action: 'updateProgress', target: 'progress', value: 25 },
        { delay: 3000, action: 'updateProgress', target: 'progress', value: 50 },
        { delay: 5000, action: 'updateProgress', target: 'progress', value: 75 },
        { delay: 7000, action: 'updateProgress', target: 'progress', value: 100 }
      ]
    },
    {
      id: 'admin-studio',
      title: 'Studio Environment Testing',
      description: 'Test professional studio features with admin debugging, performance monitoring, and user experience analytics.',
      component: 'studio',
      duration: 6000,
      adminFeatures: [
        'Studio component performance metrics',
        'User interaction heatmaps',
        'Feature usage analytics',
        'Error tracking and reporting',
        'Load testing capabilities'
      ],
      autoActions: [
        { delay: 1000, action: 'showBeatGrid', target: 'sequencer' },
        { delay: 3000, action: 'toggleSteps', target: 'beat-pattern' },
        { delay: 5000, action: 'showMixer', target: 'mixer' }
      ]
    },
    {
      id: 'debug-testing',
      title: 'Debug & Testing Tools',
      description: 'Advanced debugging tools for testing edge cases, error handling, and system reliability under various conditions.',
      component: 'debug',
      duration: 5000,
      adminFeatures: [
        'Error simulation and testing',
        'Edge case scenario testing',
        'Performance bottleneck analysis',
        'Memory leak detection',
        'API endpoint stress testing'
      ],
      autoActions: [
        { delay: 1000, action: 'simulateError', target: 'api' },
        { delay: 3000, action: 'showDebugInfo', target: 'console' }
      ]
    },
    {
      id: 'admin-insights',
      title: 'Business Intelligence Dashboard',
      description: 'Comprehensive analytics on user behavior, feature adoption, revenue metrics, and system optimization opportunities.',
      component: 'insights',
      duration: 4000,
      adminFeatures: [
        'User engagement analytics',
        'Feature adoption rates',
        'Revenue and subscription metrics',
        'Performance optimization insights',
        'Predictive analytics dashboard'
      ],
      autoActions: [
        { delay: 1000, action: 'loadAnalytics', target: 'dashboard' },
        { delay: 2500, action: 'showRevenueMetrics', target: 'revenue' }
      ]
    }
  ];

  // Update system metrics periodically
  useEffect(() => {
    if (isExpanded) {
      metricsRef.current = setInterval(() => {
        setSystemMetrics(prev => ({
          cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
          memoryUsage: Math.max(30, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 8)),
          apiLatency: Math.max(50, Math.min(300, prev.apiLatency + (Math.random() - 0.5) * 20)),
          activeUsers: Math.max(10, Math.min(100, prev.activeUsers + Math.floor((Math.random() - 0.5) * 6))),
          generationQueue: Math.max(0, Math.min(20, prev.generationQueue + Math.floor((Math.random() - 0.5) * 3))),
          databaseConnections: Math.max(5, Math.min(50, prev.databaseConnections + Math.floor((Math.random() - 0.5) * 4)))
        }));
      }, 2000);
    }

    return () => {
      if (metricsRef.current) clearInterval(metricsRef.current);
    };
  }, [isExpanded]);

  // Demo step logic (similar to original but with admin features)
  useEffect(() => {
    if (isPlaying) {
      const step = adminDemoSteps[currentStep];
      
      step.autoActions.forEach(action => {
        stepTimeoutRef.current = setTimeout(() => {
          executeAutoAction(action);
        }, action.delay);
      });

      stepTimeoutRef.current = setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % adminDemoSteps.length);
        setAutoProgress(0);
      }, step.duration);

      intervalRef.current = setInterval(() => {
        setAutoProgress(prev => {
          const increment = (100 / step.duration) * 100;
          return Math.min(100, prev + increment);
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, [isPlaying, currentStep]);

  const executeAutoAction = (action: any) => {
    console.log('Executing admin demo action:', action);
    
    switch (action.action) {
      case 'updateMetrics':
        if (action.target === 'cpu') {
          setSystemMetrics(prev => ({ ...prev, cpuUsage: action.value }));
        } else if (action.target === 'memory') {
          setSystemMetrics(prev => ({ ...prev, memoryUsage: action.value }));
        } else if (action.target === 'latency') {
          setSystemMetrics(prev => ({ ...prev, apiLatency: action.value }));
        }
        break;
      case 'simulateError':
        console.error('Simulated API error for testing purposes');
        break;
      case 'showDebugInfo':
        setShowDebugPanel(true);
        break;
      // ... other admin-specific actions
      default:
        // Fallback to original actions
        break;
    }
  };

  const handlePlayPause = () => {
    console.log('Admin Demo:', isPlaying ? 'Pausing' : 'Starting');
    setIsPlaying(!isPlaying);
  };

  const runSystemTest = async () => {
    console.log('Running comprehensive system test...');
    // Simulate system tests
    setSystemMetrics(prev => ({ ...prev, cpuUsage: 85, apiLatency: 200 }));
    setTimeout(() => {
      setSystemMetrics(prev => ({ ...prev, cpuUsage: 45, apiLatency: 120 }));
    }, 3000);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <Shield className="w-8 h-8 group-hover:animate-pulse" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <Code className="w-3 h-3 text-white animate-pulse" />
          </div>
        </button>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Admin Demo
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = adminDemoSteps[currentStep];

  return (
    <div className="fixed inset-4 z-50 bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-red-500/30 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-900/50 to-purple-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-red-400" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                <Code className="w-3 h-3 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-raver text-white">Beat Addicts Admin Demo</h2>
              <p className="text-gray-400 font-underground">Advanced System Testing & Analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSystemMetrics(!showSystemMetrics)}
              className={`px-4 py-2 rounded-lg font-raver text-sm transition-all ${
                showSystemMetrics 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4 inline mr-2" />
              Metrics
            </button>
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className={`px-4 py-2 rounded-lg font-raver text-sm transition-all ${
                showDebugPanel 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Bug className="w-4 h-4 inline mr-2" />
              Debug
            </button>
            <button
              onClick={runSystemTest}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-raver text-sm hover:scale-105 transition-all"
            >
              <Gauge className="w-4 h-4 inline mr-2" />
              System Test
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${autoProgress}%` }}
          />
        </div>
      </div>

      {/* System Metrics Panel */}
      {showSystemMetrics && (
        <div className="p-4 bg-gray-800/50 border-b border-gray-700">
          <div className="grid grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">{systemMetrics.cpuUsage}%</div>
              <div className="text-xs text-gray-400">CPU Usage</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">{systemMetrics.memoryUsage}%</div>
              <div className="text-xs text-gray-400">Memory</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{systemMetrics.apiLatency}ms</div>
              <div className="text-xs text-gray-400">API Latency</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{systemMetrics.activeUsers}</div>
              <div className="text-xs text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pink-400">{systemMetrics.generationQueue}</div>
              <div className="text-xs text-gray-400">Queue Length</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{systemMetrics.databaseConnections}</div>
              <div className="text-xs text-gray-400">DB Connections</div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      {showDebugPanel && (
        <div className="p-4 bg-black/50 border-b border-yellow-500/30">
          <div className="text-xs font-mono text-green-400 space-y-1 max-h-32 overflow-y-auto">
            <div>[{new Date().toLocaleTimeString()}] Admin demo system initialized</div>
            <div>[{new Date().toLocaleTimeString()}] Current step: {currentStepData.id}</div>
            <div>[{new Date().toLocaleTimeString()}] System metrics: CPU {systemMetrics.cpuUsage}%, Memory {systemMetrics.memoryUsage}%</div>
            <div>[{new Date().toLocaleTimeString()}] Active users: {systemMetrics.activeUsers}, Queue: {systemMetrics.generationQueue}</div>
            <div>[{new Date().toLocaleTimeString()}] API latency: {systemMetrics.apiLatency}ms</div>
          </div>
        </div>
      )}

      {/* Rest of the component similar to original but with admin-specific content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-raver text-white text-lg mb-2">{currentStepData.title}</h3>
            <p className="text-sm text-gray-300 font-underground leading-relaxed mb-3">
              {currentStepData.description}
            </p>
            
            {/* Admin Features List */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <h4 className="text-sm font-raver text-red-400 mb-2">Admin Features:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                {currentStepData.adminFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-3">
            {adminDemoSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(index);
                  setAutoProgress(0);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  index === currentStep 
                    ? 'bg-gradient-to-r from-red-600/30 to-purple-600/30 border border-red-500/50' 
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === currentStep ? 'bg-red-500' : 'bg-gray-600'
                  }`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-raver text-white text-sm">{step.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Admin Controls */}
          <div className="p-4 border-t border-gray-700 space-y-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className={`flex-1 py-3 px-4 rounded-lg font-raver transition-all ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                    : 'bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600'
                } text-white`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isPlaying ? 'PAUSE' : 'START ADMIN DEMO'}</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentStep(prev => Math.min(adminDemoSteps.length - 1, prev + 1))}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(0);
                setAutoProgress(0);
                setGenerationProgress(0);
                setShowResults(false);
              }}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-raver text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET DEMO</span>
            </button>
          </div>
        </div>

        {/* Main Demo Area - Similar to original but with admin-specific content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="text-center space-y-8">
            <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 p-8 rounded-2xl border border-red-500/30">
              <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-4xl font-raver text-white mb-4">
                ADMIN DEMO ENVIRONMENT
              </h1>
              <p className="text-xl text-gray-300 font-underground mb-6">
                Advanced testing and analytics platform
              </p>
              <div className="flex items-center justify-center space-x-8 text-gray-400">
                <span className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-red-400" />
                  <span>System Analytics</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Bug className="w-5 h-5 text-yellow-400" />
                  <span>Debug Tools</span>
                </span>
                <span className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Performance Metrics</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInteractiveDemo;