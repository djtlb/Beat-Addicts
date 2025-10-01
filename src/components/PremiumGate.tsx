import React from 'react';
import { Crown, Lock, Zap, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  requiredTier?: 'pro' | 'studio';
  fallback?: React.ReactNode;
}

const PremiumGate: React.FC<PremiumGateProps> = ({
  children,
  feature,
  requiredTier = 'studio',
  fallback
}) => {
  const { user, subscription, isAdmin } = useAuth();

  console.log('🚪 Premium Gate Check:', {
    feature,
    requiredTier,
    userTier: subscription?.subscription_tier,
    isAdmin: isAdmin?.(),
    hasAccess: hasAccess()
  });

  function hasAccess(): boolean {
    // Admin always has access
    if (isAdmin && isAdmin()) {
      console.log('👑 Admin access granted for', feature);
      return true;
    }

    // Check subscription tier
    if (!subscription?.subscription_tier) {
      console.log('❌ No subscription tier found');
      return false;
    }

    const userTier = subscription.subscription_tier;
    
    // Studio tier has access to everything
    if (userTier === 'studio') {
      console.log('🎛️ Studio tier access granted for', feature);
      return true;
    }

    // Pro tier has access to pro and below features
    if (requiredTier === 'pro' && userTier === 'pro') {
      console.log('💎 Pro tier access granted for', feature);
      return true;
    }

    console.log('🔒 Access denied for', feature, '- requires', requiredTier, 'but user has', userTier);
    return false;
  }

  if (hasAccess()) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            {feature} Access Required
          </h2>
          
          <p className="text-gray-300 mb-6">
            This feature requires a {requiredTier === 'studio' ? 'Studio' : 'Pro'} subscription to access.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-left space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-300">Professional audio tools</span>
            </div>
            <div className="flex items-center text-left space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-300">Advanced AI generation</span>
            </div>
            <div className="flex items-center text-left space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-300">Premium sample library</span>
            </div>
            {requiredTier === 'studio' && (
              <div className="flex items-center text-left space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-300">Full Studio access</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => window.location.href = '/pricing'}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade to {requiredTier === 'studio' ? 'Studio' : 'Pro'}</span>
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Current plan: {subscription?.subscription_tier || 'Free'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;