import React from 'react';
import { Crown, Lock, Zap, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PremiumGateProps {
  requiredTier: 'pro' | 'studio';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
  featureName?: string;
}

const PremiumGate: React.FC<PremiumGateProps> = ({
  requiredTier,
  children,
  fallback,
  showUpgrade = true,
  featureName = 'This feature'
}) => {
  const { hasAccess, subscription, isAdmin } = useAuth();

  console.log('PremiumGate check:', { 
    requiredTier, 
    hasAccess: hasAccess(requiredTier), 
    userTier: subscription?.subscription_tier,
    isAdmin: isAdmin(),
    featureName
  });

  // Admin users always have full access
  if (isAdmin()) {
    return <>{children}</>;
  }

  // Check if user has proper access
  if (hasAccess(requiredTier)) {
    return <>{children}</>;
  }

  // User doesn't have access - show fallback or upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const tierLabels = {
    pro: 'Pro',
    studio: 'Studio'
  };

  const tierColors = {
    pro: 'from-blue-500 to-cyan-500',
    studio: 'from-purple-500 to-pink-500'
  };

  const tierIcons = {
    pro: Star,
    studio: Crown
  };

  const tierFeatures = {
    pro: [
      'Unlimited AI Generation', 
      'Commercial Rights', 
      'HD Audio Downloads', 
      'Priority Processing',
      'Voice Cloning',
      'Extended Track Length'
    ],
    studio: [
      'Everything in Pro', 
      'Advanced Neural Controls',
      'Custom Genre Creation', 
      'Multi-Track Stems', 
      'API Access', 
      'White-label Rights',
      'Premium Support'
    ]
  };

  const TierIcon = tierIcons[requiredTier];

  return (
    <div className="studio-glass-card p-6 rounded-xl border-2 border-dashed border-primary/30 relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tierColors[requiredTier]} opacity-5`}></div>
      
      <div className="relative z-10 text-center space-y-4">
        <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${tierColors[requiredTier]} rounded-full flex items-center justify-center shadow-2xl`}>
          <Lock className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-raver mb-2 flex items-center justify-center space-x-2 underground-text-glow">
            <TierIcon className="w-5 h-5 text-yellow-400" />
            <span>{tierLabels[requiredTier]} Feature Locked</span>
          </h3>
          <p className="text-gray-300 mb-4 font-underground">
            {featureName} requires {tierLabels[requiredTier]} subscription access.
          </p>
          
          <div className="text-left mb-4 max-w-sm mx-auto">
            <p className="text-sm font-raver text-white mb-2">Unlock with {tierLabels[requiredTier]}:</p>
            <ul className="space-y-1">
              {tierFeatures[requiredTier].slice(0, 4).map((feature, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center space-x-2 font-underground">
                  <span className="text-cyan-400">•</span>
                  <span>{feature}</span>
                </li>
              ))}
              {tierFeatures[requiredTier].length > 4 && (
                <li className="text-xs text-gray-400 font-underground">
                  + {tierFeatures[requiredTier].length - 4} more features...
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <button 
          className={`px-6 py-3 bg-gradient-to-r ${tierColors[requiredTier]} text-white rounded-xl font-raver hover:opacity-90 transition-opacity underground-glow shadow-2xl`}
          onClick={() => {
            console.log(`Upgrade to ${requiredTier} clicked for feature: ${featureName}`);
            // TODO: Implement actual upgrade flow
            alert(`Upgrade to ${tierLabels[requiredTier]} to unlock ${featureName}!`);
          }}
        >
          <span className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Upgrade to {tierLabels[requiredTier]}</span>
          </span>
        </button>
        
        <p className="text-xs text-gray-500 font-underground">
          Current plan: {subscription?.subscription_tier?.toUpperCase() || 'FREE'}
        </p>
      </div>
    </div>
  );
};

export default PremiumGate;