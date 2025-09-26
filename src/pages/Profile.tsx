import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  Settings, 
  Download, 
  Music, 
  Clock, 
  HardDrive,
  Bell,
  Palette,
  Volume2,
  Shield,
  CreditCard,
  LogOut,
  Star,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PricingPlans from '../components/PricingPlans';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [audioFormat, setAudioFormat] = useState('wav');
  const { user, subscription, signOut, isAdmin } = useAuth();

  console.log('Enhanced Profile component rendered');

  const tabs = [
    { id: 'overview', label: 'Studio Overview', icon: Activity },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'storage', label: 'Storage', icon: HardDrive }
  ];

  const userStats = [
    { label: 'Tracks Produced', value: '47', icon: Music, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'Studio Hours', value: '156', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Downloads', value: '1.2K', icon: Download, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Storage Used', value: '2.4 GB', icon: HardDrive, color: 'text-orange-400', bg: 'bg-orange-500/20' }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Generated',
      item: 'Studio Master 001',
      timestamp: '2 hours ago',
      type: 'AI Generate'
    },
    {
      id: 2,
      action: 'Downloaded',
      item: 'Vocal Session Beta',
      timestamp: '1 day ago',
      type: 'Lyrics Flow'
    },
    {
      id: 3,
      action: 'Created',
      item: 'Harmony Stack Pro',
      timestamp: '3 days ago',
      type: 'AI Harmonies'
    },
    {
      id: 4,
      action: 'Processed',
      item: 'Multi-Track Split',
      timestamp: '1 week ago',
      type: 'Stem Splitter'
    }
  ];

  const getTierInfo = (tier: string, admin: boolean = false) => {
    if (admin) return {
      label: 'Studio Admin',
      color: 'from-red-500 to-orange-500',
      textColor: 'text-red-400',
      icon: Shield
    };
    
    switch (tier) {
      case 'studio':
        return {
          label: 'Studio Master',
          color: 'from-purple-500 to-pink-500',
          textColor: 'text-purple-400',
          icon: Crown
        };
      case 'pro':
        return {
          label: 'Studio Pro',
          color: 'from-blue-500 to-cyan-500',
          textColor: 'text-blue-400',
          icon: Star
        };
      default:
        return {
          label: 'Studio Starter',
          color: 'from-gray-500 to-gray-600',
          textColor: 'text-gray-400',
          icon: Music
        };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const userIsAdmin = isAdmin();
  const displayTier = subscription?.subscription_tier || 'free';
  const tierInfo = getTierInfo(displayTier, userIsAdmin);
  const TierIcon = tierInfo.icon;

  return (
    <div className="min-h-screen studio-bg">
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="studio-card p-8 rounded-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 led-indicator led-green"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user?.email || 'User'}</h1>
                <p className="text-gray-300 mb-3">{user?.email}</p>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 bg-gradient-to-r ${tierInfo.color}/20 px-4 py-2 rounded-full border border-current/30`}>
                    <TierIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">
                      {tierInfo.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">Studio member since Jan 2024</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg transition-colors text-white">
                Edit Profile
              </button>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 border border-red-500 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 studio-card p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="studio-card p-6 rounded-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                      </div>
                      <div className={`p-4 ${stat.bg} rounded-xl`}>
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color.includes('purple') ? 'from-purple-500 to-indigo-500' : 
                          stat.color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                          stat.color.includes('green') ? 'from-green-500 to-emerald-500' :
                          'from-orange-500 to-red-500'} transition-all duration-1000`}
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="studio-card p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Activity className="w-6 h-6" />
                <span>Recent Studio Activity</span>
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-medium">{activity.action}</span> "{activity.item}"
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{activity.type}</span>
                        <span>•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-8">
            {/* Current Plan */}
            <div className={`studio-card p-8 rounded-2xl bg-gradient-to-r ${tierInfo.color}/10 border border-current/20`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <TierIcon className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-2xl font-bold text-white">{tierInfo.label}</h3>
                  </div>
                  <p className="text-gray-300 mb-2">
                    {subscription?.subscription_tier === 'studio' ? 'Complete studio suite with all professional features' :
                     subscription?.subscription_tier === 'pro' ? 'Professional tools with commercial rights' :
                     'Basic studio access for learning and exploration'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status: <span className="text-green-400">{subscription?.status || 'Active'}</span>
                  </p>
                  {userIsAdmin && (
                    <p className="text-red-400 font-medium mt-2 flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span>Administrator Access</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-white">
                    {subscription?.subscription_tier === 'studio' ? '$79' :
                     subscription?.subscription_tier === 'pro' ? '$29' :
                     'Free'}
                  </p>
                  {subscription?.subscription_tier !== 'free' && (
                    <p className="text-gray-400">per month</p>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Plans */}
            <PricingPlans />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Audio Settings */}
            <div className="studio-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Volume2 className="w-6 h-6" />
                <span>Audio Settings</span>
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Default Audio Format</label>
                  <select
                    value={audioFormat}
                    onChange={(e) => setAudioFormat(e.target.value)}
                    className="w-full md:w-64 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  >
                    <option value="wav">WAV (Uncompressed - Best Quality)</option>
                    <option value="mp3">MP3 (320kbps - Good Quality)</option>
                    <option value="flac">FLAC (Lossless - Archive Quality)</option>
                    <option value="m4a">M4A (AAC - Balanced)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Auto-download generated tracks</h4>
                    <p className="text-sm text-gray-400">Automatically download tracks after successful generation</p>
                  </div>
                  <button
                    onClick={() => setAutoDownload(!autoDownload)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${autoDownload ? 'bg-primary' : 'bg-gray-600'}
                    `}
                  >
                    <div className={`
                      absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                      ${autoDownload ? 'transform translate-x-6' : 'transform translate-x-0.5'}
                    `} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="studio-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Bell className="w-6 h-6" />
                <span>Notifications</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Email notifications</h4>
                    <p className="text-sm text-gray-400">Receive updates about your projects and account</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${notifications ? 'bg-primary' : 'bg-gray-600'}
                    `}
                  >
                    <div className={`
                      absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                      ${notifications ? 'transform translate-x-6' : 'transform translate-x-0.5'}
                    `} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="studio-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Shield className="w-6 h-6" />
                <span>Privacy & Security</span>
              </h3>
              <div className="space-y-4">
                <button className="w-full md:w-auto px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg transition-colors text-left text-white">
                  Change Password
                </button>
                <button className="w-full md:w-auto px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg transition-colors text-left text-white">
                  Two-Factor Authentication
                </button>
                <button className="w-full md:w-auto px-6 py-3 border border-red-500 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            {/* Storage Overview */}
            <div className="studio-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Storage Usage</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white">Used Storage</span>
                    <span className="text-gray-400">2.4 GB of {subscription?.subscription_tier === 'studio' ? '100 GB' : subscription?.subscription_tier === 'pro' ? '50 GB' : '10 GB'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6 border border-gray-600 rounded-lg bg-gray-800/50">
                    <Music className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <p className="font-medium text-white">AI Generated</p>
                    <p className="text-gray-400">847 MB</p>
                  </div>
                  <div className="text-center p-6 border border-gray-600 rounded-lg bg-gray-800/50">
                    <Download className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                    <p className="font-medium text-white">Downloads</p>
                    <p className="text-gray-400">1.2 GB</p>
                  </div>
                  <div className="text-center p-6 border border-gray-600 rounded-lg bg-gray-800/50">
                    <HardDrive className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <p className="font-medium text-white">Projects</p>
                    <p className="text-gray-400">356 MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Management */}
            <div className="studio-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Manage Storage</h3>
              <div className="space-y-4">
                <button className="w-full md:w-auto px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg transition-colors text-left text-white">
                  Clean Up Old Files
                </button>
                <button className="w-full md:w-auto px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg transition-colors text-left text-white">
                  Download All Projects
                </button>
                {subscription?.subscription_tier === 'free' && (
                  <button className="w-full md:w-auto px-6 py-3 studio-button">
                    Upgrade for More Storage
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;