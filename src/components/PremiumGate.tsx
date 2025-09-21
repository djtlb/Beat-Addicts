import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PremiumGateProps {
  requiredTier: 'pro' | 'studio';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

const PremiumGate: React.FC<PremiumGateProps> = ({
  requiredTier,
  children,
  fallback,
  showUpgrade = true
}) => {
  const { hasAccess, subscription } = useAuth();

  console.log('PremiumGate check:', { requiredTier, hasAccess: hasAccess(requiredTier), userTier: subscription?.subscription_tier });

  if (hasAccess(requiredTier)) {
    return <>{children}</>;
  }

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

  return (
    <div className="glass-card p-6 rounded-xl border-2 border-dashed border-primary/30">
      <div className="text-center space-y-4">
        <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${tierColors[requiredTier]} rounded-full flex items-center justify-center`}>
          <Lock className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span>{tierLabels[requiredTier]} Feature</span>
          </h3>
          <p className="text-muted-foreground mb-4">
            This feature is exclusive to {tierLabels[requiredTier]} subscribers.
          </p>
        </div>
        
        <button 
          className={`px-6 py-3 bg-gradient-to-r ${tierColors[requiredTier]} text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}
          onClick={() => console.log(`Upgrade to ${requiredTier} clicked`)}
        >
          Upgrade to {tierLabels[requiredTier]}
        </button>
      </div>
    </div>
  );
};

export default PremiumGate;