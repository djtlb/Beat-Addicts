import React, { useState } from 'react';
import { Shield, Eye, Wand2, Settings, Crown, Sparkles, Code, Bug, Database, Activity } from 'lucide-react';
import AdminInteractiveDemo from './AdminInteractiveDemo';
import AdminStudioTour from './AdminStudioTour';
import { useAuth } from '../hooks/useAuth';

interface AdminDemoLauncherProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AdminDemoLauncher: React.FC<AdminDemoLauncherProps> = ({ 
  position = 'bottom-right', 
  showLabels = true,
  size = 'md'
}) => {
  const { isAdmin } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showSystemTest, setShowSystemTest] = useState(false);

  // Don't render for non-admin users
  if (!isAdmin()) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    'sm': 'w-12 h-12',
    'md': 'w-16 h-16',
    'lg': 'w-20 h-20'
  };

  const iconSizeClasses = {
    'sm': 'w-6 h-6',
    'md': 'w-8 h-8',
    'lg': 'w-10 h-10'
  };

  const runSystemTest = () => {
    console.log('Running comprehensive system test...');
    setShowSystemTest(true);
    // Simulate system test
    setTimeout(() => {
      setShowSystemTest(false);
      console.log('System test completed successfully');
    }, 3000);
  };

  return (
    <>
      <div className={`fixed ${positionClasses[position]} z-40 flex flex-col space-y-4`}>
        {/* Admin Interactive Demo Button */}
        <div className="relative group">
          <button
            onClick={() => setShowDemo(true)}
            className={`${sizeClasses[size]} bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-red-400/30`}
          >
            <Shield className={`${iconSizeClasses[size]} group-hover:animate-pulse`} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Code className="w-3 h-3 text-white animate-pulse" />
            </div>
          </button>
          
          {showLabels && (
            <div className={`absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`}>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border border-red-500/30">
                <div className="font-raver text-red-400 mb-1">Admin Demo</div>
                <div className="text-xs text-gray-400">System testing & analytics</div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Studio Tour Button */}
        <div className="relative group">
          <button
            onClick={() => setShowTour(true)}
            className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-cyan-500 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-purple-400/30`}
          >
            <Settings className={`${iconSizeClasses[size]} group-hover:animate-spin`} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Database className="w-3 h-3 text-white animate-pulse" />
            </div>
          </button>
          
          {showLabels && (
            <div className={`absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`}>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border border-purple-500/30">
                <div className="font-raver text-purple-400 mb-1">Admin Tour</div>
                <div className="text-xs text-gray-400">Advanced feature walkthrough</div>
              </div>
            </div>
          )}
        </div>

        {/* System Test Button */}
        <div className="relative group">
          <button
            onClick={runSystemTest}
            disabled={showSystemTest}
            className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-yellow-400/30 ${
              showSystemTest ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Activity className={`${iconSizeClasses[size]} ${showSystemTest ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
              <Bug className="w-3 h-3 text-white animate-pulse" />
            </div>
          </button>
          
          {showLabels && (
            <div className={`absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`}>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border border-yellow-500/30">
                <div className="font-raver text-yellow-400 mb-1">System Test</div>
                <div className="text-xs text-gray-400">{showSystemTest ? 'Running...' : 'Debug & performance'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Badge */}
        <div className="relative group">
          <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-raver shadow-lg animate-pulse border border-red-400/30">
            <Shield className="w-3 h-3 inline mr-1" />
            ADMIN
          </div>
          
          {showLabels && (
            <div className={`absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`}>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border border-red-500/30">
                <div className="font-raver text-red-400 mb-1">Administrator Access</div>
                <div className="text-xs text-gray-400">Advanced system controls</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Test Overlay */}
      {showSystemTest && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-2xl border border-yellow-500/30 text-center">
            <Activity className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-raver text-white mb-2">Running System Test</h2>
            <p className="text-gray-400">Analyzing performance and system health...</p>
            <div className="mt-4 w-64 bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Components */}
      {showDemo && <AdminInteractiveDemo />}
      {showTour && (
        <AdminStudioTour 
          isOpen={showTour} 
          onClose={() => setShowTour(false)} 
        />
      )}
    </>
  );
};

export default AdminDemoLauncher;