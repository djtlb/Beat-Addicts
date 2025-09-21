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
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [audioFormat, setAudioFormat] = useState('wav');
  const { user, subscription, signOut } = useAuth();

  console.log('Profile component rendered');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'storage', label: 'Storage', icon: HardDrive }
  ];

  const userStats = [
    { label: 'Tracks Created', value: '47', icon: Music, color: 'text-purple-400' },
    { label: 'Hours Produced', value: '156', icon: Clock, color: 'text-blue-400' },
    { label: 'Total Downloads', value: '1.2K', icon: Download, color: 'text-green-400' },
    { label: 'Storage Used', value: '2.4 GB', icon: HardDrive, color: 'text-orange-400' }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Generated',
      item: 'Summer Vibes Beat',
      timestamp: '2 hours ago',
      type: 'AI Generate'
    },
    {
      id: 2,
      action: 'Downloaded',
      item: 'Rap Flow Demo',
      timestamp: '1 day ago',
      type: 'Lyrics Flow'
    },
    {
      id: 3,
      action: 'Created',
      item: 'Harmony Layers',
      timestamp: '3 days ago',
      type: 'AI Harmonies'
    },
    {
      id: 4,
      action: 'Processed',
      item: 'Instrumental Stems',
      timestamp: '1 week ago',
      type: 'Stem Splitter'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'studio': return 'from-purple-500 to-pink-500';
      case 'pro': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'studio': return 'Studio';
      case 'pro': return 'Pro';
      default: return 'Free';
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card p-8 rounded-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user?.email || 'User'}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`flex items-center space-x-1 bg-gradient-to-r ${getTierColor(subscription?.subscription_tier || 'free')}/20 px-3 py-1 rounded-full border border-current/30`}>
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium text-sm">
                    {getTierLabel(subscription?.subscription_tier || 'free')} Member
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">Member since Jan 2024</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2 border border-border hover:bg-white/5 rounded-lg transition-colors">
              Edit Profile
            </button>
            <button
              onClick={handleSignOut}
              className="px-6 py-2 border border-destructive text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
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
                <div key={index} className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <div className={`p-3 bg-white/10 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span> "{activity.item}"
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
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

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Audio Settings */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Audio Settings</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Audio Format</label>
                <select
                  value={audioFormat}
                  onChange={(e) => setAudioFormat(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="wav">WAV (Uncompressed)</option>
                  <option value="mp3">MP3 (320kbps)</option>
                  <option value="flac">FLAC (Lossless)</option>
                  <option value="m4a">M4A (AAC)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-download generated tracks</h4>
                  <p className="text-sm text-muted-foreground">Automatically download tracks after generation</p>
                </div>
                <button
                  onClick={() => setAutoDownload(!autoDownload)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${autoDownload ? 'bg-primary' : 'bg-muted'}
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
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates about your projects and account</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${notifications ? 'bg-primary' : 'bg-muted'}
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
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy & Security</span>
            </h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto px-4 py-2 border border-border hover:bg-white/5 rounded-lg transition-colors text-left">
                Change Password
              </button>
              <button className="w-full md:w-auto px-4 py-2 border border-border hover:bg-white/5 rounded-lg transition-colors text-left">
                Two-Factor Authentication
              </button>
              <button className="w-full md:w-auto px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className={`glass-card p-6 rounded-xl bg-gradient-to-r ${getTierColor(subscription?.subscription_tier || 'free')}/10 border border-current/20`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold">{getTierLabel(subscription?.subscription_tier || 'free')} Plan</h3>
                </div>
                <p className="text-muted-foreground">
                  {subscription?.subscription_tier === 'studio' ? 'Complete access to all premium features' :
                   subscription?.subscription_tier === 'pro' ? 'Advanced features and priority support' :
                   'Basic access with limited features'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Status: {subscription?.status || 'Active'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {subscription?.subscription_tier === 'studio' ? '$49.99' :
                   subscription?.subscription_tier === 'pro' ? '$29.99' :
                   'Free'}
                </p>
                {subscription?.subscription_tier !== 'free' && (
                  <p className="text-sm text-muted-foreground">per month</p>
                )}
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">AI music generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${subscription?.subscription_tier === 'free' ? 'bg-gray-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm">Premium flow styles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${subscription?.subscription_tier === 'free' ? 'bg-gray-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm">Advanced harmony styles</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${subscription?.subscription_tier === 'studio' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-sm">Priority processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${subscription?.subscription_tier !== 'free' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-sm">Extended cloud storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${subscription?.subscription_tier === 'studio' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-sm">24/7 premium support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Options */}
          {subscription?.subscription_tier !== 'studio' && (
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Upgrade Your Plan</span>
              </h3>
              <div className="space-y-4">
                {subscription?.subscription_tier !== 'pro' && (
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Upgrade to Pro - $29.99/month
                  </button>
                )}
                <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Upgrade to Studio - $49.99/month
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'storage' && (
        <div className="space-y-6">
          {/* Storage Overview */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Used Storage</span>
                  <span>2.4 GB of {subscription?.subscription_tier === 'studio' ? '100 GB' : subscription?.subscription_tier === 'pro' ? '50 GB' : '10 GB'}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 border border-border rounded-lg">
                  <Music className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="font-medium">AI Generated</p>
                  <p className="text-sm text-muted-foreground">847 MB</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <Download className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="font-medium">Downloads</p>
                  <p className="text-sm text-muted-foreground">1.2 GB</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="font-medium">Projects</p>
                  <p className="text-sm text-muted-foreground">356 MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Management */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Manage Storage</h3>
            <div className="space-y-3">
              <button className="w-full md:w-auto px-4 py-2 border border-border hover:bg-white/5 rounded-lg transition-colors text-left">
                Clean Up Old Files
              </button>
              <button className="w-full md:w-auto px-4 py-2 border border-border hover:bg-white/5 rounded-lg transition-colors text-left">
                Download All Projects
              </button>
              {subscription?.subscription_tier === 'free' && (
                <button className="w-full md:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                  Upgrade for More Storage
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;