import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Database, 
  Code, 
  Bug, 
  Monitor, 
  AlertTriangle, 
  CheckCircle,
  Play,
  Pause,
  Volume2,
  Download,
  Crown,
  Sparkles,
  Zap,
  Music,
  Headphones,
  Radio,
  Target,
  Brain,
  Cpu,
  Eye,
  Wand2,
  Settings,
  Layers,
  Clock,
  ChevronRight,
  Star,
  TestTube,
  Gauge,
  UserCheck
} from 'lucide-react';
import { SpinningVinylIcon, EqualizerIcon, WaveformIcon } from './MusicIcons';
import { useAuth } from '../hooks/useAuth';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
  revenue: number;
  featureUsage: {
    generation: number;
    studio: number;
    stemSeparation: number;
    voiceCloning: number;
  };
  abTestResults: {
    variant: string;
    conversions: number;
    engagement: number;
  }[];
}

const AdminMarketingShowcase: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showABTesting, setShowABTesting] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 15247,
    activeUsers: 3892,
    conversionRate: 12.7,
    revenue: 47350,
    featureUsage: {
      generation: 89.3,
      studio: 67.2,
      stemSeparation: 45.8,
      voiceCloning: 23.4
    },
    abTestResults: [
      { variant: 'Control', conversions: 127, engagement: 3.2 },
      { variant: 'Variant A', conversions: 145, engagement: 3.8 },
      { variant: 'Variant B', conversions: 139, engagement: 3.5 }
    ]
  });

  // Redirect non-admin users
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-gray-400">This showcase is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  const adminFeatures = [
    {
      id: 'analytics-dashboard',
      title: 'Real-time Analytics Dashboard',
      subtitle: 'Business Intelligence & Metrics',
      description: 'Comprehensive analytics dashboard showing user behavior, conversion rates, feature adoption, and revenue metrics in real-time.',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      stats: ['15,247 Total Users', '12.7% Conversion Rate', '$47.3K Revenue', '89.3% Generation Usage'],
      demo: 'analytics'
    },
    {
      id: 'ab-testing',
      title: 'A/B Testing Framework',
      subtitle: 'Optimize User Experience',
      description: 'Advanced A/B testing system for optimizing user flows, feature adoption, and conversion rates with statistical significance tracking.',
      icon: TestTube,
      color: 'from-purple-500 to-pink-500',
      stats: ['3 Active Tests', '145 Variant A Conversions', '3.8 Avg Engagement', '12% Uplift'],
      demo: 'testing'
    },
    {
      id: 'user-insights',
      title: 'User Behavior Analytics',
      subtitle: 'Deep User Intelligence',
      description: 'Advanced user behavior tracking with heatmaps, session recordings, feature usage patterns, and churn prediction models.',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      stats: ['3,892 Active Users', '23m Avg Session', '4.2 Pages/Session', '2.3% Churn Rate'],
      demo: 'users'
    },
    {
      id: 'performance-monitoring',
      title: 'System Performance Monitoring',
      subtitle: 'Technical Health Dashboard',
      description: 'Real-time system performance monitoring with error tracking, performance metrics, uptime monitoring, and automated alerting.',
      icon: Activity,
      color: 'from-red-500 to-orange-500',
      stats: ['99.97% Uptime', '127ms Avg Response', '0.02% Error Rate', '27.27x Processing Speed'],
      demo: 'performance'
    }
  ];

  const businessMetrics = [
    {
      label: 'Monthly Recurring Revenue',
      value: '$47,350',
      change: '+23.4%',
      positive: true,
      icon: DollarSign,
      color: 'text-emerald-400'
    },
    {
      label: 'User Acquisition Cost',
      value: '$12.50',
      change: '-8.2%',
      positive: true,
      icon: UserCheck,
      color: 'text-blue-400'
    },
    {
      label: 'Customer Lifetime Value',
      value: '$287',
      change: '+15.7%',
      positive: true,
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      label: 'Feature Adoption Rate',
      value: '89.3%',
      change: '+12.1%',
      positive: true,
      icon: Target,
      color: 'text-cyan-400'
    }
  ];

  // Update analytics data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 10),
        revenue: prev.revenue + Math.floor(Math.random() * 100),
        featureUsage: {
          ...prev.featureUsage,
          generation: Math.max(85, Math.min(95, prev.featureUsage.generation + (Math.random() - 0.5) * 2))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentFeature = adminFeatures[activeFeature];
  const Icon = currentFeature.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Admin Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Shield className="w-12 h-12 text-red-400" />
            <h1 className="text-6xl font-raver text-white bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ADMIN MARKETING ANALYTICS
            </h1>
          </div>
          <p className="text-2xl text-gray-300 font-underground mb-8">
            Advanced Business Intelligence & Performance Dashboard
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-6 py-3 rounded-lg font-raver transition-all ${
                showAnalytics 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setShowABTesting(!showABTesting)}
              className={`px-6 py-3 rounded-lg font-raver transition-all ${
                showABTesting 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <TestTube className="w-5 h-5 inline mr-2" />
              A/B Testing
            </button>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessMetrics.map((metric, index) => {
            const MetricIcon = metric.icon;
            return (
              <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <MetricIcon className={`w-8 h-8 ${metric.color}`} />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    metric.positive ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-2">{metric.value}</p>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Analytics */}
        {showAnalytics && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-3xl p-8">
            <h2 className="text-3xl font-raver text-white mb-8 flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <span>Real-time Analytics Dashboard</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Metrics */}
              <div className="space-y-6">
                <h3 className="text-xl font-raver text-white">User Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Total Users</span>
                    <span className="text-2xl font-bold text-white">{analyticsData.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Active Users</span>
                    <span className="text-2xl font-bold text-cyan-400">{analyticsData.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Conversion Rate</span>
                    <span className="text-2xl font-bold text-emerald-400">{analyticsData.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Revenue</span>
                    <span className="text-2xl font-bold text-purple-400">${analyticsData.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Feature Usage */}
              <div className="space-y-6">
                <h3 className="text-xl font-raver text-white">Feature Usage Analytics</h3>
                <div className="space-y-4">
                  {Object.entries(analyticsData.featureUsage).map(([feature, usage]) => (
                    <div key={feature} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white font-bold">{usage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${usage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* A/B Testing Dashboard */}
        {showABTesting && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-3xl p-8">
            <h2 className="text-3xl font-raver text-white mb-8 flex items-center space-x-3">
              <TestTube className="w-8 h-8 text-purple-400" />
              <span>A/B Testing Dashboard</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analyticsData.abTestResults.map((test, index) => (
                <div key={index} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-600">
                  <h3 className="font-raver text-white text-lg mb-4">{test.variant}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conversions</span>
                      <span className="text-cyan-400 font-bold">{test.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Engagement</span>
                      <span className="text-emerald-400 font-bold">{test.engagement}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          index === 0 ? 'bg-gray-500' :
                          index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          'bg-gradient-to-r from-cyan-500 to-blue-500'
                        }`}
                        style={{ width: `${(test.conversions / 145) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-purple-500/20 border border-purple-500/30 rounded-2xl">
              <h3 className="font-raver text-purple-400 text-lg mb-3">Test Results Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">12%</div>
                  <div className="text-sm text-gray-400">Conversion Uplift</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm text-gray-400">Confidence Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">SIGNIFICANT</div>
                  <div className="text-sm text-gray-400">Statistical Result</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Showcase with Admin Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Selection */}
          <div className="space-y-6">
            <h2 className="text-4xl font-raver text-white mb-8">Admin Feature Analytics</h2>
            
            {adminFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-500 ${
                    index === activeFeature 
                      ? `bg-gradient-to-r ${feature.color} scale-105 shadow-2xl` 
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      index === activeFeature ? 'bg-white/20' : 'bg-gray-700'
                    }`}>
                      <FeatureIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-raver text-white text-xl mb-1">{feature.title}</h3>
                      <p className="text-gray-300 font-underground text-sm mb-3">{feature.subtitle}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {feature.stats.map((stat, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white">
                            {stat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature Demo with Admin Data */}
          <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-700">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-br ${currentFeature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-raver text-white">{currentFeature.title}</h3>
            </div>

            {/* Admin-specific demo content */}
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="font-raver text-red-400">Admin Only</span>
                </div>
                <p className="text-sm text-gray-300">
                  This feature provides comprehensive administrative insights and controls 
                  for system monitoring, user management, and business intelligence.
                </p>
              </div>

              {/* Sample admin data visualization */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">3,892</div>
                  <div className="text-xs text-gray-400">Active Sessions</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">99.7%</div>
                  <div className="text-xs text-gray-400">System Health</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">127ms</div>
                  <div className="text-xs text-gray-400">Avg Response</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-pink-400 mb-1">$47.3K</div>
                  <div className="text-xs text-gray-400">Monthly Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="text-center bg-gradient-to-br from-red-900/50 to-purple-900/50 p-12 rounded-3xl border border-red-500/30">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-4xl font-raver text-white mb-6">Administrator Dashboard</h2>
          <p className="text-xl text-gray-300 font-underground mb-8 max-w-3xl mx-auto">
            Access advanced analytics, system controls, user management, and business intelligence 
            tools designed specifically for Beat Addicts administrators.
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-2xl font-raver text-lg hover:scale-105 transition-all shadow-2xl">
              <Database className="w-6 h-6 inline mr-3" />
              ACCESS ADMIN PANEL
              <ChevronRight className="w-6 h-6 inline ml-3" />
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 mt-8 text-gray-400">
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Real-time Analytics</span>
            </span>
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>System Monitoring</span>
            </span>
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>User Management</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketingShowcase;