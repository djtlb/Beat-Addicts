import React, { useState } from 'react';
import { Play, Eye, Wand2, Settings, Crown, Sparkles } from 'lucide-react';
import InteractiveDemo from './InteractiveDemo';
import StudioTour from './StudioTour';

interface DemoLauncherProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DemoLauncher: React.FC<DemoLauncherProps> = ({ 
  position = 'bottom-right', 
  showLabels = true,
  size = 'md'
}) => {
  const [showDemo, setShowDemo] = useState(false);
  const [showTour, setShowTour] = useState(false);

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

  return (
    <>
      <div className={`fixed ${positionClasses[position]} z-40 flex flex-col space-y-4`}>
        {/* Interactive Demo Button */}
        <div className="relative group">
          <button
            onClick={() => setShowDemo(true)}
            className={`${sizeClasses[size]} bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center`}
          >
            <Play className={`${iconSizeClasses[size]} group-hover:animate-pulse`} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Eye className="w-3 h-3 text-white animate-pulse" />
            </div>
          </button>
          
          {showLabels && (
            <div className={`absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`}>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border border-purple-500/30">
                <div className="font-raver text-cyan-400 mb-1">Interactive Demo</div>
                <div className="text-xs text-gray-400">Watch features in action</div>
              </div>
            </div>
          )}
        </div>

        {/* Studio Tour Button */}
        <div className="relative group">
          <button
            onClick={() => setShowTour(true)}
            className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center`}
          >
            <Settings className={`${iconSizeClasses[size]} group-hover:animate-spin`} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Wand2 className="w-3 h-3 text-white animate-pulse" />
            </div>
          </button>
          
          {showLabels && (
            <div className={`absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`}>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border border-purple-500/30">
                <div className="font-raver text-purple-400 mb-1">Studio Tour</div>
                <div className="text-xs text-gray-400">Learn all features</div>
              </div>
            </div>
          )}
        </div>

        {/* Marketing Badge */}
        <div className="relative group">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-raver shadow-lg animate-pulse">
            <Crown className="w-3 h-3 inline mr-1" />
            NEW
          </div>
          
          {showLabels && (
            <div className={`absolute ${position.includes('right') ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`}>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border border-yellow-500/30">
                <div className="font-raver text-yellow-400 mb-1">Marketing Content</div>
                <div className="text-xs text-gray-400">See what's possible</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Components */}
      {showDemo && <InteractiveDemo />}
      {showTour && (
        <StudioTour 
          isOpen={showTour} 
          onClose={() => setShowTour(false)} 
        />
      )}
    </>
  );
};

export default DemoLauncher;