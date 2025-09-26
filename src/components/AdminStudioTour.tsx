import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Target,
  Eye,
  Hand,
  Lightbulb,
  Play,
  Wand2,
  Settings,
  Music,
  Headphones,
  Volume2,
  Layers,
  Grid3X3,
  Sliders,
  Download,
  Crown,
  Sparkles,
  Brain,
  Activity,
  Zap,
  Cpu,
  Radio,
  Mic,
  Scissors,
  Package,
  Shield,
  Code,
  Bug,
  Database,
  Monitor,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminTourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'type' | 'drag';
  component: 'dashboard' | 'generate' | 'studio' | 'library' | 'admin';
  highlight?: boolean;
  adminFeatures: string[];
  debugInfo?: string[];
  tips?: string[];
}

interface AdminStudioTourProps {
  isOpen: boolean;
  onClose: () => void;
  startComponent?: string;
}

const AdminStudioTour: React.FC<AdminStudioTourProps> = ({ 
  isOpen, 
  onClose, 
  startComponent = 'admin' 
}) => {
  const { isAdmin } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(true);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(true);
  const [currentComponent, setCurrentComponent] = useState(startComponent);

  // Redirect non-admin users
  if (!isAdmin()) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-2xl border border-red-500/30 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-raver text-white mb-2">Admin Access Required</h2>
          <p className="text-gray-400">This tour is restricted to administrators only.</p>
        </div>
      </div>
    );
  }
  
  const adminTourSteps: AdminTourStep[] = [
    // Admin Dashboard Tour
    {
      id: 'admin-welcome',
      title: 'Beat Addicts Admin Control Center',
      description: 'Welcome to the administrative control center. Monitor system health, manage users, and access advanced debugging tools.',
      target: '.admin-header',
      position: 'center',
      component: 'admin',
      highlight: true,
      adminFeatures: [
        'Real-time system monitoring',
        'User management dashboard',
        'Performance analytics',
        'Debug and testing tools',
        'Revenue and subscription tracking'
      ],
      debugInfo: [
        'Admin session authenticated',
        'System health: OPERATIONAL',
        'Database connections: 12/50',
        'Active admin users: 3'
      ]
    },
    {
      id: 'admin-metrics',
      title: 'System Performance Dashboard',
      description: 'Monitor real-time system metrics including CPU usage, memory consumption, API response times, and user activity.',
      target: '.admin-metrics',
      position: 'bottom',
      component: 'admin',
      action: 'hover',
      adminFeatures: [
        'Real-time CPU and memory monitoring',
        'API latency tracking',
        'Database performance metrics',
        'User activity analytics',
        'Generation queue monitoring'
      ],
      debugInfo: [
        'Metrics update interval: 2000ms',
        'Data source: Supabase + System APIs',
        'Alert thresholds configured',
        'Historical data retention: 30 days'
      ],
      tips: [
        'Red indicators show system stress',
        'Hover for detailed metric breakdowns',
        'Click metrics to view historical trends',
        'Set up alerts for threshold breaches'
      ]
    },
    {
      id: 'admin-users',
      title: 'User Management System',
      description: 'Comprehensive user administration including subscription management, usage analytics, and user behavior tracking.',
      target: '.user-management',
      position: 'right',
      component: 'admin',
      action: 'click',
      adminFeatures: [
        'User subscription management',
        'Usage pattern analysis',
        'Behavior tracking and insights',
        'Support ticket integration',
        'Fraud detection and prevention'
      ],
      debugInfo: [
        'Total registered users: 15,247',
        'Active subscriptions: 3,892',
        'Churn rate: 2.3%',
        'Support tickets: 12 open'
      ]
    },
    {
      id: 'admin-ai-systems',
      title: 'AI System Administration',
      description: 'Monitor and manage Beat Addicts AI systems, model performance, generation queues, and quality assurance.',
      target: '.ai-systems',
      position: 'left',
      component: 'admin',
      highlight: true,
      adminFeatures: [
        'AI model performance monitoring',
        'Generation queue management',
        'Quality assurance metrics',
        'Model version control',
        'Resource allocation optimization'
      ],
      debugInfo: [
        'Active models: 12',
        'Average generation time: 45s',
        'Success rate: 99.7%',
        'Queue length: 3 pending'
      ]
    },
    
    // Enhanced Generation System Tour
    {
      id: 'admin-generation-system',
      title: 'Advanced Generation Analytics',
      description: 'Deep dive into the generation system with performance profiling, A/B testing capabilities, and quality metrics.',
      target: '.generation-analytics',
      position: 'center',
      component: 'generate',
      highlight: true,
      adminFeatures: [
        'Generation performance profiling',
        'A/B testing different models',
        'Quality scoring algorithms',
        'Resource usage optimization',
        'Failure analysis and recovery'
      ],
      debugInfo: [
        'Generation engine: v2.7.3',
        'Average RTF: 27.27x',
        'Peak concurrent generations: 50',
        'Model switching latency: <200ms'
      ]
    },
    {
      id: 'admin-prompt-enhancement',
      title: 'GPT-4 Enhancement Debugging',
      description: 'Monitor and debug the GPT-4 Turbo prompt enhancement system with detailed analysis of input/output transformations.',
      target: '.prompt-enhancement',
      position: 'right',
      component: 'generate',
      action: 'type',
      adminFeatures: [
        'Prompt transformation analysis',
        'GPT-4 API usage monitoring',
        'Enhancement quality scoring',
        'Prompt optimization suggestions',
        'Token usage and cost tracking'
      ],
      debugInfo: [
        'GPT-4 API calls today: 2,847',
        'Average enhancement ratio: 4.2x',
        'Token usage: 2.3M/5M daily limit',
        'Cache hit rate: 67%'
      ]
    },
    
    // Studio System Administration
    {
      id: 'admin-studio-performance',
      title: 'Studio Environment Monitoring',
      description: 'Monitor studio component performance, user interactions, and feature usage analytics in real-time.',
      target: '.studio-performance',
      position: 'bottom',
      component: 'studio',
      adminFeatures: [
        'Component render performance',
        'User interaction heatmaps',
        'Feature adoption analytics',
        'Error boundary monitoring',
        'Memory leak detection'
      ],
      debugInfo: [
        'Studio sessions today: 1,247',
        'Average session duration: 23m',
        'Most used feature: Beat Sequencer',
        'Error rate: 0.03%'
      ]
    },
    {
      id: 'admin-debugging-tools',
      title: 'Advanced Debugging Suite',
      description: 'Access powerful debugging tools for testing edge cases, simulating errors, and performance optimization.',
      target: '.debug-tools',
      position: 'left',
      component: 'admin',
      action: 'click',
      highlight: true,
      adminFeatures: [
        'Error simulation and testing',
        'Performance bottleneck analysis',
        'Memory profiling tools',
        'API endpoint stress testing',
        'User flow analytics'
      ],
      debugInfo: [
        'Debug sessions active: 2',
        'Memory usage: 847MB',
        'JavaScript errors: 0',
        'Console warnings: 3'
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < adminTourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      
      const nextStep = adminTourSteps[currentStep + 1];
      if (nextStep.component !== currentComponent) {
        setCurrentComponent(nextStep.component);
      }
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      
      const prevStep = adminTourSteps[currentStep - 1];
      if (prevStep.component !== currentComponent) {
        setCurrentComponent(prevStep.component);
      }
    }
  };

  const handleSkipToComponent = (component: string) => {
    const firstStepIndex = adminTourSteps.findIndex(step => step.component === component);
    if (firstStepIndex !== -1) {
      setCurrentStep(firstStepIndex);
      setCurrentComponent(component);
    }
  };

  const handleFinish = () => {
    setIsPlaying(false);
    onClose();
    console.log('Admin studio tour completed!');
  };

  const currentStepData = adminTourSteps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with spotlight effect */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm">
        {showSpotlight && currentStepData.highlight && (
          <div 
            className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/90"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.9) 70%)`
            }}
          />
        )}
      </div>

      {/* Tour Interface */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gray-900/95 border-b border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-raver text-white">Beat Addicts Admin Tour</h2>
                <p className="text-gray-400 font-underground">Advanced administrative walkthrough</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm font-underground text-gray-400">
                Step {currentStep + 1} of {adminTourSteps.length}
              </div>
              <button
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className={`p-2 rounded-lg transition-colors ${
                  showDebugInfo ? 'bg-yellow-500/20 text-yellow-400' : 'hover:bg-white/10 text-gray-400'
                }`}
                title="Toggle Debug Info"
              >
                <Bug className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
                className={`p-2 rounded-lg transition-colors ${
                  showPerformanceMetrics ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10 text-gray-400'
                }`}
                title="Toggle Performance Metrics"
              >
                <Activity className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSpotlight(!showSpotlight)}
                className={`p-2 rounded-lg transition-colors ${
                  showSpotlight ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-gray-400'
                }`}
                title="Toggle Spotlight"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
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
              style={{ width: `${((currentStep + 1) / adminTourSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Performance Metrics Bar */}
        {showPerformanceMetrics && (
          <div className="p-3 bg-gray-800/50 border-b border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <div className="flex space-x-6">
                <span className="text-cyan-400">CPU: 45%</span>
                <span className="text-emerald-400">Memory: 67%</span>
                <span className="text-yellow-400">API: 120ms</span>
                <span className="text-purple-400">Users: 34 active</span>
              </div>
              <div className="text-gray-400">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        )}

        {/* Component Navigation */}
        <div className="p-4 bg-gray-800/50 border-b border-gray-700">
          <div className="flex space-x-2">
            {['admin', 'dashboard', 'generate', 'studio', 'library'].map((component) => {
              const icons = {
                admin: Shield,
                dashboard: Activity,
                generate: Wand2,
                studio: Settings,
                library: Package
              };
              const Icon = icons[component];
              
              return (
                <button
                  key={component}
                  onClick={() => handleSkipToComponent(component)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-raver text-sm transition-all ${
                    currentComponent === component
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{component.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto">
            {/* Tour Step Card */}
            <div className="bg-gray-900/95 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {currentStepData.component === 'admin' && <Shield className="w-8 h-8 text-white" />}
                  {currentStepData.component === 'dashboard' && <Activity className="w-8 h-8 text-white" />}
                  {currentStepData.component === 'generate' && <Wand2 className="w-8 h-8 text-white" />}
                  {currentStepData.component === 'studio' && <Settings className="w-8 h-8 text-white" />}
                  {currentStepData.component === 'library' && <Package className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-3xl font-raver text-white mb-3">
                  {currentStepData.title}
                </h3>
                <p className="text-lg text-gray-300 font-underground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Admin Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-raver text-red-400 text-lg mb-3 flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Admin Features</span>
                  </h4>
                  <div className="space-y-2">
                    {currentStepData.adminFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {showDebugInfo && currentStepData.debugInfo && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="font-raver text-yellow-400 text-lg mb-3 flex items-center space-x-2">
                      <Code className="w-5 h-5" />
                      <span>Debug Info</span>
                    </h4>
                    <div className="space-y-2">
                      {currentStepData.debugInfo.map((info, index) => (
                        <div key={index} className="text-xs font-mono text-gray-400">
                          {info}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Indicator */}
              {currentStepData.action && (
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                    {currentStepData.action === 'click' && <Hand className="w-4 h-4 text-purple-400" />}
                    {currentStepData.action === 'hover' && <Eye className="w-4 h-4 text-cyan-400" />}
                    {currentStepData.action === 'type' && <Mic className="w-4 h-4 text-emerald-400" />}
                    {currentStepData.action === 'drag' && <Layers className="w-4 h-4 text-pink-400" />}
                    <span className="text-sm font-raver text-white capitalize">
                      {currentStepData.action} to interact
                    </span>
                  </div>
                </div>
              )}

              {/* Tips */}
              {currentStepData.tips && (
                <div className="mb-6">
                  <h4 className="font-raver text-white text-lg mb-3 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span>Admin Tips</span>
                  </h4>
                  <div className="space-y-2">
                    {currentStepData.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <Target className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300 font-underground">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-raver transition-all ${
                    currentStep === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>PREVIOUS</span>
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-3 rounded-xl transition-all ${
                      isPlaying 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isPlaying ? <X className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                  </button>

                  <span className="text-sm font-underground text-gray-400">
                    {currentStep + 1} / {adminTourSteps.length}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white rounded-xl font-raver transition-all"
                >
                  <span>{currentStep === adminTourSteps.length - 1 ? 'FINISH TOUR' : 'NEXT'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Overlay */}
        {currentStepData.highlight && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudioTour;