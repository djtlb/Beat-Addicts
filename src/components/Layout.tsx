import {
    Crown,
    Folder,
    LogOut,
    Menu,
    Mic,
    Music,
    Scissors,
    Shield,
    User,
    Wand2,
    Waves,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, subscription, signOut, isAdmin } = useAuth();

  console.log('Layout component rendered, current path:', location.pathname, 'subscription:', subscription, 'isAdmin:', isAdmin());

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Music },
    { name: 'AI Generate', href: '/generate', icon: Wand2 },
    { name: 'DnB Demo', href: '/demo-dnb', icon: Music, demo: true },
    { name: 'Stem Splitter', href: '/stem-splitter', icon: Scissors },
    { name: 'Lyrics Flow', href: '/lyrics-flow', icon: Mic },
    { name: 'Harmonies', href: '/harmonies', icon: Waves },
    { name: 'Library', href: '/library', icon: Folder },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const getTierColor = (tier: string, admin: boolean = false) => {
    if (admin) return 'text-red-400';
    switch (tier) {
      case 'studio': return 'text-purple-400';
      case 'pro': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTierLabel = (tier: string, admin: boolean = false) => {
    if (admin) return 'Admin';
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

  const userIsAdmin = isAdmin();
  const displayTier = subscription?.subscription_tier || 'free';

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur-sm border-r border-border
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-electric-500 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Beat Addicts AI</span>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-accent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Status */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <div className="flex items-center space-x-1">
                  {userIsAdmin ? (
                    <Shield className="w-3 h-3 text-red-400" />
                  ) : (
                    <Crown className="w-3 h-3 text-yellow-400" />
                  )}
                  <span className={`text-xs ${getTierColor(displayTier, userIsAdmin)}`}>
                    {getTierLabel(displayTier, userIsAdmin)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg premium-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>© 2024 Beat Addicts AI</p>
              <p>Powered by advanced AI</p>
              {userIsAdmin && (
                <p className="text-red-400 font-medium mt-1">🛡️ Administrator Access</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-accent"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-electric-500 rounded-md flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient">Beat Addicts AI</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
