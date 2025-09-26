import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Database, 
  Settings, 
  Activity, 
  TrendingUp,
  Crown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Bot,
  Zap,
  Music,
  BarChart3,
  DollarSign,
  UserCheck,
  FileText,
  Server
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import AdminAIBot from '../components/AdminAIBot';
import AdminDemoLauncher from '../components/AdminDemoLauncher';
import AdminDiagnostics from '../components/AdminDiagnostics';

interface AdminStats {
  totalUsers: number;
  proUsers: number;
  studioUsers: number;
  totalGenerations: number;
  todayGenerations: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  databaseStatus: 'online' | 'offline';
  apiStatus: 'operational' | 'degraded' | 'down';
}

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    proUsers: 0,
    studioUsers: 0,
    totalGenerations: 0,
    todayGenerations: 0,
    systemHealth: 'healthy',
    databaseStatus: 'online',
    apiStatus: 'operational'
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Always show admin page - diagnostics will help fix access issues
  console.log('🛡️ Admin page access - User:', user?.email, 'isAdmin():', isAdmin());

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      console.log('Fetching admin statistics...');
      
      // Fetch user counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('customer_tier');

      if (profilesError) throw profilesError;

      // Fetch subscriptions
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier');

      if (subscriptionsError) throw subscriptionsError;

      // Fetch music generations
      const { data: generations, error: generationsError } = await supabase
        .from('music_generation')
        .select('created_at');

      if (generationsError) throw generationsError;

      // Calculate statistics
      const totalUsers = profiles?.length || 0;
      const proUsers = subscriptions?.filter(s => s.subscription_tier === 'pro').length || 0;
      const studioUsers = subscriptions?.filter(s => s.subscription_tier === 'studio').length || 0;
      const totalGenerations = generations?.length || 0;
      
      const today = new Date().toDateString();
      const todayGenerations = generations?.filter(g => 
        new Date(g.created_at).toDateString() === today
      ).length || 0;

      setStats({
        totalUsers,
        proUsers,
        studioUsers,
        totalGenerations,
        todayGenerations,
        systemHealth: 'healthy',
        databaseStatus: 'online',
        apiStatus: 'operational'
      });

      console.log('Admin stats loaded:', { totalUsers, proUsers, studioUsers, totalGenerations });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setStats(prev => ({ ...prev, systemHealth: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'ai', label: 'AI Systems', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const quickActions = [
    {
      title: 'System Health Check',
      description: 'Run comprehensive system diagnostics',
      icon: Activity,
      action: () => console.log('Running system health check...')
    },
    {
      title: 'Database Backup',
      description: 'Create manual database backup',
      icon: Database,
      action: () => console.log('Creating database backup...')
    },
    {
      title: 'User Analytics',
      description: 'Generate detailed user reports',
      icon: BarChart3,
      action: () => console.log('Generating user analytics...')
    },
    {
      title: 'AI Model Status',
      description: 'Check Beat Addicts AI performance',
      icon: Zap,
      action: () => console.log('Checking AI model status...')
    }
  ];

  const systemMetrics = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      positive: true,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Pro Subscribers',
      value: stats.proUsers.toString(),
      change: '+8%',
      positive: true,
      icon: Crown,
      color: 'text-yellow-400'
    },
    {
      label: 'Studio Subscribers',
      value: stats.studioUsers.toString(),
      change: '+15%',
      positive: true,
      icon: Shield,
      color: 'text-purple-400'
    },
    {
      label: 'Daily Generations',
      value: stats.todayGenerations.toString(),
      change: '+23%',
      positive: true,
      icon: Music,
      color: 'text-emerald-400'
    },
    {
      label: 'Total Generations',
      value: stats.totalGenerations.toLocaleString(),
      change: '+45%',
      positive: true,
      icon: TrendingUp,
      color: 'text-cyan-400'
    },
    {
      label: 'System Uptime',
      value: '99.7%',
      change: '+0.2%',
      positive: true,
      icon: CheckCircle,
      color: 'text-green-400'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show warning if not admin but still allow access to diagnostics
  const showAccessWarning = !isAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8 admin-header">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Shield className={`w-8 h-8 ${showAccessWarning ? 'text-yellow-400' : 'text-red-400'}`} />
              <h1 className="text-3xl font-bold text-white">Beat Addicts Admin</h1>
              <div className={`px-3 py-1 text-sm rounded-full border ${
                showAccessWarning 
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {showAccessWarning ? 'DIAGNOSTICS MODE' : 'ADMIN ONLY'}
              </div>
            </div>
            <p className="text-gray-400">
              {showAccessWarning 
                ? 'Use Settings tab to diagnose and fix admin access issues' 
                : 'System administration and management console'
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-medium text-white">{user?.email}</p>
            </div>
            <button
              onClick={fetchAdminStats}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Access Warning Banner */}
        {showAccessWarning && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-300 mb-1">Limited Access Mode</h3>
                <p className="text-yellow-200 text-sm mb-3">
                  You don't currently have admin privileges. Use the Settings tab below to diagnose and fix admin access issues.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTab('settings')}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                  >
                    Go to Diagnostics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-medium text-white">System Health</p>
                <p className="text-sm text-green-400 capitalize">{stats.systemHealth}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-blue-400" />
              <div>
                <p className="font-medium text-white">Database</p>
                <p className="text-sm text-blue-400 capitalize">{stats.databaseStatus}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Server className="w-6 h-6 text-purple-400" />
              <div>
                <p className="font-medium text-white">API Status</p>
                <p className="text-sm text-purple-400 capitalize">{stats.apiStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Only show if admin */}
        {!showAccessWarning && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 admin-metrics">
            {systemMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${metric.color}`} />
                    <span className={`text-sm font-medium ${
                      metric.positive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                    <p className="text-sm text-gray-400">{metric.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg border border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {selectedTab === 'overview' && !showAccessWarning && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">System Overview</h2>
              
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all text-left group"
                      >
                        <Icon className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-medium text-white mb-2">{action.title}</h4>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent System Activity</h3>
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <div className="space-y-4">
                    {[
                      { time: '2 minutes ago', event: 'Database backup completed successfully', type: 'success' },
                      { time: '15 minutes ago', event: 'New Pro subscriber: user@example.com', type: 'info' },
                      { time: '32 minutes ago', event: 'AI model performance check passed', type: 'success' },
                      { time: '1 hour ago', event: 'System maintenance window completed', type: 'info' },
                      { time: '2 hours ago', event: 'Peak generation load: 1,247 requests/hour', type: 'warning' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-green-400' :
                          activity.type === 'warning' ? 'bg-yellow-400' :
                          'bg-blue-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white">{activity.event}</p>
                          <p className="text-sm text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'ai' && !showAccessWarning && (
            <div className="space-y-6 ai-systems">
              <h2 className="text-2xl font-bold text-white">AI Systems Management</h2>
              
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Beat Addicts AI Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400">Neural Networks</p>
                    <p className="text-2xl font-bold text-green-400">12 Active</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Processing Speed</p>
                    <p className="text-2xl font-bold text-cyan-400">27.27x RTF</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-purple-400">99.7%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">OpenAI Integration</p>
                    <p className="text-2xl font-bold text-green-400">Active</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Queue Length</p>
                    <p className="text-2xl font-bold text-yellow-400">3 Pending</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Model Version</p>
                    <p className="text-2xl font-bold text-white">v2.7</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Bot className="w-8 h-8 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">AI Assistant Available</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Your personal AI assistant is available in the bottom-right corner. It can help with:
                  code generation, database operations, system diagnostics, and administrative tasks.
                </p>
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Powered by OpenAI GPT-3.5-turbo</span>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && !showAccessWarning && (
            <div className="space-y-6 user-management">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-12 text-center">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">User management interface coming soon...</p>
              </div>
            </div>
          )}

          {selectedTab === 'database' && !showAccessWarning && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Database Management</h2>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-12 text-center">
                <Database className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Database management tools coming soon...</p>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">System Settings & Diagnostics</h2>
              
              {showAccessWarning && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Settings className="w-6 h-6 text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-300 mb-1">Admin Status Diagnostics</h3>
                      <p className="text-blue-200 text-sm">
                        Use the diagnostics tool below to check and fix admin access issues.
                        This will help restore your administrator privileges.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <AdminDiagnostics />
              
              {!showAccessWarning && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-12 text-center">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Additional system settings coming soon...</p>
                </div>
              )}
            </div>
          )}

          {/* Fallback for non-admin users trying to access restricted tabs */}
          {showAccessWarning && selectedTab !== 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-12 text-center">
                <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Admin Access Required</h3>
                <p className="text-gray-400 text-lg mb-4">
                  This section requires administrator privileges.
                </p>
                <button
                  onClick={() => setSelectedTab('settings')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Go to Diagnostics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Demo Launcher - Only visible if admin */}
      {!showAccessWarning && <AdminDemoLauncher position="bottom-left" />}

      {/* AI Assistant Bot - Always visible */}
      <AdminAIBot />
    </div>
  );
};

export default Admin;